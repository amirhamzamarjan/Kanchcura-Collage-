const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authorize } = require('../middleware/rbac');

router.get('/', settingController.listNotifications);
router.get('/unread-count', settingController.getUnreadCount);
router.patch('/:id/read', settingController.markRead);
router.post('/', authorize('super-admin', 'admin'), settingController.createNotification);

module.exports = router;
