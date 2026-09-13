const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT
const protect = async (req, res, next) => {
  let token;

  // Check for token in cookies first, then fallback to Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    res.status(401);
    return next(new Error('Not authorized to access this route, no token provided'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token payload (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      return next(new Error('User not found with this token'));
    }

    next();
  } catch (error) {
    res.status(401);
    return next(new Error('Not authorized, token validation failed'));
  }
};

// Grant access to specific roles (Admin authorization)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    return next(new Error('Access denied: Admin authorization required'));
  }
};

// Alias for consistency with requireAdmin nomenclature
const requireAdmin = admin;

module.exports = { protect, admin, requireAdmin };