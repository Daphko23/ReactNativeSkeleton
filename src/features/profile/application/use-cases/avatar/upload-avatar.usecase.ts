/**
 * @fileoverview Upload Avatar Use Case - Test Stub
 * Minimal implementation for testing purposes
 */

export interface UploadAvatarInput {
  userId: string | undefined;
  file: any;
  progressCallback?: (progress: number) => void;
}

export interface UploadAvatarResult {
  success: boolean;
  avatarUrl: string;
  error: string | null;
}

export class UploadAvatarUseCase {
  constructor(dependencies: any = {}) {
    // Test stub - accept dependencies but don't use them
  }

  async execute(input: UploadAvatarInput): Promise<UploadAvatarResult> {
    if (!input.userId) {
      return {
        success: false,
        avatarUrl: '',
        error: 'User ID is required for avatar upload',
      };
    }

    // Test stub - always return success with mock URL
    if (input.progressCallback) {
      input.progressCallback(100);
    }

    return {
      success: true,
      avatarUrl: `https://example.com/avatar/${input.userId}.jpg`,
      error: null,
    };
  }
}
