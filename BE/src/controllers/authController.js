const authService = require('../services/authService');
const { catchAsync } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');

/**
 * User signup
 */
exports.signup = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.registerUser(req.body);
  ResponseHandler.sendWithToken(res, 201, token, user);
});

/**
 * User login
 */
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const { user, token } = await authService.loginUser(username, password);
  ResponseHandler.sendWithToken(res, 200, token, user);
});

/**
 * User logout
 */
exports.logout = catchAsync(async (req, res, next) => {
  // Since we're using JWT, we don't need to do anything server-side
  // The client will handle removing the token
  ResponseHandler.success(res, 200, null, 'Logged out successfully');
});