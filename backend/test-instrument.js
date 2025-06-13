// Test Instrument model specifically
require('dotenv').config();
const mongoose = require('mongoose');
const { Instrument } = require('./models/MarketData');
const moment = require('moment');

async function testInstrumentModel() {
  try {
    console.log('Testing Instrument model...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Test the exact query that's failing
    console.log('Testing countDocuments query...');
    const todayStart = moment().startOf('day').toDate();
    console.log('Today start:', todayStart);
    
    const existingCount = await Instrument.countDocuments({
      lastUpdated: { $gte: todayStart }
    });
    
    console.log('✅ countDocuments successful, count:', existingCount);
    
    // Test basic find operation
    console.log('Testing find operation...');
    const instruments = await Instrument.find({}).limit(5);
    console.log('✅ find successful, found:', instruments.length, 'instruments');
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Instrument model test failed:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

console.log('Starting Instrument model test...');
testInstrumentModel();
