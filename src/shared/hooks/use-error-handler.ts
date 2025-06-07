/**
 * @fileoverview USE-ERROR-HANDLER-HOOK: Global Error Handling Hook
 * @description Custom React hook for consistent error handling and user feedback across the application
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseErrorHandler
 * @category Hooks
 * @subcategory Error
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * Error Information Interface
 * 
 * Defines the structure for storing comprehensive error information including
 * message, code, details, timestamp, and context for proper error tracking.
 * 
 * @interface ErrorInfo
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Error
 * 
 * @example
 * ```tsx
 * const errorInfo: ErrorInfo = {
 *   message: 'Network request failed',
 *   code: 'NETWORK_ERROR',
 *   details: { status: 500, url: '/api/users' },
 *   timestamp: new Date(),
 *   context: 'user-fetch'
 * };
 * ```
 */
export interface ErrorInfo {
  /**
   * The error message describing what went wrong.
   * 
   * @type {string}
   * @required
   * @example "Network request failed"
   * @example "Validation failed for email field"
   */
  message: string;

  /**
   * Optional error code for categorization.
   * 
   * @type {string}
   * @optional
   * @example "NETWORK_ERROR"
   * @example "VALIDATION_FAILED"
   * @example "UNAUTHORIZED"
   */
  code?: string;

  /**
   * Additional error details such as stack trace or metadata.
   * 
   * @type {any}
   * @optional
   * @example { status: 500, url: '/api/users' }
   * @example { field: 'email', value: 'invalid-email' }
   */
  details?: any;

  /**
   * When the error occurred.
   * 
   * @type {Date}
   * @required
   * @example new Date()
   */
  timestamp: Date;

  /**
   * Context where the error occurred for better debugging.
   * 
   * @type {string}
   * @optional
   * @example "user-fetch"
   * @example "profile-save"
   * @example "auth-login"
   */
  context?: string;
}

/**
 * Error Handler State Interface
 * 
 * Defines the internal state structure for the error handler including
 * current error information and display state.
 * 
 * @interface ErrorHandlerState
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory State
 * 
 * @example
 * ```tsx
 * const state: ErrorHandlerState = {
 *   error: errorInfo,
 *   isShowingError: true
 * };
 * ```
 */
export interface ErrorHandlerState {
  /**
   * Current error information, null if no error.
   * 
   * @type {ErrorInfo | null}
   * @example errorInfo
   * @example null
   */
  error: ErrorInfo | null;

  /**
   * Whether an error dialog is currently being shown.
   * 
   * @type {boolean}
   * @example true
   * @example false
   */
  isShowingError: boolean;
}

/**
 * Error Handler Hook Return Interface
 * 
 * Defines the complete API surface of the useErrorHandler hook with all available
 * methods for error handling, display, and management.
 * 
 * @interface UseErrorHandlerReturn
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Hooks
 * 
 * @example
 * ```tsx
 * const { 
 *   showError, 
 *   showNetworkError, 
 *   handleAsyncError 
 * }: UseErrorHandlerReturn = useErrorHandler();
 * ```
 */
export interface UseErrorHandlerReturn {
  /**
   * Current error information.
   * 
   * @type {ErrorInfo | null}
   * @readonly
   * @example error?.message
   * @example error?.context
   */
  error: ErrorInfo | null;

  /**
   * Whether an error dialog is currently visible.
   * 
   * @type {boolean}
   * @readonly
   * @example isShowingError
   */
  isShowingError: boolean;

  /**
   * Display an error message to the user.
   * 
   * @type {(error: Error | string, context?: string) => void}
   * @param {Error | string} error - Error object or message string
   * @param {string} [context] - Optional context for better debugging
   * @example showError(new Error('Something went wrong'), 'user-operation')
   * @example showError('Invalid input provided', 'form-validation')
   */
  showError: (error: Error | string, context?: string) => void;

  /**
   * Display a network-specific error message.
   * 
   * @type {() => void}
   * @example showNetworkError()
   */
  showNetworkError: () => void;

  /**
   * Display a validation error message.
   * 
   * @type {(message: string) => void}
   * @param {string} message - Validation error message
   * @example showValidationError('Email address is required')
   */
  showValidationError: (message: string) => void;

  /**
   * Clear the current error and hide any error dialogs.
   * 
   * @type {() => void}
   * @example clearError()
   */
  clearError: () => void;

  /**
   * Execute an async operation with automatic error handling.
   * 
   * @type {<T>(asyncOperation: () => Promise<T>, context?: string) => Promise<T | null>}
   * @template T - The return type of the async operation
   * @param {() => Promise<T>} asyncOperation - The async function to execute
   * @param {string} [context] - Optional context for error tracking
   * @returns {Promise<T | null>} Result of operation or null if error occurred
   * @example handleAsyncError(() => api.fetchUser(123), 'user-fetch')
   */
  handleAsyncError: <T>(asyncOperation: () => Promise<T>, context?: string) => Promise<T | null>;
}

/**
 * Global Error Handling Hook
 * 
 * Custom React hook that provides consistent error handling and user feedback
 * across the application. Features internationalized error messages, context-aware
 * error mapping, automatic alert display, and comprehensive error logging for
 * monitoring and debugging purposes.
 * 
 * @function useErrorHandler
 * @returns {UseErrorHandlerReturn} Error handling interface
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Hooks
 * @subcategory Error
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseErrorHandler
 * 
 * @example
 * Basic error handling:
 * ```tsx
 * import { useErrorHandler } from '@/shared/hooks/use-error-handler';
 * 
 * const UserProfile = () => {
 *   const { showError, showNetworkError, handleAsyncError } = useErrorHandler();
 *   const [user, setUser] = useState<User | null>(null);
 * 
 *   const fetchUser = async (userId: string) => {
 *     const result = await handleAsyncError(
 *       () => api.getUser(userId),
 *       'user-fetch'
 *     );
 *     
 *     if (result) {
 *       setUser(result);
 *     }
 *   };
 * 
 *   const handleSave = async () => {
 *     try {
 *       await api.updateUser(user);
 *       alert('User updated successfully');
 *     } catch (error) {
 *       showError(error, 'user-update');
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <UserForm user={user} />
 *       <Button title="Save" onPress={handleSave} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Form validation with error handling:
 * ```tsx
 * const RegistrationForm = () => {
 *   const { showValidationError, showError } = useErrorHandler();
 *   const [formData, setFormData] = useState({ email: '', password: '' });
 * 
 *   const validateForm = () => {
 *     if (!formData.email) {
 *       showValidationError('Email address is required');
 *       return false;
 *     }
 *     
 *     if (!formData.email.includes('@')) {
 *       showValidationError('Please enter a valid email address');
 *       return false;
 *     }
 *     
 *     if (formData.password.length < 8) {
 *       showValidationError('Password must be at least 8 characters long');
 *       return false;
 *     }
 *     
 *     return true;
 *   };
 * 
 *   const handleSubmit = async () => {
 *     if (!validateForm()) return;
 *     
 *     try {
 *       await api.register(formData);
 *       alert('Registration successful');
 *     } catch (error) {
 *       showError(error, 'registration');
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <TextInput 
 *         placeholder="Email"
 *         value={formData.email}
 *         onChangeText={(email) => setFormData(prev => ({ ...prev, email }))}
 *       />
 *       <TextInput 
 *         placeholder="Password"
 *         value={formData.password}
 *         onChangeText={(password) => setFormData(prev => ({ ...prev, password }))}
 *         secureTextEntry
 *       />
 *       <Button title="Register" onPress={handleSubmit} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Network-aware error handling:
 * ```tsx
 * const DataSyncManager = () => {
 *   const { showNetworkError, showError, handleAsyncError } = useErrorHandler();
 *   const { isConnected } = useNetworkStatus();
 *   const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
 * 
 *   const syncData = async () => {
 *     if (!isConnected) {
 *       showNetworkError();
 *       return;
 *     }
 * 
 *     setSyncStatus('syncing');
 * 
 *     const result = await handleAsyncError(
 *       async () => {
 *         const localData = await getLocalData();
 *         const syncResult = await api.syncData(localData);
 *         await saveLocalData(syncResult.data);
 *         return syncResult;
 *       },
 *       'data-sync'
 *     );
 * 
 *     if (result) {
 *       setSyncStatus('idle');
 *       alert(`Sync completed. ${result.updatedCount} items updated.`);
 *     } else {
 *       setSyncStatus('error');
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <Text>Sync Status: {syncStatus}</Text>
 *       <Button 
 *         title="Sync Data" 
 *         onPress={syncData}
 *         disabled={syncStatus === 'syncing' || !isConnected}
 *       />
 *       {!isConnected && <Text style={styles.warning}>No internet connection</Text>}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Enterprise error monitoring integration:
 * ```tsx
 * const useEnterpriseErrorHandler = () => {
 *   const baseErrorHandler = useErrorHandler();
 *   const { user } = useAuth();
 * 
 *   const showError = useCallback((error: Error | string, context?: string) => {
 *     // Log to enterprise monitoring system
 *     errorMonitoring.captureError({
 *       error: typeof error === 'string' ? new Error(error) : error,
 *       context,
 *       user: user?.id,
 *       timestamp: new Date(),
 *       appVersion: getAppVersion(),
 *       platform: Platform.OS
 *     });
 * 
 *     // Show user-friendly error
 *     baseErrorHandler.showError(error, context);
 *   }, [baseErrorHandler, user]);
 * 
 *   const handleCriticalError = useCallback((error: Error, context: string) => {
 *     // Log as critical error
 *     errorMonitoring.captureCriticalError({
 *       error,
 *       context,
 *       user: user?.id,
 *       timestamp: new Date(),
 *       severity: 'critical'
 *     });
 * 
 *     // Show error and redirect to safe state
 *     showError(error, context);
 *     navigation.reset({
 *       index: 0,
 *       routes: [{ name: 'Home' }]
 *     });
 *   }, [showError, user]);
 * 
 *   return {
 *     ...baseErrorHandler,
 *     showError,
 *     handleCriticalError
 *   };
 * };
 * ```
 * 
 * @features
 * - Internationalized error messages
 * - Context-aware error mapping
 * - Automatic alert display
 * - Comprehensive error logging
 * - Network error handling
 * - Validation error support
 * - Async operation error wrapping
 * - User-friendly error messages
 * - Enterprise monitoring integration
 * - Memory efficient state management
 * 
 * @architecture
 * - React hooks pattern
 * - Centralized error state
 * - Context-based error categorization
 * - Callback optimization
 * - Internationalization support
 * - Alert system integration
 * - Logging and monitoring
 * 
 * @error_handling
 * - Network error detection
 * - Authentication error mapping
 * - Validation error support
 * - Generic error fallback
 * - Context-aware messages
 * - User-friendly translations
 * - Technical error logging
 * 
 * @internationalization
 * - React i18next integration
 * - Localized error messages
 * - Fallback message support
 * - Dynamic message mapping
 * - Cultural error adaptations
 * 
 * @performance
 * - useCallback optimization
 * - Minimal re-renders
 * - Efficient state updates
 * - Memory leak prevention
 * - Optimized error processing
 * 
 * @accessibility
 * - Screen reader compatible alerts
 * - Clear error descriptions
 * - Accessible dialog patterns
 * - High contrast support
 * - Error announcement support
 * 
 * @monitoring
 * - Console error logging
 * - Structured error data
 * - Context preservation
 * - Timestamp tracking
 * - Error categorization
 * - Debug information
 * 
 * @use_cases
 * - API error handling
 * - Form validation errors
 * - Network connectivity issues
 * - Authentication failures
 * - Data synchronization errors
 * - File upload failures
 * - Payment processing errors
 * - Enterprise error monitoring
 * 
 * @best_practices
 * - Provide meaningful error contexts
 * - Use appropriate error types
 * - Handle network errors gracefully
 * - Log errors for monitoring
 * - Test error scenarios thoroughly
 * - Implement user-friendly messages
 * - Consider offline scenarios
 * - Monitor error patterns
 * 
 * @dependencies
 * - react: useState, useCallback hooks
 * - react-native: Alert component
 * - react-i18next: Translation system
 * 
 * @see {@link Alert} for native alert functionality
 * @see {@link useTranslation} for internationalization
 * @see {@link mapErrorToUserMessage} for error message mapping
 * 
 * @todo Add error retry mechanisms
 * @todo Implement error analytics
 * @todo Add offline error queuing
 * @todo Include error recovery suggestions
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const { t } = useTranslation();
  const [state, setState] = useState<ErrorHandlerState>({
    error: null,
    isShowingError: false,
  });

  const showError = useCallback((error: Error | string, context?: string) => {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      details: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
      context,
    };

    setState({
      error: errorInfo,
      isShowingError: true,
    });

    // Show user-friendly alert
    const userMessage = mapErrorToUserMessage(errorInfo, t);
    Alert.alert(
      t('error.title', 'Fehler'),
      userMessage,
      [
        {
          text: t('error.ok', 'OK'),
          onPress: () => setState(prev => ({ ...prev, isShowingError: false })),
        },
      ]
    );

    // Log error for monitoring
    console.error('[ErrorHandler]', {
      message: errorInfo.message,
      code: errorInfo.code,
      context: errorInfo.context,
      timestamp: errorInfo.timestamp,
    });
  }, [t]);

  const showNetworkError = useCallback(() => {
    showError(
      t('error.network', 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.'),
      'network'
    );
  }, [showError, t]);

  const showValidationError = useCallback((message: string) => {
    showError(message, 'validation');
  }, [showError]);

  const clearError = useCallback(() => {
    setState({
      error: null,
      isShowingError: false,
    });
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      showError(error as Error, context);
      return null;
    }
  }, [showError]);

  return {
    error: state.error,
    isShowingError: state.isShowingError,
    showError,
    showNetworkError,
    showValidationError,
    clearError,
    handleAsyncError,
  };
};

/**
 * Error Message Mapping Function
 * 
 * Maps technical errors to user-friendly, internationalized messages based on
 * error content, context, and available translations. Provides fallback messages
 * for better user experience.
 * 
 * @function mapErrorToUserMessage
 * @param {ErrorInfo} error - The error information to map
 * @param {any} t - Translation function from i18next
 * @returns {string} User-friendly error message
 * 
 * @since 1.0.0
 * @private
 * @internal
 * 
 * @example
 * ```tsx
 * const userMessage = mapErrorToUserMessage(errorInfo, t);
 * ```
 */
function mapErrorToUserMessage(error: ErrorInfo, t: any): string {
  // Network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return t('error.network') || 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.';
  }

  // Authentication errors
  if (error.message.includes('unauthorized') || error.message.includes('401')) {
    return t('error.unauthorized') || 'Sie sind nicht berechtigt, diese Aktion auszuführen.';
  }

  // Validation errors
  if (error.context === 'validation' || error.message.includes('validation')) {
    return error.message; // Validation messages are already user-friendly
  }

  // Profile errors
  if (error.context === 'profile') {
    return t('error.profile') || 'Fehler beim Laden oder Speichern des Profils.';
  }

  // Authentication errors
  if (error.context === 'auth') {
    return t('error.auth') || 'Authentifizierungsfehler. Bitte versuchen Sie es erneut.';
  }

  // Generic error
  return t('error.generic') || 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
} 