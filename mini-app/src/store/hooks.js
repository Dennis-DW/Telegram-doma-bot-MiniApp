import { useDispatch, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Typed hooks for each slice
export const useSubscription = () => {
  return useSelector((state) => state.subscription);
};

export const useEvents = () => {
  return useSelector((state) => state.events);
};

export const useUI = () => {
  return useSelector((state) => state.ui);
};

// Specific selectors
export const useSubscriptionStatus = () => {
  return useSelector((state) => state.subscription.subscriptionStatus);
};

export const useSubscriptionSettings = () => {
  return useSelector((state) => state.subscription.settings);
};

export const useSubscriptionLoading = () => {
  return useSelector((state) => state.subscription.loading);
};

export const useEventsList = () => {
  return useSelector((state) => state.events.events);
};

export const useFilteredEvents = () => {
  return useSelector((state) => state.events.filteredEvents);
};

export const useEventStats = () => {
  return useSelector((state) => state.events.stats);
};

export const useEventsLoading = () => {
  return useSelector((state) => state.events.loading);
};

export const useApiStatus = () => {
  return useSelector((state) => state.ui.apiStatus);
};

export const useGlobalLoading = () => {
  return useSelector((state) => state.ui.loadingStates.global);
};

export const useNotifications = () => {
  return useSelector((state) => state.ui.notifications);
};

export const useMessages = () => {
  return useSelector((state) => state.ui.messages);
}; 