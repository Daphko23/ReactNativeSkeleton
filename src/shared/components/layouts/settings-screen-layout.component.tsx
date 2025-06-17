/**
 * @fileoverview SETTINGS-SCREEN-LAYOUT-COMPONENT: Enterprise Settings Layout
 * @description Generic layout component providing consistent structure for all settings screens
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Layouts
 * @namespace Shared.Components.Layouts.SettingsScreenLayout
 * @category Components
 * @subcategory Layouts
 */

import React from 'react';
import { ScrollView, View, RefreshControlProps } from 'react-native';
import { SafeAreaView } from 'react-native';
import { ActivityIndicator, Text, Button, Card } from 'react-native-paper';

import { LoadingOverlay } from '../ui/loading-overlay.component';

/**
 * Interface for settings section configuration.
 * Defines the structure for individual settings sections.
 * 
 * @interface SettingsSection
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory Settings
 * 
 * @example
 * ```tsx
 * const profileSection: SettingsSection = {
 *   id: 'profile',
 *   component: <ProfileSettings />
 * };
 * ```
 */
export interface SettingsSection {
  /**
   * Unique identifier for the settings section.
   * Used as React key and for testing purposes.
   * 
   * @type {string}
   * @required
   * @example "profile-settings"
   */
  id: string;

  /**
   * React component to render for this section.
   * Should be a fully configured settings component.
   * 
   * @type {React.ReactElement}
   * @required
   * @example <ProfileSettingsForm />
   */
  component: React.ReactElement;
}

/**
 * Interface for action button configuration.
 * Defines the structure for bottom action buttons.
 * 
 * @interface SettingsActionButton
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory Settings
 * 
 * @example
 * ```tsx
 * const saveButton: SettingsActionButton = {
 *   id: 'save',
 *   label: 'Save Changes',
 *   mode: 'contained',
 *   onPress: () => saveSettings()
 * };
 * ```
 */
export interface SettingsActionButton {
  /**
   * Unique identifier for the button.
   * Used as React key and for testing.
   * 
   * @type {string}
   * @required
   * @example "save-button"
   */
  id: string;

  /**
   * Display text for the button.
   * Should be localized and descriptive.
   * 
   * @type {string}
   * @required
   * @example "Save Settings"
   */
  label: string;

  /**
   * Visual style mode for the button.
   * Material Design button variants.
   * 
   * @type {'contained' | 'outlined'}
   * @optional
   * @default 'contained'
   * @example 'outlined'
   */
  mode?: 'contained' | 'outlined';

  /**
   * Disables button interaction.
   * Useful for validation states.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  disabled?: boolean;

  /**
   * Shows loading spinner in button.
   * Indicates ongoing action.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  loading?: boolean;

  /**
   * Callback function executed when button is pressed.
   * Should handle the intended action.
   * 
   * @type {() => void}
   * @required
   * @example () => handleSaveSettings()
   */
  onPress: () => void;

  /**
   * Test identifier for automated testing.
   * 
   * @type {string}
   * @optional
   * @example "save-settings-button"
   */
  testID?: string;
}

/**
 * Props interface for the SettingsScreenLayout component.
 * Comprehensive configuration for settings screen layout.
 * 
 * @interface SettingsScreenLayoutProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Components
 * 
 * @example
 * ```tsx
 * const layoutProps: SettingsScreenLayoutProps = {
 *   sections: [profileSection, securitySection],
 *   actionButtons: [saveButton, cancelButton],
 *   showActionButtons: true,
 *   isLoading: false
 * };
 * ```
 */
export interface SettingsScreenLayoutProps {
  /**
   * Array of settings sections to render.
   * Defines the main content of the settings screen.
   * 
   * @type {SettingsSection[]}
   * @required
   * @example [{ id: 'profile', component: <ProfileSettings /> }]
   */
  sections: SettingsSection[];
  
  /**
   * Indicates initial loading state.
   * Shows full-screen loading indicator.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  isLoading?: boolean;

  /**
   * Indicates updating/saving state.
   * Shows overlay loading indicator.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  isUpdating?: boolean;

  /**
   * Custom loading message to display.
   * Provides context about the loading state.
   * 
   * @type {string}
   * @optional
   * @example "Saving your preferences..."
   */
  loadingMessage?: string;
  
  /**
   * Error message to display at the top.
   * Shows in a styled error card.
   * 
   * @type {string | null}
   * @optional
   * @example "Failed to save settings. Please try again."
   */
  error?: string | null;
  
  /**
   * Array of action buttons for the bottom bar.
   * Typically save, cancel, or other actions.
   * 
   * @type {SettingsActionButton[]}
   * @optional
   * @default []
   * @example [saveButton, resetButton]
   */
  actionButtons?: SettingsActionButton[];

  /**
   * Controls visibility of the action buttons bar.
   * When true, shows bottom action bar.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  showActionButtons?: boolean;
  
  /**
   * Custom refresh control component.
   * Enables pull-to-refresh functionality.
   * 
   * @type {React.ReactElement<RefreshControlProps>}
   * @optional
   * @example <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
   */
  refreshControl?: React.ReactElement<RefreshControlProps>;
  
  /**
   * Theme object for consistent styling.
   * Automatically provided by theme provider.
   * 
   * @type {any}
   * @optional
   * @example themeObject
   */
  theme?: any;

  /**
   * Translation function for internationalization.
   * Provides localized strings.
   * 
   * @type {(key: string, options?: any) => string}
   * @optional
   * @example (key) => i18n.t(key)
   */
  t?: (key: string, options?: any) => string;
  
  /**
   * Test identifier for the main container.
   * 
   * @type {string}
   * @optional
   * @example "settings-screen-layout"
   */
  testID?: string;

  /**
   * Test identifier for the scroll view.
   * 
   * @type {string}
   * @optional
   * @example "settings-scroll-view"
   */
  scrollViewTestID?: string;
  
  /**
   * Custom styling for the main container.
   * 
   * @type {any}
   * @optional
   * @example { backgroundColor: '#f0f0f0' }
   */
  style?: any;
}

/**
 * Settings Screen Layout Component
 * 
 * A comprehensive layout component that provides consistent structure and behavior
 * for all settings screens in the application. Features section-based organization,
 * loading states, error handling, and action buttons with enterprise-grade UX patterns.
 * 
 * @component
 * @function SettingsScreenLayout
 * @param {SettingsScreenLayoutProps} props - The component props
 * @returns {React.ReactElement} Rendered settings screen layout
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Layouts
 * @module Shared.Components.Layouts
 * @namespace Shared.Components.Layouts.SettingsScreenLayout
 * 
 * @example
 * Basic settings screen:
 * ```tsx
 * import { SettingsScreenLayout } from '@/shared/components/layouts';
 * 
 * const UserSettingsScreen = () => {
 *   const [isLoading, setIsLoading] = useState(false);
 *   const [error, setError] = useState(null);
 * 
 *   const sections = [
 *     {
 *       id: 'profile',
 *       component: <ProfileSettingsSection />
 *     },
 *     {
 *       id: 'privacy',
 *       component: <PrivacySettingsSection />
 *     }
 *   ];
 * 
 *   const actionButtons = [
 *     {
 *       id: 'save',
 *       label: 'Save Changes',
 *       mode: 'contained',
 *       onPress: handleSave
 *     },
 *     {
 *       id: 'reset',
 *       label: 'Reset',
 *       mode: 'outlined',
 *       onPress: handleReset
 *     }
 *   ];
 * 
 *   return (
 *     <SettingsScreenLayout
 *       sections={sections}
 *       actionButtons={actionButtons}
 *       showActionButtons={true}
 *       isLoading={isLoading}
 *       error={error}
 *       testID="user-settings-screen"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Settings screen with refresh control:
 * ```tsx
 * const SyncSettingsScreen = () => {
 *   const [refreshing, setRefreshing] = useState(false);
 *   const [isUpdating, setIsUpdating] = useState(false);
 * 
 *   const onRefresh = async () => {
 *     setRefreshing(true);
 *     try {
 *       await refreshSettings();
 *     } finally {
 *       setRefreshing(false);
 *     }
 *   };
 * 
 *   const refreshControl = (
 *     <RefreshControl
 *       refreshing={refreshing}
 *       onRefresh={onRefresh}
 *       colors={[theme.colors.primary]}
 *     />
 *   );
 * 
 *   return (
 *     <SettingsScreenLayout
 *       sections={syncSections}
 *       refreshControl={refreshControl}
 *       isUpdating={isUpdating}
 *       loadingMessage="Syncing settings..."
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Complex settings with conditional actions:
 * ```tsx
 * const AdvancedSettingsScreen = () => {
 *   const [hasChanges, setHasChanges] = useState(false);
 *   const [isValid, setIsValid] = useState(true);
 *   const [saving, setSaving] = useState(false);
 * 
 *   const actionButtons = [
 *     {
 *       id: 'discard',
 *       label: 'Discard Changes',
 *       mode: 'outlined',
 *       disabled: !hasChanges,
 *       onPress: handleDiscard
 *     },
 *     {
 *       id: 'save',
 *       label: 'Save Settings',
 *       mode: 'contained',
 *       disabled: !hasChanges || !isValid,
 *       loading: saving,
 *       onPress: handleSave
 *     }
 *   ];
 * 
 *   return (
 *     <SettingsScreenLayout
 *       sections={advancedSections}
 *       actionButtons={actionButtons}
 *       showActionButtons={hasChanges}
 *       error={validationError}
 *       theme={theme}
 *       t={t}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Settings screen with error handling:
 * ```tsx
 * const NetworkSettingsScreen = () => {
 *   const [error, setError] = useState(null);
 *   const [retryCount, setRetryCount] = useState(0);
 * 
 *   const handleRetry = () => {
 *     setError(null);
 *     setRetryCount(prev => prev + 1);
 *     loadNetworkSettings();
 *   };
 * 
 *   const errorMessage = error 
 *     ? `Connection failed. Retry attempt ${retryCount}/3`
 *     : null;
 * 
 *   const retryButton = error ? [{
 *     id: 'retry',
 *     label: 'Retry Connection',
 *     mode: 'contained',
 *     onPress: handleRetry
 *   }] : [];
 * 
 *   return (
 *     <SettingsScreenLayout
 *       sections={networkSections}
 *       error={errorMessage}
 *       actionButtons={retryButton}
 *       showActionButtons={!!error}
 *     />
 *   );
 * };
 * ```
 * 
 * @features
 * - Section-based content organization
 * - Multiple loading states (initial, updating)
 * - Error display with styled cards
 * - Bottom action button bar
 * - Pull-to-refresh support
 * - Theme integration
 * - Internationalization support
 * - Safe area handling
 * - Accessibility compliance
 * - Test-friendly structure
 * - Memory efficient rendering
 * 
 * @architecture
 * - Safe area view integration
 * - Scroll view with content sections
 * - Conditional rendering patterns
 * - Memoized styling for performance
 * - Fragment-based section rendering
 * - Overlay loading pattern
 * - Floating action button bar
 * 
 * @styling
 * - Theme-aware color schemes
 * - Material Design principles
 * - Consistent spacing system
 * - Elevation and shadows
 * - Error state styling
 * - Loading state indicators
 * - Responsive layout
 * - Safe area padding
 * 
 * @accessibility
 * - Screen reader compatible
 * - Proper semantic structure
 * - Touch target optimization
 * - Focus management
 * - High contrast support
 * - Loading state announcements
 * - Error state descriptions
 * 
 * @performance
 * - Memoized style calculations
 * - Efficient section rendering
 * - Optimized scroll performance
 * - Memory leak prevention
 * - Conditional component mounting
 * - Lazy loading support
 * 
 * @use_cases
 * - User profile settings
 * - Application preferences
 * - Account configuration
 * - Privacy settings
 * - Notification preferences
 * - Theme customization
 * - Advanced configuration
 * - Administrative panels
 * 
 * @best_practices
 * - Organize related settings into sections
 * - Provide clear loading feedback
 * - Handle errors gracefully
 * - Use descriptive action button labels
 * - Implement proper validation
 * - Consider offline scenarios
 * - Test with various content sizes
 * - Ensure proper accessibility
 * 
 * @dependencies
 * - react: Core React library
 * - react-native: ScrollView, View, RefreshControlProps
 * - react-native: SafeAreaView (native implementation)
 * - react-native-paper: Material Design components
 * - ../ui/loading-overlay.component: Loading state component
 * 
 * @see {@link LoadingOverlay} for loading state handling
 * @see {@link SettingsSection} for section configuration
 * @see {@link SettingsActionButton} for action button setup
 * 
 * @todo Add section collapsible support
 * @todo Implement settings search functionality
 * @todo Add bulk action support
 * @todo Include settings export/import
 */
export const SettingsScreenLayout: React.FC<SettingsScreenLayoutProps> = ({
  sections,
  isLoading = false,
  isUpdating = false,
  loadingMessage,
  error,
  actionButtons = [],
  showActionButtons = false,
  refreshControl,
  theme,
  t = (key: string) => key,
  testID,
  scrollViewTestID,
  style
}) => {
  const styles = React.useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.background || '#f5f5f5',
    },
    loadingContainer: {
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme?.colors?.onSurface || '#000',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: showActionButtons ? 100 : 16,
    },
    errorCard: {
      backgroundColor: theme?.colors?.errorContainer || '#ffebee',
      borderColor: theme?.colors?.error || '#f44336',
      borderWidth: 1,
      marginBottom: 16,
    },
    errorTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme?.colors?.error || '#f44336',
      marginBottom: 8,
    },
    errorDescription: {
      fontSize: 14,
      color: theme?.colors?.onErrorContainer || '#d32f2f',
      lineHeight: 20,
    },
    actionButtons: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      padding: 16,
      backgroundColor: theme?.colors?.surface || '#ffffff',
      borderTopWidth: 1,
      borderTopColor: theme?.colors?.outline || '#e0e0e0',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    actionButton: {
      flex: 1,
      marginHorizontal: 8,
    },
  }), [theme, showActionButtons]);

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView 
        style={[styles.container, styles.loadingContainer]}
        testID={`${testID}-loading`}
      >
        <ActivityIndicator size="large" color={theme?.colors?.primary} />
        <Text style={styles.loadingText}>
          {loadingMessage || t('common.loading', { defaultValue: 'Lädt...' })}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.container, style]}
      testID={testID}
    >
      <LoadingOverlay 
        visible={isUpdating}
        message={loadingMessage || t('common.loading', { defaultValue: 'Lädt...' })}
      />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        testID={scrollViewTestID}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {/* Error Display */}
        {error && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorTitle}>
                {t('errors.title', { defaultValue: 'Fehler' })}
              </Text>
              <Text style={styles.errorDescription}>{error}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Render all sections */}
        {sections.map((section) => (
          <React.Fragment key={section.id}>
            {section.component}
          </React.Fragment>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      {showActionButtons && actionButtons.length > 0 && (
        <View style={styles.actionButtons}>
          {actionButtons.map((button) => (
            <Button
              key={button.id}
              mode={button.mode || 'contained'}
              onPress={button.onPress}
              disabled={button.disabled}
              loading={button.loading}
              style={styles.actionButton}
              contentStyle={{ height: 48 }}
              testID={button.testID}
            >
              {button.label}
            </Button>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

SettingsScreenLayout.displayName = 'SettingsScreenLayout'; 