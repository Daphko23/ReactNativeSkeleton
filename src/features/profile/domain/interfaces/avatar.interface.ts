/**
 * Avatar Domain Interfaces - Enterprise Edition
 * Type definitions for avatar management
 */

export interface AvatarImage {
  uri: string;
  width: number;
  height: number;
  mime: string;
  size: number;
  fileName?: string;
}

export interface AvatarUploadOptions {
  file: AvatarImage;
  userId: string;
  onProgress?: (progress: number) => void;
}

export interface AvatarUploadResult {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

export interface ImagePickerOptions {
  width: number;
  height: number;
  cropping: boolean;
  cropperCircleOverlay: boolean;
  mediaType: 'photo';
  includeBase64: boolean;
  quality?: number;
  maxFileSize?: number;
}

export interface ImagePickerResult {
  path: string;
  width: number;
  height: number;
  mime: string;
  size: number;
  fileName?: string;
}

export interface IAvatarService {
  uploadAvatar(options: AvatarUploadOptions): Promise<AvatarUploadResult>;
  deleteAvatar(userId?: string): Promise<{ success: boolean; error?: string }>;
  getAvatarUrl(userId: string): Promise<string | null>;
  getDefaultAvatarUrl(): string;
  generateInitialsAvatar(name: string): string;
  validateAvatarFile(file: { name: string; size: number; type: string; uri: string }): { valid: boolean; errors: string[] };
}

export interface IImagePickerService {
  openCamera(options: ImagePickerOptions): Promise<ImagePickerResult>;
  openGallery(options: ImagePickerOptions): Promise<ImagePickerResult>;
  checkCameraPermission(): Promise<boolean>;
  requestCameraPermission(): Promise<boolean>;
  checkStoragePermission(): Promise<boolean>;
  requestStoragePermission(): Promise<boolean>;
}

export const AVATAR_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  QUALITY: 0.8,
  DIMENSIONS: {
    width: 400,
    height: 400,
  },
} as const; 