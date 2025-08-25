// storage.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { broadcast } from "./broadcast.js"; // ✅ correct import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "db.json");

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
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
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
  }
}

export function removeSubscriber(chatId) {
  const db = loadDB();
  db.subscribers = db.subscribers.filter((id) => id !== chatId);
  saveDB(db);
}

export function saveEvent(event) {
  const db = loadDB();
  db.events.push({ ...event, timestamp: new Date().toISOString() });
  saveDB(db);

  // 🚀 Immediately broadcast to subscribers with the full event object
  broadcast(event);
}

export function getEvents() {
  const db = loadDB();
  return db.events;
}
