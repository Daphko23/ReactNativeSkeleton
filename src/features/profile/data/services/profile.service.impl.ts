/**
 * ProfileServiceImpl - Data Layer
 * Implementation of IProfileService using Repository pattern
 * 
 * ✅ NEW: GDPR Audit Integration for Enterprise Compliance
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
import { gdprAuditService } from './gdpr-audit.service';
import { ProfileObservabilityService } from '../../../../core/monitoring/profile-observability.service';

export class ProfileServiceImpl implements IProfileService {
  private options: ProfileServiceOptions;
  private repository: IProfileRepository;
  private observability: ProfileObservabilityService;

  constructor(repository: IProfileRepository, options: ProfileServiceOptions = {}) {
    this.repository = repository;
    this.observability = new ProfileObservabilityService();
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
    const correlationId = this.observability.startProfileOperation('load', userId);
    
    try {
      const profile = await this.repository.getProfile(userId);
      if (!profile) {
        // Log info instead of error for missing profiles (normal for new users)
        console.info(`No profile found for user: ${userId}. This is normal for new users.`);
        this.observability.endProfileOperation(correlationId, 'success');
        return null;
      }

      // 🔒 GDPR Audit: Log data access
      await gdprAuditService.logDataAccess(
        userId,
        userId, // dataSubject same as userId for self-access
        'read',
        Object.keys(profile), // all profile fields accessed
        {
          correlationId
        }
      );

      this.observability.endProfileOperation(correlationId, 'success', undefined, profile);
      return profile;
    } catch (error) {
      console.error('Error in getProfile:', error);
      this.observability.endProfileOperation(correlationId, 'error', error as Error);
      throw error;
    }
  }

  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const correlationId = this.observability.startProfileOperation('update', userId, { fields: Object.keys(profileData) });
    
    try {
      // Get current profile for GDPR audit comparison
      const currentProfile = await this.repository.getProfile(userId);
      
      // Validate profile data before update
      const validation = await this.validateProfile(profileData);
      if (!validation.isValid) {
        const errors = Object.values(validation.errors).flat().join(', ');
        throw new Error(`Profile validation failed: ${errors}`);
      }

      const updatedProfile = await this.repository.updateProfile(userId, profileData);

      // 🔒 GDPR Audit: Log data update
      if (currentProfile) {
        await gdprAuditService.logDataUpdate(
          userId,
          userId, // dataSubject same as userId for self-update
          currentProfile,
          updatedProfile,
          {
            correlationId
          }
        );
      }

      this.observability.endProfileOperation(correlationId, 'success', undefined, updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      this.observability.endProfileOperation(correlationId, 'error', error as Error);
      throw error;
    }
  }

  async deleteProfile(userId: string, keepAuth: boolean): Promise<void> {
    try {
      // Get current profile for GDPR audit before deletion
      const currentProfile = await this.repository.getProfile(userId);
      
      await this.repository.deleteProfile(userId);
      
      // 🔒 GDPR Audit: Log data deletion
      if (currentProfile) {
        await gdprAuditService.logDataDeletion(
          userId,
          userId, // dataSubject same as userId for self-deletion
          currentProfile,
          'user_request', // deletion type
          {
            correlationId: `profile-delete-${Date.now()}`
          }
        );
      }
      
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
    const correlationId = this.observability.startProfileOperation('avatar_upload', userId, { imageUri });
    
    try {
      // For now, we'll update the profile with the avatar URL
      // In a real implementation, this would involve file upload to storage
      const profile = await this.repository.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      const oldAvatarUrl = profile.avatar;
      await this.repository.updateProfile(userId, { avatar: imageUri });

      // 🔒 GDPR Audit: Log avatar upload (DATA_UPDATE)
      await gdprAuditService.logDataUpdate(
        userId,
        userId, // dataSubject same as userId for self-upload
        { avatar: oldAvatarUrl },
        { avatar: imageUri },
        {
          correlationId
        }
      );

      this.observability.endProfileOperation(correlationId, 'success', undefined, imageUri);
      return imageUri;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      this.observability.endProfileOperation(correlationId, 'error', error as Error);
      throw error;
    }
  }

  async deleteAvatar(userId: string): Promise<void> {
    try {
      // Get current profile for GDPR audit before deletion
      const currentProfile = await this.repository.getProfile(userId);
      const oldAvatarUrl = currentProfile?.avatar;

      await this.repository.updateProfile(userId, { avatar: undefined });

      // 🔒 GDPR Audit: Log avatar deletion (DATA_DELETE)
      if (oldAvatarUrl) {
        await gdprAuditService.logDataDeletion(
          userId,
          userId, // dataSubject same as userId for self-deletion
          { avatar: oldAvatarUrl },
          'user_request', // deletion type
          {
            correlationId: `avatar-delete-${Date.now()}`
          }
        );
      }
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

      // 🔒 GDPR Audit: Log privacy settings update
      await gdprAuditService.logPrivacySettingsUpdate(
        userId,
        userId, // dataSubject same as userId
        currentPrivacySettings,
        updatedPrivacySettings,
        {
          correlationId: `privacy-update-${Date.now()}`
        }
      );

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

      const exportData: ProfileDataExport = {
        profile,
        privacySettings,
        history,
        exportedAt: new Date(),
        format,
      };

      // 🔒 GDPR Audit: Log data export for portability
      await gdprAuditService.logDataExport(
        userId,
        userId, // dataSubject same as userId
        exportData,
        format,
        {
          correlationId: `profile-export-${Date.now()}`
        }
      );

      return exportData;
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
    const socialFields = ['socialLinks']; // Social links as separate category
    const professionalFields = ['professional']; // Professional info as separate category
    
    const completedRequired = requiredFields.filter(
      field => profile[field as keyof UserProfile]
    );
    
    const completedOptional = optionalFields.filter(
      field => profile[field as keyof UserProfile]
    );
    
    const completedSocial = socialFields.filter(field => {
      if (field === 'socialLinks') {
        return profile.socialLinks && Object.keys(profile.socialLinks).length > 0;
      }
      return profile[field as keyof UserProfile];
    });
    
    const completedProfessional = professionalFields.filter(field => {
      if (field === 'professional') {
        return profile.professional && (
          profile.professional.company || 
          profile.professional.jobTitle || 
          profile.professional.industry
        );
      }
      return profile[field as keyof UserProfile];
    });
    
    const totalWeight = requiredFields.length * 3 + optionalFields.length * 2 + socialFields.length * 1 + professionalFields.length * 1;
    const completedWeight = completedRequired.length * 3 + completedOptional.length * 2 + completedSocial.length * 1 + completedProfessional.length * 1;
    
    const percentage = Math.round((completedWeight / totalWeight) * 100);
    
    // Debug logging for completeness calculation
    console.log('🔍 ProfileService - NEW Completeness Debug:');
    console.log('📋 Required Fields (weight x3):', requiredFields);
    console.log('✅ Completed Required:', completedRequired);
    console.log('❌ Missing Required:', requiredFields.filter(f => !completedRequired.includes(f)));
    console.log('📋 Optional Fields (weight x2):', optionalFields);
    console.log('✅ Completed Optional:', completedOptional);
    console.log('❌ Missing Optional:', optionalFields.filter(f => !completedOptional.includes(f)));
    console.log('📋 Social Fields (weight x1):', socialFields);
    console.log('✅ Completed Social:', completedSocial);
    console.log('📋 Professional Fields (weight x1):', professionalFields);
    console.log('✅ Completed Professional:', completedProfessional);
    console.log('📊 Field Values:', {
      firstName: profile.firstName || '❌ MISSING',
      lastName: profile.lastName || '❌ MISSING',
      email: profile.email || '❌ MISSING',
      bio: profile.bio ? `✅ "${profile.bio.substring(0, 50)}..."` : '❌ MISSING',
      location: profile.location || '❌ MISSING',
      website: profile.website || '❌ MISSING',
      phone: profile.phone || '❌ MISSING',
      avatar: profile.avatar ? '✅ HAS_AVATAR' : '❌ MISSING',
      socialLinks: profile.socialLinks ? `✅ HAS_SOCIAL (${Object.keys(profile.socialLinks).length} links)` : '❌ MISSING',
      professional: profile.professional ? '✅ HAS_PROFESSIONAL' : '❌ MISSING'
    });
    console.log('🧮 NEW Calculation:', {
      totalWeight,
      completedWeight,
      percentage,
      formula: `(${completedRequired.length} * 3 + ${completedOptional.length} * 2 + ${completedSocial.length} * 1 + ${completedProfessional.length} * 1) / ${totalWeight} * 100 = ${percentage}%`
    });
    
    return percentage;
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