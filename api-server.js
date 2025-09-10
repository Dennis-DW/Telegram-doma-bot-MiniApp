// api-server.js
// This file now serves as a simple entry point to the modular API
// The actual implementation is in the api/ folder

import database from './utils/database.js';

// Initialize database connection for API server
(async () => {
  try {
    console.log("🔗 Connecting to MongoDB for API server...");
    await database.connect();
    console.log("✅ API server database connection established");
  } catch (error) {
    console.error("❌ Failed to connect to database for API server:", error);
    process.exit(1);
  }
})();

import './api/index.js';

console.log("📝 Note: API server is now modularized in the api/ folder");
console.log("🔧 The main API logic has been moved to api/server.js");
console.log("🚀 Starting API server from api/index.js...");
