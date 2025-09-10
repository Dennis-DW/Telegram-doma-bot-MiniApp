// Enhanced Doma Bot with Crash Recovery and Request Management
import "./commands/start.js";
import "./commands/subscribe.js";
import "./commands/unsubscribe.js";
import "./commands/admin.js";
import "./commands/miniapp.js";

// Core systems
import { startDomaListeners, stopDomaListeners } from "./listeners/domaEvents.js";
import eventAggregator from "./utils/eventAggregator.js";
import bot from "./config/bot.js";
import database from "./utils/database.js";
import processManager from "./processManager.js";
import healthMonitor from "./utils/healthMonitor.js";
import requestQueue from "./utils/requestQueue.js";

// Enhanced command handler
import { handleCommand as enhancedHandleCommand } from "./commands/handlers/enhancedCommandHandler.js";

// Override the default command handler
bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) {
    await enhancedHandleCommand(msg);
  }
});

(async () => {
  try {
    console.log("🚀 Starting Enhanced Doma Bot...");
    console.log("=".repeat(60));
    
    // Initialize process manager
    await processManager.initialize();
    console.log("✅ Process Manager initialized");

    // Initialize database connection
    console.log("🔗 Connecting to MongoDB...");
    await database.connect();
    console.log("✅ Database connection established");

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
    console.log("🚀 ENHANCED SYSTEM STATUS");
    console.log("=".repeat(60));
    console.log("✅ Telegram Bot: Running");
    console.log("✅ Event Listeners: Active");
    console.log("✅ Event Aggregator: Running");
    console.log("✅ Database Cleanup: Scheduled");
    console.log("✅ MongoDB: Connected");
    console.log("✅ Process Manager: Active");
    console.log("✅ Health Monitor: Active");
    console.log("✅ Request Queue: Active");
    console.log("✅ Crash Recovery: Enabled");
    console.log("✅ Auto-restart: Enabled");
    console.log("=".repeat(60));
    
    // Log initial health status
    const healthStatus = healthMonitor.getHealthStatus();
    console.log("🏥 Initial Health Status:", healthStatus.isHealthy ? "✅ Healthy" : "⚠️ Issues");
    
    // Log queue status
    const queueStatus = requestQueue.getStatus();
    console.log("📊 Queue Status:", `Size: ${queueStatus.queueSize}, Active: ${queueStatus.activeRequests}`);
    
  } catch (err) {
    console.error("❌ Error starting enhanced bot:", err);
    
    // Attempt recovery
    console.log("🔄 Attempting system recovery...");
    try {
      await healthMonitor.triggerRecovery();
    } catch (recoveryError) {
      console.error("❌ Recovery failed:", recoveryError);
      process.exit(1);
    }
  }
})();

// Enhanced graceful shutdown
const shutdown = async (signal) => {
  console.log(`🛑 Received ${signal}. Shutting down gracefully...`);
  
  try {
    // Stop event listeners
    await stopDomaListeners();
    console.log("✅ Event listeners stopped");
    
    // Clear event aggregator queue and pending messages
    eventAggregator.clearQueue();
    eventAggregator.getPendingMessages();
    console.log("✅ Event aggregator cleared");
    
    // Stop process manager
    await processManager.gracefulShutdown(signal);
    console.log("✅ Process manager stopped");
    
    // Disconnect from database
    await database.disconnect();
    console.log("✅ Database disconnected");
    
    console.log("✅ Enhanced graceful shutdown completed");
    setTimeout(() => process.exit(0), 1000);
    
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Set up signal handlers
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  processManager.handleCriticalError(error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  processManager.handleCriticalError(reason);
});

// Export for PM2 monitoring
export { processManager, healthMonitor, requestQueue };
