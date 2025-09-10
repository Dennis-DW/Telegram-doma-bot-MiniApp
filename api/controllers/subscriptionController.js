// api/controllers/subscriptionController.js
import database from '../../utils/database.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtils.js';
import { API_CONFIG } from '../config/index.js';

// Cache for subscription status to reduce API calls
const statusCache = new Map();
const CACHE_DURATION = 5000; // 5 seconds

// Get subscription status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const { telegramId } = req.query;
    
    if (telegramId) {
      // Check cache first
      const cacheKey = `status_${telegramId}`;
      const cached = statusCache.get(cacheKey);
      
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return sendSuccessResponse(res, cached.data, 'Subscription status retrieved from cache');
      }
      
      // Get status for specific user
      const status = await database.getSubscriptionStatus(telegramId);
      
      // Cache the result
      statusCache.set(cacheKey, {
        data: status,
        timestamp: Date.now()
      });
      
      sendSuccessResponse(res, status, 'Subscription status retrieved successfully');
    } else {
      // Get general status
      const totalSubscribers = await database.getSubscribersCount();
      const status = {
        subscribed: false,
        totalSubscribers,
        lastUpdated: new Date().toISOString()
      };
      sendSuccessResponse(res, status, 'Subscription status retrieved successfully');
    }
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.FETCH_SUBSCRIPTION, 500, error);
  }
};

// Subscribe user
export const subscribeUser = async (req, res) => {
  try {
    const { telegramId } = req.body;
    
    if (!telegramId) {
      return sendErrorResponse(res, 'Telegram ID is required', 400);
    }
    
    await database.addSubscriber(telegramId);
    
    // Clear cache for this user
    const cacheKey = `status_${telegramId}`;
    statusCache.delete(cacheKey);
    
    // Get updated status
    const status = await database.getSubscriptionStatus(telegramId);
    
    sendSuccessResponse(res, status, API_CONFIG.MESSAGES.SUCCESS.SUBSCRIBED, 201);
  } catch (error) {
    console.error('Error subscribing user:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.SUBSCRIBE, 500, error);
  }
};

// Unsubscribe user
export const unsubscribeUser = async (req, res) => {
  try {
    const { telegramId } = req.body;
    
    if (!telegramId) {
      return sendErrorResponse(res, 'Telegram ID is required', 400);
    }
    
    await database.removeSubscriber(telegramId);
    
    // Clear cache for this user
    const cacheKey = `status_${telegramId}`;
    statusCache.delete(cacheKey);
    
    // Get updated status
    const status = await database.getSubscriptionStatus(telegramId);
    
    sendSuccessResponse(res, status, API_CONFIG.MESSAGES.SUCCESS.UNSUBSCRIBED);
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.UNSUBSCRIBE, 500, error);
  }
};

// Update subscription settings
export const updateSubscriptionSettings = async (req, res) => {
  try {
    const { telegramId, settings } = req.body;
    
    if (!telegramId) {
      return sendErrorResponse(res, 'Telegram ID is required', 400);
    }
    
    if (!settings) {
      return sendErrorResponse(res, 'Settings are required', 400);
    }
    
    // Update user settings
    await database.updateUserSettings(telegramId, settings);
    
    // Clear cache for this user
    const cacheKey = `status_${telegramId}`;
    statusCache.delete(cacheKey);
    
    // Get updated status
    const status = await database.getSubscriptionStatus(telegramId);
    
    sendSuccessResponse(res, status, API_CONFIG.MESSAGES.SUCCESS.SETTINGS_UPDATED);
  } catch (error) {
    console.error('Error updating subscription settings:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.UPDATE_SETTINGS, 500, error);
  }
};

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const { telegramId } = req.query;
    
    if (!telegramId) {
      return sendErrorResponse(res, 'Telegram ID is required', 400);
    }
    
    const settings = await database.getUserSettings(telegramId);
    
    if (!settings) {
      return sendErrorResponse(res, 'User settings not found', 404);
    }
    
    sendSuccessResponse(res, settings, 'User settings retrieved successfully');
  } catch (error) {
    console.error('Error fetching user settings:', error);
    sendErrorResponse(res, 'Failed to fetch user settings', 500, error);
  }
};

// Get all subscribers (admin only)
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await database.getSubscribers();
    
    sendSuccessResponse(res, { 
      subscribers,
      count: subscribers.length 
    }, 'Subscribers retrieved successfully');
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    sendErrorResponse(res, 'Failed to fetch subscribers', 500, error);
  }
};

export default {
  getSubscriptionStatus,
  subscribeUser,
  unsubscribeUser,
  updateSubscriptionSettings,
  getUserSettings,
  getAllSubscribers
};
