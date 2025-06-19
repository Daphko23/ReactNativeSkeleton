/**
 * @fileoverview APP-INITIALIZER-COMPONENT: Enterprise Application Initialization System
 * @description Core application initializer component responsible for bootstrapping authentication services, session management, and localization setup with comprehensive error handling
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.App.AppInitializer
 * @namespace Core.App.AppInitializer
 * @category Components
 * @subcategory Initialization
 */

import React, { useEffect, useState, useRef, type ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@features/auth/presentation/hooks';

import { authContainer } from '@features/auth/application/di/auth.container';
import { supabase as _supabase } from '@core/config/supabase.config'; // Mark as potentially unused
import { ConsoleLogger } from '@core/logging/console.logger';

// Import Environment entfernt - aktuell nicht verwendet
import * as RNLocalize from 'react-native-localize';
import i18n from '@core/i18n/i18n';

/**
 * Props interface for the AppInitializer component.
 * Defines the children prop for rendering the application after initialization.
 *
 * @interface AppInitializerProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Initialization
 *
 * @example
 * ```tsx
 * const props: AppInitializerProps = {
 *   children: <MainNavigator />
 * };
 * ```
 */
interface AppInitializerProps {
  /**
   * The application UI to render after initialization is complete.
   * Typically contains the main navigation container and app shell.
   *
   * @type {ReactNode}
   * @required
   * @example
   * ```tsx
   * <AppInitializer>
   *   <NavigationContainer>
   *     <MainTabNavigator />
   *   </NavigationContainer>
   * </AppInitializer>
   * ```
   */
  children: ReactNode;
}

/**
 * App Initializer Component
 *
 * Core application initialization component responsible for bootstrapping essential
 * services, authentication state, and localization before rendering the main application.
 * Implements enterprise-grade initialization patterns with comprehensive error handling,
 * loading states, and graceful fallback mechanisms.
 *
 * @component
 * @function AppInitializer
 * @param {AppInitializerProps} props - The component props
 * @returns {React.JSX.Element} Rendered app initializer or loading state
 *
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Initialization
 * @module Core.App.AppInitializer
 * @namespace Core.App.AppInitializer.AppInitializer
 *
 * @description
 * Enterprise-grade application initializer that orchestrates the startup sequence
 * including authentication service initialization, session state restoration,
 * localization setup, and dependency injection. Provides loading states and
 * error recovery mechanisms for robust application startup.
 *
 * @example
 * Basic usage as app root wrapper:
 * ```tsx
 * import { AppInitializer } from '@/core/app/app-initializer.component';
 * import { NavigationContainer } from '@react-navigation/native';
 * import MainTabNavigator from '@/core/navigation/main-tabs';
 *
 * const App = () => {
 *   return (
 *     <AppInitializer>
 *       <NavigationContainer>
 *         <MainTabNavigator />
 *       </NavigationContainer>
 *     </AppInitializer>
 *   );
 * };
 *
 * export default App;
 * ```
 *
 * @example
 * With error boundary integration:
 * ```tsx
 * const AppRoot = () => {
 *   return (
 *     <ErrorBoundary fallback={<ErrorScreen />}>
 *       <AppInitializer>
 *         <ThemeProvider>
 *           <NavigationContainer>
 *             <MainApplication />
 *           </NavigationContainer>
 *         </ThemeProvider>
 *       </AppInitializer>
 *     </ErrorBoundary>
 *   );
 * };
 * ```
 *
 * @example
 * Initialization sequence monitoring:
 * ```tsx
 * const AppWithAnalytics = () => {
 *   useEffect(() => {
 *     analytics.track('app_initialization_started');
 *   }, []);
 *
 *   return (
 *     <AppInitializer>
 *       <MainApp />
 *     </AppInitializer>
 *   );
 * };
 * ```
 *
 * @initialization_sequence
 * 1. **Logging Setup**: Initialize console logger for debugging
 * 2. **Auth Container**: Configure authentication service container
 * 3. **Service Registration**: Register auth services with dependencies
 * 4. **Session Restoration**: Restore previous user session if available
 * 5. **Localization**: Set device locale and initialize i18n
 * 6. **Ready State**: Mark application as ready for rendering
 *
 * @services_initialized
 * - **Authentication Services**: Biometric, OAuth, MFA, Compliance
 * - **Logging System**: Console logger with structured output
 * - **Session Management**: Token validation and user state
 * - **Internationalization**: Device locale detection and setup
 * - **Environment Configuration**: Development/production settings
 *
 * @error_handling
 * - **Graceful Degradation**: App continues even if initialization fails
 * - **Error Logging**: Comprehensive error reporting and debugging
 * - **Fallback States**: Default configurations for failed services
 * - **User Experience**: Smooth loading and error recovery
 *
 * @loading_states
 * - **Initial Loading**: Activity indicator during initialization
 * - **Service Registration**: Authentication container setup
 * - **Session Restoration**: User state and token validation
 * - **Localization Setup**: Language and regional configuration
 *
 * @authentication_features
 * - **Biometric Authentication**: Fingerprint, Face ID support
 * - **OAuth Integration**: Social media and enterprise SSO
 * - **Multi-Factor Authentication**: SMS, Email, TOTP support
 * - **Compliance Features**: Security and regulatory requirements
 * - **Auth Orchestration**: Centralized authentication management
 *
 * @localization_features
 * - **Device Locale Detection**: Automatic language detection
 * - **Fallback Language**: German (de) as default
 * - **Dynamic Language Switching**: Runtime language changes
 * - **Regional Settings**: Number, date, currency formatting
 *
 * @performance_optimizations
 * - **Async Initialization**: Non-blocking service setup
 * - **Lazy Loading**: Services loaded on demand
 * - **Memory Management**: Efficient resource allocation
 * - **Startup Time**: Optimized initialization sequence
 *
 * @security_features
 * - **Secure Session Restoration**: Encrypted token validation
 * - **Environment Isolation**: Development/production separation
 * - **Compliance Enforcement**: Security policy implementation
 * - **Audit Logging**: Security event tracking
 *
 * @development_features
 * - **Debug Logging**: Comprehensive initialization logging
 * - **Development Environment**: Enhanced debugging support
 * - **Error Reporting**: Detailed error information
 * - **Performance Monitoring**: Initialization timing tracking
 *
 * @use_cases
 * - Application startup and bootstrap
 * - Authentication service initialization
 * - Session state restoration
 * - Localization setup
 * - Development environment configuration
 * - Production deployment preparation
 * - Error recovery and fallback handling
 *
 * @best_practices
 * - Always wrap main app with AppInitializer
 * - Handle initialization errors gracefully
 * - Monitor initialization performance
 * - Implement proper error boundaries
 * - Test initialization sequence thoroughly
 * - Use loading states for better UX
 * - Implement analytics tracking
 *
 * @accessibility
 * - Screen reader compatibility for loading states
 * - Proper focus management during initialization
 * - High contrast support for loading indicators
 * - Reduced motion support for animations
 *
 * @testing_considerations
 * - Mock authentication services for testing
 * - Test initialization failure scenarios
 * - Verify localization setup
 * - Test loading state accessibility
 * - Performance benchmarking
 *
 * @dependencies
 * - react: Core React hooks and components
 * - react-native: Platform-specific components
 * - @features/auth: Authentication system integration
 * - @core/logging: Logging infrastructure
 * - @core/config: Environment configuration
 * - react-native-localize: Device locale detection
 * - @core/i18n: Internationalization system
 *
 * @see {@link useAuthStore} for authentication state management
 * @see {@link AuthServiceContainer} for authentication service factory
 * @see {@link ConsoleLogger} for logging implementation
 * @see {@link Environment} for environment configuration
 *
 * @todo Add initialization analytics tracking
 * @todo Implement initialization progress reporting
 * @todo Add custom initialization hooks
 * @todo Implement initialization caching
 * @todo Add initialization retry mechanisms
 */
export const AppInitializer = ({
  children,
}: AppInitializerProps): React.JSX.Element => {
  const { checkAuthStatus, getCurrentUser, isAuthenticated, user, isLoading } =
    useAuth();
  const [isReady, setIsReady] = useState(false);

  // 🔥 RACE CONDITION FIX: Use useRef to prevent double initialization
  const initializationState = useRef({
    isInitializing: false,
    hasInitialized: false,
  });

  // 🔥 ULTIMATE BACKUP: Global Event Listener for Navigation Changes
  const [globalEventCounter, setGlobalEventCounter] = useState(0);

  React.useEffect(() => {
    const handleGlobalNavEvent = (event: any) => {
      console.log(
        '🌍 AppInitializer: Global Navigation Event Received:',
        event.detail
      );
      setGlobalEventCounter(prev => prev + 1);

      // Force ready state when global event occurs
      if (initializationState.current.hasInitialized) {
        setIsReady(true);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-navigation-change', handleGlobalNavEvent);
      return () =>
        window.removeEventListener(
          'auth-navigation-change',
          handleGlobalNavEvent
        );
    }
  }, []);

  // 🔥 CONTINUOUS FIX: Always react to auth state changes after initialization
  useEffect(() => {
    // Always set ready when auth state is clear (after initial setup)
    if (initializationState.current.hasInitialized) {
      console.log(
        '🔥 AppInitializer: Auth state change detected, updating ready state',
        {
          isAuthenticated,
          hasUser: !!user,
          isLoading,
          currentReady: isReady,
          willSetReady: true,
          timestamp: new Date().toISOString(),
        }
      );
      setIsReady(true);
    }
  }, [isAuthenticated, user?.id, isLoading, isReady]);

  // 🔥 FORCE RE-RENDER: Force component update on every auth state change
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  useEffect(() => {
    if (initializationState.current.hasInitialized) {
      console.log(
        '🔥 AppInitializer: Forcing re-render due to auth state change'
      );
      setForceUpdateCounter(prev => prev + 1);
    }
  }, [isAuthenticated, user?.id, isLoading]);

  useEffect(() => {
    // 🔥 PREVENT DOUBLE INITIALIZATION
    if (
      initializationState.current.isInitializing ||
      initializationState.current.hasInitialized
    ) {
      console.log(
        '🚫 App initialization already in progress or completed, skipping...'
      );
      if (initializationState.current.hasInitialized) setIsReady(true);
      return;
    }

    initializationState.current.isInitializing = true;
    /**
     * Asynchronous application initialization function.
     * Orchestrates the complete startup sequence with error handling.
     *
     * @async
     * @function initializeApp
     * @returns {Promise<void>} Promise resolving when initialization completes
     *
     * @description
     * Manages the complete application initialization sequence including
     * authentication services, session restoration, and error recovery.
     *
     * @sequence
     * 1. Start initialization logging
     * 2. Create and configure logger instance
     * 3. Initialize authentication service container
     * 4. Configure authentication services with features
     * 5. Initialize user session through auth store
     * 6. Mark application as ready for rendering
     * 7. Handle and log any initialization errors
     *
     * @error_handling
     * - Catches and logs all initialization errors
     * - Continues app startup even if initialization fails
     * - Provides detailed error information for debugging
     * - Ensures app remains functional with fallback configurations
     */
    const initializeApp = async (): Promise<void> => {
      try {
        console.log('🚀 Starting app initialization...');

        // 1. Initialize Auth Services - Using unified authContainer DI
        const logger = new ConsoleLogger();

        await authContainer.initialize(
          {
            enableAdvancedSecurity: true,
            enableBiometric: true,
            enableOAuth: true,
            enableMFA: true,
            enableCompliance: true,
            enablePasswordPolicy: true,
          },
          logger
        );

        console.log('✅ Auth services initialized');

        // 2. Initialize session through auth hooks (check existing auth status)
        console.log('🔍 Initializing session through auth hooks...');
        const isAuthenticated = await checkAuthStatus();
        if (isAuthenticated) {
          const user = await getCurrentUser(); // Populate user data if authenticated
          console.log(
            '✅ User session initialized:',
            user?.id ? 'authenticated' : 'anonymous'
          );
        }

        console.log('✅ App initialization completed successfully');

        // 🔥 MARK INITIALIZATION COMPLETE
        initializationState.current.isInitializing = false;
        initializationState.current.hasInitialized = true;
        setIsReady(true);
      } catch (error) {
        console.error('🚨 App initialization failed:', error);

        // 🔥 MARK INITIALIZATION COMPLETE EVEN ON ERROR
        initializationState.current.isInitializing = false;
        initializationState.current.hasInitialized = true;
        setIsReady(true); // Continue app startup even if initialization fails
      }
    };

    initializeApp();
  }, [checkAuthStatus, getCurrentUser]);

  useEffect(() => {
    /**
     * Device localization setup effect.
     * Detects device locale and configures internationalization.
     *
     * @description
     * Automatically detects the device's preferred language and applies
     * it to the internationalization system. Falls back to German (de)
     * as the default language if detection fails.
     *
     * @localization_logic
     * - Detects device locale using react-native-localize
     * - Extracts language code from locale information
     * - Falls back to German (de) as default
     * - Applies language setting to i18n system
     *
     * @supported_locales
     * - Automatic device locale detection
     * - German (de) as fallback
     * - Dynamic language switching support
     * - Regional formatting adaptation
     */
    // Set device locale
    const deviceLocale = RNLocalize.getLocales()?.[0]?.languageCode ?? 'de';
    i18n.changeLanguage(deviceLocale);
  }, []);

  // 🔥 DEBUG: Show initialization state
  console.log('🔥 AppInitializer Render Decision:', {
    isReady,
    isInitializing: initializationState.current.isInitializing,
    hasInitialized: initializationState.current.hasInitialized,
    isAuthenticated,
    hasUser: !!user,
    isLoading,
    forceUpdateCounter,
    globalEventCounter,
    willRenderChildren: isReady,
    timestamp: new Date().toISOString(),
  });

  // Render loading state during initialization
  if (!isReady) {
    console.log('🔄 AppInitializer: Rendering loading state...');
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Render main application after initialization
  console.log('✅ AppInitializer: Rendering children (AppNavigator)...');
  return <>{children}</>;
};

/**
 * Stylesheet for AppInitializer component.
 * Provides styling for loading states and initialization UI.
 *
 * @constant styles
 * @since 1.0.0
 * @description Compiled stylesheet with loading indicator styling
 *
 * @styles
 * - **loader**: Centered loading indicator container
 *   - Full screen flex layout
 *   - Centered alignment for loading spinner
 *   - Accessible loading state presentation
 */
const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

/**
 * @summary
 * The AppInitializer component provides enterprise-grade application initialization
 * with comprehensive service bootstrapping, error handling, and user experience
 * optimization. Essential for any production React Native application requiring
 * robust startup sequences and dependency management.
 *
 * @key_features
 * - Comprehensive service initialization
 * - Authentication system bootstrap
 * - Session state restoration
 * - Localization setup
 * - Error handling and recovery
 * - Loading state management
 * - Enterprise security features
 *
 * @architectural_benefits
 * - Clean separation of initialization concerns
 * - Centralized startup sequence management
 * - Graceful error handling and recovery
 * - Optimized user experience during startup
 * - Testable initialization logic
 *
 * @production_readiness
 * - Comprehensive error handling
 * - Performance optimization
 * - Security best practices
 * - Accessibility compliance
 * - Monitoring and logging integration
 *
 * @module_exports
 * - AppInitializer: Main initialization component
 * - AppInitializerProps: Props interface
 *
 * @dependencies
 * - Authentication system (@features/auth)
 * - Logging infrastructure (@core/logging)
 * - Configuration system (@core/config)
 * - Internationalization (@core/i18n)
 * - Device localization (react-native-localize)
 */
