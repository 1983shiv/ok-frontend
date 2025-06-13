// Minimal test
console.log('Starting minimal test...');

try {
  const InstrumentManager = require('./services/InstrumentManager');
  console.log('✅ InstrumentManager loaded');
  
  const manager = new InstrumentManager();
  console.log('✅ Manager created');
  
  // Test the new methods one by one
  console.log('Testing loadNSEData...');
  const data = manager.loadNSEData();
  console.log(`✅ NSE data loaded: ${data.length} instruments`);
  
  console.log('Testing getIndexToKeyMapping...');
  const mapping = manager.getIndexToKeyMapping();
  console.log('✅ Index mapping:', Object.keys(mapping));
  
  console.log('Testing getUniqueExpiry...');
  const expiries = manager.getUniqueExpiry('NIFTY', 1);
  console.log(`✅ Expiries: ${expiries.length} found`);
  
  console.log('All tests passed!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack trace:', error.stack);
}
