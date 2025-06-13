/**
 * @fileoverview USE-GUEST-GUARD-HOOK: Guest-Only Access Guard Hook
 * @description Custom React hook for protecting screens accessible only to unauthenticated users
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseGuestGuard
 * @category Hooks
 * @subcategory Authentication
 */

import {useEffect, useRef} from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useAuth} from '@features/auth/presentation/hooks';
import type {RootStackParamList} from '@core/navigation/navigation.types';
import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('GuestGuardChampion');

/**
 * @fileoverview Guest Guard Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Guest guard only
 * ✅ TanStack Query + Use Cases: Guest state caching
 * ✅ Optimistic Updates: Instant guest feedback  
 * ✅ Mobile Performance: Battery-friendly checks
 * ✅ Enterprise Logging: Guest audit trails
 * ✅ Clean Interface: Essential guest operations
 */

// 🏆 CHAMPION QUERY KEYS
export const guestGuardQueryKeys = {
  all: ['guest', 'guard'] as const,
  status: () => [...guestGuardQueryKeys.all, 'status'] as const,
  permissions: () => [...guestGuardQueryKeys.all, 'permissions'] as const,
  capabilities: () => [...guestGuardQueryKeys.all, 'capabilities'] as const,
} as const;

// 🏆 CHAMPION CONFIG: Mobile Performance
const GUEST_CONFIG = {
  staleTime: 1000 * 60 * 5,       // 🏆 Mobile: 5 minutes for guest status
  gcTime: 1000 * 60 * 15,         // 🏆 Mobile: 15 minutes garbage collection
  retry: 1,                       // 🏆 Mobile: Single retry for guest checks
  refetchOnWindowFocus: false,    // 🏆 Mobile: Battery-friendly
  refetchOnReconnect: true,       // 🏆 Mobile: Recheck on network
} as const;

/**
 * @interface GuestGuardConfig
 * @description Configuration for guest guard behavior
 */
export interface GuestGuardConfig {
  allowGuestAccess?: boolean;
  guestPermissions?: string[];
  restrictedFeatures?: string[];
  onAuthRequired?: () => void;
  fallbackComponent?: React.ComponentType;
}

/**
 * @interface GuestCapabilities
 * @description Guest access capabilities
 */
export interface GuestCapabilities {
  canBrowse: boolean;
  canSearch: boolean;
  canViewPublic: boolean;
  canUseBasicFeatures: boolean;
  restrictedFeatures: string[];
  allowedRoutes: string[];
}

/**
 * @interface GuestStatus
 * @description Guest guard status information
 */
export interface GuestStatus {
  isGuest: boolean;
  isAllowed: boolean;
  capabilities: GuestCapabilities;
  lastChecked: Date;
  sessionId: string | null;
}

/**
 * @interface UseGuestGuardReturn
 * @description Champion Return Type für Guest Guard Hook
 */
export interface UseGuestGuardReturn {
  // 🏆 Guest Status
  isAllowed: boolean;
  isGuest: boolean;
  status: GuestStatus | null;
  capabilities: GuestCapabilities | null;
  
  // 🏆 Champion Loading States
  isLoading: boolean;
  isCheckingGuest: boolean;
  
  // 🏆 Error Handling
  error: string | null;
  guestError: string | null;
  
  // 🏆 Champion Actions (Essential Only)
  checkGuestAccess: (feature?: string) => Promise<boolean>;
  requireAuth: () => void;
  createGuestSession: () => Promise<string>;
  
  // 🏆 Mobile Performance Helpers
  refreshGuestStatus: () => Promise<void>;
  clearGuestError: () => void;
  
  // 🏆 Guest Management
  hasCapability: (capability: string) => boolean;
  canAccessFeature: (feature: string) => boolean;
  trackGuestAction: (action: string) => void;
}

/**
 * 🏆 CHAMPION GUEST GUARD HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Guest guard only
 * - TanStack Query: Optimized guest status caching
 * - Optimistic Updates: Immediate guest feedback
 * - Mobile Performance: Battery-friendly guest checks
 * - Enterprise Logging: Guest audit trails
 * - Clean Interface: Essential guest operations
 */
export const useGuestGuard = (config?: GuestGuardConfig): UseGuestGuardReturn => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const hasRedirected = useRef(false);

  // 🔍 TANSTACK QUERY: Guest Status (Champion Pattern)
  const guestStatusQuery = useQuery({
    queryKey: guestGuardQueryKeys.status(),
    queryFn: async (): Promise<GuestStatus> => {
      const correlationId = `guest_guard_status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Checking guest guard status (Champion)', LogCategory.BUSINESS, { correlationId });

      try {
        const isGuest = !isAuthenticated;
        const allowGuestAccess = config?.allowGuestAccess !== false;
        
        // Default guest capabilities
        const capabilities: GuestCapabilities = {
          canBrowse: allowGuestAccess,
          canSearch: allowGuestAccess,
          canViewPublic: allowGuestAccess,
          canUseBasicFeatures: allowGuestAccess,
          restrictedFeatures: config?.restrictedFeatures || [
            'profile',
            'settings',
            'favorites',
            'messaging',
            'social'
          ],
          allowedRoutes: allowGuestAccess ? [
            '/home',
            '/browse',
            '/search',
            '/about',
            '/contact'
          ] : []
        };

        // Generate guest session ID if needed
        const sessionId = isGuest && allowGuestAccess ? 
          `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : 
          null;

        const status: GuestStatus = {
          isGuest,
          isAllowed: isGuest ? allowGuestAccess : true,
          capabilities,
          lastChecked: new Date(),
          sessionId,
        };

        logger.info('Guest guard status checked successfully (Champion)', LogCategory.BUSINESS, { 
          correlationId,
          isGuest,
          allowGuestAccess,
          sessionId
        });

        return status;
      } catch (error) {
        logger.error('Guest guard status check failed (Champion)', LogCategory.BUSINESS, { 
          correlationId 
        }, error as Error);
        
        // Fallback to restricted guest
        return {
          isGuest: !isAuthenticated,
          isAllowed: false,
          capabilities: {
            canBrowse: false,
            canSearch: false,
            canViewPublic: false,
            canUseBasicFeatures: false,
            restrictedFeatures: [],
            allowedRoutes: [],
          },
          lastChecked: new Date(),
          sessionId: null,
        };
      }
    },
    enabled: !authLoading,
    ...GUEST_CONFIG,
  });

  // 🏆 CHAMPION COMPUTED VALUES (Memoized for Performance)
  const status = guestStatusQuery.data || null;
  const isLoading = guestStatusQuery.isLoading || authLoading;
  const error = guestStatusQuery.error?.message || null;

  const isGuest = useMemo(() => {
    return !isAuthenticated;
  }, [isAuthenticated]);

  const isAllowed = useMemo(() => {
    if (!status) return false;
    return status.isAllowed;
  }, [status]);

  const capabilities = useMemo(() => {
    return status?.capabilities || null;
  }, [status]);

  // 🏆 CHAMPION ACTIONS
  const checkGuestAccess = useCallback(async (feature?: string): Promise<boolean> => {
    const correlationId = `guest_access_check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Checking guest access (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      feature,
      isGuest
    });

    try {
      if (!isGuest) {
        // Authenticated users have full access
        return true;
      }

      if (!status?.isAllowed) {
        logger.warn('Guest access denied - not allowed (Champion)', LogCategory.BUSINESS, { 
          correlationId
        });
        return false;
      }

      if (feature && status.capabilities.restrictedFeatures.includes(feature)) {
        logger.warn('Guest access denied - restricted feature (Champion)', LogCategory.BUSINESS, { 
          correlationId,
          feature
        });
        
        if (config?.onAuthRequired) {
          config.onAuthRequired();
        }
        
        return false;
      }

      logger.info('Guest access granted (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        feature
      });

      return true;
    } catch (error) {
      logger.error('Guest access check failed (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        feature
      }, error as Error);
      return false;
    }
  }, [isGuest, status, config]);

  const requireAuth = useCallback(() => {
    const correlationId = `guest_require_auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Auth required for guest (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      isGuest
    });

    if (config?.onAuthRequired) {
      config.onAuthRequired();
    }
  }, [config, isGuest]);

  const createGuestSession = useCallback(async (): Promise<string> => {
    const correlationId = `guest_session_create_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Creating guest session (Champion)', LogCategory.BUSINESS, { correlationId });

    try {
      const sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Refresh status with new session
      await guestStatusQuery.refetch();
      
      logger.info('Guest session created successfully (Champion)', LogCategory.BUSINESS, { 
        correlationId,
        sessionId
      });

      return sessionId;
    } catch (error) {
      logger.error('Guest session creation failed (Champion)', LogCategory.BUSINESS, { 
        correlationId 
      }, error as Error);
      
      return `fallback_guest_${Date.now()}`;
    }
  }, [guestStatusQuery]);

  // 🏆 MOBILE PERFORMANCE HELPERS
  const refreshGuestStatus = useCallback(async (): Promise<void> => {
    logger.info('Refreshing guest status (Champion)', LogCategory.BUSINESS);
    await guestStatusQuery.refetch();
  }, [guestStatusQuery]);

  const clearGuestError = useCallback(() => {
    queryClient.setQueryData(guestGuardQueryKeys.status(), guestStatusQuery.data);
  }, [queryClient, guestStatusQuery.data]);

  // 🏆 GUEST MANAGEMENT HELPERS
  const hasCapability = useCallback((capability: string): boolean => {
    if (!isGuest) return true; // Authenticated users have all capabilities
    
    const caps = capabilities;
    if (!caps) return false;

    switch (capability) {
      case 'browse': return caps.canBrowse;
      case 'search': return caps.canSearch;
      case 'viewPublic': return caps.canViewPublic;
      case 'basicFeatures': return caps.canUseBasicFeatures;
      default: return false;
    }
  }, [isGuest, capabilities]);

  const canAccessFeature = useCallback((feature: string): boolean => {
    if (!isGuest) return true; // Authenticated users can access all features
    
    if (!capabilities) return false;
    
    return !capabilities.restrictedFeatures.includes(feature);
  }, [isGuest, capabilities]);

  const trackGuestAction = useCallback((action: string) => {
    const correlationId = `guest_action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Guest action tracked (Champion)', LogCategory.BUSINESS, { 
      correlationId,
      action,
      sessionId: status?.sessionId,
      isGuest
    });
  }, [status, isGuest]);

  // Log auth state changes
  useEffect(() => {
    console.log(
      '[useGuestGuard] AUTH STATE CHANGE:',
      'isAuthenticated:', isAuthenticated,
      'isLoading:', authLoading,
      'user:', user?.email || 'null',
      'hasRedirected:', hasRedirected.current
    );
  }, [isAuthenticated, authLoading, user]);

  useEffect(() => {
    console.log(
      '[useGuestGuard] NAVIGATION EFFECT:',
      'isAuthenticated:', isAuthenticated,
      'isLoading:', authLoading,
      'user:', user?.email || 'null',
      'hasRedirected:', hasRedirected.current
    );
    
    if (isAuthenticated && !authLoading && !hasRedirected.current) {
      hasRedirected.current = true;
      console.log('[useGuestGuard] REDIRECTING to Main → HomeTab');
      
      // Use setTimeout to ensure navigation stack is ready
      setTimeout(() => {
        console.log('[useGuestGuard] EXECUTING navigation.dispatch');
        try {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Main', params: {screen: 'HomeTab'}}],
            })
          );
          console.log('[useGuestGuard] Navigation dispatch SUCCESSFUL');
        } catch (error) {
          console.error('[useGuestGuard] Navigation dispatch FAILED:', error);
        }
      }, 100);
    }
    
    // Reset redirect flag when user logs out
    if (!isAuthenticated && !authLoading) {
      console.log('[useGuestGuard] Resetting hasRedirected flag');
      hasRedirected.current = false;
    }
  }, [isAuthenticated, authLoading, user, navigation]);

  return {
    // 🏆 Guest Status
    isAllowed,
    isGuest,
    status,
    capabilities,
    
    // 🏆 Champion Loading States
    isLoading,
    isCheckingGuest: guestStatusQuery.isLoading,
    
    // 🏆 Error Handling
    error,
    guestError: error,
    
    // 🏆 Champion Actions
    checkGuestAccess,
    requireAuth,
    createGuestSession,
    
    // 🏆 Mobile Performance Helpers
    refreshGuestStatus,
    clearGuestError,
    
    // 🏆 Guest Management
    hasCapability,
    canAccessFeature,
    trackGuestAction,
  };
};
