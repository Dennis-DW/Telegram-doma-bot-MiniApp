// commands/admin.js
import bot from "../config/bot.js";
import { broadcast } from "../utils/broadcast.js";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

bot.onText(/^\/broadcast (.+)/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  const message = match[1]; // everything after /broadcast

  // Restrict command to admin only
  if (chatId !== ADMIN_CHAT_ID) {
    await bot.sendMessage(chatId, "⛔ You are not authorized to use this command.");
    return;
  }

  try {
    await broadcast(`📢 Admin Broadcast:\n\n${message}`, null);
    await bot.sendMessage(chatId, "✅ Broadcast sent successfully!");
  } catch (error) {
    console.error("❌ Broadcast error:", error.message);
    await bot.sendMessage(chatId, "⚠️ Failed to broadcast message.");
  }
});
