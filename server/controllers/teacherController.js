const { Op } = require('sequelize');
const { Teacher, Subject, User } = require('../models');
const { paginateResponse } = require('../middleware/pagination');
const { logAction } = require('../middleware/audit');
const bcrypt = require('bcryptjs');
const { bcryptSaltRounds } = require('../config/auth');

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, subject_id, is_active } = req.query;
    const where = {};
    if (subject_id) where.subject_id = subject_id;
    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { employee_id: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Teacher.findAndCountAll({
      where, include: [{ model: Subject, as: 'subject', attributes: ['id', 'name'] }],
      limit: parseInt(limit), offset: parseInt(offset), order: [['created_at', 'DESC']],
    });
    res.json({ success: true, ...paginateResponse(rows, count, req) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.get = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id, { include: [{ model: Subject, as: 'subject' }] });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });
    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, subject_id, qualification, phone, email, joining_date, assigned_classes } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required.' });

    const count = await Teacher.count();
    const employee_id = `TCH-${String(count + 1).padStart(3, '0')}`;

    const teacher = await Teacher.create({ name, employee_id, subject_id, qualification, phone, email, joining_date });

    // Create user account if email provided
    if (email) {
      const userExists = await User.findOne({ where: { email } });
      if (!userExists) {
        const defaultPassword = 'teacher123';
        await User.create({
          name, email, password: await bcrypt.hash(defaultPassword, bcryptSaltRounds),
          role: 'teacher', phone, employee_id,
          avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        });
      }
    }

    await logAction(req.userId, 'TEACHER_CREATE', 'teacher', teacher.id, `Created teacher: ${name}`, req);
    res.status(201).json({ success: true, message: 'Teacher created.', data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });

    const allowed = ['name', 'subject_id', 'qualification', 'phone', 'email', 'joining_date', 'assigned_classes', 'is_active'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    await Teacher.update(updates, { where: { id: req.params.id } });
    const updated = await Teacher.findByPk(req.params.id, { include: [{ model: Subject, as: 'subject' }] });
    res.json({ success: true, message: 'Teacher updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });
    await Teacher.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Teacher deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
