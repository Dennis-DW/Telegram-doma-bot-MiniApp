import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ limit = 50, page = 1 }, { rejectWithValue }) => {
    try {
      const data = await apiService.getEvents(limit, page);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventsByType = createAsyncThunk(
  'events/fetchEventsByType',
  async ({ eventType, limit = 50, page = 1 }, { rejectWithValue }) => {
    try {
      const data = await apiService.getEventsByType(eventType, limit, page);
      return { ...data, eventType };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecentEvents = createAsyncThunk(
  'events/fetchRecentEvents',
  async ({ limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await apiService.getRecentEvents(limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventStats = createAsyncThunk(
  'events/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getEventStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  events: [],
  filteredEvents: [],
  stats: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    limit: 50
  },
  filters: {
    eventType: null,
    dateRange: null,
    searchQuery: ''
  },
  lastUpdated: null
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setEventTypeFilter: (state, action) => {
      state.filters.eventType = action.payload;
    },
    setDateRangeFilter: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        eventType: null,
        dateRange: null,
        searchQuery: ''
      };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    addEvent: (state, action) => {
      state.events.unshift(action.payload);
      if (state.events.length > 1000) {
        state.events = state.events.slice(0, 1000);
      }
    },
    updateEvent: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.events.findIndex(event => event.id === id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...updates };
      }
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events || action.payload;
        state.pagination = {
          currentPage: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          totalEvents: action.payload.total || action.payload.events?.length || 0,
          limit: action.payload.limit || 50
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch events by type
      .addCase(fetchEventsByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsByType.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredEvents = action.payload.events || [];
        state.pagination = {
          currentPage: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          totalEvents: action.payload.total || 0,
          limit: action.payload.limit || 50
        };
        state.filters.eventType = action.payload.eventType;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchEventsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch recent events
      .addCase(fetchRecentEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events || action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRecentEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch stats
      .addCase(fetchEventStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchEventStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  setEventTypeFilter,
  setDateRangeFilter,
  setSearchQuery,
  clearFilters,
  setCurrentPage,
  addEvent,
  updateEvent,
  removeEvent
} = eventsSlice.actions;

export default eventsSlice.reducer; 