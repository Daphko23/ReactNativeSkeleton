/**
 * NotificationRepositoryImpl - Clean Architecture Data Layer
 * Uses DataSource for database operations and maps to domain entities
 */

import type { 
  PushNotificationMessage, 
  NotificationSettings, 
  TopicSubscription 
} from '../../domain/entities/notification.entity';
import {
  NotificationDataSource,
  type INotificationDataSource,
  type NotificationRow,
  type UserNotificationSettingsRow
} from '../datasources/notification.datasource';

// Extended interfaces for repository operations (extending domain entities)
export interface NotificationHistoryItem extends PushNotificationMessage {
  userId?: string; // Optional user ID for the notification
  type: 'system' | 'user' | 'marketing' | 'security';
  actionRequired?: boolean;
  expiresAt?: Date;
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed';
  deliveryAttemptCount: number;
  deliveredAt?: Date;
  clickedAt?: Date;
}

export interface NotificationAnalytics {
  date: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  engagementRate: number;
  clickThroughRate: number;
  categoryBreakdown: {
    [category: string]: {
      sent: number;
      opened: number;
      clicked: number;
    };
  };
}

export interface UserNotificationSettings extends NotificationSettings {
  dndEnabled: boolean;
  dndStartTime: string;
  dndEndTime: string;
  dndWeekdays: boolean[];
  categorySettings: {
    [key: string]: {
      enabled: boolean;
      sound: boolean;
      vibration: boolean;
      priority: 'high' | 'normal' | 'low';
    };
  };
  fcmTokens: string[];
  apnsTokens: string[];
  locationEnabled: boolean;
  locationRadius: number;
}

export interface INotificationRepository {
  // Notification CRUD
  createNotification(notification: Omit<NotificationHistoryItem, 'id' | 'timestamp'>): Promise<NotificationHistoryItem>;
  getNotificationHistory(userId: string, limit?: number): Promise<NotificationHistoryItem[]>;
  markNotificationAsRead(notificationId: string, userId: string): Promise<boolean>;
  markNotificationAsClicked(notificationId: string, userId: string): Promise<boolean>;
  deleteNotification(notificationId: string, userId: string): Promise<boolean>;
  clearAllNotifications(userId: string): Promise<boolean>;
  
  // Settings Management
  getUserSettings(userId: string): Promise<UserNotificationSettings>;
  updateUserSettings(userId: string, settings: Partial<UserNotificationSettings>): Promise<UserNotificationSettings>;
  
  // Topic Management
  getAvailableTopics(): Promise<Array<{id: string; topicName: string; displayName: string}>>;
  getUserTopicSubscriptions(userId: string): Promise<TopicSubscription[]>;
  subscribeToTopic(userId: string, topicName: string): Promise<boolean>;
  unsubscribeFromTopic(userId: string, topicName: string): Promise<boolean>;
  
  // Analytics
  getNotificationAnalytics(userId: string, period: '24h' | '7d' | '30d' | '90d'): Promise<NotificationAnalytics>;
  getUserNotificationSummary(userId: string): Promise<{
    totalNotifications: number;
    unreadNotifications: number;
    urgentNotifications: number;
    recentActivity?: Date;
  }>;
  
  // Device Token Management
  updateDeviceToken(userId: string, token: string, platform: 'fcm' | 'apns'): Promise<boolean>;
  removeDeviceToken(userId: string, token: string): Promise<boolean>;
}

export class NotificationRepositoryImpl implements INotificationRepository {
  private dataSource: INotificationDataSource;
  private cache: Map<string, any>;
  
  constructor(dataSource?: INotificationDataSource) {
    this.dataSource = dataSource || new NotificationDataSource();
    this.cache = new Map();
  }

  // =============================================
  // NOTIFICATION CRUD OPERATIONS
  // =============================================

  async createNotification(
    notification: Omit<NotificationHistoryItem, 'id' | 'timestamp'>
  ): Promise<NotificationHistoryItem> {
    try {
      const dbNotification: Omit<NotificationRow, 'id' | 'created_at' | 'updated_at'> = {
        user_id: notification.userId || null,
        title: notification.title,
        body: notification.body,
        image_url: notification.imageUrl,
        data: notification.data || {},
        type: notification.type,
        category: notification.category || 'general',
        priority: notification.priority || 'normal',
        action_required: notification.actionRequired || false,
        expires_at: notification.expiresAt?.toISOString(),
        delivery_status: 'pending',
        delivery_attempt_count: 0,
        is_read: false,
        clicked: false,
        fcm_token: undefined,
        delivered_at: undefined,
        read_at: undefined,
        clicked_at: undefined
      };

      const result = await this.dataSource.createNotification(dbNotification);
      return this.mapToNotificationHistoryItem(result);
    } catch (error) {
      console.error('Error in createNotification:', error);
      throw error;
    }
  }

  async getNotificationHistory(userId: string, limit: number = 50): Promise<NotificationHistoryItem[]> {
    try {
      const cacheKey = `notifications:${userId}:${limit}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const notifications = await this.dataSource.getNotificationsByUserId(userId, limit);
      const mapped = notifications.map(this.mapToNotificationHistoryItem);
      
      // Cache for 5 minutes
      this.cache.set(cacheKey, mapped);
      setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);

      return mapped;
    } catch (error) {
      console.error('Error in getNotificationHistory:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string, _userId: string): Promise<boolean> {
    try {
      await this.dataSource.updateNotification(notificationId, {
        is_read: true,
        read_at: new Date().toISOString()
      });

      // Clear cache
      this.cache.clear();
      return true;
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error);
      return false;
    }
  }

  async markNotificationAsClicked(notificationId: string, _userId: string): Promise<boolean> {
    try {
      await this.dataSource.updateNotification(notificationId, {
        clicked: true,
        clicked_at: new Date().toISOString(),
        is_read: true,
        read_at: new Date().toISOString()
      });

      // Clear cache
      this.cache.clear();
      return true;
    } catch (error) {
      console.error('Error in markNotificationAsClicked:', error);
      return false;
    }
  }

  async deleteNotification(notificationId: string, _userId: string): Promise<boolean> {
    try {
      const success = await this.dataSource.deleteNotification(notificationId);
      if (success) {
        this.cache.clear();
      }
      return success;
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      return false;
    }
  }

  async clearAllNotifications(userId: string): Promise<boolean> {
    try {
      const success = await this.dataSource.clearUserNotifications(userId);
      if (success) {
        this.cache.clear();
      }
      return success;
    } catch (error) {
      console.error('Error in clearAllNotifications:', error);
      return false;
    }
  }

  // =============================================
  // SETTINGS MANAGEMENT
  // =============================================

  async getUserSettings(userId: string): Promise<UserNotificationSettings> {
    try {
      const cacheKey = `settings:${userId}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const settings = await this.dataSource.getUserSettings(userId);
      
      if (!settings) {
        return await this.createDefaultUserSettings(userId);
      }

      const mapped = this.mapToUserNotificationSettings(settings);
      
      // Cache for 10 minutes
      this.cache.set(cacheKey, mapped);
      setTimeout(() => this.cache.delete(cacheKey), 10 * 60 * 1000);

      return mapped;
    } catch (error) {
      console.error('Error in getUserSettings:', error);
      throw error;
    }
  }

  async updateUserSettings(
    userId: string, 
    updates: Partial<UserNotificationSettings>
  ): Promise<UserNotificationSettings> {
    try {
      const currentSettings = await this.getUserSettings(userId);
      
      const dbSettings: UserNotificationSettingsRow = {
        user_id: userId,
        enabled: updates.enabled ?? currentSettings.enabled,
        sound_enabled: updates.soundEnabled ?? currentSettings.soundEnabled,
        vibration_enabled: updates.vibrationEnabled ?? currentSettings.vibrationEnabled,
        show_preview: updates.showPreview ?? currentSettings.showPreview,
        dnd_enabled: updates.dndEnabled ?? currentSettings.dndEnabled,
        dnd_start_time: updates.dndStartTime ?? currentSettings.dndStartTime,
        dnd_end_time: updates.dndEndTime ?? currentSettings.dndEndTime,
        dnd_weekdays: updates.dndWeekdays ?? currentSettings.dndWeekdays,
        category_settings: updates.categorySettings ?? currentSettings.categorySettings,
        fcm_tokens: updates.fcmTokens ?? currentSettings.fcmTokens,
        apns_tokens: updates.apnsTokens ?? currentSettings.apnsTokens,
        location_enabled: updates.locationEnabled ?? currentSettings.locationEnabled,
        location_radius: updates.locationRadius ?? currentSettings.locationRadius,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = await this.dataSource.upsertUserSettings(dbSettings);
      const mapped = this.mapToUserNotificationSettings(result);
      
      // Update cache
      this.cache.set(`settings:${userId}`, mapped);
      
      return mapped;
    } catch (error) {
      console.error('Error in updateUserSettings:', error);
      throw error;
    }
  }

  // =============================================
  // TOPIC MANAGEMENT
  // =============================================

  async getAvailableTopics(): Promise<Array<{id: string; topicName: string; displayName: string}>> {
    try {
      const cacheKey = 'topics:available';
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const topics = await this.dataSource.getActiveTopics();
      const mapped = topics.map(topic => ({
        id: topic.id,
        topicName: topic.topic_name,
        displayName: topic.display_name
      }));
      
      // Cache for 30 minutes
      this.cache.set(cacheKey, mapped);
      setTimeout(() => this.cache.delete(cacheKey), 30 * 60 * 1000);

      return mapped;
    } catch (error) {
      console.error('Error in getAvailableTopics:', error);
      throw error;
    }
  }

  async getUserTopicSubscriptions(userId: string): Promise<TopicSubscription[]> {
    try {
      const subscriptions = await this.dataSource.getUserTopicSubscriptions(userId);
      return subscriptions.map(sub => ({
        topic: sub.topic.topic_name,
        subscribed: sub.subscribed,
        subscribedAt: sub.subscribed_at ? new Date(sub.subscribed_at) : undefined,
      }));
    } catch (error) {
      console.error('Error in getUserTopicSubscriptions:', error);
      throw error;
    }
  }

  async subscribeToTopic(userId: string, topicName: string): Promise<boolean> {
    try {
      const topic = await this.dataSource.getTopicByName(topicName);
      if (!topic) {
        console.error('Topic not found:', topicName);
        return false;
      }

      return await this.dataSource.upsertTopicSubscription({
        user_id: userId,
        topic_id: topic.id,
        subscribed: true,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: undefined,
        preferences: {}
      });
    } catch (error) {
      console.error('Error in subscribeToTopic:', error);
      return false;
    }
  }

  async unsubscribeFromTopic(userId: string, topicName: string): Promise<boolean> {
    try {
      const topic = await this.dataSource.getTopicByName(topicName);
      if (!topic) {
        console.error('Topic not found:', topicName);
        return false;
      }

      return await this.dataSource.upsertTopicSubscription({
        user_id: userId,
        topic_id: topic.id,
        subscribed: false,
        subscribed_at: undefined,
        unsubscribed_at: new Date().toISOString(),
        preferences: {}
      });
    } catch (error) {
      console.error('Error in unsubscribeFromTopic:', error);
      return false;
    }
  }

  // =============================================
  // ANALYTICS
  // =============================================

  async getNotificationAnalytics(
    userId: string, 
    period: '24h' | '7d' | '30d' | '90d'
  ): Promise<NotificationAnalytics> {
    try {
      const periodHours = {
        '24h': 24,
        '7d': 24 * 7,
        '30d': 24 * 30,
        '90d': 24 * 90
      };

      const startDate = new Date(Date.now() - periodHours[period] * 60 * 60 * 1000);
      const endDate = new Date();

      const notifications = await this.dataSource.getNotificationsInPeriod(userId, startDate, endDate);

      // Calculate analytics
      const totalSent = notifications.length;
      const totalDelivered = notifications.filter(n => n.delivery_status === 'delivered').length;
      const totalOpened = notifications.filter(n => n.is_read).length;
      const totalClicked = notifications.filter(n => n.clicked).length;

      const engagementRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
      const clickThroughRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;

      // Category breakdown
      const categoryBreakdown: any = {};
      notifications.forEach(notification => {
        const category = notification.category || 'general';
        if (!categoryBreakdown[category]) {
          categoryBreakdown[category] = { sent: 0, opened: 0, clicked: 0 };
        }
        categoryBreakdown[category].sent++;
        if (notification.is_read) categoryBreakdown[category].opened++;
        if (notification.clicked) categoryBreakdown[category].clicked++;
      });

      return {
        date: new Date().toISOString().split('T')[0],
        totalSent,
        totalDelivered,
        totalOpened,
        totalClicked,
        engagementRate: Math.round(engagementRate * 100) / 100,
        clickThroughRate: Math.round(clickThroughRate * 100) / 100,
        categoryBreakdown
      };
    } catch (error) {
      console.error('Error in getNotificationAnalytics:', error);
      throw error;
    }
  }

  async getUserNotificationSummary(userId: string): Promise<{
    totalNotifications: number;
    unreadNotifications: number;
    urgentNotifications: number;
    recentActivity?: Date;
  }> {
    try {
      const summary = await this.dataSource.getUserNotificationSummary(userId);
      
      return {
        totalNotifications: summary?.total_notifications || 0,
        unreadNotifications: summary?.unread_notifications || 0,
        urgentNotifications: summary?.urgent_notifications || 0,
        recentActivity: summary?.recent_activity ? new Date(summary.recent_activity) : undefined
      };
    } catch (error) {
      console.error('Error in getUserNotificationSummary:', error);
      throw error;
    }
  }

  // =============================================
  // DEVICE TOKEN MANAGEMENT
  // =============================================

  async updateDeviceToken(userId: string, token: string, platform: 'fcm' | 'apns'): Promise<boolean> {
    try {
      const settings = await this.getUserSettings(userId);
      const tokenField = platform === 'fcm' ? 'fcmTokens' : 'apnsTokens';
      const currentTokens = settings[tokenField] || [];
      
      // Add token if not already present
      if (!currentTokens.includes(token)) {
        currentTokens.push(token);
        await this.updateUserSettings(userId, { [tokenField]: currentTokens });
      }

      return true;
    } catch (error) {
      console.error('Error in updateDeviceToken:', error);
      return false;
    }
  }

  async removeDeviceToken(userId: string, token: string): Promise<boolean> {
    try {
      const settings = await this.getUserSettings(userId);
      const updatedFcmTokens = settings.fcmTokens.filter(t => t !== token);
      const updatedApnsTokens = settings.apnsTokens.filter(t => t !== token);
      
      await this.updateUserSettings(userId, {
        fcmTokens: updatedFcmTokens,
        apnsTokens: updatedApnsTokens
      });

      return true;
    } catch (error) {
      console.error('Error in removeDeviceToken:', error);
      return false;
    }
  }

  // =============================================
  // PRIVATE HELPER METHODS
  // =============================================

  private mapToNotificationHistoryItem(data: NotificationRow): NotificationHistoryItem {
    return {
      id: data.id,
      title: data.title,
      body: data.body,
      imageUrl: data.image_url,
      data: data.data || {},
      type: data.type,
      category: data.category,
      priority: data.priority,
      timestamp: new Date(data.created_at),
      isRead: data.is_read,
      actionRequired: data.action_required,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      deliveryStatus: data.delivery_status,
      deliveryAttemptCount: data.delivery_attempt_count,
      deliveredAt: data.delivered_at ? new Date(data.delivered_at) : undefined,
      clickedAt: data.clicked_at ? new Date(data.clicked_at) : undefined,
      userId: data.user_id || undefined
    };
  }

  private mapToUserNotificationSettings(data: UserNotificationSettingsRow): UserNotificationSettings {
    return {
      enabled: data.enabled,
      topics: [], // This would be populated separately
      soundEnabled: data.sound_enabled,
      vibrationEnabled: data.vibration_enabled,
      showPreview: data.show_preview,
      dndEnabled: data.dnd_enabled,
      dndStartTime: data.dnd_start_time,
      dndEndTime: data.dnd_end_time,
      dndWeekdays: data.dnd_weekdays || [true, true, true, true, true, false, false],
      categorySettings: data.category_settings || {},
      fcmTokens: data.fcm_tokens || [],
      apnsTokens: data.apns_tokens || [],
      locationEnabled: data.location_enabled,
      locationRadius: data.location_radius
    };
  }

  private async createDefaultUserSettings(userId: string): Promise<UserNotificationSettings> {
    const defaultSettings: UserNotificationSettings = {
      enabled: true,
      topics: [],
      soundEnabled: true,
      vibrationEnabled: true,
      showPreview: true,
      dndEnabled: false,
      dndStartTime: '22:00',
      dndEndTime: '08:00',
      dndWeekdays: [true, true, true, true, true, false, false],
      categorySettings: {
        security: { enabled: true, sound: true, vibration: true, priority: 'high' },
        updates: { enabled: true, sound: true, vibration: false, priority: 'normal' },
        maintenance: { enabled: true, sound: false, vibration: false, priority: 'normal' },
        promotions: { enabled: false, sound: false, vibration: false, priority: 'low' }
      },
      fcmTokens: [],
      apnsTokens: [],
      locationEnabled: false,
      locationRadius: 1000
    };

    return await this.updateUserSettings(userId, defaultSettings);
  }
} 