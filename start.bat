@echo off
title E-Ayurvedic Health Assistant - Launcher
color 0A

echo ===========================================================
echo         E-Ayurvedic Health Assistant Launcher
echo ===========================================================
echo.

:: 1. Check Node.js Installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not found in PATH!
    echo Please download and install Node.js (LTS version) from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected:
node -v
npm -v
echo.

:: 2. Check and Install Server Dependencies if missing
if not exist "server\node_modules\" (
    echo [1/3] Installing backend dependencies (server)...
    cd server
    call npm install
    cd ..
    echo [OK] Backend dependencies installed.
    echo.
)

:: 3. Check and Install Client Dependencies if missing
if not exist "client\node_modules\" (
    echo [2/3] Installing frontend dependencies (client)...
    cd client
    call npm install
    cd ..
    echo [OK] Frontend dependencies installed.
    echo.
)

:: 4. Launch Backend & Frontend in separate windows
echo [3/3] Starting Backend and Frontend servers...
echo.

:: Start Backend Server
start "🌿 E-Ayurvedic Backend (Port 5000)" cmd /k "cd server && npm start"

:: Start Frontend Server
start "🌿 E-Ayurvedic Frontend (Port 5173)" cmd /k "cd client && npm run dev"

:: Wait 3 seconds for servers to initialize
echo Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

:: Open browser automatically
echo Opening application in your default browser...
start http://localhost:5173

echo.
echo ===========================================================
echo   Application successfully started!
echo   - Frontend Web App: http://localhost:5173
echo   - Backend REST API: http://localhost:5000/api/health
echo ===========================================================
echo.
echo Tip: Keep the two opened terminal windows running while using the app.
echo.
pause
