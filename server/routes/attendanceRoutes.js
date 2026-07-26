const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authorize } = require('../middleware/rbac');

router.get('/', authorize('super-admin', 'principal', 'admin', 'teacher'), attendanceController.list);
router.get('/summary', authorize('super-admin', 'principal', 'admin', 'teacher'), attendanceController.summary);
router.post('/mark', authorize('super-admin', 'admin', 'teacher'), attendanceController.markAttendance);
router.post('/mark-single', authorize('super-admin', 'admin', 'teacher'), attendanceController.markSingle);

module.exports = router;
