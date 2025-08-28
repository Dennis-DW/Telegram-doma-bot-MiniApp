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
      metadata: true
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
      const data = await apiService.getSubscriptionStatus(telegramId);
      setSubscriptionStatus(data.data || data);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
      setError(err.message);
      setSubscriptionStatus({ subscribed: false, totalSubscribers: 0 });
    } finally {
      setLoading(false);
    }
  }, [getTelegramId]);

  const subscribe = useCallback(async () => {
    try {
      setLoading(true);
      const telegramId = getTelegramId();
      
      if (!telegramId) {
        throw new Error('Telegram user ID not available');
      }
      
      const result = await apiService.subscribe(telegramId);
      await fetchSubscriptionStatus();
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
      const result = await apiService.updateNotificationSettings(updatedSettings);
      setSettings(updatedSettings);
      return result;
    } catch (error) {
      console.error('Failed to update settings:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [settings, getTelegramId]);

  const toggleEventType = useCallback((eventType) => {
    setSettings(prev => ({
      ...prev,
      eventTypes: {
        ...prev.eventTypes,
        [eventType]: !prev.eventTypes[eventType]
      }
    }));
  }, []);

  const toggleNotifications = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      notifications: !prev.notifications
    }));
  }, []);

  const setFrequency = useCallback((frequency) => {
    setSettings(prev => ({
      ...prev,
      frequency
    }));
  }, []);

  useEffect(() => {
    fetchSubscriptionStatus();
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