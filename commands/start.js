// commands/start.js
import bot from "../config/bot.js";
import dotenv from "dotenv";

dotenv.config();

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  
  const welcomeMessage = `👋 Welcome to Doma Event Notifications!

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

  const keyboard = {
    inline_keyboard: [
      [
        { text: "📋 Subscribe to Events", callback_data: "subscribe" },
        { text: "❌ Unsubscribe", callback_data: "unsubscribe" }
      ],
      [
        { text: "📊 View Status", callback_data: "status" },
        { text: "❓ Help", callback_data: "help" }
      ]
    ]
  };

  try {
    await bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  } catch (error) {
    console.error("Error sending start message:", error);
    // Fallback without markdown
    await bot.sendMessage(chatId, welcomeMessage.replace(/\*\*/g, ''), {
      reply_markup: keyboard
    });
  }
});

// Handle callback queries
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  try {
    switch (data) {
      case 'subscribe':
        // Import and call subscribe logic
        const { addSubscriber } = await import('../utils/storage.js');
        await addSubscriber(chatId);
        await bot.answerCallbackQuery(query.id, { text: "✅ Subscribed to event alerts!" });
        await bot.editMessageText("✅ You are now subscribed to Doma event notifications!", {
          chat_id: chatId,
          message_id: query.message.message_id
        });
        break;

      case 'unsubscribe':
        // Import and call unsubscribe logic
        const { removeSubscriber } = await import('../utils/storage.js');
        await removeSubscriber(chatId);
        await bot.answerCallbackQuery(query.id, { text: "🚫 Unsubscribed from event alerts!" });
        await bot.editMessageText("🚫 You have unsubscribed from Doma event notifications.", {
          chat_id: chatId,
          message_id: query.message.message_id
        });
        break;

      case 'help':
        await bot.answerCallbackQuery(query.id, { text: "Help information" });
        await bot.sendMessage(chatId, 
          "📚 **Help & Commands**\n\n" +
          "• /start - Show main menu\n" +
          "• /subscribe - Get domain event alerts\n" +
          "• /unsubscribe - Stop event alerts\n" +
          "• /events - Manage event notifications\n" +
          "• /status - Check subscription status\n\n" +
          "The bot monitors all domain events on the Doma network!",
          { parse_mode: "Markdown" }
        );
        break;

      case 'status':
        // Check subscription status
        const { getSubscribers } = await import('../utils/storage.js');
        const subscribers = getSubscribers();
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
        break;

      default:
        await bot.answerCallbackQuery(query.id, { text: "Unknown action" });
    }
  } catch (error) {
    console.error("Error handling callback query:", error);
    await bot.answerCallbackQuery(query.id, { text: "❌ Error occurred" });
  }
});
