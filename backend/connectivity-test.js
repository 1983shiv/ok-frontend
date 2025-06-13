// Basic connectivity test
const http = require('http');

console.log('Testing basic connectivity to localhost:8080...');

// Test 1: Basic connection
const req = http.request({
  hostname: 'localhost', 
  port: 8080,
  path: '/',
  method: 'GET'
}, (res) => {
  console.log('✅ Connection successful!');
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Response: ${data || '(empty)'}`);
    
    // Test 2: Health endpoint
    console.log('\nTesting /api/health...');
    testHealth();
  });
});

req.on('error', (error) => {
  console.log('❌ Connection failed:', error.message);
  console.log('\nPossible issues:');
  console.log('1. Server not running');
  console.log('2. Server running on different port');
  console.log('3. Firewall blocking connection');
});

req.end();

function testHealth() {
  const healthReq = http.request({
    hostname: 'localhost',
    port: 8080, 
    path: '/api/health',
    method: 'GET'
  }, (res) => {
    console.log(`Health check status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Health response: ${data}`);
      
      if (res.statusCode === 200) {
        console.log('✅ Backend API is working!');
        console.log('\nYou can now test your main endpoints.');
      } else {
        console.log('❌ Health check failed');
      }
    });
  });
  
  healthReq.on('error', (error) => {
    console.log('❌ Health check error:', error.message);
  });
  
  healthReq.end();
}
