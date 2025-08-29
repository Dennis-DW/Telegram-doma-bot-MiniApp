// commands/handlers/commandHandler.js
import bot from "../../config/bot.js";
import { getSubscribers, addSubscriber, removeSubscriber, updateUserSettings } from "../../utils/storage.js";
import { COMMAND_MESSAGES, ERROR_MESSAGES, createEventNotificationKeyboard } from "../constants/index.js";

// Event notification command
export const handleEventNotificationCommand = async (msg) => {
  const chatId = msg.chat.id;
  const keyboard = createEventNotificationKeyboard(chatId);
  const message = COMMAND_MESSAGES.MINI_APP_INTRO;
  
  try {
    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  } catch (error) {
    console.error(ERROR_MESSAGES.MINI_APP_SEND_ERROR, error);
    // Fallback without markdown
    await bot.sendMessage(chatId, message.replace(/\*\*/g, ''), {
      reply_markup: keyboard
    });
  }
};

// Help command
export const handleHelpCommand = async (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = COMMAND_MESSAGES.HELP;
  
  try {
    await bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error(ERROR_MESSAGES.HELP_SEND_ERROR, error);
    await bot.sendMessage(chatId, helpMessage.replace(/\*\*/g, ''));
  }
};

// Status command
export const handleStatusCommand = async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const subscribers = getSubscribers();
    const isSubscribed = subscribers.includes(chatId);
    const statusMessage = COMMAND_MESSAGES.STATUS(isSubscribed, subscribers.length);
    
    await bot.sendMessage(chatId, statusMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error(ERROR_MESSAGES.STATUS_SEND_ERROR, error);
    await bot.sendMessage(chatId, COMMAND_MESSAGES.STATUS_ERROR);
  }
};

// Callback query handlers
export const handleCallbackQuery = async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const callbackData = query.data;

  try {
    switch (callbackData) {
      case 'subscribe':
        await handleSubscribeCallback(chatId, messageId);
        break;
      case 'unsubscribe':
        await handleUnsubscribeCallback(chatId, messageId);
        break;
      case 'status':
        await handleStatusCallback(chatId, messageId);
        break;
      case 'help':
        await handleHelpCallback(chatId, messageId);
        break;
      default:
        await bot.answerCallbackQuery(query.id, { text: "Unknown action" });
    }
  } catch (error) {
    console.error('Error handling callback query:', error);
    await bot.answerCallbackQuery(query.id, { text: "Error processing request" });
  }
};

// Subscribe callback handler
const handleSubscribeCallback = async (chatId, messageId) => {
  try {
    await addSubscriber(chatId);
    
    // Update user settings to indicate subscription via bot
    await updateUserSettings(chatId, {
      lastBotAction: 'subscribed',
      lastBotActionTime: new Date().toISOString(),
      source: 'bot'
    });

    const keyboard = createEventNotificationKeyboard(chatId);
    await bot.editMessageReplyMarkup(keyboard, {
      chat_id: chatId,
      message_id: messageId
    });

    await bot.answerCallbackQuery(chatId, { 
      text: "✅ Successfully subscribed to event notifications!" 
    });
  } catch (error) {
    console.error('Error in subscribe callback:', error);
    await bot.answerCallbackQuery(chatId, { 
      text: "❌ Failed to subscribe. Please try again." 
    });
  }
};

// Unsubscribe callback handler
const handleUnsubscribeCallback = async (chatId, messageId) => {
  try {
    await removeSubscriber(chatId);
    
    // Update user settings to indicate unsubscription via bot
    await updateUserSettings(chatId, {
      lastBotAction: 'unsubscribed',
      lastBotActionTime: new Date().toISOString(),
      source: 'bot'
    });

    const keyboard = createEventNotificationKeyboard(chatId);
    await bot.editMessageReplyMarkup(keyboard, {
      chat_id: chatId,
      message_id: messageId
    });

    await bot.answerCallbackQuery(chatId, { 
      text: "✅ Successfully unsubscribed from event notifications." 
    });
  } catch (error) {
    console.error('Error in unsubscribe callback:', error);
    await bot.answerCallbackQuery(chatId, { 
      text: "❌ Failed to unsubscribe. Please try again." 
    });
  }
};

// Status callback handler
const handleStatusCallback = async (chatId, messageId) => {
  try {
    const subscribers = getSubscribers();
    const isSubscribed = subscribers.includes(chatId);
    const statusMessage = COMMAND_MESSAGES.STATUS(isSubscribed, subscribers.length);
    
    await bot.sendMessage(chatId, statusMessage, { parse_mode: "Markdown" });
    await bot.answerCallbackQuery(chatId, { text: "Status sent!" });
  } catch (error) {
    console.error('Error in status callback:', error);
    await bot.answerCallbackQuery(chatId, { text: "Error getting status" });
  }
};

// Help callback handler
const handleHelpCallback = async (chatId, messageId) => {
  try {
    const helpMessage = COMMAND_MESSAGES.HELP;
    await bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
    await bot.answerCallbackQuery(chatId, { text: "Help sent!" });
  } catch (error) {
    console.error('Error in help callback:', error);
    await bot.answerCallbackQuery(chatId, { text: "Error sending help" });
  }
}; 