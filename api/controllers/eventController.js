// api/controllers/eventController.js
import { getEventStats as getEventStatsFromStorage } from '../../utils/storage.js';
import { 
  getEventsWithPagination, 
  getRecentEvents as fetchRecentEvents, 
  formatEventsForAPI 
} from '../utils/eventUtils.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtils.js';
import { API_CONFIG } from '../config/index.js';

// Broadcast event to all connected streaming clients

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || API_CONFIG.DEFAULT_EVENT_LIMIT;
    const page = parseInt(req.query.page) || 1;
    const events = getEventsWithPagination({ limit, page });
    const formattedEvents = formatEventsForAPI(events);
    
    sendSuccessResponse(res, { events: formattedEvents }, 'Events retrieved successfully');
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
    
    const events = getEventsWithPagination({ limit, eventType, page });
    const formattedEvents = formatEventsForAPI(events);
    
    sendSuccessResponse(res, { 
      events: formattedEvents,
      eventType,
      mappedType: API_CONFIG.EVENT_TYPE_MAP[eventType]
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
    const events = fetchRecentEvents(limit);
    const formattedEvents = formatEventsForAPI(events);
    
    sendSuccessResponse(res, { events: formattedEvents }, 'Recent events retrieved successfully');
  } catch (error) {
    console.error('Error fetching recent events:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.FETCH_EVENTS, 500, error);
  }
};

// Get event statistics
export const getEventStats = async (req, res) => {
  try {
    const stats = getEventStatsFromStorage();
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
