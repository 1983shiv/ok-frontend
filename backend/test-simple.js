// Test the simplified InstrumentManager
console.log('Testing simplified InstrumentManager...');

try {
  const InstrumentManagerSimple = require('./InstrumentManagerSimple');
  console.log('✅ InstrumentManagerSimple loaded');
  
  const manager = new InstrumentManagerSimple();
  console.log('✅ Manager instance created');
  
  const instruments = manager.loadNSEData();
  console.log(`✅ Loaded ${instruments.length} instruments`);
  
  const keys = manager.getInstrumentKeys();
  console.log(`✅ Generated ${keys.length} instrument keys`);
  console.log('Sample keys:', keys.slice(0, 6));
  
  console.log('\n🎉 Test completed successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
