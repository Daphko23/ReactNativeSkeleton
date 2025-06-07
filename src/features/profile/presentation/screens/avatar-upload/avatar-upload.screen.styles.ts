/**
 * AvatarUploadScreen Styles - Enterprise Theme System
 * Centralized styling for avatar upload screen
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = width * 0.6; // 60% der Bildschirmbreite

export const createAvatarUploadScreenStyles = (theme: any) => StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    padding: theme.spacing?.[4] || 16,
    paddingBottom: theme.spacing?.[6] || 24, // Extra bottom padding for scrolling
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing?.[6] || 24,
  },
  
  title: {
    fontSize: theme.typography?.fontSizes?.xl || 24,
    fontWeight: theme.typography?.fontWeights?.semibold || '600',
    marginBottom: theme.spacing?.[2] || 8,
    color: theme.colors.text,
  },
  
  subtitle: {
    fontSize: theme.typography?.fontSizes?.base || 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Card Styles
  previewCard: {
    marginBottom: theme.spacing?.[4] || 16,
    backgroundColor: theme.colors.surface,
  },
  
  previewContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing?.[8] || 32,
  },
  
  progressCard: {
    marginBottom: theme.spacing?.[4] || 16,
    backgroundColor: theme.colors.surface,
  },
  
  tipsCard: {
    marginBottom: theme.spacing?.[6] || 24,
    backgroundColor: theme.colors.surface,
  },
  
  // Avatar Styles
  avatarContainer: {
    position: 'relative',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  
  avatarPreview: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: theme.colors.surfaceVariant,
  },
  
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Loading Styles
  loadingContainer: {
    alignItems: 'center',
    height: AVATAR_SIZE,
    justifyContent: 'center',
  },
  
  loadingText: {
    marginTop: theme.spacing?.[4] || 16,
    color: theme.colors.textSecondary,
  },
  
  // Button Styles
  cameraFab: {
    backgroundColor: theme.colors.primary,
  },
  
  editFab: {
    position: 'absolute',
    bottom: theme.spacing?.[2] || 8,
    right: theme.spacing?.[2] || 8,
    backgroundColor: theme.colors.primary,
  },
  
  removeButton: {
    marginTop: theme.spacing?.[4] || 16,
  },
  
  actions: {
    flexDirection: 'row',
    gap: theme.spacing?.[4] || 16,
  },
  
  actionButton: {
    flex: 1,
  },
  
  // Progress Styles
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing?.[2] || 8,
  },
  
  progressText: {
    fontWeight: theme.typography?.fontWeights?.semibold || '600',
    color: theme.colors.text,
  },
  
  progressBar: {
    height: 6,
    borderRadius: theme.borderRadius?.sm || 4,
  },
  
  // Tips Styles
  tipsTitle: {
    fontSize: theme.typography?.fontSizes?.base || 16,
    fontWeight: theme.typography?.fontWeights?.semibold || '600',
    marginBottom: theme.spacing?.[3] || 12,
    color: theme.colors.text,
  },
  
  tip: {
    fontSize: theme.typography?.fontSizes?.sm || 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing?.[1] || 4,
  },
});

// Export constants for consistency
export const AVATAR_UPLOAD_CONSTANTS = {
  AVATAR_SIZE,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  QUALITY: 0.8,
} as const;

export type AvatarUploadConstants = typeof AVATAR_UPLOAD_CONSTANTS; 