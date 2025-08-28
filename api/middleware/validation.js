// api/middleware/validation.js
import { API_CONFIG } from '../config/index.js';

// Validate limit parameter
export const validateLimit = (req, res, next) => {
  const limit = parseInt(req.query.limit);
  
  if (req.query.limit && (isNaN(limit) || limit < 1 || limit > API_CONFIG.MAX_EVENT_LIMIT)) {
    return res.status(400).json({
      error: true,
      message: API_CONFIG.MESSAGES.ERROR.INVALID_LIMIT,
      validRange: `1-${API_CONFIG.MAX_EVENT_LIMIT}`
    });
  }
  
  next();
};

// Validate event type parameter
export const validateEventType = (req, res, next) => {
  const { eventType } = req.params;
  
  if (eventType && !API_CONFIG.EVENT_TYPE_MAP[eventType]) {
    return res.status(400).json({
      error: true,
      message: API_CONFIG.MESSAGES.ERROR.INVALID_EVENT_TYPE,
      validTypes: Object.keys(API_CONFIG.EVENT_TYPE_MAP)
    });
  }
  
  next();
};

// Validate subscription settings
export const validateSubscriptionSettings = (req, res, next) => {
  const { settings } = req.body;
  
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({
      error: true,
      message: 'Invalid settings format'
    });
  }
  
  // Add more validation as needed
  next();
};

export default {
  validateLimit,
  validateEventType,
  validateSubscriptionSettings
}; 