/**
 * @fileoverview LOADING-OVERLAY-COMPONENT: Reusable Loading State Component
 * @description Provides consistent loading states with optional backdrop and portal rendering
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.UI
 * @namespace Shared.Components.UI.LoadingOverlay
 * @category Components
 * @subcategory UI
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, Portal } from 'react-native-paper';
import { useTheme } from '@core/theme/theme.system';

/**
 * Props interface for the LoadingOverlay component.
 * Provides comprehensive configuration for loading state display.
 * 
 * @interface LoadingOverlayProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * Basic loading overlay:
 * ```tsx
 * const loadingProps: LoadingOverlayProps = {
 *   visible: isLoading,
 *   message: 'Loading data...',
 *   overlay: true,
 *   size: 'large'
 * };
 * ```
 */
interface LoadingOverlayProps {
  /**
   * Controls visibility of the loading overlay.
   * When false, component returns null.
   * 
   * @type {boolean}
   * @required
   * @example true
   */
  visible: boolean;

  /**
   * Optional message to display below the loading indicator.
   * Provides context about what is being loaded.
   * 
   * @type {string}
   * @optional
   * @example "Loading user data..."
   */
  message?: string;

  /**
   * Enables full-screen overlay mode with backdrop.
   * When true, renders in Portal with semi-transparent background.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  overlay?: boolean;

  /**
   * Size of the activity indicator.
   * Determines the visual prominence of the loading state.
   * 
   * @type {'small' | 'large'}
   * @optional
   * @default 'large'
   * @example 'small'
   */
  size?: 'small' | 'large';

  /**
   * Custom styling for the container.
   * Merged with default styles.
   * 
   * @type {any}
   * @optional
   * @example { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
   */
  style?: any;

  /**
   * Test identifier for automated testing.
   * Applied to the ActivityIndicator component.
   * 
   * @type {string}
   * @optional
   * @example "loading-overlay"
   */
  testID?: string;
}

/**
 * Creates dynamic styles based on the current theme.
 * Ensures consistent theming across different theme modes.
 * 
 * @function createStyles
 * @param {any} theme - Current theme object
 * @returns {StyleSheet} Themed styles object
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * const styles = createStyles(theme);
 * ```
 */
const createStyles = (theme: any) => StyleSheet.create({
  /**
   * Base container styling for inline loading states.
   * 
   * @style container
   * @layout center-aligned with padding
   * @spacing theme spacing level 8
   */
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[8],
  },

  /**
   * Full-screen overlay styling with backdrop.
   * 
   * @style overlay
   * @layout absolute positioning covering entire screen
   * @colors semi-transparent black background
   * @zIndex 1000 for top-level rendering
   */
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },

  /**
   * Loading message text styling.
   * 
   * @style loadingText
   * @typography base font size from theme
   * @colors theme text color
   * @spacing top margin for separation from indicator
   * @layout center-aligned text
   */
  loadingText: {
    marginTop: theme.spacing[4],
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text,
    textAlign: 'center',
  },

  /**
   * Overlay-specific text styling.
   * White text for visibility on dark backdrop.
   * 
   * @style overlayText
   * @colors white text for contrast
   */
  overlayText: {
    color: '#FFFFFF',
  },
});

/**
 * Loading Overlay Component
 * 
 * A versatile loading state component that provides consistent loading indicators
 * throughout the application. Supports both inline and full-screen overlay modes
 * with optional loading messages and theme integration.
 * 
 * @component
 * @function LoadingOverlay
 * @param {LoadingOverlayProps} props - The component props
 * @returns {React.ReactElement | null} Rendered loading overlay or null if not visible
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory UI
 * @module Shared.Components.UI
 * @namespace Shared.Components.UI.LoadingOverlay
 * 
 * @example
 * Basic inline loading state:
 * ```tsx
 * import { LoadingOverlay } from '@/shared/components/ui';
 * 
 * const DataList = () => {
 *   const [isLoading, setIsLoading] = useState(false);
 *   const [data, setData] = useState([]);
 * 
 *   const loadData = async () => {
 *     setIsLoading(true);
 *     try {
 *       const result = await fetchData();
 *       setData(result);
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 * 
 *   return (
 *     <View style={styles.container}>
 *       {isLoading ? (
 *         <LoadingOverlay
 *           visible={true}
 *           message="Loading data..."
 *           size="large"
 *         />
 *       ) : (
 *         <FlatList data={data} ... />
 *       )}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Full-screen overlay for global loading:
 * ```tsx
 * const App = () => {
 *   const [isGlobalLoading, setIsGlobalLoading] = useState(false);
 * 
 *   const performGlobalAction = async () => {
 *     setIsGlobalLoading(true);
 *     try {
 *       await syncData();
 *       await updateSettings();
 *     } finally {
 *       setIsGlobalLoading(false);
 *     }
 *   };
 * 
 *   return (
 *     <View style={styles.app}>
 *       <NavigationContainer>
 *         <AppNavigator />
 *       </NavigationContainer>
 *       
 *       <LoadingOverlay
 *         visible={isGlobalLoading}
 *         overlay={true}
 *         message="Syncing data..."
 *         size="large"
 *         testID="global-loading"
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Conditional loading with different states:
 * ```tsx
 * const UserProfile = () => {
 *   const [loadingState, setLoadingState] = useState({
 *     profile: false,
 *     avatar: false,
 *     preferences: false
 *   });
 * 
 *   const getLoadingMessage = () => {
 *     if (loadingState.profile) return 'Loading profile...';
 *     if (loadingState.avatar) return 'Uploading avatar...';
 *     if (loadingState.preferences) return 'Saving preferences...';
 *     return '';
 *   };
 * 
 *   const isAnyLoading = Object.values(loadingState).some(Boolean);
 * 
 *   return (
 *     <View style={styles.profile}>
 *       <ProfileForm />
 *       <AvatarUpload />
 *       <PreferencesPanel />
 * 
 *       <LoadingOverlay
 *         visible={isAnyLoading}
 *         overlay={true}
 *         message={getLoadingMessage()}
 *         size="large"
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Custom styled loading overlay:
 * ```tsx
 * const CustomLoadingScreen = () => {
 *   const [isLoading, setIsLoading] = useState(true);
 * 
 *   return (
 *     <View style={styles.screen}>
 *       <LoadingOverlay
 *         visible={isLoading}
 *         overlay={true}
 *         message="Initializing application..."
 *         size="large"
 *         style={{
 *           backgroundColor: 'rgba(255, 255, 255, 0.95)',
 *         }}
 *         testID="app-initialization"
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Inline and overlay rendering modes
 * - Portal integration for global overlays
 * - Theme system integration
 * - Customizable loading messages
 * - Multiple indicator sizes
 * - Conditional rendering
 * - Custom styling support
 * - Test identifier support
 * - Memory optimization with React.memo
 * - Accessibility friendly
 * 
 * @architecture
 * - React.memo for performance optimization
 * - Portal rendering for overlays
 * - Theme hook integration
 * - Dynamic style generation
 * - Conditional rendering patterns
 * - Props-based configuration
 * 
 * @styling
 * - Theme-aware colors and spacing
 * - Flexible container layouts
 * - Semi-transparent overlay backgrounds
 * - Proper z-index management
 * - Responsive text styling
 * - High contrast overlay text
 * 
 * @accessibility
 * - Screen reader compatible
 * - Proper loading announcements
 * - High contrast colors
 * - Clear loading messages
 * - Touch target considerations
 * 
 * @performance
 * - React.memo optimization
 * - Early return for invisible state
 * - Efficient style creation
 * - Portal rendering optimization
 * - Minimal re-render impact
 * 
 * @use_cases
 * - Data fetching states
 * - Form submission loading
 * - File upload progress
 * - Authentication flows
 * - App initialization
 * - Background sync operations
 * - Image loading states
 * - API request handling
 * 
 * @best_practices
 * - Use overlay mode sparingly
 * - Provide meaningful loading messages
 * - Consider loading timeouts
 * - Test with slow networks
 * - Ensure proper cleanup
 * - Handle loading errors
 * - Use appropriate indicator sizes
 * - Consider skeleton screens for content
 * 
 * @dependencies
 * - react: Core React library and memo
 * - react-native: View and StyleSheet
 * - react-native-paper: ActivityIndicator, Text, Portal
 * - @core/theme/theme.system: Theme hook
 * 
 * @see {@link useTheme} for theme system integration
 * @see {@link Portal} for overlay rendering
 * 
 * @todo Add progress percentage support
 * @todo Implement loading timeout handling
 * @todo Add skeleton loading variants
 * @todo Include loading analytics
 */
export const LoadingOverlay = memo<LoadingOverlayProps>(({
  visible,
  message,
  overlay = false,
  size = 'large',
  style,
  testID
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!visible) {
    return null;
  }

  const content = (
    <View style={[
      overlay ? styles.overlay : styles.container,
      style
    ]}>
      <ActivityIndicator 
        size={size} 
        color={overlay ? '#FFFFFF' : theme.colors.primary}
        testID={testID}
      />
      {message && (
        <Text style={[
          styles.loadingText,
          overlay && styles.overlayText
        ]}>
          {message}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <Portal>
        {content}
      </Portal>
    );
  }

  return content;
});

LoadingOverlay.displayName = 'LoadingOverlay'; 