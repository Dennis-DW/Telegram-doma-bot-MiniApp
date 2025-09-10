// storage.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import eventAggregator from "./eventAggregator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EVENTS_DB_PATH = path.join(__dirname, "events.json");
const USERS_DB_PATH = path.join(__dirname, "users.json");

// Configuration for event cleanup
const EVENT_RETENTION_DAYS = 10; // Keep events for 10 days
const MAX_EVENTS = 1000; // Maximum number of events to keep

// Custom JSON serializer to handle BigInt
const customStringify = (obj) => {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }, 2);
};

function loadEventsDB() {
  if (!fs.existsSync(EVENTS_DB_PATH)) {
    return { events: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(EVENTS_DB_PATH, "utf-8"));
  } catch (e) {
    console.error("⚠️ Events DB corrupted, resetting...", e);
    return { events: [] };
  }
}

function saveEventsDB(data) {
  fs.writeFileSync(EVENTS_DB_PATH, customStringify(data));
}

function loadUsersDB() {
  if (!fs.existsSync(USERS_DB_PATH)) {
    return { 
      subscribers: [], 
      userSettings: {},
      lastCleanup: null
    };
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_DB_PATH, "utf-8"));
  } catch (e) {
    console.error("⚠️ Users DB corrupted, resetting...", e);
    return { 
      subscribers: [], 
      userSettings: {},
      lastCleanup: null
    };
  }
}

function saveUsersDB(data) {
  fs.writeFileSync(USERS_DB_PATH, customStringify(data));
}

// Clean up old events
function cleanupOldEvents(events) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - EVENT_RETENTION_DAYS);
  
  return events.filter(event => {
    const eventDate = new Date(event.timestamp);
    return eventDate > cutoffDate;
  });
}

// Limit the number of events
function limitEvents(events) {
  if (events.length > MAX_EVENTS) {
    return events.slice(-MAX_EVENTS);
  }
  return events;
}

export function getSubscribers() {
  const db = loadUsersDB();
  return db.subscribers;
}

export function addSubscriber(chatId) {
  const db = loadUsersDB();
  const chatIdStr = String(chatId);
  
  // Check if subscriber already exists (using string comparison)
  const exists = db.subscribers.some(sub => String(sub) === chatIdStr);
  
  if (!exists) {
    db.subscribers.push(chatIdStr);
    
    // Initialize userSettings if it doesn't exist
    if (!db.userSettings) {
      db.userSettings = {};
    }
    
    // Initialize default settings for new subscriber
    if (!db.userSettings[chatIdStr]) {
      db.userSettings[chatIdStr] = {
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
        frequency: 'realtime',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    saveUsersDB(db);
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Added subscriber: ${chatIdStr}`);
    }
  }
}

export function removeSubscriber(chatId) {
  const db = loadUsersDB();
  const chatIdStr = String(chatId);
  
  // Remove subscriber using string comparison
  db.subscribers = db.subscribers.filter((id) => String(id) !== chatIdStr);
  
  // Remove user settings
  if (db.userSettings && db.userSettings[chatIdStr]) {
    delete db.userSettings[chatIdStr];
  }
  
  saveUsersDB(db);
  if (process.env.NODE_ENV === 'development') {
    console.log(`❌ Removed subscriber: ${chatIdStr}`);
  }
}

export function getUserSettings(chatId) {
  const db = loadUsersDB();
  const chatIdStr = String(chatId);
  return db.userSettings && db.userSettings[chatIdStr] ? db.userSettings[chatIdStr] : null;
}

export function updateUserSettings(chatId, settings) {
  const db = loadUsersDB();
  const chatIdStr = String(chatId);
  
  // Initialize userSettings if it doesn't exist
  if (!db.userSettings) {
    db.userSettings = {};
  }
  
  if (!db.userSettings[chatIdStr]) {
    db.userSettings[chatIdStr] = {
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
      frequency: 'realtime',
      createdAt: new Date().toISOString()
    };
  }
  
  db.userSettings[chatIdStr] = {
    ...db.userSettings[chatIdStr],
    ...settings,
    updatedAt: new Date().toISOString()
  };
  
  saveUsersDB(db);
  console.log(`✅ Updated settings for user: ${chatIdStr}`);
  return db.userSettings[chatIdStr];
}

export function saveEvent(event) {
  const eventsDB = loadEventsDB();
  const usersDB = loadUsersDB();
  
  // Add timestamp if not present
  if (!event.timestamp) {
    event.timestamp = new Date().toISOString();
  }
  
  // Add event to database
  eventsDB.events.push(event);
  
  // Clean up old events periodically
  const now = new Date();
  const lastCleanup = usersDB.lastCleanup ? new Date(usersDB.lastCleanup) : null;
  
  if (!lastCleanup || (now - lastCleanup) > (24 * 60 * 60 * 1000)) { // Cleanup once per day
    eventsDB.events = cleanupOldEvents(eventsDB.events);
    eventsDB.events = limitEvents(eventsDB.events);
    usersDB.lastCleanup = now.toISOString();
    console.log(`🧹 Daily cleanup completed. Events: ${eventsDB.events.length}`);
  }
  
  // Save to database
  saveEventsDB(eventsDB);
  saveUsersDB(usersDB);
  
  console.log(`💾 Event saved to database: ${event.type}`);
  console.log(`📊 Total events in DB: ${eventsDB.events.length}`);
  console.log(`👥 Total subscribers: ${usersDB.subscribers.length}`);

  // 🚀 Add event to aggregator for professional broadcasting
  eventAggregator.addEvent(event);
}

export function getEvents() {
  const db = loadEventsDB();
  return db.events;
}

export function getEventsByType(eventType, limit = 50, page = 1) {
  const db = loadEventsDB();
  const events = db.events.filter(event => event.type === eventType);
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    events: events.slice(startIndex, endIndex),
    total: events.length,
    page,
    limit,
    totalPages: Math.ceil(events.length / limit)
  };
}

export function getRecentEvents(limit = 10) {
  const db = loadEventsDB();
  return db.events.slice(-limit).reverse();
}

// Clean up events manually (can be called periodically)
export function cleanupEvents() {
  const eventsDB = loadEventsDB();
  const usersDB = loadUsersDB();
  const originalCount = eventsDB.events.length;
  
  eventsDB.events = cleanupOldEvents(eventsDB.events);
  eventsDB.events = limitEvents(eventsDB.events);
  
  const removedCount = originalCount - eventsDB.events.length;
  if (removedCount > 0) {
    usersDB.lastCleanup = new Date().toISOString();
    saveEventsDB(eventsDB);
    saveUsersDB(usersDB);
    console.log(`🧹 Cleaned up ${removedCount} old events`);
  }
  
  return removedCount;
}

// Get event statistics with improved calculations
export function getEventStats() {
  const eventsDB = loadEventsDB();
  const usersDB = loadUsersDB();
  const events = eventsDB.events;
  const subscribers = usersDB.subscribers;
  
  // Calculate today's events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventsToday = events.filter(event => 
    new Date(event.timestamp) >= today
  );
  
  // Calculate event types breakdown
  const eventTypes = {};
  const todayEventTypes = {};
  
  events.forEach(event => {
    eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
  });
  
  eventsToday.forEach(event => {
    todayEventTypes[event.type] = (todayEventTypes[event.type] || 0) + 1;
  });
  
  // Calculate weekly events
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const eventsThisWeek = events.filter(event => 
    new Date(event.timestamp) >= weekAgo
  ).length;
  
  // Calculate monthly events
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const eventsThisMonth = events.filter(event => 
    new Date(event.timestamp) >= monthAgo
  ).length;
  
  return {
    totalEvents: events.length,
    eventsToday: eventsToday.length,
    eventsThisWeek: eventsThisWeek,
    eventsThisMonth: eventsThisMonth,
    activeSubscribers: subscribers.length,
    networkStatus: 'Active',
    eventTypes: eventTypes,
    todayEventTypes: todayEventTypes,
    lastUpdated: new Date().toISOString()
  };
}

// Get subscription status for a specific user
export function getSubscriptionStatus(telegramId) {
  const db = loadUsersDB();
  // Convert telegramId to string for comparison since it might come as number or string
  const telegramIdStr = String(telegramId);
  const isSubscribed = db.subscribers.some(sub => String(sub) === telegramIdStr);
  const userSettings = db.userSettings && db.userSettings[telegramIdStr] ? db.userSettings[telegramIdStr] : null;
  
  return {
    subscribed: isSubscribed,
    totalSubscribers: db.subscribers.length,
    userSettings: userSettings,
    lastUpdated: new Date().toISOString()
  };
}
