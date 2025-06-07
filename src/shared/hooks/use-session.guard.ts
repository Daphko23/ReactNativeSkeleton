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

import {useEffect} from 'react';
import {useAuth} from '@features/auth/presentation/hooks/use-auth';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '@core/navigation/navigation.types';

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
export const useSessionGuard = (): void => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [isAuthenticated, isLoading, navigation]);
};
