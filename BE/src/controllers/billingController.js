const billingService = require('../services/billingService');
const { catchAsync } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');

/**
 * Send bill via email
 */
exports.sendBillByEmail = catchAsync(async (req, res, next) => {
  const result = await billingService.sendBillByEmail(req.params.bookingId, req.user);
  ResponseHandler.success(res, 200, result, 'Bill sent successfully');
}); 