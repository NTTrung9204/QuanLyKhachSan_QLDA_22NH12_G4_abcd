/**
 * Standard response formatter
 */
class ResponseHandler {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {Object|Array} data - Response data
   * @param {String} message - Success message
   */
  static success(res, statusCode = 200, data = null, message = 'Success') {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} message - Error message
   */
  static error(res, statusCode = 500, message = 'Error') {
    return res.status(statusCode).json({
      status: 'error',
      message
    });
  }

  /**
   * Send response with token
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {String} token - JWT token
   * @param {Object} user - User data
   */
  static sendWithToken(res, statusCode = 200, token, user) {
    return res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  }
}

module.exports = ResponseHandler; 