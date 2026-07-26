const { Setting, Notification, User } = require('../models');
const { logAction } = require('../middleware/audit');

// SETTINGS
exports.listSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value, type = 'string', description } = req.body;
    if (!key) return res.status(400).json({ success: false, message: 'Key required.' });

    const [setting, created] = await Setting.upsert({ key, value: String(value), type, description });
    await logAction(req.userId, created ? 'SETTING_CREATE' : 'SETTING_UPDATE', 'setting', setting.id, `Updated setting: ${key}`, req);
    res.json({ success: true, message: 'Setting saved.', data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkUpdateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Settings object required.' });
    }
    for (const [key, value] of Object.entries(settings)) {
      await Setting.upsert({ key, value: String(value) });
    }
    res.json({ success: true, message: 'Settings saved.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NOTIFICATIONS
exports.listNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.userId },
      order: [['created_at', 'DESC']],
      limit: 50,
    });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await Notification.update({ is_read: true, read_at: new Date() }, { where: { user_id: req.userId } });
      return res.json({ success: true, message: 'All notifications marked read.' });
    }
    await Notification.update({ is_read: true, read_at: new Date() }, { where: { id, user_id: req.userId } });
    res.json({ success: true, message: 'Notification marked read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type, link } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required.' });

    if (user_id) {
      await Notification.create({ user_id, title, message, type, link });
    } else {
      const users = await User.findAll({ where: { is_active: true } });
      for (const user of users) {
        await Notification.create({ user_id: user.id, title, message, type, link });
      }
    }
    res.status(201).json({ success: true, message: 'Notification created.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({ where: { user_id: req.userId, is_read: false } });
    res.json({ success: true, data: { unread_count: count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
