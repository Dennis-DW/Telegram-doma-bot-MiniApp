# API Server Documentation

## Overview
The API server has been refactored into a modular structure for better maintainability and scalability.

## Folder Structure

```
api/
├── config/
│   └── index.js              # API configuration and constants
├── controllers/
│   ├── eventController.js    # Event-related API logic
│   ├── subscriptionController.js # Subscription management
│   └── systemController.js   # System endpoints (health, cleanup, etc.)
├── middleware/
│   ├── cors.js              # CORS configuration
│   ├── errorHandler.js      # Error handling middleware
│   └── validation.js        # Request validation middleware
├── routes/
│   ├── eventRoutes.js       # Event API routes
│   ├── subscriptionRoutes.js # Subscription API routes
│   └── systemRoutes.js      # System API routes
├── utils/
│   ├── eventUtils.js        # Event processing utilities
│   └── responseUtils.js     # Response formatting utilities
├── server.js                # Main Express app setup
├── index.js                 # Server entry point
└── README.md               # This file
```

## Key Features

### 🔧 **Modular Architecture**
- **Controllers**: Handle business logic
- **Routes**: Define API endpoints
- **Middleware**: Request processing and validation
- **Utils**: Reusable utility functions
- **Config**: Centralized configuration

### 🛡️ **Enhanced Security & Validation**
- Input validation for all endpoints
- Proper error handling with detailed messages
- CORS configuration
- Rate limiting support

### 📊 **Better Response Formatting**
- Consistent response structure
- Proper HTTP status codes
- Error details in development mode
- Timestamp inclusion

### 🔄 **Improved Event Handling**
- Event type mapping
- Pagination support
- Flexible filtering
- Proper data formatting

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:eventType` - Get events by type
- `GET /api/events/stats` - Get event statistics
- `GET /api/events/recent` - Get recent events

### Subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/subscribe` - Subscribe to notifications
- `POST /api/subscription/unsubscribe` - Unsubscribe from notifications
- `PUT /api/subscription/settings` - Update subscription settings

### System
- `GET /health` - Health check
- `POST /cleanup` - Manual cleanup
- `GET /system/info` - System information
- `GET /docs` - API documentation

## Configuration

All configuration is centralized in `config/index.js`:

```javascript
export const API_CONFIG = {
  PORT: process.env.API_PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEFAULT_EVENT_LIMIT: 50,
  MAX_EVENT_LIMIT: 100,
  // ... more config
};
```

## Usage

### Starting the API Server
```bash
# From project root
node api-server.js

# Or directly
node api/index.js
```

### Environment Variables
- `API_PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (default: development)
- `CORS_ORIGIN` - CORS origin (default: *)

## Benefits of Refactoring

1. **Maintainability**: Code is organized into logical modules
2. **Scalability**: Easy to add new features and endpoints
3. **Testability**: Each module can be tested independently
4. **Reusability**: Utilities and middleware can be reused
5. **Configuration**: Centralized configuration management
6. **Error Handling**: Consistent error handling across all endpoints
7. **Documentation**: Better code organization makes it self-documenting

## Adding New Features

1. **New Controller**: Add to `controllers/` folder
2. **New Routes**: Add to `routes/` folder
3. **New Middleware**: Add to `middleware/` folder
4. **New Utils**: Add to `utils/` folder
5. **Update Config**: Add configuration to `config/index.js`
6. **Register Routes**: Add routes to `server.js`

This modular structure makes the API server much more maintainable and professional. 