require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'kanchkura_college_erp_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '90d',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
  sessionTimeoutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES) || 30,

  roles: {
    SUPER_ADMIN: 'super-admin',
    PRINCIPAL: 'principal',
    ADMIN: 'admin',
    ACCOUNTS: 'accounts',
    TEACHER: 'teacher',
  },

  roleHierarchy: {
    'super-admin': 5,
    'principal': 4,
    'admin': 3,
    'accounts': 2,
    'teacher': 1,
  },

  attendanceStatuses: ['present', 'absent', 'late', 'leave'],
  paymentStatuses: ['paid', 'partial', 'unpaid', 'cancelled'],
  feeTypes: ['admission', 'monthly', 'registration', 'exam', 'practical', 'library', 'transport', 'fine'],

  departments: [
    { id: 'science', name: 'Science', subjects: ['Bangla', 'English', 'ICT', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics'] },
    { id: 'commerce', name: 'Commerce', subjects: ['Bangla', 'English', 'ICT', 'Accounting', 'Finance', 'Business Organization'] },
    { id: 'humanities', name: 'Humanities', subjects: ['Bangla', 'English', 'ICT', 'History', 'Civics', 'Economics', 'Geography'] },
  ],

  shifts: ['morning', 'day'],
  sections: ['A', 'B', 'C', 'D'],
  genders: ['Male', 'Female', 'Other'],
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  religions: ['Islam', 'Hindu', 'Christian', 'Buddhist', 'Other'],
  noticeCategories: ['general', 'academic', 'exam', 'event', 'urgent'],
};
