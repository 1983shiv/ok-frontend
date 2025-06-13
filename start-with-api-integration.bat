@echo off
echo.
echo ========================================
echo    TradingOK Full Setup and Startup
echo ========================================
echo.

cd /d "e:\js\clone ui\tradingok"

echo 📋 Setting up TradingOK with API integration...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Setup backend
echo.
echo 🔧 Setting up backend...
cd backend

if not exist node_modules (
    echo 📦 Installing backend dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed
) else (
    echo ✅ Backend dependencies already installed
)

REM Setup frontend
echo.
echo 🔧 Setting up frontend...
cd ..\frontend

if not exist node_modules (
    echo 📦 Installing frontend dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
) else (
    echo ✅ Frontend dependencies already installed
)

echo.
echo 📦 Installing Socket.IO client...
npm install socket.io-client@^4.7.2
if errorlevel 1 (
    echo ❌ Failed to install Socket.IO client
    pause
    exit /b 1
)

echo.
echo 🚀 Starting servers...
echo.

REM Start backend server in new window
echo 🖥️  Starting Backend Server (Port 8080)...
start "TradingOK Backend - API Server" cmd /k "cd /d \"e:\js\clone ui\tradingok\backend\" && echo. && echo ======================================== && echo    TradingOK Backend API Server && echo    Port: 8080 && echo    API: http://localhost:8080/api && echo ======================================== && echo. && npm start"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend server in new window  
echo 🌐 Starting Frontend Server (Port 3002)...
start "TradingOK Frontend - Live Dashboard" cmd /k "cd /d \"e:\js\clone ui\tradingok\frontend\" && echo. && echo ======================================== && echo    TradingOK Frontend Dashboard && echo    Port: 3002 && echo    App: http://localhost:3002 && echo    Live Data: http://localhost:3002/live-data && echo    API Test: http://localhost:3002/api-test && echo ======================================== && echo. && npm run dev:3002"

echo.
echo ✅ Both servers are starting up!
echo.
echo 📊 Backend API Server:  http://localhost:8080
echo 🌐 Frontend Dashboard:  http://localhost:3002
echo 🔴 Live Data Page:      http://localhost:3002/live-data  
echo 🧪 API Test Page:       http://localhost:3002/api-test
echo.
echo 📋 Integration Features:
echo    ✅ REST API endpoints (34+ endpoints)
echo    ✅ WebSocket real-time data
echo    ✅ Redux state management  
echo    ✅ Error handling & loading states
echo    ✅ TypeScript support
echo    ✅ Live data subscriptions
echo.

REM Wait for servers to fully start
timeout /t 10 /nobreak >nul

echo 🔗 Opening live data dashboard...
start http://localhost:3002/live-data

echo.
echo 💡 Tips:
echo    - Wait 15-20 seconds for servers to fully initialize
echo    - Check server windows for any error messages
echo    - Visit /live-data page to see API integration in action
echo    - Visit /api-test page to test individual endpoints
echo.
echo 🎉 TradingOK is now running with full API integration!
echo    Frontend now uses live backend data instead of static JSON files
echo.

echo Press any key to close this window (servers will keep running)...
pause >nul
