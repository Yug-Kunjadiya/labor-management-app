@echo off
echo ========================================
echo Factory Labor Management System
echo ========================================
echo.
echo Starting Backend Server...
start cmd /k "cd /d %~dp0 && node server/server.js"
timeout /t 3 /nobreak > nul
echo.
echo Starting React Frontend...
start cmd /k "cd /d %~dp0\client && npm start"
echo.
echo ========================================
echo Application is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
pause
