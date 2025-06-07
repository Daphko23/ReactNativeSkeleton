/**
 * ProfileScreen Styles - Enterprise Theme System
 * Centralized styling with consistent spacing and design tokens
 */

import { StyleSheet } from 'react-native';

export const createProfileScreenStyles = (theme: any) => StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // ScrollView Styles
  scrollView: {
    flex: 1,
  },
  
  // ScrollView Content
  scrollContent: {
    paddingHorizontal: theme.spacing?.xs || 8,
    paddingTop: theme.spacing?.sm || 8,
    paddingBottom: theme.spacing?.sm || 8,
    gap: theme.spacing?.xs || 4,
  },
  
  // Empty State Container
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing?.lg || 24,
  },

  // Logout Section Styles
  logoutSection: {
    marginTop: theme.spacing?.xl || 32,
    paddingTop: theme.spacing?.lg || 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors?.border || '#E5E7EB',
    alignItems: 'center',
  },

  logoutButton: {
    backgroundColor: theme.colors?.error || '#DC2626',
    paddingHorizontal: theme.spacing?.lg || 24,
    paddingVertical: theme.spacing?.md || 16,
    borderRadius: theme.borderRadius?.md || 8,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: theme.colors?.error || '#DC2626',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  logoutButtonDisabled: {
    backgroundColor: theme.colors?.textSecondary || '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },

  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography?.size?.md || 16,
    fontWeight: theme.typography?.weight?.semibold || '600',
    textAlign: 'center',
  },

  logoutButtonTextDisabled: {
    color: theme.colors?.textTertiary || '#D1D5DB',
  },
});

// Export spacing constants for consistency
export const PROFILE_SCREEN_SPACING = {
  componentGap: 'xs',
  horizontalPadding: 0,
  topPadding: 0,
  bottomPadding: 'xxl',
} as const; 