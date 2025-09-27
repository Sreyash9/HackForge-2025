# Google OAuth Setup Instructions

## 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5000`
     - `http://127.0.0.1:5000`
     - `http://localhost:3000` (if you serve frontend separately)
   - Add authorized redirect URIs:
     - `http://localhost:5000/auth/google/callback`
     - `http://127.0.0.1:5000/auth/google/callback`

## 2. Update Configuration Files

### Backend Configuration
Update the `GOOGLE_CLIENT_ID` in `BACKENDD/backend/app.py`:
```python
GOOGLE_CLIENT_ID = 'your-actual-client-id.apps.googleusercontent.com'
```

### Frontend Configuration
Update the `client_id` in `FRONTENDD/frontend/index.html`:
```javascript
client_id: 'your-actual-client-id.apps.googleusercontent.com'
```

## 3. Environment Variables (Optional)
For production, set environment variables:
```bash
export GOOGLE_CLIENT_ID="your-actual-client-id.apps.googleusercontent.com"
```

## 4. Install Dependencies
Run the following command in the backend directory:
```bash
cd BACKENDD/backend
pip install -r requirements.txt
```

## 5. Test the Setup
1. Start the backend server:
   ```bash
   cd BACKENDD/backend
   python app.py
   ```
2. Open the frontend in your browser
3. Click "Sign in with Google"
4. Complete the OAuth flow

## Security Notes
- Never commit your actual client ID to version control
- Use environment variables for production
- The current setup uses session-based authentication
- Make sure to use HTTPS in production

## Troubleshooting
- If you get "Invalid client" error, check your client ID
- If you get CORS errors, make sure your origins are correctly configured
- If authentication fails, check the browser console for errors
