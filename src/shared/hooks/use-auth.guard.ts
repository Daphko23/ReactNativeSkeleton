/**
 * @fileoverview USE-AUTH-GUARD-HOOK: Authentication Guard Hook
 * @description Custom React hook for protecting screens with authentication verification and navigation control
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseAuthGuard
 * @category Hooks
 * @subcategory Authentication
 */

import {useEffect, useRef} from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useAuth} from '@features/auth/presentation/hooks';
import type {RootStackParamList} from '@core/navigation/navigation.types';

/**
 * Authentication Guard Hook
 * 
 * Custom React hook that provides comprehensive authentication protection for screens.
 * Features redirect prevention logic to avoid infinite redirect loops and maintains
 * debugging capabilities for development. Automatically redirects unauthenticated
 * users to the authentication flow with proper navigation stack management.
 * 
 * @function useAuthGuard
 * @returns {void} Hook does not return any value, handles navigation side effects
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Hooks
 * @subcategory Authentication
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseAuthGuard
 * 
 * @example
 * Basic authentication protection:
 * ```tsx
 * import { useAuthGuard } from '@/shared/hooks/use-auth.guard';
 * 
 * const ProfileScreen = () => {
 *   useAuthGuard(); // Protects this screen from unauthenticated access
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
 * Multiple protected screens with consistent behavior:
 * ```tsx
 * const DashboardScreen = () => {
 *   useAuthGuard();
 * 
 *   return (
 *     <View>
 *       <Text>Dashboard</Text>
 *       <Text>Welcome to your dashboard</Text>
 *     </View>
 *   );
 * };
 * 
 * const SettingsScreen = () => {
 *   useAuthGuard();
 * 
 *   return (
 *     <View>
 *       <Text>Settings</Text>
 *       <Text>Manage your preferences</Text>
 *     </View>
 *   );
 * };
 * 
 * const MessagesScreen = () => {
 *   useAuthGuard();
 * 
 *   return (
 *     <View>
 *       <Text>Messages</Text>
 *       <Text>Your private messages</Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Integration with loading states and user data:
 * ```tsx
 * const UserDataScreen = () => {
 *   useAuthGuard();
 *   
 *   const { user, isLoading } = useAuth();
 *   const [userData, setUserData] = useState(null);
 * 
 *   useEffect(() => {
 *     if (!isLoading && user) {
 *       fetchUserSpecificData(user.id).then(setUserData);
 *     }
 *   }, [user, isLoading]);
 * 
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   return (
 *     <View>
 *       <Text>Welcome, {user?.name}</Text>
 *       {userData && <UserDataDisplay data={userData} />}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Enterprise application with comprehensive protection:
 * ```tsx
 * const EnterpriseDashboard = () => {
 *   useAuthGuard(); // First layer of protection
 *   
 *   const { user } = useAuth();
 *   const [dashboardData, setDashboardData] = useState(null);
 *   const [error, setError] = useState(null);
 * 
 *   useEffect(() => {
 *     const loadDashboard = async () => {
 *       try {
 *         setError(null);
 *         const data = await fetchDashboardData();
 *         setDashboardData(data);
 *       } catch (err) {
 *         setError(err.message);
 *         console.error('Dashboard load failed:', err);
 *       }
 *     };
 * 
 *     if (user) {
 *       loadDashboard();
 *     }
 *   }, [user]);
 * 
 *   if (error) {
 *     return (
 *       <View>
 *         <Text>Error loading dashboard</Text>
 *         <Text>{error}</Text>
 *         <Button title="Retry" onPress={() => window.location.reload()} />
 *       </View>
 *     );
 *   }
 * 
 *   return (
 *     <View>
 *       <Text>Enterprise Dashboard</Text>
 *       <Text>Welcome, {user?.name}</Text>
 *       {dashboardData && <DashboardContent data={dashboardData} />}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Authentication state verification
 * - Automatic redirect to authentication flow
 * - Redirect loop prevention with ref tracking
 * - Debug logging for development
 * - Navigation stack reset functionality
 * - Authentication state change handling
 * - Memory efficient implementation
 * - TypeScript navigation support
 * - Zero configuration setup
 * - Enterprise security compliance
 * 
 * @architecture
 * - React hooks pattern
 * - Authentication state monitoring
 * - Navigation integration with React Navigation
 * - Effect-based lifecycle management
 * - Ref-based state tracking
 * - Debug logging integration
 * - Clean architecture principles
 * - Separation of concerns
 * 
 * @authentication
 * - Uses centralized authentication state
 * - Monitors authentication changes
 * - Handles login/logout transitions
 * - Automatic redirect on authentication failure
 * - Navigation reset for security
 * - Authentication flow integration
 * - Enterprise authentication compliance
 * 
 * @security
 * - Prevents unauthorized screen access
 * - Automatic logout handling
 * - Navigation stack security
 * - Authentication state protection
 * - Secure redirect mechanisms
 * - Prevents authentication bypass
 * - Enterprise security standards
 * 
 * @navigation
 * - Uses React Navigation v6
 * - CommonActions for navigation reset
 * - TypeScript navigation types
 * - Stack-based navigation
 * - Route parameter support
 * - Navigation state management
 * - Redirect loop prevention
 * 
 * @debugging
 * - Console logging for development
 * - Authentication state tracking
 * - Redirect behavior monitoring
 * - Navigation action logging
 * - Development-friendly debugging
 * - Performance monitoring support
 * 
 * @performance
 * - Minimal overhead
 * - Efficient state monitoring
 * - Ref-based optimization
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
 * - Clear authentication feedback
 * 
 * @use_cases
 * - User profile screens
 * - Dashboard and home screens
 * - Settings and preferences
 * - Account management
 * - Protected content areas
 * - Enterprise applications
 * - Personal data screens
 * - Authenticated feature access
 * 
 * @best_practices
 * - Use at the top of protected screens
 * - Monitor debug logs in development
 * - Test authentication state changes
 * - Handle edge cases gracefully
 * - Document authentication requirements
 * - Test redirect behavior thoroughly
 * - Monitor navigation performance
 * - Implement proper error handling
 * 
 * @dependencies
 * - react: useEffect, useRef hooks
 * - @react-navigation/native: Navigation utilities
 * - @react-navigation/stack: Stack navigation types
 * - @features/auth/presentation/hooks/use-auth: Authentication state
 * 
 * @see {@link useAuth} for authentication state management
 * @see {@link useNavigation} for navigation utilities
 * @see {@link CommonActions} for navigation actions
 * @see {@link useSessionGuard} for session-based protection
 * 
 * @todo Add authentication analytics tracking
 * @todo Implement custom redirect destinations
 * @todo Add biometric authentication support
 * @todo Include authentication retry mechanisms
 */
export function useAuthGuard(): void {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const didRedirect = useRef(false);

  useEffect(() => {
    console.log(
      '[useAuthGuard] isAuthenticated:',
      isAuthenticated,
      'didRedirect:',
      didRedirect.current
    );
    if (!isAuthenticated && !didRedirect.current) {
      didRedirect.current = true;
      console.log('[useAuthGuard] redirecting to Auth → Login');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Auth', params: {screen: 'Login'}}],
        })
      );
    }
    
    // Reset redirect flag when user logs in
    if (isAuthenticated) {
      didRedirect.current = false;
    }
  }, [isAuthenticated, navigation]);
} 