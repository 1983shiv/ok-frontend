// Complete test demonstrating InstrumentManager functionality
const InstrumentManager = require('./services/InstrumentManager');

async function demonstrateInstrumentManager() {
  console.log('🎯 InstrumentManager Demonstration');
  console.log('=====================================\n');

  try {
    // Create manager instance
    const manager = new InstrumentManager();
    
    // Test 1: Basic instrument keys (like instrument.js)
    console.log('1️⃣ Basic Instrument Keys (like instrument.js)');
    console.log('─'.repeat(50));
    const basicKeys = manager.getInstrumentKeys();
    console.log(`✅ Generated ${basicKeys.length} instrument keys`);
    console.log('📊 Index keys:', basicKeys.slice(0, 4));
    console.log('🔍 Sample derivative keys:', basicKeys.slice(4, 8));
    console.log('');

    // Test 2: Advanced options
    console.log('2️⃣ Advanced Options');
    console.log('─'.repeat(50));
    const advancedResult = manager.getInstrumentKeysAdvanced({
      indices: ["NIFTY", "BANKNIFTY", "FINNIFTY"],
      months: 2,
      includeIndexKeys: true,
      includeFinNifty: true,
      includeMidCpNifty: true
    });
    console.log('📈 Summary:', advancedResult.summary);
    console.log('📅 Expiries:', advancedResult.expiries);
    console.log('');

    // Test 3: Different configurations
    console.log('3️⃣ Different Configurations');
    console.log('─'.repeat(50));
    
    // Only NIFTY for 1 month
    const niftyOnly = manager.getInstrumentKeysAdvanced({
      indices: ["NIFTY"],
      months: 1,
      includeIndexKeys: true,
      includeFinNifty: false,
      includeMidCpNifty: false
    });
    console.log(`📌 NIFTY only (1 month): ${niftyOnly.instrumentKeys.length} keys`);
    
    // All indices for 3 months
    const allIndices = manager.getInstrumentKeysAdvanced({
      indices: ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"],
      months: 3,
      includeIndexKeys: true,
      includeFinNifty: true,
      includeMidCpNifty: true
    });
    console.log(`📌 All indices (3 months): ${allIndices.instrumentKeys.length} keys`);
    console.log('');

    // Test 4: Static method
    console.log('4️⃣ Static Method Usage');
    console.log('─'.repeat(50));
    const staticKeys = InstrumentManager.getStaticInstrumentKeys();
    console.log(`✅ Static method: ${staticKeys.length} keys`);
    console.log('');

    // Test 5: Subscription integration
    console.log('5️⃣ Subscription Integration');
    console.log('─'.repeat(50));
    const subscriptionResult = await manager.getInstrumentKeysForSubscription(true);
    console.log('📊 Subscription summary:', subscriptionResult.summary);
    console.log('🔗 Source:', subscriptionResult.source);
    console.log('');

    // Test 6: Show expiry details
    console.log('6️⃣ Expiry Analysis');
    console.log('─'.repeat(50));
    const niftyExpiries = manager.getUniqueExpiry('NIFTY', 3);
    const bankniftyExpiries = manager.getUniqueExpiry('BANKNIFTY', 3);
    console.log('📅 NIFTY expiries (3 months):', niftyExpiries);
    console.log('📅 BANKNIFTY expiries (3 months):', bankniftyExpiries);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`• InstrumentManager can now provide instrument keys like instrument.js`);
    console.log(`• Supports flexible configuration (indices, months, options)`);
    console.log(`• Compatible with existing subscription system`);
    console.log(`• Can be used both as instance and static methods`);
    console.log(`• Processes ${manager.loadNSEData().length} instruments from NSE.json`);
    
  } catch (error) {
    console.error('❌ Error in demonstration:', error.message);
    console.error(error.stack);
  }
}

// Run the demonstration
demonstrateInstrumentManager();
