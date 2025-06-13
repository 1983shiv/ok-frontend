const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../middleware/cache');
const { 
  validateSymbol, 
  validateExpiry, 
  validateChartType,
  validateInterval,
  validatePeriod,
  handleValidationErrors,
  sanitizeQuery
} = require('../middleware/validation');
const DataGenerator = require('../services/dataGenerator');

// Initialize data generator
const dataGenerator = new DataGenerator();

/**
 * GET /api/charts/oi-data/:symbol
 * Get OI chart data (CE/PE breakdown)
 */
router.get('/oi-data/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { expiry, range = 'Auto' } = req.query;
      const currentPrice = dataGenerator.basePrices[symbol];
      const targetExpiry = expiry || dataGenerator.expiries[0];
      
      // Generate OI chart data
      const strikes = dataGenerator.generateStrikes(symbol, currentPrice, 15);
      const chartData = {
        symbol,
        currentPrice,
        expiry: targetExpiry,
        range,
        timestamp: new Date().toISOString(),
        data: strikes.map(strike => {
          const callOI = Math.floor(Math.random() * 200000 + 30000);
          const putOI = Math.floor(Math.random() * 200000 + 30000);
          
          return {
            strikePrice: strike,
            callOI,
            putOI,
            totalOI: callOI + putOI,
            callVolume: Math.floor(Math.random() * 100000 + 10000),
            putVolume: Math.floor(Math.random() * 100000 + 10000),
            callPremium: Math.max(0, currentPrice - strike) + (Math.random() * 50 + 10),
            putPremium: Math.max(0, strike - currentPrice) + (Math.random() * 50 + 10),
            isITM: strike < currentPrice,
            isOTM: strike > currentPrice,
            isATM: Math.abs(strike - currentPrice) < dataGenerator.strikeIntervals[symbol],
            distanceFromATM: Math.abs(strike - currentPrice)
          };
        }),
        summary: {
          totalCallOI: 0,
          totalPutOI: 0,
          maxCallOI: 0,
          maxPutOI: 0,
          maxCallOIStrike: 0,
          maxPutOIStrike: 0,
          pcr: 0
        }
      };

      // Calculate summary
      chartData.summary.totalCallOI = chartData.data.reduce((sum, item) => sum + item.callOI, 0);
      chartData.summary.totalPutOI = chartData.data.reduce((sum, item) => sum + item.putOI, 0);
      chartData.summary.pcr = Math.round((chartData.summary.totalPutOI / chartData.summary.totalCallOI) * 1000) / 1000;
      
      const maxCallOIItem = chartData.data.reduce((max, item) => item.callOI > max.callOI ? item : max);
      const maxPutOIItem = chartData.data.reduce((max, item) => item.putOI > max.putOI ? item : max);
      
      chartData.summary.maxCallOI = maxCallOIItem.callOI;
      chartData.summary.maxPutOI = maxPutOIItem.putOI;
      chartData.summary.maxCallOIStrike = maxCallOIItem.strikePrice;
      chartData.summary.maxPutOIStrike = maxPutOIItem.strikePrice;

      res.json(chartData);
    } catch (error) {
      console.error('OI chart data error:', error);
      res.status(500).json({ error: 'Failed to get OI chart data' });
    }
  }
);

/**
 * GET /api/charts/price-vs-oi/:symbol
 * Get Price vs OI chart data
 */
router.get('/price-vs-oi/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  cacheMiddleware(600),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '7', strike } = req.query;
      const currentPrice = dataGenerator.basePrices[symbol];
      const targetStrike = strike ? parseFloat(strike) : currentPrice;
      
      const chartData = {
        symbol,
        currentPrice,
        targetStrike,
        period: parseInt(period),
        timestamp: new Date().toISOString(),
        correlation: {
          coefficient: Math.round((Math.random() - 0.5) * 2 * 1000) / 1000, // -1 to 1
          strength: 'Medium',
          direction: 'Positive'
        },
        data: []
      };

      // Generate time series data
      const days = parseInt(period);
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
          // Generate intraday data (every 15 minutes)
          for (let hour = 9; hour <= 15; hour++) {
            for (let minute = 15; minute < 60; minute += 15) {
              if (hour === 15 && minute > 30) break; // Market closes at 15:30
              
              const timestamp = new Date(date);
              timestamp.setHours(hour, minute, 0, 0);
              
              const priceVariation = (Math.random() - 0.5) * currentPrice * 0.02;
              const price = currentPrice + priceVariation;
              
              // OI tends to correlate with distance from strike
              const distanceFromStrike = Math.abs(price - targetStrike);
              const oiFactor = Math.max(0.3, 1 - (distanceFromStrike / currentPrice));
              
              const callOI = Math.floor((Math.random() * 100000 + 50000) * oiFactor);
              const putOI = Math.floor((Math.random() * 100000 + 50000) * (2 - oiFactor));
              
              chartData.data.push({
                timestamp: timestamp.getTime(),
                time: timestamp.toTimeString().slice(0, 5),
                date: timestamp.toISOString().split('T')[0],
                price: Math.round(price * 100) / 100,
                callOI,
                putOI,
                totalOI: callOI + putOI,
                volume: Math.floor(Math.random() * 50000 + 10000),
                distanceFromStrike: Math.round(distanceFromStrike * 100) / 100
              });
            }
          }
        }
      }

      // Determine correlation strength and direction
      const correlation = chartData.correlation.coefficient;
      chartData.correlation.strength = Math.abs(correlation) > 0.7 ? 'Strong' : 
                                      Math.abs(correlation) > 0.3 ? 'Medium' : 'Weak';
      chartData.correlation.direction = correlation > 0 ? 'Positive' : correlation < 0 ? 'Negative' : 'None';

      res.json(chartData);
    } catch (error) {
      console.error('Price vs OI chart error:', error);
      res.status(500).json({ error: 'Failed to get Price vs OI chart data' });
    }
  }
);

/**
 * GET /api/charts/premium-decay/:symbol
 * Get Premium decay chart data
 */
router.get('/premium-decay/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  cacheMiddleware(900),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { strike, expiry } = req.query;
      const currentPrice = dataGenerator.basePrices[symbol];
      const targetStrike = strike ? parseFloat(strike) : currentPrice;
      const targetExpiry = expiry || dataGenerator.expiries[0];
      
      const chartData = {
        symbol,
        currentPrice,
        targetStrike,
        expiry: targetExpiry,
        timestamp: new Date().toISOString(),
        decayAnalysis: {
          theta: -(Math.random() * 10 + 2),
          timeValue: Math.random() * 50 + 20,
          intrinsicValue: Math.max(0, currentPrice - targetStrike),
          decayRate: Math.random() * 0.1 + 0.05
        },
        data: []
      };

      // Generate premium decay over time
      const daysToExpiry = [30, 25, 20, 15, 10, 7, 5, 3, 2, 1, 0];
      
      daysToExpiry.forEach(days => {
        const timeValue = Math.max(0, 50 * Math.sqrt(days / 30) * 
          Math.exp(-Math.abs(targetStrike - currentPrice) / (currentPrice * 0.1)));
        const intrinsicValue = Math.max(0, currentPrice - targetStrike);
        const totalPremium = intrinsicValue + timeValue;
        
        chartData.data.push({
          daysToExpiry: days,
          timeValue: Math.round(timeValue * 100) / 100,
          intrinsicValue: Math.round(intrinsicValue * 100) / 100,
          totalPremium: Math.round(totalPremium * 100) / 100,
          theta: days > 0 ? -(timeValue / days) : 0,
          decayPercent: days < 30 ? ((50 - timeValue) / 50) * 100 : 0,
          accelerationFactor: days <= 7 ? 2 : days <= 15 ? 1.5 : 1
        });
      });

      // Add intraday decay for current day
      chartData.intradayDecay = [];
      for (let hour = 9; hour <= 15; hour++) {
        for (let minute = 15; minute < 60; minute += 15) {
          if (hour === 15 && minute > 30) break;
          
          const timeRemaining = 1 - ((hour - 9) * 60 + (minute - 15)) / (6.25 * 60);
          const decayedPremium = chartData.data[0].totalPremium * timeRemaining;
          
          chartData.intradayDecay.push({
            time: `${hour}:${String(minute).padStart(2, '0')}`,
            timeRemaining,
            premium: Math.round(decayedPremium * 100) / 100,
            decayFromOpen: Math.round((chartData.data[0].totalPremium - decayedPremium) * 100) / 100,
            decayPercent: Math.round(((chartData.data[0].totalPremium - decayedPremium) / chartData.data[0].totalPremium) * 10000) / 100
          });
        }
      }

      res.json(chartData);
    } catch (error) {
      console.error('Premium decay chart error:', error);
      res.status(500).json({ error: 'Failed to get premium decay chart data' });
    }
  }
);

/**
 * GET /api/charts/iv-surface/:symbol
 * Get IV surface chart data
 */
router.get('/iv-surface/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  cacheMiddleware(600),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const currentPrice = dataGenerator.basePrices[symbol];
      
      const chartData = {
        symbol,
        currentPrice,
        timestamp: new Date().toISOString(),
        surface: [],
        statistics: {
          averageIV: 0,
          ivSkew: 0,
          termStructure: 'Normal'
        }
      };

      // Generate IV surface data
      const strikes = dataGenerator.generateStrikes(symbol, currentPrice, 10);
      const expiries = dataGenerator.expiries.slice(0, 4); // First 4 expiries
      
      let totalIV = 0;
      let dataPoints = 0;
      
      expiries.forEach(expiry => {
        const daysToExpiry = getDaysToExpiry(expiry);
        
        strikes.forEach(strike => {
          const distanceFromATM = Math.abs(strike - currentPrice);
          const moneyness = strike / currentPrice;
          
          // IV smile/skew calculation
          let baseIV = 18 + (daysToExpiry / 365) * 5; // Term structure
          
          // Add skew (higher IV for OTM puts and calls)
          if (moneyness < 0.95 || moneyness > 1.05) {
            baseIV += Math.pow((Math.abs(moneyness - 1) * 100), 1.5);
          }
          
          const callIV = baseIV + Math.random() * 3;
          const putIV = baseIV + Math.random() * 3 + (moneyness < 1 ? 2 : 0); // Put skew
          
          chartData.surface.push({
            expiry,
            daysToExpiry,
            strikePrice: strike,
            moneyness: Math.round(moneyness * 1000) / 1000,
            callIV: Math.round(callIV * 100) / 100,
            putIV: Math.round(putIV * 100) / 100,
            distanceFromATM
          });
          
          totalIV += callIV + putIV;
          dataPoints += 2;
        });
      });

      // Calculate statistics
      chartData.statistics.averageIV = Math.round((totalIV / dataPoints) * 100) / 100;
      
      // Calculate IV skew (difference between OTM put and call IV)
      const otmPuts = chartData.surface.filter(item => item.moneyness < 0.95);
      const otmCalls = chartData.surface.filter(item => item.moneyness > 1.05);
      
      if (otmPuts.length > 0 && otmCalls.length > 0) {
        const avgPutIV = otmPuts.reduce((sum, item) => sum + item.putIV, 0) / otmPuts.length;
        const avgCallIV = otmCalls.reduce((sum, item) => sum + item.callIV, 0) / otmCalls.length;
        chartData.statistics.ivSkew = Math.round((avgPutIV - avgCallIV) * 100) / 100;
      }

      res.json(chartData);
    } catch (error) {
      console.error('IV surface chart error:', error);
      res.status(500).json({ error: 'Failed to get IV surface chart data' });
    }
  }
);

/**
 * GET /api/charts/pcr-trend/:symbol
 * Get PCR trend chart data
 */
router.get('/pcr-trend/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '30' } = req.query;
      const currentPrice = dataGenerator.basePrices[symbol];
      
      const chartData = {
        symbol,
        currentPrice,
        period: parseInt(period),
        timestamp: new Date().toISOString(),
        currentPCR: 0,
        trend: 'Neutral',
        data: [],
        levels: {
          oversold: 1.3,
          overbought: 0.7,
          neutral: 1.0
        }
      };

      // Generate PCR trend data
      const days = parseInt(period);
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
          // Generate intraday PCR data
          for (let hour = 9; hour <= 15; hour++) {
            for (let minute = 15; minute < 60; minute += 30) {
              if (hour === 15 && minute > 30) break;
              
              const timestamp = new Date(date);
              timestamp.setHours(hour, minute, 0, 0);
              
              // PCR tends to follow market sentiment
              const basePCR = 0.9 + Math.sin((i / days) * Math.PI * 2) * 0.3;
              const noise = (Math.random() - 0.5) * 0.2;
              const pcr = Math.max(0.3, basePCR + noise);
              
              const callOI = Math.floor(Math.random() * 500000 + 200000);
              const putOI = Math.floor(callOI * pcr);
              
              chartData.data.push({
                timestamp: timestamp.getTime(),
                time: timestamp.toTimeString().slice(0, 5),
                date: timestamp.toISOString().split('T')[0],
                pcr: Math.round(pcr * 1000) / 1000,
                callOI,
                putOI,
                totalOI: callOI + putOI,
                sentiment: pcr > 1.2 ? 'Bearish' : pcr < 0.8 ? 'Bullish' : 'Neutral'
              });
            }
          }
        }
      }

      // Calculate current PCR and trend
      if (chartData.data.length > 0) {
        chartData.currentPCR = chartData.data[chartData.data.length - 1].pcr;
        
        // Determine trend based on recent data
        const recentData = chartData.data.slice(-10);
        const avgRecentPCR = recentData.reduce((sum, item) => sum + item.pcr, 0) / recentData.length;
        const olderData = chartData.data.slice(-20, -10);
        const avgOlderPCR = olderData.length > 0 ? 
          olderData.reduce((sum, item) => sum + item.pcr, 0) / olderData.length : avgRecentPCR;
        
        if (avgRecentPCR > avgOlderPCR * 1.05) {
          chartData.trend = 'Increasing';
        } else if (avgRecentPCR < avgOlderPCR * 0.95) {
          chartData.trend = 'Decreasing';
        } else {
          chartData.trend = 'Stable';
        }
      }

      res.json(chartData);
    } catch (error) {
      console.error('PCR trend chart error:', error);
      res.status(500).json({ error: 'Failed to get PCR trend chart data' });
    }
  }
);

/**
 * GET /api/charts/volume-profile/:symbol
 * Get Volume profile chart data
 */
router.get('/volume-profile/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  cacheMiddleware(600),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { expiry } = req.query;
      const currentPrice = dataGenerator.basePrices[symbol];
      const targetExpiry = expiry || dataGenerator.expiries[0];
      
      const chartData = {
        symbol,
        currentPrice,
        expiry: targetExpiry,
        timestamp: new Date().toISOString(),
        volumeProfile: [],
        summary: {
          totalVolume: 0,
          highestVolumeStrike: 0,
          pocLevel: 0, // Point of Control
          valueAreaHigh: 0,
          valueAreaLow: 0
        }
      };

      // Generate volume profile data
      const strikes = dataGenerator.generateStrikes(symbol, currentPrice, 15);
      let totalVolume = 0;
      let maxVolume = 0;
      let maxVolumeStrike = currentPrice;
      
      strikes.forEach(strike => {
        const distanceFromATM = Math.abs(strike - currentPrice);
        
        // Volume tends to be higher near ATM strikes
        const volumeFactor = Math.exp(-Math.pow(distanceFromATM / (currentPrice * 0.05), 2));
        const callVolume = Math.floor((Math.random() * 50000 + 10000) * volumeFactor);
        const putVolume = Math.floor((Math.random() * 50000 + 10000) * volumeFactor);
        const totalStrikeVolume = callVolume + putVolume;
        
        chartData.volumeProfile.push({
          strikePrice: strike,
          callVolume,
          putVolume,
          totalVolume: totalStrikeVolume,
          volumePercent: 0, // Will be calculated after all strikes
          distanceFromATM,
          isHighVolume: false // Will be determined later
        });
        
        totalVolume += totalStrikeVolume;
        
        if (totalStrikeVolume > maxVolume) {
          maxVolume = totalStrikeVolume;
          maxVolumeStrike = strike;
        }
      });

      // Calculate percentages and identify high volume areas
      chartData.volumeProfile.forEach(item => {
        item.volumePercent = Math.round((item.totalVolume / totalVolume) * 10000) / 100;
        item.isHighVolume = item.totalVolume > (maxVolume * 0.7);
      });

      // Calculate summary
      chartData.summary.totalVolume = totalVolume;
      chartData.summary.highestVolumeStrike = maxVolumeStrike;
      chartData.summary.pocLevel = maxVolumeStrike; // Point of Control
      
      // Calculate Value Area (70% of volume)
      const sortedByVolume = [...chartData.volumeProfile].sort((a, b) => b.totalVolume - a.totalVolume);
      let cumulativeVolume = 0;
      const valueAreaStrikes = [];
      
      for (const item of sortedByVolume) {
        cumulativeVolume += item.totalVolume;
        valueAreaStrikes.push(item.strikePrice);
        if (cumulativeVolume >= totalVolume * 0.7) break;
      }
      
      chartData.summary.valueAreaHigh = Math.max(...valueAreaStrikes);
      chartData.summary.valueAreaLow = Math.min(...valueAreaStrikes);

      res.json(chartData);
    } catch (error) {
      console.error('Volume profile chart error:', error);
      res.status(500).json({ error: 'Failed to get volume profile chart data' });
    }
  }
);

// Helper functions
function getDaysToExpiry(expiry) {
  const [day, month, year] = expiry.split('-');
  const expiryDate = new Date(year, month - 1, day);
  const today = new Date();
  const diffTime = expiryDate - today;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

module.exports = router;
