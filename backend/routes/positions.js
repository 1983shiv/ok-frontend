const express = require('express');
const router = express.Router();
const { handleValidationErrors, sanitizeQuery } = require('../middleware/validation');
const { cacheMiddleware } = require('../middleware/cache');
const DataGenerator = require('../services/dataGenerator');

// Initialize data generator
const dataGenerator = new DataGenerator();

// Simple validation function for positions
const validatePositionsQuery = (req, res, next) => {
  const { symbol, expiry, side, optionType } = req.query;
  const validSymbols = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'];
  const validSides = ['BUY', 'SELL'];
  const validOptionTypes = ['CE', 'PE'];
  
  if (symbol && !validSymbols.includes(symbol)) {
    return res.status(400).json({
      error: 'Invalid symbol',
      message: `Symbol must be one of: ${validSymbols.join(', ')}`
    });
  }
  
  if (side && !validSides.includes(side)) {
    return res.status(400).json({
      error: 'Invalid side',
      message: `Side must be one of: ${validSides.join(', ')}`
    });
  }
  
  if (optionType && !validOptionTypes.includes(optionType)) {
    return res.status(400).json({
      error: 'Invalid option type',
      message: `Option type must be one of: ${validOptionTypes.join(', ')}`
    });
  }
  
  next();
};

// Generate positions data
const generatePositionsData = (symbol, expiry) => {
  const positions = [];
  const strikes = dataGenerator.generateStrikes(symbol, dataGenerator.basePrices[symbol], 10);
  const currentPrice = dataGenerator.basePrices[symbol];
  
  // Generate random positions for demo
  for (let i = 0; i < Math.floor(Math.random() * 15) + 5; i++) {
    const strike = strikes[Math.floor(Math.random() * strikes.length)];
    const optionType = Math.random() > 0.5 ? 'CE' : 'PE';
    const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const quantity = (Math.floor(Math.random() * 10) + 1) * 25; // Lot sizes
    
    // Calculate a simple option price based on intrinsic + time value
    const intrinsicValue = optionType === 'CE' ? 
      Math.max(0, currentPrice - strike) : 
      Math.max(0, strike - currentPrice);
    const timeValue = Math.random() * 50 + 10; // Random time value
    const ltp = intrinsicValue + timeValue;
    const avgPrice = ltp * (0.9 + Math.random() * 0.2); // Random avg price around LTP
    const pnl = side === 'BUY' ? (ltp - avgPrice) * quantity : (avgPrice - ltp) * quantity;
    
    positions.push({
      id: `pos_${i + 1}`,
      symbol,
      expiry,
      strike,
      optionType,
      side,
      quantity,
      avgPrice: Math.round(avgPrice * 100) / 100,
      ltp: Math.round(ltp * 100) / 100,
      pnl: Math.round(pnl * 100) / 100,
      pnlPercent: Math.round((pnl / (avgPrice * quantity)) * 10000) / 100,
      iv: Math.random() * 40 + 10, // 10-50% IV
      delta: optionType === 'CE' ? Math.random() * 0.8 + 0.1 : -(Math.random() * 0.8 + 0.1),
      gamma: Math.random() * 0.01,
      theta: -(Math.random() * 5 + 1),
      vega: Math.random() * 10 + 2,
      timestamp: new Date().toISOString()
    });
  }
  
  return positions;
};

// Get all positions
router.get('/',
  cacheMiddleware(30), // Cache for 30 seconds
  validatePositionsQuery,
  (req, res) => {
    try {
      const { symbol = 'NIFTY', expiry, side, optionType } = req.query;
      const targetExpiry = expiry || dataGenerator.getNearestExpiry();
      
      let positions = generatePositionsData(symbol, targetExpiry);
      
      // Apply filters
      if (side) {
        positions = positions.filter(pos => pos.side === side);
      }
      
      if (optionType) {
        positions = positions.filter(pos => pos.optionType === optionType);
      }
      
      // Calculate portfolio summary
      const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
      const totalInvestment = positions.reduce((sum, pos) => sum + (pos.avgPrice * pos.quantity), 0);
      const totalCurrentValue = positions.reduce((sum, pos) => sum + (pos.ltp * pos.quantity), 0);
      
      const summary = {
        totalPositions: positions.length,
        totalPnl: Math.round(totalPnl * 100) / 100,
        totalPnlPercent: totalInvestment > 0 ? Math.round((totalPnl / totalInvestment) * 10000) / 100 : 0,
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        totalCurrentValue: Math.round(totalCurrentValue * 100) / 100,
        netDelta: Math.round(positions.reduce((sum, pos) => sum + (pos.delta * pos.quantity), 0) * 100) / 100,
        netGamma: Math.round(positions.reduce((sum, pos) => sum + (pos.gamma * pos.quantity), 0) * 100) / 100,
        netTheta: Math.round(positions.reduce((sum, pos) => sum + (pos.theta * pos.quantity), 0) * 100) / 100,
        netVega: Math.round(positions.reduce((sum, pos) => sum + (pos.vega * pos.quantity), 0) * 100) / 100
      };
      
      res.json({
        success: true,
        data: {
          positions,
          summary,
          filters: { symbol, expiry: targetExpiry, side, optionType }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch positions',
        message: error.message
      });
    }
  }
);

// Get position summary by expiry
router.get('/summary/expiry',
  cacheMiddleware(60),
  validatePositionsQuery,
  (req, res) => {
    try {
      const { symbol = 'NIFTY' } = req.query;
      const expiries = dataGenerator.getExpiries();
      
      const summaryByExpiry = expiries.map(expiry => {
        const positions = generatePositionsData(symbol, expiry);
        const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
        const totalInvestment = positions.reduce((sum, pos) => sum + (pos.avgPrice * pos.quantity), 0);
        
        return {
          expiry,
          positionCount: positions.length,
          totalPnl: Math.round(totalPnl * 100) / 100,
          totalPnlPercent: totalInvestment > 0 ? Math.round((totalPnl / totalInvestment) * 10000) / 100 : 0,
          totalInvestment: Math.round(totalInvestment * 100) / 100,
          cePositions: positions.filter(p => p.optionType === 'CE').length,
          pePositions: positions.filter(p => p.optionType === 'PE').length,
          buyPositions: positions.filter(p => p.side === 'BUY').length,
          sellPositions: positions.filter(p => p.side === 'SELL').length
        };
      });
      
      res.json({
        success: true,
        data: summaryByExpiry,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch position summary',
        message: error.message
      });
    }
  }
);

// Get position Greeks summary
router.get('/greeks',
  cacheMiddleware(30),
  validatePositionsQuery,
  (req, res) => {
    try {
      const { symbol = 'NIFTY', expiry } = req.query;
      const targetExpiry = expiry || dataGenerator.getNearestExpiry();
      
      const positions = generatePositionsData(symbol, targetExpiry);
      
      // Calculate Greeks breakdown
      const greeksBreakdown = {
        totalDelta: Math.round(positions.reduce((sum, pos) => sum + (pos.delta * pos.quantity), 0) * 100) / 100,
        totalGamma: Math.round(positions.reduce((sum, pos) => sum + (pos.gamma * pos.quantity), 0) * 100) / 100,
        totalTheta: Math.round(positions.reduce((sum, pos) => sum + (pos.theta * pos.quantity), 0) * 100) / 100,
        totalVega: Math.round(positions.reduce((sum, pos) => sum + (pos.vega * pos.quantity), 0) * 100) / 100,
        deltaBreakdown: {
          calls: Math.round(positions.filter(p => p.optionType === 'CE').reduce((sum, pos) => sum + (pos.delta * pos.quantity), 0) * 100) / 100,
          puts: Math.round(positions.filter(p => p.optionType === 'PE').reduce((sum, pos) => sum + (pos.delta * pos.quantity), 0) * 100) / 100
        },
        gammaBreakdown: {
          calls: Math.round(positions.filter(p => p.optionType === 'CE').reduce((sum, pos) => sum + (pos.gamma * pos.quantity), 0) * 100) / 100,
          puts: Math.round(positions.filter(p => p.optionType === 'PE').reduce((sum, pos) => sum + (pos.gamma * pos.quantity), 0) * 100) / 100
        }
      };
      
      res.json({
        success: true,
        data: greeksBreakdown,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch Greeks summary',
        message: error.message
      });
    }
  }
);

// Get position P&L breakdown
router.get('/pnl',
  cacheMiddleware(30),
  validatePositionsQuery,
  (req, res) => {
    try {
      const { symbol = 'NIFTY', expiry, groupBy = 'optionType' } = req.query;
      const targetExpiry = expiry || dataGenerator.getNearestExpiry();
      
      const positions = generatePositionsData(symbol, targetExpiry);
      
      let pnlBreakdown = {};
      
      positions.forEach(position => {
        let key;
        switch (groupBy) {
          case 'strike':
            key = position.strike.toString();
            break;
          case 'side':
            key = position.side;
            break;
          case 'optionType':
          default:
            key = position.optionType;
            break;
        }
        
        if (!pnlBreakdown[key]) {
          pnlBreakdown[key] = {
            totalPnl: 0,
            totalInvestment: 0,
            positionCount: 0,
            positions: []
          };
        }
        
        pnlBreakdown[key].totalPnl += position.pnl;
        pnlBreakdown[key].totalInvestment += position.avgPrice * position.quantity;
        pnlBreakdown[key].positionCount += 1;
        pnlBreakdown[key].positions.push(position);
      });
      
      // Calculate percentages
      Object.keys(pnlBreakdown).forEach(key => {
        const breakdown = pnlBreakdown[key];
        breakdown.totalPnl = Math.round(breakdown.totalPnl * 100) / 100;
        breakdown.totalInvestment = Math.round(breakdown.totalInvestment * 100) / 100;
        breakdown.pnlPercent = breakdown.totalInvestment > 0 
          ? Math.round((breakdown.totalPnl / breakdown.totalInvestment) * 10000) / 100 
          : 0;
      });
      
      res.json({
        success: true,
        data: {
          breakdown: pnlBreakdown,
          groupBy,
          summary: {
            totalPnl: Math.round(positions.reduce((sum, pos) => sum + pos.pnl, 0) * 100) / 100,
            totalInvestment: Math.round(positions.reduce((sum, pos) => sum + (pos.avgPrice * pos.quantity), 0) * 100) / 100
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch P&L breakdown',
        message: error.message
      });
    }
  }
);

module.exports = router;