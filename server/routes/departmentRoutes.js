const express = require('express');
const router = express.Router();
const deptController = require('../controllers/departmentController');
const { authorize } = require('../middleware/rbac');

router.get('/departments', deptController.listDepartments);
router.post('/departments', authorize('super-admin', 'admin'), deptController.createDepartment);

router.get('/subjects', deptController.listSubjects);
router.post('/subjects', authorize('super-admin', 'admin'), deptController.createSubject);

router.get('/groups', deptController.listGroups);
router.post('/groups', authorize('super-admin', 'admin'), deptController.createGroup);

router.get('/sections', authorize('super-admin', 'principal', 'admin'), deptController.listSections);

router.get('/classes', deptController.listClasses);
router.post('/classes', authorize('super-admin', 'admin'), deptController.createClass);

module.exports = router;
