const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/others';
    const fileType = file.fieldname;

    if (fileType === 'student_photo') folder = 'uploads/photos';
    else if (fileType === 'teacher_photo') folder = 'uploads/photos';
    else if (fileType === 'college_logo') folder = 'uploads/logos';
    else if (fileType === 'principal_signature') folder = 'uploads/signatures';
    else if (fileType === 'document') folder = 'uploads/documents';
    else if (fileType === 'backup') folder = 'uploads/backups';

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImages = /jpeg|jpg|png|gif|webp/;
  const allowedDocs = /pdf|doc|docx|xls|xlsx|csv/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = file.mimetype;

  if (file.fieldname === 'backup') {
    if (ext === 'json' || ext === 'sql' || ext === 'gz') return cb(null, true);
    return cb(new Error('Only JSON, SQL, and GZ files allowed for backup.'));
  }

  if (file.fieldname.match(/photo|logo|signature/i)) {
    if (allowedImages.test(ext)) return cb(null, true);
    return cb(new Error('Only image files (JPG, PNG, GIF, WebP) allowed.'));
  }

  if (allowedImages.test(ext) || allowedDocs.test(ext)) return cb(null, true);
  cb(new Error('Invalid file type.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

module.exports = { upload, handleUploadError };
