/**
 * @fileoverview STYLES-002: MFA Setup Modal Component Styles
 * @description StyleSheet definitions for MFASetupModal component with central theme integration
 * 
 * @businessRule BR-960: Separated style definitions for MFA modal components
 * @businessRule BR-961: Consistent modal styling patterns
 * @businessRule BR-962: Responsive design for different MFA setup steps
 * @businessRule BR-989: Central theme integration for consistent design language
 * 
 * @performance Optimized StyleSheet for React Native modal performance
 * @performance Static style definitions for minimal re-renders
 * 
 * @accessibility Modal accessibility guidelines and touch targets
 * @accessibility High contrast support for all modal elements
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module MFASetupModalStyles
 * @namespace Auth.Presentation.Components.MFASetupModal
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@core/theme';

/**
 * @const mfaSetupModalStyles
 * @description StyleSheet for MFASetupModal component with central theme integration
 * 
 * Provides comprehensive styling for:
 * - Modal container and layout structure
 * - Header with close button
 * - Method selection cards
 * - Setup forms for different MFA methods
 * - Verification input and buttons
 * - Typography hierarchy and spacing
 * - Interactive elements and states
 * 
 * @example Usage
 * ```typescript
 * import { mfaSetupModalStyles } from './mfa-setup-modal.component.style';
 * 
 * <View style={mfaSetupModalStyles.container}>
 *   <View style={mfaSetupModalStyles.header}>
 *     // Modal content
 *   </View>
 * </View>
 * ```
 */
export const mfaSetupModalStyles = StyleSheet.create({
  // ==========================================
  // 🎨 MODAL CONTAINER & LAYOUT
  // ==========================================
  
  /**
   * Main modal container
   * - Full screen white background
   * - Flex layout for content arrangement
   */
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  /**
   * Modal header with close button
   * - Right-aligned close button
   * - Bottom border for visual separation
   * - Consistent padding
   */
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  /**
   * Close button styling
   * - Large touch target for accessibility
   * - Muted color for subtle appearance
   */
  closeButton: {
    fontSize: spacing.lg,
    color: colors.textMuted,
    padding: spacing.xs,
    minWidth: spacing.touchTarget.minimum,
    minHeight: spacing.touchTarget.minimum,
    textAlign: 'center',
  },

  /**
   * Scrollable content area
   * - Flexible layout for different content heights
   */
  scrollView: {
    flex: 1,
  },

  /**
   * Main content container
   * - Consistent padding for all content
   */
  content: {
    padding: spacing.layout.screenPadding,
  },

  // ==========================================
  // 📝 TYPOGRAPHY STYLES
  // ==========================================

  /**
   * Main title styling
   * - Large, bold font for hierarchy
   * - Dark color for readability
   */
  title: {
    ...typography.heading.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  /**
   * Subtitle for additional context
   * - Smaller font size
   * - Muted color for secondary information
   */
  subtitle: {
    ...typography.text.regular,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },

  /**
   * Instruction text styling
   * - Readable font size and line height
   * - Proper spacing between instructions
   */
  instruction: {
    ...typography.text.regular,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  // ==========================================
  // 🎯 METHOD SELECTION CARDS
  // ==========================================

  /**
   * Individual method selection card
   * - Card-like appearance with border
   * - Hover/touch feedback with light background
   * - Proper spacing between cards
   */
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: spacing.component.borderRadius,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: spacing.touchTarget.button + spacing.md,
  },

  /**
   * Method icon container
   * - Circular background for icons
   * - Consistent size and spacing
   */
  methodIcon: {
    width: spacing.xxxl,
    height: spacing.xxxl,
    borderRadius: spacing.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  /**
   * Method icon text styling
   * - Large emoji size for visual appeal
   */
  methodIconText: {
    fontSize: spacing.lg,
  },

  /**
   * Method information container
   * - Flexible layout for text content
   */
  methodInfo: {
    flex: 1,
  },

  /**
   * Method title styling
   * - Bold font weight for prominence
   * - Dark color for readability
   */
  methodTitle: {
    ...typography.text.regular,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  /**
   * Method description text
   * - Smaller font for details
   * - Muted color for secondary information
   */
  methodDescription: {
    ...typography.text.small,
    color: colors.textMuted,
  },

  /**
   * Arrow indicator for method selection
   * - Right-aligned chevron
   * - Muted color for subtle appearance
   */
  methodArrow: {
    fontSize: spacing.lg,
    color: colors.greyMedium,
    paddingLeft: spacing.sm,
  },

  // ==========================================
  // 🔧 SETUP FORMS & INPUTS
  // ==========================================

  /**
   * TOTP setup container
   * - Spacing for QR code and instructions
   */
  totpSetup: {
    marginBottom: spacing.lg,
  },

  /**
   * QR code container
   * - Centered alignment for QR code
   * - Proper spacing around QR code
   */
  qrContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },

  /**
   * QR code image styling
   * - Square dimensions for QR code
   * - Rounded corners for modern appearance
   */
  qrCode: {
    width: 200,
    height: 200,
    borderRadius: spacing.component.borderRadiusSmall,
  },

  /**
   * Secret key container
   * - Light background for emphasis
   * - Rounded corners and padding
   */
  secretContainer: {
    backgroundColor: colors.greyLight,
    padding: spacing.md,
    borderRadius: spacing.component.borderRadiusSmall,
    marginTop: spacing.md,
  },

  /**
   * Secret key label styling
   * - Bold font for label prominence
   */
  secretLabel: {
    ...typography.labelText.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  /**
   * Secret key text styling
   * - Monospace font for code readability
   * - White background for contrast
   * - Centered alignment
   */
  secretText: {
    ...typography.code,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: spacing.xs,
    textAlign: 'center',
  },

  /**
   * SMS setup container
   * - Spacing for phone input
   */
  smsSetup: {
    marginBottom: spacing.lg,
  },

  /**
   * Phone number input styling
   * - Border and padding for input field
   * - Proper spacing and touch targets
   */
  phoneInput: {
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: spacing.component.borderRadiusSmall,
    padding: spacing.sm,
    ...typography.input,
    marginTop: spacing.sm,
    minHeight: spacing.touchTarget.button,
  },

  /**
   * Email setup container
   * - Simple spacing for email instructions
   */
  emailSetup: {
    marginBottom: spacing.lg,
  },

  /**
   * Verification code input
   * - Prominent styling for code entry
   * - Large font and letter spacing
   * - Blue border for focus indication
   */
  codeInput: {
    borderWidth: 2,
    borderColor: colors.borderFocus,
    borderRadius: spacing.component.borderRadiusSmall,
    padding: spacing.md,
    fontSize: spacing.lg,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginVertical: spacing.lg,
    textAlign: 'center',
    minHeight: spacing.touchTarget.button + spacing.sm,
  },

  // ==========================================
  // 🔘 BUTTONS & ACTIONS
  // ==========================================

  /**
   * Button container layout
   * - Horizontal arrangement of buttons
   * - Proper spacing between buttons
   */
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },

  /**
   * Back button styling
   * - Secondary button appearance
   * - Light border and background
   */
  backButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: spacing.component.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    backgroundColor: colors.surface,
    minHeight: spacing.touchTarget.button,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Back button text styling
   * - Centered text with muted color
   */
  backButtonText: {
    ...typography.buttonText.medium,
    color: colors.textSecondary,
  },

  /**
   * Continue/primary button styling
   * - Blue background for primary action
   * - Proper spacing and touch targets
   */
  continueButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: spacing.component.borderRadiusSmall,
    backgroundColor: colors.info,
    minHeight: spacing.touchTarget.button,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Continue button text styling
   * - White text for contrast on blue background
   * - Centered alignment
   */
  continueButtonText: {
    ...typography.buttonText.medium,
    color: colors.surface,
  },

  /**
   * Disabled button state
   * - Gray background for disabled appearance
   */
  disabledButton: {
    backgroundColor: colors.greyMedium,
  },
});

/**
 * @export default mfaSetupModalStyles
 * @description Default export for easier importing
 */
export default mfaSetupModalStyles; 