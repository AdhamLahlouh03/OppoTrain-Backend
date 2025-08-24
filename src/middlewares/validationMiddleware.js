const Resource = require('../models/Resource');

// Validate resource creation/update
const validateResource = (req, res, next) => {
  try {
    const { title, type, description, guest, websiteUrl } = req.body;
    
    // Check required fields
    if (!title || !type || !description || !guest) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        errors: ['Title, type, description, and guest are required']
      });
    }

    // Validate data using Resource model
    const validation = Resource.validate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    next();
  } catch (error) {
    console.error('Validation middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
};

// Validate resource ID parameter
const validateResourceId = (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || id.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Resource ID is required'
      });
    }

    next();
  } catch (error) {
    console.error('ID validation middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
};

// Validate resource type parameter
const validateResourceType = (req, res, next) => {
  try {
    const { type } = req.params;
    
    if (!type || type.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Resource type is required'
      });
    }

    next();
  } catch (error) {
    console.error('Type validation middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
};

module.exports = {
  validateResource,
  validateResourceId,
  validateResourceType
};
