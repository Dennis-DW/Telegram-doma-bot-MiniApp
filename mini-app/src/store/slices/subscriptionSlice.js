import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import telegramApp from '../../utils/telegram';

// Async thunks
export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const telegramId = telegramApp.getUser()?.id;
      if (!telegramId) {
        throw new Error('Telegram user ID not available');
      }
      
      const data = await apiService.getSubscriptionStatus(telegramId);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const subscribeUser = createAsyncThunk(
  'subscription/subscribe',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const telegramId = telegramApp.getUser()?.id;
      if (!telegramId) {
        throw new Error('Telegram user ID not available');
      }
      
      const result = await apiService.subscribe(telegramId);
      
      // Send notification to bot
      telegramApp.sendData({
        action: 'mini_app_subscribed',
        telegramId: telegramId,
        source: 'mini_app',
        timestamp: new Date().toISOString()
      });
      
      // Refresh status after subscription
      dispatch(fetchSubscriptionStatus());
      
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unsubscribeUser = createAsyncThunk(
  'subscription/unsubscribe',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const telegramId = telegramApp.getUser()?.id;
      if (!telegramId) {
        throw new Error('Telegram user ID not available');
      }
      
      const result = await apiService.unsubscribe(telegramId);
      
      // Send notification to bot
      telegramApp.sendData({
        action: 'mini_app_unsubscribed',
        telegramId: telegramId,
        source: 'mini_app',
        timestamp: new Date().toISOString()
      });
      
      // Refresh status after unsubscription
      dispatch(fetchSubscriptionStatus());
      
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'subscription/updateSettings',
  async (settings, { rejectWithValue, dispatch }) => {
    try {
      const telegramId = telegramApp.getUser()?.id;
      if (!telegramId) {
        throw new Error('Telegram user ID not available');
      }
      
      const result = await apiService.updateNotificationSettings(telegramId, settings);
      
      // Send notification to bot
      telegramApp.sendData({
        action: 'mini_app_settings_updated',
        telegramId: telegramId,
        settings: settings,
        source: 'mini_app',
        timestamp: new Date().toISOString()
      });
      
      // Refresh status after settings update
      dispatch(fetchSubscriptionStatus());
      
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  subscriptionStatus: null,
  settings: {
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
  },
  loading: false,
  error: null,
  lastUpdated: null
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLocalSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    toggleEventType: (state, action) => {
      const { eventType } = action.payload;
      state.settings.eventTypes[eventType] = !state.settings.eventTypes[eventType];
    },
    toggleNotifications: (state) => {
      state.settings.notifications = !state.settings.notifications;
    },
    setFrequency: (state, action) => {
      state.settings.frequency = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscription status
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionStatus = action.payload;
        if (action.payload?.userSettings) {
          state.settings = { ...state.settings, ...action.payload.userSettings };
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Subscribe user
      .addCase(subscribeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(subscribeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Unsubscribe user
      .addCase(unsubscribeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unsubscribeUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(unsubscribeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update settings
      .addCase(updateUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  updateLocalSettings,
  toggleEventType,
  toggleNotifications,
  setFrequency
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer; 