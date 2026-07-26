const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authorize } = require('../middleware/rbac');
const { paginate } = require('../middleware/pagination');

router.get('/', authorize('super-admin', 'principal', 'admin', 'accounts'), paginate, paymentController.list);
router.get('/collection-report', authorize('super-admin', 'principal', 'admin', 'accounts'), paymentController.collectionReport);
router.get('/receipt/:id', authorize('super-admin', 'principal', 'admin', 'accounts'), paymentController.getReceipt);
router.get('/receipt/:id/download', authorize('super-admin', 'principal', 'admin', 'accounts', 'teacher'), paymentController.downloadReceipt);
router.post('/collect', authorize('super-admin', 'principal', 'admin', 'accounts'), paymentController.collect);

module.exports = router;
