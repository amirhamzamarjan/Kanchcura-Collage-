-- ============================================================
-- KANCHKURA COLLEGE ERP - COMPLETE MySQL DATABASE SCHEMA
-- Version: 1.0.0
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS `kanchkura_college`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `kanchkura_college`;

-- ============================================================
-- 1. USERS - System authentication & role management
-- ============================================================
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('super-admin','principal','admin','accounts','teacher') NOT NULL DEFAULT 'teacher',
  `phone` VARCHAR(20) DEFAULT NULL,
  `avatar` VARCHAR(20) DEFAULT NULL,
  `employee_id` VARCHAR(50) DEFAULT NULL UNIQUE,
  `is_active` TINYINT(1) DEFAULT 1,
  `is_two_factor_enabled` TINYINT(1) DEFAULT 0,
  `two_factor_secret` VARCHAR(255) DEFAULT NULL,
  `last_login` DATETIME DEFAULT NULL,
  `last_activity` DATETIME DEFAULT NULL,
  `password_changed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_employee_id` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. DEPARTMENTS - Academic departments
-- ============================================================
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  INDEX `idx_departments_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. GROUPS - Department groups (Science, Commerce, Humanities)
-- ============================================================
CREATE TABLE `groups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `department_id` INT NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_groups_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_groups_department` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. SECTIONS - Class sections (A, B, C, D)
-- ============================================================
CREATE TABLE `sections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. CLASSES - Academic classes (9, 10, 11, 12)
-- ============================================================
CREATE TABLE `classes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `numeric_value` INT NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  INDEX `idx_classes_numeric` (`numeric_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. SUBJECTS - Academic subjects per department
-- ============================================================
CREATE TABLE `subjects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `department_id` INT NOT NULL,
  `full_marks` INT DEFAULT 100,
  `pass_marks` INT DEFAULT 33,
  `is_optional` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_subjects_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_subjects_department` (`department_id`),
  INDEX `idx_subjects_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. STUDENTS - Complete personal & academic information
-- ============================================================
CREATE TABLE `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Auto-generated student ID (KCC-YYYY-SEQ)',
  `roll_number` INT DEFAULT NULL COMMENT 'Auto-generated roll number per class/section',
  `full_name` VARCHAR(150) NOT NULL,
  `bengali_name` VARCHAR(150) DEFAULT NULL,
  `father_name` VARCHAR(150) DEFAULT NULL,
  `mother_name` VARCHAR(150) DEFAULT NULL,
  `guardian_name` VARCHAR(150) DEFAULT NULL,
  `father_occupation` VARCHAR(100) DEFAULT NULL,
  `mother_occupation` VARCHAR(100) DEFAULT NULL,
  `guardian_phone` VARCHAR(20) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `blood_group` VARCHAR(10) DEFAULT NULL,
  `religion` VARCHAR(50) DEFAULT NULL,
  `nationality` VARCHAR(50) DEFAULT 'Bangladeshi',
  `gender` ENUM('Male','Female','Other') DEFAULT NULL,
  `date_of_birth` DATE DEFAULT NULL,
  `nid_birth_certificate` VARCHAR(50) DEFAULT NULL,
  `present_address` TEXT DEFAULT NULL,
  `permanent_address` TEXT DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `session` VARCHAR(20) DEFAULT NULL,
  `shift` ENUM('morning','day') DEFAULT NULL,
  `registration_number` VARCHAR(50) DEFAULT NULL COMMENT 'Auto-generated registration number',
  `academic_year` VARCHAR(20) DEFAULT NULL,
  `admission_date` DATE DEFAULT NULL,
  `department_id` INT DEFAULT NULL,
  `class_id` INT DEFAULT NULL,
  `section_id` INT DEFAULT NULL,
  `group_id` INT DEFAULT NULL,
  `status` ENUM('active','inactive','graduated','transferred','expelled') DEFAULT 'active',
  `is_alumni` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_students_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_students_class` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_students_section` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_students_group` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_students_student_id` (`student_id`),
  INDEX `idx_students_class` (`class_id`),
  INDEX `idx_students_department` (`department_id`),
  INDEX `idx_students_session` (`session`),
  INDEX `idx_students_status` (`status`),
  INDEX `idx_students_full_name` (`full_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. STUDENT_SUBJECTS - Many-to-many: students <-> subjects
-- ============================================================
CREATE TABLE `student_subjects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `is_compulsory` TINYINT(1) DEFAULT 1,
  `is_elective` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_stusub_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_stusub_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `uq_student_subject` (`student_id`, `subject_id`),
  INDEX `idx_stusub_student` (`student_id`),
  INDEX `idx_stusub_subject` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. TEACHERS - Faculty records
-- ============================================================
CREATE TABLE `teachers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `subject_id` INT DEFAULT NULL,
  `qualification` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `joining_date` DATE DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `assigned_classes` JSON DEFAULT NULL COMMENT 'JSON array of class-section assignments',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_teachers_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_teachers_employee_id` (`employee_id`),
  INDEX `idx_teachers_subject` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. ADMISSIONS - Admission workflow tracking
-- ============================================================
CREATE TABLE `admissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL UNIQUE,
  `admission_no` VARCHAR(50) NOT NULL UNIQUE,
  `admission_date` DATE NOT NULL,
  `session` VARCHAR(20) NOT NULL,
  `class_id` INT DEFAULT NULL,
  `department_id` INT DEFAULT NULL,
  `group_id` INT DEFAULT NULL,
  `shift` ENUM('morning','day') DEFAULT NULL,
  `is_approved` TINYINT(1) DEFAULT 0,
  `approved_by` INT DEFAULT NULL,
  `status` ENUM('pending','approved','rejected','cancelled') DEFAULT 'pending',
  `remarks` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_admissions_class` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_admissions_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_admissions_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_admissions_status` (`status`),
  INDEX `idx_admissions_session` (`session`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. ATTENDANCE - Daily attendance tracking
-- ============================================================
CREATE TABLE `attendance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `class_id` INT DEFAULT NULL,
  `section_id` INT DEFAULT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('present','absent','late','leave') NOT NULL,
  `marked_by` INT DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_attendance_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attendance_class` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_attendance_section` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_attendance_marked_by` FOREIGN KEY (`marked_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE KEY `uq_student_date` (`student_id`, `date`),
  INDEX `idx_attendance_date` (`date`),
  INDEX `idx_attendance_status` (`status`),
  INDEX `idx_attendance_class_date` (`class_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. FEES - Fee structures per class
-- ============================================================
CREATE TABLE `fees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT DEFAULT NULL,
  `admission_fee` DECIMAL(10,2) DEFAULT 0.00,
  `monthly_fee` DECIMAL(10,2) DEFAULT 0.00,
  `registration_fee` DECIMAL(10,2) DEFAULT 0.00,
  `exam_fee` DECIMAL(10,2) DEFAULT 0.00,
  `practical_fee` DECIMAL(10,2) DEFAULT 0.00,
  `library_fee` DECIMAL(10,2) DEFAULT 0.00,
  `transport_fee` DECIMAL(10,2) DEFAULT 0.00,
  `fine_amount` DECIMAL(10,2) DEFAULT 0.00,
  `scholarship_discount` DECIMAL(10,2) DEFAULT 0.00,
  `waiver` DECIMAL(10,2) DEFAULT 0.00,
  `total_fee` DECIMAL(10,2) DEFAULT 0.00,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_fees_class` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_fees_class` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. PAYMENTS - All fee transactions
-- ============================================================
CREATE TABLE `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `receipt_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Auto-generated receipt number',
  `invoice_number` VARCHAR(50) DEFAULT NULL UNIQUE COMMENT 'Auto-generated invoice number',
  `fee_type` ENUM('admission','monthly','registration','exam','practical','library','transport','fine','other') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `paid_amount` DECIMAL(10,2) NOT NULL,
  `due_amount` DECIMAL(10,2) DEFAULT 0.00,
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
  `fine_amount` DECIMAL(10,2) DEFAULT 0.00,
  `payment_date` DATE NOT NULL,
  `payment_time` TIME DEFAULT NULL,
  `payment_method` ENUM('cash','bank','mobile','card') DEFAULT 'cash',
  `status` ENUM('paid','partial','unpaid','cancelled') DEFAULT 'unpaid',
  `month` VARCHAR(20) DEFAULT NULL COMMENT 'Month the fee is for',
  `year` VARCHAR(10) DEFAULT NULL COMMENT 'Year the fee is for',
  `collected_by` INT DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_payments_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_collected_by` FOREIGN KEY (`collected_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_payments_receipt` (`receipt_number`),
  INDEX `idx_payments_student` (`student_id`),
  INDEX `idx_payments_status` (`status`),
  INDEX `idx_payments_date` (`payment_date`),
  INDEX `idx_payments_fee_type` (`fee_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. RECEIPTS - Payment receipt tracking
-- ============================================================
CREATE TABLE `receipts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `receipt_number` VARCHAR(50) NOT NULL UNIQUE,
  `payment_id` INT DEFAULT NULL,
  `student_id` INT NOT NULL,
  `receipt_date` DATE NOT NULL,
  `receipt_type` VARCHAR(50) DEFAULT NULL,
  `pdf_path` VARCHAR(255) DEFAULT NULL COMMENT 'Path to generated PDF receipt',
  `is_printed` TINYINT(1) DEFAULT 0,
  `print_count` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_receipts_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_receipts_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_receipts_number` (`receipt_number`),
  INDEX `idx_receipts_payment` (`payment_id`),
  INDEX `idx_receipts_date` (`receipt_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. RESULTS - Student exam results
-- ============================================================
CREATE TABLE `results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `exam_type` ENUM('class-test','mid-term','final','pre-test','model-test') NOT NULL,
  `class_test_mark` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Out of 20',
  `mid_term_mark` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Out of 30',
  `final_mark` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Out of 50',
  `practical_mark` DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Practical marks',
  `total_mark` DECIMAL(6,2) DEFAULT 0.00 COMMENT 'Auto-calculated total',
  `gpa` DECIMAL(4,2) DEFAULT 0.00 COMMENT 'Auto-calculated GPA',
  `grade` VARCHAR(5) DEFAULT 'F' COMMENT 'Auto-calculated grade',
  `position` INT DEFAULT NULL COMMENT 'Class position/rank',
  `is_published` TINYINT(1) DEFAULT 0,
  `published_by` INT DEFAULT NULL,
  `published_at` DATETIME DEFAULT NULL,
  `entered_by` INT DEFAULT NULL COMMENT 'Teacher who entered marks',
  `remarks` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_results_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_results_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_results_published_by` FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_results_entered_by` FOREIGN KEY (`entered_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE KEY `uq_student_subject_exam` (`student_id`, `subject_id`, `exam_type`),
  INDEX `idx_results_student` (`student_id`),
  INDEX `idx_results_subject` (`subject_id`),
  INDEX `idx_results_exam_type` (`exam_type`),
  INDEX `idx_results_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. NOTICES - Notice board system
-- ============================================================
CREATE TABLE `notices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `category` ENUM('general','academic','exam','event','urgent') DEFAULT 'general',
  `is_pinned` TINYINT(1) DEFAULT 0,
  `published_date` DATE DEFAULT NULL,
  `published_by` INT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_notices_published_by` FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_notices_category` (`category`),
  INDEX `idx_notices_pinned` (`is_pinned`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. NOTIFICATIONS - In-app user notifications
-- ============================================================
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT DEFAULT NULL,
  `type` ENUM('info','success','warning','error') DEFAULT 'info',
  `is_read` TINYINT(1) DEFAULT 0,
  `read_at` DATETIME DEFAULT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_notifications_user` (`user_id`),
  INDEX `idx_notifications_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. AUDIT_LOGS - Activity audit trail
-- ============================================================
CREATE TABLE `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` INT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_audit_user` (`user_id`),
  INDEX `idx_audit_action` (`action`),
  INDEX `idx_audit_entity` (`entity_type`, `entity_id`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. SETTINGS - System configuration key-value store
-- ============================================================
CREATE TABLE `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT 'string' COMMENT 'string, number, boolean, json',
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  INDEX `idx_settings_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 20. BACKUPS - Database backup tracking
-- ============================================================
CREATE TABLE `backups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_size` BIGINT DEFAULT NULL,
  `type` ENUM('manual','auto','scheduled') DEFAULT 'manual',
  `status` ENUM('pending','completed','failed','restored') DEFAULT 'pending',
  `notes` TEXT DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_backups_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_backups_status` (`status`),
  INDEX `idx_backups_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SCHEMA COMPLETE
-- Total: 20 tables
-- Foreign Keys: 27
-- Indexes: 45+
-- ============================================================
