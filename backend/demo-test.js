// Simple test to verify backend is working
const API_BASE = 'http://localhost:5000/api';

// Start the server first, then run this
console.log('🚀 Testing Backend API Endpoints...\n');

// Test if server is running
fetch(`${API_BASE}/market/status`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Market Status:', data.success ? 'WORKING' : 'FAILED');
    console.log('📊 Market Data:', JSON.stringify(data.data, null, 2));
  })
  .catch(error => {
    console.log('❌ Server not running. Please start the backend server first:');
    console.log('   cd backend && node server.js');
  });

// Test WebSocket connection
const io = require('socket.io-client');
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('\n✅ WebSocket connected successfully');
  
  // Subscribe to price updates
  socket.emit('subscribe', { channel: 'price_update' });
  
  socket.on('price_update', (data) => {
    console.log('📈 Real-time price update:', data);
  });
  
  // Test for 10 seconds then disconnect
  setTimeout(() => {
    socket.disconnect();
    console.log('\n🔌 WebSocket test completed');
    process.exit(0);
  }, 10000);
});

socket.on('connect_error', (error) => {
  console.log('\n❌ WebSocket connection failed:', error.message);
  console.log('   Make sure the backend server is running');
  process.exit(1);
});
