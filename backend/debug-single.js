// Simple debug script to test one endpoint at a time
const http = require('http');

const testSingleEndpoint = (path) => {
  console.log(`Testing: http://localhost:8080${path}`);
  
  const req = http.request({
    hostname: 'localhost',
    port: 8080,
    path: path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response length: ${data.length}`);
      console.log(`Raw response:`, data);
      
      if (data) {
        try {
          const json = JSON.parse(data);
          console.log(`Parsed JSON:`, json);
        } catch (e) {
          console.log(`JSON Parse Error:`, e.message);
        }
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`Error:`, error.message);
  });
  
  req.end();
};

// Test the health endpoint first
console.log('Testing health endpoint...');
testSingleEndpoint('/api/health');
