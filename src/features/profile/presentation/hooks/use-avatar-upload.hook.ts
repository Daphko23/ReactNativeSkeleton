/**
 * useAvatarUpload Hook - Enterprise Edition
 * Business logic hook for avatar upload functionality
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@features/auth/presentation/hooks';
import { avatarService, imagePickerService } from '../../data/factories/avatar.container';
import { 
  ImagePickerResult, 
  AvatarUploadResult,
  AVATAR_CONSTANTS 
} from '../../domain/interfaces/avatar.interface';

export interface UseAvatarUploadReturn {
  // State
  selectedImage: string | null;
  isUploading: boolean;
  uploadProgress: number;
  isSelecting: boolean;
  
  // Actions
  selectFromCamera: () => Promise<void>;
  selectFromGallery: () => Promise<void>;
  selectFromGalleryWithPath: () => Promise<string | null>;
  uploadAvatar: () => Promise<AvatarUploadResult>;
  uploadAvatarDirect: (imagePath: string) => Promise<AvatarUploadResult>;
  removeAvatar: () => Promise<boolean>;
  setSelectedImage: (imageUri: string | null) => void;
  
  // Utils
  reset: () => void;
  canUpload: boolean;
}

export interface UseAvatarUploadParams {
  initialImage?: string;
  userId?: string; // Optional override für Demo-Zwecke
}

export const useAvatarUpload = (params?: UseAvatarUploadParams | string): UseAvatarUploadReturn => {
  const { user } = useAuth();
  
  // Handle both old and new API
  const { initialImage, userId: overrideUserId } = typeof params === 'string' 
    ? { initialImage: params, userId: undefined }
    : params || {};
  
  // Use override userId if provided, otherwise use auth user id
  const effectiveUserId = overrideUserId || user?.id;
  
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);

  const uploadAvatarDirect = useCallback(async (imagePath: string): Promise<AvatarUploadResult> => {
    if (!imagePath || !effectiveUserId) {
      return {
        success: false,
        error: 'No image path provided or user not authenticated',
      };
    }

    console.log('🔍 uploadAvatarDirect: Starting upload for:', imagePath);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await avatarService.uploadAvatar({
        file: {
          uri: imagePath,
          width: AVATAR_CONSTANTS.DIMENSIONS.width,
          height: AVATAR_CONSTANTS.DIMENSIONS.height,
          mime: 'image/jpeg', // Will be determined by the service
          size: 0, // Will be determined by the service
        },
        userId: effectiveUserId,
        onProgress: (progress: number) => {
          setUploadProgress(progress);
        },
      });

      if (result.success) {
        // Clear selected image on successful upload
        setSelectedImage(null);
      }

      console.log('🔍 uploadAvatarDirect: Upload result:', result);
      return result;

    } catch (error: any) {
      console.log('🔍 uploadAvatarDirect: Upload error:', error);
      return {
        success: false,
        error: error?.message || 'Upload failed',
      };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [effectiveUserId]);

  const selectFromCamera = useCallback(async (): Promise<void> => {
    if (!effectiveUserId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsSelecting(true);
      
      const result: ImagePickerResult = await imagePickerService.openCamera({
        width: AVATAR_CONSTANTS.DIMENSIONS.width,
        height: AVATAR_CONSTANTS.DIMENSIONS.height,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        includeBase64: false,
        quality: AVATAR_CONSTANTS.QUALITY,
        maxFileSize: AVATAR_CONSTANTS.MAX_FILE_SIZE,
      });
      
      setSelectedImage(result.path);
    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        throw error;
      }
    } finally {
      setIsSelecting(false);
    }
  }, [effectiveUserId]);

  const selectFromGallery = useCallback(async (): Promise<void> => {
    if (!effectiveUserId) {
      throw new Error('User not authenticated');
    }

    console.log('🔍 selectFromGallery: Starting, user ID:', effectiveUserId);

    try {
      setIsSelecting(true);
      console.log('🔍 selectFromGallery: Set isSelecting to true');
      
      console.log('🔍 selectFromGallery: Calling imagePickerService.openGallery...');
      const result: ImagePickerResult = await imagePickerService.openGallery({
        width: AVATAR_CONSTANTS.DIMENSIONS.width,
        height: AVATAR_CONSTANTS.DIMENSIONS.height,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        includeBase64: false,
        quality: AVATAR_CONSTANTS.QUALITY,
        maxFileSize: AVATAR_CONSTANTS.MAX_FILE_SIZE,
      });
      
      console.log('🔍 selectFromGallery: Gallery result received:', result.path);
      
      // Setze das Bild für UI-Zwecke UND gib den Pfad zurück
      setSelectedImage(result.path);
      console.log('🔍 selectFromGallery: Selected image set to:', result.path);
      
    } catch (error: any) {
      console.log('🔍 selectFromGallery: Caught error:', error);
      if (error.message !== 'User cancelled image selection') {
        console.log('🔍 selectFromGallery: Throwing error (not cancelled)');
        throw error;
      } else {
        console.log('🔍 selectFromGallery: User cancelled, not throwing');
        return; // Benutzer hat abgebrochen
      }
    } finally {
      console.log('🔍 selectFromGallery: Setting isSelecting to false');
      setIsSelecting(false);
    }
  }, [effectiveUserId]);

  const selectFromGalleryWithPath = useCallback(async (): Promise<string | null> => {
    if (!effectiveUserId) {
      throw new Error('User not authenticated');
    }

    console.log('🔍 selectFromGalleryWithPath: Starting, user ID:', effectiveUserId);

    try {
      setIsSelecting(true);
      console.log('🔍 selectFromGalleryWithPath: Set isSelecting to true');
      
      console.log('🔍 selectFromGalleryWithPath: Calling imagePickerService.openGallery...');
      const result: ImagePickerResult = await imagePickerService.openGallery({
        width: AVATAR_CONSTANTS.DIMENSIONS.width,
        height: AVATAR_CONSTANTS.DIMENSIONS.height,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        includeBase64: false,
        quality: AVATAR_CONSTANTS.QUALITY,
        maxFileSize: AVATAR_CONSTANTS.MAX_FILE_SIZE,
      });
      
      console.log('🔍 selectFromGalleryWithPath: Gallery result received:', result.path);
      
      return result.path; // Gib den Pfad zurück für direkten Upload
      
    } catch (error: any) {
      console.log('🔍 selectFromGalleryWithPath: Caught error:', error);
      if (error.message !== 'User cancelled image selection') {
        console.log('🔍 selectFromGalleryWithPath: Throwing error (not cancelled)');
        throw error;
      } else {
        console.log('🔍 selectFromGalleryWithPath: User cancelled, not throwing');
        return null; // Benutzer hat abgebrochen
      }
    } finally {
      console.log('🔍 selectFromGalleryWithPath: Setting isSelecting to false');
      setIsSelecting(false);
    }
  }, [effectiveUserId]);

  const uploadAvatar = useCallback(async (): Promise<AvatarUploadResult> => {
    if (!selectedImage || !effectiveUserId) {
      return {
        success: false,
        error: 'No image selected or user not authenticated',
      };
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await avatarService.uploadAvatar({
        file: {
          uri: selectedImage,
          width: AVATAR_CONSTANTS.DIMENSIONS.width,
          height: AVATAR_CONSTANTS.DIMENSIONS.height,
          mime: 'image/jpeg', // Will be determined by the service
          size: 0, // Will be determined by the service
        },
        userId: effectiveUserId,
        onProgress: (progress: number) => {
          setUploadProgress(progress);
        },
      });

      if (result.success) {
        // Clear selected image on successful upload
        setSelectedImage(null);
      }

      return result;

    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Upload failed',
      };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedImage, effectiveUserId]);

  const removeAvatar = useCallback(async (): Promise<boolean> => {
    if (!effectiveUserId) {
      return false;
    }

    try {
      const success = await avatarService.deleteAvatar(effectiveUserId);
      
      if (success) {
        setSelectedImage(null);
      }
      
      return success.success;
    } catch (error) {
      console.error('Failed to remove avatar:', error);
      return false;
    }
  }, [effectiveUserId]);

  const reset = useCallback(() => {
    setSelectedImage(null);
    setIsUploading(false);
    setUploadProgress(0);
    setIsSelecting(false);
  }, []);

  const canUpload = Boolean(selectedImage && !isUploading && !isSelecting && effectiveUserId);

  return {
    // State
    selectedImage,
    isUploading,
    uploadProgress,
    isSelecting,
    
    // Actions
    selectFromCamera,
    selectFromGallery,
    selectFromGalleryWithPath,
    uploadAvatar,
    uploadAvatarDirect,
    removeAvatar,
    setSelectedImage,
    
    // Utils
    reset,
    canUpload,
  };
}; 