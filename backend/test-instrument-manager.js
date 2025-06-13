// Test script for InstrumentManager instrument key functionality
const InstrumentManager = require('./services/InstrumentManager');

async function testInstrumentManager() {
  try {
    console.log('🧪 Testing InstrumentManager instrument key functionality...\n');

    // Test 1: Basic instrument keys (like instrument.js)
    console.log('=== Test 1: Basic Instrument Keys ===');
    const manager = new InstrumentManager();
    const basicKeys = manager.getInstrumentKeys();
    console.log(`Generated ${basicKeys.length} instrument keys`);
    console.log('Sample keys:', basicKeys.slice(0, 5));
    console.log('');

    // Test 2: Advanced instrument keys with options
    console.log('=== Test 2: Advanced Instrument Keys ===');
    const advancedResult = manager.getInstrumentKeysAdvanced({
      indices: ["NIFTY", "BANKNIFTY", "FINNIFTY"],
      months: 2,
      includeIndexKeys: true,
      includeFinNifty: true,
      includeMidCpNifty: true
    });
    console.log('Advanced result summary:', advancedResult.summary);
    console.log('Expiries:', advancedResult.expiries);
    console.log('');

    // Test 3: Static method
    console.log('=== Test 3: Static Method ===');
    const staticKeys = InstrumentManager.getStaticInstrumentKeys();
    console.log(`Static method generated ${staticKeys.length} instrument keys`);
    console.log('');

    // Test 4: Subscription integration
    console.log('=== Test 4: Subscription Integration ===');
    const subscriptionResult = await manager.getInstrumentKeysForSubscription(true);
    console.log('Subscription result:', subscriptionResult.summary);
    console.log('Source:', subscriptionResult.source);
    console.log('');

    // Test 5: Compare with original instrument.js approach
    console.log('=== Test 5: Comparison with instrument.js ===');
    try {
      const originalInstrument = require('./services/instrument');
      console.log(`Original instrument.js: ${originalInstrument.length} keys`);
      console.log(`InstrumentManager: ${basicKeys.length} keys`);
      console.log('Match:', originalInstrument.length === basicKeys.length ? '✅' : '❌');
    } catch (error) {
      console.log('Could not load original instrument.js for comparison:', error.message);
    }

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testInstrumentManager();
