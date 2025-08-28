// api/server.js
import express from 'express';
import corsMiddleware from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { API_CONFIG } from './config/index.js';

// Import routes
import eventRoutes from './routes/eventRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import systemRoutes from './routes/systemRoutes.js';

// Import cleanup scheduler
import { cleanupEvents } from '../utils/storage.js';

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/', systemRoutes); // System routes at root level

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Periodic cleanup every 6 hours
setInterval(() => {
  try {
    const removedCount = cleanupEvents();
    if (removedCount > 0) {
      console.log(`🧹 Periodic cleanup: Removed ${removedCount} old events`);
    }
  } catch (error) {
    console.error('Error during periodic cleanup:', error);
  }
}, API_CONFIG.CLEANUP_INTERVAL_MS);

export default app; 