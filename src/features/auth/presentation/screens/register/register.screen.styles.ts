/**
 * @fileoverview PRESENTATION-STYLES-003: Optimized Register Screen Styles
 * @description Vollständige Styles für den optimierten Register Screen.
 * Implementiert moderne Material Design Prinzipien mit Enterprise UX.
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module RegisterScreenStyles
 * @namespace Auth.Presentation.Screens.Styles
 */

import { StyleSheet, Dimensions } from 'react-native';
import { spacing, colors } from '@core/theme';

const { width: _width } = Dimensions.get('window');
const _height = Dimensions.get('window').height;

/**
 * Stylesheet for the optimized RegisterScreen component.
 */
export const registerScreenStyles = StyleSheet.create({
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

  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md || 16,
  },

  nameField: {
    flex: 1,
    marginHorizontal: spacing.xs || 4,
  },

  validationError: {
    fontSize: 14,
    color: colors.error || '#d32f2f',
    marginTop: spacing.xs || 8,
    marginBottom: spacing.sm || 12,
    paddingHorizontal: spacing.sm || 12,
  },

  // ===================================
  // PASSWORD STRENGTH STYLES
  // ===================================
  passwordStrengthContainer: {
    marginTop: spacing.sm || 12,
    marginBottom: spacing.md || 16,
  },

  strengthBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm || 12,
  },

  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginRight: spacing.sm || 12,
    overflow: 'hidden',
  },

  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },

  strengthText: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 60,
  },

  feedbackContainer: {
    paddingLeft: spacing.sm || 12,
  },

  feedbackText: {
    fontSize: 12,
    color: colors.textSecondary || '#666666',
    lineHeight: 18,
    marginBottom: spacing.xs || 4,
  },

  // ===================================
  // AGREEMENT STYLES
  // ===================================
  agreementContainer: {
    marginVertical: spacing.lg || 24,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md || 16,
  },

  agreementTextContainer: {
    flex: 1,
    marginLeft: spacing.sm || 12,
  },

  agreementText: {
    fontSize: 14,
    color: colors.textSecondary || '#666666',
    lineHeight: 20,
  },

  linkText: {
    color: colors.primary || '#007bff',
    textDecorationLine: 'underline',
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

  // Legacy success styles (for compatibility)
  successContainer: {
    backgroundColor: colors.success || '#4CAF50',
    borderRadius: 8,
    marginBottom: spacing.lg || 24,
    padding: spacing.md || 16,
  },

  successText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs || 8,
    textAlign: 'center',
  },

  redirectText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
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
  // OAUTH SOCIAL LOGIN STYLES
  // ===================================
  oauthContainer: {
    marginVertical: spacing.xl || 32,
  },

  divider: {
    marginVertical: spacing.lg || 24,
  },

  socialText: {
    fontSize: 16,
    color: colors.textSecondary || '#666666',
    textAlign: 'center',
    marginBottom: spacing.lg || 24,
  },

  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md || 16,
  },

  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md || 16,
    paddingHorizontal: spacing.lg || 24,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 50,
  },

  googleButton: {
    backgroundColor: '#ffffff',
    borderColor: '#dadce0',
  },

  appleButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },

  socialIcon: {
    fontSize: 20,
    marginRight: spacing.sm || 12,
  },

  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
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

  navigationLinkText: {
    color: colors.primary || '#007bff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
