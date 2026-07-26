const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-2fa', authController.verify2FA);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);
router.post('/refresh', authenticate, authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

// Admin only
router.get('/users', authenticate, authorize('super-admin', 'principal', 'admin'), authController.listUsers);
router.post('/users', authenticate, authorize('super-admin', 'admin'), authController.createUser);
router.put('/users/:id', authenticate, authorize('super-admin', 'admin'), authController.updateUser);
router.delete('/users/:id', authenticate, authorize('super-admin'), authController.deleteUser);

module.exports = router;
