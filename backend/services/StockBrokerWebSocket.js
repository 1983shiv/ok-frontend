// Stock Broker WebSocket Service for Live Market Data
const WebSocket = require("ws").WebSocket;
const protobuf = require("protobufjs");
const axios = require("axios");
const path = require("path");
const { MarketTick, MarketStatus } = require('../models/MarketData');

class StockBrokerWebSocket {
  constructor(instrumentManager, socketIOServer) {
    this.instrumentManager = instrumentManager;
    this.io = socketIOServer;
    this.accessToken = process.env.UPSTOX_ACCESS_TOKEN;
    this.ws = null;
    this.protobufRoot = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.subscriptionList = [];
    
    // Data processing statistics
    this.stats = {
      messagesReceived: 0,
      ticksProcessed: 0,
      errorCount: 0,
      lastMessageTime: null,
      startTime: new Date()
    };
  }

  // Initialize protobuf
  async initProtobuf() {
    try {
      const protoPath = path.join(__dirname, '..', 'MarketDataFeedV3.proto');
      this.protobufRoot = await protobuf.load(protoPath);
      console.log('✅ Protobuf initialization complete');
      return true;
    } catch (error) {
      console.error('❌ Protobuf initialization failed:', error.message);
      throw error;
    }
  }

  // Get market feed authorization URL
  async getMarketFeedUrl() {
    try {
      const url = "https://api.upstox.com/v3/feed/market-data-feed/authorize";
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      };
      
      console.log('🔑 Getting market feed authorization...');
      const response = await axios.get(url, { headers });
      
      if (response.data && response.data.status === 'success') {
        console.log('✅ Market feed authorization successful');
        return response.data.data.authorizedRedirectUri;
      } else {
        throw new Error('Failed to get market feed authorization');
      }
    } catch (error) {
      console.error('❌ Market feed authorization failed:', error.message);
      throw error;
    }
  }

  // Decode protobuf message
  decodeProfobuf(buffer) {
    try {
      if (!this.protobufRoot) {
        console.warn("⚠️ Protobuf not initialized yet!");
        return null;
      }

      const FeedResponse = this.protobufRoot.lookupType(
        "com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse"
      );
      
      return FeedResponse.decode(buffer);
    } catch (error) {
      console.error('❌ Error decoding protobuf:', error.message);
      this.stats.errorCount++;
      return null;
    }
  }

  // Process market feed data
  async processFeedData(feedResponse) {
    try {
      if (!feedResponse || !feedResponse.feeds) {
        return;
      }

      this.stats.messagesReceived++;
      this.stats.lastMessageTime = new Date();

      // Process market status updates
      if (feedResponse.marketInfo && feedResponse.marketInfo.segmentStatus) {
        await this.processMarketStatus(feedResponse.marketInfo.segmentStatus);
      }

      // Process feed data for each instrument
      const feeds = feedResponse.feeds;
      const ticksToSave = [];
      const ticksToEmit = [];

      for (const [instrumentKey, feed] of Object.entries(feeds)) {
        try {
          const tickData = await this.processSingleFeed(instrumentKey, feed, feedResponse.currentTs);
          if (tickData) {
            ticksToSave.push(tickData);
            ticksToEmit.push(tickData);
          }
        } catch (error) {
          console.error(`❌ Error processing feed for ${instrumentKey}:`, error.message);
          this.stats.errorCount++;
        }
      }

      // Batch save to MongoDB
      if (ticksToSave.length > 0) {
        await this.saveTicks(ticksToSave);
        this.stats.ticksProcessed += ticksToSave.length;
      }

      // Emit to frontend via Socket.IO
      if (ticksToEmit.length > 0) {
        this.emitToFrontend(ticksToEmit);
      }

    } catch (error) {
      console.error('❌ Error processing feed data:', error.message);
      this.stats.errorCount++;
    }
  }

  // Process single instrument feed
  async processSingleFeed(instrumentKey, feed, timestamp) {
    try {
      if (!feed.FeedUnion) {
        return null;
      }

      const tickData = {
        instrumentKey: instrumentKey,
        timestamp: new Date(timestamp || Date.now())
      };

      // Process LTPC data
      if (feed.FeedUnion.ltpc) {
        const ltpc = feed.FeedUnion.ltpc;
        tickData.ltp = ltpc.ltp;
        tickData.ltt = new Date(ltpc.ltt);
        tickData.ltq = ltpc.ltq;
        tickData.cp = ltpc.cp;
      }

      // Process Full Feed data
      if (feed.FeedUnion.fullFeed) {
        const fullFeed = feed.FeedUnion.fullFeed;

        if (fullFeed.FullFeedUnion.marketFF) {
          const marketFF = fullFeed.FullFeedUnion.marketFF;
          
          // LTPC data
          if (marketFF.ltpc) {
            tickData.ltp = marketFF.ltpc.ltp;
            tickData.ltt = new Date(marketFF.ltpc.ltt);
            tickData.ltq = marketFF.ltpc.ltq;
            tickData.cp = marketFF.ltpc.cp;
          }

          // Market Level (Bid/Ask)
          if (marketFF.marketLevel && marketFF.marketLevel.bidAskQuote && marketFF.marketLevel.bidAskQuote.length > 0) {
            const quote = marketFF.marketLevel.bidAskQuote[0];
            tickData.bidPrice = quote.bidP;
            tickData.bidQty = quote.bidQ;
            tickData.askPrice = quote.askP;
            tickData.askQty = quote.askQ;
          }

          // Option Greeks
          if (marketFF.optionGreeks) {
            tickData.delta = marketFF.optionGreeks.delta;
            tickData.theta = marketFF.optionGreeks.theta;
            tickData.gamma = marketFF.optionGreeks.gamma;
            tickData.vega = marketFF.optionGreeks.vega;
            tickData.rho = marketFF.optionGreeks.rho;
          }

          // Market OHLC
          if (marketFF.marketOHLC && marketFF.marketOHLC.ohlc && marketFF.marketOHLC.ohlc.length > 0) {
            const ohlc = marketFF.marketOHLC.ohlc[0];
            tickData.open = ohlc.open;
            tickData.high = ohlc.high;
            tickData.low = ohlc.low;
            tickData.close = ohlc.close;
            tickData.volume = ohlc.vol;
          }

          // Additional market data
          tickData.avgTradedPrice = marketFF.atp;
          tickData.volumeTradedToday = marketFF.vtt;
          tickData.openInterest = marketFF.oi;
          tickData.impliedVolatility = marketFF.iv;
          tickData.totalBuyQty = marketFF.tbq;
          tickData.totalSellQty = marketFF.tsq;
        }

        if (fullFeed.FullFeedUnion.indexFF) {
          const indexFF = fullFeed.FullFeedUnion.indexFF;
          
          // LTPC data for index
          if (indexFF.ltpc) {
            tickData.ltp = indexFF.ltpc.ltp;
            tickData.ltt = new Date(indexFF.ltpc.ltt);
            tickData.ltq = indexFF.ltpc.ltq;
            tickData.cp = indexFF.ltpc.cp;
          }

          // Index OHLC
          if (indexFF.marketOHLC && indexFF.marketOHLC.ohlc && indexFF.marketOHLC.ohlc.length > 0) {
            const ohlc = indexFF.marketOHLC.ohlc[0];
            tickData.open = ohlc.open;
            tickData.high = ohlc.high;
            tickData.low = ohlc.low;
            tickData.close = ohlc.close;
            tickData.volume = ohlc.vol;
          }
        }
      }

      // Process First Level with Greeks
      if (feed.FeedUnion.firstLevelWithGreeks) {
        const flwg = feed.FeedUnion.firstLevelWithGreeks;
        
        if (flwg.ltpc) {
          tickData.ltp = flwg.ltpc.ltp;
          tickData.ltt = new Date(flwg.ltpc.ltt);
          tickData.ltq = flwg.ltpc.ltq;
          tickData.cp = flwg.ltpc.cp;
        }

        if (flwg.firstDepth) {
          tickData.bidPrice = flwg.firstDepth.bidP;
          tickData.bidQty = flwg.firstDepth.bidQ;
          tickData.askPrice = flwg.firstDepth.askP;
          tickData.askQty = flwg.firstDepth.askQ;
        }

        if (flwg.optionGreeks) {
          tickData.delta = flwg.optionGreeks.delta;
          tickData.theta = flwg.optionGreeks.theta;
          tickData.gamma = flwg.optionGreeks.gamma;
          tickData.vega = flwg.optionGreeks.vega;
          tickData.rho = flwg.optionGreeks.rho;
        }

        tickData.volumeTradedToday = flwg.vtt;
        tickData.openInterest = flwg.oi;
        tickData.impliedVolatility = flwg.iv;
      }

      // Get instrument details from database
      const instrument = await this.getInstrumentDetails(instrumentKey);
      if (instrument) {
        tickData.symbol = instrument.symbol;
        tickData.expiry = instrument.expiry;
        tickData.strike = instrument.strike;
        tickData.optionType = instrument.optionType;
      }

      tickData.dataType = 'TICK';
      return tickData;

    } catch (error) {
      console.error(`❌ Error processing single feed for ${instrumentKey}:`, error.message);
      return null;
    }
  }

  // Get instrument details from cache or database
  async getInstrumentDetails(instrumentKey) {
    try {
      // TODO: Implement caching here for better performance
      const instrument = await this.instrumentManager.instrumentManager?.Instrument?.findOne({ instrumentKey });
      return instrument;
    } catch (error) {
      console.error(`❌ Error getting instrument details for ${instrumentKey}:`, error.message);
      return null;
    }
  }

  // Process market status updates
  async processMarketStatus(segmentStatus) {
    try {
      const statusUpdates = [];
      
      for (const [segment, status] of Object.entries(segmentStatus)) {
        statusUpdates.push({
          segment,
          status,
          timestamp: new Date()
        });
      }

      if (statusUpdates.length > 0) {
        await MarketStatus.insertMany(statusUpdates);
        
        // Emit market status to frontend
        this.io.emit('market_status_update', {
          segments: statusUpdates,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('❌ Error processing market status:', error.message);
    }
  }

  // Save ticks to MongoDB
  async saveTicks(ticks) {
    try {
      if (ticks.length === 0) return;

      await MarketTick.insertMany(ticks, { ordered: false });
    } catch (error) {
      // Handle duplicate key errors gracefully
      if (error.code !== 11000) {
        console.error('❌ Error saving ticks to MongoDB:', error.message);
      }
    }
  }

  // Emit data to frontend via Socket.IO
  emitToFrontend(ticks) {
    try {
      // Group ticks by symbol for efficient transmission
      const groupedTicks = ticks.reduce((acc, tick) => {
        const key = tick.symbol || 'UNKNOWN';
        if (!acc[key]) acc[key] = [];
        acc[key].push(tick);
        return acc;
      }, {});

      // Emit grouped data
      for (const [symbol, symbolTicks] of Object.entries(groupedTicks)) {
        this.io.emit('market_data_update', {
          symbol,
          ticks: symbolTicks,
          timestamp: new Date()
        });
      }

      // Emit summary stats periodically
      if (this.stats.messagesReceived % 100 === 0) {
        this.io.emit('data_stats', this.getStats());
      }
    } catch (error) {
      console.error('❌ Error emitting data to frontend:', error.message);
    }
  }

  // Establish WebSocket connection
  async connectWebSocket() {
    try {
      console.log('🔌 Establishing WebSocket connection...');
      
      const wsUrl = await this.getMarketFeedUrl();
      
      return new Promise((resolve, reject) => {
        this.ws = new WebSocket(wsUrl, {
          followRedirects: true,
        });

        // Connection timeout
        const connectionTimeout = setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 30000);

        this.ws.on("open", () => {
          clearTimeout(connectionTimeout);
          console.log("✅ WebSocket connected to stock broker");
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve(this.ws);

          // Subscribe to instruments after connection
          this.subscribeToInstruments();
        });

        this.ws.on("close", () => {
          console.log("❌ WebSocket disconnected from stock broker");
          this.isConnected = false;
          this.scheduleReconnect();
        });

        this.ws.on("message", (data) => {
          const decodedData = this.decodeProfobuf(data);
          if (decodedData) {
            this.processFeedData(decodedData);
          }
        });

        this.ws.on("error", (error) => {
          clearTimeout(connectionTimeout);
          console.error("❌ WebSocket error:", error.message);
          this.stats.errorCount++;
          this.isConnected = false;
          reject(error);
        });
      });
    } catch (error) {
      console.error('❌ Error connecting WebSocket:', error.message);
      throw error;
    }
  }

  // Subscribe to instruments
  async subscribeToInstruments() {
    try {
      if (!this.isConnected || !this.ws) {
        console.warn('⚠️ Cannot subscribe - WebSocket not connected');
        return;
      }

      const subscriptionData = await this.instrumentManager.getSubscriptionList();
      this.subscriptionList = subscriptionData.instrumentKeys;

      if (this.subscriptionList.length === 0) {
        console.warn('⚠️ No instruments to subscribe to');
        return;
      }

      console.log(`📡 Subscribing to ${this.subscriptionList.length} instruments...`);

      const subscriptionMessage = {
        guid: "tradingok_" + Date.now(),
        method: "sub",
        data: {
          mode: "full",
          instrumentKeys: this.subscriptionList,
        },
      };

      this.ws.send(Buffer.from(JSON.stringify(subscriptionMessage)));
      
      // Mark instruments as subscribed
      await this.instrumentManager.markAsSubscribed(this.subscriptionList);
      
      console.log('✅ Subscription request sent');
      console.log('📊 Subscription Summary:', subscriptionData.summary);

    } catch (error) {
      console.error('❌ Error subscribing to instruments:', error.message);
    }
  }

  // Schedule reconnection
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * this.reconnectAttempts;
    
    console.log(`🔄 Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    setTimeout(async () => {
      try {
        await this.connectWebSocket();
      } catch (error) {
        console.error('❌ Reconnection failed:', error.message);
      }
    }, delay);
  }

  // Get connection and processing statistics
  getStats() {
    const uptime = Date.now() - this.stats.startTime.getTime();
    return {
      isConnected: this.isConnected,
      uptime: Math.floor(uptime / 1000),
      messagesReceived: this.stats.messagesReceived,
      ticksProcessed: this.stats.ticksProcessed,
      errorCount: this.stats.errorCount,
      lastMessageTime: this.stats.lastMessageTime,
      subscribedInstruments: this.subscriptionList.length,
      messagesPerSecond: this.stats.messagesReceived / (uptime / 1000),
      ticksPerSecond: this.stats.ticksProcessed / (uptime / 1000)
    };
  }

  // Initialize the complete system
  async initialize() {
    try {
      console.log('🚀 Initializing Stock Broker WebSocket Service...');

      // Initialize protobuf
      await this.initProtobuf();

      // Initialize instruments
      await this.instrumentManager.initializeInstruments();

      // Connect WebSocket
      await this.connectWebSocket();

      console.log('✅ Stock Broker WebSocket Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Stock Broker WebSocket Service:', error.message);
      throw error;
    }
  }

  // Graceful shutdown
  async shutdown() {
    try {
      console.log('🛑 Shutting down Stock Broker WebSocket Service...');
      
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      
      this.isConnected = false;
      console.log('✅ Stock Broker WebSocket Service shutdown complete');
    } catch (error) {
      console.error('❌ Error during shutdown:', error.message);
    }
  }
}

module.exports = StockBrokerWebSocket;
