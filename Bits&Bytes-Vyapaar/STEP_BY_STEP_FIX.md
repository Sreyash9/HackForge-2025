# 🚀 STEP-BY-STEP FIX for Google Sign-In

## Your Goal: Click "Sign In with Google" → Google popup appears → You sign in → Success!

## 📋 STEP 1: Start Your Backend Server
```bash
cd "C:\Users\WALSH\OneDrive\Desktop\HOPE 7\BACKENDD\backend"
python app.py
```
**Expected result:** You should see "Running on http://0.0.0.0:5501"

## 📋 STEP 2: Test Google Sign-In
1. **Open**: `simple_google_login.html` in your browser
2. **Click**: Either "Sign in with Google" button
3. **Expected result**: Google popup should appear

## 📋 STEP 3: If Google Popup Doesn't Appear
This means Google Cloud Console needs to be configured:

### Go to Google Cloud Console:
1. **Visit**: https://console.cloud.google.com/
2. **Navigate to**: "APIs & Services" > "Credentials"
3. **Find your OAuth client**: `556165589131-cqj02a2l07npg1tf47ll994llo3nm4f0.apps.googleusercontent.com`
4. **Click on it to edit**

### Add These URLs:
**In "Authorized JavaScript origins":**
```
http://localhost:5501
http://127.0.0.1:5501
file://
```

**In "Authorized redirect URIs":**
```
http://localhost:5501
http://127.0.0.1:5501
```

5. **Click "Save"**
6. **Wait 1-2 minutes** for changes to take effect
7. **Test again**

## 📋 STEP 4: If You Get "Something went wrong" Error
This means the URLs aren't configured correctly. Double-check:
- ✅ You added the exact URLs above
- ✅ You clicked "Save" in Google Cloud Console
- ✅ You waited 1-2 minutes after saving
- ✅ You're testing on the correct port (5501)

## 📋 STEP 5: Test Your Main App
Once the simple test works:
1. **Open**: `FRONTENDD/frontend/index.html`
2. **Click**: "Sign in with Google"
3. **Should work the same way!**

## 🔧 TROUBLESHOOTING

### If Google popup still doesn't appear:
1. **Check browser console** (F12 → Console) for errors
2. **Try different browser** (Chrome works best)
3. **Clear browser cache** and try again
4. **Make sure you're not in incognito mode**

### If you get "Invalid client" error:
- Your client ID is correct, but Google Console isn't configured
- Follow Step 3 above

### If backend connection fails:
- Make sure `python app.py` is running
- Check that it shows port 5501

## ✅ SUCCESS INDICATORS
- ✅ Google popup appears when you click the button
- ✅ You can sign in with your Google account
- ✅ You get redirected back with success message
- ✅ Backend receives and processes the token

**The key is getting the Google popup to appear - once that works, everything else will work!**
