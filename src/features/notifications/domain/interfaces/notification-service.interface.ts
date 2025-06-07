export interface NotificationService {
  initialize(): Promise<void>;
  requestPermission(): Promise<boolean>;
  getToken(): Promise<string | null>;
  subscribeToTopic(topic: string): Promise<void>;
  unsubscribeFromTopic(topic: string): Promise<void>;
  sendNotification(
    to: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void>;
  clearAllNotifications(): Promise<void>;
} 