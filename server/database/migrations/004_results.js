/**
 * KANCHKURA COLLEGE ERP - MIGRATION: 004_results
 *
 * Adds result calculation functions, GPA-grade mapping,
 * and performance indexes for the results system.
 *
 * Applied: 2025-01-02
 * Dependencies: 001_initial_schema
 */

const migration = {
  name: '004_results',
  version: '1.0.0',
  description: 'Adds result indexes, GPA calculation, and grade mapping',

  async up(sequelize) {
    const query = sequelize.getQueryInterface();
    const { Sequelize } = require('sequelize');

    // Performance indexes
    await query.addIndex('results', ['student_id', 'exam_type'], { name: 'idx_results_student_exam' });
    await query.addIndex('results', ['subject_id', 'exam_type'], { name: 'idx_results_subject_exam' });
    await query.addIndex('results', ['is_published'], { name: 'idx_results_publish_status' });

    // GPA calculation function
    try {
      await sequelize.query(`
        CREATE FUNCTION IF NOT EXISTS calc_gpa(total_marks DECIMAL(6,2))
        RETURNS DECIMAL(4,2) DETERMINISTIC
        BEGIN
          DECLARE gpa DECIMAL(4,2);
          IF total_marks >= 80 THEN SET gpa = 5.00;
          ELSEIF total_marks >= 70 THEN SET gpa = 4.00;
          ELSEIF total_marks >= 60 THEN SET gpa = 3.50;
          ELSEIF total_marks >= 50 THEN SET gpa = 3.00;
          ELSEIF total_marks >= 40 THEN SET gpa = 2.00;
          ELSEIF total_marks >= 33 THEN SET gpa = 1.00;
          ELSE SET gpa = 0.00;
          END IF;
          RETURN gpa;
        END
      `);
    } catch (e) {
      console.log('GPA function creation skipped:', e.message);
    }

    // Grade mapping function
    try {
      await sequelize.query(`
        CREATE FUNCTION IF NOT EXISTS calc_grade(gpa_val DECIMAL(4,2))
        RETURNS VARCHAR(5) DETERMINISTIC
        BEGIN
          DECLARE grade VARCHAR(5);
          IF gpa_val >= 5.00 THEN SET grade = 'A+';
          ELSEIF gpa_val >= 4.00 THEN SET grade = 'A';
          ELSEIF gpa_val >= 3.50 THEN SET grade = 'A-';
          ELSEIF gpa_val >= 3.00 THEN SET grade = 'B';
          ELSEIF gpa_val >= 2.00 THEN SET grade = 'C';
          ELSEIF gpa_val >= 1.00 THEN SET grade = 'D';
          ELSE SET grade = 'F';
          END IF;
          RETURN grade;
        END
      `);
    } catch (e) {
      console.log('Grade function creation skipped:', e.message);
    }

    // Results summary view
    try {
      await sequelize.query(`
        CREATE OR REPLACE VIEW vw_results_summary AS
        SELECT
          r.student_id,
          s.full_name AS student_name,
          s.student_id AS student_code,
          r.exam_type,
          COUNT(r.id) AS total_subjects,
          SUM(r.total_mark) AS grand_total,
          AVG(r.gpa) AS average_gpa,
          calc_grade(AVG(r.gpa)) AS overall_grade,
          r.is_published
        FROM results r
        JOIN students s ON r.student_id = s.id
        WHERE r.deleted_at IS NULL AND s.deleted_at IS NULL
        GROUP BY r.student_id, r.exam_type, r.is_published
      `);
    } catch (e) {
      console.log('Results view creation skipped:', e.message);
    }
  },

  async down(sequelize) {
    const query = sequelize.getQueryInterface();
    await query.removeIndex('results', 'idx_results_student_exam');
    await query.removeIndex('results', 'idx_results_subject_exam');
    await query.removeIndex('results', 'idx_results_publish_status');
    await sequelize.query('DROP FUNCTION IF EXISTS calc_gpa');
    await sequelize.query('DROP FUNCTION IF EXISTS calc_grade');
    await sequelize.query('DROP VIEW IF EXISTS vw_results_summary');
  },
};

module.exports = migration;
