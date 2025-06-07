/**
 * ProfileServiceImpl - Data Layer
 * Implementation of IProfileService using Repository pattern
 */

import { 
  IProfileService,
  ProfileServiceOptions 
} from '../../domain/interfaces/profile-service.interface';
import { 
  UserProfile, 
  PrivacySettings, 
  ProfileHistoryEntry, 
  ProfileDataExport,
  ProfileValidationResult,
  CustomFieldDefinition 
} from '../../domain/entities/user-profile.entity';
import type { IProfileRepository } from '../repositories/profile.repository.impl';

export class ProfileServiceImpl implements IProfileService {
  private options: ProfileServiceOptions;
  private repository: IProfileRepository;

  constructor(repository: IProfileRepository, options: ProfileServiceOptions = {}) {
    this.repository = repository;
    this.options = {
      enableRealTimeSync: true,
      enableVersioning: true,
      enableAnalytics: false,
      maxVersions: 50,
      compressionLevel: 5,
      ...options,
    };
  }

  async initialize(): Promise<void> {
    console.log('ProfileServiceImpl initialized with options:', this.options);
  }

  // =============================================
  // CORE PROFILE OPERATIONS
  // =============================================

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profile = await this.repository.getProfile(userId);
      if (!profile) {
        // Log info instead of error for missing profiles (normal for new users)
        console.info(`No profile found for user: ${userId}. This is normal for new users.`);
        return null;
      }
      return profile;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // Validate profile data before update
      const validation = await this.validateProfile(profileData);
      if (!validation.isValid) {
        const errors = Object.values(validation.errors).flat().join(', ');
        throw new Error(`Profile validation failed: ${errors}`);
      }

      return await this.repository.updateProfile(userId, profileData);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  async deleteProfile(userId: string, keepAuth: boolean): Promise<void> {
    try {
      await this.repository.deleteProfile(userId);
      console.log(`Profile deleted for user: ${userId}, keepAuth: ${keepAuth}`);
    } catch (error) {
      console.error('Error in deleteProfile:', error);
      throw error;
    }
  }

  // =============================================
  // AVATAR MANAGEMENT
  // =============================================

  async uploadAvatar(userId: string, imageUri: string): Promise<string> {
    try {
      // For now, we'll update the profile with the avatar URL
      // In a real implementation, this would involve file upload to storage
      const profile = await this.repository.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      await this.repository.updateProfile(userId, { avatar: imageUri });
      return imageUri;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      throw error;
    }
  }

  async deleteAvatar(userId: string): Promise<void> {
    try {
      await this.repository.updateProfile(userId, { avatar: undefined });
    } catch (error) {
      console.error('Error in deleteAvatar:', error);
      throw error;
    }
  }

  // =============================================
  // PRIVACY SETTINGS
  // =============================================

  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const profile = await this.repository.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Extract privacy settings from profile or return defaults
      return profile.privacySettings || this.getDefaultPrivacySettings();
    } catch (error) {
      console.error('Error in getPrivacySettings:', error);
      throw error;
    }
  }

  async updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
    try {
      const currentProfile = await this.repository.getProfile(userId);
      if (!currentProfile) {
        throw new Error('Profile not found');
      }

      const currentPrivacySettings = currentProfile.privacySettings || this.getDefaultPrivacySettings();
      const updatedPrivacySettings: PrivacySettings = {
        ...currentPrivacySettings,
        ...settings,
      };

      await this.repository.updateProfile(userId, { 
        privacySettings: updatedPrivacySettings 
      });

      return updatedPrivacySettings;
    } catch (error) {
      console.error('Error in updatePrivacySettings:', error);
      throw error;
    }
  }

  // =============================================
  // PROFILE HISTORY & VERSIONING
  // =============================================

  async getProfileHistory(userId: string): Promise<ProfileHistoryEntry[]> {
    try {
      const historyItems = await this.repository.getProfileHistory(userId);
      
      // Convert repository history items to domain entities
      return historyItems.map(item => ({
        id: item.id,
        profileId: userId,
        version: 1, // TODO: Implement proper versioning
        changes: { [item.fieldName]: { oldValue: item.oldValue, newValue: item.newValue } },
        changedBy: item.userId,
        changedAt: item.changedAt,
        reason: item.changeReason || 'Profile update',
      }));
    } catch (error) {
      console.error('Error in getProfileHistory:', error);
      throw error;
    }
  }

  async restoreProfileVersion(userId: string, versionId: string): Promise<UserProfile> {
    try {
      return await this.repository.restoreProfileVersion(userId, versionId);
    } catch (error) {
      console.error('Error in restoreProfileVersion:', error);
      throw error;
    }
  }

  // =============================================
  // DATA MANAGEMENT
  // =============================================

  async exportProfileData(userId: string, format: 'json' | 'csv' | 'xml'): Promise<ProfileDataExport> {
    try {
      const profile = await this.repository.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      const privacySettings = await this.getPrivacySettings(userId);
      const history = await this.getProfileHistory(userId);
      
      return {
        profile,
        privacySettings,
        history,
        exportedAt: new Date(),
        format,
      };
    } catch (error) {
      console.error('Error in exportProfileData:', error);
      throw error;
    }
  }

  // =============================================
  // VALIDATION
  // =============================================

  async validateProfile(profile: Partial<UserProfile>): Promise<ProfileValidationResult> {
    const errors: Record<string, string[]> = {};
    const warnings: Record<string, string[]> = {};

    // Basic validation
    if (profile.firstName && profile.firstName.length < 2) {
      errors.firstName = ['First name must be at least 2 characters'];
    }
    
    if (profile.lastName && profile.lastName.length < 2) {
      errors.lastName = ['Last name must be at least 2 characters'];
    }
    
    if (profile.email && !this.isValidEmail(profile.email)) {
      errors.email = ['Please enter a valid email address'];
    }
    
    if (profile.website && !this.isValidUrl(profile.website)) {
      errors.website = ['Please enter a valid URL'];
    }
    
    if (profile.bio && profile.bio.length > 500) {
      warnings.bio = ['Bio is quite long, consider shortening it'];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
    };
  }

  // =============================================
  // CUSTOM FIELDS
  // =============================================

  async getCustomFieldDefinitions(): Promise<CustomFieldDefinition[]> {
    // TODO: Implement with repository when custom fields are needed
    return [
      {
        key: 'customField1',
        label: 'Custom Field 1',
        type: 'text',
        required: false,
        privacy: 'public',
        order: 1,
      },
    ];
  }

  async updateCustomField(userId: string, fieldKey: string, value: any): Promise<void> {
    try {
      const profile = await this.repository.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      const customFields = { ...(profile.customFields || {}), [fieldKey]: value };
      await this.repository.updateProfile(userId, { customFields });
    } catch (error) {
      console.error('Error in updateCustomField:', error);
      throw error;
    }
  }

  // =============================================
  // PROFILE COMPLETENESS
  // =============================================

  calculateCompleteness(profile: UserProfile): number {
    const requiredFields = ['firstName', 'lastName', 'email'];
    const optionalFields = ['bio', 'location', 'website', 'phone', 'avatar'];
    
    const completedRequired = requiredFields.filter(
      field => profile[field as keyof UserProfile]
    ).length;
    
    const completedOptional = optionalFields.filter(
      field => profile[field as keyof UserProfile]
    ).length;
    
    const totalWeight = requiredFields.length * 2 + optionalFields.length;
    const completedWeight = completedRequired * 2 + completedOptional;
    
    return Math.round((completedWeight / totalWeight) * 100);
  }

  // =============================================
  // SYNC & REAL-TIME
  // =============================================

  async syncProfile(userId: string): Promise<UserProfile> {
    // Force refresh from repository
    return await this.repository.getProfile(userId) as UserProfile;
  }

  subscribeToProfileChanges(userId: string, _callback: (profile: UserProfile) => void): () => void {
    // TODO: Implement real-time subscription with WebSocket or similar
    console.log('Subscribed to profile changes for user:', userId);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribed from profile changes for user:', userId);
    };
  }

  // =============================================
  // PRIVATE HELPER METHODS
  // =============================================

  private getDefaultPrivacySettings(): PrivacySettings {
    return {
      profileVisibility: 'public',
      emailVisibility: 'private',
      phoneVisibility: 'private',
      locationVisibility: 'public',
      socialLinksVisibility: 'public',
      professionalInfoVisibility: 'public',
      showOnlineStatus: true,
      allowDirectMessages: true,
      allowFriendRequests: true,
      emailNotifications: true,
      pushNotifications: true,
      marketingCommunications: false,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
} 