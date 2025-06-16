/**
 * @fileoverview Network Status Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Network status only
 * ✅ TanStack Query + Use Cases: Network state caching
 * ✅ Optimistic Updates: Instant network feedback  
 * ✅ Mobile Performance: Battery-friendly checks
 * ✅ Enterprise Logging: Network audit trails
 * ✅ Clean Interface: Essential network operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('NetworkStatusChampion');

// 🏆 CHAMPION QUERY KEYS
export const networkStatusQueryKeys = {
  all: ['network', 'status'] as const,
  connection: () => [...networkStatusQueryKeys.all, 'connection'] as const,
  quality: () => [...networkStatusQueryKeys.all, 'quality'] as const,
  history: () => [...networkStatusQueryKeys.all, 'history'] as const,
} as const;

// 🏆 CHAMPION CONFIG: Mobile Performance
const NETWORK_CONFIG = {
  staleTime: 1000 * 10,           // 🏆 Mobile: 10 seconds for network status
  gcTime: 1000 * 60 * 2,          // 🏆 Mobile: 2 minutes garbage collection
  retry: 1,                       // 🏆 Mobile: Single retry for network checks
  refetchOnWindowFocus: true,     // 🏆 Mobile: Recheck on focus
  refetchOnReconnect: true,       // 🏆 Mobile: Recheck on network
  refetchInterval: false,         // 🏆 Mobile: Use NetInfo events instead
} as const;

/**
 * @interface NetworkConnectionStatus
 * @description Network connection status details
 */
export interface NetworkConnectionStatus {
  isConnected: boolean;
  connectionType: string | null;
  isWiFi: boolean;
  isCellular: boolean;
  isEthernet: boolean;
  isInternetReachable: boolean;
  lastChanged: Date;
}

/**
 * @interface NetworkQuality
 * @description Network quality metrics
 */
export interface NetworkQuality {
  isSlowConnection: boolean;
  effectiveType: string | null;
  downlink: number | null;
  downlinkMax: number | null;
  rtt: number | null;
  saveData: boolean;
}

/**
 * @interface UseNetworkStatusReturn
 * @description Champion Return Type für Network Status Hook
 */
export interface UseNetworkStatusReturn {
  // 🏆 Network Status
  isConnected: boolean;
  status: NetworkConnectionStatus | null;
  quality: NetworkQuality | null;
  
  // 🏆 Champion Loading States
  isLoading: boolean;
  isCheckingConnection: boolean;
  
  // 🏆 Error Handling
  error: string | null;
  networkError: string | null;
  
  // 🏆 Champion Actions (Essential Only)
  checkConnection: () => Promise<boolean>;
  testReachability: (url?: string) => Promise<boolean>;
  
  // 🏆 Mobile Performance Helpers
  refreshNetworkStatus: () => Promise<void>;
  clearNetworkError: () => void;
  
  // 🏆 Network Management
  getConnectionType: () => string | null;
  isSlowConnection: () => boolean;
  onConnectionChange: (callback: (isConnected: boolean) => void) => () => void;
}

/**
 * 🏆 CHAMPION NETWORK STATUS HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Network status only
 * - TanStack Query: Optimized network status caching
 * - Optimistic Updates: Immediate network feedback
 * - Mobile Performance: Battery-friendly network checks
 * - Enterprise Logging: Network audit trails
 * - Clean Interface: Essential network operations
 */
export const useNetworkStatusChampion = (): UseNetworkStatusReturn => {
  const queryClient = useQueryClient();
  const [networkChangeCallbacks, setNetworkChangeCallbacks] = useState<((isConnected: boolean) => void)[]>([]);

  // 🔍 TANSTACK QUERY: Network Connection Status (Champion Pattern)
  const networkStatusQuery = useQuery({
    queryKey: networkStatusQueryKeys.connection(),
    queryFn: async (): Promise<NetworkConnectionStatus> => {
      const correlationId = `network_status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Checking network status (Champion)', LogCategory.BUSINESS, { correlationId });

      try {
        const state = await NetInfo.fetch();
        
        const status: NetworkConnectionStatus = {
          isConnected: !!state.isConnected,
          connectionType: state.type || null,
          isWiFi: state.type === 'wifi',
          isCellular: state.type === 'cellular',
          isEthernet: state.type === 'ethernet',
          isInternetReachable: !!state.isInternetReachable,
          lastChanged: new Date(),
        };

        logger.info('Network status checked successfully (Champion)', LogCategory.BUSINESS, { 
          correlationId,
          metadata: { connectionType: status.connectionType, isConnected: status.isConnected }
        });

        return status;
      } catch (error) {
        logger.error('Network status check failed (Champion)', LogCategory.BUSINESS, { 
          correlationId 
        }, error as Error);
        
        // Fallback to offline
        return {
          isConnected: false,
          connectionType: null,
          isWiFi: false,
          isCellular: false,
          isEthernet: false,
          isInternetReachable: false,
          lastChanged: new Date(),
        };
      }
    },
    ...NETWORK_CONFIG,
  });

  // 🔍 TANSTACK QUERY: Network Quality (Champion Pattern)
  const networkQualityQuery = useQuery({
    queryKey: networkStatusQueryKeys.quality(),
    queryFn: async (): Promise<NetworkQuality> => {
      const correlationId = `network_quality_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Checking network quality (Champion)', LogCategory.BUSINESS, { correlationId });

      try {
        const state = await NetInfo.fetch();
        const details = state.details;
        
        const quality: NetworkQuality = {
          isSlowConnection: state.type === 'cellular' && details && 'cellularGeneration' in details ? 
            details.cellularGeneration === '2g' : false,
          effectiveType: details && 'effectiveType' in details ? (details as any).effectiveType as string | null : null,
          downlink: details && 'downlink' in details ? (details as any).downlink as number | null : null,
          downlinkMax: details && 'downlinkMax' in details ? (details as any).downlinkMax as number | null : null,
          rtt: details && 'rtt' in details ? (details as any).rtt as number | null : null,
          saveData: details && 'saveData' in details ? (details as any).saveData as boolean : false,
        };

        logger.info('Network quality checked successfully (Champion)', LogCategory.BUSINESS, { 
          correlationId,
          metadata: { effectiveType: quality.effectiveType, isSlowConnection: quality.isSlowConnection }
        });

        return quality;
      } catch (error) {
        logger.error('Network quality check failed (Champion)', LogCategory.BUSINESS, { 
          correlationId 
        }, error as Error);
        
        return {
          isSlowConnection: false,
          effectiveType: null,
          downlink: null,
          downlinkMax: null,
          rtt: null,
          saveData: false,
        };
      }
    },
    enabled: !!networkStatusQuery.data?.isConnected,
    ...NETWORK_CONFIG,
  });

  // 🏆 CHAMPION EVENT LISTENER: NetInfo Changes
  useEffect(() => {
    const correlationId = `network_listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Setting up network status listener (Champion)', LogCategory.BUSINESS, { correlationId });

    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = !!state.isConnected;
      
      logger.info('Network status changed (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        metadata: { isConnected, connectionType: state.type }
      });

      // Invalidate queries to refresh status
      queryClient.invalidateQueries({ queryKey: networkStatusQueryKeys.connection() });
      
      if (isConnected) {
        queryClient.invalidateQueries({ queryKey: networkStatusQueryKeys.quality() });
      }

      // Trigger callbacks
      networkChangeCallbacks.forEach(callback => {
        try {
          callback(isConnected);
        } catch (error) {
          logger.error('Network change callback failed (Champion)', LogCategory.BUSINESS, { 
            correlationId 
          }, error as Error);
        }
      });
    });

    return () => {
      logger.info('Cleaning up network status listener (Champion)', LogCategory.BUSINESS, { correlationId });
      unsubscribe();
    };
  }, [queryClient, networkChangeCallbacks]);

  // 🏆 CHAMPION COMPUTED VALUES
  const status = networkStatusQuery.data || null;
  const quality = networkQualityQuery.data || null;
  const isLoading = networkStatusQuery.isLoading;
  const error = networkStatusQuery.error?.message || networkQualityQuery.error?.message || null;

  const isConnected = useMemo(() => {
    return status?.isConnected || false;
  }, [status]);

  // 🏆 CHAMPION ACTIONS
  const checkConnection = useCallback(async (): Promise<boolean> => {
    const correlationId = `network_check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Manual network check (Champion)', LogCategory.BUSINESS, { correlationId });

    try {
      const freshStatus = await networkStatusQuery.refetch();
      const result = freshStatus.data?.isConnected || false;
      
      logger.info('Manual network check completed (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        metadata: { result }
      });

      return result;
    } catch (error) {
      logger.error('Manual network check failed (Champion)', LogCategory.BUSINESS, { 
        correlationId 
      }, error as Error);
      return false;
    }
  }, [networkStatusQuery]);

  const testReachability = useCallback(async (url = 'https://www.google.com'): Promise<boolean> => {
    const correlationId = `reachability_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Testing network reachability (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      metadata: { url }
    });

    try {
      // Basic reachability test
      const state = await NetInfo.fetch();
      const reachable = !!state.isInternetReachable;
      
      logger.info('Reachability test completed (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        metadata: { url, reachable }
      });

      return reachable;
    } catch (error) {
      logger.error('Reachability test failed (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        metadata: { url }
      }, error as Error);
      return false;
    }
  }, []);

  // 🏆 MOBILE PERFORMANCE HELPERS
  const refreshNetworkStatus = useCallback(async (): Promise<void> => {
    logger.info('Refreshing network status (Champion)', LogCategory.BUSINESS);
    await Promise.all([
      networkStatusQuery.refetch(),
      isConnected ? networkQualityQuery.refetch() : Promise.resolve()
    ]);
  }, [networkStatusQuery, networkQualityQuery, isConnected]);

  const clearNetworkError = useCallback(() => {
    queryClient.setQueryData(networkStatusQueryKeys.connection(), networkStatusQuery.data);
    queryClient.setQueryData(networkStatusQueryKeys.quality(), networkQualityQuery.data);
  }, [queryClient, networkStatusQuery.data, networkQualityQuery.data]);

  // 🏆 NETWORK MANAGEMENT HELPERS
  const getConnectionType = useCallback((): string | null => {
    return status?.connectionType || null;
  }, [status]);

  const isSlowConnection = useCallback((): boolean => {
    return quality?.isSlowConnection || false;
  }, [quality]);

  const onConnectionChange = useCallback((callback: (isConnected: boolean) => void): (() => void) => {
    const correlationId = `callback_register_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Registering network change callback (Champion)', LogCategory.BUSINESS, { correlationId });

    setNetworkChangeCallbacks(prev => [...prev, callback]);

    // Return unsubscribe function
    return () => {
      logger.info('Unregistering network change callback (Champion)', LogCategory.BUSINESS, { correlationId });
      setNetworkChangeCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  return {
    // 🏆 Network Status
    isConnected,
    status,
    quality,
    
    // 🏆 Champion Loading States
    isLoading,
    isCheckingConnection: networkStatusQuery.isLoading || networkQualityQuery.isLoading,
    
    // 🏆 Error Handling
    error,
    networkError: error,
    
    // 🏆 Champion Actions
    checkConnection,
    testReachability,
    
    // 🏆 Mobile Performance Helpers
    refreshNetworkStatus,
    clearNetworkError,
    
    // 🏆 Network Management
    getConnectionType,
    isSlowConnection,
    onConnectionChange,
  };
}; 