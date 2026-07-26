/* ============================================
   KANCHKURA COLLEGE ERP - APPLICATION LOGIC
   Complete Vanilla JavaScript SPA
   ============================================ */

// ============================================
// 1. APPLICATION STATE
// ============================================
const App = {
  currentUser: null,
  currentView: 'dashboard',
  darkMode: false,
  currentPage: { students: 1, teachers: 1, admissions: 1, payments: 1, classResults: 1 },
  perPage: 10,
};

// ============================================
// 2. MOCK DATABASE
// ============================================
const DB = {
  departments: ['science', 'commerce', 'humanities'],

  subjects: {
    science: ['Bangla', 'English', 'ICT', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics'],
    commerce: ['Bangla', 'English', 'ICT', 'Accounting', 'Finance', 'Business Organization'],
    humanities: ['Bangla', 'English', 'ICT', 'History', 'Civics', 'Economics', 'Geography'],
  },

  users: [
    { id: 1, name: 'Super Admin', email: 'admin@kanchkura.edu.bd', password: 'admin123', role: 'super-admin', avatar: 'SA' },
    { id: 2, name: 'Dr. Rafiq Ahmed', email: 'principal@kanchkura.edu.bd', password: 'principal123', role: 'principal', avatar: 'RA' },
    { id: 3, name: 'Nusrat Jahan', email: 'admin2@kanchkura.edu.bd', password: 'admin123', role: 'admin', avatar: 'NJ' },
    { id: 4, name: 'Kamal Hossain', email: 'accounts@kanchkura.edu.bd', password: 'account123', role: 'accounts', avatar: 'KH' },
    { id: 5, name: 'Fatema Begum', email: 'fatema@kanchkura.edu.bd', password: 'teacher123', role: 'teacher', avatar: 'FB' },
    { id: 6, name: 'Abdur Rahman', email: 'rahman@kanchkura.edu.bd', password: 'teacher123', role: 'teacher', avatar: 'AR' },
    { id: 7, name: 'Sabrina Akter', email: 'sabrina@kanchkura.edu.bd', password: 'teacher123', role: 'teacher', avatar: 'SA' },
  ],

  students: [
    { id: 'KCC-2025-001', bengaliName: 'আরিফুল ইসলাম', fullName: 'Ariful Islam', fatherName: 'Rafiqul Islam', motherName: 'Rashida Begum', guardianName: 'Rafiqul Islam', fatherOcc: 'Business', motherOcc: 'Homemaker', guardianPhone: '01712345678', phone: '01812345678', email: 'ariful@student.kanchkura.edu.bd', bloodGroup: 'B+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', dob: '2008-05-15', nid: '1234567890', presentAddr: 'Dhaka, Mirpur-10', permanentAddr: 'Dhaka, Mirpur-10', department: 'science', class: '10', shift: 'morning', section: 'A', session: '2024', group: 'science', regNo: 'REG-2024-001', academicYear: '2024-2025', admissionDate: '2024-01-15', status: 'active', roll: 1, photo: null },
    { id: 'KCC-2025-002', bengaliName: 'সাবরিনা আক্তার', fullName: 'Sabrina Akter', fatherName: 'Monirul Haque', motherName: 'Salma Khatun', guardianName: 'Monirul Haque', fatherOcc: 'Teacher', motherOcc: 'Nurse', guardianPhone: '01723456789', phone: '01823456789', email: 'sabrina@student.kanchkura.edu.bd', bloodGroup: 'A+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', dob: '2007-08-22', nid: '2345678901', presentAddr: 'Dhaka, Uttara-12', permanentAddr: 'Dhaka, Uttara-12', department: 'science', class: '10', shift: 'morning', section: 'A', session: '2024', group: 'science', regNo: 'REG-2024-002', academicYear: '2024-2025', admissionDate: '2024-01-15', status: 'active', roll: 2, photo: null },
    { id: 'KCC-2025-003', bengaliName: 'তানভীর আহমেদ', fullName: 'Tanvir Ahmed', fatherName: 'Shahidul Alam', motherName: 'Nargis Akter', guardianName: 'Shahidul Alam', fatherOcc: 'Engineer', motherOcc: 'Doctor', guardianPhone: '01734567890', phone: '01834567890', email: 'tanvir@student.kanchkura.edu.bd', bloodGroup: 'O+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', dob: '2008-02-10', nid: '3456789012', presentAddr: 'Dhanmondi, Road-27', permanentAddr: 'Dhanmondi, Road-27', department: 'science', class: '10', shift: 'morning', section: 'A', session: '2024', group: 'science', regNo: 'REG-2024-003', academicYear: '2024-2025', admissionDate: '2024-01-15', status: 'active', roll: 3, photo: null },
    { id: 'KCC-2025-004', bengaliName: 'নুসরাত জাহান', fullName: 'Nusrat Jahan', fatherName: 'Kamal Ahmed', motherName: 'Roksana Begum', guardianName: 'Kamal Ahmed', fatherOcc: 'Government Officer', motherOcc: 'Teacher', guardianPhone: '01745678901', phone: '01845678901', email: 'nusrat@student.kanchkura.edu.bd', bloodGroup: 'AB+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', dob: '2007-11-30', nid: '4567890123', presentAddr: 'Banani, Block-C', permanentAddr: 'Banani, Block-C', department: 'commerce', class: '11', shift: 'morning', section: 'B', session: '2024', group: 'commerce', regNo: 'REG-2024-004', academicYear: '2024-2025', admissionDate: '2024-01-16', status: 'active', roll: 1, photo: null },
    { id: 'KCC-2025-005', bengaliName: 'রাকিবুল হাসান', fullName: 'Rakibul Hasan', fatherName: 'Mizanur Rahman', motherName: 'Shahana Parveen', guardianName: 'Mizanur Rahman', fatherOcc: 'Business', motherOcc: 'Housewife', guardianPhone: '01756789012', phone: '01856789012', email: 'rakibul@student.kanchkura.edu.bd', bloodGroup: 'B-', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', dob: '2008-07-05', nid: '5678901234', presentAddr: 'Gulshan-2', permanentAddr: 'Gulshan-2', department: 'commerce', class: '11', shift: 'morning', section: 'B', session: '2024', group: 'commerce', regNo: 'REG-2024-005', academicYear: '2024-2025', admissionDate: '2024-01-16', status: 'active', roll: 2, photo: null },
    { id: 'KCC-2025-006', bengaliName: 'ফাতেমা বেগম', fullName: 'Fatema Begum', fatherName: 'Abdul Karim', motherName: 'Khalida Khatun', guardianName: 'Abdul Karim', fatherOcc: 'Driver', motherOcc: 'Tailor', guardianPhone: '01767890123', phone: '01867890123', email: 'fatema@student.kanchkura.edu.bd', bloodGroup: 'A-', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', dob: '2009-01-20', nid: '6789012345', presentAddr: 'Mohammadpur', permanentAddr: 'Mohammadpur', department: 'humanities', class: '9', shift: 'morning', section: 'A', session: '2025', group: 'humanities', regNo: 'REG-2025-001', academicYear: '2025-2026', admissionDate: '2025-01-10', status: 'active', roll: 1, photo: null },
    { id: 'KCC-2025-007', bengaliName: 'আব্দুল করিম', fullName: 'Abdul Karim', fatherName: 'Habibullah Miah', motherName: 'Rahima Begum', guardianName: 'Habibullah Miah', fatherOcc: 'Farmer', motherOcc: 'Homemaker', guardianPhone: '01778901234', phone: '01878901234', email: 'abdul@student.kanchkura.edu.bd', bloodGroup: 'O-', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', dob: '2009-04-12', nid: '7890123456', presentAddr: 'Savar, Dhaka', permanentAddr: 'Savar, Dhaka', department: 'science', class: '9', shift: 'morning', section: 'A', session: '2025', group: 'science', regNo: 'REG-2025-002', academicYear: '2025-2026', admissionDate: '2025-01-10', status: 'active', roll: 3, photo: null },
    { id: 'KCC-2025-008', bengaliName: 'সুমাইয়া আক্তার', fullName: 'Sumaiya Akter', fatherName: 'Nazrul Islam', motherName: 'Jesmin Ara', guardianName: 'Nazrul Islam', fatherOcc: 'Shopkeeper', motherOcc: 'Teacher', guardianPhone: '01789012345', phone: '01889012345', email: 'sumaiya@student.kanchkura.edu.bd', bloodGroup: 'B+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', dob: '2007-09-18', nid: '8901234567', presentAddr: 'Mirpur-14', permanentAddr: 'Mirpur-14', department: 'humanities', class: '10', shift: 'day', section: 'B', session: '2024', group: 'humanities', regNo: 'REG-2024-006', academicYear: '2024-2025', admissionDate: '2024-01-15', status: 'active', roll: 5, photo: null },
    { id: 'KCC-2025-009', bengaliName: 'মাহফুজুর রহমান', fullName: 'Mahfuzur Rahman', fatherName: 'Abdur Rashid', motherName: 'Monowara Begum', guardianName: 'Abdur Rashid', fatherOcc: 'Doctor', motherOcc: 'Nurse', guardianPhone: '01790123456', phone: '01890123456', email: 'mahfuzur@student.kanchkura.edu.bd', bloodGroup: 'AB-', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Male', dob: '2008-12-03', nid: '9012345678', presentAddr: 'Bashundhara R/A', permanentAddr: 'Bashundhara R/A', department: 'science', class: '12', shift: 'morning', section: 'A', session: '2023', group: 'science', regNo: 'REG-2023-010', academicYear: '2023-2024', admissionDate: '2023-01-12', status: 'active', roll: 1, photo: null },
    { id: 'KCC-2025-010', bengaliName: 'তাসনিয়া ইসলাম', fullName: 'Tasnia Islam', fatherName: 'Shafiul Alam', motherName: 'Farida Begum', guardianName: 'Shafiul Alam', fatherOcc: 'Business', motherOcc: 'Government Officer', guardianPhone: '01801234567', phone: '01901234567', email: 'tasnia@student.kanchkura.edu.bd', bloodGroup: 'A+', religion: 'Islam', nationality: 'Bangladeshi', gender: 'Female', dob: '2008-03-25', nid: '0123456789', presentAddr: 'Tejgaon', permanentAddr: 'Tejgaon', department: 'commerce', class: '12', shift: 'morning', section: 'A', session: '2023', group: 'commerce', regNo: 'REG-2023-011', academicYear: '2023-2024', admissionDate: '2023-01-12', status: 'active', roll: 2, photo: null },
  ],

  teachers: [
    { id: 'TCH-001', name: 'Fatema Begum', subject: 'bangla', qualification: 'M.A', phone: '01711111111', email: 'fatema@kanchkura.edu.bd', joinDate: '2020-01-01', assignedClasses: ['10-A', '9-A'], status: 'active' },
    { id: 'TCH-002', name: 'Abdur Rahman', subject: 'english', qualification: 'M.Ed', phone: '01722222222', email: 'rahman@kanchkura.edu.bd', joinDate: '2019-06-15', assignedClasses: ['10-A', '11-A', '12-A'], status: 'active' },
    { id: 'TCH-003', name: 'Sabrina Akter', subject: 'physics', qualification: 'M.Sc', phone: '01733333333', email: 'sabrina@kanchkura.edu.bd', joinDate: '2021-03-01', assignedClasses: ['9-A', '10-A'], status: 'active' },
    { id: 'TCH-004', name: 'Kamal Hossain', subject: 'chemistry', qualification: 'M.Sc', phone: '01744444444', email: 'kamal@kanchkura.edu.bd', joinDate: '2018-09-01', assignedClasses: ['11-A', '12-A'], status: 'active' },
    { id: 'TCH-005', name: 'Nusrat Jahan', subject: 'ict', qualification: 'B.Sc (Hons)', phone: '01755555555', email: 'nusrat@kanchkura.edu.bd', joinDate: '2022-01-01', assignedClasses: ['9-A', '10-A', '11-A'], status: 'active' },
    { id: 'TCH-006', name: 'Dr. Rafiq Ahmed', subject: 'math', qualification: 'PhD', phone: '01766666666', email: 'rafiq@kanchkura.edu.bd', joinDate: '2015-01-01', assignedClasses: ['12-A', '11-A'], status: 'active' },
    { id: 'TCH-007', name: 'Shahana Parveen', subject: 'biology', qualification: 'M.Sc', phone: '01777777777', email: 'shahana@kanchkura.edu.bd', joinDate: '2020-06-01', assignedClasses: ['10-A', '9-A'], status: 'active' },
    { id: 'TCH-008', name: 'Mizanur Rahman', subject: 'accounting', qualification: 'M.A', phone: '01788888888', email: 'mizan@kanchkura.edu.bd', joinDate: '2019-01-01', assignedClasses: ['11-B', '12-A'], status: 'active' },
    { id: 'TCH-009', name: 'Rashida Begum', subject: 'history', qualification: 'M.A', phone: '01799999999', email: 'rashida@kanchkura.edu.bd', joinDate: '2021-09-01', assignedClasses: ['10-B', '9-A'], status: 'active' },
    { id: 'TCH-010', name: 'Jesmin Ara', subject: 'economics', qualification: 'M.A', phone: '01810101010', email: 'jesmin@kanchkura.edu.bd', joinDate: '2023-01-01', assignedClasses: ['11-B', '12-A'], status: 'active' },
  ],

  feeStructures: [
    { class: '9', admission: 5000, monthly: 2500, registration: 1500, exam: 1000, practical: 400, library: 200, transport: 1500 },
    { class: '10', admission: 5000, monthly: 2800, registration: 1500, exam: 1200, practical: 400, library: 200, transport: 1500 },
    { class: '11', admission: 8000, monthly: 3500, registration: 2000, exam: 1500, practical: 500, library: 300, transport: 2000 },
    { class: '12', admission: 8000, monthly: 3800, registration: 2000, exam: 1500, practical: 500, library: 300, transport: 2000 },
  ],

  payments: [
    { id: 'RCP-2025-001', studentId: 'KCC-2025-001', studentName: 'Ariful Islam', feeType: 'monthly', amount: 2800, paid: 2800, remaining: 0, date: '2025-01-15', time: '10:30 AM', status: 'paid', method: 'cash', receiptNo: 'RCP-2025-001' },
    { id: 'RCP-2025-002', studentId: 'KCC-2025-002', studentName: 'Sabrina Akter', feeType: 'monthly', amount: 2800, paid: 1500, remaining: 1300, date: '2025-01-15', time: '11:00 AM', status: 'partial', method: 'mobile', receiptNo: 'RCP-2025-002' },
    { id: 'RCP-2025-003', studentId: 'KCC-2025-003', studentName: 'Tanvir Ahmed', feeType: 'admission', amount: 5000, paid: 5000, remaining: 0, date: '2025-01-14', time: '09:45 AM', status: 'paid', method: 'bank', receiptNo: 'RCP-2025-003' },
    { id: 'RCP-2025-004', studentId: 'KCC-2025-004', studentName: 'Nusrat Jahan', feeType: 'monthly', amount: 3500, paid: 3500, remaining: 0, date: '2025-01-13', time: '02:15 PM', status: 'paid', method: 'cash', receiptNo: 'RCP-2025-004' },
    { id: 'RCP-2025-005', studentId: 'KCC-2025-005', studentName: 'Rakibul Hasan', feeType: 'monthly', amount: 3500, paid: 0, remaining: 3500, date: '2025-01-15', time: '12:00 PM', status: 'unpaid', method: '', receiptNo: '' },
    { id: 'RCP-2025-006', studentId: 'KCC-2025-006', studentName: 'Fatema Begum', feeType: 'admission', amount: 5000, paid: 5000, remaining: 0, date: '2025-01-10', time: '10:00 AM', status: 'paid', method: 'cash', receiptNo: 'RCP-2025-006' },
    { id: 'RCP-2025-007', studentId: 'KCC-2025-007', studentName: 'Abdul Karim', feeType: 'monthly', amount: 2500, paid: 2500, remaining: 0, date: '2025-01-12', time: '11:30 AM', status: 'paid', method: 'mobile', receiptNo: 'RCP-2025-007' },
    { id: 'RCP-2025-008', studentId: 'KCC-2025-001', studentName: 'Ariful Islam', feeType: 'exam', amount: 1200, paid: 1200, remaining: 0, date: '2025-02-01', time: '09:00 AM', status: 'paid', method: 'cash', receiptNo: 'RCP-2025-008' },
    { id: 'RCP-2025-009', studentId: 'KCC-2025-008', studentName: 'Sumaiya Akter', feeType: 'monthly', amount: 2800, paid: 1000, remaining: 1800, date: '2025-02-01', time: '02:00 PM', status: 'partial', method: 'mobile', receiptNo: 'RCP-2025-009' },
    { id: 'RCP-2025-010', studentId: 'KCC-2025-009', studentName: 'Mahfuzur Rahman', feeType: 'monthly', amount: 3800, paid: 3800, remaining: 0, date: '2025-02-02', time: '10:15 AM', status: 'paid', method: 'bank', receiptNo: 'RCP-2025-010' },
  ],

  results: [
    { studentId: 'KCC-2025-001', subject: 'bangla', classTest: 16, midTerm: 24, final: 40, total: 80 },
    { studentId: 'KCC-2025-001', subject: 'english', classTest: 18, midTerm: 26, final: 42, total: 86 },
    { studentId: 'KCC-2025-001', subject: 'ict', classTest: 19, midTerm: 28, final: 45, total: 92 },
    { studentId: 'KCC-2025-001', subject: 'physics', classTest: 17, midTerm: 25, final: 41, total: 83 },
    { studentId: 'KCC-2025-001', subject: 'chemistry', classTest: 15, midTerm: 22, final: 38, total: 75 },
    { studentId: 'KCC-2025-001', subject: 'biology', classTest: 18, midTerm: 27, final: 43, total: 88 },
    { studentId: 'KCC-2025-002', subject: 'bangla', classTest: 14, midTerm: 20, final: 35, total: 69 },
    { studentId: 'KCC-2025-002', subject: 'english', classTest: 16, midTerm: 23, final: 38, total: 77 },
    { studentId: 'KCC-2025-002', subject: 'physics', classTest: 18, midTerm: 26, final: 42, total: 86 },
    { studentId: 'KCC-2025-003', subject: 'bangla', classTest: 17, midTerm: 25, final: 42, total: 84 },
    { studentId: 'KCC-2025-003', subject: 'english', classTest: 19, midTerm: 28, final: 45, total: 92 },
    { studentId: 'KCC-2025-003', subject: 'math', classTest: 20, midTerm: 29, final: 48, total: 97 },
  ],

  attendance: [
    { studentId: 'KCC-2025-001', date: '2025-01-15', status: 'present' },
    { studentId: 'KCC-2025-002', date: '2025-01-15', status: 'present' },
    { studentId: 'KCC-2025-003', date: '2025-01-15', status: 'late' },
    { studentId: 'KCC-2025-001', date: '2025-01-16', status: 'present' },
    { studentId: 'KCC-2025-002', date: '2025-01-16', status: 'absent' },
    { studentId: 'KCC-2025-003', date: '2025-01-16', status: 'present' },
    { studentId: 'KCC-2025-001', date: '2025-01-17', status: 'leave' },
    { studentId: 'KCC-2025-002', date: '2025-01-17', status: 'present' },
    { studentId: 'KCC-2025-003', date: '2025-01-17', status: 'present' },
  ],

  notices: [
    { id: 1, title: 'Annual Sports Day 2025', category: 'event', content: 'The annual sports day will be held on February 28, 2025. All students must participate in at least one event. Prizes will be distributed by the Chief Guest.', date: '2025-01-10', pinned: true, author: 'Principal' },
    { id: 2, title: 'Mid-Term Examination Schedule', category: 'exam', content: 'Mid-term examinations for classes 9-12 will begin from March 15, 2025. Students are requested to prepare accordingly. Detailed schedule will be published soon.', date: '2025-01-08', pinned: true, author: 'Admin' },
    { id: 3, title: 'Fee Submission Deadline', category: 'urgent', content: 'Monthly fee for January 2025 must be submitted by January 25, 2025. Late fee of ৳200 will be charged after the deadline. Contact accounts office for queries.', date: '2025-01-05', pinned: false, author: 'Accounts' },
    { id: 4, title: 'Science Fair 2025', category: 'academic', content: 'Science fair will be organized on February 15, 2025. Science group students can register their projects with the science department by January 30, 2025.', date: '2025-01-03', pinned: false, author: 'Admin' },
    { id: 5, title: 'Holiday Notice - Republic Day', category: 'general', content: 'The college will remain closed on February 21, 2025 on account of International Mother Language Day and National Martyrs Day.', date: '2025-01-01', pinned: false, author: 'Principal' },
    { id: 6, title: 'Parent-Teacher Meeting', category: 'academic', content: 'Parent-teacher meeting for classes 9 and 10 will be held on January 25, 2025 from 10:00 AM to 1:00 PM. Parents are requested to attend.', date: '2024-12-28', pinned: false, author: 'Principal' },
  ],

  settings: {
    collegeName: 'Kanchkura College',
    receiptFooter: 'Thank you for your payment. This is a computer-generated receipt. For queries, contact the accounts office.',
    theme: 'light',
  },

  nextStudentNum: 11,
  nextPaymentNum: 11,
  nextNoticeId: 7,
};

// ============================================
// 3. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLoginForm();
  initOTPInputs();
  initSidebar();
  initHeaderProfile();
  initGlobalSearch();
  setTodayDate();
});

function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) input.value = today;
  });
}

// ============================================
// 4. THEME SYSTEM
// ============================================
function initTheme() {
  const saved = localStorage.getItem('kanchkura-theme') || 'light';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  App.darkMode = theme === 'dark';
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  if (sunIcon && moonIcon) {
    sunIcon.classList.toggle('hidden', App.darkMode);
    moonIcon.classList.toggle('hidden', !App.darkMode);
  }
}

function toggleTheme() {
  const newTheme = App.darkMode ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('kanchkura-theme', newTheme);
}

function setTheme(theme) {
  applyTheme(theme);
  localStorage.setItem('kanchkura-theme', theme);
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.classList.remove('active');
    if ((theme === 'light' && opt.querySelector('.light-preview')) ||
        (theme === 'dark' && opt.querySelector('.dark-preview'))) {
      opt.classList.add('active');
    }
  });
}

// ============================================
// 5. AUTHENTICATION
// ============================================
function initLoginForm() {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    const user = DB.users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
      App.currentUser = user;
      // Show 2FA modal (simulated)
      document.getElementById('twoFactorModal').classList.remove('hidden');
    } else {
      showToast('Invalid credentials. Please try again.', 'error');
    }
  });

  document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Password reset link sent to your email!', 'success');
    setTimeout(() => showView('loginPage'), 1500);
  });

  document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const np = document.getElementById('newPassword').value;
    const cp = document.getElementById('confirmPassword').value;
    if (np !== cp) { showToast('Passwords do not match!', 'error'); return; }
    showToast('Password reset successful!', 'success');
    setTimeout(() => showView('loginPage'), 1500);
  });

  document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Password changed successfully!', 'success');
    closeModal('changePasswordModal');
  });
}

function verify2FA() {
  const inputs = document.querySelectorAll('.otp-input');
  const code = Array.from(inputs).map(i => i.value).join('');
  if (code.length < 6) { showToast('Please enter the complete 6-digit code.', 'warning'); return; }
  closeModal('twoFactorModal');
  loginSuccess();
}

function loginSuccess() {
  updateUserUI();
  showView('loginPage');
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  navigateTo('dashboard');
  showToast(`Welcome back, ${App.currentUser.name}!`, 'success');
  startSessionTimer();
}

function logout() {
  App.currentUser = null;
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  showToast('Logged out successfully.', 'info');
}

function startSessionTimer() {
  if (App.sessionTimeout) clearTimeout(App.sessionTimeout);
  App.sessionTimeout = setTimeout(() => {
    if (App.currentUser) {
      App.currentUser = null;
      document.getElementById('mainApp').classList.add('hidden');
      document.getElementById('sessionTimeoutPage').classList.remove('hidden');
      showToast('Session expired. Please login again.', 'warning');
    }
  }, 30 * 60 * 1000); // 30 minutes
}

function updateUserUI() {
  if (!App.currentUser) return;
  const initials = App.currentUser.avatar;
  const roleLabel = formatRole(App.currentUser.role);

  document.getElementById('sidebarAvatar').textContent = initials;
  document.getElementById('sidebarUserName').textContent = App.currentUser.name;
  document.getElementById('sidebarUserRole').textContent = roleLabel;
  document.getElementById('headerAvatar').textContent = initials;
  document.getElementById('headerUserName').textContent = App.currentUser.name;
  document.getElementById('headerUserRole').textContent = roleLabel;

  applyRolePermissions();
}

function formatRole(role) {
  const roles = {
    'super-admin': 'Super Admin',
    'principal': 'Principal',
    'admin': 'Admin',
    'accounts': 'Accounts Officer',
    'teacher': 'Teacher',
  };
  return roles[role] || role;
}

function applyRolePermissions() {
  const role = App.currentUser?.role;
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  navItems.forEach(item => {
    const view = item.dataset.view;
    let allowed = true;

    if (role === 'teacher') {
      allowed = ['dashboard', 'attendance', 'results', 'notices'].includes(view);
    } else if (role === 'accounts') {
      allowed = ['dashboard', 'students', 'fees', 'payments', 'reports'].includes(view);
    } else if (role === 'principal') {
      allowed = true;
    } else if (role === 'admin') {
      allowed = true;
    }

    item.style.display = allowed ? '' : 'none';
  });
}

// ============================================
// 6. NAVIGATION / ROUTING
// ============================================
function navigateTo(view) {
  if (!App.currentUser) return;

  // Check permissions
  const role = App.currentUser.role;
  const accessMap = {
    'dashboard': ['super-admin', 'principal', 'admin', 'accounts', 'teacher'],
    'students': ['super-admin', 'principal', 'admin'],
    'admissions': ['super-admin', 'principal', 'admin'],
    'attendance': ['super-admin', 'principal', 'admin', 'teacher'],
    'results': ['super-admin', 'principal', 'admin', 'teacher'],
    'classResults': ['super-admin', 'principal', 'admin'],
    'teachers': ['super-admin', 'principal', 'admin'],
    'fees': ['super-admin', 'principal', 'admin', 'accounts'],
    'payments': ['super-admin', 'principal', 'admin', 'accounts'],
    'notices': ['super-admin', 'principal', 'admin', 'teacher'],
    'reports': ['super-admin', 'principal', 'admin', 'accounts'],
    'settings': ['super-admin', 'principal'],
  };

  if (!accessMap[view]?.includes(role)) {
    showView('unauthorizedPage');
    return;
  }

  // Hide all views, show target
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const targetView = document.getElementById(`view-${view}`);
  if (targetView) {
    targetView.classList.remove('hidden');
    targetView.classList.add('active');
  }

  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const activeNav = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (activeNav) activeNav.classList.add('active');

  // Update header
  const titles = {
    dashboard: 'Dashboard', students: 'Student Management', admissions: 'Admissions',
    attendance: 'Attendance', results: 'Results', classResults: 'Class Results',
    teachers: 'Teacher Management', fees: 'Fee Management', payments: 'Payments',
    notices: 'Notice Board', reports: 'Reports', settings: 'Settings', studentProfile: 'Student Profile',
  };
  document.getElementById('pageTitle').textContent = titles[view] || view;
  document.getElementById('breadcrumb').textContent = `Home / ${titles[view] || view}`;

  App.currentView = view;

  // Load data
  loadViewData(view);

  // Close sidebar on mobile
  closeSidebar();
}

function showView(pageId) {
  // Hide all non-app pages
  const appPages = ['loginPage', 'forgotPasswordPage', 'resetPasswordPage', 'sessionTimeoutPage', 'unauthorizedPage'];
  appPages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(pageId);
  if (target) target.classList.remove('hidden');
}

function loadViewData(view) {
  switch (view) {
    case 'dashboard': renderDashboard(); break;
    case 'students': renderStudentsTable(); break;
    case 'admissions': renderAdmissionsTable(); break;
    case 'attendance': renderAttendanceSummary(); break;
    case 'results': break;
    case 'classResults': loadClassResults(); break;
    case 'teachers': renderTeachersTable(); break;
    case 'fees': renderFeeStructures(); break;
    case 'payments': renderPaymentsTable(); break;
    case 'notices': renderNotices(); break;
  }
}

// ============================================
// 7. SIDEBAR
// ============================================
function initSidebar() {
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebarClose = document.getElementById('sidebarCloseBtn');

  hamburger.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.addEventListener('click', closeSidebar);
      document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
  });

  sidebarClose.addEventListener('click', closeSidebar);
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) overlay.classList.remove('active');
}

// ============================================
// 8. HEADER PROFILE
// ============================================
function initHeaderProfile() {
  const profile = document.getElementById('headerProfile');
  const dropdown = document.getElementById('profileDropdown');

  profile.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => dropdown.classList.add('hidden'));
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
}

// ============================================
// 9. OTP INPUTS
// ============================================
function initOTPInputs() {
  const inputs = document.querySelectorAll('.otp-input');
  inputs.forEach((input, i) => {
    input.addEventListener('input', (e) => {
      if (e.target.value && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && i > 0) {
        inputs[i - 1].focus();
      }
    });
  });
}

// ============================================
// 10. DASHBOARD
// ============================================
function renderDashboard() {
  renderDashboardStats();
  renderRecentAdmissions();
  renderRecentPayments();
  renderRecentNotifications();
  renderActivityTimeline();
  renderRecentResults();
}

function renderDashboardStats() {
  document.getElementById('totalStudents').textContent = DB.students.length.toLocaleString();
  document.getElementById('totalTeachers').textContent = DB.teachers.length;
}

function renderRecentAdmissions() {
  const container = document.querySelector('#recentAdmissions .activity-list');
  const recent = DB.students.slice(-4).reverse();
  container.innerHTML = recent.map(s => `
    <div class="activity-item">
      <div class="activity-icon blue">🎓</div>
      <div class="activity-text">
        <strong>${s.fullName}</strong>
        <p>Class ${s.class} - ${capitalize(s.department)} (${s.session})</p>
      </div>
      <span class="activity-time">${formatDate(s.admissionDate)}</span>
    </div>
  `).join('');
}

function renderRecentPayments() {
  const container = document.querySelector('#recentPayments .activity-list');
  const recent = DB.payments.filter(p => p.status === 'paid').slice(-4).reverse();
  container.innerHTML = recent.map(p => `
    <div class="activity-item">
      <div class="activity-icon green">💰</div>
      <div class="activity-text">
        <strong>${p.studentName}</strong>
        <p>৳${p.amount.toLocaleString()} - ${capitalize(p.feeType)} Fee</p>
      </div>
      <span class="activity-time">${formatDate(p.date)}</span>
    </div>
  `).join('');
}

function renderRecentNotifications() {
  const container = document.querySelector('#recentNotifications .notification-list');
  const colors = { urgent: 'var(--danger)', event: 'var(--info)', exam: 'var(--warning)', academic: 'var(--accent)', general: 'var(--primary)' };
  container.innerHTML = DB.notices.slice(0, 4).map(n => `
    <div class="notification-item">
      <div class="notification-dot" style="background:${colors[n.category] || 'var(--primary)'}"></div>
      <div class="activity-text">
        <h4>${n.title}</h4>
        <p>${n.content.substring(0, 60)}...</p>
      </div>
    </div>
  `).join('');
}

function renderActivityTimeline() {
  const container = document.getElementById('activityTimeline');
  const activities = [
    { text: 'New student admitted: Ariful Islam (Class 10)', time: 'Today, 10:30 AM', color: '' },
    { text: 'Fee collected: ৳2,800 from Sabrina Akter', time: 'Today, 11:00 AM', color: 'green' },
    { text: 'Results published: Class 10 Science Section A', time: 'Yesterday, 4:00 PM', color: 'orange' },
    { text: 'Notice published: Annual Sports Day 2025', time: 'Jan 10, 9:00 AM', color: '' },
    { text: 'Teacher added: Sabrina Akter (Physics)', time: 'Jan 8, 2:00 PM', color: 'green' },
    { text: 'Fee structure updated for Class 12', time: 'Jan 5, 11:00 AM', color: 'orange' },
  ];

  container.innerHTML = activities.map(a => `
    <div class="timeline-item ${a.color}">
      <h4>${a.text}</h4>
      <time>${a.time}</time>
    </div>
  `).join('');
}

function renderRecentResults() {
  const container = document.querySelector('#recentResults .activity-list');
  container.innerHTML = `
    <div class="activity-item">
      <div class="activity-icon purple">📊</div>
      <div class="activity-text">
        <strong>Class 10 Science Section A - Mid Term</strong>
        <p>Average GPA: 3.85 | Highest: 4.89 | Pass Rate: 95%</p>
      </div>
      <span class="activity-time">Yesterday</span>
    </div>
    <div class="activity-item">
      <div class="activity-icon purple">📊</div>
      <div class="activity-text">
        <strong>Class 11 Commerce Section B - Class Test</strong>
        <p>Average GPA: 3.52 | Highest: 4.56 | Pass Rate: 88%</p>
      </div>
      <span class="activity-time">2 days ago</span>
    </div>
  `;
}

// ============================================
// 11. STUDENT MANAGEMENT
// ============================================
function renderStudentsTable() {
  const tbody = document.getElementById('studentsTableBody');
  const filtered = getFilteredStudents();
  const paged = paginate(filtered, App.currentPage.students, App.perPage);

  if (paged.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><h3>No students found</h3><p>Try adjusting your search or filter criteria.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = paged.map(s => `
    <tr>
      <td><strong>${s.id}</strong></td>
      <td>${s.fullName}</td>
      <td>Class ${s.class}</td>
      <td>${s.roll}</td>
      <td><span class="badge badge-info">${capitalize(s.department)}</span></td>
      <td>${s.section}</td>
      <td>${s.phone}</td>
      <td><span class="badge badge-success">Active</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" title="View Profile" onclick="viewStudentProfile('${s.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="btn-icon" title="Edit" onclick="editStudent('${s.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon danger" title="Delete" onclick="confirmDelete('student', '${s.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination('studentsPagination', filtered.length, App.currentPage.students, (page) => {
    App.currentPage.students = page;
    renderStudentsTable();
  });
}

function getFilteredStudents() {
  let students = [...DB.students];
  const dept = document.getElementById('filterDepartment')?.value;
  const cls = document.getElementById('filterClass')?.value;
  const section = document.getElementById('filterSection')?.value;
  const group = document.getElementById('filterGroup')?.value;
  const search = document.getElementById('studentSearch')?.value?.toLowerCase();

  if (dept) students = students.filter(s => s.department === dept);
  if (cls) students = students.filter(s => s.class === cls);
  if (section) students = students.filter(s => s.section === section);
  if (group) students = students.filter(s => s.group === group);
  if (search) {
    students = students.filter(s =>
      s.fullName.toLowerCase().includes(search) ||
      s.id.toLowerCase().includes(search) ||
      s.roll.toString().includes(search)
    );
  }
  return students;
}

function filterStudents() {
  App.currentPage.students = 1;
  renderStudentsTable();
}

function viewStudentProfile(studentId) {
  const student = DB.students.find(s => s.id === studentId);
  if (!student) return;

  const container = document.getElementById('studentProfileContent');
  const subjects = DB.subjects[student.department] || [];
  const studentResults = DB.results.filter(r => r.studentId === studentId);

  container.innerHTML = `
    <div class="card glass profile-card">
      <div class="profile-photo">${student.fullName.charAt(0)}</div>
      <div class="profile-details">
        <h2>${student.fullName}</h2>
        <div class="student-id">${student.id} | Roll: ${student.roll}</div>
        <div class="meta">
          <span>📚 Class ${student.class} - Section ${student.section}</span>
          <span>🏢 ${capitalize(student.department)}</span>
          <span>🔄 ${capitalize(student.shift)}</span>
          <span>📅 Session ${student.session}</span>
        </div>
      </div>
    </div>

    <div class="card glass" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <h3>Personal Information</h3>
        <button class="btn btn-secondary btn-sm" onclick="editStudent('${student.id}')">Edit</button>
      </div>
      <div class="card-body">
        <div class="info-grid">
          <div class="info-item"><label>Full Name</label><span>${student.fullName}</span></div>
          <div class="info-item"><label>Bengali Name</label><span>${student.bengaliName || '-'}</span></div>
          <div class="info-item"><label>Father's Name</label><span>${student.fatherName}</span></div>
          <div class="info-item"><label>Mother's Name</label><span>${student.motherName}</span></div>
          <div class="info-item"><label>Guardian</label><span>${student.guardianName || '-'}</span></div>
          <div class="info-item"><label>Guardian Phone</label><span>${student.guardianPhone || '-'}</span></div>
          <div class="info-item"><label>Father's Occupation</label><span>${student.fatherOcc || '-'}</span></div>
          <div class="info-item"><label>Mother's Occupation</label><span>${student.motherOcc || '-'}</span></div>
          <div class="info-item"><label>Phone</label><span>${student.phone || '-'}</span></div>
          <div class="info-item"><label>Email</label><span>${student.email || '-'}</span></div>
          <div class="info-item"><label>Blood Group</label><span>${student.bloodGroup || '-'}</span></div>
          <div class="info-item"><label>Religion</label><span>${student.religion || '-'}</span></div>
          <div class="info-item"><label>Gender</label><span>${student.gender}</span></div>
          <div class="info-item"><label>Date of Birth</label><span>${formatDate(student.dob)}</span></div>
          <div class="info-item"><label>NID/Cert No.</label><span>${student.nid || '-'}</span></div>
          <div class="info-item"><label>Nationality</label><span>${student.nationality || '-'}</span></div>
          <div class="info-item" style="grid-column:span 2"><label>Present Address</label><span>${student.presentAddr || '-'}</span></div>
          <div class="info-item" style="grid-column:span 2"><label>Permanent Address</label><span>${student.permanentAddr || '-'}</span></div>
        </div>
      </div>
    </div>

    <div class="card glass" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <h3>Academic Information</h3>
      </div>
      <div class="card-body">
        <div class="info-grid">
          <div class="info-item"><label>Student ID</label><span>${student.id}</span></div>
          <div class="info-item"><label>Roll Number</label><span>${student.roll}</span></div>
          <div class="info-item"><label>Registration No.</label><span>${student.regNo || '-'}</span></div>
          <div class="info-item"><label>Session</label><span>${student.session}</span></div>
          <div class="info-item"><label>Shift</label><span>${capitalize(student.shift)}</span></div>
          <div class="info-item"><label>Group</label><span>${capitalize(student.group || student.department)}</span></div>
          <div class="info-item"><label>Section</label><span>${student.section}</span></div>
          <div class="info-item"><label>Department</label><span>${capitalize(student.department)}</span></div>
          <div class="info-item"><label>Academic Year</label><span>${student.academicYear}</span></div>
          <div class="info-item"><label>Admission Date</label><span>${formatDate(student.admissionDate)}</span></div>
        </div>
      </div>
    </div>

    <div class="card glass" style="margin-bottom:1.5rem;">
      <div class="card-header"><h3>Assigned Subjects</h3></div>
      <div class="card-body">
        <div class="subject-tags">
          ${subjects.map(s => `<span class="subject-tag ${student.department}">${s}</span>`).join('')}
        </div>
      </div>
    </div>

    ${studentResults.length > 0 ? `
    <div class="card glass">
      <div class="card-header"><h3>Exam Results</h3></div>
      <div class="card-body">
        <table class="data-table">
          <thead><tr><th>Subject</th><th>Class Test (20)</th><th>Mid Term (30)</th><th>Final (50)</th><th>Total (100)</th><th>GPA</th><th>Grade</th></tr></thead>
          <tbody>
            ${studentResults.map(r => `
              <tr>
                <td>${capitalize(r.subject)}</td>
                <td>${r.classTest}</td>
                <td>${r.midTerm}</td>
                <td>${r.final}</td>
                <td><strong>${r.total}</strong></td>
                <td>${getGPA(r.total).toFixed(2)}</td>
                <td><span class="badge ${getGradeClass(getGPA(r.total))}">${getGrade(getGPA(r.total))}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    ` : ''}
  `;

  // Show profile view
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-studentProfile').classList.remove('hidden');
  document.getElementById('pageTitle').textContent = 'Student Profile';
  document.getElementById('breadcrumb').textContent = `Home / Students / ${student.fullName}`;
}

function saveStudent() {
  const fullName = document.getElementById('stuFullName').value;
  const department = document.getElementById('stuDepartment').value;
  const cls = document.getElementById('stuClass').value;
  const editId = document.getElementById('editStudentId').value;

  if (!fullName || !department || !cls) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (editId) {
    // Edit existing
    const idx = DB.students.findIndex(s => s.id === editId);
    if (idx !== -1) {
      DB.students[idx] = { ...DB.students[idx], ...getStudentFormData() };
      showToast('Student updated successfully!', 'success');
    }
  } else {
    // New admission
    const id = `KCC-2025-${String(DB.nextStudentNum).padStart(3, '0')}`;
    const maxRoll = Math.max(...DB.students.filter(s => s.class === cls && s.department === department).map(s => s.roll || 0), 0);
    const newStudent = { ...getStudentFormData(), id, roll: maxRoll + 1, admissionDate: new Date().toISOString().split('T')[0], status: 'active', photo: null };
    DB.students.push(newStudent);
    DB.nextStudentNum++;
    showToast(`Student admitted successfully! ID: ${id}`, 'success');
  }

  closeModal('addStudentModal');
  document.getElementById('studentForm').reset();
  document.getElementById('editStudentId').value = '';
  renderStudentsTable();
}

function getStudentFormData() {
  return {
    fullName: document.getElementById('stuFullName').value,
    bengaliName: document.getElementById('stuBengaliName').value,
    fatherName: document.getElementById('stuFatherName').value,
    motherName: document.getElementById('stuMotherName').value,
    guardianName: document.getElementById('stuGuardianName').value,
    guardianPhone: document.getElementById('stuGuardianPhone').value,
    fatherOcc: document.getElementById('stuFatherOcc').value,
    motherOcc: document.getElementById('stuMotherOcc').value,
    phone: document.getElementById('stuPhone').value,
    email: document.getElementById('stuEmail').value,
    bloodGroup: document.getElementById('stuBloodGroup').value,
    religion: document.getElementById('stuReligion').value,
    gender: document.getElementById('stuGender').value,
    dob: document.getElementById('stuDOB').value,
    nid: document.getElementById('stuNID').value,
    presentAddr: document.getElementById('stuPresentAddr').value,
    permanentAddr: document.getElementById('stuPermanentAddr').value,
    session: document.getElementById('stuSession').value,
    department: document.getElementById('stuDepartment').value,
    class: document.getElementById('stuClass').value,
    shift: document.getElementById('stuShift').value,
    section: document.getElementById('stuSection').value,
    academicYear: document.getElementById('stuAcademicYear').value,
    group: document.getElementById('stuDepartment').value,
    regNo: document.getElementById('stuRegNo').value,
  };
}

function editStudent(studentId) {
  const student = DB.students.find(s => s.id === studentId);
  if (!student) return;

  document.getElementById('studentModalTitle').textContent = 'Edit Student';
  document.getElementById('editStudentId').value = student.id;
  document.getElementById('stuFullName').value = student.fullName;
  document.getElementById('stuBengaliName').value = student.bengaliName || '';
  document.getElementById('stuFatherName').value = student.fatherName;
  document.getElementById('stuMotherName').value = student.motherName;
  document.getElementById('stuGuardianName').value = student.guardianName || '';
  document.getElementById('stuGuardianPhone').value = student.guardianPhone || '';
  document.getElementById('stuFatherOcc').value = student.fatherOcc || '';
  document.getElementById('stuMotherOcc').value = student.motherOcc || '';
  document.getElementById('stuPhone').value = student.phone || '';
  document.getElementById('stuEmail').value = student.email || '';
  document.getElementById('stuBloodGroup').value = student.bloodGroup || '';
  document.getElementById('stuReligion').value = student.religion || '';
  document.getElementById('stuGender').value = student.gender;
  document.getElementById('stuDOB').value = student.dob;
  document.getElementById('stuNID').value = student.nid || '';
  document.getElementById('stuPresentAddr').value = student.presentAddr || '';
  document.getElementById('stuPermanentAddr').value = student.permanentAddr || '';
  document.getElementById('stuSession').value = student.session;
  document.getElementById('stuDepartment').value = student.department;
  document.getElementById('stuClass').value = student.class;
  document.getElementById('stuShift').value = student.shift;
  document.getElementById('stuSection').value = student.section;
  document.getElementById('stuAcademicYear').value = student.academicYear;
  document.getElementById('stuRegNo').value = student.regNo || '';

  updateSubjectsForDept();
  openModal('addStudentModal');
}

function updateSubjectsForDept() {
  const dept = document.getElementById('stuDepartment').value;
  const container = document.getElementById('assignedSubjects');
  const subjects = DB.subjects[dept] || [];
  container.innerHTML = subjects.map(s => `<span class="subject-tag ${dept}">${s}</span>`).join('') || '<span style="color:var(--text-tertiary);font-size:0.875rem;">Select a department to see assigned subjects</span>';
}

// ============================================
// 12. ADMISSIONS
// ============================================
function renderAdmissionsTable() {
  const tbody = document.getElementById('admissionsTableBody');
  const paged = paginate(DB.students, App.currentPage.admissions, App.perPage);

  tbody.innerHTML = paged.map(s => `
    <tr>
      <td><strong>${s.id}</strong></td>
      <td>${s.fullName}</td>
      <td><span class="badge badge-info">${capitalize(s.department)}</span></td>
      <td>Class ${s.class}</td>
      <td>${s.session}</td>
      <td>${capitalize(s.shift)}</td>
      <td>${formatDate(s.admissionDate)}</td>
      <td><span class="badge badge-success">Active</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" onclick="viewStudentProfile('${s.id}')" title="View Profile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination('admissionsPagination', DB.students.length, App.currentPage.admissions, (page) => {
    App.currentPage.admissions = page;
    renderAdmissionsTable();
  });
}

// ============================================
// 13. ATTENDANCE
// ============================================
function loadAttendance() {
  const cls = document.getElementById('attFilterClass').value;
  const section = document.getElementById('attFilterSection').value;
  if (!cls || !section) { showToast('Please select class and section.', 'warning'); return; }

  const students = DB.students.filter(s => s.class === cls && s.section === section);
  const container = document.getElementById('attendanceTableContainer');
  const tbody = document.getElementById('attendanceTableBody');

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4"><div class="empty-state"><h3>No students found</h3></div></td></tr>';
    container.style.display = 'block';
    return;
  }

  tbody.innerHTML = students.map(s => `
    <tr>
      <td>${s.roll}</td>
      <td>${s.fullName}</td>
      <td>${s.id}</td>
      <td>
        <select class="attendance-select" data-student-id="${s.id}" style="padding:0.375rem 0.75rem;border-radius:var(--radius-sm);border:1px solid var(--border-strong);font-size:0.8125rem;">
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="leave">Leave</option>
        </select>
      </td>
    </tr>
  `).join('');

  container.style.display = 'block';
}

function loadAttendanceFromModal() {
  navigateTo('attendance');
  setTimeout(() => loadAttendance(), 300);
}

function saveAttendance() {
  const date = document.getElementById('attendanceDate').value;
  if (!date) { showToast('Please select a date.', 'warning'); return; }

  const selects = document.querySelectorAll('.attendance-select');
  selects.forEach(sel => {
    const studentId = sel.dataset.studentId;
    const status = sel.value;
    const existing = DB.attendance.findIndex(a => a.studentId === studentId && a.date === date);
    if (existing !== -1) {
      DB.attendance[existing].status = status;
    } else {
      DB.attendance.push({ studentId, date, status });
    }
  });

  showToast('Attendance saved successfully!', 'success');
  document.getElementById('attendanceTableContainer').style.display = 'none';
  renderAttendanceSummary();
}

function renderAttendanceSummary() {
  const tbody = document.getElementById('attendanceSummaryBody');
  const students = DB.students.slice(0, 8); // Show first 8 for demo

  tbody.innerHTML = students.map(s => {
    const records = DB.attendance.filter(a => a.studentId === s.id);
    const present = records.filter(a => a.status === 'present').length;
    const absent = records.filter(a => a.status === 'absent').length;
    const late = records.filter(a => a.status === 'late').length;
    const leave = records.filter(a => a.status === 'leave').length;
    const total = records.length || 1;
    const pct = Math.round((present / total) * 100);

    return `
      <tr>
        <td>${s.fullName}</td>
        <td>${s.roll}</td>
        <td><span class="badge badge-success">${present}</span></td>
        <td><span class="badge badge-danger">${absent}</span></td>
        <td><span class="badge badge-warning">${late}</span></td>
        <td><span class="badge badge-info">${leave}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <div style="width:60px;height:6px;background:var(--bg-tertiary);border-radius:3px;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:${pct >= 75 ? 'var(--accent)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)'};border-radius:3px;"></div>
            </div>
            <span style="font-size:0.8125rem;font-weight:600;">${pct}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================
// 14. RESULTS MANAGEMENT
// ============================================
function loadResults() {
  const cls = document.getElementById('resFilterClass').value;
  const subject = document.getElementById('resFilterSubject').value;
  if (!cls || !subject) { showToast('Please select class and subject.', 'warning'); return; }

  const students = DB.students.filter(s => s.class === cls);
  const tbody = document.getElementById('resultsTableBody');

  tbody.innerHTML = students.map(s => {
    const result = DB.results.find(r => r.studentId === s.id && r.subject === subject);
    const ct = result ? result.classTest : '';
    const mt = result ? result.midTerm : '';
    const fn = result ? result.final : '';
    const total = result ? result.total : '';

    return `
      <tr>
        <td>${s.roll}</td>
        <td>${s.fullName}</td>
        <td><input type="number" min="0" max="20" value="${ct}" class="marks-input" data-student="${s.id}" data-type="classTest" style="width:70px;padding:0.375rem;border:1px solid var(--border-strong);border-radius:var(--radius-sm);"></td>
        <td><input type="number" min="0" max="30" value="${mt}" class="marks-input" data-student="${s.id}" data-type="midTerm" style="width:70px;padding:0.375rem;border:1px solid var(--border-strong);border-radius:var(--radius-sm);"></td>
        <td><input type="number" min="0" max="50" value="${fn}" class="marks-input" data-student="${s.id}" data-type="final" style="width:70px;padding:0.375rem;border:1px solid var(--border-strong);border-radius:var(--radius-sm);"></td>
        <td><strong>${total || '-'}</strong></td>
        <td>${total ? getGPA(total).toFixed(2) : '-'}</td>
        <td>${total ? `<span class="badge ${getGradeClass(getGPA(total))}">${getGrade(getGPA(total))}</span>` : '-'}</td>
        <td>
          <button class="btn-icon" title="Save" onclick="saveSingleResult('${s.id}', '${subject}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function saveSingleResult(studentId, subject) {
  const row = document.querySelector(`.marks-input[data-student="${studentId}"]`);
  if (!row) return;
  const tr = row.closest('tr');
  const inputs = tr.querySelectorAll('.marks-input');
  const ct = parseInt(inputs[0]?.value) || 0;
  const mt = parseInt(inputs[1]?.value) || 0;
  const fn = parseInt(inputs[2]?.value) || 0;
  const total = ct + mt + fn;

  const idx = DB.results.findIndex(r => r.studentId === studentId && r.subject === subject);
  if (idx !== -1) {
    DB.results[idx] = { ...DB.results[idx], classTest: ct, midTerm: mt, final: fn, total };
  } else {
    DB.results.push({ studentId, subject, classTest: ct, midTerm: mt, final: fn, total });
  }

  showToast('Result saved!', 'success');
  loadResults();
}

function saveResults() { showToast('Results saved as draft.', 'info'); }
function publishResults() { showToast('Results published successfully!', 'success'); }

// ============================================
// 15. CLASS RESULTS
// ============================================
function loadClassResults() {
  const tbody = document.getElementById('classResultsTableBody');
  const dept = document.getElementById('clsResFilterDept')?.value;
  const cls = document.getElementById('clsResFilterClass')?.value;

  let students = [...DB.students];
  if (dept) students = students.filter(s => s.department === dept);
  if (cls) students = students.filter(s => s.class === cls);

  const results = students.map(s => {
    const studentResults = DB.results.filter(r => r.studentId === s.id);
    const avgTotal = studentResults.length > 0 ? Math.round(studentResults.reduce((sum, r) => sum + r.total, 0) / studentResults.length) : 0;
    const gpa = getGPA(avgTotal);
    return { ...s, totalMarks: avgTotal, gpa, grade: getGrade(gpa) };
  }).sort((a, b) => b.gpa - a.gpa);

  const summary = document.getElementById('classResultsSummary');
  const avgGPA = results.length > 0 ? (results.reduce((s, r) => s + r.gpa, 0) / results.length).toFixed(2) : '0.00';
  const passCount = results.filter(r => r.gpa >= 1.0).length;
  const failCount = results.length - passCount;

  summary.innerHTML = `
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:1.5rem;">
      <div class="stat-card glass"><div class="stat-icon blue"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="stat-info"><span class="stat-label">Total Students</span><span class="stat-value">${results.length}</span></div></div>
      <div class="stat-card glass"><div class="stat-icon green"><div class="stat-info"><span class="stat-label">Average GPA</span><span class="stat-value">${avgGPA}</span></div></div></div>
      <div class="stat-card glass"><div class="stat-icon blue"><div class="stat-info"><span class="stat-label">Passed</span><span class="stat-value">${passCount}</span></div></div></div>
      <div class="stat-card glass"><div class="stat-icon red"><div class="stat-info"><span class="stat-label">Failed</span><span class="stat-value">${failCount}</span></div></div></div>
    </div>
  `;

  if (results.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10"><div class="empty-state"><h3>No results to display</h3><p>Select filters and load results.</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = results.map((r, i) => `
    <tr>
      <td><strong>${i + 1}</strong></td>
      <td>${r.roll}</td>
      <td>${r.fullName}</td>
      <td>${r.id}</td>
      <td>Class ${r.class}</td>
      <td>${r.section}</td>
      <td>${r.totalMarks}</td>
      <td>${r.gpa.toFixed(2)}</td>
      <td><span class="badge ${getGradeClass(r.gpa)}">${r.grade}</span></td>
      <td>
        <button class="btn-icon" onclick="viewStudentProfile('${r.id}')" title="View">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function generateMeritList() {
  loadClassResults();
  showToast('Merit list generated!', 'success');
}

function generateFailList() {
  loadClassResults();
  showToast('Fail list generated!', 'success');
}

function downloadResultSheet(type) {
  showToast(`Downloading ${type.toUpperCase()} result sheet...`, 'info');
}

// ============================================
// 16. TEACHER MANAGEMENT
// ============================================
function renderTeachersTable() {
  const tbody = document.getElementById('teachersTableBody');
  const search = document.getElementById('teacherSearch')?.value?.toLowerCase();
  let teachers = [...DB.teachers];
  if (search) teachers = teachers.filter(t => t.name.toLowerCase().includes(search) || t.id.toLowerCase().includes(search));

  const paged = paginate(teachers, App.currentPage.teachers, App.perPage);

  tbody.innerHTML = paged.map(t => `
    <tr>
      <td><strong>${t.id}</strong></td>
      <td>${t.name}</td>
      <td><span class="badge badge-info">${capitalize(t.subject)}</span></td>
      <td>${t.assignedClasses.join(', ')}</td>
      <td>${t.qualification}</td>
      <td>${t.phone}</td>
      <td>${t.email}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" onclick="editTeacher('${t.id}')" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon danger" onclick="confirmDelete('teacher', '${t.id}')" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination('teachersPagination', teachers.length, App.currentPage.teachers, (page) => {
    App.currentPage.teachers = page;
    renderTeachersTable();
  });
}

function saveTeacher() {
  const name = document.getElementById('teacherName').value;
  const subject = document.getElementById('teacherSubject').value;
  const editId = document.getElementById('editTeacherId').value;

  if (!name || !subject) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const assignedClasses = Array.from(document.querySelectorAll('.teacher-class-check:checked')).map(c => c.value);

  if (editId) {
    const idx = DB.teachers.findIndex(t => t.id === editId);
    if (idx !== -1) {
      DB.teachers[idx] = {
        ...DB.teachers[idx],
        name, subject,
        qualification: document.getElementById('teacherQualification').value,
        phone: document.getElementById('teacherPhone').value,
        email: document.getElementById('teacherEmail').value,
        assignedClasses,
      };
      showToast('Teacher updated successfully!', 'success');
    }
  } else {
    const id = `TCH-${String(DB.teachers.length + 1).padStart(3, '0')}`;
    DB.teachers.push({
      id, name, subject,
      qualification: document.getElementById('teacherQualification').value,
      phone: document.getElementById('teacherPhone').value,
      email: document.getElementById('teacherEmail').value,
      joinDate: document.getElementById('teacherJoinDate').value,
      assignedClasses, status: 'active',
    });
    showToast('Teacher added successfully!', 'success');
  }

  closeModal('addTeacherModal');
  document.getElementById('teacherForm').reset();
  document.getElementById('editTeacherId').value = '';
  renderTeachersTable();
}

function editTeacher(teacherId) {
  const teacher = DB.teachers.find(t => t.id === teacherId);
  if (!teacher) return;

  document.getElementById('teacherModalTitle').textContent = 'Edit Teacher';
  document.getElementById('editTeacherId').value = teacher.id;
  document.getElementById('teacherName').value = teacher.name;
  document.getElementById('teacherSubject').value = teacher.subject;
  document.getElementById('teacherQualification').value = teacher.qualification;
  document.getElementById('teacherPhone').value = teacher.phone;
  document.getElementById('teacherEmail').value = teacher.email;
  document.getElementById('teacherJoinDate').value = teacher.joinDate;

  document.querySelectorAll('.teacher-class-check').forEach(cb => {
    cb.checked = teacher.assignedClasses.includes(cb.value);
  });

  openModal('addTeacherModal');
}

// ============================================
// 17. FEE MANAGEMENT
// ============================================
function renderFeeStructures() {
  const tbody = document.getElementById('feeStructureBody');
  tbody.innerHTML = DB.feeStructures.map(f => `
    <tr>
      <td><strong>Class ${f.class}</strong></td>
      <td>৳${f.admission.toLocaleString()}</td>
      <td>৳${f.monthly.toLocaleString()}</td>
      <td>৳${f.registration.toLocaleString()}</td>
      <td>৳${f.exam.toLocaleString()}</td>
      <td>৳${f.practical.toLocaleString()}</td>
      <td>৳${f.library.toLocaleString()}</td>
      <td>৳${f.transport.toLocaleString()}</td>
      <td>
        <button class="btn-icon" onclick="editFeeStructure('${f.class}')" title="Edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function editFeeStructure(cls) {
  const fee = DB.feeStructures.find(f => f.class === cls);
  if (!fee) return;
  document.getElementById('feeClass').value = fee.class;
  document.getElementById('feeAdmission').value = fee.admission;
  document.getElementById('feeMonthly').value = fee.monthly;
  document.getElementById('feeRegistration').value = fee.registration;
  document.getElementById('feeExam').value = fee.exam;
  document.getElementById('feePractical').value = fee.practical;
  document.getElementById('feeLibrary').value = fee.library;
  document.getElementById('feeTransport').value = fee.transport;
  openModal('addFeeStructureModal');
}

function saveFeeStructure() {
  const cls = document.getElementById('feeClass').value;
  if (!cls) { showToast('Please select a class.', 'error'); return; }

  const idx = DB.feeStructures.findIndex(f => f.class === cls);
  const data = {
    class: cls,
    admission: parseInt(document.getElementById('feeAdmission').value) || 0,
    monthly: parseInt(document.getElementById('feeMonthly').value) || 0,
    registration: parseInt(document.getElementById('feeRegistration').value) || 0,
    exam: parseInt(document.getElementById('feeExam').value) || 0,
    practical: parseInt(document.getElementById('feePractical').value) || 0,
    library: parseInt(document.getElementById('feeLibrary').value) || 0,
    transport: parseInt(document.getElementById('feeTransport').value) || 0,
  };

  if (idx !== -1) DB.feeStructures[idx] = data;
  else DB.feeStructures.push(data);

  closeModal('addFeeStructureModal');
  renderFeeStructures();
  showToast('Fee structure saved!', 'success');
}

// ============================================
// 18. PAYMENTS
// ============================================
function renderPaymentsTable() {
  const tbody = document.getElementById('paymentsTableBody');
  let payments = [...DB.payments];

  const status = document.getElementById('payFilterStatus')?.value;
  if (status) payments = payments.filter(p => p.status === status);

  const paged = paginate(payments, App.currentPage.payments, App.perPage);

  tbody.innerHTML = paged.map(p => `
    <tr>
      <td><strong>${p.receiptNo || '-'}</strong></td>
      <td>${p.studentName}</td>
      <td>${p.studentId}</td>
      <td><span class="badge badge-info">${capitalize(p.feeType)}</span></td>
      <td>৳${p.amount.toLocaleString()}</td>
      <td>৳${p.paid.toLocaleString()}</td>
      <td>৳${p.remaining.toLocaleString()}</td>
      <td>${formatDate(p.date)}</td>
      <td><span class="badge ${p.status === 'paid' ? 'badge-success' : p.status === 'partial' ? 'badge-warning' : 'badge-danger'}">${capitalize(p.status)}</span></td>
      <td>
        <div class="table-actions">
          ${p.status !== 'unpaid' ? `<button class="btn-icon" onclick="viewReceipt('${p.id}')" title="View Receipt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
          </button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination('paymentsPagination', payments.length, App.currentPage.payments, (page) => {
    App.currentPage.payments = page;
    renderPaymentsTable();
  });
}

function loadStudentFeeInfo() {
  const studentId = document.getElementById('payStudentId').value;
  const student = DB.students.find(s => s.id === studentId);
  const infoCard = document.getElementById('payStudentInfo');

  if (student) {
    infoCard.style.display = 'flex';
    infoCard.innerHTML = `
      <div class="avatar">${student.fullName.charAt(0)}</div>
      <div class="details">
        <h4>${student.fullName}</h4>
        <p>${student.id} | Class ${student.class} - Section ${student.section}</p>
      </div>
    `;
  } else {
    infoCard.style.display = 'none';
  }
}

function processPayment() {
  const studentId = document.getElementById('payStudentId').value;
  const feeType = document.getElementById('payFeeType').value;
  const amount = parseInt(document.getElementById('payAmount').value);

  if (!studentId || !feeType || !amount) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const student = DB.students.find(s => s.id === studentId);
  if (!student) { showToast('Student not found.', 'error'); return; }

  const receiptNo = `RCP-2025-${String(DB.nextPaymentNum).padStart(3, '0')}`;
  const now = new Date();

  DB.payments.push({
    id: receiptNo,
    studentId,
    studentName: student.fullName,
    feeType,
    amount,
    paid: amount,
    remaining: 0,
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status: 'paid',
    method: document.getElementById('payMethod').value,
    receiptNo,
  });

  DB.nextPaymentNum++;
  closeModal('collectPaymentModal');
  document.getElementById('paymentForm').reset();
  document.getElementById('payStudentInfo').style.display = 'none';
  showToast(`Payment of ৳${amount.toLocaleString()} collected successfully! Receipt: ${receiptNo}`, 'success');
  renderPaymentsTable();
}

function viewReceipt(paymentId) {
  const payment = DB.payments.find(p => p.id === paymentId);
  if (!payment) return;

  const container = document.getElementById('receiptContent');
  container.innerHTML = `
    <div class="receipt-header">
      <h2>🎓 Kanchkura College</h2>
      <p style="font-size:0.8125rem;color:var(--text-secondary);">Official Payment Receipt</p>
    </div>
    <div class="receipt-row"><span>Receipt No:</span><strong>${payment.receiptNo}</strong></div>
    <div class="receipt-row"><span>Date:</span><span>${formatDate(payment.date)}</span></div>
    <div class="receipt-row"><span>Time:</span><span>${payment.time || '-'}</span></div>
    <hr style="margin:0.75rem 0;border:none;border-top:1px dashed var(--border);">
    <div class="receipt-row"><span>Student Name:</span><span>${payment.studentName}</span></div>
    <div class="receipt-row"><span>Student ID:</span><span>${payment.studentId}</span></div>
    <div class="receipt-row"><span>Fee Type:</span><span>${capitalize(payment.feeType)} Fee</span></div>
    <hr style="margin:0.75rem 0;border:none;border-top:1px dashed var(--border);">
    <div class="receipt-row"><span>Amount:</span><span>৳${payment.amount.toLocaleString()}</span></div>
    <div class="receipt-row"><span>Payment Method:</span><span>${capitalize(payment.method || 'Cash')}</span></div>
    <div class="receipt-row receipt-total"><span>Total Paid:</span><span>৳${payment.paid.toLocaleString()}</span></div>
    <div class="receipt-footer">Thank you for your payment. This is a computer-generated receipt.<br>For queries, contact the accounts office.</div>
  `;

  openModal('receiptModal');
}

function printReceipt() { window.print(); }
function downloadReceiptPDF() { showToast('Downloading receipt PDF...', 'info'); }

// ============================================
// 19. NOTICES
// ============================================
function renderNotices() {
  const container = document.getElementById('noticesContainer');
  const sorted = [...DB.notices].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  container.innerHTML = sorted.map(n => `
    <div class="notice-card glass ${n.pinned ? 'pinned' : ''}">
      <div class="notice-header">
        <span class="notice-title">${n.title}</span>
        <span class="notice-category ${n.category}">${n.category}</span>
      </div>
      <div class="notice-content">${n.content}</div>
      <div class="notice-footer">
        <div>
          <span class="notice-date">📅 ${formatDate(n.date)} | By ${n.author}</span>
          ${n.pinned ? '<span class="pin-badge">📌 Pinned</span>' : ''}
        </div>
        <div class="notice-actions">
          <button class="btn-icon" onclick="editNotice(${n.id})" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon danger" onclick="confirmDelete('notice', ${n.id})" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function saveNotice() {
  const title = document.getElementById('noticeTitle').value;
  const content = document.getElementById('noticeContent').value;
  const editId = document.getElementById('editNoticeId').value;

  if (!title || !content) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const data = {
    title, content,
    category: document.getElementById('noticeCategory').value,
    date: document.getElementById('noticeDate').value || new Date().toISOString().split('T')[0],
    pinned: document.getElementById('noticePin').checked,
    author: App.currentUser?.name || 'Admin',
  };

  if (editId) {
    const idx = DB.notices.findIndex(n => n.id === parseInt(editId));
    if (idx !== -1) DB.notices[idx] = { ...DB.notices[idx], ...data };
    showToast('Notice updated!', 'success');
  } else {
    data.id = DB.nextNoticeId++;
    DB.notices.unshift(data);
    showToast('Notice published!', 'success');
  }

  closeModal('addNoticeModal');
  document.getElementById('noticeForm').reset();
  document.getElementById('editNoticeId').value = '';
  renderNotices();
}

function editNotice(noticeId) {
  const notice = DB.notices.find(n => n.id === noticeId);
  if (!notice) return;
  document.getElementById('editNoticeId').value = notice.id;
  document.getElementById('noticeTitle').value = notice.title;
  document.getElementById('noticeCategory').value = notice.category;
  document.getElementById('noticeContent').value = notice.content;
  document.getElementById('noticeDate').value = notice.date;
  document.getElementById('noticePin').checked = notice.pinned;
  openModal('addNoticeModal');
}

// ============================================
// 20. REPORTS
// ============================================
function generateReport(type) {
  const output = document.getElementById('reportOutput');
  const title = document.getElementById('reportTitle');
  const content = document.getElementById('reportContent');
  output.style.display = 'block';

  switch (type) {
    case 'daily-income':
      title.textContent = 'Daily Income Report';
      const todayPayments = DB.payments.filter(p => p.status === 'paid');
      const todayTotal = todayPayments.reduce((s, p) => s + p.paid, 0);
      content.innerHTML = `
        <div class="info-grid" style="margin-bottom:1rem;">
          <div class="info-item"><label>Date</label><span>${new Date().toLocaleDateString()}</span></div>
          <div class="info-item"><label>Total Collection</label><span>৳${todayTotal.toLocaleString()}</span></div>
        </div>
        <table class="data-table"><thead><tr><th>Receipt</th><th>Student</th><th>Fee Type</th><th>Amount</th><th>Method</th></tr></thead>
        <tbody>${todayPayments.map(p => `<tr><td>${p.receiptNo}</td><td>${p.studentName}</td><td>${capitalize(p.feeType)}</td><td>৳${p.paid.toLocaleString()}</td><td>${capitalize(p.method || 'Cash')}</td></tr>`).join('')}</tbody></table>`;
      break;

    case 'monthly-income':
      title.textContent = 'Monthly Income Report';
      content.innerHTML = `<div class="info-grid"><div class="info-item"><label>Total Monthly Income</label><span style="font-size:1.5rem;font-weight:700;">৳8,45,000</span></div><div class="info-item"><label>Growth</label><span style="color:var(--accent);">+15% from last month</span></div></div>`;
      break;

    case 'student':
      title.textContent = 'Student Report';
      content.innerHTML = `<div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:1rem;">
        <div class="info-item"><label>Total Students</label><span style="font-size:1.5rem;font-weight:700;">${DB.students.length}</span></div>
        <div class="info-item"><label>Science</label><span style="font-size:1.5rem;font-weight:700;">${DB.students.filter(s => s.department === 'science').length}</span></div>
        <div class="info-item"><label>Commerce</label><span style="font-size:1.5rem;font-weight:700;">${DB.students.filter(s => s.department === 'commerce').length}</span></div>
      </div>`;
      break;

    case 'attendance':
      title.textContent = 'Attendance Report';
      const total = DB.attendance.length;
      const present = DB.attendance.filter(a => a.status === 'present').length;
      content.innerHTML = `<div class="info-grid"><div class="info-item"><label>Total Records</label><span>${total}</span></div><div class="info-item"><label>Present Rate</label><span>${total ? Math.round((present / total) * 100) : 0}%</span></div></div>`;
      break;

    case 'result':
      title.textContent = 'Result Report';
      content.innerHTML = `<div class="info-grid"><div class="info-item"><label>Results Entered</label><span>${DB.results.length}</span></div><div class="info-item"><label>Students with Results</label><span>${new Set(DB.results.map(r => r.studentId)).size}</span></div></div>`;
      break;

    case 'payment':
      title.textContent = 'Payment Report';
      const totalPaid = DB.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.paid, 0);
      const totalPending = DB.payments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.remaining, 0);
      content.innerHTML = `<div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:1rem;">
        <div class="info-item"><label>Total Collected</label><span style="font-size:1.25rem;font-weight:700;color:var(--accent);">৳${totalPaid.toLocaleString()}</span></div>
        <div class="info-item"><label>Pending</label><span style="font-size:1.25rem;font-weight:700;color:var(--danger);">৳${totalPending.toLocaleString()}</span></div>
        <div class="info-item"><label>Total Payments</label><span style="font-size:1.25rem;font-weight:700;">${DB.payments.length}</span></div>
      </div>`;
      break;
  }
}

function printReport() { window.print(); }
function downloadReportPDF() { showToast('Downloading report PDF...', 'info'); }

// ============================================
// 21. MODALS
// ============================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

// Close modals on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
  }
});

// ============================================
// 22. CONFIRMATION DIALOG
// ============================================
let pendingDelete = null;

function confirmDelete(type, id) {
  pendingDelete = { type, id };
  document.getElementById('confirmTitle').textContent = `Delete ${capitalize(type)}?`;
  document.getElementById('confirmMessage').textContent = 'This action cannot be undone. Are you sure?';
  document.getElementById('confirmActionBtn').onclick = executeDelete;
  openModal('confirmModal');
}

function executeDelete() {
  if (!pendingDelete) return;
  const { type, id } = pendingDelete;

  switch (type) {
    case 'student':
      DB.students = DB.students.filter(s => s.id !== id);
      renderStudentsTable();
      break;
    case 'teacher':
      DB.teachers = DB.teachers.filter(t => t.id !== id);
      renderTeachersTable();
      break;
    case 'notice':
      DB.notices = DB.notices.filter(n => n.id !== id);
      renderNotices();
      break;
  }

  closeModal('confirmModal');
  pendingDelete = null;
  showToast(`${capitalize(type)} deleted successfully.`, 'success');
}

// ============================================
// 23. TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="removeToast(this.parentElement)">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => removeToast(toast), 5000);
}

function removeToast(toast) {
  if (!toast || !toast.parentElement) return;
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 300);
}

// ============================================
// 24. GLOBAL SEARCH
// ============================================
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.toLowerCase().trim();
      if (!query) return;

      const student = DB.students.find(s =>
        s.fullName.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)
      );

      if (student) {
        navigateTo('students');
        setTimeout(() => viewStudentProfile(student.id), 300);
        return;
      }

      const teacher = DB.teachers.find(t =>
        t.name.toLowerCase().includes(query) || t.id.toLowerCase().includes(query)
      );

      if (teacher) {
        navigateTo('teachers');
        return;
      }

      showToast('No results found for your search.', 'info');
    }
  });
}

// ============================================
// 25. PAGINATION
// ============================================
function paginate(array, page, perPage) {
  const start = (page - 1) * perPage;
  return array.slice(start, start + perPage);
}

function renderPagination(containerId, totalItems, currentPage, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.ceil(totalItems / App.perPage);
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = `<button ${currentPage === 1 ? 'disabled' : ''} onclick="event.preventDefault()">‹</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<button disabled>...</button>`;
    }
  }

  html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="event.preventDefault()">›</button>`;
  container.innerHTML = html;

  container.querySelectorAll('button[data-page]').forEach(btn => {
    btn.addEventListener('click', () => onPageChange(parseInt(btn.dataset.page)));
  });

  container.querySelector('button:first-child')?.addEventListener('click', () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  });
  container.querySelector('button:last-child')?.addEventListener('click', () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  });
}

// ============================================
// 26. SETTINGS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const settingsForm = document.getElementById('collegeInfoForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      DB.settings.collegeName = document.getElementById('settingsCollegeName').value;
      DB.settings.receiptFooter = document.getElementById('settingsReceiptFooter').value;
      showToast('Settings saved successfully!', 'success');
    });
  }
});

function exportBackup() {
  const data = JSON.stringify(DB, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kanchkura-erp-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup exported successfully!', 'success');
}

// ============================================
// 27. UTILITY FUNCTIONS
// ============================================
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getGPA(total) {
  if (total >= 80) return 5.0;
  if (total >= 70) return 4.0;
  if (total >= 60) return 3.5;
  if (total >= 50) return 3.0;
  if (total >= 40) return 2.0;
  if (total >= 33) return 1.0;
  return 0.0;
}

function getGrade(gpa) {
  if (gpa >= 5.0) return 'A+';
  if (gpa >= 4.0) return 'A';
  if (gpa >= 3.5) return 'A-';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.0) return 'D';
  return 'F';
}

function getGradeClass(gpa) {
  if (gpa >= 4.0) return 'badge-success';
  if (gpa >= 3.0) return 'badge-info';
  if (gpa >= 2.0) return 'badge-warning';
  return 'badge-danger';
}

// ============================================
// 28. MARKS INPUT AUTO-CALC
// ============================================
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('marks-input')) {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const inputs = tr.querySelectorAll('.marks-input');
    const ct = parseInt(inputs[0]?.value) || 0;
    const mt = parseInt(inputs[1]?.value) || 0;
    const fn = parseInt(inputs[2]?.value) || 0;
    const total = ct + mt + fn;

    // Update total display
    const totalCell = tr.querySelectorAll('td')[6];
    if (totalCell) totalCell.innerHTML = total > 0 ? `<strong>${total}</strong>` : '-';

    // Update GPA display
    const gpaCell = tr.querySelectorAll('td')[7];
    if (gpaCell) gpaCell.textContent = total > 0 ? getGPA(total).toFixed(2) : '-';

    // Update Grade display
    const gradeCell = tr.querySelectorAll('td')[8];
    if (gradeCell) {
      const gpa = getGPA(total);
      gradeCell.innerHTML = total > 0 ? `<span class="badge ${getGradeClass(gpa)}">${getGrade(gpa)}</span>` : '-';
    }
  }
});

// ============================================
// 29. NOTIFICATION BUTTON
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const notifBtn = document.getElementById('notificationBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast(`You have ${DB.notices.length} notices. Check the Notice Board.`, 'info');
    });
  }
});
