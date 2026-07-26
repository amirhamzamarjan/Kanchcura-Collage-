const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { authorize } = require('../middleware/rbac');

router.get('/', authorize('super-admin', 'principal', 'admin', 'accounts'), feeController.list);
router.get('/class/:classId', authorize('super-admin', 'principal', 'admin', 'accounts'), feeController.getByClass);
router.post('/', authorize('super-admin', 'admin', 'accounts'), feeController.createOrUpdate);

module.exports = router;
