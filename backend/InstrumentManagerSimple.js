// Simplified InstrumentManager for testing NSE.json functionality
const fs = require('fs');
const path = require('path');

class InstrumentManagerSimple {
  constructor() {
    this.instruments = null;
  }

  // Load NSE.json data
  loadNSEData() {
    if (!this.instruments) {
      try {
        const rawData = fs.readFileSync('NSE.json', 'utf-8');
        this.instruments = JSON.parse(rawData);
        console.log(`📊 Loaded ${this.instruments.length} instruments from NSE.json`);
      } catch (error) {
        console.error('❌ Error loading NSE.json:', error.message);
        throw error;
      }
    }
    return this.instruments;
  }

  // Index to instrument key mapping
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

  // Get unique expiry dates for an index
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

  // Get instrument keys for indices
  getIdxsInstrumentKeys(idxs = ['NIFTY', 'BANKNIFTY'], expiries = null) {
    const instruments = this.loadNSEData();
    
    if (!expiries) {
      expiries = this.getUniqueExpiry('NIFTY', 1);
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

  // Get complete instrument keys list (like instrument.js)
  getInstrumentKeys() {
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
}

module.exports = InstrumentManagerSimple;
