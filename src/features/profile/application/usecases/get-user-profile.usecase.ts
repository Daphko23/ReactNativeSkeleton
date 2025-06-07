/**
 * Get User Profile Use Case - Application Layer
 * Handles the business logic for retrieving user profiles
 */

import { IProfileService } from '../../domain/interfaces/profile-service.interface';
import { UserProfile } from '../../domain/entities/user-profile.entity';

export class GetUserProfileUseCase {
  constructor(private profileService: IProfileService) {}

  /**
   * Get user profile with business rules applied
   */
  async execute(userId: string): Promise<UserProfile | null> {
    try {
      const profile = await this.profileService.getProfile(userId);
      
      if (!profile) {
        // Profile not found is normal for new users
        return null;
      }

      // Apply business rules (e.g., privacy filtering)
      return this.applyPrivacyRules(profile);
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw new Error('Unable to load profile');
    }
  }

  /**
   * Apply privacy rules to profile data
   */
  private applyPrivacyRules(profile: UserProfile): UserProfile {
    // Business logic for privacy rules could be implemented here
    // For now, return profile as-is
    return profile;
  }
} 