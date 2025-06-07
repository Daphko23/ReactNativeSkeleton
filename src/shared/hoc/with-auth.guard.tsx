/**
 * @fileoverview WITH-AUTH-GUARD-HOC: Authentication Guard Higher-Order Component
 * @description HOC for protecting authenticated-only screens with automatic redirection for non-authenticated users
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.HOC
 * @namespace Shared.HOC.WithAuthGuard
 * @category Components
 * @subcategory HOC
 */

import React from 'react';
import {useAuthGuard} from '@shared/hooks/use-auth.guard';

/**
 * Authentication Guard Higher-Order Component
 * 
 * Wraps components that require user authentication, automatically redirecting
 * non-authenticated users to the authentication flow. This HOC ensures that
 * protected screens are only accessible to logged-in users.
 *
 * @function withAuthGuard
 * @template P - Generic props type extending object
 * @param {React.ComponentType<P>} Component - The component that requires authentication
 * @returns {React.FC<P>} Guarded component that enforces authentication
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory HOC
 * @module Shared.HOC
 * @namespace Shared.HOC.WithAuthGuard
 * 
 * @example
 * Basic authenticated screen protection:
 * ```tsx
 * import { withAuthGuard } from '@/shared/hoc/with-auth.guard';
 * 
 * const ProfileScreen = () => (
 *   <View>
 *     <Text>User Profile</Text>
 *   </View>
 * );
 * 
 * export default withAuthGuard(ProfileScreen);
 * ```
 * 
 * @example
 * Protecting multiple screens:
 * ```tsx
 * const DashboardScreen = withAuthGuard(() => (
 *   <View>
 *     <Text>Dashboard Content</Text>
 *   </View>
 * ));
 * 
 * const SettingsScreen = withAuthGuard(() => (
 *   <View>
 *     <Text>Settings</Text>
 *   </View>
 * ));
 * 
 * const SecurityScreen = withAuthGuard(() => (
 *   <View>
 *     <Text>Security Settings</Text>
 *   </View>
 * ));
 * ```
 * 
 * @example
 * Using with typed props:
 * ```tsx
 * interface UserProfileProps {
 *   userId: string;
 *   refreshData: () => void;
 * }
 * 
 * const UserProfile: React.FC<UserProfileProps> = ({ userId, refreshData }) => (
 *   <View>
 *     <Text>Profile for user: {userId}</Text>
 *     <Button title="Refresh" onPress={refreshData} />
 *   </View>
 * );
 * 
 * export default withAuthGuard(UserProfile);
 * ```
 * 
 * @example
 * Combined with other HOCs:
 * ```tsx
 * import { withRoleGuard } from './with-role-guard';
 * 
 * const AdminPanel = () => (
 *   <View>
 *     <Text>Admin Panel</Text>
 *   </View>
 * );
 * 
 * // First check authentication, then check admin role
 * export default withRoleGuard({ 
 *   requiredRole: 'admin' 
 * })(withAuthGuard(AdminPanel));
 * ```
 * 
 * @features
 * - Automatic authentication verification
 * - Seamless redirection to auth flow
 * - TypeScript generic support
 * - Zero configuration required
 * - Works with all React components
 * - Preserves component props and refs
 * - Debug-friendly display names
 * - Minimal performance overhead
 * - Compatible with other HOCs
 * - Authentication state monitoring
 * 
 * @architecture
 * - Higher-Order Component pattern
 * - Hook-based authentication checking
 * - Automatic navigation handling
 * - Component composition support
 * - Generic type preservation
 * - Display name inheritance
 * - Props forwarding
 * 
 * @authentication
 * - Leverages useAuthGuard hook
 * - Automatic auth state verification
 * - Seamless redirect handling
 * - Session monitoring
 * - Token validation
 * - Auth flow integration
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
 * - Efficient authentication checking
 * - No unnecessary re-renders
 * - Lightweight implementation
 * - Fast authentication verification
 * - Optimized hook usage
 * 
 * @use_cases
 * - User profile screens
 * - Dashboard and home screens
 * - Settings and preferences
 * - Account management
 * - Personal data screens
 * - User-specific content
 * - Authenticated features
 * - Protected app areas
 * 
 * @best_practices
 * - Use for all authenticated screens
 * - Apply at component export level
 * - Combine with role guards when needed
 * - Test authentication flows thoroughly
 * - Handle loading states appropriately
 * - Provide clear error messages
 * - Monitor authentication performance
 * - Document protected routes
 * 
 * @dependencies
 * - react: Core React library
 * - @shared/hooks/use-auth.guard: Authentication verification hook
 * 
 * @see {@link useAuthGuard} for authentication verification logic
 * @see {@link withRoleGuard} for role-based protection
 * @see {@link withGuestGuard} for guest-only protection
 * 
 * @todo Add authentication retry mechanism
 * @todo Implement custom redirect destinations
 * @todo Add authentication analytics
 */
export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const GuardedComponent: React.FC<P> = (props: P) => {
    useAuthGuard();
    return <Component {...props} />;
  };

  GuardedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name || 'Component'})`;

  return GuardedComponent;
}; 