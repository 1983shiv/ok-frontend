const moment = require('moment');
const _ = require('lodash');

/**
 * Comprehensive data generator for TradingOK platform
 * Generates realistic trading data for multiple days, symbols, and expiries
 */
class DataGenerator {
  constructor() {
    this.symbols = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'];
    this.intervals = ['1 Min', '3 Min', '5 Min', '15 Min', '30 Min', '1 Hour'];
    this.ranges = ['Auto', 'ITM 10', 'ITM 5', 'ATM ±5', 'ATM ±10', 'OTM 5', 'OTM 10'];
    
    // Base prices for different symbols
    this.basePrices = {
      NIFTY: 24850,
      BANKNIFTY: 51200,
      FINNIFTY: 21450,
      MIDCPNIFTY: 12850
    };
    
    // Strike intervals for different symbols
    this.strikeIntervals = {
      NIFTY: 50,
      BANKNIFTY: 100,
      FINNIFTY: 50,
      MIDCPNIFTY: 25
    };
    
    // Generate expiry dates for next 8 weeks (weekly expiries)
    this.expiries = this.generateExpiries();
    
    // Market hours
    this.marketHours = {
      start: '09:15',
      end: '15:30'
    };
  }

  /**
   * Generate expiry dates for next 8 weeks
   */
  generateExpiries() {
    const expiries = [];
    const today = moment();
    
    // Find next Thursday
    let nextThursday = today.clone();
    while (nextThursday.day() !== 4) { // 4 = Thursday
      nextThursday.add(1, 'day');
    }
    
    // Generate next 8 weekly expiries
    for (let i = 0; i < 8; i++) {
      expiries.push(nextThursday.clone().add(i, 'weeks').format('DD-MM-YYYY'));
    }
    
    return expiries;
  }

  /**
   * Get the nearest expiry date (next upcoming Thursday)
   */
  getNearestExpiry() {
    return this.expiries[0];
  }

  /**
   * Get all expiry dates
   */
  getExpiries() {
    return this.expiries;
  }

  /**
   * Generate strike prices for a symbol around current price
   */
  generateStrikes(symbol, currentPrice, range = 20) {
    const strikes = [];
    const interval = this.strikeIntervals[symbol];
    const baseStrike = Math.floor(currentPrice / interval) * interval;
    
    for (let i = -range; i <= range; i++) {
      strikes.push(baseStrike + (i * interval));
    }
    
    return strikes.filter(strike => strike > 0);
  }

  /**
   * Generate realistic price movement for a day
   */
  generatePriceMovement(basePrice, volatility = 0.02, intervals = 75) {
    const prices = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i < intervals; i++) {
      // Random walk with mean reversion
      const randomChange = (Math.random() - 0.5) * volatility * basePrice;
      const meanReversion = (basePrice - currentPrice) * 0.1;
      currentPrice += randomChange + meanReversion;
      
      prices.push({
        price: Math.round(currentPrice * 100) / 100,
        time: moment().startOf('day').add(9.25 * 60 + i * 5, 'minutes').format('HH:mm')
      });
    }
    
    return prices;
  }

  /**
   * Generate options chain data for a symbol and expiry
   */
  generateOptionsChain(symbol, expiry, currentPrice) {
    const strikes = this.generateStrikes(symbol, currentPrice);
    const chain = [];
    
    strikes.forEach(strike => {
      const isITM_CE = strike < currentPrice;
      const isITM_PE = strike > currentPrice;
      const distanceFromATM = Math.abs(strike - currentPrice);
      
      // Calculate basic option metrics
      const callPremium = Math.max(0, currentPrice - strike) + 
        (Math.random() * 50 + 10) * Math.exp(-distanceFromATM / 500);
      const putPremium = Math.max(0, strike - currentPrice) + 
        (Math.random() * 50 + 10) * Math.exp(-distanceFromATM / 500);
      
      // Generate OI and volume data
      const callOI = Math.floor(Math.random() * 100000 + 10000);
      const putOI = Math.floor(Math.random() * 100000 + 10000);
      const callVolume = Math.floor(Math.random() * 50000 + 1000);
      const putVolume = Math.floor(Math.random() * 50000 + 1000);
      
      // Calculate IV (higher for OTM options)
      const callIV = 15 + (distanceFromATM / currentPrice) * 100 + Math.random() * 5;
      const putIV = 15 + (distanceFromATM / currentPrice) * 100 + Math.random() * 5;
      
      chain.push({
        strikePrice: strike,
        call: {
          optionType: 'CE',
          premium: Math.round(callPremium * 100) / 100,
          openInterest: callOI,
          volume: callVolume,
          impliedVolatility: Math.round(callIV * 100) / 100,
          delta: isITM_CE ? Math.random() * 0.5 + 0.5 : Math.random() * 0.5,
          gamma: Math.random() * 0.01,
          theta: -(Math.random() * 10 + 1),
          vega: Math.random() * 50 + 10,
          bid: Math.round((callPremium * 0.95) * 100) / 100,
          ask: Math.round((callPremium * 1.05) * 100) / 100,
          lastPrice: Math.round(callPremium * 100) / 100
        },
        put: {
          optionType: 'PE',
          premium: Math.round(putPremium * 100) / 100,
          openInterest: putOI,
          volume: putVolume,
          impliedVolatility: Math.round(putIV * 100) / 100,
          delta: isITM_PE ? -(Math.random() * 0.5 + 0.5) : -(Math.random() * 0.5),
          gamma: Math.random() * 0.01,
          theta: -(Math.random() * 10 + 1),
          vega: Math.random() * 50 + 10,
          bid: Math.round((putPremium * 0.95) * 100) / 100,
          ask: Math.round((putPremium * 1.05) * 100) / 100,
          lastPrice: Math.round(putPremium * 100) / 100
        }
      });
    });
    
    return chain;
  }

  /**
   * Generate COI (Change of Interest) analysis data
   */
  generateCOIAnalysis(symbol, expiry, days = 7) {
    const data = {
      symbols: this.symbols,
      expiries: this.expiries,
      intervals: this.intervals,
      ranges: this.ranges,
      currentPrice: this.basePrices[symbol],
      currentTime: moment().format('HH:mm'),
      lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss'),
      summary: {
        totalChangeInOI: {
          call: Math.floor(Math.random() * 1000 - 500),
          put: Math.floor(Math.random() * 1000 - 500)
        },
        totalOI: {
          call: Math.floor(Math.random() * 500 + 200),
          put: Math.floor(Math.random() * 500 + 200)
        },
        oiDifference: Math.floor(Math.random() * 100000 - 50000),
        maxPain: this.basePrices[symbol] + (Math.random() * 200 - 100),
        pcr: Math.round((0.8 + Math.random() * 0.8) * 1000) / 1000,
        sentiment: Math.random() > 0.5 ? 'Bullish' : 'Bearish'
      },
      timeSeriesData: [],
      dailyData: []
    };

    // Generate intraday time series data
    const marketMinutes = 375; // 9:15 AM to 3:30 PM
    const intervals = Math.floor(marketMinutes / 5); // 5-minute intervals
    
    for (let i = 0; i < intervals; i++) {
      const time = moment().startOf('day').add(9.25 * 60 + i * 5, 'minutes');
      data.timeSeriesData.push({
        time: time.format('HH:mm'),
        timestamp: time.unix() * 1000,
        niftyFuture: data.currentPrice + (Math.random() * 200 - 100),
        changeInCallOI: Math.floor(Math.random() * 100000 - 50000),
        changeInPutOI: Math.floor(Math.random() * 100000 - 50000),
        totalCallOI: Math.floor(Math.random() * 500000 + 200000),
        totalPutOI: Math.floor(Math.random() * 500000 + 200000),
        oiDifference: Math.floor(Math.random() * 100000 - 50000),
        callVolume: Math.floor(Math.random() * 200000 + 50000),
        putVolume: Math.floor(Math.random() * 200000 + 50000)
      });
    }

    // Generate daily data for past 7 days
    for (let i = days - 1; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      if (date.day() !== 0 && date.day() !== 6) { // Skip weekends
        data.dailyData.push({
          date: date.format('YYYY-MM-DD'),
          dateDisplay: date.format('DD-MM-YYYY'),
          openPrice: data.currentPrice + (Math.random() * 300 - 150),
          highPrice: data.currentPrice + (Math.random() * 400 - 100),
          lowPrice: data.currentPrice - (Math.random() * 400 - 100),
          closePrice: data.currentPrice + (Math.random() * 300 - 150),
          totalCallOI: Math.floor(Math.random() * 800000 + 300000),
          totalPutOI: Math.floor(Math.random() * 800000 + 300000),
          callOIChange: Math.floor(Math.random() * 200000 - 100000),
          putOIChange: Math.floor(Math.random() * 200000 - 100000),
          callVolume: Math.floor(Math.random() * 500000 + 100000),
          putVolume: Math.floor(Math.random() * 500000 + 100000),
          pcr: Math.round((0.8 + Math.random() * 0.8) * 1000) / 1000
        });
      }
    }

    return data;
  }

  /**
   * Generate OI Gainer/Looser data
   */
  generateOIGainerLooser(symbol) {
    const data = {
      symbols: this.symbols,
      expiries: this.expiries,
      intervals: ['15 Min', '60 Min', 'Day'],
      currentPrice: this.basePrices[symbol],
      currentTime: moment().format('HH:mm'),
      lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss'),
      oiGainer: {},
      oiLooser: {}
    };

    const strikes = this.generateStrikes(symbol, this.basePrices[symbol], 15);
    
    ['15Min', '60Min', 'Day'].forEach(interval => {
      // Generate gainers
      data.oiGainer[interval] = [];
      data.oiLooser[interval] = [];
      
      for (let i = 0; i < 10; i++) {
        const strike = strikes[Math.floor(Math.random() * strikes.length)];
        const optionType = Math.random() > 0.5 ? 'CE' : 'PE';
        const oiChange = Math.floor(Math.random() * 200000 + 10000);
        const oiChangePercent = Math.round((Math.random() * 50 + 5) * 100) / 100;
        
        data.oiGainer[interval].push({
          strikePrice: strike,
          optionType,
          oiChange,
          oiChangePercent,
          displayText: `${strike}${optionType}`,
          currentOI: Math.floor(Math.random() * 500000 + 100000),
          volume: Math.floor(Math.random() * 100000 + 10000),
          premium: Math.round((Math.random() * 200 + 10) * 100) / 100
        });
        
        // Generate losers
        const looserStrike = strikes[Math.floor(Math.random() * strikes.length)];
        const looserOptionType = Math.random() > 0.5 ? 'CE' : 'PE';
        const looserOIChange = -(Math.floor(Math.random() * 150000 + 5000));
        const looserOIChangePercent = -(Math.round((Math.random() * 30 + 2) * 100) / 100);
        
        data.oiLooser[interval].push({
          strikePrice: looserStrike,
          optionType: looserOptionType,
          oiChange: looserOIChange,
          oiChangePercent: looserOIChangePercent,
          displayText: `${looserStrike}${looserOptionType}`,
          currentOI: Math.floor(Math.random() * 400000 + 50000),
          volume: Math.floor(Math.random() * 80000 + 5000),
          premium: Math.round((Math.random() * 180 + 8) * 100) / 100
        });
      }
      
      // Sort by OI change
      data.oiGainer[interval].sort((a, b) => b.oiChange - a.oiChange);
      data.oiLooser[interval].sort((a, b) => a.oiChange - b.oiChange);
    });

    return data;
  }

  /**
   * Generate PCR Analysis data
   */
  generatePCRAnalysis(symbol, days = 30) {
    const data = {
      symbols: this.symbols,
      expiries: this.expiries,
      currentPrice: this.basePrices[symbol],
      currentTime: moment().format('HH:mm'),
      lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss'),
      currentPCR: Math.round((0.8 + Math.random() * 0.6) * 1000) / 1000,
      summary: {
        averagePCR: Math.round((0.9 + Math.random() * 0.4) * 1000) / 1000,
        highestPCR: Math.round((1.2 + Math.random() * 0.5) * 1000) / 1000,
        lowestPCR: Math.round((0.6 + Math.random() * 0.3) * 1000) / 1000,
        bullishDays: Math.floor(Math.random() * 15 + 5),
        bearishDays: Math.floor(Math.random() * 15 + 5),
        neutralDays: Math.floor(Math.random() * 10 + 2)
      },
      timeSeriesData: [],
      dailyData: [],
      strikeWisePCR: []
    };

    // Generate intraday PCR data
    const intervals = 75; // 5-minute intervals
    for (let i = 0; i < intervals; i++) {
      const time = moment().startOf('day').add(9.25 * 60 + i * 5, 'minutes');
      const pcr = 0.8 + Math.random() * 0.6 + Math.sin(i / 10) * 0.1;
      
      data.timeSeriesData.push({
        time: time.format('HH:mm'),
        timestamp: time.unix() * 1000,
        pcr: Math.round(pcr * 1000) / 1000,
        callOI: Math.floor(Math.random() * 500000 + 200000),
        putOI: Math.floor(Math.random() * 500000 + 200000),
        callVolume: Math.floor(Math.random() * 200000 + 50000),
        putVolume: Math.floor(Math.random() * 200000 + 50000),
        price: data.currentPrice + (Math.random() * 200 - 100)
      });
    }

    // Generate daily PCR data
    for (let i = days - 1; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      if (date.day() !== 0 && date.day() !== 6) { // Skip weekends
        const pcr = 0.8 + Math.random() * 0.6;
        data.dailyData.push({
          date: date.format('YYYY-MM-DD'),
          dateDisplay: date.format('DD-MM-YYYY'),
          pcr: Math.round(pcr * 1000) / 1000,
          sentiment: pcr > 1.1 ? 'Bearish' : pcr < 0.9 ? 'Bullish' : 'Neutral',
          callOI: Math.floor(Math.random() * 800000 + 300000),
          putOI: Math.floor(Math.random() * 800000 + 300000),
          callVolume: Math.floor(Math.random() * 500000 + 100000),
          putVolume: Math.floor(Math.random() * 500000 + 100000)
        });
      }
    }

    // Generate strike-wise PCR
    const strikes = this.generateStrikes(symbol, this.basePrices[symbol], 10);
    strikes.forEach(strike => {
      const callOI = Math.floor(Math.random() * 100000 + 10000);
      const putOI = Math.floor(Math.random() * 100000 + 10000);
      const pcr = putOI / callOI;
      
      data.strikeWisePCR.push({
        strikePrice: strike,
        callOI,
        putOI,
        pcr: Math.round(pcr * 1000) / 1000,
        distanceFromATM: Math.abs(strike - data.currentPrice),
        isATM: Math.abs(strike - data.currentPrice) < this.strikeIntervals[symbol]
      });
    });

    return data;
  }

  /**
   * Generate IV Analysis data
   */
  generateIVAnalysis(symbol) {
    const data = {
      symbols: this.symbols,
      expiries: this.expiries,
      currentPrice: this.basePrices[symbol],
      currentTime: moment().format('HH:mm'),
      lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss'),
      summary: {
        averageCallIV: Math.round((15 + Math.random() * 10) * 100) / 100,
        averagePutIV: Math.round((15 + Math.random() * 10) * 100) / 100,
        highestIV: Math.round((25 + Math.random() * 15) * 100) / 100,
        lowestIV: Math.round((8 + Math.random() * 5) * 100) / 100,
        ivPercentile: Math.round(Math.random() * 100)
      },
      timeSeriesData: [],
      strikeWiseIV: [],
      expiryWiseIV: []
    };

    // Generate intraday IV data
    const intervals = 75;
    for (let i = 0; i < intervals; i++) {
      const time = moment().startOf('day').add(9.25 * 60 + i * 5, 'minutes');
      const baseIV = 18 + Math.random() * 8;
      
      data.timeSeriesData.push({
        time: time.format('HH:mm'),
        timestamp: time.unix() * 1000,
        averageIV: Math.round(baseIV * 100) / 100,
        callIV: Math.round((baseIV + Math.random() * 2 - 1) * 100) / 100,
        putIV: Math.round((baseIV + Math.random() * 2 - 1) * 100) / 100,
        price: data.currentPrice + (Math.random() * 200 - 100),
        volume: Math.floor(Math.random() * 100000 + 20000)
      });
    }

    // Generate strike-wise IV
    const strikes = this.generateStrikes(symbol, this.basePrices[symbol], 15);
    strikes.forEach(strike => {
      const distanceFromATM = Math.abs(strike - data.currentPrice);
      const baseIV = 15 + (distanceFromATM / data.currentPrice) * 50;
      
      data.strikeWiseIV.push({
        strikePrice: strike,
        callIV: Math.round((baseIV + Math.random() * 5) * 100) / 100,
        putIV: Math.round((baseIV + Math.random() * 5) * 100) / 100,
        distanceFromATM,
        isITM: strike < data.currentPrice,
        isOTM: strike > data.currentPrice,
        isATM: Math.abs(strike - data.currentPrice) < this.strikeIntervals[symbol]
      });
    });

    // Generate expiry-wise IV
    this.expiries.forEach(expiry => {
      const daysToExpiry = moment(expiry, 'DD-MM-YYYY').diff(moment(), 'days');
      const timeDecayFactor = Math.max(0.5, 1 - (daysToExpiry / 365));
      const baseIV = 18 * timeDecayFactor + Math.random() * 5;
      
      data.expiryWiseIV.push({
        expiry,
        expiryDate: moment(expiry, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        daysToExpiry,
        averageIV: Math.round(baseIV * 100) / 100,
        callIV: Math.round((baseIV + Math.random() * 2) * 100) / 100,
        putIV: Math.round((baseIV + Math.random() * 2) * 100) / 100,
        totalOI: Math.floor(Math.random() * 1000000 + 500000),
        totalVolume: Math.floor(Math.random() * 500000 + 100000)
      });
    });

    return data;
  }

  /**
   * Generate complete dataset for all symbols and multiple days
   */
  generateCompleteDataset(days = 7) {
    const dataset = {
      metadata: {
        generatedAt: moment().toISOString(),
        symbols: this.symbols,
        expiries: this.expiries,
        intervals: this.intervals,
        ranges: this.ranges,
        dataPoints: 0,
        coverage: {
          days,
          totalRecords: 0
        }
      },
      marketData: {},
      optionsData: {},
      analysisData: {}
    };

    let totalRecords = 0;

    // Generate data for each symbol
    this.symbols.forEach(symbol => {
      console.log(`Generating data for ${symbol}...`);
      
      dataset.marketData[symbol] = {
        currentPrice: this.basePrices[symbol],
        priceHistory: this.generatePriceMovement(this.basePrices[symbol], 0.02, 375),
        strikeInterval: this.strikeIntervals[symbol]
      };

      dataset.optionsData[symbol] = {};
      dataset.analysisData[symbol] = {};

      // Generate options chain for each expiry
      this.expiries.forEach(expiry => {
        dataset.optionsData[symbol][expiry] = this.generateOptionsChain(
          symbol, 
          expiry, 
          this.basePrices[symbol]
        );
        totalRecords += dataset.optionsData[symbol][expiry].length;
      });

      // Generate analysis data
      dataset.analysisData[symbol] = {
        coi: this.generateCOIAnalysis(symbol, this.expiries[0], days),
        oiGainerLooser: this.generateOIGainerLooser(symbol),
        pcr: this.generatePCRAnalysis(symbol, days),
        iv: this.generateIVAnalysis(symbol)
      };

      totalRecords += dataset.analysisData[symbol].coi.timeSeriesData.length;
      totalRecords += dataset.analysisData[symbol].coi.dailyData.length;
      totalRecords += Object.keys(dataset.analysisData[symbol].oiGainerLooser.oiGainer).length * 20;
      totalRecords += dataset.analysisData[symbol].pcr.timeSeriesData.length;
      totalRecords += dataset.analysisData[symbol].pcr.dailyData.length;
      totalRecords += dataset.analysisData[symbol].iv.timeSeriesData.length;
    });

    dataset.metadata.coverage.totalRecords = totalRecords;
    dataset.metadata.dataPoints = totalRecords;

    return dataset;
  }
}

module.exports = DataGenerator;
