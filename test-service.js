const resourceService = require('./src/services/resourceService');

console.log('Testing Resource Service...');

async function testService() {
  try {
    console.log('1️⃣ Testing getAllResources...');
    const result = await resourceService.getAllResources();
    console.log('✅ Result:', result);
  } catch (error) {
    console.error('❌ Error in getAllResources:', error.message);
    console.error('Full error:', error);
  }
}

testService();
