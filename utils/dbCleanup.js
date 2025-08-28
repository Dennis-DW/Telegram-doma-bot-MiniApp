// utils/dbCleanup.js
import { cleanupEvents, getEventStats } from "./storage.js";

class DatabaseCleanup {
  constructor() {
    this.cleanupInterval = 60 * 60 * 1000; // 1 hour in milliseconds
    this.isRunning = false;
    this.lastCleanupTime = 0;
    
    // Start the cleanup scheduler
    this.start();
  }

  start() {
    console.log("🧹 Starting Database Cleanup Scheduler...");
    console.log(`⏰ Cleanup interval: ${this.cleanupInterval / (60 * 60 * 1000)} hour(s)`);
    
    // Run cleanup every hour
    setInterval(() => {
      this.performCleanup();
    }, this.cleanupInterval);

    // Also run cleanup on startup
    setTimeout(() => {
      this.performCleanup();
    }, 5000); // Wait 5 seconds after startup
  }

  async performCleanup() {
    if (this.isRunning) {
      console.log("🧹 Cleanup already in progress, skipping...");
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    console.log("=".repeat(60));
    console.log("🧹 STARTING DATABASE CLEANUP");
    console.log("=".repeat(60));

    try {
      // Get stats before cleanup
      const statsBefore = getEventStats();
      console.log(`📊 Before cleanup:`);
      console.log(`   📦 Total events: ${statsBefore.totalEvents}`);
      console.log(`   📅 Events today: ${statsBefore.eventsToday}`);
      console.log(`   👥 Active subscribers: ${statsBefore.activeSubscribers}`);

      // Perform cleanup
      const removedCount = cleanupEvents();

      // Get stats after cleanup
      const statsAfter = getEventStats();
      
      const duration = Date.now() - startTime;

      console.log("=".repeat(60));
      console.log("🧹 CLEANUP COMPLETED");
      console.log("=".repeat(60));
      console.log(`📊 After cleanup:`);
      console.log(`   📦 Total events: ${statsAfter.totalEvents}`);
      console.log(`   📅 Events today: ${statsAfter.eventsToday}`);
      console.log(`   🗑️ Events removed: ${removedCount}`);
      console.log(`   ⏱️ Duration: ${duration}ms`);
      console.log("=".repeat(60));

      this.lastCleanupTime = Date.now();

      // Log cleanup summary
      if (removedCount > 0) {
        console.log(`✅ Successfully cleaned up ${removedCount} old events`);
      } else {
        console.log(`ℹ️ No old events to clean up`);
      }

    } catch (error) {
      console.error("❌ Error during database cleanup:", error);
    } finally {
      this.isRunning = false;
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastCleanupTime: this.lastCleanupTime,
      nextCleanupTime: this.lastCleanupTime + this.cleanupInterval,
      cleanupInterval: this.cleanupInterval
    };
  }

  // Force immediate cleanup
  async forceCleanup() {
    console.log("🔄 Forcing immediate database cleanup...");
    await this.performCleanup();
  }

  // Change cleanup interval
  setCleanupInterval(hours) {
    this.cleanupInterval = hours * 60 * 60 * 1000;
    console.log(`⏰ Cleanup interval changed to ${hours} hour(s)`);
  }
}

// Create singleton instance
const dbCleanup = new DatabaseCleanup();

export default dbCleanup;
export { DatabaseCleanup }; 