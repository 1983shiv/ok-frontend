// Test file access
const fs = require('fs');
const path = require('path');

console.log('Testing file access...');
console.log('Current directory:', process.cwd());

try {
  console.log('Checking if NSE.json exists...');
  const exists = fs.existsSync('NSE.json');
  console.log('NSE.json exists:', exists);
  
  if (exists) {
    console.log('Reading file stats...');
    const stats = fs.statSync('NSE.json');
    console.log('File size:', stats.size, 'bytes');
    
    console.log('Trying to read first 100 characters...');
    const data = fs.readFileSync('NSE.json', 'utf-8', 0, 100);
    console.log('First 100 chars:', data.substring(0, 100));
  }
  
  console.log('Test completed');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
