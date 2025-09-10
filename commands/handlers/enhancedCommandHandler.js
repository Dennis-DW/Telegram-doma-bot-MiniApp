// commands/handlers/enhancedCommandHandler.js
import bot from "../../config/bot.js";
import database from "../../utils/database.js";
import requestQueue from "../../utils/requestQueue.js";
import healthMonitor from "../../utils/healthMonitor.js";
import { getMainKeyboard } from "../constants/keyboards.js";

// Request handlers mapping
const requestHandlers = {
  start: handleStartRequest,
  subscribe: handleSubscribeRequest,
  unsubscribe: handleUnsubscribeRequest,
  status: handleStatusRequest,
  help: handleHelpRequest,
  health: handleHealthRequest,
  queue: handleQueueRequest
};

// Enhanced command handler with queue management
export const handleCommand = async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;
  const username = msg.from.username || 'unknown';

  try {
    // Extract command from text
    const command = text.replace('/', '').toLowerCase();
    
    // Check if command is supported
    if (!requestHandlers[command]) {
      await bot.sendMessage(chatId, "❌ Unknown command. Use /help for available commands.");
      return;
    }

    // Add request to queue
    const requestId = await requestQueue.addRequest({
      userId: userId,
      type: command,
      data: { chatId, username, text },
      priority: getCommandPriority(command)
    });

    console.log(`📥 Command queued: ${command} from user ${username} (${userId}) - Request ID: ${requestId}`);

    // Send acknowledgment
    await bot.sendMessage(chatId, `⏳ Your request is being processed... (Queue position: ${requestQueue.getStatus().queuedRequests + 1})`);

  } catch (error) {
    console.error("❌ Error handling command:", error);
    
    if (error.message.includes('Rate limit')) {
      await bot.sendMessage(chatId, "⚠️ You're making requests too quickly. Please wait a moment before trying again.");
    } else if (error.message.includes('Server is busy')) {
      await bot.sendMessage(chatId, "⚠️ The server is currently busy. Please try again in a few moments.");
    } else {
      await bot.sendMessage(chatId, "❌ An error occurred while processing your request. Please try again.");
    }
  }
};

// Get command priority (higher number = higher priority)
function getCommandPriority(command) {
  const priorities = {
    start: 5,
    help: 5,
    status: 3,
    subscribe: 4,
    unsubscribe: 4,
    health: 2,
    queue: 1
  };
  
  return priorities[command] || 1;
}

// Request handler functions
async function handleStartRequest(data) {
  const { chatId, username } = data;
  const keyboard = await getMainKeyboard(chatId);
  
  const message = `👋 Welcome to Doma Event Notifications!

📢 **Doma Domain Event Tracker** - Your gateway to real-time domain event notifications.

**What I can do:**
• 🔔 Send real-time domain event notifications
• 📊 Track domain activities across the network
• ⚠️ Alert you about important domain events
• 🔗 Monitor domain transfers and renewals

**Events I Track:**
• ✨ New domain minting
• 🔄 Domain renewals
• 🔥 Domain burning
• 🔒 Domain locking/unlocking
• 🏢 Registrar changes
• 📝 Metadata updates

**Commands:**
• /subscribe - Get domain event alerts
• /unsubscribe - Stop receiving alerts
• /status - Check subscription status
• /health - Check system health
• /help - Show this help message

**System Features:**
• 🚀 Auto-restart on crashes
• 📊 Request queue management
• 🏥 Health monitoring
• ⚡ Rate limiting protection`;

  try {
    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  } catch (error) {
    console.error("❌ Error sending start message:", error);
    await bot.sendMessage(chatId, message.replace(/\*\*/g, ''), {
      reply_markup: keyboard
    });
  }
}

async function handleSubscribeRequest(data) {
  const { chatId, username } = data;
  
  try {
    await database.addSubscriber(chatId);
    await bot.sendMessage(chatId, `✅ You are now subscribed to Doma event notifications, ${username}!`);
  } catch (error) {
    console.error("❌ Error subscribing:", error);
    await bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
  }
}

async function handleUnsubscribeRequest(data) {
  const { chatId, username } = data;
  
  try {
    await database.removeSubscriber(chatId);
    await bot.sendMessage(chatId, `🚫 You have unsubscribed from Doma event notifications, ${username}.`);
  } catch (error) {
    console.error("❌ Error unsubscribing:", error);
    await bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
  }
}

async function handleStatusRequest(data) {
  const { chatId, username } = data;
  
  try {
    const subscribers = await database.getSubscribers();
    const isSubscribed = subscribers.includes(chatId);
    const queueStatus = requestQueue.getStatus();
    
    await bot.sendMessage(chatId,
      `📊 **Subscription Status**\n\n` +
      `👤 User: ${username}\n` +
      `Status: ${isSubscribed ? '✅ Subscribed' : '❌ Not Subscribed'}\n` +
      `Total Subscribers: ${subscribers.length}\n\n` +
      `**System Status:**\n` +
      `🔄 Queue Size: ${queueStatus.queueSize}\n` +
      `⚡ Active Requests: ${queueStatus.activeRequests}\n` +
      `🏥 System Health: ${healthMonitor.getHealthStatus().isHealthy ? '✅ Healthy' : '⚠️ Issues'}\n\n` +
      `${isSubscribed ? 'You will receive domain event notifications!' : 'Use /subscribe to start receiving alerts!'}`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("❌ Error getting status:", error);
    await bot.sendMessage(chatId, "⚠️ Unable to get status. Please try again.");
  }
}

async function handleHelpRequest(data) {
  const { chatId, username } = data;
  
  const helpMessage = `📚 **Help & Commands**\n\n` +
    `• /start - Show main menu\n` +
    `• /subscribe - Get domain event alerts\n` +
    `• /unsubscribe - Stop event alerts\n` +
    `• /status - Check subscription status\n` +
    `• /health - Check system health\n` +
    `• /queue - Check request queue status\n` +
    `• /help - Show this help message\n\n` +
    `**System Features:**\n` +
    `• 🚀 Auto-restart on crashes\n` +
    `• 📊 Request queue management\n` +
    `• 🏥 Health monitoring\n` +
    `• ⚡ Rate limiting protection\n\n` +
    `The bot monitors all domain events on the Doma network!`;

  try {
    await bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("❌ Error sending help message:", error);
    await bot.sendMessage(chatId, helpMessage.replace(/\*\*/g, ''));
  }
}

async function handleHealthRequest(data) {
  const { chatId, username } = data;
  
  try {
    const healthStatus = healthMonitor.getHealthStatus();
    const systemInfo = healthMonitor.getSystemInfo();
    
    const healthMessage = `🏥 **System Health Report**\n\n` +
      `**Overall Status:** ${healthStatus.isHealthy ? '✅ Healthy' : '⚠️ Issues'}\n` +
      `**Uptime:** ${Math.round(healthStatus.uptime / 1000 / 60)} minutes\n` +
      `**Last Check:** ${new Date(healthStatus.lastHealthCheck?.timestamp).toLocaleString()}\n\n` +
      `**Component Status:**\n` +
      `• Database: ${healthStatus.database ? '✅' : '❌'}\n` +
      `• Telegram: ${healthStatus.telegram ? '✅' : '❌'}\n` +
      `• Blockchain: ${healthStatus.blockchain ? '✅' : '❌'}\n` +
      `• Memory: ${healthStatus.memory ? '✅' : '❌'}\n\n` +
      `**System Info:**\n` +
      `• Memory Usage: ${systemInfo.memory.heapUsed}MB\n` +
      `• Node Version: ${systemInfo.nodeVersion}\n` +
      `• Platform: ${systemInfo.platform}`;

    await bot.sendMessage(chatId, healthMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("❌ Error getting health status:", error);
    await bot.sendMessage(chatId, "⚠️ Unable to get health status. Please try again.");
  }
}

async function handleQueueRequest(data) {
  const { chatId, username } = data;
  
  try {
    const queueStatus = requestQueue.getStatus();
    const userRequests = requestQueue.getUserRequests(data.userId);
    
    const queueMessage = `📊 **Request Queue Status**\n\n` +
      `**Queue Overview:**\n` +
      `• Total in Queue: ${queueStatus.queueSize}\n` +
      `• Active Requests: ${queueStatus.activeRequests}\n` +
      `• Queued Requests: ${queueStatus.queuedRequests}\n` +
      `• Max Concurrent: ${queueStatus.maxConcurrent}\n\n` +
      `**Your Requests:**\n` +
      `• Recent Requests: ${userRequests.length}\n` +
      `• Rate Limit: ${queueStatus.rateLimitMax} per ${queueStatus.rateLimitWindow / 1000}s\n\n` +
      `**System Status:**\n` +
      `• Processing: ${queueStatus.processing ? '✅ Active' : '❌ Stopped'}\n` +
      `• Max Queue Size: ${queueStatus.maxQueueSize}`;

    await bot.sendMessage(chatId, queueMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("❌ Error getting queue status:", error);
    await bot.sendMessage(chatId, "⚠️ Unable to get queue status. Please try again.");
  }
}

// Set up request queue event listeners
requestQueue.on('requestProcessing', (request) => {
  console.log(`🔄 Processing request: ${request.type} from user ${request.userId}`);
});

requestQueue.on('requestCompleted', (request) => {
  console.log(`✅ Request completed: ${request.type} from user ${request.userId} (${request.duration}ms)`);
});

requestQueue.on('requestError', (request, error) => {
  console.error(`❌ Request error: ${request.type} from user ${request.userId} - ${error.message}`);
});

requestQueue.on('requestTimeout', (request) => {
  console.log(`⏰ Request timeout: ${request.type} from user ${request.userId}`);
});

export { requestHandlers };
