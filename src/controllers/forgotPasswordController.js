// src/controllers/authController.js
const { sendPasswordReset } = require("../services/forgotPasswordService");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const result = await sendPasswordReset(email);
    res.json({ message: "Password reset link generated!", link: result.link });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { forgotPassword };
