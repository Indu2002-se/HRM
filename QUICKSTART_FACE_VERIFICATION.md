# 🚀 Quick Start Guide - Face Verification Attendance

## Prerequisites

✅ PHP 8.2+ installed
✅ Composer installed
✅ Node.js 18+ installed
✅ MySQL/SQLite database
✅ Modern browser with camera support

---

## Step 1: Start Backend Server

```bash
cd backend
php artisan serve
```

Backend will run on: `http://localhost:8000`

---

## Step 2: Start Frontend Server

```bash
cd frontend
npm install  # If not already installed
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## Step 3: Test Face Verification

### 3.1 Login
1. Navigate to `http://localhost:5173`
2. Login with your credentials

### 3.2 Enroll Your Face (First Time Only)
1. Go to **Profile** page
2. Scroll to **Face Recognition** section
3. Click **"📸 Register Face"** button
4. Allow camera permissions when prompted
5. Position your face in the center of the frame
6. Wait for **"Face detected successfully!"** (green status)
7. Click **"✓ Confirm Enrollment"** button
8. See success message
9. You should now see **"✅ Enrolled"** badge

### 3.3 Check-In with Face Verification
1. Go to **Dashboard** page
2. Click **"📍 Verify & Check In"** button
3. Modal opens with camera
4. Position your face in frame
5. Wait for face detection
6. Click **"Verify & Check In"** button
7. Modal closes automatically
8. Check-in time appears on dashboard

### 3.4 Check-Out with Face Verification
1. On **Dashboard** (after check-in)
2. Click **"🏁 Verify & Check Out"** button
3. Modal opens with camera
4. Position your face in frame
5. Wait for face detection
6. Click **"Verify & Check Out"** button
7. Modal closes automatically
8. Check-out time and worked hours appear

---

## ✅ Verification Checklist

After completing the above steps, verify:

- [ ] Profile shows "Enrolled" badge
- [ ] Enrollment date is displayed
- [ ] Check-in recorded in dashboard
- [ ] Check-in time visible
- [ ] Status shows "present"
- [ ] Check-out recorded
- [ ] Check-out time visible
- [ ] Worked hours calculated
- [ ] Monthly chart updated
- [ ] No console errors

---

## 🎯 Status Indicators

| Color | Icon | Status | Meaning |
|-------|------|--------|---------|
| Gray | ⏳ | Initializing | Camera loading |
| Blue | 📷 | Camera Ready | Ready to detect |
| Orange | ⚠️ | No Face | Position your face |
| Red | ❌ | Multiple Faces | Only one person allowed |
| Green | ✅ | Face Detected | Ready to verify |
| Red | ❌ | Match Failed | Verification failed |

---

## 🐛 Common Issues

### Camera not working?
- **Check permissions**: Allow camera access in browser
- **Try HTTPS**: Some browsers require HTTPS for camera
- **Use localhost**: localhost is always allowed

### Face not detected?
- **Improve lighting**: Face the light source
- **Get closer**: Move closer to camera
- **Remove obstructions**: Take off glasses/hats
- **Center your face**: Position in middle of frame

### Verification failed?
- **Re-enroll**: Try re-enrolling in better lighting
- **Same person**: Ensure same person as enrolled
- **Check console**: Look for error messages

### Models not loading?
- **Check network tab**: Look for 404 errors
- **Verify path**: Models should be in `frontend/public/models/`
- **Required files**:
  - `tiny_face_detector_model-*`
  - `face_landmark_68_model-*`
  - `face_recognition_model-*`

---

## 🔧 Configuration

### Backend API URL
File: `frontend/src/services/api.js`
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Match Threshold (Strictness)
File: `backend/app/Services/FaceVerificationService.php`
```php
private const MATCH_THRESHOLD = 0.6;
// Lower = more lenient (e.g., 0.5)
// Higher = more strict (e.g., 0.7)
```

### Detection Speed
File: `frontend/src/hooks/useFaceDetection.js`
```javascript
setInterval(() => {
    detectFace();
}, 500); // milliseconds (500 = 0.5 seconds)
```

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/face/status` | Get enrollment status |
| POST | `/api/face/enroll` | Enroll face |
| POST | `/api/attendances/verify` | Verify and record attendance |
| GET | `/api/attendances/today-status` | Get today's attendance |
| GET | `/api/attendances/stats` | Get attendance statistics |

---

## 🎉 Success!

If you can check-in and check-out using face verification, the implementation is working correctly!

**Next Steps:**
- Test with different users
- Test in different lighting conditions
- Verify attendance records in database
- Check monthly attendance chart

---

## 📞 Need Help?

1. Check browser console for errors (F12)
2. Check Laravel logs: `backend/storage/logs/laravel.log`
3. Review `FACE_VERIFICATION_GUIDE.md` for detailed troubleshooting
4. Verify all migrations ran: `php artisan migrate:status`

---

**Happy face verifying! 😊👤✅**
