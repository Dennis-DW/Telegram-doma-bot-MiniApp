// commands/admin/config/index.js
import dotenv from "dotenv";

dotenv.config();

export const ADMIN_CONFIG = {
  // Admin chat IDs - can be single ID or array of IDs
  ADMIN_CHAT_IDS: process.env.ADMIN_CHAT_IDS ? 
    process.env.ADMIN_CHAT_ID.split(',').map(id => id.trim()) : 
    ['1802348890'], // Default admin ID
  
  // Admin command settings
  COMMANDS: {
    ADMIN: '/admin',
    STATS: '/stats',
    CLEANUP: '/cleanup',
    QUEUE: '/queue'
  },
  
  // Callback data prefixes
  CALLBACK_PREFIXES: {
    ADMIN: 'admin_',
    STATS: 'admin_stats',
    CLEANUP: 'admin_cleanup',
    CLEAR_QUEUE: 'admin_clear_queue',
    AGGREGATOR: 'admin_aggregator',
    SUBSCRIBERS: 'admin_subscribers',
    EVENTS: 'admin_events',
    PROCESS_QUEUE: 'admin_process_queue',
    RESET_AGGREGATOR: 'admin_reset_aggregator'
  },
  
  // Message templates
  MESSAGES: {
    ACCESS_DENIED: "❌ You don't have permission to use admin commands.",
    ERROR_OCCURRED: "❌ An error occurred while processing your request.",
    CLEANUP_STARTING: "🧹 Starting forced database cleanup...",
    CLEANUP_SUCCESS: "✅ Database cleanup completed successfully!",
    CLEANUP_FAILED: "❌ Database cleanup failed:",
    NO_SUBSCRIBERS: "👥 No subscribers found.",
    QUEUE_CLEARED: "🧹 Cleared {count} events from the aggregator queue."
  },
  
  // Keyboard layouts
  KEYBOARDS: {
    MAIN_MENU: [
      [
        { text: "📊 System Stats", callback_data: "admin_stats" },
        { text: "🧹 Force Cleanup", callback_data: "admin_cleanup" }
      ],
      [
        { text: "📤 Clear Event Queue", callback_data: "admin_clear_queue" },
        { text: "⚙️ Aggregator Settings", callback_data: "admin_aggregator" }
      ],
      [
        { text: "👥 Subscriber List", callback_data: "admin_subscribers" },
        { text: "📋 Event History", callback_data: "admin_events" }
      ]
    ],
    AGGREGATOR_MENU: [
      [
        { text: "📤 Process Queue Now", callback_data: "admin_process_queue" },
        { text: "🔄 Reset Aggregator", callback_data: "admin_reset_aggregator" }
      ]
    ]
  },
  
  // Display settings
  DISPLAY: {
    MAX_SUBSCRIBERS_SHOWN: 10,
    DATE_FORMAT: 'en-US',
    TIME_FORMAT: 'en-US'
  }
};

export default ADMIN_CONFIG; 