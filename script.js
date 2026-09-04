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

  auditLogs: [
    { id: 1, user: 'Super Admin', action: 'New Student Admission', details: 'Admitted Ariful Islam (Class 10 Science)', time: 'Today, 10:30 AM' },
    { id: 2, user: 'Kamal Hossain (Accounts)', action: 'Fee Collection', details: 'Collected ৳2,800 from Sabrina Akter (Receipt: RCP-2025-002)', time: 'Today, 11:00 AM' },
    { id: 3, user: 'Dr. Rafiq Ahmed', action: 'Results Published', details: 'Published Class 10 Science Section A Mid-Term Results', time: 'Yesterday, 04:00 PM' },
    { id: 4, user: 'Nusrat Jahan', action: 'Notice Published', details: 'Published "Annual Sports Day 2025"', time: 'Jan 10, 09:00 AM' },
    { id: 5, user: 'Super Admin', action: 'Teacher Added', details: 'Added Sabrina Akter as Physics Teacher', time: 'Jan 08, 02:00 PM' },
  ],

  nextStudentNum: 11,
  nextPaymentNum: 11,
  nextNoticeId: 7,
};

function addAuditLog(action, details) {
  if (!DB.auditLogs) DB.auditLogs = [];
  const log = {
    id: DB.auditLogs.length + 1,
    user: App.currentUser?.name || 'Authorized User',
    action,
    details,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
  };
  DB.auditLogs.unshift(log);
  saveDB();
}

// ============================================
// LOCAL STORAGE PERSISTENCE
// ============================================
function saveDB() {
  try {
    localStorage.setItem('kanchkura_college_db', JSON.stringify(DB));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

function loadDB() {
  try {
    const saved = localStorage.getItem('kanchkura_college_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(DB, parsed);
    }
  } catch (e) {
    console.warn('Could not load from localStorage', e);
  }
}

// ============================================
// 3. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadDB();
  initTheme();
  initLoginForm();
  initOTPInputs();
  initSidebar();
  initHeaderProfile();
  initGlobalSearch();
  setTodayDate();
  checkExistingSession();
});

function checkExistingSession() {
  try {
    const savedUser = sessionStorage.getItem('kanchkura_current_user');
    if (savedUser) {
      App.currentUser = JSON.parse(savedUser);
      loginSuccess(true);
    }
  } catch (e) {
    console.warn('Session restore failed:', e);
  }
}

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
    const email = (document.getElementById('loginEmail').value || '').trim();
    const password = (document.getElementById('loginPassword').value || '').trim();
    const role = (document.getElementById('loginRole')?.value || '').trim();

    // Match by email and password (case-insensitive email)
    let user = DB.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    // Fallback if role was also provided
    if (!user && role) {
      user = DB.users.find(u => u.role === role && u.password === password);
    }

    if (user) {
      App.currentUser = user;
      try {
        sessionStorage.setItem('kanchkura_current_user', JSON.stringify(user));
      } catch (err) {}
      loginSuccess(false);
    } else {
      showToast('Invalid email or password. Please try again.', 'error');
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

function quickLogin(email, password, role) {
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  const roleInput = document.getElementById('loginRole');
  if (emailInput) emailInput.value = email;
  if (passInput) passInput.value = password;
  if (roleInput && role) roleInput.value = role;

  let user = DB.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user && role) {
    user = DB.users.find(u => u.role === role);
  }

  if (user) {
    App.currentUser = user;
    try {
      sessionStorage.setItem('kanchkura_current_user', JSON.stringify(user));
    } catch (err) {}
    loginSuccess(false);
  }
}

function verify2FA() {
  const inputs = document.querySelectorAll('.otp-input');
  const code = Array.from(inputs).map(i => i.value).join('');
  if (code.length < 6) { showToast('Please enter the complete 6-digit code.', 'warning'); return; }
  closeModal('twoFactorModal');
  loginSuccess(false);
}

function loginSuccess(silent = false) {
  if (!App.currentUser) return;

  // Hide all login / auth overlays
  const appPages = ['loginPage', 'forgotPasswordPage', 'resetPasswordPage', 'sessionTimeoutPage', 'unauthorizedPage'];
  appPages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const twoFa = document.getElementById('twoFactorModal');
  if (twoFa) twoFa.classList.add('hidden');

  document.getElementById('mainApp').classList.remove('hidden');
  updateUserUI();
  navigateTo('dashboard');
  if (!silent) {
    showToast(`Welcome back, ${App.currentUser.name}!`, 'success');
  }
  startSessionTimer();
}

function logout() {
  App.currentUser = null;
  try {
    sessionStorage.removeItem('kanchkura_current_user');
  } catch (err) {}
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
    case 'results': loadResults(); break;
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
  const totalStudents = DB.students.length;
  const totalTeachers = DB.teachers.length;
  const totalPaid = DB.payments.filter(p => p.status === 'paid' || p.status === 'partial').reduce((s, p) => s + (p.paid || p.amount), 0);
  const totalDue = DB.payments.reduce((s, p) => s + (p.remaining || 0), 0) + 12000;

  const stuEl = document.getElementById('totalStudents');
  if (stuEl) stuEl.textContent = totalStudents.toLocaleString();
  const tchEl = document.getElementById('totalTeachers');
  if (tchEl) tchEl.textContent = totalTeachers.toLocaleString();

  // Financial stats
  const monthlyEl = document.querySelector('.finance-stats .stat-card:nth-child(1) .stat-value');
  if (monthlyEl) monthlyEl.textContent = `৳${totalPaid.toLocaleString()}`;
  const dueEl = document.querySelector('.finance-stats .stat-card:nth-child(2) .stat-value');
  if (dueEl) dueEl.textContent = `৳${totalDue.toLocaleString()}`;
  const collEl = document.querySelector('.finance-stats .stat-card:nth-child(3) .stat-value');
  if (collEl) collEl.textContent = `৳${totalPaid.toLocaleString()}`;
}

function renderRecentAdmissions() {
  const container = document.querySelector('#recentAdmissions .activity-list');
  if (!container) return;
  const recent = DB.students.slice(-4).reverse();
  container.innerHTML = recent.map(s => `
    <div class="activity-item" style="cursor:pointer;" onclick="viewStudentProfile('${s.id}')">
      <div class="activity-icon blue">🎓</div>
      <div class="activity-text">
        <strong>${s.fullName}</strong>
        <p>Class ${s.class} - ${capitalize(s.department)} (${s.session}) | Roll: ${s.roll}</p>
      </div>
      <span class="activity-time">${formatDate(s.admissionDate)}</span>
    </div>
  `).join('');
}

function renderRecentPayments() {
  const container = document.querySelector('#recentPayments .activity-list');
  if (!container) return;
  const recent = DB.payments.filter(p => p.status === 'paid' || p.status === 'partial').slice(-4).reverse();
  container.innerHTML = recent.map(p => `
    <div class="activity-item" style="cursor:pointer;" onclick="viewReceipt('${p.id}')">
      <div class="activity-icon green">💰</div>
      <div class="activity-text">
        <strong>${p.studentName}</strong>
        <p>৳${(p.paid || p.amount).toLocaleString()} - ${capitalize(p.feeType)} Fee (${p.receiptNo || 'RCP'})</p>
      </div>
      <span class="activity-time">${formatDate(p.date)}</span>
    </div>
  `).join('');
}

function renderRecentNotifications() {
  const container = document.querySelector('#recentNotifications .notification-list');
  if (!container) return;
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
  if (!container) return;
  const logs = (DB.auditLogs || []).slice(0, 6);
  container.innerHTML = logs.map((a, i) => `
    <div class="timeline-item ${i % 2 === 0 ? 'green' : 'orange'}">
      <h4><strong>${a.action}:</strong> ${a.details}</h4>
      <time><span style="color:var(--text-secondary);font-size:0.75rem;">👤 ${a.user} • </span>${a.time}</time>
    </div>
  `).join('');
}

function renderRecentResults() {
  const container = document.querySelector('#recentResults .activity-list');
  if (!container) return;
  container.innerHTML = `
    <div class="activity-item">
      <div class="activity-icon purple">📊</div>
      <div class="activity-text">
        <strong>Class 10 Science - Final Examination</strong>
        <p>Average GPA: 4.65 | Highest: 5.00 | Pass Rate: 100%</p>
      </div>
      <span class="activity-time">Published</span>
    </div>
    <div class="activity-item">
      <div class="activity-icon purple">📊</div>
      <div class="activity-text">
        <strong>Class 11 Commerce - Mid Term</strong>
        <p>Average GPA: 4.20 | Highest: 4.85 | Pass Rate: 92%</p>
      </div>
      <span class="activity-time">Published</span>
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
      <div class="card-header">
        <h3>Assigned Subjects & 4th Subject</h3>
      </div>
      <div class="card-body">
        <div class="subject-tags">
          ${subjects.map((s, idx) => `
            <span class="subject-tag ${student.department}">
              ${s} ${idx === subjects.length - 1 ? '<small style="opacity:0.8;">(4th/Optional)</small>' : '<small style="opacity:0.8;">(Compulsory)</small>'}
            </span>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Attendance History -->
    <div class="card glass" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <h3>Attendance History</h3>
      </div>
      <div class="card-body">
        ${(() => {
          const records = DB.attendance.filter(a => a.studentId === studentId);
          const present = records.filter(a => a.status === 'present').length;
          const absent = records.filter(a => a.status === 'absent').length;
          const late = records.filter(a => a.status === 'late').length;
          const total = records.length || 1;
          const pct = Math.round((present / total) * 100);
          return `
            <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:1rem;">
              <div class="info-item"><label>Total Days</label><span style="font-weight:700;">${records.length}</span></div>
              <div class="info-item"><label>Present</label><span style="color:var(--accent);font-weight:700;">${present}</span></div>
              <div class="info-item"><label>Absent</label><span style="color:var(--danger);font-weight:700;">${absent}</span></div>
              <div class="info-item"><label>Percentage</label><span style="font-size:1.25rem;font-weight:800;color:${pct >= 75 ? 'var(--accent)' : 'var(--danger)'};">${pct}%</span></div>
            </div>
            <div style="width:100%;height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:${pct >= 75 ? 'var(--accent)' : 'var(--danger)'};"></div>
            </div>
          `;
        })()}
      </div>
    </div>

    <!-- Fees & Payment History -->
    <div class="card glass" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <h3>Fee Payments & Receipts</h3>
        <button class="btn btn-primary btn-sm" onclick="openPaymentForStudent('${student.id}')">+ Collect Payment</button>
      </div>
      <div class="card-body">
        ${(() => {
          const studentPayments = DB.payments.filter(p => p.studentId === student.id || p.studentName === student.fullName);
          if (studentPayments.length === 0) {
            return '<p style="color:var(--text-secondary);font-size:0.875rem;">No payments recorded yet for this student.</p>';
          }
          return `
            <table class="data-table">
              <thead><tr><th>Receipt No</th><th>Fee Type</th><th>Amount</th><th>Paid</th><th>Date</th><th>Method</th><th>Action</th></tr></thead>
              <tbody>
                ${studentPayments.map(p => `
                  <tr>
                    <td><strong>${p.receiptNo || p.id}</strong></td>
                    <td><span class="badge badge-info">${capitalize(p.feeType)}</span></td>
                    <td>৳${p.amount.toLocaleString()}</td>
                    <td><strong style="color:var(--accent);">৳${p.paid.toLocaleString()}</strong></td>
                    <td>${formatDate(p.date)}</td>
                    <td>${capitalize(p.method || 'Cash')}</td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="viewReceipt('${p.id}')">
                        🖨️ View/Print Receipt
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        })()}
      </div>
    </div>

    <!-- Results Report Card -->
    <div class="card glass">
      <div class="card-header">
        <h3>Exam Results & Academic Report Card</h3>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Report Card</button>
      </div>
      <div class="card-body">
        ${studentResults.length > 0 ? `
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
        <div style="margin-top:1rem;padding:1rem;background:var(--bg-tertiary);border-radius:var(--radius-md);display:flex;justify-content:space-between;align-items:center;">
          <span>Average GPA: <strong>${(studentResults.reduce((s, r) => s + getGPA(r.total), 0) / studentResults.length).toFixed(2)}</strong></span>
          <span class="badge badge-success" style="font-size:0.9rem;padding:0.4rem 0.8rem;">Status: PASSED</span>
        </div>
        ` : '<p style="color:var(--text-secondary);font-size:0.875rem;">No exam results published yet.</p>'}
      </div>
    </div>
  `;

  // Show profile view
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-studentProfile').classList.remove('hidden');
  document.getElementById('pageTitle').textContent = 'Student Profile';
  document.getElementById('breadcrumb').textContent = `Home / Students / ${student.fullName}`;
}

function openPaymentForStudent(studentId) {
  openModal('collectPaymentModal');
  const stuInput = document.getElementById('payStudentId');
  if (stuInput) {
    stuInput.value = studentId;
    loadStudentFeeInfo();
  }
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
      addAuditLog('Student Updated', `Updated profile of ${fullName} (${editId})`);
      showToast('Student updated successfully!', 'success');
    }
  } else {
    // New admission
    const id = `KCC-2025-${String(DB.nextStudentNum).padStart(3, '0')}`;
    const maxRoll = Math.max(...DB.students.filter(s => s.class === cls && s.department === department).map(s => s.roll || 0), 0);
    const regNo = document.getElementById('stuRegNo').value || `REG-2025-${String(DB.nextStudentNum).padStart(3, '0')}`;
    const newStudent = { ...getStudentFormData(), id, roll: maxRoll + 1, regNo, admissionDate: new Date().toISOString().split('T')[0], status: 'active', photo: null };
    DB.students.push(newStudent);
    DB.nextStudentNum++;
    addAuditLog('New Admission', `Admitted ${fullName} into Class ${cls} (${capitalize(department)}) - ID: ${id}`);
    showToast(`Student admitted successfully! ID: ${id} | Roll: ${maxRoll + 1}`, 'success');
  }

  closeModal('addStudentModal');
  document.getElementById('studentForm').reset();
  document.getElementById('editStudentId').value = '';
  saveDB();
  renderStudentsTable();
  renderAdmissionsTable();
  renderDashboardStats();
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
  const date = document.getElementById('attendanceDate').value || new Date().toISOString().split('T')[0];
  if (!cls || !section) { showToast('Please select class and section.', 'warning'); return; }

  const students = DB.students.filter(s => s.class === cls && s.section === section);
  const container = document.getElementById('attendanceTableContainer');
  const tbody = document.getElementById('attendanceTableBody');

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4"><div class="empty-state"><h3>No students found for this class and section</h3></div></td></tr>';
    container.style.display = 'block';
    return;
  }

  tbody.innerHTML = students.map(s => {
    const existing = DB.attendance.find(a => a.studentId === s.id && a.date === date);
    const currentStatus = existing ? existing.status : 'present';
    return `
      <tr>
        <td><strong>${s.roll}</strong></td>
        <td>${s.fullName}</td>
        <td>${s.id}</td>
        <td>
          <select class="attendance-select" data-student-id="${s.id}" style="padding:0.4rem 0.8rem;border-radius:var(--radius-sm);border:1px solid var(--border-strong);font-size:0.875rem;font-weight:500;">
            <option value="present" ${currentStatus === 'present' ? 'selected' : ''}>✅ Present</option>
            <option value="absent" ${currentStatus === 'absent' ? 'selected' : ''}>❌ Absent</option>
            <option value="late" ${currentStatus === 'late' ? 'selected' : ''}>⏱️ Late</option>
            <option value="leave" ${currentStatus === 'leave' ? 'selected' : ''}>📝 Leave</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');

  container.style.display = 'block';
}

function markAllAttendance(status) {
  const selects = document.querySelectorAll('.attendance-select');
  selects.forEach(sel => sel.value = status);
  showToast(`Marked all as ${status.toUpperCase()}`, 'info');
}

function loadAttendanceFromModal() {
  const modalCls = document.getElementById('attModalClass')?.value;
  const modalSec = document.getElementById('attModalSection')?.value;
  const modalDate = document.getElementById('attModalDate')?.value;

  if (modalCls) document.getElementById('attFilterClass').value = modalCls;
  if (modalSec) document.getElementById('attFilterSection').value = modalSec;
  if (modalDate) document.getElementById('attendanceDate').value = modalDate;

  navigateTo('attendance');
  setTimeout(() => loadAttendance(), 300);
}

function saveAttendance() {
  const date = document.getElementById('attendanceDate').value || new Date().toISOString().split('T')[0];
  const cls = document.getElementById('attFilterClass').value;
  const section = document.getElementById('attFilterSection').value;

  const selects = document.querySelectorAll('.attendance-select');
  if (selects.length === 0) { showToast('No attendance records to save.', 'warning'); return; }

  let count = 0;
  selects.forEach(sel => {
    const studentId = sel.dataset.studentId;
    const status = sel.value;
    const existing = DB.attendance.findIndex(a => a.studentId === studentId && a.date === date);
    if (existing !== -1) {
      DB.attendance[existing].status = status;
    } else {
      DB.attendance.push({ studentId, date, status });
    }
    count++;
  });

  saveDB();
  addAuditLog('Attendance Taken', `Marked attendance for ${count} students of Class ${cls}-${section} (${date})`);
  showToast(`Attendance for ${count} students saved successfully!`, 'success');
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
// 14. RESULTS MANAGEMENT & MARKS ENTRY
// ============================================
function loadResults() {
  const clsEl = document.getElementById('resFilterClass');
  const subjEl = document.getElementById('resFilterSubject');
  const examEl = document.getElementById('resFilterExam');

  if (clsEl && !clsEl.value) clsEl.value = '10';
  if (subjEl && !subjEl.value) subjEl.value = 'bangla';
  if (examEl && !examEl.value) examEl.value = 'final';

  const cls = clsEl?.value || '10';
  const subject = subjEl?.value || 'bangla';
  const exam = examEl?.value || 'final';

  const students = DB.students.filter(s => s.class === cls);
  const tbody = document.getElementById('resultsTableBody');
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><h3>No students found for this class</h3></div></td></tr>';
    return;
  }

  tbody.innerHTML = students.map(s => {
    const result = DB.results.find(r => r.studentId === s.id && r.subject.toLowerCase() === subject.toLowerCase());
    const ct = result ? result.classTest : 15;
    const mt = result ? result.midTerm : 22;
    const fn = result ? result.final : 40;
    const total = ct + mt + fn;
    const gpa = getGPA(total);

    return `
      <tr>
        <td><strong>${s.roll}</strong></td>
        <td>${s.fullName}</td>
        <td><input type="number" min="0" max="20" value="${ct}" class="marks-input ct-input" data-student="${s.id}" style="width:70px;padding:0.4rem;border:1px solid var(--border-strong);border-radius:var(--radius-sm);" oninput="recalcRowMarks(this)"></td>
        <td><input type="number" min="0" max="30" value="${mt}" class="marks-input mt-input" data-student="${s.id}" style="width:70px;padding:0.4rem;border:1px solid var(--border-strong);border-radius:var(--radius-sm);" oninput="recalcRowMarks(this)"></td>
        <td><input type="number" min="0" max="50" value="${fn}" class="marks-input fn-input" data-student="${s.id}" style="width:70px;padding:0.4rem;border:1px solid var(--border-strong);border-radius:var(--radius-sm);" oninput="recalcRowMarks(this)"></td>
        <td class="total-cell"><strong>${total}</strong></td>
        <td class="gpa-cell">${gpa.toFixed(2)}</td>
        <td class="grade-cell"><span class="badge ${getGradeClass(gpa)}">${getGrade(gpa)}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" title="Save this mark" onclick="saveSingleResult('${s.id}', '${subject}')">
            💾 Save
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function recalcRowMarks(input) {
  const tr = input.closest('tr');
  const ct = parseInt(tr.querySelector('.ct-input')?.value) || 0;
  const mt = parseInt(tr.querySelector('.mt-input')?.value) || 0;
  const fn = parseInt(tr.querySelector('.fn-input')?.value) || 0;
  const total = Math.min(100, ct + mt + fn);
  const gpa = getGPA(total);
  const grade = getGrade(gpa);

  tr.querySelector('.total-cell').innerHTML = `<strong>${total}</strong>`;
  tr.querySelector('.gpa-cell').textContent = gpa.toFixed(2);
  tr.querySelector('.grade-cell').innerHTML = `<span class="badge ${getGradeClass(gpa)}">${grade}</span>`;
}

function saveSingleResult(studentId, subject) {
  const tr = document.querySelector(`.marks-input[data-student="${studentId}"]`)?.closest('tr');
  if (!tr) return;

  const ct = parseInt(tr.querySelector('.ct-input')?.value) || 0;
  const mt = parseInt(tr.querySelector('.mt-input')?.value) || 0;
  const fn = parseInt(tr.querySelector('.fn-input')?.value) || 0;
  const total = Math.min(100, ct + mt + fn);

  const idx = DB.results.findIndex(r => r.studentId === studentId && r.subject.toLowerCase() === subject.toLowerCase());
  if (idx !== -1) {
    DB.results[idx] = { ...DB.results[idx], classTest: ct, midTerm: mt, final: fn, total };
  } else {
    DB.results.push({ studentId, subject, classTest: ct, midTerm: mt, final: fn, total });
  }

  saveDB();
  addAuditLog('Marks Saved', `Saved ${capitalize(subject)} marks for student ${studentId} (Total: ${total})`);
  showToast('Result saved successfully!', 'success');
}

function saveResults() {
  const subject = document.getElementById('resFilterSubject')?.value || 'bangla';
  const rows = document.querySelectorAll('#resultsTableBody tr');
  let count = 0;

  rows.forEach(tr => {
    const input = tr.querySelector('.marks-input');
    if (!input) return;
    const studentId = input.dataset.student;
    const ct = parseInt(tr.querySelector('.ct-input')?.value) || 0;
    const mt = parseInt(tr.querySelector('.mt-input')?.value) || 0;
    const fn = parseInt(tr.querySelector('.fn-input')?.value) || 0;
    const total = Math.min(100, ct + mt + fn);

    const idx = DB.results.findIndex(r => r.studentId === studentId && r.subject.toLowerCase() === subject.toLowerCase());
    if (idx !== -1) {
      DB.results[idx] = { ...DB.results[idx], classTest: ct, midTerm: mt, final: fn, total };
    } else {
      DB.results.push({ studentId, subject, classTest: ct, midTerm: mt, final: fn, total });
    }
    count++;
  });

  saveDB();
  addAuditLog('Marks Draft Saved', `Saved draft marks for ${count} students (${capitalize(subject)})`);
  showToast(`Draft marks for ${count} students saved!`, 'info');
}

function publishResults() {
  saveResults();
  const cls = document.getElementById('resFilterClass')?.value || '10';
  const subject = document.getElementById('resFilterSubject')?.value || 'bangla';
  addAuditLog('Results Published', `Published Class ${cls} ${capitalize(subject)} examination results`);
  showToast(`Results for Class ${cls} (${capitalize(subject)}) published successfully!`, 'success');
}

// Marks Entry in Modal
function loadMarksModalStudents() {
  const cls = document.getElementById('marksClass')?.value;
  const subject = document.getElementById('marksSubject')?.value;
  const tbody = document.getElementById('marksTableBody');
  if (!tbody || !cls) return;

  const students = DB.students.filter(s => s.class === cls);
  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3"><p style="padding:1rem;color:var(--text-secondary);">No students found for this class.</p></td></tr>';
    return;
  }

  tbody.innerHTML = students.map(s => {
    const res = DB.results.find(r => r.studentId === s.id && r.subject === subject);
    const val = res ? res.final : 40;
    return `
      <tr>
        <td><strong>${s.roll}</strong></td>
        <td>${s.fullName} (${s.id})</td>
        <td><input type="number" min="0" max="100" value="${val}" class="modal-mark-input" data-student="${s.id}" style="width:100px;padding:0.4rem;border:1px solid var(--border-strong);border-radius:var(--radius-sm);"></td>
      </tr>
    `;
  }).join('');
}

function saveMarks() {
  const cls = document.getElementById('marksClass')?.value;
  const subject = document.getElementById('marksSubject')?.value;
  const exam = document.getElementById('marksExamType')?.value;
  const inputs = document.querySelectorAll('.modal-mark-input');

  if (!cls || !subject || inputs.length === 0) {
    showToast('Please select class and subject and enter marks.', 'warning');
    return;
  }

  inputs.forEach(inp => {
    const studentId = inp.dataset.student;
    const mark = parseInt(inp.value) || 0;
    const idx = DB.results.findIndex(r => r.studentId === studentId && r.subject.toLowerCase() === subject.toLowerCase());
    if (idx !== -1) {
      DB.results[idx].final = mark;
      DB.results[idx].total = (DB.results[idx].classTest || 15) + (DB.results[idx].midTerm || 20) + mark;
    } else {
      DB.results.push({ studentId, subject, classTest: 15, midTerm: 20, final: mark, total: 35 + mark });
    }
  });

  saveDB();
  addAuditLog('Marks Entered via Modal', `Entered ${capitalize(subject)} marks for Class ${cls} (${inputs.length} students)`);
  showToast(`Marks saved for ${inputs.length} students!`, 'success');
  closeModal('enterMarksModal');
  loadResults();
}

// ============================================
// 15. CLASS RESULTS & TABULATION SHEET
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
    const avgTotal = studentResults.length > 0 ? Math.round(studentResults.reduce((sum, r) => sum + r.total, 0) / studentResults.length) : 75;
    const gpa = getGPA(avgTotal);
    return { ...s, totalMarks: avgTotal, gpa, grade: getGrade(gpa) };
  }).sort((a, b) => b.gpa - a.gpa || b.totalMarks - a.totalMarks);

  const summary = document.getElementById('classResultsSummary');
  const avgGPA = results.length > 0 ? (results.reduce((s, r) => s + r.gpa, 0) / results.length).toFixed(2) : '0.00';
  const passCount = results.filter(r => r.gpa >= 1.0).length;
  const failCount = results.length - passCount;

  if (summary) {
    summary.innerHTML = `
      <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:1.5rem;">
        <div class="stat-card glass"><div class="stat-icon blue">🎓</div><div class="stat-info"><span class="stat-label">Total Students</span><span class="stat-value">${results.length}</span></div></div>
        <div class="stat-card glass"><div class="stat-icon green"><div class="stat-info"><span class="stat-label">Average GPA</span><span class="stat-value">${avgGPA}</span></div></div></div>
        <div class="stat-card glass"><div class="stat-icon blue"><div class="stat-info"><span class="stat-label">Passed</span><span class="stat-value" style="color:var(--accent);">${passCount}</span></div></div></div>
        <div class="stat-card glass"><div class="stat-icon red"><div class="stat-info"><span class="stat-label">Failed</span><span class="stat-value" style="color:var(--danger);">${failCount}</span></div></div></div>
      </div>
    `;
  }

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
      <td><strong>${r.totalMarks}</strong></td>
      <td><strong>${r.gpa.toFixed(2)}</strong></td>
      <td><span class="badge ${getGradeClass(r.gpa)}">${r.grade}</span></td>
      <td>
        <button class="btn-icon" onclick="viewStudentProfile('${r.id}')" title="View Profile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function generateMeritList() {
  loadClassResults();
  showToast('🏆 Merit list generated and sorted by highest GPA!', 'success');
}

function generateFailList() {
  const tbody = document.getElementById('classResultsTableBody');
  const dept = document.getElementById('clsResFilterDept')?.value;
  const cls = document.getElementById('clsResFilterClass')?.value;

  let students = [...DB.students];
  if (dept) students = students.filter(s => s.department === dept);
  if (cls) students = students.filter(s => s.class === cls);

  const results = students.map(s => {
    const studentResults = DB.results.filter(r => r.studentId === s.id);
    const avgTotal = studentResults.length > 0 ? Math.round(studentResults.reduce((sum, r) => sum + r.total, 0) / studentResults.length) : 75;
    const gpa = getGPA(avgTotal);
    return { ...s, totalMarks: avgTotal, gpa, grade: getGrade(gpa) };
  }).filter(r => r.gpa < 1.0 || r.grade === 'F');

  if (results.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10"><div class="empty-state" style="padding:2rem;"><h3 style="color:var(--accent);">🎉 All Students Passed!</h3><p>No students in the fail list for this selection.</p></div></td></tr>';
    showToast('All students passed!', 'success');
    return;
  }

  tbody.innerHTML = results.map((r, i) => `
    <tr style="background:rgba(239, 68, 68, 0.06);">
      <td><strong style="color:var(--danger);">${i + 1}</strong></td>
      <td>${r.roll}</td>
      <td>${r.fullName}</td>
      <td>${r.id}</td>
      <td>Class ${r.class}</td>
      <td>${r.section}</td>
      <td>${r.totalMarks}</td>
      <td style="color:var(--danger); font-weight:700;">${r.gpa.toFixed(2)}</td>
      <td><span class="badge badge-danger">${r.grade}</span></td>
      <td>
        <button class="btn-icon" onclick="viewStudentProfile('${r.id}')" title="View Profile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </td>
    </tr>
  `).join('');
  showToast(`Found ${results.length} students in fail list.`, 'warning');
}

function downloadResultSheet(type) {
  if (type === 'excel') {
    const dept = document.getElementById('clsResFilterDept')?.value || 'All';
    const cls = document.getElementById('clsResFilterClass')?.value || 'All';
    let students = [...DB.students];
    if (dept && dept !== 'All') students = students.filter(s => s.department === dept);
    if (cls && cls !== 'All') students = students.filter(s => s.class === cls);

    const results = students.map(s => {
      const studentResults = DB.results.filter(r => r.studentId === s.id);
      const avgTotal = studentResults.length > 0 ? Math.round(studentResults.reduce((sum, r) => sum + r.total, 0) / studentResults.length) : 75;
      const gpa = getGPA(avgTotal);
      return { ...s, totalMarks: avgTotal, gpa, grade: getGrade(gpa) };
    }).sort((a, b) => b.gpa - a.gpa);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Position,Roll,Student Name,Student ID,Class,Section,Department,Total Marks,GPA,Grade,Status\n";
    results.forEach((r, idx) => {
      const status = r.gpa >= 1.0 ? 'Pass' : 'Fail';
      csvContent += `${idx + 1},${r.roll},"${r.fullName}",${r.id},Class ${r.class},${r.section},${capitalize(r.department)},${r.totalMarks},${r.gpa.toFixed(2)},${r.grade},${status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Kanchkura_College_Results_Class_${cls}_${dept}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Result sheet exported as Excel CSV!', 'success');
  } else if (type === 'pdf') {
    window.print();
  }
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
  saveDB();
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

  saveDB();
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
  const studentId = document.getElementById('payStudentId').value.trim();
  const student = DB.students.find(s => s.id.toLowerCase() === studentId.toLowerCase() || s.roll.toString() === studentId);
  const infoCard = document.getElementById('payStudentInfo');

  if (student) {
    infoCard.style.display = 'flex';
    infoCard.innerHTML = `
      <div class="avatar" style="width:42px;height:42px;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;">${student.fullName.charAt(0)}</div>
      <div class="details">
        <h4 style="margin:0;font-size:0.95rem;">${student.fullName}</h4>
        <p style="margin:0;font-size:0.8rem;color:var(--text-secondary);">${student.id} | Class ${student.class} - Section ${student.section} (${capitalize(student.department)}) | Roll: ${student.roll}</p>
      </div>
    `;
    updatePayFeeAmount();
  } else {
    infoCard.style.display = 'none';
    const dueEl = document.getElementById('payAmountDue');
    if (dueEl) dueEl.value = '';
  }
}

function updatePayFeeAmount() {
  const studentId = document.getElementById('payStudentId')?.value.trim();
  const feeType = document.getElementById('payFeeType')?.value || 'monthly';
  const student = DB.students.find(s => s.id.toLowerCase() === studentId?.toLowerCase() || s.roll.toString() === studentId);

  if (student) {
    const feeStruct = DB.feeStructures.find(f => f.class === student.class) || DB.feeStructures[0];
    const amount = feeStruct ? (feeStruct[feeType] || feeStruct.monthly || 3000) : 3000;
    const dueEl = document.getElementById('payAmountDue');
    const payEl = document.getElementById('payAmount');
    if (dueEl) dueEl.value = amount;
    if (payEl && (!payEl.value || payEl.value === '0')) payEl.value = amount;
  }
}

function processPayment() {
  const studentId = document.getElementById('payStudentId').value.trim();
  const feeType = document.getElementById('payFeeType').value;
  const payAmount = parseInt(document.getElementById('payAmount').value) || 0;
  const totalAmount = parseInt(document.getElementById('payAmountDue').value) || payAmount;

  if (!studentId || !feeType || payAmount <= 0) {
    showToast('Please enter a valid student ID and pay amount.', 'error');
    return;
  }

  const student = DB.students.find(s => s.id.toLowerCase() === studentId.toLowerCase() || s.roll.toString() === studentId);
  if (!student) { showToast('Student not found.', 'error'); return; }

  const receiptNo = `RCP-2025-${String(DB.nextPaymentNum).padStart(3, '0')}`;
  const now = new Date();
  const remaining = Math.max(0, totalAmount - payAmount);
  const status = remaining === 0 ? 'paid' : (payAmount > 0 ? 'partial' : 'unpaid');
  const method = document.getElementById('payMethod')?.value || 'cash';

  const newPayment = {
    id: receiptNo,
    studentId: student.id,
    studentName: student.fullName,
    feeType,
    amount: totalAmount,
    paid: payAmount,
    remaining,
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status,
    method,
    receiptNo,
  };

  DB.payments.unshift(newPayment);
  DB.nextPaymentNum++;
  saveDB();
  addAuditLog('Fee Collected', `Collected ৳${payAmount.toLocaleString()} (${capitalize(feeType)} Fee) from ${student.fullName} (Receipt: ${receiptNo})`);

  closeModal('collectPaymentModal');
  document.getElementById('paymentForm').reset();
  document.getElementById('payStudentInfo').style.display = 'none';
  showToast(`Payment of ৳${payAmount.toLocaleString()} collected! Receipt: ${receiptNo}`, 'success');
  renderPaymentsTable();
  renderDashboardStats();

  // Auto show official receipt
  setTimeout(() => viewReceipt(receiptNo), 400);
}

function viewReceipt(paymentId) {
  const payment = DB.payments.find(p => p.id === paymentId || p.receiptNo === paymentId);
  if (!payment) return;

  const student = DB.students.find(s => s.id === payment.studentId || s.fullName === payment.studentName) || { class: '10', section: 'A', department: 'Science', roll: 1 };
  const container = document.getElementById('receiptContent');

  container.innerHTML = `
    <div class="receipt-header" style="text-align:center;border-bottom:2px solid var(--accent);padding-bottom:1rem;margin-bottom:1rem;">
      <div style="font-size:2.5rem;margin-bottom:0.25rem;">🎓</div>
      <h2 style="margin:0;font-size:1.5rem;color:var(--text-primary);">${DB.settings?.collegeName || 'Kanchkura College'}</h2>
      <p style="margin:0.25rem 0;font-size:0.85rem;color:var(--text-secondary);">Kanchkura, Kishoreganj, Bangladesh | Phone: 01700-000000</p>
      <div style="display:inline-block;margin-top:0.5rem;padding:0.25rem 0.75rem;background:var(--accent);color:white;border-radius:20px;font-size:0.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Official Money Receipt</div>
    </div>

    <div style="display:flex;justify-content:space-between;margin-bottom:0.75rem;font-size:0.875rem;">
      <div><span>Receipt No: </span><strong style="color:var(--accent);">${payment.receiptNo || payment.id}</strong></div>
      <div><span>Date: </span><strong>${formatDate(payment.date)} ${payment.time || ''}</strong></div>
    </div>

    <div style="background:var(--bg-tertiary);padding:0.75rem 1rem;border-radius:var(--radius-sm);margin-bottom:1rem;font-size:0.875rem;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
        <div><span>Student Name: </span><strong>${payment.studentName}</strong></div>
        <div><span>Student ID: </span><strong>${payment.studentId}</strong></div>
        <div><span>Class & Section: </span><strong>Class ${student.class} (${student.section || 'A'})</strong></div>
        <div><span>Department: </span><strong>${capitalize(student.department || 'Science')}</strong></div>
      </div>
    </div>

    <table class="data-table" style="margin-bottom:1rem;">
      <thead>
        <tr><th>Description</th><th style="text-align:right;">Amount (৳)</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>${capitalize(payment.feeType)} Fee</td>
          <td style="text-align:right;">৳${payment.amount.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Fine / Late Fee</td>
          <td style="text-align:right;">৳0</td>
        </tr>
        <tr>
          <td>Discount / Waiver</td>
          <td style="text-align:right;">-৳0</td>
        </tr>
        <tr style="font-weight:700;background:var(--bg-secondary);">
          <td>Total Payable</td>
          <td style="text-align:right;">৳${payment.amount.toLocaleString()}</td>
        </tr>
        <tr style="font-weight:800;color:var(--accent);font-size:1rem;background:var(--bg-tertiary);">
          <td>Paid Amount (${capitalize(payment.method || 'Cash')})</td>
          <td style="text-align:right;">৳${payment.paid.toLocaleString()}</td>
        </tr>
        ${payment.remaining > 0 ? `
        <tr style="font-weight:700;color:var(--danger);">
          <td>Remaining Due Balance</td>
          <td style="text-align:right;">৳${payment.remaining.toLocaleString()}</td>
        </tr>` : ''}
      </tbody>
    </table>

    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:2rem;padding-top:1.5rem;border-top:1px dashed var(--border);">
      <div style="text-align:center;">
        <div style="border-top:1px solid var(--text-secondary);width:140px;margin-bottom:0.25rem;"></div>
        <span style="font-size:0.75rem;color:var(--text-secondary);">Student / Guardian</span>
      </div>
      <div style="text-align:center;">
        <div style="font-size:1.1rem;color:var(--accent);font-family:cursive;margin-bottom:0.25rem;">Rafiq Ahmed</div>
        <div style="border-top:1px solid var(--text-secondary);width:140px;margin-bottom:0.25rem;"></div>
        <span style="font-size:0.75rem;color:var(--text-secondary);">Principal / Accounts Officer</span>
      </div>
    </div>

    <div class="receipt-footer" style="margin-top:1.5rem;font-size:0.75rem;text-align:center;color:var(--text-tertiary);">
      ${DB.settings?.receiptFooter || 'Thank you for your payment. This is a computer-generated official receipt.'}
    </div>
  `;

  openModal('receiptModal');
}

function printReceipt() {
  window.print();
}

function downloadReceiptPDF() {
  window.print();
}

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
  saveDB();
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
// 20. REPORTS & ANALYTICS
// ============================================
function generateReport(type) {
  const output = document.getElementById('reportOutput');
  const title = document.getElementById('reportTitle');
  const content = document.getElementById('reportContent');
  if (!output || !title || !content) return;
  output.style.display = 'block';

  switch (type) {
    case 'daily-income':
      title.textContent = 'Daily Income & Fee Collection Report';
      const todayPayments = DB.payments.filter(p => p.status === 'paid' || p.status === 'partial');
      const todayTotal = todayPayments.reduce((s, p) => s + (p.paid || p.amount), 0);
      content.innerHTML = `
        <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:1.5rem;">
          <div class="info-item"><label>Report Date</label><span style="font-weight:700;">${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</span></div>
          <div class="info-item"><label>Total Collections Today</label><span style="font-size:1.4rem;font-weight:800;color:var(--accent);">৳${todayTotal.toLocaleString()}</span></div>
          <div class="info-item"><label>Receipts Generated</label><span style="font-size:1.4rem;font-weight:800;">${todayPayments.length}</span></div>
        </div>
        <table class="data-table">
          <thead><tr><th>Receipt No</th><th>Student Name</th><th>Student ID</th><th>Fee Type</th><th>Paid Amount</th><th>Method</th></tr></thead>
          <tbody>
            ${todayPayments.map(p => `
              <tr>
                <td><strong>${p.receiptNo || p.id}</strong></td>
                <td>${p.studentName}</td>
                <td>${p.studentId}</td>
                <td><span class="badge badge-info">${capitalize(p.feeType)}</span></td>
                <td><strong>৳${(p.paid || p.amount).toLocaleString()}</strong></td>
                <td>${capitalize(p.method || 'Cash')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      break;

    case 'monthly-income':
      title.textContent = 'Monthly Financial Summary & Trend Report';
      const allPaid = DB.payments.filter(p => p.status === 'paid' || p.status === 'partial');
      const monthlyTotal = allPaid.reduce((s, p) => s + (p.paid || p.amount), 0);
      const monthlyDue = DB.payments.reduce((s, p) => s + (p.remaining || 0), 0) + 15000;
      content.innerHTML = `
        <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:1.5rem;">
          <div class="info-item"><label>Total Collected This Month</label><span style="font-size:1.5rem;font-weight:800;color:var(--accent);">৳${monthlyTotal.toLocaleString()}</span></div>
          <div class="info-item"><label>Pending Due Balance</label><span style="font-size:1.5rem;font-weight:800;color:var(--danger);">৳${monthlyDue.toLocaleString()}</span></div>
          <div class="info-item"><label>Collection Rate</label><span style="font-size:1.5rem;font-weight:800;color:var(--info);">91.4%</span></div>
        </div>
        <table class="data-table">
          <thead><tr><th>Fee Category</th><th>Total Collected</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Monthly Tuition Fees</td><td>৳${Math.round(monthlyTotal * 0.6).toLocaleString()}</td><td><span class="badge badge-success">On Track</span></td></tr>
            <tr><td>Admission Fees</td><td>৳${Math.round(monthlyTotal * 0.25).toLocaleString()}</td><td><span class="badge badge-success">Active</span></td></tr>
            <tr><td>Examination Fees</td><td>৳${Math.round(monthlyTotal * 0.15).toLocaleString()}</td><td><span class="badge badge-info">Completed</span></td></tr>
          </tbody>
        </table>
      `;
      break;

    case 'student':
      title.textContent = 'Student Enrollment & Demographics Report';
      const sc = DB.students.filter(s => s.department === 'science').length;
      const com = DB.students.filter(s => s.department === 'commerce').length;
      const hum = DB.students.filter(s => s.department === 'humanities').length;
      const male = DB.students.filter(s => s.gender === 'Male').length;
      const female = DB.students.filter(s => s.gender === 'Female').length;
      content.innerHTML = `
        <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:1.5rem;">
          <div class="info-item"><label>Total Enrolled</label><span style="font-size:1.5rem;font-weight:800;">${DB.students.length}</span></div>
          <div class="info-item"><label>Science Department</label><span style="font-size:1.5rem;font-weight:800;color:var(--info);">${sc}</span></div>
          <div class="info-item"><label>Commerce Department</label><span style="font-size:1.5rem;font-weight:800;color:var(--accent);">${com}</span></div>
          <div class="info-item"><label>Humanities Department</label><span style="font-size:1.5rem;font-weight:800;color:var(--warning);">${hum}</span></div>
        </div>
        <div style="padding:1rem;background:var(--bg-tertiary);border-radius:var(--radius-sm);display:flex;gap:2rem;">
          <span>👨 Male Students: <strong>${male}</strong> (${Math.round((male/DB.students.length)*100)}%)</span>
          <span>👩 Female Students: <strong>${female}</strong> (${Math.round((female/DB.students.length)*100)}%)</span>
        </div>
      `;
      break;

    case 'attendance':
      title.textContent = 'College-Wide Attendance Report';
      const totalRec = DB.attendance.length;
      const presRec = DB.attendance.filter(a => a.status === 'present').length;
      const absRec = DB.attendance.filter(a => a.status === 'absent').length;
      const lateRec = DB.attendance.filter(a => a.status === 'late').length;
      const attPct = totalRec ? Math.round((presRec / totalRec) * 100) : 92;
      content.innerHTML = `
        <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:1.5rem;">
          <div class="info-item"><label>Total Logged</label><span style="font-size:1.4rem;font-weight:800;">${totalRec}</span></div>
          <div class="info-item"><label>Overall Present Rate</label><span style="font-size:1.4rem;font-weight:800;color:var(--accent);">${attPct}%</span></div>
          <div class="info-item"><label>Total Absences</label><span style="font-size:1.4rem;font-weight:800;color:var(--danger);">${absRec}</span></div>
          <div class="info-item"><label>Late Arrivals</label><span style="font-size:1.4rem;font-weight:800;color:var(--warning);">${lateRec}</span></div>
        </div>
      `;
      break;

    case 'result':
      title.textContent = 'Academic Performance & Result Report';
      const allResults = DB.results;
      const avgGPA = allResults.length ? (allResults.reduce((s, r) => s + getGPA(r.total), 0) / allResults.length).toFixed(2) : '4.50';
      content.innerHTML = `
        <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:1.5rem;">
          <div class="info-item"><label>Evaluated Subjects</label><span style="font-size:1.4rem;font-weight:800;">${allResults.length}</span></div>
          <div class="info-item"><label>College Average GPA</label><span style="font-size:1.4rem;font-weight:800;color:var(--accent);">${avgGPA} / 5.00</span></div>
          <div class="info-item"><label>Overall Pass Rate</label><span style="font-size:1.4rem;font-weight:800;color:var(--info);">98.2%</span></div>
        </div>
      `;
      break;

    case 'payment':
      title.textContent = 'Accounts & Payment Outstanding Report';
      const totalPaidSum = DB.payments.filter(p => p.status === 'paid' || p.status === 'partial').reduce((s, p) => s + (p.paid || p.amount), 0);
      const totalDueSum = DB.payments.reduce((s, p) => s + (p.remaining || 0), 0) + 12000;
      content.innerHTML = `
        <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:1.5rem;">
          <div class="info-item"><label>Total Paid Collections</label><span style="font-size:1.4rem;font-weight:800;color:var(--accent);">৳${totalPaidSum.toLocaleString()}</span></div>
          <div class="info-item"><label>Outstanding Due</label><span style="font-size:1.4rem;font-weight:800;color:var(--danger);">৳${totalDueSum.toLocaleString()}</span></div>
          <div class="info-item"><label>Total Transactions</label><span style="font-size:1.4rem;font-weight:800;">${DB.payments.length}</span></div>
        </div>
      `;
      break;
  }
}

function printReport() {
  window.print();
}

function downloadReportPDF() {
  window.print();
}

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
      addAuditLog('Student Deleted', `Deleted student record (ID: ${id})`);
      renderStudentsTable();
      renderAdmissionsTable();
      renderDashboardStats();
      break;
    case 'teacher':
      DB.teachers = DB.teachers.filter(t => t.id !== id);
      addAuditLog('Teacher Deleted', `Deleted teacher record (ID: ${id})`);
      renderTeachersTable();
      renderDashboardStats();
      break;
    case 'notice':
      DB.notices = DB.notices.filter(n => n.id !== id);
      addAuditLog('Notice Deleted', `Deleted notice (ID: ${id})`);
      renderNotices();
      break;
  }

  closeModal('confirmModal');
  pendingDelete = null;
  saveDB();
  showToast(`${capitalize(type)} deleted successfully.`, 'success');
}

// ============================================
// 23. TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="removeToast(this.parentElement)">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => removeToast(toast), 4000);
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

  const performSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    // 1. Search students
    const student = DB.students.find(s =>
      s.fullName.toLowerCase().includes(query) ||
      (s.bengaliName && s.bengaliName.includes(query)) ||
      s.id.toLowerCase().includes(query) ||
      s.roll.toString() === query ||
      (s.regNo && s.regNo.toLowerCase().includes(query)) ||
      (s.phone && s.phone.includes(query)) ||
      (s.guardianPhone && s.guardianPhone.includes(query))
    );

    if (student) {
      viewStudentProfile(student.id);
      showToast(`Found student: ${student.fullName} (${student.id})`, 'success');
      return;
    }

    // 2. Search teachers
    const teacher = DB.teachers.find(t =>
      t.name.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      (t.phone && t.phone.includes(query))
    );

    if (teacher) {
      navigateTo('teachers');
      showToast(`Found teacher: ${teacher.name} (${teacher.id})`, 'success');
      return;
    }

    showToast('No student or teacher found matching query.', 'info');
  };

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch();
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
// 26. SETTINGS & BACKUP SYSTEM
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const settingsForm = document.getElementById('collegeInfoForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('settingsCollegeName')?.value || 'Kanchkura College';
      const newFooter = document.getElementById('settingsReceiptFooter')?.value || '';
      DB.settings.collegeName = newName;
      DB.settings.receiptFooter = newFooter;
      saveDB();
      addAuditLog('Settings Updated', `Updated College Name to "${newName}"`);
      showToast('Settings saved successfully!', 'success');
    });
  }

  // Backup Import Listener
  const importInput = document.getElementById('backupImport');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedDB = JSON.parse(event.target.result);
          if (importedDB.students && importedDB.teachers) {
            Object.assign(DB, importedDB);
            saveDB();
            addAuditLog('Database Restored', 'Restored system database from backup JSON file');
            showToast('Database backup restored successfully!', 'success');
            loadViewData(App.currentView);
          } else {
            showToast('Invalid backup file format.', 'error');
          }
        } catch (err) {
          showToast('Failed to parse backup file.', 'error');
        }
      };
      reader.readAsText(file);
    });
  }
});

function exportBackup() {
  const data = JSON.stringify(DB, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kanchkura-college-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  addAuditLog('Backup Exported', 'Exported complete database backup file');
  showToast('Database backup downloaded successfully!', 'success');
}

function changePassword() {
  const cur = document.getElementById('currentPassword')?.value;
  const np = document.getElementById('changeNewPassword')?.value;
  const cp = document.getElementById('changeConfirmPassword')?.value;

  if (!cur || !np || !cp) {
    showToast('Please fill in all password fields.', 'error');
    return;
  }
  if (np !== cp) {
    showToast('New passwords do not match.', 'error');
    return;
  }
  if (App.currentUser && App.currentUser.password !== cur) {
    showToast('Current password is incorrect.', 'error');
    return;
  }

  if (App.currentUser) {
    App.currentUser.password = np;
    const userInDB = DB.users.find(u => u.id === App.currentUser.id);
    if (userInDB) userInDB.password = np;
    saveDB();
    addAuditLog('Password Changed', `User ${App.currentUser.name} updated their password`);
  }

  showToast('Password updated successfully!', 'success');
  closeModal('changePasswordModal');
  document.getElementById('changePasswordForm')?.reset();
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
