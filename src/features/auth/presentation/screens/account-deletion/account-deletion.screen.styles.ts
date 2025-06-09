/**
 * @fileoverview ACCOUNT-DELETION-SCREEN-STYLES: Themed styles für Account Deletion Screen
 * @description Styled components für enterprise Account Deletion Screen mit Hook-Centric Architecture.
 * 
 * @since 3.0.0
 * @version 3.0.0
 * @author ReactNativeSkeleton Phase3 Team
 * @module AccountDeletionScreenStyles
 * @namespace Auth.Presentation.Screens.AccountDeletion.Styles
 */

import { StyleSheet } from 'react-native';

/**
 * Creates styles for the AccountDeletionScreen component using theme tokens
 */
export const createAccountDeletionStyles = (theme: any) => StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[10],
  },

  // Step Indicator Styles
  stepIndicator: {
    alignItems: 'center' as const,
    marginBottom: theme.spacing[6],
  },
  stepText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Step Container Styles
  stepContainer: {
    flex: 1,
  },

  // Warning Step Styles
  warningContainer: {
    alignItems: 'center' as const,
    marginBottom: theme.spacing[8],
  },
  warningIcon: {
    fontSize: theme.typography.fontSizes['4xl'],
    marginBottom: theme.spacing[4],
  },
  warningTitle: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.error,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[3],
    letterSpacing: -0.5,
  },
  warningSubtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },

  // Consequences Styles
  consequencesContainer: {
    backgroundColor: theme.colors.error + '10',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[6],
    borderWidth: 1,
    borderColor: theme.colors.error + '40',
  },
  consequencesTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.error,
    marginBottom: theme.spacing[4],
    textAlign: 'center' as const,
  },
  consequenceItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: theme.spacing[3],
  },
  consequenceIcon: {
    fontSize: theme.typography.fontSizes.base,
    marginRight: theme.spacing[3],
    marginTop: theme.spacing[1],
    color: theme.colors.error,
  },
  consequenceText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    flex: 1,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },

  // Options Styles
  optionsContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[6],
  },
  optionsTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[4],
  },
  optionItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: theme.spacing[4],
  },
  optionContent: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },
  optionTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  optionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },

  // Confirmation Styles
  confirmationContainer: {
    marginBottom: theme.spacing[6],
  },
  confirmationTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[3],
  },
  confirmationSubtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[6],
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
  },

  // Navigation Styles
  navigationContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: theme.spacing[6],
    gap: theme.spacing[4],
  },

  // Validation Error Styles
  validationError: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
  },

  // Processing Styles
  processingContainer: {
    alignItems: 'center' as const,
    paddingVertical: theme.spacing[8],
  },
  processingTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  processingText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[6],
  },
  processingInfo: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    textAlign: 'center' as const,
    marginTop: theme.spacing[4],
  },

  // Info Container Styles
  infoContainer: {
    alignItems: 'center' as const,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing[6],
  },
  infoText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[2],
  },
  infoSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  },

  // Export Styles
  exportContainer: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
  },
  exportTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing[2],
  },
  exportText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },

  // Form Styles
  formContainer: {
    marginBottom: theme.spacing[6],
  },
  inputLabel: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top' as const,
  },

  // Button Styles
  buttonContainer: {
    marginTop: theme.spacing[4],
  },
  backButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
  },

  // Status Styles
  statusContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing[3],
  },
  statusIcon: {
    fontSize: theme.typography.fontSizes.lg,
    marginRight: theme.spacing[2],
  },
  statusText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },

  // Warning Badge Styles
  warningBadge: {
    backgroundColor: theme.colors.warning + '20',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    alignSelf: 'center' as const,
    marginBottom: theme.spacing[4],
  },
  warningBadgeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.warning,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
}); 