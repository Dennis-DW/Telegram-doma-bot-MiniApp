// Commands
import "./commands/start.js";
import "./commands/subscribe.js";
import "./commands/unsubscribe.js";
import "./commands/admin.js";
import "./commands/miniapp.js";

 

// Listener
import { startDomaListeners, stopDomaListeners } from "./listeners/domaEvents.js";
import eventAggregator from "./utils/eventAggregator.js";
import dbCleanup from "./utils/dbCleanup.js";
import bot from "./config/bot.js";

(async () => {
  try {
    // Clear pending messages to prevent stale messages
    eventAggregator.getPendingMessages();
    console.log("🧹 Cleared pending messages on startup");

    // Start Telegram bot
    console.log("🤖 Telegram bot initialized...");



    // Start on-chain listeners
    await startDomaListeners();
    console.log("🔗 Doma event listeners started...");

    // Start event aggregator message processor
    setInterval(async () => {
      try {
        const pendingMessages = eventAggregator.getPendingMessages();
        
        if (pendingMessages.length > 0) {
          console.log(`📤 Processing ${pendingMessages.length} pending messages from aggregator...`);
          
          for (const { chatId, message } of pendingMessages) {
            try {
              // Send the message as plain text
              await bot.sendMessage(chatId, message);
              console.log(`✅ Sent aggregated message to ${chatId}`);
            } catch (error) {
              console.error(`❌ Failed to send aggregated message to ${chatId}:`, error);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error processing aggregated messages:", error);
      }
    }, 5000); // Process every 5 seconds

    console.log("📤 Event aggregator message processor started...");
    console.log("🧹 Database cleanup scheduler started...");
    
    // Log system status
    console.log("=".repeat(60));
    console.log("🚀 SYSTEM STATUS");
    console.log("=".repeat(60));
    console.log("✅ Telegram Bot: Running");
    console.log("✅ Event Listeners: Active");
    console.log("✅ Event Aggregator: Running");
    console.log("✅ Database Cleanup: Scheduled");
    console.log("=".repeat(60));
    
  } catch (err) {
    console.error("❌ Error starting bot:", err);
  }
})();

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`🛑 Received ${signal}. Shutting down gracefully...`);
  
  // Stop event listeners
  await stopDomaListeners();
  
  // Clear event aggregator queue and pending messages
  eventAggregator.clearQueue();
  eventAggregator.getPendingMessages();
  
  console.log("✅ Graceful shutdown completed");
  setTimeout(() => process.exit(0), 1000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));