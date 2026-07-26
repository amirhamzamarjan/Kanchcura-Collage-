const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const { authorize } = require('../middleware/rbac');

router.get('/', authorize('super-admin', 'admin'), backupController.list);
router.post('/', authorize('super-admin', 'admin'), backupController.create);
router.post('/:id/restore', authorize('super-admin'), backupController.restore);
router.get('/:id/download', authorize('super-admin', 'admin'), backupController.download);
router.delete('/:id', authorize('super-admin'), backupController.remove);

module.exports = router;
