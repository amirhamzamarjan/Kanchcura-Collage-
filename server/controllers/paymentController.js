const { Op } = require('sequelize');
const { Payment, Student, Receipt, User, Class, Department } = require('../models');
const { paginateResponse } = require('../middleware/pagination');
const { logAction } = require('../middleware/audit');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const generateReceiptNo = async () => {
  const count = await Payment.count();
  const seq = String(count + 1).padStart(4, '0');
  return `RCP-${new Date().getFullYear()}-${seq}`;
};

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, fee_type, student_id, from_date, to_date } = req.query;
    const where = {};
    if (status) where.status = status;
    if (fee_type) where.fee_type = fee_type;
    if (student_id) where.student_id = student_id;
    if (from_date && to_date) {
      where.payment_date = { [Op.between]: [from_date, to_date] };
    } else if (from_date) {
      where.payment_date = { [Op.gte]: from_date };
    } else if (to_date) {
      where.payment_date = { [Op.lte]: to_date };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await Payment.findAndCountAll({
      where,
      include: [
        { model: Student, as: 'student', attributes: ['id', 'student_id', 'full_name', 'roll_number'], include: [
          { model: Class, as: 'class', attributes: ['name'] },
          { model: Department, as: 'department', attributes: ['name'] },
        ]},
        { model: User, as: 'collectedBy', attributes: ['id', 'name'] },
      ],
      limit: parseInt(limit), offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, ...paginateResponse(rows, count, req) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.collect = async (req, res) => {
  try {
    const { student_id, fee_type, amount, paid_amount, discount_amount = 0, fine_amount = 0, payment_method = 'cash', notes } = req.body;
    if (!student_id || !fee_type || !paid_amount) {
      return res.status(400).json({ success: false, message: 'Student ID, fee type, and amount required.' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const due_amount = Math.max(0, (amount || paid_amount) - paid_amount - discount_amount);
    const receiptNo = await generateReceiptNo();
    const now = new Date();

    const payment = await Payment.create({
      student_id,
      receipt_number: receiptNo,
      invoice_number: `INV-${receiptNo}`,
      fee_type,
      amount: amount || paid_amount,
      paid_amount,
      due_amount,
      discount_amount,
      fine_amount,
      payment_date: now.toISOString().split('T')[0],
      payment_time: now.toTimeString().split(' ')[0],
      payment_method,
      status: due_amount === 0 ? 'paid' : paid_amount > 0 ? 'partial' : 'unpaid',
      month: now.toLocaleString('default', { month: 'long' }),
      year: now.getFullYear().toString(),
      collected_by: req.userId,
      notes,
    });

    // Create receipt record
    await Receipt.create({
      receipt_number: receiptNo, payment_id: payment.id, student_id,
      receipt_date: now.toISOString().split('T')[0],
      receipt_type: fee_type,
    });

    await logAction(req.userId, 'PAYMENT_COLLECT', 'payment', payment.id,
      `Collected ৳${paid_amount} from ${student.full_name} for ${fee_type}`, req);

    res.status(201).json({ success: true, message: 'Payment collected.', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReceipt = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        { model: Student, as: 'student' },
        { model: User, as: 'collectedBy', attributes: ['id', 'name'] },
      ],
    });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.downloadReceipt = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Student, as: 'student' }],
    });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${payment.receipt_number}.pdf`);
    doc.pipe(res);

    // Generate PDF
    doc.fontSize(20).font('Helvetica-Bold').text('KANCHKURA COLLEGE', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Official Payment Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Receipt No: ${payment.receipt_number}`, { align: 'right' });
    doc.text(`Date: ${payment.payment_date}`, { align: 'right' });
    doc.text(`Time: ${payment.payment_time}`, { align: 'right' });
    doc.moveDown();

    // Line
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    doc.text(`Student Name: ${payment.student?.full_name || 'N/A'}`);
    doc.text(`Student ID: ${payment.student?.student_id || 'N/A'}`);
    doc.text(`Fee Type: ${payment.fee_type}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    doc.text(`Amount: ৳${parseFloat(payment.amount).toLocaleString()}`);
    doc.text(`Paid: ৳${parseFloat(payment.paid_amount).toLocaleString()}`);
    if (parseFloat(payment.discount_amount) > 0) {
      doc.text(`Discount: ৳${parseFloat(payment.discount_amount).toLocaleString()}`);
    }
    doc.text(`Payment Method: ${payment.payment_method}`);
    doc.moveDown();

    doc.font('Helvetica-Bold').fontSize(12);
    doc.text(`Status: ${payment.status.toUpperCase()}`, { align: 'right' });
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();
    doc.font('Helvetica').fontSize(9);
    doc.text('Thank you for your payment. This is a computer-generated receipt.', { align: 'center' });
    doc.text('For queries, contact the accounts office.', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.collectionReport = async (req, res) => {
  try {
    const { from_date, to_date, type } = req.query;
    const where = { status: { [Op.ne]: 'cancelled' } };

    if (from_date && to_date) {
      where.payment_date = { [Op.between]: [from_date, to_date] };
    } else {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      where.payment_date = { [Op.gte]: startOfMonth.toISOString().split('T')[0] };
    }
    if (type) where.fee_type = type;

    const payments = await Payment.findAll({ where });
    const total = payments.reduce((s, p) => s + parseFloat(p.paid_amount), 0);
    const byType = {};
    for (const p of payments) {
      byType[p.fee_type] = (byType[p.fee_type] || 0) + parseFloat(p.paid_amount);
    }

    res.json({
      success: true,
      data: {
        total_collection: total,
        total_transactions: payments.length,
        by_fee_type: byType,
        payments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
