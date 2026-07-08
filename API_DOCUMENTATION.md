# API Documentation - Employee Management System

Base URL: `http://localhost:8000/api`

## 🔐 Authentication

All endpoints except login require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### POST /auth/login
Login to the system.

**Request Body:**
```json
{
  "email": "employee@example.com",
  "password": "password"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "019f3d35-e6e1-7181-8ae1-67ced49af20a",
    "name": "John Doe",
    "email": "employee@example.com",
    "role": "employee",
    "position": "Software Engineer",
    "level": "Senior",
    "status": "active",
    "joined_date": "2024-07-07"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### POST /auth/logout
Logout from the system.

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

---

### POST /auth/refresh
Refresh the JWT token.

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### GET /auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "019f3d35-e6e1-7181-8ae1-67ced49af20a",
    "name": "John Doe",
    "email": "employee@example.com",
    "role": "employee",
    "position": "Software Engineer",
    "level": "Senior",
    "status": "active",
    "joined_date": "2024-07-07"
  }
}
```

---

## Profile Endpoints

### GET /profile
Get user profile information.

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "data": {
    "id": "019f3d35-e6e1-7181-8ae1-67ced49af20a",
    "name": "John Doe",
    "email": "employee@example.com",
    "role": "employee",
    "position": "Software Engineer",
    "level": "Senior",
    "status": "active",
    "joined_date": "2024-07-07",
    "created_at": "2024-07-07T00:00:00.000000Z"
  }
}
```

---

## Attendance Endpoints

### GET /attendances
Get user attendance records (paginated).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` (optional): Search by date
- `status` (optional): Filter by status (present/absent/late)
- `date` (optional): Filter by specific date
- `per_page` (optional): Items per page (default: 10)
- `page` (optional): Page number (default: 1)

**Example:**
```
GET /attendances?status=present&per_page=20&page=1
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "019f3d36-1234-5678-9abc-def012345678",
      "user_id": "019f3d35-e6e1-7181-8ae1-67ced49af20a",
      "date": "2026-07-07",
      "day": "Tuesday",
      "check_in": "09:00:00",
      "check_out": "18:00:00",
      "worked_hours": 9.0,
      "status": "present",
      "created_at": "2026-07-07T09:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 45
  }
}
```

---

### POST /attendances
Check in (create attendance record).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{}
```
Note: No body required, system uses current date/time.

**Success Response (201):**
```json
{
  "message": "Checked in successfully",
  "data": {
    "id": "019f3d36-1234-5678-9abc-def012345678",
    "user_id": "019f3d35-e6e1-7181-8ae1-67ced49af20a",
    "date": "2026-07-07",
    "day": "Tuesday",
    "check_in": "09:00:00",
    "check_out": null,
    "worked_hours": 0,
    "status": "present"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Already checked in today"
}
```

---

### PUT /attendances/{id}
Check out (update attendance record).

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Attendance ID

**Request Body:**
```json
{}
```
Note: No body required, system calculates worked hours.

**Success Response (200):**
```json
{
  "message": "Checked out successfully",
  "data": {
    "id": "019f3d36-1234-5678-9abc-def012345678",
    "user_id": "019f3d35-e6e1-7181-8ae1-67ced49af20a",
    "date": "2026-07-07",
    "day": "Tuesday",
    "check_in": "09:00:00",
    "check_out": "18:00:00",
    "worked_hours": 9.0,
    "status": "present"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Already checked out"
}
```

---

### GET /attendances/stats
Get attendance statistics.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year (e.g., 2026)

**Example:**
```
GET /attendances/stats?month=7&year=2026
```

**Success Response (200):**
```json
{
  "data": {
    "total_attendance_this_month": 20,
    "checked_in_today": true,
    "checked_out_today": false,
    "current_status": "present",
    "worked_hours_today": 0
  }
}
```

---

### GET /attendances/today-status
Get today's attendance status.

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "data": {
    "checked_in": true,
    "checked_out": false,
    "check_in_time": "09:00:00",
    "check_out_time": null,
    "worked_hours": 0,
    "status": "present"
  }
}
```

---

### GET /attendances/monthly-chart
Get monthly attendance chart data.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year (e.g., 2026)

**Example:**
```
GET /attendances/monthly-chart?month=7&year=2026
```

**Success Response (200):**
```json
{
  "data": [
    {
      "day": 1,
      "date": "2026-07-01",
      "worked_hours": 9.0,
      "status": "present"
    },
    {
      "day": 2,
      "date": "2026-07-02",
      "worked_hours": 0,
      "status": "absent"
    }
  ]
}
```

---

## Leave Endpoints

### GET /leaves
Get user leave requests (paginated).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status (pending/approved/rejected)
- `per_page` (optional): Items per page (default: 10)
- `page` (optional): Page number (default: 1)

**Example:**
```
GET /leaves?status=pending&per_page=20
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "019f3d37-abcd-1234-5678-90abcdef1234",
      "user_id": "019f3d35-e6e1-7181-8ae1-67ced49af20a",
      "from_date": "2026-07-15",
      "to_date": "2026-07-17",
      "leave_type": "full_day",
      "reason": "Family vacation",
      "rejected_reason": null,
      "num_days": 3,
      "status": "pending",
      "created_at": "2026-07-07T10:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 10,
    "total": 15
  }
}
```

---

### POST /leaves
Create a new leave request.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "from_date": "2026-07-15",
  "to_date": "2026-07-17",
  "leave_type": "full_day",
  "reason": "Family vacation"
}
```

**Leave Types:**
- `full_day`: Full day leave
- `half_day`: Half day leave (0.5 days)
- `short_leave`: Short leave (0.25 days)

**Validation Rules:**
- `from_date`: Required, must be a valid date
- `to_date`: Required, must be a valid date, must be after or equal to from_date
- `leave_type`: Required, must be one of: full_day, half_day, short_leave
- `reason`: Required, string, max 500 characters

**Success Response (201):**
```json
{
  "message": "Leave request submitted successfully",
  "data": {
    "id": "019f3d37-abcd-1234-5678-90abcdef1234",
    "user_id": "019f3d35-e6e1-7181-8ae1-67ced49af20a",
    "from_date": "2026-07-15",
    "to_date": "2026-07-17",
    "leave_type": "full_day",
    "reason": "Family vacation",
    "rejected_reason": null,
    "num_days": 3,
    "status": "pending",
    "created_at": "2026-07-07T10:00:00.000000Z"
  }
}
```

**Error Response (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "from_date": ["The from date field is required."],
    "reason": ["The reason must not be greater than 500 characters."]
  }
}
```

---

### GET /leaves/balance
Get leave balance information.

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "data": {
    "total_balance": 20,
    "used": 5.5,
    "remaining": 14.5,
    "full_days": 5,
    "half_days": 1,
    "short_leaves": 0
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "This action is unauthorized."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found."
}
```

### 422 Unprocessable Entity
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": [
      "Error message 1",
      "Error message 2"
    ]
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "Server Error"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 60 requests per minute per IP for unauthenticated requests
- 300 requests per minute per user for authenticated requests

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1625097600
```

---

## Status Codes

- `200 OK`: Successful GET request
- `201 Created`: Successful POST request (resource created)
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@example.com","password":"password"}'
```

### Get Profile
```bash
curl -X GET http://localhost:8000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Check In
```bash
curl -X POST http://localhost:8000/api/attendances \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Request Leave
```bash
curl -X POST http://localhost:8000/api/leaves \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"from_date":"2026-07-15","to_date":"2026-07-17","leave_type":"full_day","reason":"Vacation"}'
```

---

**API Version**: 1.0  
**Last Updated**: July 7, 2026
