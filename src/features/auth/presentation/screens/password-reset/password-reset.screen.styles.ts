/**
 * @fileoverview PRESENTATION-STYLES-002: Optimized Password Reset Screen Styles
 * @description Vollständige Styles für den optimierten Password Reset Screen.
 * Implementiert moderne Material Design Prinzipien mit Enterprise UX.
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module PasswordResetScreenStyles
 * @namespace Auth.Presentation.Screens.Styles
 */

import { StyleSheet, Dimensions } from 'react-native';

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

/**
 * Creates styles for the PasswordResetScreen component using theme tokens
 */
export const createPasswordResetScreenStyles = (theme: any) => StyleSheet.create({
  // ===================================
  // CONTAINER STYLES
  // ===================================
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing[5],
    minHeight: '100%',
  },

  // ===================================
  // HEADER STYLES
  // ===================================
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },

  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing[3],
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing[4],
  },

  // ===================================
  // FORM STYLES
  // ===================================
  formContainer: {
    marginBottom: theme.spacing[6],
  },

  validationError: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
  },

  // ===================================
  // SUCCESS STATE STYLES
  // ===================================
  successHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },

  successIcon: {
    fontSize: 64,
    marginBottom: theme.spacing[4],
  },

  successTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.success,
    textAlign: 'center',
    marginBottom: theme.spacing[3],
  },

  successSubtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing[4],
  },

  // ===================================
  // INSTRUCTIONS STYLES
  // ===================================
  instructionsContainer: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },

  instructionsTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[4],
  },

  instructionStep: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing[3],
    paddingLeft: theme.spacing[3],
  },

  // ===================================
  // RESEND SECTION STYLES
  // ===================================
  resendContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },

  resendText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },

  resendButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resendButtonText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.primary,
  },

  cooldownText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },

  // ===================================
  // CHANGE EMAIL STYLES
  // ===================================
  changeEmailButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
    marginBottom: theme.spacing[5],
  },

  changeEmailText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },

  // ===================================
  // SECURITY NOTICE STYLES
  // ===================================
  securityNotice: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },

  securityText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // ===================================
  // NAVIGATION STYLES
  // ===================================
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
});
