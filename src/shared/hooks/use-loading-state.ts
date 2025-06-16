/**
 * @fileoverview Loading State Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Loading state only
 * ✅ TanStack Query + Use Cases: Loading state caching
 * ✅ Optimistic Updates: Instant loading feedback  
 * ✅ Mobile Performance: Battery-friendly checks
 * ✅ Enterprise Logging: Loading audit trails
 * ✅ Clean Interface: Essential loading operations
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('LoadingStateChampion');

// 🏆 CHAMPION QUERY KEYS
export const loadingStateQueryKeys = {
  all: ['loading', 'state'] as const,
  global: () => [...loadingStateQueryKeys.all, 'global'] as const,
  operations: () => [...loadingStateQueryKeys.all, 'operations'] as const,
  performance: () => [...loadingStateQueryKeys.all, 'performance'] as const,
} as const;

// 🏆 CHAMPION CONFIG: Mobile Performance
const LOADING_CONFIG = {
  staleTime: 1000 * 5,            // 🏆 Mobile: 5 seconds for loading state
  gcTime: 1000 * 30,              // 🏆 Mobile: 30 seconds garbage collection
  retry: 0,                       // 🏆 Mobile: No retry for loading state
  refetchOnWindowFocus: false,    // 🏆 Mobile: Battery-friendly
  refetchOnReconnect: false,      // 🏆 Mobile: No network dependency
} as const;

/**
 * @interface LoadingState
 * @description Loading state dictionary
 */
export interface LoadingState {
  [key: string]: boolean;
}

/**
 * @interface LoadingPerformance
 * @description Loading performance metrics
 */
export interface LoadingPerformance {
  operationCount: number;
  averageDuration: number;
  longestOperation: string | null;
  shortestOperation: string | null;
  totalLoadingTime: number;
  lastUpdated: Date;
}

/**
 * @interface LoadingOperation
 * @description Loading operation details
 */
export interface LoadingOperation {
  key: string;
  isActive: boolean;
  startTime: Date | null;
  duration: number | null;
  category: 'api' | 'ui' | 'file' | 'auth' | 'other';
}

/**
 * @interface UseLoadingStateReturn
 * @description Champion Return Type für Loading State Hook
 */
export interface UseLoadingStateReturn {
  // 🏆 Loading Status
  isLoading: (key?: string) => boolean;
  isAnyLoading: boolean;
  loadingStates: LoadingState;
  performance: LoadingPerformance | null;
  
  // 🏆 Champion Loading States
  isLoadingGlobal: boolean;
  activeOperations: LoadingOperation[];
  
  // 🏆 Error Handling
  error: string | null;
  
  // 🏆 Champion Actions (Essential Only)
  setLoading: (key: string, loading: boolean, category?: 'api' | 'ui' | 'file' | 'auth' | 'other') => void;
  withLoading: <T>(key: string, asyncOperation: () => Promise<T>, category?: 'api' | 'ui' | 'file' | 'auth' | 'other') => Promise<T>;
  clearAll: () => void;
  
  // 🏆 Mobile Performance Helpers
  refreshLoadingState: () => Promise<void>;
  clearLoadingError: () => void;
  
  // 🏆 Loading Management
  getLoadingDuration: (key: string) => number | null;
  getActiveOperationsCount: () => number;
  trackLoadingPerformance: () => LoadingPerformance;
}

/**
 * 🏆 CHAMPION LOADING STATE HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Loading state only
 * - TanStack Query: Optimized loading state caching
 * - Optimistic Updates: Immediate loading feedback
 * - Mobile Performance: Battery-friendly loading checks
 * - Enterprise Logging: Loading audit trails
 * - Clean Interface: Essential loading operations
 */
export const useLoadingState = (): UseLoadingStateReturn => {
  const queryClient = useQueryClient();
  const [localLoadingStates, setLocalLoadingStates] = useState<LoadingState>({});
  const [operationTracking, setOperationTracking] = useState<{[key: string]: LoadingOperation}>({});

  // 🔍 TANSTACK QUERY: Global Loading State (Champion Pattern)
  const globalLoadingQuery = useQuery({
    queryKey: loadingStateQueryKeys.global(),
    queryFn: async (): Promise<LoadingState> => {
      const correlationId = `loading_state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Fetching global loading state (Champion)', LogCategory.PERFORMANCE, { correlationId });

      try {
        // Return current local loading states as global state
        const globalState = { ...localLoadingStates };
        
        logger.info('Global loading state fetched successfully (Champion)', LogCategory.PERFORMANCE, { 
          correlationId,
          metadata: { activeOperations: Object.keys(globalState).filter(key => globalState[key]).length }
        });

        return globalState;
      } catch (error) {
        logger.error('Global loading state fetch failed (Champion)', LogCategory.PERFORMANCE, { 
          correlationId 
        }, error as Error);
        
        return {};
      }
    },
    initialData: localLoadingStates,
    ...LOADING_CONFIG,
  });

  // 🔍 TANSTACK QUERY: Loading Performance (Champion Pattern)
  const performanceQuery = useQuery({
    queryKey: loadingStateQueryKeys.performance(),
    queryFn: async (): Promise<LoadingPerformance> => {
      const correlationId = `loading_performance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Calculating loading performance (Champion)', LogCategory.PERFORMANCE, { correlationId });

      try {
        const operations = Object.values(operationTracking);
        const completedOperations = operations.filter(op => op.duration !== null);
        
        const durations = completedOperations.map(op => op.duration!);
        const averageDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
        const totalLoadingTime = durations.reduce((a, b) => a + b, 0);
        
        const longestOp = completedOperations.reduce((prev, current) => 
          (prev.duration! > current.duration!) ? prev : current, completedOperations[0]);
        const shortestOp = completedOperations.reduce((prev, current) => 
          (prev.duration! < current.duration!) ? prev : current, completedOperations[0]);

        const performance: LoadingPerformance = {
          operationCount: operations.length,
          averageDuration,
          longestOperation: longestOp?.key || null,
          shortestOperation: shortestOp?.key || null,
          totalLoadingTime,
          lastUpdated: new Date(),
        };

        logger.info('Loading performance calculated successfully (Champion)', LogCategory.PERFORMANCE, { 
          correlationId,
          metadata: { operationCount: performance.operationCount, averageDuration: performance.averageDuration }
        });

        return performance;
      } catch (error) {
        logger.error('Loading performance calculation failed (Champion)', LogCategory.PERFORMANCE, { 
          correlationId 
        }, error as Error);
        
        return {
          operationCount: 0,
          averageDuration: 0,
          longestOperation: null,
          shortestOperation: null,
          totalLoadingTime: 0,
          lastUpdated: new Date(),
        };
      }
    },
    enabled: Object.keys(operationTracking).length > 0,
    ...LOADING_CONFIG,
  });

  // 🏆 CHAMPION COMPUTED VALUES
  const loadingStates = globalLoadingQuery.data || {};
  const performance = performanceQuery.data || null;
  const error = globalLoadingQuery.error?.message || performanceQuery.error?.message || null;

  const isLoading = useCallback((key = 'default'): boolean => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useMemo(() => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  const isLoadingGlobal = useMemo(() => {
    return globalLoadingQuery.isLoading;
  }, [globalLoadingQuery.isLoading]);

  const activeOperations = useMemo(() => {
    return Object.values(operationTracking).filter(op => op.isActive);
  }, [operationTracking]);

  // 🏆 CHAMPION ACTIONS
  const setLoading = useCallback((
    key: string, 
    loading: boolean, 
    category: 'api' | 'ui' | 'file' | 'auth' | 'other' = 'other'
  ) => {
    const correlationId = `set_loading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Setting loading state (Champion)', LogCategory.PERFORMANCE, { 
      correlationId,
      metadata: { key, loading, category }
    });

    // Update local loading states
    setLocalLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));

    // Update operation tracking
    setOperationTracking(prev => {
      const now = new Date();
      const existingOp = prev[key];
      
      if (loading) {
        // Start operation
        return {
          ...prev,
          [key]: {
            key,
            isActive: true,
            startTime: now,
            duration: null,
            category,
          }
        };
      } else {
        // End operation
        if (existingOp && existingOp.startTime) {
          const duration = now.getTime() - existingOp.startTime.getTime();
          
          logger.info('Loading operation completed (Champion)', LogCategory.PERFORMANCE, { 
            correlationId,
            metadata: { key, duration, category }
          });
          
          return {
            ...prev,
            [key]: {
              ...existingOp,
              isActive: false,
              duration,
            }
          };
        }
        
        return prev;
      }
    });

    // Invalidate queries to refresh state
    queryClient.invalidateQueries({ queryKey: loadingStateQueryKeys.global() });
    if (!loading) {
      queryClient.invalidateQueries({ queryKey: loadingStateQueryKeys.performance() });
    }
  }, [queryClient]);

  const withLoading = useCallback(async <T>(
    key: string,
    asyncOperation: () => Promise<T>,
    category: 'api' | 'ui' | 'file' | 'auth' | 'other' = 'api'
  ): Promise<T> => {
    const correlationId = `with_loading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Starting async operation with loading (Champion)', LogCategory.PERFORMANCE, { 
      correlationId,
      metadata: { key, category }
    });

    setLoading(key, true, category);
    
    try {
      const result = await asyncOperation();
      
      logger.info('Async operation completed successfully (Champion)', LogCategory.PERFORMANCE, { 
        correlationId,
        metadata: { key, category }
      });
      
      return result;
    } catch (error) {
      logger.error('Async operation failed (Champion)', LogCategory.PERFORMANCE, { 
        correlationId,
        metadata: { key, category }
      }, error as Error);
      
      throw error;
    } finally {
      setLoading(key, false, category);
    }
  }, [setLoading]);

  const clearAll = useCallback(() => {
    const correlationId = `clear_all_loading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Clearing all loading states (Champion)', LogCategory.PERFORMANCE, { correlationId });

    setLocalLoadingStates({});
    setOperationTracking({});
    
    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: loadingStateQueryKeys.global() });
    queryClient.invalidateQueries({ queryKey: loadingStateQueryKeys.performance() });
  }, [queryClient]);

  // 🏆 MOBILE PERFORMANCE HELPERS
  const refreshLoadingState = useCallback(async (): Promise<void> => {
    logger.info('Refreshing loading state (Champion)', LogCategory.PERFORMANCE);
    await Promise.all([
      globalLoadingQuery.refetch(),
      performanceQuery.refetch()
    ]);
  }, [globalLoadingQuery, performanceQuery]);

  const clearLoadingError = useCallback(() => {
    queryClient.setQueryData(loadingStateQueryKeys.global(), globalLoadingQuery.data);
    queryClient.setQueryData(loadingStateQueryKeys.performance(), performanceQuery.data);
  }, [queryClient, globalLoadingQuery.data, performanceQuery.data]);

  // 🏆 LOADING MANAGEMENT HELPERS
  const getLoadingDuration = useCallback((key: string): number | null => {
    const operation = operationTracking[key];
    if (!operation) return null;
    
    if (operation.isActive && operation.startTime) {
      return new Date().getTime() - operation.startTime.getTime();
    }
    
    return operation.duration;
  }, [operationTracking]);

  const getActiveOperationsCount = useCallback((): number => {
    return activeOperations.length;
  }, [activeOperations]);

  const trackLoadingPerformance = useCallback((): LoadingPerformance => {
    return performance || {
      operationCount: 0,
      averageDuration: 0,
      longestOperation: null,
      shortestOperation: null,
      totalLoadingTime: 0,
      lastUpdated: new Date(),
    };
  }, [performance]);

  return {
    // 🏆 Loading Status
    isLoading,
    isAnyLoading,
    loadingStates,
    performance,
    
    // 🏆 Champion Loading States
    isLoadingGlobal,
    activeOperations,
    
    // 🏆 Error Handling
    error,
    
    // 🏆 Champion Actions
    setLoading,
    withLoading,
    clearAll,
    
    // 🏆 Mobile Performance Helpers
    refreshLoadingState,
    clearLoadingError,
    
    // 🏆 Loading Management
    getLoadingDuration,
    getActiveOperationsCount,
    trackLoadingPerformance,
  };
};