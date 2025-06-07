import { StyleSheet } from 'react-native';

/**
 * Styles for EmptyState component
 * 
 * @description Theme-aware styles for the empty state component providing
 * comprehensive styling for empty state presentation, call-to-action buttons,
 * and accessibility features. Supports enterprise-grade empty state UI patterns.
 * 
 * @param theme - Theme configuration object with colors, spacing, typography, etc.
 * @returns StyleSheet object with all component styles
 * 
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */
export const createEmptyStateStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSizes.lg,
    marginBottom: theme.spacing[4],
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed,
  },
  createButton: {
    paddingHorizontal: theme.spacing[6],
  },
}); 