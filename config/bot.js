// config/bot.js
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("❌ TELEGRAM_BOT_TOKEN is missing in .env file!");
}

// Create bot instance with more options for better error handling
const bot = new TelegramBot(token, {
  polling: {
    interval: 300, // Polling interval in ms
    autoStart: true,
    params: {
      timeout: 10 // Server timeout for polling
    }
  }
});

// Error handling for the bot
bot.on("error", (error) => {
  console.error("❌ Telegram Bot Error:", error);
});

bot.on("polling_error", (error) => {
  console.error("❌ Telegram Polling Error:", error);
});

console.log("✅ Telegram bot initialized successfully");

export default bot;