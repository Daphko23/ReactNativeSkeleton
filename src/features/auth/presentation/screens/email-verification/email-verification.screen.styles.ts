/**
 * @fileoverview EMAIL-VERIFICATION-SCREEN-STYLES: Themed styles für Email Verification Screen
 * @description Styled components für enterprise Email Verification Screen mit Hook-Centric Architecture.
 * 
 * @since 3.0.0
 * @version 3.0.0
 * @author ReactNativeSkeleton Phase3 Team
 * @module EmailVerificationScreenStyles
 * @namespace Auth.Presentation.Screens.EmailVerification.Styles
 */

import { StyleSheet } from 'react-native';

/**
 * Creates styles for the EmailVerificationScreen component using theme tokens
 */
export const createEmailVerificationStyles = (theme: any) => StyleSheet.create({
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

  // Header Styles
  header: {
    marginBottom: theme.spacing[8],
    alignItems: 'center' as const,
  },
  headerIcon: {
    fontSize: theme.typography.fontSizes['4xl'],
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[2],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
    paddingHorizontal: theme.spacing[4],
  },

  // Instructions Styles
  instructionsContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  instructionsText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
  },

  // Form Styles
  formContainer: {
    gap: theme.spacing[5],
  },
  validationError: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    marginTop: -theme.spacing[4],
    marginBottom: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
  },

  // Info Styles
  infoContainer: {
    backgroundColor: theme.colors.info,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginTop: theme.spacing[6],
    alignItems: 'center' as const,
  },
  infoText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.textInverse,
    textAlign: 'center' as const,
  },
  infoSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textInverse,
    textAlign: 'center' as const,
    marginTop: theme.spacing[1],
  },

  // Attempts Styles
  attemptsContainer: {
    alignItems: 'center' as const,
    marginTop: theme.spacing[4],
  },
  attemptsText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Loading Styles
  loadingContainer: {
    alignItems: 'center' as const,
    marginTop: theme.spacing[6],
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[3],
    textAlign: 'center' as const,
  },
}); 