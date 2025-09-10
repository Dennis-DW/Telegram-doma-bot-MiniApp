// processManager.js
import requestQueue from './utils/requestQueue.js';
import healthMonitor from './utils/healthMonitor.js';
import { requestHandlers } from './commands/handlers/enhancedCommandHandler.js';

class ProcessManager {
  constructor() {
    this.isShuttingDown = false;
    this.startTime = Date.now();
    
    console.log('🚀 Process Manager initialized');
  }

  // Initialize the process manager
  async initialize() {
    try {
      console.log('🔧 Initializing Process Manager...');
      
      // Start health monitoring
      healthMonitor.start();
      
      // Set up request queue event listeners
      this.setupRequestQueueListeners();
      
      // Set up health monitor event listeners
      this.setupHealthMonitorListeners();
      
      // Set up process event listeners
      this.setupProcessListeners();
      
      console.log('✅ Process Manager initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Process Manager:', error);
      throw error;
    }
  }

  // Set up request queue event listeners
  setupRequestQueueListeners() {
    requestQueue.on('requestProcessing', (request) => {
      // Handle request processing
      this.handleRequestProcessing(request);
    });

    requestQueue.on('requestCompleted', (request) => {
      console.log(`✅ Request completed: ${request.type} from user ${request.userId} (${request.duration}ms)`);
    });

    requestQueue.on('requestError', (request, error) => {
      console.error(`❌ Request error: ${request.type} from user ${request.userId} - ${error.message}`);
    });

    requestQueue.on('requestTimeout', (request) => {
      console.log(`⏰ Request timeout: ${request.type} from user ${request.userId}`);
    });

    requestQueue.on('queueCleared', (count) => {
      console.log(`🧹 Queue cleared: ${count} requests removed`);
    });
  }

  // Set up health monitor event listeners
  setupHealthMonitorListeners() {
    healthMonitor.on('healthCheck', (status) => {
      if (!status.isHealthy) {
        console.log(`⚠️ Health check failed: ${JSON.stringify(status)}`);
      }
    });

    healthMonitor.on('healthCritical', (status) => {
      console.log(`❌ System health critical: ${JSON.stringify(status)}`);
    });

    healthMonitor.on('healthRestored', (status) => {
      console.log(`✅ System health restored: ${JSON.stringify(status)}`);
    });

    healthMonitor.on('recoveryStarted', () => {
      console.log('🔄 System recovery started');
    });

    healthMonitor.on('recoveryCompleted', () => {
      console.log('✅ System recovery completed');
    });

    healthMonitor.on('recoveryFailed', (error) => {
      console.error('❌ System recovery failed:', error);
    });

    healthMonitor.on('memoryUsage', (usage) => {
      if (usage.heapUsed > 400) {
        console.log(`⚠️ High memory usage: ${usage.heapUsed}MB`);
      }
    });
  }

  // Set up process event listeners
  setupProcessListeners() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      this.handleCriticalError(error);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      this.handleCriticalError(reason);
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      console.log('🛑 Received SIGINT. Shutting down gracefully...');
      this.gracefulShutdown('SIGINT');
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      console.log('🛑 Received SIGTERM. Shutting down gracefully...');
      this.gracefulShutdown('SIGTERM');
    });

    // Handle SIGHUP (restart signal)
    process.on('SIGHUP', () => {
      console.log('🔄 Received SIGHUP. Restarting...');
      this.restart();
    });
  }

  // Handle request processing
  async handleRequestProcessing(request) {
    try {
      const handler = requestHandlers[request.type];
      if (handler) {
        await handler(request.data);
        request.status = 'completed';
      } else {
        throw new Error(`No handler found for request type: ${request.type}`);
      }
    } catch (error) {
      request.status = 'error';
      request.error = error.message;
      throw error;
    }
  }

  // Handle critical errors
  handleCriticalError(error) {
    console.error('💥 Critical error detected:', error);
    
    // Log error details
    console.error('Stack trace:', error.stack);
    
    // Emit critical error event
    healthMonitor.emit('criticalError', error);
    
    // Attempt recovery
    setTimeout(() => {
      console.log('🔄 Attempting recovery from critical error...');
      healthMonitor.triggerRecovery();
    }, 5000);
  }

  // Graceful shutdown
  async gracefulShutdown(signal) {
    if (this.isShuttingDown) {
      console.log('⚠️ Shutdown already in progress...');
      return;
    }

    this.isShuttingDown = true;
    console.log(`🛑 Starting graceful shutdown (${signal})...`);

    try {
      // Stop health monitoring
      healthMonitor.stop();
      console.log('✅ Health monitoring stopped');

      // Stop request queue processing
      requestQueue.stopProcessing();
      console.log('✅ Request queue stopped');

      // Clear request queue
      requestQueue.clearQueue();
      console.log('✅ Request queue cleared');

      // Give some time for cleanup
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Graceful shutdown completed');
      process.exit(0);

    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  // Restart the process
  async restart() {
    console.log('🔄 Restarting process...');
    
    try {
      // Stop health monitoring
      healthMonitor.stop();
      
      // Stop request queue processing
      requestQueue.stopProcessing();
      
      // Clear request queue
      requestQueue.clearQueue();
      
      // Give some time for cleanup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Process restart completed');
      process.exit(0);
      
    } catch (error) {
      console.error('❌ Error during restart:', error);
      process.exit(1);
    }
  }

  // Get process manager status
  getStatus() {
    return {
      uptime: Date.now() - this.startTime,
      isShuttingDown: this.isShuttingDown,
      healthStatus: healthMonitor.getHealthStatus(),
      queueStatus: requestQueue.getStatus(),
      systemInfo: healthMonitor.getSystemInfo()
    };
  }
}

// Create singleton instance
const processManager = new ProcessManager();

export default processManager;
export { ProcessManager };
