// commands/admin/utils/formatUtils.js
import { ADMIN_CONFIG } from '../config/index.js';

// Format date for display
export const formatDate = (timestamp) => {
  if (!timestamp) return 'Never';
  
  try {
    return new Date(timestamp).toLocaleString(
      ADMIN_CONFIG.DISPLAY.DATE_FORMAT,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    );
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format system statistics message
export const formatSystemStats = (stats, aggregatorStatus, cleanupStatus) => {
  return `📊 *System Statistics*\n\n` +
    `*Events:*\n` +
    `• Total: ${stats.totalEvents}\n` +
    `• Today: ${stats.eventsToday}\n` +
    `• Types: ${Object.keys(stats.eventTypes).length}\n\n` +
    `*Subscribers:*\n` +
    `• Active: ${stats.activeSubscribers}\n\n` +
    `*Event Aggregator:*\n` +
    `• Queue Size: ${aggregatorStatus.queueSize}\n` +
    `• Processing: ${aggregatorStatus.isProcessing ? 'Yes' : 'No'}\n` +
    `• Last Broadcast: ${formatDate(aggregatorStatus.lastBroadcastTime)}\n\n` +
    `*Database Cleanup:*\n` +
    `• Running: ${cleanupStatus.isRunning ? 'Yes' : 'No'}\n` +
    `• Last Cleanup: ${formatDate(cleanupStatus.lastCleanupTime)}\n` +
    `• Next Cleanup: ${formatDate(cleanupStatus.nextCleanupTime)}`;
};

// Format aggregator settings message
export const formatAggregatorSettings = (status) => {
  return `⚙️ *Event Aggregator Settings*\n\n` +
    `*Current Status:*\n` +
    `• Queue Size: ${status.queueSize}\n` +
    `• Processing: ${status.isProcessing ? 'Yes' : 'No'}\n` +
    `• Last Broadcast: ${formatDate(status.lastBroadcastTime)}\n\n` +
    `*Configuration:*\n` +
    `• Broadcast Interval: 30 seconds\n` +
    `• Max Events per Batch: 5\n` +
    `• Min Broadcast Interval: 10 seconds`;
};

// Format subscriber list message
export const formatSubscriberList = (subscribers) => {
  if (subscribers.length === 0) {
    return ADMIN_CONFIG.MESSAGES.NO_SUBSCRIBERS;
  }

  const maxShown = ADMIN_CONFIG.DISPLAY.MAX_SUBSCRIBERS_SHOWN;
  const recentSubscribers = subscribers.slice(-maxShown);
  
  return `👥 *Subscriber List*\n\n` +
    `Total Subscribers: ${subscribers.length}\n\n` +
    `*Recent Subscribers:*\n` +
    recentSubscribers.map((id, index) => `${index + 1}. ${id}`).join('\n');
};

// Format event history message
export const formatEventHistory = (stats) => {
  return `📋 *Event History*\n\n` +
    `*Summary:*\n` +
    `• Total Events: ${stats.totalEvents}\n` +
    `• Events Today: ${stats.eventsToday}\n\n` +
    `*Event Types:*\n` +
    Object.entries(stats.eventTypes)
      .map(([type, count]) => `• ${type}: ${count}`)
      .join('\n');
};

// Format queue cleared message
export const formatQueueCleared = (count) => {
  return ADMIN_CONFIG.MESSAGES.QUEUE_CLEARED.replace('{count}', count);
};

// Escape markdown characters for Telegram
export const escapeMarkdown = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
};

export default {
  formatDate,
  formatSystemStats,
  formatAggregatorSettings,
  formatSubscriberList,
  formatEventHistory,
  formatQueueCleared,
  escapeMarkdown
}; 