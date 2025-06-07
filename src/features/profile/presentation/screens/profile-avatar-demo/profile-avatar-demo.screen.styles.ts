/**
 * ProfileAvatarDemoScreen Styles - Enterprise Theme Integration
 * Reduced styles using Shared Components for consistency
 */

import { StyleSheet } from 'react-native';

export const createProfileAvatarDemoScreenStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing[4],
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  userName: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[1],
  },
  userId: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing[2],
    fontFamily: 'monospace',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  avatar: {
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionsContainer: {
    gap: theme.spacing[3],
  },
  actionButton: {
    marginBottom: theme.spacing[2],
  },
  infoItem: {
    marginBottom: theme.spacing[4],
  },
  infoLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },
  infoText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: theme.spacing[8],
  },
  successContainer: {
    padding: theme.spacing[3],
    backgroundColor: theme.colors.success + '20', // 20% opacity
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  successText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeights.semibold,
    textAlign: 'center',
  },
  urlText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.success,
    textAlign: 'center',
    marginTop: theme.spacing[1],
    fontFamily: 'monospace',
  },
}); 