import { StyleSheet } from 'react-native';

/**
 * Styles for AuthAwareProfileCard component
 * 
 * @description Theme-aware styles for the auth-aware profile card component with
 * support for multiple variants (compact, detailed, admin) and comprehensive
 * styling for all UI elements including security badges, role information,
 * and interactive elements.
 * 
 * @param theme - Theme configuration object with colors, spacing, typography, etc.
 * @returns StyleSheet object with all component styles
 * 
 * @since 1.0.0
 */
export const createAuthAwareProfileCardStyles = (theme: any) => StyleSheet.create({
  card: {
    marginVertical: theme.spacing[2],
    marginHorizontal: theme.spacing[4],
    elevation: 4,
    backgroundColor: theme.colors.surface,
  },
  loadingContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },
  loadingText: {
    marginTop: theme.spacing[4],
    color: theme.colors.text,
  },
  
  // Compact Variant
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing[4],
  },
  securityBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  securityBadgeLarge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: theme.typography.fontSizes.lg,
    marginBottom: theme.spacing[1],
    color: theme.colors.text,
  },
  compactStats: {
    marginTop: theme.spacing[2],
  },
  statText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[0.5],
  },
  quickActions: {
    flexDirection: 'row',
  },
  
  // Detailed Variant
  detailedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  detailedInfo: {
    flex: 1,
    marginLeft: theme.spacing[4],
  },
  detailedName: {
    fontSize: theme.typography.fontSizes.xl,
    marginBottom: theme.spacing[2],
    color: theme.colors.text,
  },
  bio: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[2],
    lineHeight: 20,
  },
  metaInfo: {
    marginTop: theme.spacing[2],
  },
  metaText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing[0.5],
  },
  
  // Roles
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  roleChip: {
    marginRight: theme.spacing[1],
    marginBottom: theme.spacing[1],
  },
  roleChipText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  roleChipDetailed: {
    marginRight: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  roleChipTextDetailed: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  
  // Sections
  divider: {
    marginVertical: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[3],
    color: theme.colors.text,
  },
  subsectionTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[2],
    color: theme.colors.textSecondary,
  },
  
  // Security Section
  securitySection: {
    marginBottom: theme.spacing[2],
  },
  securityGrid: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  securityItem: {
    flex: 1,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    backgroundColor: theme.colors.surface,
  },
  securityLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[2],
  },
  securityScoreContainer: {
    alignItems: 'flex-start',
  },
  securityScore: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[1],
  },
  securityStatusGood: {
    color: theme.colors.success,
  },
  securityStatusWarning: {
    color: theme.colors.warning,
  },
  securityStatusDanger: {
    color: theme.colors.error,
  },
  securityProgress: {
    marginTop: theme.spacing[2],
    height: 6,
    borderRadius: 3,
  },
  rolesSection: {
    marginTop: theme.spacing[2],
  },
  
  // Permission Section
  permissionSection: {
    marginBottom: theme.spacing[2],
  },
  permissionsSection: {
    marginBottom: theme.spacing[2],
  },
  permissionsHint: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[3],
    fontStyle: 'italic',
  },
  permissionsButton: {
    alignSelf: 'flex-start',
  },
  permissionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  permissionChip: {
    marginRight: theme.spacing[1],
    marginBottom: theme.spacing[1],
  },
  permissionChipText: {
    fontSize: theme.typography.fontSizes.xs,
  },
  
  // Activity Section
  activitySection: {
    marginBottom: theme.spacing[2],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  activityIcon: {
    marginRight: theme.spacing[3],
  },
  activityText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
  },
  activityTime: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textTertiary,
  },
  
  // Admin Section
  adminSection: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginTop: theme.spacing[4],
  },
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  adminTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing[2],
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing[3],
  },
  adminButton: {
    flex: 1,
    marginHorizontal: theme.spacing[1],
  },
  
  // Actions
  actionsSection: {
    marginTop: theme.spacing[2],
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  actionButton: {
    flex: 1,
    minWidth: 120,
  },
  
  // Error States
  errorContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },
  errorText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },
  
  // Empty States
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },
}); 