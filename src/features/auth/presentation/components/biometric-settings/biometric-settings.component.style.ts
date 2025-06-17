/**
 * @fileoverview STYLES-001: Biometric Settings Component Styles
 * @description StyleSheet definitions for BiometricSettings component with central theme integration
 * 
 * @businessRule BR-950: Separated style definitions for better maintainability
 * @businessRule BR-951: Consistent styling patterns across auth components
 * @businessRule BR-952: Responsive design principles for different screen sizes
 * @businessRule BR-989: Central theme integration for consistent design language
 * 
 * @performance Optimized StyleSheet for React Native performance
 * @performance Static style definitions for minimal re-renders
 * 
 * @accessibility High contrast support and accessibility-friendly spacing
 * @accessibility Touch target sizes following platform guidelines
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module BiometricSettingsStyles
 * @namespace Auth.Presentation.Components.BiometricSettings
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@core/theme';

/**
 * @const biometricSettingsStyles
 * @description StyleSheet for BiometricSettings component with central theme integration
 * 
 * Provides comprehensive styling for:
 * - Container layouts and card design
 * - Header with title and switch arrangement
 * - Warning and info message containers
 * - Interactive elements (buttons, switches)
 * - Typography hierarchy and spacing
 * - Accessibility and responsive design
 * 
 * @example Usage
 * ```typescript
 * import { biometricSettingsStyles } from './biometric-settings.component.style';
 * 
 * <View style={biometricSettingsStyles.container}>
 *   <View style={biometricSettingsStyles.header}>
 *     // Component content
 *   </View>
 * </View>
 * ```
 */
export const biometricSettingsStyles = StyleSheet.create({
  // ==========================================
  // 🎨 CONTAINER & LAYOUT STYLES
  // ==========================================
  
  /**
   * Main container with card-like appearance
   * - Rounded corners and shadow for elevation
   * - Consistent padding and margins
   * - Background color and border radius
   */
  container: {
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.component.borderRadius,
    padding: spacing.component.padding,
    marginVertical: spacing.component.margin,
    ...spacing.shadow.small,
  },

  /**
   * Header section with title and switch
   * - Flexbox layout for proper alignment
   * - Space between title and switch control
   */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  /**
   * Title container with icon and text
   * - Icon and title text arrangement
   * - Flexible layout for text wrapping
   */
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  /**
   * Icon styling for biometric type
   * - Consistent icon size and spacing
   */
  icon: {
    fontSize: spacing.xl,
    marginRight: spacing.sm,
  },

  /**
   * Text container for title and subtitle
   * - Flexible layout for text content
   */
  titleTextContainer: {
    flex: 1,
  },

  // ==========================================
  // 📝 TYPOGRAPHY STYLES
  // ==========================================

  /**
   * Main title text styling
   * - Bold font weight for hierarchy
   * - Appropriate font size and color
   */
  title: {
    ...typography.heading.h5,
    color: colors.textPrimary,
    marginBottom: 2,
  },

  /**
   * Subtitle text for biometric type
   * - Smaller font size and muted color
   */
  subtitle: {
    ...typography.text.small,
    color: colors.textMuted,
  },

  /**
   * Description text styling
   * - Readable font size and line height
   * - Consistent color and spacing
   */
  description: {
    ...typography.text.regular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // ==========================================
  // ⚠️ WARNING & INFO CONTAINERS
  // ==========================================

  /**
   * Warning message container
   * - Yellow/orange warning theme
   * - Left border accent for emphasis
   * - Proper padding and border radius
   */
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warningLight,
    padding: spacing.sm,
    borderRadius: spacing.component.borderRadiusSmall,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warningBorder,
  },

  /**
   * Warning icon styling
   * - Consistent icon size and spacing
   */
  warningIcon: {
    fontSize: spacing.md,
    marginRight: spacing.sm,
    marginTop: 2,
  },

  /**
   * Warning text content
   * - Flexible layout and proper color
   * - Readable line height
   */
  warningText: {
    flex: 1,
    ...typography.text.small,
    color: colors.warningText,
  },

  /**
   * Info container for security information
   * - Light gray background with blue accent
   * - Consistent padding and border styling
   */
  infoContainer: {
    backgroundColor: colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: spacing.component.borderRadiusSmall,
    borderLeftWidth: 4,
    borderLeftColor: colors.infoBorder,
  },

  /**
   * Info section title
   * - Bold font weight for section headers
   */
  infoTitle: {
    ...typography.labelText.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  /**
   * Info text items (bullet points)
   * - Smaller font size for details
   * - Consistent line height and spacing
   */
  infoText: {
    ...typography.text.small,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  // ==========================================
  // 🔘 INTERACTIVE ELEMENTS
  // ==========================================

  /**
   * Actions container for buttons
   * - Proper spacing from other elements
   */
  actionsContainer: {
    marginBottom: spacing.lg,
  },

  /**
   * Test button styling
   * - Light gray background with border
   * - Proper padding for touch targets
   * - Rounded corners for modern appearance
   */
  testButton: {
    backgroundColor: colors.greyLight,
    padding: spacing.sm,
    borderRadius: spacing.component.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: spacing.touchTarget.button,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Test button text styling
   * - Centered text with proper font weight
   * - Readable color contrast
   */
  testButtonText: {
    ...typography.buttonText.medium,
    color: colors.textSecondary,
  },

  // ==========================================
  // 🚫 UNAVAILABLE STATE STYLES
  // ==========================================

  /**
   * Container for unavailable state
   * - Centered content layout
   * - Proper padding for visual balance
   */
  unavailableContainer: {
    alignItems: 'center',
    padding: spacing.component.padding,
  },

  /**
   * Large icon for unavailable state
   * - Bigger size for visual emphasis
   */
  unavailableIcon: {
    fontSize: spacing.xxxl,
    marginBottom: spacing.md,
  },

  /**
   * Title for unavailable state
   * - Bold font weight for importance
   * - Proper color and spacing
   */
  unavailableTitle: {
    ...typography.heading.h5,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  /**
   * Description text for unavailable state
   * - Centered text with proper line height
   * - Muted color for secondary information
   */
  unavailableText: {
    ...typography.text.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

/**
 * @export default biometricSettingsStyles
 * @description Default export for easier importing
 */
export default biometricSettingsStyles; 