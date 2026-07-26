const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.dashboard);
router.get('/activities', dashboardController.recentActivities);
router.get('/charts', dashboardController.chartData);

module.exports = router;
