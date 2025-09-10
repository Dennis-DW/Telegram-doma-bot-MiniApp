// commands/admin/handlers/cleanupHandler.js
import database from "../../../utils/database.js";
import eventAggregator from "../../../utils/eventAggregator.js";

// Force database cleanup
export const forceDatabaseCleanup = async (bot, chatId) => {
  try {
    await bot.sendMessage(chatId, "🧹 Starting database cleanup...");
    
    const deletedCount = await database.cleanupOldEvents(10);
    
    await bot.sendMessage(chatId, `✅ Database cleanup completed! Removed ${deletedCount} old events.`);
  } catch (error) {
    console.error("Error during database cleanup:", error);
    await bot.sendMessage(chatId, `❌ Database cleanup failed: ${error.message}`);
  }
};

// Clear event queue
export const clearEventQueue = async (bot, chatId) => {
  try {
    const clearedCount = eventAggregator.clearQueue();
    
    await bot.sendMessage(chatId, `🧹 Event queue cleared! Removed ${clearedCount} events from queue.`);
  } catch (error) {
    console.error("Error clearing event queue:", error);
    await bot.sendMessage(chatId, "❌ Failed to clear event queue.");
  }
};

export default {
  forceDatabaseCleanup,
  clearEventQueue
};
