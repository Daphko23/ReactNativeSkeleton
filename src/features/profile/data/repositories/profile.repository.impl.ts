/**
 * @fileoverview PROFILE REPOSITORY IMPLEMENTATION - Enterprise Data Layer
 * @description Profile Repository Implementation nach Enterprise Standards
 *
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

import type { ILoggerService } from '@core/logging/logger.service.interface';
import { LogCategory } from '@core/logging/logger.service.interface';
import {
  ProfileDataSource,
  type UserProfileRow,
} from '../datasources/profile.datasource';
import type {
  UserProfile,
  ExperienceLevel,
} from '../../domain/entities/user-profile.entity';

/**
 * Profile Repository Interface
 */
export interface IProfileRepository {
  getProfile(userId: string): Promise<UserProfile | null>;
  updateProfile(userId: string, updates: any): Promise<UserProfile>;
  deleteProfile(userId: string): Promise<void>;
}

/**
 * Profile Repository Implementation with Supabase Integration
 *
 * @description
 * Handles profile data operations using real Supabase DataSource
 * according to Enterprise Standards.
 */
export class ProfileRepositoryImpl implements IProfileRepository {
  private readonly profileDataSource: ProfileDataSource;

  constructor(
    private readonly storageService: any,
    private readonly logger: ILoggerService
  ) {
    // Initialize real Supabase DataSource
    this.profileDataSource = new ProfileDataSource();
  }

  /**
   * Get profile by user ID from Supabase
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      this.logger.info('Getting profile', LogCategory.BUSINESS, {
        metadata: { userId },
      });

      // Get real profile data from Supabase
      const profileRow =
        await this.profileDataSource.getProfileByUserId(userId);

      if (!profileRow) {
        this.logger.info(
          'Profile not found in database',
          LogCategory.BUSINESS,
          {
            metadata: { userId },
          }
        );
        return null;
      }

      // Map database row to domain entity
      const profile: UserProfile = this.mapRowToProfile(profileRow);

      this.logger.info('Profile retrieved successfully', LogCategory.BUSINESS, {
        metadata: { userId },
      });
      return profile;
    } catch (error) {
      this.logger.error('Failed to get profile', LogCategory.BUSINESS, {
        metadata: {
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * Update profile in Supabase
   */
  async updateProfile(userId: string, updates: any): Promise<UserProfile> {
    try {
      this.logger.info('Updating profile', LogCategory.BUSINESS, {
        metadata: { userId, updateFields: Object.keys(updates) },
      });

      // Map domain updates to database row format
      const rowUpdates = this.mapProfileToRowUpdates(updates);

      // Update in Supabase
      const updatedRow = await this.profileDataSource.updateProfile(
        userId,
        rowUpdates
      );

      // Map updated row back to domain entity
      const updatedProfile = this.mapRowToProfile(updatedRow);

      this.logger.info('Profile updated successfully', LogCategory.BUSINESS, {
        metadata: { userId },
      });
      return updatedProfile;
    } catch (error) {
      this.logger.error('Failed to update profile', LogCategory.BUSINESS, {
        metadata: {
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * Delete profile from Supabase
   */
  async deleteProfile(userId: string): Promise<void> {
    try {
      this.logger.info('Deleting profile', LogCategory.BUSINESS, {
        metadata: { userId },
      });

      const success = await this.profileDataSource.deleteProfile(userId);

      if (!success) {
        throw new Error('Failed to delete profile from database');
      }

      this.logger.info('Profile deleted successfully', LogCategory.BUSINESS, {
        metadata: { userId },
      });
    } catch (error) {
      this.logger.error('Failed to delete profile', LogCategory.BUSINESS, {
        metadata: {
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * Map database row to domain entity
   */
  private mapRowToProfile(row: UserProfileRow): UserProfile {
    return {
      id: row.user_id,
      firstName: row.first_name || '',
      lastName: row.last_name || '',
      email: row.email || '',
      displayName:
        row.display_name ||
        `${row.first_name || ''} ${row.last_name || ''}`.trim(),
      bio: row.bio || '',
      phone: row.phone || row.phone_number || '',
      avatar: row.avatar_url || '',
      location: row.location || '',
      website: row.website || row.website_url || '',
      professional: {
        company: row.company || '',
        jobTitle: row.job_title || '',
        industry: row.industry || '',
        workLocation:
          (row.work_location as 'remote' | 'onsite' | 'hybrid') || 'remote',
        experience: (row.experience_years && row.experience_years > 8
          ? 'senior'
          : row.experience_years && row.experience_years > 5
            ? 'mid'
            : row.experience_years && row.experience_years > 2
              ? 'junior'
              : 'entry') as ExperienceLevel,
        skills: row.skills || [],
      },
      socialLinks: {
        linkedIn: row.linkedin_url || '',
        twitter: row.twitter_url || '',
        github: row.github_url || '',
        instagram: row.instagram_url || '',
      },
      customFields: row.custom_fields || {},
      privacySettings: {
        profileVisibility: (row.profile_visibility as any) || 'public',
        emailVisibility: row.show_email ? 'public' : 'private',
        phoneVisibility: row.show_phone ? 'public' : 'private',
        locationVisibility: 'public',
        socialLinksVisibility: row.show_social_links ? 'public' : 'private',
        professionalInfoVisibility: 'public',
        allowDirectMessages: true,
        allowFriendRequests: true,
        showOnlineStatus: true,
        showLastActive: false,
        searchVisibility: true,
        directoryListing: true,
        allowProfileViews: true,
        allowAnalytics: true,
        allowThirdPartySharing: false,
        trackProfileViews: true,
        emailNotifications: true,
        pushNotifications: true,
        marketingCommunications: false,
        ...(row.privacy_settings || {}),
      },
      createdAt: new Date(row.created_at || new Date()),
      updatedAt: new Date(row.updated_at || new Date()),
      profileVersion: row.version || 1,
      isComplete: this.calculateCompleteness(row) >= 80,
      isVerified: false, // Can be added to database schema later
    };
  }

  /**
   * Map domain profile updates to database row format
   */
  private mapProfileToRowUpdates(
    updates: Partial<UserProfile>
  ): Partial<UserProfileRow> {
    const rowUpdates: Partial<UserProfileRow> = {};

    if (updates.firstName !== undefined)
      rowUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) rowUpdates.last_name = updates.lastName;
    if (updates.email !== undefined) rowUpdates.email = updates.email;
    if (updates.displayName !== undefined)
      rowUpdates.display_name = updates.displayName;
    if (updates.bio !== undefined) rowUpdates.bio = updates.bio;
    if (updates.phone !== undefined) rowUpdates.phone = updates.phone;
    if (updates.avatar !== undefined) rowUpdates.avatar_url = updates.avatar;
    if (updates.location !== undefined) rowUpdates.location = updates.location;
    if (updates.website !== undefined) rowUpdates.website = updates.website;

    if (updates.professional) {
      if (updates.professional.company !== undefined)
        rowUpdates.company = updates.professional.company;
      if (updates.professional.jobTitle !== undefined)
        rowUpdates.job_title = updates.professional.jobTitle;
      if (updates.professional.industry !== undefined)
        rowUpdates.industry = updates.professional.industry;
      if (updates.professional.workLocation !== undefined)
        rowUpdates.work_location = updates.professional.workLocation;
      if (updates.professional.experience !== undefined) {
        // Map experience level to years for database storage
        const experienceMap = {
          entry: 1,
          junior: 3,
          mid: 6,
          senior: 9,
          lead: 12,
          executive: 15,
        };
        rowUpdates.experience_years =
          experienceMap[updates.professional.experience] || 1;
      }
      if (updates.professional.skills !== undefined)
        rowUpdates.skills = updates.professional.skills;
    }

    if (updates.socialLinks) {
      if (updates.socialLinks.linkedIn !== undefined)
        rowUpdates.linkedin_url = updates.socialLinks.linkedIn;
      if (updates.socialLinks.twitter !== undefined)
        rowUpdates.twitter_url = updates.socialLinks.twitter;
      if (updates.socialLinks.github !== undefined)
        rowUpdates.github_url = updates.socialLinks.github;
      if (updates.socialLinks.instagram !== undefined)
        rowUpdates.instagram_url = updates.socialLinks.instagram;
    }

    if (updates.customFields !== undefined) {
      rowUpdates.custom_fields = updates.customFields;
    }

    if (updates.privacySettings) {
      rowUpdates.privacy_settings = updates.privacySettings;
      if (updates.privacySettings.profileVisibility !== undefined) {
        rowUpdates.profile_visibility =
          updates.privacySettings.profileVisibility;
      }
      if (updates.privacySettings.emailVisibility !== undefined) {
        rowUpdates.show_email =
          updates.privacySettings.emailVisibility === 'public';
      }
      if (updates.privacySettings.phoneVisibility !== undefined) {
        rowUpdates.show_phone =
          updates.privacySettings.phoneVisibility === 'public';
      }
      if (updates.privacySettings.socialLinksVisibility !== undefined) {
        rowUpdates.show_social_links =
          updates.privacySettings.socialLinksVisibility === 'public';
      }
    }

    return rowUpdates;
  }

  /**
   * Calculate profile completeness percentage
   */
  private calculateCompleteness(row: UserProfileRow): number {
    const fields = [
      row.first_name,
      row.last_name,
      row.email,
      row.bio,
      row.avatar_url,
      row.phone,
      row.location,
      row.job_title,
      row.company,
      row.linkedin_url,
    ];

    const filledFields = fields.filter(
      field => field && field.trim().length > 0
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  }
}
