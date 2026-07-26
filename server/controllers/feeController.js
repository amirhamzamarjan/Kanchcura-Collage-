const { Fee, Class } = require('../models');
const { logAction } = require('../middleware/audit');

exports.list = async (req, res) => {
  try {
    const fees = await Fee.findAll({
      include: [{ model: Class, as: 'class', attributes: ['id', 'name', 'numeric_value'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getByClass = async (req, res) => {
  try {
    const fee = await Fee.findOne({
      where: { class_id: req.params.classId },
      include: [{ model: Class, as: 'class' }],
    });
    if (!fee) return res.status(404).json({ success: false, message: 'Fee structure not found for this class.' });
    res.json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrUpdate = async (req, res) => {
  try {
    const { class_id } = req.body;
    if (!class_id) return res.status(400).json({ success: false, message: 'Class ID required.' });

    const feeData = {
      class_id,
      admission_fee: req.body.admission_fee || 0,
      monthly_fee: req.body.monthly_fee || 0,
      registration_fee: req.body.registration_fee || 0,
      exam_fee: req.body.exam_fee || 0,
      practical_fee: req.body.practical_fee || 0,
      library_fee: req.body.library_fee || 0,
      transport_fee: req.body.transport_fee || 0,
      fine_amount: req.body.fine_amount || 0,
      scholarship_discount: req.body.scholarship_discount || 0,
      waiver: req.body.waiver || 0,
    };

    const total = Object.values(feeData).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
    feeData.total_fee = total - (feeData.scholarship_discount + feeData.waiver);

    const existing = await Fee.findOne({ where: { class_id } });
    if (existing) {
      await existing.update(feeData);
      await logAction(req.userId, 'FEE_UPDATE', 'fee', existing.id, `Updated fee structure for class ${class_id}`, req);
      res.json({ success: true, message: 'Fee structure updated.', data: existing });
    } else {
      const fee = await Fee.create(feeData);
      await logAction(req.userId, 'FEE_CREATE', 'fee', fee.id, `Created fee structure for class ${class_id}`, req);
      res.status(201).json({ success: true, message: 'Fee structure created.', data: fee });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
