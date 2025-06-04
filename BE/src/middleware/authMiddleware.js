const User = require('../models/userModel');
const { AppError, catchAsync } = require('../utils/errorHandler');
const jwtUtils = require('../utils/jwtUtils');

/**
 * Protect routes - only authenticated users can access
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  
  // 1) Getting token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2) Check if token exists
  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // 3) Verify token
  const decoded = jwtUtils.verifyToken(token);

  // 4) Check if user still exists and is active
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }
  
  // 5) Check if user is active
  if (currentUser.profile.state !== 'active') {
    return next(new AppError('This user account has been blocked. Please contact support.', 403));
  }

  // 6) Grant access to protected route
  req.user = currentUser;
  next();
});



/**
 * Restrict access to certain roles
 * @param  {...string} roles - Allowed roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

/**
 * Optional authentication - verifies user if token exists, but doesn't block access
 */
exports.optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  
  // 1) Getting token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2) If no token, continue without authentication
  if (!token) {
    return next();
  }

  try {
    // 3) Verify token
    const decoded = jwtUtils.verifyToken(token);

    // 4) Check if user still exists and is active
    const currentUser = await User.findById(decoded.id);
    if (currentUser && currentUser.profile.state === 'active') {
      // Attach user to request object
      req.user = currentUser;
    }
  } catch (error) {
    // If token validation fails, continue without authentication
  }

  next();
}); 