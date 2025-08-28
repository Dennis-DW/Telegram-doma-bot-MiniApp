# Doma Event Tracker Mini App

## Overview
The Doma Event Tracker Mini App is a React-based Telegram Mini App that provides real-time monitoring and management of Doma blockchain events. It's fully integrated with the bot's API for seamless event tracking and notification management.

## Features

### 🔄 **Real-time Event Monitoring**
- Live event streaming from the blockchain
- Real-time updates without page refresh
- Event aggregation and batching
- Automatic reconnection handling

### 📊 **Comprehensive Event Management**
- View all blockchain events with filtering
- Event type categorization (minting, transfers, renewals, etc.)
- Pagination support for large event lists
- Event statistics and analytics

### 🔔 **Subscription Management**
- Subscribe/unsubscribe to notifications
- Customizable notification settings
- Event type preferences
- Frequency controls

### 🛠️ **System Monitoring**
- API health checks
- System status monitoring
- Performance metrics
- Error handling and recovery

## Architecture

### Frontend Structure
```
mini-app/src/
├── components/          # React components
│   ├── sections/       # Main page sections
│   └── ui/            # Reusable UI components
├── hooks/              # Custom React hooks
│   ├── useEvents.js    # Event management
│   ├── useSubscription.js # Subscription handling
│   └── useSystem.js    # System monitoring
├── services/           # API services
│   └── api.js         # Main API service
├── config/            # Configuration
│   └── index.js       # App configuration
└── utils/             # Utility functions
    └── telegram.js    # Telegram integration
```

### API Integration
The mini app connects to the bot's API through:

1. **REST API Endpoints**
   - Event retrieval and filtering
   - Subscription management
   - System monitoring
   - Health checks

2. **Server-Sent Events (SSE)**
   - Real-time event streaming
   - Live updates
   - Connection management

3. **Telegram Integration**
   - User authentication
   - Bot communication
   - Mini App features

## API Endpoints

### Events
- `GET /api/events` - Get all events with pagination
- `GET /api/events/:eventType` - Get events by type
- `GET /api/events/stats` - Get event statistics
- `GET /api/events/recent` - Get recent events
- `GET /api/events/stream` - Real-time event stream

### Subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/subscribe` - Subscribe to notifications
- `POST /api/subscription/unsubscribe` - Unsubscribe from notifications
- `PUT /api/subscription/settings` - Update notification settings

### System
- `GET /health` - Health check
- `GET /system/info` - System information
- `GET /docs` - API documentation

## Configuration

### Environment Variables
```bash
# API Configuration
VITE_REACT_APP_URL=http://localhost:3001
VITE_REALTIME_ENABLED=true

# External URLs
VITE_EXPLORER_BASE_URL=https://explorer.doma.ai
VITE_FRONTEND_BASE_URL=https://doma.ai

# UI Configuration
VITE_THEME=light
VITE_LANGUAGE=en
VITE_ANIMATIONS=true
```

### App Configuration
All configuration is centralized in `src/config/index.js`:

```javascript
export const APP_CONFIG = {
  API: {
    BASE_URL: 'http://localhost:3001',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },
  REALTIME: {
    ENABLED: true,
    RECONNECT_ATTEMPTS: 5,
    KEEPALIVE_INTERVAL: 30000,
  },
  // ... more configuration
};
```

## Usage

### Starting the Mini App
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Using the Hooks

#### Event Management
```javascript
import { useEvents } from './hooks/useEvents';

function EventList() {
  const { 
    events, 
    loading, 
    error, 
    stats,
    refreshEvents,
    loadNextPage 
  } = useEvents('minting', 20, true); // Enable real-time

  // Component logic
}
```

#### Subscription Management
```javascript
import { useSubscription } from './hooks/useSubscription';

function SubscriptionPanel() {
  const {
    isSubscribed,
    subscribe,
    unsubscribe,
    updateSettings
  } = useSubscription();

  // Component logic
}
```

#### System Monitoring
```javascript
import { useSystem } from './hooks/useSystem';

function SystemStatus() {
  const {
    isHealthy,
    uptime,
    memoryUsage,
    checkHealth
  } = useSystem();

  // Component logic
}
```

## Real-time Features

### Event Streaming
The mini app supports real-time event streaming through Server-Sent Events:

```javascript
// Start real-time updates
const { startRealtimeUpdates } = useEvents(null, 50, true);

// Handle real-time events
const handleRealtimeEvent = (eventData) => {
  console.log('New event:', eventData);
  // Update UI with new event
};
```

### Connection Management
- Automatic reconnection on connection loss
- Exponential backoff for retry attempts
- Connection status indicators
- Graceful error handling

## Error Handling

### API Errors
- Network error detection
- Retry mechanisms
- Fallback to mock data
- User-friendly error messages

### Real-time Errors
- Connection loss handling
- Automatic reconnection
- Error logging and reporting
- Graceful degradation

## Performance Optimization

### Caching
- Event data caching
- Configuration caching
- API response caching
- Cache invalidation strategies

### Pagination
- Efficient data loading
- Infinite scroll support
- Page size optimization
- Memory management

### Real-time Optimization
- Event batching
- Connection pooling
- Message queuing
- Resource cleanup

## Security Features

### Authentication
- Telegram user authentication
- Session management
- Access control
- Secure API communication

### Data Protection
- Input validation
- XSS prevention
- CSRF protection
- Secure headers

## Development

### Adding New Features
1. Create new hooks for functionality
2. Add API endpoints to the service
3. Update configuration as needed
4. Add UI components
5. Update documentation

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### Building
```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Analyze bundle
npm run build:analyze
```

## Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Set production environment variables
2. Configure API endpoints
3. Set up CDN for static assets
4. Configure SSL certificates

### Monitoring
- Performance monitoring
- Error tracking
- Usage analytics
- Health checks

## Troubleshooting

### Common Issues

#### API Connection Issues
- Check API server status
- Verify environment variables
- Check network connectivity
- Review CORS configuration

#### Real-time Issues
- Check SSE endpoint availability
- Verify connection limits
- Review reconnection logic
- Check browser compatibility

#### Performance Issues
- Monitor bundle size
- Check API response times
- Review caching strategies
- Optimize event handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation
- Review the troubleshooting guide 