// Standardized Success Response
const successResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
      status: 'success',
      message: message,
      data: data,
    });
  };
  
  // Standardized Error Response
  const errorResponse = (res, statusCode, message, error = null) => {
    return res.status(statusCode).json({
      status: 'error',
      message: message,
      error: error,
    });
  };
  
  // Standardized Response for Unauthorized Access
  const unauthorizedResponse = (res, message = 'Unauthorized Access') => {
    return res.status(401).json({
      status: 'error',
      message: message,
    });
  };
  
  module.exports = {
    successResponse,
    errorResponse,
    unauthorizedResponse,
  };
  