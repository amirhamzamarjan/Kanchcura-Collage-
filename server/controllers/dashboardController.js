const { Op, fn, col, literal } = require('sequelize');
const { Student, Teacher, Department, Class, Payment, Attendance, Result, User, Notice } = require('../models');
const { sequelize } = require('../config/database');

exports.dashboard = async (req, res) => {
  try {
    const user = req.user;
    const role = user.role;

    let data = {};

    // Super Admin / Principal / Admin see everything
    if (['super-admin', 'principal', 'admin'].includes(role)) {
      const totalStudents = await Student.count();
      const activeStudents = await Student.count({ where: { status: 'active' } });
      const totalTeachers = await Teacher.count({ where: { is_active: true } });
      const totalDepartments = await Department.count();
      const totalClasses = await Class.count();

      // Finance summary
      const totalCollectedResult = await Payment.findOne({
        attributes: [[fn('COALESCE', fn('SUM', col('paid_amount')), 0), 'total']],
        where: { status: { [Op.ne]: 'cancelled' } },
      });
      const totalCollected = parseFloat(totalCollectedResult.get('total')) || 0;

      // Current month collection
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const monthCollection = await Payment.findOne({
        attributes: [[fn('COALESCE', fn('SUM', col('paid_amount')), 0), 'total']],
        where: { payment_date: { [Op.gte]: startOfMonth.toISOString().split('T')[0] }, status: { [Op.ne]: 'cancelled' } },
      });

      // Due amount
      const totalDue = await Payment.findOne({
        attributes: [[fn('COALESCE', fn('SUM', col('due_amount')), 0), 'total']],
        where: { status: { [Op.in]: ['partial', 'unpaid'] } },
      });

      // Today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = await Attendance.findAll({
        where: { date: today },
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status'],
      });

      // Recent admissions
      const recentAdmissions = await Student.findAll({
        order: [['created_at', 'DESC']], limit: 5,
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      });

      // Recent payments
      const recentPayments = await Payment.findAll({
        where: { status: 'paid' },
        order: [['created_at', 'DESC']], limit: 5,
        include: [{ model: Student, as: 'student', attributes: ['full_name', 'student_id'] }],
      });

      // Recent notices
      const recentNotices = await Notice.findAll({
        where: { is_active: true },
        order: [['is_pinned', 'DESC'], ['created_at', 'DESC']], limit: 5,
      });

      data = {
        total_students: totalStudents,
        active_students: activeStudents,
        total_teachers: totalTeachers,
        total_departments: totalDepartments,
        total_classes: totalClasses,
        total_collected: totalCollected,
        monthly_collection: parseFloat(monthCollection.get('total')) || 0,
        total_due: parseFloat(totalDue.get('total')) || 0,
        today_attendance: todayAttendance,
        recent_admissions: recentAdmissions,
        recent_payments: recentPayments,
        recent_notices: recentNotices,
      };
    } else if (role === 'accounts') {
      const startOfMonth = new Date(); startOfMonth.setDate(1);
      const todayCollection = await Payment.findOne({
        attributes: [[fn('COALESCE', fn('SUM', col('paid_amount')), 0), 'total']],
        where: { payment_date: new Date().toISOString().split('T')[0], status: 'paid' },
      });
      const monthCollection = await Payment.findOne({
        attributes: [[fn('COALESCE', fn('SUM', col('paid_amount')), 0), 'total']],
        where: { payment_date: { [Op.gte]: startOfMonth.toISOString().split('T')[0] }, status: 'paid' },
      });
      const pendingDue = await Payment.findOne({
        attributes: [[fn('COALESCE', fn('SUM', col('due_amount')), 0), 'total']],
        where: { status: { [Op.in]: ['partial', 'unpaid'] } },
      });
      data = { today_collection: parseFloat(todayCollection.get('total')) || 0, monthly_collection: parseFloat(monthCollection.get('total')) || 0, pending_due: parseFloat(pendingDue.get('total')) || 0 };
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recentActivities = async (req, res) => {
  try {
    const activities = [];
    const recentStudents = await Student.findAll({ order: [['created_at', 'DESC']], limit: 3 });
    recentStudents.forEach(s => activities.push({ type: 'student', text: `New admission: ${s.full_name}`, time: s.created_at }));

    const recentPayments = await Payment.findAll({ where: { status: 'paid' }, order: [['created_at', 'DESC']], limit: 3 });
    recentPayments.forEach(p => activities.push({ type: 'payment', text: `Payment: ৳${p.paid_amount}`, time: p.created_at }));

    const recentResults = await Result.findAll({ where: { is_published: true }, order: [['published_at', 'DESC']], limit: 3 });
    recentResults.forEach(r => activities.push({ type: 'result', text: `Results published`, time: r.published_at }));

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.chartData = async (req, res) => {
  try {
    const { type = 'collection', period = 'monthly' } = req.query;

    if (type === 'collection') {
      const monthlyData = await Payment.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('payment_date'), '%Y-%m'), 'month'],
          [fn('SUM', col('paid_amount')), 'total'],
        ],
        where: { status: 'paid' },
        group: [literal("DATE_FORMAT(payment_date, '%Y-%m')")],
        order: [[literal("DATE_FORMAT(payment_date, '%Y-%m')"), 'ASC']],
        limit: 12,
      });
      res.json({ success: true, data: monthlyData });
    } else if (type === 'attendance') {
      const monthly = await Attendance.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('date'), '%Y-%m'), 'month'],
          [fn('COUNT', col('id')), 'total'],
        ],
        group: [literal("DATE_FORMAT(date, '%Y-%m')")],
        order: [[literal("DATE_FORMAT(date, '%Y-%m')"), 'ASC']],
        limit: 12,
      });
      res.json({ success: true, data: monthly });
    } else if (type === 'department') {
      const deptData = await Student.findAll({
        attributes: ['department_id', [fn('COUNT', col('id')), 'count']],
        group: ['department_id'],
        include: [{ model: Department, as: 'department', attributes: ['name'] }],
      });
      res.json({ success: true, data: deptData });
    }

    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
