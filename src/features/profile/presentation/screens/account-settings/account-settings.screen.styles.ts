/**
 * AccountSettingsScreen Styles - Enterprise Theme System
 * Centralized styling with consistent spacing and design tokens
 */

import { StyleSheet, Platform } from 'react-native';

export const createAccountSettingsScreenStyles = (theme: any) => StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Loading State
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing?.lg || 16,
  },
  
  loadingText: {
    marginTop: theme.spacing?.md || 12,
    color: theme.colors.text,
    fontSize: theme.typography?.fontSizes?.base || 16,
    textAlign: 'center',
  },
  
  // ScrollView Styles
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingHorizontal: theme.spacing?.md || 12,
    paddingTop: theme.spacing?.sm || 8,
    paddingBottom: theme.spacing?.xxl || 48,
  },
  
  // Section Styles
  section: {
    marginBottom: theme.spacing?.lg || 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius?.md || 12,
    elevation: 2,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  sectionContent: {
    padding: theme.spacing?.lg || 16,
  },
  
  sectionTitle: {
    fontSize: theme.typography?.fontSizes?.lg || 18,
    fontWeight: theme.typography?.fontWeights?.semibold || '600',
    marginBottom: theme.spacing?.md || 12,
    color: theme.colors.text,
  },
  
  sectionDescription: {
    fontSize: theme.typography?.fontSizes?.sm || 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing?.lg || 16,
    lineHeight: 20,
  },
  
  // Overview Card Styles
  profileSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing?.lg || 16,
  },
  
  profileInfo: {
    flex: 1,
  },
  
  profileName: {
    fontSize: theme.typography?.fontSizes?.lg || 18,
    fontWeight: theme.typography?.fontWeights?.semibold || '600',
    marginBottom: theme.spacing?.xs || 4,
    color: theme.colors.text,
  },
  
  profileEmail: {
    fontSize: theme.typography?.fontSizes?.sm || 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing?.xs || 4,
  },
  
  memberSince: {
    fontSize: theme.typography?.fontSizes?.xs || 12,
    color: theme.colors.textTertiary,
  },
  
  profileBadge: {
    backgroundColor: theme.colors.primary,
    minWidth: 60,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing?.sm || 8,
  },
  
  badgeText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography?.fontSizes?.sm || 14,
    fontWeight: theme.typography?.fontWeights?.semibold || '600',
  },
  
  // Completeness Progress
  completenessSection: {
    marginTop: theme.spacing?.md || 12,
  },
  
  completenessLabel: {
    fontSize: theme.typography?.fontSizes?.sm || 14,
    marginBottom: theme.spacing?.sm || 8,
    color: theme.colors.text,
    fontWeight: theme.typography?.fontWeights?.medium || '500',
  },
  
  progressContainer: {
    height: 8,
    backgroundColor: theme.colors.backdrop,
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  
  progressText: {
    fontSize: theme.typography?.fontSizes?.xs || 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing?.xs || 4,
    textAlign: 'right',
  },
  
  // List Item Styles
  listItem: {
    paddingVertical: theme.spacing?.md || 12,
    paddingHorizontal: 0,
  },
  
  listItemTitle: {
    fontSize: theme.typography?.fontSizes?.base || 16,
    fontWeight: theme.typography?.fontWeights?.medium || '500',
    color: theme.colors.text,
    marginBottom: theme.spacing?.xs || 4,
  },
  
  listItemDescription: {
    fontSize: theme.typography?.fontSizes?.sm || 14,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  listItemIcon: {
    marginRight: theme.spacing?.md || 12,
    width: 24,
    alignItems: 'center',
  },
  
  listItemInfo: {
    flex: 1,
  },
  
  listItemChevron: {
    marginLeft: theme.spacing?.sm || 8,
    opacity: 0.6,
  },
  
  // Data Row Styles
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing?.md || 12,
    paddingVertical: theme.spacing?.sm || 8,
  },
  
  dataIcon: {
    marginRight: theme.spacing?.md || 12,
    width: 24,
    alignItems: 'center',
  },
  
  dataInfo: {
    flex: 1,
  },
  
  dataLabel: {
    fontSize: theme.typography?.fontSizes?.sm || 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing?.xs || 4,
  },
  
  dataValue: {
    fontSize: theme.typography?.fontSizes?.base || 16,
    fontWeight: theme.typography?.fontWeights?.medium || '500',
    color: theme.colors.text,
  },
  
  // Button Styles
  exportButton: {
    marginTop: theme.spacing?.lg || 16,
    borderRadius: theme.borderRadius?.md || 12,
  },
  
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius?.md || 12,
    paddingVertical: theme.spacing?.md || 12,
  },
  
  outlineButton: {
    borderColor: theme.colors.outline,
    borderWidth: 1,
    borderRadius: theme.borderRadius?.md || 12,
    paddingVertical: theme.spacing?.md || 12,
  },
  
  buttonText: {
    fontSize: theme.typography?.fontSizes?.base || 16,
    fontWeight: theme.typography?.fontWeights?.medium || '500',
  },
  
  // Danger Zone Styles
  dangerSection: {
    marginBottom: theme.spacing?.lg || 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius?.md || 12,
    borderColor: theme.colors.error,
    borderWidth: 1,
    elevation: 2,
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  dangerTitle: {
    color: theme.colors.error,
  },
  
  dangerDescription: {
    color: theme.colors.error,
    opacity: 0.8,
  },
  
  dangerIcon: {
    color: theme.colors.error,
  },
  
  // Divider Styles
  divider: {
    backgroundColor: theme.colors.outline,
    height: StyleSheet.hairlineWidth,
    marginVertical: theme.spacing?.xs || 4,
    marginLeft: 40, // Account for icon space
  },
  
  sectionDivider: {
    backgroundColor: theme.colors.outline,
    height: StyleSheet.hairlineWidth,
    marginVertical: theme.spacing?.md || 12,
  },
  
  // Error State Styles
  errorContainer: {
    padding: theme.spacing?.lg || 16,
    backgroundColor: theme.colors.errorContainer,
    borderRadius: theme.borderRadius?.md || 12,
    marginBottom: theme.spacing?.lg || 16,
  },
  
  errorTitle: {
    fontSize: theme.typography?.fontSizes?.base || 16,
    fontWeight: theme.typography?.fontWeights?.semibold || '600',
    color: theme.colors.error,
    marginBottom: theme.spacing?.sm || 8,
  },
  
  errorMessage: {
    fontSize: theme.typography?.fontSizes?.sm || 14,
    color: theme.colors.onErrorContainer,
    lineHeight: 20,
    marginBottom: theme.spacing?.md || 12,
  },
  
  retryButton: {
    alignSelf: 'flex-start',
  },
  
  // Empty State Styles
  emptyStateContainer: {
    padding: theme.spacing?.xl || 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  
  emptyStateIcon: {
    marginBottom: theme.spacing?.lg || 16,
    opacity: 0.6,
  },
  
  emptyStateTitle: {
    fontSize: theme.typography?.fontSizes?.lg || 18,
    fontWeight: theme.typography?.fontWeights?.semibold || '600',
    color: theme.colors.text,
    marginBottom: theme.spacing?.sm || 8,
    textAlign: 'center',
  },
  
  emptyStateDescription: {
    fontSize: theme.typography?.fontSizes?.sm || 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing?.lg || 16,
  },
  
  // Animation & Interaction Styles
  pressableItem: {
    borderRadius: theme.borderRadius?.sm || 8,
    overflow: 'hidden',
  },
  
  pressedItem: {
    backgroundColor: theme.colors.surfaceVariant,
    opacity: 0.8,
  },
  
  // Accessibility Styles
  accessibilityFocus: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius?.sm || 8,
  },
  
  // Bottom Spacer
  bottomSpacer: {
    height: theme.spacing?.xxl || 48,
  },
  
  // Card Elevation for different platforms
  cardElevation: {
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: theme.colors.shadow || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
});

// Animation Constants
export const ANIMATION_CONSTANTS = {
  PRESS_SCALE: 0.98,
  PRESS_DURATION: 150,
  FADE_DURATION: 300,
  SLIDE_DURATION: 250,
} as const; 