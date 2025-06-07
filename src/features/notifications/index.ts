/**
 * Notifications Feature - Main Export Index
 * Central export point for the Notifications feature
 */

// === APPLICATION LAYER ===
// Use Cases
export { InitializeNotificationsUseCase } from './application/usecases/initialize-notifications.usecase';
export { SubscribeToTopicUseCase } from './application/usecases/subscribe-to-topic.usecase';
export { ClearNotificationsUseCase } from './application/usecases/clear-notifications.usecase';

// === PRESENTATION LAYER ===
// Hooks
export * from './presentation/hooks/use-notifications.hook';

// === DATA LAYER ===
// Services
export * from './data/services/firebase-push-notification.service.impl';

// === DOMAIN LAYER ===
// Entities
export * from './domain/entities/notification.entity';

// Interfaces
export * from './domain/interfaces/notification-service.interface';

// === DEPENDENCY INJECTION ===
export * from './application/di/notification.container';

// === FEATURE LIFECYCLE ===
export const NotificationsFeature = {
  // Feature metadata
  name: 'Notifications',
  version: '2.0.0', // Updated version for refactored Use Cases
  description: 'Enterprise push notification management with Clean Architecture and modular Use Cases',
  
  // Feature capabilities
  capabilities: {
    // Core functionality
    pushNotifications: true,
    topicSubscription: true,
    notificationHistory: true,
    
    // Platform support
    firebaseIntegration: true,
    iOSSupport: true,
    androidSupport: true,
    
    // Advanced features
    customNotifications: true,
    notificationScheduling: false, // Future enhancement
    richNotifications: false, // Future enhancement
    
    // New modular architecture
    modularUseCases: true, // New
    functionalNaming: true, // New
    
    // Integration capabilities
    authIntegration: true,
    i18nSupport: true,
    permissionHandling: true,
  },
  
  // Extension points for customization
  extensionPoints: {
    // Custom notification types
    customNotificationTypes: [] as any[],
    
    // Custom handlers
    customMessageHandlers: {} as Record<string, (...args: any[]) => any>,
    
    // Custom permissions
    customPermissions: [] as string[],
    
    // Use Case customization - New
    customUseCases: {} as Record<string, any>,
  },
};

// Configuration interface
export interface NotificationsFeatureConfig {
  // Service configuration
  service?: {
    enableMockNotifications?: boolean;
    retryAttempts?: number;
    timeoutDuration?: number;
  };
  
  // UI configuration
  ui?: {
    showInAppNotifications?: boolean;
    notificationSound?: boolean;
    vibration?: boolean;
  };
  
  // Topic configuration
  topics?: {
    defaultTopics?: string[];
    autoSubscribe?: boolean;
    userSpecificTopics?: boolean;
  };
  
  // Platform configuration
  platforms?: {
    ios?: {
      enabled?: boolean;
      apnsKeyId?: string;
      teamId?: string;
    };
    android?: {
      enabled?: boolean;
      senderId?: string;
    };
  };
  
  // Integration configuration
  integrations?: {
    firebase?: {
      enabled?: boolean;
      projectId?: string;
    };
    analytics?: {
      enabled?: boolean;
      trackDelivery?: boolean;
      trackInteraction?: boolean;
    };
  };
}

// Default configuration
export const defaultNotificationsConfig: NotificationsFeatureConfig = {
  service: {
    enableMockNotifications: false,
    retryAttempts: 3,
    timeoutDuration: 10000, // 10 seconds
  },
  ui: {
    showInAppNotifications: true,
    notificationSound: true,
    vibration: true,
  },
  topics: {
    defaultTopics: ['general-updates', 'important-announcements'],
    autoSubscribe: true,
    userSpecificTopics: true,
  },
  platforms: {
    ios: {
      enabled: true,
    },
    android: {
      enabled: true,
    },
  },
  integrations: {
    firebase: {
      enabled: true,
    },
    analytics: {
      enabled: false,
      trackDelivery: false,
      trackInteraction: false,
    },
  },
};

// Utility exports
export const NotificationUtils = {
  // Topic management helpers
  formatUserTopic: (userId: string): string => `user-${userId}`,
  
  formatGroupTopic: (groupId: string): string => `group-${groupId}`,
  
  // Notification formatting
  formatNotificationTitle: (title: string, maxLength: number = 50): string => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  },
  
  formatNotificationBody: (body: string, maxLength: number = 120): string => {
    return body.length > maxLength ? `${body.substring(0, maxLength)}...` : body;
  },
  
  // Permission helpers
  checkNotificationPermission: async (): Promise<boolean> => {
    // Platform-specific permission checking logic would go here
    return true;
  },
  
  // Deep linking helpers
  parseNotificationData: (data: Record<string, any>): { screen?: string; params?: any } => {
    return {
      screen: data.screen,
      params: data.params ? JSON.parse(data.params) : undefined,
    };
  },
}; 