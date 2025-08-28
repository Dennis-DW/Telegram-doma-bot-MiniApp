// commands/admin/handlers/subscriberHandler.js
import { getSubscribers } from "../../../utils/storage.js";
import { formatSubscriberList } from "../utils/formatUtils.js";

// Show subscriber list
export const showSubscriberList = async (bot, chatId) => {
  try {
    const subscribers = getSubscribers();
    const message = formatSubscriberList(subscribers);

    await bot.sendMessage(chatId, message, { parse_mode: "MarkdownV2" });
  } catch (error) {
    console.error("Error showing subscriber list:", error);
    await bot.sendMessage(chatId, "❌ Failed to retrieve subscriber list.");
  }
};

// Get subscriber statistics

export default {
  showSubscriberList,
}