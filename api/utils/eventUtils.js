// api/utils/eventUtils.js
import { getEvents } from '../../utils/storage.js';
import { API_CONFIG } from '../config/index.js';

// Get events by type with mapping
export const getEventsByType = (eventType) => {
  const allEvents = getEvents();
  
  if (!eventType) return allEvents;
  
  const mappedType = API_CONFIG.EVENT_TYPE_MAP[eventType];
  if (!mappedType) return [];
  
  return allEvents.filter(event => event.type === mappedType);
};

// Get events with pagination and filtering
export const getEventsWithPagination = (options = {}) => {
  const {
    limit = API_CONFIG.DEFAULT_EVENT_LIMIT,
    eventType = null,
    reverse = true
  } = options;

  let events = eventType ? getEventsByType(eventType) : getEvents();
  
  // Apply limit
  const limitedEvents = events.slice(-limit);
  
  // Apply reverse if requested
  return reverse ? limitedEvents.reverse() : limitedEvents;
};

// Get recent events
export const getRecentEvents = (limit = API_CONFIG.RECENT_EVENTS_LIMIT) => {
  return getEventsWithPagination({ limit, reverse: true });
};

// Format event for API response
export const formatEventForAPI = (event) => {
  return {
    id: event.timestamp + '_' + event.txHash,
    type: event.type,
    args: event.args,
    txHash: event.txHash,
    blockNumber: event.blockNumber,
    logIndex: event.logIndex,
    timestamp: event.timestamp,
    message: event.message
  };
};

// Format events array for API response
export const formatEventsForAPI = (events) => {
  return events.map(formatEventForAPI);
};

export default {
  getEventsByType,
  getEventsWithPagination,
  getRecentEvents,
  formatEventForAPI,
  formatEventsForAPI
}; 