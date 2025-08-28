# Doma Event Tracker Bot & Mini App

A comprehensive Telegram bot and mini-app system for tracking and notifying users about domain events on the Doma blockchain network.

## 🎯 Overview

This project consists of two main components:
- **Telegram Bot**: Listens to blockchain events and sends notifications to subscribers
- **Mini App**: Provides a user-friendly interface for viewing events and managing notifications

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Blockchain    │    │   Telegram Bot  │    │   Mini App      │
│   Events        │───▶│   (Event        │───▶│   (Event        │
│                 │    │    Processing)  │    │    Display)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Supported Events

The system monitors and notifies on these domain events:

| Event Type | Icon | Description | Bot Notification |
|------------|------|-------------|------------------|
| OwnershipTokenMinted | ✨ | New domain minted | "A new domain was minted: {name}, owner: {address}" |
| NameTokenRenewed | 🔄 | Domain renewed | "Domain {name} has been renewed until {expiryDate}" |
| NameTokenBurned | 🔥 | Domain burned | "Domain {name} has been burned by {address}" |
| NameTokenLocked | 🔒 | Domain locked | "Domain {name} is now locked by {address}" |
| NameTokenUnlocked | �� | Domain unlocked | "Domain {name} has been unlocked by {address}" |
| RegistrarChanged | 🏢 | Registrar updated | "Registrar for domain {name} changed to {newRegistrar}" |
| MetadataUpdated | 📝 | Metadata changed | "Domain {name} metadata was updated" |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Telegram Bot Token
- Doma RPC URL
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doma-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd mini-app && npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token
   DOMA_RPC_URL=wss://rpc-testnet.doma.xyz
   OWNERSHIP_TOKEN_ADDRESS=0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f
   ADMIN_CHAT_ID=your_admin_chat_id
   MINI_APP_URL=https://your-mini-app-url.com
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
doma-bot/
├── commands/                 # Bot command handlers
│   ├── handlers/            # Event and command handlers
│   ├── constants/           # Message templates and keyboards
│   ├── admin.js            # Admin commands
│   ├── start.js            # Start command
│   ├── subscribe.js        # Subscribe command
│   └── unsubscribe.js      # Unsubscribe command
├── config/                  # Configuration files
│   ├── bot.js              # Bot configuration
│   └── web3.js             # Web3 configuration
├── listeners/               # Blockchain event listeners
│   └── domaEvents.js       # Event listening logic
├── utils/                   # Utility functions
│   ├── broadcast.js        # Broadcasting utilities
│   └── storage.js          # Data storage utilities
├── mini-app/                # React mini-app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config/         # Mini-app configuration
│   │   └── utils/          # Mini-app utilities
│   └── package.json
├── test/                    # Test files
├── abis/                    # Smart contract ABIs
└── package.json
```

## 🤖 Bot Features

### Commands
- `/start` - Welcome message and main menu
- `/events` - Open the event tracker mini-app
- `/subscribe` - Subscribe to event notifications
- `/unsubscribe` - Unsubscribe from notifications
- `/help` - Show help message
- `/status` - Check subscription status
- `/broadcast` - Admin command to broadcast messages

### Event Processing
- **Real-time listening** to blockchain events
- **Automatic notifications** to subscribed users
- **Event formatting** with transaction details
- **Broadcasting system** for mass notifications

## 📱 Mini App Features

### Event Dashboard
- Overview of all event types
- Quick statistics and navigation
- Real-time event monitoring

### Event Lists
- **Domain Minting** (✨) - New domains created
- **Domain Renewals** (🔄) - Domain extensions
- **Domain Burning** (🔥) - Domain deletions
- **Lock Status** (🔒) - Domain lock/unlock events
- **Registrar Changes** (🏢) - Registrar updates
- **Metadata Updates** (📝) - Metadata changes

### Notification Settings
- Toggle specific event types
- Manage notification preferences
- Synchronized settings with bot

## 🔄 Data Flow

1. **Blockchain Event Occurs**
   - Smart contract emits event
   - Bot listens and processes event

2. **Bot Processes Event**
   - Formats notification message
   - Sends to subscribed users
   - Stores event data

3. **Mini App Displays Events**
   - Fetches event data from bot
   - Displays in user-friendly format
   - Allows filtering and searching

## 🔧 Technical Integration

### Bot → Mini App Communication
```javascript
// Bot sends event data
telegramApp.sendData({
  eventType: 'OwnershipTokenMinted',
  name: 'example.doma',
  owner: '0x1234...5678',
  txHash: '0xabcd...efgh',
  timestamp: '2024-01-01T00:00:00Z'
});
```

### Mini App → Bot Communication
```javascript
// Mini app sends settings
telegramApp.sendData({
  action: 'update_notification_settings',
  settings: {
    minting: true,
    renewals: true,
    burning: false,
    // ... other settings
  }
});
```

## �� Testing

Run the test suite:
```bash
# Test bot integration
npm run test:bot

# Test mini-app integration
npm run test:miniapp

# Test events
npm run test:events
```

## 🎨 UI/UX Design

- **Clean, Modern Interface** - Easy to navigate
- **Event-Specific Colors** - Each event type has distinct colors
- **Responsive Design** - Works on all device sizes
- **Real-Time Updates** - Events appear as they happen
- **Intuitive Navigation** - Clear paths to all features

## 📈 Future Enhancements

- **Event Filtering** - Filter by date, domain, owner
- **Event Search** - Search for specific domains or addresses
- **Export Features** - Export event data
- **Analytics Dashboard** - Event trends and statistics
- **Custom Alerts** - Set up custom notification rules

## 🔒 Security

- **Environment Variables** - Sensitive data stored in .env
- **Admin Commands** - Restricted to authorized users
- **Input Validation** - All inputs are validated
- **Error Handling** - Comprehensive error handling




## 🆘 Support

For support and questions:
- Check the `/help` command in the bot
- Review the test files for usage examples
- Check the configuration files for setup guidance

---

**Note**: This bot and mini-app system transforms simple blockchain event monitoring into a comprehensive notification platform, providing users with real-time insights into domain activities on the Doma network! 🎉
