// api/index.js
import app from './server.js';
import { API_CONFIG } from './config/index.js';

const PORT = API_CONFIG.PORT;

// Start server
app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log("🚀 API Server Started");
  console.log("=".repeat(60));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${API_CONFIG.NODE_ENV}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log("=".repeat(60));
  console.log("📡 Available endpoints:");
  console.log("   Events:");
  console.log("     GET  /api/events");
  console.log("     GET  /api/events/:eventType");
  console.log("     GET  /api/events/stats");
  console.log("     GET  /api/events/recent");
  console.log("   Subscription:");
  console.log("     GET  /api/subscription/status");
  console.log("     POST /api/subscription/subscribe");
  console.log("     POST /api/subscription/unsubscribe");
  console.log("     PUT  /api/subscription/settings");
  console.log("   System:");
  console.log("     GET  /health");
  console.log("     POST /cleanup");
  console.log("     GET  /system/info");
  console.log("     GET  /docs");
  console.log("=".repeat(60));
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`🛑 Received ${signal}. Shutting down API server...`);
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Export the app for external use
export default app; 