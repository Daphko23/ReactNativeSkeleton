/**
 * Avatar Services Container - Enterprise Edition
 * Dependency Injection container for avatar-related services
 */

import { IAvatarService, IImagePickerService } from '../../domain/interfaces/avatar.interface';
import { AvatarService } from '../services/avatar.service';
import { ImagePickerService } from '../services/image-picker.service';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('AvatarContainer');

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

      logger.info('Avatar services initialized successfully', LogCategory.BUSINESS, {
        metadata: { 
          serviceName: 'AvatarContainer',
          components: ['AvatarService', 'ImagePickerService']
        }
      });
    } catch (error) {
      logger.error('Failed to initialize avatar services', LogCategory.BUSINESS, {}, error as Error);
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
      logger.error('Failed to validate avatar URL', LogCategory.BUSINESS, {
        metadata: { testUrl: url }
      }, error as Error);
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
      
      const correlationId = `connectivity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Testing avatar storage connectivity', LogCategory.BUSINESS, {
        correlationId,
        metadata: { testUrl: defaultUrl }
      });
      
      // Test basic URL accessibility
      const response = await fetch(defaultUrl, { method: 'HEAD' });
      const isAccessible = response.ok;
      
      if (isAccessible) {
        logger.info('Avatar storage connectivity test passed', LogCategory.BUSINESS, {
          correlationId,
          metadata: { 
            testUrl: defaultUrl,
            responseStatus: response.status
          }
        });
        return { success: true };
      } else {
        logger.warn('Avatar storage connectivity test failed', LogCategory.BUSINESS, {
          correlationId,
          metadata: { 
            testUrl: defaultUrl,
            responseStatus: response.status
          }
        });
        return {
          success: false,
          error: `Default avatar URL returned status ${response.status}`
        };
      }
    } catch (error: any) {
      logger.error('Avatar storage connectivity test exception', LogCategory.BUSINESS, {
        metadata: {
          correlationId: `connectivity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          testUrl: 'default'
        }
      }, error as Error);
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