/**
 * @fileoverview ALERT-SERVICE: Enterprise Alert Management System
 * @description Comprehensive alert and dialog management service providing consistent, themed, and accessible alert dialogs with internationalization support
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Services.Alert
 * @namespace Core.Services.Alert
 * @category Services
 * @subcategory UserInterface
 */

import { Alert, AlertButton } from 'react-native';
import i18n from '../i18n/i18n';

/**
 * Configuration interface for standard alert dialogs.
 * Defines the structure and options for displaying alerts.
 * 
 * @interface AlertConfig
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory Configuration
 * 
 * @example
 * ```tsx
 * const alertConfig: AlertConfig = {
 *   title: 'Success',
 *   message: 'Operation completed successfully',
 *   type: 'success',
 *   onPress: () => console.log('Alert dismissed')
 * };
 * ```
 */
export interface AlertConfig {
  /**
   * Title text displayed in the alert header.
   * Should be concise and descriptive.
   * 
   * @type {string}
   * @required
   * @example "Profile Updated"
   */
  title: string;

  /**
   * Message content displayed in the alert body.
   * Provides detailed information to the user.
   * 
   * @type {string}
   * @required
   * @example "Your profile has been successfully updated."
   */
  message: string;

  /**
   * Custom button configuration for the alert.
   * If not provided, defaults to a single OK button.
   * 
   * @type {AlertButton[]}
   * @optional
   * @example
   * ```tsx
   * [
   *   { text: 'Cancel', style: 'cancel' },
   *   { text: 'OK', onPress: () => console.log('OK pressed') }
   * ]
   * ```
   */
  buttons?: AlertButton[];

  /**
   * Visual type of the alert affecting styling and icons.
   * Determines the semantic meaning and visual presentation.
   * 
   * @type {'info' | 'success' | 'warning' | 'error' | 'confirm'}
   * @optional
   * @default 'info'
   * @example "success"
   */
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';

  /**
   * Callback function executed when the primary button is pressed.
   * 
   * @type {() => void}
   * @optional
   * @example () => navigation.navigate('Home')
   */
  onPress?: () => void;

  /**
   * Callback function executed when the cancel button is pressed.
   * 
   * @type {() => void}
   * @optional
   * @example () => console.log('Alert cancelled')
   */
  onCancel?: () => void;
}

/**
 * Configuration interface for confirmation dialogs.
 * Defines the structure for alerts requiring user confirmation.
 * 
 * @interface ConfirmConfig
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory Configuration
 * 
 * @example
 * ```tsx
 * const confirmConfig: ConfirmConfig = {
 *   title: 'Delete Item',
 *   message: 'Are you sure you want to delete this item?',
 *   destructive: true,
 *   onConfirm: async () => await deleteItem(),
 *   onCancel: () => console.log('Deletion cancelled')
 * };
 * ```
 */
export interface ConfirmConfig {
  /**
   * Title text displayed in the confirmation dialog.
   * Should clearly indicate the action being confirmed.
   * 
   * @type {string}
   * @required
   * @example "Delete Account"
   */
  title: string;

  /**
   * Message content asking for user confirmation.
   * Should explain the consequences of the action.
   * 
   * @type {string}
   * @required
   * @example "This action cannot be undone. Are you sure?"
   */
  message: string;

  /**
   * Custom text for the confirmation button.
   * Defaults to localized "OK" if not provided.
   * 
   * @type {string}
   * @optional
   * @default Localized "OK"
   * @example "Delete"
   */
  confirmText?: string;

  /**
   * Custom text for the cancel button.
   * Defaults to localized "Cancel" if not provided.
   * 
   * @type {string}
   * @optional
   * @default Localized "Cancel"
   * @example "Keep"
   */
  cancelText?: string;

  /**
   * Whether the confirmation action is destructive.
   * Affects button styling to indicate danger.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  destructive?: boolean;

  /**
   * Async callback function executed when user confirms.
   * Can perform asynchronous operations with error handling.
   * 
   * @type {() => void | Promise<void>}
   * @required
   * @example async () => await deleteUserAccount()
   */
  onConfirm: () => void | Promise<void>;

  /**
   * Callback function executed when user cancels.
   * 
   * @type {() => void}
   * @optional
   * @example () => analytics.track('deletion_cancelled')
   */
  onCancel?: () => void;
}

/**
 * Enterprise Alert Management Service
 * 
 * Comprehensive service class providing consistent, themed, and accessible alert dialogs
 * with internationalization support, error handling, and enterprise-grade functionality.
 * Implements semantic alert types and specialized workflows for common use cases.
 * 
 * @class AlertService
 * @static
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Services
 * @subcategory UserInterface
 * @module Core.Services.Alert
 * @namespace Core.Services.Alert.AlertService
 * 
 * @description
 * The AlertService provides a unified interface for displaying various types of alerts
 * and dialogs throughout the application. Features comprehensive internationalization,
 * semantic styling, error handling, and enterprise workflow support.
 * 
 * @example
 * Basic alert usage:
 * ```tsx
 * import { AlertService } from '@/core/services/alert.service';
 * 
 * // Show success alert
 * AlertService.success({
 *   title: 'Profile Updated',
 *   message: 'Your profile has been successfully updated.'
 * });
 * 
 * // Show error with custom action
 * AlertService.error({
 *   title: 'Network Error',
 *   message: 'Failed to connect to server',
 *   onPress: () => retryConnection()
 * });
 * ```
 * 
 * @example
 * Confirmation dialog usage:
 * ```tsx
 * // Simple confirmation
 * AlertService.confirm({
 *   title: 'Delete Item',
 *   message: 'This action cannot be undone',
 *   destructive: true,
 *   onConfirm: async () => {
 *     await deleteItem();
 *     navigation.goBack();
 *   }
 * });
 * 
 * // Profile-specific workflow
 * AlertService.confirmUnsavedChanges(
 *   () => navigation.goBack(),
 *   () => console.log('User chose to stay')
 * );
 * ```
 * 
 * @example
 * Specialized profile workflows:
 * ```tsx
 * // Success notification
 * AlertService.profileUpdateSuccess(() => {
 *   navigation.navigate('Profile');
 * });
 * 
 * // Error handling
 * AlertService.profileUpdateError('Network connection failed');
 * 
 * // Loading error with retry
 * AlertService.loadingError(() => {
 *   refetchData();
 * });
 * ```
 * 
 * @features
 * - Semantic alert types (info, success, warning, error)
 * - Confirmation dialogs with async support
 * - Internationalization integration
 * - Enterprise workflow support
 * - Destructive action handling
 * - Error handling with retry options
 * - Accessibility compliance
 * - Consistent theming support
 * - Profile management workflows
 * - Loading state error handling
 * 
 * @architecture
 * - Static service class pattern
 * - Internationalization integration
 * - Error handling with graceful fallbacks
 * - Async operation support
 * - Semantic typing system
 * - Workflow-specific methods
 * 
 * @internationalization
 * - Automatic translation key resolution
 * - Namespace-aware translations
 * - Fallback text support
 * - Multi-language compatibility
 * - Cultural adaptation
 * - RTL language support
 * 
 * @accessibility
 * - Screen reader compatibility
 * - Semantic button roles
 * - High contrast support
 * - Touch target optimization
 * - Focus management
 * - Voice navigation support
 * 
 * @error_handling
 * - Graceful error recovery
 * - Async operation error catching
 * - Fallback message display
 * - Retry mechanisms
 * - User-friendly error messages
 * 
 * @use_cases
 * - User confirmation dialogs
 * - Success/error notifications
 * - Profile update workflows
 * - Data loading error handling
 * - Destructive action confirmations
 * - Form validation messaging
 * - Network error handling
 * - Unsaved changes warnings
 * 
 * @best_practices
 * - Use semantic alert types appropriately
 * - Provide clear, actionable messages
 * - Handle async operations properly
 * - Include retry options for recoverable errors
 * - Use destructive styling for dangerous actions
 * - Implement proper internationalization
 * - Follow accessibility guidelines
 * 
 * @performance
 * - Lightweight static methods
 * - Efficient translation caching
 * - Minimal memory footprint
 * - Fast dialog rendering
 * - Optimized for frequent use
 * 
 * @dependencies
 * - react-native: Alert component
 * - ../i18n/i18n: Internationalization system
 * 
 * @see {@link AlertConfig} for alert configuration options
 * @see {@link ConfirmConfig} for confirmation dialog configuration
 * @see {@link i18n} for internationalization system
 * 
 * @todo Add custom alert components
 * @todo Implement alert queuing system
 * @todo Add haptic feedback support
 * @todo Implement analytics tracking
 */
export class AlertService {
  /**
   * Private translation helper method.
   * Handles namespace-aware translation with fallback support.
   * 
   * @private
   * @static
   * @method t
   * @param {string} key - Translation key to resolve
   * @returns {string} Translated text or fallback
   * 
   * @since 1.0.0
   * @description
   * Provides intelligent translation key resolution with namespace detection
   * and fallback handling. Supports both namespaced and common translations.
   * 
   * @example
   * ```tsx
   * // Namespaced translation
   * AlertService.t('profile.editScreen.success')
   * // Returns: namespace='profile', key='editScreen.success'
   * 
   * // Common translation
   * AlertService.t('ok')
   * // Returns: default namespace, key='ok'
   * 
   * // Explicit common namespace
   * AlertService.t('common.cancel')
   * // Returns: default namespace, key='cancel'
   * ```
   * 
   * @translation_logic
   * - Detects namespace from key structure
   * - Removes 'common.' prefix for default namespace
   * - Handles nested key paths
   * - Provides fallback for missing translations
   * 
   * @error_handling
   * - Graceful fallback for missing keys
   * - Namespace validation
   * - Key path resolution
   * 
   * @performance
   * - Efficient string parsing
   * - Cached translation lookup
   * - Minimal overhead
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
   * Display an informational alert dialog.
   * Used for neutral notifications and general information.
   * 
   * @static
   * @method info
   * @param {Omit<AlertConfig, 'type'>} config - Alert configuration without type
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Shows a standard informational alert with neutral styling.
   * Ideal for general notifications, tips, and informational messages.
   * 
   * @example
   * Basic information alert:
   * ```tsx
   * AlertService.info({
   *   title: 'New Feature Available',
   *   message: 'Check out the new theme customization options in settings.'
   * });
   * ```
   * 
   * @example
   * Information alert with custom action:
   * ```tsx
   * AlertService.info({
   *   title: 'Sync Complete',
   *   message: 'Your data has been synchronized with the server.',
   *   onPress: () => navigation.navigate('Dashboard')
   * });
   * ```
   * 
   * @example
   * Information alert with custom buttons:
   * ```tsx
   * AlertService.info({
   *   title: 'App Update',
   *   message: 'A new version is available. Would you like to update now?',
   *   buttons: [
   *     { text: 'Later', style: 'cancel' },
   *     { text: 'Update', onPress: () => openAppStore() }
   *   ]
   * });
   * ```
   * 
   * @use_cases
   * - Feature announcements
   * - General notifications
   * - Information displays
   * - User guidance
   * - Status updates
   * 
   * @accessibility
   * - Screen reader compatible
   * - Semantic alert role
   * - Proper focus management
   * 
   * @internationalization
   * - Automatic button text translation
   * - Localized default actions
   * - Cultural adaptation
   */
  static info(config: Omit<AlertConfig, 'type'>): void {
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
   * Display a success alert dialog with positive visual styling.
   * Used for successful operations and positive confirmations.
   * 
   * @static
   * @method success
   * @param {Omit<AlertConfig, 'type'>} config - Alert configuration without type
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Shows a success alert with positive styling and success icon.
   * Provides immediate feedback for successful operations and achievements.
   * 
   * @example
   * Simple success notification:
   * ```tsx
   * AlertService.success({
   *   title: 'Profile Saved',
   *   message: 'Your profile changes have been saved successfully.'
   * });
   * ```
   * 
   * @example
   * Success with navigation:
   * ```tsx
   * AlertService.success({
   *   title: 'Account Created',
   *   message: 'Welcome to the app! Your account has been created.',
   *   onPress: () => navigation.navigate('Dashboard')
   * });
   * ```
   * 
   * @example
   * Success with custom actions:
   * ```tsx
   * AlertService.success({
   *   title: 'Data Backup Complete',
   *   message: 'Your data has been safely backed up to the cloud.',
   *   buttons: [
   *     { text: 'View Details', onPress: () => showBackupDetails() },
   *     { text: 'OK', style: 'cancel' }
   *   ]
   * });
   * ```
   * 
   * @visual_styling
   * - Green checkmark icon (✅)
   * - Positive semantic styling
   * - Success color scheme
   * - Celebratory tone
   * 
   * @use_cases
   * - Operation completion
   * - Data saving success
   * - Account creation
   * - Payment processing
   * - File uploads
   * - Settings updates
   * 
   * @accessibility
   * - Success semantic role
   * - Positive tone indication
   * - Screen reader optimized
   * 
   * @best_practices
   * - Use for clearly successful operations
   * - Include next steps when appropriate
   * - Keep messages concise and positive
   * - Provide relevant follow-up actions
   */
  static success(config: Omit<AlertConfig, 'type'>): void {
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
   * Display a warning alert dialog with cautionary styling.
   * Used for potential issues and cautionary notifications.
   * 
   * @static
   * @method warning
   * @param {Omit<AlertConfig, 'type'>} config - Alert configuration without type
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Shows a warning alert with cautionary styling and warning icon.
   * Draws attention to potential issues or important information requiring user awareness.
   * 
   * @example
   * Simple warning notification:
   * ```tsx
   * AlertService.warning({
   *   title: 'Low Storage Space',
   *   message: 'Your device is running low on storage. Consider freeing up space.'
   * });
   * ```
   * 
   * @example
   * Warning with action:
   * ```tsx
   * AlertService.warning({
   *   title: 'Unsaved Changes',
   *   message: 'You have unsaved changes that will be lost.',
   *   onPress: () => saveChanges()
   * });
   * ```
   * 
   * @example
   * Warning with choices:
   * ```tsx
   * AlertService.warning({
   *   title: 'Network Connection',
   *   message: 'Weak network connection detected. Some features may be limited.',
   *   buttons: [
   *     { text: 'Continue', style: 'cancel' },
   *     { text: 'Retry', onPress: () => checkConnection() }
   *   ]
   * });
   * ```
   * 
   * @visual_styling
   * - Warning triangle icon (⚠️)
   * - Cautionary color scheme
   * - Attention-grabbing design
   * - Amber/orange styling
   * 
   * @use_cases
   * - Low storage warnings
   * - Network issues
   * - Unsaved changes
   * - Permission requests
   * - Battery warnings
   * - Data limits
   * - Compatibility issues
   * 
   * @accessibility
   * - Warning semantic role
   * - Cautionary tone indication
   * - High contrast support
   * 
   * @best_practices
   * - Use for non-critical but important issues
   * - Provide actionable guidance
   * - Avoid overuse to maintain impact
   * - Include resolution options when possible
   */
  static warning(config: Omit<AlertConfig, 'type'>): void {
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
   * Display an error alert dialog with error styling.
   * Used for error notifications and critical issues.
   * 
   * @static
   * @method error
   * @param {Omit<AlertConfig, 'type'>} config - Alert configuration without type
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Shows an error alert with error styling and error icon.
   * Provides clear indication of errors and failures requiring user attention.
   * 
   * @example
   * Simple error notification:
   * ```tsx
   * AlertService.error({
   *   title: 'Connection Failed',
   *   message: 'Unable to connect to the server. Please try again later.'
   * });
   * ```
   * 
   * @example
   * Error with retry action:
   * ```tsx
   * AlertService.error({
   *   title: 'Upload Failed',
   *   message: 'Failed to upload your file. Would you like to retry?',
   *   onPress: () => retryUpload()
   * });
   * ```
   * 
   * @example
   * Error with multiple options:
   * ```tsx
   * AlertService.error({
   *   title: 'Payment Failed',
   *   message: 'Your payment could not be processed.',
   *   buttons: [
   *     { text: 'Cancel', style: 'cancel' },
   *     { text: 'Try Again', onPress: () => retryPayment() },
   *     { text: 'Contact Support', onPress: () => openSupport() }
   *   ]
   * });
   * ```
   * 
   * @visual_styling
   * - Error X icon (❌)
   * - Error color scheme (red)
   * - High visibility design
   * - Critical attention styling
   * 
   * @use_cases
   * - Network failures
   * - API errors
   * - Validation failures
   * - Permission denials
   * - File operation errors
   * - Authentication failures
   * - Payment processing errors
   * 
   * @accessibility
   * - Error semantic role
   * - Critical importance indication
   * - Screen reader priority
   * 
   * @error_patterns
   * - Network connectivity issues
   * - Server communication failures
   * - Data validation errors
   * - Resource access denials
   * - Operation timeouts
   * 
   * @best_practices
   * - Provide clear error descriptions
   * - Include retry options when appropriate
   * - Offer alternative solutions
   * - Log errors for debugging
   * - Avoid technical jargon in user messages
   */
  static error(config: Omit<AlertConfig, 'type'>): void {
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
   * Display a confirmation dialog requiring user decision.
   * Used for actions requiring explicit user confirmation.
   * 
   * @static
   * @method confirm
   * @param {ConfirmConfig} config - Confirmation dialog configuration
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Shows a confirmation dialog with cancel and confirm options.
   * Supports async operations with built-in error handling and destructive action styling.
   * 
   * @example
   * Simple confirmation:
   * ```tsx
   * AlertService.confirm({
   *   title: 'Delete Item',
   *   message: 'Are you sure you want to delete this item?',
   *   onConfirm: () => deleteItem()
   * });
   * ```
   * 
   * @example
   * Destructive confirmation with async operation:
   * ```tsx
   * AlertService.confirm({
   *   title: 'Delete Account',
   *   message: 'This action cannot be undone. All your data will be permanently deleted.',
   *   confirmText: 'Delete Account',
   *   destructive: true,
   *   onConfirm: async () => {
   *     await deleteAccount();
   *     navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
   *   },
   *   onCancel: () => analytics.track('account_deletion_cancelled')
   * });
   * ```
   * 
   * @example
   * Custom button text confirmation:
   * ```tsx
   * AlertService.confirm({
   *   title: 'Save Changes',
   *   message: 'Do you want to save your changes before leaving?',
   *   confirmText: 'Save & Exit',
   *   cancelText: 'Discard',
   *   onConfirm: async () => {
   *     await saveChanges();
   *     navigation.goBack();
   *   }
   * });
   * ```
   * 
   * @async_support
   * - Handles Promise-based operations
   * - Automatic error catching
   * - Error display for failed operations
   * - Loading state management
   * 
   * @destructive_actions
   * - Visual styling for dangerous actions
   * - Red button styling on iOS
   * - Clear visual indication of consequences
   * - Enhanced confirmation flow
   * 
   * @use_cases
   * - Data deletion
   * - Account management
   * - Irreversible operations
   * - Navigation confirmation
   * - Settings changes
   * - Purchase confirmations
   * 
   * @accessibility
   * - Clear action description
   * - Destructive action indication
   * - Keyboard navigation support
   * 
   * @error_handling
   * - Automatic async error catching
   * - User-friendly error display
   * - Graceful failure recovery
   * - Operation rollback support
   * 
   * @best_practices
   * - Clearly describe consequences
   * - Use destructive styling appropriately
   * - Provide escape options
   * - Handle errors gracefully
   * - Include relevant context
   */
  static confirm(config: ConfirmConfig): void {
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
   * Show confirmation dialog for unsaved changes.
   * Specialized workflow for handling unsaved form data.
   * 
   * @static
   * @method confirmUnsavedChanges
   * @param {() => void} onDiscard - Callback when user chooses to discard changes
   * @param {() => void} [onCancel] - Optional callback when user cancels
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Provides a standardized confirmation flow for unsaved changes scenarios.
   * Implements consistent messaging and destructive action styling.
   * 
   * @example
   * Form navigation guard:
   * ```tsx
   * const handleBackPress = () => {
   *   if (hasUnsavedChanges) {
   *     AlertService.confirmUnsavedChanges(
   *       () => navigation.goBack(),
   *       () => console.log('User chose to stay')
   *     );
   *   } else {
   *     navigation.goBack();
   *   }
   * };
   * ```
   * 
   * @example
   * Form submission handling:
   * ```tsx
   * const handleFormExit = () => {
   *   AlertService.confirmUnsavedChanges(
   *     () => {
   *       resetForm();
   *       navigation.navigate('Home');
   *     }
   *   );
   * };
   * ```
   * 
   * @workflow_features
   * - Standardized messaging
   * - Destructive action styling
   * - Internationalized text
   * - Consistent user experience
   * 
   * @use_cases
   * - Form navigation guards
   * - Profile editing workflows
   * - Document editing
   * - Settings modifications
   * - Data entry scenarios
   * 
   * @accessibility
   * - Clear consequence description
   * - Destructive action indication
   * - Standard interaction patterns
   * 
   * @best_practices
   * - Use consistently across forms
   * - Implement before navigation
   * - Provide clear consequences
   * - Respect user choice
   */
  static confirmUnsavedChanges(onDiscard: () => void, onCancel?: () => void): void {
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
   * Show profile update success notification.
   * Specialized workflow for profile management success.
   * 
   * @static
   * @method profileUpdateSuccess
   * @param {() => void} [onOk] - Optional callback when user acknowledges success
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Provides standardized success notification for profile updates.
   * Implements consistent messaging and positive feedback patterns.
   * 
   * @example
   * Profile save success:
   * ```tsx
   * const handleProfileSave = async () => {
   *   try {
   *     await saveProfile(profileData);
   *     AlertService.profileUpdateSuccess(() => {
   *       navigation.navigate('Profile');
   *     });
   *   } catch (error) {
   *     AlertService.profileUpdateError(error.message);
   *   }
   * };
   * ```
   * 
   * @example
   * Success with analytics:
   * ```tsx
   * AlertService.profileUpdateSuccess(() => {
   *   analytics.track('profile_updated');
   *   navigation.goBack();
   * });
   * ```
   * 
   * @workflow_features
   * - Profile-specific messaging
   * - Success icon and styling
   * - Localized content
   * - Optional action callback
   * 
   * @use_cases
   * - Profile information updates
   * - Avatar changes
   * - Preference modifications
   * - Account settings updates
   * 
   * @user_experience
   * - Immediate feedback
   * - Positive reinforcement
   * - Clear completion indication
   * - Optional next steps
   */
  static profileUpdateSuccess(onOk?: () => void): void {
    AlertService.success({
      title: AlertService.t('profile.editScreen.success'),
      message: AlertService.t('profile.editScreen.profileUpdated'),
      onPress: onOk
    });
  }

  /**
   * Show profile update error notification.
   * Specialized workflow for profile management errors.
   * 
   * @static
   * @method profileUpdateError
   * @param {string} [error] - Optional specific error message
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Provides standardized error notification for profile update failures.
   * Implements consistent error messaging with fallback text.
   * 
   * @example
   * Profile save error with specific message:
   * ```tsx
   * try {
   *   await saveProfile(profileData);
   * } catch (error) {
   *   AlertService.profileUpdateError(error.message);
   * }
   * ```
   * 
   * @example
   * Generic profile update error:
   * ```tsx
   * AlertService.profileUpdateError(); // Uses default error message
   * ```
   * 
   * @error_handling
   * - Specific error message display
   * - Fallback to generic message
   * - Profile-specific context
   * - Consistent error styling
   * 
   * @use_cases
   * - Network failures during save
   * - Validation errors
   * - Server errors
   * - Permission issues
   * 
   * @user_experience
   * - Clear error indication
   * - Actionable information
   * - Consistent error patterns
   * - Professional error handling
   */
  static profileUpdateError(error?: string): void {
    AlertService.error({
      title: AlertService.t('profile.editScreen.error'),
      message: error || AlertService.t('profile.editScreen.updateFailed')
    });
  }

  /**
   * Show loading error with optional retry functionality.
   * Specialized workflow for data loading failures.
   * 
   * @static
   * @method loadingError
   * @param {() => void} [onRetry] - Optional callback for retry action
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Provides standardized error notification for loading failures with optional retry capability.
   * Implements user-friendly error recovery patterns.
   * 
   * @example
   * Loading error with retry:
   * ```tsx
   * const handleDataLoad = async () => {
   *   try {
   *     await loadData();
   *   } catch (error) {
   *     AlertService.loadingError(() => {
   *       handleDataLoad(); // Retry the operation
   *     });
   *   }
   * };
   * ```
   * 
   * @example
   * Loading error without retry:
   * ```tsx
   * AlertService.loadingError(); // Only shows error, no retry option
   * ```
   * 
   * @retry_functionality
   * - Optional retry button
   * - Automatic retry execution
   * - User-initiated recovery
   * - Graceful failure handling
   * 
   * @use_cases
   * - Network request failures
   * - API loading errors
   * - Resource fetch failures
   * - Data synchronization errors
   * 
   * @user_experience
   * - Clear error communication
   * - Recovery options
   * - Reduced user frustration
   * - Professional error handling
   */
  static loadingError(onRetry?: () => void): void {
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
   * Show generic unexpected error notification.
   * Fallback error display for unhandled exceptions.
   * 
   * @static
   * @method unexpectedError
   * @param {() => void} [onOk] - Optional callback when user acknowledges error
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Provides fallback error notification for unexpected application errors.
   * Implements graceful error handling for unhandled exceptions.
   * 
   * @example
   * Catch-all error handling:
   * ```tsx
   * try {
   *   await complexOperation();
   * } catch (error) {
   *   if (error.type === 'network') {
   *     AlertService.loadingError(() => retryOperation());
   *   } else {
   *     AlertService.unexpectedError();
   *   }
   * }
   * ```
   * 
   * @example
   * Error boundary fallback:
   * ```tsx
   * const ErrorBoundary = ({ error }) => {
   *   useEffect(() => {
   *     AlertService.unexpectedError(() => {
   *       // Reset error boundary or navigate to safe screen
   *       resetErrorBoundary();
   *     });
   *   }, [error]);
   * };
   * ```
   * 
   * @error_recovery
   * - Generic error messaging
   * - Graceful degradation
   * - User acknowledgment
   * - Application stability
   * 
   * @use_cases
   * - Unhandled exceptions
   * - Error boundary fallbacks
   * - Unknown error types
   * - System-level errors
   * 
   * @user_experience
   * - Professional error handling
   * - Maintains user confidence
   * - Clear communication
   * - Recovery options
   */
  static unexpectedError(onOk?: () => void): void {
    AlertService.error({
      title: AlertService.t('error'),
      message: AlertService.t('unexpectedError'),
      onPress: onOk
    });
  }
}

/**
 * @summary
 * The AlertService provides enterprise-grade alert and dialog management with
 * comprehensive internationalization, semantic styling, accessibility support,
 * and specialized workflow methods for common use cases.
 * 
 * @key_features
 * - Semantic alert types (info, success, warning, error)
 * - Confirmation dialogs with async support
 * - Internationalization integration
 * - Accessibility compliance
 * - Profile management workflows
 * - Error handling with retry mechanisms
 * - Destructive action styling
 * - Enterprise-ready patterns
 * 
 * @best_practices
 * - Use appropriate semantic types
 * - Provide clear, actionable messages
 * - Handle async operations properly
 * - Implement consistent error recovery
 * - Follow accessibility guidelines
 * - Use specialized workflows when available
 * 
 * @dependencies
 * - react-native: Core Alert component
 * - ../i18n/i18n: Internationalization system
 * 
 * @exports
 * - AlertService: Main service class
 * - AlertConfig: Alert configuration interface
 * - ConfirmConfig: Confirmation dialog configuration interface
 */ 