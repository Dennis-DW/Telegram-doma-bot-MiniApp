// commands/admin/handlers/statsHandler.js
import { getEventStats } from "../../../utils/storage.js";
import eventAggregator from "../../../utils/eventAggregator.js";
import dbCleanup from "../../../utils/dbCleanup.js";

// Show system statistics
export const showSystemStats = async (bot, chatId) => {
  try {
    const stats = getEventStats();
    const aggregatorStatus = eventAggregator.getStatus();
    const cleanupStatus = dbCleanup.getStatus();

    let message = `System Statistics\n\n`;
    message += `Events:\n`;
    message += `• Total: ${stats.totalEvents}\n`;
    message += `• Today: ${stats.eventsToday}\n`;
    message += `• Types: ${Object.keys(stats.eventTypes).length}\n\n`;
    message += `Subscribers:\n`;
    message += `• Active: ${stats.activeSubscribers}\n\n`;
    message += `Event Aggregator:\n`;
    message += `• Queue Size: ${aggregatorStatus.queueSize}\n`;
    message += `• Processing: ${aggregatorStatus.isProcessing ? 'Yes' : 'No'}\n`;
    message += `• Last Broadcast: ${aggregatorStatus.lastBroadcastTime ? new Date(aggregatorStatus.lastBroadcastTime).toLocaleString() : 'Never'}\n\n`;
    message += `Database Cleanup:\n`;
    message += `• Running: ${cleanupStatus.isRunning ? 'Yes' : 'No'}\n`;
    message += `• Last Cleanup: ${cleanupStatus.lastCleanupTime ? new Date(cleanupStatus.lastCleanupTime).toLocaleString() : 'Never'}\n`;
    message += `• Next Cleanup: ${cleanupStatus.nextCleanupTime ? new Date(cleanupStatus.nextCleanupTime).toLocaleString() : 'Never'}`;

    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.error("Error showing system stats:", error);
    await bot.sendMessage(chatId, "Failed to retrieve system statistics.");
  }
};

// Show event history
export const showEventHistory = async (bot, chatId) => {
  try {
    const stats = getEventStats();
    
    let message = `Event History\n\n`;
    message += `Summary:\n`;
    message += `• Total Events: ${stats.totalEvents}\n`;
    message += `• Events Today: ${stats.eventsToday}\n\n`;
    message += `Event Types:\n`;
    
    Object.entries(stats.eventTypes).forEach(([type, count]) => {
      message += `• ${type}: ${count}\n`;
    });

    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.error("Error showing event history:", error);
    await bot.sendMessage(chatId, "Failed to retrieve event history.");
  }
};

export default {
  showSystemStats,
  showEventHistory
}; 