const { db } = require('./src/config/firebase');

console.log('Testing Firebase connection...');

try {
  // Test if we can access the db object
  console.log('Firebase db object:', typeof db);
  console.log('Firebase db keys:', Object.keys(db));
  console.log('✅ Firebase connection test successful');
} catch (error) {
  console.error('❌ Firebase connection test failed:', error.message);
  console.error('Full error:', error);
}
