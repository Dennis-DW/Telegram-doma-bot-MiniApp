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
const MAX_EVENTS = 100; // Maximum number of events to keep

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
    return { subscribers: [], events: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (e) {
    console.error("⚠️ DB corrupted, resetting...", e);
    return { subscribers: [], events: [] };
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
    saveDB(db);
    console.log(`✅ Added subscriber: ${chatId}`);
  }
}

export function removeSubscriber(chatId) {
  const db = loadDB();
  db.subscribers = db.subscribers.filter((id) => id !== chatId);
  saveDB(db);
  console.log(`❌ Removed subscriber: ${chatId}`);
}

export function saveEvent(event) {
  const db = loadDB();
  
  // Add timestamp if not present
  if (!event.timestamp) {
    event.timestamp = new Date().toISOString();
  }
  
  // Add event to database
  db.events.push(event);
  
  // Clean up old events
  db.events = cleanupOldEvents(db.events);
  
  // Limit number of events
  db.events = limitEvents(db.events);
  
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

// Clean up events manually (can be called periodically)
export function cleanupEvents() {
  const db = loadDB();
  const originalCount = db.events.length;
  
  db.events = cleanupOldEvents(db.events);
  db.events = limitEvents(db.events);
  
  const removedCount = originalCount - db.events.length;
  if (removedCount > 0) {
    saveDB(db);
    console.log(`🧹 Cleaned up ${removedCount} old events`);
  }
  
  return removedCount;
}

// Get event statistics
export function getEventStats() {
  const db = loadDB();
  const events = db.events;
  const subscribers = db.subscribers;
  
  const eventTypes = {};
  events.forEach(event => {
    eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
  });
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventsToday = events.filter(event => 
    new Date(event.timestamp) >= today
  ).length;
  
  return {
    totalEvents: events.length,
    eventsToday: eventsToday,
    activeSubscribers: subscribers.length,
    networkStatus: 'Active',
    eventTypes: eventTypes
  };
}
