const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  }
});

const wsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 connections per minute
  message: 'Too many WebSocket connections'
});

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('📊 Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Import routes
const marketRoutes = require('./routes/market');
const optionsRoutes = require('./routes/options');
const oiRoutes = require('./routes/openInterest');
const futuresRoutes = require('./routes/futures');
const positionsRoutes = require('./routes/positions');
const historicalRoutes = require('./routes/historical');
const chartsRoutes = require('./routes/charts');
const configRoutes = require('./routes/config');
const marketDataRoutes = require('./routes/marketData');

// Use routes
app.use('/api/market', marketRoutes);
app.use('/api/options', optionsRoutes);
app.use('/api/oi', oiRoutes);
app.use('/api/futures', futuresRoutes);
app.use('/api/positions', positionsRoutes);
app.use('/api/historical', historicalRoutes);
app.use('/api/charts', chartsRoutes);
app.use('/api/config', configRoutes);
app.use('/api/marketdata', marketDataRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        stockBroker: stockBrokerService ? 
          (stockBrokerService.isConnected ? 'connected' : 'disconnected') : 'not_initialized'
      }
    };

    // Add stock broker statistics if available
    if (stockBrokerService && stockBrokerService.stats) {
      healthData.stockBrokerStats = {
        messagesReceived: stockBrokerService.stats.messagesReceived,
        ticksProcessed: stockBrokerService.stats.ticksProcessed,
        errorCount: stockBrokerService.stats.errorCount,
        lastMessageTime: stockBrokerService.stats.lastMessageTime,
        uptime: new Date() - stockBrokerService.stats.startTime
      };
    }    res.json(healthData);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Stock broker service status endpoint
app.get('/api/broker-status', (req, res) => {
  if (!stockBrokerService) {
    return res.json({
      status: 'not_initialized',
      message: 'Stock broker service not initialized'
    });
  }

  res.json({
    status: stockBrokerService.isConnected ? 'connected' : 'disconnected',
    stats: stockBrokerService.stats,
    connectionInfo: {
      reconnectAttempts: stockBrokerService.reconnectAttempts,
      maxReconnectAttempts: stockBrokerService.maxReconnectAttempts,
      subscriptionCount: stockBrokerService.subscriptionList.length
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Store active WebSocket connections
const activeConnections = new Map();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id} at ${new Date().toISOString()}`);
  
  // Store connection info
  activeConnections.set(socket.id, {
    connectedAt: new Date(),
    subscriptions: new Set()
  });

  // Subscribe to market data streams
  socket.on('subscribe:market', (data) => {
    const { symbols = [], intervals = [] } = data || {};
    console.log(`${socket.id} subscribing to market data:`, { symbols, intervals });
    
    symbols.forEach(symbol => {
      const room = `market:${symbol}`;
      socket.join(room);
      activeConnections.get(socket.id)?.subscriptions.add(room);
    });
    
    socket.emit('subscription:confirmed', { type: 'market', symbols, intervals });
  });

  // Subscribe to options streams
  socket.on('subscribe:options', (data) => {
    const { symbol, strikes = [], expiry, type = 'all' } = data || {};
    console.log(`${socket.id} subscribing to options:`, { symbol, strikes, expiry, type });
    
    if (symbol) {
      const room = `options:${symbol}`;
      socket.join(room);
      activeConnections.get(socket.id)?.subscriptions.add(room);
      
      if (expiry) {
        const expiryRoom = `options:${symbol}:${expiry}`;
        socket.join(expiryRoom);
        activeConnections.get(socket.id)?.subscriptions.add(expiryRoom);
      }
    }
    
    socket.emit('subscription:confirmed', { type: 'options', symbol, strikes, expiry });
  });

  // Subscribe to OI analysis streams
  socket.on('subscribe:oi', (data) => {
    const { symbol, interval = '15Min', range = 'Auto' } = data || {};
    console.log(`${socket.id} subscribing to OI:`, { symbol, interval, range });
    
    if (symbol) {
      const room = `oi:${symbol}`;
      socket.join(room);
      activeConnections.get(socket.id)?.subscriptions.add(room);
      
      const intervalRoom = `oi:${symbol}:${interval}`;
      socket.join(intervalRoom);
      activeConnections.get(socket.id)?.subscriptions.add(intervalRoom);
    }
    
    socket.emit('subscription:confirmed', { type: 'oi', symbol, interval, range });
  });

  // Subscribe to chart data streams
  socket.on('subscribe:charts', (data) => {
    const { symbol, chartType, strikes = [], timeframe = '5Min' } = data || {};
    console.log(`${socket.id} subscribing to charts:`, { symbol, chartType, strikes, timeframe });
    
    if (symbol && chartType) {
      const room = `chart:${chartType}:${symbol}`;
      socket.join(room);
      activeConnections.get(socket.id)?.subscriptions.add(room);
    }
    
    socket.emit('subscription:confirmed', { type: 'charts', symbol, chartType, strikes, timeframe });
  });

  // Subscribe to futures data
  socket.on('subscribe:futures', (data) => {
    const { symbol, type = 'all' } = data || {};
    console.log(`${socket.id} subscribing to futures:`, { symbol, type });
    
    if (symbol) {
      const room = `futures:${symbol}`;
      socket.join(room);
      activeConnections.get(socket.id)?.subscriptions.add(room);
    }
    
    socket.emit('subscription:confirmed', { type: 'futures', symbol });
  });

  // Handle unsubscribe requests
  socket.on('unsubscribe', (data) => {
    const { type, symbol } = data || {};
    const room = `${type}:${symbol}`;
    socket.leave(room);
    activeConnections.get(socket.id)?.subscriptions.delete(room);
    console.log(`${socket.id} unsubscribed from ${room}`);
  });

  // Handle client disconnect
  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    activeConnections.delete(socket.id);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Initialize Stock Broker WebSocket Service
let stockBrokerService = null;

// Function to initialize and start the stock broker service
async function initializeStockBrokerService() {
  try {
    console.log('🔄 Initializing Stock Broker WebSocket Service...');
    
    // Import services
    const InstrumentManager = require('./services/InstrumentManager');
    const StockBrokerWebSocket = require('./services/StockBrokerWebSocket');
    
    // Initialize instrument manager
    const instrumentManager = new InstrumentManager(process.env.UPSTOX_ACCESS_TOKEN);
      // Initialize stock broker WebSocket service with the instrument manager and Socket.IO server
    stockBrokerService = new StockBrokerWebSocket(instrumentManager, io);
    
    // Start the service
    await stockBrokerService.initialize();
    console.log('🚀 Stock Broker WebSocket Service started successfully');
    
    return stockBrokerService;
  } catch (error) {
    console.error('❌ Failed to initialize Stock Broker Service:', error);
    throw error;
  }
}

// Start real-time data service
// const dataSimulator = require('./services/dataSimulator');
// dataSimulator(io);

// Initialize stock broker service after server starts
setTimeout(async () => {
  try {
    await initializeStockBrokerService();
  } catch (error) {
    console.error('❌ Stock Broker Service initialization failed:', error);
    // Optionally implement retry logic here
  }
}, 2000); // Wait 2 seconds for server to fully start

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);
  
  try {    // Close stock broker WebSocket service
    if (stockBrokerService) {
      console.log('🔄 Closing Stock Broker WebSocket Service...');
      await stockBrokerService.shutdown();
      console.log('✅ Stock Broker WebSocket Service closed');
    }
    
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      console.log('🔄 Closing MongoDB connection...');
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    }
    
    // Close server
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
    
    // Force exit after 30 seconds
    setTimeout(() => {
      console.log('⚠️ Forcing exit after timeout');
      process.exit(1);
    }, 30000);
    
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 TradingOK Backend Server running on port ${PORT}`);
  console.log(`📊 WebSocket server ready for real-time data streaming`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
  console.log(`❤️ Health check: http://localhost:${PORT}/api/health`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});

module.exports = { app, server, io };