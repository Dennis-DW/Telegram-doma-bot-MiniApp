// utils/eventAggregator.js
import { getSubscribers } from "./storage.js";
import { formatMessage } from "./broadcast.js";

class EventAggregator {
  constructor() {
    this.eventQueue = [];
    this.broadcastInterval = 30000; // 30 seconds
    this.maxEventsPerBatch = 5; // Maximum events per broadcast
    this.isProcessing = false;
    this.lastBroadcastTime = 0;
    this.minBroadcastInterval = 10000; // Minimum 10 seconds between broadcasts
    
    // Start the aggregator
    this.start();
  }

  start() {
    console.log("🔄 Starting Event Aggregator...");
    console.log(`⏰ Broadcast interval: ${this.broadcastInterval / 1000}s`);
    console.log(`📦 Max events per batch: ${this.maxEventsPerBatch}`);
    console.log(`⏱️ Min interval between broadcasts: ${this.minBroadcastInterval / 1000}s`);
    
    // Process events every 30 seconds
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
    if (this.isProcessing || this.eventQueue.length === 0) {
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

    // Take up to maxEventsPerBatch events
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
        // Send batch summary
        const batchMessage = this.createBatchMessage(eventGroups);
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

  createBatchMessage(eventGroups) {
    let message = `📢 DOMA Events Update\n\n`;
    
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

    for (const [eventType, events] of Object.entries(eventGroups)) {
      const emoji = eventTypeEmojis[eventType] || '📢';
      message += `${emoji} ${eventType}: ${events.length} event${events.length > 1 ? 's' : ''}\n`;
      
      // Add summary for each event type
      for (const event of events.slice(0, 3)) { // Show max 3 events per type
        const summary = this.getEventSummary(event);
        if (summary) {
          message += `   • ${summary}\n`;
        }
      }
      
      if (events.length > 3) {
        message += `   • ... and ${events.length - 3} more\n`;
      }
      message += '\n';
    }

    message += `⏰ Last updated: ${new Date().toLocaleString().replace(/\./g, ' dot ')}`;
    
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
          return `${sld} dot ${tld} (ID: ${String(tokenId).slice(0, 10)}...)`;
          
        case 'Transfer':
          const transferTokenId = args[2];
          const from = args[0];
          const to = args[1];
          return `ID: ${String(transferTokenId).slice(0, 10)}... (${from.slice(0, 6)}... → ${to.slice(0, 6)}...)`;
          
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
    // This will be implemented by the main bot
    // For now, we'll store the message to be sent
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