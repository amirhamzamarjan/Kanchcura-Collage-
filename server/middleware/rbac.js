const { roleHierarchy } = require('../config/auth');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userRole = req.user.role;

    // Super admin bypasses all checks
    if (userRole === 'super-admin') {
      return next();
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    const userLevel = roleHierarchy[userRole] || 0;

    const hasAccess = allowedRoles.some(role => {
      const requiredLevel = roleHierarchy[role] || 0;
      return userLevel >= requiredLevel;
    });

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        userRole,
        requiredRoles: allowedRoles,
      });
    }

    next();
  };
};

const selfOrAuthorized = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (req.user.role === 'super-admin') return next();

    const targetUserId = parseInt(req.params.userId) || parseInt(req.params.id);
    if (targetUserId && req.user.id === targetUserId) {
      return next();
    }

    const userLevel = roleHierarchy[req.user.role] || 0;
    const hasAccess = allowedRoles.some(role => {
      const requiredLevel = roleHierarchy[role] || 0;
      return userLevel >= requiredLevel;
    });

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    next();
  };
};

module.exports = { authorize, selfOrAuthorized };
