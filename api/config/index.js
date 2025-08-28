// api/config/index.js
import dotenv from 'dotenv';

dotenv.config();

export const API_CONFIG = {
  // Server Configuration
  PORT: process.env.API_PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  CORS_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  CORS_HEADERS: ['Content-Type', 'Authorization'],
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // 100 requests per window
  
  // Event Configuration
  DEFAULT_EVENT_LIMIT: 50,
  MAX_EVENT_LIMIT: 100,
  RECENT_EVENTS_LIMIT: 10,
  
  // Cleanup Configuration
  CLEANUP_INTERVAL_MS: 6 * 60 * 60 * 1000, // 6 hours
  
  // Event Type Mapping
  EVENT_TYPE_MAP: {
    minting: 'OwnershipTokenMinted',
    transfers: 'Transfer',
    renewals: 'NameTokenRenewed',
    burning: 'NameTokenBurned',
    locks: 'LockStatusChanged',
    registrar: 'RegistrarChanged',
    metadata: 'MetadataUpdated',
    locked: 'NameTokenLocked',
    unlocked: 'NameTokenUnlocked',
    expired: 'DomainExpired'
  },
  
  // Response Messages
  MESSAGES: {
    SUCCESS: {
      SUBSCRIBED: 'Subscribed successfully',
      UNSUBSCRIBED: 'Unsubscribed successfully',
      SETTINGS_UPDATED: 'Settings updated successfully',
      CLEANUP_COMPLETED: 'Cleanup completed successfully'
    },
    ERROR: {
      FETCH_STATS: 'Failed to fetch stats',
      FETCH_EVENTS: 'Failed to fetch events',
      FETCH_SUBSCRIPTION: 'Failed to fetch subscription status',
      SUBSCRIBE: 'Failed to subscribe',
      UNSUBSCRIBE: 'Failed to unsubscribe',
      UPDATE_SETTINGS: 'Failed to update settings',
      CLEANUP: 'Failed to cleanup events',
      INVALID_LIMIT: 'Invalid limit parameter',
      INVALID_EVENT_TYPE: 'Invalid event type'
    }
  }
};

export default API_CONFIG; 