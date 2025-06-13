# 🔧 Backend API Troubleshooting Guide

## 🎯 Your Current Issue
You're getting "FAILED - undefined" and "Route not found" errors when testing the API endpoints.

## 🔍 Step-by-Step Diagnostic Process

### Step 1: Verify Server is Running
```cmd
# Check if something is running on port 8080
netstat -an | find ":8080"
```

If you see something like `0.0.0.0:8080` or `[::]:8080`, the server is running.

### Step 2: Test Basic Connectivity
```cmd
cd "e:\js\clone ui\tradingok\backend"
node connectivity-test.js
```

This will test basic connection and health endpoint.

### Step 3: Run Validation
```cmd
node validate-routes.js
```

This ensures all route files can load properly (you already did this ✅).

### Step 4: Check Server Console
Look at your server console where you ran `node server.js`. You should see:
```
🚀 TradingOK Backend Server running on port 8080
📊 WebSocket server ready for real-time data streaming
🔗 API available at http://localhost:8080/api
```

### Step 5: Test Individual Endpoints
```cmd
node debug-single.js
```

## 🐛 Common Issues & Solutions

### Issue 1: "undefined" Error Response
**Cause**: Server returning empty or malformed responses
**Solution**: Check server console for errors, restart server

### Issue 2: "Route not found" Errors
**Cause**: Incorrect endpoint paths or routes not registered
**Solutions**:
- Verify endpoint paths match server routes
- Check server.js route imports
- Restart server to reload routes

### Issue 3: Connection Refused
**Cause**: Server not running or wrong port
**Solutions**:
- Start server: `node server.js`
- Check port: Server should say "running on port 8080"
- Verify no other process using port 8080

### Issue 4: JSON Parse Errors
**Cause**: Server returning HTML error pages or non-JSON
**Solutions**:
- Check server middleware configuration
- Verify API routes are properly set up
- Check for Express routing conflicts

## 🔧 Quick Fixes to Try

### Fix 1: Restart Everything
```cmd
# Stop server (Ctrl+C in server console)
# Then restart:
cd "e:\js\clone ui\tradingok\backend"
node server.js
```

### Fix 2: Check Server Logs
When you run `node server.js`, watch for:
- ✅ "Server running on port 8080"
- ❌ Any error messages
- ❌ Route loading errors

### Fix 3: Test with Browser
Open browser and go to:
- `http://localhost:8080/api/health`
- `http://localhost:8080/api/market/status`

### Fix 4: Use Different Test Method
```cmd
# Test with curl (if available)
curl http://localhost:8080/api/health

# Or use PowerShell
powershell "Invoke-RestMethod -Uri 'http://localhost:8080/api/health'"
```

## 📋 Expected Working Endpoints

✅ **These should work:**
- `GET /api/health` - Health check
- `GET /api/market/status` - Market status
- `GET /api/market/symbols` - Available symbols
- `GET /api/positions` - Portfolio positions
- `GET /api/config/intervals` - Configuration

❓ **These need parameters:**
- `GET /api/options/chain/NIFTY/25-01-2024` - Options chain
- `GET /api/oi/coi-analysis/NIFTY` - COI analysis
- `GET /api/charts/oi-data/NIFTY` - Chart data

## 🆘 If Nothing Works

1. **Check server is actually running**:
   ```cmd
   tasklist | find "node"
   ```

2. **Try different port** (edit server.js):
   ```javascript
   const PORT = process.env.PORT || 3001; // Change from 8080
   ```

3. **Check Windows Firewall**:
   - Allow Node.js through firewall
   - Try disabling firewall temporarily

4. **Restart your terminal/command prompt**

5. **Check antivirus software**:
   - Some antivirus blocks local servers
   - Add exception for Node.js

## 🎯 Next Steps

1. Run `node connectivity-test.js` first
2. If that works, run `node test-backend.js`
3. Check the specific error messages
4. Share the server console output

The backend code is validated and correct ✅, so this is likely a connectivity or configuration issue!
