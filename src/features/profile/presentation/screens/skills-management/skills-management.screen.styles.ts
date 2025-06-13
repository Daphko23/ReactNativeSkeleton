/**
 * SkillsManagementScreen Styles - Enterprise Theme System
 * Centralized styling with consistent spacing and design tokens
 * Following enterprise design patterns and accessibility guidelines
 */

import { StyleSheet } from 'react-native';

export const createSkillsManagementScreenStyles = (theme: any) => {
  // Fallback spacing system (React Native Paper doesn't have theme.spacing)
  const spacing = {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
  };

  // Fallback typography (React Native Paper doesn't have theme.typography)
  const typography = {
    fontSizes: {
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
    },
    fontWeights: {
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    lineHeights: {
      normal: 1.4,
      relaxed: 1.6,
    }
  };

  // Fallback border radius
  const borderRadius = {
    md: 8,
    lg: 12,
  };

  return StyleSheet.create({
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
      marginTop: spacing[4],
      color: theme.colors.text,
      fontSize: typography.fontSizes.md,
    },

    // Header Section
    header: {
      padding: spacing[4],
      paddingBottom: spacing[3],
    },

    headerTitle: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: spacing[2],
    },

    headerSubtitle: {
      fontSize: typography.fontSizes.md,
      color: theme.colors.textSecondary,
      lineHeight: typography.lineHeights.relaxed,
    },

    // ScrollView Content
    scrollView: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
      paddingBottom: spacing[8], // Normal bottom padding without FAB
    },

    // Section Cards
    section: {
      marginBottom: spacing[4],
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.lg,
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
      padding: spacing[4],
    },

    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      marginBottom: spacing[3],
      color: theme.colors.text,
    },

    // Current Skills Header
    currentSkillsHeader: {
      marginBottom: spacing[3],
    },

    bulkAssignButton: {
      marginTop: spacing[2],
      marginBottom: spacing[2],
    },

    // Categories Header
    categoriesHeader: {
      marginBottom: spacing[2],
    },

    categoryHint: {
      fontSize: typography.fontSizes.sm,
      color: theme.colors.success,
      fontStyle: 'italic',
      marginTop: spacing[1],
    },

    // Search Section
    searchBar: {
      marginBottom: spacing[4],
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
      marginBottom: spacing[4],
      borderColor: theme.colors.success,
    },

    customSkillButtonContainer: {
      marginBottom: spacing[4],
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
      paddingVertical: spacing[8],
      paddingHorizontal: spacing[4],
    },

    emptyIcon: {
      marginBottom: spacing[4],
    },

    emptyText: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontSize: typography.fontSizes.md,
      lineHeight: typography.lineHeights.relaxed,
      fontStyle: 'italic',
    },

    // Skills Container
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },

    // User Skills
    userSkillChip: {
      backgroundColor: theme.colors.primaryContainer,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginBottom: spacing[2],
      marginRight: spacing[2],
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
      fontWeight: typography.fontWeights.medium,
    },

    // Categories
    categoriesContainer: {
      flexDirection: 'row',
      gap: spacing[2],
      paddingRight: spacing[4],
    },

    categoryChip: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      marginBottom: spacing[2],
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
      fontSize: typography.fontSizes.sm,
    },

    // Suggestions
    suggestionChip: {
      marginBottom: spacing[2],
      marginRight: spacing[2],
      borderColor: theme.colors.success,
      borderWidth: 1,
    },

    suggestionText: {
      color: theme.colors.success,
      fontWeight: typography.fontWeights.medium,
    },

    // Floating Action Button
    fab: {
      position: 'absolute',
      margin: spacing[4],
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
      paddingVertical: spacing[3],
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: borderRadius.md,
      marginBottom: spacing[3],
    },

    statItem: {
      alignItems: 'center',
    },

    statValue: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      color: theme.colors.primary,
      marginBottom: spacing[1],
    },

    statLabel: {
      fontSize: typography.fontSizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },

    // Skill Levels
    skillLevelIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: spacing[1],
    },

    // Progress Section
    progressContainer: {
      marginTop: spacing[2],
      padding: spacing[3],
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: borderRadius.md,
    },

    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[2],
    },

    progressLabel: {
      fontSize: typography.fontSizes.sm,
      color: theme.colors.textSecondary,
    },

    progressValue: {
      fontSize: typography.fontSizes.sm,
      color: theme.colors.text,
      fontWeight: typography.fontWeights.medium,
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
      marginBottom: spacing[4],
    },

    tipItem: {
      flexDirection: 'row',
      marginBottom: spacing[3],
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[2],
      minHeight: 40,
    },

    tipBullet: {
      fontSize: 16,
      color: theme.colors.primary,
      marginRight: spacing[3],
      width: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    },

    tipText: {
      fontSize: typography.fontSizes.sm,
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
      paddingHorizontal: spacing[2],
    },

    // Spacing
    bottomSpacer: {
      height: spacing[8],
    },

    // Search Results
    searchResultsContainer: {
      marginTop: spacing[2],
    },

    searchResultItem: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    searchResultText: {
      fontSize: typography.fontSizes.md,
      color: theme.colors.text,
    },

    // Validation
    validationContainer: {
      marginTop: spacing[1],
    },

    validationError: {
      fontSize: typography.fontSizes.sm,
      color: theme.colors.error,
      marginTop: spacing[1],
    },

    validationSuccess: {
      fontSize: typography.fontSizes.sm,
      color: theme.colors.success,
      marginTop: spacing[1],
    },
  });
};

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