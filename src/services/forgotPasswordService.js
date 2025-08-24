// src/services/authService.js
const { admin } = require("../config/firebase-admin");

const sendPasswordReset = async (email) => {
  try {
    
    const link = await admin.auth().generatePasswordResetLink(email, {
      url: "http://localhost:3000/login",
    });

    return { success: true, link };
  } catch (error) {
    console.error("Error generating password reset link:", error);
    throw error;
  }
};

module.exports = { sendPasswordReset };
