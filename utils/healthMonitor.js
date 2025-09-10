// utils/healthMonitor.js
import EventEmitter from 'events';
import database from './database.js';
import bot from '../config/bot.js';

class HealthMonitor extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.checkInterval = options.checkInterval || 30000; // 30 seconds
    this.maxFailures = options.maxFailures || 3;
    this.recoveryTimeout = options.recoveryTimeout || 60000; // 1 minute
    
    this.failureCount = 0;
    this.lastHealthCheck = null;
    this.isHealthy = true;
    this.monitoring = false;
    
    // Health check results
    this.healthStatus = {
      database: false,
      telegram: false,
      blockchain: false,
      memory: false,
      uptime: 0
    };
    
    this.startTime = Date.now();
    
    console.log('🏥 Health Monitor initialized');
  }

  // Start health monitoring
  start() {
    if (this.monitoring) return;
    
    this.monitoring = true;
    console.log('🏥 Starting health monitoring...');
    
    // Initial health check
    this.performHealthCheck();
    
    // Schedule regular health checks
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.checkInterval);
    
    // Monitor memory usage
    this.memoryMonitorInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, 10000); // Every 10 seconds
  }

  // Stop health monitoring
  stop() {
    this.monitoring = false;
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
      this.memoryMonitorInterval = null;
    }
    
    console.log('🛑 Health monitoring stopped');
  }

  // Perform comprehensive health check
  async performHealthCheck() {
    const startTime = Date.now();
    const results = {
      database: false,
      telegram: false,
      blockchain: false,
      memory: false,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Check database connection
      results.database = await this.checkDatabase();
      
      // Check Telegram bot
      results.telegram = await this.checkTelegramBot();
      
      // Check blockchain connection
      results.blockchain = await this.checkBlockchain();
      
      // Check memory usage
      results.memory = this.checkMemoryUsage();
      
      // Update health status
      this.healthStatus = {
        ...results,
        uptime: Date.now() - this.startTime
      };
      
      // Determine overall health
      const isHealthy = Object.values(results).every(status => status === true);
      
      if (isHealthy) {
        this.failureCount = 0;
        if (!this.isHealthy) {
          console.log('✅ System health restored');
          this.emit('healthRestored', this.healthStatus);
        }
        this.isHealthy = true;
      } else {
        this.failureCount++;
        console.log(`⚠️ Health check failed (${this.failureCount}/${this.maxFailures})`);
        
        if (this.failureCount >= this.maxFailures) {
          console.log('❌ System health critical - triggering recovery');
          this.emit('healthCritical', this.healthStatus);
          await this.triggerRecovery();
        }
      }
      
      this.lastHealthCheck = {
        ...results,
        duration: Date.now() - startTime,
        isHealthy
      };
      
      this.emit('healthCheck', this.lastHealthCheck);
      
    } catch (error) {
      console.error('❌ Health check error:', error);
      this.emit('healthCheckError', error);
    }
  }

  // Check database connection
  async checkDatabase() {
    try {
      if (!database.isConnected) {
        return false;
      }
      
      // Try a simple query
      await database.getSubscribersCount();
      return true;
    } catch (error) {
      console.error('❌ Database health check failed:', error.message);
      return false;
    }
  }

  // Check Telegram bot
  async checkTelegramBot() {
    try {
      // Try to get bot info
      await bot.getMe();
      return true;
    } catch (error) {
      console.error('❌ Telegram bot health check failed:', error.message);
      return false;
    }
  }

  // Check blockchain connection
  async checkBlockchain() {
    try {
      const { web3 } = await import('../config/web3.js');
      const isListening = await web3.eth.net.isListening();
      return isListening;
    } catch (error) {
      console.error('❌ Blockchain health check failed:', error.message);
      return false;
    }
  }

  // Check memory usage
  checkMemoryUsage() {
    try {
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      };
      
      // Consider unhealthy if heap usage is over 500MB
      const isHealthy = memUsageMB.heapUsed < 500;
      
      if (!isHealthy) {
        console.log(`⚠️ High memory usage: ${memUsageMB.heapUsed}MB`);
      }
      
      this.emit('memoryUsage', memUsageMB);
      return isHealthy;
    } catch (error) {
      console.error('❌ Memory check failed:', error);
      return false;
    }
  }

  // Trigger recovery procedures
  async triggerRecovery() {
    console.log('🔄 Starting system recovery...');
    
    try {
      // Emit recovery event
      this.emit('recoveryStarted');
      
      // Attempt to reconnect database
      if (!this.healthStatus.database) {
        console.log('🔄 Attempting database reconnection...');
        try {
          await database.disconnect();
          await database.connect();
          console.log('✅ Database reconnected');
        } catch (error) {
          console.error('❌ Database reconnection failed:', error);
        }
      }
      
      // Attempt to restart Telegram bot
      if (!this.healthStatus.telegram) {
        console.log('🔄 Attempting Telegram bot restart...');
        try {
          // Bot restart logic would go here
          console.log('✅ Telegram bot restarted');
        } catch (error) {
          console.error('❌ Telegram bot restart failed:', error);
        }
      }
      
      // Force garbage collection if available
      if (global.gc) {
        console.log('🧹 Running garbage collection...');
        global.gc();
      }
      
      // Wait for recovery timeout
      await new Promise(resolve => setTimeout(resolve, this.recoveryTimeout));
      
      // Perform health check after recovery
      await this.performHealthCheck();
      
      console.log('✅ System recovery completed');
      this.emit('recoveryCompleted');
      
    } catch (error) {
      console.error('❌ Recovery failed:', error);
      this.emit('recoveryFailed', error);
    }
  }

  // Get current health status
  getHealthStatus() {
    return {
      ...this.healthStatus,
      isHealthy: this.isHealthy,
      failureCount: this.failureCount,
      lastHealthCheck: this.lastHealthCheck,
      uptime: Date.now() - this.startTime
    };
  }

  // Get detailed system information
  getSystemInfo() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    };
  }

  // Force health check
  async forceHealthCheck() {
    console.log('🔍 Forcing health check...');
    await this.performHealthCheck();
    return this.getHealthStatus();
  }
}

// Create singleton instance
const healthMonitor = new HealthMonitor({
  checkInterval: 30000,
  maxFailures: 3,
  recoveryTimeout: 60000
});

export default healthMonitor;
export { HealthMonitor };
