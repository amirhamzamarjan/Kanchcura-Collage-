require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, ensureDatabaseExists } = require('../config/database');
const {
  User, Department, Group, Section, Class, Subject,
  Student, StudentSubject, Teacher, Fee, Setting,
} = require('../models');

const seed = async () => {
  try {
    console.log('🌱 Seeding Kanchkura College ERP Database...\n');

    // Create database if not exists
    if (ensureDatabaseExists) {
      await ensureDatabaseExists();
      console.log('✅ Database verified/created.');
    }

    // Sync all tables first
    await sequelize.sync({ force: true });
    console.log('✅ Tables synced (force).\n');

    // === USERS ===
    const hashedPwd = await bcrypt.hash('admin123', 10);
    const teacherPwd = await bcrypt.hash('teacher123', 10);

    const users = await User.bulkCreate([
      { name: 'Super Admin', email: 'admin@kanchkura.edu.bd', password: hashedPwd, role: 'super-admin', phone: '01700000001', avatar: 'SA', employee_id: 'EMP-001' },
      { name: 'Dr. Rafiq Ahmed', email: 'principal@kanchkura.edu.bd', password: hashedPwd, role: 'principal', phone: '01700000002', avatar: 'RA', employee_id: 'EMP-002' },
      { name: 'Nusrat Jahan', email: 'admin2@kanchkura.edu.bd', password: hashedPwd, role: 'admin', phone: '01700000003', avatar: 'NJ', employee_id: 'EMP-003' },
      { name: 'Kamal Hossain', email: 'accounts@kanchkura.edu.bd', password: hashedPwd, role: 'accounts', phone: '01700000004', avatar: 'KH', employee_id: 'EMP-004' },
      { name: 'Fatema Begum', email: 'fatema@kanchkura.edu.bd', password: teacherPwd, role: 'teacher', phone: '01700000005', avatar: 'FB', employee_id: 'EMP-005' },
      { name: 'Abdur Rahman', email: 'rahman@kanchkura.edu.bd', password: teacherPwd, role: 'teacher', phone: '01700000006', avatar: 'AR', employee_id: 'EMP-006' },
      { name: 'Sabrina Akter', email: 'sabrina@kanchkura.edu.bd', password: teacherPwd, role: 'teacher', phone: '01700000007', avatar: 'SA', employee_id: 'EMP-007' },
    ], { silent: true });
    console.log(`✅ ${users.length} users created`);

    // === DEPARTMENTS ===
    const departments = await Department.bulkCreate([
      { name: 'Science', code: 'science', description: 'Science and Technology Department' },
      { name: 'Commerce', code: 'commerce', description: 'Commerce and Business Studies Department' },
      { name: 'Humanities', code: 'humanities', description: 'Humanities and Social Sciences Department' },
    ], { silent: true });
    console.log(`✅ ${departments.length} departments created`);

    // === CLASSES ===
    const classes = await Class.bulkCreate([
      { name: 'Class 9', numeric_value: 9 },
      { name: 'Class 10', numeric_value: 10 },
      { name: 'Class 11', numeric_value: 11 },
      { name: 'Class 12', numeric_value: 12 },
    ], { silent: true });
    console.log(`✅ ${classes.length} classes created`);

    // === SECTIONS ===
    const sections = await Section.bulkCreate([
      { name: 'A', code: 'A' },
      { name: 'B', code: 'B' },
      { name: 'C', code: 'C' },
      { name: 'D', code: 'D' },
    ], { silent: true });
    console.log(`✅ ${sections.length} sections created`);

    // === SUBJECTS ===
    const subjectData = [
      { name: 'Bangla', code: 'BAN', department_id: 1, full_marks: 100, pass_marks: 33 },
      { name: 'English', code: 'ENG', department_id: 1, full_marks: 100, pass_marks: 33 },
      { name: 'ICT', code: 'ICT', department_id: 1, full_marks: 100, pass_marks: 33 },
      { name: 'Physics', code: 'PHY', department_id: 1, full_marks: 100, pass_marks: 33 },
      { name: 'Chemistry', code: 'CHEM', department_id: 1, full_marks: 100, pass_marks: 33 },
      { name: 'Biology', code: 'BIO', department_id: 1, full_marks: 100, pass_marks: 33 },
      { name: 'Higher Mathematics', code: 'HMATH', department_id: 1, full_marks: 100, pass_marks: 33 },
      { name: 'Accounting', code: 'ACC', department_id: 2, full_marks: 100, pass_marks: 33 },
      { name: 'Finance', code: 'FIN', department_id: 2, full_marks: 100, pass_marks: 33 },
      { name: 'Business Organization', code: 'BUSORG', department_id: 2, full_marks: 100, pass_marks: 33 },
      { name: 'History', code: 'HIS', department_id: 3, full_marks: 100, pass_marks: 33 },
      { name: 'Civics', code: 'CIV', department_id: 3, full_marks: 100, pass_marks: 33 },
      { name: 'Economics', code: 'ECO', department_id: 3, full_marks: 100, pass_marks: 33 },
      { name: 'Geography', code: 'GEO', department_id: 3, full_marks: 100, pass_marks: 33 },
    ];
    // Re-map department IDs properly
    const deptMap = { 'science': 1, 'commerce': 2, 'humanities': 3 };
    subjectData.forEach(s => s.department_id = deptMap[['science', 'commerce', 'humanities'][s.department_id - 1]] || s.department_id);

    const subjects = await Subject.bulkCreate(subjectData, { silent: true });
    console.log(`✅ ${subjects.length} subjects created`);

    // === GROUPS ===
    const groups = await Group.bulkCreate([
      { name: 'Science', code: 'science', department_id: 1 },
      { name: 'Commerce', code: 'commerce', department_id: 2 },
      { name: 'Humanities', code: 'humanities', department_id: 3 },
    ], { silent: true });
    console.log(`✅ ${groups.length} groups created`);

    // === FEES ===
    const feeData = [
      { class_id: 1, admission_fee: 5000, monthly_fee: 2500, registration_fee: 1500, exam_fee: 1000, practical_fee: 400, library_fee: 200, transport_fee: 1500, total_fee: 12100 },
      { class_id: 2, admission_fee: 5000, monthly_fee: 2800, registration_fee: 1500, exam_fee: 1200, practical_fee: 400, library_fee: 200, transport_fee: 1500, total_fee: 12600 },
      { class_id: 3, admission_fee: 8000, monthly_fee: 3500, registration_fee: 2000, exam_fee: 1500, practical_fee: 500, library_fee: 300, transport_fee: 2000, total_fee: 17800 },
      { class_id: 4, admission_fee: 8000, monthly_fee: 3800, registration_fee: 2000, exam_fee: 1500, practical_fee: 500, library_fee: 300, transport_fee: 2000, total_fee: 18100 },
    ];
    const fees = await Fee.bulkCreate(feeData, { silent: true });
    console.log(`✅ ${fees.length} fee structures created`);

    // === STUDENTS ===
    const studentData = [
      { student_id: 'KCC-2024-001', roll_number: 1, full_name: 'Ariful Islam', bengali_name: 'আরিফুল ইসলাম', father_name: 'Rafiqul Islam', mother_name: 'Rashida Begum', guardian_phone: '01712345678', phone: '01812345678', email: 'ariful@example.com', blood_group: 'B+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', date_of_birth: '2008-05-15', present_address: 'Mirpur-10, Dhaka', department_id: 1, class_id: 2, section_id: 1, group_id: 1, session: '2024', shift: 'morning', registration_number: 'REG-2024-001', academic_year: '2024-2025', admission_date: '2024-01-15', status: 'active' },
      { student_id: 'KCC-2024-002', roll_number: 2, full_name: 'Sabrina Akter', bengali_name: 'সাবরিনা আক্তার', father_name: 'Monirul Haque', mother_name: 'Salma Khatun', guardian_phone: '01723456789', phone: '01823456789', email: 'sabrina@example.com', blood_group: 'A+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', date_of_birth: '2007-08-22', present_address: 'Uttara-12, Dhaka', department_id: 1, class_id: 2, section_id: 1, group_id: 1, session: '2024', shift: 'morning', registration_number: 'REG-2024-002', academic_year: '2024-2025', admission_date: '2024-01-15', status: 'active' },
      { student_id: 'KCC-2024-003', roll_number: 3, full_name: 'Tanvir Ahmed', bengali_name: 'তানভীর আহমেদ', father_name: 'Shahidul Alam', mother_name: 'Nargis Akter', guardian_phone: '01734567890', phone: '01834567890', email: 'tanvir@example.com', blood_group: 'O+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', date_of_birth: '2008-02-10', present_address: 'Dhanmondi, Dhaka', department_id: 1, class_id: 2, section_id: 1, group_id: 1, session: '2024', shift: 'morning', registration_number: 'REG-2024-003', academic_year: '2024-2025', admission_date: '2024-01-15', status: 'active' },
      { student_id: 'KCC-2024-004', roll_number: 1, full_name: 'Nusrat Jahan', bengali_name: 'নুসরাত জাহান', father_name: 'Kamal Ahmed', mother_name: 'Roksana Begum', guardian_phone: '01745678901', phone: '01845678901', email: 'nusrat@example.com', blood_group: 'AB+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', date_of_birth: '2007-11-30', present_address: 'Banani, Dhaka', department_id: 2, class_id: 3, section_id: 2, group_id: 2, session: '2024', shift: 'morning', registration_number: 'REG-2024-004', academic_year: '2024-2025', admission_date: '2024-01-16', status: 'active' },
      { student_id: 'KCC-2024-005', roll_number: 2, full_name: 'Rakibul Hasan', bengali_name: 'রাকিবুল হাসান', father_name: 'Mizanur Rahman', mother_name: 'Shahana Parveen', guardian_phone: '01756789012', phone: '01856789012', email: 'rakibul@example.com', blood_group: 'B-', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', date_of_birth: '2008-07-05', present_address: 'Gulshan-2, Dhaka', department_id: 2, class_id: 3, section_id: 2, group_id: 2, session: '2024', shift: 'morning', registration_number: 'REG-2024-005', academic_year: '2024-2025', admission_date: '2024-01-16', status: 'active' },
      { student_id: 'KCC-2025-001', roll_number: 1, full_name: 'Fatema Begum', bengali_name: 'ফাতেমা বেগম', father_name: 'Abdul Karim', mother_name: 'Khalida Khatun', guardian_phone: '01767890123', phone: '01867890123', email: 'fatema@example.com', blood_group: 'A-', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', date_of_birth: '2009-01-20', present_address: 'Mohammadpur, Dhaka', department_id: 3, class_id: 1, section_id: 1, group_id: 3, session: '2025', shift: 'morning', registration_number: 'REG-2025-001', academic_year: '2025-2026', admission_date: '2025-01-10', status: 'active' },
      { student_id: 'KCC-2025-002', roll_number: 2, full_name: 'Abdul Karim', bengali_name: 'আব্দুল করিম', father_name: 'Habibullah Miah', mother_name: 'Rahima Begum', guardian_phone: '01778901234', phone: '01878901234', email: 'abdul@example.com', blood_group: 'O-', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', date_of_birth: '2009-04-12', present_address: 'Savar, Dhaka', department_id: 1, class_id: 1, section_id: 1, group_id: 1, session: '2025', shift: 'morning', registration_number: 'REG-2025-002', academic_year: '2025-2026', admission_date: '2025-01-10', status: 'active' },
      { student_id: 'KCC-2024-006', roll_number: 3, full_name: 'Sumaiya Akter', bengali_name: 'সুমাইয়া আক্তার', father_name: 'Nazrul Islam', mother_name: 'Jesmin Ara', guardian_phone: '01789012345', phone: '01889012345', email: 'sumaiya@example.com', blood_group: 'B+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', date_of_birth: '2007-09-18', present_address: 'Mirpur-14, Dhaka', department_id: 3, class_id: 2, section_id: 2, group_id: 3, session: '2024', shift: 'day', registration_number: 'REG-2024-006', academic_year: '2024-2025', admission_date: '2024-01-15', status: 'active' },
      { student_id: 'KCC-2023-001', roll_number: 1, full_name: 'Mahfuzur Rahman', bengali_name: 'মাহফুজুর রহমান', father_name: 'Abdur Rashid', mother_name: 'Monowara Begum', guardian_phone: '01790123456', phone: '01890123456', email: 'mahfuzur@example.com', blood_group: 'AB-', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', date_of_birth: '2008-12-03', present_address: 'Bashundhara, Dhaka', department_id: 1, class_id: 4, section_id: 1, group_id: 1, session: '2023', shift: 'morning', registration_number: 'REG-2023-001', academic_year: '2023-2024', admission_date: '2023-01-12', status: 'active' },
      { student_id: 'KCC-2023-002', roll_number: 2, full_name: 'Tasnia Islam', bengali_name: 'তাসনিয়া ইসলাম', father_name: 'Shafiul Alam', mother_name: 'Farida Begum', guardian_phone: '01801234567', phone: '01901234567', email: 'tasnia@example.com', blood_group: 'A+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', date_of_birth: '2008-03-25', present_address: 'Tejgaon, Dhaka', department_id: 2, class_id: 4, section_id: 1, group_id: 2, session: '2023', shift: 'morning', registration_number: 'REG-2023-002', academic_year: '2023-2024', admission_date: '2023-01-12', status: 'active' },
    ];
    const students = await Student.bulkCreate(studentData, { silent: true });
    console.log(`✅ ${students.length} students created`);

    // === TEACHERS ===
    const teacherData = [
      { employee_id: 'TCH-001', name: 'Fatema Begum', subject_id: 1, qualification: 'M.A', phone: '01711111111', email: 'fatema@kanchkura.edu.bd', joining_date: '2020-01-01' },
      { employee_id: 'TCH-002', name: 'Abdur Rahman', subject_id: 2, qualification: 'M.Ed', phone: '01722222222', email: 'rahman@kanchkura.edu.bd', joining_date: '2019-06-15' },
      { employee_id: 'TCH-003', name: 'Sabrina Akter', subject_id: 4, qualification: 'M.Sc', phone: '01733333333', email: 'sabrina@kanchkura.edu.bd', joining_date: '2021-03-01' },
      { employee_id: 'TCH-004', name: 'Kamal Hossain', subject_id: 5, qualification: 'M.Sc', phone: '01744444444', email: 'kamal@kanchkura.edu.bd', joining_date: '2018-09-01' },
      { employee_id: 'TCH-005', name: 'Nusrat Jahan', subject_id: 3, qualification: 'B.Sc (Hons)', phone: '01755555555', email: 'nusrat@kanchkura.edu.bd', joining_date: '2022-01-01' },
      { employee_id: 'TCH-006', name: 'Dr. Rafiq Ahmed', subject_id: 7, qualification: 'PhD', phone: '01766666666', email: 'rafiq@kanchkura.edu.bd', joining_date: '2015-01-01' },
    ];
    const teachers = await Teacher.bulkCreate(teacherData, { silent: true });
    console.log(`✅ ${teachers.length} teachers created`);

    // === DEFAULT SETTINGS ===
    const settings = await Setting.bulkCreate([
      { key: 'college_name', value: 'Kanchkura College', type: 'string', description: 'College name' },
      { key: 'college_address', value: 'Kanchkura, Kishoreganj, Bangladesh', type: 'string', description: 'College address' },
      { key: 'college_phone', value: '01700-000000', type: 'string', description: 'College phone' },
      { key: 'college_email', value: 'info@kanchkura.edu.bd', type: 'string', description: 'College email' },
      { key: 'receipt_footer', value: 'Thank you for your payment. This is a computer-generated receipt.', type: 'string', description: 'Receipt footer text' },
      { key: 'academic_year', value: '2025-2026', type: 'string', description: 'Current academic year' },
      { key: 'session', value: '2025', type: 'string', description: 'Current session' },
    ], { silent: true });
    console.log(`✅ ${settings.length} settings created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Super Admin: admin@kanchkura.edu.bd / admin123');
    console.log('   Principal:   principal@kanchkura.edu.bd / principal123');
    console.log('   Admin:       admin2@kanchkura.edu.bd / admin123');
    console.log('   Accounts:    accounts@kanchkura.edu.bd / account123');
    console.log('   Teacher:     fatema@kanchkura.edu.bd / teacher123');
    console.log('   Teacher:     rahman@kanchkura.edu.bd / teacher123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
