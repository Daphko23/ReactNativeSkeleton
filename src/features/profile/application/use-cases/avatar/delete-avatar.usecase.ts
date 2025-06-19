/**
 * @fileoverview Delete Avatar Use Case - Test Stub
 * Minimal implementation for testing purposes
 */

export interface DeleteAvatarInput {
  userId: string | undefined;
  auditReason?: string;
}

export interface DeleteAvatarResult {
  success: boolean;
  error: string | null;
}

export class DeleteAvatarUseCase {
  constructor(dependencies: any = {}) {
    // Test stub - accept dependencies but don't use them
  }

  async execute(input: DeleteAvatarInput): Promise<DeleteAvatarResult> {
    if (!input.userId) {
      return {
        success: false,
        error: 'User ID is required for avatar deletion',
      };
    }

    // Test stub - always return success
    return {
      success: true,
      error: null,
    };
  }
}
