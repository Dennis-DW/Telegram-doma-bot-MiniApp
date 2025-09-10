// api/controllers/eventController.js
import database from '../../utils/database.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtils.js';
import { API_CONFIG } from '../config/index.js';

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || API_CONFIG.DEFAULT_EVENT_LIMIT;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    const events = await database.getEvents(limit, skip);
    const total = await database.getEvents().then(events => events.length);
    
    sendSuccessResponse(res, { 
      events: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, 'Events retrieved successfully');
  } catch (error) {
    console.error('Error fetching events:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.FETCH_EVENTS, 500, error);
  }
};

// Get events by type
export const getEventsByType = async (req, res) => {
  try {
    const { eventType } = req.params;
    const limit = parseInt(req.query.limit) || API_CONFIG.DEFAULT_EVENT_LIMIT;
    const page = parseInt(req.query.page) || 1;
    
    // Validate event type
    if (!API_CONFIG.EVENT_TYPE_MAP[eventType]) {
      return sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.INVALID_EVENT_TYPE, 400, {
        validTypes: Object.keys(API_CONFIG.EVENT_TYPE_MAP)
      });
    }
    
    // Map the event type to the actual blockchain event name
    const blockchainEventType = API_CONFIG.EVENT_TYPE_MAP[eventType];
    const result = await database.getEventsByType(blockchainEventType, limit, page);
    
    sendSuccessResponse(res, { 
      events: result.events,
      eventType,
      mappedType: blockchainEventType,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    }, 'Events retrieved successfully');
  } catch (error) {
    console.error('Error fetching events by type:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.FETCH_EVENTS, 500, error);
  }
};

// Get recent events
export const getRecentEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || API_CONFIG.RECENT_EVENTS_LIMIT;
    const events = await database.getRecentEvents(limit);
    
    sendSuccessResponse(res, { events: events }, 'Recent events retrieved successfully');
  } catch (error) {
    console.error('Error fetching recent events:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.FETCH_EVENTS, 500, error);
  }
};

// Get event statistics
export const getEventStats = async (req, res) => {
  try {
    const stats = await database.getEventStats();
    sendSuccessResponse(res, stats, 'Event statistics retrieved successfully');
  } catch (error) {
    console.error('Error fetching stats:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.FETCH_STATS, 500, error);
  }
};

export default {
  getAllEvents,
  getEventsByType,
  getRecentEvents,
  getEventStats,
}
