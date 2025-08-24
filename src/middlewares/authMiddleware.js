// src/middlewares/authMiddleware.js
const authService = require('../services/authService');

/**
 * Middleware: يتحقق من وجود JWT بصيغة Bearer ويقوم بفكّه
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    // دعم صيغ متعددة: "Bearer <token>" أو التوكن مباشرة
    let token = null;

    if (authHeader && typeof authHeader === 'string') {
      if (authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.slice(7).trim();
      } else {
        token = authHeader.trim();
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'مطلوب token للمصادقة',
        message: 'يرجى توفير token صحيح في Authorization header بصيغة: Bearer <token>'
      });
    }

    // ✅ استعمل الدالة الموجودة في السيرفس
    const decoded = await authService.validateToken(token); // تُعيد payload مفكوك
    // نتوقع: { uid, email, role } على الأقل
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'فشل في المصادقة',
      message: error.message || 'Invalid or expired token'
    });
  }
};

/**
 * Middleware: يتأكد أن المستخدم Admin
 * استخدمه بعد authenticateToken
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'مطلوب مصادقة',
      message: 'يرجى تسجيل الدخول أولاً'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'غير مصرح',
      message: 'ليس لديك صلاحية للوصول لهذا المورد'
    });
  }

  next();
};

/**
 * Middleware اختياري: يقرأ التوكن إن وُجد لكن لا يفشل بدونه
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (authHeader) {
      let token = null;
      if (authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.slice(7).trim();
      } else {
        token = authHeader.trim();
      }
      if (token) {
        const decoded = await authService.validateToken(token);
        req.user = decoded;
      }
    }
    next();
  } catch {
    // تابع بدون مصادقة إذا فشل فك التوكن
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};
