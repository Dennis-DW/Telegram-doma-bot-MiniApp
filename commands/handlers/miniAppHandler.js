// commands/handlers/miniAppHandler.js
import bot from "../../config/bot.js";
import { broadcast } from "../../utils/broadcast.js";
import { EVENT_MESSAGES } from "../constants/index.js";

// Handle different event types from blockchain
export const handleEventAction = async (chatId, data) => {
  console.log('📢 Event data received:', data);
  
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