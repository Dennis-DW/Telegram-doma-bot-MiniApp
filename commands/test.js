import bot from "../config/bot.js";

bot.onText(/\/test/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🚀 This is a test alert! In the future, this will be triggered by Doma events."
  );
});
