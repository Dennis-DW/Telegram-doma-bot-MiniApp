import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create bot (polling = true lets it receive messages continuously)
const bot = new TelegramBot(token, { polling: true });

// Start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome to Doma Alerts Bot!\n\nUse /subscribe to get domain event alerts or /unsubscribe to stop."
  );
});

// Subscribe command
bot.onText(/\/subscribe/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ You are now subscribed to alerts!");
});

// Unsubscribe command
bot.onText(/\/unsubscribe/, (msg) => {
  bot.sendMessage(msg.chat.id, "❌ You have unsubscribed from alerts.");
});

// Default handler (catch any message not matching above)
bot.on("message", (msg) => {
  console.log("Message received:", msg.text);
});
