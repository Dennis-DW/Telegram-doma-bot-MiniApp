// commands/unsubscribe.js
import bot from "../config/bot.js";
import database from "../utils/database.js";

bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await database.removeSubscriber(chatId);
    
    // Update user settings to indicate unsubscription via bot
    await database.updateUserSettings(chatId, {
      lastBotAction: 'unsubscribed',
      lastBotActionTime: new Date().toISOString(),
      source: 'bot'
    });
    
    await bot.sendMessage(chatId, "🚫 You have unsubscribed from Doma alerts!");
  } catch (err) {
    console.error("Error unsubscribing:", err);
    bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
  }
});
