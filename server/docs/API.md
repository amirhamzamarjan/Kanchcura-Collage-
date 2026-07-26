# Kanchkura College ERP - REST API Documentation

**Base URL:** `/api/v1`
**Content-Type:** `application/json`
**Auth:** Bearer Token (except login)

---

## 1. AUTHENTICATION

### POST `/auth/login`
Login with credentials.
```json
{ "email": "admin@kanchkura.edu.bd", "password": "admin123" }
```
Response: `{ success, data: { user, token } }`

### POST `/auth/forgot-password`
```json
{ "email": "user@example.com" }
```
### POST `/auth/reset-password`
```json
{ "token": "...", "newPassword": "..." }
```
### POST `/auth/change-password`
```json
{ "currentPassword": "...", "newPassword": "..." }
```
### GET `/auth/me`
Returns current user profile.

### PUT `/auth/profile`
```json
{ "name": "...", "phone": "..." }
```
### POST `/auth/logout`

### (Admin) GET `/auth/users?page=1&limit=10&role=teacher`
### (Admin) POST `/auth/users`
```json
{ "name": "...", "email": "...", "password": "...", "role": "teacher" }
```
### (Admin) PUT `/auth/users/:id`
### (Super Admin) DELETE `/auth/users/:id`

---

## 2. DASHBOARD

### GET `/dashboard`
Returns stats: students, teachers, departments, collection, attendance.
### GET `/dashboard/activities`
Recent activities (admissions, payments, results).
### GET `/dashboard/charts?type=collection|attendance|department&period=monthly`

---

## 3. STUDENTS

### GET `/students?page=1&limit=10&search=&department_id=&class_id=&section_id=`
### GET `/students/search?q=`
Search by name, ID, or phone.
### GET `/students/:id`
Full details with payments, attendance, results.
### GET `/students/:id/subjects`
Assigned subjects.
### POST `/students/admit`
```json
{
  "full_name": "...", "department_id": 1, "class_id": 2,
  "section_id": 1, "father_name": "...", "mother_name": "...",
  "gender": "Male", "date_of_birth": "2008-05-15"
}
```
Auto-assigns: Student ID, Roll Number, Subjects.
### PUT `/students/:id`
### DELETE `/students/:id`
### POST `/students/bulk-status`
```json
{ "student_ids": [1,2,3], "status": "graduated" }
```

---

## 4. TEACHERS

### GET `/teachers?page=1&limit=10&subject_id=`
### GET `/teachers/:id`
### POST `/teachers`
```json
{ "name": "...", "subject_id": 1, "qualification": "M.Sc", "phone": "...", "email": "...", "joining_date": "..." }
```
### PUT `/teachers/:id`
### DELETE `/teachers/:id`

---

## 5. FEES

### GET `/fees`
### GET `/fees/class/:classId`
### POST `/fees`
```json
{ "class_id": 1, "admission_fee": 5000, "monthly_fee": 2500, "exam_fee": 1000 }
```

---

## 6. PAYMENTS

### GET `/payments?page=1&status=paid&fee_type=monthly`
### GET `/payments/collection-report?from_date=&to_date=&type=`
### GET `/payments/receipt/:id`
### GET `/payments/receipt/:id/download`
Downloads PDF Receipt.
### POST `/payments/collect`
```json
{ "student_id": 1, "fee_type": "monthly", "paid_amount": 2500, "payment_method": "cash" }
```
Auto-generates Receipt Number and Invoice.

---

## 7. ATTENDANCE

### GET `/attendance?date=2025-01-15&class_id=2&section_id=1`
### GET `/attendance/summary?class_id=2&month=1&year=2025`
### POST `/attendance/mark`
```json
{ "records": [{ "student_id": 1, "date": "2025-01-15", "status": "present" }] }
```
### POST `/attendance/mark-single`

---

## 8. RESULTS

### GET `/results?student_id=&subject_id=&exam_type=final&class_id=`
### GET `/results/class?class_id=2&exam_type=final`
Complete class results with rankings.
### GET `/results/merit-list?class_id=2&limit=10`
### GET `/results/fail-list?class_id=2`
### POST `/results/enter`
```json
{ "exam_type": "final", "records": [{ "student_id": 1, "subject_id": 1, "final_mark": 45 }] }
```
Auto-calculates Total, GPA, Grade.
### POST `/results/publish`
```json
{ "class_id": 2, "exam_type": "final", "section_id": 1 }
```

---

## 9. NOTICES

### GET `/notices?category=exam&is_pinned=true`
### GET `/notices/:id`
### POST `/notices`
```json
{ "title": "...", "content": "...", "category": "exam", "is_pinned": false }
```
### PUT `/notices/:id`
### DELETE `/notices/:id`
### PATCH `/notices/:id/toggle-pin`

---

## 10. REPORTS

### GET `/reports/daily-collection?date=2025-01-15`
### GET `/reports/monthly-collection?month=1&year=2025`
### GET `/reports/students?department_id=&class_id=&session=`
### GET `/reports/attendance?class_id=2&month=1&year=2025`
### GET `/reports/results?exam_type=final&class_id=2`

---

## 11. SEARCH

### GET `/search?q=arif`
Searches students, teachers, and payments.

---

## 12. DEPARTMENTS & ACADEMICS

### GET `/departments/departments`
### POST `/departments/departments`
### GET `/departments/subjects?department_id=`
### POST `/departments/subjects`
### GET `/departments/groups`
### GET `/departments/sections`
### GET `/departments/classes`
### POST `/departments/classes`

---

## 13. ADMISSIONS

### GET `/admissions?status=approved&session=2025`
### GET `/admissions/stats`
### PATCH `/admissions/:id/approve`
### PATCH `/admissions/:id/reject`

---

## 14. SETTINGS

### GET `/settings`
### PUT `/settings`
Bulk update: `{ "settings": { "key": "value" } }`
### PUT `/settings/:key`
Single update: `{ "value": "new-value" }`

---

## 15. BACKUPS

### GET `/backups`
### POST `/backups`
```json
{ "type": "manual", "notes": "Daily backup" }
```
### POST `/backups/:id/restore`
### GET `/backups/:id/download`
### DELETE `/backups/:id`

---

## 16. NOTIFICATIONS

### GET `/notifications`
### GET `/notifications/unread-count`
### PATCH `/notifications/:id/read`
Use `:id = "all"` to mark all as read.
### POST `/notifications`
```json
{ "title": "...", "message": "...", "type": "info" }
```

---

## RESPONSE FORMAT

Success: `{ success: true, data: {}, message: "", pagination: {} }`
Error:   `{ success: false, message: "", errors: [] }`

## PAGINATION
Query: `?page=1&limit=10`
Response includes: `{ pagination: { page, limit, total, total_pages, has_next, has_prev } }`

## STATUS CODES
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 429: Rate Limited
- 500: Server Error

## RATE LIMITING
- General API: 100 requests / 15 min
- Login: 5 attempts / 15 min
