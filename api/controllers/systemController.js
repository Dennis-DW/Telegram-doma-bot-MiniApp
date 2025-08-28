// api/controllers/systemController.js
import { cleanupEvents } from '../../utils/storage.js';
import { sendSuccessResponse, sendErrorResponse, sendHealthResponse } from '../utils/responseUtils.js';
import { API_CONFIG } from '../config/index.js';

// Health check endpoint
export const healthCheck = async (req, res) => {
  try {
    sendHealthResponse(res);
  } catch (error) {
    console.error('Health check error:', error);
    sendErrorResponse(res, 'Health check failed', 500, error);
  }
};

// Manual cleanup endpoint
export const manualCleanup = async (req, res) => {
  try {
    const removedCount = cleanupEvents();
    
    const cleanupResult = {
      removedCount,
      message: `Cleaned up ${removedCount} old events`,
      timestamp: new Date().toISOString()
    };
    
    sendSuccessResponse(res, cleanupResult, API_CONFIG.MESSAGES.SUCCESS.CLEANUP_COMPLETED);
  } catch (error) {
    console.error('Error during cleanup:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.CLEANUP, 500, error);
  }
};

// Get system information
export const getSystemInfo = async (req, res) => {
  try {
    const systemInfo = {
      version: process.env.npm_package_version || '1.0.0',
      environment: API_CONFIG.NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };
    
    sendSuccessResponse(res, systemInfo, 'System information retrieved successfully');
  } catch (error) {
    console.error('Error fetching system info:', error);
    sendErrorResponse(res, 'Failed to fetch system information', 500, error);
  }
};

// Get API documentation
export const getApiDocs = async (req, res) => {
  try {
    const apiDocs = {
      version: '1.0.0',
      baseUrl: '/api',
      endpoints: {
        events: {
          'GET /events': 'Get all events',
          'GET /events/:eventType': 'Get events by type',
          'GET /events/stats': 'Get event statistics',
          'GET /events/recent': 'Get recent events'
        },
        subscription: {
          'GET /subscription/status': 'Get subscription status',
          'POST /subscription/subscribe': 'Subscribe to notifications',
          'POST /subscription/unsubscribe': 'Unsubscribe from notifications',
          'PUT /subscription/settings': 'Update subscription settings'
        },
        system: {
          'GET /health': 'Health check',
          'POST /cleanup': 'Manual cleanup',
          'GET /system/info': 'System information'
        }
      },
      eventTypes: Object.keys(API_CONFIG.EVENT_TYPE_MAP),
      timestamp: new Date().toISOString()
    };
    
    sendSuccessResponse(res, apiDocs, 'API documentation retrieved successfully');
  } catch (error) {
    console.error('Error fetching API docs:', error);
    sendErrorResponse(res, 'Failed to fetch API documentation', 500, error);
  }
};

export default {
  healthCheck,
  manualCleanup,
  getSystemInfo,
  getApiDocs
}; 