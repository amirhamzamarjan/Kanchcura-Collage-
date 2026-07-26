const { Op } = require('sequelize');
const { Student, Teacher, Payment, Attendance, Result, Notice, User, Class, Department } = require('../models');

exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.status(400).json({ success: false, message: 'Minimum 2 characters.' });

    const results = {};

    const students = await Student.findAll({
      where: {
        [Op.or]: [
          { full_name: { [Op.like]: `%${q}%` } },
          { student_id: { [Op.like]: `%${q}%` } },
          { phone: { [Op.like]: `%${q}%` } },
        ],
      },
      limit: 5,
      include: [{ model: Class, as: 'class', attributes: ['name'] }],
    });
    if (students.length > 0) results.students = students;

    const teachers = await Teacher.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { employee_id: { [Op.like]: `%${q}%` } },
          { phone: { [Op.like]: `%${q}%` } },
        ],
      },
      limit: 5,
    });
    if (teachers.length > 0) results.teachers = teachers;

    const payments = await Payment.findAll({
      where: {
        [Op.or]: [
          { receipt_number: { [Op.like]: `%${q}%` } },
          { invoice_number: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [{ model: Student, as: 'student', attributes: ['full_name', 'student_id'] }],
      limit: 5,
    });
    if (payments.length > 0) results.payments = payments;

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
