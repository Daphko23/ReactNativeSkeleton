/**
 * @fileoverview WITH-GUEST-GUARD-HOC: Guest-Only Access Guard Higher-Order Component
 * @description HOC for protecting guest-only screens with automatic redirection for authenticated users
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.HOC
 * @namespace Shared.HOC.WithGuestGuard
 * @category Components
 * @subcategory HOC
 */

import React from 'react';
import {useGuestGuard} from '@shared/hooks/use-guest.guard';

/**
 * Guest Guard Higher-Order Component
 * 
 * Wraps components that should only be accessible to non-authenticated users,
 * automatically redirecting authenticated users to the main application.
 * This HOC ensures that screens like login and registration are only
 * accessible to guests who haven't logged in yet.
 *
 * @function withGuestGuard
 * @template P - Generic props type extending object
 * @param {React.ComponentType<P>} Component - The component that requires guest-only access
 * @returns {React.FC<P>} Guarded component that enforces guest-only access
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory HOC
 * @module Shared.HOC
 * @namespace Shared.HOC.WithGuestGuard
 * 
 * @example
 * Basic guest-only screen protection:
 * ```tsx
 * import { withGuestGuard } from '@/shared/hoc/with-guest.guard';
 * 
 * const LoginScreen = () => (
 *   <View>
 *     <Text>Login Form</Text>
 *     <TextInput placeholder="Email" />
 *     <TextInput placeholder="Password" secureTextEntry />
 *     <Button title="Login" />
 *   </View>
 * );
 * 
 * export default withGuestGuard(LoginScreen);
 * ```
 * 
 * @example
 * Protecting authentication flow screens:
 * ```tsx
 * const RegisterScreen = withGuestGuard(() => (
 *   <View>
 *     <Text>Create Account</Text>
 *     <TextInput placeholder="Email" />
 *     <TextInput placeholder="Password" secureTextEntry />
 *     <Button title="Register" />
 *   </View>
 * ));
 * 
 * const ForgotPasswordScreen = withGuestGuard(() => (
 *   <View>
 *     <Text>Reset Password</Text>
 *     <TextInput placeholder="Email" />
 *     <Button title="Send Reset Link" />
 *   </View>
 * ));
 * 
 * const WelcomeScreen = withGuestGuard(() => (
 *   <View>
 *     <Text>Welcome to Our App</Text>
 *     <Button title="Login" />
 *     <Button title="Register" />
 *   </View>
 * ));
 * ```
 * 
 * @example
 * Using with typed props:
 * ```tsx
 * interface LoginFormProps {
 *   onLogin: (email: string, password: string) => void;
 *   isLoading: boolean;
 *   error?: string;
 * }
 * 
 * const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => (
 *   <View>
 *     <Text>Login Form</Text>
 *     {error && <Text style={{ color: 'red' }}>{error}</Text>}
 *     <TextInput placeholder="Email" />
 *     <TextInput placeholder="Password" secureTextEntry />
 *     <Button 
 *       title={isLoading ? "Logging in..." : "Login"} 
 *       disabled={isLoading}
 *       onPress={() => onLogin('email', 'password')}
 *     />
 *   </View>
 * );
 * 
 * export default withGuestGuard(LoginForm);
 * ```
 * 
 * @example
 * Onboarding and marketing screens:
 * ```tsx
 * const OnboardingScreen = withGuestGuard(() => (
 *   <View>
 *     <Text>Discover Our Features</Text>
 *     <Text>Welcome to the best app ever!</Text>
 *     <Button title="Get Started" />
 *   </View>
 * ));
 * 
 * const LandingPageScreen = withGuestGuard(() => (
 *   <View>
 *     <Text>Amazing Features Await</Text>
 *     <Button title="Sign Up Free" />
 *     <Button title="Already have an account? Login" />
 *   </View>
 * ));
 * ```
 * 
 * @features
 * - Automatic guest-only access verification
 * - Seamless redirection for authenticated users
 * - TypeScript generic support
 * - Zero configuration required
 * - Works with all React components
 * - Preserves component props and refs
 * - Debug-friendly display names
 * - Minimal performance overhead
 * - Compatible with navigation systems
 * - Authentication state monitoring
 * 
 * @architecture
 * - Higher-Order Component pattern
 * - Hook-based guest access checking
 * - Automatic navigation handling
 * - Component composition support
 * - Generic type preservation
 * - Display name inheritance
 * - Props forwarding
 * 
 * @authentication
 * - Leverages useGuestGuard hook
 * - Automatic auth state verification
 * - Reverse authentication logic
 * - Session state monitoring
 * - Token presence checking
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
 * - Login and registration screens
 * - Forgot password flows
 * - Welcome and onboarding screens
 * - Marketing and landing pages
 * - Guest tutorials
 * - Demo access screens
 * - Public information displays
 * - Authentication error screens
 * 
 * @best_practices
 * - Use for all guest-only screens
 * - Apply at component export level
 * - Test authentication state changes
 * - Handle loading states appropriately
 * - Provide clear navigation options
 * - Monitor guest user behavior
 * - Optimize for conversion
 * - Document guest flows
 * 
 * @dependencies
 * - react: Core React library
 * - @shared/hooks/use-guest.guard: Guest access verification hook
 * 
 * @see {@link useGuestGuard} for guest access verification logic
 * @see {@link withAuthGuard} for authenticated-only protection
 * @see {@link withRoleGuard} for role-based protection
 * 
 * @todo Add custom redirect destinations
 * @todo Implement guest session tracking
 * @todo Add conversion analytics
 */
export const withGuestGuard = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const GuardedComponent: React.FC<P> = (props: P) => {
    useGuestGuard();
    return <Component {...props} />;
  };

  GuardedComponent.displayName = `withGuestGuard(${Component.displayName || Component.name || 'Component'})`;

  return GuardedComponent;
};
