# COMPLETE Google OAuth Setup - Step by Step

## 🚀 QUICK FIX - Follow These Exact Steps

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**:
   - Click on project dropdown at top
   - Click "New Project" or select existing one
   - Name it "VyaparSaathi" or similar

3. **Enable APIs**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" → Enable it
   - Search for "People API" → Enable it
   - Search for "Google Identity Services API" → Enable it

4. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" → Create
   - Fill in:
     - App name: `VyaparSaathi`
     - User support email: `your-email@gmail.com`
     - Developer contact: `your-email@gmail.com`
   - Click "Save and Continue"
   - On "Scopes" page → Click "Save and Continue"
   - On "Test users" page → Add your email → Click "Save and Continue"

5. **Create OAuth Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: `VyaparSaathi Web Client`
   - **Authorized JavaScript origins** (add ALL of these):
     ```
     http://localhost:5501
     http://127.0.0.1:5501
     http://localhost:5000
     http://127.0.0.1:5000
     http://localhost:3000
     http://127.0.0.1:3000
     http://localhost:8080
     http://127.0.0.1:8080
     file://
     ```
   - **Authorized redirect URIs** (add ALL of these):
     ```
     http://localhost:5501
     http://127.0.0.1:5501
     http://localhost:5000
     http://127.0.0.1:5000
     http://localhost:3000
     http://127.0.0.1:3000
     http://localhost:8080
     http://127.0.0.1:8080
     ```
   - Click "Create"
   - **COPY the Client ID** (it should be: `556165589131-cqj02a2l07npg1tf47ll994llo3nm4f0.apps.googleusercontent.com`)

### Step 2: Update Your Code (Already Done ✅)

Your code is already updated with the correct Client ID.

### Step 3: Install Dependencies

Open Command Prompt/Terminal in your backend folder and run:
```bash
cd "C:\Users\WALSH\OneDrive\Desktop\HOPE 7\BACKENDD\backend"
pip install -r requirements.txt
```

### Step 4: Start Your Application

1. **Start Backend**:
   ```bash
   cd "C:\Users\WALSH\OneDrive\Desktop\HOPE 7\BACKENDD\backend"
   python app.py
   ```

2. **Open Frontend**:
   - Open `C:\Users\WALSH\OneDrive\Desktop\HOPE 7\FRONTENDD\frontend\index.html` in your browser
   - Or open `C:\Users\WALSH\OneDrive\Desktop\HOPE 7\test_oauth.html` to test first

### Step 5: Test Google Login

1. Click "Sign in with Google"
2. Complete the OAuth flow
3. You should be redirected to your dashboard

## 🔧 TROUBLESHOOTING

### If you still get errors:

1. **Check OAuth Consent Screen Status**:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Make sure status is "Testing" or "In production"
   - If "Testing", add your email to test users

2. **Verify Client ID**:
   - Make sure you're using: `556165589131-cqj02a2l07npg1tf47ll994llo3nm4f0.apps.googleusercontent.com`
   - Check it matches in Google Cloud Console

3. **Check Browser Console**:
   - Press F12 → Console tab
   - Look for any error messages
   - Share them if you need help

4. **Try Different Browser**:
   - Sometimes Chrome works better than Edge/Firefox for OAuth

## 🎯 ALTERNATIVE: Simple Test

If main app doesn't work, test with the simple file:
1. Open `test_oauth.html` in browser
2. Click Google sign-in button
3. If this works, the issue is in your main app
4. If this doesn't work, the issue is in Google Cloud Console setup

## 📞 Need Help?

If you're still having issues, please share:
1. Any error messages from browser console (F12)
2. Screenshot of your Google Cloud Console OAuth settings
3. Which step you're stuck on

The setup should work after following these exact steps!
