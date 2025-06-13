const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../middleware/cache');
const { 
  validateSymbol, 
  validateInterval,
  validatePeriod,
  handleValidationErrors,
  sanitizeQuery
} = require('../middleware/validation');
const DataGenerator = require('../services/dataGenerator');

// Initialize data generator
const dataGenerator = new DataGenerator();

/**
 * GET /api/futures/oi-analysis
 * Get futures OI analysis with builds
 */
router.get('/oi-analysis',
  sanitizeQuery,
  validateInterval,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol = 'NIFTY', interval = '15 Min' } = req.query;
      const currentPrice = dataGenerator.basePrices[symbol];
      
      const futuresOIData = {
        symbol,
        currentPrice,
        interval,
        timestamp: new Date().toISOString(),
        currentOI: Math.floor(Math.random() * 5000000 + 2000000),
        oiChange: Math.floor(Math.random() * 500000 - 250000),
        oiChangePercent: 0,
        analysis: {
          longBuildup: 0,
          shortBuildup: 0,
          longUnwinding: 0,
          shortCovering: 0,
          sentiment: 'Neutral',
          confidence: 0
        },
        timeSeriesData: [],
        comparativeAnalysis: {
          vsSpot: {
            premium: 0,
            premiumPercent: 0,
            basis: 0
          },
          vsOtherMonths: []
        }
      };

      // Calculate OI change percentage
      futuresOIData.oiChangePercent = Math.round((futuresOIData.oiChange / futuresOIData.currentOI) * 10000) / 100;

      // Generate time series data for intraday analysis
      for (let i = 0; i < 75; i++) { // 5-minute intervals
        const time = new Date();
        time.setHours(9, 15 + i * 5, 0, 0);
        
        const priceChange = (Math.random() - 0.5) * 2; // -1% to +1%
        const oiChange = Math.floor(Math.random() * 200000 - 100000);
        const price = currentPrice + (currentPrice * priceChange / 100);
        
        // Determine buildup type
        let buildupType = 'Neutral';
        if (priceChange > 0.2 && oiChange > 0) {
          buildupType = 'Long Buildup';
          futuresOIData.analysis.longBuildup++;
        } else if (priceChange < -0.2 && oiChange > 0) {
          buildupType = 'Short Buildup';
          futuresOIData.analysis.shortBuildup++;
        } else if (priceChange > 0.2 && oiChange < 0) {
          buildupType = 'Short Covering';
          futuresOIData.analysis.shortCovering++;
        } else if (priceChange < -0.2 && oiChange < 0) {
          buildupType = 'Long Unwinding';
          futuresOIData.analysis.longUnwinding++;
        }

        futuresOIData.timeSeriesData.push({
          timestamp: time.getTime(),
          time: time.toTimeString().slice(0, 5),
          price: Math.round(price * 100) / 100,
          priceChange: Math.round(priceChange * 100) / 100,
          openInterest: futuresOIData.currentOI + oiChange,
          oiChange,
          oiChangePercent: Math.round((oiChange / futuresOIData.currentOI) * 10000) / 100,
          volume: Math.floor(Math.random() * 100000 + 20000),
          buildupType
        });
      }

      // Determine overall sentiment
      const totalBullish = futuresOIData.analysis.longBuildup + futuresOIData.analysis.shortCovering;
      const totalBearish = futuresOIData.analysis.shortBuildup + futuresOIData.analysis.longUnwinding;
      
      if (totalBullish > totalBearish * 1.2) {
        futuresOIData.analysis.sentiment = 'Bullish';
        futuresOIData.analysis.confidence = Math.min(90, (totalBullish / (totalBullish + totalBearish)) * 100);
      } else if (totalBearish > totalBullish * 1.2) {
        futuresOIData.analysis.sentiment = 'Bearish';
        futuresOIData.analysis.confidence = Math.min(90, (totalBearish / (totalBullish + totalBearish)) * 100);
      } else {
        futuresOIData.analysis.sentiment = 'Neutral';
        futuresOIData.analysis.confidence = 50;
      }

      // Generate comparative analysis
      const spotPrice = currentPrice + (Math.random() - 0.5) * 10; // Slight difference from futures
      futuresOIData.comparativeAnalysis.vsSpot.premium = Math.round((currentPrice - spotPrice) * 100) / 100;
      futuresOIData.comparativeAnalysis.vsSpot.premiumPercent = Math.round(((currentPrice - spotPrice) / spotPrice) * 10000) / 100;
      futuresOIData.comparativeAnalysis.vsSpot.basis = futuresOIData.comparativeAnalysis.vsSpot.premium;

      // Compare with other contract months
      for (let i = 1; i <= 3; i++) {
        const monthPrice = currentPrice + (Math.random() * 20 + i * 5); // Higher for longer expiry
        futuresOIData.comparativeAnalysis.vsOtherMonths.push({
          expiry: dataGenerator.expiries[i],
          price: Math.round(monthPrice * 100) / 100,
          premium: Math.round((monthPrice - currentPrice) * 100) / 100,
          openInterest: Math.floor(Math.random() * 2000000 + 500000),
          volume: Math.floor(Math.random() * 500000 + 100000)
        });
      }

      res.json(futuresOIData);
    } catch (error) {
      console.error('Futures OI analysis error:', error);
      res.status(500).json({ error: 'Failed to get futures OI analysis' });
    }
  }
);

/**
 * GET /api/futures/price-vs-oi/:symbol
 * Get futures price vs OI correlation data
 */
router.get('/price-vs-oi/:symbol',
  validateSymbol,
  handleValidationErrors,
  sanitizeQuery,
  validatePeriod,
  cacheMiddleware(600),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '7' } = req.query;
      const currentPrice = dataGenerator.basePrices[symbol];
      
      const priceOIData = {
        symbol,
        currentPrice,
        period: parseInt(period),
        timestamp: new Date().toISOString(),
        correlation: {
          coefficient: Math.round((Math.random() - 0.5) * 2 * 1000) / 1000,
          strength: 'Medium',
          direction: 'Positive',
          significance: 'Moderate'
        },
        data: [],
        analysis: {
          priceSupport: [],
          priceResistance: [],
          oiSupport: [],
          oiResistance: [],
          keyLevels: []
        }
      };

      // Generate historical price vs OI data
      const days = parseInt(period);
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
          // Generate intraday data
          for (let hour = 9; hour <= 15; hour++) {
            for (let minute = 15; minute < 60; minute += 30) {
              if (hour === 15 && minute > 30) break;
              
              const timestamp = new Date(date);
              timestamp.setHours(hour, minute, 0, 0);
              
              const priceVariation = (Math.random() - 0.5) * currentPrice * 0.03;
              const price = currentPrice + priceVariation;
              
              // OI correlation - higher OI at key price levels
              const priceLevel = Math.round(price / 50) * 50; // Round to nearest 50
              const distanceFromLevel = Math.abs(price - priceLevel);
              const oiFactor = Math.max(0.5, 1 - (distanceFromLevel / 100));
              
              const baseOI = 3000000 + Math.random() * 2000000;
              const openInterest = Math.floor(baseOI * oiFactor);
              
              priceOIData.data.push({
                timestamp: timestamp.getTime(),
                time: timestamp.toTimeString().slice(0, 5),
                date: timestamp.toISOString().split('T')[0],
                price: Math.round(price * 100) / 100,
                openInterest,
                volume: Math.floor(Math.random() * 200000 + 50000),
                priceChange: Math.round(((price - currentPrice) / currentPrice) * 10000) / 100,
                oiChange: Math.floor((Math.random() - 0.5) * 500000),
                correlation: Math.round((Math.random() - 0.5) * 2 * 1000) / 1000
              });
            }
          }
        }
      }

      // Analyze key levels
      const priceOIMap = new Map();
      priceOIData.data.forEach(item => {
        const priceLevel = Math.round(item.price / 25) * 25; // Group by 25-point levels
        if (!priceOIMap.has(priceLevel)) {
          priceOIMap.set(priceLevel, { totalOI: 0, count: 0, avgVolume: 0 });
        }
        const level = priceOIMap.get(priceLevel);
        level.totalOI += item.openInterest;
        level.avgVolume += item.volume;
        level.count++;
      });

      // Identify key levels
      const keyLevels = Array.from(priceOIMap.entries()).map(([price, data]) => ({
        price,
        avgOI: Math.floor(data.totalOI / data.count),
        avgVolume: Math.floor(data.avgVolume / data.count),
        significance: data.count,
        type: price < currentPrice ? 'Support' : 'Resistance'
      }));

      // Sort by significance and take top levels
      keyLevels.sort((a, b) => b.avgOI - a.avgOI);
      priceOIData.analysis.keyLevels = keyLevels.slice(0, 10);
      
      priceOIData.analysis.priceSupport = keyLevels.filter(level => level.type === 'Support').slice(0, 3);
      priceOIData.analysis.priceResistance = keyLevels.filter(level => level.type === 'Resistance').slice(0, 3);

      // Determine correlation strength
      const correlation = priceOIData.correlation.coefficient;
      priceOIData.correlation.strength = Math.abs(correlation) > 0.7 ? 'Strong' : 
                                        Math.abs(correlation) > 0.3 ? 'Medium' : 'Weak';
      priceOIData.correlation.direction = correlation > 0 ? 'Positive' : correlation < 0 ? 'Negative' : 'None';
      priceOIData.correlation.significance = Math.abs(correlation) > 0.5 ? 'High' : 
                                           Math.abs(correlation) > 0.2 ? 'Moderate' : 'Low';

      res.json(priceOIData);
    } catch (error) {
      console.error('Futures price vs OI error:', error);
      res.status(500).json({ error: 'Failed to get futures price vs OI data' });
    }
  }
);

/**
 * GET /api/futures/rollover-analysis/:symbol
 * Get futures rollover analysis
 */
router.get('/rollover-analysis/:symbol',
  validateSymbol,
  handleValidationErrors,
  cacheMiddleware(900),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const currentPrice = dataGenerator.basePrices[symbol];
      
      const rolloverData = {
        symbol,
        currentPrice,
        timestamp: new Date().toISOString(),
        currentMonth: {
          expiry: dataGenerator.expiries[0],
          price: currentPrice,
          openInterest: Math.floor(Math.random() * 5000000 + 2000000),
          volume: Math.floor(Math.random() * 1000000 + 500000),
          daysToExpiry: getDaysToExpiry(dataGenerator.expiries[0])
        },
        nextMonth: {
          expiry: dataGenerator.expiries[1],
          price: currentPrice + Math.random() * 30 + 10,
          openInterest: Math.floor(Math.random() * 2000000 + 500000),
          volume: Math.floor(Math.random() * 500000 + 100000),
          daysToExpiry: getDaysToExpiry(dataGenerator.expiries[1])
        },
        rolloverMetrics: {
          rolloverPercentage: 0,
          rolloverCost: 0,
          rolloverCostPercent: 0,
          rolloverEfficiency: 'High',
          recommendedAction: 'Hold'
        },
        historicalRollover: []
      };

      // Calculate rollover metrics
      rolloverData.rolloverMetrics.rolloverCost = rolloverData.nextMonth.price - rolloverData.currentMonth.price;
      rolloverData.rolloverMetrics.rolloverCostPercent = Math.round((rolloverData.rolloverMetrics.rolloverCost / rolloverData.currentMonth.price) * 10000) / 100;
      rolloverData.rolloverMetrics.rolloverPercentage = Math.round((rolloverData.nextMonth.openInterest / (rolloverData.currentMonth.openInterest + rolloverData.nextMonth.openInterest)) * 10000) / 100;

      // Determine rollover efficiency
      if (Math.abs(rolloverData.rolloverMetrics.rolloverCostPercent) < 0.5) {
        rolloverData.rolloverMetrics.rolloverEfficiency = 'High';
        rolloverData.rolloverMetrics.recommendedAction = 'Rollover';
      } else if (Math.abs(rolloverData.rolloverMetrics.rolloverCostPercent) < 1.0) {
        rolloverData.rolloverMetrics.rolloverEfficiency = 'Medium';
        rolloverData.rolloverMetrics.recommendedAction = 'Consider';
      } else {
        rolloverData.rolloverMetrics.rolloverEfficiency = 'Low';
        rolloverData.rolloverMetrics.recommendedAction = 'Avoid';
      }

      // Generate historical rollover data
      for (let i = 5; i >= 0; i--) {
        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - i);
        
        rolloverData.historicalRollover.push({
          month: pastDate.toISOString().slice(0, 7),
          rolloverCost: (Math.random() - 0.5) * 50,
          rolloverCostPercent: (Math.random() - 0.5) * 2,
          rolloverVolume: Math.floor(Math.random() * 2000000 + 500000),
          efficiency: Math.random() > 0.5 ? 'High' : 'Medium'
        });
      }

      res.json(rolloverData);
    } catch (error) {
      console.error('Futures rollover analysis error:', error);
      res.status(500).json({ error: 'Failed to get futures rollover analysis' });
    }
  }
);

/**
 * GET /api/futures/term-structure/:symbol
 * Get futures term structure analysis
 */
router.get('/term-structure/:symbol',
  validateSymbol,
  handleValidationErrors,
  cacheMiddleware(600),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const currentPrice = dataGenerator.basePrices[symbol];
      
      const termStructureData = {
        symbol,
        currentPrice,
        timestamp: new Date().toISOString(),
        curve: [],
        analysis: {
          shape: 'Normal',
          steepness: 'Medium',
          carryTrade: 'Neutral',
          marketSentiment: 'Neutral'
        }
      };

      // Generate term structure for multiple expiries
      dataGenerator.expiries.slice(0, 6).forEach((expiry, index) => {
        const daysToExpiry = getDaysToExpiry(expiry);
        const carryRate = 0.07; // 7% annual carry rate
        const convenience = (Math.random() - 0.5) * 0.02; // Convenience yield
        
        // Calculate theoretical future price with carry cost
        const timeToExpiry = daysToExpiry / 365;
        const theoreticalPrice = currentPrice * Math.exp((carryRate + convenience) * timeToExpiry);
        
        // Add market noise
        const marketPrice = theoreticalPrice + (Math.random() - 0.5) * currentPrice * 0.01;
        
        const basis = marketPrice - currentPrice;
        const annualizedBasis = basis / timeToExpiry;
        
        termStructureData.curve.push({
          expiry,
          daysToExpiry,
          price: Math.round(marketPrice * 100) / 100,
          basis: Math.round(basis * 100) / 100,
          basisPercent: Math.round((basis / currentPrice) * 10000) / 100,
          annualizedBasis: Math.round(annualizedBasis * 100) / 100,
          openInterest: Math.floor(Math.random() * 3000000 + 500000),
          volume: Math.floor(Math.random() * 800000 + 100000),
          impliedCarryRate: Math.round((Math.log(marketPrice / currentPrice) / timeToExpiry) * 10000) / 100
        });
      });

      // Analyze curve shape
      const slopes = [];
      for (let i = 1; i < termStructureData.curve.length; i++) {
        const slope = termStructureData.curve[i].price - termStructureData.curve[i - 1].price;
        slopes.push(slope);
      }

      const avgSlope = slopes.reduce((sum, slope) => sum + slope, 0) / slopes.length;
      
      if (avgSlope > 10) {
        termStructureData.analysis.shape = 'Contango';
        termStructureData.analysis.marketSentiment = 'Bearish';
      } else if (avgSlope < -10) {
        termStructureData.analysis.shape = 'Backwardation';
        termStructureData.analysis.marketSentiment = 'Bullish';
      } else {
        termStructureData.analysis.shape = 'Flat';
        termStructureData.analysis.marketSentiment = 'Neutral';
      }

      // Determine steepness
      const maxSlope = Math.max(...slopes.map(Math.abs));
      termStructureData.analysis.steepness = maxSlope > 20 ? 'Steep' : maxSlope > 10 ? 'Medium' : 'Flat';

      // Carry trade recommendation
      if (termStructureData.analysis.shape === 'Contango' && avgSlope > 15) {
        termStructureData.analysis.carryTrade = 'Sell';
      } else if (termStructureData.analysis.shape === 'Backwardation' && avgSlope < -15) {
        termStructureData.analysis.carryTrade = 'Buy';
      }

      res.json(termStructureData);
    } catch (error) {
      console.error('Futures term structure error:', error);
      res.status(500).json({ error: 'Failed to get futures term structure data' });
    }
  }
);

// Helper function
function getDaysToExpiry(expiry) {
  const [day, month, year] = expiry.split('-');
  const expiryDate = new Date(year, month - 1, day);
  const today = new Date();
  const diffTime = expiryDate - today;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

module.exports = router;