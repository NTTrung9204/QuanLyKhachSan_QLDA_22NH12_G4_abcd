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
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  ResponseHandler.sendWithToken(res, 200, token, user);
}); 