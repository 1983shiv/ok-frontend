# Trading Analytics Backend

A comprehensive Express.js backend server for the options trading analytics platform with real-time data streaming via WebSocket.

## 🚀 Features

- **REST API**: 34+ endpoints across 8 categories
- **WebSocket Streaming**: Real-time market data updates
- **Data Generation**: Sophisticated mock data for testing
- **Caching**: Redis-like caching with NodeCache
- **Validation**: Request validation with express-validator
- **Rate Limiting**: Built-in rate limiting protection
- **CORS Support**: Configurable cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── start-server.bat       # Windows startup script
├── test-backend.js        # API testing suite
├── middleware/
│   ├── cache.js          # Caching middleware
│   └── validation.js     # Request validation
├── routes/
│   ├── market.js         # Market data endpoints
│   ├── options.js        # Options analysis endpoints
│   ├── openInterest.js   # OI analysis endpoints
│   ├── positions.js      # Portfolio management
│   ├── charts.js         # Chart data endpoints
│   ├── config.js         # Configuration endpoints
│   ├── historical.js     # Historical data endpoints
│   └── futures.js        # Futures analysis endpoints
└── services/
    ├── dataGenerator.js  # Mock data generation
    └── dataSimulator.js  # Real-time data simulation
```

## 🛠️ Installation

### Prerequisites
- Node.js 14+ and npm
- Git (optional)

### Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Server (Windows)**
   ```bash
   start-server.bat
   ```

3. **Start Server (Manual)**
   ```bash
   node server.js
   ```

4. **Test API**
   ```bash
   node test-backend.js
   ```

## 📊 API Endpoints

### Market Data
- `GET /api/market/status` - Market status and hours
- `GET /api/market/symbols` - Available symbols
- `GET /api/market/expiries` - Available expiries
- `GET /api/market/strikes` - Available strikes
- `GET /api/market/futures` - Futures data

### Options Analysis
- `GET /api/options/chain` - Complete options chain
- `GET /api/options/iv` - Implied volatility analysis
- `GET /api/options/premium-decay` - Premium decay analysis
- `GET /api/options/straddle` - Straddle analysis
- `GET /api/options/multi-strike` - Multi-strike analysis

### Open Interest
- `GET /api/open-interest/coi` - Change in OI analysis
- `GET /api/open-interest/pcr` - Put-Call ratio analysis
- `GET /api/open-interest/gainer-looser` - OI gainer/looser
- `GET /api/open-interest/price-vs-oi` - Price vs OI analysis

### Positions
- `GET /api/positions` - Portfolio positions
- `GET /api/positions/summary/expiry` - Summary by expiry
- `GET /api/positions/greeks` - Greeks breakdown
- `GET /api/positions/pnl` - P&L analysis

### Charts
- `GET /api/charts/oi-data` - OI chart data
- `GET /api/charts/price-vs-oi` - Price vs OI charts
- `GET /api/charts/premium-decay` - Premium decay charts
- `GET /api/charts/iv-surface` - IV surface data

### Historical Data
- `GET /api/historical/oi` - Historical OI data
- `GET /api/historical/premium` - Historical premium data
- `GET /api/historical/pcr` - Historical PCR data
- `GET /api/historical/iv` - Historical IV data

### Futures
- `GET /api/futures/oi-analysis` - Futures OI analysis
- `GET /api/futures/price-vs-oi` - Futures price vs OI
- `GET /api/futures/rollover` - Rollover analysis
- `GET /api/futures/term-structure` - Term structure

### Configuration
- `GET /api/config/settings` - App settings
- `GET /api/config/symbols` - Symbol configuration
- `PUT /api/config/settings` - Update settings

## 🔌 WebSocket Events

### Real-time Data Streams
- `price_update` - Live price updates (1s interval)
- `oi_update` - Open interest changes (5s interval)
- `iv_update` - IV changes (10s interval)
- `pcr_update` - PCR updates (15s interval)
- `market_status` - Market status changes
- `coi_update` - Change in OI updates
- `premium_decay` - Premium decay updates
- `futures_update` - Futures data updates

### Client Events
- `subscribe` - Subscribe to specific data streams
- `unsubscribe` - Unsubscribe from data streams
- `get_snapshot` - Get current data snapshot

## 🎯 Query Parameters

Most endpoints support filtering and pagination:

```javascript
// Common parameters
?symbol=NIFTY          // Symbol filter
&expiry=2024-01-25     // Expiry filter
&limit=100             // Limit results
&offset=0              // Pagination offset
&days=30               // Historical days
&interval=1d           // Data interval

// Options specific
&optionType=CE         // CE/PE filter
&strike=21000          // Strike filter
&minOI=1000           // Minimum OI filter

// Futures specific
&contractType=current  // current/next/far
&priceRange=5          // Price range filter
```

## 📈 Sample Data

The backend generates comprehensive sample data including:

- **30+ days** of historical data
- **4 indices**: NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY
- **Complete options chains** with realistic pricing
- **Greeks calculations** (Delta, Gamma, Theta, Vega)
- **OI patterns** with realistic market behavior
- **IV surfaces** with term structure
- **Futures data** with rollover patterns

## 🔧 Configuration

Server configuration in `server.js`:

```javascript
const config = {
  port: 5000,
  corsOrigin: 'http://localhost:3000',
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 1000, // requests per window
  cacheDefaultTTL: 60, // seconds
  websocketUpdateIntervals: {
    price: 1000,      // 1 second
    oi: 5000,         // 5 seconds
    iv: 10000,        // 10 seconds
    pcr: 15000        // 15 seconds
  }
};
```

## 🧪 Testing

Run the test suite to verify all endpoints:

```bash
node test-backend.js
```

Expected output:
```
✅ Market Status: PASSED
✅ Symbols List: PASSED
✅ Options Chain: PASSED
✅ COI Analysis: PASSED
✅ Positions: PASSED
```

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://yourdomain.com
   REDIS_URL=redis://localhost:6379
   ```

2. **Process Management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "trading-backend"
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
       }
   }
   ```

## 📝 API Response Format

All API responses follow this structure:

```javascript
{
  "success": true,
  "data": {
    // Response data
  },
  "timestamp": "2024-01-25T10:30:00.000Z",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 50
  }
}
```

Error responses:
```javascript
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description",
  "timestamp": "2024-01-25T10:30:00.000Z"
}
```

## 🎛️ Monitoring

The server provides built-in monitoring endpoints:

- `GET /api/health` - Health check
- `GET /api/metrics` - Server metrics
- `GET /api/cache/stats` - Cache statistics

## 🔒 Security Features

- Rate limiting per IP
- Input validation and sanitization
- CORS configuration
- Request size limits
- Error handling without stack traces

## 📞 Support

For issues or questions:
1. Check the test suite output
2. Verify Node.js version compatibility
3. Ensure all dependencies are installed
4. Check server logs for errors

## 🔄 Updates

To update the backend:
1. Pull latest changes
2. Run `npm install` for new dependencies
3. Restart the server
4. Run tests to verify functionality
