const { Op } = require('sequelize');
const { Student, Department, Class, Section, Group, Subject, StudentSubject, Admission, Payment, Attendance, Result, User } = require('../models');
const { paginateResponse } = require('../middleware/pagination');
const { logAction } = require('../middleware/audit');

// HELPERS
const generateStudentId = async (session, departmentCode, classNum) => {
  const prefix = `KCC-${session}`;
  const count = await Student.count({ where: { session } });
  const seq = String(count + 1).padStart(3, '0');
  return `${prefix}-${seq}`;
};

const generateRollNumber = async (classId, departmentId, sectionId) => {
  const count = await Student.count({ where: { class_id: classId, department_id: departmentId, section_id: sectionId } });
  return count + 1;
};

const getSubjectsForDepartment = (departmentCode) => {
  const subjects = {
    science: ['Bangla', 'English', 'ICT', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics'],
    commerce: ['Bangla', 'English', 'ICT', 'Accounting', 'Finance', 'Business Organization'],
    humanities: ['Bangla', 'English', 'ICT', 'History', 'Civics', 'Economics', 'Geography'],
  };
  return subjects[departmentCode] || [];
};

// GET /api/students
exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department_id, class_id, section_id, group_id, session, shift, status } = req.query;
    const where = {};
    if (department_id) where.department_id = department_id;
    if (class_id) where.class_id = class_id;
    if (section_id) where.section_id = section_id;
    if (group_id) where.group_id = group_id;
    if (session) where.session = session;
    if (shift) where.shift = shift;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { student_id: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await Student.findAndCountAll({
      where,
      include: [
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
        { model: Class, as: 'class', attributes: ['id', 'name', 'numeric_value'] },
        { model: Section, as: 'section', attributes: ['id', 'name'] },
        { model: Group, as: 'group', attributes: ['id', 'name'] },
      ],
      limit: parseInt(limit), offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, ...paginateResponse(rows, count, req) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/:id
exports.get = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: Department, as: 'department' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Group, as: 'group' },
        { model: Subject, as: 'subjects', through: { attributes: [] } },
        { model: Payment, as: 'payments', limit: 5, order: [['created_at', 'DESC']] },
        { model: Attendance, as: 'attendances', limit: 10, order: [['date', 'DESC']] },
        { model: Result, as: 'results', include: [{ model: Subject, as: 'subject' }], limit: 10, order: [['created_at', 'DESC']] },
      ],
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/students/admit
exports.admit = async (req, res) => {
  try {
    const data = req.body;
    if (!data.full_name || !data.department_id || !data.class_id) {
      return res.status(400).json({ success: false, message: 'Name, department, and class required.' });
    }

    const department = await Department.findByPk(data.department_id);
    if (!department) return res.status(400).json({ success: false, message: 'Invalid department.' });

    const classObj = await Class.findByPk(data.class_id);
    if (!classObj) return res.status(400).json({ success: false, message: 'Invalid class.' });

    const session = data.session || new Date().getFullYear().toString();
    const sectionId = data.section_id || 1;

    const studentId = await generateStudentId(session, department.code, classObj.numeric_value);
    const rollNumber = await generateRollNumber(data.class_id, data.department_id, sectionId);

    const student = await Student.create({
      ...data,
      student_id: studentId,
      roll_number: rollNumber,
      session,
      admission_date: data.admission_date || new Date().toISOString().split('T')[0],
    });

    // Auto-assign subjects based on department
    const subjectNames = getSubjectsForDepartment(department.code);
    const subjects = await Subject.findAll({
      where: { name: { [Op.in]: subjectNames }, department_id: data.department_id },
    });

    for (const subject of subjects) {
      await StudentSubject.create({ student_id: student.id, subject_id: subject.id });
    }

    // Create admission record
    await Admission.create({
      student_id: student.student_id,
      admission_no: `ADM-${studentId}`,
      admission_date: student.admission_date,
      session, class_id: data.class_id, department_id: data.department_id,
      shift: data.shift, is_approved: true, approved_by: req.userId, status: 'approved',
    });

    await logAction(req.userId, 'STUDENT_ADMIT', 'student', student.id, `Admitted student: ${student.full_name} (${student.student_id})`, req);

    res.status(201).json({ success: true, message: 'Student admitted successfully.', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/students/:id
exports.update = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const allowed = [
      'full_name', 'bengali_name', 'father_name', 'mother_name', 'guardian_name',
      'father_occupation', 'mother_occupation', 'guardian_phone', 'phone', 'email',
      'blood_group', 'religion', 'nationality', 'gender', 'date_of_birth',
      'nid_birth_certificate', 'present_address', 'permanent_address',
      'session', 'shift', 'registration_number', 'academic_year',
      'class_id', 'section_id', 'department_id', 'group_id',
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    await Student.update(updates, { where: { id: req.params.id } });
    const updated = await Student.findByPk(req.params.id, {
      include: [
        { model: Department, as: 'department' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
      ],
    });

    await logAction(req.userId, 'STUDENT_UPDATE', 'student', student.id, `Updated student: ${student.full_name}`, req);

    res.json({ success: true, message: 'Student updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/students/:id
exports.remove = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    await Student.destroy({ where: { id: req.params.id } });
    await logAction(req.userId, 'STUDENT_DELETE', 'student', student.id, `Deleted student: ${student.full_name}`, req);

    res.json({ success: true, message: 'Student deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/:id/subjects
exports.getSubjects = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: Subject, as: 'subjects', through: { attributes: [] } }],
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, data: student.subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/search
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query required.' });

    const students = await Student.findAll({
      where: {
        [Op.or]: [
          { full_name: { [Op.like]: `%${q}%` } },
          { student_id: { [Op.like]: `%${q}%` } },
          { phone: { [Op.like]: `%${q}%` } },
        ],
      },
      limit: 20,
      include: [{ model: Class, as: 'class', attributes: ['name'] }],
    });

    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/bulk-status
exports.bulkStatus = async (req, res) => {
  try {
    const { student_ids, status } = req.body;
    if (!student_ids || !status) {
      return res.status(400).json({ success: false, message: 'Student IDs and status required.' });
    }
    await Student.update({ status }, { where: { id: { [Op.in]: student_ids } } });
    res.json({ success: true, message: `${student_ids.length} students updated.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
