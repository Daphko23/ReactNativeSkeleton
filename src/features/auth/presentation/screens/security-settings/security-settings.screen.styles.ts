/**
 * @fileoverview SECURITY-SETTINGS-SCREEN-STYLES: Themed styles für Security Settings Screen
 * @description Styled components für enterprise Security Settings Screen mit Hook-Centric Architecture.
 * 
 * @since 3.0.0
 * @version 3.0.0
 * @author ReactNativeSkeleton Phase3 Team
 * @module SecuritySettingsScreenStyles
 * @namespace Auth.Presentation.Screens.SecuritySettings.Styles
 */

import { StyleSheet } from 'react-native';

/**
 * Creates styles for the SecuritySettingsScreen component using theme tokens
 */
export const createSecuritySettingsStyles = (theme: any) => StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: theme.spacing[4],
  },

  // Header Styles
  header: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[2],
  },

  // Section Styles
  sectionCard: {
    backgroundColor: theme.colors.surface,
    marginVertical: theme.spacing[3],
    marginHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[2],
  },

  // Status Styles
  statusContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: theme.spacing[2],
    padding: theme.spacing[2],
    backgroundColor: theme.colors.success + '20',
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Loading Styles
  loadingContainer: {
    alignItems: 'center' as const,
    padding: theme.spacing[5],
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text,
    marginTop: theme.spacing[3],
  },

  // Error Styles
  errorContainer: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[4],
  },
  errorText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textInverse,
  },

  // Warning Styles
  warningContainer: {
    backgroundColor: theme.colors.warning,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[4],
  },
  warningText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textInverse,
    textAlign: 'center' as const,
  },

  // Info Styles
  infoContainer: {
    backgroundColor: theme.colors.info,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[4],
  },
  infoText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textInverse,
  },
  infoSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textInverse,
    marginTop: theme.spacing[1],
  },

  // Button Styles
  buttonContainer: {
    marginTop: theme.spacing[4],
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  dangerButton: {
    backgroundColor: theme.colors.error,
  },

  // List Styles
  listItem: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  listItemTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  listItemDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[1],
  },

  // Switch Styles
  switchContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
  },
  switchLabel: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text,
    flex: 1,
  },

  // Security Badge Styles
  securityBadge: {
    backgroundColor: theme.colors.success + '20',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    alignSelf: 'flex-start' as const,
  },
  securityBadgeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.success,
    textTransform: 'uppercase' as const,
  },

  // Activity Styles
  activityContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[3],
    marginVertical: theme.spacing[2],
  },
  activityTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  activityText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },

  // Missing Styles
  actionContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
  },
  actionText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
    textDecorationLine: 'underline' as const,
  },
  alertText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeights.medium,
  },
  clearErrorText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeights.medium,
    textDecorationLine: 'underline' as const,
    marginTop: theme.spacing[2],
  },
}); 