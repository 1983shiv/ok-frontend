const axios = require('axios');
const io = require('socket.io-client');

const API_BASE_URL = 'http://localhost:8080';

async function testIntegration() {
  console.log('🧪 Testing TradingOK Backend with Stock Broker Integration...\n');

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Health Check:', healthResponse.data);
    
    if (healthResponse.data.services) {
      console.log('   📊 MongoDB:', healthResponse.data.services.mongodb);
      console.log('   📡 Stock Broker:', healthResponse.data.services.stockBroker);
    }
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  console.log('\n');

  // Test 2: Broker Status
  try {
    console.log('2️⃣ Testing Broker Status...');
    const brokerResponse = await axios.get(`${API_BASE_URL}/api/broker-status`);
    console.log('✅ Broker Status:', brokerResponse.data);
  } catch (error) {
    console.log('❌ Broker Status Failed:', error.message);
  }

  console.log('\n');

  // Test 3: Market Data Stats
  try {
    console.log('3️⃣ Testing Market Data Stats...');
    const statsResponse = await axios.get(`${API_BASE_URL}/api/marketdata/stats`);
    console.log('✅ Market Data Stats:', statsResponse.data);
  } catch (error) {
    console.log('❌ Market Data Stats Failed:', error.message);
  }

  console.log('\n');

  // Test 4: Instruments List
  try {
    console.log('4️⃣ Testing Instruments List...');
    const instrumentsResponse = await axios.get(`${API_BASE_URL}/api/marketdata/instruments?limit=5`);
    console.log('✅ Instruments Count:', instrumentsResponse.data.data?.instruments?.length || 0);
    if (instrumentsResponse.data.data?.instruments?.length > 0) {
      console.log('   Sample Instrument:', instrumentsResponse.data.data.instruments[0]);
    }
  } catch (error) {
    console.log('❌ Instruments List Failed:', error.message);
  }

  console.log('\n');

  // Test 5: WebSocket Connection
  try {
    console.log('5️⃣ Testing WebSocket Connection...');
    const socket = io(API_BASE_URL);
    
    socket.on('connect', () => {
      console.log('✅ WebSocket Connected:', socket.id);
      
      // Subscribe to market data
      socket.emit('subscribe:market', {
        symbols: ['NIFTY', 'BANKNIFTY'],
        intervals: ['1Min']
      });
    });

    socket.on('subscription:confirmed', (data) => {
      console.log('✅ Subscription Confirmed:', data);
    });

    socket.on('market:tick', (data) => {
      console.log('📊 Market Tick Received:', data);
    });

    socket.on('market:data', (data) => {
      console.log('📈 Market Data Received:', Object.keys(data));
    });

    socket.on('disconnect', () => {
      console.log('🔌 WebSocket Disconnected');
    });

    socket.on('error', (error) => {
      console.log('❌ WebSocket Error:', error);
    });

    // Keep connection alive for 10 seconds
    setTimeout(() => {
      socket.disconnect();
      console.log('🔌 WebSocket Test Complete');
    }, 10000);

  } catch (error) {
    console.log('❌ WebSocket Test Failed:', error.message);
  }

  console.log('\n');

  // Test 6: Latest Tick Data
  setTimeout(async () => {
    try {
      console.log('6️⃣ Testing Latest Tick Data (after 12 seconds)...');
      const ticksResponse = await axios.get(`${API_BASE_URL}/api/marketdata/ticks/latest?tokens=256265,256009`);
      console.log('✅ Latest Ticks:', ticksResponse.data.data?.length || 0);
      if (ticksResponse.data.data?.length > 0) {
        console.log('   Sample Tick:', ticksResponse.data.data[0]);
      }
    } catch (error) {
      console.log('❌ Latest Tick Data Failed:', error.message);
    }
  }, 12000);
}

// Run the test
testIntegration().catch(console.error);
