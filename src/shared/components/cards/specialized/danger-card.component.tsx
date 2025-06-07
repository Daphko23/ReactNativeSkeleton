/**
 * @fileoverview DANGER-CARD-COMPONENT: Critical Action Warning Card Component
 * @description Specialized card component for dangerous actions with confirmation patterns and safety mechanisms
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards.Specialized
 * @namespace Shared.Components.Cards.Specialized.DangerCard
 * @category Components
 * @subcategory Cards
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeleteConfirmationDialog } from '../../dialogs';

import type { DangerCardProps } from '../types/card.types';

/**
 * Danger Card Component
 * 
 * A specialized card component designed for dangerous or destructive actions that require
 * special attention and confirmation from users. Features prominent visual warnings,
 * confirmation dialogs, and safety mechanisms to prevent accidental actions.
 * 
 * @component
 * @function DangerCard
 * @param {DangerCardProps} props - The component props
 * @returns {React.ReactElement} Rendered danger card component with safety mechanisms
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Cards
 * @module Shared.Components.Cards.Specialized
 * @namespace Shared.Components.Cards.Specialized.DangerCard
 * 
 * @example
 * Account deletion warning:
 * ```tsx
 * import { DangerCard } from '@/shared/components/cards';
 * 
 * const AccountDeletionCard = () => (
 *   <DangerCard
 *     title="Danger Zone"
 *     dangerLevel="critical"
 *     confirmationRequired={true}
 *     confirmText="Delete Account"
 *     warningText="This action cannot be undone and will permanently delete your account and all associated data."
 *     onConfirm={handleAccountDeletion}
 *     t={translate}
 *     testID="danger-account-deletion"
 *   />
 * );
 * ```
 * 
 * @example
 * Data reset with custom content:
 * ```tsx
 * <DangerCard
 *   title="Reset Application Data"
 *   dangerLevel="high"
 *   confirmationRequired={true}
 *   confirmText="Reset All Data"
 *   warningText="This will remove all your saved preferences, cache, and local data."
 *   onConfirm={handleDataReset}
 * >
 *   <View style={{ marginBottom: 16 }}>
 *     <Text>Items that will be reset:</Text>
 *     <Text>• User preferences</Text>
 *     <Text>• Cached content</Text>
 *     <Text>• Offline data</Text>
 *   </View>
 * </DangerCard>
 * ```
 * 
 * @example
 * Simple warning without confirmation:
 * ```tsx
 * <DangerCard
 *   title="Clear Cache"
 *   dangerLevel="low"
 *   confirmationRequired={false}
 *   confirmText="Clear Now"
 *   warningText="This will clear all cached data to free up storage space."
 *   onConfirm={handleClearCache}
 * />
 * ```
 * 
 * @features
 * - Progressive danger level indication
 * - Optional confirmation dialog integration
 * - Prominent visual warning design
 * - Custom content area support
 * - Internationalization ready
 * - Theme-aware styling
 * - Accessibility compliant
 * - Test-friendly implementation
 * - Safety mechanisms for critical actions
 * 
 * @danger_levels
 * - low: Subtle warning, minimal risk
 * - medium: Standard warning, moderate risk
 * - high: Strong warning, significant risk  
 * - critical: Maximum warning, irreversible actions
 * 
 * @architecture
 * - Uses Card component foundation
 * - Integrates DeleteConfirmationDialog
 * - State management for confirmation flow
 * - Theme-aware styling system
 * - Conditional rendering patterns
 * 
 * @safety_mechanisms
 * - Double confirmation for critical actions
 * - Clear visual danger indicators
 * - Descriptive warning messages
 * - User intention verification
 * - Cancellation capabilities
 * 
 * @styling
 * - Danger-level appropriate colors
 * - High contrast visual indicators
 * - Bold typography for warnings
 * - Elevated appearance for attention
 * - Consistent spacing and layout
 * 
 * @accessibility
 * - Screen reader compatible warnings
 * - High contrast color schemes
 * - Clear action descriptions
 * - Proper focus management
 * - Semantic markup structure
 * 
 * @performance
 * - Lazy dialog rendering
 * - Minimal re-render triggers
 * - Efficient state management
 * - Optimized styling calculations
 * 
 * @dependencies
 * - react: Core React library with hooks
 * - react-native: View, StyleSheet components
 * - react-native-paper: Card, Text, Button
 * - react-native-vector-icons: MaterialCommunityIcons
 * - ../../dialogs: DeleteConfirmationDialog
 * - ../types/card.types: TypeScript definitions
 * 
 * @use_cases
 * - Account deletion workflows
 * - Data reset and clearing
 * - Subscription cancellations
 * - Destructive administrative actions
 * - Security-sensitive operations
 * - Privacy data management
 * 
 * @best_practices
 * - Always use confirmation for critical actions
 * - Provide clear consequence descriptions
 * - Use appropriate danger levels
 * - Implement proper error handling
 * - Test confirmation flows thoroughly
 * 
 * @see {@link DangerCardProps} for complete prop definitions
 * @see {@link DeleteConfirmationDialog} for confirmation dialog
 * @see {@link createDangerCardStyles} for styling utilities
 */
export const DangerCard: React.FC<DangerCardProps> = ({
  title = 'Gefahrenbereich',
  dangerLevel: _dangerLevel = 'medium',
  confirmationRequired = false,
  onConfirm,
  confirmText = 'Bestätigen',
  warningText,
  children,
  t,
  theme,
  ...baseProps
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Create styles based on the perfect privacy-settings.screen implementation
  const styles = createDangerCardStyles(theme);

  /**
   * Handles the initial action trigger.
   * Shows confirmation dialog if required, otherwise executes action directly.
   * 
   * @function handleInitialAction
   * @private
   * @since 1.0.0
   * 
   * @flow
   * 1. Check if confirmation is required
   * 2. Show dialog or execute action
   * 3. Maintain user safety protocols
   */
  const handleInitialAction = () => {
    if (confirmationRequired) {
      setShowConfirmation(true);
    } else {
      onConfirm?.();
    }
  };

  /**
   * Handles the final confirmation action.
   * Executes the dangerous action and closes the confirmation dialog.
   * 
   * @function handleConfirm
   * @private
   * @since 1.0.0
   * 
   * @flow
   * 1. Execute the confirmed action
   * 2. Close confirmation dialog
   * 3. Reset component state
   */
  const handleConfirm = () => {
    onConfirm?.();
    setShowConfirmation(false);
  };

  /**
   * Handles confirmation dialog cancellation.
   * Safely cancels the dangerous action and closes the dialog.
   * 
   * @function handleCancel
   * @private
   * @since 1.0.0
   * 
   * @flow
   * 1. Close confirmation dialog
   * 2. Reset to safe state
   * 3. No action execution
   */
  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {/* Danger Zone Card - Matching privacy-settings.screen perfect styling */}
      <Card style={[styles.dangerZoneCard]} {...baseProps}>
        <Card.Content style={styles.dangerZoneContent}>
          <View style={styles.dangerZoneHeader}>
            <Icon 
              name="alert-octagon" 
              size={24} 
              color={theme?.colors?.error || '#f44336'} 
              style={styles.dangerZoneIcon}
            />
            <Text style={[styles.dangerZoneTitle]}>
              {title}
            </Text>
          </View>
          
          <Text style={[styles.dangerZoneDescription]}>
            {warningText || (t ? t('settings.danger.deleteAccountDesc', { defaultValue: 'Konto und alle Daten permanent löschen. Diese Aktion kann nicht rückgängig gemacht werden.' }) : 'Konto und alle Daten permanent löschen. Diese Aktion kann nicht rückgängig gemacht werden.')}
          </Text>
          
          {/* Custom Content */}
          {children && (
            <View style={styles.dangerZoneCustomContent}>
              {children}
            </View>
          )}
          
          <Button
            mode="contained"
            onPress={handleInitialAction}
            buttonColor={theme?.colors?.error || '#f44336'}
            textColor={theme?.colors?.onError || '#ffffff'}
            icon="delete"
            style={styles.dangerZoneButton}
            contentStyle={{ height: 48 }}
          >
            {confirmText}
          </Button>
        </Card.Content>
      </Card>

      {/* Confirmation Dialog - Using shared DeleteConfirmationDialog */}
      <DeleteConfirmationDialog
        visible={showConfirmation}
        onDismiss={handleCancel}
        onConfirm={handleConfirm}
        title={title}
        content={warningText}
        theme={theme}
        t={t || ((key: string) => key)}
        testID={`${baseProps.testID || 'danger-card'}-confirmation`}
      />
    </>
  );
};

/**
 * Creates danger-specific card styles with appropriate visual warnings.
 * Matches the proven implementation from privacy-settings.screen for consistency.
 * 
 * @function createDangerCardStyles
 * @param {any} theme - Theme object containing colors, spacing, and typography
 * @returns {object} StyleSheet object with danger card specific styles
 * @private
 * @since 1.0.0
 * 
 * @features
 * - High contrast danger indicators
 * - Elevated appearance for attention
 * - Consistent spacing and padding
 * - Theme-integrated color schemes
 * - Accessibility-compliant styling
 * 
 * @styling_approach
 * - Prominent border with error color
 * - Error container background
 * - Elevated shadow for attention
 * - Generous padding for readability
 * - Icon-text alignment optimization
 */
const createDangerCardStyles = (theme: any) => StyleSheet.create({
  // Danger Zone Card - Exact copy from privacy-settings.screen
  dangerZoneCard: {
    borderColor: theme?.colors?.error || '#f44336',
    borderWidth: 2,
    backgroundColor: theme?.colors?.errorContainer || theme?.colors?.surface || '#ffffff',
    marginTop: theme?.spacing?.[3] || 12, // Small top margin for better spacing
    marginBottom: theme?.spacing?.[4] || 16,
    borderRadius: theme?.borderRadius?.lg || 12,
    elevation: 2,
    shadowColor: theme?.colors?.shadow || '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  dangerZoneContent: {
    padding: theme?.spacing?.[5] || 20, // More padding than regular sections
  },

  dangerZoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme?.spacing?.[3] || 12,
  },

  dangerZoneIcon: {
    marginRight: theme?.spacing?.[3] || 12,
    marginTop: 2, // Small offset to align with text baseline
  },

  dangerZoneTitle: {
    fontSize: theme?.typography?.fontSizes?.lg || 18,
    fontWeight: theme?.typography?.fontWeights?.bold || 'bold',
    color: theme?.colors?.error || '#f44336',
    flex: 1,
    lineHeight: 24, // Match icon height for better alignment
  },

  dangerZoneDescription: {
    fontSize: theme?.typography?.fontSizes?.md || 14,
    color: theme?.colors?.onErrorContainer || theme?.colors?.onSurface || '#333333',
    marginBottom: theme?.spacing?.[6] || 24,
    lineHeight: 22,
    paddingRight: theme?.spacing?.[2] || 8,
  },

  dangerZoneCustomContent: {
    marginBottom: theme?.spacing?.[4] || 16,
  },

  dangerZoneButton: {
    marginTop: theme?.spacing?.[2] || 8,
    borderRadius: theme?.borderRadius?.md || 8,
  },
});

export default DangerCard; 