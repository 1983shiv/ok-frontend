const mongoose = require('mongoose');
require('dotenv').config();

async function validateSetup() {
  console.log('🔍 Validating TradingOK Backend Setup...\n');

  // Check environment variables
  console.log('1️⃣ Checking Environment Variables...');
  const requiredEnvVars = ['UPSTOX_ACCESS_TOKEN', 'MONGODB_URI'];
  let envValid = true;

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`   ✅ ${envVar}: Available`);
    } else {
      console.log(`   ❌ ${envVar}: Missing`);
      envValid = false;
    }
  }

  if (!envValid) {
    console.log('❌ Environment setup incomplete. Please check .env file.');
    process.exit(1);
  }

  // Check MongoDB connection
  console.log('\n2️⃣ Testing MongoDB Connection...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('   ✅ MongoDB connection successful');
    
    // Test basic operations
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    await testCollection.deleteOne({ test: true });
    console.log('   ✅ MongoDB read/write operations work');
    
  } catch (error) {
    console.log('   ❌ MongoDB connection failed:', error.message);
    console.log('   💡 Make sure MongoDB is running: net start MongoDB');
    process.exit(1);
  }

  // Check required files
  console.log('\n3️⃣ Checking Required Files...');
  const fs = require('fs');
  const requiredFiles = [
    'MarketDataFeedV3.proto',
    'services/InstrumentManager.js',
    'services/StockBrokerWebSocket.js',
    'models/MarketData.js',
    'routes/marketData.js'
  ];

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}: Found`);
    } else {
      console.log(`   ❌ ${file}: Missing`);
      process.exit(1);
    }
  }

  // Test Upstox API access
  console.log('\n4️⃣ Testing Upstox API Access...');
  try {
    const axios = require('axios');
    const response = await axios.get('https://api.upstox.com/v3/feed/market-data-feed/authorize', {
      headers: {
        'Authorization': `Bearer ${process.env.UPSTOX_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    if (response.data && response.data.status === 'success') {
      console.log('   ✅ Upstox API access successful');
    } else {
      console.log('   ❌ Upstox API access failed:', response.data);
    }
  } catch (error) {
    console.log('   ❌ Upstox API access failed:', error.message);
    if (error.response && error.response.status === 401) {
      console.log('   💡 Access token may be expired. Please update UPSTOX_ACCESS_TOKEN in .env');
    }
  }

  console.log('\n✅ Setup validation complete!');
  console.log('🚀 You can now start the server with: npm start');
  
  await mongoose.connection.close();
  process.exit(0);
}

validateSetup().catch((error) => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
