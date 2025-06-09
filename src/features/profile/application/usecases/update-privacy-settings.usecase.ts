/**
 * Update Privacy Settings Use Case - Application Layer
 * Handles the business logic for privacy settings updates
 * 
 * ✅ NEW: GDPR Audit Integration for Enterprise Compliance
 */

import { IProfileService } from '../../domain/interfaces/profile-service.interface';
import { PrivacySettings } from '../../domain/entities/user-profile.entity';
import { gdprAuditService } from '../../data/services/gdpr-audit.service';

export class UpdatePrivacySettingsUseCase {
  constructor(private profileService: IProfileService) {}

  /**
   * Update privacy settings
   */
  async execute(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
    try {
      const result = await this.profileService.updatePrivacySettings(userId, settings);

      // 🔒 GDPR Audit: Additional logging at use case level
      await gdprAuditService.logDataAccess(
        userId,
        userId,
        'view',
        ['privacy_settings_usecase'],
        {
          correlationId: `update-privacy-usecase-${Date.now()}`
        }
      );

      return result;
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      throw new Error('Unable to update privacy settings');
    }
  }
} 