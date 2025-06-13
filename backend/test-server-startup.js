// Test server startup
console.log('🧪 Testing server startup...');

setTimeout(() => {
  console.log('⏰ Test timeout reached, exiting...');
  process.exit(0);
}, 15000);

require('./server.js');
