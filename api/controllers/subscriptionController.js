// api/controllers/subscriptionController.js
import { getSubscribers, addSubscriber, removeSubscriber } from '../../utils/storage.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtils.js';
import { API_CONFIG } from '../config/index.js';

// Get subscription status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const subscribers = getSubscribers();
    const { telegramId } = req.query;
    
    // Check if the specific user is subscribed
    const isSubscribed = telegramId ? subscribers.includes(telegramId) : false;
    
    const subscriptionStatus = {
      subscribed: isSubscribed,
      totalSubscribers: subscribers.length,
      lastUpdated: new Date().toISOString()
    };
    
    sendSuccessResponse(res, subscriptionStatus, 'Subscription status retrieved successfully');
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
    
    addSubscriber(telegramId);
    
    sendSuccessResponse(res, { telegramId }, API_CONFIG.MESSAGES.SUCCESS.SUBSCRIBED, 201);
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
    
    removeSubscriber(telegramId);
    
    sendSuccessResponse(res, { telegramId }, API_CONFIG.MESSAGES.SUCCESS.UNSUBSCRIBED);
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.UNSUBSCRIBE, 500, error);
  }
};

// Update subscription settings
export const updateSubscriptionSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    // This would typically save the user's notification preferences
    // For now, we'll just return success
    const updatedSettings = {
      ...settings,
      updatedAt: new Date().toISOString()
    };
    
    sendSuccessResponse(res, updatedSettings, API_CONFIG.MESSAGES.SUCCESS.SETTINGS_UPDATED);
  } catch (error) {
    console.error('Error updating subscription settings:', error);
    sendErrorResponse(res, API_CONFIG.MESSAGES.ERROR.UPDATE_SETTINGS, 500, error);
  }
};

// Get all subscribers (admin only)
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = getSubscribers();
    
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
  getAllSubscribers
}; 