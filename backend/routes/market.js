const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../middleware/cache');
const { 
  validateSymbol, 
  validateExpiry, 
  handleValidationErrors,
  sanitizeQuery,
  VALID_SYMBOLS,
  VALID_INTERVALS
} = require('../middleware/validation');
const DataGenerator = require('../services/dataGenerator');

// Initialize data generator
const dataGenerator = new DataGenerator();

/**
 * GET /api/market/status
 * Get current market status
 */
router.get('/status', cacheMiddleware(60), (req, res) => {
  try {
    const now = new Date();
    const startTime = new Date();
    startTime.setHours(9, 15, 0, 0);
    const endTime = new Date();
    endTime.setHours(15, 30, 0, 0);
    
    const isMarketOpen = now >= startTime && now <= endTime && now.getDay() >= 1 && now.getDay() <= 5;
    
    let session = 'CLOSED';
    if (isMarketOpen) {
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      if (hour === 9 && minute >= 15 && minute < 30) session = 'OPENING';
      else if (hour === 15 && minute >= 15) session = 'CLOSING';
      else session = 'REGULAR';
    } else if (now.getDay() >= 1 && now.getDay() <= 5) {
      if (now < startTime) session = 'PRE_MARKET';
      else session = 'POST_MARKET';
    }

    res.json({
      isOpen: isMarketOpen,
      session,
      currentTime: now.toISOString(),
      marketHours: {
        start: '09:15',
        end: '15:30',
        timezone: 'IST'
      },
      lastUpdated: now.toISOString()
    });
  } catch (error) {
    console.error('Market status error:', error);
    res.status(500).json({ error: 'Failed to get market status' });
  }
});

/**
 * GET /api/market/symbols
 * Get available symbols
 */
router.get('/symbols', cacheMiddleware(3600), (req, res) => {
  try {
    const symbols = VALID_SYMBOLS.map(symbol => ({
      symbol,
      name: getSymbolName(symbol),
      currentPrice: dataGenerator.basePrices[symbol],
      strikeInterval: dataGenerator.strikeIntervals[symbol],
      lotSize: getLotSize(symbol),
      expiries: dataGenerator.expiries
    }));

    res.json({
      symbols,
      total: symbols.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Symbols error:', error);
    res.status(500).json({ error: 'Failed to get symbols' });
  }
});

/**
 * GET /api/market/expiries/:symbol
 * Get available expiry dates for a symbol
 */
router.get('/expiries/:symbol', 
  validateSymbol,
  handleValidationErrors,
  cacheMiddleware(1800),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const expiries = dataGenerator.expiries.map(expiry => ({
        expiry,
        expiryDate: convertToISODate(expiry),
        daysToExpiry: getDaysToExpiry(expiry),
        isWeekly: true,
        isMonthly: false
      }));

      res.json({
        symbol,
        expiries,
        total: expiries.length,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Expiries error:', error);
      res.status(500).json({ error: 'Failed to get expiries' });
    }
  }
);

/**
 * GET /api/market/strikes/:symbol/:expiry
 * Get available strike prices for a symbol and expiry
 */
router.get('/strikes/:symbol/:expiry',
  validateSymbol,
  validateExpiry,
  handleValidationErrors,
  cacheMiddleware(900),
  (req, res) => {
    try {
      const { symbol, expiry } = req.params;
      const currentPrice = dataGenerator.basePrices[symbol];
      const strikes = dataGenerator.generateStrikes(symbol, currentPrice, 20);

      const strikeData = strikes.map(strike => ({
        strikePrice: strike,
        distanceFromATM: Math.abs(strike - currentPrice),
        isITM: strike < currentPrice,
        isOTM: strike > currentPrice,
        isATM: Math.abs(strike - currentPrice) < dataGenerator.strikeIntervals[symbol],
        type: strike < currentPrice ? 'ITM' : strike > currentPrice ? 'OTM' : 'ATM'
      }));

      res.json({
        symbol,
        expiry,
        currentPrice,
        strikes: strikeData,
        total: strikeData.length,
        strikeInterval: dataGenerator.strikeIntervals[symbol],
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Strikes error:', error);
      res.status(500).json({ error: 'Failed to get strikes' });
    }
  }
);

/**
 * GET /api/market/futures/:symbol
 * Get current futures price and basic data
 */
router.get('/futures/:symbol',
  validateSymbol,
  handleValidationErrors,
  cacheMiddleware(30),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const basePrice = dataGenerator.basePrices[symbol];
      const change = (Math.random() - 0.5) * basePrice * 0.02; // ±1% change
      const currentPrice = basePrice + change;
      
      const futuresData = {
        symbol,
        price: Math.round(currentPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round((change / basePrice) * 10000) / 100,
        high: Math.round((currentPrice + Math.abs(change) * 0.5) * 100) / 100,
        low: Math.round((currentPrice - Math.abs(change) * 0.5) * 100) / 100,
        open: Math.round(basePrice * 100) / 100,
        volume: Math.floor(Math.random() * 1000000 + 100000),
        openInterest: Math.floor(Math.random() * 5000000 + 1000000),
        lastUpdated: new Date().toISOString(),
        marketStatus: 'OPEN'
      };

      res.json(futuresData);
    } catch (error) {
      console.error('Futures error:', error);
      res.status(500).json({ error: 'Failed to get futures data' });
    }
  }
);

/**
 * GET /api/market/holidays
 * Get market holidays calendar
 */
router.get('/holidays', cacheMiddleware(86400), (req, res) => {
  try {
    const holidays = [
      { date: '2025-01-26', name: 'Republic Day', type: 'National Holiday' },
      { date: '2025-03-14', name: 'Holi', type: 'Festival' },
      { date: '2025-04-14', name: 'Ram Navami', type: 'Festival' },
      { date: '2025-04-18', name: 'Good Friday', type: 'Festival' },
      { date: '2025-05-01', name: 'Labour Day', type: 'National Holiday' },
      { date: '2025-08-15', name: 'Independence Day', type: 'National Holiday' },
      { date: '2025-10-02', name: 'Gandhi Jayanti', type: 'National Holiday' },
      { date: '2025-11-01', name: 'Diwali', type: 'Festival' },
      { date: '2025-12-25', name: 'Christmas Day', type: 'Festival' }
    ];

    const upcomingHolidays = holidays.filter(holiday => 
      new Date(holiday.date) > new Date()
    ).slice(0, 5);

    res.json({
      holidays,
      upcomingHolidays,
      total: holidays.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Holidays error:', error);
    res.status(500).json({ error: 'Failed to get holidays' });
  }
});

// Helper functions
function getSymbolName(symbol) {
  const names = {
    NIFTY: 'Nifty 50',
    BANKNIFTY: 'Bank Nifty',
    FINNIFTY: 'Fin Nifty',
    MIDCPNIFTY: 'Mid Cap Nifty'
  };
  return names[symbol] || symbol;
}

function getLotSize(symbol) {
  const lotSizes = {
    NIFTY: 50,
    BANKNIFTY: 15,
    FINNIFTY: 40,
    MIDCPNIFTY: 75
  };
  return lotSizes[symbol] || 50;
}

function convertToISODate(ddmmyyyy) {
  const [day, month, year] = ddmmyyyy.split('-');
  return `${year}-${month}-${day}`;
}

function getDaysToExpiry(expiry) {
  const expiryDate = new Date(convertToISODate(expiry));
  const today = new Date();
  const diffTime = expiryDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

module.exports = router;