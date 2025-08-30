import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
  apiStatus: 'checking', // 'checking', 'connected', 'error'
  loadingStates: {
    global: false,
    events: false,
    subscription: false
  },
  modals: {
    settings: false,
    eventDetails: false,
    confirmation: false
  },
  messages: {
    success: null,
    error: null,
    info: null
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setApiStatus: (state, action) => {
      state.apiStatus = action.payload;
    },
    setLoadingState: (state, action) => {
      const { key, value } = action.payload;
      state.loadingStates[key] = value;
    },
    setGlobalLoading: (state, action) => {
      state.loadingStates.global = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      state.notifications.unshift(notification);
      
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    setMessage: (state, action) => {
      const { type, message } = action.payload;
      state.messages[type] = message;
    },
    clearMessage: (state, action) => {
      state.messages[action.payload] = null;
    },
    clearAllMessages: (state) => {
      state.messages = {
        success: null,
        error: null,
        info: null
      };
    }
  }
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setApiStatus,
  setLoadingState,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setMessage,
  clearMessage,
  clearAllMessages
} = uiSlice.actions;

export default uiSlice.reducer; 