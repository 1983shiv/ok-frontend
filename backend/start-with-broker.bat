@echo off
echo Starting TradingOK Backend Server with Live Stock Broker Integration...
echo.
echo This will start:
echo - Express.js API Server
echo - MongoDB Connection  
echo - Stock Broker WebSocket Service (Upstox)
echo - Real-time Market Data Processing
echo.
cd /d "e:\js\clone ui\tradingok\backend"
npm start
pause
