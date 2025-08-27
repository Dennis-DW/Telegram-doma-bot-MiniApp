// commands/miniapp.js
import bot from "../config/bot.js";
import { broadcast } from "../utils/broadcast.js";
import dotenv from "dotenv";

dotenv.config();

// Handle Mini App data
bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  const webAppData = msg.web_app_data;
  
  try {
    const data = JSON.parse(webAppData.data);
    console.log('📱 Mini App data received:', data);
    
    // Handle different actions from Mini App
    switch (data.action) {
      case 'wallet_connected':
        await bot.sendMessage(chatId, 
          `🔗 **Wallet Connected!**\n\n` +
          `Address: \`${data.address}\`\n` +
          `You can now manage your domains through the Mini App.`,
          { parse_mode: "Markdown" }
        );
        break;
        
      case 'domain_minted':
        await bot.sendMessage(chatId,
          `✨ **Domain Minted Successfully!**\n\n` +
          `Domain: \`${data.domain}\`\n` +
          `Transaction: \`${data.txHash}\`\n` +
          `Correlation ID: \`${data.correlationId}\`\n\n` +
          `Your domain is now active and you'll receive notifications about it!`,
          { parse_mode: "Markdown" }
        );
        
        // Broadcast to all subscribers
        await broadcast({
          type: "OwnershipTokenMinted",
          args: {
            tokenId: data.tokenId || "N/A",
            sld: data.domain.split('.')[0],
            tld: data.domain.split('.')[1] || "doma",
            owner: data.address
          },
          txHash: data.txHash,
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'domain_renewed':
        await bot.sendMessage(chatId,
          `🔄 **Domain Renewed Successfully!**\n\n` +
          `Domain: \`${data.domain}\`\n` +
          `Transaction: \`${data.txHash}\`\n` +
          `Correlation ID: \`${data.correlationId}\`\n\n` +
          `Your domain has been extended!`,
          { parse_mode: "Markdown" }
        );
        
        // Broadcast to all subscribers
        await broadcast({
          type: "NameTokenRenewed",
          args: {
            tokenId: data.tokenId,
            sld: data.domain.split('.')[0],
            tld: data.domain.split('.')[1] || "doma"
          },
          txHash: data.txHash,
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'lock_status_changed':
        await bot.sendMessage(chatId,
          `🔐 **Transfer Lock ${data.isLocked ? 'Enabled' : 'Disabled'}!**\n\n` +
          `Domain: \`${data.domain}\`\n` +
          `Status: ${data.isLocked ? '🔒 Locked' : '🔓 Unlocked'}\n` +
          `Transaction: \`${data.txHash}\`\n` +
          `Correlation ID: \`${data.correlationId}\``,
          { parse_mode: "Markdown" }
        );
        
        // Broadcast to all subscribers
        await broadcast({
          type: "LockStatusChanged",
          args: {
            tokenId: data.tokenId,
            sld: data.domain.split('.')[0],
            tld: data.domain.split('.')[1] || "doma",
            isLocked: data.isLocked
          },
          txHash: data.txHash,
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'domain_burned':
        await bot.sendMessage(chatId,
          `🔥 **Domain Burned Successfully!**\n\n` +
          `Domain: \`${data.domain}\`\n` +
          `Transaction: \`${data.txHash}\`\n` +
          `Correlation ID: \`${data.correlationId}\`\n\n` +
          `⚠️ This action cannot be undone.`,
          { parse_mode: "Markdown" }
        );
        
        // Broadcast to all subscribers
        await broadcast({
          type: "NameTokenBurned",
          args: {
            tokenId: data.tokenId,
            sld: data.domain.split('.')[0],
            tld: data.domain.split('.')[1] || "doma"
          },
          txHash: data.txHash,
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'error':
        await bot.sendMessage(chatId,
          `❌ **Mini App Error**\n\n` +
          `Error: ${data.error}\n` +
          `Action: ${data.action || 'Unknown'}\n\n` +
          `Please try again or contact support if the issue persists.`,
          { parse_mode: "Markdown" }
        );
        break;
        
      default:
        await bot.sendMessage(chatId,
          `📱 **Mini App Action**\n\n` +
          `Action: ${data.action}\n` +
          `Data: \`${JSON.stringify(data, null, 2)}\``,
          { parse_mode: "Markdown" }
        );
    }
    
  } catch (error) {
    console.error('Error processing Mini App data:', error);
    await bot.sendMessage(chatId, 
      `❌ **Error Processing Mini App Data**\n\n` +
      `The data received from the Mini App could not be processed.\n` +
      `Error: ${error.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

// Mini App command
bot.onText(/\/miniapp/, async (msg) => {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "🚀 Open Doma Manager",
          web_app: { url:process.env.MINI_APP_URL}
        }
      ],
      [
        { text: "📋 Subscribe to Alerts", callback_data: "subscribe" },
        { text: "❌ Unsubscribe", callback_data: "unsubscribe" }
      ]
    ]
  };
  
  const message = `📱 **Doma Manager Mini App**\n\n` +
    `Open the Mini App to manage your domains directly from Telegram!\n\n` +
    `**Features:**\n` +
    `• ✨ Mint new domains\n` +
    `• 🔄 Renew existing domains\n` +
    `• 🔐 Lock/unlock transfers\n` +
    `• 🔥 Burn domains\n` +
    `• 📊 View your portfolio\n\n` +
    `Click the button below to open the Mini App:`;
  
  try {
    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: keyboard
    });
  } catch (error) {
    console.error("Error sending Mini App message:", error);
    // Fallback without markdown
    await bot.sendMessage(chatId, message.replace(/\*\*/g, ''), {
      reply_markup: keyboard
    });
  }
});

// Help command
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `📚 **Doma Bot Help**\n\n` +
    `**Commands:**\n` +
    `• /start - Show main menu with Mini App\n` +
    `• /miniapp - Open the Doma Manager Mini App\n` +
    `• /subscribe - Subscribe to domain event alerts\n` +
    `• /unsubscribe - Unsubscribe from alerts\n` +
    `• /status - Check your subscription status\n` +
    `• /help - Show this help message\n\n` +
    `**Mini App Features:**\n` +
    `• Connect your wallet\n` +
    `• Mint new domains\n` +
    `• Renew existing domains\n` +
    `• Lock/unlock domain transfers\n` +
    `• Burn domains\n` +
    `• View your domain portfolio\n\n` +
    `**Notifications:**\n` +
    `You'll receive real-time notifications for:\n` +
    `• Domain minting events\n` +
    `• Domain renewals\n` +
    `• Domain transfers\n` +
    `• Domain expirations (with buy links)\n` +
    `• Lock status changes\n` +
    `• Domain burns\n\n` +
    `**Support:**\n` +
    `If you need help, contact the bot administrator.`;
  
  try {
    await bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error sending help message:", error);
    await bot.sendMessage(chatId, helpMessage.replace(/\*\*/g, ''));
  }
});

// Status command
bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const { getSubscribers } = await import('../utils/storage.js');
    const subscribers = getSubscribers();
    const isSubscribed = subscribers.includes(chatId);
    
    const statusMessage = `📊 **Bot Status**\n\n` +
      `**Your Status:** ${isSubscribed ? '✅ Subscribed' : '❌ Not Subscribed'}\n` +
      `**Total Subscribers:** ${subscribers.length}\n` +
      `**Bot Version:** 2.0.0\n` +
      `**Mini App:** Available\n\n` +
      `${isSubscribed ? 
        'You will receive domain event notifications!' : 
        'Use /subscribe to start receiving alerts!'}\n\n` +
      `Use /miniapp to open the domain management interface.`;
    
    await bot.sendMessage(chatId, statusMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error sending status message:", error);
    await bot.sendMessage(chatId, "❌ Error checking status. Please try again.");
  }
}); 