/**
 * @fileoverview Update Profile Use Case - Test Stub
 * Minimal implementation for testing purposes
 */

export interface UpdateProfileInput {
  userId: string | undefined;
  updates: any;
  auditReason?: string;
}

export interface UpdateProfileResult {
  success: boolean;
  data: any;
  error: string | null;
}

export class UpdateProfileUseCase {
  async execute(input: UpdateProfileInput): Promise<UpdateProfileResult> {
    if (!input.userId) {
      return {
        success: false,
        data: null,
        error: 'User ID is required for profile update',
      };
    }

    // Test stub - always return success with mock data
    return {
      success: true,
      data: {
        id: input.userId,
        ...input.updates,
        updatedAt: new Date().toISOString(),
      },
      error: null,
    };
  }
}
