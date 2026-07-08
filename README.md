# Employee Management System (EMS)

A full-stack web application for managing employee attendance, leave requests, and employee information with role-based access control.

## 📋 Features

- **Authentication**: Secure JWT-based authentication
- **Dashboard**: Real-time attendance analytics with monthly charts
- **Attendance Management**: Check-in/check-out system with attendance tracking
- **Leave Management**: Submit and track leave requests with balance monitoring
- **User Profile**: View employee information and employment details
- **Responsive Design**: Mobile-friendly interface

## 🏗️ Tech Stack

### Backend
- **Framework**: Laravel 12
- **Authentication**: JWT (tymon/jwt-auth)
- **Database**: SQLite (easily switchable to MySQL/PostgreSQL)
- **Architecture**: Repository/Service pattern with Request validation

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Context API
- **Styling**: Pure CSS (no frameworks)
- **HTTP Client**: Fetch API

## 📁 Project Structure

```
HRM/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/       # API Controllers
│   │   │   ├── Requests/      # Form Request Validation
│   │   │   ├── Resources/     # API Resources
│   │   │   └── Middleware/    # Custom Middleware
│   │   ├── Models/            # Eloquent Models
│   │   └── Services/          # Business Logic Layer
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── routes/
│   │   └── api.php            # API Routes
│   └── config/                # Configuration Files
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/        # Layout Components
│   │   ├── pages/             # Page Components
│   │   ├── context/           # React Context
│   │   ├── services/          # API Services
│   │   └── utils/             # Utility Functions
│   └── public/                # Static Assets
│
└── SRS.md                      # Software Requirements Specification
```

## 🚀 Getting Started

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js >= 18
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
copy .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Run migrations and seeders:
```bash
php artisan migrate:fresh --seed
```

6. Start the development server:
```bash
php artisan serve
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 👤 Default Credentials

### Employee Account
- **Email**: employee@example.com
- **Password**: password

### Manager Account
- **Email**: manager@example.com
- **Password**: password

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Attendance
- `GET /api/attendances` - Get user attendances (paginated)
- `POST /api/attendances` - Check in
- `PUT /api/attendances/{id}` - Check out
- `GET /api/attendances/stats` - Get attendance statistics
- `GET /api/attendances/today-status` - Get today's status
- `GET /api/attendances/monthly-chart` - Get monthly chart data

### Leaves
- `GET /api/leaves` - Get user leaves (paginated)
- `POST /api/leaves` - Create leave request
- `GET /api/leaves/balance` - Get leave balance

### Profile
- `GET /api/profile` - Get user profile

## 🎨 Features by Page

### Dashboard
- Quick check-in/check-out buttons
- Employment summary card
- Today's attendance status
- Monthly attendance chart with filters
- Attendance statistics

### Attendance Page
- Attendance statistics cards
- Search and filter functionality
- Attendance history table with pagination
- Status indicators (Present/Absent/Late)

### Leaves Page
- Leave balance overview
- Request new leave modal
- Leave history table
- Leave type indicators
- Status tracking (Pending/Approved/Rejected)

### Profile Page
- User information display
- Employment details
- Role and status indicators

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Request validation
- SQL injection prevention
- XSS protection

## 📊 Database Schema

### Users Table
- id (UUID)
- name, email, password
- role (employee/manager/admin)
- position, level, status
- joined_date

### Attendances Table
- id (UUID)
- user_id (FK)
- date, check_in, check_out
- worked_hours, status

### Leaves Table
- id (UUID)
- user_id (FK)
- from_date, to_date
- leave_type, reason, rejected_reason
- num_days, status

## 🎯 Future Enhancements

- Email notifications
- Payroll module
- Employee performance tracking
- Admin dashboard with analytics
- Mobile application
- Calendar integration
- Export reports (PDF/Excel)
- Multi-language support

## 🐛 Troubleshooting

### Backend Issues

**Database connection error:**
- Ensure the database file exists: `database/database.sqlite`
- Check `.env` database configuration

**JWT secret not set:**
- Run `php artisan jwt:secret`

**Migration errors:**
- Try `php artisan migrate:fresh --seed`

### Frontend Issues

**API connection error:**
- Verify backend is running on port 8000
- Check CORS configuration in `config/cors.php`

**React Router not working:**
- Clear browser cache
- Check browser console for errors

## 📝 License

This project is open-source and available under the MIT License.

## 👥 Contributors

- Development Team

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Made with ❤️ for efficient employee management**
