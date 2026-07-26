const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ============================================
// 1. USERS
// ============================================
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('super-admin', 'principal', 'admin', 'accounts', 'teacher'), allowNull: false, defaultValue: 'teacher' },
  phone: { type: DataTypes.STRING(20) },
  avatar: { type: DataTypes.STRING(20) },
  employee_id: { type: DataTypes.STRING(50), unique: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_two_factor_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  two_factor_secret: { type: DataTypes.STRING(255) },
  last_login: { type: DataTypes.DATE },
  last_activity: { type: DataTypes.DATE },
  password_changed_at: { type: DataTypes.DATE },
}, { tableName: 'users', paranoid: true });

// ============================================
// 2. DEPARTMENTS
// ============================================
const Department = sequelize.define('Department', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'departments', paranoid: true });

// ============================================
// 3. GROUPS
// ============================================
const Group = sequelize.define('Group', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  code: { type: DataTypes.STRING(50), allowNull: false },
  department_id: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'groups', paranoid: true });

// ============================================
// 4. SECTIONS
// ============================================
const Section = sequelize.define('Section', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  code: { type: DataTypes.STRING(20) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'sections', paranoid: true });

// ============================================
// 5. CLASSES
// ============================================
const Class = sequelize.define('Class', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  numeric_value: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'classes', paranoid: true });

// ============================================
// 6. SUBJECTS
// ============================================
const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  department_id: { type: DataTypes.INTEGER, allowNull: false },
  full_marks: { type: DataTypes.INTEGER, defaultValue: 100 },
  pass_marks: { type: DataTypes.INTEGER, defaultValue: 33 },
  is_optional: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'subjects', paranoid: true });

// ============================================
// 7. STUDENTS
// ============================================
const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  roll_number: { type: DataTypes.INTEGER },
  full_name: { type: DataTypes.STRING(150), allowNull: false },
  bengali_name: { type: DataTypes.STRING(150) },
  father_name: { type: DataTypes.STRING(150) },
  mother_name: { type: DataTypes.STRING(150) },
  guardian_name: { type: DataTypes.STRING(150) },
  father_occupation: { type: DataTypes.STRING(100) },
  mother_occupation: { type: DataTypes.STRING(100) },
  guardian_phone: { type: DataTypes.STRING(20) },
  phone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(150) },
  blood_group: { type: DataTypes.STRING(10) },
  religion: { type: DataTypes.STRING(50) },
  nationality: { type: DataTypes.STRING(50), defaultValue: 'Bangladeshi' },
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
  date_of_birth: { type: DataTypes.DATEONLY },
  nid_birth_certificate: { type: DataTypes.STRING(50) },
  present_address: { type: DataTypes.TEXT },
  permanent_address: { type: DataTypes.TEXT },
  photo: { type: DataTypes.STRING(255) },
  // Academic
  session: { type: DataTypes.STRING(20) },
  shift: { type: DataTypes.ENUM('morning', 'day') },
  registration_number: { type: DataTypes.STRING(50) },
  academic_year: { type: DataTypes.STRING(20) },
  admission_date: { type: DataTypes.DATEONLY },
  // FK
  department_id: { type: DataTypes.INTEGER },
  class_id: { type: DataTypes.INTEGER },
  section_id: { type: DataTypes.INTEGER },
  group_id: { type: DataTypes.INTEGER },
  // Status
  status: { type: DataTypes.ENUM('active', 'inactive', 'graduated', 'transferred', 'expelled'), defaultValue: 'active' },
  is_alumni: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'students', paranoid: true });

// ============================================
// 8. STUDENT SUBJECTS (Many-to-Many)
// ============================================
const StudentSubject = sequelize.define('StudentSubject', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  subject_id: { type: DataTypes.INTEGER, allowNull: false },
  is_compulsory: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_elective: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'student_subjects', paranoid: true });

// ============================================
// 9. TEACHERS
// ============================================
const Teacher = sequelize.define('Teacher', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  subject_id: { type: DataTypes.INTEGER },
  qualification: { type: DataTypes.STRING(100) },
  phone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(150) },
  joining_date: { type: DataTypes.DATEONLY },
  photo: { type: DataTypes.STRING(255) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'teachers', paranoid: true });

// ============================================
// 10. ADMISSIONS
// ============================================
const Admission = sequelize.define('Admission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  admission_no: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  admission_date: { type: DataTypes.DATEONLY, allowNull: false },
  session: { type: DataTypes.STRING(20), allowNull: false },
  class_id: { type: DataTypes.INTEGER },
  department_id: { type: DataTypes.INTEGER },
  group_id: { type: DataTypes.INTEGER },
  shift: { type: DataTypes.ENUM('morning', 'day') },
  is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
  approved_by: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'), defaultValue: 'pending' },
  remarks: { type: DataTypes.TEXT },
}, { tableName: 'admissions', paranoid: true });

// ============================================
// 11. ATTENDANCE
// ============================================
const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  class_id: { type: DataTypes.INTEGER },
  section_id: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('present', 'absent', 'late', 'leave'), allowNull: false },
  marked_by: { type: DataTypes.INTEGER },
  remarks: { type: DataTypes.TEXT },
}, { tableName: 'attendance', paranoid: true });

// ============================================
// 12. FEES
// ============================================
const Fee = sequelize.define('Fee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  class_id: { type: DataTypes.INTEGER },
  admission_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  monthly_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  registration_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  exam_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  practical_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  library_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  transport_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  fine_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  scholarship_discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  waiver: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  total_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'fees', paranoid: true });

// ============================================
// 13. PAYMENTS
// ============================================
const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  receipt_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  invoice_number: { type: DataTypes.STRING(50), unique: true },
  fee_type: { type: DataTypes.ENUM('admission', 'monthly', 'registration', 'exam', 'practical', 'library', 'transport', 'fine', 'other'), allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paid_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  due_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  fine_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  payment_date: { type: DataTypes.DATEONLY, allowNull: false },
  payment_time: { type: DataTypes.TIME },
  payment_method: { type: DataTypes.ENUM('cash', 'bank', 'mobile', 'card'), defaultValue: 'cash' },
  status: { type: DataTypes.ENUM('paid', 'partial', 'unpaid', 'cancelled'), defaultValue: 'unpaid' },
  month: { type: DataTypes.STRING(20) },
  year: { type: DataTypes.STRING(10) },
  collected_by: { type: DataTypes.INTEGER },
  notes: { type: DataTypes.TEXT },
}, { tableName: 'payments', paranoid: true });

// ============================================
// 14. RECEIPTS
// ============================================
const Receipt = sequelize.define('Receipt', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  receipt_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  payment_id: { type: DataTypes.INTEGER },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  receipt_date: { type: DataTypes.DATEONLY, allowNull: false },
  receipt_type: { type: DataTypes.STRING(50) },
  pdf_path: { type: DataTypes.STRING(255) },
  is_printed: { type: DataTypes.BOOLEAN, defaultValue: false },
  print_count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'receipts', paranoid: true });

// ============================================
// 15. RESULTS
// ============================================
const Result = sequelize.define('Result', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  subject_id: { type: DataTypes.INTEGER, allowNull: false },
  exam_type: { type: DataTypes.ENUM('class-test', 'mid-term', 'final', 'pre-test', 'model-test'), allowNull: false },
  class_test_mark: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  mid_term_mark: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  final_mark: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  practical_mark: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  total_mark: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  gpa: { type: DataTypes.DECIMAL(4, 2), defaultValue: 0 },
  grade: { type: DataTypes.STRING(5), defaultValue: 'F' },
  position: { type: DataTypes.INTEGER },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
  published_by: { type: DataTypes.INTEGER },
  published_at: { type: DataTypes.DATE },
  entered_by: { type: DataTypes.INTEGER },
  remarks: { type: DataTypes.TEXT },
}, { tableName: 'results', paranoid: true });

// ============================================
// 16. NOTICES
// ============================================
const Notice = sequelize.define('Notice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.ENUM('general', 'academic', 'exam', 'event', 'urgent'), defaultValue: 'general' },
  is_pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
  published_date: { type: DataTypes.DATEONLY },
  published_by: { type: DataTypes.INTEGER },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'notices', paranoid: true });

// ============================================
// 17. NOTIFICATIONS
// ============================================
const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  title: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT },
  type: { type: DataTypes.ENUM('info', 'success', 'warning', 'error'), defaultValue: 'info' },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  read_at: { type: DataTypes.DATE },
  link: { type: DataTypes.STRING(255) },
}, { tableName: 'notifications', paranoid: true });

// ============================================
// 18. AUDIT LOGS
// ============================================
const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  action: { type: DataTypes.STRING(100), allowNull: false },
  entity_type: { type: DataTypes.STRING(100), allowNull: false },
  entity_id: { type: DataTypes.INTEGER },
  description: { type: DataTypes.TEXT },
  ip_address: { type: DataTypes.STRING(45) },
  user_agent: { type: DataTypes.TEXT },
  metadata: { type: DataTypes.JSON },
}, { tableName: 'audit_logs', paranoid: true });

// ============================================
// 19. SETTINGS
// ============================================
const Setting = sequelize.define('Setting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  value: { type: DataTypes.TEXT },
  type: { type: DataTypes.STRING(50), defaultValue: 'string' },
  description: { type: DataTypes.TEXT },
}, { tableName: 'settings', timestamps: true, paranoid: true });

// ============================================
// 20. BACKUPS
// ============================================
const Backup = sequelize.define('Backup', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  file_path: { type: DataTypes.STRING(255), allowNull: false },
  file_size: { type: DataTypes.BIGINT },
  type: { type: DataTypes.ENUM('manual', 'auto', 'scheduled'), defaultValue: 'manual' },
  status: { type: DataTypes.ENUM('pending', 'completed', 'failed', 'restored'), defaultValue: 'pending' },
  notes: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.INTEGER },
}, { tableName: 'backups', paranoid: true });

// ============================================
// ASSOCIATIONS
// ============================================
// Department associations
Department.hasMany(Subject, { foreignKey: 'department_id', as: 'subjects' });
Subject.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Group, { foreignKey: 'department_id', as: 'groups' });
Group.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Student, { foreignKey: 'department_id', as: 'students' });
Student.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Admission, { foreignKey: 'department_id', as: 'admissions' });
Admission.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Class associations
Class.hasMany(Student, { foreignKey: 'class_id', as: 'students' });
Student.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
Class.hasMany(Fee, { foreignKey: 'class_id', as: 'fees' });
Fee.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
Class.hasMany(Attendance, { foreignKey: 'class_id', as: 'attendances' });
Attendance.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
Class.hasMany(Admission, { foreignKey: 'class_id', as: 'admissions' });
Admission.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

// Section associations
Section.hasMany(Student, { foreignKey: 'section_id', as: 'students' });
Student.belongsTo(Section, { foreignKey: 'section_id', as: 'section' });
Section.hasMany(Attendance, { foreignKey: 'section_id', as: 'attendances' });
Attendance.belongsTo(Section, { foreignKey: 'section_id', as: 'section' });

// Group associations
Group.hasMany(Student, { foreignKey: 'group_id', as: 'students' });
Student.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });
Group.hasMany(Admission, { foreignKey: 'group_id', as: 'admissions' });
Admission.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

// Teacher associations
Teacher.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });
Subject.hasMany(Teacher, { foreignKey: 'subject_id', as: 'teachers' });

// Student-Subject M2M
Student.belongsToMany(Subject, { through: StudentSubject, foreignKey: 'student_id', as: 'subjects' });
Subject.belongsToMany(Student, { through: StudentSubject, foreignKey: 'subject_id', as: 'students' });
Student.hasMany(StudentSubject, { foreignKey: 'student_id', as: 'studentSubjects' });
StudentSubject.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Subject.hasMany(StudentSubject, { foreignKey: 'subject_id', as: 'studentSubjects' });
StudentSubject.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

// Student associations
Student.hasMany(Payment, { foreignKey: 'student_id', as: 'payments' });
Payment.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Student.hasMany(Attendance, { foreignKey: 'student_id', as: 'attendances' });
Attendance.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Student.hasMany(Result, { foreignKey: 'student_id', as: 'results' });
Result.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Student.hasMany(Receipt, { foreignKey: 'student_id', as: 'receipts' });
Receipt.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Payment associations
Payment.hasOne(Receipt, { foreignKey: 'payment_id', as: 'receipt' });
Receipt.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

// Result associations
Result.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });
Subject.hasMany(Result, { foreignKey: 'subject_id', as: 'results' });
Result.belongsTo(User, { foreignKey: 'entered_by', as: 'enteredBy' });
Result.belongsTo(User, { foreignKey: 'published_by', as: 'publishedBy' });

// User associations
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Notice
Notice.belongsTo(User, { foreignKey: 'published_by', as: 'publishedBy' });

// Backup
Backup.belongsTo(User, { foreignKey: 'created_by', as: 'createdBy' });

// Attendance marked by
Attendance.belongsTo(User, { foreignKey: 'marked_by', as: 'markedBy' });

// Payment collected by
Payment.belongsTo(User, { foreignKey: 'collected_by', as: 'collectedBy' });

// Admission approved by
Admission.belongsTo(User, { foreignKey: 'approved_by', as: 'approvedBy' });

module.exports = {
  sequelize,
  User,
  Department,
  Group,
  Section,
  Class,
  Subject,
  Student,
  StudentSubject,
  Teacher,
  Admission,
  Attendance,
  Fee,
  Payment,
  Receipt,
  Result,
  Notice,
  Notification,
  AuditLog,
  Setting,
  Backup,
};
