import { StyleSheet } from 'react-native';

/**
 * Styles for ProfileInformation component
 * 
 * @description Theme-aware styles for the profile information component with
 * organized information display, accessibility features, and professional presentation.
 * 
 * @param theme - Theme configuration object
 * @returns StyleSheet object with all component styles
 * @since 1.0.0
 */
export const createProfileInformationStyles = (theme: any) => StyleSheet.create({
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[2],
    color: theme.colors.text || '#000000',
  },
  infoContainer: {
    gap: theme.spacing[1],
  },
  infoItem: {
    color: theme.colors.text || '#000000',
    fontSize: theme.typography.fontSizes.base || 16,
    lineHeight: theme.typography.lineHeights.relaxed || 24,
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 28,
  },
  infoLabel: {
    fontWeight: theme.typography.fontWeights.semibold || 'bold',
    color: theme.colors.primary || '#007AFF',
    fontSize: 16,
    marginRight: theme.spacing[2],
    minWidth: 80,
  },
  infoValue: {
    flex: 1,
    color: theme.colors.text || '#000000',
    fontSize: theme.typography.fontSizes.base || 16,
  },
}); 