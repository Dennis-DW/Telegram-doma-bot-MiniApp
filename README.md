# 🚀 Doma Event Tracker - Complete Blockchain Event Monitoring System

A comprehensive **Telegram bot + Mini-App** system for real-time monitoring and notification of Doma blockchain events. This project provides a complete solution for tracking domain events, managing user subscriptions, and delivering beautiful, aggregated notifications.

## 🎯 **Project Overview**

This is a **full-stack blockchain monitoring system** consisting of:

1. **🤖 Telegram Bot** - Real-time event processing and notification delivery
2. **📱 Mini-App** - Mobile-responsive web interface for user management
3. **🔗 API Server** - RESTful backend for mini-app communication
4. **📊 Event Aggregator** - Intelligent event batching and formatting
5. **💾 Storage System** - Persistent data management with automatic cleanup

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
                       │   API Server    │    │   Event         │
                       │   (RESTful)     │◄───│   Aggregator    │
                       └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Storage       │    │   Notification  │
                       │   (JSON DB)     │    │   System        │
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

### **Mini-App Features**
- **Mobile responsive design** - Optimized for all screen sizes
- **Real-time subscription management** - Subscribe/unsubscribe directly
- **Settings persistence** - User preferences saved and applied immediately
- **Event dashboard** - Visual overview of all event types and statistics
- **Telegram integration** - Seamless communication with the bot

## 🔗 **Doma Network Testnet Implementation**

### **Network Configuration**
The project is configured to work with the Doma blockchain testnet using HTTP polling for event listening.

#### **Environment Variables**
```env
# Doma Network Configuration
DOMA_RPC_URL=https://testnet-rpc.doma.network
OWNERSHIP_TOKEN_ADDRESS=0x1234567890123456789012345678901234567890
```

#### **Web3 Configuration**
```javascript
// config/web3.js
import Web3 from "web3";

const domaRpcUrl = process.env.DOMA_RPC_URL;
export const web3 = new Web3(new Web3.providers.HttpProvider(domaRpcUrl));
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

#### **Domain Expiration Tracking**
```javascript
// Track domain expiration times
const domainExpirations = new Map();

// Check expiration every minute
const startExpirationChecker = () => {
  expirationChecker = setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    // Check for expired domains and create DomainExpired events
  }, 60000);
};
```

### **Event Data Structure**

#### **Event Object Format**
```javascript
const eventData = {
  type: eventName,
  args: safeArgs,
  txHash: log.transactionHash,
  blockNumber: log.blockNumber,
  logIndex: log.logIndex,
  timestamp: new Date().toISOString(),
  message: formattedMessage
};
```

#### **Event-Specific Handling**
```javascript
// Example: OwnershipTokenMinted
case "OwnershipTokenMinted":
  // args: [tokenId, registrarIanaId, to, sld, tld, expiresAt, correlationId]
  const tokenId = safeArgs[0];
  const to = safeArgs[2];
  const sld = safeArgs[3];
  const tld = safeArgs[4];
  const expiresAt = safeArgs[5];
  
  eventData.message = `✨ Domain Minted!\nToken ID: ${tokenId}\nOwner: ${to}\nSLD: ${sld}.${tld}\nExpires: ${new Date(Number(expiresAt) * 1000).toLocaleString()}`;
  break;
```

### **Connection Management**

#### **Startup Process**
```javascript
export const startDomaListeners = async () => {
  // 1. Check connection status
  const isConnected = await web3.eth.net.isListening();
  
  // 2. Get current block number
  const blockNumber = await web3.eth.getBlockNumber();
  
  // 3. Initialize last processed block
  lastProcessedBlock = Number(blockNumber) - 1;
  
  // 4. Start polling and expiration checker
  startEventPolling();
  startExpirationChecker();
};
```

#### **Cleanup Process**
```javascript
export const stopDomaListeners = async () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    clearInterval(expirationChecker);
    pollingInterval = null;
    expirationChecker = null;
  }
};
```

### **Error Handling**

#### **BigInt Serialization**
```javascript
// Custom JSON serializer to handle BigInt
const customStringify = (obj) => {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }, 2);
};
```

#### **Event Logging**
```javascript
// Enhanced console logging with formatting
console.log("=".repeat(60));
console.log(`📢 BLOCKCHAIN EVENT DETECTED: ${eventName.toUpperCase()}`);
console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
console.log(`🔗 Transaction Hash: ${log.transactionHash}`);
console.log(`📦 Block Number: ${log.blockNumber}`);
console.log("=".repeat(60));
```

### **Testnet Features**

#### **Implemented Features**
- **HTTP Polling**: 10-second intervals for event detection
- **Block Tracking**: Prevents duplicate event processing
- **Expiration Monitoring**: Automatic domain expiration detection
- **Event Parsing**: Uses ethers.js for reliable event parsing
- **BigInt Handling**: Safe serialization of blockchain data
- **Comprehensive Logging**: Detailed event information

#### **Event Broadcasting**
```javascript
// Save event (automatically broadcasts to subscribers)
saveEvent(eventData);
```

### **Configuration**

#### **Environment Setup**
```bash
# Required environment variables
DOMA_RPC_URL=https://testnet-rpc.doma.network
OWNERSHIP_TOKEN_ADDRESS=0x1234567890123456789012345678901234567890
```

#### **Polling Configuration**
- **Event Polling**: Every 10 seconds
- **Expiration Check**: Every 60 seconds
- **Block Range**: From last processed block to current block
- **Error Handling**: Graceful degradation on connection issues

This implementation provides a robust, production-ready system for monitoring Doma blockchain events on testnet with comprehensive error handling and detailed logging.

## 🔗 **API Structure**

### **Base URL**
```
http://localhost:3001/api
```

### **Endpoints**

#### **Subscription Management**
```
GET    /subscription/status
POST   /subscription/subscribe
POST   /subscription/unsubscribe
```

#### **User Settings**
```
GET    /settings
PUT    /settings
POST   /settings/clear-bot-action
```

#### **Events**
```
GET    /events
GET    /events/stats
GET    /events/filtered
```

#### **Admin (Protected)**
```
GET    /admin/subscribers
POST   /admin/broadcast
GET    /admin/stats
```

### **API Response Format**
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Error Response Format**
```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📁 **Project Structure**

```
doma-bot/
├── 📁 commands/                 # Bot command handlers
│   ├── 📁 constants/           # Command constants and keyboards
│   ├── 📁 handlers/            # Command and callback handlers
│   ├── start.js               # Welcome command
│   ├── subscribe.js           # Subscription command
│   ├── unsubscribe.js         # Unsubscription command
│   ├── admin.js               # Admin commands
│   └── miniapp.js             # Mini-app integration
├── 📁 config/                  # Configuration files
│   └── bot.js                 # Bot configuration
├── 📁 listeners/               # Blockchain event listeners
│   └── domaEvents.js          # Doma contract events
├── 📁 utils/                   # Utility functions
│   ├── storage.js             # Database operations
│   ├── eventAggregator.js     # Event batching
│   ├── broadcast.js           # Message formatting
│   └── dbCleanup.js           # Database maintenance
├── 📁 api/                     # API server
│   ├── 📁 routes/             # API routes
│   ├── 📁 middleware/         # API middleware
│   └── server.js              # API server
├── 📁 mini-app/                # React mini-app
│   ├── 📁 src/
│   │   ├── 📁 components/     # React components
│   │   ├── 📁 hooks/          # Custom hooks
│   │   ├── 📁 services/       # API services
│   │   └── 📁 pages/          # App pages
│   └── package.json
├── 📁 abis/                    # Contract ABIs
├── index.js                   # Main bot entry point
├── api-server.js              # API server entry point
└── package.json
```

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Telegram Bot Token
- Web3 provider (for blockchain events)

### **1. Clone & Install**
```bash
git clone <repository-url>
cd doma-bot
npm install
cd mini-app && npm install && cd ..
```

### **2. Environment Configuration**
Create `.env` file in root directory:
```env
# Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
WEB3_PROVIDER_URL=your_web3_provider_url
CONTRACT_ADDRESS=your_contract_address

# API Configuration
API_PORT=3001
API_BASE_URL=http://localhost:3001

# URLs
EXPLORER_BASE_URL=https://explorer.example.com
MINI_APP_URL=https://your-mini-app-url.com

# Database
DB_PATH=./utils/db.json
```

### **3. Start Services**
```bash
# Start the bot (main service)
npm run dev

# Start the API server (in another terminal)
npm run dev:api

# Start the mini-app (in another terminal)
cd mini-app && npm run dev
```

## 🔧 **Technical Features**

### **Event Aggregation**
- **Batching System** - Groups events for efficient delivery
- **30-minute Intervals** - Sends aggregated notifications
- **Smart Filtering** - Respects user preferences
- **Duplicate Prevention** - Avoids sending same events multiple times

### **User Management**
- **Subscription Tracking** - Manages user subscriptions
- **Settings Persistence** - Saves user preferences
- **Cross-Platform Sync** - Bot and mini-app stay synchronized
- **Admin Controls** - Comprehensive admin management

### **Database System**
- **JSON-based Storage** - Simple, reliable data storage
- **Automatic Cleanup** - Removes old events automatically
- **Data Integrity** - Handles BigInt and complex data types
- **Backup System** - Automatic data backup

### **Error Handling**
- **Graceful Degradation** - Continues working on partial failures
- **Retry Mechanisms** - Automatic retry on failures
- **Logging System** - Comprehensive error logging
- **User Feedback** - Clear error messages to users

## 🔄 **Synchronization System**

The system maintains perfect synchronization between the bot and mini-app:

### **Bot → Mini-App Sync**
- Bot actions update user settings
- Mini-app polls for changes
- Automatic UI updates
- User notifications for conflicts

### **Mini-App → Bot Sync**
- Mini-app actions send data to bot
- Bot processes and confirms actions
- Real-time status updates
- Seamless user experience

### **Conflict Resolution**
- Timestamp-based resolution
- Source tracking (bot vs mini-app)
- User notifications for conflicts
- Automatic state reconciliation

## 📊 **Monitoring & Analytics**

### **System Statistics**
- Total subscribers count
- Event processing rates
- API response times
- Error rates and types

### **User Analytics**
- Subscription trends
- Event type preferences
- User engagement metrics
- Platform usage patterns

### **Performance Metrics**
- Database performance
- API response times
- Bot message delivery rates
- Mini-app load times

## 🔒 **Security Features**

### **API Security**
- Input validation
- Rate limiting
- Error message sanitization
- CORS configuration

### **Bot Security**
- Admin command protection
- User input validation
- Secure callback handling
- Message sanitization

### **Data Protection**
- Secure data storage
- Access control
- Data encryption
- Backup security

## 🚀 **Deployment**

### **Production Setup**
1. **Environment Variables** - Configure production settings
2. **Database Setup** - Ensure proper database configuration
3. **SSL Certificate** - Set up HTTPS for mini-app
4. **Domain Configuration** - Configure custom domains
5. **Monitoring** - Set up logging and monitoring

### **Scaling Considerations**
- **Load Balancing** - For high-traffic scenarios
- **Database Optimization** - For large datasets
- **Caching** - For improved performance
- **CDN** - For static assets

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Bot Not Responding** - Check token and network
2. **API Errors** - Verify environment variables
3. **Mini-App Issues** - Check API connectivity
4. **Event Notifications** - Verify contract events

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=true npm run dev
```

### **Log Files**
- Bot logs: Console output
- API logs: Console output
- Mini-app logs: Browser console


## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the Doma blockchain community** 