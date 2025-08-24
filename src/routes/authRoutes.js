const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { validateLogin } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/login', validateLogin, authController.login);

module.exports = router;
