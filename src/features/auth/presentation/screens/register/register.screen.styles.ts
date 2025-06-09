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

const { width: _width } = Dimensions.get('window');
const _height = Dimensions.get('window').height;

/**
 * Creates styles for the RegisterScreen component using theme tokens
 */
export const createRegisterScreenStyles = (theme: any) => StyleSheet.create({
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

  optionalSectionTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[5],
    marginBottom: theme.spacing[4],
    paddingHorizontal: theme.spacing[2],
  },

  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
    gap: theme.spacing[3],
  },

  nameField: {
    flex: 1,
  },

  validationError: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
  },

  // ===================================
  // PASSWORD STRENGTH STYLES
  // ===================================
  passwordStrengthContainer: {
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },

  strengthBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },

  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing[3],
    overflow: 'hidden',
  },

  strengthFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },

  strengthText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    minWidth: 60,
  },

  feedbackContainer: {
    paddingLeft: theme.spacing[3],
  },

  feedbackText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing[1],
  },

  // ===================================
  // AGREEMENT STYLES
  // ===================================
  agreementContainer: {
    marginVertical: theme.spacing[5],
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },

  customCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.text,
    borderRadius: 4,
    backgroundColor: 'transparent',
    marginRight: theme.spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
  },

  customCheckboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  checkIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  checkbox: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outline,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
  },

  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  agreementTextContainer: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },

  agreementText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
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
  // OAUTH SOCIAL LOGIN STYLES
  // ===================================
  oauthContainer: {
    marginVertical: theme.spacing[5],
  },

  divider: {
    width: '100%',
    marginVertical: theme.spacing[4],
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

  // ===================================
  // INSTRUCTIONS STYLES
  // ===================================
  instructionsContainer: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[5],
  },

  instructionsTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[3],
  },

  instructionStep: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing[2],
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

  navigationLinkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  // ===================================
  // MISSING STYLES FOR V2 SCREEN
  // ===================================
  infoContainer: {
    backgroundColor: theme.colors.info,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginTop: theme.spacing[4],
    alignItems: 'center',
  },

  infoText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.textInverse,
    textAlign: 'center',
  },

  infoSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textInverse,
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },

  inputLabel: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text,
    marginBottom: theme.spacing[3],
    textAlign: 'center',
    lineHeight: 24,
  },
});
