// utils/broadcast.js
import bot from "../config/bot.js";
import { getSubscribers } from "./storage.js";
import dotenv from "dotenv";

dotenv.config();

const EXPLORER_BASE_URL = process.env.DOMA_EXPLORER_URL;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://frontend.com";

/**
 * Escape text for Telegram MarkdownV2
 * @param {string} text
 * @returns {string}
 */
function escapeMarkdownV2(text) {
  if (typeof text !== "string") return text;
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

/**
 * Format messages based on event type
 * @param {string} type - Event type (e.g. OwnershipTransferred, Transfer)
 * @param {object} data - Event data payload
 */
function formatMessage(type, data) {
  const txLink = data.txHash ? `${EXPLORER_BASE_URL.replace(/\/$/, "")}/${data.txHash}` : null;

  switch (type) {
    case "OwnershipTokenMinted":
      return `✨ *Domain Minted!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(data.tokenId))}\`\n` +
        `👤 Owner: \`${escapeMarkdownV2(data.to)}\`\n` +
        `🌐 Domain: \`${escapeMarkdownV2(data.sld)}.${escapeMarkdownV2(data.tld)}\`\n` +
        `⏰ Expires: \`${escapeMarkdownV2(new Date(Number(data.expiresAt) * 1000).toLocaleString())}\``;

    case "NameTokenRenewed":
      return `♻️ *Domain Renewed!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(data.tokenId))}\`\n` +
        `⏰ New Expiry: \`${escapeMarkdownV2(new Date(Number(data.expiresAt) * 1000).toLocaleString())}\``;

    case "NameTokenBurned":
      return `🔥 *Domain Burned!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(data.tokenId))}\``;

    case "LockStatusChanged":
      return `🔐 *Lock Status Changed!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(data.tokenId))}\`\n` +
        `🔒 Status: ${data.isTransferLocked ? "🔒 Locked" : "🔓 Unlocked"}`;

    case "Transfer":
      return `🔄 *Domain Transferred!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(data.tokenId))}\`\n` +
        `📤 From: \`${escapeMarkdownV2(data.from)}\`\n` +
        `📥 To: \`${escapeMarkdownV2(data.to)}\``;

    case "DomainExpired":
      const domainName = `${data.sld}.${data.tld}`;
      const buyUrl = `${FRONTEND_URL}/domain/${data.sld}`;
      return `⚠️ *Domain Expired: ${escapeMarkdownV2(domainName)}*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(data.tokenId))}\`\n` +
        `👉 [Buy Now](${escapeMarkdownV2(buyUrl)})`;

    case "OwnershipTransferred":
      return `🔑 *Ownership Transferred!*\n\n` +
        `👤 Previous Owner: \`${escapeMarkdownV2(data.previousOwner)}\`\n` +
        `👤 New Owner: \`${escapeMarkdownV2(data.newOwner)}\`\n` +
        `⛓️ [View Transaction](${escapeMarkdownV2(txLink)})\n` +
        `📦 Block: ${escapeMarkdownV2(String(data.blockNumber))}`;

    default:
      if (txLink) {
        return `📢 *New Event Detected: ${escapeMarkdownV2(type)}*\n\n` +
          `📝 Data:\n\`${escapeMarkdownV2(JSON.stringify(data, null, 2))}\`\n` +
          `🔗 [View Transaction](${escapeMarkdownV2(txLink)})`;
      } else {
        return `📢 *New Event Detected: ${escapeMarkdownV2(type)}*\n\n` +
          `📝 Data:\n\`${escapeMarkdownV2(JSON.stringify(data, null, 2))}\``;
      }
  }
}

/**
 * Broadcasts a message to all subscribers.
 * @param {string|object} messageOrEvent - Either a formatted message string or an event object
 * @param {object} data - Optional event data (used when messageOrEvent is a type string)
 */
export async function broadcast(messageOrEvent, data = null) {
  const subscribers = getSubscribers();

  if (subscribers.length === 0) {
    console.log("⚠️ No subscribers to broadcast to.");
    return;
  }

  let message;
  let type;

  // Handle different input formats
  if (typeof messageOrEvent === "string") {
    // If it's a string, it's either a formatted message or an event type
    if (data) {
      // messageOrEvent is the event type, data contains the event data
      type = messageOrEvent;
      message = formatMessage(type, data);
    } else {
      // messageOrEvent is already a formatted message
      message = messageOrEvent;
    }
  } else if (typeof messageOrEvent === "object") {
    // messageOrEvent is an event object
    type = messageOrEvent.type;
    message = formatMessage(type, messageOrEvent.args || messageOrEvent);
  } else {
    console.error("❌ Invalid message format for broadcast");
    return;
  }

  console.log(`📢 Broadcasting ${type || "message"} to ${subscribers.length} subscriber(s)...`);

  for (const chatId of subscribers) {
    try {
      await bot.sendMessage(chatId, message, { parse_mode: "MarkdownV2" });
    } catch (error) {
      console.error(`❌ Failed to send message to ${chatId}:`, error.message);
    }
  }
}
