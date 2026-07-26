const { Op, fn, col } = require('sequelize');
const { Payment, Student, Attendance, Result, User, Class, Department, sequelize } = require('../models');

exports.dailyCollection = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const payments = await Payment.findAll({
      where: { payment_date: targetDate, status: { [Op.ne]: 'cancelled' } },
      include: [{ model: Student, as: 'student', attributes: ['full_name', 'student_id'] }, { model: User, as: 'collectedBy', attributes: ['name'] }],
    });

    const total = payments.reduce((s, p) => s + parseFloat(p.paid_amount), 0);
    const byType = {};
    for (const p of payments) {
      byType[p.fee_type] = (byType[p.fee_type] || 0) + parseFloat(p.paid_amount);
    }

    res.json({ success: true, data: { date: targetDate, total_collection: total, total_transactions: payments.length, by_fee_type: byType, payments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.monthlyCollection = async (req, res) => {
  try {
    const { month, year } = req.query;
    const targetMonth = month || (new Date().getMonth() + 1).toString();
    const targetYear = year || new Date().getFullYear().toString();

    const payments = await Payment.findAll({
      where: {
        [Op.and]: [
          sequelize.where(fn('MONTH', col('payment_date')), targetMonth),
          sequelize.where(fn('YEAR', col('payment_date')), targetYear),
        ],
        status: { [Op.ne]: 'cancelled' },
      },
      include: [{ model: Student, as: 'student' }, { model: User, as: 'collectedBy', attributes: ['name'] }],
    });

    const total = payments.reduce((s, p) => s + parseFloat(p.paid_amount), 0);
    const daily = {};
    for (const p of payments) {
      daily[p.payment_date] = (daily[p.payment_date] || 0) + parseFloat(p.paid_amount);
    }

    res.json({ success: true, data: { month: targetMonth, year: targetYear, total_collection: total, total_transactions: payments.length, daily_breakdown: daily, payments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.studentReport = async (req, res) => {
  try {
    const { department_id, class_id, session } = req.query;
    const where = {};
    if (department_id) where.department_id = department_id;
    if (class_id) where.class_id = class_id;
    if (session) where.session = session;

    const students = await Student.findAll({
      where,
      include: [
        { model: Department, as: 'department', attributes: ['name'] },
        { model: Class, as: 'class', attributes: ['name'] },
      ],
    });

    const byDept = {}; const byGender = {};
    for (const s of students) {
      const dept = s.department?.name || 'N/A';
      byDept[dept] = (byDept[dept] || 0) + 1;
      byGender[s.gender || 'Other'] = (byGender[s.gender || 'Other'] || 0) + 1;
    }

    res.json({ success: true, data: { total: students.length, by_department: byDept, by_gender: byGender, students } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.attendanceReport = async (req, res) => {
  try {
    const { class_id, section_id, month, year } = req.query;
    const targetMonth = month || (new Date().getMonth() + 1).toString();
    const targetYear = year || new Date().getFullYear().toString();

    const where = {
      [Op.and]: [
        sequelize.where(fn('MONTH', col('date')), targetMonth),
        sequelize.where(fn('YEAR', col('date')), targetYear),
      ],
    };
    if (class_id) where.class_id = class_id;
    if (section_id) where.section_id = section_id;

    const records = await Attendance.findAll({
      where,
      include: [{ model: Student, as: 'student', attributes: ['student_id', 'full_name', 'roll_number'] }],
    });

    const summary = { present: 0, absent: 0, late: 0, leave: 0, total: records.length };
    for (const r of records) summary[r.status]++;

    const studentWise = {};
    for (const r of records) {
      if (!studentWise[r.student_id]) {
        studentWise[r.student_id] = { student: r.student, present: 0, absent: 0, late: 0, leave: 0, total: 0 };
      }
      studentWise[r.student_id][r.status]++;
      studentWise[r.student_id].total++;
    }

    const resultData = Object.values(studentWise).map(s => ({
      ...s, percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
    }));

    res.json({ success: true, data: { summary, student_wise: resultData } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resultReport = async (req, res) => {
  try {
    const { exam_type, class_id, is_published } = req.query;
    const where = {};
    if (exam_type) where.exam_type = exam_type;
    if (is_published !== undefined) where.is_published = is_published === 'true';

    const results = await Result.findAll({
      where, include: [
        { model: Student, as: 'student', attributes: ['student_id', 'full_name', 'roll_number'] },
        { model: User, as: 'subject', attributes: ['name'] },
      ],
    });

    const gradeDist = {};
    for (const r of results) {
      gradeDist[r.grade] = (gradeDist[r.grade] || 0) + 1;
    }

    res.json({ success: true, data: { total: results.length, grade_distribution: gradeDist, results } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
