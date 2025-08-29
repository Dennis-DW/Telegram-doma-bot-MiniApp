// commands/admin/handlers/broadcastHandler.js
import bot from "../../../config/bot.js";
import { ADMIN_CONFIG } from "../config/index.js";
import { getSubscribers } from "../../../utils/storage.js";

/**
 * Show broadcast usage instructions
 */
export const startBroadcast = async (bot, chatId) => {
  try {
    const subscribers = getSubscribers();
    
    if (subscribers.length === 0) {
      await bot.sendMessage(chatId, "No subscribers to broadcast to.");
      return;
    }

    await bot.sendMessage(chatId, 
      "📢 Simple Broadcast\n\n" +
      "Use: /broadcast <your message>\n\n" +
      "Example: /broadcast Hello everyone!"
    );

  } catch (error) {
    console.error("Error showing broadcast instructions:", error);
    await bot.sendMessage(chatId, "An error occurred while processing your request.");
  }
};

/**
 * Handle direct broadcast command with message
 */
export const handleDirectBroadcast = async (bot, chatId, messageText) => {
  try {
    const subscribers = getSubscribers();
    
    if (subscribers.length === 0) {
      await bot.sendMessage(chatId, "No subscribers to broadcast to.");
      return;
    }

    if (!messageText || messageText.trim() === '') {
      await bot.sendMessage(chatId, 
        "Please provide a message to broadcast.\n\n" +
        "Usage: /broadcast <your message>"
      );
      return;
    }

    // Send the message directly to all subscribers
    let successCount = 0;
    let errorCount = 0;
    const invalidSubscribers = [];
    
    for (const subscriberId of subscribers) {
      try {
        // Send as plain text (no Markdown)
        await bot.sendMessage(subscriberId, messageText);
        successCount++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Failed to send broadcast to ${subscriberId}:`, error.message);
        errorCount++;
        
        // Mark invalid subscribers for removal
        if (error.message.includes('chat not found') || 
            error.message.includes('bot was blocked') ||
            error.message.includes('user is deactivated') ||
            error.message.includes('chat was deleted')) {
          invalidSubscribers.push(subscriberId);
        }
      }
    }
    
    // Remove invalid subscribers
    if (invalidSubscribers.length > 0) {
      const { removeSubscriber } = await import("../../../utils/storage.js");
      for (const chatId of invalidSubscribers) {
        removeSubscriber(chatId);
        console.log(`Removed invalid subscriber: ${chatId}`);
      }
    }

    // Send confirmation to admin
    await bot.sendMessage(chatId, `Broadcast sent successfully to ${successCount} subscribers!`);

    if (errorCount > 0) {
      await bot.sendMessage(chatId, `Failed to send to ${errorCount} subscribers.`);
    }

    console.log(`Broadcast sent by admin ${chatId} to ${successCount} subscribers`);

  } catch (error) {
    console.error("Error sending broadcast:", error);
    await bot.sendMessage(chatId, `Failed to send broadcast: ${error.message}`);
  }
};

export default {
  startBroadcast,
  handleDirectBroadcast
}; 