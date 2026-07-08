# Software Requirements Specification (SRS)

# Employee Management System (EMS)

Version: 1.0
Document Type: Software Requirements Specification (SRS)

---

# 1. Introduction

## 1.1 Purpose

The Employee Management System (EMS) is a web-based application developed to manage employee attendance, leave requests, and employee information while providing management with accurate employee records and attendance statistics.

---

## 1.2 Objectives

The system shall:

- Manage employee attendance.
- Allow employees to request leaves.
- Display employee information.
- Provide attendance analytics.
- Maintain attendance history.
- Improve HR process efficiency.

---

## 1.3 Intended Users

- Employee
- HR Manager
- System Administrator

---

# 2. Overall System Description

The system is a responsive web application with secure authentication and role-based access.

Main modules include:

- Authentication
- Dashboard
- Attendance
- Leave Management
- Profile
- Notifications
- Settings

---

# 3. Functional Requirements

## FR-01 Authentication

### Description

Users shall securely log into the system.

### Features

- Login
- Logout
- Session Management

---

## FR-02 Navigation

### Sidebar

The system shall provide:

- Dashboard
- Attendance
- Leaves
- Email
- Profile

Additional Features

- Company Logo
- Version Number
- Active Menu Highlight
- User Information
- Logout Button

---

## FR-03 Header

The system shall display:

- Current Page Title
- Current Date
- Notification Icon
- Account Settings

---

## FR-04 Dashboard

### Quick Action

- Verify Attendance Button

### Employment Summary

Display

- Position
- Level
- Employment Status
- Joined Date

### Attendance Analytics

Provide

- Monthly Attendance Chart
- Month Filter
- Year Filter
- Worked Hours
- Attendance Status Legend
- Daily Work Target Line

---

## FR-05 Attendance Module

### Dashboard Cards

Display

- Total Attendance This Month
- Checked In Today
- Checked Out Today
- Current Attendance Status

### Attendance Filters

Provide

- Search
- Status Filter
- Date Filter

### Attendance History

Columns

- Date
- Day
- Check In
- Check Out
- Worked Hours
- Status

### Pagination

Support

- Previous
- Next
- Page Numbers
- Total Records

---

## FR-06 Leave Management

### Leave Balance

Display

- Total Balance
- Full Days
- Half Days
- Short Leaves

### Leave Request

Employees shall submit

- From Date
- To Date
- Leave Type
- Reason

### Leave Status

Possible values

- Pending
- Approved
- Rejected

### Leave History

Columns

- From Date
- To Date
- Leave Type
- Reason
- Rejected Reason
- Number of Days
- Status

---

## FR-07 User Profile

Display

- Name
- Email
- Role
- Position
- Level
- Joined Date

---

# 4. Non-Functional Requirements

## Performance

- Page load time < 3 seconds
- Dashboard loads within 2 seconds
- Support at least 100 concurrent users

---

## Security

- Password encryption
- JWT Authentication
- Role-based Authorization
- Session Timeout
- Secure API Access

---

## Availability

- System uptime 99%

---

## Scalability

System should support future modules including

- Payroll
- Employee Performance
- Recruitment
- Asset Management

---

## Usability

- Responsive Design
- Mobile Friendly
- User-friendly Interface

---

# 5. Database Requirements

## Users

| Field | Type |
|--------|------|
| id | UUID |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | VARCHAR |
| position | VARCHAR |
| level | VARCHAR |
| status | VARCHAR |
| joined_date | DATE |

---

## Attendance

| Field | Type |
|--------|------|
| id | UUID |
| user_id | FK |
| date | DATE |
| check_in | TIME |
| check_out | TIME |
| worked_hours | DECIMAL |
| status | VARCHAR |

---

## Leaves

| Field | Type |
|--------|------|
| id | UUID |
| user_id | FK |
| from_date | DATE |
| to_date | DATE |
| leave_type | VARCHAR |
| reason | TEXT |
| rejected_reason | TEXT |
| num_days | DECIMAL |
| status | VARCHAR |

---

# 6. User Interface Requirements

## Dashboard

- Attendance Chart
- Employee Summary Cards
- Verify Attendance Button

---

## Attendance Page

- KPI Cards
- Search Bar
- Filters
- Attendance Table
- Pagination

---

## Leave Page

- Leave Balance Cards
- Request Leave Button
- Leave History Table

---

## Global Layout

Sidebar

- Logo
- Navigation
- Logout

Header

- Page Title
- Date
- Notifications
- Settings

---

# 7. Future Enhancements

- Email Notifications
- Payroll Module
- Employee Performance Module
- Admin Dashboard
- Mobile Application
- Calendar Integration
- Export Reports (PDF / Excel)

---

# 8. Acceptance Criteria

The system shall be accepted if:

✓ User authentication works correctly.

✓ Attendance can be recorded.

✓ Attendance history is searchable.

✓ Leave requests can be submitted.

✓ Leave approval status updates correctly.

✓ Dashboard displays attendance analytics.

✓ User profile information displays correctly.

✓ Navigation functions without errors.

✓ Responsive design works across devices.

✓ Database stores all required information accurately.

---

# 9. Technology Stack (Recommended)

Frontend

- React.js
- Tailwind CSS
- TypeScript
- React Router
- Axios

Backend

- Node.js
- Express.js
- Prisma ORM

Database

- PostgreSQL

Authentication

- JWT
- bcrypt

Deployment

- Docker
- Nginx
- Vercel (Frontend)
- Railway / Render / AWS (Backend)
