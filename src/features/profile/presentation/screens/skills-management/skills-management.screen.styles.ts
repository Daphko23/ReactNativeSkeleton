/**
 * SkillsManagementScreen Styles - Enterprise Theme System
 * Centralized styling with consistent spacing and design tokens
 * Following enterprise design patterns and accessibility guidelines
 */

import { StyleSheet } from 'react-native';

export const createSkillsManagementScreenStyles = (theme: any) => StyleSheet.create({
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

  // Current Skills Header
  currentSkillsHeader: {
    marginBottom: theme.spacing[3],
  },

  bulkAssignButton: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },

  // Categories Header
  categoriesHeader: {
    marginBottom: theme.spacing[2],
  },

  categoryHint: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.success,
    fontStyle: 'italic',
    marginTop: theme.spacing[1],
  },

  // Search Section
  searchBar: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface,
    elevation: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  customSkillButton: {
    marginBottom: theme.spacing[4],
    borderColor: theme.colors.success,
  },

  customSkillButtonContainer: {
    marginBottom: theme.spacing[4],
  },

  customSkillButtonHidden: {
    opacity: 0.3,
  },

  customSkillButtonText: {
    color: theme.colors.success,
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

  // Skills Container
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },

  // User Skills
  userSkillChip: {
    backgroundColor: theme.colors.primaryContainer,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing[2],
    marginRight: theme.spacing[2],
    elevation: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  userSkillText: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Categories
  categoriesContainer: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    paddingRight: theme.spacing[4],
  },

  categoryChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: theme.spacing[2],
    elevation: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  selectedCategoryChip: {
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    elevation: 2,
  },

  categoryChipText: {
    fontSize: theme.typography.fontSizes.sm,
  },

  // Suggestions
  suggestionChip: {
    marginBottom: theme.spacing[2],
    marginRight: theme.spacing[2],
    borderColor: theme.colors.success,
    borderWidth: 1,
  },

  suggestionText: {
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeights.medium,
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

  // Skill Levels
  skillLevelIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: theme.spacing[1],
  },

  // Progress Section
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

  tipText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 20,
    flex: 1,
  },

  // Category Filter
  filterChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },

  activeFilterChip: {
    backgroundColor: theme.colors.primary,
  },

  filterChipText: {
    color: theme.colors.text,
  },

  activeFilterChipText: {
    color: theme.colors.onPrimary,
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

  // Search Results
  searchResultsContainer: {
    marginTop: theme.spacing[2],
  },

  searchResultItem: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  searchResultText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },

  // Validation
  validationContainer: {
    marginTop: theme.spacing[1],
  },

  validationError: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing[1],
  },

  validationSuccess: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.success,
    marginTop: theme.spacing[1],
  },
});

// Export constants for consistency
export const SKILLS_MANAGEMENT_SPACING = {
  sectionGap: 4,
  contentPadding: 4,
  chipGap: 2,
  fabBottomMargin: 20,
} as const;

export const SKILLS_MANAGEMENT_ANIMATION = {
  duration: 300,
  easing: 'ease-in-out',
  fadeInDuration: 200,
  slideInDuration: 250,
} as const; 