/**
 * @fileoverview ALERT-SERVICE: Enterprise Alert Management Service
 * @description Service für User Notifications, Alerts, Toast Messages
 * und Confirmation Dialogs mit Platform-spezifischen Implementations.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

import { Alert } from 'react-native';

export interface AlertOptions {
  title?: string;
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export class AlertService {
  /**
   * Show success message
   */
  static success(message: string, options?: Partial<AlertOptions>): void {
    Alert.alert(
      options?.title || 'Erfolg',
      message,
      [{ text: 'OK', style: 'default' }]
    );
  }

  /**
   * Show error message
   */
  static error(message: string, options?: Partial<AlertOptions>): void {
    Alert.alert(
      options?.title || 'Fehler',
      message,
      [{ text: 'OK', style: 'default' }]
    );
  }

  /**
   * Show warning message
   */
  static warning(message: string, options?: Partial<AlertOptions>): void {
    Alert.alert(
      options?.title || 'Warnung',
      message,
      [{ text: 'OK', style: 'default' }]
    );
  }

  /**
   * Show info message
   */
  static info(message: string, options?: Partial<AlertOptions>): void {
    Alert.alert(
      options?.title || 'Information',
      message,
      [{ text: 'OK', style: 'default' }]
    );
  }

  /**
   * Show confirmation dialog
   */
  static confirm(options: ConfirmationOptions): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        options.title,
        options.message,
        [
          {
            text: options.cancelText || 'Abbrechen',
            style: 'cancel',
            onPress: () => resolve(false)
          },
          {
            text: options.confirmText || 'Bestätigen',
            style: options.destructive ? 'destructive' : 'default',
            onPress: () => resolve(true)
          }
        ]
      );
    });
  }

  /**
   * Show toast message (simplified implementation)
   */
  static toast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    // For React Native, we'll use Alert as a simple toast
    // In a real app, you might use a library like react-native-toast-message
    const title = type === 'success' ? '✅' : 
                  type === 'error' ? '❌' : 
                  type === 'warning' ? '⚠️' : 'ℹ️';
    
    Alert.alert(title, message, [{ text: 'OK' }]);
  }
}