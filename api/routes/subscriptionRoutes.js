// api/routes/subscriptionRoutes.js
import express from 'express';
import { validateSubscriptionSettings } from '../middleware/validation.js';
import {
  getSubscriptionStatus,
  subscribeUser,
  unsubscribeUser,
  updateSubscriptionSettings,
  getUserSettings,
  getAllSubscribers
} from '../controllers/subscriptionController.js';

const router = express.Router();

// Get subscription status
router.get('/status', getSubscriptionStatus);

// Subscribe user
router.post('/subscribe', subscribeUser);

// Unsubscribe user
router.post('/unsubscribe', unsubscribeUser);

// Update subscription settings
router.put('/settings', validateSubscriptionSettings, updateSubscriptionSettings);

// Get user settings
router.get('/settings', getUserSettings);

// Get all subscribers (admin only)
router.get('/subscribers', getAllSubscribers);

export default router; 