// commands/handlers/commandHandler.js
import bot from "../../config/bot.js";
import { getSubscribers } from "../../utils/storage.js";
import { COMMAND_MESSAGES, ERROR_MESSAGES, createEventNotificationKeyboard } from "../constants/index.js";

// Event notification command
export const handleEventNotificationCommand = async (msg) => {
  const chatId = msg.chat.id;
  const keyboard = createEventNotificationKeyboard();
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