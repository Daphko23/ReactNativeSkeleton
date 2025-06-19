/**
 * @fileoverview APP-MAIN-COMPONENT: React Native Enterprise Application Root
 * @description Main application component with comprehensive provider setup, error handling, theming, and navigation configuration
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module App
 * @namespace App
 * @category Components
 * @subcategory Root
 */

import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './core/theme/theme.system';
import AppNavigator from './core/navigation/app-navigator';
import { ErrorBoundary } from '@shared/errors/error-boundary';
import { AppInitializer } from '@core/app/app-initializer.component';

// Import i18n configuration
import './core/i18n/i18n';

// Import and configure LogBox to filter expected business errors
import { configureLogBox } from './core/config/logbox.config';
configureLogBox();

/**
 * React Query Client Configuration
 *
 * Configured with enterprise-grade settings for optimal performance:
 * - 3 retry attempts for failed queries
 * - 5-minute stale time for cache efficiency
 * - Consistent error handling across the application
 *
 * @constant {QueryClient} queryClient
 * @since 1.0.0
 * @version 1.0.0
 * @category Configuration
 * @subcategory ReactQuery
 *
 * @example
 * Manual query client usage:
 * ```tsx
 * queryClient.invalidateQueries(['user-data']);
 * ```
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Deep Link Configuration
 *
 * Defines URL schemes and routing patterns for deep linking functionality.
 * Supports both authentication flows and main application navigation.
 *
 * @constant {object} linking
 * @since 1.0.0
 * @version 1.0.0
 * @category Configuration
 * @subcategory DeepLinking
 *
 * @property {string[]} prefixes - URL schemes for the application
 * @property {object} config - Navigation configuration mapping URLs to screens
 * @property {object} config.screens - Screen routing definitions
 * @property {object} config.screens.Auth - Authentication flow screens
 * @property {object} config.screens.Main - Main application screens
 *
 * @example
 * Deep link examples:
 * ```
 * de.daphko.skeleton://auth/login - Opens login screen
 * de.daphko.skeleton://home - Opens home tab
 * de.daphko.skeleton://profile - Opens profile tab
 * ```
 *
 * @example
 * Testing deep links in development:
 * ```bash
 * # iOS Simulator
 * xcrun simctl openurl booted "de.daphko.skeleton://auth/login"
 *
 * # Android
 * adb shell am start -W -a android.intent.action.VIEW -d "de.daphko.skeleton://home"
 * ```
 */
const linking = {
  prefixes: ['de.daphko.skeleton://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'auth/login',
          Register: 'auth/register',
          Callback: 'auth/callback',
          Success: 'auth/success',
          Error: 'auth/error',
        },
      },
      Main: {
        screens: {
          HomeTab: 'home',
          ProfileTab: 'profile',
          NotificationsTab: 'notifications',
          ThemeTab: 'theme',
          CreditsTab: 'credits',
        },
      },
    },
  },
};

/**
 * Main Application Component
 *
 * The root component of the React Native application that sets up the complete
 * provider hierarchy including error boundaries, safe area handling, query client,
 * theming, UI components, and navigation. This component serves as the foundation
 * for the entire application architecture.
 *
 * @component
 * @function App
 * @returns {React.JSX.Element} The complete application component tree
 *
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Root
 * @module App
 * @namespace App
 *
 * @example
 * Basic application setup:
 * ```tsx
 * import App from './src/App';
 * import { AppRegistry } from 'react-native';
 *
 * AppRegistry.registerComponent('ReactNativeSkeleton', () => App);
 * ```
 *
 * @example
 * Testing the application:
 * ```tsx
 * import { render } from '@testing-library/react-native';
 * import App from './App';
 *
 * describe('App', () => {
 *   it('renders without crashing', () => {
 *     render(<App />);
 *   });
 * });
 * ```
 *
 * @architecture
 * Provider Hierarchy (from outermost to innermost):
 * 1. ErrorBoundary - Global error handling and recovery
 * 2. SafeAreaView - Safe area handling for notch/status bar
 * 3. QueryClientProvider - React Query state management
 * 4. ThemeProvider - Theme context and styling system
 * 5. PaperProvider - React Native Paper UI components
 * 6. AppInitializer - Application initialization and loading states
 * 7. AppNavigator - Navigation structure and routing
 *
 * @features
 * - Comprehensive error boundary protection
 * - Safe area handling for all device types
 * - Centralized state management with React Query
 * - Dynamic theming system with light/dark modes
 * - Material Design components via React Native Paper
 * - App initialization and splash screen management
 * - Deep linking and navigation configuration
 * - Internationalization (i18n) support
 * - Performance optimization with query caching
 * - Enterprise-grade error handling
 *
 * @performance
 * - React Query caching reduces unnecessary API calls
 * - Theme provider optimizes re-renders
 * - Error boundaries prevent complete app crashes
 * - Safe area provider optimizes layout calculations
 * - Deep linking provides instant navigation
 *
 * @accessibility
 * - Inherits Material Design accessibility standards
 * - Safe area handling ensures content visibility
 * - Error boundaries provide accessible error states
 * - Theme system supports accessibility preferences
 *
 * @dependencies
 * - react: Core React library
 * - react-native-paper: Material Design components
 * - react-native: Safe area handling with native SafeAreaView
 * - @tanstack/react-query: State management and caching
 * - ./core/theme/theme.system: Custom theming system
 * - ./core/navigation/app-navigator: Navigation configuration
 * - @shared/errors/error-boundary: Error handling component
 * - @core/app/app-initializer.component: App initialization
 * - ./core/i18n/i18n: Internationalization configuration
 *
 * @see {@link ErrorBoundary} for error handling details
 * @see {@link ThemeProvider} for theming system
 * @see {@link AppNavigator} for navigation structure
 * @see {@link AppInitializer} for initialization process
 *
 * @todo Add analytics provider integration
 * @todo Implement push notification setup
 * @todo Add offline data synchronization
 * @todo Integrate crash reporting system
 */
function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <PaperProvider>
              <AppRoot />
            </PaperProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

/**
 * Navigation Controller with Event-Based System
 *
 * This component uses a global navigation event system that bypasses
 * React state dependencies and directly controls navigation.
 */
function AppRoot(): React.JSX.Element {
  const [navigationState, setNavigationState] = React.useState<{
    isAuthenticated: boolean;
    userId?: string;
    isLoading: boolean;
    lastUpdate: number;
  }>({
    isAuthenticated: false,
    userId: undefined,
    isLoading: true,
    lastUpdate: Date.now(),
  });

  // 🔥 ULTIMATE FIX: Direct Auth State Observer with Event Emission
  const { isAuthenticated, user, isLoading } =
    require('@features/auth/presentation/hooks').useAuth();

  React.useEffect(() => {
    const newState = {
      isAuthenticated,
      userId: user?.id,
      isLoading,
      lastUpdate: Date.now(),
    };

    console.log('🚀 AppRoot: Navigation Event Triggered', {
      oldState: navigationState,
      newState,
      willUpdate: true,
      timestamp: new Date().toISOString(),
    });

    setNavigationState(newState);

    // 🔥 EMIT GLOBAL NAVIGATION EVENT
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('auth-navigation-change', {
          detail: newState,
        })
      );
    }
  }, [isAuthenticated, user?.id, isLoading]);

  // 🔥 STABLE KEY: Only update on actual navigation state changes
  const navigationKey = React.useMemo(() => {
    const authStatus = navigationState.isAuthenticated
      ? 'authenticated'
      : 'guest';
    const userId = navigationState.userId || 'none';
    const loadingStatus = navigationState.isLoading ? 'loading' : 'ready';
    return `nav-${authStatus}-${userId}-${loadingStatus}`;
  }, [
    navigationState.isAuthenticated,
    navigationState.userId,
    navigationState.isLoading,
  ]);

  console.log('🔥 AppRoot: Navigation State Applied:', {
    navigationKey,
    state: navigationState,
    timestamp: new Date().toISOString(),
  });

  return (
    <AppInitializer key={navigationKey}>
      <AppNavigator linking={linking} />
    </AppInitializer>
  );
}

export default App;
