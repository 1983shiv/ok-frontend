// Test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Test collection operations
    const testSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    }, {
      collection: 'test_collection'
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    console.log('Testing collection operations...');
    const count = await TestModel.countDocuments();
    console.log('✅ Collection operation successful, document count:', count);
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

console.log('Starting MongoDB connection test...');
testConnection();
