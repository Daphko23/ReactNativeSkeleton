import { StyleSheet } from 'react-native';

/**
 * Styles for ErrorDisplay component
 * 
 * @description Theme-aware styles for the error display component providing
 * comprehensive styling for error presentation, retry functionality, and
 * accessibility features. Supports enterprise-grade error handling UI patterns.
 * 
 * @param theme - Theme configuration object with colors, spacing, typography, etc.
 * @returns StyleSheet object with all component styles
 * 
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */
export const createErrorDisplayStyles = (theme: any) => StyleSheet.create({
  errorCard: {
    borderColor: theme.colors.error,
    borderWidth: 2, // Thicker border for errors
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[2],
  },
  errorText: {
    fontSize: theme.typography.fontSizes.base,
    marginBottom: theme.spacing[3],
    lineHeight: theme.typography.lineHeights.relaxed,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
}); 