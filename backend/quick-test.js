const http = require('http');

// Simple test to check server status and available endpoints
console.log('🔍 Testing Server Status...\n');

// Test health endpoint first
const testHealth = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/health',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Health Check: PASSED');
          console.log(`   Status: ${result.status}`);
          console.log(`   Uptime: ${Math.round(result.uptime)}s`);
          resolve(true);
        } catch (error) {
          console.log('❌ Health Check: FAILED - Invalid JSON response');
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Health Check: FAILED - Connection error');
      console.log(`   Error: ${error.message}`);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
};

// Test a few basic endpoints
const testBasicEndpoints = async () => {
  const endpoints = [
    '/api/market/status',
    '/api/market/symbols',
    '/api/positions',
    '/api/config/intervals'
  ];
  
  console.log('\n📊 Testing Basic API Endpoints...\n');
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(endpoint);
      const data = JSON.parse(response);
      console.log(`✅ ${endpoint}: OK`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ERROR - ${error.message}`);
    }
  }
};

const makeRequest = (path) => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
};

// Run tests
(async () => {
  try {
    await testHealth();
    await testBasicEndpoints();
    console.log('\n🎉 Server is responding correctly!');
  } catch (error) {
    console.log('\n❌ Server tests failed. Make sure your server is running on port 8080.');
  }
})();
