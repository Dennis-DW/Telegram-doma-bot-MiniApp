// commands/handlers/commandHandler.js
import bot from "../../config/bot.js";
import database from "../../utils/database.js";
import { getMainKeyboard } from "../constants/keyboards.js";

export const handleCommand = async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    switch (text) {
      case '/start':
        await handleStartCommand(chatId);
        break;
      case '/subscribe':
        await handleSubscribeCommand(chatId);
        break;
      case '/unsubscribe':
        await handleUnsubscribeCommand(chatId);
        break;
      case '/status':
        await handleStatusCommand(chatId);
        break;
      case '/help':
        await handleHelpCommand(chatId);
        break;
      default:
        await bot.sendMessage(chatId, "Unknown command. Use /help for available commands.");
    }
  } catch (error) {
    console.error("Error handling command:", error);
    await bot.sendMessage(chatId, "An error occurred while processing your request.");
  }
};

const handleStartCommand = async (chatId) => {
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
• /events - Manage event notifications
• /help - Show this help message`;

  try {
    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  } catch (error) {
    console.error("Error sending start message:", error);
    await bot.sendMessage(chatId, message.replace(/\*\*/g, ''), {
      reply_markup: keyboard
    });
  }
};

const handleSubscribeCommand = async (chatId) => {
  try {
    await database.addSubscriber(chatId);
    await bot.sendMessage(chatId, "✅ You are now subscribed to Doma event notifications!");
  } catch (error) {
    console.error("Error subscribing:", error);
    await bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
  }
};

const handleUnsubscribeCommand = async (chatId) => {
  try {
    await database.removeSubscriber(chatId);
    await bot.sendMessage(chatId, "🚫 You have unsubscribed from Doma event notifications.");
  } catch (error) {
    console.error("Error unsubscribing:", error);
    await bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
  }
};

const handleStatusCommand = async (chatId) => {
  try {
    const subscribers = await database.getSubscribers();
    const isSubscribed = subscribers.includes(chatId);
    
    await bot.sendMessage(chatId,
      `📊 **Subscription Status**\n\n` +
      `Status: ${isSubscribed ? '✅ Subscribed' : '❌ Not Subscribed'}\n` +
      `Total Subscribers: ${subscribers.length}\n\n` +
      `${isSubscribed ? 'You will receive domain event notifications!' : 'Use /subscribe to start receiving alerts!'}`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Error getting status:", error);
    await bot.sendMessage(chatId, "⚠️ Unable to get status. Please try again.");
  }
};

const handleHelpCommand = async (chatId) => {
  const helpMessage = `📚 **Help & Commands**\n\n` +
    `• /start - Show main menu\n` +
    `• /subscribe - Get domain event alerts\n` +
    `• /unsubscribe - Stop event alerts\n` +
    `• /events - Manage event notifications\n` +
    `• /status - Check subscription status\n` +
    `• /help - Show this help message\n\n` +
    `The bot monitors all domain events on the Doma network!`;

  try {
    await bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error sending help message:", error);
    await bot.sendMessage(chatId, helpMessage.replace(/\*\*/g, ''));
  }
};
