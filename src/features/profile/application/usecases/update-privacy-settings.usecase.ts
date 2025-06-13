/**
 * Update Privacy Settings Use Case - Application Layer
 * Handles the business logic for privacy settings updates
 * 
 * ✅ OPTIMIZED: Direct Repository usage instead of redundant Service layer
 * ✅ GDPR Audit Integration for Enterprise Compliance
 */

import { IProfileRepository } from '../../data/repositories/profile.repository.impl';
import { PrivacySettings } from '../../domain/entities/user-profile.entity';
import { gdprAuditService } from '@core/compliance/gdpr-audit.service';

export class UpdatePrivacySettingsUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  /**
   * Update privacy settings with business logic validation
   */
  async execute(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
    try {
      // 🎯 BUSINESS LOGIC: Validate privacy settings before update
      this.validatePrivacySettings(settings);

      // Get current profile
      const currentProfile = await this.profileRepository.getProfile(userId);
      if (!currentProfile) {
        throw new Error('Profile not found');
      }

      // Merge with existing privacy settings
      const updatedSettings: PrivacySettings = {
        // Default privacy settings
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
        fieldPrivacy: {},
        // Override with existing settings
        ...currentProfile.privacySettings,
        // Override with new settings
        ...settings
      };

      // Update profile with new privacy settings
      const updatedProfile = await this.profileRepository.updateProfile(userId, {
        privacySettings: updatedSettings
      });

      // 🔒 GDPR Audit: Log privacy settings update
      await gdprAuditService.logDataUpdate(
        userId,
        ['privacy_settings'],
        'privacy_settings_update',
        userId,
        {
          correlationId: `update-privacy-usecase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          previousSettings: currentProfile.privacySettings,
          newSettings: updatedSettings
        }
      );

      return updatedProfile.privacySettings!;
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      throw new Error('Unable to update privacy settings');
    }
  }

  /**
   * 🎯 BUSINESS LOGIC: Privacy settings validation
   */
  private validatePrivacySettings(settings: Partial<PrivacySettings>): void {
    // Business rule: Profile visibility cannot be more restrictive than email visibility
    if (settings.profileVisibility === 'public' && settings.emailVisibility === 'private') {
      // This is allowed - email can be private while profile is public
    }

    // Business rule: If analytics are disabled, third party sharing must also be disabled
    if (settings.allowAnalytics === false && settings.allowThirdPartySharing === true) {
      throw new Error('Third party sharing cannot be enabled when analytics are disabled');
    }

    // Business rule: Marketing communications require email notifications
    if (settings.marketingCommunications === true && settings.emailNotifications === false) {
      throw new Error('Email notifications must be enabled for marketing communications');
    }
  }
} 