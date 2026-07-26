const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { authorize } = require('../middleware/rbac');

router.get('/', noticeController.list);
router.get('/:id', noticeController.get);
router.post('/', authorize('super-admin', 'principal', 'admin'), noticeController.create);
router.put('/:id', authorize('super-admin', 'principal', 'admin'), noticeController.update);
router.delete('/:id', authorize('super-admin', 'admin'), noticeController.remove);
router.patch('/:id/toggle-pin', authorize('super-admin', 'principal', 'admin'), noticeController.togglePin);

module.exports = router;
