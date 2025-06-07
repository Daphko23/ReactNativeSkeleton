/**
 * useErrorHandler - Global Error Handling Hook
 * Provides consistent error handling and user feedback across the app
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

export interface ErrorHandlerState {
  error: ErrorInfo | null;
  isShowingError: boolean;
}

export interface UseErrorHandlerReturn {
  error: ErrorInfo | null;
  isShowingError: boolean;
  showError: (error: Error | string, context?: string) => void;
  showNetworkError: () => void;
  showValidationError: (message: string) => void;
  clearError: () => void;
  handleAsyncError: <T>(asyncOperation: () => Promise<T>, context?: string) => Promise<T | null>;
}

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
 * Maps technical errors to user-friendly messages
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