@echo off
echo Installing VyaparSaathi Dependencies...
echo.

echo Installing Python packages...
cd /d "%~dp0BACKENDD\backend"
pip install flask
pip install flask-cors
pip install pandas
pip install openpyxl
pip install google-auth
pip install google-auth-oauthlib
pip install google-auth-httplib2
pip install requests

echo.
echo ✅ Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Follow the Google Cloud Console setup in COMPLETE_GOOGLE_SETUP.md
echo 2. Run start_app.bat to start the server
echo 3. Open test_oauth.html to test Google login
echo.
pause
