// Simple test for InstrumentManager
try {
  console.log('Loading InstrumentManager...');
  const InstrumentManager = require('./services/InstrumentManager');
  console.log('InstrumentManager loaded successfully');
  
  console.log('Creating instance...');
  const manager = new InstrumentManager();
  console.log('Instance created successfully');
  
  console.log('Testing loadNSEData...');
  const instruments = manager.loadNSEData();
  console.log(`Loaded ${instruments.length} instruments from NSE.json`);
  
  console.log('Testing getInstrumentKeys...');
  const keys = manager.getInstrumentKeys();
  console.log(`Generated ${keys.length} instrument keys`);
  
  console.log('Test completed successfully!');
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}
