const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../middleware/cache');
const { 
  VALID_SYMBOLS,
  VALID_INTERVALS,
  VALID_RANGES,
  VALID_PERIODS,
  VALID_CHART_TYPES
} = require('../middleware/validation');

/**
 * GET /api/config/intervals
 * Get available time intervals
 */
router.get('/intervals', cacheMiddleware(3600), (req, res) => {
  try {
    const intervals = VALID_INTERVALS.map(interval => ({
      value: interval,
      label: interval,
      seconds: getIntervalInSeconds(interval),
      description: getIntervalDescription(interval)
    }));

    res.json({
      intervals,
      default: '15 Min',
      total: intervals.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Intervals error:', error);
    res.status(500).json({ error: 'Failed to get intervals' });
  }
});

/**
 * GET /api/config/ranges
 * Get available OI ranges
 */
router.get('/ranges', cacheMiddleware(3600), (req, res) => {
  try {
    const ranges = VALID_RANGES.map(range => ({
      value: range,
      label: range,
      description: getRangeDescription(range),
      type: getRangeType(range)
    }));

    res.json({
      ranges,
      default: 'Auto',
      total: ranges.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ranges error:', error);
    res.status(500).json({ error: 'Failed to get ranges' });
  }
});

/**
 * GET /api/config/symbols
 * Get available symbols with detailed info
 */
router.get('/symbols', cacheMiddleware(3600), (req, res) => {
  try {
    const symbols = VALID_SYMBOLS.map(symbol => ({
      symbol,
      name: getSymbolFullName(symbol),
      description: getSymbolDescription(symbol),
      sector: getSymbolSector(symbol),
      lotSize: getLotSize(symbol),
      tickSize: getTickSize(symbol),
      marginRequired: getMarginRequired(symbol),
      tradingHours: {
        start: '09:15',
        end: '15:30',
        timezone: 'IST'
      },
      isActive: true
    }));

    res.json({
      symbols,
      total: symbols.length,
      activeSymbols: symbols.filter(s => s.isActive).length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Symbols config error:', error);
    res.status(500).json({ error: 'Failed to get symbols config' });
  }
});

/**
 * GET /api/config/periods
 * Get available historical periods
 */
router.get('/periods', cacheMiddleware(3600), (req, res) => {
  try {
    const periods = VALID_PERIODS.map(period => ({
      value: period,
      label: getPeriodLabel(period),
      days: getPeriodInDays(period),
      description: getPeriodDescription(period)
    }));

    res.json({
      periods,
      default: '1d',
      total: periods.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Periods error:', error);
    res.status(500).json({ error: 'Failed to get periods' });
  }
});

/**
 * GET /api/config/chart-types
 * Get available chart types
 */
router.get('/chart-types', cacheMiddleware(3600), (req, res) => {
  try {
    const chartTypes = VALID_CHART_TYPES.map(type => ({
      value: type,
      label: getChartTypeLabel(type),
      description: getChartTypeDescription(type),
      category: getChartTypeCategory(type),
      dataRequired: getChartDataRequirements(type)
    }));

    res.json({
      chartTypes,
      categories: getChartCategories(),
      total: chartTypes.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chart types error:', error);
    res.status(500).json({ error: 'Failed to get chart types' });
  }
});

/**
 * GET /api/config/filters
 * Get available filter options
 */
router.get('/filters', cacheMiddleware(3600), (req, res) => {
  try {
    const filters = {
      symbols: VALID_SYMBOLS,
      intervals: VALID_INTERVALS,
      ranges: VALID_RANGES,
      periods: VALID_PERIODS,
      optionTypes: ['CE', 'PE', 'CALL', 'PUT'],
      sentiments: ['Bullish', 'Bearish', 'Neutral'],
      buildupTypes: ['Long Buildup', 'Short Buildup', 'Long Unwinding', 'Short Covering'],
      sortOptions: [
        { value: 'strike', label: 'Strike Price' },
        { value: 'oi', label: 'Open Interest' },
        { value: 'volume', label: 'Volume' },
        { value: 'premium', label: 'Premium' },
        { value: 'iv', label: 'Implied Volatility' },
        { value: 'change', label: 'Change %' }
      ],
      orderOptions: [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' }
      ]
    };

    res.json({
      filters,
      defaults: {
        symbol: 'NIFTY',
        interval: '15 Min',
        range: 'Auto',
        period: '1d',
        sortBy: 'oi',
        order: 'desc'
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({ error: 'Failed to get filters' });
  }
});

/**
 * GET /api/config/application
 * Get application configuration
 */
router.get('/application', cacheMiddleware(3600), (req, res) => {
  try {
    const config = {
      app: {
        name: 'TradingOK',
        version: '1.0.0',
        description: 'Advanced Options Trading Analytics Platform',
        author: 'TradingOK Team'
      },
      features: {
        realTimeData: true,
        historicalAnalysis: true,
        optionsChain: true,
        technicalIndicators: true,
        riskAnalysis: true,
        portfolioTracking: false, // Future feature
        alertSystem: true,
        multipleSymbols: true,
        exportData: true
      },
      dataRefreshRates: {
        prices: 1000,          // 1 second
        volume: 2000,          // 2 seconds
        openInterest: 5000,    // 5 seconds
        impliedVolatility: 10000, // 10 seconds
        charts: 5000           // 5 seconds
      },
      limits: {
        maxSymbolsPerRequest: 10,
        maxStrikesPerChain: 50,
        maxHistoricalDays: 365,
        rateLimitPerMinute: 1000,
        maxWebSocketConnections: 100
      },
      api: {
        version: 'v1',
        baseUrl: '/api',
        wsUrl: '/ws',
        timeout: 30000,
        retryAttempts: 3
      }
    };

    res.json({
      config,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Application config error:', error);
    res.status(500).json({ error: 'Failed to get application config' });
  }
});

// Helper functions
function getIntervalInSeconds(interval) {
  const map = {
    '1 Min': 60,
    '3 Min': 180,
    '5 Min': 300,
    '15 Min': 900,
    '30 Min': 1800,
    '1 Hour': 3600
  };
  return map[interval] || 900;
}

function getIntervalDescription(interval) {
  const descriptions = {
    '1 Min': 'High frequency updates, suitable for scalping',
    '3 Min': 'Medium frequency updates, good for short-term analysis',
    '5 Min': 'Standard frequency for intraday trading',
    '15 Min': 'Most popular interval for options analysis',
    '30 Min': 'Lower frequency, good for trend analysis',
    '1 Hour': 'Hourly updates, suitable for position trading'
  };
  return descriptions[interval] || 'Standard interval';
}

function getRangeDescription(range) {
  const descriptions = {
    'Auto': 'Automatically selects optimal range based on current market conditions',
    'ITM 10': 'Shows strikes that are In-The-Money by up to 10 strikes',
    'ITM 5': 'Shows strikes that are In-The-Money by up to 5 strikes',
    'ATM ±5': 'Shows At-The-Money strikes with ±5 strikes around current price',
    'ATM ±10': 'Shows At-The-Money strikes with ±10 strikes around current price',
    'OTM 5': 'Shows strikes that are Out-of-The-Money by up to 5 strikes',
    'OTM 10': 'Shows strikes that are Out-of-The-Money by up to 10 strikes'
  };
  return descriptions[range] || 'Custom range selection';
}

function getRangeType(range) {
  if (range === 'Auto') return 'automatic';
  if (range.includes('ITM')) return 'in-the-money';
  if (range.includes('ATM')) return 'at-the-money';
  if (range.includes('OTM')) return 'out-of-the-money';
  return 'custom';
}

function getSymbolFullName(symbol) {
  const names = {
    NIFTY: 'NIFTY 50',
    BANKNIFTY: 'NIFTY BANK',
    FINNIFTY: 'NIFTY FINANCIAL SERVICES',
    MIDCPNIFTY: 'NIFTY MIDCAP SELECT'
  };
  return names[symbol] || symbol;
}

function getSymbolDescription(symbol) {
  const descriptions = {
    NIFTY: 'India\'s benchmark equity index representing top 50 companies',
    BANKNIFTY: 'Banking sector index comprising major banking stocks',
    FINNIFTY: 'Financial services sector index including banks, NBFCs, and insurance',
    MIDCPNIFTY: 'Mid-cap index representing mid-sized companies'
  };
  return descriptions[symbol] || 'Index representing various sectors';
}

function getSymbolSector(symbol) {
  const sectors = {
    NIFTY: 'Broad Market',
    BANKNIFTY: 'Banking',
    FINNIFTY: 'Financial Services',
    MIDCPNIFTY: 'Mid Cap'
  };
  return sectors[symbol] || 'Mixed';
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

function getTickSize(symbol) {
  // All indices have tick size of 0.05
  return 0.05;
}

function getMarginRequired(symbol) {
  const margins = {
    NIFTY: 120000,
    BANKNIFTY: 135000,
    FINNIFTY: 95000,
    MIDCPNIFTY: 85000
  };
  return margins[symbol] || 100000;
}

function getPeriodLabel(period) {
  const labels = {
    '1d': '1 Day',
    '1w': '1 Week',
    '1m': '1 Month',
    '3m': '3 Months',
    '6m': '6 Months',
    '1y': '1 Year'
  };
  return labels[period] || period;
}

function getPeriodInDays(period) {
  const days = {
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365
  };
  return days[period] || 1;
}

function getPeriodDescription(period) {
  const descriptions = {
    '1d': 'Single day analysis for intraday patterns',
    '1w': 'Weekly view for short-term trends',
    '1m': 'Monthly analysis for medium-term patterns',
    '3m': 'Quarterly view for seasonal trends',
    '6m': 'Half-yearly analysis for longer trends',
    '1y': 'Annual view for complete market cycles'
  };
  return descriptions[period] || 'Historical period analysis';
}

function getChartTypeLabel(type) {
  const labels = {
    'oi': 'Open Interest',
    'price-oi': 'Price vs Open Interest',
    'straddle': 'Straddle Analysis',
    'premium-decay': 'Premium Decay',
    'iv': 'Implied Volatility',
    'pcr': 'Put Call Ratio'
  };
  return labels[type] || type;
}

function getChartTypeDescription(type) {
  const descriptions = {
    'oi': 'Visualize open interest distribution across strikes',
    'price-oi': 'Correlation between underlying price and open interest',
    'straddle': 'Straddle profit/loss analysis with breakeven points',
    'premium-decay': 'Time decay analysis for option premiums',
    'iv': 'Implied volatility analysis across strikes and time',
    'pcr': 'Put-Call ratio trends and market sentiment'
  };
  return descriptions[type] || 'Chart analysis visualization';
}

function getChartTypeCategory(type) {
  const categories = {
    'oi': 'Open Interest',
    'price-oi': 'Correlation',
    'straddle': 'Strategy',
    'premium-decay': 'Greeks',
    'iv': 'Volatility',
    'pcr': 'Sentiment'
  };
  return categories[type] || 'Analysis';
}

function getChartDataRequirements(type) {
  const requirements = {
    'oi': ['openInterest', 'strikes', 'optionType'],
    'price-oi': ['price', 'openInterest', 'timestamp'],
    'straddle': ['callPremium', 'putPremium', 'strikes'],
    'premium-decay': ['premium', 'timeToExpiry', 'theta'],
    'iv': ['impliedVolatility', 'strikes', 'optionType'],
    'pcr': ['putOI', 'callOI', 'timestamp']
  };
  return requirements[type] || ['basic'];
}

function getChartCategories() {
  return [
    { name: 'Open Interest', types: ['oi'] },
    { name: 'Correlation', types: ['price-oi'] },
    { name: 'Strategy', types: ['straddle'] },
    { name: 'Greeks', types: ['premium-decay'] },
    { name: 'Volatility', types: ['iv'] },
    { name: 'Sentiment', types: ['pcr'] }
  ];
}

module.exports = router;
