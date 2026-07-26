const { Department, Subject, Group, Section, Class } = require('../models');

// DEPARTMENTS
exports.listDepartments = async (req, res) => {
  try {
    const depts = await Department.findAll({ include: [{ model: Subject, as: 'subjects', attributes: ['id', 'name'] }] });
    res.json({ success: true, data: depts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    if (!name || !code) return res.status(400).json({ success: false, message: 'Name and code required.' });
    const dept = await Department.create({ name, code, description });
    res.status(201).json({ success: true, data: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SUBJECTS
exports.listSubjects = async (req, res) => {
  try {
    const { department_id } = req.query;
    const where = {};
    if (department_id) where.department_id = department_id;
    const subjects = await Subject.findAll({
      where,
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
    });
    res.json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code, department_id, full_marks, pass_marks } = req.body;
    if (!name || !code || !department_id) return res.status(400).json({ success: false, message: 'Name, code, department required.' });
    const subject = await Subject.create({ name, code, department_id, full_marks, pass_marks });
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GROUPS
exports.listGroups = async (req, res) => {
  try {
    const { department_id } = req.query;
    const where = {};
    if (department_id) where.department_id = department_id;
    const groups = await Group.findAll({ where, include: [{ model: Department, as: 'department' }] });
    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, code, department_id } = req.body;
    if (!name || !code || !department_id) return res.status(400).json({ success: false, message: 'Name, code, department required.' });
    const group = await Group.create({ name, code, department_id });
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SECTIONS
exports.listSections = async (req, res) => {
  try {
    const sections = await Section.findAll();
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CLASSES
exports.listClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({ order: [['numeric_value', 'ASC']] });
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { name, numeric_value } = req.body;
    if (!name || !numeric_value) return res.status(400).json({ success: false, message: 'Name and numeric value required.' });
    const cls = await Class.create({ name, numeric_value });
    res.status(201).json({ success: true, data: cls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
