// Test comparison between original instrument.js and InstrumentManager
import instrument_keys from './services/instrument.js';
import InstrumentManager from './services/InstrumentManager.js';

try {
  console.log('=== Comparison Test ===');
  
  console.log('Testing original instrument.js...');
  console.log(`Original instrument.js: ${instrument_keys.length} keys`);
  console.log('Sample keys:', instrument_keys.slice(0, 3));
  
  console.log('\nTesting InstrumentManager...');
  const manager = new InstrumentManager();
  const managerKeys = manager.getInstrumentKeys();
  console.log(`InstrumentManager: ${managerKeys.length} keys`);
  console.log('Sample keys:', managerKeys.slice(0, 3));
  
  console.log('\n=== Comparison Results ===');
  console.log(`Keys match: ${instrument_keys.length === managerKeys.length ? '✅' : '❌'}`);
  
  // Check if first few keys match
  const firstFewMatch = instrument_keys.slice(0, 4).every((key, index) => key === managerKeys[index]);
  console.log(`First 4 keys match: ${firstFewMatch ? '✅' : '❌'}`);
  
  if (!firstFewMatch) {
    console.log('Original first 4:', instrument_keys.slice(0, 4));
    console.log('Manager first 4:', managerKeys.slice(0, 4));
  }
  
} catch (error) {
  console.error('Test failed:', error.message);
  console.error('Stack:', error.stack);
}
