/**
 * PrivacySettingsScreen Styles - Enterprise Theme System
 * Centralized styling with consistent spacing and design tokens
 * Following enterprise design patterns and accessibility guidelines
 */

import { StyleSheet } from 'react-native';

export const createPrivacySettingsScreenStyles = (theme: any) => StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  loadingText: {
    marginTop: theme.spacing[4],
    color: theme.colors.text,
    fontSize: theme.typography.fontSizes.md,
  },

  // Header Section
  header: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  headerTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },

  headerDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed,
  },

  // ScrollView Content
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    paddingBottom: theme.spacing[8], // Extra bottom padding
  },

  // Section Cards
  section: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  sectionContent: {
    padding: theme.spacing[4],
  },

  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[2],
    color: theme.colors.text,
  },

  sectionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[4],
    lineHeight: theme.typography.lineHeights.relaxed,
  },

  // Radio Button Options
  radioGroup: {
    marginTop: theme.spacing[2],
  },

  radioOption: {
    marginBottom: theme.spacing[1],
    paddingVertical: theme.spacing[1],
  },

  // List Items
  listItem: {
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  listItemLast: {
    borderBottomWidth: 0,
  },

  listItemDanger: {
    borderBottomColor: theme.colors.error,
  },

  // Accordion Items
  accordion: {
    backgroundColor: 'transparent',
  },

  accordionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },

  accordionContent: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing[2],
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing[6],
    gap: theme.spacing[4],
    paddingHorizontal: theme.spacing[0],
  },

  actionButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    minHeight: 48,
    justifyContent: 'center',
  },

  // Switch Components
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[2],
    minHeight: 72,
    backgroundColor: 'transparent',
  },

  switchLabel: {
    flex: 1,
    marginRight: theme.spacing[3],
    paddingRight: theme.spacing[2],
  },

  switchTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
    lineHeight: 20,
  },

  switchDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    flexWrap: 'wrap',
  },

  // Data Management Section
  dataManagementItem: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingVertical: theme.spacing[8],
    paddingHorizontal: theme.spacing[6],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 180,
  },

  dataManagementDanger: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.errorContainer || theme.colors.surface,
    borderWidth: 2,
  },

  dataManagementContent: {
    flex: 1,
    marginBottom: theme.spacing[6],
  },

  dataManagementTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[3],
  },

  dataManagementTitleDanger: {
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeights.bold,
  },

  dataManagementDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing[4],
    flexWrap: 'wrap',
    minHeight: 44,
  },

  // Data Management Buttons
  dataManagementButton: {
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: theme.borderRadius.md,
  },

  dataManagementButtonDanger: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },

  // Danger Zone specific styles
  dangerZoneContainer: {
    marginBottom: theme.spacing[4],
    marginTop: theme.spacing[2],
  },

  dangerZoneCard: {
    borderColor: theme.colors.error,
    borderWidth: 2,
    backgroundColor: theme.colors.errorContainer || theme.colors.surface,
  },

  dangerZoneContent: {
    padding: theme.spacing[5], // More padding than regular sections
  },

  dangerZoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },

  dangerZoneIcon: {
    marginRight: theme.spacing[3],
    marginTop: 2, // Small offset to align with text baseline
  },

  dangerZoneTitle: {
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeights.bold,
    flex: 1,
    lineHeight: 24, // Match icon height for better alignment
  },

  dangerZoneDescription: {
    color: theme.colors.onErrorContainer || theme.colors.onSurface,
    marginBottom: theme.spacing[6],
    lineHeight: 22,
    paddingRight: theme.spacing[2],
  },

  dangerZoneButton: {
    marginTop: theme.spacing[2],
  },

  // Spacing
  bottomSpacer: {
    height: theme.spacing[8],
  },
});

// Export constants for consistency
export const PRIVACY_SETTINGS_SPACING = {
  sectionGap: 4,
  contentPadding: 4,
  buttonGap: 4,
  bottomPadding: 8,
} as const;

export const PRIVACY_SETTINGS_ANIMATION = {
  duration: 300,
  easing: 'ease-in-out',
} as const; 