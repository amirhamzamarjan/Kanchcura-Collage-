const { Op } = require('sequelize');
const { Attendance, Student, Class, Section, User } = require('../models');
const { paginateResponse } = require('../middleware/pagination');
const { logAction } = require('../middleware/audit');

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 20, date, class_id, section_id, student_id, status, month, year } = req.query;
    const where = {};
    if (date) where.date = date;
    if (class_id) where.class_id = class_id;
    if (section_id) where.section_id = section_id;
    if (student_id) where.student_id = student_id;
    if (status) where.status = status;
    if (month) {
      where.date = { [Op.and]: [
        sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
        year ? sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year) : undefined,
      ].filter(Boolean) };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await Attendance.findAndCountAll({
      where,
      include: [{ model: Student, as: 'student', attributes: ['id', 'student_id', 'full_name', 'roll_number'] }],
      limit: parseInt(limit), offset: parseInt(offset), order: [['date', 'DESC'], ['created_at', 'DESC']],
    });
    res.json({ success: true, ...paginateResponse(rows, count, req) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'Attendance records required.' });
    }

    let created = 0, updated = 0;
    for (const record of records) {
      const { student_id, date, status, class_id, section_id, remarks } = record;
      if (!student_id || !date || !status) continue;

      const existing = await Attendance.findOne({ where: { student_id, date } });
      if (existing) {
        await existing.update({ status, remarks, marked_by: req.userId });
        updated++;
      } else {
        await Attendance.create({ student_id, date, status, class_id, section_id, marked_by: req.userId, remarks });
        created++;
      }
    }

    await logAction(req.userId, 'ATTENDANCE_MARK', 'attendance', null, `Marked attendance: ${created} new, ${updated} updated`, req);
    res.json({ success: true, message: `${created} new, ${updated} updated attendance records.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markSingle = async (req, res) => {
  try {
    const { student_id, date, status, class_id, section_id, remarks } = req.body;
    if (!student_id || !date || !status) {
      return res.status(400).json({ success: false, message: 'Student ID, date, and status required.' });
    }

    const existing = await Attendance.findOne({ where: { student_id, date } });
    if (existing) {
      await existing.update({ status, remarks, marked_by: req.userId });
    } else {
      await Attendance.create({ student_id, date, status, class_id, section_id, marked_by: req.userId, remarks });
    }

    res.json({ success: true, message: 'Attendance marked.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.summary = async (req, res) => {
  try {
    const { class_id, section_id, month, year } = req.query;
    const targetMonth = month || (new Date().getMonth() + 1).toString();
    const targetYear = year || new Date().getFullYear().toString();

    const where = {
      [Op.and]: [
        sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), targetMonth),
        sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), targetYear),
      ],
    };
    if (class_id) where.class_id = class_id;
    if (section_id) where.section_id = section_id;

    const records = await Attendance.findAll({
      where,
      include: [{ model: Student, as: 'student', attributes: ['id', 'student_id', 'full_name', 'roll_number'] }],
    });

    const summary = {};
    for (const r of records) {
      if (!summary[r.student_id]) {
        summary[r.student_id] = { student: r.student, present: 0, absent: 0, late: 0, leave: 0, total: 0 };
      }
      summary[r.student_id][r.status]++;
      summary[r.student_id].total++;
    }

    const result = Object.values(summary).map(s => ({
      ...s,
      percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const { sequelize } = require('../config/database');
