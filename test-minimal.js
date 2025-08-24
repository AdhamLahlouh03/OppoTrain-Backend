const express = require('express');

const app = express();
const PORT = 3000;

// Basic middleware
app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`🚀 Minimal test server running on port ${PORT}`);
  console.log(`📊 Test: http://localhost:${PORT}/test`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
});
