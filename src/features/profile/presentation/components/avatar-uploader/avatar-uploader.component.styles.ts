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
  avatarContainer: {
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 50,
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
    bottom: 4,
    right: 4,
  },
  editIcon: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.surface,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  progressText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.surface,
    marginTop: theme.spacing[1],
    fontWeight: 'bold',
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
  destructiveButton: {
    backgroundColor: theme.colors.errorContainer,
  },
  destructiveText: {
    color: theme.colors.error,
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
  uploadControls: {
    marginTop: theme.spacing[4],
    width: '100%',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
    minWidth: 120,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  disabledButton: {
    backgroundColor: theme.colors.outline,
    opacity: 0.6,
  },
  cancelUploadButton: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  cancelUploadButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.sm,
  },
}); 