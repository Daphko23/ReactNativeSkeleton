/**
 * @fileoverview SHARED-HOC-003: withRoleGuard Higher-Order Component
 * @description HOC für Role-basierte Screen Protection mit Enterprise Features.
 * Schützt Screens vor unbefugtem Zugriff basierend auf Benutzerrollen.
 * 
 * @businessRule BR-630: Role-based access control for screen protection
 * @businessRule BR-631: Automatic redirection for unauthorized access
 * @businessRule BR-632: Loading states during role verification
 * @businessRule BR-633: Audit logging for access control decisions
 * 
 * @architecture Higher-Order Component pattern
 * @architecture Role hierarchy and minimum level checking
 * @architecture Configurable access denied handling
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module withRoleGuard
 * @namespace Shared.HOC
 */

import React, { ComponentType, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRole, UseRoleOptions } from '@shared/hooks/use-role';
import type { Role } from '@features/auth/domain/constants/permissions.registry';
import { PrimaryButton } from '@shared/components/buttons/primary-button.component';
import { useTranslation } from 'react-i18next';

/**
 * @interface WithRoleGuardOptions
 * @description Configuration options for the withRoleGuard HOC
 */
export interface WithRoleGuardOptions {
  /** Required role or minimum role level */
  requiredRole: Role;
  
  /** Check for minimum role level instead of exact match (default: false) */
  checkMinimumLevel?: boolean;
  
  /** Redirect route when access is denied (default: navigates back) */
  redirectTo?: string;
  
  /** Show loading spinner during role check (default: true) */
  showLoading?: boolean;
  
  /** Custom loading component */
  LoadingComponent?: ComponentType;
  
  /** Custom access denied component */
  AccessDeniedComponent?: ComponentType<{ onRetry: () => void; onGoBack: () => void }>;
  
  /** Custom error handler for role check failures */
  onAccessDenied?: (userRoles: string[], requiredRole: Role) => void;
  
  /** Custom success handler for role access granted */
  onAccessGranted?: (userRoles: string[], userLevel: number) => void;
  
  /** Enable audit logging for access control decisions (default: true) */
  enableAuditLogging?: boolean;
  
  /** Additional role hook options */
  roleOptions?: UseRoleOptions;
}

/**
 * @function withRoleGuard
 * @description Enterprise Role Guard HOC for Screen Protection
 * 
 * Features:
 * - Role-based access control with hierarchy
 * - Minimum role level checking
 * - Custom loading and access denied components
 * - Automatic redirection on access denied
 * - Audit logging for compliance
 * - Retry functionality for transient errors
 * - Customizable error handling
 * 
 * @param options - Configuration options for role guard
 * @returns HOC function that wraps components with role protection
 * 
 * @example Basic role protection
 * ```typescript
 * const AdminScreen = () => <div>Admin Panel</div>;
 * 
 * export default withRoleGuard({
 *   requiredRole: 'admin'
 * })(AdminScreen);
 * ```
 * 
 * @example Minimum role level protection
 * ```typescript
 * const ModeratorScreen = () => <div>Moderator Tools</div>;
 * 
 * export default withRoleGuard({
 *   requiredRole: 'moderator',
 *   checkMinimumLevel: true, // Allows moderator, admin, super_admin
 *   redirectTo: 'Home'
 * })(ModeratorScreen);
 * ```
 * 
 * @example Custom components and handlers
 * ```typescript
 * const SensitiveScreen = () => <div>Sensitive Data</div>;
 * 
 * export default withRoleGuard({
 *   requiredRole: 'super_admin',
 *   LoadingComponent: CustomSpinner,
 *   AccessDeniedComponent: CustomAccessDenied,
 *   onAccessDenied: (userRoles, requiredRole) => {
 *     console.log(`Access denied: user has ${userRoles}, needs ${requiredRole}`);
 *     analytics.track('unauthorized_access_attempt');
 *   },
 *   onAccessGranted: (userRoles, userLevel) => {
 *     console.log(`Access granted: user level ${userLevel}`);
 *     analytics.track('sensitive_screen_access');
 *   }
 * })(SensitiveScreen);
 * ```
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
        roleOptions = {},
      } = options;

      const navigation = useNavigation();
      
      // Use the useRole hook with configuration
      const {
        hasRole,
        userRoles,
        userLevel,
        isLoading,
        error,
        refresh,
      } = useRole(requiredRole, {
        checkMinimumLevel,
        showLoading,
        enableCaching: true,
        cacheTTL: 30000, // 30 seconds for role-based access
        ...roleOptions,
      });

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
 * @function createRoleGuard
 * @description Factory function to create role guards with preset configurations
 * 
 * @param defaultOptions - Default options for all role guards created by this factory
 * @returns Function to create role guards with merged options
 * 
 * @example Create enterprise role guard factory
 * ```typescript
 * const enterpriseRoleGuard = createRoleGuard({
 *   enableAuditLogging: true,
 *   showLoading: true,
 *   roleOptions: { cacheTTL: 60000 }
 * });
 * 
 * const AdminScreen = enterpriseRoleGuard({ requiredRole: 'admin' })(AdminComponent);
 * const ModeratorScreen = enterpriseRoleGuard({ 
 *   requiredRole: 'moderator', 
 *   checkMinimumLevel: true 
 * })(ModeratorComponent);
 * ```
 */
export const createRoleGuard = (defaultOptions: Partial<WithRoleGuardOptions>) => {
  return (options: WithRoleGuardOptions) => {
    const mergedOptions = { ...defaultOptions, ...options };
    return withRoleGuard(mergedOptions);
  };
};

/**
 * Pre-configured role guards for common use cases
 */
export const withAdminRole = withRoleGuard({ requiredRole: 'admin' });
export const withModeratorRole = withRoleGuard({ requiredRole: 'moderator', checkMinimumLevel: true });
export const withSuperAdminRole = withRoleGuard({ requiredRole: 'super_admin' });

/**
 * Enterprise role guard with enhanced security and audit logging
 */
export const withEnterpriseRole = createRoleGuard({
  enableAuditLogging: true,
  showLoading: true,
  roleOptions: {
    cacheTTL: 30000, // 30 seconds
    enableCaching: true,
  },
});

/**
 * Default Loading Component
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
 * Default Access Denied Component
 */
const DefaultAccessDeniedComponent: React.FC<{
  onRetry: () => void;
  onGoBack: () => void;
}> = ({ onRetry, onGoBack }) => {
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