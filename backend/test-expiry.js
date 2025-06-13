// Test expiry date validation
const testExpiry = '25-01-2024';
const regex = /^\d{2}-\d{2}-\d{4}$/;
console.log('Regex test:', regex.test(testExpiry));

const date = new Date(testExpiry.split('-').reverse().join('-'));
console.log('Date parsed:', date);
console.log('Is valid date:', !isNaN(date.getTime()));
console.log('Is future date:', date > new Date());
console.log('Current date:', new Date());

// Test with DataGenerator expiry format
const dataGen = require('./services/dataGenerator');
const generator = new dataGen();
console.log('Generated expiries:', generator.expiries.slice(0, 3));
