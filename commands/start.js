// commands/start.js
import bot from "../config/bot.js";

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome to Doma Alerts Bot!\n\nUse /subscribe to start receiving alerts, or /unsubscribe to stop."
  );
});
