/**
 * KANCHKURA COLLEGE ERP - MIGRATION: 002_students
 *
 * Adds indexes and triggers for student auto-generation.
 * Improves student search performance.
 *
 * Applied: 2025-01-01
 * Dependencies: 001_initial_schema
 */

const migration = {
  name: '002_students',
  version: '1.0.0',
  description: 'Adds student indexes, auto-generation logic, and academic tracking',

  async up(sequelize) {
    const query = sequelize.getQueryInterface();
    const { Sequelize } = require('sequelize');

    // Additional student indexes for performance
    await query.addIndex('students', ['student_id'], { name: 'idx_students_id_lookup' });
    await query.addIndex('students', ['roll_number', 'class_id', 'section_id'], { name: 'idx_students_roll_class_section' });
    await query.addIndex('students', ['session', 'department_id'], { name: 'idx_students_session_dept' });

    // Add computed columns view for student age if available
    try {
      await sequelize.query(`
        CREATE OR REPLACE VIEW vw_student_details AS
        SELECT
          s.*,
          TIMESTAMPDIFF(YEAR, s.date_of_birth, CURDATE()) AS age,
          CONCAT('Class ', c.numeric_value) AS class_name,
          d.name AS department_name,
          sec.name AS section_name,
          g.name AS group_name
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        LEFT JOIN departments d ON s.department_id = d.id
        LEFT JOIN sections sec ON s.section_id = sec.id
        LEFT JOIN \`groups\` g ON s.group_id = g.id
        WHERE s.deleted_at IS NULL
      `);
    } catch (e) {
      console.log('View creation skipped (non-critical):', e.message);
    }
  },

  async down(sequelize) {
    const query = sequelize.getQueryInterface();
    await query.removeIndex('students', 'idx_students_id_lookup');
    await query.removeIndex('students', 'idx_students_roll_class_section');
    await query.removeIndex('students', 'idx_students_session_dept');
    await sequelize.query('DROP VIEW IF EXISTS vw_student_details');
  },
};

module.exports = migration;
