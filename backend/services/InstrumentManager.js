// Instrument Management Service for Stock Broker Integration
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { Instrument } = require('../models/MarketData');

class InstrumentManager {
  constructor(accessToken = null) {
    this.accessToken = accessToken || process.env.UPSTOX_ACCESS_TOKEN;
    this.maxInstruments = 2000;
    this.subscribedInstruments = new Set();
    this.instruments = null; // Cache for NSE.json data
  }

  // Load NSE.json data
  loadNSEData() {
    if (!this.instruments) {
      try {
        const rawData = fs.readFileSync(path.join(__dirname, '..', 'NSE.json'), 'utf-8');
        this.instruments = JSON.parse(rawData);
        console.log(`📊 Loaded ${this.instruments.length} instruments from NSE.json`);
      } catch (error) {
        console.error('❌ Error loading NSE.json:', error.message);
        throw error;
      }
    }
    return this.instruments;
  }

  // Index to instrument key mapping (similar to misc.js)
  getIndexToKeyMapping() {
    return {
      NIFTY: 'NSE_INDEX|Nifty 50',
      BANKNIFTY: 'NSE_INDEX|Nifty Bank',
      FINNIFTY: 'NSE_INDEX|Nifty Fin Service',
      MIDCPNIFTY: 'NSE_INDEX|NIFTY MID SELECT',
    };
  }

  // Format date helper
  formatDate(ts) {
    const date = new Date(ts);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split('T')[0];
  }

  // Get unique expiry dates for an index (similar to misc.js getUniqueExpiry)
  getUniqueExpiry(idx = 'NIFTY', months = 3) {
    const instruments = this.loadNSEData();
    
    const uniqueExpiry = [
      ...new Set(
        instruments
          .filter(item => item.segment === 'NSE_FO' && item.name === idx && item.expiry)
          .map(item => item.expiry)
      )
    ]
    .map(ts => {
      const date = new Date(ts);
      if (isNaN(date)) return null;
      return date;
    })
    .filter(Boolean)
    .filter(date => {
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfRange = new Date(now.getFullYear(), now.getMonth() + (months + 1), 0);
      return date >= startOfCurrentMonth && date <= endOfRange;
    })
    .map(date => date.toISOString().split('T')[0])
    .sort();

    return uniqueExpiry;
  }

  // Get instrument keys for indices (similar to misc.js idxsInstrumentsKey)
  getIdxsInstrumentKeys(idxs = ['NIFTY', 'BANKNIFTY'], expiries = null) {
    const instruments = this.loadNSEData();
    
    if (!expiries) {
      expiries = this.getUniqueExpiry('NIFTY', 1); // Default to 1 month for NIFTY
    }

    const filteredInstrumentKeys = [
      ...new Set(
        instruments
          .filter(item =>
            item.segment === 'NSE_FO' &&
            expiries.includes(new Date(item.expiry).toISOString().split('T')[0]) &&
            idxs.includes(item.asset_symbol)
          )
          .map(item => item.instrument_key)
      )
    ];
    
    return filteredInstrumentKeys;
  }

  // Get complete instrument keys list (similar to instrument.js)
  getInstrumentKeys() {
    const instruments = this.loadNSEData();
    const expiry = this.getUniqueExpiry("NIFTY", 1);
    const idx = ["NIFTY", "BANKNIFTY"];
    const indexToKey = this.getIndexToKeyMapping();
    
    // Index instrument keys
    const idx_index = [
      indexToKey.NIFTY,
      indexToKey.BANKNIFTY,
      indexToKey.FINNIFTY,
      indexToKey.MIDCPNIFTY
    ];
    
    // Get instrument keys for indices
    const instrument_keys_part = this.getIdxsInstrumentKeys(idx, expiry);
    
    // Combine index and instrument keys
    const instrument_keys = [...idx_index, ...instrument_keys_part];
    
    console.log(`🔑 Generated ${instrument_keys.length} instrument keys (${idx_index.length} indices + ${instrument_keys_part.length} derivatives)`);
    
    return instrument_keys;
  }

  // Get instrument keys with more flexible options
  getInstrumentKeysAdvanced(options = {}) {
    const {
      indices = ["NIFTY", "BANKNIFTY"],
      months = 1,
      includeIndexKeys = true,
      includeFinNifty = false,
      includeMidCpNifty = false
    } = options;

    const instruments = this.loadNSEData();
    const indexToKey = this.getIndexToKeyMapping();
    
    // Build index keys array
    let idx_index = [];
    if (includeIndexKeys) {
      idx_index.push(indexToKey.NIFTY, indexToKey.BANKNIFTY);
      if (includeFinNifty) idx_index.push(indexToKey.FINNIFTY);
      if (includeMidCpNifty) idx_index.push(indexToKey.MIDCPNIFTY);
    }
    
    // Get expiry dates
    const expiry = this.getUniqueExpiry("NIFTY", months);
    
    // Get instrument keys for derivatives
    const instrument_keys_part = this.getIdxsInstrumentKeys(indices, expiry);
    
    // Combine all keys
    const instrument_keys = [...idx_index, ...instrument_keys_part];
    
    console.log(`🔑 Generated ${instrument_keys.length} instrument keys with advanced options`);
    console.log(`   - Index keys: ${idx_index.length}`);
    console.log(`   - Derivative keys: ${instrument_keys_part.length}`);
    console.log(`   - Expiries: ${expiry.join(', ')}`);
    
    return {
      instrumentKeys: instrument_keys,
      indexKeys: idx_index,
      derivativeKeys: instrument_keys_part,
      expiries: expiry,
      summary: {
        total: instrument_keys.length,
        indices: idx_index.length,
        derivatives: instrument_keys_part.length
      }
    };
  }

  // Get current week Thursday (current week expiry)
  getCurrentWeekExpiry() {
    const today = moment();
    const thursday = today.clone().day(4); // Thursday is day 4
    
    // If today is after Thursday, get next Thursday
    if (today.day() > 4 || (today.day() === 4 && today.hour() >= 15)) {
      thursday.add(1, 'week');
    }
    
    return thursday.format('YYYY-MM-DD');
  }

  // Get next week Thursday (next week expiry)
  getNextWeekExpiry() {
    const currentWeekExpiry = moment(this.getCurrentWeekExpiry());
    return currentWeekExpiry.add(1, 'week').format('YYYY-MM-DD');
  }

  // Get current month last Thursday (monthly expiry)
  getCurrentMonthExpiry() {
    const today = moment();
    const lastThursday = today.clone().endOf('month');
    
    // Find the last Thursday of the month
    while (lastThursday.day() !== 4) {
      lastThursday.subtract(1, 'day');
    }
    
    // If current month's expiry is past, get next month
    if (today.isAfter(lastThursday)) {
      const nextMonth = today.clone().add(1, 'month');
      const nextMonthLastThursday = nextMonth.endOf('month');
      while (nextMonthLastThursday.day() !== 4) {
        nextMonthLastThursday.subtract(1, 'day');
      }
      return nextMonthLastThursday.format('YYYY-MM-DD');
    }
    
    return lastThursday.format('YYYY-MM-DD');
  }

  // Fetch instruments from Upstox API
  async fetchInstrumentsFromAPI() {
    try {
      const url = 'https://api.upstox.com/v3/instrument/exchange';
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      };

      console.log('📡 Fetching instruments from Upstox API...');
      const response = await axios.get(url, { headers });
      
      if (response.data && response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error('Failed to fetch instruments from API');
      }
    } catch (error) {
      console.error('❌ Error fetching instruments:', error.message);
      throw error;
    }
  }

  // Filter instruments based on our criteria
  filterInstruments(allInstruments) {
    const currentWeekExpiry = this.getCurrentWeekExpiry();
    const nextWeekExpiry = this.getNextWeekExpiry();
    const currentMonthExpiry = this.getCurrentMonthExpiry();

    console.log('📅 Target Expiries:');
    console.log(`   Current Week: ${currentWeekExpiry}`);
    console.log(`   Next Week: ${nextWeekExpiry}`);
    console.log(`   Current Month: ${currentMonthExpiry}`);

    const filteredInstruments = [];

    allInstruments.forEach(instrument => {
      const { instrument_key, name, expiry, segment, instrument_type } = instrument;

      // Skip if not NSE options/futures
      if (!segment || !segment.includes('NSE_FO')) {
        return;
      }

      // Parse expiry date
      const expiryDate = moment(expiry).format('YYYY-MM-DD');

      // NIFTY options for current week and next week
      if (name && name.includes('NIFTY') && !name.includes('BANK') && !name.includes('FIN')) {
        if ((expiryDate === currentWeekExpiry || expiryDate === nextWeekExpiry) && 
            (instrument_type === 'CE' || instrument_type === 'PE')) {
          filteredInstruments.push({
            instrumentKey: instrument_key,
            name: name,
            symbol: 'NIFTY',
            expiry: new Date(expiry),
            strike: parseFloat(instrument.strike) || 0,
            optionType: instrument_type,
            segment: segment,
            exchange: 'NSE'
          });
        }
      }

      // BANKNIFTY, FINNIFTY, MIDCPNIFTY for current month expiry
      if (name && (name.includes('BANKNIFTY') || name.includes('FINNIFTY') || name.includes('MIDCPNIFTY'))) {
        if (expiryDate === currentMonthExpiry && 
            (instrument_type === 'CE' || instrument_type === 'PE')) {
          
          let symbol = 'BANKNIFTY';
          if (name.includes('FINNIFTY')) symbol = 'FINNIFTY';
          if (name.includes('MIDCPNIFTY')) symbol = 'MIDCPNIFTY';

          filteredInstruments.push({
            instrumentKey: instrument_key,
            name: name,
            symbol: symbol,
            expiry: new Date(expiry),
            strike: parseFloat(instrument.strike) || 0,
            optionType: instrument_type,
            segment: segment,
            exchange: 'NSE'
          });
        }
      }

      // Add indices for reference
      if (name === 'Nifty 50' || name === 'Nifty Bank') {
        filteredInstruments.push({
          instrumentKey: instrument_key,
          name: name,
          symbol: name === 'Nifty 50' ? 'NIFTY' : 'BANKNIFTY',
          expiry: null,
          strike: 0,
          optionType: 'INDEX',
          segment: segment,
          exchange: 'NSE'
        });
      }
    });

    // Limit to 2000 instruments
    if (filteredInstruments.length > this.maxInstruments) {
      console.log(`⚠️ Found ${filteredInstruments.length} instruments, limiting to ${this.maxInstruments}`);
      
      // Prioritize: Indices first, then ATM strikes, then OTM
      filteredInstruments.sort((a, b) => {
        // Indices first
        if (a.optionType === 'INDEX' && b.optionType !== 'INDEX') return -1;
        if (b.optionType === 'INDEX' && a.optionType !== 'INDEX') return 1;
        
        // Then by symbol priority: NIFTY > BANKNIFTY > others
        const symbolPriority = { 'NIFTY': 3, 'BANKNIFTY': 2, 'FINNIFTY': 1, 'MIDCPNIFTY': 0 };
        const aPriority = symbolPriority[a.symbol] || 0;
        const bPriority = symbolPriority[b.symbol] || 0;
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        
        // Then by expiry (closer expiry first)
        if (a.expiry && b.expiry) {
          return new Date(a.expiry) - new Date(b.expiry);
        }
        
        return 0;
      });

      return filteredInstruments.slice(0, this.maxInstruments);
    }

    return filteredInstruments;
  }

  // Save instruments to database
  async saveInstrumentsToDatabase(instruments) {
    try {
      console.log('💾 Saving instruments to database...');
      
      // Clear existing instruments
      await Instrument.deleteMany({});
      
      // Insert new instruments
      const instrumentDocs = instruments.map(inst => ({
        ...inst,
        isActive: true,
        subscribed: false,
        lastUpdated: new Date()
      }));

      await Instrument.insertMany(instrumentDocs);
      
      console.log(`✅ Saved ${instruments.length} instruments to database`);
      return instruments;
    } catch (error) {
      console.error('❌ Error saving instruments to database:', error.message);
      throw error;
    }
  }

  // Get subscription list (instrument keys for WebSocket)
  async getSubscriptionList() {
    try {
      const instruments = await Instrument.find({ isActive: true }).lean();
      const instrumentKeys = instruments.map(inst => inst.instrumentKey);
      
      console.log(`📋 Generated subscription list with ${instrumentKeys.length} instruments`);
      
      // Log summary by symbol
      const summary = instruments.reduce((acc, inst) => {
        acc[inst.symbol] = (acc[inst.symbol] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Subscription Summary:', summary);
      
      return {
        instrumentKeys,
        instruments,
        summary
      };
    } catch (error) {
      console.error('❌ Error getting subscription list:', error.message);
      throw error;
    }
  }

  // Initialize instrument master data
  async initializeInstruments() {
    try {
      console.log('🚀 Initializing instrument master data...');
      
      // Check if we already have instruments for today
      const todayStart = moment().startOf('day').toDate();
      const existingCount = await Instrument.countDocuments({
        lastUpdated: { $gte: todayStart }
      });

      if (existingCount > 0) {
        console.log(`✅ Found ${existingCount} existing instruments for today`);
        return await this.getSubscriptionList();
      }

      // Fetch fresh instruments from API
      const allInstruments = await this.fetchInstrumentsFromAPI();
      console.log(`📡 Fetched ${allInstruments.length} total instruments from API`);

      // Filter instruments based on our criteria
      const filteredInstruments = this.filterInstruments(allInstruments);
      console.log(`🔍 Filtered to ${filteredInstruments.length} relevant instruments`);

      // Save to database
      await this.saveInstrumentsToDatabase(filteredInstruments);

      // Return subscription list
      return await this.getSubscriptionList();
    } catch (error) {
      console.error('❌ Error initializing instruments:', error.message);
      throw error;
    }
  }

  // Mark instruments as subscribed
  async markAsSubscribed(instrumentKeys) {
    try {
      await Instrument.updateMany(
        { instrumentKey: { $in: instrumentKeys } },
        { subscribed: true, lastUpdated: new Date() }
      );
      
      instrumentKeys.forEach(key => this.subscribedInstruments.add(key));
      console.log(`✅ Marked ${instrumentKeys.length} instruments as subscribed`);
    } catch (error) {
      console.error('❌ Error marking instruments as subscribed:', error.message);
    }
  }

  // Get subscribed instruments
  getSubscribedInstruments() {
    return Array.from(this.subscribedInstruments);
  }

  // Get instrument keys for WebSocket subscription (combines both approaches)
  async getInstrumentKeysForSubscription(useNSEData = true) {
    try {
      if (useNSEData) {
        // Use NSE.json data approach (like instrument.js/misc.js)
        console.log('📋 Generating subscription list from NSE.json data...');
        const result = this.getInstrumentKeysAdvanced({
          indices: ["NIFTY", "BANKNIFTY"],
          months: 1,
          includeIndexKeys: true,
          includeFinNifty: true,
          includeMidCpNifty: true
        });
        
        return {
          instrumentKeys: result.instrumentKeys,
          instruments: [], // NSE.json doesn't have full instrument objects
          summary: result.summary,
          source: 'NSE.json'
        };
      } else {
        // Use existing database approach
        console.log('📋 Generating subscription list from database...');
        return await this.getSubscriptionList();
      }
    } catch (error) {
      console.error('❌ Error getting instrument keys for subscription:', error.message);
      throw error;
    }
  }

  // Static method to get instrument keys without instantiation (like instrument.js export)
  static getStaticInstrumentKeys() {
    const manager = new InstrumentManager();
    return manager.getInstrumentKeys();
  }
}

module.exports = InstrumentManager;
