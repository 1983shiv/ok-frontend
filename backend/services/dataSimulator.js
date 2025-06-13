const DataGenerator = require('./dataGenerator');
const moment = require('moment');
const { cacheWSData, getCachedWSData } = require('../middleware/cache');

/**
 * Real-time data simulator for WebSocket streaming
 * Simulates live market data updates with realistic patterns
 */
class DataSimulator {
  constructor(io) {
    this.io = io;
    this.dataGenerator = new DataGenerator();
    this.intervals = new Map();
    this.isRunning = false;
    
    // Generate initial dataset
    this.dataset = this.dataGenerator.generateCompleteDataset(30); // 30 days of data
    console.log(`📊 Generated dataset with ${this.dataset.metadata.coverage.totalRecords} records`);
    
    // Market simulation parameters
    this.simulationConfig = {
      priceUpdateInterval: 1000,      // 1 second
      oiUpdateInterval: 5000,         // 5 seconds
      ivUpdateInterval: 10000,        // 10 seconds
      pcrUpdateInterval: 15000,       // 15 seconds
      volumeUpdateInterval: 2000,     // 2 seconds
      marketStatusInterval: 60000     // 1 minute
    };
    
    this.marketStatus = {
      isOpen: this.isMarketOpen(),
      session: this.getCurrentSession(),
      lastUpdate: moment().toISOString()
    };
  }

  /**
   * Check if market is currently open
   */
  isMarketOpen() {
    const now = moment();
    const startTime = moment().set({ hour: 9, minute: 15, second: 0 });
    const endTime = moment().set({ hour: 15, minute: 30, second: 0 });
    
    return now.isBetween(startTime, endTime) && now.day() >= 1 && now.day() <= 5;
  }

  /**
   * Get current market session
   */
  getCurrentSession() {
    const now = moment();
    const hour = now.hour();
    const minute = now.minute();
    
    if (hour < 9 || (hour === 9 && minute < 15)) return 'PRE_MARKET';
    if (hour > 15 || (hour === 15 && minute > 30)) return 'POST_MARKET';
    if (hour === 9 && minute >= 15 && minute < 30) return 'OPENING';
    if (hour === 15 && minute >= 15) return 'CLOSING';
    return 'REGULAR';
  }

  /**
   * Start the data simulation
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️ Data simulator is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting real-time data simulation...');

    // Price updates (most frequent)
    this.intervals.set('prices', setInterval(() => {
      this.simulatePriceUpdates();
    }, this.simulationConfig.priceUpdateInterval));

    // Volume updates
    this.intervals.set('volume', setInterval(() => {
      this.simulateVolumeUpdates();
    }, this.simulationConfig.volumeUpdateInterval));

    // OI updates
    this.intervals.set('oi', setInterval(() => {
      this.simulateOIUpdates();
    }, this.simulationConfig.oiUpdateInterval));

    // IV updates
    this.intervals.set('iv', setInterval(() => {
      this.simulateIVUpdates();
    }, this.simulationConfig.ivUpdateInterval));

    // PCR updates
    this.intervals.set('pcr', setInterval(() => {
      this.simulatePCRUpdates();
    }, this.simulationConfig.pcrUpdateInterval));

    // Market status updates
    this.intervals.set('market', setInterval(() => {
      this.updateMarketStatus();
    }, this.simulationConfig.marketStatusInterval));

    console.log('✅ All simulation intervals started');
  }

  /**
   * Stop the data simulation
   */
  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Data simulator is not running');
      return;
    }

    this.isRunning = false;
    
    // Clear all intervals
    this.intervals.forEach((interval, name) => {
      clearInterval(interval);
      console.log(`🛑 Stopped ${name} simulation`);
    });
    
    this.intervals.clear();
    console.log('✅ Data simulation stopped');
  }

  /**
   * Simulate real-time price updates
   */
  simulatePriceUpdates() {
    if (!this.marketStatus.isOpen) return;

    this.dataGenerator.symbols.forEach(symbol => {
      const currentData = this.dataset.marketData[symbol];
      const currentPrice = currentData.currentPrice;
      
      // Generate realistic price movement
      const volatility = 0.001; // 0.1% volatility per second
      const randomChange = (Math.random() - 0.5) * 2 * volatility * currentPrice;
      const newPrice = Math.max(currentPrice + randomChange, currentPrice * 0.95);
      
      // Update current price
      this.dataset.marketData[symbol].currentPrice = Math.round(newPrice * 100) / 100;
      
      const priceUpdate = {
        symbol,
        price: this.dataset.marketData[symbol].currentPrice,
        change: newPrice - currentPrice,
        changePercent: ((newPrice - currentPrice) / currentPrice) * 100,
        timestamp: moment().toISOString(),
        volume: Math.floor(Math.random() * 1000 + 100),
        high: Math.max(currentPrice, newPrice),
        low: Math.min(currentPrice, newPrice)
      };
      
      // Emit to subscribed clients
      this.io.to(`market:${symbol}`).emit('price:update', priceUpdate);
      
      // Cache the update
      cacheWSData(`price:${symbol}`, priceUpdate, 60);
    });
  }

  /**
   * Simulate volume updates
   */
  simulateVolumeUpdates() {
    if (!this.marketStatus.isOpen) return;

    this.dataGenerator.symbols.forEach(symbol => {
      const volumeUpdate = {
        symbol,
        totalVolume: Math.floor(Math.random() * 500000 + 100000),
        callVolume: Math.floor(Math.random() * 250000 + 50000),
        putVolume: Math.floor(Math.random() * 250000 + 50000),
        timestamp: moment().toISOString(),
        sessionVolume: Math.floor(Math.random() * 2000000 + 500000)
      };
      
      this.io.to(`market:${symbol}`).emit('volume:update', volumeUpdate);
      cacheWSData(`volume:${symbol}`, volumeUpdate, 60);
    });
  }

  /**
   * Simulate OI updates
   */
  simulateOIUpdates() {
    this.dataGenerator.symbols.forEach(symbol => {
      const currentPrice = this.dataset.marketData[symbol].currentPrice;
      const strikes = this.dataGenerator.generateStrikes(symbol, currentPrice, 10);
      
      // Generate OI changes for multiple strikes
      const oiChanges = strikes.slice(0, 5).map(strike => {
        const callOIChange = Math.floor(Math.random() * 20000 - 10000);
        const putOIChange = Math.floor(Math.random() * 20000 - 10000);
        
        return {
          strikePrice: strike,
          call: {
            oiChange: callOIChange,
            oiChangePercent: (callOIChange / (Math.random() * 100000 + 50000)) * 100,
            newOI: Math.floor(Math.random() * 200000 + 50000)
          },
          put: {
            oiChange: putOIChange,
            oiChangePercent: (putOIChange / (Math.random() * 100000 + 50000)) * 100,
            newOI: Math.floor(Math.random() * 200000 + 50000)
          }
        };
      });

      const oiUpdate = {
        symbol,
        timestamp: moment().toISOString(),
        totalCallOI: oiChanges.reduce((sum, item) => sum + item.call.newOI, 0),
        totalPutOI: oiChanges.reduce((sum, item) => sum + item.put.newOI, 0),
        strikeWiseChanges: oiChanges,
        summary: {
          totalOIChange: Math.floor(Math.random() * 100000 - 50000),
          maxGainer: oiChanges.reduce((max, item) => 
            Math.max(max, item.call.oiChange, item.put.oiChange), 0),
          maxLooser: oiChanges.reduce((min, item) => 
            Math.min(min, item.call.oiChange, item.put.oiChange), 0)
        }
      };
      
      this.io.to(`oi:${symbol}`).emit('oi:update', oiUpdate);
      this.io.to(`oi:${symbol}:15Min`).emit('oi:15min:update', oiUpdate);
      
      cacheWSData(`oi:${symbol}`, oiUpdate, 300);
    });
  }

  /**
   * Simulate IV updates
   */
  simulateIVUpdates() {
    this.dataGenerator.symbols.forEach(symbol => {
      const currentPrice = this.dataset.marketData[symbol].currentPrice;
      const strikes = this.dataGenerator.generateStrikes(symbol, currentPrice, 8);
      
      const ivChanges = strikes.map(strike => {
        const distanceFromATM = Math.abs(strike - currentPrice);
        const baseIV = 15 + (distanceFromATM / currentPrice) * 30;
        const ivChange = (Math.random() - 0.5) * 2; // ±1% IV change
        
        return {
          strikePrice: strike,
          callIV: Math.round((baseIV + ivChange + Math.random()) * 100) / 100,
          putIV: Math.round((baseIV + ivChange + Math.random()) * 100) / 100,
          ivChange: Math.round(ivChange * 100) / 100
        };
      });

      const ivUpdate = {
        symbol,
        timestamp: moment().toISOString(),
        averageIV: Math.round((ivChanges.reduce((sum, item) => 
          sum + (item.callIV + item.putIV) / 2, 0) / ivChanges.length) * 100) / 100,
        strikeWiseIV: ivChanges,
        summary: {
          highestIV: Math.max(...ivChanges.map(item => Math.max(item.callIV, item.putIV))),
          lowestIV: Math.min(...ivChanges.map(item => Math.min(item.callIV, item.putIV))),
          ivRange: 0
        }
      };
      
      ivUpdate.summary.ivRange = ivUpdate.summary.highestIV - ivUpdate.summary.lowestIV;
      
      this.io.to(`options:${symbol}`).emit('iv:update', ivUpdate);
      cacheWSData(`iv:${symbol}`, ivUpdate, 600);
    });
  }

  /**
   * Simulate PCR updates
   */
  simulatePCRUpdates() {
    this.dataGenerator.symbols.forEach(symbol => {
      const currentPCR = 0.8 + Math.random() * 0.6;
      const pcrChange = (Math.random() - 0.5) * 0.1;
      
      const pcrUpdate = {
        symbol,
        timestamp: moment().toISOString(),
        currentPCR: Math.round(currentPCR * 1000) / 1000,
        pcrChange: Math.round(pcrChange * 1000) / 1000,
        sentiment: currentPCR > 1.1 ? 'Bearish' : currentPCR < 0.9 ? 'Bullish' : 'Neutral',
        callOI: Math.floor(Math.random() * 500000 + 200000),
        putOI: Math.floor(Math.random() * 500000 + 200000),
        callVolume: Math.floor(Math.random() * 200000 + 50000),
        putVolume: Math.floor(Math.random() * 200000 + 50000)
      };
      
      this.io.to(`oi:${symbol}`).emit('pcr:update', pcrUpdate);
      cacheWSData(`pcr:${symbol}`, pcrUpdate, 900);
    });
  }

  /**
   * Update market status
   */
  updateMarketStatus() {
    const wasOpen = this.marketStatus.isOpen;
    this.marketStatus.isOpen = this.isMarketOpen();
    this.marketStatus.session = this.getCurrentSession();
    this.marketStatus.lastUpdate = moment().toISOString();
    
    // If market status changed, notify all clients
    if (wasOpen !== this.marketStatus.isOpen) {
      console.log(`📊 Market status changed: ${this.marketStatus.isOpen ? 'OPENED' : 'CLOSED'}`);
      this.io.emit('market:status', this.marketStatus);
    }
    
    // Send periodic status updates
    this.io.emit('market:heartbeat', {
      ...this.marketStatus,
      activeConnections: this.io.engine.clientsCount,
      timestamp: moment().toISOString()
    });
  }

  /**
   * Get current dataset
   */
  getDataset() {
    return this.dataset;
  }

  /**
   * Update dataset with new data
   */
  updateDataset(newData) {
    this.dataset = { ...this.dataset, ...newData };
    console.log('📊 Dataset updated');
  }

  /**
   * Get simulation status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      marketStatus: this.marketStatus,
      activeIntervals: Array.from(this.intervals.keys()),
      config: this.simulationConfig,
      uptime: process.uptime(),
      timestamp: moment().toISOString()
    };
  }
}

/**
 * Initialize and start data simulator
 */
const initializeDataSimulator = (io) => {
  const simulator = new DataSimulator(io);
  
  // Start simulation
  simulator.start();
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📊 Stopping data simulator...');
    simulator.stop();
  });
  
  process.on('SIGINT', () => {
    console.log('📊 Stopping data simulator...');
    simulator.stop();
  });
  
  return simulator;
};

module.exports = initializeDataSimulator;