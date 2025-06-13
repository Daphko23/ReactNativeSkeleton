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
  
  // Form Field Styles
  formField: {
    marginBottom: theme.spacing?.[3] || 12,
  },
  
  fieldSpacing: {
    marginBottom: theme.spacing?.[3] || 12,
  },
  
  fieldLabel: {
    fontSize: theme.typography?.fontSizes?.md || 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing?.[2] || 8,
  },
  
  label: {
    fontSize: theme.typography?.fontSizes?.md || 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing?.[2] || 8,
  },
  
  segmentedButtons: {
    marginVertical: theme.spacing?.[2] || 8,
  },
  
  // Button Styles
  addFieldButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing?.[3] || 12,
    borderRadius: theme.borderRadius?.medium || 8,
    alignItems: 'center',
    marginVertical: theme.spacing?.[2] || 8,
  },
  
  addFieldButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography?.fontSizes?.md || 14,
    fontWeight: '600',
  },
  
  // Error Styles
  errorContainer: {
    backgroundColor: theme.colors.errorContainer,
    padding: theme.spacing?.[3] || 12,
    borderRadius: theme.borderRadius?.medium || 8,
    marginVertical: theme.spacing?.[2] || 8,
  },
  
  errorText: {
    color: theme.colors.onErrorContainer,
    fontSize: theme.typography?.fontSizes?.sm || 12,
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