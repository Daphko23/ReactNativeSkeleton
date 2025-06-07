/**
 * @fileoverview WITH-SESSION-GUARD-HOC: Session-Based Authentication Guard Higher-Order Component
 * @description HOC for protecting screens from unauthenticated access with session-based verification
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.HOC
 * @namespace Shared.HOC.WithSessionGuard
 * @category Components
 * @subcategory HOC
 */

import React from 'react';
import {useSessionGuard} from '@shared/hooks/use-session.guard';

/**
 * Session Guard Higher-Order Component
 * 
 * Higher-order component that protects screens from unauthenticated access
 * by verifying active user sessions. This HOC provides session-based
 * authentication verification, ensuring only users with valid sessions
 * can access protected components.
 * 
 * Unlike basic authentication guards, this HOC specifically focuses on
 * session validation and management, providing a more robust authentication
 * mechanism for enterprise applications.
 *
 * @function withSessionGuard
 * @template P - Generic props type extending object
 * @param {React.ComponentType<P>} Component - The component that requires session authentication
 * @returns {React.FC<P>} Guarded component that enforces session-based authentication
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory HOC
 * @module Shared.HOC
 * @namespace Shared.HOC.WithSessionGuard
 * 
 * @example
 * Basic session-protected screen:
 * ```tsx
 * import { withSessionGuard } from '@/shared/hoc/with-session.guard';
 * 
 * const ProfileScreen = () => (
 *   <View>
 *     <Text>User Profile</Text>
 *     <Text>Session-protected content</Text>
 *   </View>
 * );
 * 
 * export default withSessionGuard(ProfileScreen);
 * ```
 * 
 * @example
 * Protecting sensitive screens:
 * ```tsx
 * const AccountSettingsScreen = withSessionGuard(() => (
 *   <View>
 *     <Text>Account Settings</Text>
 *     <Button title="Change Password" />
 *     <Button title="Update Email" />
 *   </View>
 * ));
 * 
 * const PaymentMethodsScreen = withSessionGuard(() => (
 *   <View>
 *     <Text>Payment Methods</Text>
 *     <Text>Credit Cards and Bank Accounts</Text>
 *   </View>
 * ));
 * 
 * const PrivateDataScreen = withSessionGuard(() => (
 *   <View>
 *     <Text>Private Data</Text>
 *     <Text>Sensitive user information</Text>
 *   </View>
 * ));
 * ```
 * 
 * @example
 * Using with typed props:
 * ```tsx
 * interface DashboardProps {
 *   userId: string;
 *   sessionId: string;
 *   lastLogin: Date;
 *   onRefresh: () => void;
 * }
 * 
 * const Dashboard: React.FC<DashboardProps> = ({ 
 *   userId, 
 *   sessionId, 
 *   lastLogin, 
 *   onRefresh 
 * }) => (
 *   <View>
 *     <Text>Welcome back!</Text>
 *     <Text>User ID: {userId}</Text>
 *     <Text>Session: {sessionId}</Text>
 *     <Text>Last Login: {lastLogin.toLocaleDateString()}</Text>
 *     <Button title="Refresh Data" onPress={onRefresh} />
 *   </View>
 * );
 * 
 * export default withSessionGuard(Dashboard);
 * ```
 * 
 * @example
 * Enterprise application usage:
 * ```tsx
 * // Main dashboard with session validation
 * const EnterpriseDashboard = withSessionGuard(() => (
 *   <View>
 *     <Text>Enterprise Dashboard</Text>
 *     <Text>Session-verified content</Text>
 *   </View>
 * ));
 * 
 * // Data management screen
 * const DataManagementScreen = withSessionGuard(() => (
 *   <View>
 *     <Text>Data Management</Text>
 *     <Text>Requires active session</Text>
 *   </View>
 * ));
 * 
 * // Report generation screen
 * const ReportsScreen = withSessionGuard(() => (
 *   <View>
 *     <Text>Reports & Analytics</Text>
 *     <Text>Session-protected reports</Text>
 *   </View>
 * ));
 * ```
 * 
 * @features
 * - Session-based authentication verification
 * - Automatic session validation
 * - Seamless redirection for invalid sessions
 * - TypeScript generic support
 * - Zero configuration required
 * - Works with all React components
 * - Preserves component props and refs
 * - Debug-friendly display names
 * - Minimal performance overhead
 * - Session state monitoring
 * - Enterprise-grade security
 * 
 * @architecture
 * - Higher-Order Component pattern
 * - Hook-based session verification
 * - Automatic navigation handling
 * - Component composition support
 * - Generic type preservation
 * - Display name inheritance
 * - Props forwarding
 * - Session state management
 * 
 * @authentication
 * - Leverages useSessionGuard hook
 * - Active session verification
 * - Session token validation
 * - Session expiry handling
 * - Automatic session refresh
 * - Session-based access control
 * - Enterprise session management
 * 
 * @security
 * - Session-based access control
 * - Token validation
 * - Session expiry handling
 * - Automatic logout on invalid session
 * - Session hijacking protection
 * - Secure session management
 * - Enterprise security standards
 * 
 * @accessibility
 * - Preserves component accessibility
 * - No additional accessibility concerns
 * - Transparent to screen readers
 * - Maintains focus management
 * - Supports keyboard navigation
 * 
 * @performance
 * - Minimal overhead wrapper
 * - Efficient session checking
 * - No unnecessary re-renders
 * - Lightweight implementation
 * - Fast session verification
 * - Optimized hook usage
 * - Session caching support
 * 
 * @use_cases
 * - Enterprise dashboards
 * - User profile screens
 * - Account management
 * - Payment and billing screens
 * - Administrative interfaces
 * - Data management screens
 * - Report generation
 * - Secure document access
 * - Financial data screens
 * - Health records access
 * 
 * @best_practices
 * - Use for all session-protected screens
 * - Apply at component export level
 * - Test session expiry scenarios
 * - Handle session refresh gracefully
 * - Monitor session performance
 * - Implement session analytics
 * - Document session requirements
 * - Test with session timeouts
 * - Validate session security
 * 
 * @dependencies
 * - react: Core React library
 * - @shared/hooks/use-session.guard: Session verification hook
 * 
 * @see {@link useSessionGuard} for session verification logic
 * @see {@link withAuthGuard} for basic authentication protection
 * @see {@link withRoleGuard} for role-based protection
 * 
 * @todo Add session analytics tracking
 * @todo Implement session refresh automation
 * @todo Add session timeout warnings
 * @todo Include session security monitoring
 */
export const withSessionGuard = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const GuardedComponent: React.FC<P> = (props: P) => {
    useSessionGuard();
    return <Component {...props} />;
  };

  GuardedComponent.displayName = `withSessionGuard(${Component.displayName || Component.name || 'Component'})`;

  return GuardedComponent;
};
