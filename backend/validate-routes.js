// Quick validation script to check all route files load correctly
console.log('🔍 Validating Backend Route Files...\n');

const routes = [
  { name: 'Market Routes', path: './routes/market' },
  { name: 'Options Routes', path: './routes/options' },
  { name: 'Open Interest Routes', path: './routes/openInterest' },
  { name: 'Futures Routes', path: './routes/futures' },
  { name: 'Positions Routes', path: './routes/positions' },
  { name: 'Historical Routes', path: './routes/historical' },
  { name: 'Charts Routes', path: './routes/charts' },
  { name: 'Config Routes', path: './routes/config' }
];

const services = [
  { name: 'Data Generator', path: './services/dataGenerator' },
  { name: 'Data Simulator', path: './services/dataSimulator' }
];

const middleware = [
  { name: 'Cache Middleware', path: './middleware/cache' },
  { name: 'Validation Middleware', path: './middleware/validation' }
];

let allValid = true;

// Test middleware
console.log('📦 Testing Middleware:');
for (const mid of middleware) {
  try {
    require(mid.path);
    console.log(`✅ ${mid.name}: OK`);
  } catch (error) {
    console.log(`❌ ${mid.name}: ERROR - ${error.message}`);
    allValid = false;
  }
}

console.log('\n📦 Testing Services:');
for (const service of services) {
  try {
    require(service.path);
    console.log(`✅ ${service.name}: OK`);
  } catch (error) {
    console.log(`❌ ${service.name}: ERROR - ${error.message}`);
    allValid = false;
  }
}

console.log('\n🛣️  Testing Routes:');
for (const route of routes) {
  try {
    require(route.path);
    console.log(`✅ ${route.name}: OK`);
  } catch (error) {
    console.log(`❌ ${route.name}: ERROR - ${error.message}`);
    allValid = false;
  }
}

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('🎉 All route files validated successfully!');
  console.log('✨ Backend is ready to start!');
  console.log('\nTo start the server:');
  console.log('   node server.js');
  console.log('\nTo test the server:');
  console.log('   node test-backend.js');
} else {
  console.log('❌ Some route files have errors. Please fix them before starting the server.');
}
console.log('='.repeat(50));
