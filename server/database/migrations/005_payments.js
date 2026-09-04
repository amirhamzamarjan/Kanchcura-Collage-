/**
 * KANCHKURA COLLEGE ERP - MIGRATION: 005_payments
 *
 * Adds payment tracking, receipt auto-generation indexes,
 * and financial summary views.
 *
 * Applied: 2025-01-03
 * Dependencies: 001_initial_schema
 */

const migration = {
  name: '005_payments',
  version: '1.0.0',
  description: 'Adds payment indexes, receipt tracking, and financial views',

  async up(sequelize) {
    const query = sequelize.getQueryInterface();
    const { Sequelize } = require('sequelize');

    // Payment performance indexes
    await query.addIndex('payments', ['student_id', 'status'], { name: 'idx_payments_student_status' });
    await query.addIndex('payments', ['payment_date', 'status'], { name: 'idx_payments_date_status' });
    await query.addIndex('payments', ['fee_type', 'payment_date'], { name: 'idx_payments_type_date' });
    await query.addIndex('payments', ['receipt_number'], { name: 'idx_payments_receipt_no' });

    // Receipt indexes
    await query.addIndex('receipts', ['receipt_number'], { name: 'idx_receipts_number_unique' });
    await query.addIndex('receipts', ['payment_id'], { name: 'idx_receipts_payment_id' });

    // Financial summary view
    try {
      await sequelize.query(`
        CREATE OR REPLACE VIEW vw_financial_summary AS
        SELECT
          DATE_FORMAT(p.payment_date, '%Y-%m') AS month_year,
          p.fee_type,
          COUNT(p.id) AS transaction_count,
          SUM(p.paid_amount) AS total_collected,
          SUM(p.due_amount) AS total_due,
          SUM(p.discount_amount) AS total_discount,
          (SUM(p.paid_amount) + SUM(p.due_amount)) AS total_expected
        FROM payments p
        WHERE p.deleted_at IS NULL AND p.status != 'cancelled'
        GROUP BY DATE_FORMAT(p.payment_date, '%Y-%m'), p.fee_type
        ORDER BY month_year DESC
      `);
    } catch (e) {
      console.log('Financial view creation skipped:', e.message);
    }

    // Student fee status view
    try {
      await sequelize.query(`
        CREATE OR REPLACE VIEW vw_student_fee_status AS
        SELECT
          s.id AS student_id,
          s.student_id AS student_code,
          s.full_name AS student_name,
          COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.paid_amount ELSE 0 END), 0) AS total_paid,
          COALESCE(SUM(p.due_amount), 0) AS total_due,
          CASE WHEN SUM(p.due_amount) > 0 THEN 'DUE' ELSE 'CLEAR' END AS status
        FROM students s
        LEFT JOIN payments p ON s.id = p.student_id AND p.deleted_at IS NULL
        WHERE s.deleted_at IS NULL
        GROUP BY s.id, s.student_id, s.full_name
      `);
    } catch (e) {
      console.log('Student fee view creation skipped:', e.message);
    }
  },

  async down(sequelize) {
    const query = sequelize.getQueryInterface();
    await query.removeIndex('payments', 'idx_payments_student_status');
    await query.removeIndex('payments', 'idx_payments_date_status');
    await query.removeIndex('payments', 'idx_payments_type_date');
    await query.removeIndex('payments', 'idx_payments_receipt_no');
    await query.removeIndex('receipts', 'idx_receipts_number_unique');
    await query.removeIndex('receipts', 'idx_receipts_payment_id');
    await sequelize.query('DROP VIEW IF EXISTS vw_financial_summary');
    await sequelize.query('DROP VIEW IF EXISTS vw_student_fee_status');
  },
};

module.exports = migration;
