/**
 * @fileoverview Error Handler Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Error handling only
 * ✅ TanStack Query + Use Cases: Error state caching
 * ✅ Optimistic Updates: Instant error feedback  
 * ✅ Mobile Performance: Battery-friendly error management
 * ✅ Enterprise Logging: Error audit trails
 * ✅ Clean Interface: Essential error operations
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('ErrorHandlerChampion');

// 🏆 CHAMPION QUERY KEYS
export const errorHandlerQueryKeys = {
  all: ['error', 'handler'] as const,
  state: () => [...errorHandlerQueryKeys.all, 'state'] as const,
  history: () => [...errorHandlerQueryKeys.all, 'history'] as const,
  analytics: () => [...errorHandlerQueryKeys.all, 'analytics'] as const,
} as const;

// 🏆 CHAMPION CONFIG: Mobile Performance
const ERROR_CONFIG = {
  staleTime: 1000 * 5,            // 🏆 Mobile: 5 seconds for error state
  gcTime: 1000 * 30,              // 🏆 Mobile: 30 seconds garbage collection
  retry: 0,                       // 🏆 Mobile: No retry for error state
  refetchOnWindowFocus: false,    // 🏆 Mobile: Battery-friendly
  refetchOnReconnect: false,      // 🏆 Mobile: No network dependency
} as const;

/**
 * @interface ErrorInfo
 * @description Enhanced error information with Champion tracking
 */
export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  context?: string;
  correlationId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: 'network' | 'auth' | 'validation' | 'business' | 'system';
  userId?: string;
  sessionId?: string;
  retryCount?: number;
}

/**
 * @interface ErrorAnalytics
 * @description Error analytics and metrics
 */
export interface ErrorAnalytics {
  totalErrors: number;
  errorsByCategory: { [key: string]: number };
  errorsBySeverity: { [key: string]: number };
  mostFrequentError: string | null;
  averageResolutionTime: number;
  lastErrorTime: Date | null;
  lastUpdated: Date;
}

/**
 * @interface ErrorRecovery
 * @description Error recovery suggestions and actions
 */
export interface ErrorRecovery {
  canRetry: boolean;
  suggestedAction: string;
  autoRetryCount: number;
  maxRetries: number;
  retryDelay: number;
  recoveryFunction?: () => Promise<void>;
}

/**
 * @interface UseErrorHandlerReturn
 * @description Champion Return Type für Error Handler Hook
 */
export interface UseErrorHandlerReturn {
  // 🏆 Error Status
  error: ErrorInfo | null;
  isShowingError: boolean;
  errorHistory: ErrorInfo[];
  analytics: ErrorAnalytics | null;
  
  // 🏆 Champion Loading States
  isLoading: boolean;
  
  // 🏆 Error Handling
  errorMessage: string | null;
  
  // 🏆 Champion Actions (Essential Only)
  showError: (error: Error | string, context?: string, severity?: 'low' | 'medium' | 'high' | 'critical') => void;
  showNetworkError: (details?: any) => void;
  showValidationError: (message: string, field?: string) => void;
  showBusinessError: (message: string, businessContext?: string) => void;
  clearError: () => void;
  
  handleAsyncError: <T>(
    asyncOperation: () => Promise<T>, 
    context?: string,
    recovery?: ErrorRecovery
  ) => Promise<T | null>;
  
  // 🏆 Mobile Performance Helpers
  refreshErrorState: () => Promise<void>;
  clearErrorHistory: () => void;
  
  // 🏆 Error Management
  retryLastOperation: () => Promise<void>;
  getErrorAnalytics: () => ErrorAnalytics | null;
  exportErrorLog: () => ErrorInfo[];
  reportCriticalError: (error: ErrorInfo) => Promise<void>;
}

/**
 * 🏆 CHAMPION ERROR HANDLER HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Error handling only
 * - TanStack Query: Optimized error state caching
 * - Optimistic Updates: Immediate error feedback
 * - Mobile Performance: Battery-friendly error management
 * - Enterprise Logging: Error audit trails
 * - Clean Interface: Essential error operations
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [localErrorState, setLocalErrorState] = useState<{
    error: ErrorInfo | null;
    isShowingError: boolean;
  }>({
    error: null,
    isShowingError: false,
  });
  const [errorHistory, setErrorHistory] = useState<ErrorInfo[]>([]);
  const [lastOperation, setLastOperation] = useState<{
    operation: () => Promise<any>;
    context: string;
    recovery?: ErrorRecovery;
  } | null>(null);

  // 🔍 TANSTACK QUERY: Error State (Champion Pattern)
  const errorStateQuery = useQuery({
    queryKey: errorHandlerQueryKeys.state(),
    queryFn: async (): Promise<{ error: ErrorInfo | null; isShowingError: boolean }> => {
      const correlationId = `error_state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Fetching error state (Champion)', LogCategory.BUSINESS, { correlationId });

      try {
        const state = { ...localErrorState };
        
        logger.info('Error state fetched successfully (Champion)', LogCategory.BUSINESS, { 
          correlationId,
          metadata: { hasError: !!state.error, isShowingError: state.isShowingError }
        });

        return state;
      } catch (error) {
        logger.error('Error state fetch failed (Champion)', LogCategory.BUSINESS, { 
          correlationId 
        }, error as Error);
        
        return localErrorState;
      }
    },
    initialData: localErrorState,
    ...ERROR_CONFIG,
  });

  // 🔍 TANSTACK QUERY: Error Analytics (Champion Pattern)
  const analyticsQuery = useQuery({
    queryKey: errorHandlerQueryKeys.analytics(),
    queryFn: async (): Promise<ErrorAnalytics> => {
      const correlationId = `error_analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Calculating error analytics (Champion)', LogCategory.BUSINESS, { correlationId });

      try {
        const errorsByCategory: { [key: string]: number } = {};
        const errorsBySeverity: { [key: string]: number } = {};
        let mostFrequentError: string | null = null;
        let maxCount = 0;

        errorHistory.forEach(error => {
          // Category counting
          const category = error.category || 'unknown';
          errorsByCategory[category] = (errorsByCategory[category] || 0) + 1;

          // Severity counting
          const severity = error.severity || 'medium';
          errorsBySeverity[severity] = (errorsBySeverity[severity] || 0) + 1;

          // Most frequent error
          const count = errorsByCategory[category];
          if (count > maxCount) {
            maxCount = count;
            mostFrequentError = error.message;
          }
        });

        const analytics: ErrorAnalytics = {
          totalErrors: errorHistory.length,
          errorsByCategory,
          errorsBySeverity,
          mostFrequentError,
          averageResolutionTime: 0, // Would calculate from resolution tracking
          lastErrorTime: errorHistory.length > 0 ? errorHistory[errorHistory.length - 1].timestamp : null,
          lastUpdated: new Date(),
        };

        logger.info('Error analytics calculated successfully (Champion)', LogCategory.BUSINESS, { 
          correlationId,
          metadata: { totalErrors: analytics.totalErrors, mostFrequentError: analytics.mostFrequentError }
        });

        return analytics;
      } catch (error) {
        logger.error('Error analytics calculation failed (Champion)', LogCategory.BUSINESS, { 
          correlationId 
        }, error as Error);
        
        return {
          totalErrors: 0,
          errorsByCategory: {},
          errorsBySeverity: {},
          mostFrequentError: null,
          averageResolutionTime: 0,
          lastErrorTime: null,
          lastUpdated: new Date(),
        };
      }
    },
    enabled: errorHistory.length > 0,
    ...ERROR_CONFIG,
  });

  // 🏆 CHAMPION COMPUTED VALUES
  const errorState = errorStateQuery.data || localErrorState;
  const analytics = analyticsQuery.data || null;
  const isLoading = errorStateQuery.isLoading;
  const errorMessage = errorState.error?.message || null;

  // 🏆 CHAMPION ERROR CREATION
  const createError = useCallback((
    error: Error | string,
    context?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    category: 'network' | 'auth' | 'validation' | 'business' | 'system' = 'system'
  ): ErrorInfo => {
    const correlationId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      details: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
      context,
      correlationId,
      severity,
      category,
      retryCount: 0,
    };

    logger.error('Error created (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { message: errorInfo.message, context, severity, category }
    }, error instanceof Error ? error : new Error(error));

    return errorInfo;
  }, []);

  // 🏆 CHAMPION ACTIONS
  const showError = useCallback((
    error: Error | string, 
    context?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    const category = determineErrorCategory(error, context);
    const errorInfo = createError(error, context, severity, category);

    setLocalErrorState({
      error: errorInfo,
      isShowingError: true,
    });

    // Add to history
    setErrorHistory(prev => [...prev, errorInfo].slice(-50)); // Keep last 50 errors

    // Show user-friendly alert
    const userMessage = mapErrorToUserMessage(errorInfo, t);
    Alert.alert(
      t('error.title') || 'Fehler',
      userMessage,
      [
        {
          text: t('error.ok') || 'OK',
          onPress: () => setLocalErrorState(prev => ({ ...prev, isShowingError: false })),
        },
      ]
    );

    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: errorHandlerQueryKeys.state() });
    queryClient.invalidateQueries({ queryKey: errorHandlerQueryKeys.analytics() });

    // Report critical errors
    if (severity === 'critical') {
      reportCriticalError(errorInfo);
    }
  }, [createError, t, queryClient]);

  const showNetworkError = useCallback((details?: any) => {
    const errorMessage = t('error.network') || 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.';
    const error = new Error(errorMessage);
    if (details) {
      (error as any).details = details;
    }
    showError(error, 'network', 'high');
  }, [showError, t]);

  const showValidationError = useCallback((message: string, field?: string) => {
    const contextMessage = field ? `validation-${field}` : 'validation';
    showError(message, contextMessage, 'medium');
  }, [showError]);

  const showBusinessError = useCallback((message: string, businessContext?: string) => {
    const contextMessage = businessContext ? `business-${businessContext}` : 'business';
    showError(message, contextMessage, 'high');
  }, [showError]);

  const clearError = useCallback(() => {
    const correlationId = `clear_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Clearing error (Champion)', LogCategory.BUSINESS, { correlationId });

    setLocalErrorState({
      error: null,
      isShowingError: false,
    });

    // Invalidate error state query
    queryClient.invalidateQueries({ queryKey: errorHandlerQueryKeys.state() });
  }, [queryClient]);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    context?: string,
    recovery?: ErrorRecovery
  ): Promise<T | null> => {
    const correlationId = `async_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Starting async operation with error handling (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { context }
    });

    // Store operation for retry
    setLastOperation({ operation: asyncOperation, context: context || '', recovery });

    try {
      const result = await asyncOperation();
      
      logger.info('Async operation completed successfully (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        metadata: { context }
      });
      
      return result;
    } catch (error) {
      logger.error('Async operation failed (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        metadata: { context }
      }, error as Error);

      // Handle retry logic
      if (recovery?.canRetry && recovery.autoRetryCount < recovery.maxRetries) {
        logger.info('Attempting auto-retry (Champion)', LogCategory.BUSINESS, { 
          correlationId,
          metadata: { retryCount: recovery.autoRetryCount + 1, maxRetries: recovery.maxRetries }
        });

        // Wait for retry delay
        await new Promise(resolve => setTimeout(resolve, recovery.retryDelay));

        const updatedRecovery = {
          ...recovery,
          autoRetryCount: recovery.autoRetryCount + 1,
        };

        return handleAsyncError(asyncOperation, context, updatedRecovery);
      }

      showError(error as Error, context, 'medium');
      return null;
    }
  }, [showError]);

  // 🏆 MOBILE PERFORMANCE HELPERS
  const refreshErrorState = useCallback(async (): Promise<void> => {
    logger.info('Refreshing error state (Champion)', LogCategory.BUSINESS);
    await Promise.all([
      errorStateQuery.refetch(),
      analyticsQuery.refetch()
    ]);
  }, [errorStateQuery, analyticsQuery]);

  const clearErrorHistory = useCallback(() => {
    const correlationId = `clear_history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Clearing error history (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { historySize: errorHistory.length }
    });

    setErrorHistory([]);
    queryClient.invalidateQueries({ queryKey: errorHandlerQueryKeys.analytics() });
  }, [errorHistory.length, queryClient]);

  // 🏆 ERROR MANAGEMENT HELPERS
  const retryLastOperation = useCallback(async (): Promise<void> => {
    if (!lastOperation) {
      logger.warn('No operation to retry (Champion)', LogCategory.BUSINESS);
      return;
    }

    const correlationId = `retry_operation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Retrying last operation (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { context: lastOperation.context }
    });

    try {
      const result = await lastOperation.operation();
      
      logger.info('Retry operation completed successfully (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        metadata: { context: lastOperation.context }
      });

      // Clear error on successful retry
      clearError();
      
      return result;
    } catch (error) {
      logger.error('Retry operation failed (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        metadata: { context: lastOperation.context }
      }, error as Error);

      showError(error as Error, `retry-${lastOperation.context}`, 'high');
    }
  }, [lastOperation, clearError, showError]);

  const getErrorAnalytics = useCallback((): ErrorAnalytics | null => {
    return analytics;
  }, [analytics]);

  const exportErrorLog = useCallback((): ErrorInfo[] => {
    const correlationId = `export_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Exporting error log (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { errorCount: errorHistory.length }
    });

    return [...errorHistory];
  }, [errorHistory]);

  const reportCriticalError = useCallback(async (error: ErrorInfo): Promise<void> => {
    const correlationId = `critical_report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.error('Reporting critical error (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { 
        errorMessage: error.message,
        context: error.context,
        severity: error.severity
      }
    });

    // In production, this would report to error monitoring service
    // For now, we just log it with high priority
    logger.error('Critical error reported to monitoring', LogCategory.BUSINESS, {
      correlationId,
      metadata: { 
        error,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  return {
    // 🏆 Error Status
    error: errorState.error,
    isShowingError: errorState.isShowingError,
    errorHistory,
    analytics,
    
    // 🏆 Champion Loading States
    isLoading,
    
    // 🏆 Error Handling
    errorMessage,
    
    // 🏆 Champion Actions
    showError,
    showNetworkError,
    showValidationError,
    showBusinessError,
    clearError,
    handleAsyncError,
    
    // 🏆 Mobile Performance Helpers
    refreshErrorState,
    clearErrorHistory,
    
    // 🏆 Error Management
    retryLastOperation,
    getErrorAnalytics,
    exportErrorLog,
    reportCriticalError,
  };
};

/**
 * 🏆 CHAMPION HELPER FUNCTIONS
 */

function determineErrorCategory(
  error: Error | string, 
  context?: string
): 'network' | 'auth' | 'validation' | 'business' | 'system' {
  const message = typeof error === 'string' ? error : error.message;
  
  if (context?.includes('network') || message.includes('fetch') || message.includes('network')) {
    return 'network';
  }
  
  if (context?.includes('auth') || message.includes('unauthorized') || message.includes('401')) {
    return 'auth';
  }
  
  if (context?.includes('validation') || message.includes('validation')) {
    return 'validation';
  }
  
  if (context?.includes('business')) {
    return 'business';
  }
  
  return 'system';
}

function mapErrorToUserMessage(error: ErrorInfo, t: any): string {
  // Network errors
  if (error.category === 'network') {
    return t('error.network') || 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.';
  }

  // Authentication errors
  if (error.category === 'auth') {
    return t('error.unauthorized') || 'Sie sind nicht berechtigt, diese Aktion auszuführen.';
  }

  // Validation errors
  if (error.category === 'validation') {
    return error.message; // Validation messages are already user-friendly
  }

  // Business errors
  if (error.category === 'business') {
    return error.message; // Business errors should be user-friendly
  }

  // Generic error
  return t('error.generic') || 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
}