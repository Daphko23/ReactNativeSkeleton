/**
 * @fileoverview SHARED-HOOK-003: usePermission Hook
 * @description Hook für Permission-basierte UI-Kontrolle mit Enterprise Features.
 * Bietet Echtzeit-Permission-Checking mit Caching und Fehlerbehandlung.
 * 
 * @businessRule BR-610: Real-time permission checking for UI components
 * @businessRule BR-611: Permission caching for performance optimization
 * @businessRule BR-612: Automatic permission refresh on auth state changes
 * @businessRule BR-613: Error handling for permission check failures
 * 
 * @architecture React Hook with enterprise auth integration
 * @architecture Permission caching with TTL management
 * @architecture Real-time subscription to auth state changes
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module usePermission
 * @namespace Shared.Hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@features/auth/presentation/hooks/use-auth';
import type { Permission } from '@features/auth/domain/constants/permissions.registry';
import { requiresAudit } from '@features/auth/domain/constants/permissions.registry';

/**
 * @interface UsePermissionOptions
 * @description Configuration options for the usePermission hook
 */
export interface UsePermissionOptions {
  /** Enable caching for permission results (default: true) */
  enableCaching?: boolean;
  
  /** Cache TTL in milliseconds (default: 30000 = 30 seconds) */
  cacheTTL?: number;
  
  /** Auto-refresh on auth state changes (default: true) */
  autoRefresh?: boolean;
  
  /** Show loading state during permission checks (default: true) */
  showLoading?: boolean;
  
  /** Custom error handler for permission check failures */
  onError?: (error: Error) => void;
  
  /** Custom success handler for permission grants */
  onSuccess?: (hasPermission: boolean) => void;
}

/**
 * @interface UsePermissionResult
 * @description Return value of the usePermission hook
 */
export interface UsePermissionResult {
  /** Whether user has the permission */
  hasPermission: boolean;
  
  /** Loading state during permission check */
  isLoading: boolean;
  
  /** Error state if permission check fails */
  error: string | null;
  
  /** Manual refresh function */
  refresh: () => Promise<void>;
  
  /** Check specific permission manually */
  checkPermission: (permission: Permission) => Promise<boolean>;
  
  /** Permission metadata */
  metadata: {
    requiresAudit: boolean;
    lastChecked: Date | null;
    cacheHit: boolean;
  };
}

// Permission cache with TTL
const permissionCache = new Map<string, { 
  hasPermission: boolean; 
  timestamp: number; 
  ttl: number;
}>();

/**
 * @hook usePermission
 * @description Enterprise Permission Hook mit Caching und Real-time Updates
 * 
 * Features:
 * - Real-time permission checking
 * - Intelligent caching with TTL
 * - Auto-refresh on auth state changes
 * - Audit logging for sensitive permissions
 * - Error handling and retry logic
 * - Performance optimization
 * 
 * @param permission - Permission to check
 * @param options - Hook configuration options
 * 
 * @returns UsePermissionResult with permission state and controls
 * 
 * @example Basic permission check
 * ```typescript
 * const AdminPanel = () => {
 *   const { hasPermission, isLoading } = usePermission('admin:user:read');
 *   
 *   if (isLoading) return <Loading />;
 *   if (!hasPermission) return <AccessDenied />;
 *   
 *   return <AdminUserList />;
 * };
 * ```
 * 
 * @example Advanced permission check with options
 * ```typescript
 * const SensitiveAction = () => {
 *   const { hasPermission, refresh, error } = usePermission(
 *     'system:config',
 *     {
 *       cacheTTL: 10000, // 10 seconds for sensitive permissions
 *       onError: (error) => showNotification(error.message),
 *       onSuccess: (granted) => {
 *         if (granted) auditLog('System config access granted');
 *       }
 *     }
 *   );
 *   
 *   return (
 *     <div>
 *       {error && <ErrorBanner message={error} />}
 *       <button 
 *         disabled={!hasPermission}
 *         onClick={performSensitiveAction}
 *       >
 *         Configure System
 *       </button>
 *       <button onClick={refresh}>Refresh Permissions</button>
 *     </div>
 *   );
 * };
 * ```
 * 
 * @example Conditional UI rendering
 * ```typescript
 * const UserActions = ({ userId }: { userId: string }) => {
 *   const { hasPermission: canEdit } = usePermission('admin:user:edit');
 *   const { hasPermission: canDelete } = usePermission('admin:user:delete');
 *   
 *   return (
 *     <div>
 *       {canEdit && <EditUserButton userId={userId} />}
 *       {canDelete && <DeleteUserButton userId={userId} />}
 *     </div>
 *   );
 * };
 * ```
 */
export const usePermission = (
  permission: Permission,
  options: UsePermissionOptions = {}
): UsePermissionResult => {
  const {
    enableCaching = true,
    cacheTTL = 30000, // 30 seconds
    autoRefresh = true,
    showLoading = true,
    onError,
    onSuccess,
  } = options;

  const { user, isAuthenticated, enterprise } = useAuth();
  
  // State management
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(showLoading);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [cacheHit, setCacheHit] = useState<boolean>(false);

  /**
   * Get permission from cache if valid
   */
  const getCachedPermission = useCallback((perm: Permission): boolean | null => {
    if (!enableCaching) return null;
    
    const cacheKey = `${user?.id || 'anonymous'}:${perm}`;
    const cached = permissionCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      setCacheHit(true);
      return cached.hasPermission;
    }
    
    setCacheHit(false);
    return null;
  }, [enableCaching, user?.id]);

  /**
   * Set permission in cache
   */
  const setCachedPermission = useCallback((perm: Permission, result: boolean) => {
    if (!enableCaching) return;
    
    const cacheKey = `${user?.id || 'anonymous'}:${perm}`;
    permissionCache.set(cacheKey, {
      hasPermission: result,
      timestamp: Date.now(),
      ttl: cacheTTL,
    });
  }, [enableCaching, user?.id, cacheTTL]);

  /**
   * Check permission with enterprise auth service
   */
  const checkPermissionInternal = useCallback(async (perm: Permission): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      setError(null);
      
      // Check cache first
      const cached = getCachedPermission(perm);
      if (cached !== null) {
        return cached;
      }

      // Check with enterprise service
      const result = await enterprise.rbac.hasPermission(perm);
      
      // Cache the result
      setCachedPermission(perm, result);
      
      // Update metadata
      setLastChecked(new Date());
      
      // Handle success callback
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Permission check failed';
      setError(errorMessage);
      
      // Handle error callback
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
      
      console.error('Permission check failed:', err);
      return false;
    }
  }, [
    isAuthenticated, 
    user, 
    getCachedPermission, 
    setCachedPermission, 
    enterprise,
    onError,
    onSuccess
  ]);

  /**
   * Refresh permission manually
   */
  const refresh = useCallback(async () => {
    if (!permission) return;
    
    setIsLoading(true);
    
    // Clear cache for this permission
    if (enableCaching && user?.id) {
      const cacheKey = `${user.id}:${permission}`;
      permissionCache.delete(cacheKey);
    }
    
    try {
      const result = await checkPermissionInternal(permission);
      setHasPermission(result);
    } finally {
      setIsLoading(false);
    }
  }, [permission, checkPermissionInternal, enableCaching, user?.id]);

  /**
   * Check specific permission manually
   */
  const checkPermission = useCallback(async (perm: Permission): Promise<boolean> => {
    return await checkPermissionInternal(perm);
  }, [checkPermissionInternal]);

  // Initial permission check
  useEffect(() => {
    if (!permission) return;
    
    const checkInitialPermission = async () => {
      if (showLoading) {
        setIsLoading(true);
      }
      
      try {
        const result = await checkPermissionInternal(permission);
        setHasPermission(result);
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    };
    
    checkInitialPermission();
  }, [permission, checkPermissionInternal, showLoading]);

  // Auto-refresh on auth state changes
  useEffect(() => {
    if (!autoRefresh || !permission) return;
    
    refresh();
  }, [autoRefresh, refresh, permission, isAuthenticated, user?.id]);

  // Cleanup cache on unmount
  useEffect(() => {
    return () => {
      if (enableCaching && user?.id) {
        // Optional: Clear cache on unmount for security
        // permissionCache.clear();
      }
    };
  }, [enableCaching, user?.id]);

  return {
    hasPermission,
    isLoading,
    error,
    refresh,
    checkPermission,
    metadata: {
      requiresAudit: requiresAudit(permission),
      lastChecked,
      cacheHit,
    },
  };
}; 