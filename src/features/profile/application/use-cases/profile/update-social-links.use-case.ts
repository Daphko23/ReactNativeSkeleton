/**
 * @fileoverview UPDATE SOCIAL LINKS USE CASE - Enterprise Industry Standard 2025
 * 
 * @description Use case for updating user social links with validation and security
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

import { Result } from '@core/types/result.type';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import type { SocialLinks as _SocialLinks } from '../../../domain/entities/user-profile.entity';
import type { SocialLink } from '../../../domain/types/social-links.types';
// import type { IProfileRepository } from '../../../domain/interfaces/profile-repository.interface';

const logger = LoggerFactory.createServiceLogger('UpdateSocialLinksUseCase');

/**
 * @interface UpdateSocialLinksRequest
 * @description Request for updating social links
 */
export interface UpdateSocialLinksRequest {
  userId: string;
  socialLinks: SocialLink[];
  visibility?: 'public' | 'friends' | 'private';
}

/**
 * @interface UpdateSocialLinksResponse
 * @description Response from updating social links
 */
export interface UpdateSocialLinksResponse {
  socialLinks: SocialLink[];
  updatedAt: Date;
  success: boolean;
}

/**
 * 🏆 CHAMPION USE CASE: Update Social Links
 * 
 * ✅ ENTERPRISE PATTERNS:
 * - Single Responsibility: Social links update only
 * - Input Validation: Comprehensive validation
 * - Error Handling: Detailed error responses
 * - Audit Logging: Complete operation tracking
 * - Security: URL validation and sanitization
 */
export class UpdateSocialLinksUseCase {
  constructor(
    private readonly profileRepository: any
  ) {}

  /**
   * Execute social links update
   */
  async execute(request: UpdateSocialLinksRequest): Promise<Result<UpdateSocialLinksResponse>> {
    const correlationId = `update_social_links_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Starting social links update (Champion)', LogCategory.BUSINESS, {
      correlationId,
      metadata: {
        userId: request.userId,
        linksCount: request.socialLinks.length,
        visibility: request.visibility
      }
    });

    try {
      // Validate request
      const validationResult = this.validateRequest(request);
      if (!validationResult.success) {
        logger.warn('Social links update validation failed (Champion)', LogCategory.BUSINESS, {
          correlationId,
          metadata: { errors: validationResult.data }
        });
        return Result.error(validationResult.data?.join(', ') || 'Validation failed');
      }

      // Sanitize social links
      const sanitizedLinks = this.sanitizeSocialLinks(request.socialLinks);

      // Update social links via repository
      const updateResult = await this.profileRepository.updateSocialLinks(
        request.userId,
        sanitizedLinks,
        request.visibility
      );

      if (!updateResult.success) {
        logger.error('Social links repository update failed (Champion)', LogCategory.BUSINESS, {
          correlationId,
          metadata: { error: updateResult.error }
        });
        return Result.error(updateResult.error || 'Failed to update social links');
      }

      const response: UpdateSocialLinksResponse = {
        socialLinks: updateResult.data,
        updatedAt: new Date(),
        success: true,
      };

      logger.info('Social links updated successfully (Champion)', LogCategory.BUSINESS, {
        correlationId,
        metadata: {
          userId: request.userId,
          linksCount: response.socialLinks.length,
          success: true
        }
      });

      return Result.success(response);

    } catch (error) {
      logger.error('Social links update failed (Champion)', LogCategory.BUSINESS, {
        correlationId,
        metadata: { userId: request.userId }
      }, error as Error);

      return Result.error('Failed to update social links');
    }
  }

  /**
   * Validate update request
   */
  private validateRequest(request: UpdateSocialLinksRequest): Result<string[]> {
    const errors: string[] = [];

    if (!request.userId) {
      errors.push('User ID is required');
    }

    if (!Array.isArray(request.socialLinks)) {
      errors.push('Social links must be an array');
    }

    // Validate each social link
    request.socialLinks.forEach((link, index) => {
      if (!link.platform) {
        errors.push(`Social link ${index + 1}: Platform is required`);
      }

      if (!link.url) {
        errors.push(`Social link ${index + 1}: URL is required`);
      } else if (!this.isValidURL(link.url)) {
        errors.push(`Social link ${index + 1}: Invalid URL format`);
      }
    });

    // Check for duplicate platforms
    const platforms = request.socialLinks.map(link => link.platform);
    const duplicates = platforms.filter((platform, index) => platforms.indexOf(platform) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate platforms found: ${duplicates.join(', ')}`);
    }

    return errors.length > 0 ? Result.error(errors.join(', ')) : Result.success([]);
  }

  /**
   * Sanitize social links for security
   */
  private sanitizeSocialLinks(socialLinks: SocialLink[]): SocialLink[] {
    return socialLinks.map(link => ({
      ...link,
      url: this.sanitizeURL(link.url),
      displayName: (link as any).displayName ? this.sanitizeText((link as any).displayName) : undefined,
    }));
  }

  /**
   * Validate URL format
   */
  private isValidURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Sanitize URL for security
   */
  private sanitizeURL(url: string): string {
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return '';
      }
      return urlObj.toString();
    } catch {
      return '';
    }
  }

  /**
   * Sanitize text content
   */
  private sanitizeText(text: string): string {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
} 