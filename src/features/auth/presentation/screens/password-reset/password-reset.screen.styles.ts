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
import { spacing, colors } from '@core/theme';

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

/**
 * Stylesheet for the optimized PasswordResetScreen component.
 */
export const passwordResetScreenStyles = StyleSheet.create({
  // ===================================
  // CONTAINER STYLES
  // ===================================
  container: {
    flex: 1,
    backgroundColor: colors.background || '#ffffff',
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg || 24,
    minHeight: '100%',
  },

  // ===================================
  // HEADER STYLES
  // ===================================
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl || 32,
    paddingHorizontal: spacing.md || 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text || '#1a1a1a',
    textAlign: 'center',
    marginBottom: spacing.sm || 12,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md || 16,
  },

  // ===================================
  // FORM STYLES
  // ===================================
  formContainer: {
    marginBottom: spacing.xl || 32,
  },

  validationError: {
    fontSize: 14,
    color: colors.error || '#d32f2f',
    marginTop: spacing.xs || 8,
    marginBottom: spacing.sm || 12,
    paddingHorizontal: spacing.sm || 12,
  },

  // ===================================
  // SUCCESS STATE STYLES
  // ===================================
  successHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl || 32,
    paddingHorizontal: spacing.md || 16,
  },

  successIcon: {
    fontSize: 64,
    marginBottom: spacing.md || 16,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.success || '#2e7d32',
    textAlign: 'center',
    marginBottom: spacing.sm || 12,
  },

  successSubtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md || 16,
  },

  // ===================================
  // INSTRUCTIONS STYLES
  // ===================================
  instructionsContainer: {
    backgroundColor: colors.surface || '#f8f9fa',
    borderRadius: 12,
    padding: spacing.lg || 24,
    marginBottom: spacing.xl || 32,
    borderWidth: 1,
    borderColor: colors.border || '#e0e0e0',
  },

  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text || '#1a1a1a',
    marginBottom: spacing.md || 16,
  },

  instructionStep: {
    fontSize: 16,
    color: colors.textSecondary || '#666666',
    lineHeight: 24,
    marginBottom: spacing.sm || 12,
    paddingLeft: spacing.sm || 12,
  },

  // ===================================
  // RESEND SECTION STYLES
  // ===================================
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl || 32,
    paddingHorizontal: spacing.md || 16,
  },

  resendText: {
    fontSize: 16,
    color: colors.textSecondary || '#666666',
    textAlign: 'center',
    marginBottom: spacing.md || 16,
  },

  resendButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary || '#007bff',
    borderRadius: 8,
    paddingVertical: spacing.sm || 12,
    paddingHorizontal: spacing.lg || 24,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resendButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary || '#007bff',
  },

  cooldownText: {
    fontSize: 14,
    color: colors.textSecondary || '#666666',
    fontStyle: 'italic',
  },

  // ===================================
  // CHANGE EMAIL STYLES
  // ===================================
  changeEmailButton: {
    alignItems: 'center',
    paddingVertical: spacing.md || 16,
    marginBottom: spacing.lg || 24,
  },

  changeEmailText: {
    fontSize: 16,
    color: colors.primary || '#007bff',
    textDecorationLine: 'underline',
  },

  // ===================================
  // SECURITY NOTICE STYLES
  // ===================================
  securityNotice: {
    backgroundColor: colors.info || '#e3f2fd',
    borderRadius: 8,
    padding: spacing.md || 16,
    marginBottom: spacing.xl || 32,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary || '#007bff',
  },

  securityText: {
    fontSize: 14,
    color: colors.textSecondary || '#666666',
    lineHeight: 20,
    textAlign: 'center',
  },

  // ===================================
  // NAVIGATION STYLES
  // ===================================
  navigationContainer: {
    marginTop: 'auto',
    paddingTop: spacing.xl || 32,
  },

  linkContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md || 16,
  },

  linkText: {
    color: colors.primary || '#007bff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
