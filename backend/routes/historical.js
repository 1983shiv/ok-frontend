const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../middleware/cache');
const { 
  validateSymbol, 
  validateExpiry, 
  validatePeriod,
  validateInterval,
  validateDateRange,
  handleValidationErrors,
  sanitizeQuery
} = require('../middleware/validation');
const DataGenerator = require('../services/dataGenerator');
const moment = require('moment');

// Initialize data generator
const dataGenerator = new DataGenerator();

/**
 * GET /api/historical/oi/:symbol
 * Get historical OI data
 */
router.get('/oi/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  validatePeriod,
  validateInterval,
  validateDateRange,
  cacheMiddleware(1800),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { 
        period = '1d', 
        interval = '15 Min', 
        expiry,
        startDate,
        endDate,
        strikes 
      } = req.query;
      
      const currentPrice = dataGenerator.basePrices[symbol];
      const targetExpiry = expiry || dataGenerator.expiries[0];
      
      // Calculate date range
      let start, end;
      if (startDate && endDate) {
        start = moment(startDate);
        end = moment(endDate);
      } else {
        end = moment();
        start = moment().subtract(getPeriodDays(period), 'days');
      }
      
      const historicalData = {
        symbol,
        currentPrice,
        expiry: targetExpiry,
        period,
        interval,
        dateRange: {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD'),
          totalDays: end.diff(start, 'days')
        },
        timestamp: new Date().toISOString(),
        data: [],
        summary: {
          totalDataPoints: 0,
          avgCallOI: 0,
          avgPutOI: 0,
          maxCallOI: 0,
          maxPutOI: 0,
          oiTrend: 'Stable'
        }
      };

      // Generate historical data
      const targetStrikes = strikes ? strikes.split(',').map(Number) : 
        dataGenerator.generateStrikes(symbol, currentPrice, 8);
      
      const intervalMinutes = getIntervalMinutes(interval);
      let totalCallOI = 0;
      let totalPutOI = 0;
      let dataPoints = 0;
      let maxCallOI = 0;
      let maxPutOI = 0;
      
      // Generate data for each day in range
      for (let date = start.clone(); date.isSameOrBefore(end); date.add(1, 'day')) {
        if (date.day() === 0 || date.day() === 6) continue; // Skip weekends
        
        // Generate intraday data based on interval
        for (let hour = 9; hour <= 15; hour++) {
          for (let minute = 15; minute < 60; minute += intervalMinutes) {
            if (hour === 15 && minute > 30) break; // Market closes at 15:30
            
            const timestamp = date.clone().hour(hour).minute(minute).second(0);
            
            targetStrikes.forEach(strike => {
              const distanceFromATM = Math.abs(strike - currentPrice);
              
              // Simulate OI evolution over time
              const timeFactor = 1 - (timestamp.diff(start) / end.diff(start));
              const distanceFactor = Math.exp(-Math.pow(distanceFromATM / (currentPrice * 0.1), 2));
              
              const baseCallOI = 50000 + Math.random() * 100000;
              const basePutOI = 50000 + Math.random() * 100000;
              
              const callOI = Math.floor(baseCallOI * distanceFactor * (0.5 + timeFactor));
              const putOI = Math.floor(basePutOI * distanceFactor * (0.5 + timeFactor));
              
              const oiData = {
                timestamp: timestamp.unix() * 1000,
                date: timestamp.format('YYYY-MM-DD'),
                time: timestamp.format('HH:mm'),
                strikePrice: strike,
                callOI,
                putOI,
                totalOI: callOI + putOI,
                callVolume: Math.floor(Math.random() * 50000 + 5000),
                putVolume: Math.floor(Math.random() * 50000 + 5000),
                callOIChange: Math.floor((Math.random() - 0.5) * 20000),
                putOIChange: Math.floor((Math.random() - 0.5) * 20000),
                price: currentPrice + (Math.random() - 0.5) * currentPrice * 0.02
              };
              
              historicalData.data.push(oiData);
              
              totalCallOI += callOI;
              totalPutOI += putOI;
              dataPoints++;
              
              maxCallOI = Math.max(maxCallOI, callOI);
              maxPutOI = Math.max(maxPutOI, putOI);
            });
          }
        }
      }

      // Calculate summary statistics
      historicalData.summary.totalDataPoints = dataPoints;
      historicalData.summary.avgCallOI = Math.floor(totalCallOI / dataPoints);
      historicalData.summary.avgPutOI = Math.floor(totalPutOI / dataPoints);
      historicalData.summary.maxCallOI = maxCallOI;
      historicalData.summary.maxPutOI = maxPutOI;
      
      // Determine OI trend
      if (historicalData.data.length > 10) {
        const recentData = historicalData.data.slice(-5);
        const olderData = historicalData.data.slice(-10, -5);
        
        const recentAvgOI = recentData.reduce((sum, item) => sum + item.totalOI, 0) / recentData.length;
        const olderAvgOI = olderData.reduce((sum, item) => sum + item.totalOI, 0) / olderData.length;
        
        if (recentAvgOI > olderAvgOI * 1.1) {
          historicalData.summary.oiTrend = 'Increasing';
        } else if (recentAvgOI < olderAvgOI * 0.9) {
          historicalData.summary.oiTrend = 'Decreasing';
        }
      }

      res.json(historicalData);
    } catch (error) {
      console.error('Historical OI error:', error);
      res.status(500).json({ error: 'Failed to get historical OI data' });
    }
  }
);

/**
 * GET /api/historical/premium/:symbol
 * Get historical premium data
 */
router.get('/premium/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  validatePeriod,
  cacheMiddleware(1800),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '1d', expiry, strike } = req.query;
      
      const currentPrice = dataGenerator.basePrices[symbol];
      const targetExpiry = expiry || dataGenerator.expiries[0];
      const targetStrike = strike ? parseFloat(strike) : currentPrice;
      
      const end = moment();
      const start = moment().subtract(getPeriodDays(period), 'days');
      
      const historicalData = {
        symbol,
        currentPrice,
        targetStrike,
        expiry: targetExpiry,
        period,
        dateRange: {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD')
        },
        timestamp: new Date().toISOString(),
        data: [],
        analysis: {
          premiumDecay: 0,
          averagePremium: 0,
          volatility: 0,
          maxPremium: 0,
          minPremium: Infinity
        }
      };

      let totalPremium = 0;
      let dataPoints = 0;
      const premiumValues = [];
      
      // Generate historical premium data
      for (let date = start.clone(); date.isSameOrBefore(end); date.add(1, 'day')) {
        if (date.day() === 0 || date.day() === 6) continue; // Skip weekends
        
        const daysToExpiry = moment(targetExpiry, 'DD-MM-YYYY').diff(date, 'days');
        if (daysToExpiry < 0) continue; // Skip if past expiry
        
        // Generate intraday premium data
        for (let hour = 9; hour <= 15; hour++) {
          for (let minute = 15; minute < 60; minute += 15) {
            if (hour === 15 && minute > 30) break;
            
            const timestamp = date.clone().hour(hour).minute(minute);
            const priceVariation = (Math.random() - 0.5) * currentPrice * 0.02;
            const underlyingPrice = currentPrice + priceVariation;
            
            // Calculate option premium
            const intrinsicValue = Math.max(0, underlyingPrice - targetStrike);
            const timeValue = Math.max(0, 50 * Math.sqrt(daysToExpiry / 30) * 
              Math.exp(-Math.abs(targetStrike - underlyingPrice) / (underlyingPrice * 0.1)));
            
            const totalPremium = intrinsicValue + timeValue;
            const impliedVolatility = 15 + Math.random() * 10 + (Math.abs(targetStrike - underlyingPrice) / underlyingPrice) * 30;
            
            const premiumData = {
              timestamp: timestamp.unix() * 1000,
              date: timestamp.format('YYYY-MM-DD'),
              time: timestamp.format('HH:mm'),
              underlyingPrice: Math.round(underlyingPrice * 100) / 100,
              totalPremium: Math.round(totalPremium * 100) / 100,
              intrinsicValue: Math.round(intrinsicValue * 100) / 100,
              timeValue: Math.round(timeValue * 100) / 100,
              impliedVolatility: Math.round(impliedVolatility * 100) / 100,
              daysToExpiry,
              delta: intrinsicValue > 0 ? 0.5 + Math.random() * 0.3 : Math.random() * 0.5,
              theta: -(timeValue / Math.max(1, daysToExpiry)),
              gamma: Math.random() * 0.01,
              vega: Math.random() * 30 + 10
            };
            
            historicalData.data.push(premiumData);
            totalPremium += premiumData.totalPremium;
            premiumValues.push(premiumData.totalPremium);
            dataPoints++;
            
            historicalData.analysis.maxPremium = Math.max(historicalData.analysis.maxPremium, premiumData.totalPremium);
            historicalData.analysis.minPremium = Math.min(historicalData.analysis.minPremium, premiumData.totalPremium);
          }
        }
      }

      // Calculate analysis
      historicalData.analysis.averagePremium = Math.round((totalPremium / dataPoints) * 100) / 100;
      historicalData.analysis.volatility = calculateVolatility(premiumValues);
      
      // Calculate premium decay
      if (historicalData.data.length > 1) {
        const firstPremium = historicalData.data[0].totalPremium;
        const lastPremium = historicalData.data[historicalData.data.length - 1].totalPremium;
        historicalData.analysis.premiumDecay = Math.round(((firstPremium - lastPremium) / firstPremium) * 10000) / 100;
      }

      res.json(historicalData);
    } catch (error) {
      console.error('Historical premium error:', error);
      res.status(500).json({ error: 'Failed to get historical premium data' });
    }
  }
);

/**
 * GET /api/historical/pcr/:symbol
 * Get historical PCR data
 */
router.get('/pcr/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  validatePeriod,
  cacheMiddleware(1800),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '1w' } = req.query;
      
      const end = moment();
      const start = moment().subtract(getPeriodDays(period), 'days');
      
      const historicalData = {
        symbol,
        period,
        dateRange: {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD')
        },
        timestamp: new Date().toISOString(),
        data: [],
        statistics: {
          averagePCR: 0,
          highestPCR: 0,
          lowestPCR: Infinity,
          bullishDays: 0,
          bearishDays: 0,
          neutralDays: 0,
          volatility: 0
        }
      };

      let totalPCR = 0;
      let dataPoints = 0;
      const pcrValues = [];
      
      // Generate historical PCR data
      for (let date = start.clone(); date.isSameOrBefore(end); date.add(1, 'day')) {
        if (date.day() === 0 || date.day() === 6) continue; // Skip weekends
        
        // Generate intraday PCR data
        for (let hour = 9; hour <= 15; hour++) {
          for (let minute = 15; minute < 60; minute += 30) {
            if (hour === 15 && minute > 30) break;
            
            const timestamp = date.clone().hour(hour).minute(minute);
            
            // Generate realistic PCR values
            const basePCR = 0.9 + Math.sin((dataPoints / 100) * Math.PI * 2) * 0.3;
            const noise = (Math.random() - 0.5) * 0.2;
            const pcr = Math.max(0.3, Math.min(2.0, basePCR + noise));
            
            const callOI = Math.floor(Math.random() * 500000 + 200000);
            const putOI = Math.floor(callOI * pcr);
            const callVolume = Math.floor(Math.random() * 200000 + 50000);
            const putVolume = Math.floor(callVolume * pcr);
            
            const sentiment = pcr > 1.2 ? 'Bearish' : pcr < 0.8 ? 'Bullish' : 'Neutral';
            
            const pcrData = {
              timestamp: timestamp.unix() * 1000,
              date: timestamp.format('YYYY-MM-DD'),
              time: timestamp.format('HH:mm'),
              pcr: Math.round(pcr * 1000) / 1000,
              callOI,
              putOI,
              totalOI: callOI + putOI,
              callVolume,
              putVolume,
              totalVolume: callVolume + putVolume,
              sentiment,
              confidenceLevel: Math.abs(pcr - 1) * 100 // Distance from neutral
            };
            
            historicalData.data.push(pcrData);
            totalPCR += pcr;
            pcrValues.push(pcr);
            dataPoints++;
            
            historicalData.statistics.highestPCR = Math.max(historicalData.statistics.highestPCR, pcr);
            historicalData.statistics.lowestPCR = Math.min(historicalData.statistics.lowestPCR, pcr);
            
            // Count sentiment days
            if (sentiment === 'Bullish') historicalData.statistics.bullishDays++;
            else if (sentiment === 'Bearish') historicalData.statistics.bearishDays++;
            else historicalData.statistics.neutralDays++;
          }
        }
      }

      // Calculate statistics
      historicalData.statistics.averagePCR = Math.round((totalPCR / dataPoints) * 1000) / 1000;
      historicalData.statistics.volatility = calculateVolatility(pcrValues);
      
      // Convert counts to percentages
      const totalDays = historicalData.statistics.bullishDays + historicalData.statistics.bearishDays + historicalData.statistics.neutralDays;
      historicalData.statistics.bullishDays = Math.round((historicalData.statistics.bullishDays / totalDays) * 100);
      historicalData.statistics.bearishDays = Math.round((historicalData.statistics.bearishDays / totalDays) * 100);
      historicalData.statistics.neutralDays = Math.round((historicalData.statistics.neutralDays / totalDays) * 100);

      res.json(historicalData);
    } catch (error) {
      console.error('Historical PCR error:', error);
      res.status(500).json({ error: 'Failed to get historical PCR data' });
    }
  }
);

/**
 * GET /api/historical/iv/:symbol
 * Get historical IV data
 */
router.get('/iv/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  validatePeriod,
  cacheMiddleware(1800),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '1m', expiry } = req.query;
      
      const currentPrice = dataGenerator.basePrices[symbol];
      const targetExpiry = expiry || dataGenerator.expiries[0];
      
      const end = moment();
      const start = moment().subtract(getPeriodDays(period), 'days');
      
      const historicalData = {
        symbol,
        currentPrice,
        expiry: targetExpiry,
        period,
        dateRange: {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD')
        },
        timestamp: new Date().toISOString(),
        data: [],
        analysis: {
          averageIV: 0,
          highestIV: 0,
          lowestIV: Infinity,
          ivPercentile: 0,
          volatility: 0,
          trend: 'Stable'
        }
      };

      let totalIV = 0;
      let dataPoints = 0;
      const ivValues = [];
      
      // Generate historical IV data
      for (let date = start.clone(); date.isSameOrBefore(end); date.add(1, 'day')) {
        if (date.day() === 0 || date.day() === 6) continue; // Skip weekends
        
        const daysToExpiry = moment(targetExpiry, 'DD-MM-YYYY').diff(date, 'days');
        if (daysToExpiry < 0) continue;
        
        // Generate daily IV data
        const baseIV = 18 + (Math.random() - 0.5) * 10;
        const termStructureEffect = Math.max(0.8, daysToExpiry / 30); // Term structure
        const volatilityCluster = 1 + Math.sin((dataPoints / 20) * Math.PI) * 0.3; // Volatility clustering
        
        for (let hour = 9; hour <= 15; hour += 2) { // Every 2 hours
          const timestamp = date.clone().hour(hour).minute(15);
          
          const currentIV = baseIV * termStructureEffect * volatilityCluster;
          const atmIV = currentIV + Math.random() * 2;
          const otmCallIV = currentIV + Math.random() * 3 + 1; // OTM call skew
          const otmPutIV = currentIV + Math.random() * 4 + 2; // OTM put skew (higher)
          
          const ivData = {
            timestamp: timestamp.unix() * 1000,
            date: timestamp.format('YYYY-MM-DD'),
            time: timestamp.format('HH:mm'),
            atmIV: Math.round(atmIV * 100) / 100,
            otmCallIV: Math.round(otmCallIV * 100) / 100,
            otmPutIV: Math.round(otmPutIV * 100) / 100,
            averageIV: Math.round(((atmIV + otmCallIV + otmPutIV) / 3) * 100) / 100,
            daysToExpiry,
            ivRank: Math.round(Math.random() * 100), // IV rank (0-100)
            ivPercentile: Math.round(Math.random() * 100), // IV percentile (0-100)
            skew: Math.round((otmPutIV - otmCallIV) * 100) / 100,
            term: daysToExpiry > 30 ? 'Long' : daysToExpiry > 7 ? 'Medium' : 'Short'
          };
          
          historicalData.data.push(ivData);
          totalIV += ivData.averageIV;
          ivValues.push(ivData.averageIV);
          dataPoints++;
          
          historicalData.analysis.highestIV = Math.max(historicalData.analysis.highestIV, ivData.averageIV);
          historicalData.analysis.lowestIV = Math.min(historicalData.analysis.lowestIV, ivData.averageIV);
        }
      }

      // Calculate analysis
      historicalData.analysis.averageIV = Math.round((totalIV / dataPoints) * 100) / 100;
      historicalData.analysis.volatility = calculateVolatility(ivValues);
      
      // Calculate IV percentile (current IV vs historical range)
      const currentIV = historicalData.data[historicalData.data.length - 1]?.averageIV || 0;
      const range = historicalData.analysis.highestIV - historicalData.analysis.lowestIV;
      historicalData.analysis.ivPercentile = Math.round(((currentIV - historicalData.analysis.lowestIV) / range) * 100);
      
      // Determine trend
      if (historicalData.data.length > 10) {
        const recentData = historicalData.data.slice(-5);
        const olderData = historicalData.data.slice(-10, -5);
        
        const recentAvgIV = recentData.reduce((sum, item) => sum + item.averageIV, 0) / recentData.length;
        const olderAvgIV = olderData.reduce((sum, item) => sum + item.averageIV, 0) / olderData.length;
        
        if (recentAvgIV > olderAvgIV * 1.1) {
          historicalData.analysis.trend = 'Increasing';
        } else if (recentAvgIV < olderAvgIV * 0.9) {
          historicalData.analysis.trend = 'Decreasing';
        }
      }

      res.json(historicalData);
    } catch (error) {
      console.error('Historical IV error:', error);
      res.status(500).json({ error: 'Failed to get historical IV data' });
    }
  }
);

// Helper functions
function getPeriodDays(period) {
  const periodMap = {
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365
  };
  return periodMap[period] || 1;
}

function getIntervalMinutes(interval) {
  const intervalMap = {
    '1 Min': 1,
    '3 Min': 3,
    '5 Min': 5,
    '15 Min': 15,
    '30 Min': 30,
    '1 Hour': 60
  };
  return intervalMap[interval] || 15;
}

function calculateVolatility(values) {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  return Math.round(Math.sqrt(variance) * 100) / 100;
}

module.exports = router;
