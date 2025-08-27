// commands/start.js
import bot from "../config/bot.js";
import dotenv from "dotenv";

dotenv.config();

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  
  const welcomeMessage = `👋 Welcome to Doma Alerts Bot!

🏠 **Doma Domain Manager** - Your gateway to blockchain domain management.

**What I can do:**
• 🔔 Send real-time domain event notifications
• 📱 Provide a Mini App for domain management
• ⚠️ Alert you about domain expirations
• 🔗 Track domain transfers and renewals

**Commands:**
• /subscribe - Get domain event alerts
• /unsubscribe - Stop receiving alerts
• /miniapp - Open the Doma Manager Mini App
• /help - Show this help message

**Mini App Features:**
• ✨ Mint new domains
• 🔄 Renew existing domains
• 🔐 Lock/unlock transfers
• 🔥 Burn domains
• 📊 View your domain portfolio`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "🚀 Open Mini App",
          web_app: { url:process.env.MINI_APP_URL}
        }
      ],
      [
        { text: "📋 Subscribe to Alerts", callback_data: "subscribe" },
        { text: "❌ Unsubscribe", callback_data: "unsubscribe" }
      ],
      [
        { text: "ℹ️ Help", callback_data: "help" },
        { text: "📊 Status", callback_data: "status" }
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
        await bot.answerCallbackQuery(query.id, { text: "✅ Subscribed to alerts!" });
        await bot.editMessageText("✅ You are now subscribed to Doma alerts!", {
          chat_id: chatId,
          message_id: query.message.message_id
        });
        break;

      case 'unsubscribe':
        // Import and call unsubscribe logic
        const { removeSubscriber } = await import('../utils/storage.js');
        await removeSubscriber(chatId);
        await bot.answerCallbackQuery(query.id, { text: "🚫 Unsubscribed from alerts!" });
        await bot.editMessageText("🚫 You have unsubscribed from Doma alerts.", {
          chat_id: chatId,
          message_id: query.message.message_id
        });
        break;

      case 'help':
        await bot.answerCallbackQuery(query.id, { text: "Help information" });
        await bot.sendMessage(chatId, 
          "📚 **Help & Commands**\n\n" +
          "• /start - Show main menu\n" +
          "• /subscribe - Get domain alerts\n" +
          "• /unsubscribe - Stop alerts\n" +
          "• /miniapp - Open Mini App\n" +
          "• /status - Check subscription status\n\n" +
          "The Mini App allows you to manage your domains directly from Telegram!",
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
