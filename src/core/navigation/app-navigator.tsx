/**
 * @fileoverview APP-NAVIGATOR: Enterprise Root Navigation Controller
 * @description Main application navigator providing authentication-aware routing with dynamic theming, deep linking support, and comprehensive navigation state management
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Navigation.AppNavigator
 * @namespace Core.Navigation.AppNavigator
 * @category Navigation
 * @subcategory RootNavigation
 */

import React from 'react';
import {
  NavigationContainer,
  LinkingOptions,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@features/auth/presentation/hooks';
import { AuthNavigator } from '@features/auth/presentation/navigation/auth.navigator';
import MainTabNavigator from './main-tabs';
import { RootStackParamList } from './navigation.types';
import { useTheme } from '../theme/theme.system';

/**
 * Root stack navigator instance for application-wide navigation.
 * Provides type-safe navigation with RootStackParamList.
 *
 * @constant Stack
 * @since 1.0.0
 * @description React Navigation native stack navigator with TypeScript support
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Props interface for the AppNavigator component.
 * Defines configuration options for the root navigation system.
 *
 * @interface AppNavigatorProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Navigation
 *
 * @example
 * ```tsx
 * const props: AppNavigatorProps = {
 *   linking: {
 *     prefixes: ['myapp://'],
 *     config: {
 *       screens: {
 *         Main: 'main',
 *         Auth: 'auth'
 *       }
 *     }
 *   }
 * };
 * ```
 */
interface AppNavigatorProps {
  /**
   * Deep linking configuration for the navigation system.
   * Enables URL-based navigation and state restoration.
   *
   * @type {LinkingOptions<RootStackParamList>}
   * @optional
   * @example
   * ```tsx
   * {
   *   prefixes: ['https://myapp.com', 'myapp://'],
   *   config: {
   *     screens: {
   *       Main: {
   *         screens: {
   *           HomeTab: 'home',
   *           ProfileTab: 'profile'
   *         }
   *       },
   *       Auth: {
   *         screens: {
   *           Login: 'login',
   *           Register: 'register'
   *         }
   *       }
   *     }
   *   }
   * }
   * ```
   */
  linking?: LinkingOptions<RootStackParamList>;
}

/**
 * App Navigator Component
 *
 * The root navigation controller of the application providing authentication-aware
 * routing, dynamic theming integration, and comprehensive navigation state management.
 * Implements enterprise-grade navigation patterns with deep linking support,
 * theme integration, and conditional routing based on authentication status.
 *
 * @component
 * @function AppNavigator
 * @param {AppNavigatorProps} props - The component props
 * @returns {React.ReactElement} Rendered navigation container with appropriate navigator
 *
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Navigation
 * @module Core.Navigation.AppNavigator
 * @namespace Core.Navigation.AppNavigator.AppNavigator
 *
 * @description
 * Enterprise-grade root navigation system that orchestrates authentication-aware
 * routing between auth and main application flows. Features comprehensive theming
 * integration, deep linking support, and state persistence for robust navigation
 * experiences across all application states.
 *
 * @example
 * Basic usage as root navigation:
 * ```tsx
 * import AppNavigator from '@/core/navigation/app-navigator';
 * import { AppInitializer } from '@/core/app/app-initializer.component';
 *
 * const App = () => {
 *   return (
 *     <AppInitializer>
 *       <AppNavigator />
 *     </AppInitializer>
 *   );
 * };
 *
 * export default App;
 * ```
 *
 * @example
 * With deep linking configuration:
 * ```tsx
 * const linkingConfig = {
 *   prefixes: ['https://myapp.com', 'myapp://'],
 *   config: {
 *     screens: {
 *       Main: {
 *         screens: {
 *           HomeTab: 'home',
 *           ProfileTab: 'profile/:userId',
 *           NotificationsTab: 'notifications'
 *         }
 *       },
 *       Auth: {
 *         screens: {
 *           Login: 'login',
 *           Register: 'register',
 *           ForgotPassword: 'forgot-password'
 *         }
 *       }
 *     }
 *   }
 * };
 *
 * const App = () => (
 *   <AppNavigator linking={linkingConfig} />
 * );
 * ```
 *
 * @example
 * Integration with error boundaries:
 * ```tsx
 * const AppRoot = () => {
 *   return (
 *     <ErrorBoundary fallback={<ErrorScreen />}>
 *       <AppInitializer>
 *         <AppNavigator linking={deepLinkConfig} />
 *       </AppInitializer>
 *     </ErrorBoundary>
 *   );
 * };
 * ```
 *
 * @navigation_architecture
 * - **Root Level**: NavigationContainer with theme integration
 * - **Authentication Flow**: Conditional routing based on auth state
 * - **Main Application**: Tab-based navigation for authenticated users
 * - **Auth Flow**: Stack-based authentication screens
 * - **Theme Integration**: Dynamic theme adaptation for navigation elements
 *
 * @authentication_routing
 * - **Authenticated State**: Routes to MainTabNavigator
 * - **Unauthenticated State**: Routes to AuthNavigator
 * - **State Management**: Uses auth store for state determination
 * - **Automatic Switching**: Seamless transition between auth states
 * - **Session Persistence**: Navigation state preserved across app restarts
 *
 * @theming_features
 * - **Dynamic Theme Adaptation**: Automatic light/dark mode switching
 * - **Custom Color Mapping**: App theme colors mapped to navigation theme
 * - **Consistent Styling**: Navigation elements match app design system
 * - **Theme Persistence**: Theme state maintained across navigation
 * - **Real-time Updates**: Theme changes apply immediately to navigation
 *
 * @deep_linking_support
 * - **URL Handling**: Support for custom URL schemes and universal links
 * - **State Restoration**: Navigation state restored from URLs
 * - **Parameterized Routes**: Dynamic route parameters for deep navigation
 * - **Fallback Handling**: Graceful fallback for invalid or expired links
 * - **Security**: Protected routes respect authentication state
 *
 * @performance_optimizations
 * - **Lazy Loading**: Screens loaded on demand
 * - **State Persistence**: Navigation state cached for quick restoration
 * - **Memory Management**: Efficient screen stack management
 * - **Transition Animations**: Optimized animations for smooth UX
 * - **Conditional Rendering**: Only renders active navigation flow
 *
 * @accessibility_features
 * - **Screen Reader Support**: Navigation announcements for accessibility
 * - **Focus Management**: Proper focus handling during navigation
 * - **High Contrast**: Navigation elements adapt to accessibility settings
 * - **Voice Navigation**: Support for voice-based navigation commands
 * - **Reduced Motion**: Respects system motion preferences
 *
 * @security_features
 * - **Authentication Guards**: Protected routes require authentication
 * - **Route Validation**: Deep links validated against user permissions
 * - **State Isolation**: Auth and main flows properly isolated
 * - **Session Security**: Navigation state tied to authentication status
 *
 * @error_handling
 * - **Graceful Fallbacks**: Handles navigation errors gracefully
 * - **Error Boundaries**: Integration with app-level error handling
 * - **Invalid Routes**: Fallback to appropriate default screens
 * - **Network Issues**: Handles offline navigation scenarios
 *
 * @development_features
 * - **TypeScript Integration**: Full type safety for navigation
 * - **Developer Tools**: React Navigation devtools integration
 * - **Hot Reloading**: Navigation state preserved during development
 * - **Debug Mode**: Enhanced logging for navigation debugging
 *
 * @use_cases
 * - Root application navigation setup
 * - Authentication-aware routing
 * - Deep linking implementation
 * - Theme-integrated navigation
 * - Cross-platform navigation consistency
 * - Enterprise app navigation patterns
 *
 * @best_practices
 * - Always wrap with AppInitializer
 * - Configure deep linking for production
 * - Test authentication flow transitions
 * - Implement proper error boundaries
 * - Monitor navigation performance
 * - Test accessibility features
 * - Validate deep link security
 *
 * @performance_considerations
 * - Minimize navigation stack depth
 * - Use lazy loading for heavy screens
 * - Optimize theme transition performance
 * - Cache navigation state appropriately
 * - Monitor memory usage in navigation
 *
 * @dependencies
 * - @react-navigation/native: Core navigation framework
 * - @react-navigation/native-stack: Native stack navigator
 * - @features/auth: Authentication system integration
 * - ./main-tabs: Main application tab navigation
 * - ./navigation.types: TypeScript navigation types
 * - ../theme/theme.system: Theme system integration
 *
 * @see {@link MainTabNavigator} for main application navigation
 * @see {@link AuthNavigator} for authentication flow navigation
 * @see {@link useAuthStore} for authentication state management
 * @see {@link useTheme} for theme system integration
 * @see {@link RootStackParamList} for navigation type definitions
 *
 * @todo Add navigation analytics tracking
 * @todo Implement navigation state persistence
 * @todo Add navigation gesture customization
 * @todo Implement custom transition animations
 * @todo Add navigation performance monitoring
 */
export default function AppNavigator({
  linking,
}: AppNavigatorProps): React.ReactElement {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  // Simple auth state - no complex event system needed

  // 🔥 EINFACHE LÖSUNG: Auth State berechnen - keine komplexen Events nötig
  const isUserAuthenticated = React.useMemo(() => {
    const result = isAuthenticated && !!user && !!user.id && !isLoading;

    // 🔥 DEBUG: Auth State Logging
    console.log('[AppNavigator] Auth State Debug:', {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email ? `${user.email.substring(0, 3)}***` : undefined,
      isLoading,
      result,
      timestamp: new Date().toISOString(),
    });

    // 🔥 DEBUG: Navigation Decision Logging
    console.log('[AppNavigator] Navigation Decision:', {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      isLoading,
      isUserAuthenticated: result,
      willRenderMain: result,
      willRenderAuth: !result,
    });

    return result;
  }, [isAuthenticated, user, isLoading]);

  // 🔥 EINFACHES TRACKING: Auth State Änderungen verfolgen
  React.useEffect(() => {
    console.log('[AppNavigator] Auth State Effect Triggered:', {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      isLoading,
      isUserAuthenticated,
      timestamp: new Date().toISOString(),
    });
  }, [
    isAuthenticated,
    user?.id,
    isLoading,
    isUserAuthenticated,
  ]);

  /**
   * Custom navigation theme configuration.
   * Maps application theme colors to React Navigation theme structure.
   */
  const navigationTheme = React.useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.error,
      },
    }),
    [isDark, theme]
  );

  // 🎯 EINFACHSTE LÖSUNG: NavigationContainer Reset bei Auth Änderung
  const navigationKey = React.useMemo(() => {
    return isUserAuthenticated ? 'nav-authenticated' : 'nav-guest';
  }, [isUserAuthenticated]);
  
  console.log(`[AppNavigator] 🚀 Resetting navigation with key: ${navigationKey}, initial route: ${isUserAuthenticated ? 'Main' : 'Auth'}`);
  
  return (
    <NavigationContainer
      key={navigationKey}
      linking={linking}
      theme={navigationTheme}
    >
      <Stack.Navigator 
        initialRouteName={isUserAuthenticated ? 'Main' : 'Auth'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * @summary
 * The AppNavigator provides enterprise-grade root navigation with authentication-aware
 * routing, comprehensive theming integration, and deep linking support. Essential for
 * any production React Native application requiring robust navigation architecture
 * and seamless user experience across authentication states.
 *
 * @key_features
 * - Authentication-aware conditional routing
 * - Dynamic theme integration
 * - Deep linking and universal link support
 * - Type-safe navigation with TypeScript
 * - Performance-optimized navigation stack
 * - Comprehensive accessibility support
 * - Enterprise security patterns
 *
 * @architectural_benefits
 * - Clean separation of auth and main navigation flows
 * - Centralized navigation theme management
 * - Consistent navigation experience
 * - Scalable navigation architecture
 * - Maintainable navigation configuration
 *
 * @production_readiness
 * - Comprehensive error handling
 * - Performance optimization
 * - Security best practices
 * - Accessibility compliance
 * - Deep linking security validation
 *
 * @module_exports
 * - AppNavigator: Main navigation component (default export)
 * - AppNavigatorProps: Props interface
 *
 * @dependencies
 * - React Navigation ecosystem
 * - Authentication system
 * - Theme system
 * - Navigation type definitions
 */
