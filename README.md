# Doma Bot & Mini App

A Telegram bot with integrated Mini App that monitors Doma domain events and provides domain management capabilities.

## Features

- 🔔 **Real-time Event Monitoring**: Listens to Doma blockchain events
- 📱 **Telegram Notifications**: Sends formatted messages to subscribers
- 🏠 **Domain Events**: Tracks domain minting, renewals, transfers, and expirations
- ⚠️ **Domain Expiration Alerts**: Special handling for expired domains with "Buy Now" links
- 🔐 **Admin Commands**: Admin-only broadcast functionality
- 💾 **Event Storage**: Persists events and subscriber data
- 📱 **Mini App Integration**: Full domain management interface within Telegram
- 🔗 **Wallet Connection**: Secure wallet integration for blockchain transactions
- ✨ **Domain Management**: Mint, renew, transfer, lock, and burn domains

## Event Types Supported

- **OwnershipTokenMinted**: New domain registration
- **NameTokenRenewed**: Domain renewal
- **NameTokenBurned**: Domain deletion
- **LockStatusChanged**: Domain transfer lock status
- **Transfer**: Domain ownership transfer
- **DomainExpired**: Domain expiration (with buy link)

## Environment Variables

Create a `.env` file with the following variables:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
ADMIN_CHAT_ID=your_admin_chat_id_here

# Doma Network Configuration
DOMA_RPC_URL=wss://your_doma_rpc_url_here
OWNERSHIP_TOKEN_ADDRESS=0xYourOwnershipTokenContractAddress

# Frontend URLs
DOMA_EXPLORER_URL=https://explorer.doma.com
FRONTEND_URL=https://frontend.com

# Mini App Configuration
MINI_APP_URL=https://your-mini-app-domain.com
```

## Commands

- `/start` - Welcome message with Mini App access
- `/miniapp` - Open the Doma Manager Mini App
- `/subscribe` - Subscribe to domain event alerts
- `/unsubscribe` - Unsubscribe from alerts
- `/status` - Check subscription status
- `/help` - Show help information
- `/test` - Test message
- `/broadcast <message>` - Admin-only broadcast command

## Installation

### Bot Setup
1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env` file

3. Run the bot:
```bash
node index.js
```

### Mini App Setup
1. Navigate to the Mini App directory:
```bash
cd mini-app
```

2. Install dependencies:
```bash
npm install
```

3. Build the Mini App:
```bash
npm run build
```

4. Deploy the built files to your web server

5. Update the `MINI_APP_URL` in your `.env` file

## Testing

Run the domain event tests:
```bash
node test/test_domain_expiration.js
```

## Recent Improvements

### Domain Expiration Handling
- Added support for `DomainExpired` events
- Automatic "Buy Now" link generation for expired domains
- Proper message formatting with domain name and token ID

### Broadcast System
- Unified broadcast function that handles multiple input formats
- Improved message formatting with proper MarkdownV2 escaping
- Better error handling and logging

### Event Storage
- Enhanced event data structure with transaction details
- Proper timestamp handling for expiration dates
- Improved event persistence and retrieval

### Code Alignment
- Consistent error handling across all modules
- Proper async/await usage
- Better separation of concerns between modules

## Mini App Integration

The bot integrates with a React-based Telegram Mini App that provides:

### Features
- **Wallet Connection**: Secure connection to user's wallet
- **Domain Management**: Full CRUD operations for domains
- **Real-time Updates**: Live transaction status and notifications
- **User-friendly Interface**: Modern, responsive design

### Communication Flow
1. User opens Mini App from bot
2. Mini App connects to user's wallet
3. User performs domain operations
4. Mini App sends data back to bot via `telegram.WebApp.sendData()`
5. Bot processes data and broadcasts notifications

### Mini App Actions
- `wallet_connected` - Wallet successfully connected
- `domain_minted` - New domain created
- `domain_renewed` - Domain renewal completed
- `lock_status_changed` - Transfer lock toggled
- `domain_burned` - Domain permanently deleted
- `error` - Error occurred during operation

## Architecture

```
doma-bot/
├── config/          # Configuration files (bot, web3)
├── commands/        # Telegram bot commands
├── listeners/       # Blockchain event listeners
├── utils/          # Utilities (broadcast, storage)
├── abis/           # Contract ABIs
├── test/           # Test files
├── mini-app/       # Telegram Mini App (React/Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Reusable UI components
│   │   │   └── sections/    # Page sections
│   │   ├── config/          # Blockchain configuration
│   │   └── utils/           # Telegram utilities
│   └── dist/                # Built Mini App files
└── index.js        # Main entry point
```

## Domain Expiration Format

When a domain expires, subscribers receive a message like:
```
⚠️ Domain Expired: abc.doma

🔢 Token ID: 5678
👉 Buy Now: https://frontend.com/domain/abc
```

The bot automatically generates the correct frontend URL based on the domain's SLD (Second Level Domain). 