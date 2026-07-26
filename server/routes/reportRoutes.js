const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authorize } = require('../middleware/rbac');

router.get('/daily-collection', authorize('super-admin', 'principal', 'admin', 'accounts'), reportController.dailyCollection);
router.get('/monthly-collection', authorize('super-admin', 'principal', 'admin', 'accounts'), reportController.monthlyCollection);
router.get('/students', authorize('super-admin', 'principal', 'admin'), reportController.studentReport);
router.get('/attendance', authorize('super-admin', 'principal', 'admin', 'teacher'), reportController.attendanceReport);
router.get('/results', authorize('super-admin', 'principal', 'admin'), reportController.resultReport);

module.exports = router;
