/**
 * @fileoverview STYLES-003: Password Strength Indicator Component Styles
 * @description StyleSheet definitions for PasswordStrengthIndicator component with central theme integration
 * 
 * @businessRule BR-970: Separated style definitions for password strength components
 * @businessRule BR-971: Consistent styling patterns across all auth components
 * @businessRule BR-972: Real-time visual feedback for password validation
 * @businessRule BR-989: Central theme integration for consistent design language
 * 
 * @performance Optimized StyleSheet for React Native performance
 * @performance Static style definitions for minimal re-renders
 * 
 * @accessibility High contrast support for password strength visualization
 * @accessibility Touch target sizes following platform guidelines
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module PasswordStrengthIndicatorStyles
 * @namespace Auth.Presentation.Components.PasswordStrengthIndicator
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../../../core/theme';

/**
 * @const passwordStrengthIndicatorStyles
 * @description StyleSheet for PasswordStrengthIndicator component with central theme integration
 * 
 * Provides comprehensive styling for:
 * - Container and strength bar visualization
 * - Dynamic color coding for password strength levels
 * - Requirements list with checkmark indicators
 * - Error messages and validation feedback
 * - Typography hierarchy and spacing
 * - Accessibility and responsive design
 * 
 * @example Usage
 * ```typescript
 * import { passwordStrengthIndicatorStyles } from './password-strength-indicator.component.style';
 * 
 * <View style={passwordStrengthIndicatorStyles.container}>
 *   <View style={passwordStrengthIndicatorStyles.strengthBarContainer}>
 *     // Component content
 *   </View>
 * </View>
 * ```
 */
export const passwordStrengthIndicatorStyles = StyleSheet.create({
  // ==========================================
  // 🎨 CONTAINER & LAYOUT STYLES
  // ==========================================
  
  /**
   * Main container for password strength indicator
   * - Proper vertical spacing between elements
   * - Consistent margins for component integration
   */
  container: {
    marginVertical: spacing.sm,
  },

  // ==========================================
  // 📊 STRENGTH BAR STYLES
  // ==========================================
  
  /**
   * Container for strength bar and text
   * - Spacing between bar and strength text
   */
  strengthBarContainer: {
    marginBottom: spacing.md,
  },

  /**
   * Background for strength progress bar
   * - Rounded corners and light gray background
   * - Fixed height for consistent appearance
   */
  strengthBarBackground: {
    height: spacing.sm,
    backgroundColor: colors.borderLight,
    borderRadius: spacing.xs,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },

  /**
   * Filled portion of strength bar
   * - Dynamic width based on password score
   * - Dynamic color based on password strength
   * - Smooth rounded corners
   */
  strengthBarFill: {
    height: '100%',
    borderRadius: spacing.xs,
  },

  /**
   * Strength text display
   * - Right-aligned for clean layout
   * - Bold font weight for emphasis
   * - Dynamic color matching strength level
   */
  strengthText: {
    ...typography.text.small,
    fontWeight: '600',
    textAlign: 'right',
  },

  // ==========================================
  // ✅ REQUIREMENTS LIST STYLES
  // ==========================================
  
  /**
   * Container for requirements section
   * - Proper spacing from strength bar
   */
  requirementsContainer: {
    marginBottom: spacing.md,
  },

  /**
   * Title for requirements section
   * - Medium font weight for section headers
   * - Consistent color and spacing
   */
  requirementsTitle: {
    ...typography.labelText.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  /**
   * Individual requirement item
   * - Horizontal layout with icon and text
   * - Proper alignment and spacing
   */
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  /**
   * Icon for requirement status
   * - Fixed width for alignment
   * - Bold font weight for visibility
   * - Dynamic color based on requirement status
   */
  requirementIcon: {
    ...typography.text.small,
    fontWeight: 'bold',
    marginRight: spacing.sm,
    width: spacing.md,
  },

  /**
   * Text for requirement description
   * - Flexible layout for text wrapping
   * - Dynamic color based on requirement status
   */
  requirementText: {
    ...typography.text.small,
    flex: 1,
  },

  // ==========================================
  // 🚨 ERROR CONTAINER STYLES
  // ==========================================
  
  /**
   * Container for validation errors
   * - Light red background for error indication
   * - Rounded corners and padding
   * - Left border accent for emphasis
   */
  errorsContainer: {
    backgroundColor: colors.errorLight,
    borderRadius: spacing.component.borderRadiusSmall,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.errorBorder,
  },

  /**
   * Individual error text item
   * - Error color for clear indication
   * - Proper spacing between errors
   */
  errorText: {
    ...typography.text.small,
    color: colors.errorText,
    marginBottom: 2,
  },
});

/**
 * @const strengthColors
 * @description Color definitions for different password strength levels
 */
export const strengthColors = {
  very_strong: colors.success,
  strong: '#84cc16', // Light Green
  medium: colors.warning,
  weak: colors.error,
  very_weak: colors.greyMedium,
};

/**
 * @const requirementColors
 * @description Color definitions for requirement status indicators
 */
export const requirementColors = {
  met: colors.success,
  notMet: colors.greyMedium,
};

/**
 * @export default passwordStrengthIndicatorStyles
 * @description Default export for easier importing
 */
export default passwordStrengthIndicatorStyles; 