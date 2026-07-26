const { Op } = require('sequelize');
const { Result, Student, Subject, Class, Department, User, StudentSubject, sequelize } = require('../models');
const { paginateResponse } = require('../middleware/pagination');
const { logAction } = require('../middleware/audit');

const getGPA = (total) => {
  if (total >= 80) return 5.0; if (total >= 70) return 4.0; if (total >= 60) return 3.5;
  if (total >= 50) return 3.0; if (total >= 40) return 2.0; if (total >= 33) return 1.0;
  return 0.0;
};
const getGrade = (gpa) => {
  if (gpa >= 5.0) return 'A+'; if (gpa >= 4.0) return 'A'; if (gpa >= 3.5) return 'A-';
  if (gpa >= 3.0) return 'B'; if (gpa >= 2.0) return 'C'; if (gpa >= 1.0) return 'D';
  return 'F';
};

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 20, student_id, subject_id, exam_type, class_id, is_published } = req.query;
    const where = {};
    if (student_id) where.student_id = student_id;
    if (subject_id) where.subject_id = subject_id;
    if (exam_type) where.exam_type = exam_type;
    if (is_published !== undefined) where.is_published = is_published === 'true';
    if (class_id) {
      const students = await Student.findAll({ where: { class_id }, attributes: ['id'] });
      where.student_id = { [Op.in]: students.map(s => s.id) };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await Result.findAndCountAll({
      where,
      include: [
        { model: Student, as: 'student', attributes: ['id', 'student_id', 'full_name', 'roll_number'] },
        { model: Subject, as: 'subject', attributes: ['id', 'name'] },
      ],
      limit: parseInt(limit), offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, ...paginateResponse(rows, count, req) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.enterMarks = async (req, res) => {
  try {
    const { records, exam_type } = req.body;
    if (!records || !exam_type) {
      return res.status(400).json({ success: false, message: 'Records and exam type required.' });
    }

    let created = 0, updated = 0;
    for (const r of records) {
      if (!r.student_id || !r.subject_id) continue;
      const total = (r.class_test_mark || 0) + (r.mid_term_mark || 0) + (r.final_mark || 0) + (r.practical_mark || 0);
      const gpa = getGPA(total);
      const grade = getGrade(gpa);

      const existing = await Result.findOne({
        where: { student_id: r.student_id, subject_id: r.subject_id, exam_type },
      });

      if (existing) {
        await existing.update({
          class_test_mark: r.class_test_mark || 0, mid_term_mark: r.mid_term_mark || 0,
          final_mark: r.final_mark || 0, practical_mark: r.practical_mark || 0,
          total_mark: total, gpa, grade, entered_by: req.userId,
        });
        updated++;
      } else {
        await Result.create({
          student_id: r.student_id, subject_id: r.subject_id, exam_type,
          class_test_mark: r.class_test_mark || 0, mid_term_mark: r.mid_term_mark || 0,
          final_mark: r.final_mark || 0, practical_mark: r.practical_mark || 0,
          total_mark: total, gpa, grade, entered_by: req.userId,
        });
        created++;
      }
    }

    await logAction(req.userId, 'MARKS_ENTER', 'result', null, `Entered ${created} new, updated ${updated} results for ${exam_type}`, req);
    res.json({ success: true, message: `${created} new, ${updated} updated records.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.publish = async (req, res) => {
  try {
    const { class_id, exam_type, section_id } = req.body;
    if (!class_id || !exam_type) {
      return res.status(400).json({ success: false, message: 'Class and exam type required.' });
    }

    const where = { exam_type, is_published: false };
    if (section_id) {
      const students = await Student.findAll({ where: { class_id, section_id }, attributes: ['id'] });
      where.student_id = { [Op.in]: students.map(s => s.id) };
    } else {
      const students = await Student.findAll({ where: { class_id }, attributes: ['id'] });
      where.student_id = { [Op.in]: students.map(s => s.id) };
    }

    const results = await Result.findAll({ where });
    for (const result of results) {
      // Calculate positions
      const allResults = await Result.findAll({
        where: { exam_type, subject_id: result.subject_id },
        order: [['total_mark', 'DESC']],
      });
      const position = allResults.findIndex(r => r.id === result.id) + 1;

      await result.update({
        is_published: true, published_by: req.userId, published_at: new Date(), position,
      });
    }

    await logAction(req.userId, 'RESULTS_PUBLISH', 'result', null, `Published results for class ${class_id}, ${exam_type}`, req);
    res.json({ success: true, message: `${results.length} results published.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.classResults = async (req, res) => {
  try {
    const { class_id, exam_type, section_id, department_id, session } = req.query;
    if (!class_id) return res.status(400).json({ success: false, message: 'Class ID required.' });

    const studentWhere = { class_id };
    if (section_id) studentWhere.section_id = section_id;
    if (department_id) studentWhere.department_id = department_id;
    if (session) studentWhere.session = session;

    const students = await Student.findAll({
      where: studentWhere,
      include: [{ model: Subject, as: 'subjects', through: { attributes: [] } }],
    });

    const resultData = [];
    for (const student of students) {
      const results = await Result.findAll({
        where: { student_id: student.id, ...(exam_type ? { exam_type } : {}) },
        include: [{ model: Subject, as: 'subject' }],
      });

      const totalMarks = results.reduce((s, r) => s + parseFloat(r.total_mark), 0);
      const subjectCount = results.length || 1;
      const avgGPA = results.reduce((s, r) => s + parseFloat(r.gpa), 0) / subjectCount;

      resultData.push({
        student,
        results,
        total_marks: totalMarks,
        gpa: avgGPA.toFixed(2),
        grade: getGrade(avgGPA),
      });
    }

    // Sort by GPA descending for ranking
    resultData.sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa));
    resultData.forEach((r, i) => r.position = i + 1);

    const passed = resultData.filter(r => parseFloat(r.gpa) >= 1.0).length;

    res.json({
      success: true,
      data: {
        summary: { total: resultData.length, passed, failed: resultData.length - passed, pass_rate: resultData.length > 0 ? ((passed / resultData.length) * 100).toFixed(1) : 0 },
        results: resultData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.meritList = async (req, res) => {
  try {
    const { class_id, exam_type, limit = 10 } = req.query;
    if (!class_id) return res.status(400).json({ success: false, message: 'Class ID required.' });

    const students = await Student.findAll({ where: { class_id } });
    const list = [];

    for (const student of students) {
      const results = await Result.findAll({
        where: { student_id: student.id, ...(exam_type ? { exam_type } : {}), is_published: true },
      });
      const total = results.reduce((s, r) => s + parseFloat(r.total_mark), 0);
      const gpa = results.length > 0 ? results.reduce((s, r) => s + parseFloat(r.gpa), 0) / results.length : 0;
      list.push({ student, total_marks: total, gpa: gpa.toFixed(2), grade: getGrade(gpa) });
    }

    list.sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa));
    const top = list.slice(0, parseInt(limit));
    top.forEach((r, i) => r.position = i + 1);

    res.json({ success: true, data: top });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.failList = async (req, res) => {
  try {
    const { class_id, exam_type } = req.query;
    if (!class_id) return res.status(400).json({ success: false, message: 'Class ID required.' });

    const students = await Student.findAll({ where: { class_id } });
    const list = [];

    for (const student of students) {
      const results = await Result.findAll({
        where: { student_id: student.id, ...(exam_type ? { exam_type } : {}), is_published: true },
      });
      if (results.length > 0) {
        const gpa = results.reduce((s, r) => s + parseFloat(r.gpa), 0) / results.length;
        if (gpa < 1.0) {
          const failingSubjects = results.filter(r => parseFloat(r.gpa) < 1.0);
          list.push({ student, gpa: gpa.toFixed(2), failing_subjects: failingSubjects.length, subjects: failingSubjects.map(r => r.subject_id) });
        }
      }
    }

    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
