/**
 * KANCHKURA COLLEGE ERP - MIGRATION: 001_initial_schema
 *
 * Creates the initial database schema with all 20 tables.
 * This is the foundational migration that sets up the entire database.
 *
 * Applied: 2025-01-01
 * Dependencies: None
 * Rollback: Drops all tables
 */

const migration = {
  name: '001_initial_schema',
  version: '1.0.0',
  description: 'Creates initial database schema with all 20 tables',
  appliedAt: new Date().toISOString(),

  async up(sequelize) {
    const query = sequelize.getQueryInterface();

    // Users
    await query.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(150), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.ENUM('super-admin', 'principal', 'admin', 'accounts', 'teacher'), allowNull: false, defaultValue: 'teacher' },
      phone: { type: Sequelize.STRING(20) },
      avatar: { type: Sequelize.STRING(20) },
      employee_id: { type: Sequelize.STRING(50), unique: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      is_two_factor_enabled: { type: Sequelize.BOOLEAN, defaultValue: false },
      two_factor_secret: { type: Sequelize.STRING(255) },
      last_login: { type: Sequelize.DATE },
      last_activity: { type: Sequelize.DATE },
      password_changed_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });

    // Departments
    await query.createTable('departments', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });

    // Groups
    await query.createTable('groups', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      code: { type: Sequelize.STRING(50), allowNull: false },
      department_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'departments', key: 'id' }, onDelete: 'CASCADE' },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });

    // Sections
    await query.createTable('sections', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(50), allowNull: false },
      code: { type: Sequelize.STRING(20) },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });

    // Classes
    await query.createTable('classes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(50), allowNull: false },
      numeric_value: { type: Sequelize.INTEGER, allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });

    // Subjects
    await query.createTable('subjects', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      department_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'departments', key: 'id' }, onDelete: 'CASCADE' },
      full_marks: { type: Sequelize.INTEGER, defaultValue: 100 },
      pass_marks: { type: Sequelize.INTEGER, defaultValue: 33 },
      is_optional: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });

    // Students
    await query.createTable('students', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      student_id: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      roll_number: { type: Sequelize.INTEGER },
      full_name: { type: Sequelize.STRING(150), allowNull: false },
      bengali_name: { type: Sequelize.STRING(150) },
      father_name: { type: Sequelize.STRING(150) },
      mother_name: { type: Sequelize.STRING(150) },
      guardian_name: { type: Sequelize.STRING(150) },
      father_occupation: { type: Sequelize.STRING(100) },
      mother_occupation: { type: Sequelize.STRING(100) },
      guardian_phone: { type: Sequelize.STRING(20) },
      phone: { type: Sequelize.STRING(20) },
      email: { type: Sequelize.STRING(150) },
      blood_group: { type: Sequelize.STRING(10) },
      religion: { type: Sequelize.STRING(50) },
      nationality: { type: Sequelize.STRING(50), defaultValue: 'Bangladeshi' },
      gender: { type: Sequelize.ENUM('Male', 'Female', 'Other') },
      date_of_birth: { type: Sequelize.DATEONLY },
      nid_birth_certificate: { type: Sequelize.STRING(50) },
      present_address: { type: Sequelize.TEXT },
      permanent_address: { type: Sequelize.TEXT },
      photo: { type: Sequelize.STRING(255) },
      session: { type: Sequelize.STRING(20) },
      shift: { type: Sequelize.ENUM('morning', 'day') },
      registration_number: { type: Sequelize.STRING(50) },
      academic_year: { type: Sequelize.STRING(20) },
      admission_date: { type: Sequelize.DATEONLY },
      department_id: { type: Sequelize.INTEGER, references: { model: 'departments', key: 'id' } },
      class_id: { type: Sequelize.INTEGER, references: { model: 'classes', key: 'id' } },
      section_id: { type: Sequelize.INTEGER, references: { model: 'sections', key: 'id' } },
      group_id: { type: Sequelize.INTEGER, references: { model: 'groups', key: 'id' } },
      status: { type: Sequelize.ENUM('active', 'inactive', 'graduated', 'transferred', 'expelled'), defaultValue: 'active' },
      is_alumni: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });
  },

  async down(sequelize) {
    const query = sequelize.getQueryInterface();
    const tables = ['backups', 'settings', 'audit_logs', 'notifications', 'notices',
      'results', 'receipts', 'payments', 'fees', 'attendance', 'admissions',
      'teachers', 'student_subjects', 'students', 'subjects', 'classes',
      'sections', 'groups', 'departments', 'users'];
    for (const table of tables) {
      await query.dropTable(table);
    }
  },
};

const Sequelize = require('sequelize');
module.exports = migration;
