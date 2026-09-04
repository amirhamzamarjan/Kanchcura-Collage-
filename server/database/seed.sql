-- ============================================================
-- KANCHKURA COLLEGE ERP - DATABASE SEED DATA
-- This inserts default data required for the system to run
-- ============================================================

USE `kanchkura_college`;

-- ============================================================
-- 1. DEFAULT USERS (passwords hashed with bcrypt, salt=10)
-- Plain: admin123 for all admin roles, teacher123 for teachers
-- ============================================================
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `avatar`, `employee_id`, `is_active`) VALUES
('Super Admin', 'admin@kanchkura.edu.bd', '$2a$10$yh4rZ5II0D9XsGlxX.0WreKghoqSing9QtluY.HFFLvTrtcjaJfWi', 'super-admin', '01700000001', 'SA', 'EMP-001', 1),
('Dr. Rafiq Ahmed', 'principal@kanchkura.edu.bd', '$2a$10$yh4rZ5II0D9XsGlxX.0WreKghoqSing9QtluY.HFFLvTrtcjaJfWi', 'principal', '01700000002', 'RA', 'EMP-002', 1),
('Nusrat Jahan', 'admin2@kanchkura.edu.bd', '$2a$10$yh4rZ5II0D9XsGlxX.0WreKghoqSing9QtluY.HFFLvTrtcjaJfWi', 'admin', '01700000003', 'NJ', 'EMP-003', 1),
('Kamal Hossain', 'accounts@kanchkura.edu.bd', '$2a$10$yh4rZ5II0D9XsGlxX.0WreKghoqSing9QtluY.HFFLvTrtcjaJfWi', 'accounts', '01700000004', 'KH', 'EMP-004', 1),
('Fatema Begum', 'fatema@kanchkura.edu.bd', '$2a$10$HNno6OCwfPbtHWoya2atleSVHw7fv0OeS9YL4Up8Yigi4dMfix8Ue', 'teacher', '01700000005', 'FB', 'EMP-005', 1),
('Abdur Rahman', 'rahman@kanchkura.edu.bd', '$2a$10$HNno6OCwfPbtHWoya2atleSVHw7fv0OeS9YL4Up8Yigi4dMfix8Ue', 'teacher', '01700000006', 'AR', 'EMP-006', 1),
('Sabrina Akter', 'sabrina@kanchkura.edu.bd', '$2a$10$HNno6OCwfPbtHWoya2atleSVHw7fv0OeS9YL4Up8Yigi4dMfix8Ue', 'teacher', '01700000007', 'SA', 'EMP-007', 1);

-- ============================================================
-- 2. DEPARTMENTS
-- ============================================================
INSERT INTO `departments` (`name`, `code`, `description`) VALUES
('Science', 'science', 'Science and Technology Department - Physics, Chemistry, Biology, Mathematics'),
('Commerce', 'commerce', 'Commerce and Business Studies Department - Accounting, Finance, Business'),
('Humanities', 'humanities', 'Humanities and Social Sciences Department - History, Civics, Economics, Geography');

-- ============================================================
-- 3. CLASSES
-- ============================================================
INSERT INTO `classes` (`name`, `numeric_value`) VALUES
('Class 9', 9),
('Class 10', 10),
('Class 11', 11),
('Class 12', 12);

-- ============================================================
-- 4. SECTIONS
-- ============================================================
INSERT INTO `sections` (`name`, `code`) VALUES
('A', 'A'),
('B', 'B'),
('C', 'C'),
('D', 'D');

-- ============================================================
-- 5. GROUPS (mapped to departments)
-- ============================================================
INSERT INTO `groups` (`name`, `code`, `department_id`) VALUES
('Science', 'science', 1),
('Commerce', 'commerce', 2),
('Humanities', 'humanities', 3);

-- ============================================================
-- 6. SUBJECTS (grouped by department)
-- Science: Bangla, English, ICT, Physics, Chemistry, Biology, Higher Mathematics
-- Commerce: Bangla, English, ICT, Accounting, Finance, Business Organization
-- Humanities: Bangla, English, ICT, History, Civics, Economics, Geography
-- ============================================================
INSERT INTO `subjects` (`name`, `code`, `department_id`, `full_marks`, `pass_marks`) VALUES
-- Science (department_id = 1)
('Bangla', 'BAN', 1, 100, 33),
('English', 'ENG', 1, 100, 33),
('ICT', 'ICT', 1, 100, 33),
('Physics', 'PHY', 1, 100, 33),
('Chemistry', 'CHEM', 1, 100, 33),
('Biology', 'BIO', 1, 100, 33),
('Higher Mathematics', 'HMATH', 1, 100, 33),
-- Commerce (department_id = 2)
('Accounting', 'ACC', 2, 100, 33),
('Finance', 'FIN', 2, 100, 33),
('Business Organization', 'BUSORG', 2, 100, 33),
-- Humanities (department_id = 3)
('History', 'HIS', 3, 100, 33),
('Civics', 'CIV', 3, 100, 33),
('Economics', 'ECO', 3, 100, 33),
('Geography', 'GEO', 3, 100, 33);

-- ============================================================
-- 7. FEE STRUCTURES (per class)
-- ============================================================
INSERT INTO `fees` (`class_id`, `admission_fee`, `monthly_fee`, `registration_fee`, `exam_fee`, `practical_fee`, `library_fee`, `transport_fee`, `total_fee`) VALUES
(1, 5000, 2500, 1500, 1000, 400, 200, 1500, 12100),
(2, 5000, 2800, 1500, 1200, 400, 200, 1500, 12600),
(3, 8000, 3500, 2000, 1500, 500, 300, 2000, 17800),
(4, 8000, 3800, 2000, 1500, 500, 300, 2000, 18100);

-- ============================================================
-- 8. DEFAULT SETTINGS
-- ============================================================
INSERT INTO `settings` (`key`, `value`, `type`, `description`) VALUES
('college_name', 'Kanchkura College', 'string', 'Official name of the college'),
('college_address', 'Kanchkura, Kishoreganj, Bangladesh', 'string', 'College address'),
('college_phone', '01700-000000', 'string', 'College phone number'),
('college_email', 'info@kanchkura.edu.bd', 'string', 'College email address'),
('receipt_footer', 'Thank you for your payment. This is a computer-generated receipt.', 'string', 'Footer text on payment receipts'),
('academic_year', '2025-2026', 'string', 'Current academic year'),
('session', '2025', 'string', 'Current session'),
('exam_pass_marks', '33', 'number', 'Minimum pass marks for exams'),
('attendance_threshold', '75', 'number', 'Minimum attendance percentage required');

-- ============================================================
-- 9. DEMO STUDENTS
-- ============================================================
INSERT INTO `students` (`student_id`, `roll_number`, `full_name`, `bengali_name`, `father_name`, `mother_name`, `guardian_phone`, `phone`, `email`, `blood_group`, `religion`, `nationality`, `gender`, `date_of_birth`, `present_address`, `department_id`, `class_id`, `section_id`, `group_id`, `session`, `shift`, `registration_number`, `academic_year`, `admission_date`, `status`) VALUES
('KCC-2024-001', 1, 'Ariful Islam', 'আরিফুল ইসলাম', 'Rafiqul Islam', 'Rashida Begum', '01712345678', '01812345678', 'ariful@student.kanchkura.edu.bd', 'B+', 'Islam', 'Bangladeshi', 'Male', '2008-05-15', 'Mirpur-10, Dhaka', 1, 2, 1, 1, '2024', 'morning', 'REG-2024-001', '2024-2025', '2024-01-15', 'active'),
('KCC-2024-002', 2, 'Sabrina Akter', 'সাবরিনা আক্তার', 'Monirul Haque', 'Salma Khatun', '01723456789', '01823456789', 'sabrina@student.kanchkura.edu.bd', 'A+', 'Islam', 'Bangladeshi', 'Female', '2007-08-22', 'Uttara-12, Dhaka', 1, 2, 1, 1, '2024', 'morning', 'REG-2024-002', '2024-2025', '2024-01-15', 'active'),
('KCC-2024-003', 3, 'Tanvir Ahmed', 'তানভীর আহমেদ', 'Shahidul Alam', 'Nargis Akter', '01734567890', '01834567890', 'tanvir@student.kanchkura.edu.bd', 'O+', 'Islam', 'Bangladeshi', 'Male', '2008-02-10', 'Dhanmondi, Dhaka', 1, 2, 1, 1, '2024', 'morning', 'REG-2024-003', '2024-2025', '2024-01-15', 'active'),
('KCC-2024-004', 1, 'Nusrat Jahan', 'নুসরাত জাহান', 'Kamal Ahmed', 'Roksana Begum', '01745678901', '01845678901', 'nusrat@student.kanchkura.edu.bd', 'AB+', 'Islam', 'Bangladeshi', 'Female', '2007-11-30', 'Banani, Dhaka', 2, 3, 2, 2, '2024', 'morning', 'REG-2024-004', '2024-2025', '2024-01-16', 'active'),
('KCC-2024-005', 2, 'Rakibul Hasan', 'রাকিবুল হাসান', 'Mizanur Rahman', 'Shahana Parveen', '01756789012', '01856789012', 'rakibul@student.kanchkura.edu.bd', 'B-', 'Islam', 'Bangladeshi', 'Male', '2008-07-05', 'Gulshan-2, Dhaka', 2, 3, 2, 2, '2024', 'morning', 'REG-2024-005', '2024-2025', '2024-01-16', 'active'),
('KCC-2025-001', 1, 'Fatema Begum', 'ফাতেমা বেগম', 'Abdul Karim', 'Khalida Khatun', '01767890123', '01867890123', 'fatema@student.kanchkura.edu.bd', 'A-', 'Islam', 'Bangladeshi', 'Female', '2009-01-20', 'Mohammadpur, Dhaka', 3, 1, 1, 3, '2025', 'morning', 'REG-2025-001', '2025-2026', '2025-01-10', 'active');

-- ============================================================
-- 10. STUDENT-SUBJECT ASSIGNMENTS (auto-assigned by department)
-- Science students get subjects 1-7 (Bangla through Higher Math)
-- Commerce students get 1-3 (Bangla, Eng, ICT) + 8-10 (Acc, Fin, BusOrg)
-- Humanities students get 1-3 (Bangla, Eng, ICT) + 11-14 (His, Civ, Eco, Geo)
-- ============================================================
INSERT INTO `student_subjects` (`student_id`, `subject_id`, `is_compulsory`) VALUES
-- Ariful Islam (Science, student_id=1)
(1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 4, 1), (1, 5, 1), (1, 6, 1), (1, 7, 1),
-- Sabrina Akter (Science, student_id=2)
(2, 1, 1), (2, 2, 1), (2, 3, 1), (2, 4, 1), (2, 5, 1), (2, 6, 1), (2, 7, 1),
-- Tanvir Ahmed (Science, student_id=3)
(3, 1, 1), (3, 2, 1), (3, 3, 1), (3, 4, 1), (3, 5, 1), (3, 6, 1), (3, 7, 1),
-- Nusrat Jahan (Commerce, student_id=4)
(4, 1, 1), (4, 2, 1), (4, 3, 1), (4, 8, 1), (4, 9, 1), (4, 10, 1),
-- Rakibul Hasan (Commerce, student_id=5)
(5, 1, 1), (5, 2, 1), (5, 3, 1), (5, 8, 1), (5, 9, 1), (5, 10, 1),
-- Fatema Begum (Humanities, student_id=6)
(6, 1, 1), (6, 2, 1), (6, 3, 1), (6, 11, 1), (6, 12, 1), (6, 13, 1), (6, 14, 1);

-- ============================================================
-- 11. DEMO TEACHERS
-- ============================================================
INSERT INTO `teachers` (`employee_id`, `name`, `subject_id`, `qualification`, `phone`, `email`, `joining_date`) VALUES
('TCH-001', 'Fatema Begum', 1, 'M.A', '01711111111', 'fatema@kanchkura.edu.bd', '2020-01-01'),
('TCH-002', 'Abdur Rahman', 2, 'M.Ed', '01722222222', 'rahman@kanchkura.edu.bd', '2019-06-15'),
('TCH-003', 'Sabrina Akter', 4, 'M.Sc', '01733333333', 'sabrina@kanchkura.edu.bd', '2021-03-01'),
('TCH-004', 'Kamal Hossain', 5, 'M.Sc', '01744444444', 'kamal@kanchkura.edu.bd', '2018-09-01'),
('TCH-005', 'Nusrat Jahan', 3, 'B.Sc (Hons)', '01755555555', 'nusrat@kanchkura.edu.bd', '2022-01-01'),
('TCH-006', 'Dr. Rafiq Ahmed', 7, 'PhD', '01766666666', 'rafiq@kanchkura.edu.bd', '2015-01-01');

-- ============================================================
-- 12. SAMPLE NOTICES
-- ============================================================
INSERT INTO `notices` (`title`, `content`, `category`, `is_pinned`, `published_date`, `published_by`) VALUES
('Annual Sports Day 2025', 'The annual sports day will be held on February 28, 2025. All students must participate in at least one event. Prizes will be distributed by the Chief Guest.', 'event', 1, '2025-01-10', 2),
('Mid-Term Examination Schedule', 'Mid-term examinations for classes 9-12 will begin from March 15, 2025. Students are requested to prepare accordingly. Detailed schedule will be published soon.', 'exam', 1, '2025-01-08', 3),
('Fee Submission Deadline', 'Monthly fee for January 2025 must be submitted by January 25, 2025. Late fee of ৳200 will be charged after the deadline. Contact accounts office for queries.', 'urgent', 0, '2025-01-05', 4),
('Science Fair 2025', 'Science fair will be organized on February 15, 2025. Science group students can register their projects with the science department by January 30, 2025.', 'academic', 0, '2025-01-03', 3),
('Parent-Teacher Meeting', 'Parent-teacher meeting for classes 9 and 10 will be held on January 25, 2025 from 10:00 AM to 1:00 PM. Parents are requested to attend.', 'academic', 0, '2024-12-28', 2);

-- ============================================================
-- 13. DEMO PAYMENTS
-- ============================================================
INSERT INTO `payments` (`student_id`, `receipt_number`, `invoice_number`, `fee_type`, `amount`, `paid_amount`, `due_amount`, `payment_date`, `payment_time`, `payment_method`, `status`, `month`, `year`, `collected_by`) VALUES
(1, 'RCP-2025-0001', 'INV-RCP-2025-0001', 'monthly', 2800, 2800, 0, '2025-01-15', '10:30:00', 'cash', 'paid', 'January', '2025', 1),
(2, 'RCP-2025-0002', 'INV-RCP-2025-0002', 'monthly', 2800, 1500, 1300, '2025-01-15', '11:00:00', 'mobile', 'partial', 'January', '2025', 1),
(3, 'RCP-2025-0003', 'INV-RCP-2025-0003', 'admission', 5000, 5000, 0, '2025-01-14', '09:45:00', 'bank', 'paid', 'January', '2025', 1),
(4, 'RCP-2025-0004', 'INV-RCP-2025-0004', 'monthly', 3500, 3500, 0, '2025-01-13', '14:15:00', 'cash', 'paid', 'January', '2025', 1),
(6, 'RCP-2025-0005', 'INV-RCP-2025-0005', 'admission', 5000, 5000, 0, '2025-01-10', '10:00:00', 'cash', 'paid', 'January', '2025', 1);

INSERT INTO `receipts` (`receipt_number`, `payment_id`, `student_id`, `receipt_date`, `receipt_type`, `is_printed`) VALUES
('RCP-2025-0001', 1, 1, '2025-01-15', 'monthly', 1),
('RCP-2025-0002', 2, 2, '2025-01-15', 'monthly', 1),
('RCP-2025-0003', 3, 3, '2025-01-14', 'admission', 1),
('RCP-2025-0004', 4, 4, '2025-01-13', 'monthly', 1),
('RCP-2025-0005', 5, 6, '2025-01-10', 'admission', 1);

-- ============================================================
-- 14. DEMO ATTENDANCE
-- ============================================================
INSERT INTO `attendance` (`student_id`, `class_id`, `section_id`, `date`, `status`, `marked_by`) VALUES
(1, 2, 1, '2025-01-15', 'present', 1), (2, 2, 1, '2025-01-15', 'present', 1), (3, 2, 1, '2025-01-15', 'late', 1),
(1, 2, 1, '2025-01-16', 'present', 1), (2, 2, 1, '2025-01-16', 'absent', 1), (3, 2, 1, '2025-01-16', 'present', 1),
(1, 2, 1, '2025-01-17', 'leave', 1), (2, 2, 1, '2025-01-17', 'present', 1), (3, 2, 1, '2025-01-17', 'present', 1),
(1, 2, 1, '2025-01-18', 'present', 1), (2, 2, 1, '2025-01-18', 'present', 1), (3, 2, 1, '2025-01-18', 'absent', 1),
(1, 2, 1, '2025-01-19', 'present', 1), (2, 2, 1, '2025-01-19', 'late', 1), (3, 2, 1, '2025-01-19', 'present', 1);

-- ============================================================
-- 15. DEMO RESULTS
-- ============================================================
INSERT INTO `results` (`student_id`, `subject_id`, `exam_type`, `class_test_mark`, `mid_term_mark`, `final_mark`, `total_mark`, `gpa`, `grade`, `is_published`, `published_by`) VALUES
-- Ariful Islam (student_id=1)
(1, 1, 'final', 16, 24, 40, 80, 5.00, 'A+', 1, 2),
(1, 2, 'final', 18, 26, 42, 86, 5.00, 'A+', 1, 2),
(1, 3, 'final', 19, 28, 45, 92, 5.00, 'A+', 1, 2),
(1, 4, 'final', 17, 25, 41, 83, 5.00, 'A+', 1, 2),
-- Sabrina Akter (student_id=2)
(2, 1, 'final', 14, 20, 35, 69, 3.50, 'A-', 1, 2),
(2, 2, 'final', 16, 23, 38, 77, 4.00, 'A', 1, 2),
(2, 3, 'final', 18, 26, 42, 86, 5.00, 'A+', 1, 2),
-- Tanvir Ahmed (student_id=3)
(3, 1, 'final', 17, 25, 42, 84, 5.00, 'A+', 1, 2),
(3, 2, 'final', 19, 28, 45, 92, 5.00, 'A+', 1, 2),
(3, 3, 'final', 20, 29, 48, 97, 5.00, 'A+', 1, 2);

-- ============================================================
-- SEED COMPLETE
-- ============================================================
