// Test just the file loading
console.log('Testing file loading...');

try {
  console.log('Step 1: Testing basic require');
  const InstrumentManager = require('./services/InstrumentManager');
  console.log('Step 2: InstrumentManager class loaded successfully');
  console.log('Step 3: InstrumentManager type:', typeof InstrumentManager);
  console.log('Step 4: InstrumentManager constructor:', typeof InstrumentManager.constructor);
  console.log('SUCCESS: File loading completed');
} catch (error) {
  console.error('ERROR during file loading:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
