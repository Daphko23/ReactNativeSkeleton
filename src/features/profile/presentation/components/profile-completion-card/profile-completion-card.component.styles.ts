import { StyleSheet } from 'react-native';

/**
 * Styles for ProfileCompletionCard component
 * 
 * @description Theme-aware styles for the profile completion card component providing
 * comprehensive styling for completion status display, progress indicators,
 * suggestion lists, priority badges, and accessibility features. Supports
 * enterprise-grade profile completion tracking UI patterns.
 * 
 * @param theme - Theme configuration object with colors, spacing, typography, etc.
 * @returns StyleSheet object with all component styles
 * 
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */
export const createProfileCompletionCardStyles = (theme: any) => StyleSheet.create({
  card: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  header: {
    marginBottom: theme.spacing[4],
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  badge: {
    color: 'white',
  },
  status: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.sm,
  },
  progressContainer: {
    marginBottom: theme.spacing[4],
  },
  progressBar: {
    height: 8,
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    marginTop: theme.spacing[2],
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  suggestionsContainer: {
    marginTop: theme.spacing[2],
  },
  suggestionsTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[2],
    color: theme.colors.text,
  },
  suggestionItem: {
    paddingHorizontal: 0,
    paddingVertical: theme.spacing[2],
  },
  suggestionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  priorityText: {
    fontSize: theme.typography.fontSizes.xs,
  },
  viewAllButton: {
    marginTop: theme.spacing[2],
    alignSelf: 'flex-start',
  },
  congratulationsContainer: {
    marginTop: theme.spacing[4],
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[2],
  },
  congratulationsItem: {
    paddingHorizontal: 0,
  },
}); 