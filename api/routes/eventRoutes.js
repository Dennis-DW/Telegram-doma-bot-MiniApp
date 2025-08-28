// api/routes/eventRoutes.js
import express from 'express';
import { validateLimit, validateEventType } from '../middleware/validation.js';
import {
  getAllEvents,
  getEventsByType,
  getRecentEvents,
  getEventStats
} from '../controllers/eventController.js';

const router = express.Router();

// Get all events
router.get('/', validateLimit, getAllEvents);

// Get recent events
router.get('/recent', validateLimit, getRecentEvents);

// Get event statistics
router.get('/stats', getEventStats);

// Get events by type
router.get('/:eventType', validateLimit, validateEventType, getEventsByType);

// Event streaming endpoint for real-time updates
router.get('/stream', (req, res) => {
  // Set headers for Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({
    type: 'connection',
    message: 'Event stream connected',
    timestamp: new Date().toISOString()
  })}\n\n`);

  // Store the response object for later use
  if (!req.app.locals.eventStreams) {
    req.app.locals.eventStreams = [];
  }
  req.app.locals.eventStreams.push(res);

  // Handle client disconnect
  req.on('close', () => {
    const index = req.app.locals.eventStreams.indexOf(res);
    if (index > -1) {
      req.app.locals.eventStreams.splice(index, 1);
    }
  });

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({
      type: 'keepalive',
      timestamp: new Date().toISOString()
    })}\n\n`);
  }, 30000); // Send keepalive every 30 seconds

  req.on('close', () => {
    clearInterval(keepAlive);
  });
});

export default router; 