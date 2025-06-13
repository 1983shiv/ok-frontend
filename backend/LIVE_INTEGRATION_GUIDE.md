# TradingOK Live Stock Broker Integration - Complete Setup

## 🚀 Overview
This document provides complete instructions for running the TradingOK backend with live stock broker integration using Upstox WebSocket data feed.

## 📋 Prerequisites
- Node.js (v14 or higher)
- MongoDB running locally on port 27017
- Valid Upstox access token in `.env` file
- Active internet connection for live data

## 🔧 Quick Start

### 1. Start MongoDB
```cmd
# Make sure MongoDB is running
net start MongoDB
```

### 2. Start Backend Server
```cmd
# Option 1: Use the batch file
start-with-broker.bat

# Option 2: Manual start
cd "e:\js\clone ui\tradingok\backend"
npm start
```

### 3. Test Integration
```cmd
# Run the integration test
node test-integration.js
```

## 🏗️ Architecture

### Core Components

1. **Express.js API Server** (Port 8080)
   - REST API endpoints for historical data
   - WebSocket server for real-time updates
   - Rate limiting and CORS configured

2. **MongoDB Database** (stock_analysis)
   - MarketTick collection: Real-time tick data
   - Instrument collection: Master instrument data
   - OHLC collection: Aggregated OHLC data
   - MarketStatus collection: Market status tracking

3. **Stock Broker WebSocket Service**
   - Connects to Upstox WebSocket feed
   - Processes protobuf messages
   - Filters and stores market data
   - Emits real-time updates via Socket.IO

4. **Instrument Manager**
   - Fetches instruments from Upstox API
   - Filters based on expiry and strike criteria
   - Limits to 2000 instruments max
   - Prioritizes NIFTY weekly, others monthly

## 📊 Data Flow

```
Upstox WebSocket Feed → Protobuf Decoder → Data Processor → MongoDB Storage
                                      ↓
                               Socket.IO Emitter → Frontend
```

## 🔌 API Endpoints

### Health & Status
- `GET /api/health` - Server health with service status
- `GET /api/broker-status` - Stock broker service detailed status

### Market Data
- `GET /api/marketdata/status` - Current market status
- `GET /api/marketdata/instruments` - Instruments list with filtering
- `GET /api/marketdata/ticks/latest` - Latest tick data for tokens
- `GET /api/marketdata/ticks/history` - Historical tick data
- `GET /api/marketdata/ohlc` - OHLC data for specific timeframes
- `GET /api/marketdata/stats` - Market data statistics
- `GET /api/marketdata/search` - Search instruments

### Example Requests
```javascript
// Get latest tick data for NIFTY and BANKNIFTY
GET /api/marketdata/ticks/latest?tokens=256265,256009

// Get NIFTY instruments
GET /api/marketdata/instruments?symbol=NIFTY&limit=50

// Search for instruments
GET /api/marketdata/search?query=NIFTY&limit=10
```

## 🔄 WebSocket Events

### Client → Server
- `subscribe:market` - Subscribe to market data updates
- `subscribe:options` - Subscribe to options data
- `subscribe:oi` - Subscribe to open interest updates
- `unsubscribe` - Unsubscribe from data streams

### Server → Client
- `subscription:confirmed` - Subscription confirmation
- `market:tick` - Real-time tick data
- `market:data` - Processed market data
- `oi:update` - Open interest updates

## 📝 Configuration

### Environment Variables (.env)
```env
UPSTOX_ACCESS_TOKEN=your_upstox_access_token_here
MONGODB_URI=mongodb://localhost:27017/stock_analysis/
NODE_ENV=development
PORT=8080
```

### Instrument Filtering Rules
- **NIFTY Options**: Current week + Next week expiry (max 800 instruments)
- **BANKNIFTY Options**: Current month expiry (max 400 instruments)
- **FINNIFTY Options**: Current month expiry (max 400 instruments)
- **MIDCPNIFTY Options**: Current month expiry (max 400 instruments)
- **Indices**: All major indices for reference

### Strike Selection
- ATM ± 500 points for NIFTY
- ATM ± 1000 points for BANKNIFTY
- ATM ± 200 points for FINNIFTY
- ATM ± 300 points for MIDCPNIFTY

## 📈 Performance & Monitoring

### Statistics Tracking
- Messages received per second
- Ticks processed and stored
- Error count and types
- Database write performance
- WebSocket connection status

### Memory Management
- Batch processing for database writes
- Circular buffer for real-time data
- Automatic cleanup of old data
- Connection pooling for MongoDB

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```
   Solution: Ensure MongoDB is running
   net start MongoDB
   ```

2. **Upstox WebSocket Connection Failed**
   ```
   Check: Valid access token in .env
   Check: Internet connectivity
   Check: Token expiry date
   ```

3. **No Data Received**
   ```
   Check: Market hours (9:15 AM - 3:30 PM IST)
   Check: Instrument subscription list
   Check: WebSocket connection status
   ```

4. **High Memory Usage**
   ```
   Solution: Increase batch size for database writes
   Solution: Implement data retention policies
   ```

### Debug Commands
```cmd
# Check server logs
npm start

# Test specific endpoints
node test-integration.js

# Check MongoDB connection
mongo stock_analysis

# View instrument count
db.instruments.count()

# View recent ticks
db.marketticks.find().limit(5).sort({timestamp: -1})
```

## 🔄 Data Retention

### Automatic Cleanup
- Tick data: 7 days retention
- OHLC data: 30 days retention
- Instrument data: Updated daily
- Market status: 30 days retention

### Manual Cleanup
```javascript
// Remove old tick data (older than 7 days)
db.marketticks.deleteMany({
  timestamp: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
})
```

## 🚀 Production Deployment

### Recommended Setup
1. **Process Manager**: Use PM2 for process management
2. **Database**: MongoDB Atlas or dedicated MongoDB server
3. **Load Balancer**: Nginx for WebSocket and API load balancing
4. **Monitoring**: Implement logging and alerting
5. **Backup**: Regular database backups

### PM2 Configuration
```json
{
  "name": "tradingok-backend",
  "script": "server.js",
  "instances": 1,
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "PORT": 8080
  }
}
```

## 📞 Support

For issues or questions:
1. Check server logs for error details
2. Run the integration test script
3. Verify all prerequisites are met
4. Check network connectivity to Upstox
5. Ensure valid access token

## 🎯 Next Steps

1. **Frontend Integration**: Update React components to consume real-time data
2. **Advanced Analytics**: Implement IV calculations and options Greeks
3. **Alert System**: Add price and volume-based alerts
4. **Performance Optimization**: Implement caching and data compression
5. **Security Enhancement**: Add authentication and rate limiting
