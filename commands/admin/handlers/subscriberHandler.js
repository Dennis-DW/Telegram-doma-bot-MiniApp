// commands/admin/handlers/subscriberHandler.js
import { getSubscribers } from "../../../utils/storage.js";

// Show subscriber list
export const showSubscriberList = async (bot, chatId) => {
  try {
    const subscribers = getSubscribers();
    
    if (subscribers.length === 0) {
      await bot.sendMessage(chatId, "No subscribers found.");
      return;
    }

    const maxShown = 10;
    const recentSubscribers = subscribers.slice(-maxShown);
    
    let message = `Subscriber List\n\n`;
    message += `Total Subscribers: ${subscribers.length}\n\n`;
    message += `Recent Subscribers:\n`;
    
    recentSubscribers.forEach((id, index) => {
      message += `${index + 1}. ${id}\n`;
    });

    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.error("Error showing subscriber list:", error);
    await bot.sendMessage(chatId, "Failed to retrieve subscriber list.");
  }
};

export default {
  showSubscriberList,
};