const helpers = {
  capitalize: (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '',

  formatDate: (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  generateStudentId: (session, deptCode, seq) => {
    const prefix = `KCC-${session}`;
    return `${prefix}-${deptCode}-${String(seq).padStart(3, '0')}`;
  },

  generateReceiptNo: (year, seq) => `RCP-${year}-${String(seq).padStart(4, '0')}`,

  generateEmployeeId: (prefix, seq) => `${prefix}-${String(seq).padStart(3, '0')}`,

  calculateGPA: (total) => {
    if (total >= 80) return 5.0;
    if (total >= 70) return 4.0;
    if (total >= 60) return 3.5;
    if (total >= 50) return 3.0;
    if (total >= 40) return 2.0;
    if (total >= 33) return 1.0;
    return 0.0;
  },

  calculateGrade: (gpa) => {
    if (gpa >= 5.0) return 'A+';
    if (gpa >= 4.0) return 'A';
    if (gpa >= 3.5) return 'A-';
    if (gpa >= 3.0) return 'B';
    if (gpa >= 2.0) return 'C';
    if (gpa >= 1.0) return 'D';
    return 'F';
  },

  getAge: (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  },

  safeParseInt: (val, def = 0) => {
    const parsed = parseInt(val);
    return isNaN(parsed) ? def : parsed;
  },

  sanitize: (str) => str?.replace(/[<>]/g, '') || '',

  buildWhereClause: (query, allowedFields) => {
    const where = {};
    for (const field of allowedFields) {
      if (query[field] !== undefined) {
        where[field] = query[field];
      }
    }
    return where;
  },
};

module.exports = helpers;
