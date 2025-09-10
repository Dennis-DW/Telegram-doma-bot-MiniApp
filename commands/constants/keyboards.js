// commands/constants/keyboards.js
import database from "../../utils/database.js";

export const getMainKeyboard = async (chatId) => {
  try {
    const subscribers = await database.getSubscribers();
    const isSubscribed = subscribers.includes(chatId);
    
    if (isSubscribed) {
      return {
        inline_keyboard: [
          [
            { text: "🔕 Unsubscribe", callback_data: "unsubscribe" },
            { text: "📊 View Status", callback_data: "status" }
          ],
          [
            { text: "❓ Help", callback_data: "help" }
          ]
        ]
      };
    } else {
      return {
        inline_keyboard: [
          [
            { text: "🔔 Subscribe", callback_data: "subscribe" },
            { text: "📊 View Status", callback_data: "status" }
          ],
          [
            { text: "❓ Help", callback_data: "help" }
          ]
        ]
      };
    }
  } catch (error) {
    console.error("Error getting keyboard:", error);
    // Return default keyboard on error
    return {
      inline_keyboard: [
        [
          { text: "🔔 Subscribe", callback_data: "subscribe" },
          { text: "❓ Help", callback_data: "help" }
        ]
      ]
    };
  }
};

export const getAdminKeyboard = () => {
  return {
    inline_keyboard: [
      [
        { text: "📊 Statistics", callback_data: "admin_stats" },
        { text: "👥 Subscribers", callback_data: "admin_subscribers" }
      ],
      [
        { text: "📢 Broadcast", callback_data: "admin_broadcast" },
        { text: "🧹 Cleanup", callback_data: "admin_cleanup" }
      ],
      [
        { text: "🔙 Back to Main", callback_data: "main_menu" }
      ]
    ]
  };
};
