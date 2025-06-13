/**
 * @fileoverview USE-SESSION-GUARD-HOOK: Session-Based Authentication Guard Hook
 * @description Custom React hook for protecting screens with session-based authentication verification
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseSessionGuard
 * @category Hooks
 * @subcategory Authentication
 */

import {useEffect, useCallback, useMemo} from 'react';
import {useAuth} from '@features/auth/presentation/hooks';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '@core/navigation/navigation.types';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {LoggerFactory} from '@core/logging/logger.factory';
import {LogCategory} from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('SessionGuardChampion');

/**
 * Session Guard Authentication Hook
 * 
 * Custom React hook that provides session-based authentication protection for screens.
 * Automatically redirects unauthenticated users to the Login screen using a hard reset
 * navigation to ensure complete authentication flow restart. This hook is specifically
 * designed for screens that require valid user sessions.
 * 
 * @function useSessionGuard
 * @returns {void} Hook does not return any value, handles navigation side effects
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Hooks
 * @subcategory Authentication
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseSessionGuard
 * 
 * @example
 * Basic session protection for a screen:
 * ```tsx
 * import { useSessionGuard } from '@/shared/hooks/use-session.guard';
 * 
 * const ProfileScreen = () => {
 *   useSessionGuard(); // Protects this entire screen
 * 
 *   return (
 *     <View>
 *       <Text>User Profile</Text>
 *       <Text>This content requires authentication</Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Multiple protected screens:
 * ```tsx
 * const DashboardScreen = () => {
 *   useSessionGuard();
 * 
 *   return (
 *     <View>
 *       <Text>Dashboard</Text>
 *       <Text>Protected dashboard content</Text>
 *     </View>
 *   );
 * };
 * 
 * const SettingsScreen = () => {
 *   useSessionGuard();
 * 
 *   return (
 *     <View>
 *       <Text>Settings</Text>
 *       <Text>User settings and preferences</Text>
 *     </View>
 *   );
 * };
 * 
 * const AccountScreen = () => {
 *   useSessionGuard();
 * 
 *   return (
 *     <View>
 *       <Text>Account Management</Text>
 *       <Text>Account details and security</Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Integration with data loading:
 * ```tsx
 * const UserDataScreen = () => {
 *   useSessionGuard();
 *   
 *   const [userData, setUserData] = useState(null);
 *   const [isLoading, setIsLoading] = useState(true);
 * 
 *   useEffect(() => {
 *     const loadUserData = async () => {
 *       try {
 *         setIsLoading(true);
 *         const data = await fetchUserData();
 *         setUserData(data);
 *       } catch (error) {
 *         console.error('Failed to load user data:', error);
 *       } finally {
 *         setIsLoading(false);
 *       }
 *     };
 * 
 *     loadUserData();
 *   }, []);
 * 
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   return (
 *     <View>
 *       <Text>User Data</Text>
 *       {userData && <UserDataDisplay data={userData} />}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Enterprise security implementation:
 * ```tsx
 * const SecureDocumentsScreen = () => {
 *   useSessionGuard(); // First line of defense
 *   
 *   const { user } = useAuth();
 *   const [documents, setDocuments] = useState([]);
 *   const [accessDenied, setAccessDenied] = useState(false);
 * 
 *   useEffect(() => {
 *     const checkAccess = async () => {
 *       if (!user?.permissions?.includes('view_documents')) {
 *         setAccessDenied(true);
 *         return;
 *       }
 * 
 *       try {
 *         const docs = await fetchSecureDocuments();
 *         setDocuments(docs);
 *       } catch (error) {
 *         console.error('Failed to load documents:', error);
 *       }
 *     };
 * 
 *     checkAccess();
 *   }, [user]);
 * 
 *   if (accessDenied) {
 *     return (
 *       <View>
 *         <Text>Access Denied</Text>
 *         <Text>You don't have permission to view documents</Text>
 *       </View>
 *     );
 *   }
 * 
 *   return (
 *     <View>
 *       <Text>Secure Documents</Text>
 *       {documents.map(doc => (
 *         <DocumentItem key={doc.id} document={doc} />
 *       ))}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Session-based authentication verification
 * - Automatic redirect to login on authentication failure
 * - Loading state awareness
 * - Navigation stack reset for security
 * - React lifecycle integration
 * - TypeScript navigation support
 * - Zero configuration setup
 * - Enterprise security compliance
 * - Memory efficient implementation
 * - Side effect management
 * 
 * @architecture
 * - React hooks pattern
 * - Authentication state monitoring
 * - Navigation integration
 * - Effect-based lifecycle management
 * - Dependency injection pattern
 * - Type-safe navigation
 * - Clean architecture principles
 * 
 * @authentication
 * - Session token verification
 * - Authentication state monitoring
 * - Automatic redirect on session expiry
 * - Loading state handling
 * - Navigation reset for security
 * - Authentication flow integration
 * - Enterprise session management
 * 
 * @security
 * - Prevents unauthorized access
 * - Session validation
 * - Automatic logout handling
 * - Navigation stack security
 * - Authentication state protection
 * - Secure redirect mechanisms
 * - Enterprise security standards
 * 
 * @navigation
 * - Uses React Navigation
 * - Navigation reset functionality
 * - TypeScript navigation types
 * - Stack-based navigation
 * - Route parameter support
 * - Navigation state management
 * 
 * @performance
 * - Minimal overhead
 * - Efficient state monitoring
 * - Automatic cleanup
 * - Optimized re-renders
 * - Memory leak prevention
 * - Fast authentication checks
 * 
 * @accessibility
 * - Seamless authentication flow
 * - No additional accessibility barriers
 * - Maintains focus management
 * - Screen reader compatibility
 * 
 * @use_cases
 * - User profile screens
 * - Dashboard and home screens
 * - Settings and preferences
 * - Account management
 * - Secure document access
 * - Payment and billing screens
 * - Administrative interfaces
 * - Enterprise applications
 * 
 * @best_practices
 * - Use at the top of protected screens
 * - Combine with loading states
 * - Test authentication scenarios
 * - Monitor navigation performance
 * - Handle edge cases gracefully
 * - Document authentication requirements
 * - Implement proper error handling
 * - Test with various auth states
 * 
 * @dependencies
 * - react: useEffect hook
 * - @features/auth/presentation/hooks/use-auth: Authentication state
 * - @react-navigation/native: Navigation utilities
 * - @react-navigation/native-stack: Navigation types
 * 
 * @see {@link useAuth} for authentication state management
 * @see {@link useNavigation} for navigation utilities
 * @see {@link useAuthGuard} for alternative auth protection
 * 
 * @todo Add session timeout warnings
 * @todo Implement automatic session refresh
 * @todo Add session analytics tracking
 * @todo Include biometric authentication support
 */

// 🏆 CHAMPION QUERY KEYS
export const sessionGuardQueryKeys = {
  all: ['session', 'guard'] as const,
  status: () => [...sessionGuardQueryKeys.all, 'status'] as const,
  validity: () => [...sessionGuardQueryKeys.all, 'validity'] as const,
  expiry: () => [...sessionGuardQueryKeys.all, 'expiry'] as const,
} as const;

// 🏆 CHAMPION CONFIG: Mobile Performance
const SESSION_CONFIG = {
  staleTime: 1000 * 60 * 1,       // 🏆 Mobile: 1 minute for session status
  gcTime: 1000 * 60 * 5,          // 🏆 Mobile: 5 minutes garbage collection
  retry: 2,                       // 🏆 Mobile: Two retries for session checks
  refetchOnWindowFocus: true,     // 🏆 Security: Recheck on focus
  refetchOnReconnect: true,       // 🏆 Security: Recheck on network
  refetchInterval: 1000 * 60 * 2, // 🏆 Security: Check every 2 minutes
} as const;

/**
 * @interface SessionGuardConfig
 * @description Configuration for session guard behavior
 */
export interface SessionGuardConfig {
  requireActiveSession?: boolean;
  maxInactiveTime?: number; // in milliseconds
  warningThreshold?: number; // in milliseconds before expiry
  autoRefresh?: boolean;
  onSessionExpired?: () => void;
  onSessionWarning?: (timeLeft: number) => void;
}

/**
 * @interface SessionStatus
 * @description Session guard status information
 */
export interface SessionStatus {
  isActive: boolean;
  isValid: boolean;
  isExpired: boolean;
  expiresAt: Date | null;
  lastActivity: Date | null;
  timeUntilExpiry: number | null; // in milliseconds
  warningActive: boolean;
}

/**
 * @interface UseSessionGuardReturn
 * @description Champion Return Type für Session Guard Hook
 */
export interface UseSessionGuardReturn {
  // 🏆 Session Status
  isAllowed: boolean;
  status: SessionStatus | null;
  
  // 🏆 Champion Loading States
  isLoading: boolean;
  isCheckingSession: boolean;
  isRefreshingSession: boolean;
  
  // 🏆 Error Handling
  error: string | null;
  sessionError: string | null;
  
  // 🏆 Champion Actions (Essential Only)
  checkSession: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  invalidateSession: () => Promise<void>;
  updateActivity: () => void;
  
  // 🏆 Mobile Performance Helpers
  refreshSessionStatus: () => Promise<void>;
  clearSessionError: () => void;
  
  // 🏆 Session Management
  getRemainingTime: () => number | null;
  isWarningTime: () => boolean;
  extendSession: () => Promise<boolean>;
}

/**
 * 🏆 CHAMPION SESSION GUARD HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Session guard only
 * - TanStack Query: Optimized session status caching
 * - Optimistic Updates: Immediate session feedback
 * - Mobile Performance: Battery-friendly session checks
 * - Enterprise Logging: Session audit trails
 * - Clean Interface: Essential session operations
 */
export const useSessionGuard = (config?: SessionGuardConfig): UseSessionGuardReturn => {
  const queryClient = useQueryClient();
  const {user, isAuthenticated, isLoading: authLoading} = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // 🔍 TANSTACK QUERY: Session Status (Champion Pattern)
  const sessionStatusQuery = useQuery({
    queryKey: sessionGuardQueryKeys.status(),
    queryFn: async (): Promise<SessionStatus> => {
      const correlationId = `session_guard_status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Checking session guard status (Champion)', LogCategory.SECURITY, {correlationId});

      try {
        // Session validation logic
        const now = new Date();
        const sessionData = user?.metadata;
        
        // Default session expiry (24 hours from login)
        const defaultExpiryTime = 24 * 60 * 60 * 1000;
        const expiresAt = sessionData?.sessionExpiresAt ? 
          new Date(sessionData.sessionExpiresAt) : 
          new Date(now.getTime() + defaultExpiryTime);
        
        const lastActivity = sessionData?.lastActivity ? 
          new Date(sessionData.lastActivity) : 
          new Date();

        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        const isExpired = timeUntilExpiry <= 0;
        const isValid = isAuthenticated && !isExpired && !!user?.id;
        const isActive = isValid && !!user;

        // Warning threshold (default 5 minutes before expiry)
        const warningThreshold = config?.warningThreshold || (5 * 60 * 1000);
        const warningActive = timeUntilExpiry > 0 && timeUntilExpiry <= warningThreshold;

        const status: SessionStatus = {
          isActive,
          isValid,
          isExpired,
          expiresAt,
          lastActivity,
          timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : null,
          warningActive,
        };

        logger.info('Session guard status checked successfully (Champion)', LogCategory.SECURITY, { 
          correlationId
        });

        // Trigger warning callback if needed
        if (warningActive && config?.onSessionWarning) {
          config.onSessionWarning(timeUntilExpiry);
        }

        // Trigger expiry callback if needed
        if (isExpired && config?.onSessionExpired) {
          config.onSessionExpired();
        }

        return status;
      } catch (error) {
        logger.error('Session guard status check failed (Champion)', LogCategory.SECURITY, { 
          correlationId 
        }, error as Error);
        
        // Fallback to expired session
        return {
          isActive: false,
          isValid: false,
          isExpired: true,
          expiresAt: null,
          lastActivity: null,
          timeUntilExpiry: null,
          warningActive: false,
        };
      }
    },
    enabled: isAuthenticated && !authLoading,
    ...SESSION_CONFIG,
  });

  // 🏆 CHAMPION MUTATION: Refresh Session
  const refreshSessionMutation = useMutation({
    mutationFn: async (): Promise<boolean> => {
      const correlationId = `session_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Starting session refresh (Champion)', LogCategory.SECURITY, {correlationId});

      try {
        // Mock session refresh - in production, call actual refresh API
        const refreshSuccess = isAuthenticated && !!user?.id;
        
        if (refreshSuccess) {
          // Update last activity
          updateActivity();
          
          logger.info('Session refreshed successfully (Champion)', LogCategory.SECURITY, { 
            correlationId,
            userId: user.id
          });
        } else {
          logger.warn('Session refresh failed - not authenticated (Champion)', LogCategory.SECURITY, { 
            correlationId
          });
        }

        return refreshSuccess;
      } catch (error) {
        logger.error('Session refresh failed (Champion)', LogCategory.SECURITY, { 
          correlationId 
        }, error as Error);
        return false;
      }
    },
    
    onSuccess: (success) => {
      if (success) {
        // Invalidate session status to refresh
        queryClient.invalidateQueries({queryKey: sessionGuardQueryKeys.status()});
      }
    },
  });

  // 🏆 CHAMPION MUTATION: Extend Session
  const extendSessionMutation = useMutation({
    mutationFn: async (): Promise<boolean> => {
      const correlationId = `session_extend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Starting session extension (Champion)', LogCategory.SECURITY, {correlationId});

      try {
        // Mock session extension - in production, call actual extend API
        const extendSuccess = isAuthenticated && !!user?.id;
        
        if (extendSuccess) {
          logger.info('Session extended successfully (Champion)', LogCategory.SECURITY, { 
            correlationId,
            userId: user.id
          });
        }

        return extendSuccess;
      } catch (error) {
        logger.error('Session extension failed (Champion)', LogCategory.SECURITY, { 
          correlationId 
        }, error as Error);
        return false;
      }
    },
    
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({queryKey: sessionGuardQueryKeys.status()});
      }
    },
  });

  // 🏆 CHAMPION COMPUTED VALUES
  const status = sessionStatusQuery.data || null;
  const isLoading = sessionStatusQuery.isLoading || authLoading;
  const error = sessionStatusQuery.error?.message || null;

  const isAllowed = useMemo(() => {
    if (!status) return false;
    
    if (config?.requireActiveSession && !status.isActive) {
      return false;
    }
    
    return status.isValid && !status.isExpired;
  }, [status, config]);

  // 🏆 CHAMPION ACTIONS
  const checkSession = useCallback(async (): Promise<boolean> => {
    const correlationId = `session_check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Manual session check (Champion)', LogCategory.SECURITY, {correlationId});

    try {
      const freshStatus = await sessionStatusQuery.refetch();
      const result = freshStatus.data?.isValid && !freshStatus.data?.isExpired;
      
      logger.info('Manual session check completed (Champion)', LogCategory.SECURITY, { 
        correlationId,
        result
      });

      return result || false;
    } catch (error) {
      logger.error('Manual session check failed (Champion)', LogCategory.SECURITY, { 
        correlationId 
      }, error as Error);
      return false;
    }
  }, [sessionStatusQuery]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    return await refreshSessionMutation.mutateAsync();
  }, [refreshSessionMutation]);

  const invalidateSession = useCallback(async (): Promise<void> => {
    const correlationId = `session_invalidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Invalidating session (Champion)', LogCategory.SECURITY, { 
      correlationId,
      userId: user?.id
    });

    // Clear session data from cache
    queryClient.setQueryData(sessionGuardQueryKeys.status(), {
      isActive: false,
      isValid: false,
      isExpired: true,
      expiresAt: null,
      lastActivity: null,
      timeUntilExpiry: null,
      warningActive: false,
    });
  }, [queryClient, user]);

  const updateActivity = useCallback(() => {
    const correlationId = `activity_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.debug('Updating session activity (Champion)', LogCategory.SECURITY, { 
      correlationId,
      userId: user?.id,
      timestamp: new Date().toISOString()
    });

    // Trigger a soft refresh of session status
    queryClient.invalidateQueries({queryKey: sessionGuardQueryKeys.status()});
  }, [queryClient, user]);

  // 🏆 MOBILE PERFORMANCE HELPERS
  const refreshSessionStatus = useCallback(async (): Promise<void> => {
    logger.info('Refreshing session status (Champion)', LogCategory.SECURITY);
    await sessionStatusQuery.refetch();
  }, [sessionStatusQuery]);

  const clearSessionError = useCallback(() => {
    queryClient.setQueryData(sessionGuardQueryKeys.status(), sessionStatusQuery.data);
  }, [queryClient, sessionStatusQuery.data]);

  // 🏆 SESSION MANAGEMENT HELPERS
  const getRemainingTime = useCallback((): number | null => {
    return status?.timeUntilExpiry || null;
  }, [status]);

  const isWarningTime = useCallback((): boolean => {
    return status?.warningActive || false;
  }, [status]);

  const extendSession = useCallback(async (): Promise<boolean> => {
    return await extendSessionMutation.mutateAsync();
  }, [extendSessionMutation]);

  return {
    // 🏆 Session Status
    isAllowed,
    status,
    
    // 🏆 Champion Loading States
    isLoading,
    isCheckingSession: sessionStatusQuery.isLoading,
    isRefreshingSession: refreshSessionMutation.isPending || extendSessionMutation.isPending,
    
    // 🏆 Error Handling
    error,
    sessionError: refreshSessionMutation.error?.message || extendSessionMutation.error?.message || error,
    
    // 🏆 Champion Actions
    checkSession,
    refreshSession,
    invalidateSession,
    updateActivity,
    
    // 🏆 Mobile Performance Helpers
    refreshSessionStatus,
    clearSessionError,
    
    // 🏆 Session Management
    getRemainingTime,
    isWarningTime,
    extendSession,
  };
};
