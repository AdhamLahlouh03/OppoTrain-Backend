// src/controllers/authController.js
const authService = require('../services/authService');

class AuthController {
  /**
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(422).json({ success: false, error: 'email and password are required' });
      }

      const result = await authService.loginAdmin(email, password);
      // result = { token, user: {...} }

      return res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        data: {
          token: result.token,
          user: result.user     // { uid, email, role, profile }
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: `Admin login failed: ${error.message}`
      });
    }
  }
}

module.exports = new AuthController();
