import { useState, useCallback } from 'react';
import { notificationContainer } from '../../application/di/notification.container';

export interface UseNotificationsReturn {
  isInitialized: boolean;
  hasPermission: boolean;
  fcmToken: string | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  subscribeToTopic: (topic: string) => Promise<void>;
  unsubscribeFromTopic: (topic: string) => Promise<void>;
  initializeNotifications: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeNotificationsUseCase = notificationContainer.initializeNotificationsUseCase;
  const subscribeToTopicUseCase = notificationContainer.subscribeToTopicUseCase;
  const notificationService = notificationContainer.notificationService;

  const initializeNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await initializeNotificationsUseCase.execute();
      const permission = await notificationService.requestPermission();
      const token = await notificationService.getToken();
      
      setHasPermission(permission);
      setFcmToken(token);
      setIsInitialized(true);
      
      console.log('Notifications initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize notifications';
      setError(errorMessage);
      console.error('Failed to initialize notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [initializeNotificationsUseCase, notificationService]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const permission = await notificationService.requestPermission();
      setHasPermission(permission);
      
      if (permission) {
        const token = await notificationService.getToken();
        setFcmToken(token);
      }
      
      return permission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission';
      setError(errorMessage);
      console.error('Failed to request permission:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [notificationService]);

  const subscribeToTopic = useCallback(async (topic: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await subscribeToTopicUseCase.execute(topic);
      console.log(`Successfully subscribed to topic: ${topic}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to subscribe to topic: ${topic}`;
      setError(errorMessage);
      console.error('Failed to subscribe to topic:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [subscribeToTopicUseCase]);

  const unsubscribeFromTopic = useCallback(async (topic: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await notificationService.unsubscribeFromTopic(topic);
      console.log(`Successfully unsubscribed from topic: ${topic}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to unsubscribe from topic: ${topic}`;
      setError(errorMessage);
      console.error('Failed to unsubscribe from topic:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notificationService]);

  return {
    isInitialized,
    hasPermission,
    fcmToken,
    isLoading,
    error,
    requestPermission,
    subscribeToTopic,
    unsubscribeFromTopic,
    initializeNotifications,
  };
}; 