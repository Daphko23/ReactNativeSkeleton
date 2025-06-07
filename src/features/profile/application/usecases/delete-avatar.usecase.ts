/**
 * Delete Avatar Use Case
 * Handles profile avatar deletion with cleanup
 */

import { avatarService } from '../../data/services/avatar.service';
import { IProfileService } from '../../domain/interfaces/profile-service.interface';

export class DeleteAvatarUseCase {
  constructor(private profileService: IProfileService) {}

  /**
   * Delete user's avatar and cleanup
   */
  async execute(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required for avatar deletion',
        };
      }

      // Delete avatar using service instance
      const deleteResult = await avatarService.deleteAvatar(userId);

      if (!deleteResult.success) {
        return {
          success: false,
          error: deleteResult.error || 'Failed to delete avatar',
        };
      }

      // Update profile to remove avatar reference
      try {
        await this.profileService.deleteAvatar(userId);
      } catch (error) {
        console.warn('Failed to update profile after avatar deletion:', error);
        // Continue with success since storage deletion worked
      }

      return { success: true };
    } catch (error: any) {
      console.error('DeleteAvatarUseCase: Delete failed:', error);
      
      return {
        success: false,
        error: error?.message || 'Delete failed unexpectedly',
      };
    }
  }
} 