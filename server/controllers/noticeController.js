const { Notice, User } = require('../models');
const { paginateResponse } = require('../middleware/pagination');
const { logAction } = require('../middleware/audit');

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, is_pinned } = req.query;
    const where = { is_active: true };
    if (category) where.category = category;
    if (is_pinned !== undefined) where.is_pinned = is_pinned === 'true';

    const offset = (page - 1) * limit;
    const { rows, count } = await Notice.findAndCountAll({
      where,
      include: [{ model: User, as: 'publishedBy', attributes: ['id', 'name'] }],
      limit: parseInt(limit), offset: parseInt(offset),
      order: [['is_pinned', 'DESC'], ['created_at', 'DESC']],
    });
    res.json({ success: true, ...paginateResponse(rows, count, req) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.get = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id, {
      include: [{ model: User, as: 'publishedBy', attributes: ['id', 'name'] }],
    });
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' });
    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, category = 'general', is_pinned = false, published_date } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content required.' });

    const notice = await Notice.create({
      title, content, category, is_pinned,
      published_date: published_date || new Date().toISOString().split('T')[0],
      published_by: req.userId,
    });

    await logAction(req.userId, 'NOTICE_CREATE', 'notice', notice.id, `Created notice: ${title}`, req);
    res.status(201).json({ success: true, message: 'Notice published.', data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' });

    const allowed = ['title', 'content', 'category', 'is_pinned', 'is_active', 'published_date'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    await Notice.update(updates, { where: { id: req.params.id } });
    const updated = await Notice.findByPk(req.params.id);
    res.json({ success: true, message: 'Notice updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' });
    await Notice.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Notice deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found.' });
    await notice.update({ is_pinned: !notice.is_pinned });
    res.json({ success: true, message: `Notice ${notice.is_pinned ? 'pinned' : 'unpinned'}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
