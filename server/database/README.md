# Kanchkura College ERP - Database Layer Documentation

## Overview

The database layer provides a complete MySQL-backed data storage system for the Kanchkura College ERP, replacing all mock/in-memory data with persistent database queries. It includes 20 tables, auto-generation logic for student IDs and roll numbers, subject assignment based on department, PDF receipt generation, and automated backups.

---

## Database Configuration

**Connection**: `server/config/database.js` (Sequelize ORM)
**Environment**: `.env` (see `.env.example`)

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kanchkura_college
DB_USER=root
DB_PASSWORD=
```

---

## Database Folder Structure

```
server/database/
├── schema.sql                  # Complete DDL (20 tables)
├── seed.sql                    # Default/seed data
├── setup.js                    # One-click database setup
├── README.md                   # This file
│
├── migrations/
│   ├── run.js                  # Migration runner
│   ├── 001_initial_schema.js   # Core tables
│   ├── 002_students.js         # Student indexes & views
│   ├── 003_teachers.js         # Teacher indexes & views
│   ├── 004_results.js          # GPA functions & result views
│   └── 005_payments.js         # Financial summary views
│
└── backups/
    ├── backupSystem.js         # Backup & restore utility
    └── *.sql                   # Generated backup files
```

---

## Complete Schema (20 Tables)

| # | Table | Type | Purpose | Key Relationships |
|---|-------|------|---------|-------------------|
| 1 | `users` | Core | Authentication & RBAC | → audit_logs, notifications |
| 2 | `departments` | Reference | Academic departments | → groups, subjects, students |
| 3 | `groups` | Reference | Department groups | → departments |
| 4 | `sections` | Reference | Class sections (A-D) | → students, attendance |
| 5 | `classes` | Reference | Grade levels (9-12) | → students, fees, attendance |
| 6 | `subjects` | Reference | Academic subjects | → departments, teachers |
| 7 | `students` | Core | Student personal + academic | → departments, classes, sections |
| 8 | `student_subjects` | Junction | M2M students ↔ subjects | → students, subjects |
| 9 | `teachers` | Core | Faculty records | → subjects |
| 10 | `admissions` | Process | Admission workflow | → classes, departments |
| 11 | `attendance` | Process | Daily attendance tracking | → students, classes |
| 12 | `fees` | Finance | Fee structures per class | → classes |
| 13 | `payments` | Finance | Payment transactions | → students, users |
| 14 | `receipts` | Finance | Payment receipt records | → payments, students |
| 15 | `results` | Academics | Exam marks & grades | → students, subjects |
| 16 | `notices` | Content | Notice board | → users |
| 17 | `notifications` | System | In-app notifications | → users |
| 18 | `audit_logs` | System | Activity audit trail | → users |
| 19 | `settings` | Config | Key-value configuration | – |
| 20 | `backups` | System | Backup tracking | → users |

---

## Auto-Generation Logic

### Student ID Format
```
KCC-{SESSION}-{SEQ}
Example: KCC-2025-001
```

### Roll Number
- Auto-incremented per class + section + department combination
- Reset each academic year

### Registration Number
```
REG-{SESSION}-{SEQ}
Example: REG-2025-001
```

### Receipt Number
```
RCP-{YEAR}-{SEQ:0001}
Example: RCP-2025-0001
```

---

## Subject Assignment Logic

When a student is admitted, subjects are auto-assigned based on their department:

**Science** (7 subjects):
`Bangla`, `English`, `ICT`, `Physics`, `Chemistry`, `Biology`, `Higher Mathematics`

**Commerce** (6 subjects):
`Bangla`, `English`, `ICT`, `Accounting`, `Finance`, `Business Organization`

**Humanities** (7 subjects):
`Bangla`, `English`, `ICT`, `History`, `Civics`, `Economics`, `Geography`

---

## GPA & Grade System

| Marks Range | GPA | Grade |
|-------------|-----|-------|
| 80-100 | 5.00 | A+ |
| 70-79 | 4.00 | A |
| 60-69 | 3.50 | A- |
| 50-59 | 3.00 | B |
| 40-49 | 2.00 | C |
| 33-39 | 1.00 | D |
| 0-32 | 0.00 | F |

Pass marks: 33 | Full marks per subject: 100

---

## Backup System

The backup system supports:

- **Manual backups**: `npm run db:backup`
- **Automated backups**: Via cron/scheduler
- **Backup restoration**: `npm run db:restore <filename>`
- **Retention policy**: Keeps last 30 days / 20 backups
- **Status tracking**: Every backup recorded in `backups` table

### Backup Commands
```bash
npm run db:backup              # Create backup
npm run db:restore <file>      # Restore from backup
npm run db:list                # List all backups
npm run db:cleanup             # Clean old backups
```

---

## Initial Setup Commands

```bash
# One-command setup (creates DB, runs schema, seeds, syncs models)
npm run db:setup

# Or step-by-step:
npm run db:schema              # Create tables
npm run db:seed                # Insert seed data
npm run db:migrate             # Run migrations
```

---

## Migration System

Migrations are tracked in the `_migrations` table to ensure each runs exactly once:

```bash
npm run db:migrate             # Apply pending migrations
```

Migration order:
1. `001_initial_schema` - Core 20 tables
2. `002_students` - Student indexes & views
3. `003_teachers` - Teacher indexes
4. `004_results` - GPA functions & result views
5. `005_payments` - Financial summary views

---

## Database Views (read-only summarized data)

| View | Description |
|------|-------------|
| `vw_student_details` | Students with class, department, section names |
| `vw_teacher_details` | Teachers with subject names |
| `vw_results_summary` | Aggregated results per student per exam |
| `vw_financial_summary` | Monthly collection by fee type |
| `vw_student_fee_status` | Student payment standing (CLEAR/DUE) |

---

## Foreign Key Relationships

```
departments ──┬── groups
              ├── subjects
              └── students

classes ──┬── students
          ├── fees
          └── attendance

students ──┬── student_subjects
           ├── attendance
           ├── payments
           ├── results
           └── receipts

subjects ──┬── student_subjects
           ├── teachers
           └── results

users ──┬── audit_logs
        ├── notifications
        ├── payments (collected_by)
        └── notices (published_by)
```
