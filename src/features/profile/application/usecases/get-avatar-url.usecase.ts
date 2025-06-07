/**
 * Get Avatar URL Use Case
 * Handles retrieving user avatar URL with fallback logic
 */

import { avatarService } from '../../data/services/avatar.service';
import { AvatarUrlOptions } from '../../domain/interfaces/avatar-business-rules.interface';

export class GetAvatarUrlUseCase {
  private readonly defaultOptions: AvatarUrlOptions = {
    preferThumbnail: false,
    enableThumbnails: true,
    size: 100,
  };

  /**
   * Get avatar URL for user with intelligent fallback
   */
  async execute(userId: string, options?: {
    fallbackToDefault?: boolean;
    generateInitials?: boolean;
    name?: string;
    size?: number;
  }): Promise<string> {
    try {
      if (!userId) {
        return this.getDefaultAvatar(options);
      }

      // Try to get user's uploaded avatar
      const avatarUrl = await avatarService.getAvatarUrl(userId);
      
      if (avatarUrl && avatarUrl !== avatarService.getDefaultAvatarUrl()) {
        return avatarUrl;
      }

      // Fallback logic
      return this.getDefaultAvatar(options);
    } catch (error) {
      console.error('GetAvatarUrlUseCase: Failed to get avatar URL:', error);
      
      // Fallback to default avatar on error
      return avatarService.getDefaultAvatarUrl();
    }
  }

  /**
   * Get appropriate default/fallback avatar
   */
  private getDefaultAvatar(options?: {
    fallbackToDefault?: boolean;
    generateInitials?: boolean;
    name?: string;
    size?: number;
  }): string {
    if (options?.generateInitials && options?.name) {
      return avatarService.generateInitialsAvatar(options.name);
    }

    return avatarService.getDefaultAvatarUrl();
  }

  /**
   * Generate initials avatar with business logic
   */
  generateInitialsAvatar(name: string, _size: number = 100): string {
    // Apply business rules for initials generation
    const cleanName = this.sanitizeName(name);
    return avatarService.generateInitialsAvatar(cleanName);
  }

  /**
   * Generate thumbnail URL based on business rules
   */
  private generateThumbnailUrl(originalUrl: string): string {
    // Business logic for thumbnail URL generation
    if (originalUrl === 'default' || originalUrl.includes('default')) {
      return originalUrl;
    }

    // Simple thumbnail URL generation
    const pathParts = originalUrl.split('.');
    const extension = pathParts.pop();
    const basePath = pathParts.join('.');
    return `${basePath}_thumb.${extension}`;
  }

  /**
   * Sanitize name for initials generation
   */
  private sanitizeName(name: string): string {
    // Business rules for name sanitization
    return name
      .trim()
      .replace(/[^a-zA-ZäöüÄÖÜß\s]/g, '') // Remove special characters except German umlauts
      .replace(/\s+/g, ' ') // Normalize whitespace
      .substring(0, 50); // Limit length
  }
} 