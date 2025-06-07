/**
 * NotificationDataSource - Direct Supabase Integration
 * Handles all database operations for notifications
 */

import { supabase } from '@core/config/supabase.config';

// Database row interfaces (matching Supabase schema)
export interface NotificationRow {
  id: string;
  user_id: string | null;
  title: string;
  body: string;
  image_url?: string;
  data: Record<string, any>;
  type: 'system' | 'user' | 'marketing' | 'security';
  category: string;
  priority: 'low' | 'normal' | 'high';
  fcm_token?: string;
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed';
  delivery_attempt_count: number;
  delivered_at?: string;
  is_read: boolean;
  read_at?: string;
  clicked: boolean;
  clicked_at?: string;
  action_required: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationTopicRow {
  id: string;
  topic_name: string;
  display_name: string;
  description?: string;
  category: string;
  is_active: boolean;
  requires_permission: boolean;
  created_at: string;
}

export interface UserTopicSubscriptionRow {
  id: string;
  user_id: string;
  topic_id: string;
  subscribed: boolean;
  subscribed_at?: string;
  unsubscribed_at?: string;
  preferences: Record<string, any>;
}

export interface UserNotificationSettingsRow {
  user_id: string;
  enabled: boolean;
  sound_enabled: boolean;
  vibration_enabled: boolean;
  show_preview: boolean;
  dnd_enabled: boolean;
  dnd_start_time: string;
  dnd_end_time: string;
  dnd_weekdays: boolean[];
  category_settings: Record<string, any>;
  fcm_tokens: string[];
  apns_tokens: string[];
  location_enabled: boolean;
  location_radius: number;
  created_at: string;
  updated_at: string;
}

export interface INotificationDataSource {
  // Notification CRUD
  createNotification(notification: Omit<NotificationRow, 'id' | 'created_at' | 'updated_at'>): Promise<NotificationRow>;
  getNotificationsByUserId(userId: string, limit?: number): Promise<NotificationRow[]>;
  updateNotification(id: string, updates: Partial<NotificationRow>): Promise<NotificationRow>;
  deleteNotification(id: string): Promise<boolean>;
  clearUserNotifications(userId: string): Promise<boolean>;
  
  // Settings CRUD
  getUserSettings(userId: string): Promise<UserNotificationSettingsRow | null>;
  upsertUserSettings(settings: UserNotificationSettingsRow): Promise<UserNotificationSettingsRow>;
  
  // Topics
  getActiveTopics(): Promise<NotificationTopicRow[]>;
  getUserTopicSubscriptions(userId: string): Promise<(UserTopicSubscriptionRow & { topic: NotificationTopicRow })[]>;
  getTopicByName(topicName: string): Promise<NotificationTopicRow | null>;
  upsertTopicSubscription(subscription: Omit<UserTopicSubscriptionRow, 'id'>): Promise<boolean>;
  
  // Analytics
  getNotificationsInPeriod(userId: string, startDate: Date, endDate: Date): Promise<NotificationRow[]>;
  getUserNotificationSummary(userId: string): Promise<{
    total_notifications: number;
    unread_notifications: number;
    urgent_notifications: number;
    recent_activity?: string;
  } | null>;
}

export class NotificationDataSource implements INotificationDataSource {
  private logger = console; // Simple console logging for now

  // =============================================
  // NOTIFICATION CRUD
  // =============================================

  async createNotification(
    notification: Omit<NotificationRow, 'id' | 'created_at' | 'updated_at'>
  ): Promise<NotificationRow> {
    try {
      this.logger.debug('Creating notification in database', notification.title);

      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create notification', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      this.logger.info('Notification created successfully', data.id);
      return data;
    } catch (error) {
      this.logger.error('Error in createNotification', error);
      throw error;
    }
  }

  async getNotificationsByUserId(userId: string, limit: number = 50): Promise<NotificationRow[]> {
    try {
      this.logger.debug('Fetching notifications for user', userId, limit);

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        this.logger.error('Failed to fetch notifications', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      this.logger.debug('Notifications fetched successfully', data.length);
      return data;
    } catch (error) {
      this.logger.error('Error in getNotificationsByUserId', error);
      throw error;
    }
  }

  async updateNotification(id: string, updates: Partial<NotificationRow>): Promise<NotificationRow> {
    try {
      this.logger.debug('Updating notification', id, updates);

      const { data, error } = await supabase
        .from('notifications')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update notification', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      this.logger.info('Notification updated successfully', id);
      return data;
    } catch (error) {
      this.logger.error('Error in updateNotification', error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<boolean> {
    try {
      this.logger.debug('Deleting notification', id);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error('Failed to delete notification', error.message);
        return false;
      }

      this.logger.info('Notification deleted successfully', id);
      return true;
    } catch (error) {
      this.logger.error('Error in deleteNotification', error);
      return false;
    }
  }

  async clearUserNotifications(userId: string): Promise<boolean> {
    try {
      this.logger.debug('Clearing all notifications for user', userId);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) {
        this.logger.error('Failed to clear notifications', error.message);
        return false;
      }

      this.logger.info('User notifications cleared successfully', userId);
      return true;
    } catch (error) {
      this.logger.error('Error in clearUserNotifications', error);
      return false;
    }
  }

  // =============================================
  // SETTINGS CRUD
  // =============================================

  async getUserSettings(userId: string): Promise<UserNotificationSettingsRow | null> {
    try {
      this.logger.debug('Fetching user notification settings', userId);

      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not found
          this.logger.debug('User settings not found', userId);
          return null;
        }
        this.logger.error('Failed to fetch user settings', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      this.logger.debug('User settings fetched successfully', userId);
      return data;
    } catch (error) {
      this.logger.error('Error in getUserSettings', error);
      throw error;
    }
  }

  async upsertUserSettings(settings: UserNotificationSettingsRow): Promise<UserNotificationSettingsRow> {
    try {
      this.logger.debug('Upserting user notification settings', settings.user_id);

      const { data, error } = await supabase
        .from('user_notification_settings')
        .upsert({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to upsert user settings', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      this.logger.info('User settings upserted successfully', settings.user_id);
      return data;
    } catch (error) {
      this.logger.error('Error in upsertUserSettings', error);
      throw error;
    }
  }

  // =============================================
  // TOPICS
  // =============================================

  async getActiveTopics(): Promise<NotificationTopicRow[]> {
    try {
      this.logger.debug('Fetching active notification topics');

      const { data, error } = await supabase
        .from('notification_topics')
        .select('*')
        .eq('is_active', true)
        .order('display_name');

      if (error) {
        this.logger.error('Failed to fetch topics', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      this.logger.debug('Topics fetched successfully', data.length);
      return data;
    } catch (error) {
      this.logger.error('Error in getActiveTopics', error);
      throw error;
    }
  }

  async getUserTopicSubscriptions(
    userId: string
  ): Promise<(UserTopicSubscriptionRow & { topic: NotificationTopicRow })[]> {
    try {
      this.logger.debug('Fetching user topic subscriptions', userId);

      const { data, error } = await supabase
        .from('user_topic_subscriptions')
        .select(`
          *,
          notification_topics!inner (*)
        `)
        .eq('user_id', userId);

      if (error) {
        this.logger.error('Failed to fetch user subscriptions', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      this.logger.debug('User subscriptions fetched successfully', data.length);
      return data.map(item => ({
        ...item,
        topic: item.notification_topics
      }));
    } catch (error) {
      this.logger.error('Error in getUserTopicSubscriptions', error);
      throw error;
    }
  }

  async getTopicByName(topicName: string): Promise<NotificationTopicRow | null> {
    try {
      this.logger.debug('Fetching topic by name', topicName);

      const { data, error } = await supabase
        .from('notification_topics')
        .select('*')
        .eq('topic_name', topicName)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not found
          this.logger.debug('Topic not found', topicName);
          return null;
        }
        this.logger.error('Failed to fetch topic', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      this.logger.debug('Topic fetched successfully', topicName);
      return data;
    } catch (error) {
      this.logger.error('Error in getTopicByName', error);
      throw error;
    }
  }

  async upsertTopicSubscription(
    subscription: Omit<UserTopicSubscriptionRow, 'id'>
  ): Promise<boolean> {
    try {
      this.logger.debug('Upserting topic subscription', subscription);

      const { error } = await supabase
        .from('user_topic_subscriptions')
        .upsert(subscription);

      if (error) {
        this.logger.error('Failed to upsert subscription', error.message);
        return false;
      }

      this.logger.info('Topic subscription upserted successfully', subscription);
      return true;
    } catch (error) {
      this.logger.error('Error in upsertTopicSubscription', error);
      return false;
    }
  }

  // =============================================
  // ANALYTICS
  // =============================================

  async getNotificationsInPeriod(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<NotificationRow[]> {
    try {
      this.logger.debug('Fetching notifications in period', userId, startDate, endDate);

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        this.logger.error('Failed to fetch notifications in period', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      this.logger.debug('Notifications in period fetched successfully', data.length);
      return data;
    } catch (error) {
      this.logger.error('Error in getNotificationsInPeriod', error);
      throw error;
    }
  }

  async getUserNotificationSummary(userId: string): Promise<{
    total_notifications: number;
    unread_notifications: number;
    urgent_notifications: number;
    recent_activity?: string;
  } | null> {
    try {
      this.logger.debug('Fetching user notification summary', userId);

      const { data, error } = await supabase
        .rpc('get_user_notification_summary', { user_uuid: userId });

      if (error) {
        this.logger.error('Failed to fetch notification summary', error.message);
        throw new Error(`Database error: ${error.message}`);
      }

      const summary = data?.[0] || null;
      this.logger.debug('Notification summary fetched successfully', summary);
      return summary;
    } catch (error) {
      this.logger.error('Error in getUserNotificationSummary', error);
      throw error;
    }
  }
} 