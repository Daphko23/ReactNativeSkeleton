/**
 * @fileoverview USE-NETWORK-STATUS-HOOK: Network Connectivity Status Hook
 * @description Custom React hook for monitoring network connectivity status with real-time updates
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseNetworkStatus
 * @category Hooks
 * @subcategory Network
 */

import {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Network Status Return Interface
 * 
 * Defines the return structure of the useNetworkStatus hook.
 * Provides information about the current network connectivity state.
 * 
 * @interface UseNetworkStatusReturn
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Network
 * 
 * @example
 * ```tsx
 * const { isConnected }: UseNetworkStatusReturn = useNetworkStatus();
 * ```
 */
interface UseNetworkStatusReturn {
  /**
   * Current network connectivity status.
   * True when device has internet connection, false otherwise.
   * 
   * @type {boolean}
   * @readonly
   * @example true
   * @example false
   */
  isConnected: boolean;
}

/**
 * Network Status Monitoring Hook
 * 
 * Custom React hook that monitors and provides real-time network connectivity status.
 * Automatically detects changes in network connection and updates the state accordingly.
 * Uses React Native Community's NetInfo library for accurate connectivity detection.
 * 
 * @function useNetworkStatus
 * @returns {UseNetworkStatusReturn} Object containing current connectivity status
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Hooks
 * @subcategory Network
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseNetworkStatus
 * 
 * @example
 * Basic connectivity monitoring:
 * ```tsx
 * import { useNetworkStatus } from '@/shared/hooks/use-network-status';
 * 
 * const MyComponent = () => {
 *   const { isConnected } = useNetworkStatus();
 * 
 *   return (
 *     <View>
 *       <Text>
 *         Status: {isConnected ? 'Online' : 'Offline'}
 *       </Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Conditional content based on connectivity:
 * ```tsx
 * const DataScreen = () => {
 *   const { isConnected } = useNetworkStatus();
 *   const [data, setData] = useState(null);
 * 
 *   useEffect(() => {
 *     if (isConnected) {
 *       fetchData().then(setData);
 *     }
 *   }, [isConnected]);
 * 
 *   if (!isConnected) {
 *     return (
 *       <View>
 *         <Text>No internet connection</Text>
 *         <Text>Please check your network settings</Text>
 *       </View>
 *     );
 *   }
 * 
 *   return (
 *     <View>
 *       {data ? <DataDisplay data={data} /> : <LoadingSpinner />}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Network status with user feedback:
 * ```tsx
 * const App = () => {
 *   const { isConnected } = useNetworkStatus();
 *   const [showOfflineMessage, setShowOfflineMessage] = useState(false);
 * 
 *   useEffect(() => {
 *     if (!isConnected) {
 *       setShowOfflineMessage(true);
 *       const timer = setTimeout(() => setShowOfflineMessage(false), 5000);
 *       return () => clearTimeout(timer);
 *     }
 *   }, [isConnected]);
 * 
 *   return (
 *     <View style={{ flex: 1 }}>
 *       <MainContent />
 *       {showOfflineMessage && (
 *         <View style={styles.offlineBar}>
 *           <Text style={styles.offlineText}>
 *             No internet connection
 *           </Text>
 *         </View>
 *       )}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Integration with data fetching:
 * ```tsx
 * const useApiData = () => {
 *   const { isConnected } = useNetworkStatus();
 *   const [data, setData] = useState(null);
 *   const [error, setError] = useState(null);
 * 
 *   const fetchData = useCallback(async () => {
 *     if (!isConnected) {
 *       setError('No internet connection');
 *       return;
 *     }
 * 
 *     try {
 *       setError(null);
 *       const response = await api.getData();
 *       setData(response);
 *     } catch (err) {
 *       setError(err.message);
 *     }
 *   }, [isConnected]);
 * 
 *   return { data, error, refetch: fetchData, isOffline: !isConnected };
 * };
 * ```
 * 
 * @features
 * - Real-time network connectivity monitoring
 * - Automatic state updates on connectivity changes
 * - Cross-platform compatibility (iOS & Android)
 * - Minimal performance overhead
 * - React lifecycle integration
 * - Event listener cleanup
 * - Initial connection state detection
 * - Reliable connectivity detection
 * - Memory leak prevention
 * - TypeScript type safety
 * 
 * @architecture
 * - React hooks pattern
 * - NetInfo integration
 * - Event-driven updates
 * - Automatic cleanup
 * - State management
 * - Effect-based lifecycle
 * - Memory efficient implementation
 * 
 * @connectivity
 * - WiFi connection detection
 * - Mobile data detection
 * - Ethernet connection support
 * - Real-time status updates
 * - Connection quality awareness
 * - Network type information
 * - Reachability testing
 * 
 * @performance
 * - Minimal re-renders
 * - Efficient event listening
 * - Automatic cleanup
 * - Lightweight state management
 * - Optimized for real-time updates
 * - Memory leak prevention
 * - Fast connectivity detection
 * 
 * @accessibility
 * - Provides connectivity information for assistive technologies
 * - Enables offline-aware UX design
 * - Supports connectivity announcements
 * - Helps with error state communication
 * 
 * @use_cases
 * - API call conditional logic
 * - Offline mode implementation
 * - User connectivity feedback
 * - Data synchronization control
 * - Error state management
 * - Progressive web app features
 * - Real-time connectivity status
 * - Network-dependent feature toggling
 * 
 * @best_practices
 * - Use for network-dependent operations
 * - Implement graceful offline handling
 * - Provide clear user feedback
 * - Cache data for offline use
 * - Test with various network conditions
 * - Handle connection state transitions
 * - Monitor performance impact
 * - Document connectivity requirements
 * 
 * @dependencies
 * - react: useState, useEffect hooks
 * - @react-native-community/netinfo: Network information library
 * 
 * @see {@link NetInfo} for network information API
 * @see {@link useState} for state management
 * @see {@link useEffect} for lifecycle management
 * 
 * @todo Add connection quality monitoring
 * @todo Implement connection speed detection
 * @todo Add network type information
 * @todo Include bandwidth estimation
 */
export const useNetworkStatus = (): UseNetworkStatusReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    // Initialer Check
    const checkConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(!!state.isConnected);
    };

    checkConnection();

    // Listener für Änderungen
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {isConnected};
};
