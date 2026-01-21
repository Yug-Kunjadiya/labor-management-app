@echo off
echo ========================================
echo Factory Labor Management - MongoDB Setup
echo ========================================
echo.

REM Check if .env file exists and has password
findstr /C:"<db_password>" server\.env >nul
if %errorlevel% equ 0 (
    echo [WARNING] Please update your MongoDB password in server\.env file!
    echo Replace ^<db_password^> with your actual MongoDB password.
    echo.
    pause
    exit /b 1
)

echo Installing server dependencies...
cd server
call npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting MongoDB Backend Server...
echo ========================================
echo.
call npm start
