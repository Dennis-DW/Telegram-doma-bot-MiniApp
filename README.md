# 🚀 Doma Event Tracker - Complete Blockchain Event Monitoring System

A comprehensive **Telegram bot + Mini-App** system for real-time monitoring and notification of Doma blockchain events. This project provides a complete solution for tracking domain events, managing user subscriptions, and delivering beautiful, aggregated notifications.

## 🎯 **Project Overview**

This is a **full-stack blockchain monitoring system** consisting of:

1. **🤖 Telegram Bot** - Real-time event processing and notification delivery
2. **📱 Mini-App** - Mobile-responsive web interface for user management
3. **🔗 API Server** - RESTful backend for mini-app communication
4. **📊 Event Aggregator** - Intelligent event batching and formatting
5. **💾 Storage System** - Persistent data management with automatic cleanup
6. **🔧 Redux State Management** - Centralized state management for the mini-app

## 🏗️ **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Blockchain    │    │   Telegram Bot  │    │   Mini App      │
│   Events        │───▶│   (Event        │───▶│   (User         │
│   (Doma)        │    │    Processing)  │    │    Interface)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   API Server    │    │   Redux Store   │
                       │   (RESTful)     │◄───│   (State Mgmt)  │
                       └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Storage       │    │   Event         │
                       │   (JSON DB)     │    │   Aggregator    │
                       └─────────────────┘    └─────────────────┘
```

## 📋 **Event Types Tracked**

| Event Type | Blockchain Event | Icon | Description | Notification Format |
|------------|------------------|------|-------------|-------------------|
| **Minting** | `OwnershipTokenMinted` | ✨ | New domains created | Domain name, owner, expiry |
| **Transfers** | `Transfer` | 🔄 | Domain ownership transfers | From → To addresses |
| **Renewals** | `NameTokenRenewed` | ♻️ | Domain extensions | New expiry date |
| **Burning** | `NameTokenBurned` | 🔥 | Domain deletions | Domain and owner |
| **Locks** | `LockStatusChanged` | 🔒 | Lock/unlock events | Lock status change |
| **Registrar** | `RegistrarChanged` | 🏢 | Registrar updates | New registrar |
| **Metadata** | `MetadataUpdated` | 📝 | Metadata changes | Domain updates |
| **Locked** | `NameTokenLocked` | 🔒 | Domain locked | Locked by address |
| **Unlocked** | `NameTokenUnlocked` | 🔓 | Domain unlocked | Unlocked by address |
| **Expired** | `DomainExpired` | ⚠️ | Domain expiration | Expired domain |

## 🤖 **Bot Commands & Features**

### **User Commands**
- `/start` - Welcome message and bot introduction
- `/subscribe` - Subscribe to event notifications
- `/unsubscribe` - Unsubscribe from event notifications
- `/events` - Open mini-app or show event management options
- `/help` - Show help information
- `/status` - Check subscription status

### **Admin Commands**
- `/admin` - Access admin panel (admin only)
- `/broadcast <message>` - Send message to all subscribers
- `/subscribers` - View list of all subscribers
- `/stats` - View system statistics

### **Dynamic Inline Buttons**
The bot features dynamic inline buttons that change based on user subscription status:

**When Not Subscribed:**
- 🔔 Subscribe
- 📊 View Status
- ❓ Help

**When Subscribed:**
- 🔕 Unsubscribe
- 📊 View Status
- ❓ Help

### **Bot Features**
- **30-minute notification intervals** - Aggregated updates every 30 minutes
- **Comprehensive event tracking** - All categories with zero-count display
- **Dynamic totals calculation** - Today's vs cumulative event totals
- **Beautiful notification format** - Clean, organized messages with emojis
- **User settings management** - Per-user notification preferences
- **Real-time synchronization** - Mini-app and bot stay in sync
- **Error handling** - Robust error handling and fallback mechanisms

## 📱 **Mini-App Features**

### **Dashboard**
- **Event Overview** - Visual display of all event types
- **Real-time Statistics** - Live event counts and trends
- **Subscription Status** - Current subscription state
- **Quick Actions** - Subscribe/unsubscribe buttons

### **Notification Settings**
- **Dynamic Button States** - Subscribe/Unsubscribe button changes based on status
- **Event Type Preferences** - Toggle specific event notifications
- **Real-time Updates** - Settings applied immediately
- **Telegram Integration** - Seamless communication with bot

### **Event History**
- **Filtered Events** - View events based on user preferences
- **Event Details** - Comprehensive event information
- **Search & Filter** - Find specific events
- **Pagination** - Navigate through large event lists

### **Advanced Features**
- **Mobile responsive design** - Optimized for all screen sizes
- **Real-time subscription management** - Subscribe/unsubscribe directly
- **Settings persistence** - User preferences saved and applied immediately
- **Event dashboard** - Visual overview of all event types and statistics
- **Telegram integration** - Seamless communication with the bot
- **Explorer integration** - View transactions on blockchain explorers with fallback URLs
- **Redux state management** - Centralized state management for better performance

## 🔧 **Technical Implementation**

### **Frontend (Mini-App)**
- **React 18** - Modern React with hooks and functional components
- **Redux Toolkit** - Centralized state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Telegram WebApp SDK** - Native Telegram integration

### **Backend (API Server)**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Web3.js** - Blockchain interaction
- **Ethers.js** - Ethereum utilities
- **JSON Storage** - Lightweight data persistence

### **State Management (Redux)**
```javascript
// Store Structure
{
  subscription: {
    status: { subscribed: boolean, totalSubscribers: number },
    settings: { eventTypes: object, notifications: boolean },
    loading: boolean,
    error: string | null
  },
  events: {
    list: array,
    stats: object,
    loading: boolean,
    error: string | null
  },
  ui: {
    theme: string,
    sidebar: boolean,
    notifications: array
  }
}
```

### **Data Storage**
- **Separated Data Files** - `events.json` and `users.json` for better performance
- **Automatic Cleanup** - Old events automatically removed after 10 days
- **Data Type Consistency** - All IDs stored as strings for reliable comparisons
- **Caching System** - 5-second cache for subscription status to reduce API calls

## 🔗 **Doma Network Testnet Implementation**

### **Network Configuration**
The project is configured to work with the Doma blockchain testnet using HTTP polling for event listening.

#### **Environment Variables**
```env
# Doma Network Configuration
DOMA_RPC_URL=https://testnet-rpc.doma.network
OWNERSHIP_TOKEN_ADDRESS=0x1234567890123456789012345678901234567890

# Bot Configuration
BOT_TOKEN=your_telegram_bot_token
ADMIN_USER_ID=your_admin_user_id

# API Configuration
API_PORT=3000
NODE_ENV=development
```

### **Smart Contract Integration**

#### **Contract Details**
- **Contract**: OwnershipToken
- **Address**: `OWNERSHIP_TOKEN_ADDRESS` environment variable
- **ABI**: `abis/OwnershipToken.json`
- **Interface**: Uses ethers.js Interface for event parsing

#### **Event Listeners**
The system listens to all OwnershipToken events using HTTP polling:

```javascript
// listeners/domaEvents.js
const events = await web3.eth.getPastLogs({
  address: OWNERSHIP_TOKEN_ADDRESS,
  fromBlock: lastProcessedBlock + 1,
  toBlock: currentBlockNumber,
  topics: [] // Get all events
});
```

#### **Tracked Events**
Based on the actual implementation, the system tracks these events:

- **OwnershipTokenMinted** - New domain creation
- **NameTokenRenewed** - Domain renewals  
- **NameTokenBurned** - Domain deletion
- **LockStatusChanged** - Lock/unlock events
- **Transfer** - Domain transfers
- **NameTokenLocked** - Domain locked
- **NameTokenUnlocked** - Domain unlocked
- **RegistrarChanged** - Registrar updates
- **MetadataUpdated** - Metadata changes
- **DomainExpired** - Domain expiration (simulated)

### **Event Processing System**

#### **Polling Mechanism**
```javascript
// Poll every 10 seconds
const startEventPolling = () => {
  pollingInterval = setInterval(async () => {
    const currentBlock = await web3.eth.getBlockNumber();
    // Process events from lastProcessedBlock + 1 to currentBlock
  }, 10000);
};
```

#### **Event Handling**
```javascript
// Parse events using ethers.js Interface
const parsed = iface.parseLog(log);
const eventName = parsed.name;
const args = parsed.args;

// Convert BigInt values to strings for safe serialization
const safeArgs = convertBigIntsToStrings(args);
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Telegram Bot Token
- Doma Network RPC URL

### **Installation**

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

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development servers**
```bash
# Start the main bot and API server
npm run dev

# In another terminal, start the mini-app
cd mini-app && npm run dev
```

### **Production Deployment**

1. **Build the mini-app**
```bash
cd mini-app && npm run build
```

2. **Start the production server**
```bash
npm start
```

## 📊 **API Endpoints**

### **Health & System**
- `GET /health` - Health check
- `GET /system/info` - System information
- `GET /docs` - API documentation

### **Events**
- `GET /api/events` - Get all events with pagination
- `GET /api/events/:type` - Get events by type
- `GET /api/events/recent` - Get recent events
- `GET /api/events/stats` - Get event statistics

### **Subscriptions**
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/subscribe` - Subscribe user
- `POST /api/subscription/unsubscribe` - Unsubscribe user
- `PUT /api/subscription/settings` - Update user settings
- `GET /api/subscription/settings` - Get user settings
- `GET /api/subscription/subscribers` - Get all subscribers (admin)

## 🔧 **Development**

### **Code Structure**
```
doma-bot/
├── api/                    # API server
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── routes/           # API routes
│   └── utils/            # API utilities
├── commands/             # Bot commands
│   ├── admin/           # Admin commands
│   └── handlers/        # Command handlers
├── config/              # Configuration files
├── listeners/           # Blockchain event listeners
├── mini-app/           # React mini-app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   ├── store/       # Redux store
│   │   └── utils/       # Utilities
│   └── public/          # Static assets
└── utils/               # Shared utilities
```

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run start` - Start production server
- `npm run build` - Build mini-app for production
- `npm run clean` - Clean build artifacts


### **Code Quality & Performance**
- **Console Log Management** - Debug logs only in development mode
- **Error Handling** - Enhanced error handling with fallback mechanisms
- **Caching System** - 5-second cache for subscription status to reduce API calls

### **User Experience**
- **Explorer Integration** - Robust blockchain explorer links with fallback URLs
- **Dynamic UI States** - Subscribe/Unsubscribe buttons change based on status
- **Real-time Updates** - 30-second refresh intervals for subscription status
- **Mobile Optimization** - Responsive design for all screen sizes

### **Data Management**
- **Separated Storage** - Split `db.json` into `events.json` and `users.json`
- **Data Type Consistency** - All IDs stored as strings for reliable comparisons
- **Automatic Cleanup** - Old events automatically removed after 10 days
- **Redux State Management** - Centralized state management for better performance



## 📄 **License**

This project is licensed under the MIT License 
---

**Built with ❤️ for the Doma blockchain community** 