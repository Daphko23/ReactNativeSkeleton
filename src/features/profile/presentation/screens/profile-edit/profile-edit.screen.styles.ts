/**
 * ProfileEditScreen Styles - Enterprise Theme System
 * Centralized styling for profile edit screen
 */

import { StyleSheet } from 'react-native';

export const createProfileEditScreenStyles = (theme: any) => StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // ScrollView Styles
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: theme.spacing?.[4] || 16,
  },
  
  // Header Styles
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Text Styles
  extensibilityNote: {
    fontSize: theme.typography?.fontSizes?.xs || 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing?.[4] || 16,
  },
  
  // Layout Styles
  bottomSpacer: {
    height: theme.spacing?.[8] || 32,
  },
});

// Export spacing constants for consistency
export const PROFILE_EDIT_SCREEN_SPACING = {
  contentPadding: 4,
  bottomSpacer: 8,
  sectionMargin: 4,
} as const; 