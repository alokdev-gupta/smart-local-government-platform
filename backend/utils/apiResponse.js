/**
 * Utility for consistent API responses
 */

exports.successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

exports.errorResponse = (res, message = 'Server Error', statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error: error.message || error })
  });
};
