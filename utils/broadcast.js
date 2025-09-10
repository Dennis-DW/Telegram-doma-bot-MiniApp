// utils/broadcast.js
import database from "./database.js";
import dotenv from "dotenv";

dotenv.config();

const EXPLORER_BASE_URL = process.env.EXPLORER_BASE_URL;
const FRONTEND_URL = process.env.MINI_APP_URL;

// Custom JSON serializer to handle BigInt
const customStringify = (obj) => {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }, 2);
};

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
 * @param {object} data - Event data payload (can be array or object)
 */
function formatMessage(type, data) {
  const txLink = data.txHash ? `${EXPLORER_BASE_URL.replace(/\/$/, "")}/${data.txHash}` : null;

  switch (type) {
    case "OwnershipTokenMinted":
      // data is an array: [tokenId, registrarIanaId, to, sld, tld, expiresAt, correlationId]
      const tokenId = Array.isArray(data) ? data[0] : data.tokenId;
      const to = Array.isArray(data) ? data[2] : data.to;
      const sld = Array.isArray(data) ? data[3] : data.sld;
      const tld = Array.isArray(data) ? data[4] : data.tld;
      const expiresAt = Array.isArray(data) ? data[5] : data.expiresAt;
      
      return `✨ *Domain Minted\\!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(tokenId))}\`\n` +
        `👤 Owner: \`${escapeMarkdownV2(to)}\`\n` +
        `🌐 Domain: \`${escapeMarkdownV2(sld)}\\.${escapeMarkdownV2(tld)}\`\n` +
        `⏰ Expires: \`${escapeMarkdownV2(new Date(Number(expiresAt) * 1000).toLocaleString())}\``;

    case "NameTokenRenewed":
      // data is an array: [tokenId, expiresAt]
      const renewedTokenId = Array.isArray(data) ? data[0] : data.tokenId;
      const newExpiresAt = Array.isArray(data) ? data[1] : data.expiresAt;
      
      return `♻️ *Domain Renewed\\!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(renewedTokenId))}\`\n` +
        `⏰ New Expiry: \`${escapeMarkdownV2(new Date(Number(newExpiresAt) * 1000).toLocaleString())}\``;

    case "NameTokenBurned":
      // data is an array: [tokenId]
      const burnedTokenId = Array.isArray(data) ? data[0] : data.tokenId;
      
      return `🔥 *Domain Burned\\!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(burnedTokenId))}\``;

    case "LockStatusChanged":
      // data is an array: [tokenId, isTransferLocked]
      const lockTokenId = Array.isArray(data) ? data[0] : data.tokenId;
      const isTransferLocked = Array.isArray(data) ? data[1] : data.isTransferLocked;
      
      return `🔐 *Lock Status Changed\\!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(lockTokenId))}\`\n` +
        `🔒 Status: ${isTransferLocked ? "🔒 Locked" : "🔓 Unlocked"}`;

    case "Transfer":
      // data is an array: [from, to, tokenId]
      const from = Array.isArray(data) ? data[0] : data.from;
      const transferTo = Array.isArray(data) ? data[1] : data.to;
      const transferTokenId = Array.isArray(data) ? data[2] : data.tokenId;
      
      return `🔄 *Domain Transferred\\!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(transferTokenId))}\`\n` +
        `📤 From: \`${escapeMarkdownV2(from)}\`\n` +
        `📥 To: \`${escapeMarkdownV2(transferTo)}\``;

    case "DomainExpired":
      const domainName = `${escapeMarkdownV2(data.sld)}\\.${escapeMarkdownV2(data.tld)}`;
      const buyUrl = `${FRONTEND_URL}/domain/${data.sld}`;
      return `⚠️ *Domain Expired: ${domainName}*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(data.tokenId))}\`\n` +
        `👉 [Buy Now](${escapeMarkdownV2(buyUrl)})`;

    case "OwnershipTransferred":
      return `🔑 *Ownership Transferred\\!*\n\n` +
        `👤 Previous Owner: \`${escapeMarkdownV2(data.previousOwner)}\`\n` +
        `👤 New Owner: \`${escapeMarkdownV2(data.newOwner)}\`\n` +
        `⛓️ [View Transaction](${escapeMarkdownV2(txLink)})\n` +
        `📦 Block: ${escapeMarkdownV2(String(data.blockNumber))}`;

    case "NameTokenLocked":
      // data is an array: [tokenId, by]
      const lockedTokenId = Array.isArray(data) ? data[0] : data.tokenId;
      const lockedBy = Array.isArray(data) ? data[1] : data.by;
      
      return `🔒 *Domain Locked\\!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(lockedTokenId))}\`\n` +
        `🔒 Locked By: \`${escapeMarkdownV2(lockedBy)}\``;

    case "NameTokenUnlocked":
      // data is an array: [tokenId, by]
      const unlockedTokenId = Array.isArray(data) ? data[0] : data.tokenId;
      const unlockedBy = Array.isArray(data) ? data[1] : data.by;
      
      return `🔓 *Domain Unlocked\\!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(unlockedTokenId))}\`\n` +
        `🔓 Unlocked By: \`${escapeMarkdownV2(unlockedBy)}\``;

    case "RegistrarChanged":
      // data is an array: [tokenId, newRegistrar]
      const registrarTokenId = Array.isArray(data) ? data[0] : data.tokenId;
      const newRegistrar = Array.isArray(data) ? data[1] : data.newRegistrar;
      
      return `🏢 *Registrar Changed\\!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(registrarTokenId))}\`\n` +
        `🏢 New Registrar: \`${escapeMarkdownV2(newRegistrar)}\``;

    case "MetadataUpdated":
      // data is an array: [tokenId]
      const metadataTokenId = Array.isArray(data) ? data[0] : data.tokenId;
      
      return `📝 *Metadata Updated\\!*\n\n` +
        `🔢 Token ID: \`${escapeMarkdownV2(String(metadataTokenId))}\``;

    default:
      if (txLink) {
        return `�� *New Event Detected: ${escapeMarkdownV2(type)}*\n\n` +
          `📝 Data:\n\`${escapeMarkdownV2(customStringify(data))}\`\n` +
          `🔗 [View Transaction](${escapeMarkdownV2(txLink)})`;
      } else {
        return `📢 *New Event Detected: ${escapeMarkdownV2(type)}*\n\n` +
          `📝 Data:\n\`${escapeMarkdownV2(customStringify(data))}\``;
      }
  }
}

/**
 * Broadcasts a message to all subscribers.
 * @param {string|object} messageOrEvent - Either a formatted message string or an event object
 * @param {object} data - Optional event data (used when messageOrEvent is a type string)
 */
export async function broadcast(messageOrEvent, data = null) {
  try {
    const subscribers = await database.getSubscribers();

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

    console.log("=".repeat(60));
    console.log(`📢 BROADCASTING EVENT: ${type || "message"}`);
    console.log("=".repeat(60));
    console.log(`👥 Subscribers: ${subscribers.length}`);
    console.log(`📝 Message Type: ${type || "Custom Message"}`);
    console.log(`📋 Message Preview: ${message.substring(0, 100)}...`);
    console.log("=".repeat(60));

    // Store the message for the main bot to send
    // The main bot will handle the actual sending to avoid conflicts
    console.log("📤 Event queued for broadcasting by main bot");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error in broadcast function:", error);
  }
}

// Export the formatMessage function for use in other modules
export { formatMessage };
