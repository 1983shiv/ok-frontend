// MongoDB Models for Market Data Storage
const mongoose = require('mongoose');

// Schema for live market tick data
const MarketTickSchema = new mongoose.Schema({
  instrumentKey: {
    type: String,
    required: true,
    index: true
  },
  symbol: {
    type: String,
    required: true,
    index: true
  },
  expiry: {
    type: Date,
    index: true
  },
  strike: {
    type: Number,
    index: true
  },
  optionType: {
    type: String,
    enum: ['CE', 'PE', 'FUT', 'INDEX'],
    index: true
  },
  // LTPC Data
  ltp: {
    type: Number,
    required: true
  },
  ltt: {
    type: Date,
    required: true
  },
  ltq: {
    type: Number,
    required: true
  },
  cp: {
    type: Number,
    required: true
  },
  // Market Data
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
  
  // Options specific data
  openInterest: Number,
  impliedVolatility: Number,
  delta: Number,
  theta: Number,
  gamma: Number,
  vega: Number,
  rho: Number,
  
  // Market Level data
  bidPrice: Number,
  bidQty: Number,
  askPrice: Number,
  askQty: Number,
  
  // Additional fields
  avgTradedPrice: Number,
  volumeTradedToday: Number,
  totalBuyQty: Number,
  totalSellQty: Number,
  
  // Metadata
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  dataType: {
    type: String,
    enum: ['TICK', 'MINUTE', 'HOURLY', 'DAILY'],
    default: 'TICK',
    index: true
  }
}, {
  timestamps: true,
  collection: 'market_ticks'
});

// Indexes for performance
MarketTickSchema.index({ instrumentKey: 1, timestamp: -1 });
MarketTickSchema.index({ symbol: 1, expiry: 1, timestamp: -1 });
MarketTickSchema.index({ symbol: 1, optionType: 1, expiry: 1, strike: 1 });

// Schema for instrument master data
const InstrumentSchema = new mongoose.Schema({
  instrumentKey: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  symbol: {
    type: String,
    required: true,
    index: true
  },
  expiry: {
    type: Date,
    index: true
  },
  strike: {
    type: Number,
    index: true
  },
  optionType: {
    type: String,
    enum: ['CE', 'PE', 'FUT', 'INDEX'],
    index: true
  },
  lotSize: {
    type: Number,
    default: 1
  },
  segment: {
    type: String,
    index: true
  },
  exchange: {
    type: String,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  subscribed: {
    type: Boolean,
    default: false,
    index: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'instruments'
});

// Schema for aggregated OHLC data
const OHLCSchema = new mongoose.Schema({
  instrumentKey: {
    type: String,
    required: true,
    index: true
  },
  symbol: {
    type: String,
    required: true,
    index: true
  },
  interval: {
    type: String,
    required: true,
    enum: ['1m', '3m', '5m', '15m', '1h', '1d'],
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  open: {
    type: Number,
    required: true
  },
  high: {
    type: Number,
    required: true
  },
  low: {
    type: Number,
    required: true
  },
  close: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    default: 0
  },
  openInterest: Number,
  vwap: Number
}, {
  timestamps: true,
  collection: 'ohlc_data'
});

OHLCSchema.index({ instrumentKey: 1, interval: 1, timestamp: -1 });

// Schema for market status tracking
const MarketStatusSchema = new mongoose.Schema({
  segment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['PRE_OPEN_START', 'PRE_OPEN_END', 'NORMAL_OPEN', 'NORMAL_CLOSE', 'CLOSING_START', 'CLOSING_END']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'market_status'
});

// Models
const MarketTick = mongoose.model('MarketTick', MarketTickSchema);
const Instrument = mongoose.model('Instrument', InstrumentSchema);
const OHLC = mongoose.model('OHLC', OHLCSchema);
const MarketStatus = mongoose.model('MarketStatus', MarketStatusSchema);

module.exports = {
  MarketTick,
  Instrument,
  OHLC,
  MarketStatus
};
