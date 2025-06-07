/**
 * Upload Avatar Use Case - Application Layer
 * Handles the business logic for avatar uploads
 */

import { avatarService } from '../../data/services/avatar.service';
import { IProfileService } from '../../domain/interfaces/profile-service.interface';
import { AvatarBusinessRules } from '../../domain/interfaces/avatar-business-rules.interface';
import type { 
  AvatarUploadOptions, 
  AvatarUploadResult 
} from '../../data/services/avatar.service';

export class UploadAvatarUseCase {
  private static readonly DEFAULT_RULES: AvatarBusinessRules = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    enableThumbnails: true,
    enableMultipleFormats: false,
    compressionQuality: 0.8,
  };

  constructor(
    private profileService: IProfileService,
    private businessRules: AvatarBusinessRules = UploadAvatarUseCase.DEFAULT_RULES
  ) {}

  /**
   * Upload avatar with business logic validation
   */
  async execute(options: AvatarUploadOptions): Promise<AvatarUploadResult> {
    try {
      // Validate required parameters
      if (!options.file) {
        return {
          success: false,
          error: 'File is required for upload',
        };
      }

      if (!options.userId) {
        return {
          success: false,
          error: 'User ID is required for upload',
        };
      }

      // Validate file using service validation
      const validation = avatarService.validateAvatarFile({
        name: options.file.fileName || options.file.uri.split('/').pop() || 'avatar.jpg',
        size: options.file.size || 0,
        type: options.file.mime || '',
        uri: options.file.uri,
      });

      if (!validation.valid) {
        return {
          success: false,
          error: 'File validation failed',
          ...validation
        } as any;
      }

      // Perform upload using service instance
      const uploadResult = await avatarService.uploadAvatar(options);

      // If upload successful, update profile
      if (uploadResult.success && uploadResult.avatarUrl && options.userId) {
        try {
          await this.profileService.uploadAvatar(options.userId, uploadResult.avatarUrl);
        } catch (error) {
          console.warn('Failed to update profile with new avatar URL:', error);
          // Don't fail the upload, just log warning
        }
      }

      return uploadResult;
    } catch (error: any) {
      console.error('UploadAvatarUseCase: Upload failed:', error);
      
      return {
        success: false,
        error: error?.message || 'Upload failed unexpectedly',
      };
    }
  }

  /**
   * Validate avatar upload against business rules
   */
  private validateAvatarUpload(options: AvatarUploadOptions): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // File size validation
    if (options.file.size > this.businessRules.maxFileSize) {
      errors.push(`File size exceeds limit of ${this.businessRules.maxFileSize / (1024 * 1024)}MB`);
    }

    // File type validation
    if (!this.businessRules.allowedTypes.includes(options.file.mime)) {
      errors.push(`File type not allowed. Allowed types: ${this.businessRules.allowedTypes.join(', ')}`);
    }

    // Additional business rules
    if (options.file.size === 0) {
      errors.push('File is empty');
    }

    if (!options.file.fileName || options.file.fileName.trim() === '') {
      errors.push('File name is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Update business rules
   */
  updateBusinessRules(newRules: Partial<AvatarBusinessRules>): void {
    this.businessRules = {
      ...this.businessRules,
      ...newRules,
    };
  }

  /**
   * Get current business rules
   */
  getBusinessRules(): AvatarBusinessRules {
    return { ...this.businessRules };
  }
} 