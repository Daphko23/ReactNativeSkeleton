/**
 * SocialLinksEditScreen Styles - Enterprise Theme System
 * Centralized styling with consistent spacing and design tokens
 * Following enterprise design patterns and accessibility guidelines
 */

import { StyleSheet } from 'react-native';

export const createSocialLinksEditScreenStyles = (theme: any) => StyleSheet.create({
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
    paddingBottom: theme.spacing[3],
  },

  headerTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },

  headerSubtitle: {
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
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[8], // Normal bottom padding without FAB
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
    marginBottom: theme.spacing[3],
    color: theme.colors.text,
  },

  // Platform Input Section
  platformItem: {
    marginBottom: theme.spacing[5],
  },

  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },

  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },

  platformInfo: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },

  platformName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },

  platformBaseUrl: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
  },

  platformActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Input Components
  inputContainer: {
    position: 'relative',
  },

  input: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing[1],
  },

  inputError: {
    backgroundColor: theme.colors.errorContainer,
    borderColor: theme.colors.error,
    borderWidth: 1,
  },

  inputSuccess: {
    backgroundColor: theme.colors.successContainer,
    borderColor: theme.colors.success,
    borderWidth: 1,
  },

  // Validation States
  validationContainer: {
    marginTop: theme.spacing[1],
    marginBottom: theme.spacing[2],
  },

  errorText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing[1],
  },

  successText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.success,
    marginTop: theme.spacing[1],
  },

  tipText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[1],
    fontStyle: 'italic',
  },

  // Statistics Section
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing[1],
  },

  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  // Summary Section
  summaryContainer: {
    marginTop: theme.spacing[2],
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },

  summaryIcon: {
    marginRight: theme.spacing[3],
  },

  summaryContent: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },

  summaryUrl: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
  },

  summaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Category Filters
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },

  categoryChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },

  activeCategoryChip: {
    backgroundColor: theme.colors.primary,
  },

  categoryChipText: {
    color: theme.colors.text,
  },

  activeCategoryChipText: {
    color: theme.colors.onPrimary,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
  },

  emptyIcon: {
    marginBottom: theme.spacing[4],
  },

  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontSize: theme.typography.fontSizes.md,
    lineHeight: theme.typography.lineHeights.relaxed,
    fontStyle: 'italic',
  },

  emptyActionText: {
    color: theme.colors.primary,
    textAlign: 'center',
    fontSize: theme.typography.fontSizes.md,
    marginTop: theme.spacing[2],
  },

  // Tips Section
  tipsSection: {
    backgroundColor: theme.colors.surfaceVariant || theme.colors.surface,
    marginBottom: theme.spacing[4],
  },

  tipItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[2],
    minHeight: 40,
  },

  tipBullet: {
    fontSize: 16,
    color: theme.colors.primary,
    marginRight: theme.spacing[3],
    width: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  tipContent: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 20,
    flex: 1,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    margin: theme.spacing[4],
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.success,
  },

  fabDisabled: {
    backgroundColor: theme.colors.disabled,
  },

  // Action Buttons
  actionButton: {
    marginRight: theme.spacing[2],
  },

  previewButton: {
    backgroundColor: theme.colors.primaryContainer,
  },

  removeButton: {
    backgroundColor: theme.colors.errorContainer,
  },

  resetButton: {
    marginTop: theme.spacing[2],
    borderColor: theme.colors.warning,
  },

  // Progress Indicators
  progressContainer: {
    marginTop: theme.spacing[2],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },

  progressLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
  },

  progressValue: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.medium,
  },

  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 3,
  },

  // Platform Categories
  categorySection: {
    marginBottom: theme.spacing[4],
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },

  categoryTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing[2],
  },

  categoryDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[3],
    fontStyle: 'italic',
  },

  // Accessibility
  screenReader: {
    position: 'absolute',
    left: -10000,
    top: -10000,
    width: 1,
    height: 1,
  },

  // Animation Support
  fadeIn: {
    opacity: 1,
  },

  fadeOut: {
    opacity: 0.5,
  },

  // Responsive adjustments
  compactMode: {
    paddingHorizontal: theme.spacing[2],
  },

  // Spacing
  bottomSpacer: {
    height: theme.spacing[8],
  },

  // URL Preview
  urlPreviewContainer: {
    marginTop: theme.spacing[2],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },

  urlPreviewTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },

  urlPreviewUrl: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },

  // Platform Status
  platformConnected: {
    backgroundColor: theme.colors.successContainer,
    borderColor: theme.colors.success,
  },

  platformDisconnected: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },

  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: theme.spacing[2],
  },

  statusConnected: {
    backgroundColor: theme.colors.success,
  },

  statusDisconnected: {
    backgroundColor: theme.colors.disabled,
  },
});

// Export constants for consistency
export const SOCIAL_LINKS_EDIT_SPACING = {
  sectionGap: 4,
  contentPadding: 4,
  platformItemGap: 5,
  fabBottomMargin: 20,
} as const;

export const SOCIAL_LINKS_EDIT_ANIMATION = {
  duration: 300,
  easing: 'ease-in-out',
  fadeInDuration: 200,
  slideInDuration: 250,
} as const; 