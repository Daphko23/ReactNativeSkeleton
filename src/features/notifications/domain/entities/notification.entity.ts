export interface PushNotificationMessage {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: Date;
  isRead?: boolean;
  priority?: 'high' | 'normal' | 'low';
  category?: string;
  imageUrl?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  topics: string[];
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showPreview: boolean;
}

export interface TopicSubscription {
  topic: string;
  subscribed: boolean;
  subscribedAt?: Date;
} 