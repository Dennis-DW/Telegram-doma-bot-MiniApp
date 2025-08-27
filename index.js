// index.js

// Commands
import "./commands/start.js";
import "./commands/subscribe.js";
import "./commands/unsubscribe.js";
import "./commands/admin.js";
import "./commands/miniapp.js"; 



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
