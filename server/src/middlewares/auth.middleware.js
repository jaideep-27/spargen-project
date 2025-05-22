const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv');
dotenv.config();

// Protect routes - Authentication
exports.protect = async (req, res, next) => {
  let token;
  
  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Log token for debugging
      console.log('Token received:', token);
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
      
      console.log('Decoded token:', decoded);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }
      
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        error: error.message
      });
    }
  } else if (!req.headers.authorization) {
    console.log('No authorization header found');
    return res.status(401).json({
      success: false,
      message: 'Authorization header is missing'
    });
  } else if (!req.headers.authorization.startsWith('Bearer')) {
    console.log('Token format is incorrect');
    return res.status(401).json({
      success: false,
      message: 'Token format is incorrect. Please use Bearer format'
    });
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Role authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorize middleware - Required roles:', roles);
    console.log('Authorize middleware - User:', req.user ? {
      id: req.user._id,
      role: req.user.role
    } : 'No user found');
    
    if (!req.user) {
      console.log('Authorize middleware - No user found in request');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`Authorize middleware - User role ${req.user.role} does not match required roles: ${roles.join(', ')}`);
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    
    console.log('Authorize middleware - User authorized successfully');
    next();
  };
}; 