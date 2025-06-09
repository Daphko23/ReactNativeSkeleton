/**
 * Update User Profile Use Case - Application Layer
 * Handles the business logic for updating user profiles
 * 
 * ✅ NEW: GDPR Audit Integration for Enterprise Compliance
 */

import { IProfileService } from '../../domain/interfaces/profile-service.interface';
import { UserProfile } from '../../domain/entities/user-profile.entity';
import { ProfileUpdateData, ProfileValidationResult } from '../../domain/interfaces/profile-update-data.interface';
import { gdprAuditService } from '../../data/services/gdpr-audit.service';

export class UpdateUserProfileUseCase {
  constructor(private profileService: IProfileService) {}

  /**
   * Update user profile with validation
   */
  async execute(userId: string, data: ProfileUpdateData): Promise<UserProfile> {
    // Validate profile data
    const validation = this.validateProfileData(data);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    try {
      // Get current profile
      const currentProfile = await this.profileService.getProfile(userId);
      if (!currentProfile) {
        throw new Error('Profile not found');
      }

      // Merge changes with current profile
      const updatedProfile = this.mergeProfileChanges(currentProfile, data);

      // Update profile using service
      const result = await this.profileService.updateProfile(userId, updatedProfile);

      // 🔒 GDPR Audit: Additional logging at use case level
      await gdprAuditService.logDataAccess(
        userId,
        userId,
        'view',
        ['profile_update_usecase'],
        {
          correlationId: `update-profile-usecase-${Date.now()}`
        }
      );

      return result;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error('Unable to update profile');
    }
  }

  /**
   * Validate profile data with business rules
   */
  private validateProfileData(data: ProfileUpdateData): ProfileValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Email validation
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Invalid email format');
      }
    }

    // Phone validation
    if (data.phone) {
      const phonePattern = /^[+]?[\d\s-()]+$/;
      if (!phonePattern.test(data.phone)) {
        errors.push('Invalid phone number format');
      }
    }

    // Website validation
    if (data.website) {
      try {
        new URL(data.website);
      } catch {
        errors.push('Invalid website URL');
      }
    }

    // Bio length check
    if (data.bio && data.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    // Social links validation
    if (data.socialLinks) {
      Object.entries(data.socialLinks).forEach(([platform, url]) => {
        if (url) {
          try {
            new URL(url);
          } catch {
            errors.push(`Invalid ${platform} URL`);
          }
        }
      });
    }

    // Warnings for incomplete profiles
    if (!data.firstName && !data.lastName) {
      warnings.push('Profile name is incomplete');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Merge profile changes with existing data
   */
  private mergeProfileChanges(current: UserProfile, changes: ProfileUpdateData): Partial<UserProfile> {
    return {
      ...changes,
      socialLinks: {
        ...current.socialLinks,
        ...changes.socialLinks,
      },
      updatedAt: new Date(),
    };
  }

  private validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
} 