// utils/requestQueue.js
import EventEmitter from 'events';

class RequestQueue extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.queue = [];
    this.processing = false;
    this.maxConcurrent = options.maxConcurrent || 5;
    this.maxQueueSize = options.maxQueueSize || 100;
    this.processingTimeout = options.processingTimeout || 30000; // 30 seconds
    this.rateLimitWindow = options.rateLimitWindow || 60000; // 1 minute
    this.rateLimitMax = options.rateLimitMax || 10; // 10 requests per minute per user
    
    // Rate limiting tracking
    this.userRequests = new Map();
    
    // Start processing queue
    this.startProcessing();
    
    console.log('🔄 Request Queue Manager initialized');
    console.log(`   Max concurrent: ${this.maxConcurrent}`);
    console.log(`   Max queue size: ${this.maxQueueSize}`);
    console.log(`   Rate limit: ${this.rateLimitMax} requests per ${this.rateLimitWindow / 1000}s per user`);
  }

  // Add request to queue
  async addRequest(request) {
    const { userId, type, data, priority = 0 } = request;
    
    // Check rate limiting
    if (!this.checkRateLimit(userId)) {
      throw new Error('Rate limit exceeded. Please wait before making another request.');
    }
    
    // Check queue size
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error('Server is busy. Please try again later.');
    }
    
    const queueItem = {
      id: this.generateId(),
      userId,
      type,
      data,
      priority,
      timestamp: Date.now(),
      status: 'queued'
    };
    
    // Insert based on priority (higher priority first)
    const insertIndex = this.queue.findIndex(item => item.priority < priority);
    if (insertIndex === -1) {
      this.queue.push(queueItem);
    } else {
      this.queue.splice(insertIndex, 0, queueItem);
    }
    
    console.log(`📥 Request queued: ${type} from user ${userId} (Priority: ${priority}, Queue size: ${this.queue.length})`);
    
    // Emit event for monitoring
    this.emit('requestQueued', queueItem);
    
    return queueItem.id;
  }

  // Check rate limiting for user
  checkRateLimit(userId) {
    const now = Date.now();
    const userKey = String(userId);
    
    if (!this.userRequests.has(userKey)) {
      this.userRequests.set(userKey, []);
    }
    
    const requests = this.userRequests.get(userKey);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => now - timestamp < this.rateLimitWindow);
    this.userRequests.set(userKey, validRequests);
    
    // Check if user has exceeded rate limit
    if (validRequests.length >= this.rateLimitMax) {
      return false;
    }
    
    // Add current request timestamp
    validRequests.push(now);
    return true;
  }

  // Start processing the queue
  startProcessing() {
    if (this.processing) return;
    
    this.processing = true;
    this.processQueue();
  }

  // Process the queue
  async processQueue() {
    while (this.processing && this.queue.length > 0) {
      const activeRequests = this.getActiveRequests();
      
      if (activeRequests.length >= this.maxConcurrent) {
        // Wait for some requests to complete
        await this.waitForCompletion();
        continue;
      }
      
      const request = this.queue.shift();
      if (request) {
        this.processRequest(request);
      }
    }
    
    // Continue processing after a short delay
    if (this.processing) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  // Process individual request
  async processRequest(request) {
    request.status = 'processing';
    request.startTime = Date.now();
    
    console.log(`🔄 Processing request: ${request.type} from user ${request.userId} (ID: ${request.id})`);
    
    // Set timeout for request processing
    const timeout = setTimeout(() => {
      request.status = 'timeout';
      request.error = 'Request processing timeout';
      this.emit('requestTimeout', request);
      console.log(`⏰ Request timeout: ${request.id}`);
    }, this.processingTimeout);
    
    try {
      // Emit event for request processing
      this.emit('requestProcessing', request);
      
      // The actual processing will be handled by the event listeners
      // This allows for flexible request handling
      
    } catch (error) {
      request.status = 'error';
      request.error = error.message;
      this.emit('requestError', request, error);
      console.log(`❌ Request error: ${request.id} - ${error.message}`);
    } finally {
      clearTimeout(timeout);
      request.endTime = Date.now();
      request.duration = request.endTime - request.startTime;
      
      console.log(`✅ Request completed: ${request.id} (Duration: ${request.duration}ms)`);
      this.emit('requestCompleted', request);
    }
  }

  // Get currently active requests
  getActiveRequests() {
    return this.queue.filter(req => req.status === 'processing');
  }

  // Wait for some requests to complete
  async waitForCompletion() {
    return new Promise(resolve => {
      const checkCompletion = () => {
        const activeRequests = this.getActiveRequests();
        if (activeRequests.length < this.maxConcurrent) {
          resolve();
        } else {
          setTimeout(checkCompletion, 50);
        }
      };
      checkCompletion();
    });
  }

  // Get queue status
  getStatus() {
    const activeRequests = this.getActiveRequests();
    const queuedRequests = this.queue.filter(req => req.status === 'queued');
    
    return {
      queueSize: this.queue.length,
      activeRequests: activeRequests.length,
      queuedRequests: queuedRequests.length,
      maxConcurrent: this.maxConcurrent,
      maxQueueSize: this.maxQueueSize,
      processing: this.processing,
      rateLimitWindow: this.rateLimitWindow,
      rateLimitMax: this.rateLimitMax
    };
  }

  // Get user's request history
  getUserRequests(userId) {
    const userKey = String(userId);
    return this.userRequests.get(userKey) || [];
  }

  // Clear queue (for maintenance)
  clearQueue() {
    const clearedCount = this.queue.length;
    this.queue = [];
    console.log(`🧹 Cleared ${clearedCount} requests from queue`);
    this.emit('queueCleared', clearedCount);
  }

  // Stop processing
  stopProcessing() {
    this.processing = false;
    console.log('🛑 Request queue processing stopped');
  }

  // Generate unique ID
  generateId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clean up old rate limit data
  cleanupRateLimitData() {
    const now = Date.now();
    for (const [userId, requests] of this.userRequests.entries()) {
      const validRequests = requests.filter(timestamp => now - timestamp < this.rateLimitWindow);
      if (validRequests.length === 0) {
        this.userRequests.delete(userId);
      } else {
        this.userRequests.set(userId, validRequests);
      }
    }
  }
}

// Create singleton instance
const requestQueue = new RequestQueue({
  maxConcurrent: 5,
  maxQueueSize: 100,
  processingTimeout: 30000,
  rateLimitWindow: 60000,
  rateLimitMax: 10
});

// Clean up rate limit data every 5 minutes
setInterval(() => {
  requestQueue.cleanupRateLimitData();
}, 5 * 60 * 1000);

export default requestQueue;
export { RequestQueue };
