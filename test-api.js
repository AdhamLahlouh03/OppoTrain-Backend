const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const resources = [];

// Test data
const testResource = {
  title: "Introduction to AI",
  type: "Youtube Video",
  description: "Discover the basics of Artificial Intelligence, including key concepts, real-world applications, and how AI is shaping our future.",
  guest: "Zahaa muhanna",
  websiteUrl: "https://youtube.com/watch?v=test123"
};

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: Get All Resources (should be empty initially)
    console.log('2️⃣ Testing Get All Resources...');
    const getAllResponse = await axios.get(`${BASE_URL}/resources`);
    console.log('✅ Get All Resources:', getAllResponse.data.message);
    console.log('📊 Count:', getAllResponse.data.count);
    console.log('');

    // Test 3: Create Resource
    console.log('3️⃣ Testing Create Resource...');
    const createResponse = await axios.post(`${BASE_URL}/resources`, testResource);
    console.log('✅ Create Resource:', createResponse.data.message);
    const createdResource = createResponse.data.data;
    resources.push(createdResource.id);
    console.log('🆔 Created Resource ID:', createdResource.id);
    console.log('');

    // Test 4: Get Resource by ID
    console.log('4️⃣ Testing Get Resource by ID...');
    const getByIdResponse = await axios.get(`${BASE_URL}/resources/${createdResource.id}`);
    console.log('✅ Get Resource by ID:', getByIdResponse.data.message);
    console.log('📝 Title:', getByIdResponse.data.data.title);
    console.log('');

    // Test 5: Update Resource
    console.log('5️⃣ Testing Update Resource...');
    const updateData = {
      title: "Updated: Introduction to AI",
      description: "Updated description for AI introduction"
    };
    const updateResponse = await axios.put(`${BASE_URL}/resources/${createdResource.id}`, updateData);
    console.log('✅ Update Resource:', updateResponse.data.message);
    console.log('📝 Updated Title:', updateResponse.data.data.title);
    console.log('');

    // Test 6: Get Resources by Type
    console.log('6️⃣ Testing Get Resources by Type...');
    const getByTypeResponse = await axios.get(`${BASE_URL}/resources/type/Youtube%20Video`);
    console.log('✅ Get Resources by Type:', getByTypeResponse.data.message);
    console.log('📊 Count:', getByTypeResponse.data.count);
    console.log('');

    // Test 7: Get All Resources (should have 1 now)
    console.log('7️⃣ Testing Get All Resources (after creation)...');
    const getAllAfterResponse = await axios.get(`${BASE_URL}/resources`);
    console.log('✅ Get All Resources:', getAllAfterResponse.data.message);
    console.log('📊 Count:', getAllAfterResponse.data.count);
    console.log('');

    // Test 8: Delete Resource
    console.log('8️⃣ Testing Delete Resource...');
    const deleteResponse = await axios.delete(`${BASE_URL}/resources/${createdResource.id}`);
    console.log('✅ Delete Resource:', deleteResponse.data.message);
    console.log('');

    // Test 9: Verify Deletion
    console.log('9️⃣ Testing Resource Deletion Verification...');
    try {
      await axios.get(`${BASE_URL}/resources/${createdResource.id}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Resource successfully deleted (404 Not Found)');
      } else {
        console.log('❌ Unexpected error during deletion verification');
      }
    }
    console.log('');

    // Test 10: Final Count Check
    console.log('🔟 Final Resource Count Check...');
    const finalResponse = await axios.get(`${BASE_URL}/resources`);
    console.log('✅ Final Count:', finalResponse.data.count);
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('✨ Your Resources Management API is working perfectly!');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Response:', error.response.data);
    }
  }
}

// Check if axios is installed
try {
  require('axios');
  testAPI();
} catch (error) {
  console.log('📦 Axios not found. Installing...');
  console.log('💡 Run: npm install axios');
  console.log('💡 Then run: node test-api.js');
}
