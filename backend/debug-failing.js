const http = require('http');

const BASE_URL = 'http://localhost:8080/api';

const testSingleEndpoint = (url, description) => {
  return new Promise((resolve) => {
    console.log(`\n🔍 Testing: ${description}`);
    console.log(`URL: ${url}`);
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: url.replace('http://localhost:8080', ''),
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TradingOK-Test/1.0'
      },
      timeout: 10000
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          console.log(`✅ Status: ${res.statusCode}`);
          console.log(`📦 Response size: ${data.length} chars`);
          
          let jsonData;
          try {
            jsonData = JSON.parse(data);
          } catch (e) {
            console.log(`📝 Raw response: ${data.substring(0, 200)}...`);
            resolve(false);
            return;
          }
          
          if (jsonData && typeof jsonData === 'object') {
            if (jsonData.error) {
              console.log(`❌ Error: ${jsonData.error}`);
              if (jsonData.message) console.log(`   Message: ${jsonData.message}`);
              if (jsonData.details) console.log(`   Details: ${JSON.stringify(jsonData.details)}`);
            } else {
              console.log(`📊 Response keys: ${Object.keys(jsonData).join(', ')}`);
            }
          }
          
          resolve(res.statusCode === 200);
        } catch (error) {
          console.log(`❌ Parse Error: ${error.message}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ FAILED`);
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log(`❌ TIMEOUT`);
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Testing Failing Endpoints\n');
  
  // Test the two failing endpoints with a valid future expiry
  await testSingleEndpoint(`${BASE_URL}/options/chain/NIFTY/12-06-2025`, 'Options Chain (Valid Expiry)');
  await testSingleEndpoint(`${BASE_URL}/positions`, 'Positions');
  
  // Also test a working endpoint for comparison
  await testSingleEndpoint(`${BASE_URL}/market/status`, 'Market Status (working)');
};

runTests().catch(console.error);
