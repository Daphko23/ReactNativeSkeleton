import { StyleSheet } from 'react-native';

/**
 * Styles for AvatarUploader component
 * 
 * @description Theme-aware styles for the avatar uploader component providing
 * comprehensive styling for avatar display, upload functionality, progress indicators,
 * action sheets, and accessibility features. Supports enterprise-grade avatar
 * management UI patterns with full modal interaction support.
 * 
 * @param theme - Theme configuration object with colors, spacing, typography, etc.
 * @returns StyleSheet object with all component styles
 * 
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */
export const createAvatarUploaderStyles = (theme: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: {
    borderRadius: 50,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.outline,
  },
  editIndicator: {
    position: 'absolute',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  editIcon: {
    fontSize: theme.typography.fontSizes.xs,
  },
  progressText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[1],
  },
  errorText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.error,
    marginTop: theme.spacing[1],
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing[5],
    paddingHorizontal: theme.spacing[4],
  },
  actionSheetTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    textAlign: 'center',
    marginBottom: theme.spacing[5],
    color: theme.colors.text,
  },
  actionButton: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  actionButtonText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: theme.colors.errorContainer,
  },
  deleteButtonText: {
    color: theme.colors.error,
  },
  cancelButton: {
    backgroundColor: theme.colors.outline,
    marginTop: theme.spacing[2],
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.semibold,
  },
}); 