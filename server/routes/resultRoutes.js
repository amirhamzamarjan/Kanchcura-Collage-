const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { authorize } = require('../middleware/rbac');

router.get('/', authorize('super-admin', 'principal', 'admin', 'teacher'), resultController.list);
router.get('/class', authorize('super-admin', 'principal', 'admin'), resultController.classResults);
router.get('/merit-list', authorize('super-admin', 'principal', 'admin'), resultController.meritList);
router.get('/fail-list', authorize('super-admin', 'principal', 'admin'), resultController.failList);
router.post('/enter', authorize('super-admin', 'admin', 'teacher'), resultController.enterMarks);
router.post('/publish', authorize('super-admin', 'principal', 'admin'), resultController.publish);

module.exports = router;
