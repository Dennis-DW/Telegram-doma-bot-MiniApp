// commands/constants/keyboards.js
import { getSubscribers } from "../../utils/storage.js";

export const createEventNotificationKeyboard = (chatId = null) => {
  // Check if user is subscribed if chatId is provided
  let isSubscribed = false;
  if (chatId) {
    const subscribers = getSubscribers();
    isSubscribed = subscribers.includes(chatId);
  }

  return {
    inline_keyboard: [
      [
        { text: "📱 Open Event Tracker", web_app: { url: process.env.MINI_APP_URL } }
      ],
      [
        { 
          text: isSubscribed ? "🔕 Unsubscribe" : "🔔 Subscribe", 
          callback_data: isSubscribed ? "unsubscribe" : "subscribe" 
        }
      ],
      [
        { text: "📊 View Status", callback_data: "status" },
        { text: "❓ Help", callback_data: "help" }
      ]
    ]
  };
}; 