/**
 * AlertService - Enterprise Alert Management
 * Provides consistent, themed, and accessible alert dialogs
 */

import { Alert, AlertButton } from 'react-native';
import i18n from '../../core/i18n/i18n';

export interface AlertConfig {
  title: string;
  message: string;
  buttons?: AlertButton[];
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  onPress?: () => void;
  onCancel?: () => void;
}

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export class AlertService {
  /**
   * Get translation - uses i18n directly
   */
  private static t(key: string): string {
    // If key contains a namespace (e.g., 'profile.editScreen.success'), 
    // use it with explicit namespace
    if (key.includes('.') && !key.startsWith('common.')) {
      const [namespace, ...keyParts] = key.split('.');
      const actualKey = keyParts.join('.');
      return i18n.t(actualKey, { ns: namespace });
    }
    
    // Remove 'common.' prefix since common is the default namespace
    const cleanKey = key.startsWith('common.') ? key.replace('common.', '') : key;
    return i18n.t(cleanKey);
  }

  /**
   * Show a simple info alert
   */
  static info(config: Omit<AlertConfig, 'type'>) {
    Alert.alert(
      config.title,
      config.message,
      config.buttons || [
        {
          text: AlertService.t('ok'),
          onPress: config.onPress
        }
      ]
    );
  }

  /**
   * Show a success alert
   */
  static success(config: Omit<AlertConfig, 'type'>) {
    Alert.alert(
      `✅ ${config.title}`,
      config.message,
      config.buttons || [
        {
          text: AlertService.t('ok'),
          onPress: config.onPress
        }
      ]
    );
  }

  /**
   * Show a warning alert
   */
  static warning(config: Omit<AlertConfig, 'type'>) {
    Alert.alert(
      `⚠️ ${config.title}`,
      config.message,
      config.buttons || [
        {
          text: AlertService.t('ok'),
          onPress: config.onPress
        }
      ]
    );
  }

  /**
   * Show an error alert
   */
  static error(config: Omit<AlertConfig, 'type'>) {
    Alert.alert(
      `❌ ${config.title}`,
      config.message,
      config.buttons || [
        {
          text: AlertService.t('ok'),
          onPress: config.onPress
        }
      ]
    );
  }

  /**
   * Show a confirmation dialog
   */
  static confirm(config: ConfirmConfig) {
    Alert.alert(
      config.title,
      config.message,
      [
        {
          text: config.cancelText || AlertService.t('cancel'),
          style: 'cancel',
          onPress: config.onCancel
        },
        {
          text: config.confirmText || AlertService.t('ok'),
          style: config.destructive ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await config.onConfirm();
            } catch (error) {
              AlertService.error({
                title: AlertService.t('error'),
                message: error instanceof Error ? error.message : AlertService.t('unexpectedError')
              });
            }
          }
        }
      ]
    );
  }

  /**
   * Show unsaved changes confirmation
   */
  static confirmUnsavedChanges(onDiscard: () => void, onCancel?: () => void) {
    AlertService.confirm({
      title: AlertService.t('profile.editScreen.unsavedChanges'),
      message: AlertService.t('profile.editScreen.discardChanges'),
      confirmText: AlertService.t('discard'),
      destructive: true,
      onConfirm: onDiscard,
      onCancel
    });
  }

  /**
   * Show profile update success
   */
  static profileUpdateSuccess(onOk?: () => void) {
    AlertService.success({
      title: AlertService.t('profile.editScreen.success'),
      message: AlertService.t('profile.editScreen.profileUpdated'),
      onPress: onOk
    });
  }

  /**
   * Show profile update error
   */
  static profileUpdateError(error?: string) {
    AlertService.error({
      title: AlertService.t('profile.editScreen.error'),
      message: error || AlertService.t('profile.editScreen.updateFailed')
    });
  }

  /**
   * Show loading error with retry option
   */
  static loadingError(onRetry?: () => void) {
    Alert.alert(
      AlertService.t('error'),
      AlertService.t('loadingError'),
      [
        {
          text: AlertService.t('cancel'),
          style: 'cancel'
        },
        ...(onRetry ? [{
          text: AlertService.t('retry'),
          onPress: onRetry
        }] : [])
      ]
    );
  }

  /**
   * Show generic unexpected error
   */
  static unexpectedError(onOk?: () => void) {
    AlertService.error({
      title: AlertService.t('error'),
      message: AlertService.t('unexpectedError'),
      onPress: onOk
    });
  }
} 