# Doma Bot - Enhanced Telegram Bot with Crash Recovery

A robust Telegram bot for monitoring Doma blockchain events with automatic crash recovery, request management, and health monitoring.

## 🚀 Features

### Core Functionality
- **Real-time blockchain event monitoring** - Tracks domain minting, transfers, renewals, and more
- **Telegram notifications** - Sends aggregated event updates to subscribers
- **Mini-app integration** - Web interface for managing subscriptions
- **REST API** - Programmatic access to event data

### Enhanced Reliability
- **🔄 Automatic crash recovery** - Bot restarts immediately if it crashes
- **📊 Request queue management** - Handles multiple user requests efficiently
- **🏥 Health monitoring** - Continuous system health checks
- **⚡ Rate limiting** - Prevents spam and abuse
- **🛡️ Error handling** - Graceful error recovery and logging
- **📈 Process monitoring** - PM2 process manager for production deployment

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- Telegram Bot Token
- Doma RPC URL

### Setup

1. **Clone and install dependencies:**
```bash
git clone <repository>
cd doma-bot
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with PM2 (Recommended for production):**
```bash
./start.sh
```

4. **Or start manually:**
```bash
npm run pm2:start:prod
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token

# Database
MONGODB_URI=mongodb://localhost:27017/doma-events

# Blockchain
DOMA_RPC_URL=https://your-rpc-url
OWNERSHIP_TOKEN_ADDRESS=0x...

# Optional
NODE_ENV=production
```

### PM2 Configuration
- **Auto-restart**: Enabled with 10 max restarts
- **Memory limit**: 1GB for bot, 512MB for API
- **Logging**: Comprehensive logging to ./logs/
- **Health checks**: 30-second intervals

## 🚀 Usage

### Starting the Bot

**Production (with PM2):**
```bash
./start.sh                    # Quick start
npm run pm2:start:prod        # Production mode
npm run pm2:start:dev         # Development mode
```

**Development:**
```bash
npm run dev                   # Bot with nodemon
npm run dev:api              # API with nodemon
```

### Managing the Bot

**PM2 Commands:**
```bash
npm run pm2:status           # Check status
npm run pm2:logs             # View logs
npm run pm2:monit            # Monitor processes
npm run pm2:restart          # Restart all
npm run pm2:stop             # Stop all
npm run pm2:delete           # Delete all
```

**Health & Status:**
```bash
npm run health               # Check system health
npm run queue                # Check request queue
npm run status               # Full system status
```

### Telegram Commands

- `/start` - Welcome message and main menu
- `/subscribe` - Subscribe to event notifications
- `/unsubscribe` - Unsubscribe from notifications
- `/status` - Check subscription and system status
- `/health` - View system health report
- `/queue` - Check request queue status
- `/help` - Show help message

## 📊 System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Telegram Bot  │    │  Request Queue   │    │  Health Monitor │
│                 │◄──►│                  │◄──►│                 │
│  - Commands     │    │  - Rate Limiting │    │  - Health Checks│
│  - Notifications│    │  - Priority Queue│    │  - Auto Recovery│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Event Listeners│    │  Process Manager │    │     Database    │
│                 │    │                  │    │                 │
│  - Blockchain   │    │  - Graceful Shut │    │  - MongoDB      │
│  - Event Aggreg │    │  - Signal Handle │    │  - Subscribers  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Project Structure

```
doma-bot/
├── commands/           # Telegram command handlers
├── listeners/          # Blockchain event listeners
├── utils/              # Utility modules
│   ├── requestQueue.js # Request management
│   ├── healthMonitor.js# Health monitoring
│   └── database.js     # Database operations
├── api/               # REST API
├── mini-app/          # Web interface
├── ecosystem.config.js# PM2 configuration
└── processManager.js  # Process management
```

## 📈 Performance Features

### Request Management
- **Concurrent requests**: 5 simultaneous requests
- **Queue size**: 100 requests maximum
- **Rate limiting**: 10 requests per minute per user
- **Timeout**: 30 seconds per request

### Memory Management
- **Memory limit**: 1GB for bot process
- **Garbage collection**: Automatic cleanup
- **Memory monitoring**: Continuous tracking
- **Auto-restart**: On memory threshold

### Database Optimization
- **Indexes**: Optimized for common queries
- **Connection pooling**: Efficient connection management
- **Cleanup**: Automatic old data removal
- **Monitoring**: Connection health checks

## 🛠️ Troubleshooting

### Common Issues

**Bot not starting:**
```bash
# Check logs
npm run pm2:logs

# Check health
npm run health

# Restart
npm run pm2:restart
```

**High memory usage:**
```bash
# Check memory
npm run status

# Restart if needed
npm run pm2:restart
```

**Database connection issues:**
```bash
# Check MongoDB
mongosh --eval "db.adminCommand('ping')"

# Check bot logs
npm run pm2:logs
```

### Log Files
- `logs/combined.log` - All bot logs
- `logs/error.log` - Error logs only
- `logs/api-combined.log` - API logs
- `logs/api-error.log` - API errors

## 🔒 Security

- **Rate limiting** - Prevents abuse
- **Input validation** - Sanitizes user input
- **Error handling** - Prevents information leakage
- **Process isolation** - PM2 process management
- **Logging** - Audit trail for all operations

## 📝 License

MIT License

---

**Made with ❤️ for the Doma ecosystem**
