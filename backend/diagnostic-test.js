const http = require('http');

console.log('🔍 Comprehensive Backend API Diagnostics');
console.log('='.repeat(60));
console.log(`Testing server on localhost:8080`);
console.log(`Date: ${new Date().toISOString()}`);
console.log('='.repeat(60));

// Test each endpoint with detailed logging
const testEndpoint = (path, description) => {
  return new Promise((resolve) => {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📍 URL: http://localhost:8080${path}`);
    
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Backend-Test-Script'
      }
    }, (res) => {
      console.log(`📊 Status: ${res.statusCode} ${res.statusMessage}`);
      console.log(`📋 Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📏 Response Length: ${data.length} bytes`);
        
        if (data.length > 0) {
          try {
            const jsonData = JSON.parse(data);
            console.log(`✅ Valid JSON Response`);
            
            if (jsonData.error) {
              console.log(`❌ API Error: ${jsonData.error}`);
            } else {
              console.log(`✅ Success Response`);
              if (jsonData.data) {
                console.log(`📦 Data Type: ${Array.isArray(jsonData.data) ? 'Array' : 'Object'}`);
                if (Array.isArray(jsonData.data)) {
                  console.log(`📊 Data Length: ${jsonData.data.length} items`);
                }
              }
            }
          } catch (parseError) {
            console.log(`❌ Invalid JSON Response`);
            console.log(`📄 Raw Response: ${data.substring(0, 200)}...`);
          }
        } else {
          console.log(`⚠️ Empty Response`);
        }
        
        resolve({
          path,
          description,
          statusCode: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          hasData: data.length > 0
        });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Connection Error: ${error.message}`);
      resolve({
        path,
        description,
        statusCode: null,
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`⏰ Request Timeout`);
      resolve({
        path,
        description,
        statusCode: null,
        success: false,
        error: 'Timeout'
      });
    });
    
    req.end();
  });
};

// Define test endpoints
const endpoints = [
  { path: '/api/health', description: 'Health Check' },
  { path: '/api/market/status', description: 'Market Status' },
  { path: '/api/market/symbols', description: 'Market Symbols' },
  { path: '/api/positions', description: 'Positions' },
  { path: '/api/config/intervals', description: 'Config Intervals' },
  { path: '/api/options/chain/NIFTY/25-01-2024', description: 'Options Chain (with params)' },
  { path: '/api/oi/coi-analysis/NIFTY', description: 'COI Analysis' },
  { path: '/api/charts/oi-data/NIFTY', description: 'Chart OI Data' },
  { path: '/api/historical/oi/NIFTY', description: 'Historical OI' }
];

// Run all tests
const runAllTests = async () => {
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.path, endpoint.description);
    results.push(result);
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ Working Endpoints:');
    successful.forEach(r => {
      console.log(`   • ${r.description} (${r.statusCode})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Endpoints:');
    failed.forEach(r => {
      console.log(`   • ${r.description} - ${r.error || r.statusCode}`);
    });
  }
  
  console.log('\n🔧 Next Steps:');
  if (failed.length === results.length) {
    console.log('   1. Check if server is running: node server.js');
    console.log('   2. Verify server port is 8080');
    console.log('   3. Check server console for errors');
  } else if (failed.length > 0) {
    console.log('   1. Check server logs for specific endpoint errors');
    console.log('   2. Verify route imports in server.js');
    console.log('   3. Check middleware validation');
  } else {
    console.log('   🎉 All endpoints working! Your backend is ready!');
  }
};

// Start the test
runAllTests().catch(console.error);
