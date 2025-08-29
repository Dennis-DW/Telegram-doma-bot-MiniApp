// mini-app/src/hooks/useEvents.js
import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/api';
import telegramApp from '../utils/telegram';

export const useEvents = (eventType = null, limit = 50, enableRealtime = false) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    hasNext: false,
    hasPrev: false,
    total: 0
  });

  const eventSourceRef = useRef(null);

  // Get Telegram user ID
  const getTelegramId = useCallback(() => {
    const user = telegramApp.getUser();
    return user?.id || null;
  }, []);

  // Fetch user settings
  const fetchUserSettings = useCallback(async () => {
    try {
      const telegramId = getTelegramId();
      if (!telegramId) {
        console.log('No Telegram ID available, using default settings');
        return;
      }

      const data = await apiService.getUserSettings(telegramId);
      const settings = data.data || data;
      setUserSettings(settings);
      console.log('User settings loaded:', settings);
    } catch (err) {
      console.error('Failed to fetch user settings:', err);
      // Use default settings if fetch fails
      setUserSettings({
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
    }
  }, [getTelegramId]);

  // Filter events based on user settings
  const filterEventsBySettings = useCallback((eventsToFilter, settings) => {
    if (!settings || !settings.eventTypes) {
      console.log('No user settings available, showing all events');
      return eventsToFilter;
    }

    const eventTypeMapping = {
      'OwnershipTokenMinted': 'minting',
      'Transfer': 'transfers',
      'NameTokenRenewed': 'renewals',
      'NameTokenBurned': 'burning',
      'LockStatusChanged': 'locks',
      'RegistrarChanged': 'registrar',
      'MetadataUpdated': 'metadata',
      'DomainLocked': 'locked',
      'DomainUnlocked': 'unlocked',
      'DomainExpired': 'expired'
    };

    const filtered = eventsToFilter.filter(event => {
      const mappedType = eventTypeMapping[event.type];
      if (!mappedType) {
        console.log(`Unknown event type: ${event.type}, showing by default`);
        return true; // Show unknown event types by default
      }
      
      const isEnabled = settings.eventTypes[mappedType];
      if (!isEnabled) {
        console.log(`Filtering out event type: ${event.type} (${mappedType})`);
      }
      return isEnabled;
    });

    console.log(`Filtered ${eventsToFilter.length} events to ${filtered.length} based on user settings`);
    return filtered;
  }, []);

  const fetchEvents = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (eventType) {
        data = await apiService.getEventsByType(eventType, limit, page);
      } else {
        data = await apiService.getEvents(limit, page);
      }
      
      // Format events using the API service
      const eventsArray = data.data?.events || data.events || data || [];
      const formattedEvents = eventsArray.map(event => 
        apiService.formatEvent(event)
      );
      
      setEvents(formattedEvents);
      
      // Apply user settings filter
      if (userSettings) {
        const filtered = filterEventsBySettings(formattedEvents, userSettings);
        setFilteredEvents(filtered);
      } else {
        setFilteredEvents(formattedEvents);
      }
      
      // Update pagination if available
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err.message);
      setEvents([]); // Set empty array instead of mock data
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  }, [eventType, limit, userSettings, filterEventsBySettings]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiService.getEventStats();
      setStats(data.data || data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStats(null); // Set null instead of mock stats
    }
  }, []);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const data = await apiService.getSubscriptionStatus();
      setSubscriptionStatus(data.data || data);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
      setSubscriptionStatus({ subscribed: false, totalSubscribers: 0 });
    }
  }, []);

  const refreshEvents = useCallback(() => {
    fetchEvents(pagination.page);
  }, [fetchEvents, pagination.page]);

  const loadNextPage = useCallback(() => {
    if (pagination.hasNext) {
      const nextPage = pagination.page + 1;
      fetchEvents(nextPage);
    }
  }, [fetchEvents, pagination]);

  const loadPrevPage = useCallback(() => {
    if (pagination.hasPrev) {
      const prevPage = pagination.page - 1;
      fetchEvents(prevPage);
    }
  }, [fetchEvents, pagination]);

  // Real-time event handling
  const handleRealtimeEvent = useCallback((eventData) => {
    const formattedEvent = apiService.formatEvent(eventData);
    setEvents(prevEvents => [formattedEvent, ...prevEvents.slice(0, limit - 1)]);
    
    // Apply filter to new event
    if (userSettings) {
      const shouldShow = filterEventsBySettings([formattedEvent], userSettings).length > 0;
      if (shouldShow) {
        setFilteredEvents(prevFiltered => [formattedEvent, ...prevFiltered.slice(0, limit - 1)]);
      }
    } else {
      setFilteredEvents(prevFiltered => [formattedEvent, ...prevFiltered.slice(0, limit - 1)]);
    }
    
    // Update stats if it's a new event
    if (stats) {
      setStats(prevStats => ({
        ...prevStats,
        totalEvents: prevStats.totalEvents + 1,
        eventsToday: prevStats.eventsToday + 1,
        eventTypes: {
          ...prevStats.eventTypes,
          [eventData.type]: (prevStats.eventTypes[eventData.type] || 0) + 1
        }
      }));
    }
  }, [limit, stats, userSettings, filterEventsBySettings]);

  const handleRealtimeError = useCallback((error) => {
    console.error('Real-time connection error:', error);
    setIsConnected(false);
  }, []);

  const handleRealtimeConnect = useCallback(() => {
    console.log('Real-time connection established');
    setIsConnected(true);
  }, []);

  // Start real-time event stream
  const startRealtimeUpdates = useCallback(() => {
    if (enableRealtime && !eventSourceRef.current) {
      apiService.startEventStream(
        handleRealtimeEvent,
        handleRealtimeError,
        handleRealtimeConnect
      );
      eventSourceRef.current = true;
    }
  }, [enableRealtime, handleRealtimeEvent, handleRealtimeError, handleRealtimeConnect]);

  // Stop real-time event stream
  const stopRealtimeUpdates = useCallback(() => {
    if (eventSourceRef.current) {
      apiService.stopEventStream();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Subscribe to notifications
  const subscribe = useCallback(async (telegramId = null) => {
    try {
      const result = await apiService.subscribe(telegramId);
      await fetchSubscriptionStatus();
      return result;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      throw error;
    }
  }, [fetchSubscriptionStatus]);

  // Unsubscribe from notifications
  const unsubscribe = useCallback(async (telegramId = null) => {
    try {
      const result = await apiService.unsubscribe(telegramId);
      await fetchSubscriptionStatus();
      return result;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      throw error;
    }
  }, [fetchSubscriptionStatus]);

  // Update notification settings
  const updateSettings = useCallback(async (settings) => {
    try {
      const result = await apiService.updateNotificationSettings(settings);
      // Refresh user settings after update
      await fetchUserSettings();
      return result;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }, [fetchUserSettings]);

  // Refresh user settings and re-filter events
  const refreshUserSettings = useCallback(async () => {
    await fetchUserSettings();
  }, [fetchUserSettings]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  useEffect(() => {
    fetchEvents();
    fetchStats();
    fetchSubscriptionStatus();
  }, [fetchEvents, fetchStats, fetchSubscriptionStatus]);

  // Re-filter events when user settings change
  useEffect(() => {
    if (userSettings && events.length > 0) {
      const filtered = filterEventsBySettings(events, userSettings);
      setFilteredEvents(filtered);
    }
  }, [userSettings, events, filterEventsBySettings]);

  useEffect(() => {
    if (enableRealtime) {
      startRealtimeUpdates();
    }

    return () => {
      if (enableRealtime) {
        stopRealtimeUpdates();
      }
    };
  }, [enableRealtime, startRealtimeUpdates, stopRealtimeUpdates]);

  return {
    events: filteredEvents, // Return filtered events instead of all events
    allEvents: events, // Keep access to all events if needed
    loading,
    error,
    stats,
    subscriptionStatus,
    userSettings,
    isConnected,
    pagination,
    refreshEvents,
    loadNextPage,
    loadPrevPage,
    subscribe,
    unsubscribe,
    updateSettings,
    refreshUserSettings,
    startRealtimeUpdates,
    stopRealtimeUpdates
  };
}; 