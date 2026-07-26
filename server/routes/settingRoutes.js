const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authorize } = require('../middleware/rbac');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, authorize('super-admin', 'principal', 'admin'), settingController.listSettings);
router.put('/', authenticate, authorize('super-admin', 'admin'), settingController.bulkUpdateSettings);
router.put('/:key', authenticate, authorize('super-admin', 'admin'), settingController.updateSetting);

module.exports = router;
