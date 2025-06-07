/**
 * Update Privacy Settings Use Case - Application Layer
 * Handles the business logic for privacy settings updates
 */

import { IProfileService } from '../../domain/interfaces/profile-service.interface';
import { PrivacySettings } from '../../domain/entities/user-profile.entity';

export class UpdatePrivacySettingsUseCase {
  constructor(private profileService: IProfileService) {}

  /**
   * Update privacy settings
   */
  async execute(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
    try {
      return await this.profileService.updatePrivacySettings(userId, settings);
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      throw new Error('Unable to update privacy settings');
    }
  }
} 