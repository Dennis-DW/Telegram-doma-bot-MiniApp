// utils/database.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('❌ MONGODB_URI is missing in environment variables');
      }

      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db('doma-events');
      this.isConnected = true;
      
      console.log('✅ Connected to MongoDB successfully');
      
      // Create indexes for better performance
      await this.createIndexes();
      
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      // Create indexes for better query performance
      await this.db.collection('events').createIndex({ timestamp: -1 });
      await this.db.collection('events').createIndex({ type: 1 });
      await this.db.collection('events').createIndex({ 'args.tokenId': 1 });
      
      await this.db.collection('subscribers').createIndex({ chatId: 1 }, { unique: true });
      await this.db.collection('subscribers').createIndex({ subscribedAt: -1 });
      
      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('⚠️ Failed to create indexes:', error);
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('✅ Disconnected from MongoDB');
    }
  }

  // Event operations
  async saveEvent(event) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const eventData = {
        ...event,
        createdAt: new Date(),
        // Ensure timestamp is present
        timestamp: event.timestamp || new Date().toISOString()
      };

      const result = await this.db.collection('events').insertOne(eventData);
      console.log(`💾 Event saved to MongoDB: ${event.type} (ID: ${result.insertedId})`);
      return result;
    } catch (error) {
      console.error('❌ Failed to save event:', error);
      throw error;
    }
  }

  async getEvents(limit = 1000, skip = 0) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const events = await this.db.collection('events')
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
      
      return events;
    } catch (error) {
      console.error('❌ Failed to get events:', error);
      throw error;
    }
  }

  async getEventsByType(eventType, limit = 50, page = 1) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const skip = (page - 1) * limit;
      const events = await this.db.collection('events')
        .find({ type: eventType })
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();

      const total = await this.db.collection('events').countDocuments({ type: eventType });

      return {
        events,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('❌ Failed to get events by type:', error);
      throw error;
    }
  }

  async getRecentEvents(limit = 10) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const events = await this.db.collection('events')
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
      
      return events;
    } catch (error) {
      console.error('❌ Failed to get recent events:', error);
      throw error;
    }
  }

  async cleanupOldEvents(retentionDays = 10) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const result = await this.db.collection('events').deleteMany({
        timestamp: { $lt: cutoffDate.toISOString() }
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} old events`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Failed to cleanup old events:', error);
      throw error;
    }
  }

  async getEventStats() {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const [
        totalEvents,
        eventsToday,
        eventsThisWeek,
        eventsThisMonth,
        eventTypes,
        todayEventTypes
      ] = await Promise.all([
        this.db.collection('events').countDocuments(),
        this.db.collection('events').countDocuments({
          timestamp: { $gte: today.toISOString() }
        }),
        this.db.collection('events').countDocuments({
          timestamp: { $gte: weekAgo.toISOString() }
        }),
        this.db.collection('events').countDocuments({
          timestamp: { $gte: monthAgo.toISOString() }
        }),
        this.db.collection('events').aggregate([
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]).toArray(),
        this.db.collection('events').aggregate([
          { $match: { timestamp: { $gte: today.toISOString() } } },
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]).toArray()
      ]);

      // Convert aggregation results to objects
      const eventTypesObj = {};
      const todayEventTypesObj = {};

      eventTypes.forEach(item => {
        eventTypesObj[item._id] = item.count;
      });

      todayEventTypes.forEach(item => {
        todayEventTypesObj[item._id] = item.count;
      });

      return {
        totalEvents,
        eventsToday,
        eventsThisWeek,
        eventsThisMonth,
        activeSubscribers: await this.getSubscribersCount(),
        networkStatus: 'Active',
        eventTypes: eventTypesObj,
        todayEventTypes: todayEventTypesObj,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to get event stats:', error);
      throw error;
    }
  }

  // Subscriber operations
  async addSubscriber(chatId) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const chatIdStr = String(chatId);
      
      const result = await this.db.collection('subscribers').updateOne(
        { chatId: chatIdStr },
        {
          $set: {
            chatId: chatIdStr,
            subscribedAt: new Date(),
            settings: {
              notifications: true,
              eventTypes: {
                minting: true,
                transfers: true,
                renewals: true,
                burning: true,
                locks: true,
                registrar: true,
                metadata: true,
                locked: true,
                unlocked: true,
                expired: true
              },
              frequency: 'realtime',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`✅ Added new subscriber: ${chatIdStr}`);
      } else {
        console.log(`ℹ️ Subscriber already exists: ${chatIdStr}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to add subscriber:', error);
      throw error;
    }
  }

  async removeSubscriber(chatId) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const chatIdStr = String(chatId);
      const result = await this.db.collection('subscribers').deleteOne({ chatId: chatIdStr });
      
      if (result.deletedCount > 0) {
        console.log(`❌ Removed subscriber: ${chatIdStr}`);
      } else {
        console.log(`ℹ️ Subscriber not found: ${chatIdStr}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to remove subscriber:', error);
      throw error;
    }
  }

  async getSubscribers() {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const subscribers = await this.db.collection('subscribers').find({}).toArray();
      return subscribers.map(sub => sub.chatId);
    } catch (error) {
      console.error('❌ Failed to get subscribers:', error);
      throw error;
    }
  }

  async getSubscribersCount() {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      return await this.db.collection('subscribers').countDocuments();
    } catch (error) {
      console.error('❌ Failed to get subscribers count:', error);
      throw error;
    }
  }

  async getUserSettings(chatId) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const chatIdStr = String(chatId);
      const subscriber = await this.db.collection('subscribers').findOne({ chatId: chatIdStr });
      return subscriber ? subscriber.settings : null;
    } catch (error) {
      console.error('❌ Failed to get user settings:', error);
      throw error;
    }
  }

  async updateUserSettings(chatId, settings) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const chatIdStr = String(chatId);
      
      const result = await this.db.collection('subscribers').updateOne(
        { chatId: chatIdStr },
        {
          $set: {
            'settings': {
              ...settings,
              updatedAt: new Date()
            }
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated settings for user: ${chatIdStr}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to update user settings:', error);
      throw error;
    }
  }

  async getSubscriptionStatus(telegramId) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const telegramIdStr = String(telegramId);
      const subscriber = await this.db.collection('subscribers').findOne({ chatId: telegramIdStr });
      
      const isSubscribed = !!subscriber;
      const totalSubscribers = await this.getSubscribersCount();

      return {
        subscribed: isSubscribed,
        totalSubscribers,
        userSettings: subscriber ? subscriber.settings : null,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to get subscription status:', error);
      throw error;
    }
  }
}

// Create singleton instance
const database = new Database();

export default database;
