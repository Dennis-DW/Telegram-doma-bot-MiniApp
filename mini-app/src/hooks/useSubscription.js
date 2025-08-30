// mini-app/src/hooks/useSubscription.js
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import telegramApp from '../utils/telegram';

export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    eventTypes: {
      minting: true,
      transfers: true,
      renewals: true,
      burning: true,
      locks: true,
      registrar: true,
      metadata: true,
      locked: true,
      unlocked: true,
      expired: true
    },
    frequency: 'realtime'
  });

  const getTelegramId = useCallback(() => {
    const user = telegramApp.getUser();
    return user?.id || null;
  }, []);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setLoading(true);
      const telegramId = getTelegramId();
      
      if (!telegramId) {
        throw new Error('Telegram user ID not available');
      }
      
      const data = await apiService.getSubscriptionStatus(telegramId);
      const statusData = data.data || data;
      setSubscriptionStatus(statusData);
      
      // Load user settings if available
      if (statusData?.userSettings) {
        const newSettings = {
          ...settings,
          ...statusData.userSettings
        };
        setSettings(newSettings);
        
        // Check for bot actions and show notifications
        if (statusData.userSettings.lastBotAction && statusData.userSettings.source === 'bot') {
          const action = statusData.userSettings.lastBotAction;
          const actionTime = statusData.userSettings.lastBotActionTime;
          
          // Show notification based on bot action
          if (action === 'subscribed') {
            telegramApp.showAlert('✅ You have been subscribed via the bot! Your subscription is now synchronized.');
          } else if (action === 'unsubscribed') {
            telegramApp.showAlert('🚫 You have been unsubscribed via the bot! Your unsubscription is now synchronized.');
          }
          
          // Clear the bot action flag
          await apiService.updateNotificationSettings(telegramId, {
            ...newSettings,
            lastBotAction: null,
            lastBotActionTime: null,
            source: null
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
      setError(err.message);
      setSubscriptionStatus({ subscribed: false, totalSubscribers: 0 });
    } finally {
      setLoading(false);
    }
  }, [getTelegramId, settings]);

  const subscribe = useCallback(async () => {
    try {
      setLoading(true);
      const telegramId = getTelegramId();
      
      if (!telegramId) {
        throw new Error('Telegram user ID not available');
      }
      
      const result = await apiService.subscribe(telegramId);
      await fetchSubscriptionStatus();
      
      // Send notification to bot about subscription from mini-app
      telegramApp.sendData({
        action: 'mini_app_subscribed',
        telegramId: telegramId,
        source: 'mini_app',
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getTelegramId, fetchSubscriptionStatus]);

  const unsubscribe = useCallback(async () => {
    try {
      setLoading(true);
      const telegramId = getTelegramId();
      
      if (!telegramId) {
        throw new Error('Telegram user ID not available');
      }
      
      const result = await apiService.unsubscribe(telegramId);
      await fetchSubscriptionStatus();
      
      // Send notification to bot about unsubscription from mini-app
      telegramApp.sendData({
        action: 'mini_app_unsubscribed',
        telegramId: telegramId,
        source: 'mini_app',
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getTelegramId, fetchSubscriptionStatus]);

  const updateSettings = useCallback(async (newSettings) => {
    try {
      setLoading(true);
      const telegramId = getTelegramId();
      
      if (!telegramId) {
        throw new Error('Telegram user ID not available');
      }
      
      const updatedSettings = { ...settings, ...newSettings };
      const result = await apiService.updateNotificationSettings(telegramId, updatedSettings);
      
      // Update local state
      setSettings(updatedSettings);
      
      // Refresh subscription status
      await fetchSubscriptionStatus();
      
      // Send notification to bot about settings update from mini-app
      telegramApp.sendData({
        action: 'mini_app_settings_updated',
        telegramId: telegramId,
        settings: updatedSettings,
        source: 'mini_app',
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      console.error('Failed to update settings:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [settings, getTelegramId, fetchSubscriptionStatus]);

  const toggleEventType = useCallback(async (eventType) => {
    try {
      const newSettings = {
        ...settings,
      eventTypes: {
          ...settings.eventTypes,
          [eventType]: !settings.eventTypes[eventType]
      }
      };
      
      await updateSettings(newSettings);
    } catch (error) {
      console.error('Failed to toggle event type:', error);
      setError(error.message);
    }
  }, [settings, updateSettings]);

  const toggleNotifications = useCallback(async () => {
    try {
      const newSettings = {
        ...settings,
        notifications: !settings.notifications
      };
      
      await updateSettings(newSettings);
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
      setError(error.message);
    }
  }, [settings, updateSettings]);

  const setFrequency = useCallback(async (frequency) => {
    try {
      const newSettings = {
        ...settings,
      frequency
      };
      
      await updateSettings(newSettings);
    } catch (error) {
      console.error('Failed to set frequency:', error);
      setError(error.message);
    }
  }, [settings, updateSettings]);

  useEffect(() => {
    fetchSubscriptionStatus();
    
    // Set up periodic check for bot actions (every 30 seconds)
    const interval = setInterval(() => {
      fetchSubscriptionStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchSubscriptionStatus]);

  return {
    subscriptionStatus,
    loading,
    error,
    settings,
    subscribe,
    unsubscribe,
    updateSettings,
    toggleEventType,
    toggleNotifications,
    setFrequency,
    refresh: fetchSubscriptionStatus
  };
}; 