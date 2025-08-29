// mini-app/src/services/api.js
import { CONFIG } from '../config/index.js';

const API_BASE_URL = CONFIG.API.BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.eventSource = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Get API documentation
  async getApiDocs() {
    return this.request('/docs');
  }

  // Get system information
  async getSystemInfo() {
    return this.request('/system/info');
  }

  // Get all events with pagination
  async getEvents(limit = 50, page = 1) {
    return this.request(`/api/events?limit=${limit}&page=${page}`);
  }

  // Get events by type with pagination
  async getEventsByType(eventType, limit = 50, page = 1) {
    return this.request(`/api/events/${eventType}?limit=${limit}&page=${page}`);
  }

  // Get event statistics
  async getEventStats() {
    return this.request('/api/events/stats');
  }

  // Get recent events for dashboard
  async getRecentEvents(limit = 10) {
    return this.request(`/api/events/recent?limit=${limit}`);
  }

  // Get subscriber status
  async getSubscriptionStatus(telegramId = null) {
    const endpoint = telegramId ? `/api/subscription/status?telegramId=${telegramId}` : '/api/subscription/status';
    return this.request(endpoint);
  }

  // Subscribe to events
  async subscribe(telegramId = null) {
    const body = telegramId ? { telegramId } : {};
    return this.request('/api/subscription/subscribe', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Unsubscribe from events
  async unsubscribe(telegramId = null) {
    const body = telegramId ? { telegramId } : {};
    return this.request('/api/subscription/unsubscribe', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Update notification settings
  async updateNotificationSettings(telegramId, settings) {
    return this.request('/api/subscription/settings', {
      method: 'PUT',
      body: JSON.stringify({ telegramId, settings }),
    });
  }

  // Get user settings
  async getUserSettings(telegramId) {
    return this.request(`/api/subscription/settings?telegramId=${telegramId}`);
  }

  // Real-time event streaming
  startEventStream(onEvent, onError, onConnect) {
    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.eventSource = new EventSource(`${this.baseURL}/api/events/stream`);
      
      this.eventSource.onopen = () => {
        console.log('Event stream connected');
        this.reconnectAttempts = 0;
        if (onConnect) onConnect();
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onEvent) onEvent(data);
        } catch (error) {
          console.error('Error parsing event stream data:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Event stream error:', error);
        if (onError) onError(error);
        this.handleReconnect();
      };

    } catch (error) {
      console.error('Failed to start event stream:', error);
      if (onError) onError(error);
    }
  }

  // Handle reconnection for event stream
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.startEventStream();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Stop event stream
  stopEventStream() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Get available event types
  getEventTypes() {
    return [
      { key: 'minting', label: 'Domain Minting', icon: '✨' },
      { key: 'transfers', label: 'Domain Transfers', icon: '🔄' },
      { key: 'renewals', label: 'Domain Renewals', icon: '♻️' },
      { key: 'burning', label: 'Domain Burning', icon: '🔥' },
      { key: 'locks', label: 'Lock Status', icon: '🔐' },
      { key: 'registrar', label: 'Registrar Changes', icon: '🏢' },
      { key: 'metadata', label: 'Metadata Updates', icon: '📝' },
      { key: 'locked', label: 'Domain Locked', icon: '🔒' },
      { key: 'unlocked', label: 'Domain Unlocked', icon: '🔓' },
      { key: 'expired', label: 'Domain Expired', icon: '⚠️' }
    ];
  }

  // Format event data for display
  formatEvent(event) {
    return {
      id: event.id || `${event.timestamp}_${event.txHash}`,
      type: event.type,
      domain: this.extractDomainFromEvent(event),
      owner: this.extractOwnerFromEvent(event),
      tokenId: this.extractTokenIdFromEvent(event),
      timestamp: event.timestamp,
      txHash: event.txHash,
      blockNumber: event.blockNumber,
      status: 'completed',
      message: event.message,
      args: event.args
    };
  }

  // Extract domain from event
  extractDomainFromEvent(event) {
    if (event.args && Array.isArray(event.args)) {
      switch (event.type) {
        case 'OwnershipTokenMinted':
          const sld = event.args[3];
          const tld = event.args[4];
          return sld && tld ? `${sld}.${tld}` : 'Unknown';
        case 'Transfer':
          // For transfers, we need to look at the message to extract domain info
          if (event.message) {
            const domainMatch = event.message.match(/Domain: ([^\s]+)/);
            return domainMatch ? domainMatch[1] : 'Unknown';
          }
          return 'Unknown';
        default:
          return 'Unknown';
      }
    }
    return 'Unknown';
  }

  // Extract owner from event
  extractOwnerFromEvent(event) {
    if (event.args && Array.isArray(event.args)) {
      switch (event.type) {
        case 'OwnershipTokenMinted':
          return event.args[2] || 'Unknown';
        case 'Transfer':
          // Extract "To" address from message
          if (event.message) {
            const toMatch = event.message.match(/To: ([^\n]+)/);
            return toMatch ? toMatch[1].trim() : 'Unknown';
          }
          return event.args[1] || 'Unknown';
        default:
          return 'Unknown';
      }
    }
    return 'Unknown';
  }

  // Extract token ID from event
  extractTokenIdFromEvent(event) {
    if (event.args && Array.isArray(event.args)) {
      switch (event.type) {
        case 'OwnershipTokenMinted':
          return event.args[0] || 'Unknown';
        case 'Transfer':
          return event.args[2] || 'Unknown';
        default:
          return event.args[0] || 'Unknown';
      }
    }
    return 'Unknown';
  }

  // Get explorer URL for transaction
  getExplorerUrl(txHash) {
    const explorerBase = CONFIG.URLS.EXPLORER_BASE;
    return `${explorerBase}/${txHash}`;
  }

  // Get frontend URL for domain
  getDomainUrl(domain) {
    const frontendBase = CONFIG.URLS.FRONTEND_BASE;
    return `${frontendBase}/domain/${domain}`;
  }
}

export default new ApiService(); 