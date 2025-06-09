/**
 * Delete User Profile Use Case - Application Layer
 * Handles the business logic for deleting user profiles
 * 
 * ✅ NEW: GDPR Audit Integration for Enterprise Compliance
 */

import { IProfileService } from '../../domain/interfaces/profile-service.interface';
import { gdprAuditService } from '../../data/services/gdpr-audit.service';

export class DeleteUserProfileUseCase {
  constructor(private profileService: IProfileService) {}

  /**
   * Delete user profile
   */
  async execute(userId: string, keepAuth: boolean = false): Promise<void> {
    try {
      await this.profileService.deleteProfile(userId, keepAuth);

      // 🔒 GDPR Audit: Additional logging at use case level
      await gdprAuditService.logDataAccess(
        userId,
        userId,
        'view',
        ['profile_delete_usecase'],
        {
          correlationId: `delete-profile-usecase-${Date.now()}`
        }
      );
    } catch (error) {
      console.error('Failed to delete user profile:', error);
      throw new Error('Unable to delete profile');
    }
  }
} 