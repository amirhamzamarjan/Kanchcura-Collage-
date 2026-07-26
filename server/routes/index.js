// ============================================
// KANCHKURA COLLEGE ERP - ROUTES INDEX
// All routes registered with RBAC middleware
// ============================================
const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { apiLimiter } = require('../middleware/rateLimiter');

// Auth routes (public)
router.use('/auth', require('./authRoutes'));

// Protected routes below - require authentication + RBAC
router.use(authenticate);
router.use(apiLimiter);

// Dashboard (all authenticated users)
router.use('/dashboard', require('./dashboardRoutes'));

// Student management
router.use('/students', require('./studentRoutes'));

// Teacher management
router.use('/teachers', require('./teacherRoutes'));

// Fee management
router.use('/fees', require('./feeRoutes'));

// Payments
router.use('/payments', require('./paymentRoutes'));

// Attendance
router.use('/attendance', require('./attendanceRoutes'));

// Results
router.use('/results', require('./resultRoutes'));

// Notices
router.use('/notices', require('./noticeRoutes'));

// Reports
router.use('/reports', require('./reportRoutes'));

// Search
router.use('/search', require('./searchRoutes'));

// Departments & Academics
router.use('/departments', require('./departmentRoutes'));

// Admissions
router.use('/admissions', require('./admissionRoutes'));

// Settings (admin only)
router.use('/settings', require('./settingRoutes'));

// Backups (admin+)
router.use('/backups', require('./backupRoutes'));

// Notifications
router.use('/notifications', require('./notificationRoutes'));

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Kanchkura College ERP API is running', timestamp: new Date().toISOString() });
});

module.exports = router;
