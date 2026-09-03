@echo off
title JOBLEX - Starting Server
echo ========================================================
echo   Starting JOBLEX Academia-Industry Portal (HTML/CSS/JS)
echo ========================================================

echo.
echo Launching Python Flask Server on http://localhost:5000...
echo (Serves HTML, CSS, JS frontend and REST API simultaneously)
start "JOBLEX Server" cmd /k "cd /d "%~dp0" && python backend/app.py"

timeout /t 2 >nul

echo.
echo Opening JOBLEX in your default browser...
start http://localhost:5000

echo.
echo ========================================================
echo Server live at http://localhost:5000
echo ========================================================
pause
