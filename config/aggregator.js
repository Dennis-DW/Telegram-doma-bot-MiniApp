// config/aggregator.js
export const AGGREGATOR_CONFIG = {
  // Event Aggregator Settings
  BROADCAST_INTERVAL: 30000, // 30 seconds
  MAX_EVENTS_PER_BATCH: 5, // Maximum events per broadcast
  MIN_BROADCAST_INTERVAL: 10000, // Minimum 10 seconds between broadcasts
  
  // Database Cleanup Settings
  CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
  EVENT_RETENTION_DAYS: 10, // Keep events for 10 days
  MAX_EVENTS_IN_DB: 100, // Maximum number of events to keep in database
  
  // Event Polling Settings
  EVENT_POLLING_INTERVAL: 10000, // 10 seconds
  
  // Message Formatting
  MAX_EVENTS_PER_TYPE_IN_SUMMARY: 3, // Show max 3 events per type in batch summary
  
  // Admin Settings
  ADMIN_CHAT_IDS: [
    "987654321", // Replace with your actual admin chat ID
    // Add more admin chat IDs as needed
  ]
};

export default AGGREGATOR_CONFIG; 