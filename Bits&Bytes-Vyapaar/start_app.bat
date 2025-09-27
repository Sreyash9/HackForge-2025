@echo off
echo Starting VyaparSaathi Backend Server...
echo.
echo Make sure you have:
echo 1. Python installed
echo 2. Dependencies installed (pip install -r requirements.txt)
echo 3. Google OAuth configured in Google Cloud Console
echo.
echo Starting server on http://127.0.0.1:5000
echo.
cd /d "%~dp0BACKENDD\backend"
python app.py
pause
