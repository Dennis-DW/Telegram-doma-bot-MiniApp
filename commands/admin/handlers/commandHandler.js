// commands/admin/handlers/commandHandler.js
import bot from "../../../config/bot.js";
import { ADMIN_CONFIG } from "../config/index.js";
import { validateAdminAccess, validateAdminCallback } from "../utils/authUtils.js";
import { showSystemStats, showEventHistory } from "./statsHandler.js";
import { forceDatabaseCleanup, clearEventQueue } from "./cleanupHandler.js";
import { showAggregatorSettings, processQueueNow, resetAggregator } from "./aggregatorHandler.js";
import { showSubscriberList } from "./subscriberHandler.js";

// Main admin command handler
export const handleAdminCommand = async (msg) => {
  const chatId = msg.chat.id.toString();
  
  if (!await validateAdminAccess(bot, chatId)) {
    return;
  }

  const keyboard = {
    inline_keyboard: ADMIN_CONFIG.KEYBOARDS.MAIN_MENU
  };

  await bot.sendMessage(chatId, 
    "🔧 *Admin Panel*\n\nSelect an option to manage the system:", 
    { 
      parse_mode: "MarkdownV2",
      reply_markup: keyboard 
    }
  );
};

// Handle admin callback queries
export const handleAdminCallback = async (query) => {
  if (!await validateAdminCallback(bot, query)) {
    return;
  }

  const chatId = query.message.chat.id.toString();
  const data = query.data;

  try {
    switch (data) {
      case ADMIN_CONFIG.CALLBACK_PREFIXES.STATS:
        await showSystemStats(bot, chatId);
        break;
        
      case ADMIN_CONFIG.CALLBACK_PREFIXES.CLEANUP:
        await forceDatabaseCleanup(bot, chatId);
        break;
        
      case ADMIN_CONFIG.CALLBACK_PREFIXES.CLEAR_QUEUE:
        await clearEventQueue(bot, chatId);
        break;
        
      case ADMIN_CONFIG.CALLBACK_PREFIXES.AGGREGATOR:
        await showAggregatorSettings(bot, chatId);
        break;
        
      case ADMIN_CONFIG.CALLBACK_PREFIXES.SUBSCRIBERS:
        await showSubscriberList(bot, chatId);
        break;
        
      case ADMIN_CONFIG.CALLBACK_PREFIXES.EVENTS:
        await showEventHistory(bot, chatId);
        break;
        
      case ADMIN_CONFIG.CALLBACK_PREFIXES.PROCESS_QUEUE:
        await processQueueNow(bot, chatId);
        break;
        
      case ADMIN_CONFIG.CALLBACK_PREFIXES.RESET_AGGREGATOR:
        await resetAggregator(bot, chatId);
        break;
        
      default:
        await bot.sendMessage(chatId, "❌ Unknown admin action.");
    }
  } catch (error) {
    console.error("Admin command error:", error);
    await bot.sendMessage(chatId, ADMIN_CONFIG.MESSAGES.ERROR_OCCURRED);
  }

  await bot.answerCallbackQuery(query.id);
};

// Handle individual admin commands
export const handleStatsCommand = async (msg) => {
  const chatId = msg.chat.id.toString();
  
  if (!await validateAdminAccess(bot, chatId)) {
    return;
  }

  await showSystemStats(bot, chatId);
};

export const handleCleanupCommand = async (msg) => {
  const chatId = msg.chat.id.toString();
  
  if (!await validateAdminAccess(bot, chatId)) {
    return;
  }

  await forceDatabaseCleanup(bot, chatId);
};

export const handleQueueCommand = async (msg) => {
  const chatId = msg.chat.id.toString();
  
  if (!await validateAdminAccess(bot, chatId)) {
    return;
  }

  await showAggregatorSettings(bot, chatId);
};

export default {
  handleAdminCommand,
  handleAdminCallback,
  handleStatsCommand,
  handleCleanupCommand,
  handleQueueCommand
}; 