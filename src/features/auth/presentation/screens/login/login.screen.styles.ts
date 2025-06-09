/**
 * @fileoverview PRESENTATION-STYLES-001: Optimized Login Screen Styles
 * @description Comprehensive styles für den optimierten Enterprise Login Screen.
 * Modernes Material Design mit Accessibility und Responsive Design.
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module LoginScreenStyles
 */

import { StyleSheet } from 'react-native';

/**
 * Creates styles for the LoginScreen component using theme tokens
 */
export const createLoginScreenStyles = (theme: any) => StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing[5],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing[3],
    textAlign: 'center',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form Container Styles
  formContainer: {
    marginBottom: theme.spacing[5],
  },
  input: {
    marginBottom: theme.spacing[4],
  },
  validationError: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSizes.xs,
    marginTop: -theme.spacing[3],
    marginBottom: theme.spacing[3],
    marginLeft: theme.spacing[3],
  },
  loginButton: {
    marginTop: theme.spacing[4],
  },

  // Biometric Authentication Styles
  biometricContainer: {
    marginVertical: theme.spacing[5],
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    marginVertical: theme.spacing[4],
  },
  orText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[4],
    textAlign: 'center',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
    borderRadius: theme.borderRadius.md,
    minWidth: 200,
    ...theme.shadows.md,
  },
  biometricIcon: {
    fontSize: theme.typography.fontSizes.lg,
    marginRight: theme.spacing[3],
  },
  biometricText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },

  // OAuth Social Login Styles
  oauthContainer: {
    marginVertical: theme.spacing[5],
  },
  socialText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[4],
    textAlign: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[4],
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
    minHeight: 48,
    ...theme.shadows.sm,
  },
  googleButton: {
    borderColor: '#4285f4',
  },
  appleButton: {
    borderColor: theme.colors.onSurface,
  },
  socialIcon: {
    fontSize: theme.typography.fontSizes.base,
    marginRight: theme.spacing[2],
  },
  socialButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },

  // Navigation Links Styles
  navigationContainer: {
    marginTop: theme.spacing[5],
    alignItems: 'center',
  },
  linkContainer: {
    marginTop: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  // Phase 3 Info Container Styles
  infoContainer: {
    marginTop: theme.spacing[6],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.onPrimaryContainer,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  infoSubtext: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.onPrimaryContainer,
    textAlign: 'center',
    opacity: 0.8,
  },
});
