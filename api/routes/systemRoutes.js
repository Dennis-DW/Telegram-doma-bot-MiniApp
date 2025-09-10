// api/routes/systemRoutes.js
import express from 'express';
import {
  healthCheck,
  cleanupEvents,
  getSystemInfo,
  getApiDocs
} from '../controllers/systemController.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// Manual cleanup
router.post('/cleanup', cleanupEvents);

// System information
router.get('/system/info', getSystemInfo);

// API documentation
router.get('/docs', getApiDocs);

export default router;
