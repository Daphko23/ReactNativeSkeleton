/**
 * @fileoverview SHARED-HOOK-004: useRole Hook
 * @description Hook für Role-basierte UI-Kontrolle mit Enterprise Features.
 * Bietet Echtzeit-Role-Checking mit Caching und Hierarchie-Support.
 * 
 * @businessRule BR-620: Real-time role checking for UI components
 * @businessRule BR-621: Role hierarchy evaluation and inheritance
 * @businessRule BR-622: Role caching for performance optimization
 * @businessRule BR-623: Automatic role refresh on auth state changes
 * 
 * @architecture React Hook with enterprise auth integration
 * @architecture Role hierarchy with level-based comparisons
 * @architecture Role caching with TTL management
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module useRole
 * @namespace Shared.Hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@features/auth/presentation/hooks/use-auth';
import type { Role } from '@features/auth/domain/constants/permissions.registry';
import { 
  getRoleDefinition, 
  hasRoleLevel
} from '@features/auth/domain/constants/permissions.registry';

/**
 * @interface UseRoleOptions
 * @description Configuration options for the useRole hook
 */
export interface UseRoleOptions {
  /** Enable caching for role results (default: true) */
  enableCaching?: boolean;
  
  /** Cache TTL in milliseconds (default: 60000 = 1 minute) */
  cacheTTL?: number;
  
  /** Auto-refresh on auth state changes (default: true) */
  autoRefresh?: boolean;
  
  /** Show loading state during role checks (default: true) */
  showLoading?: boolean;
  
  /** Custom error handler for role check failures */
  onError?: (error: Error) => void;
  
  /** Custom success handler for role grants */
  onSuccess?: (hasRole: boolean) => void;
  
  /** Check for minimum role level instead of exact match (default: false) */
  checkMinimumLevel?: boolean;
}

/**
 * @interface UseRoleResult
 * @description Return value of the useRole hook
 */
export interface UseRoleResult {
  /** Whether user has the role or meets minimum level */
  hasRole: boolean;
  
  /** User's current roles */
  userRoles: string[];
  
  /** User's highest role level */
  userLevel: number;
  
  /** Loading state during role check */
  isLoading: boolean;
  
  /** Error state if role check fails */
  error: string | null;
  
  /** Manual refresh function */
  refresh: () => Promise<void>;
  
  /** Check specific role manually */
  checkRole: (role: Role) => boolean;
  
  /** Check minimum role level manually */
  checkMinimumLevel: (requiredRole: Role) => boolean;
  
  /** Role metadata */
  metadata: {
    roleDefinition: any;
    lastChecked: Date | null;
    cacheHit: boolean;
  };
}

// Role cache with TTL
const roleCache = new Map<string, { 
  userRoles: string[]; 
  timestamp: number; 
  ttl: number;
}>();

/**
 * @hook useRole
 * @description Enterprise Role Hook mit Hierarchy und Real-time Updates
 * 
 * Features:
 * - Real-time role checking
 * - Role hierarchy with level-based comparisons
 * - Intelligent caching with TTL
 * - Auto-refresh on auth state changes
 * - Minimum role level checking
 * - Performance optimization
 * 
 * @param role - Role to check or minimum role level
 * @param options - Hook configuration options
 * 
 * @returns UseRoleResult with role state and controls
 * 
 * @example Basic role check
 * ```typescript
 * const AdminPanel = () => {
 *   const { hasRole, isLoading } = useRole('admin');
 *   
 *   if (isLoading) return <Loading />;
 *   if (!hasRole) return <AccessDenied />;
 *   
 *   return <AdminDashboard />;
 * };
 * ```
 * 
 * @example Minimum role level check
 * ```typescript
 * const ModeratorFeatures = () => {
 *   const { hasRole } = useRole('moderator', { 
 *     checkMinimumLevel: true 
 *   });
 *   
 *   // hasRole is true for moderator, admin, or super_admin
 *   return hasRole ? <ModeratorTools /> : <UserTools />;
 * };
 * ```
 * 
 * @example Role hierarchy checking
 * ```typescript
 * const UserManagement = () => {
 *   const { hasRole: isAdmin, userLevel } = useRole('admin');
 *   const { checkMinimumLevel } = useRole('user');
 *   
 *   const canViewUsers = checkMinimumLevel('moderator');
 *   const canDeleteUsers = isAdmin;
 *   
 *   return (
 *     <div>
 *       {canViewUsers && <UserList />}
 *       {canDeleteUsers && <DeleteUserButton />}
 *       <div>User Level: {userLevel}</div>
 *     </div>
 *   );
 * };
 * ```
 */
export const useRole = (
  role: Role,
  options: UseRoleOptions = {}
): UseRoleResult => {
  const {
    enableCaching = true,
    cacheTTL = 60000, // 1 minute
    autoRefresh = true,
    showLoading = true,
    onError,
    onSuccess,
    checkMinimumLevel = false,
  } = options;

  const { user, isAuthenticated, enterprise } = useAuth();
  
  // State management
  const [hasRole, setHasRole] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userLevel, setUserLevel] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(showLoading);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [cacheHit, setCacheHit] = useState<boolean>(false);

  /**
   * Get roles from cache if valid
   */
  const getCachedRoles = useCallback((): string[] | null => {
    if (!enableCaching || !user?.id) return null;
    
    const cacheKey = `roles:${user.id}`;
    const cached = roleCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      setCacheHit(true);
      return cached.userRoles;
    }
    
    setCacheHit(false);
    return null;
  }, [enableCaching, user?.id]);

  /**
   * Set roles in cache
   */
  const setCachedRoles = useCallback((roles: string[]) => {
    if (!enableCaching || !user?.id) return;
    
    const cacheKey = `roles:${user.id}`;
    roleCache.set(cacheKey, {
      userRoles: roles,
      timestamp: Date.now(),
      ttl: cacheTTL,
    });
  }, [enableCaching, user?.id, cacheTTL]);

  /**
   * Get user's highest role level
   */
  const calculateUserLevel = useCallback((roles: string[]): number => {
    let maxLevel = 0;
    
    roles.forEach(roleName => {
      const roleDefinition = getRoleDefinition(roleName);
      if (roleDefinition && roleDefinition.level > maxLevel) {
        maxLevel = roleDefinition.level;
      }
    });
    
    return maxLevel;
  }, []);

  /**
   * Check specific role manually
   */
  const checkRole = useCallback((targetRole: Role): boolean => {
    return userRoles.includes(targetRole);
  }, [userRoles]);

  /**
   * Check minimum role level manually
   */
  const checkMinimumRoleLevel = useCallback((requiredRole: Role): boolean => {
    return hasRoleLevel(userRoles[0] as Role, requiredRole);
  }, [userRoles]);

  /**
   * Fetch user roles from enterprise service
   */
  const fetchUserRoles = useCallback(async (): Promise<string[]> => {
    if (!isAuthenticated || !user) {
      return [];
    }

    try {
      setError(null);
      
      // Check cache first
      const cached = getCachedRoles();
      if (cached !== null) {
        return cached;
      }

      // Fetch from enterprise service
      const roles = await enterprise.rbac.getUserRoles();
      
      // Cache the result
      setCachedRoles(roles);
      
      // Update metadata
      setLastChecked(new Date());
      
      return roles;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Role fetch failed';
      setError(errorMessage);
      
      // Handle error callback
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
      
      console.error('Role fetch failed:', err);
      return [];
    }
  }, [
    isAuthenticated, 
    user, 
    getCachedRoles, 
    setCachedRoles, 
    enterprise.rbac,
    onError
  ]);

  /**
   * Evaluate role access
   */
  const evaluateRoleAccess = useCallback((roles: string[], targetRole: Role): boolean => {
    if (checkMinimumLevel) {
      // Check if user has minimum required role level
      const userHighestRole = roles.reduce((highest, roleName) => {
        const roleDefinition = getRoleDefinition(roleName);
        const highestDefinition = getRoleDefinition(highest);
        
        if (!highestDefinition || (roleDefinition && roleDefinition.level > highestDefinition.level)) {
          return roleName;
        }
        return highest;
      }, 'user');
      
      return hasRoleLevel(userHighestRole as Role, targetRole);
    } else {
      // Check for exact role match
      return roles.includes(targetRole);
    }
  }, [checkMinimumLevel]);

  /**
   * Refresh roles manually
   */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    
    // Clear cache for user roles
    if (enableCaching && user?.id) {
      const cacheKey = `roles:${user.id}`;
      roleCache.delete(cacheKey);
    }
    
    try {
      const roles = await fetchUserRoles();
      setUserRoles(roles);
      setUserLevel(calculateUserLevel(roles));
      
      const roleAccess = evaluateRoleAccess(roles, role);
      setHasRole(roleAccess);
      
      // Handle success callback
      if (onSuccess) {
        onSuccess(roleAccess);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    fetchUserRoles, 
    calculateUserLevel, 
    evaluateRoleAccess, 
    role, 
    enableCaching, 
    user?.id,
    onSuccess
  ]);

  // Initial role check
  useEffect(() => {
    if (!role || !isAuthenticated) return;
    
    const checkInitialRole = async () => {
      if (showLoading) {
        setIsLoading(true);
      }
      
      try {
        const roles = await fetchUserRoles();
        setUserRoles(roles);
        setUserLevel(calculateUserLevel(roles));
        
        const roleAccess = evaluateRoleAccess(roles, role);
        setHasRole(roleAccess);
        
        // Handle success callback
        if (onSuccess) {
          onSuccess(roleAccess);
        }
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    };
    
    checkInitialRole();
  }, [
    role, 
    isAuthenticated, 
    fetchUserRoles, 
    calculateUserLevel, 
    evaluateRoleAccess, 
    showLoading,
    onSuccess
  ]);

  // Auto-refresh on auth state changes
  useEffect(() => {
    if (!autoRefresh || !role) return;
    
    refresh();
  }, [autoRefresh, refresh, role, isAuthenticated, user?.id]);

  // Cleanup cache on unmount
  useEffect(() => {
    return () => {
      if (enableCaching && user?.id) {
        // Optional: Clear cache on unmount for security
        // roleCache.clear();
      }
    };
  }, [enableCaching, user?.id]);

  return {
    hasRole,
    userRoles,
    userLevel,
    isLoading,
    error,
    refresh,
    checkRole,
    checkMinimumLevel: checkMinimumRoleLevel,
    metadata: {
      roleDefinition: getRoleDefinition(role),
      lastChecked,
      cacheHit,
    },
  };
};

export const _isValidRole = (role: string): boolean => {
  // TODO: Import UserRole enum or implement role validation
  return typeof role === 'string' && role.length > 0;
};

export const _ROLE_HIERARCHY = {
} 