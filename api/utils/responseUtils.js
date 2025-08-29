// api/utils/responseUtils.js
import { API_CONFIG } from '../config/index.js';

// Success response helper
export const sendSuccessResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Error response helper
export const sendErrorResponse = (res, message, statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (error && API_CONFIG.NODE_ENV === 'development') {
    response.error = error.message;
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};



// Health check response
export const sendHealthResponse = (res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: API_CONFIG.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
};

export default {
  sendSuccessResponse,
  sendErrorResponse,
  sendHealthResponse
}; 