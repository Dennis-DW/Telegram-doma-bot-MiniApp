// api/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { API_CONFIG } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { corsOptions } from './middleware/cors.js';
import eventRoutes from './routes/eventRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import database from '../utils/database.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/system', systemRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const isDbConnected = database.isConnected;
    
    const health = {
      status: isDbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: isDbConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    };
    
    const statusCode = isDbConnected ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// Cleanup endpoint
app.post('/cleanup', async (req, res) => {
  try {
    const retentionDays = parseInt(req.body.retentionDays) || 10;
    const deletedCount = await database.cleanupOldEvents(retentionDays);
    
    res.json({ 
      success: true,
      deletedCount,
      retentionDays,
      message: `Cleaned up ${deletedCount} events older than ${retentionDays} days`
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Cleanup failed',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

export default app;
