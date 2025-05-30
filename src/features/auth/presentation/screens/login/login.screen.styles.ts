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

import {StyleSheet} from 'react-native';
import {spacing, colors} from '@core/theme';

/**
 * Stylesheet for the optimized LoginScreen component
 */
export const loginScreenStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
    color: colors.text || '#212529',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form Container Styles
  formContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  validationError: {
    color: colors.error || '#dc3545',
    fontSize: 12,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  loginButton: {
    marginTop: spacing.md,
  },

  // Biometric Authentication Styles
  biometricContainer: {
    marginVertical: spacing.lg,
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    marginVertical: spacing.md,
  },
  orText: {
    fontSize: 14,
    color: colors.textSecondary || '#6c757d',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary || '#007bff',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  biometricIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  biometricText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // OAuth Social Login Styles
  oauthContainer: {
    marginVertical: spacing.lg,
  },
  socialText: {
    fontSize: 14,
    color: colors.textSecondary || '#6c757d',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border || '#dee2e6',
    backgroundColor: '#fff',
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButton: {
    borderColor: '#4285f4',
  },
  appleButton: {
    borderColor: '#000',
  },
  socialIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text || '#212529',
  },

  // Navigation Links Styles
  navigationContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkContainer: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  linkText: {
    color: colors.primary || '#007bff',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
