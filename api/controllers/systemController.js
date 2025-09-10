// api/controllers/systemController.js
import database from '../../utils/database.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtils.js';
import { API_CONFIG } from '../config/index.js';

// Health check endpoint
export const healthCheck = async (req, res) => {
  try {
    // Check database connection
    const isDbConnected = database.isConnected;
    
    const health = {
      status: isDbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: isDbConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    };
    
    const statusCode = isDbConnected ? 200 : 503;
    sendSuccessResponse(res, health, 'Health check completed', statusCode);
  } catch (error) {
    console.error('Error in health check:', error);
    sendErrorResponse(res, 'Health check failed', 500, error);
  }
};

// System information
export const getSystemInfo = async (req, res) => {
  try {
    const stats = await database.getEventStats();
    const subscribers = await database.getSubscribers();
    
    const systemInfo = {
      ...stats,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: API_CONFIG.NODE_ENV
      },
      database: {
        connected: database.isConnected,
        collections: ['events', 'subscribers']
      }
    };
    
    sendSuccessResponse(res, systemInfo, 'System information retrieved successfully');
  } catch (error) {
    console.error('Error fetching system info:', error);
    sendErrorResponse(res, 'Failed to fetch system information', 500, error);
  }
};

// Cleanup old events
export const cleanupEvents = async (req, res) => {
  try {
    const retentionDays = parseInt(req.body.retentionDays) || 10;
    const deletedCount = await database.cleanupOldEvents(retentionDays);
    
    sendSuccessResponse(res, { 
      deletedCount,
      retentionDays,
      message: `Cleaned up ${deletedCount} events older than ${retentionDays} days`
    }, 'Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
    sendErrorResponse(res, 'Cleanup failed', 500, error);
  }
};

// API documentation
export const getApiDocs = async (req, res) => {
  try {
    const docs = {
      title: 'Doma Event Tracker API',
      version: '1.0.0',
      description: 'API for managing Doma blockchain event notifications',
      endpoints: {
        events: {
          'GET /api/events': 'Get all events with pagination',
          'GET /api/events/:eventType': 'Get events by type',
          'GET /api/events/stats': 'Get event statistics',
          'GET /api/events/recent': 'Get recent events'
        },
        subscription: {
          'GET /api/subscription/status': 'Get subscription status',
          'POST /api/subscription/subscribe': 'Subscribe user',
          'POST /api/subscription/unsubscribe': 'Unsubscribe user',
          'PUT /api/subscription/settings': 'Update user settings',
          'GET /api/subscription/settings': 'Get user settings'
        },
        system: {
          'GET /health': 'Health check',
          'GET /system/info': 'System information',
          'POST /cleanup': 'Cleanup old events',
          'GET /docs': 'API documentation'
        }
      },
      examples: {
        subscribe: {
          method: 'POST',
          url: '/api/subscription/subscribe',
          body: { telegramId: '123456789' }
        },
        getEvents: {
          method: 'GET',
          url: '/api/events?limit=10&page=1'
        }
      }
    };
    
    sendSuccessResponse(res, docs, 'API documentation retrieved successfully');
  } catch (error) {
    console.error('Error fetching API docs:', error);
    sendErrorResponse(res, 'Failed to fetch API documentation', 500, error);
  }
};

export default {
  healthCheck,
  getSystemInfo,
  cleanupEvents,
  getApiDocs
};
