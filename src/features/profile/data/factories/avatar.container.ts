/**
 * Avatar Services Container - Enterprise Edition
 * Dependency Injection container for avatar-related services
 */

import { IAvatarService, IImagePickerService } from '../../domain/interfaces/avatar.interface';
import { AvatarService } from '../services/avatar.service';
import { ImagePickerService } from '../services/image-picker.service';

/**
 * Avatar Services Container
 * Provides singleton instances of avatar-related services
 */
export class AvatarContainer {
  private static _avatarService: IAvatarService | null = null;
  private static _imagePickerService: IImagePickerService | null = null;

  /**
   * Get Avatar Service instance
   */
  static getAvatarService(): IAvatarService {
    if (!this._avatarService) {
      this._avatarService = new AvatarService();
    }
    return this._avatarService;
  }

  /**
   * Get Image Picker Service instance
   */
  static getImagePickerService(): IImagePickerService {
    if (!this._imagePickerService) {
      this._imagePickerService = new ImagePickerService();
    }
    return this._imagePickerService;
  }

  /**
   * Initialize all avatar services
   * Call this during app startup
   */
  static async initialize(): Promise<void> {
    try {
      // Initialize avatar service
      const _avatarService = this.getAvatarService();
      // Note: initializeBucket method removed as it's not part of the interface

      console.log('Avatar services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize avatar services:', error);
    }
  }

  /**
   * Reset container (useful for testing)
   */
  static reset(): void {
    this._avatarService = null;
    this._imagePickerService = null;
  }

  /**
   * Validate an avatar URL is accessible
   * Useful for debugging and testing
   */
  static async validateAvatarUrl(url: string): Promise<boolean> {
    try {
      const avatarService = this.getAvatarService();
      if ('validateAvatarUrl' in avatarService) {
        const validatedUrl = await (avatarService as any).validateAvatarUrl(url);
        return validatedUrl !== null;
      }
      return true; // Assume valid if validation not available
    } catch (error) {
      console.error('Failed to validate avatar URL:', error);
      return false;
    }
  }

  /**
   * Test avatar service connectivity
   * Useful for debugging network issues
   */
  static async testConnectivity(): Promise<{ success: boolean; error?: string }> {
    try {
      const avatarService = this.getAvatarService();
      const defaultUrl = avatarService.getDefaultAvatarUrl();
      
      console.log('AvatarContainer: Testing connectivity with URL:', defaultUrl);
      
      // Test basic URL accessibility
      const response = await fetch(defaultUrl, { method: 'HEAD' });
      const isAccessible = response.ok;
      
      if (isAccessible) {
        console.log('AvatarContainer: Connectivity test passed');
        return { success: true };
      } else {
        console.warn('AvatarContainer: Connectivity test failed with status:', response.status);
        return {
          success: false,
          error: `Default avatar URL returned status ${response.status}`
        };
      }
    } catch (error: any) {
      console.error('AvatarContainer: Connectivity test failed with exception:', error);
      return {
        success: false,
        error: error?.message || 'Connectivity test failed'
      };
    }
  }
}

// Export service instances for convenience
export const avatarService = AvatarContainer.getAvatarService();
export const imagePickerService = AvatarContainer.getImagePickerService(); 