@echo off
echo.
echo ================================================
echo   Testing Trading Analytics Backend Server
echo ================================================
echo.

cd /d "e:\js\clone ui\tradingok\backend"

echo Checking if server is already running on port 5000...
netstat -an | find ":5000" >nul
if %errorlevel%==0 (
    echo Server appears to be already running on port 5000
    echo.
    echo Testing API endpoints...
    timeout /t 2 >nul
    node test-backend.js
    pause
    exit /b 0
)

echo Starting server...
echo.
start "Trading Backend Server" cmd /k "node server.js"

echo Waiting for server to start...
timeout /t 5 >nul

echo.
echo Testing API endpoints...
node test-backend.js

echo.
echo ================================================
echo Server started successfully!
echo API available at: http://localhost:5000/api
echo WebSocket available at: http://localhost:5000
echo ================================================
echo.

pause
