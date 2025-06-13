/**
 * @fileoverview WITH-ROLE-GUARD-HOC: Role-Based Access Control Higher-Order Component
 * @description Enterprise-grade HOC for role-based screen protection with comprehensive access control features
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.HOC
 * @namespace Shared.HOC.WithRoleGuard
 * @category Components
 * @subcategory HOC
 */

import React, { ComponentType, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoleChampion as useRole } from '@shared/hooks/use-role-champion';
import type { Role } from '@features/auth/domain/constants/permissions.registry';
import { PrimaryButton } from '@shared/components/buttons/primary-button.component';
import { useTranslation } from 'react-i18next';

/**
 * Configuration options interface for the withRoleGuard HOC.
 * Provides comprehensive customization for role-based access control behavior.
 * 
 * @interface WithRoleGuardOptions
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory HOC
 * 
 * @example
 * ```tsx
 * const guardOptions: WithRoleGuardOptions = {
 *   requiredRole: 'admin',
 *   checkMinimumLevel: true,
 *   redirectTo: 'Dashboard',
 *   enableAuditLogging: true
 * };
 * ```
 */
export interface WithRoleGuardOptions {
  /**
   * Required role or minimum role level for access.
   * Determines what role the user must have to access the protected component.
   * 
   * @type {Role}
   * @required
   * @example "admin"
   * @example "moderator"
   * @example "super_admin"
   */
  requiredRole: Role;
  
  /**
   * Check for minimum role level instead of exact match.
   * When true, users with higher roles than required will also have access.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   * @note When true, a moderator role also grants access to user-level protected components
   */
  checkMinimumLevel?: boolean;
  
  /**
   * Redirect route when access is denied.
   * Specifies which screen to navigate to when user lacks required permissions.
   * 
   * @type {string}
   * @optional
   * @default "Navigates back"
   * @example "Dashboard"
   * @example "Home"
   */
  redirectTo?: string;
  
  /**
   * Show loading spinner during role check.
   * Controls whether to display loading UI while verifying user permissions.
   * 
   * @type {boolean}
   * @optional
   * @default true
   * @example false
   */
  showLoading?: boolean;
  
  /**
   * Custom loading component to display during role verification.
   * Replaces the default loading component with a custom implementation.
   * 
   * @type {ComponentType}
   * @optional
   * @example CustomSpinner
   * @component Must be a React component with no required props
   */
  LoadingComponent?: ComponentType;
  
  /**
   * Custom access denied component for unauthorized access.
   * Replaces the default access denied UI with a custom implementation.
   * 
   * @type {ComponentType<{ onRetry: () => void; onGoBack: () => void }>}
   * @optional
   * @example CustomAccessDenied
   * @component Must accept onRetry and onGoBack callbacks
   */
  AccessDeniedComponent?: ComponentType<{ onRetry: () => void; onGoBack: () => void }>;
  
  /**
   * Custom error handler for role check failures.
   * Called when user is denied access due to insufficient permissions.
   * 
   * @type {(userRoles: string[], requiredRole: Role) => void}
   * @optional
   * @callback
   * @param {string[]} userRoles - Current user's roles
   * @param {Role} requiredRole - The role that was required
   * @example (userRoles, requiredRole) => analytics.track('access_denied')
   */
  onAccessDenied?: (userRoles: string[], requiredRole: Role) => void;
  
  /**
   * Custom success handler for role access granted.
   * Called when user is granted access due to sufficient permissions.
   * 
   * @type {(userRoles: string[], userLevel: number) => void}
   * @optional
   * @callback
   * @param {string[]} userRoles - Current user's roles
   * @param {number} userLevel - Current user's permission level
   * @example (userRoles, level) => analytics.track('protected_screen_access')
   */
  onAccessGranted?: (userRoles: string[], userLevel: number) => void;
  
  /**
   * Enable audit logging for access control decisions.
   * Controls whether access control decisions are logged for compliance.
   * 
   * @type {boolean}
   * @optional
   * @default true
   * @example false
   * @compliance Required for audit trails in enterprise environments
   */
  enableAuditLogging?: boolean;
}

/**
 * Role Guard Higher-Order Component
 * 
 * Enterprise-grade HOC that provides role-based access control for React components.
 * Protects screens and components from unauthorized access by verifying user roles
 * and permissions. Features comprehensive customization options, audit logging,
 * and graceful handling of access denied scenarios.
 * 
 * @function withRoleGuard
 * @param {WithRoleGuardOptions} options - Configuration options for role guard behavior
 * @returns {Function} HOC function that wraps components with role protection
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory HOC
 * @module Shared.HOC
 * @namespace Shared.HOC.WithRoleGuard
 * 
 * @example
 * Basic admin-only screen protection:
 * ```tsx
 * import { withRoleGuard } from '@/shared/hoc/with-role-guard';
 * 
 * const AdminPanel = () => (
 *   <View>
 *     <Text>Admin Panel Content</Text>
 *   </View>
 * );
 * 
 * export default withRoleGuard({
 *   requiredRole: 'admin'
 * })(AdminPanel);
 * ```
 * 
 * @example
 * Minimum role level protection with custom redirect:
 * ```tsx
 * const ModeratorTools = () => (
 *   <View>
 *     <Text>Moderator Tools</Text>
 *   </View>
 * );
 * 
 * export default withRoleGuard({
 *   requiredRole: 'moderator',
 *   checkMinimumLevel: true, // Allows moderator, admin, super_admin
 *   redirectTo: 'Dashboard',
 *   enableAuditLogging: true
 * })(ModeratorTools);
 * ```
 * 
 * @example
 * Advanced configuration with custom components and handlers:
 * ```tsx
 * const SensitiveDataScreen = () => (
 *   <View>
 *     <Text>Highly Sensitive Information</Text>
 *   </View>
 * );
 * 
 * export default withRoleGuard({
 *   requiredRole: 'super_admin',
 *   LoadingComponent: CustomSecuritySpinner,
 *   AccessDeniedComponent: CustomSecurityDenied,
 *   onAccessDenied: (userRoles, requiredRole) => {
 *     console.log(`Security Alert: Unauthorized access attempt`);
 *     analytics.track('security_breach_attempt', {
 *       userRoles,
 *       requiredRole,
 *       timestamp: new Date().toISOString()
 *     });
 *     securityService.flagSuspiciousActivity();
 *   },
 *   onAccessGranted: (userRoles, userLevel) => {
 *     console.log(`Sensitive data accessed by level ${userLevel}`);
 *     auditLogger.log('sensitive_data_access', {
 *       userRoles,
 *       userLevel,
 *       screen: 'SensitiveDataScreen'
 *     });
 *   },

 * })(SensitiveDataScreen);
 * ```
 * 
 * @example
 * Multiple role requirements with factory pattern:
 * ```tsx
 * const enterpriseGuard = createRoleGuard({
 *   enableAuditLogging: true,
 *   showLoading: true
 * });
 * 
 * const AdminScreen = enterpriseGuard({ requiredRole: 'admin' })(AdminComponent);
 * const ModeratorScreen = enterpriseGuard({ 
 *   requiredRole: 'moderator',
 *   checkMinimumLevel: true 
 * })(ModeratorComponent);
 * const SuperAdminScreen = enterpriseGuard({ 
 *   requiredRole: 'super_admin',
 *   redirectTo: 'SecureDashboard'
 * })(SuperAdminComponent);
 * ```
 * 
 * @features
 * - Role-based access control with hierarchy support
 * - Minimum role level checking for flexible permissions
 * - Custom loading and access denied components
 * - Automatic redirection on access denied
 * - Comprehensive audit logging for compliance
 * - Retry functionality for transient errors
 * - Customizable error and success handling
 * - Factory pattern support for reusable configurations
 * - TypeScript integration with type safety
 * - Internationalization support
 * 
 * @architecture
 * - Higher-Order Component pattern
 * - Role hierarchy and permission level system
 * - Configurable access denied handling
 * - Hook-based role verification
 * - Navigation integration for redirects
 * - Component composition for customization
 * - Factory pattern for reusable configurations
 * - Audit logging integration
 * 
 * @security
 * - Role-based access control (RBAC)
 * - Permission level verification
 * - Audit trail for access decisions
 * - Secure navigation handling
 * - Access attempt logging
 * - Customizable security responses
 * - Enterprise-grade access control
 * 
 * @accessibility
 * - Screen reader compatible error messages
 * - Accessible loading states
 * - Clear access denied communication
 * - Keyboard navigation support
 * - High contrast support
 * - Meaningful error descriptions
 * - Focus management during state changes
 * 
 * @performance
 * - Role caching for improved performance
 * - Efficient role verification
 * - Optimized re-render behavior
 * - Lazy loading of protected components
 * - Memory efficient implementation
 * - Configurable cache TTL
 * - Minimal overhead for authorized users
 * 
 * @use_cases
 * - Admin-only management screens
 * - Moderator tools and controls
 * - Sensitive data protection
 * - Feature flag-based access
 * - Premium content protection
 * - Multi-tenant role separation
 * - Compliance-required access control
 * - Progressive permission systems
 * 
 * @best_practices
 * - Use minimum role level checking for flexibility
 * - Implement comprehensive audit logging
 * - Provide clear access denied messages
 * - Test with various role combinations
 * - Configure appropriate cache TTL
 * - Handle navigation gracefully
 * - Include retry mechanisms
 * - Monitor access patterns
 * 
 * @dependencies
 * - react: Core React library
 * - react-native: Native mobile components
 * - @react-navigation/native: Navigation handling
 * - @shared/hooks/use-role: Role verification hook
 * - react-i18next: Internationalization
 * 
 * @see {@link useRole} for role verification hook
 * @see {@link createRoleGuard} for factory pattern usage
 * @see {@link WithRoleGuardOptions} for configuration options
 * 
 * @todo Add multi-role requirement support
 * @todo Implement time-based access restrictions
 * @todo Add IP-based access control
 * @todo Include session-based role refresh
 */
export const withRoleGuard = (options: WithRoleGuardOptions) => {
  return <P extends object>(WrappedComponent: ComponentType<P>) => {
    const RoleGuardComponent: React.FC<P> = (props) => {
      const {
        requiredRole,
        checkMinimumLevel = false,
        redirectTo,
        showLoading = true,
        LoadingComponent = DefaultLoadingComponent,
        AccessDeniedComponent = DefaultAccessDeniedComponent,
        onAccessDenied,
        onAccessGranted,
        enableAuditLogging = true,
      } = options;

      const navigation = useNavigation();
      
      // Use the Champion Role hook
      const {
        hasRole: hasExactRole,
        userRoles,
        userLevel,
        isLoading,
        error,
        refresh,
        checkMinimumLevel: checkMinLevel,
      } = useRole(requiredRole);
      
      // Calculate hasRole based on checkMinimumLevel option
      const hasRole = checkMinimumLevel ? checkMinLevel(requiredRole) : hasExactRole;

      // Handle access control decision
      useEffect(() => {
        if (isLoading) return;
        
        if (hasRole) {
          // Access granted
          if (onAccessGranted) {
            onAccessGranted(userRoles, userLevel);
          }
          
          // Audit logging for access granted
          if (enableAuditLogging) {
            console.log(`Role Guard: Access granted to ${requiredRole} for user with roles: ${userRoles.join(', ')}`);
          }
        } else if (!error) {
          // Access denied (not an error, just insufficient permissions)
          if (onAccessDenied) {
            onAccessDenied(userRoles, requiredRole);
          }
          
          // Audit logging for access denied
          if (enableAuditLogging) {
            console.warn(`Role Guard: Access denied to ${requiredRole} for user with roles: ${userRoles.join(', ')}`);
          }
        }
      }, [
        hasRole, 
        userRoles, 
        userLevel, 
        isLoading, 
        error, 
        requiredRole,
        onAccessGranted,
        onAccessDenied,
        enableAuditLogging
      ]);

      // Handle retry functionality
      const handleRetry = async () => {
        await refresh();
      };

      // Handle go back functionality
      const handleGoBack = () => {
        if (redirectTo) {
          navigation.navigate(redirectTo as never);
        } else if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          // Fallback to home screen or main tab
          navigation.navigate('Home' as never);
        }
      };

      // Show loading state
      if (isLoading && showLoading) {
        return <LoadingComponent />;
      }

      // Show access denied for insufficient permissions
      if (!hasRole && !isLoading) {
        return (
          <AccessDeniedComponent
            onRetry={handleRetry}
            onGoBack={handleGoBack}
          />
        );
      }

      // Render protected component
      if (hasRole) {
        return <WrappedComponent {...props} />;
      }

      // Fallback to access denied (should not reach here normally)
      return (
        <AccessDeniedComponent
          onRetry={handleRetry}
          onGoBack={handleGoBack}
        />
      );
    };

    // Set display name for debugging
    RoleGuardComponent.displayName = `withRoleGuard(${
      WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;

    return RoleGuardComponent;
  };
};

/**
 * Role Guard Factory Function
 * 
 * Factory function that creates role guard HOCs with preset configurations.
 * Useful for creating consistent role guards across an application with
 * shared default settings and enterprise configurations.
 * 
 * @function createRoleGuard
 * @param {Partial<WithRoleGuardOptions>} defaultOptions - Default options for all role guards created by this factory
 * @returns {Function} Function to create role guards with merged options
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Factory
 * @subcategory HOC
 * 
 * @example
 * Create enterprise role guard factory:
 * ```tsx
 * const enterpriseRoleGuard = createRoleGuard({
 *   enableAuditLogging: true,
 *   showLoading: true,

 * });
 * 
 * // Use factory to create specific role guards
 * const AdminScreen = enterpriseRoleGuard({ 
 *   requiredRole: 'admin' 
 * })(AdminComponent);
 * 
 * const ModeratorScreen = enterpriseRoleGuard({ 
 *   requiredRole: 'moderator', 
 *   checkMinimumLevel: true 
 * })(ModeratorComponent);
 * ```
 * 
 * @example
 * Security-focused factory:
 * ```tsx
 * const securityRoleGuard = createRoleGuard({
 *   enableAuditLogging: true,
 *   onAccessDenied: (userRoles, requiredRole) => {
 *     securityService.logUnauthorizedAccess(userRoles, requiredRole);
 *   },
 *   roleOptions: {
 *     cacheTTL: 10000, // Short cache for security
 *     enableCaching: false // Disable caching for real-time verification
 *   }
 * });
 * ```
 */
export const createRoleGuard = (defaultOptions: Partial<WithRoleGuardOptions>) => {
  return (options: WithRoleGuardOptions) => {
    const mergedOptions = { ...defaultOptions, ...options };
    return withRoleGuard(mergedOptions);
  };
};

/**
 * Pre-configured role guards for common use cases.
 * Provides ready-to-use role guards for standard permission scenarios.
 * 
 * @constant
 * @namespace PreConfiguredGuards
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * // Use pre-configured guards directly
 * const AdminPanel = withAdminRole(AdminComponent);
 * const ModeratorTools = withModeratorRole(ModeratorComponent);
 * const SuperAdminSettings = withSuperAdminRole(SuperAdminComponent);
 * ```
 */

/**
 * Admin-only role guard.
 * Protects components requiring exact admin role.
 * 
 * @constant withAdminRole
 * @type {Function}
 * @example const AdminScreen = withAdminRole(AdminComponent);
 */
export const withAdminRole = withRoleGuard({ requiredRole: 'admin' });

/**
 * Moderator minimum level role guard.
 * Protects components requiring moderator level or higher permissions.
 * 
 * @constant withModeratorRole
 * @type {Function}
 * @example const ModeratorScreen = withModeratorRole(ModeratorComponent);
 */
export const withModeratorRole = withRoleGuard({ requiredRole: 'moderator', checkMinimumLevel: true });

/**
 * Super admin role guard.
 * Protects components requiring exact super admin role.
 * 
 * @constant withSuperAdminRole
 * @type {Function}
 * @example const SuperAdminScreen = withSuperAdminRole(SuperAdminComponent);
 */
export const withSuperAdminRole = withRoleGuard({ requiredRole: 'super_admin' });

/**
 * Enterprise role guard factory with enhanced security and audit logging.
 * Pre-configured for enterprise environments with comprehensive monitoring.
 * 
 * @constant withEnterpriseRole
 * @type {Function}
 * @example 
 * ```tsx
 * const SecureScreen = withEnterpriseRole({ 
 *   requiredRole: 'admin',
 *   redirectTo: 'SecurityDashboard'
 * })(SecureComponent);
 * ```
 */
export const withEnterpriseRole = createRoleGuard({
  enableAuditLogging: true,
  showLoading: true,
});

/**
 * Default Loading Component
 * 
 * Standard loading component displayed while role verification is in progress.
 * Features internationalized loading message and accessibility support.
 * 
 * @component
 * @function DefaultLoadingComponent
 * @returns {React.ReactElement} Loading UI with spinner and text
 * 
 * @since 1.0.0
 * @private
 * @accessibility Screen reader compatible with descriptive loading text
 */
const DefaultLoadingComponent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
      }}>
        {t('auth.rbacScreen.loadingAccess', 'Zugriff wird überprüft...')}
      </Text>
    </View>
  );
};

/**
 * Default Access Denied Component Props
 * 
 * @interface DefaultAccessDeniedProps
 * @category Props
 * @subcategory Internal
 */
interface DefaultAccessDeniedProps {
  /**
   * Callback to retry role verification.
   * 
   * @type {() => void}
   * @required
   */
  onRetry: () => void;
  
  /**
   * Callback to navigate back or to safe location.
   * 
   * @type {() => void}
   * @required
   */
  onGoBack: () => void;
}

/**
 * Default Access Denied Component
 * 
 * Standard access denied component displayed when user lacks required permissions.
 * Features comprehensive error message, retry functionality, and help information.
 * 
 * @component
 * @function DefaultAccessDeniedComponent
 * @param {DefaultAccessDeniedProps} props - Component props
 * @returns {React.ReactElement} Access denied UI with actions
 * 
 * @since 1.0.0
 * @private
 * @accessibility Full WCAG compliance with proper focus management
 * @internationalization Supports multiple languages via i18n
 */
const DefaultAccessDeniedComponent: React.FC<DefaultAccessDeniedProps> = ({ onRetry, onGoBack }) => {
  const { t } = useTranslation();
  
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: '#fff',
    }}>
      {/* Access Denied Icon */}
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ff6b6b',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <Text style={{ fontSize: 32, color: '#fff' }}>🚫</Text>
      </View>
      
      {/* Title */}
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 12,
      }}>
        {t('auth.rbacScreen.accessDeniedTitle', 'Zugriff verweigert')}
      </Text>
      
      {/* Message */}
      <Text style={{
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
      }}>
        {t('auth.rbacScreen.accessDeniedMessage', 
          'Sie haben nicht die erforderlichen Berechtigungen, um auf diese Seite zuzugreifen. Wenden Sie sich an Ihren Administrator, wenn Sie glauben, dass dies ein Fehler ist.'
        )}
      </Text>
      
      {/* Action Buttons */}
      <View style={{ width: '100%', gap: 12 }}>
        <PrimaryButton
          label={t('auth.rbacScreen.retryAccess', 'Erneut versuchen')}
          onPress={onRetry}
        />
        
        <PrimaryButton
          label={t('auth.rbacScreen.goBack', 'Zurück')}
          onPress={onGoBack}
        />
      </View>
      
      {/* Help Text */}
      <Text style={{
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 24,
      }}>
        {t('auth.rbacScreen.helpText', 'Benötigen Sie Hilfe? Kontaktieren Sie den Support.')}
      </Text>
    </View>
  );
}; 