// commands/miniapp.js
import bot from "../config/bot.js";
import { 
  handleEventAction,
  handleEventNotificationCommand,
  handleHelpCommand,
  handleStatusCommand,
  handleCallbackQuery
} from "./handlers/index.js";

// Handle event data from blockchain
bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  const webAppData = msg.web_app_data;
  
  try {
    const data = JSON.parse(webAppData.data);
    await handleEventAction(chatId, data);
  } catch (error) {
    console.error('Error processing event data:', error);
    const errorMessage = `❌ **Error Processing Event Data**\n\n` +
      `The event data could not be processed.\n` +
      `Error: ${error.message}`;
    await bot.sendMessage(chatId, errorMessage, { parse_mode: "Markdown" });
  }
});

// Handle callback queries for inline buttons
bot.on('callback_query', async (query) => {
  await handleCallbackQuery(query);
});

// Event notification command
bot.onText(/\/events/, handleEventNotificationCommand);

// Help command
bot.onText(/\/help/, handleHelpCommand);

// Status command
bot.onText(/\/status/, handleStatusCommand); 