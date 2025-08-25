// commands/subscribe.js
import bot from "../config/bot.js";
import { addSubscriber } from "../utils/storage.js";

bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await addSubscriber(chatId);
    await bot.sendMessage(chatId, "✅ You are now subscribed to Doma alerts!");
  } catch (err) {
    console.error("Error subscribing:", err);
    bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
  }
});
