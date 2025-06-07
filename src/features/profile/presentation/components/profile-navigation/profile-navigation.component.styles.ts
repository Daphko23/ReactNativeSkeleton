import { StyleSheet } from 'react-native';

/**
 * Styles for ProfileNavigation component
 * 
 * @description Theme-aware styles for the profile navigation component with
 * organized action cards, section dividers, and professional presentation.
 * Includes comprehensive styling for navigation sections, action items,
 * and accessibility features.
 * 
 * @param theme - Theme configuration object with colors, spacing, typography, etc.
 * @returns StyleSheet object with all component styles
 * 
 * @since 1.0.0
 */
export const createProfileNavigationStyles = (theme: any) => StyleSheet.create({
  // Container Styles
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius?.lg || 12,
    padding: theme.spacing?.lg || 16,
    marginBottom: theme.spacing?.lg || 16,
    elevation: 2,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Title Styles
  mainTitle: {
    fontSize: theme.typography?.fontSizes?.xl || 20,
    fontWeight: theme.typography?.fontWeights?.bold || '700',
    color: theme.colors.text,
    marginBottom: theme.spacing?.lg || 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  
  sectionTitle: {
    fontSize: theme.typography?.fontSizes?.lg || 18,
    fontWeight: theme.typography?.fontWeights?.semibold || '600',
    color: theme.colors.text,
    marginBottom: theme.spacing?.md || 12,
    marginTop: theme.spacing?.sm || 8,
  },
  
  // Divider Styles
  divider: {
    marginVertical: theme.spacing?.lg || 16,
    backgroundColor: theme.colors.outline,
    height: 1,
  },
  
  // Section Styles
  section: {
    marginBottom: theme.spacing?.md || 12,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing?.sm || 8,
  },
  
  sectionIcon: {
    marginRight: theme.spacing?.sm || 8,
  },
  
  // Action Card Styles
  actionCard: {
    marginBottom: theme.spacing?.sm || 8,
  },
  
  actionCardContent: {
    padding: theme.spacing?.md || 12,
  },
  
  // Loading States
  loadingContainer: {
    opacity: 0.6,
    pointerEvents: 'none',
  },
  
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  
  // Accessibility
  accessibilityFocus: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius?.md || 8,
  },
  
  // Responsive Adjustments
  compactContainer: {
    padding: theme.spacing?.md || 12,
  },
  
  compactTitle: {
    fontSize: theme.typography?.fontSizes?.lg || 18,
    marginBottom: theme.spacing?.md || 12,
  },
  
  compactDivider: {
    marginVertical: theme.spacing?.md || 12,
  },
}); 