const http = require('http');

// Test server endpoints
const testEndpoints = [
  { path: '/api/health', description: 'Health Check' },
  { path: '/api/market/status', description: 'Market Status' },
  { path: '/api/market/symbols', description: 'Symbols List' },
  { path: '/api/options/chain/NIFTY/25-01-2024', description: 'Options Chain' },
  { path: '/api/oi/coi-analysis/NIFTY', description: 'COI Analysis' },
  { path: '/api/oi/pcr-analysis/NIFTY', description: 'PCR Analysis' },
  { path: '/api/positions', description: 'Positions' },
  { path: '/api/charts/oi-data/NIFTY', description: 'OI Chart Data' },
  { path: '/api/historical/oi/NIFTY', description: 'Historical OI' }
];

const testServer = async () => {
  console.log('🧪 Testing Backend Server...\n');
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`🔍 Testing ${endpoint.description}...`);
      const response = await makeRequest(endpoint.path);
      
      if (!response || response.trim() === '') {
        console.log(`❌ ${endpoint.description}: FAILED - Empty response`);
        continue;
      }
      
      try {
        const data = JSON.parse(response);
        
        if (data.error) {
          console.log(`❌ ${endpoint.description}: FAILED - ${data.error}`);
        } else {
          console.log(`✅ ${endpoint.description}: PASSED`);
          if (data.data) {
            const dataInfo = Array.isArray(data.data) ? `${data.data.length} items` : 'Object';
            console.log(`   📊 Data: ${dataInfo}`);
          } else if (data.status) {
            console.log(`   📊 Status: ${data.status}`);
          } else {
            console.log(`   📊 Response: Valid JSON`);
          }
        }
      } catch (parseError) {
        console.log(`❌ ${endpoint.description}: FAILED - Invalid JSON response`);
        console.log(`   📄 Response preview: ${response.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.description}: ERROR - ${error.message}`);
    }
    console.log('');
  }
};

const makeRequest = (path) => {
  return new Promise((resolve, reject) => {    const options = {
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

// Test WebSocket connection
const testWebSocket = () => {
  console.log('🔌 Testing WebSocket Connection...\n');
  
  // Note: This would require socket.io-client for proper testing
  // For now, just check if server is running
  const testConnection = http.request({
    hostname: 'localhost',
    port: 8080,
    path: '/',
    method: 'GET'
  }, (res) => {
    if (res.statusCode === 200 || res.statusCode === 404) {
      console.log('✅ WebSocket Server: RUNNING');
      console.log('   🔗 Available at: http://localhost:8080');
    } else {
      console.log('❌ WebSocket Server: NOT RESPONDING');
    }
    console.log('\n' + '='.repeat(50));
    
    // Run API tests
    testServer();
  });
  
  testConnection.on('error', (error) => {
    console.log('❌ Server Connection: FAILED');
    console.log('   🔧 Make sure to run: node server.js');
    console.log('   📍 Error:', error.message);
  });
  
  testConnection.end();
};

// Start testing
console.log('🚀 Backend API Testing Suite');
console.log('='.repeat(50));
testWebSocket();
