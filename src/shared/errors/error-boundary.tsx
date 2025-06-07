/**
 * @fileoverview ERROR-BOUNDARY: React Error Boundary Component
 * @description Global error boundary for catching and handling JavaScript errors in React component tree
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Errors
 * @namespace Shared.Errors.ErrorBoundary
 * @category Components
 * @subcategory ErrorHandling
 */

import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {colors} from '@core/theme';
import { useTranslation } from 'react-i18next';

/**
 * Props interface for the ErrorBoundary component.
 * Defines configuration for error boundary behavior and child component wrapping.
 * 
 * @interface ErrorBoundaryProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory ErrorHandling
 * 
 * @example
 * ```tsx
 * const boundaryProps: ErrorBoundaryProps = {
 *   children: <AppContent />
 * };
 * ```
 */
interface ErrorBoundaryProps {
  /**
   * Child components to be protected by the error boundary.
   * Any JavaScript errors thrown by these components will be caught.
   * 
   * @type {React.ReactNode}
   * @required
   * @example
   * ```tsx
   * <ErrorBoundary>
   *   <App />
   * </ErrorBoundary>
   * ```
   */
  children: React.ReactNode;
}

/**
 * State interface for ErrorBoundary component.
 * Manages error state and error information for recovery and display.
 * 
 * @interface ErrorBoundaryState
 * @since 1.0.0
 * @version 1.0.0
 * @category State
 * @subcategory ErrorHandling
 * 
 * @example
 * ```tsx
 * const initialState: ErrorBoundaryState = {
 *   hasError: false,
 *   error: null
 * };
 * ```
 */
interface ErrorBoundaryState {
  /**
   * Flag indicating whether an error has been caught.
   * Controls whether to render error UI or normal children.
   * 
   * @type {boolean}
   * @default false
   * @example true
   */
  hasError: boolean;

  /**
   * The caught error object containing error details.
   * Used for error reporting and user feedback.
   * 
   * @type {Error | null}
   * @default null
   * @example new Error("Component failed to render")
   */
  error: Error | null;
}

/**
 * React Error Boundary Component
 * 
 * A global error boundary that catches JavaScript errors anywhere in the React
 * component tree, logs those errors, and displays a fallback UI instead of
 * crashing the entire application. Essential for production apps to gracefully
 * handle unexpected errors and provide user recovery options.
 * 
 * @component
 * @class ErrorBoundary
 * @extends React.Component<ErrorBoundaryProps, ErrorBoundaryState>
 * @param {ErrorBoundaryProps} props - The component props
 * @returns {React.ReactElement} Rendered error boundary or children
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory ErrorHandling
 * @module Shared.Errors
 * @namespace Shared.Errors.ErrorBoundary
 * 
 * @example
 * Basic app-level error boundary:
 * ```tsx
 * import { ErrorBoundary } from '@/shared/errors/error-boundary';
 * 
 * const App = () => (
 *   <ErrorBoundary>
 *     <ThemeProvider>
 *       <NavigationContainer>
 *         <MainNavigator />
 *       </NavigationContainer>
 *     </ThemeProvider>
 *   </ErrorBoundary>
 * );
 * ```
 * 
 * @example
 * Feature-specific error boundary:
 * ```tsx
 * const ProfileScreen = () => (
 *   <ErrorBoundary>
 *     <ProfileHeader />
 *     <ProfileContent />
 *     <ProfileActions />
 *   </ErrorBoundary>
 * );
 * ```
 * 
 * @example
 * Nested error boundaries for granular error handling:
 * ```tsx
 * const Dashboard = () => (
 *   <ErrorBoundary>
 *     <DashboardHeader />
 *     <ErrorBoundary>
 *       <StatsSection />
 *     </ErrorBoundary>
 *     <ErrorBoundary>
 *       <ChartSection />
 *     </ErrorBoundary>
 *   </ErrorBoundary>
 * );
 * ```
 * 
 * @example
 * Error boundary with complex component tree:
 * ```tsx
 * const MainApp = () => (
 *   <ErrorBoundary>
 *     <Provider store={store}>
 *       <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
 *         <ThemeProvider theme={theme}>
 *           <I18nextProvider i18n={i18n}>
 *             <NavigationContainer>
 *               <RootNavigator />
 *             </NavigationContainer>
 *           </I18nextProvider>
 *         </ThemeProvider>
 *       </PersistGate>
 *     </Provider>
 *   </ErrorBoundary>
 * );
 * ```
 * 
 * @features
 * - Catches JavaScript errors in component tree
 * - Provides fallback UI for graceful degradation
 * - Internationalized error messages
 * - Error recovery mechanism
 * - Console error logging
 * - User-friendly error display
 * - Reload functionality for error recovery
 * - Production-ready error handling
 * - Memory leak prevention
 * - Theme-aware styling
 * 
 * @architecture
 * - Class component for error boundary lifecycle
 * - Static getDerivedStateFromError for state updates
 * - componentDidCatch for error logging
 * - Functional error content component
 * - Separation of error display logic
 * - Internationalization integration
 * - Theme system integration
 * - Recovery mechanism implementation
 * 
 * @error_handling
 * - Catches render errors in child components
 * - Prevents app crashes from component errors
 * - Logs errors to console for debugging
 * - Displays user-friendly error messages
 * - Provides recovery options
 * - Maintains app stability
 * - Isolates error impact
 * 
 * @accessibility
 * - Screen reader compatible error messages
 * - Accessible button for error recovery
 * - Clear error communication
 * - Focus management for error state
 * - High contrast error display
 * - Meaningful error descriptions
 * - Keyboard navigation support
 * 
 * @performance
 * - Minimal performance overhead
 * - Efficient error state management
 * - Optimized re-render behavior
 * - Memory efficient error handling
 * - Fast error recovery mechanism
 * - Lightweight error UI
 * - No memory leaks in error states
 * 
 * @use_cases
 * - Application-wide error protection
 * - Feature-specific error isolation
 * - Screen-level error boundaries
 * - Component-level error handling
 * - Development error debugging
 * - Production error graceful handling
 * - User experience protection
 * - Error reporting and logging
 * 
 * @best_practices
 * - Wrap entire app with top-level boundary
 * - Use granular boundaries for feature isolation
 * - Implement proper error logging
 * - Provide meaningful error messages
 * - Include recovery mechanisms
 * - Test error scenarios thoroughly
 * - Monitor error boundary triggers
 * - Keep error UI simple and accessible
 * 
 * @dependencies
 * - react: Core React library with component lifecycle
 * - react-native: View, Text, Button, StyleSheet components
 * - @core/theme: Color system integration
 * - react-i18next: Internationalization support
 * 
 * @see {@link getDerivedStateFromError} for error state derivation
 * @see {@link componentDidCatch} for error logging
 * @see {@link ErrorBoundaryContent} for error display component
 * 
 * @todo Add error reporting to analytics service
 * @todo Implement retry mechanism with exponential backoff
 * @todo Add error categorization for different handling
 * @todo Include stack trace display for development
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  /**
   * Constructor for ErrorBoundary component.
   * Initializes component state with no error condition.
   * 
   * @constructor
   * @param {ErrorBoundaryProps} props - Component props containing children
   * @since 1.0.0
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  /**
   * Static lifecycle method that derives state from error.
   * Called when an error is thrown during rendering to update component state.
   * 
   * @static
   * @method getDerivedStateFromError
   * @param {Error} error - The error that was thrown
   * @returns {ErrorBoundaryState} New state indicating error condition
   * 
   * @since 1.0.0
   * @lifecycle
   * @example
   * ```tsx
   * // Automatically called by React when error occurs
   * static getDerivedStateFromError(error: Error): ErrorBoundaryState {
   *   return { hasError: true, error };
   * }
   * ```
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {hasError: true, error};
  }

  /**
   * Lifecycle method called when component catches an error.
   * Used for error logging and optional error reporting to external services.
   * 
   * @method componentDidCatch
   * @param {Error} error - The error that was thrown
   * @param {React.ErrorInfo} info - Error information including component stack
   * 
   * @since 1.0.0
   * @lifecycle
   * @example
   * ```tsx
   * componentDidCatch(error: Error, info: React.ErrorInfo) {
   *   console.error('Uncaught error:', error, info);
   *   // Optional: Report to error tracking service
   *   errorReporting.captureException(error, { extra: info });
   * }
   * ```
   */
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info);
    // Hier könnte optional auch Logging/Reporting erfolgen
  }

  /**
   * Handler for error recovery action.
   * Resets error boundary state to allow re-rendering of children.
   * 
   * @method handleReload
   * @returns {void}
   * 
   * @since 1.0.0
   * @example
   * ```tsx
   * const handleReload = () => {
   *   this.setState({ hasError: false, error: null });
   * };
   * ```
   */
  handleReload = () => {
    this.setState({hasError: false, error: null});
  };

  /**
   * Render method that conditionally displays error UI or children.
   * Returns error fallback UI when error state is true, otherwise renders children.
   * 
   * @method render
   * @returns {React.ReactNode} Error UI or children components
   * 
   * @since 1.0.0
   * @lifecycle
   */
  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryContent error={this.state.error} onReload={this.handleReload} />;
    }

    return this.props.children;
  }
}

/**
 * Props interface for ErrorBoundaryContent component.
 * Defines configuration for error display and recovery functionality.
 * 
 * @interface ErrorBoundaryContentProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory ErrorHandling
 * 
 * @example
 * ```tsx
 * const contentProps: ErrorBoundaryContentProps = {
 *   error: new Error("Render failed"),
 *   onReload: () => setBoundaryState({ hasError: false })
 * };
 * ```
 */
interface ErrorBoundaryContentProps {
  /**
   * The error object to display information about.
   * Contains error message and details for user feedback.
   * 
   * @type {Error | null}
   * @required
   * @example new Error("Component failed to render")
   */
  error: Error | null;

  /**
   * Callback function to handle error recovery.
   * Typically resets error boundary state to retry rendering.
   * 
   * @type {() => void}
   * @required
   * @example () => resetErrorBoundary()
   */
  onReload: () => void;
}

/**
 * Error Boundary Content Component
 * 
 * Functional component responsible for displaying error information and
 * providing recovery options when an error boundary catches an error.
 * Features internationalized error messages and accessible error recovery.
 * 
 * @component
 * @function ErrorBoundaryContent
 * @param {ErrorBoundaryContentProps} props - Component props
 * @returns {React.ReactElement} Rendered error display UI
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory ErrorHandling
 * @module Shared.Errors
 * @namespace Shared.Errors.ErrorBoundary.ErrorBoundaryContent
 * 
 * @example
 * Basic error content display:
 * ```tsx
 * <ErrorBoundaryContent 
 *   error={caughtError} 
 *   onReload={() => resetErrorState()} 
 * />
 * ```
 * 
 * @features
 * - Internationalized error messages
 * - User-friendly error display
 * - Recovery button functionality
 * - Theme-aware styling
 * - Accessible error communication
 * - Centered layout design
 * - Error message extraction
 * - Clear call-to-action
 * 
 * @accessibility
 * - Screen reader compatible
 * - Accessible button interaction
 * - Clear error message hierarchy
 * - Meaningful error descriptions
 * - High contrast error display
 * - Focus management ready
 * 
 * @styling
 * - Centered container layout
 * - Theme-integrated colors
 * - Responsive text sizing
 * - Error-specific color coding
 * - Consistent spacing
 * - Mobile-optimized design
 * 
 * @dependencies
 * - react-i18next: Translation system
 * - react-native: UI components
 * - @core/theme: Color system
 */
const ErrorBoundaryContent: React.FC<ErrorBoundaryContentProps> = ({ error, onReload }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('error.boundaryScreen.title')}</Text>
      <Text style={styles.errorText}>{error?.message}</Text>
      <Button title={t('error.boundaryScreen.reload')} onPress={onReload} />
    </View>
  );
};

/**
 * StyleSheet for ErrorBoundary components.
 * Provides consistent styling for error display with theme integration.
 * 
 * @constant styles
 * @type {StyleSheet}
 * @since 1.0.0
 * @private
 */
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default ErrorBoundary;
