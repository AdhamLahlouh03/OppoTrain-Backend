const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

// API information
router.get('/', (req, res) => {
  res.json({
    message: 'OppoTrain Backend API - Admin Only',
    version: '1.0.0',
    description: 'Authentication and management system for admins only',
    endpoints: {
      auth: '/auth',
      health: '/health'
    },
    features: [
      'Admin login',
      'Admin profile management',
      'System statistics'
    ]
  });
});

// Auth routes only
router.use('/auth', authRoutes);

module.exports = router;
