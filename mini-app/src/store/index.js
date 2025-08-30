import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from './slices/subscriptionSlice';
import eventsReducer from './slices/eventsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    subscription: subscriptionReducer,
    events: eventsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
}); 