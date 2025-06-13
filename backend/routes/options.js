const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../middleware/cache');
const { 
  validateSymbol, 
  validateExpiry, 
  validateStrike,
  validateInterval,
  validateRange,
  validateOptionsFilter,
  handleValidationErrors,
  sanitizeQuery
} = require('../middleware/validation');
const DataGenerator = require('../services/dataGenerator');

// Initialize data generator
const dataGenerator = new DataGenerator();

/**
 * GET /api/options/chain/:symbol/:expiry
 * Get complete options chain for symbol and expiry
 */
router.get('/chain/:symbol/:expiry',
  validateSymbol,
  validateExpiry,
  handleValidationErrors,
  sanitizeQuery,
  validateOptionsFilter,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol, expiry } = req.params;
      const { range, minStrike, maxStrike, minOI, minVolume } = req.query;
      
      const currentPrice = dataGenerator.basePrices[symbol];
      let optionsChain = dataGenerator.generateOptionsChain(symbol, expiry, currentPrice);

      // Apply filters
      if (range && range !== 'Auto') {
        optionsChain = filterByRange(optionsChain, currentPrice, range);
      }
      
      if (minStrike || maxStrike) {
        optionsChain = optionsChain.filter(option => {
          return (!minStrike || option.strikePrice >= minStrike) &&
                 (!maxStrike || option.strikePrice <= maxStrike);
        });
      }

      if (minOI) {
        optionsChain = optionsChain.filter(option => 
          option.call.openInterest >= minOI || option.put.openInterest >= minOI
        );
      }

      if (minVolume) {
        optionsChain = optionsChain.filter(option => 
          option.call.volume >= minVolume || option.put.volume >= minVolume
        );
      }

      // Calculate summary statistics
      const summary = calculateChainSummary(optionsChain, currentPrice);

      res.json({
        symbol,
        expiry,
        currentPrice,
        timestamp: new Date().toISOString(),
        chain: optionsChain,
        summary,
        filters: { range, minStrike, maxStrike, minOI, minVolume },
        totalStrikes: optionsChain.length
      });
    } catch (error) {
      console.error('Options chain error:', error);
      res.status(500).json({ error: 'Failed to get options chain' });
    }
  }
);

/**
 * GET /api/options/iv-analysis/:symbol
 * Get IV analysis data
 */
router.get('/iv-analysis/:symbol',
  validateSymbol,
  handleValidationErrors,
  cacheMiddleware(600),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const ivData = dataGenerator.generateIVAnalysis(symbol);

      res.json({
        success: true,
        data: ivData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('IV analysis error:', error);
      res.status(500).json({ error: 'Failed to get IV analysis' });
    }
  }
);

/**
 * GET /api/options/premium-decay/:symbol
 * Get premium decay analysis
 */
router.get('/premium-decay/:symbol',
  validateSymbol,
  handleValidationErrors,
  cacheMiddleware(900),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const currentPrice = dataGenerator.basePrices[symbol];
      const strikes = dataGenerator.generateStrikes(symbol, currentPrice, 10);
      
      const premiumDecayData = {
        symbol,
        currentPrice,
        lastUpdated: new Date().toISOString(),
        atmStrikes: strikes.filter(strike => 
          Math.abs(strike - currentPrice) <= dataGenerator.strikeIntervals[symbol]
        ),
        decayAnalysis: [],
        timeSeriesData: []
      };

      // Generate premium decay for ATM strikes
      premiumDecayData.atmStrikes.forEach(strike => {
        const daysToExpiry = [30, 21, 14, 7, 3, 1];
        const decayData = daysToExpiry.map(days => {
          const timeValue = Math.max(0, 50 * Math.sqrt(days / 30) * Math.exp(-Math.abs(strike - currentPrice) / 100));
          return {
            daysToExpiry: days,
            callPremium: Math.max(0, currentPrice - strike) + timeValue,
            putPremium: Math.max(0, strike - currentPrice) + timeValue,
            timeValue,
            theta: -timeValue / days
          };
        });

        premiumDecayData.decayAnalysis.push({
          strikePrice: strike,
          decayData
        });
      });

      // Generate intraday time series
      for (let i = 0; i < 75; i++) { // 5-minute intervals
        const timeRemaining = 1 - (i / 75); // Decay throughout the day
        premiumDecayData.timeSeriesData.push({
          time: `${9 + Math.floor(i * 6.5 / 75)}:${String(15 + (i * 5) % 60).padStart(2, '0')}`,
          timestamp: Date.now() + i * 5 * 60 * 1000,
          averagePremium: 50 * timeRemaining + Math.random() * 10,
          callPremium: 25 * timeRemaining + Math.random() * 5,
          putPremium: 25 * timeRemaining + Math.random() * 5,
          timeDecay: (1 - timeRemaining) * 100
        });
      }

      res.json(premiumDecayData);
    } catch (error) {
      console.error('Premium decay error:', error);
      res.status(500).json({ error: 'Failed to get premium decay analysis' });
    }
  }
);

/**
 * GET /api/options/straddle/:symbol/:strike
 * Get straddle analysis for specific strike
 */
router.get('/straddle/:symbol/:strike',
  validateSymbol,
  validateStrike,
  handleValidationErrors,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol, strike } = req.params;
      const strikePrice = parseFloat(strike);
      const currentPrice = dataGenerator.basePrices[symbol];
      
      // Generate straddle data
      const callPremium = Math.max(0, currentPrice - strikePrice) + (Math.random() * 50 + 10);
      const putPremium = Math.max(0, strikePrice - currentPrice) + (Math.random() * 50 + 10);
      const straddlePrice = callPremium + putPremium;

      const straddleData = {
        symbol,
        strikePrice,
        currentPrice,
        straddle: {
          totalPremium: Math.round(straddlePrice * 100) / 100,
          callPremium: Math.round(callPremium * 100) / 100,
          putPremium: Math.round(putPremium * 100) / 100,
          breakEvenUpper: strikePrice + straddlePrice,
          breakEvenLower: strikePrice - straddlePrice,
          maxLoss: straddlePrice,
          impliedVolatility: 18 + Math.random() * 8
        },
        payoffAnalysis: [],
        riskReward: {
          riskRewardRatio: 'Unlimited',
          probabilityOfProfit: calculateProbabilityOfProfit(strikePrice, straddlePrice, currentPrice),
          optimalExitPoints: [
            strikePrice + straddlePrice * 0.5,
            strikePrice - straddlePrice * 0.5
          ]
        },
        timestamp: new Date().toISOString()
      };

      // Generate payoff analysis
      const priceRange = Array.from({length: 21}, (_, i) => 
        strikePrice - (straddlePrice * 2) + (i * straddlePrice * 4 / 20)
      );

      straddleData.payoffAnalysis = priceRange.map(price => {
        const callValue = Math.max(0, price - strikePrice);
        const putValue = Math.max(0, strikePrice - price);
        const totalValue = callValue + putValue;
        const pnl = totalValue - straddlePrice;

        return {
          underlyingPrice: Math.round(price * 100) / 100,
          callValue: Math.round(callValue * 100) / 100,
          putValue: Math.round(putValue * 100) / 100,
          totalValue: Math.round(totalValue * 100) / 100,
          pnl: Math.round(pnl * 100) / 100,
          pnlPercent: Math.round((pnl / straddlePrice) * 10000) / 100
        };
      });

      res.json(straddleData);
    } catch (error) {
      console.error('Straddle analysis error:', error);
      res.status(500).json({ error: 'Failed to get straddle analysis' });
    }
  }
);

/**
 * GET /api/options/multi-strike-oi
 * Get multi-strike OI comparison
 */
router.get('/multi-strike-oi',
  sanitizeQuery,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol = 'NIFTY', expiry } = req.query;
      const currentPrice = dataGenerator.basePrices[symbol];
      const strikes = dataGenerator.generateStrikes(symbol, currentPrice, 15);
      
      const multiStrikeData = {
        symbol,
        currentPrice,
        expiry: expiry || dataGenerator.expiries[0],
        timestamp: new Date().toISOString(),
        strikes: strikes.slice(0, 10).map(strike => {
          const callOI = Math.floor(Math.random() * 200000 + 50000);
          const putOI = Math.floor(Math.random() * 200000 + 50000);
          const totalOI = callOI + putOI;
          
          return {
            strikePrice: strike,
            call: {
              openInterest: callOI,
              volume: Math.floor(Math.random() * 50000 + 10000),
              premium: Math.max(0, currentPrice - strike) + (Math.random() * 30 + 5),
              impliedVolatility: 15 + (Math.abs(strike - currentPrice) / currentPrice) * 50
            },
            put: {
              openInterest: putOI,
              volume: Math.floor(Math.random() * 50000 + 10000),
              premium: Math.max(0, strike - currentPrice) + (Math.random() * 30 + 5),
              impliedVolatility: 15 + (Math.abs(strike - currentPrice) / currentPrice) * 50
            },
            totalOI,
            oiRatio: Math.round((putOI / callOI) * 1000) / 1000,
            distanceFromATM: Math.abs(strike - currentPrice)
          };
        })
      };

      // Sort by total OI
      multiStrikeData.strikes.sort((a, b) => b.totalOI - a.totalOI);

      res.json(multiStrikeData);
    } catch (error) {
      console.error('Multi-strike OI error:', error);
      res.status(500).json({ error: 'Failed to get multi-strike OI data' });
    }
  }
);

/**
 * GET /api/options/trending-strikes/:symbol
 * Get trending strikes analysis
 */
router.get('/trending-strikes/:symbol',
  validateSymbol,
  handleValidationErrors,
  cacheMiddleware(300),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const currentPrice = dataGenerator.basePrices[symbol];
      const strikes = dataGenerator.generateStrikes(symbol, currentPrice, 20);
      
      const trendingData = {
        symbol,
        currentPrice,
        timestamp: new Date().toISOString(),
        trending: {
          gainers: [],
          losers: [],
          highestOI: [],
          highestVolume: []
        }
      };

      // Generate trending strikes
      const strikesData = strikes.map(strike => {
        const callOI = Math.floor(Math.random() * 200000 + 50000);
        const putOI = Math.floor(Math.random() * 200000 + 50000);
        const callVolume = Math.floor(Math.random() * 100000 + 10000);
        const putVolume = Math.floor(Math.random() * 100000 + 10000);
        const oiChange = Math.floor(Math.random() * 100000 - 50000);
        
        return {
          strikePrice: strike,
          call: { oi: callOI, volume: callVolume, oiChange: oiChange * 0.6 },
          put: { oi: putOI, volume: putVolume, oiChange: oiChange * 0.4 },
          totalOI: callOI + putOI,
          totalVolume: callVolume + putVolume,
          totalOIChange: oiChange,
          oiChangePercent: (oiChange / (callOI + putOI)) * 100
        };
      });

      // Sort and categorize
      trendingData.trending.gainers = strikesData
        .filter(s => s.totalOIChange > 0)
        .sort((a, b) => b.totalOIChange - a.totalOIChange)
        .slice(0, 5);

      trendingData.trending.losers = strikesData
        .filter(s => s.totalOIChange < 0)
        .sort((a, b) => a.totalOIChange - b.totalOIChange)
        .slice(0, 5);

      trendingData.trending.highestOI = strikesData
        .sort((a, b) => b.totalOI - a.totalOI)
        .slice(0, 5);

      trendingData.trending.highestVolume = strikesData
        .sort((a, b) => b.totalVolume - a.totalVolume)
        .slice(0, 5);

      res.json(trendingData);
    } catch (error) {
      console.error('Trending strikes error:', error);
      res.status(500).json({ error: 'Failed to get trending strikes' });
    }
  }
);

/**
 * GET /api/options/atm-premium/:symbol
 * Get ATM premium analysis
 */
router.get('/atm-premium/:symbol',
  validateSymbol,
  handleValidationErrors,
  cacheMiddleware(600),
  (req, res) => {
    try {
      const { symbol } = req.params;
      const currentPrice = dataGenerator.basePrices[symbol];
      const atmStrike = Math.round(currentPrice / dataGenerator.strikeIntervals[symbol]) * dataGenerator.strikeIntervals[symbol];
      
      const atmData = {
        symbol,
        currentPrice,
        atmStrike,
        timestamp: new Date().toISOString(),
        premiumData: {
          call: {
            premium: Math.random() * 100 + 50,
            impliedVolatility: 18 + Math.random() * 8,
            delta: 0.5 + (Math.random() - 0.5) * 0.2,
            theta: -(Math.random() * 5 + 2),
            gamma: Math.random() * 0.01,
            vega: Math.random() * 30 + 20
          },
          put: {
            premium: Math.random() * 100 + 50,
            impliedVolatility: 18 + Math.random() * 8,
            delta: -0.5 + (Math.random() - 0.5) * 0.2,
            theta: -(Math.random() * 5 + 2),
            gamma: Math.random() * 0.01,
            vega: Math.random() * 30 + 20
          }
        },
        historicalData: []
      };

      // Generate historical ATM premium data
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
          atmData.historicalData.push({
            date: date.toISOString().split('T')[0],
            callPremium: Math.random() * 120 + 30,
            putPremium: Math.random() * 120 + 30,
            totalPremium: 0,
            impliedVolatility: 15 + Math.random() * 10,
            underlyingPrice: currentPrice + (Math.random() - 0.5) * 200
          });
        }
      }

      // Calculate total premium
      atmData.historicalData.forEach(day => {
        day.totalPremium = day.callPremium + day.putPremium;
      });

      res.json(atmData);
    } catch (error) {
      console.error('ATM premium error:', error);
      res.status(500).json({ error: 'Failed to get ATM premium analysis' });
    }
  }
);

// Helper functions
function filterByRange(optionsChain, currentPrice, range) {
  const ranges = {
    'ITM 10': { min: currentPrice - 500, max: currentPrice },
    'ITM 5': { min: currentPrice - 250, max: currentPrice },
    'ATM ±5': { min: currentPrice - 250, max: currentPrice + 250 },
    'ATM ±10': { min: currentPrice - 500, max: currentPrice + 500 },
    'OTM 5': { min: currentPrice, max: currentPrice + 250 },
    'OTM 10': { min: currentPrice, max: currentPrice + 500 }
  };

  if (!ranges[range]) return optionsChain;

  const { min, max } = ranges[range];
  return optionsChain.filter(option => 
    option.strikePrice >= min && option.strikePrice <= max
  );
}

function calculateChainSummary(optionsChain, currentPrice) {
  const totalCallOI = optionsChain.reduce((sum, option) => sum + option.call.openInterest, 0);
  const totalPutOI = optionsChain.reduce((sum, option) => sum + option.put.openInterest, 0);
  const totalCallVolume = optionsChain.reduce((sum, option) => sum + option.call.volume, 0);
  const totalPutVolume = optionsChain.reduce((sum, option) => sum + option.put.volume, 0);

  return {
    totalCallOI,
    totalPutOI,
    totalCallVolume,
    totalPutVolume,
    pcr: Math.round((totalPutOI / totalCallOI) * 1000) / 1000,
    maxPain: calculateMaxPain(optionsChain),
    atmStrike: findNearestStrike(optionsChain, currentPrice)
  };
}

function calculateMaxPain(optionsChain) {
  let maxPain = 0;
  let minLoss = Infinity;

  optionsChain.forEach(option => {
    const strike = option.strikePrice;
    let totalLoss = 0;

    optionsChain.forEach(opt => {
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

function findNearestStrike(optionsChain, currentPrice) {
  return optionsChain.reduce((nearest, option) => {
    return Math.abs(option.strikePrice - currentPrice) < Math.abs(nearest.strikePrice - currentPrice)
      ? option : nearest;
  }).strikePrice;
}

function calculateProbabilityOfProfit(strikePrice, premium, currentPrice) {
  // Simplified calculation based on distance from current price
  const breakEvenRange = premium * 2;
  const priceRange = Math.abs(currentPrice * 0.1); // Assume 10% price movement range
  
  if (breakEvenRange >= priceRange) return 0.3; // 30% if break-even is wide
  if (breakEvenRange >= priceRange * 0.5) return 0.5; // 50% if moderate
  return 0.7; // 70% if tight break-even
}

module.exports = router;