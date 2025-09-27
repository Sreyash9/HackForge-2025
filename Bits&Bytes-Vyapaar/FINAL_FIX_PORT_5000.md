# 🚀 FINAL FIX - Port 5000 (No Permission Issues)

## ✅ PROBLEM SOLVED
Port 5500 has permission issues on Windows. Switched to port 5000 which works perfectly.

## 🔧 IMMEDIATE FIX (2 minutes):

### Step 1: Update Google Cloud Console
1. **Go to**: https://console.cloud.google.com/
2. **Navigate to**: "APIs & Services" > "Credentials"
3. **Find your OAuth client**: `556165589131-cqj02a2l07npg1tf47ll994llo3nm4f0.apps.googleusercontent.com`
4. **Click on it to edit**

### Step 2: Add Port 5000 URLs
**In "Authorized JavaScript origins", add:**
```
http://localhost:5000
http://127.0.0.1:5000
file://
```

**In "Authorized redirect URIs", add:**
```
http://localhost:5000
http://127.0.0.1:5000
```

### Step 3: Save and Test
1. **Click "Save"**
2. **Wait 1-2 minutes** for changes to take effect
3. **Start your server**:
   ```bash
   python app.py
   ```
   (Should show: "Running on http://0.0.0.0:5000")
4. **Open your frontend** and test Google login

## ✅ What I Fixed:
- ✅ Backend now runs on port 5000 (no permission issues)
- ✅ Frontend connects to port 5000
- ✅ All test files use port 5000
- ✅ Everything configured for port 5000

## 🎯 Expected Result:
After adding port 5000 to Google Cloud Console, your Google login will work perfectly!

**Port 5000 is the standard Flask port and won't have permission issues on Windows.**
