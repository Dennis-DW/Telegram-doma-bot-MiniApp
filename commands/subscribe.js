// commands/subscribe.js
import bot from "../config/bot.js";
import { addSubscriber, updateUserSettings } from "../utils/storage.js";

bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await addSubscriber(chatId);
    
    // Update user settings to indicate subscription via bot
    await updateUserSettings(chatId, {
      lastBotAction: 'subscribed',
      lastBotActionTime: new Date().toISOString(),
      source: 'bot'
    });
    
    await bot.sendMessage(chatId, "✅ You are now subscribed to Doma alerts!");
  } catch (err) {
    console.error("Error subscribing:", err);
    bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
  }
});
