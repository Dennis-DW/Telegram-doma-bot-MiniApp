// commands/admin/handlers/cleanupHandler.js
import dbCleanup from "../../../utils/dbCleanup.js";
import { ADMIN_CONFIG } from "../config/index.js";

// Force database cleanup
export const forceDatabaseCleanup = async (bot, chatId) => {
  try {
    await bot.sendMessage(chatId, ADMIN_CONFIG.MESSAGES.CLEANUP_STARTING);
    
    await dbCleanup.forceCleanup();
    await bot.sendMessage(chatId, ADMIN_CONFIG.MESSAGES.CLEANUP_SUCCESS);
  } catch (error) {
    console.error("Error during database cleanup:", error);
    await bot.sendMessage(chatId, `${ADMIN_CONFIG.MESSAGES.CLEANUP_FAILED} ${error.message}`);
  }
};

// Clear event queue
export const clearEventQueue = async (bot, chatId) => {
  try {
    const { clearQueue } = await import("../../../utils/eventAggregator.js");
    const clearedCount = clearQueue();
    
    const message = formatQueueCleared(clearedCount);
    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.error("Error clearing event queue:", error);
    await bot.sendMessage(chatId, "❌ Failed to clear event queue.");
  }
};

// Import the formatQueueCleared function
import { formatQueueCleared } from "../utils/formatUtils.js";

export default {
  forceDatabaseCleanup,
  clearEventQueue
}; 