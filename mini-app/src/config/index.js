// mini-app/src/config/index.js

export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },

  // Real-time Configuration
  REALTIME: {
    ENABLED: true,
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 1000,
    KEEPALIVE_INTERVAL: 30000
  },

  // Event Configuration
  EVENTS: {
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100,
    RECENT_LIMIT: 10,
    REFRESH_INTERVAL: 30000
  },

  // UI Configuration
  UI: {
    THEME: 'light',
    LANGUAGE: 'en',
    DATE_FORMAT: 'MMM dd, yyyy HH:mm:ss',
    CURRENCY: 'USD'
  },

  // URL Configuration
  URLS: {
    EXPLORER_BASE: import.meta.env.VITE_EXPLORER_BASE_URL,
    FRONTEND_BASE: import.meta.env.VITE_FRONTEND_BASE_URL
  },

  // Feature Flags
  FEATURES: {
    REAL_TIME_UPDATES: true,
    SUBSCRIPTION_MANAGEMENT: true,
    EVENT_FILTERING: true,
    EXPORT_FUNCTIONALITY: false,
    ADMIN_PANEL: false
  },

  // Messages
  MESSAGES: {
    ERRORS: {
      API_CONNECTION: 'Unable to connect to the API server',
      NETWORK_ERROR: 'Network error occurred',
      UNAUTHORIZED: 'You are not authorized to perform this action',
      NOT_FOUND: 'The requested resource was not found',
      SERVER_ERROR: 'An internal server error occurred'
    },
    SUCCESS: {
      SUBSCRIBED: 'Successfully subscribed to notifications',
      UNSUBSCRIBED: 'Successfully unsubscribed from notifications',
      SETTINGS_UPDATED: 'Settings updated successfully'
    }
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
  }
};

export default CONFIG; 