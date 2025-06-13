// Test Frontend-Backend Connectivity
const http = require('http');

console.log('🔄 Testing Frontend-Backend Connectivity');
console.log('=' .repeat(60));

// Test backend server status
const testBackend = () => {
  return new Promise((resolve) => {
    console.log('\n🔍 Testing Backend Server (port 8080)...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3002'  // Frontend origin
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ Backend Status: ${res.statusCode}`);
        console.log(`📦 CORS Headers: ${res.headers['access-control-allow-origin'] || 'None'}`);
        
        try {
          const json = JSON.parse(data);
          console.log(`📊 Health Check: ${json.status}`);
          console.log(`⏱️ Uptime: ${Math.round(json.uptime)}s`);
        } catch (e) {
          console.log(`❌ Invalid JSON response`);
        }
        
        resolve(res.statusCode === 200);
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Backend Connection Failed: ${error.message}`);
      resolve(false);
    });
    
    req.end();
  });
};

// Test sample API endpoints from frontend perspective
const testAPIEndpoints = async () => {
  console.log('\n🔗 Testing API Endpoints...');
  
  const endpoints = [
    { path: '/api/market/status', name: 'Market Status' },
    { path: '/api/market/symbols', name: 'Symbols' },
    { path: '/api/options/chain/NIFTY/12-06-2025', name: 'Options Chain' },
    { path: '/api/positions', name: 'Positions' },
    { path: '/api/config/intervals', name: 'Config' }
  ];
  
  for (const endpoint of endpoints) {
    await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 8080,
        path: endpoint.path,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Origin': 'http://localhost:3002'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const json = JSON.parse(data);
              console.log(`✅ ${endpoint.name}: OK (${data.length} bytes)`);
            } catch (e) {
              console.log(`❌ ${endpoint.name}: Invalid JSON`);
            }
          } else {
            console.log(`❌ ${endpoint.name}: ${res.statusCode}`);
          }
          resolve();
        });
      });
      
      req.on('error', () => {
        console.log(`❌ ${endpoint.name}: Connection failed`);
        resolve();
      });
      
      req.end();
    });
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

// Test frontend server status
const testFrontend = () => {
  return new Promise((resolve) => {
    console.log('\n🔍 Testing Frontend Server (port 3002)...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 3002,
      path: '/',
      method: 'GET'
    }, (res) => {
      console.log(`✅ Frontend Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log(`🌐 Frontend is running on http://localhost:3002`);
      }
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (error) => {
      console.log(`❌ Frontend Connection Failed: ${error.message}`);
      console.log(`💡 Make sure frontend is running: npm run dev`);
      resolve(false);
    });
    
    req.end();
  });
};

// Run all tests
const runTests = async () => {
  const backendOK = await testBackend();
  
  if (backendOK) {
    await testAPIEndpoints();
  }
  
  const frontendOK = await testFrontend();
  
  console.log('\n📋 Summary:');
  console.log('=' .repeat(40));
  console.log(`Backend (8080): ${backendOK ? '✅ Running' : '❌ Not running'}`);
  console.log(`Frontend (3002): ${frontendOK ? '✅ Running' : '❌ Not running'}`);
  
  if (backendOK && frontendOK) {
    console.log('\n🎉 Both servers are running!');
    console.log('🔗 Frontend should be able to connect to backend');
    console.log('💡 Check browser console for actual API calls');
  } else {
    console.log('\n⚠️  One or both servers are not running');
    if (!backendOK) console.log('   Start backend: cd backend && node server.js');
    if (!frontendOK) console.log('   Start frontend: cd frontend && npm run dev');
  }
};

runTests().catch(console.error);
