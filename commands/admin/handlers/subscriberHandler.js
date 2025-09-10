// commands/admin/handlers/subscriberHandler.js
import database from "../../../utils/database.js";

export const handleSubscribersCommand = async (bot, chatId) => {
  try {
    const subscribers = await database.getSubscribers();
    
    if (subscribers.length === 0) {
      await bot.sendMessage(chatId, "No subscribers found.");
      return;
    }

    const message = `👥 **Subscribers List**\n\n` +
      `Total Subscribers: ${subscribers.length}\n\n` +
      `Subscriber IDs:\n` +
      subscribers.map((id, index) => `${index + 1}. ${id}`).join('\n');

    // Split message if too long
    if (message.length > 4000) {
      const chunks = message.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) {
        await bot.sendMessage(chatId, chunk, { parse_mode: "Markdown" });
      }
    } else {
      await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    }

  } catch (error) {
    console.error("Error fetching subscribers:", error);
    await bot.sendMessage(chatId, "An error occurred while fetching subscribers.");
  }
};

export const handleSubscriberStats = async (bot, chatId) => {
  try {
    const subscribers = await database.getSubscribers();
    const totalSubscribers = subscribers.length;
    
    // Get recent subscription activity (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // Note: This would require additional database queries to get subscription dates
    // For now, we'll show basic stats
    const message = `📊 **Subscriber Statistics**\n\n` +
      `Total Active Subscribers: ${totalSubscribers}\n` +
      `Database Status: ✅ Connected\n` +
      `Last Updated: ${new Date().toLocaleString()}`;

    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });

  } catch (error) {
    console.error("Error fetching subscriber stats:", error);
    await bot.sendMessage(chatId, "An error occurred while fetching subscriber statistics.");
  }
};

export default {
  handleSubscribersCommand,
  handleSubscriberStats
};
