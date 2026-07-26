const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'Account deactivated.' });
    }

    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;

    // Update last activity
    user.last_activity = new Date();
    await user.save({ silent: true });

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
      if (user && user.is_active) {
        req.user = user;
        req.userId = user.id;
        req.userRole = user.role;
      }
    }
  } catch (e) { /* ignore */ }
  next();
};

module.exports = { authenticate, optionalAuth };
