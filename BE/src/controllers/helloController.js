const { catchAsync } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');
const helloService = require('../services/helloService');

/**
 * Hello World API
 * Returns "Hello World" or "Hello {firstName}" if user is authenticated
 */
exports.getHello = catchAsync(async (req, res, next) => {
  const greeting = helloService.generateGreeting(req.user);
  ResponseHandler.success(res, 200, null, greeting);
}); 