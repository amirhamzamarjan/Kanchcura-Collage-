const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authorize } = require('../middleware/rbac');
const { paginate } = require('../middleware/pagination');

router.get('/search', authorize('super-admin', 'principal', 'admin', 'accounts'), studentController.search);
router.get('/', authorize('super-admin', 'principal', 'admin', 'accounts'), paginate, studentController.list);
router.get('/:id', authorize('super-admin', 'principal', 'admin', 'accounts', 'teacher'), studentController.get);
router.get('/:id/subjects', authorize('super-admin', 'principal', 'admin', 'teacher'), studentController.getSubjects);
router.post('/admit', authorize('super-admin', 'principal', 'admin'), studentController.admit);
router.put('/:id', authorize('super-admin', 'principal', 'admin'), studentController.update);
router.delete('/:id', authorize('super-admin'), studentController.remove);
router.post('/bulk-status', authorize('super-admin', 'admin'), studentController.bulkStatus);

module.exports = router;
