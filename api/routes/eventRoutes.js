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



export default router; 