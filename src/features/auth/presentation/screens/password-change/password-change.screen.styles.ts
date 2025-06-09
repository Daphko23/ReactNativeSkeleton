/**
 * @fileoverview PASSWORD-CHANGE-SCREEN-STYLES: External Styles for Password Change Screen
 * @description Externalisierte Styles für Hook-Centric Enterprise Password Change Screen.
 * Folgt dem einheitlichen Pattern aller Auth-Screens.
 * 
 * @architecture External styles with createThemedStyles
 * @architecture Consistent with unified auth screen pattern
 * @architecture Theme-aware responsive design
 * 
 * @since 3.0.0
 * @version 3.0.0
 * @author ReactNativeSkeleton Phase3 Team
 * @module PasswordChangeScreenStyles
 * @namespace Auth.Presentation.Screens.PasswordChange
 */

import { createThemedStyles } from '@core/theme/theme.system';

/**
 * @function createPasswordChangeStyles
 * @description Creates themed styles for password change screen
 * @param theme - Theme object from theme system
 * @returns Styled components object
 */
export const createPasswordChangeStyles = createThemedStyles((theme) => ({
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

  // Password Strength Styles
  strengthContainer: {
    marginTop: theme.spacing[2],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  strengthHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing[3],
  },
  strengthLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  strengthScore: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  strengthBar: {
    height: 6,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing[3],
  },
  
  // Requirements Styles
  requirementsContainer: {
    marginTop: theme.spacing[2],
  },
  requirementsTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },
  requirementItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing[1],
  },
  requirementIcon: {
    fontSize: theme.typography.fontSizes.sm,
    marginRight: theme.spacing[2],
    width: 16,
  },
  requirementText: {
    fontSize: theme.typography.fontSizes.sm,
    flex: 1,
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
})); 