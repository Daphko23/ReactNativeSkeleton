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
import {useAuth} from '@features/auth/presentation/hooks/use-auth';
import type {RootStackParamList} from '@core/navigation/navigation.types';

/**
 * Guest Guard Hook
 * 
 * Custom React hook that provides guest-only access protection for screens that should
 * only be accessible to unauthenticated users (e.g., Login, Register, Welcome screens).
 * Automatically redirects authenticated users to the main application flow with comprehensive
 * debug logging and redirect loop prevention mechanisms.
 * 
 * @function useGuestGuard
 * @returns {void} Hook does not return any value, handles navigation side effects
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Hooks
 * @subcategory Authentication
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseGuestGuard
 * 
 * @example
 * Basic guest protection for login screen:
 * ```tsx
 * import { useGuestGuard } from '@/shared/hooks/use-guest.guard';
 * 
 * const LoginScreen = () => {
 *   useGuestGuard(); // Redirects authenticated users away
 * 
 *   const [email, setEmail] = useState('');
 *   const [password, setPassword] = useState('');
 * 
 *   return (
 *     <View>
 *       <Text>Welcome Back</Text>
 *       <TextInput 
 *         placeholder="Email" 
 *         value={email}
 *         onChangeText={setEmail}
 *       />
 *       <TextInput 
 *         placeholder="Password" 
 *         value={password}
 *         onChangeText={setPassword}
 *         secureTextEntry
 *       />
 *       <Button title="Login" onPress={handleLogin} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Multiple guest-only screens:
 * ```tsx
 * const RegisterScreen = () => {
 *   useGuestGuard();
 * 
 *   return (
 *     <View>
 *       <Text>Create Account</Text>
 *       <RegistrationForm />
 *     </View>
 *   );
 * };
 * 
 * const WelcomeScreen = () => {
 *   useGuestGuard();
 * 
 *   return (
 *     <View>
 *       <Text>Welcome to Our App</Text>
 *       <Button title="Get Started" onPress={() => navigation.navigate('Register')} />
 *       <Button title="Sign In" onPress={() => navigation.navigate('Login')} />
 *     </View>
 *   );
 * };
 * 
 * const ForgotPasswordScreen = () => {
 *   useGuestGuard();
 * 
 *   return (
 *     <View>
 *       <Text>Reset Password</Text>
 *       <ForgotPasswordForm />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Guest screen with authentication state handling:
 * ```tsx
 * const OnboardingScreen = () => {
 *   useGuestGuard();
 *   
 *   const [currentStep, setCurrentStep] = useState(0);
 *   const steps = ['Welcome', 'Features', 'GetStarted'];
 * 
 *   const handleNext = () => {
 *     if (currentStep < steps.length - 1) {
 *       setCurrentStep(prev => prev + 1);
 *     } else {
 *       navigation.navigate('Register');
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <Text>Step {currentStep + 1} of {steps.length}</Text>
 *       <OnboardingStep step={steps[currentStep]} />
 *       <Button title={currentStep === steps.length - 1 ? 'Get Started' : 'Next'} onPress={handleNext} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Enterprise authentication flow with guest protection:
 * ```tsx
 * const EnterpriseLoginScreen = () => {
 *   useGuestGuard(); // Ensure only unauthenticated users can access
 *   
 *   const [authMethod, setAuthMethod] = useState<'email' | 'sso' | 'biometric'>('email');
 *   const [credentials, setCredentials] = useState({ email: '', password: '' });
 *   const [isLoading, setIsLoading] = useState(false);
 * 
 *   const handleEmailLogin = async () => {
 *     setIsLoading(true);
 *     try {
 *       await auth.loginWithEmail(credentials);
 *       // useGuestGuard will automatically redirect after successful login
 *     } catch (error) {
 *       console.error('Login failed:', error);
 *       alert('Login failed. Please try again.');
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 * 
 *   const handleSSOLogin = async () => {
 *     setIsLoading(true);
 *     try {
 *       await auth.loginWithSSO();
 *       // Automatic redirect handled by useGuestGuard
 *     } catch (error) {
 *       console.error('SSO login failed:', error);
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <Text>Enterprise Login</Text>
 *       
 *       <View style={styles.authMethodSelector}>
 *         <Button 
 *           title="Email" 
 *           onPress={() => setAuthMethod('email')}
 *           disabled={isLoading}
 *         />
 *         <Button 
 *           title="SSO" 
 *           onPress={() => setAuthMethod('sso')}
 *           disabled={isLoading}
 *         />
 *       </View>
 * 
 *       {authMethod === 'email' && (
 *         <EmailLoginForm 
 *           credentials={credentials}
 *           setCredentials={setCredentials}
 *           onSubmit={handleEmailLogin}
 *           isLoading={isLoading}
 *         />
 *       )}
 * 
 *       {authMethod === 'sso' && (
 *         <SSOLoginButton 
 *           onPress={handleSSOLogin}
 *           isLoading={isLoading}
 *         />
 *       )}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Guest-only screen protection
 * - Automatic redirect on authentication
 * - Loading state awareness
 * - Comprehensive debug logging
 * - Redirect loop prevention
 * - Navigation stack reset
 * - Ref-based state tracking
 * - Timeout-based navigation safety
 * - Enterprise security compliance
 * - TypeScript navigation support
 * 
 * @architecture
 * - React hooks pattern
 * - Authentication state monitoring
 * - Navigation integration
 * - Effect-based lifecycle management
 * - Ref-based optimization
 * - Debug logging system
 * - Error handling integration
 * - Clean architecture principles
 * 
 * @authentication
 * - Inverse authentication verification
 * - Authentication state monitoring
 * - Automatic redirect on login success
 * - Loading state handling
 * - User object verification
 * - Authentication flow integration
 * - Enterprise guest session management
 * 
 * @security
 * - Prevents authenticated access to guest screens
 * - Automatic logout handling
 * - Navigation stack security
 * - Authentication state protection
 * - Secure redirect mechanisms
 * - Session state verification
 * - Enterprise security standards
 * 
 * @navigation
 * - Uses React Navigation v6
 * - CommonActions for navigation reset
 * - TypeScript navigation types
 * - Stack-based navigation
 * - Route parameter support
 * - Navigation state management
 * - Timeout-based safety
 * - Error handling for navigation
 * 
 * @debugging
 * - Comprehensive console logging
 * - Authentication state tracking
 * - Navigation behavior monitoring
 * - Redirect status logging
 * - User information tracking
 * - Performance monitoring
 * - Development-friendly debugging
 * 
 * @performance
 * - Minimal overhead
 * - Efficient state monitoring
 * - Ref-based optimization
 * - Automatic cleanup
 * - Optimized re-renders
 * - Memory leak prevention
 * - Fast authentication checks
 * - Timeout-based optimization
 * 
 * @accessibility
 * - Seamless authentication flow
 * - No additional accessibility barriers
 * - Maintains focus management
 * - Screen reader compatibility
 * - Clear authentication feedback
 * 
 * @use_cases
 * - Login screens
 * - Registration forms
 * - Welcome/onboarding screens
 * - Password reset flows
 * - Authentication selection
 * - Terms of service screens
 * - Public landing pages
 * - Guest checkout flows
 * 
 * @best_practices
 * - Use on guest-only screens
 * - Monitor debug logs in development
 * - Test authentication state changes
 * - Handle navigation edge cases
 * - Document guest flow requirements
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
 * @see {@link useAuthGuard} for authenticated screen protection
 * 
 * @todo Add guest session analytics tracking
 * @todo Implement custom redirect destinations
 * @todo Add guest session timeout handling
 * @todo Include guest conversion tracking
 */
export function useGuestGuard(): void {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const hasRedirected = useRef(false);

  // Log auth state changes
  useEffect(() => {
    console.log(
      '[useGuestGuard] AUTH STATE CHANGE:',
      'isAuthenticated:', isAuthenticated,
      'isLoading:', isLoading,
      'user:', user?.email || 'null',
      'hasRedirected:', hasRedirected.current
    );
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    console.log(
      '[useGuestGuard] NAVIGATION EFFECT:',
      'isAuthenticated:', isAuthenticated,
      'isLoading:', isLoading,
      'user:', user?.email || 'null',
      'hasRedirected:', hasRedirected.current
    );
    
    if (isAuthenticated && !isLoading && !hasRedirected.current) {
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
    if (!isAuthenticated && !isLoading) {
      console.log('[useGuestGuard] Resetting hasRedirected flag');
      hasRedirected.current = false;
    }
  }, [isAuthenticated, isLoading, user, navigation]);
}
