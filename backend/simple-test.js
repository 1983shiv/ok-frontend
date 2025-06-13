// Check if server is running and what endpoints work
console.log('Testing server on port 8080...');

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ Server is running and responding!');
    } else {
      console.log('❌ Server responded but with error status');
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Connection failed:', error.message);
  console.log('Make sure your server is running on port 8080');
});

req.end();
