const { Admission, Student, Department, Class, Group } = require('../models');
const { paginateResponse } = require('../middleware/pagination');
const { logAction } = require('../middleware/audit');

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, session, department_id, class_id, shift } = req.query;
    const where = {};
    if (status) where.status = status;
    if (session) where.session = session;
    if (department_id) where.department_id = department_id;
    if (class_id) where.class_id = class_id;
    if (shift) where.shift = shift;

    const offset = (page - 1) * limit;
    const { rows, count } = await Admission.findAndCountAll({
      where,
      include: [
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: Class, as: 'class', attributes: ['id', 'name'] },
        { model: Group, as: 'group', attributes: ['id', 'name'] },
      ],
      limit: parseInt(limit), offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, ...paginateResponse(rows, count, req) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const admission = await Admission.findByPk(req.params.id);
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found.' });

    await admission.update({ is_approved: true, status: 'approved', approved_by: req.userId });
    await logAction(req.userId, 'ADMISSION_APPROVE', 'admission', admission.id, `Approved admission: ${admission.admission_no}`, req);
    res.json({ success: true, message: 'Admission approved.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reject = async (req, res) => {
  try {
    const admission = await Admission.findByPk(req.params.id);
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found.' });
    await admission.update({ status: 'rejected', approved_by: req.userId, remarks: req.body.remarks });
    res.json({ success: true, message: 'Admission rejected.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const total = await Admission.count();
    const approved = await Admission.count({ where: { status: 'approved' } });
    const pending = await Admission.count({ where: { status: 'pending' } });
    const rejected = await Admission.count({ where: { status: 'rejected' } });
    res.json({ success: true, data: { total, approved, pending, rejected } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
