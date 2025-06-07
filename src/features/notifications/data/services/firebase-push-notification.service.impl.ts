import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import { NotificationService } from '../../domain/interfaces/notification-service.interface';
import { PushNotificationMessage } from '../../domain/entities/notification.entity';

export class FirebasePushServiceImpl implements NotificationService {
  private fcmToken: string | null = null;

  async initialize(): Promise<void> {
    try {
      // Request permission for iOS and Android 13+
      await this.requestPermission();

      // Get FCM token
      this.fcmToken = await messaging().getToken();
      console.log('FCM Token:', this.fcmToken);

      // Listen for token refresh
      messaging().onTokenRefresh(token => {
        console.log('FCM Token refreshed:', token);
        this.fcmToken = token;
        // TODO: Send updated token to your backend
      });

      // Set up message handlers
      this.setupMessageHandlers();
    } catch (error) {
      console.error('Failed to initialize Firebase messaging:', error);
      throw error;
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        
        if (!enabled) {
          console.log('Push notification permission denied');
          return false;
        }
      } else if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.fcmToken) {
      this.fcmToken = await messaging().getToken();
    }
    return this.fcmToken;
  }

  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to subscribe to topic ${topic}:`, error);
      throw error;
    }
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to unsubscribe from topic ${topic}:`, error);
      throw error;
    }
  }

  private setupMessageHandlers(): void {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      await this.handleBackgroundMessage(remoteMessage);
    });

    // Handle foreground messages
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      await this.handleForegroundMessage(remoteMessage);
    });

    // Handle notification opened app
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      this.handleNotificationOpened(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
          this.handleNotificationOpened(remoteMessage);
        }
      });
  }

  private async handleBackgroundMessage(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ): Promise<void> {
    // Handle background message logic
    console.log('Processing background message:', remoteMessage.data);
  }

  private async handleForegroundMessage(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ): Promise<void> {
    // Show in-app notification or update UI
    const message: PushNotificationMessage = {
      id: remoteMessage.messageId || Date.now().toString(),
      title: remoteMessage.notification?.title || 'Benachrichtigung',
      body: remoteMessage.notification?.body || '',
      data: remoteMessage.data,
      timestamp: new Date(),
    };

    // TODO: Show local notification or update app state
    console.log('Foreground message:', message);
  }

  private handleNotificationOpened(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ): void {
    // Handle navigation based on notification data
    if (remoteMessage.data?.screen) {
      // TODO: Navigate to specific screen
      console.log('Navigate to:', remoteMessage.data.screen);
    }
  }

  async sendNotification(
    to: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    // This would typically be called from your backend
    // Here's the structure for your server implementation
    console.log('Send notification (implement on backend):', {
      to,
      notification: { title, body },
      data,
    });
  }

  async clearAllNotifications(): Promise<void> {
    // Clear local notifications if needed
    console.log('Clearing all notifications');
  }
} 