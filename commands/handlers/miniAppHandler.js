// commands/handlers/miniAppHandler.js
import bot from "../../config/bot.js";
import { broadcast } from "../../utils/broadcast.js";
import { addSubscriber, removeSubscriber } from "../../utils/storage.js";
import { EVENT_MESSAGES } from "../constants/index.js";

// Handle different event types from blockchain and mini-app actions
export const handleEventAction = async (chatId, data) => {
  console.log('📢 Event data received:', data);
  
  // Handle mini-app actions
  if (data.action) {
    return await handleMiniAppAction(chatId, data);
  }
  
  // Handle blockchain events
  switch (data.eventType) {
    case 'OwnershipTokenMinted':
      return await handleOwnershipTokenMinted(chatId, data);
      
    case 'NameTokenRenewed':
      return await handleNameTokenRenewed(chatId, data);
      
    case 'NameTokenBurned':
      return await handleNameTokenBurned(chatId, data);
      
    case 'NameTokenLocked':
      return await handleNameTokenLocked(chatId, data);
      
    case 'NameTokenUnlocked':
      return await handleNameTokenUnlocked(chatId, data);
      
    case 'RegistrarChanged':
      return await handleRegistrarChanged(chatId, data);
      
    case 'MetadataUpdated':
      return await handleMetadataUpdated(chatId, data);
      
    default:
      return await handleUnknownEvent(chatId, data);
  }
};

// Handle mini-app actions
const handleMiniAppAction = async (chatId, data) => {
  console.log('📱 Mini-app action received:', data.action);
  
  switch (data.action) {
    case 'subscribe':
      return await handleSubscribeAction(chatId, data);
      
    case 'unsubscribe':
      return await handleUnsubscribeAction(chatId, data);
      
    case 'mini_app_subscribed':
      return await handleMiniAppSubscribed(chatId, data);
      
    case 'mini_app_unsubscribed':
      return await handleMiniAppUnsubscribed(chatId, data);
      
    case 'mini_app_settings_updated':
      return await handleMiniAppSettingsUpdated(chatId, data);
      
    case 'app_initialized':
      return await handleAppInitialized(chatId, data);
      
    default:
      return await handleUnknownAction(chatId, data);
  }
};

const handleSubscribeAction = async (chatId, data) => {
  try {
    addSubscriber(chatId);
    
    const message = `✅ **Successfully Subscribed!**\n\n` +
      `You are now subscribed to Doma event notifications.\n` +
      `You will receive updates every 30 minutes when events occur.\n\n` +
      `📱 *Source:* ${data.source || 'Unknown'}`;
    
    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  } catch (error) {
    console.error('Error subscribing user:', error);
    const errorMessage = `❌ **Subscription Failed**\n\n` +
      `Unable to subscribe you to notifications.\n` +
      `Error: ${error.message}`;
    await bot.sendMessage(chatId, errorMessage, { parse_mode: "Markdown" });
  }
};

const handleUnsubscribeAction = async (chatId, data) => {
  try {
    removeSubscriber(chatId);
    
    const message = `✅ **Successfully Unsubscribed!**\n\n` +
      `You are no longer subscribed to Doma event notifications.\n` +
      `You can resubscribe anytime using the /subscribe command.\n\n` +
      `📱 *Source:* ${data.source || 'Unknown'}`;
    
    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    const errorMessage = `❌ **Unsubscription Failed**\n\n` +
      `Unable to unsubscribe you from notifications.\n` +
      `Error: ${error.message}`;
    await bot.sendMessage(chatId, errorMessage, { parse_mode: "Markdown" });
  }
};

const handleMiniAppSubscribed = async (chatId, data) => {
  console.log('📱 Mini-app subscription notification received:', data);
  
  const message = `✅ **Subscription Confirmed**\n\n` +
    `You have successfully subscribed to Doma event notifications via the mini-app.\n` +
    `Your subscription is now active and synchronized with the bot.\n\n` +
    `📱 *Source:* Mini-app\n` +
    `⏰ *Time:* ${new Date(data.timestamp).toLocaleString()}`;
  
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
};

const handleMiniAppUnsubscribed = async (chatId, data) => {
  console.log('📱 Mini-app unsubscription notification received:', data);
  
  const message = `✅ **Unsubscription Confirmed**\n\n` +
    `You have successfully unsubscribed from Doma event notifications via the mini-app.\n` +
    `Your unsubscription is now active and synchronized with the bot.\n\n` +
    `📱 *Source:* Mini-app\n` +
    `⏰ *Time:* ${new Date(data.timestamp).toLocaleString()}`;
  
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
};

const handleMiniAppSettingsUpdated = async (chatId, data) => {
  console.log('📱 Mini-app settings update notification received:', data);
  
  const enabledTypes = Object.entries(data.settings?.eventTypes || {})
    .filter(([_, enabled]) => enabled)
    .map(([type, _]) => type)
    .join(', ');
  
  const message = `⚙️ **Settings Updated**\n\n` +
    `Your notification preferences have been updated via the mini-app.\n` +
    `Enabled event types: ${enabledTypes || 'None'}\n` +
    `Notifications: ${data.settings?.notifications ? 'Enabled' : 'Disabled'}\n\n` +
    `📱 *Source:* Mini-app\n` +
    `⏰ *Time:* ${new Date(data.timestamp).toLocaleString()}`;
  
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
};

const handleAppInitialized = async (chatId, data) => {
  console.log('📱 Mini-app initialized:', data);
  
  const message = `📱 **Mini-app Connected**\n\n` +
    `Welcome to the Doma Event Tracker mini-app!\n` +
    `API Status: ${data.apiStatus || 'Unknown'}\n` +
    `User: ${data.user?.first_name || 'Unknown'}\n\n` +
    `You can now manage your notification settings directly from the mini-app.`;
  
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
};

const handleUnknownAction = async (chatId, data) => {
  const message = `❓ **Unknown Action**\n\n` +
    `Action: ${data.action}\n` +
    `Data: \`${JSON.stringify(data, null, 2)}\``;
  
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
};

const handleOwnershipTokenMinted = async (chatId, data) => {
  const message = EVENT_MESSAGES.OWNERSHIP_TOKEN_MINTED(data.name, data.owner);
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  
  // Broadcast to all subscribers
  await broadcast({
    type: "OwnershipTokenMinted",
    args: {
      tokenId: data.tokenId,
      name: data.name,
      owner: data.owner,
      registrarIanaId: data.registrarIanaId,
      expiresAt: data.expiresAt
    },
    txHash: data.txHash,
    timestamp: new Date().toISOString()
  });
};

const handleNameTokenRenewed = async (chatId, data) => {
  const expiryDate = new Date(data.expiresAt * 1000).toLocaleDateString();
  const message = EVENT_MESSAGES.NAME_TOKEN_RENEWED(data.name, expiryDate);
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  
  // Broadcast to all subscribers
  await broadcast({
    type: "NameTokenRenewed",
    args: {
      tokenId: data.tokenId,
      name: data.name,
      expiresAt: data.expiresAt
    },
    txHash: data.txHash,
    timestamp: new Date().toISOString()
  });
};

const handleNameTokenBurned = async (chatId, data) => {
  const message = EVENT_MESSAGES.NAME_TOKEN_BURNED(data.name, data.owner);
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  
  // Broadcast to all subscribers
  await broadcast({
    type: "NameTokenBurned",
    args: {
      tokenId: data.tokenId,
      name: data.name,
      owner: data.owner
    },
    txHash: data.txHash,
    timestamp: new Date().toISOString()
  });
};

const handleNameTokenLocked = async (chatId, data) => {
  const message = EVENT_MESSAGES.NAME_TOKEN_LOCKED(data.name, data.owner);
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  
  // Broadcast to all subscribers
  await broadcast({
    type: "NameTokenLocked",
    args: {
      tokenId: data.tokenId,
      name: data.name,
      owner: data.owner,
      isLocked: true
    },
    txHash: data.txHash,
    timestamp: new Date().toISOString()
  });
};

const handleNameTokenUnlocked = async (chatId, data) => {
  const message = EVENT_MESSAGES.NAME_TOKEN_UNLOCKED(data.name, data.owner);
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  
  // Broadcast to all subscribers
  await broadcast({
    type: "NameTokenUnlocked",
    args: {
      tokenId: data.tokenId,
      name: data.name,
      owner: data.owner,
      isLocked: false
    },
    txHash: data.txHash,
    timestamp: new Date().toISOString()
  });
};

const handleRegistrarChanged = async (chatId, data) => {
  const message = EVENT_MESSAGES.REGISTRAR_CHANGED(data.name, data.newRegistrar);
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  
  // Broadcast to all subscribers
  await broadcast({
    type: "RegistrarChanged",
    args: {
      tokenId: data.tokenId,
      name: data.name,
      newRegistrar: data.newRegistrar
    },
    txHash: data.txHash,
    timestamp: new Date().toISOString()
  });
};

const handleMetadataUpdated = async (chatId, data) => {
  const message = EVENT_MESSAGES.METADATA_UPDATED(data.name);
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  
  // Broadcast to all subscribers
  await broadcast({
    type: "MetadataUpdated",
    args: {
      tokenId: data.tokenId,
      name: data.name
    },
    txHash: data.txHash,
    timestamp: new Date().toISOString()
  });
};

const handleUnknownEvent = async (chatId, data) => {
  const message = `📢 **Unknown Event**\n\n` +
    `Event Type: ${data.eventType}\n` +
    `Data: \`${JSON.stringify(data, null, 2)}\``;
  
  await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
}; 