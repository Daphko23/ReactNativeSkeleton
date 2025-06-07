/**
 * Delete User Profile Use Case - Application Layer
 * Handles the business logic for deleting user profiles
 */

import { IProfileService } from '../../domain/interfaces/profile-service.interface';

export class DeleteUserProfileUseCase {
  constructor(private profileService: IProfileService) {}

  /**
   * Delete user profile
   */
  async execute(userId: string, keepAuth: boolean = false): Promise<void> {
    try {
      await this.profileService.deleteProfile(userId, keepAuth);
    } catch (error) {
      console.error('Failed to delete user profile:', error);
      throw new Error('Unable to delete profile');
    }
  }
} 