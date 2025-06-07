/**
 * ProfileSkeleton Styles - Skeleton Loading Animation
 */

import { StyleSheet } from 'react-native';

export const createProfileSkeletonStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing?.xs || 8,
    paddingTop: theme.spacing?.sm || 8,
    paddingBottom: theme.spacing?.sm || 8,
    gap: theme.spacing?.xs || 4,
  },

  skeletonBox: {
    backgroundColor: theme.colors?.border || '#E5E7EB',
    borderRadius: theme.borderRadius?.sm || 4,
  },

  // Header Section
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing?.md || 16,
    gap: theme.spacing?.md || 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  headerText: {
    flex: 1,
    gap: theme.spacing?.sm || 8,
  },

  nameText: {
    height: 24,
    borderRadius: theme.borderRadius?.sm || 4,
  },

  emailText: {
    height: 16,
    width: '70%',
    borderRadius: theme.borderRadius?.sm || 4,
  },

  completionBar: {
    height: 8,
    width: '60%',
    borderRadius: theme.borderRadius?.sm || 4,
  },

  // Actions Section
  actionsSection: {
    flexDirection: 'row',
    gap: theme.spacing?.sm || 8,
    paddingVertical: theme.spacing?.md || 16,
  },

  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: theme.borderRadius?.md || 8,
  },

  // Info Sections
  infoSection: {
    paddingVertical: theme.spacing?.md || 16,
    gap: theme.spacing?.sm || 8,
  },

  sectionTitle: {
    height: 20,
    width: '40%',
    borderRadius: theme.borderRadius?.sm || 4,
  },

  infoLine: {
    height: 16,
    borderRadius: theme.borderRadius?.sm || 4,
  },

  infoLineShort: {
    height: 16,
    width: '60%',
    borderRadius: theme.borderRadius?.sm || 4,
  },

  // Navigation Section
  navigationSection: {
    gap: theme.spacing?.xs || 4,
    paddingVertical: theme.spacing?.md || 16,
  },

  navigationItem: {
    height: 56,
    borderRadius: theme.borderRadius?.md || 8,
  },
}); 