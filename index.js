// index.js
import bot from "./config/bot.js";

// Commands
import "./commands/start.js";
import "./commands/subscribe.js";
import "./commands/unsubscribe.js";
import "./commands/test.js";
import "./commands/admin.js"; 

// Utils
import { broadcast } from "./utils/broadcast.js";

// Listener
import { startDomaListeners, stopDomaListeners } from "./listeners/domaEvents.js";

(async () => {
  try {
    // Start Telegram bot
    console.log("🤖 Telegram bot initialized...");

    // Start on-chain listeners
    await startDomaListeners();
    console.log("🔗 Doma event listeners started...");
  } catch (err) {
    console.error("❌ Error starting bot:", err);
  }
})();

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`🛑 Received ${signal}. Shutting down gracefully...`);
  stopDomaListeners();
  setTimeout(() => process.exit(0), 1000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
