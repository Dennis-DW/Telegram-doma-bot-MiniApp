// commands/unsubscribe.js
import bot from "../config/bot.js";
import { removeSubscriber } from "../utils/storage.js";

bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await removeSubscriber(chatId);
    await bot.sendMessage(chatId, "🚫 You have unsubscribed from Doma alerts.");
  } catch (err) {
    console.error("Error unsubscribing:", err);
    bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
  }
});
