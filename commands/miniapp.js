// commands/miniapp.js
import bot from "../config/bot.js";
import { 
  handleMiniAppCommand,
  handleMiniAppCallback
} from "./handlers/index.js";

// Handle event data from blockchain
bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  const webAppData = msg.web_app_data;
  
  try {
    const data = JSON.parse(webAppData.data);
    console.log('Web app data received:', data);
    // Handle web app data here
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
  const data = query.data;
  
  // Check if it's a mini-app callback
  if (data === 'status' || data === 'settings') {
    await handleMiniAppCallback(query);
  }
});

// Event notification command
bot.onText(/\/events/, handleMiniAppCommand);
