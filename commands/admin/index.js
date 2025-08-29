// commands/admin/index.js
import bot from "../../config/bot.js";
import { ADMIN_CONFIG } from "./config/index.js";
import { isAdmin, validateAdminConfig } from "./utils/authUtils.js";
import {
  handleAdminCommand,
  handleAdminCallback,
  handleStatsCommand,
  handleCleanupCommand,
  handleQueueCommand,
  handleBroadcastCommand
} from "./handlers/commandHandler.js";

// Validate admin configuration on startup
const configValidation = validateAdminConfig();
if (!configValidation.isValid) {
  console.error("❌ Admin configuration issues:", configValidation.issues);
} else {
  console.log("✅ Admin configuration validated successfully");
  console.log(`👥 Admin chat IDs: ${configValidation.issues.length === 0 ? 'Configured' : 'Issues found'}`);
}

// Register admin command handlers
bot.onText(new RegExp(`^${ADMIN_CONFIG.COMMANDS.ADMIN}$`), handleAdminCommand);
bot.onText(new RegExp(`^${ADMIN_CONFIG.COMMANDS.STATS}$`), handleStatsCommand);
bot.onText(new RegExp(`^${ADMIN_CONFIG.COMMANDS.CLEANUP}$`), handleCleanupCommand);
bot.onText(new RegExp(`^${ADMIN_CONFIG.COMMANDS.QUEUE}$`), handleQueueCommand);
bot.onText(new RegExp(`^${ADMIN_CONFIG.COMMANDS.BROADCAST}(\\s+.*)?$`), handleBroadcastCommand);

// Register callback query handler for admin actions
bot.on('callback_query', async (query) => {
  const data = query.data;
  
  // Check if this is an admin callback
  if (data && data.startsWith(ADMIN_CONFIG.CALLBACK_PREFIXES.ADMIN)) {
    await handleAdminCallback(query);
  }
});

console.log("🔧 Admin commands registered successfully");
console.log(`📝 Available admin commands: ${Object.values(ADMIN_CONFIG.COMMANDS).join(', ')}`);

// Export the isAdmin function for use in other modules
export { isAdmin }; 