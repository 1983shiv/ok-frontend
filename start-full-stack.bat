@echo off
echo.
echo ========================================
echo    TradingOK Full Stack Startup
echo ========================================
echo.

cd /d "e:\js\clone ui\tradingok"

echo 📋 Starting TradingOK Backend and Frontend servers...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is available

REM Check backend dependencies
echo.
echo 🔍 Checking backend dependencies...
cd backend
if not exist node_modules (
    echo 📦 Installing backend dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
)

REM Check frontend dependencies
echo.
echo 🔍 Checking frontend dependencies...
cd ..\frontend
if not exist node_modules (
    echo 📦 Installing frontend dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Starting servers...
echo.

REM Start backend server in new window
echo 🖥️  Starting Backend Server (Port 8080)...
start "TradingOK Backend" cmd /k "cd /d \"e:\js\clone ui\tradingok\backend\" && echo Backend Server Starting... && npm start"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server in new window
echo 🌐 Starting Frontend Server (Port 3002)...
start "TradingOK Frontend" cmd /k "cd /d \"e:\js\clone ui\tradingok\frontend\" && echo Frontend Server Starting... && npm run dev:3002"

echo.
echo ✅ Both servers are starting up!
echo.
echo 📊 Backend API:     http://localhost:8080
echo 🌐 Frontend App:    http://localhost:3002
echo 🧪 API Test Page:   http://localhost:3002/api-test
echo.
echo 💡 Tips:
echo    - Wait 10-15 seconds for servers to fully start
echo    - Visit the API Test page to verify connectivity
echo    - Check server windows for any error messages
echo.

REM Wait a bit more then try to open test page
timeout /t 8 /nobreak >nul
echo 🔗 Opening API Test Page...
start http://localhost:3002/api-test

echo.
echo Press any key to close this window (servers will keep running)...
pause >nul
