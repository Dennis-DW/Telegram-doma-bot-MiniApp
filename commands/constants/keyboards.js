// commands/constants/keyboards.js

export const createEventNotificationKeyboard = () => ({
  inline_keyboard: [
    [
      { text: "📱 Open Event Tracker", web_app: { url: process.env.MINI_APP_URL } }
    ],
    [
      { text: "📋 Subscribe to Events", callback_data: "subscribe" },
      { text: "❌ Unsubscribe", callback_data: "unsubscribe" }
    ],
    [
      { text: "📊 View Status", callback_data: "status" },
      { text: "❓ Help", callback_data: "help" }
    ]
  ]
}); 