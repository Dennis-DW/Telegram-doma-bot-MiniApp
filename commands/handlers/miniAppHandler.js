// commands/handlers/miniAppHandler.js
import bot from "../../config/bot.js";
import database from "../../utils/database.js";

export const handleMiniAppCommand = async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const miniAppUrl = process.env.MINI_APP_URL || 'https://your-mini-app.vercel.app';
    
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "📱 Open Mini App",
            web_app: { url: miniAppUrl }
          }
        ],
        [
          { text: "📊 View Status", callback_data: "status" },
          { text: "⚙️ Settings", callback_data: "settings" }
        ]
      ]
    };

    const message = `📱 **Doma Event Tracker Mini App**

Access the full-featured web interface to:
• 📊 View detailed event statistics
• ⚙️ Manage notification settings
• 🔍 Browse event history
• 📈 Track domain activities

Click the button below to open the mini app!`;

    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: keyboard
    });

  } catch (error) {
    console.error("Error handling mini app command:", error);
    await bot.sendMessage(chatId, "⚠️ Unable to open mini app. Please try again later.");
  }
};

export const handleMiniAppCallback = async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  try {
    switch (data) {
      case 'status':
        await handleStatusCallback(chatId, query);
        break;
      case 'settings':
        await handleSettingsCallback(chatId, query);
        break;
      default:
        await bot.answerCallbackQuery(query.id, { text: "Unknown action" });
    }
  } catch (error) {
    console.error("Error handling mini app callback:", error);
    await bot.answerCallbackQuery(query.id, { text: "❌ Error occurred" });
  }
};

const handleStatusCallback = async (chatId, query) => {
  try {
    const subscribers = await database.getSubscribers();
    const isSubscribed = subscribers.includes(chatId);
    
    await bot.answerCallbackQuery(query.id, { 
      text: isSubscribed ? "✅ You are subscribed!" : "❌ You are not subscribed" 
    });
    
    await bot.sendMessage(chatId,
      `📊 **Subscription Status**\n\n` +
      `Status: ${isSubscribed ? '✅ Subscribed' : '❌ Not Subscribed'}\n` +
      `Total Subscribers: ${subscribers.length}\n\n` +
      `${isSubscribed ? 'You will receive domain event notifications!' : 'Use /subscribe to start receiving alerts!'}`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Error handling status callback:", error);
    await bot.answerCallbackQuery(query.id, { text: "❌ Error getting status" });
  }
};

const handleSettingsCallback = async (chatId, query) => {
  try {
    const settings = await database.getUserSettings(chatId);
    
    if (!settings) {
      await bot.answerCallbackQuery(query.id, { text: "No settings found" });
      await bot.sendMessage(chatId, "No settings found. Please subscribe first using /subscribe");
      return;
    }

    const settingsMessage = `⚙️ **Your Notification Settings**

🔔 Notifications: ${settings.notifications ? '✅ Enabled' : '❌ Disabled'}
📊 Event Types:
${Object.entries(settings.eventTypes).map(([key, value]) => 
  `  • ${key}: ${value ? '✅' : '❌'}`
).join('\n')}

📱 Use the mini app for detailed settings management.`;

    await bot.answerCallbackQuery(query.id, { text: "Settings retrieved" });
    await bot.sendMessage(chatId, settingsMessage, { parse_mode: "Markdown" });
    
  } catch (error) {
    console.error("Error handling settings callback:", error);
    await bot.answerCallbackQuery(query.id, { text: "❌ Error getting settings" });
  }
};
