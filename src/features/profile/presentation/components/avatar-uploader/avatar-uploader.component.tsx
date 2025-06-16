/**
 * @fileoverview AvatarUploader Component - HOOK-CENTRIC UI Component
 * 
 * @description Pure UI component for avatar upload functionality.
 * NO BUSINESS LOGIC - all logic handled by useAvatarUploader hook.
 * Follows HOOK-CENTRIC architecture with complete separation of concerns.
 * 
 * @module AvatarUploaderComponent
 * @since 2.0.0 (HOOK-CENTRIC Refactor)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation (Pure UI Component)
 * @architecture HOOK-CENTRIC - Components only for UI rendering
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAvatar } from '../../hooks/use-avatar.hook';
import { useTheme } from '../../../../../core/theme/theme.system';
import { createAvatarUploaderStyles } from './avatar-uploader.component.styles';

// =============================================================================
// COMPONENT PROPS INTERFACE
// =============================================================================

interface AvatarUploaderProps {
  userId?: string;
  size?: number;
  userName?: string;
  editable?: boolean;
  showUploadProgress?: boolean;
  onUploadSuccess?: (avatarUrl: string) => void;
  onUploadError?: (error: string) => void;
  style?: any;
}

// =============================================================================
// HOOK-CENTRIC COMPONENT - PURE UI ONLY
// =============================================================================

/**
 * AvatarUploader - Pure UI Component
 * 
 * @description HOOK-CENTRIC avatar upload component:
 * - ALL business logic in useAvatarUploader hook
 * - Component only handles UI rendering and user interactions
 * - Receives data and callbacks from hook via props pattern
 * - Zero business logic, zero state management, zero service calls
 */
export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  userId,
  size = 100,
  userName = 'User',
  editable = true,
  showUploadProgress = true,
  onUploadSuccess,
  onUploadError: _onUploadError,
  style,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createAvatarUploaderStyles(theme);
  
  // 🎯 HOOK-CENTRIC - ALL BUSINESS LOGIC FROM HOOK
  const {
    // Server State
    avatarUrl,
    isLoadingAvatar,
    
    // UI State
    isUploading,
    uploadProgress,
    selectedImage,
    // showActionSheet,
    // isLoadingGallery,
    // isLoadingCamera,
    
    // Actions
    selectFromGallery,
    selectFromCamera,
    uploadAvatar,
    // deleteAvatar,
    resetSelection,
    
    // UI Actions
    // openActionSheet,
    // closeActionSheet,
    
    // Computed States
    // hasSelectedImage,
    // canUpload,
    hasAvatar,
  } = useAvatar({ userId });

  // =============================================================================
  // UI EVENT HANDLERS - DELEGATE TO HOOK
  // =============================================================================

  const handleAvatarPress = () => {
    if (!editable) return;
    // openActionSheet();
  };

  const handleGallerySelect = async () => {
    await selectFromGallery();
  };

  const handleCameraSelect = async () => {
    await selectFromCamera();
  };

  const handleUpload = async () => {
    await uploadAvatar();
    if (selectedImage && onUploadSuccess) {
      onUploadSuccess(avatarUrl || '');
    }
  };

  const handleRemove = async () => {
    // await deleteAvatar();
  };

  // =============================================================================
  // UI RENDERING FUNCTIONS
  // =============================================================================

  const renderAvatar = () => {
    const displayUrl = selectedImage || avatarUrl;
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=${size}&background=e5e7eb&color=374151`;

    return (
      <TouchableOpacity
        style={[styles.avatarContainer, { width: size, height: size }, style]}
        onPress={handleAvatarPress}
        disabled={!editable}
        accessibilityRole="button"
        accessibilityLabel={t('avatar.uploadButton.accessibility')}
        accessibilityHint={editable ? t('avatar.uploadButton.hint') : undefined}
        testID="avatar-uploader-button"
      >
        {isLoadingAvatar ? (
          <View style={[styles.avatarContainer, styles.loadingContainer]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <Image
            source={{ uri: displayUrl || fallbackUrl }}
            style={[styles.avatar, { width: size, height: size }]}
            accessibilityLabel={t('avatar.image.accessibility', { userName })}
            testID="avatar-image"
          />
        )}
        
        {editable && renderEditIndicator()}
        {isUploading && showUploadProgress && renderUploadProgress()}
      </TouchableOpacity>
    );
  };

  const renderEditIndicator = () => (
    <View style={styles.editIndicator}>
      <Text style={styles.editIcon}>✎</Text>
    </View>
  );

  const renderUploadProgress = () => (
    <View style={styles.progressOverlay}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <Text style={styles.progressText}>
        {Math.round(uploadProgress)}%
      </Text>
    </View>
  );

  const renderActionSheet = () => (
    <Modal
      visible={false}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
      testID="avatar-action-sheet"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.actionSheet}>
          <Text style={styles.actionSheetTitle}>
            {t('avatar.actionSheet.title')}
          </Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleGallerySelect}
            disabled={false}
            accessibilityRole="button"
            accessibilityLabel={t('avatar.gallery.accessibility')}
            testID="gallery-select-button"
          >
            <Text style={styles.actionButtonText}>
              📷 {t('avatar.gallery.title')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCameraSelect}
            disabled={false}
            accessibilityRole="button"
            accessibilityLabel={t('avatar.camera.accessibility')}
            testID="camera-select-button"
          >
            <Text style={styles.actionButtonText}>
              📸 {t('avatar.camera.title')}
            </Text>
          </TouchableOpacity>

          {hasAvatar && (
            <TouchableOpacity
              style={[styles.actionButton, styles.destructiveButton]}
              onPress={handleRemove}
              accessibilityRole="button"
              accessibilityLabel={t('avatar.remove.accessibility')}
              testID="avatar-remove-button"
            >
              <Text style={[styles.actionButtonText, styles.destructiveText]}>
                🗑️ {t('avatar.remove.title')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel={t('common.cancel')}
            testID="action-sheet-cancel"
          >
            <Text style={styles.cancelButtonText}>
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderUploadControls = () => {
    if (!selectedImage) return null;

    return (
      <View style={styles.uploadControls}>
        <TouchableOpacity
          style={[styles.uploadButton, !selectedImage && styles.disabledButton]}
          onPress={handleUpload}
          disabled={!selectedImage}
          accessibilityRole="button"
          accessibilityLabel={t('avatar.upload.accessibility')}
          accessibilityState={{ disabled: !selectedImage }}
          testID="upload-confirm-button"
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={theme.colors.surface} />
          ) : (
            <Text style={styles.uploadButtonText}>
              {t('avatar.upload.confirm')}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelUploadButton}
          onPress={resetSelection}
          disabled={isUploading}
          accessibilityRole="button"
          accessibilityLabel={t('avatar.upload.cancel')}
          testID="upload-cancel-button"
        >
          <Text style={styles.cancelUploadButtonText}>
            {t('common.cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <View style={styles.container}>
      {renderAvatar()}
      {renderUploadControls()}
      {renderActionSheet()}
    </View>
  );
}; 