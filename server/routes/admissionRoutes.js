const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissionController');
const { authorize } = require('../middleware/rbac');
const { paginate } = require('../middleware/pagination');

router.get('/', authorize('super-admin', 'principal', 'admin'), paginate, admissionController.list);
router.get('/stats', authorize('super-admin', 'principal', 'admin'), admissionController.stats);
router.patch('/:id/approve', authorize('super-admin', 'principal', 'admin'), admissionController.approve);
router.patch('/:id/reject', authorize('super-admin', 'principal', 'admin'), admissionController.reject);

module.exports = router;
