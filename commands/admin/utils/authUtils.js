// commands/admin/utils/authUtils.js
import { ADMIN_CONFIG } from '../config/index.js';

// Check if user is admin
export const isAdmin = (chatId) => {
  const chatIdStr = chatId.toString();
  return ADMIN_CONFIG.ADMIN_CHAT_IDS.includes(chatIdStr);
};

// Validate admin access and send error message if not authorized
export const validateAdminAccess = async (bot, chatId) => {
  if (!isAdmin(chatId)) {
    await bot.sendMessage(chatId, ADMIN_CONFIG.MESSAGES.ACCESS_DENIED);
    return false;
  }
  return true;
};

// Validate admin access for callback queries
export const validateAdminCallback = async (bot, query) => {
  const chatId = query.message.chat.id.toString();
  
  if (!isAdmin(chatId)) {
    await bot.answerCallbackQuery(query.id, { text: "❌ Access denied" });
    return false;
  }
  return true;
};

// Get admin chat IDs for logging/debugging
export const getAdminChatIds = () => {
  return [...ADMIN_CONFIG.ADMIN_CHAT_IDS];
};

// Check if admin configuration is valid
export const validateAdminConfig = () => {
  const issues = [];
  
  if (!ADMIN_CONFIG.ADMIN_CHAT_IDS || ADMIN_CONFIG.ADMIN_CHAT_IDS.length === 0) {
    issues.push('No admin chat IDs configured');
  }
  
  if (ADMIN_CONFIG.ADMIN_CHAT_IDS.some(id => !id || id.trim() === '')) {
    issues.push('Invalid admin chat ID found');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

export default {
  isAdmin,
  validateAdminAccess,
  validateAdminCallback,
  getAdminChatIds,
  validateAdminConfig
}; 