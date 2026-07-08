# 🏢 HRM System - Human Resource Management

A modern, full-stack Employee Management System with advanced face recognition attendance tracking.

## 🎯 Features

### 👤 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin, Employee)
- Protected routes and API endpoints
- Session management

### 📊 Dashboard
- Real-time attendance overview
- Monthly attendance analytics with charts
- Employment summary
- Today's status tracking
- Live worked hours calculation

### ✅ Attendance Management
- **Face Recognition Attendance** - Biometric check-in/check-out
- Manual attendance recording
- Attendance history with pagination
- Status tracking (Present, Absent, Late)
- Automatic worked hours calculation
- Monthly attendance statistics

### 😊 Face Recognition
- **Face Enrollment** - One-time biometric registration
- **Face Verification** - Secure attendance verification
- Real-time face detection with landmarks
- 128-point face descriptor generation
- Euclidean distance matching (0.6 threshold)
- Security features:
  - Single face enforcement
  - No photo storage (only mathematical descriptors)
  - Enrollment check before verification
  - Face-to-face matching validation

### 🏖️ Leave Management
- Leave application submission
- Leave balance tracking
- Leave history
- Status management (Pending, Approved, Rejected)

### 👥 Profile Management
- Personal information display
- Face enrollment interface
- Employment details
- Role and position information

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router DOM v7
- **Face Recognition**: face-api.js
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Context API
- **HTTP Client**: Fetch API

### Backend
- **Framework**: Laravel 12
- **Authentication**: Sanctum JWT
- **Database**: MySQL
- **Face Processing**: Custom PHP Service
- **Architecture**: Service-Repository Pattern

### Design
- **Theme**: Dark Green + Black
- **Style**: Modern, Glassmorphism effects
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions and glowing effects

---

## 📁 Project Structure

```
HRM/
├── frontend/
│   ├── public/
│   │   └── models/              # face-api.js models
│   ├── src/
│   │   ├── components/
│   │   │   ├── face/           # Face recognition components
│   │   │   │   ├── FaceCamera.jsx
│   │   │   │   ├── FaceEnrollment.jsx
│   │   │   │   └── FaceVerifyModal.jsx
│   │   │   └── layout/         # Layout components
│   │   │       ├── Header.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── MainLayout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useFaceDetection.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Leaves.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       ├── faceApiLoader.js
│   │       └── dateUtils.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── AttendanceController.php
│   │   │   │   ├── FaceController.php
│   │   │   │   ├── LeaveController.php
│   │   │   │   └── ProfileController.php
│   │   │   ├── Middleware/
│   │   │   │   └── JsonResponseMiddleware.php
│   │   │   └── Requests/
│   │   │       ├── Attendance/
│   │   │       ├── Auth/
│   │   │       ├── Face/
│   │   │       └── Leave/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Attendance.php
│   │   │   └── Leave.php
│   │   └── Services/
│   │       ├── AttendanceService.php
│   │       ├── FaceVerificationService.php
│   │       ├── LeaveService.php
│   │       └── AuthService.php
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   └── composer.json
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL
- Modern browser with camera support

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
copy .env.example .env

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hrm
DB_USERNAME=root
DB_PASSWORD=

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Run migrations
php artisan migrate

# Start server
php artisan serve
```

Backend runs on: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🎮 Usage

### 1. Login
- Open `http://localhost:5173`
- Login with credentials
- Default: `admin@example.com` / `password`

### 2. Face Enrollment (First Time)
1. Navigate to **Profile** page
2. Scroll to **Face Recognition** section
3. Click **"📸 Register Face"**
4. Allow camera permissions
5. Position face in center
6. Wait for green "Face detected" status
7. Click **"✓ Confirm Enrollment"**
8. See **"✅ Enrolled"** badge

### 3. Check-In with Face Verification
1. Go to **Dashboard**
2. Click **"📍 Verify & Check In"**
3. Modal opens with camera
4. Position face until detected
5. Click **"Verify & Check In"**
6. Attendance recorded!

### 4. Check-Out
1. Click **"🏁 Verify & Check Out"**
2. Verify face
3. Worked hours calculated automatically

---

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Secure password hashing (bcrypt)
- Token expiration and refresh
- Protected API routes

### Face Recognition
- Face descriptor encryption (128-float array)
- No raw photo storage
- Euclidean distance matching
- Threshold-based verification (0.6)
- Single face enforcement
- Enrollment requirement check

### Data Protection
- CORS configuration
- SQL injection prevention
- XSS protection
- CSRF token validation
- Input validation and sanitization

---

## 📊 Database Schema

### Users Table
```sql
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- role (VARCHAR) - admin, employee
- position (VARCHAR)
- level (VARCHAR)
- status (VARCHAR) - active, inactive
- joined_date (DATE)
- face_descriptor (JSON) - 128 floats
- face_enrolled_at (TIMESTAMP)
- created_at, updated_at
```

### Attendances Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- date (DATE)
- check_in (TIME)
- check_out (TIME)
- worked_hours (DECIMAL)
- status (VARCHAR) - present, absent, late
- verification_method (VARCHAR) - manual, face
- verified_at (TIMESTAMP)
- created_at, updated_at
```

### Leaves Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- leave_type (VARCHAR)
- start_date (DATE)
- end_date (DATE)
- reason (TEXT)
- status (VARCHAR) - pending, approved, rejected
- created_at, updated_at
```

---

## 🎨 Design System

### Color Palette
```css
--primary-bg: #0a0f0d        /* Very dark green-black */
--secondary-bg: #0f1713      /* Dark green-grey */
--card-bg: #1a2d26           /* Dark green card */
--primary-green: #16a34a     /* Bright green */
--light-green: #22c55e       /* Neon green */
--dark-green: #15803d        /* Deep green */
--text-primary: #e8f5e9      /* Light text */
--text-secondary: #a7c4b5    /* Muted text */
```

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Headings**: 600-700 weight
- **Body**: 400-500 weight

### Components
- Border radius: 8-12px
- Shadows: Multi-layer with glow effects
- Transitions: 0.3s ease
- Hover effects: Transform + glow

---

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Face Recognition
- `GET /api/face/status` - Check enrollment status
- `POST /api/face/enroll` - Enroll face

### Attendance
- `GET /api/attendances` - List attendances
- `POST /api/attendances` - Manual check-in
- `PUT /api/attendances/{id}` - Manual check-out
- `POST /api/attendances/verify` - Face verification attendance
- `GET /api/attendances/stats` - Get statistics
- `GET /api/attendances/today-status` - Today's status
- `GET /api/attendances/monthly-chart` - Monthly chart data

### Leaves
- `GET /api/leaves` - List leaves
- `POST /api/leaves` - Apply leave
- `GET /api/leaves/balance` - Leave balance

### Profile
- `GET /api/profile` - Get profile

---

## 🧪 Testing

### Face Recognition Testing
1. **Good Lighting**: Face window or bright lights
2. **Neutral Expression**: Slight smile okay
3. **Distance**: 1-2 feet from camera
4. **Angle**: Face camera directly
5. **Stable**: Hold still 2-3 seconds

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

### Camera Requirements
- Minimum 720p resolution
- 30 FPS recommended
- HTTPS or localhost required

---

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browser
- Restart browser

### Face Not Detected
- Improve lighting
- Move closer to camera
- Remove glasses/hat
- Wait 3-5 seconds

### Verification Failed
- Re-enroll in better lighting
- Ensure same person
- Check threshold settings
- Review backend logs

### Backend Errors
```bash
# Check Laravel logs
cd backend
tail -f storage/logs/laravel.log
```

---

## 📦 Dependencies

### Frontend
```json
{
  "face-api.js": "^0.22.2",
  "react": "^19.2.7",
  "react-dom": "^19.2.7",
  "react-router-dom": "^7.18.1"
}
```

### Backend
```json
{
  "laravel/framework": "^12.0",
  "tymon/jwt-auth": "^2.0"
}
```

---

## 🔧 Configuration

### Face Recognition Settings

**Backend** (`app/Services/FaceVerificationService.php`):
```php
private const MATCH_THRESHOLD = 0.6;
// Lower = more lenient (e.g., 0.5)
// Higher = more strict (e.g., 0.7)
```

**Frontend** (`src/hooks/useFaceDetection.js`):
```javascript
new faceapi.TinyFaceDetectorOptions({
    inputSize: 320,      // Detection resolution
    scoreThreshold: 0.4  // Detection sensitivity
})
```

---

## 📝 Development

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 👥 Contributors

- Developer: Your Name
- Face Recognition Integration
- UI/UX Design
- Backend Architecture

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

- face-api.js for face recognition
- Laravel for backend framework
- React for frontend framework
- Vite for build tooling

---

## 📞 Support

For issues or questions:
1. Check browser console (F12)
2. Review Laravel logs
3. Verify camera permissions
4. Check network requests

---

**Built with ❤️ using React, Laravel, and face-api.js**
