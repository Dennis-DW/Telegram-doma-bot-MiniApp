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
  formatQueueCleared,
  escapeMarkdown
}; 