// commands/admin/handlers/statsHandler.js
import database from "../../../utils/database.js";

export const handleStatsCommand = async (bot, chatId) => {
  try {
    const stats = await database.getEventStats();
    
    const message = `📊 **System Statistics**\n\n` +
      `**Events:**\n` +
      `• Total Events: ${stats.totalEvents}\n` +
      `• Events Today: ${stats.eventsToday}\n` +
      `• Events This Week: ${stats.eventsThisWeek}\n` +
      `• Events This Month: ${stats.eventsThisMonth}\n\n` +
      `**Subscribers:**\n` +
      `• Active Subscribers: ${stats.activeSubscribers}\n\n` +
      `**System:**\n` +
      `• Network Status: ${stats.networkStatus}\n` +
      `• Last Updated: ${new Date(stats.lastUpdated).toLocaleString()}\n\n` +
      `**Event Types:**\n` +
      Object.entries(stats.eventTypes).map(([type, count]) => 
        `• ${type}: ${count}`
      ).join('\n');

    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });

  } catch (error) {
    console.error("Error fetching stats:", error);
    await bot.sendMessage(chatId, "An error occurred while fetching statistics.");
  }
};

export const handleDetailedStats = async (bot, chatId) => {
  try {
    const stats = await database.getEventStats();
    
    const todayStats = Object.entries(stats.todayEventTypes)
      .filter(([type, count]) => count > 0)
      .map(([type, count]) => `• ${type}: ${count}`)
      .join('\n') || 'No events today';

    const message = `📈 **Detailed Statistics**\n\n` +
      `**Today's Events:**\n${todayStats}\n\n` +
      `**All-Time Event Types:**\n` +
      Object.entries(stats.eventTypes)
        .sort(([,a], [,b]) => b - a)
        .map(([type, count]) => `• ${type}: ${count}`)
        .join('\n');

    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });

  } catch (error) {
    console.error("Error fetching detailed stats:", error);
    await bot.sendMessage(chatId, "An error occurred while fetching detailed statistics.");
  }
};

export default {
  handleStatsCommand,
  handleDetailedStats
};
