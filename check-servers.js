// Quick server status check
const http = require('http');

console.log('🔍 Checking Server Status...\n');

// Check backend (port 8080)
const checkBackend = () => {
  return new Promise((resolve) => {
    console.log('Backend (port 8080):');
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/health',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      console.log('✅ Backend is RUNNING');
      resolve(true);
    });
    
    req.on('error', () => {
      console.log('❌ Backend is NOT RUNNING');
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Backend connection timeout');
      resolve(false);
    });
    
    req.end();
  });
};

// Check frontend (port 3002)
const checkFrontend = () => {
  return new Promise((resolve) => {
    console.log('Frontend (port 3002):');
    const req = http.request({
      hostname: 'localhost',
      port: 3002,
      path: '/',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      console.log('✅ Frontend is RUNNING');
      resolve(true);
    });
    
    req.on('error', () => {
      console.log('❌ Frontend is NOT RUNNING');
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Frontend connection timeout');
      resolve(false);
    });
    
    req.end();
  });
};

// Check both servers
async function checkServers() {
  const backendRunning = await checkBackend();
  const frontendRunning = await checkFrontend();
  
  console.log('\n📋 Summary:');
  console.log(`Backend (8080): ${backendRunning ? '✅ Running' : '❌ Stopped'}`);
  console.log(`Frontend (3002): ${frontendRunning ? '✅ Running' : '❌ Stopped'}`);
  
  if (!backendRunning || !frontendRunning) {
    console.log('\n🚀 To start the servers:');
    if (!backendRunning) {
      console.log('Backend: cd "e:\\js\\clone ui\\tradingok\\backend" && npm start');
    }
    if (!frontendRunning) {
      console.log('Frontend: cd "e:\\js\\clone ui\\tradingok\\frontend" && npm run dev -- --port 3002');
    }
  } else {
    console.log('\n🎉 Both servers are running! Ready to test connectivity.');
  }
}

checkServers();
