// commands/admin/handlers/statsHandler.js
import { getEventStats } from "../../../utils/storage.js";
import eventAggregator from "../../../utils/eventAggregator.js";
import dbCleanup from "../../../utils/dbCleanup.js";
import { formatSystemStats } from "../utils/formatUtils.js";

// Show system statistics
export const showSystemStats = async (bot, chatId) => {
  try {
    const stats = getEventStats();
    const aggregatorStatus = eventAggregator.getStatus();
    const cleanupStatus = dbCleanup.getStatus();

    const message = formatSystemStats(stats, aggregatorStatus, cleanupStatus);

    await bot.sendMessage(chatId, message, { parse_mode: "MarkdownV2" });
  } catch (error) {
    console.error("Error showing system stats:", error);
    await bot.sendMessage(chatId, "❌ Failed to retrieve system statistics.");
  }
};

// Show event history
export const showEventHistory = async (bot, chatId) => {
  try {
    const stats = getEventStats();
    const message = formatEventHistory(stats);

    await bot.sendMessage(chatId, message, { parse_mode: "MarkdownV2" });
  } catch (error) {
    console.error("Error showing event history:", error);
    await bot.sendMessage(chatId, "❌ Failed to retrieve event history.");
  }
};

// Import the formatEventHistory function
import { formatEventHistory } from "../utils/formatUtils.js";

export default {
  showSystemStats,
  showEventHistory
}; 