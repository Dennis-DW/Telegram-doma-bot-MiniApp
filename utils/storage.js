// storage.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import eventAggregator from "./eventAggregator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "db.json");

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

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    return { 
      subscribers: [], 
      events: [], 
      userSettings: {},
      lastCleanup: null
    };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (e) {
    console.error("⚠️ DB corrupted, resetting...", e);
    return { 
      subscribers: [], 
      events: [], 
      userSettings: {},
      lastCleanup: null
    };
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, customStringify(data));
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
  const db = loadDB();
  return db.subscribers;
}

export function addSubscriber(chatId) {
  const db = loadDB();
  if (!db.subscribers.includes(chatId)) {
    db.subscribers.push(chatId);
    
    // Initialize userSettings if it doesn't exist
    if (!db.userSettings) {
      db.userSettings = {};
    }
    
    // Initialize default settings for new subscriber
    if (!db.userSettings[chatId]) {
      db.userSettings[chatId] = {
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
    
    saveDB(db);
    console.log(`✅ Added subscriber: ${chatId}`);
  }
}

export function removeSubscriber(chatId) {
  const db = loadDB();
  db.subscribers = db.subscribers.filter((id) => id !== chatId);
  
  // Remove user settings
  if (db.userSettings && db.userSettings[chatId]) {
    delete db.userSettings[chatId];
  }
  
  saveDB(db);
  console.log(`❌ Removed subscriber: ${chatId}`);
}

export function getUserSettings(chatId) {
  const db = loadDB();
  return db.userSettings && db.userSettings[chatId] ? db.userSettings[chatId] : null;
}

export function updateUserSettings(chatId, settings) {
  const db = loadDB();
  
  // Initialize userSettings if it doesn't exist
  if (!db.userSettings) {
    db.userSettings = {};
  }
  
  if (!db.userSettings[chatId]) {
    db.userSettings[chatId] = {
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
  
  db.userSettings[chatId] = {
    ...db.userSettings[chatId],
    ...settings,
    updatedAt: new Date().toISOString()
  };
  
  saveDB(db);
  console.log(`✅ Updated settings for user: ${chatId}`);
  return db.userSettings[chatId];
}

export function saveEvent(event) {
  const db = loadDB();
  
  // Add timestamp if not present
  if (!event.timestamp) {
    event.timestamp = new Date().toISOString();
  }
  
  // Add event to database
  db.events.push(event);
  
  // Clean up old events periodically
  const now = new Date();
  const lastCleanup = db.lastCleanup ? new Date(db.lastCleanup) : null;
  
  if (!lastCleanup || (now - lastCleanup) > (24 * 60 * 60 * 1000)) { // Cleanup once per day
    db.events = cleanupOldEvents(db.events);
  db.events = limitEvents(db.events);
    db.lastCleanup = now.toISOString();
    console.log(`🧹 Daily cleanup completed. Events: ${db.events.length}`);
  }
  
  // Save to database
  saveDB(db);
  
  console.log(`💾 Event saved to database: ${event.type}`);
  console.log(`📊 Total events in DB: ${db.events.length}`);
  console.log(`👥 Total subscribers: ${db.subscribers.length}`);

  // 🚀 Add event to aggregator for professional broadcasting
  eventAggregator.addEvent(event);
}

export function getEvents() {
  const db = loadDB();
  return db.events;
}

export function getEventsByType(eventType, limit = 50, page = 1) {
  const db = loadDB();
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
  const db = loadDB();
  return db.events.slice(-limit).reverse();
}

// Clean up events manually (can be called periodically)
export function cleanupEvents() {
  const db = loadDB();
  const originalCount = db.events.length;
  
  db.events = cleanupOldEvents(db.events);
  db.events = limitEvents(db.events);
  
  const removedCount = originalCount - db.events.length;
  if (removedCount > 0) {
    db.lastCleanup = new Date().toISOString();
    saveDB(db);
    console.log(`🧹 Cleaned up ${removedCount} old events`);
  }
  
  return removedCount;
}

// Get event statistics with improved calculations
export function getEventStats() {
  const db = loadDB();
  const events = db.events;
  const subscribers = db.subscribers;
  
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
  const db = loadDB();
  const isSubscribed = db.subscribers.includes(telegramId);
  const userSettings = db.userSettings && db.userSettings[telegramId] ? db.userSettings[telegramId] : null;
  
  return {
    subscribed: isSubscribed,
    totalSubscribers: db.subscribers.length,
    userSettings: userSettings,
    lastUpdated: new Date().toISOString()
  };
}
