# Doma Bot

A Telegram bot that monitors Doma domain events and broadcasts notifications to subscribers.

## Features

- 🔔 **Real-time Event Monitoring**: Listens to Doma blockchain events
- 📱 **Telegram Notifications**: Sends formatted messages to subscribers
- 🏠 **Domain Events**: Tracks domain minting, renewals, transfers, and expirations
- ⚠️ **Domain Expiration Alerts**: Special handling for expired domains with "Buy Now" links
- 🔐 **Admin Commands**: Admin-only broadcast functionality
- 💾 **Event Storage**: Persists events and subscriber data

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
```

## Commands

- `/start` - Welcome message
- `/subscribe` - Subscribe to domain event alerts
- `/unsubscribe` - Unsubscribe from alerts
- `/test` - Test message
- `/broadcast <message>` - Admin-only broadcast command

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env` file

3. Run the bot:
```bash
node index.js
```

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

## Architecture

```
doma-bot/
├── config/          # Configuration files (bot, web3)
├── commands/        # Telegram bot commands
├── listeners/       # Blockchain event listeners
├── utils/          # Utilities (broadcast, storage)
├── abis/           # Contract ABIs
├── test/           # Test files
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