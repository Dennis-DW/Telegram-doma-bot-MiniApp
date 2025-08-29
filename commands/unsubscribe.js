// commands/unsubscribe.js
import bot from "../config/bot.js";
import { removeSubscriber, updateUserSettings } from "../utils/storage.js";

bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await removeSubscriber(chatId);
    
    // Update user settings to indicate unsubscription via bot
    await updateUserSettings(chatId, {
      lastBotAction: 'unsubscribed',
      lastBotActionTime: new Date().toISOString(),
      source: 'bot'
    });
    
    await bot.sendMessage(chatId, "🚫 You have unsubscribed from Doma alerts.");
  } catch (err) {
    console.error("Error unsubscribing:", err);
    bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
  }
});
