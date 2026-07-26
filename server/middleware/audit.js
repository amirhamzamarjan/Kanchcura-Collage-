const { AuditLog } = require('../models');

const auditLogger = (action, entity_type) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async function (body) {
      try {
        if (req.user && req.method !== 'GET') {
          await AuditLog.create({
            user_id: req.user.id,
            action,
            entity_type,
            entity_id: req.params.id || body?.data?.id || null,
            description: `${action} ${entity_type} by ${req.user.name}`,
            ip_address: req.ip || req.connection?.remoteAddress,
            user_agent: req.headers['user-agent'],
            metadata: JSON.stringify({
              method: req.method,
              path: req.originalUrl,
              status_code: res.statusCode,
            }),
          });
        }
      } catch (e) {
        console.error('Audit log error:', e.message);
      }
      return originalJson(body);
    };

    next();
  };
};

const logAction = async (userId, action, entityType, entityId, description, req = null) => {
  try {
    await AuditLog.create({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description,
      ip_address: req?.ip || null,
      user_agent: req?.headers?.['user-agent'] || null,
    });
  } catch (e) {
    console.error('Audit log error:', e.message);
  }
};

module.exports = { auditLogger, logAction };
