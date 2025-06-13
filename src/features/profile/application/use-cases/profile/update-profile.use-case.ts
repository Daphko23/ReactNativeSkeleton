/**
 * @fileoverview Update Profile Use Case
 */

import { UserProfile } from '../../../domain/entities/user-profile.entity';

export type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const Success = <T>(data: T): Result<T, never> => ({ success: true, data });
export const Failure = <E>(error: E): Result<never, E> => ({ success: false, error });

export interface UpdateProfileRequest {
  userId: string;
  updates: Partial<UserProfile>;
  auditReason?: string;
}

export interface UpdateProfileResponse {
  updatedProfile: UserProfile;
  changedFields: string[];
  completenessPercentage: number;
}

export class UpdateProfileUseCase {
  async execute(request: UpdateProfileRequest): Promise<Result<UpdateProfileResponse, string>> {
    try {
      const { userId, updates } = request;

      if (!userId) {
        return Failure('User ID is required for profile update');
      }

      // Mock current profile
      const currentProfile: UserProfile = {
        id: userId,
        firstName: 'Current',
        lastName: 'User',
        displayName: 'Current User',
        email: 'current@example.com',
        bio: 'Current bio',
        avatar: undefined,
        phone: undefined,
        location: undefined,
        website: undefined,
        dateOfBirth: undefined,
        socialLinks: {},
        customFields: {},
        professional: undefined,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
        profileVersion: 1,
        isComplete: false,
        isVerified: false,
      };

      // Apply updates
      const updatedProfile: UserProfile = {
        ...currentProfile,
        ...updates,
        updatedAt: new Date(),
      };

      // Calculate changed fields
      const changedFields = Object.keys(updates);

      // Calculate completeness
      const completenessPercentage = this.calculateCompleteness(updatedProfile);

      return Success({
        updatedProfile,
        changedFields,
        completenessPercentage,
      });

    } catch (error) {
      return Failure(`Profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateCompleteness(profile: UserProfile): number {
    const fields = ['firstName', 'lastName', 'email', 'bio', 'avatar', 'phone', 'location'];
    const filledFields = fields.filter(field => (profile as any)[field]);
    return Math.round((filledFields.length / fields.length) * 100);
  }
} 