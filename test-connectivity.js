// Frontend-Backend Connectivity Test
// Run this script to test if frontend can communicate with backend

const http = require('http');

console.log('🔍 TradingOK Frontend-Backend Connectivity Test');
console.log('='.repeat(55));

// Test configuration
const BACKEND_PORT = 8080;
const FRONTEND_PORT = 3002;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;

// Test backend server
const testBackend = () => {
  return new Promise((resolve) => {
    console.log('\n🖥️  Testing Backend Server...');
    
    const req = http.request({
      hostname: 'localhost',
      port: BACKEND_PORT,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Origin': FRONTEND_URL
      },
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`   CORS: ${res.headers['access-control-allow-origin'] || 'Not set'}`);
        
        if (res.statusCode === 200) {
          try {
            const health = JSON.parse(data);
            console.log(`   Health: ${health.status}`);
            console.log(`   Uptime: ${Math.round(health.uptime)}s`);
            console.log('   ✅ Backend is working!');
            resolve(true);
          } catch (e) {
            console.log('   ❌ Invalid JSON response');
            resolve(false);
          }
        } else {
          console.log('   ❌ Backend returned error');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Backend connection failed: ${error.message}`);
      console.log('   💡 Make sure backend server is running: npm start');
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('   ❌ Backend connection timeout');
      resolve(false);
    });
    
    req.end();
  });
};

// Test frontend server
const testFrontend = () => {
  return new Promise((resolve) => {
    console.log('\n🌐 Testing Frontend Server...');
    
    const req = http.request({
      hostname: 'localhost',
      port: FRONTEND_PORT,
      path: '/',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      if (res.statusCode === 200) {
        console.log('   ✅ Frontend is working!');
        resolve(true);
      } else {
        console.log('   ❌ Frontend returned error');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Frontend connection failed: ${error.message}`);
      console.log('   💡 Make sure frontend server is running: npm run dev:3002');
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('   ❌ Frontend connection timeout');
      resolve(false);
    });
    
    req.end();
  });
};

// Test API endpoints
const testAPIEndpoints = async () => {
  console.log('\n🔗 Testing API Endpoints...');
  
  const endpoints = [
    '/api/market/status',
    '/api/market/overview',
    '/api/options/chain/NIFTY/2024-12-26',
    '/api/oi/data/NIFTY/2024-12-26'
  ];
  
  for (const endpoint of endpoints) {
    await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: BACKEND_PORT,
        path: endpoint,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Origin': FRONTEND_URL
        },
        timeout: 5000
      }, (res) => {
        const endpointName = endpoint.split('/').pop();
        if (res.statusCode === 200) {
          console.log(`   ✅ ${endpointName}: Working`);
        } else {
          console.log(`   ❌ ${endpointName}: Error ${res.statusCode}`);
        }
        resolve();
      });
      
      req.on('error', () => {
        console.log(`   ❌ ${endpoint.split('/').pop()}: Connection failed`);
        resolve();
      });
      
      req.on('timeout', () => {
        console.log(`   ❌ ${endpoint.split('/').pop()}: Timeout`);
        resolve();
      });
      
      req.end();
    });
  }
};

// Main test function
async function runConnectivityTest() {
  const backendWorking = await testBackend();
  const frontendWorking = await testFrontend();
  
  console.log('\n📊 Summary:');
  console.log(`   Backend (${BACKEND_PORT}): ${backendWorking ? '✅ Online' : '❌ Offline'}`);
  console.log(`   Frontend (${FRONTEND_PORT}): ${frontendWorking ? '✅ Online' : '❌ Offline'}`);
  
  if (backendWorking && frontendWorking) {
    console.log('\n🎉 Both servers are running!');
    await testAPIEndpoints();
    
    console.log('\n🔗 Test URLs:');
    console.log(`   Backend API: ${BACKEND_URL}/api/health`);
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   API Test Page: ${FRONTEND_URL}/api-test`);
    
  } else {
    console.log('\n⚠️  Server Issues Detected:');
    
    if (!backendWorking) {
      console.log('   🖥️  Start Backend: cd backend && npm start');
    }
    
    if (!frontendWorking) {
      console.log('   🌐 Start Frontend: cd frontend && npm run dev:3002');
    }
    
    console.log('\n   💡 Or run: start-full-stack.bat');
  }
  
  console.log('\n' + '='.repeat(55));
}

// Run the test
runConnectivityTest().catch(console.error);
