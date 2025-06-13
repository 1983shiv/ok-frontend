const express = require('express');
const router = express.Router();
const { MarketTick, Instrument, OHLC, MarketStatus } = require('../models/MarketData');

// Get current market status
router.get('/status', async (req, res) => {
  try {
    const status = await MarketStatus.findOne().sort({ timestamp: -1 });
    res.json({
      success: true,
      data: status || { isOpen: false, message: 'Market status not available' }
    });
  } catch (error) {
    console.error('Error fetching market status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market status'
    });
  }
});

// Get instruments list with optional filtering
router.get('/instruments', async (req, res) => {
  try {
    const { 
      symbol, 
      segment, 
      instrument_type, 
      expiry,
      limit = 100,
      page = 1 
    } = req.query;

    const filter = {};
    if (symbol) filter.symbol = symbol;
    if (segment) filter.segment = segment;
    if (instrument_type) filter.instrument_type = instrument_type;
    if (expiry) filter.expiry = expiry;

    const skip = (page - 1) * limit;
    const instruments = await Instrument.find(filter)
      .sort({ symbol: 1, strike: 1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Instrument.countDocuments(filter);

    res.json({
      success: true,
      data: {
        instruments,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching instruments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch instruments'
    });
  }
});

// Get latest tick data for specific instruments
router.get('/ticks/latest', async (req, res) => {
  try {
    const { tokens } = req.query;
    
    if (!tokens) {
      return res.status(400).json({
        success: false,
        error: 'tokens parameter is required'
      });
    }

    const tokenList = tokens.split(',').map(t => parseInt(t.trim()));
    
    const latestTicks = await MarketTick.aggregate([
      {
        $match: {
          token: { $in: tokenList }
        }
      },
      {
        $sort: { token: 1, timestamp: -1 }
      },
      {
        $group: {
          _id: '$token',
          latest: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latest' }
      }
    ]);

    res.json({
      success: true,
      data: latestTicks
    });
  } catch (error) {
    console.error('Error fetching latest ticks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest tick data'
    });
  }
});

// Get historical tick data
router.get('/ticks/history', async (req, res) => {
  try {
    const { 
      token, 
      startTime, 
      endTime, 
      limit = 1000,
      page = 1 
    } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'token parameter is required'
      });
    }

    const filter = { token: parseInt(token) };
    
    if (startTime) {
      filter.timestamp = { $gte: new Date(startTime) };
    }
    
    if (endTime) {
      filter.timestamp = { 
        ...filter.timestamp, 
        $lte: new Date(endTime) 
      };
    }

    const skip = (page - 1) * limit;
    const ticks = await MarketTick.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await MarketTick.countDocuments(filter);

    res.json({
      success: true,
      data: {
        ticks,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching historical ticks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical tick data'
    });
  }
});

// Get OHLC data
router.get('/ohlc', async (req, res) => {
  try {
    const { 
      token, 
      timeframe = '1Min',
      startTime, 
      endTime, 
      limit = 100,
      page = 1 
    } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'token parameter is required'
      });
    }

    const filter = { 
      token: parseInt(token),
      timeframe: timeframe
    };
    
    if (startTime) {
      filter.timestamp = { $gte: new Date(startTime) };
    }
    
    if (endTime) {
      filter.timestamp = { 
        ...filter.timestamp, 
        $lte: new Date(endTime) 
      };
    }

    const skip = (page - 1) * limit;
    const ohlcData = await OHLC.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await OHLC.countDocuments(filter);

    res.json({
      success: true,
      data: {
        ohlc: ohlcData,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching OHLC data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch OHLC data'
    });
  }
});

// Get market statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      // Total instruments
      Instrument.countDocuments(),
      
      // Total ticks today
      MarketTick.countDocuments({
        timestamp: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      
      // Active instruments (received data in last 5 minutes)
      MarketTick.distinct('token', {
        timestamp: {
          $gte: new Date(Date.now() - 5 * 60 * 1000)
        }
      }),
      
      // Latest market status
      MarketStatus.findOne().sort({ timestamp: -1 })
    ]);

    res.json({
      success: true,
      data: {
        totalInstruments: stats[0],
        ticksToday: stats[1],
        activeInstruments: stats[2].length,
        marketStatus: stats[3]
      }
    });
  } catch (error) {
    console.error('Error fetching market statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market statistics'
    });
  }
});

// Search instruments
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }

    const searchRegex = new RegExp(query, 'i');
    const instruments = await Instrument.find({
      $or: [
        { symbol: searchRegex },
        { company_name: searchRegex },
        { trading_symbol: searchRegex }
      ]
    })
    .limit(parseInt(limit))
    .sort({ symbol: 1 });

    res.json({
      success: true,
      data: instruments
    });
  } catch (error) {
    console.error('Error searching instruments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search instruments'
    });
  }
});

module.exports = router;
