/**
 * KANCHKURA COLLEGE ERP - MIGRATION: 003_teachers
 *
 * Adds teacher-class assignments and performance indexes.
 *
 * Applied: 2025-01-02
 * Dependencies: 001_initial_schema
 */

const migration = {
  name: '003_teachers',
  version: '1.0.0',
  description: 'Adds teacher indexes, assignment tracking, and subject mapping',

  async up(sequelize) {
    const query = sequelize.getQueryInterface();
    const { Sequelize } = require('sequelize');

    await query.addIndex('teachers', ['employee_id'], { name: 'idx_teachers_emp_id' });
    await query.addIndex('teachers', ['subject_id'], { name: 'idx_teachers_subject_id' });
    await query.addIndex('teachers', ['is_active'], { name: 'idx_teachers_active' });

    try {
      await sequelize.query(`
        CREATE OR REPLACE VIEW vw_teacher_details AS
        SELECT
          t.*,
          sub.name AS subject_name,
          sub.code AS subject_code
        FROM teachers t
        LEFT JOIN subjects sub ON t.subject_id = sub.id
        WHERE t.deleted_at IS NULL
      `);
    } catch (e) {
      console.log('Teacher view creation skipped:', e.message);
    }
  },

  async down(sequelize) {
    const query = sequelize.getQueryInterface();
    await query.removeIndex('teachers', 'idx_teachers_emp_id');
    await query.removeIndex('teachers', 'idx_teachers_subject_id');
    await query.removeIndex('teachers', 'idx_teachers_active');
    await sequelize.query('DROP VIEW IF EXISTS vw_teacher_details');
  },
};

module.exports = migration;
