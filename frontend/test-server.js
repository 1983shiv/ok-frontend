const { spawn } = require('child_process');
const path = require('path');

// Change to the project directory
process.chdir('e:\\js\\clone ui\\tradingok');

// Start the development server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

console.log('Starting development server...');
