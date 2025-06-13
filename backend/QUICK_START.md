# 🚀 Backend Server - Quick Start Guide

## ✅ Pre-flight Check

Before starting the server, let's make sure everything is properly configured:

### 1. Validate Route Files
```bash
node validate-routes.js
```
This will check that all route files can be loaded without errors.

### 2. Check Dependencies
```bash
npm list --depth=0
```
Ensure all required packages are installed.

## 🏃‍♂️ Starting the Server

### Option A: Windows Batch File (Recommended)
```bash
start-server.bat
```

### Option B: Manual Start
```bash
node server.js
```

### Option C: Development Mode (with auto-restart)
```bash
npm run dev
```

## 🧪 Testing the Server

### Quick API Test
```bash
node test-backend.js
```

### Full Startup Test
```bash
test-startup.bat
```

### Individual Endpoint Tests
```bash
# Test market status
curl http://localhost:5000/api/market/status

# Test options chain
curl "http://localhost:5000/api/options/chain/NIFTY/25-01-2024"

# Test COI analysis
curl "http://localhost:5000/api/open-interest/coi-analysis/NIFTY"

# Test positions
curl http://localhost:5000/api/positions
```

## 📊 Available Endpoints

### Market Data
- `GET /api/market/status` - Market status
- `GET /api/market/symbols` - Available symbols
- `GET /api/market/expiries/:symbol` - Expiry dates
- `GET /api/market/strikes/:symbol/:expiry` - Strike prices
- `GET /api/market/futures/:symbol` - Futures data

### Options Analysis
- `GET /api/options/chain/:symbol/:expiry` - Options chain
- `GET /api/options/iv-analysis/:symbol` - IV analysis
- `GET /api/options/premium-decay/:symbol` - Premium decay
- `GET /api/options/straddle/:symbol/:strike` - Straddle analysis
- `GET /api/options/multi-strike/:symbol` - Multi-strike analysis

### Open Interest
- `GET /api/oi/coi-analysis/:symbol` - Change in OI
- `GET /api/oi/pcr-analysis/:symbol` - PCR analysis
- `GET /api/oi/gainer-looser/:symbol` - OI gainer/looser
- `GET /api/oi/price-vs-oi/:symbol` - Price vs OI

### Positions
- `GET /api/positions` - All positions
- `GET /api/positions/summary/expiry` - Summary by expiry
- `GET /api/positions/greeks` - Greeks breakdown
- `GET /api/positions/pnl` - P&L analysis

### Charts
- `GET /api/charts/oi-data/:symbol` - OI chart data
- `GET /api/charts/price-vs-oi/:symbol` - Price vs OI charts
- `GET /api/charts/premium-decay/:symbol` - Premium decay charts
- `GET /api/charts/iv-surface/:symbol` - IV surface

### Historical Data
- `GET /api/historical/oi/:symbol` - Historical OI
- `GET /api/historical/premium/:symbol` - Historical premium
- `GET /api/historical/pcr/:symbol` - Historical PCR
- `GET /api/historical/iv/:symbol` - Historical IV

### Futures
- `GET /api/futures/oi-analysis` - Futures OI analysis
- `GET /api/futures/price-vs-oi/:symbol` - Futures price vs OI
- `GET /api/futures/rollover-analysis/:symbol` - Rollover analysis
- `GET /api/futures/term-structure/:symbol` - Term structure

### Configuration
- `GET /api/config/intervals` - Available intervals
- `GET /api/config/symbols` - Symbol configuration
- `GET /api/config/ranges` - OI ranges
- `GET /api/config/application` - App settings

## 🔌 WebSocket Events

### Real-time Data Streams
- `price_update` - Live price updates (1s)
- `oi_update` - OI changes (5s)
- `iv_update` - IV updates (10s)
- `pcr_update` - PCR updates (15s)
- `market_status` - Market status changes

### Client Events
- `subscribe` - Subscribe to data streams
- `unsubscribe` - Unsubscribe from streams
- `get_snapshot` - Get current snapshot

## 🐛 Troubleshooting

### Server Won't Start
1. Check if port 5000 is already in use:
   ```bash
   netstat -an | find ":5000"
   ```
2. Check for import errors:
   ```bash
   node validate-routes.js
   ```
3. Verify dependencies:
   ```bash
   npm install
   ```

### API Endpoints Return Errors
1. Check server logs in the console
2. Verify the endpoint URL and parameters
3. Use the test script:
   ```bash
   node test-backend.js
   ```

### WebSocket Connection Issues
1. Ensure server is running
2. Check browser console for errors
3. Test with Socket.IO client

## 📈 Performance Tips

1. **Caching**: The server uses NodeCache for performance
2. **Rate Limiting**: 1000 requests per 15 minutes per IP
3. **Data Generation**: Sample data is generated in real-time
4. **WebSocket**: Efficient real-time data streaming

## 🔒 Security Features

- CORS enabled for localhost:3000 and localhost:3001
- Request rate limiting
- Input validation and sanitization
- Error handling without stack traces in production

## 🎯 Next Steps

1. Start the backend server
2. Test API endpoints
3. Integrate with your React frontend
4. Set up real-time WebSocket connections
5. Replace static JSON files with API calls

## 🆘 Support

If you encounter issues:
1. Check the console logs
2. Run the validation script
3. Verify all dependencies are installed
4. Ensure port 5000 is available

Happy trading! 📈
