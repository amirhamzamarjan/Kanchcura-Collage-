const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, AuditLog } = require('../models');
const { jwtSecret, jwtExpiresIn, bcryptSaltRounds } = require('../config/auth');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    user.last_login = new Date();
    await user.save();

    await AuditLog.create({
      user_id: user.id,
      action: 'LOGIN',
      entity_type: 'user',
      entity_id: user.id,
      description: `User ${user.name} logged in`,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    });

    const { password: _, ...userData } = user.toJSON();
    res.json({
      success: true,
      message: 'Login successful.',
      data: { user: userData, token },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    // In production, send email with reset link
    res.json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password required.' });
    }
    // In production, verify reset token
    const hashedPassword = await bcrypt.hash(newPassword, bcryptSaltRounds);
    // Update user password
    res.json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password required.' });
    }

    const user = await User.findByPk(req.userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    user.password = await bcrypt.hash(newPassword, bcryptSaltRounds);
    user.password_changed_at = new Date();
    await user.save();

    await AuditLog.create({
      user_id: user.id, action: 'CHANGE_PASSWORD', entity_type: 'user',
      entity_id: user.id, description: `User ${user.name} changed password`,
      ip_address: req.ip, user_agent: req.headers['user-agent'],
    });

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/verify-2fa
exports.verify2FA = async (req, res) => {
  try {
    const { code } = req.body;
    // In production, verify TOTP
    res.json({ success: true, message: '2FA verified.', data: { verified: true } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key]) updates[key] = req.body[key];
    }
    await User.update(updates, { where: { id: req.userId } });
    const user = await User.findByPk(req.userId, { attributes: { exclude: ['password'] } });
    res.json({ success: true, message: 'Profile updated.', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res.json({ success: true, data: { token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    await AuditLog.create({
      user_id: req.userId, action: 'LOGOUT', entity_type: 'user',
      entity_id: req.userId, description: `User logged out`,
      ip_address: req.ip, user_agent: req.headers['user-agent'],
    });
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/users (Admin only)
exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, is_active } = req.query;
    const where = {};
    if (role) where.role = role;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const offset = (page - 1) * limit;
    const { rows, count } = await User.findAndCountAll({
      where, attributes: { exclude: ['password'] },
      limit: parseInt(limit), offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page), limit: parseInt(limit),
        total: count, total_pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/users (Create user)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, employee_id } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password, role required.' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists.' });

    const hashedPwd = await bcrypt.hash(password, bcryptSaltRounds);
    const user = await User.create({
      name, email, password: hashedPwd, role, phone, employee_id,
      avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    });

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json({ success: true, message: 'User created.', data: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/auth/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { name, role, phone, is_active, employee_id } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const updates = {};
    if (name) updates.name = name;
    if (role) updates.role = role;
    if (phone !== undefined) updates.phone = phone;
    if (is_active !== undefined) updates.is_active = is_active;
    if (employee_id) updates.employee_id = employee_id;

    await User.update(updates, { where: { id: req.params.id } });
    const updated = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    res.json({ success: true, message: 'User updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/auth/users/:id
exports.deleteUser = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself.' });
    }
    await User.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
