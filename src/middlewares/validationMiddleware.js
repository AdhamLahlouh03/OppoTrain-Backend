const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || !password.trim()) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Data validation failed',
      message: 'Please review the input fields',
      details: errors
    });
  }

  next();
};

const requireFields = (fields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    fields.forEach(field => {
      if (!req.body[field] || !req.body[field].toString().trim()) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide all required fields',
        missingFields
      });
    }

    next();
  };
};

/**
 * Middleware to validate email format
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address',
      message: 'Please provide a valid email address'
    });
  }

  next();
};

module.exports = {
  validateLogin,
  requireFields,
  validateEmail
};
