import { StyleSheet } from 'react-native';

/**
 * Styles for ProfileHeader component
 * 
 * @description Theme-aware styles for the profile header component with
 * optimized avatar loading, smooth transitions, and professional presentation.
 * Includes comprehensive styling for avatar states, loading animations,
 * header layouts, and accessibility features.
 * 
 * @param theme - Theme configuration object with colors, spacing, typography, etc.
 * @returns StyleSheet object with all component styles
 * 
 * @since 1.0.0
 */
export const createProfileHeaderStyles = (theme: any) => StyleSheet.create({
  // Container Styles
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[4],
    overflow: 'hidden',
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  headerContent: {
    padding: theme.spacing[6],
    alignItems: 'center',
  },
  
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing[4],
  },
  
  // Avatar Styles
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing[3],
    width: 100, // PROFILE_CONSTANTS.UI.AVATAR_SIZE fallback
    height: 100,
  },
  
  avatarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  
  avatar: {
    // No margin here since container handles spacing
  },
  
  headerCard: {
    marginTop: 0,
    marginBottom: theme.spacing[2],
  },
  
  displayName: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing[2],
    color: theme.colors.text,
    textAlign: 'center',
  },
  
  bio: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[3],
    textAlign: 'center',
    paddingHorizontal: theme.spacing[4],
  },
  
  completenessIndicator: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius['3xl'],
    backgroundColor: 'transparent',
    elevation: 0,
  },
  
  completenessText: {
    fontWeight: theme.typography.fontWeights.semibold,
    fontSize: theme.typography.fontSizes.sm,
  },
}); 