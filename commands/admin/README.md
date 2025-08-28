# Admin Commands Documentation

## Overview
The admin commands have been refactored into a modular structure for better maintainability and extensibility.

## Folder Structure

```
commands/admin/
├── config/
│   └── index.js              # Admin configuration and constants
├── handlers/
│   ├── commandHandler.js     # Main command orchestration
│   ├── statsHandler.js       # System statistics functionality
│   ├── cleanupHandler.js     # Database cleanup functionality
│   ├── aggregatorHandler.js  # Event aggregator management
│   └── subscriberHandler.js  # Subscriber management
├── utils/
│   ├── authUtils.js          # Authentication and authorization
│   └── formatUtils.js        # Message formatting utilities
├── index.js                  # Main entry point
└── README.md               # This file
```

## Key Features

### 🔧 **Modular Architecture**
- **Handlers**: Separate handlers for different admin functions
- **Utils**: Reusable utility functions for auth and formatting
- **Config**: Centralized configuration management
- **Clean separation**: Each module has a single responsibility

### 🛡️ **Enhanced Security**
- Centralized authentication logic
- Configuration validation on startup
- Proper access control for all admin functions
- Environment variable support for admin IDs

### 📊 **Better Organization**
- Logical grouping of related functionality
- Consistent error handling across all handlers
- Standardized message formatting
- Easy to extend with new admin features

### 🔄 **Improved Maintainability**
- Each handler can be modified independently
- Configuration changes don't require code changes
- Clear separation of concerns
- Easy to test individual components

## Admin Commands

### Main Commands
- `/admin` - Main admin panel with interactive menu
- `/stats` - Quick system statistics
- `/cleanup` - Force database cleanup
- `/queue` - Event aggregator settings

### Interactive Menu Options
- **📊 System Stats** - Comprehensive system statistics
- **🧹 Force Cleanup** - Manual database cleanup
- **📤 Clear Event Queue** - Clear pending events
- **⚙️ Aggregator Settings** - Event aggregator management
- **👥 Subscriber List** - View all subscribers
- **📋 Event History** - Event type statistics

## Configuration

### Environment Variables
```bash
# Single admin ID
ADMIN_CHAT_IDS=123456789

# Multiple admin IDs (comma-separated)
ADMIN_CHAT_IDS=123456789,987654321,555666777
```

### Configuration Options
All admin settings are centralized in `config/index.js`:

```javascript
export const ADMIN_CONFIG = {
  ADMIN_CHAT_IDS: ['987654321'], // Default admin ID
  COMMANDS: {
    ADMIN: '/admin',
    STATS: '/stats',
    CLEANUP: '/cleanup',
    QUEUE: '/queue'
  },
  // ... more configuration
};
```

## Usage

### Starting the Admin System
The admin system is automatically loaded when the bot starts:

```javascript
// In your main bot file
import './commands/admin.js';
```

### Adding New Admin Features

1. **New Handler**: Create a new file in `handlers/` folder
2. **New Utility**: Add utility functions to `utils/` folder
3. **Update Config**: Add configuration to `config/index.js`
4. **Register Command**: Add command handler to `commandHandler.js`
5. **Update Menu**: Add menu option to keyboard configuration

### Example: Adding a New Admin Command

```javascript
// 1. Create handler (handlers/newFeatureHandler.js)
export const handleNewFeature = async (bot, chatId) => {
  // Implementation
};

// 2. Add to command handler
import { handleNewFeature } from './newFeatureHandler.js';

// 3. Add to callback switch
case 'admin_new_feature':
  await handleNewFeature(bot, chatId);
  break;

// 4. Add to keyboard configuration
{ text: "🆕 New Feature", callback_data: "admin_new_feature" }
```

## Benefits of Refactoring

1. **Maintainability**: Code is organized into logical modules
2. **Scalability**: Easy to add new admin features
3. **Testability**: Each module can be tested independently
4. **Reusability**: Utilities can be reused across handlers
5. **Configuration**: Centralized configuration management
6. **Security**: Proper authentication and authorization
7. **Documentation**: Better code organization makes it self-documenting

## Security Features

- **Access Control**: Only configured admin IDs can use admin commands
- **Configuration Validation**: Admin config is validated on startup
- **Error Handling**: Proper error handling prevents information leakage
- **Environment Variables**: Admin IDs can be configured via environment variables

This modular structure makes the admin system much more maintainable and professional. 