# 🔧 Troubleshooting Face Detection Issues

## Problem 1: "No face detected" (Orange Warning)

### Symptoms:
- Camera is working
- You can see yourself clearly
- But status shows "No face detected. Please position your face in frame."
- No bounding box appears

### Solutions:

#### 1. **Check Browser Console for Errors**
```
Press F12 → Console Tab
Look for errors like:
- "Failed to load models"
- "NetworkError: Failed to fetch"
- "Face detection error"
```

#### 2. **Verify Models Are Loading**
Open DevTools Network Tab:
- Refresh page
- Look for requests to `/models/` files
- All should return 200 status
- Required files:
  - `tiny_face_detector_model-weights_manifest.json`
  - `tiny_face_detector_model.bin`
  - `face_landmark_68_model-weights_manifest.json`
  - `face_landmark_68_model.bin`
  - `face_recognition_model-weights_manifest.json`
  - `face_recognition_model.bin`

#### 3. **Improve Detection Conditions**

**Lighting:**
- ✅ Face the light source
- ❌ Avoid strong backlighting
- ✅ Use natural or bright indoor lighting
- ❌ Avoid shadows on face

**Position:**
- ✅ Face directly toward camera
- ✅ Center your face in frame
- ✅ Keep face 1-3 feet from camera
- ❌ Don't tilt head too much
- ❌ Remove sunglasses/masks

**Camera Quality:**
- Wait 2-3 seconds for camera to focus
- Ensure camera lens is clean
- Don't move quickly

#### 4. **Lower Detection Threshold**
If face still not detected, try lowering the threshold:

**File:** `frontend/src/hooks/useFaceDetection.js`

```javascript
// Change this:
new faceapi.TinyFaceDetectorOptions({
    inputSize: 320,
    scoreThreshold: 0.5,  // Current
})

// To this:
new faceapi.TinyFaceDetectorOptions({
    inputSize: 320,
    scoreThreshold: 0.3,  // More lenient
})
```

Lower threshold = easier to detect, but may have false positives.

#### 5. **Wait Longer**
Face detection runs every 0.5 seconds. Wait at least 3-5 seconds in position.

---

## Problem 2: "Face not enrolled" Error (Red Box)

### Symptoms:
- Face IS detected (you see bounding box and landmarks)
- Status shows "Face detected successfully!" (Green)
- But clicking "Verify" shows error: **"Face not enrolled. Please register your face in Profile first."**

### Solution:

This is **NOT a bug** - it's expected behavior!

You MUST enroll your face BEFORE you can use face verification:

#### **Enrollment Steps:**

1. **Go to Profile Page**
   - Click "Profile" in navigation menu

2. **Find Face Recognition Section**
   - Scroll down to bottom
   - Look for "Face Recognition" heading

3. **Click "Register Face" Button**
   - Button says "📸 Register Face"

4. **Enrollment Modal Opens**
   - Camera starts automatically
   - Position your face clearly

5. **Wait for Detection**
   - Status will change from orange to **green**
   - You'll see bounding box and landmarks
   - Status: "Face detected successfully!"

6. **Confirm Enrollment**
   - Click **"✓ Confirm Enrollment"** button
   - Wait for success message
   - Modal closes automatically

7. **Verify Enrollment**
   - You should see **"✅ Enrolled"** badge
   - Enrollment date is displayed

8. **Now Try Check-In**
   - Go back to Dashboard
   - Click "Verify & Check In"
   - Should work now!

---

## Problem 3: Face Detection Too Slow

### Symptoms:
- Takes 5+ seconds to detect face
- Bounding box appears late

### Solutions:

#### 1. **Reduce Input Size** (Faster but less accurate)
```javascript
// File: frontend/src/hooks/useFaceDetection.js
new faceapi.TinyFaceDetectorOptions({
    inputSize: 224,  // Lower = faster (default: 320)
    scoreThreshold: 0.5,
})
```

#### 2. **Increase Detection Interval** (Check less frequently)
```javascript
// File: frontend/src/hooks/useFaceDetection.js
setInterval(() => {
    detectFace();
}, 1000);  // 1 second instead of 0.5 seconds
```

---

## Problem 4: Multiple Faces Detected (Even with One Person)

### Symptoms:
- Status shows "Multiple faces detected. Only one person allowed."
- Only you are in frame
- Red error state

### Solutions:

#### 1. **Check for Reflections**
- Mirrors in background
- Reflective surfaces
- Glass/windows behind you

#### 2. **Check for Photos/Posters**
- Pictures of faces on wall
- Posters with faces
- TV/monitor showing faces

#### 3. **Improve Camera Angle**
- Point camera away from reflective surfaces
- Change your position
- Cover mirrors/photos

#### 4. **Check Console**
- May be detecting phantom faces
- Could be lighting issue creating face-like patterns

---

## Problem 5: "Failed to load face recognition models"

### Symptoms:
- Error message in console
- Models don't load
- Detection never works

### Solutions:

#### 1. **Check Model Files Exist**
```bash
# Navigate to frontend directory
cd frontend/public/models

# List files (Windows)
dir

# Should see these files:
# - tiny_face_detector_model-weights_manifest.json
# - tiny_face_detector_model.bin
# - face_landmark_68_model-weights_manifest.json
# - face_landmark_68_model.bin
# - face_recognition_model-weights_manifest.json
# - face_recognition_model.bin
```

#### 2. **Re-download Models**
If files are missing or corrupted:

```bash
# Download from face-api.js repository
# https://github.com/justadudewhohacks/face-api.js/tree/master/weights

# Or install via npm and copy:
npm install face-api.js
# Copy from node_modules/face-api.js/weights/ to public/models/
```

#### 3. **Check File Permissions**
Ensure web server can read files:
- Files should be readable
- Directory should be accessible

#### 4. **Clear Browser Cache**
- Hard refresh: `Ctrl + Shift + R` (Windows)
- Or clear cache in DevTools

---

## Problem 6: Camera Permission Denied

### Symptoms:
- Status: "Camera access denied or not available"
- No video stream

### Solutions:

#### 1. **Grant Camera Permission**
- Browser will prompt for permission
- Click "Allow"

#### 2. **Check Browser Settings**

**Chrome:**
1. Click lock icon in address bar
2. Camera → Allow

**Firefox:**
1. Click lock icon
2. More Information → Permissions → Camera → Allow

#### 3. **Check System Settings**

**Windows:**
1. Settings → Privacy → Camera
2. Enable "Allow apps to access camera"
3. Enable for specific browser

#### 4. **Use HTTPS or Localhost**
- Camera API only works on:
  - `https://` (secure)
  - `http://localhost`
  - `http://127.0.0.1`

---

## Problem 7: Verification Fails with Enrolled Face

### Symptoms:
- Face enrolled successfully
- Detection works
- But verification fails with 403 error
- "Face verification failed. Please try again."

### Solutions:

#### 1. **Check Match Threshold**
Backend may be too strict:

**File:** `backend/app/Services/FaceVerificationService.php`
```php
private const MATCH_THRESHOLD = 0.6;

// Try lowering to:
private const MATCH_THRESHOLD = 0.5;  // More lenient
```

#### 2. **Re-enroll in Better Conditions**
- Same lighting as verification
- Same distance from camera
- Same facial expression (neutral)
- Remove glasses if you don't usually wear them

#### 3. **Check Backend Logs**
```bash
# In backend directory
tail -f storage/logs/laravel.log
```

Look for errors during verification.

#### 4. **Verify Descriptor Was Saved**
Check database:
```sql
SELECT id, email, face_enrolled_at 
FROM users 
WHERE email = 'your@email.com';
```

Should show enrollment date.

---

## Debug Checklist

Run through this checklist:

- [ ] Backend server running (`php artisan serve`)
- [ ] Frontend dev server running (`npm run dev`)
- [ ] Browser console shows no errors
- [ ] Network tab shows models loading (200 status)
- [ ] Camera permission granted
- [ ] Good lighting on face
- [ ] Face is centered and clear
- [ ] Face enrolled in Profile page
- [ ] "Enrolled" badge visible in Profile
- [ ] No mirrors/reflections in background
- [ ] Only one person in frame
- [ ] Wait 3-5 seconds for detection

---

## Still Not Working?

### Collect Debug Info:

1. **Browser Console Errors** (F12 → Console)
2. **Network Tab** (F12 → Network, filter by "models")
3. **Backend Logs** (`storage/logs/laravel.log`)
4. **Database Check** (is `face_descriptor` saved?)
5. **Screenshot** of error message

### Test with Different Browser:
- Try Chrome (recommended)
- Try Firefox
- Try Edge

### Test with Different Lighting:
- Natural daylight
- Indoor lighting
- Different room

### Test with Different Camera:
- Built-in webcam
- External USB camera
- Different device

---

## Performance Tips

### For Better Detection:
- ✅ Use good lighting
- ✅ Neutral facial expression
- ✅ No glasses/hats
- ✅ Clean camera lens
- ✅ Stable internet connection
- ✅ Close other apps using camera

### For Faster Detection:
- Lower `inputSize` (224 instead of 320)
- Increase interval (1000ms instead of 500ms)
- Use better hardware (faster CPU)

---

## Common Mistakes

❌ **Trying to verify BEFORE enrolling**
→ Must enroll in Profile FIRST

❌ **Multiple people in frame**
→ Only one person allowed

❌ **Poor lighting**
→ Face the light source

❌ **Moving too much**
→ Hold still for 2-3 seconds

❌ **Too far from camera**
→ Move closer (1-3 feet)

❌ **Extreme angles**
→ Face camera directly

❌ **Models not loaded**
→ Check console for errors

❌ **Wrong browser**
→ Use Chrome/Firefox/Edge

---

**Still having issues? Check browser console and backend logs for specific errors!**
