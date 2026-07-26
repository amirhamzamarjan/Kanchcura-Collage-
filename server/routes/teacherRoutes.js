const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authorize } = require('../middleware/rbac');
const { paginate } = require('../middleware/pagination');

router.get('/', authorize('super-admin', 'principal', 'admin'), paginate, teacherController.list);
router.get('/:id', authorize('super-admin', 'principal', 'admin', 'teacher'), teacherController.get);
router.post('/', authorize('super-admin', 'admin'), teacherController.create);
router.put('/:id', authorize('super-admin', 'admin'), teacherController.update);
router.delete('/:id', authorize('super-admin'), teacherController.remove);

module.exports = router;
