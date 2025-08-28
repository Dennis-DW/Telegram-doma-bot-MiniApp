// commands/admin/handlers/aggregatorHandler.js
import eventAggregator from "../../../utils/eventAggregator.js";
import { formatAggregatorSettings } from "../utils/formatUtils.js";
import { ADMIN_CONFIG } from "../config/index.js";

// Show aggregator settings
export const showAggregatorSettings = async (bot, chatId) => {
  try {
    const status = eventAggregator.getStatus();
    const message = formatAggregatorSettings(status);

    const keyboard = {
      inline_keyboard: ADMIN_CONFIG.KEYBOARDS.AGGREGATOR_MENU
    };

    await bot.sendMessage(chatId, message, { 
      parse_mode: "MarkdownV2",
      reply_markup: keyboard 
    });
  } catch (error) {
    console.error("Error showing aggregator settings:", error);
    await bot.sendMessage(chatId, "❌ Failed to retrieve aggregator settings.");
  }
};

// Process queue now
export const processQueueNow = async (bot, chatId) => {
  try {
    await bot.sendMessage(chatId, "📤 Processing event queue...");
    
    // Trigger immediate processing
    await eventAggregator.processBatch();
    
    await bot.sendMessage(chatId, "✅ Event queue processed successfully!");
  } catch (error) {
    console.error("Error processing queue:", error);
    await bot.sendMessage(chatId, "❌ Failed to process event queue.");
  }
};

// Reset aggregator
export const resetAggregator = async (bot, chatId) => {
  try {
    await bot.sendMessage(chatId, "🔄 Resetting event aggregator...");
    
    // Clear the queue
    eventAggregator.clearQueue();
    
    await bot.sendMessage(chatId, "✅ Event aggregator reset successfully!");
  } catch (error) {
    console.error("Error resetting aggregator:", error);
    await bot.sendMessage(chatId, "❌ Failed to reset event aggregator.");
  }
};

export default {
  showAggregatorSettings,
  processQueueNow,
  resetAggregator
}; 