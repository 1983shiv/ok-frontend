const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../middleware/cache');
const { 
  validateSymbol, 
  validateExpiry, 
  validateStrike,
  validateInterval,
  validatePeriod,
  handleValidationErrors,
  sanitizeQuery
} = require('../middleware/validation');
const DataGenerator = require('../services/dataGenerator');

// Initialize data generator
const dataGenerator = new DataGenerator();

/**
 * GET /api/oi/coi-analysis/:symbol
 * Get Change of Interest analysis
 */
router.get('/coi-analysis/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  validateInterval,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { interval = '15 Min', expiry } = req.query;
      
      const coiData = dataGenerator.generateCOIAnalysis(symbol, expiry || dataGenerator.expiries[0], 7);
      
      res.json({
        success: true,
        data: coiData,
        requestParams: { symbol, interval, expiry },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('COI analysis error:', error);
      res.status(500).json({ error: 'Failed to get COI analysis' });
    }
  }
);

/**
 * GET /api/oi/pcr-analysis/:symbol
 * Get Put-Call Ratio analysis
 */
router.get('/pcr-analysis/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  cacheMiddleware(600),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '30' } = req.query;
      
      const pcrData = dataGenerator.generatePCRAnalysis(symbol, parseInt(period));
      
      res.json({
        success: true,
        data: pcrData,
        requestParams: { symbol, period },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PCR analysis error:', error);
      res.status(500).json({ error: 'Failed to get PCR analysis' });
    }
  }
);

/**
 * GET /api/oi/gainer-looser/:symbol
 * Get OI gainer and looser analysis
 */
router.get('/gainer-looser/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  validateInterval,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { interval = '15Min' } = req.query;
      
      const oiGainerData = dataGenerator.generateOIGainerLooser(symbol);
      
      // Filter by requested interval if specified
      let responseData = oiGainerData;
      if (interval && interval !== 'all') {
        responseData = {
          ...oiGainerData,
          oiGainer: { [interval]: oiGainerData.oiGainer[interval] || [] },
          oiLooser: { [interval]: oiGainerData.oiLooser[interval] || [] }
        };
      }
      
      res.json({
        success: true,
        data: responseData,
        requestParams: { symbol, interval },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('OI gainer-looser error:', error);
      res.status(500).json({ error: 'Failed to get OI gainer-looser data' });
    }
  }
);

/**
 * GET /api/oi/price-vs-oi/:symbol/:strike
 * Get Price vs OI correlation for specific strike
 */
router.get('/price-vs-oi/:symbol/:strike',
  validateSymbol,
  validateStrike,
  handleValidationErrors,
  sanitizeQuery,
  cacheMiddleware(600),
  (req, res) => {
    try {
      const { symbol, strike } = req.params;
      const { expiry, period = '7' } = req.query;
      const strikePrice = parseFloat(strike);
      const currentPrice = dataGenerator.basePrices[symbol];
      
      const priceVsOIData = {
        symbol,
        strikePrice,
        currentPrice,
        expiry: expiry || dataGenerator.expiries[0],
        period: parseInt(period),
        timestamp: new Date().toISOString(),
        correlation: {
          call: Math.round((Math.random() - 0.5) * 2 * 1000) / 1000, // -1 to 1
          put: Math.round((Math.random() - 0.5) * 2 * 1000) / 1000,
          overall: Math.round((Math.random() - 0.5) * 2 * 1000) / 1000
        },
        timeSeriesData: [],
        summary: {
          avgCallOI: 0,
          avgPutOI: 0,
          avgPrice: 0,
          oiVolatility: 0,
          priceVolatility: 0
        }
      };

      // Generate time series data
      const days = parseInt(period);
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
          // Generate correlated data
          const priceChange = (Math.random() - 0.5) * 200;
          const price = currentPrice + priceChange;
          
          // OI tends to increase when price moves towards the strike
          const distanceFromStrike = Math.abs(price - strikePrice);
          const oiFactor = Math.max(0.3, 1 - (distanceFromStrike / currentPrice));
          
          const callOI = Math.floor((Math.random() * 100000 + 50000) * oiFactor);
          const putOI = Math.floor((Math.random() * 100000 + 50000) * (2 - oiFactor));
          
          priceVsOIData.timeSeriesData.push({
            date: date.toISOString().split('T')[0],
            timestamp: date.getTime(),
            price: Math.round(price * 100) / 100,
            callOI,
            putOI,
            totalOI: callOI + putOI,
            callVolume: Math.floor(Math.random() * 50000 + 10000),
            putVolume: Math.floor(Math.random() * 50000 + 10000),
            distanceFromStrike: Math.round(distanceFromStrike * 100) / 100
          });
        }
      }

      // Calculate summary statistics
      if (priceVsOIData.timeSeriesData.length > 0) {
        const data = priceVsOIData.timeSeriesData;
        priceVsOIData.summary.avgCallOI = Math.floor(data.reduce((sum, d) => sum + d.callOI, 0) / data.length);
        priceVsOIData.summary.avgPutOI = Math.floor(data.reduce((sum, d) => sum + d.putOI, 0) / data.length);
        priceVsOIData.summary.avgPrice = Math.round((data.reduce((sum, d) => sum + d.price, 0) / data.length) * 100) / 100;
        
        // Calculate volatilities
        const prices = data.map(d => d.price);
        const callOIs = data.map(d => d.callOI);
        priceVsOIData.summary.priceVolatility = calculateVolatility(prices);
        priceVsOIData.summary.oiVolatility = calculateVolatility(callOIs);
      }

      res.json(priceVsOIData);
    } catch (error) {
      console.error('Price vs OI error:', error);
      res.status(500).json({ error: 'Failed to get Price vs OI data' });
    }
  }
);

/**
 * GET /api/oi/oi-analysis/:symbol
 * Get comprehensive OI analysis
 */
router.get('/oi-analysis/:symbol',
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
      
      // Generate comprehensive OI analysis
      const oiAnalysis = {
        symbol,
        currentPrice,
        expiry: targetExpiry,
        range,
        timestamp: new Date().toISOString(),
        summary: {
          totalCallOI: 0,
          totalPutOI: 0,
          totalCallVolume: 0,
          totalPutVolume: 0,
          pcr: 0,
          maxPain: currentPrice,
          atmStrike: 0,
          highestCallOIStrike: 0,
          highestPutOIStrike: 0
        },
        strikeWiseData: [],
        oiBuildup: {
          longBuildup: [],
          shortBuildup: [],
          longUnwinding: [],
          shortUnwinding: []
        },
        insights: []
      };

      // Generate strike-wise data
      const strikes = dataGenerator.generateStrikes(symbol, currentPrice, 15);
      let maxCallOI = 0;
      let maxPutOI = 0;
      
      strikes.forEach(strike => {
        const callOI = Math.floor(Math.random() * 200000 + 30000);
        const putOI = Math.floor(Math.random() * 200000 + 30000);
        const callVolume = Math.floor(Math.random() * 100000 + 5000);
        const putVolume = Math.floor(Math.random() * 100000 + 5000);
        
        // Determine buildup type based on price movement and OI change
        const priceChange = (Math.random() - 0.5) * 2; // -1 to 1
        const oiChange = Math.floor(Math.random() * 50000 - 25000);
        
        let buildupType = 'Neutral';
        if (priceChange > 0 && oiChange > 0) buildupType = 'Long Buildup';
        else if (priceChange < 0 && oiChange > 0) buildupType = 'Short Buildup';
        else if (priceChange > 0 && oiChange < 0) buildupType = 'Short Covering';
        else if (priceChange < 0 && oiChange < 0) buildupType = 'Long Unwinding';

        const strikeData = {
          strikePrice: strike,
          call: {
            openInterest: callOI,
            volume: callVolume,
            oiChange: Math.floor(oiChange * 0.6),
            premium: Math.max(0, currentPrice - strike) + (Math.random() * 50 + 10),
            impliedVolatility: 15 + (Math.abs(strike - currentPrice) / currentPrice) * 50
          },
          put: {
            openInterest: putOI,
            volume: putVolume,
            oiChange: Math.floor(oiChange * 0.4),
            premium: Math.max(0, strike - currentPrice) + (Math.random() * 50 + 10),
            impliedVolatility: 15 + (Math.abs(strike - currentPrice) / currentPrice) * 50
          },
          totalOI: callOI + putOI,
          totalVolume: callVolume + putVolume,
          buildupType,
          distanceFromATM: Math.abs(strike - currentPrice),
          isATM: Math.abs(strike - currentPrice) < dataGenerator.strikeIntervals[symbol]
        };

        oiAnalysis.strikeWiseData.push(strikeData);
        
        // Update summary statistics
        oiAnalysis.summary.totalCallOI += callOI;
        oiAnalysis.summary.totalPutOI += putOI;
        oiAnalysis.summary.totalCallVolume += callVolume;
        oiAnalysis.summary.totalPutVolume += putVolume;
        
        if (callOI > maxCallOI) {
          maxCallOI = callOI;
          oiAnalysis.summary.highestCallOIStrike = strike;
        }
        
        if (putOI > maxPutOI) {
          maxPutOI = putOI;
          oiAnalysis.summary.highestPutOIStrike = strike;
        }

        // Categorize buildup
        if (buildupType === 'Long Buildup') {
          oiAnalysis.oiBuildup.longBuildup.push(strikeData);
        } else if (buildupType === 'Short Buildup') {
          oiAnalysis.oiBuildup.shortBuildup.push(strikeData);
        } else if (buildupType === 'Long Unwinding') {
          oiAnalysis.oiBuildup.longUnwinding.push(strikeData);
        } else if (buildupType === 'Short Covering') {
          oiAnalysis.oiBuildup.shortUnwinding.push(strikeData);
        }
      });

      // Calculate final summary values
      oiAnalysis.summary.pcr = Math.round((oiAnalysis.summary.totalPutOI / oiAnalysis.summary.totalCallOI) * 1000) / 1000;
      oiAnalysis.summary.maxPain = calculateMaxPain(oiAnalysis.strikeWiseData);
      oiAnalysis.summary.atmStrike = findNearestStrike(oiAnalysis.strikeWiseData, currentPrice);

      // Generate insights
      oiAnalysis.insights = generateOIInsights(oiAnalysis);

      res.json(oiAnalysis);
    } catch (error) {
      console.error('OI analysis error:', error);
      res.status(500).json({ error: 'Failed to get OI analysis' });
    }
  }
);

/**
 * GET /api/oi/buildup-analysis/:symbol
 * Get position buildup analysis
 */
router.get('/buildup-analysis/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { expiry, interval = '15Min' } = req.query;
      const currentPrice = dataGenerator.basePrices[symbol];
      
      const buildupData = {
        symbol,
        currentPrice,
        expiry: expiry || dataGenerator.expiries[0],
        interval,
        timestamp: new Date().toISOString(),
        analysis: {
          longBuildup: {
            count: 0,
            totalOI: 0,
            strikes: []
          },
          shortBuildup: {
            count: 0,
            totalOI: 0,
            strikes: []
          },
          longUnwinding: {
            count: 0,
            totalOI: 0,
            strikes: []
          },
          shortCovering: {
            count: 0,
            totalOI: 0,
            strikes: []
          }
        },
        sentiment: {
          overall: 'Neutral',
          confidence: 0,
          bullishSignals: 0,
          bearishSignals: 0
        }
      };

      // Generate buildup data for strikes
      const strikes = dataGenerator.generateStrikes(symbol, currentPrice, 10);
      
      strikes.forEach(strike => {
        const priceChange = Math.random() - 0.5; // -0.5 to 0.5
        const oiChange = Math.floor(Math.random() * 100000 - 50000);
        const volume = Math.floor(Math.random() * 50000 + 10000);
        const openInterest = Math.floor(Math.random() * 200000 + 50000);
        
        let category;
        if (priceChange > 0 && oiChange > 0) {
          category = 'longBuildup';
          buildupData.sentiment.bullishSignals++;
        } else if (priceChange < 0 && oiChange > 0) {
          category = 'shortBuildup';
          buildupData.sentiment.bearishSignals++;
        } else if (priceChange > 0 && oiChange < 0) {
          category = 'shortCovering';
          buildupData.sentiment.bullishSignals++;
        } else {
          category = 'longUnwinding';
          buildupData.sentiment.bearishSignals++;
        }

        const strikeInfo = {
          strikePrice: strike,
          priceChange: Math.round(priceChange * 100 * 100) / 100,
          oiChange,
          oiChangePercent: Math.round((oiChange / openInterest) * 10000) / 100,
          volume,
          openInterest,
          significance: Math.abs(oiChange) + volume // Simple significance measure
        };

        buildupData.analysis[category].strikes.push(strikeInfo);
        buildupData.analysis[category].count++;
        buildupData.analysis[category].totalOI += Math.abs(oiChange);
      });

      // Sort strikes by significance
      Object.keys(buildupData.analysis).forEach(key => {
        buildupData.analysis[key].strikes.sort((a, b) => b.significance - a.significance);
        buildupData.analysis[key].strikes = buildupData.analysis[key].strikes.slice(0, 5); // Top 5
      });

      // Determine overall sentiment
      const totalBullish = buildupData.sentiment.bullishSignals;
      const totalBearish = buildupData.sentiment.bearishSignals;
      
      if (totalBullish > totalBearish * 1.2) {
        buildupData.sentiment.overall = 'Bullish';
        buildupData.sentiment.confidence = Math.min(90, (totalBullish / (totalBullish + totalBearish)) * 100);
      } else if (totalBearish > totalBullish * 1.2) {
        buildupData.sentiment.overall = 'Bearish';
        buildupData.sentiment.confidence = Math.min(90, (totalBearish / (totalBullish + totalBearish)) * 100);
      } else {
        buildupData.sentiment.overall = 'Neutral';
        buildupData.sentiment.confidence = 50;
      }

      buildupData.sentiment.confidence = Math.round(buildupData.sentiment.confidence);

      res.json(buildupData);
    } catch (error) {
      console.error('Buildup analysis error:', error);
      res.status(500).json({ error: 'Failed to get buildup analysis' });
    }
  }
);

// Helper functions
function calculateVolatility(values) {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  return Math.round(Math.sqrt(variance) * 100) / 100;
}

function calculateMaxPain(strikeData) {
  let maxPain = 0;
  let minLoss = Infinity;

  strikeData.forEach(option => {
    const strike = option.strikePrice;
    let totalLoss = 0;

    strikeData.forEach(opt => {
      // Calculate losses for call writers
      if (opt.strikePrice <= strike) {
        totalLoss += opt.call.openInterest * Math.max(0, strike - opt.strikePrice);
      }
      // Calculate losses for put writers
      if (opt.strikePrice >= strike) {
        totalLoss += opt.put.openInterest * Math.max(0, opt.strikePrice - strike);
      }
    });

    if (totalLoss < minLoss) {
      minLoss = totalLoss;
      maxPain = strike;
    }
  });

  return maxPain;
}

function findNearestStrike(strikeData, currentPrice) {
  return strikeData.reduce((nearest, option) => {
    return Math.abs(option.strikePrice - currentPrice) < Math.abs(nearest.strikePrice - currentPrice)
      ? option : nearest;
  }).strikePrice;
}

function generateOIInsights(oiAnalysis) {
  const insights = [];
  const { summary, oiBuildup } = oiAnalysis;
  
  // PCR insight
  if (summary.pcr > 1.2) {
    insights.push({
      type: 'Bearish',
      message: `High PCR of ${summary.pcr} indicates bearish sentiment`,
      confidence: 'High'
    });
  } else if (summary.pcr < 0.8) {
    insights.push({
      type: 'Bullish',
      message: `Low PCR of ${summary.pcr} indicates bullish sentiment`,
      confidence: 'High'
    });
  }

  // Max Pain insight
  const maxPainDistance = Math.abs(summary.maxPain - oiAnalysis.currentPrice);
  if (maxPainDistance > 100) {
    insights.push({
      type: 'Neutral',
      message: `Max Pain at ${summary.maxPain} suggests potential price target`,
      confidence: 'Medium'
    });
  }

  // Buildup insights
  if (oiBuildup.longBuildup.length > oiBuildup.shortBuildup.length) {
    insights.push({
      type: 'Bullish',
      message: `More long buildup positions (${oiBuildup.longBuildup.length}) than short buildup (${oiBuildup.shortBuildup.length})`,
      confidence: 'Medium'
    });
  }

  return insights;
}

module.exports = router;