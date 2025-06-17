/**
 * ProfileRepositoryImpl - Clean Architecture Data Layer
 * Uses DataSource for database operations and maps to domain entities
 * 
 * ✅ NEW: GDPR Audit Integration for Enterprise Compliance
 */

import type { UserProfile, PrivacySettings } from '../../domain/entities/user-profile.entity';
import {
  ProfileDataSource,
  type IProfileDataSource,
  type UserProfileRow,
  type ProfileHistoryRow as _ProfileHistoryRow,
  type ProfileVersionRow
} from '../datasources/profile.datasource';
import { 
  SupabasePrivacySettingsDataSource,
  type IPrivacySettingsDataSource,
  mapPrivacySettingsRowToDomain,
  mapPrivacySettingsDomainToRow
} from '../datasources/privacy-settings.datasource';
import { gdprAuditService } from '@core/compliance/gdpr-audit.service';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Extended interfaces for repository operations
export interface ProfileHistoryItem {
  id: string;
  userId: string;
  fieldName: string;
  oldValue: any;
  newValue: any;
  changeReason?: string;
  changedAt: Date;
  changeType: 'create' | 'update' | 'delete';
  metadata?: Record<string, any>;
}

export interface ProfileVersion {
  id: string;
  userId: string;
  versionNumber: number;
  profileData: UserProfile;
  createdAt: Date;
  isBackup: boolean;
  tags?: string[];
  description?: string;
}

export interface ProfileAnalytics {
  totalProfiles: number;
  activeProfiles: number;
  recentChanges: number;
  popularFields: Array<{
    fieldName: string;
    changeCount: number;
  }>;
  completionRate: number;
}

export interface IProfileRepository {
  // Profile CRUD
  createProfile(userId: string, profile: Omit<UserProfile, 'id'>): Promise<UserProfile>;
  getProfile(userId: string): Promise<UserProfile | null>;
  updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  deleteProfile(userId: string): Promise<boolean>;
  
  // Profile Search
  searchProfiles(query: string, filters?: { role?: string; isActive?: boolean }): Promise<UserProfile[]>;
  
  // History & Versioning
  getProfileHistory(userId: string, limit?: number): Promise<ProfileHistoryItem[]>;
  createProfileVersion(userId: string, description?: string): Promise<ProfileVersion>;
  getProfileVersions(userId: string): Promise<ProfileVersion[]>;
  restoreProfileVersion(userId: string, versionId: string): Promise<UserProfile>;
  
  // Analytics & Statistics
  getProfileAnalytics(): Promise<ProfileAnalytics>;
  
  // Bulk Operations
  bulkUpdateProfiles(updates: Array<{ userId: string; data: Partial<UserProfile> }>): Promise<boolean>;
  exportProfiles(userIds: string[]): Promise<UserProfile[]>;
}

export class ProfileRepositoryImpl implements IProfileRepository {
  private logger = LoggerFactory.createServiceLogger('ProfileRepository');
  private dataSource: IProfileDataSource;
  private privacyDataSource: IPrivacySettingsDataSource;
  private cache: Map<string, any>;
  
  constructor(dataSource?: IProfileDataSource, privacyDataSource?: IPrivacySettingsDataSource) {
    this.dataSource = dataSource || new ProfileDataSource();
    this.privacyDataSource = privacyDataSource || new SupabasePrivacySettingsDataSource();
    this.cache = new Map();
  }

  // =============================================
  // PROFILE CRUD OPERATIONS
  // =============================================

  async createProfile(userId: string, profileData: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    try {
      // Map UserProfile to database format
      const dbProfile: Omit<UserProfileRow, 'created_at' | 'updated_at'> = {
        user_id: userId,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        display_name: profileData.displayName,
        bio: profileData.bio,
        avatar_url: profileData.avatar,
        phone: profileData.phone,
        date_of_birth: profileData.dateOfBirth?.toISOString(),
        location: profileData.location,
        website: profileData.website,
        alternative_email: profileData.email,
        // Social Links
        linkedin_url: profileData.socialLinks?.linkedIn,
        twitter_url: profileData.socialLinks?.twitter,
        github_url: profileData.socialLinks?.github,
        instagram_url: profileData.socialLinks?.instagram,
        // Professional Info
        company: profileData.professional?.company,
        job_title: profileData.professional?.jobTitle,
        industry: profileData.professional?.industry,
        skills: profileData.professional?.skills,
        work_location_preference: profileData.professional?.workLocation,
        experience_years: profileData.professional?.experience === 'entry' ? 0 : 
                         profileData.professional?.experience === 'junior' ? 2 :
                         profileData.professional?.experience === 'mid' ? 5 :
                         profileData.professional?.experience === 'senior' ? 8 : undefined,
        custom_fields: profileData.customFields,
      };

      const result = await this.dataSource.createProfile(dbProfile);
      const newProfile = this.mapToUserProfile(result);
      
      // 🔒 GDPR Audit: Log profile creation (DATA_UPDATE with empty previous)
      await gdprAuditService.logDataUpdate(
        userId,
        ['profile_data'], // dataSubject same as userId for self-creation
        'profile_creation',
        userId,
        {
          correlationId: `profile-create-${Date.now()}`,
          previousProfile: {},
          newProfile
        }
      );
      
      // Cache the new profile
      this.cache.set(`profile:${userId}`, newProfile);
      
      return newProfile;
    } catch (error) {
      this.logger.error('Failed to create profile', LogCategory.BUSINESS, {
        userId,
        metadata: { operation: 'createProfile' }
      }, error as Error);
      throw error;
    }
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const cacheKey = `profile:${userId}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const result = await this.dataSource.getProfileByUserId(userId);
      if (!result) {
        return null;
      }

      const profile = this.mapToUserProfile(result);
      
      // 🔐 LOAD PRIVACY SETTINGS FROM SEPARATE TABLE
      try {
        const privacySettingsRow = await this.privacyDataSource.getPrivacySettings(userId);
        if (privacySettingsRow) {
          profile.privacySettings = mapPrivacySettingsRowToDomain(privacySettingsRow);
        } else {
          // Set default privacy settings if not provided
          profile.privacySettings = {
            profileVisibility: 'friends',
            emailVisibility: 'private',
            phoneVisibility: 'private',
            locationVisibility: 'public',
            socialLinksVisibility: 'public',
            professionalInfoVisibility: 'public',
            showOnlineStatus: true,
            allowDirectMessages: true,
            allowFriendRequests: true,
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
            fieldPrivacy: {}
          };
        }
      } catch {
        this.logger.warn('Failed to load privacy settings, using defaults', LogCategory.BUSINESS, { userId });
        profile.privacySettings = {
          profileVisibility: 'friends',
          emailVisibility: 'private',
          phoneVisibility: 'private',
          locationVisibility: 'public',
          socialLinksVisibility: 'public',
          professionalInfoVisibility: 'public',
          showOnlineStatus: true,
          allowDirectMessages: true,
          allowFriendRequests: true,
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
          fieldPrivacy: {}
        };
      }
      
      // Cache for 10 minutes
      this.cache.set(cacheKey, profile);
      setTimeout(() => this.cache.delete(cacheKey), 10 * 60 * 1000);

      return profile;
    } catch (error) {
      this.logger.error('Failed to get profile', LogCategory.BUSINESS, {
        userId,
        metadata: { operation: 'getProfile' }
      }, error as Error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // Get current profile for history tracking
      const _currentProfile = await this.getProfile(userId);
      
      // 🔐 SEPARATE PRIVACY SETTINGS HANDLING
      if (updates.privacySettings) {
        await this.updatePrivacySettingsSeparately(userId, updates.privacySettings);
      }
      
      // Map domain updates to database updates (WITHOUT privacy settings)
      const dbUpdates: Partial<UserProfileRow> = {
        first_name: updates.firstName,
        last_name: updates.lastName,
        display_name: updates.displayName,
        phone: updates.phone,
        date_of_birth: updates.dateOfBirth?.toISOString(),
        avatar_url: updates.avatar,
        bio: updates.bio,
        location: updates.location,
        website: updates.website,
        alternative_email: updates.email,
        // Social Links - map to individual fields
        linkedin_url: updates.socialLinks?.linkedIn,
        twitter_url: updates.socialLinks?.twitter,
        github_url: updates.socialLinks?.github,
        instagram_url: updates.socialLinks?.instagram,
        // Professional Info - map to individual fields
        company: updates.professional?.company,
        job_title: updates.professional?.jobTitle,
        industry: updates.professional?.industry,
        skills: updates.professional?.skills,
        work_location_preference: updates.professional?.workLocation as 'remote' | 'onsite' | 'hybrid' | undefined,
        experience_years: updates.professional?.experience === 'entry' ? 0 : 
                         updates.professional?.experience === 'junior' ? 2 :
                         updates.professional?.experience === 'mid' ? 5 :
                         updates.professional?.experience === 'senior' ? 8 :
                         updates.professional?.experience === 'lead' ? 12 :
                         updates.professional?.experience === 'executive' ? 15 : undefined,
        custom_fields: updates.customFields
      };

      const result = await this.dataSource.updateProfile(userId, dbUpdates);
      const updatedProfile = this.mapToUserProfile(result);
      
      // Clear cache
      this.cache.delete(`profile:${userId}`);
      
      return updatedProfile;
    } catch (error) {
      this.logger.error('Failed to update profile', LogCategory.BUSINESS, {
        userId,
        metadata: { operation: 'updateProfile', fieldsUpdated: Object.keys(updates) }
      }, error as Error);
      throw error;
    }
  }

  /**
   * 🔐 UPDATE PRIVACY SETTINGS IN SEPARATE TABLE
   */
  private async updatePrivacySettingsSeparately(userId: string, privacySettings: PrivacySettings): Promise<void> {
    try {
      // Check if privacy settings exist
      const existingSettings = await this.privacyDataSource.getPrivacySettings(userId);
      
      // Map domain to database format
      const privacyData = mapPrivacySettingsDomainToRow(privacySettings);
      
      if (existingSettings) {
        // Update existing settings
        await this.privacyDataSource.updatePrivacySettings(userId, privacyData);
      } else {
        // Create new settings
        await this.privacyDataSource.createPrivacySettings(userId, privacyData);
      }
      
      this.logger.info('Privacy settings updated in separate table', LogCategory.BUSINESS, { userId });
    } catch (error) {
      this.logger.error('Failed to update privacy settings in separate table', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async deleteProfile(userId: string): Promise<boolean> {
    try {
      const success = await this.dataSource.deleteProfile(userId);
      if (success) {
        this.cache.clear();
      }
      return success;
    } catch (error) {
      this.logger.error('Failed to delete profile', LogCategory.BUSINESS, {
        userId,
        metadata: { operation: 'deleteProfile' }
      }, error as Error);
      return false;
    }
  }

  // =============================================
  // PROFILE SEARCH
  // =============================================

  async searchProfiles(
    query: string, 
    filters?: { role?: string; isActive?: boolean }
  ): Promise<UserProfile[]> {
    try {
      const results = await this.dataSource.searchProfiles(query, filters);
      const profiles = results.map(this.mapToUserProfile);

      // 🔒 GDPR Audit: Log profile search (DATA_ACCESS)
      const searchingUserId = 'system'; // In real app, get from context
      await gdprAuditService.logDataAccess(
        searchingUserId,
        ['firstName', 'lastName', 'displayName', 'professional'], // typically searched fields
        'profile_search',
        searchingUserId,
        {
          correlationId: `profile-search-${Date.now()}`,
          query,
          filters
        }
      );

      return profiles;
    } catch (error) {
      this.logger.error('Failed to search profiles', LogCategory.BUSINESS, {
        metadata: { operation: 'searchProfiles', query, filters }
      }, error as Error);
      throw error;
    }
  }

  // =============================================
  // HISTORY & VERSIONING
  // =============================================

  async getProfileHistory(userId: string, limit: number = 50): Promise<ProfileHistoryItem[]> {
    try {
      const results = await this.dataSource.getProfileHistory(userId, limit);
      return results.map(item => ({
        id: item.id,
        userId: item.user_id,
        fieldName: item.field_name,
        oldValue: item.old_value,
        newValue: item.new_value,
        changeReason: item.change_reason,
        changedAt: new Date(item.changed_at),
        changeType: item.change_type,
        metadata: item.metadata
      }));
    } catch (error) {
      this.logger.error('Error in getProfileHistory', LogCategory.BUSINESS, {
        metadata: { userId, limit, operation: 'getProfileHistory' }
      }, error as Error);
      throw error;
    }
  }

  async createProfileVersion(userId: string, description?: string): Promise<ProfileVersion> {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Get next version number
      const versions = await this.dataSource.getProfileVersions(userId);
      const nextVersion = versions.length > 0 
        ? Math.max(...versions.map(v => v.version_number)) + 1 
        : 1;

      const versionData: Omit<ProfileVersionRow, 'id' | 'created_at'> = {
        user_id: userId,
        version_number: nextVersion,
        description: description || `Version ${nextVersion}`,
        tags: undefined,
        profile_data: profile,
        is_backup: false,
        created_by: undefined
      };

      const result = await this.dataSource.createProfileVersion(versionData);
      
      return {
        id: result.id,
        userId: result.user_id,
        versionNumber: result.version_number,
        profileData: result.profile_data as UserProfile,
        createdAt: new Date(result.created_at),
        isBackup: result.is_backup,
        description: result.description,
        tags: result.tags
      };
    } catch (error) {
      this.logger.error('Error in createProfileVersion', LogCategory.BUSINESS, {
        metadata: { userId, description, operation: 'createProfileVersion' }
      }, error as Error);
      throw error;
    }
  }

  async getProfileVersions(userId: string): Promise<ProfileVersion[]> {
    try {
      const results = await this.dataSource.getProfileVersions(userId);
      return results.map(version => ({
        id: version.id,
        userId: version.user_id,
        versionNumber: version.version_number,
        profileData: version.profile_data as UserProfile,
        createdAt: new Date(version.created_at),
        isBackup: version.is_backup,
        description: version.description,
        tags: version.tags
      }));
    } catch (error) {
      this.logger.error('Error in getProfileVersions', LogCategory.BUSINESS, {
        metadata: { userId, operation: 'getProfileVersions' }
      }, error as Error);
      throw error;
    }
  }

  async restoreProfileVersion(userId: string, versionId: string): Promise<UserProfile> {
    try {
      // Get the version data
      const version = await this.dataSource.getProfileVersion(versionId);
      if (!version) {
        throw new Error('Version not found');
      }

      // Create backup of current profile
      await this.createProfileVersion(userId, 'Backup vor Wiederherstellung');

      // Restore the profile
      const profileData = version.profile_data as UserProfile;
      const restoredProfile = await this.updateProfile(userId, profileData);
      
      return restoredProfile;
    } catch (error) {
      this.logger.error('Error in restoreProfileVersion', LogCategory.BUSINESS, {
        metadata: { userId, versionId, operation: 'restoreProfileVersion' }
      }, error as Error);
      throw error;
    }
  }

  // =============================================
  // ANALYTICS & STATISTICS
  // =============================================

  async getProfileAnalytics(): Promise<ProfileAnalytics> {
    try {
      const stats = await this.dataSource.getProfileStats();
      
      return {
        totalProfiles: stats.totalProfiles,
        activeProfiles: stats.activeProfiles,
        recentChanges: 0, // Could be calculated from history
        popularFields: [], // Could be implemented with more complex query
        completionRate: stats.avgCompletionRate
      };
    } catch (error) {
      this.logger.error('Error in getProfileAnalytics', LogCategory.BUSINESS, {
        metadata: { operation: 'getProfileAnalytics' }
      }, error as Error);
      throw error;
    }
  }

  // =============================================
  // BULK OPERATIONS
  // =============================================

  async bulkUpdateProfiles(
    updates: Array<{ userId: string; data: Partial<UserProfile> }>
  ): Promise<boolean> {
    try {
      for (const update of updates) {
        await this.updateProfile(update.userId, update.data);
      }
      return true;
    } catch (error) {
      this.logger.error('Error in bulkUpdateProfiles', LogCategory.BUSINESS, {
        metadata: { operation: 'bulkUpdateProfiles', updateCount: updates.length }
      }, error as Error);
      return false;
    }
  }

  async exportProfiles(userIds: string[]): Promise<UserProfile[]> {
    try {
      const results = await this.dataSource.getMultipleProfiles(userIds);
      const profiles = results.map(this.mapToUserProfile);

      // 🔒 GDPR Audit: Log bulk profile export (DATA_PORTABILITY)
      const exportingUserId = 'system'; // In real app, get from context
      await gdprAuditService.logDataExport(
        exportingUserId,
        ['profile_data'], // Multiple profiles exported
        'json',
        exportingUserId,
        {
          correlationId: `profile-bulk-export-${Date.now()}`,
          exportedProfiles: profiles
        }
      );

      return profiles;
    } catch (error) {
      this.logger.error('Error in exportProfiles', LogCategory.BUSINESS, {
        metadata: { operation: 'exportProfiles', userIds: userIds.join(','), count: userIds.length }
      }, error as Error);
      throw error;
    }
  }

  // =============================================
  // PRIVATE HELPER METHODS
  // =============================================

  private mapToUserProfile(data: UserProfileRow): UserProfile {
    return {
      id: data.user_id,
      email: data.email || data.alternative_email || '', // Primary email from trigger or alternative
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      displayName: data.display_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      avatar: data.avatar_url,
      bio: data.bio,
      location: data.location,
      website: data.website || data.website_url,
      phone: data.phone || data.phone_number,
      dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
      timeZone: undefined,
      language: undefined,
      currency: undefined,
      theme: undefined,
      notifications: undefined,
      accessibility: undefined,
      socialLinks: {
        linkedIn: data.linkedin_url,
        twitter: data.twitter_url,
        github: data.github_url,
        instagram: data.instagram_url
      },
      professional: {
        company: data.company,
        jobTitle: data.job_title,
        industry: data.industry,
        skills: data.skills,
        workLocation: (data.work_location_preference || data.work_location) as 'remote' | 'onsite' | 'hybrid' | undefined,
        experience: data.experience_years === 0 ? 'entry' : 
                   data.experience_years === 2 ? 'junior' :
                   data.experience_years === 5 ? 'mid' :
                   data.experience_years === 8 ? 'senior' :
                   data.experience_years === 12 ? 'lead' :
                   data.experience_years === 15 ? 'executive' : undefined
      },
      privacySettings: data.privacy_settings as PrivacySettings | undefined,
      customFields: data.custom_fields,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
      lastActiveAt: undefined,
      profileVersion: data.version || 1,
      isComplete: false,
      isVerified: false
    };
  }

  private mapSocialLinksToDb(socialLinks?: any): Record<string, any> {
    if (!socialLinks) return {};
    return socialLinks;
  }

  private mapSocialLinksFromDb(data: Record<string, any>): any {
    return data || {};
  }

  private mapPreferencesToDb(profile: Partial<UserProfile>): Record<string, any> {
    return {
      theme: profile.theme,
      language: profile.language,
      timezone: profile.timeZone,
      currency: profile.currency,
      notifications: profile.notifications,
      accessibility: profile.accessibility
    };
  }

  private mapProfessionalInfoToDb(professional?: any): Record<string, any> {
    if (!professional) return {};
    return professional;
  }

  private mapProfessionalInfoFromDb(data: Record<string, any>): any {
    return data || {};
  }

  private async trackProfileChanges(
    oldProfile: UserProfile, 
    newProfile: UserProfile
  ): Promise<void> {
    const fieldsToTrack = [
      'firstName', 'lastName', 'email', 'phone', 'bio', 
      'location', 'website', 'avatar'
    ];

    for (const field of fieldsToTrack) {
      const oldValue = (oldProfile as any)[field];
      const newValue = (newProfile as any)[field];
      
      if (oldValue !== newValue) {
        await this.dataSource.createProfileHistoryEntry({
          user_id: newProfile.id,
          field_name: field,
          old_value: oldValue,
          new_value: newValue,
          change_type: 'update',
          change_reason: undefined,
          changed_by: undefined,
          changed_from_ip: undefined,
          user_agent: undefined,
          metadata: {}
        });
      }
    }
  }
} 