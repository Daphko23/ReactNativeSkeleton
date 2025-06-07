/**
 * CustomFieldsEditScreen Styles - Enterprise Theme System
 * Centralized styling with consistent spacing and design tokens
 * Following enterprise design patterns and accessibility guidelines
 */

import { StyleSheet } from 'react-native';

export const createCustomFieldsEditScreenStyles = (theme: any) => StyleSheet.create({
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

  // Templates Section
  templatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },

  templatesContainer: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    paddingRight: theme.spacing[4],
  },

  templateChip: {
    marginBottom: theme.spacing[1],
  },

  templateChipDisabled: {
    opacity: 0.5,
  },

  allTemplatesContainer: {
    gap: theme.spacing[2],
  },

  templateItemDisabled: {
    opacity: 0.5,
  },

  templateListItem: {
    paddingHorizontal: 0,
    paddingVertical: theme.spacing[2],
  },

  // Fields Section
  fieldsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },

  fieldsCounter: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
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
    marginBottom: theme.spacing[2],
  },

  emptySubtext: {
    color: theme.colors.textTertiary,
    textAlign: 'center',
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.lineHeights.normal,
  },

  // Field Items
  fieldItem: {
    marginBottom: theme.spacing[5],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[2],
  },

  fieldInfo: {
    flex: 1,
    marginRight: theme.spacing[2],
  },

  fieldLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },

  fieldType: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },

  fieldDeleteButton: {
    padding: theme.spacing[1],
  },

  // Input Styling
  fieldInput: {
    backgroundColor: theme.colors.surface,
    fontSize: theme.typography.fontSizes.md,
  },

  fieldInputError: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  },

  fieldErrorText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing[1],
  },

  // Tips Section
  tipsSection: {
    backgroundColor: theme.colors.surfaceVariant || theme.colors.surface,
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

  tipText: {
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
    backgroundColor: theme.colors.primary,
  },

  fabDisabled: {
    backgroundColor: theme.colors.disabled,
  },

  // Menu and Dialog
  newFieldMenu: {
    marginTop: theme.spacing[6],
  },

  menuItem: {
    minHeight: 48,
  },

  menuItemIcon: {
    marginRight: theme.spacing[2],
  },

  // Validation
  validationContainer: {
    marginTop: theme.spacing[1],
  },

  validationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  validationSuccessText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.success || theme.colors.primary,
    marginLeft: theme.spacing[1],
  },

  // Progress and Stats
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
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
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
});

// Export constants for consistency
export const CUSTOM_FIELDS_EDIT_SPACING = {
  sectionGap: 4,
  contentPadding: 4,
  fieldItemGap: 5,
  fabBottomMargin: 20,
} as const;

export const CUSTOM_FIELDS_EDIT_ANIMATION = {
  duration: 300,
  easing: 'ease-in-out',
  fadeInDuration: 200,
  slideInDuration: 250,
} as const; 