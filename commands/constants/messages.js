// commands/constants/messages.js

// Event notification messages
export const EVENT_MESSAGES = {
  OWNERSHIP_TOKEN_MINTED: (name, address) =>
    `✨ **New Domain Minted!**\n\n` +
    `A new domain was minted: \`${name}\`\n` +
    `Owner: \`${address}\``,
    
  NAME_TOKEN_RENEWED: (name, expiryDate) =>
    `🔄 **Domain Renewed!**\n\n` +
    `Domain \`${name}\` has been renewed until \`${expiryDate}\``,
    
  NAME_TOKEN_BURNED: (name, address) =>
    `🔥 **Domain Burned!**\n\n` +
    `Domain \`${name}\` has been burned by \`${address}\``,
    
  NAME_TOKEN_LOCKED: (name, address) =>
    `🔒 **Domain Locked!**\n\n` +
    `Domain \`${name}\` is now locked by \`${address}\``,
    
  NAME_TOKEN_UNLOCKED: (name, address) =>
    `🔓 **Domain Unlocked!**\n\n` +
    `Domain \`${name}\` has been unlocked by \`${address}\``,
    
  REGISTRAR_CHANGED: (name, newRegistrar) =>
    `🏢 **Registrar Changed!**\n\n` +
    `Registrar for domain \`${name}\` changed to \`${newRegistrar}\``,
    
  METADATA_UPDATED: (name) =>
    `📝 **Metadata Updated!**\n\n` +
    `Domain \`${name}\` metadata was updated`
};

// Command messages
export const COMMAND_MESSAGES = {
  MINI_APP_INTRO: `📱 **Doma Event Notifications**\n\n` +
    `Welcome to the Doma domain event notification system!\n\n` +
    `**Events You'll Receive:**\n` +
    `• ✨ New domain minting\n` +
    `• 🔄 Domain renewals\n` +
    `• 🔥 Domain burning\n` +
    `• 🔒 Domain locking/unlocking\n` +
    `• 🏢 Registrar changes\n` +
    `• 📝 Metadata updates\n\n` +
    `**📱 Open Event Tracker** - View events and manage settings\n` +
    `**📋 Subscribe/Unsubscribe** - Manage your notifications\n\n` +
    `Click the buttons below to get started:`,
    
  HELP: `📚 **Doma Bot Help**\n\n` +
    `**Commands:**\n` +
    `• /start - Show main menu\n` +
    `• /subscribe - Subscribe to domain event alerts\n` +
    `• /unsubscribe - Unsubscribe from alerts\n` +
    `• /status - Check your subscription status\n` +
    `• /help - Show this help message\n\n` +
    `**Event Notifications:**\n` +
    `You'll receive real-time notifications for:\n` +
    `• ✨ New domain minting events\n` +
    `• 🔄 Domain renewals\n` +
    `• 🔥 Domain burning\n` +
    `• 🔒 Domain locking/unlocking\n` +
    `• 🏢 Registrar changes\n` +
    `• 📝 Metadata updates\n\n` +
    `**Support:**\n` +
    `If you need help, contact the bot administrator.`,
    
  STATUS: (isSubscribed, subscriberCount) =>
    `📊 **Bot Status**\n\n` +
    `**Your Status:** ${isSubscribed ? '✅ Subscribed' : '❌ Not Subscribed'}\n` +
    `**Total Subscribers:** ${subscriberCount}\n` +
    `**Bot Version:** 2.0.0\n` +
    `**Event System:** Active\n\n` +
    `${isSubscribed ? 
      'You will receive domain event notifications!' : 
      'Use /subscribe to start receiving alerts!'}\n\n` +
    `The bot monitors all domain events on the Doma network.`,
    
  STATUS_ERROR: "❌ Error checking status. Please try again."
};

// Error messages
export const ERROR_MESSAGES = {
  MINI_APP_SEND_ERROR: "Error sending Mini App message:",
  HELP_SEND_ERROR: "Error sending help message:",
  STATUS_SEND_ERROR: "Error sending status message:",
  EVENT_PROCESSING_ERROR: "Error processing event data:"
}; 