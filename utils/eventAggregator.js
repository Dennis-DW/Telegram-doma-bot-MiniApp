import { getSubscribers, getEvents } from "./storage.js";

class EventAggregator {
  constructor() {
    this.eventQueue = [];
    this.broadcastInterval = 30 * 60 * 1000; // 30 minutes
    this.maxEventsPerBatch = 10; // Maximum events per broadcast
    this.isProcessing = false;
    this.lastBroadcastTime = 0;
    this.minBroadcastInterval = 5 * 60 * 1000; // Minimum 5 minutes between broadcasts
    this.pendingMessages = [];
    
    // Start the aggregator
    this.start();
  }

  // Utility function to escape Telegram MarkdownV2 reserved characters
  escapeMarkdownV2(text) {
    const reservedChars = /[_*[\]()~`#+\-=|{}!.]/g;
    return text.replace(reservedChars, '\\$&');
  }

  start() {
    console.log("🔄 Starting Event Aggregator...");
    console.log(`⏰ Broadcast interval: ${this.broadcastInterval / 1000 / 60} minutes`);
    console.log(`📦 Max events per batch: ${this.maxEventsPerBatch}`);
    console.log(`⏱️ Min interval between broadcasts: ${this.minBroadcastInterval / 1000 / 60} minutes`);
    
    // Process events every 30 minutes
    setInterval(() => {
      this.processBatch();
    }, this.broadcastInterval);
  }

  addEvent(event) {
    this.eventQueue.push({
      ...event,
      timestamp: new Date().toISOString()
    });

    console.log(`📥 Event added to aggregator: ${event.type} (Queue size: ${this.eventQueue.length})`);
    
    // If we have enough events, process immediately
    if (this.eventQueue.length >= this.maxEventsPerBatch) {
      this.processBatch();
    }
  }

  async processBatch() {
    if (this.isProcessing) {
      return;
    }

    // Check if enough time has passed since last broadcast
    const now = Date.now();
    if (now - this.lastBroadcastTime < this.minBroadcastInterval) {
      console.log(`⏳ Waiting for minimum broadcast interval...`);
      return;
    }

    this.isProcessing = true;
    const subscribers = getSubscribers();

    if (subscribers.length === 0) {
      console.log("⚠️ No subscribers to broadcast to.");
      this.eventQueue = [];
      this.isProcessing = false;
      return;
    }

    // Get all events for comprehensive reporting
    const allEvents = getEvents();
    const eventsToProcess = this.eventQueue.splice(0, this.maxEventsPerBatch);
    
    console.log("=".repeat(60));
    console.log(`📤 PROCESSING EVENT BATCH`);
    console.log("=".repeat(60));
    console.log(`📦 Events in batch: ${eventsToProcess.length}`);
    console.log(`👥 Subscribers: ${subscribers.length}`);
    console.log(`📊 Remaining in queue: ${this.eventQueue.length}`);
    console.log("=".repeat(60));

    // Group events by type for better presentation
    const eventGroups = this.groupEventsByType(eventsToProcess);
    
    let successCount = 0;
    let errorCount = 0;
    const invalidSubscribers = [];

    for (const chatId of subscribers) {
      try {
        // Send comprehensive batch summary
        const batchMessage = this.createComprehensiveBatchMessage(eventGroups, allEvents);
        await this.sendMessage(chatId, batchMessage);
        successCount++;
        console.log(`✅ Batch sent to ${chatId}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to send batch to ${chatId}:`, error.message);
        
        // Mark invalid subscribers for removal
        if (error.message.includes('chat not found') || 
            error.message.includes('bot was blocked') ||
            error.message.includes('user is deactivated') ||
            error.message.includes('chat was deleted')) {
          invalidSubscribers.push(chatId);
        }
      }
    }

    // Remove invalid subscribers
    if (invalidSubscribers.length > 0) {
      const { removeSubscriber } = await import("./storage.js");
      for (const chatId of invalidSubscribers) {
        removeSubscriber(chatId);
      }
    }

    this.lastBroadcastTime = now;

    console.log("=".repeat(60));
    console.log(`📊 BATCH BROADCAST SUMMARY:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   🗑️ Removed invalid subscribers: ${invalidSubscribers.length}`);
    console.log(`   📦 Events processed: ${eventsToProcess.length}`);
    console.log(`   📊 Remaining in queue: ${this.eventQueue.length}`);
    console.log("=".repeat(60));

    this.isProcessing = false;
  }

  groupEventsByType(events) {
    const groups = {};
    
    for (const event of events) {
      if (!groups[event.type]) {
        groups[event.type] = [];
      }
      groups[event.type].push(event);
    }
    
    return groups;
  }

  createComprehensiveBatchMessage(eventGroups, allEvents) {
    // Calculate today's events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEvents = allEvents.filter(event => 
      new Date(event.timestamp) >= today
    );
    
    // Calculate totals
    const totalEvents = allEvents.length;
    const todayTotal = todayEvents.length;
    
    // Define all event types with their emojis
    const eventTypeEmojis = {
      'OwnershipTokenMinted': '✨',
      'Transfer': '🔄',
      'NameTokenRenewed': '♻️',
      'NameTokenBurned': '🔥',
      'LockStatusChanged': '🔐',
      'NameTokenLocked': '🔒',
      'NameTokenUnlocked': '🔓',
      'RegistrarChanged': '🏢',
      'MetadataUpdated': '📝',
      'DomainExpired': '⚠️'
    };

    // Count events by type for today and all time
    const todayCounts = {};
    const allTimeCounts = {};
    
    // Initialize all event types with 0
    Object.keys(eventTypeEmojis).forEach(type => {
      todayCounts[type] = 0;
      allTimeCounts[type] = 0;
    });
    
    // Count today's events
    todayEvents.forEach(event => {
      if (todayCounts.hasOwnProperty(event.type)) {
        todayCounts[event.type]++;
      }
    });
    
    // Count all time events
    allEvents.forEach(event => {
      if (allTimeCounts.hasOwnProperty(event.type)) {
        allTimeCounts[event.type]++;
      }
    });

    let message = `DOMA Events Update\n\n`;
    
    // Add summary header
    message += `Summary\n`;
    message += `• Today: ${todayTotal} events\n`;
    message += `• Total: ${totalEvents} events\n`;
    message += `• New in this update: ${Object.values(eventGroups).reduce((sum, events) => sum + events.length, 0)} events\n\n`;
    
    // Add today's breakdown
    message += `Today's Events\n`;
    for (const [eventType, count] of Object.entries(todayCounts)) {
      const emoji = eventTypeEmojis[eventType] || '📢';
      message += `${emoji} ${eventType}: ${count}\n`;
    }
    message += `\n`;
    
    // Add all-time breakdown
    message += `All-Time Events\n`;
    for (const [eventType, count] of Object.entries(allTimeCounts)) {
      const emoji = eventTypeEmojis[eventType] || '📢';
      message += `${emoji} ${eventType}: ${count}\n`;
    }
    message += `\n`;
    
    // Add recent events details (if any)
    const recentEvents = Object.values(eventGroups).flat().slice(0, 5);
    if (recentEvents.length > 0) {
      message += `Recent Events\n`;
      for (const event of recentEvents) {
        const summary = this.getEventSummary(event);
        if (summary) {
          const emoji = eventTypeEmojis[event.type] || '📢';
          message += `${emoji} ${summary}\n`;
        }
      }
      message += `\n`;
    }

    message += `Last updated: ${new Date().toLocaleString()}`;
    
    return message;
  }

  getEventSummary(event) {
    try {
      const args = event.args;
      
      switch (event.type) {
        case 'OwnershipTokenMinted':
          const tokenId = args[0];
          const sld = args[3];
          const tld = args[4];
          return `${sld}.${tld} ID: ${String(tokenId).slice(0, 10)}...`;
          
        case 'Transfer':
          const transferTokenId = args[2];
          const from = args[0];
          const to = args[1];
          return `ID: ${String(transferTokenId).slice(0, 10)}... ${from.slice(0, 6)}... → ${to.slice(0, 6)}...`;
          
        case 'NameTokenRenewed':
          const renewedTokenId = args[0];
          return `ID: ${String(renewedTokenId).slice(0, 10)}...`;
          
        case 'NameTokenBurned':
          const burnedTokenId = args[0];
          return `ID: ${String(burnedTokenId).slice(0, 10)}...`;
          
        default:
          return null;
      }
    } catch (error) {
      return null;
    }
  }

  async sendMessage(chatId, message) {
    // Store the message to be sent
    this.pendingMessages = this.pendingMessages || [];
    this.pendingMessages.push({ chatId, message });
  }

  getPendingMessages() {
    const messages = this.pendingMessages || [];
    this.pendingMessages = [];
    return messages;
  }

  getStatus() {
    return {
      queueSize: this.eventQueue.length,
      isProcessing: this.isProcessing,
      lastBroadcastTime: this.lastBroadcastTime,
      subscribers: getSubscribers().length
    };
  }

  clearQueue() {
    const size = this.eventQueue.length;
    this.eventQueue = [];
    console.log(`🧹 Cleared event aggregator queue (${size} events)`);
    return size;
  }
}

// Create singleton instance
const eventAggregator = new EventAggregator();

export default eventAggregator;
export { EventAggregator };