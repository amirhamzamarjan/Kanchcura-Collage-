const { Backup, User } = require('../models');
const { logAction } = require('../middleware/audit');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

exports.list = async (req, res) => {
  try {
    const backups = await Backup.findAll({
      include: [{ model: User, as: 'createdBy', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: backups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `kanchkura-backup-${timestamp}.json`;
    const filepath = path.join(backupDir, filename);

    const { sequelize } = require('../config/database');
    const tables = ['users', 'students', 'teachers', 'departments', 'groups', 'sections', 'classes', 'subjects',
      'student_subjects', 'admissions', 'attendance', 'fees', 'payments', 'receipts', 'results', 'notices',
      'notifications', 'audit_logs', 'settings', 'backups'];

    const data = {};
    for (const table of tables) {
      const [rows] = await sequelize.query(`SELECT * FROM ${table} WHERE deleted_at IS NULL`);
      data[table] = rows;
    }

    data._meta = { created_at: new Date().toISOString(), version: '1.0.0', name: 'kanchkura-erp-backup' };

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    const stats = fs.statSync(filepath);

    const backup = await Backup.create({
      filename, file_path: filepath, file_size: stats.size,
      type: req.body.type || 'manual', status: 'completed', created_by: req.userId,
      notes: req.body.notes || 'Manual backup',
    });

    await logAction(req.userId, 'BACKUP_CREATE', 'backup', backup.id, `Created backup: ${filename}`, req);
    res.status(201).json({ success: true, message: 'Backup created.', data: backup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.restore = async (req, res) => {
  try {
    const { id } = req.params;
    const backup = await Backup.findByPk(id);
    if (!backup) return res.status(404).json({ success: false, message: 'Backup not found.' });

    if (!fs.existsSync(backup.file_path)) {
      return res.status(404).json({ success: false, message: 'Backup file not found.' });
    }

    const data = JSON.parse(fs.readFileSync(backup.file_path, 'utf8'));
    const { sequelize } = require('../config/database');
    const orderedTables = ['departments', 'classes', 'sections', 'groups', 'subjects', 'users', 'students',
      'teachers', 'student_subjects', 'admissions', 'fees', 'settings'];

    for (const table of orderedTables) {
      if (data[table] && data[table].length > 0) {
        await sequelize.query(`DELETE FROM ${table}`);
        for (const row of data[table]) {
          const columns = Object.keys(row).join(', ');
          const placeholders = Object.keys(row).map(() => '?').join(', ');
          const values = Object.values(row);
          await sequelize.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, { replacements: values });
        }
      }
    }

    await backup.update({ status: 'restored' });
    await logAction(req.userId, 'BACKUP_RESTORE', 'backup', backup.id, `Restored from backup: ${backup.filename}`, req);
    res.json({ success: true, message: 'Backup restored successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.download = async (req, res) => {
  try {
    const backup = await Backup.findByPk(req.params.id);
    if (!backup) return res.status(404).json({ success: false, message: 'Backup not found.' });
    if (!fs.existsSync(backup.file_path)) return res.status(404).json({ success: false, message: 'File not found.' });
    res.download(backup.file_path, backup.filename);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const backup = await Backup.findByPk(req.params.id);
    if (!backup) return res.status(404).json({ success: false, message: 'Backup not found.' });
    if (fs.existsSync(backup.file_path)) fs.unlinkSync(backup.file_path);
    await Backup.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Backup deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
