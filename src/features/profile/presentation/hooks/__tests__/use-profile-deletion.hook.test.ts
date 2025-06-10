/**
 * @fileoverview useProfileDeletion Hook Tests
 * @description Comprehensive test coverage for profile deletion hook
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

import { render, act } from '@testing-library/react-native';
import React from 'react';

// Custom renderHook implementation for React Native
function renderHook(hook: any) {
  const result: any = { current: undefined };
  
  function TestComponent() {
    result.current = hook();
    return null;
  }
  
  const renderResult = render(React.createElement(TestComponent));
  
  return {
    result,
    rerender: () => renderResult.rerender(React.createElement(TestComponent)),
    unmount: () => renderResult.unmount(),
  };
}

import { useProfileDeletion, ProfileDeletionOptions } from '../use-profile-deletion.hook';
import { DeletionStrategy } from '../../../application/usecases/delete-user-profile.usecase';
import { 
  InvalidUserIdError,
  ProfileNotFoundError,
  ProfileDeletionDeniedError
} from '../../../domain/errors/profile-deletion.errors';

// Mock the profile service
const mockProfileService = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  deleteProfile: jest.fn(),
  uploadAvatar: jest.fn(),
  deleteAvatar: jest.fn(),
  getPrivacySettings: jest.fn(),
  updatePrivacySettings: jest.fn(),
  getProfileHistory: jest.fn(),
  restoreProfileVersion: jest.fn(),
  exportProfileData: jest.fn(),
  validateProfile: jest.fn(),
  getCustomFieldDefinitions: jest.fn(),
  updateCustomField: jest.fn(),
  calculateCompleteness: jest.fn(),
  syncProfile: jest.fn(),
  subscribeToProfileChanges: jest.fn(),
};

// Mock the delete user profile use case
const mockDeleteUserProfileUseCase = {
  execute: jest.fn(),
};

// Mock dependencies
jest.mock('../../../application/usecases/delete-user-profile.usecase', () => ({
  DeleteUserProfileUseCase: jest.fn(() => mockDeleteUserProfileUseCase),
  DeletionStrategy: {
    SOFT_DELETE: 'soft_delete',
    HARD_DELETE: 'hard_delete',
  },
}));

describe('useProfileDeletion Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default successful responses
    mockDeleteUserProfileUseCase.execute.mockResolvedValue({
      success: true,
      deletionId: 'del_test-user-123_1234567890',
      strategy: DeletionStrategy.SOFT_DELETE,
      backupCreated: true,
      recoveryToken: 'recovery_token_123',
      recoveryExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
  });

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      expect(result.current.state.isDeleting).toBe(false);
      expect(result.current.state.isValidating).toBe(false);
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.progress).toEqual({
        step: 'idle',
        percentage: 0,
        message: 'Ready to delete profile'
      });
      expect(result.current.state.currentStep).toBeUndefined();
      expect(result.current.state.deletionResult).toBeNull();
      expect(result.current.state.recoveryInfo).toEqual({
        canRecover: false,
        recoveryToken: null,
        recoveryExpiresAt: null
      });
    });

    it('should provide all required hook functions', () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      expect(typeof result.current.deleteProfile).toBe('function');
      expect(typeof result.current.validateDeletion).toBe('function');
      expect(typeof result.current.cancelDeletion).toBe('function');
      expect(typeof result.current.resetState).toBe('function');
      expect(typeof result.current.canDelete).toBe('function');
      expect(typeof result.current.getDeletionProgress).toBe('function');
      expect(typeof result.current.getEstimatedTimeRemaining).toBe('function');
      expect(typeof result.current.recoverProfile).toBe('function');
      expect(typeof result.current.checkRecoveryStatus).toBe('function');
    });
  });

  describe('Profile Deletion Flow', () => {
    it('should successfully delete profile with default options', async () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      await act(async () => {
        await result.current.deleteProfile('test-user-123');
      });

      expect(mockDeleteUserProfileUseCase.execute).toHaveBeenCalledWith('test-user-123', {
        requestingUserId: 'test-user-123',
        strategy: DeletionStrategy.SOFT_DELETE,
        reason: 'User requested profile deletion',
        requireBackup: true,
        notifyExternalSystems: false,
        skipAuthorization: false,
        keepAuth: false,
        auditDeletion: true,
        auditMetadata: {},
        dryRun: false,
      });

      expect(result.current.state.isDeleting).toBe(false);
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.deletionResult).toBeTruthy();
    });

    it('should update progress through all deletion steps', async () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      await act(async () => {
        await result.current.deleteProfile('test-user-123');
      });

      // Verify that progress was updated during deletion
      expect(result.current.state.progress.percentage).toBeGreaterThan(0);
    });

    it('should handle soft delete strategy with recovery info', async () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      await act(async () => {
        await result.current.deleteProfile('test-user-123', {
          strategy: DeletionStrategy.SOFT_DELETE,
        });
      });

      expect(result.current.state.recoveryInfo).toBeTruthy();
      expect(result.current.state.recoveryInfo?.recoveryToken).toBe(null);
    });

    it('should handle hard delete strategy without recovery info', async () => {
      mockDeleteUserProfileUseCase.execute.mockResolvedValue({
        success: true,
        deletionId: 'del_test-user-123_1234567890',
        strategy: DeletionStrategy.HARD_DELETE,
        backupCreated: true,
        // No recovery info for hard delete
        userId: 'test-user-123',
        deletedAt: new Date(),
        auditTrail: {
          auditId: 'audit_123',
          complianceLevel: 'basic',
          relatedDataCleaned: true,
          externalSystemsNotified: false,
        }
      });

      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      await act(async () => {
        await result.current.deleteProfile('test-user-123', {
          strategy: DeletionStrategy.HARD_DELETE,
        });
      });

      // For hard delete, recovery info should indicate no recovery possible
      expect(result.current.state.recoveryInfo.canRecover).toBe(false);
      expect(result.current.state.recoveryInfo.recoveryToken).toBeNull();
      expect(result.current.state.recoveryInfo.recoveryExpiresAt).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid user ID error', async () => {
      mockDeleteUserProfileUseCase.execute.mockRejectedValue(new InvalidUserIdError('invalid-id'));

      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      await act(async () => {
        try {
          await result.current.deleteProfile('');
        } catch {
          // Expected error
        }
      });

      expect(result.current.state.error).toBeTruthy();
      expect(result.current.state.error?.category).toBe('validation');
      expect(result.current.state.isDeleting).toBe(false);
    });

    it('should handle profile not found error', async () => {
      mockDeleteUserProfileUseCase.execute.mockRejectedValue(new ProfileNotFoundError('non-existent-user'));

      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      await act(async () => {
        try {
          await result.current.deleteProfile('non-existent-user');
        } catch {
          // Expected error
        }
      });

      expect(result.current.state.error).toBeTruthy();
      expect(result.current.state.error?.category).toBe('business');
    });

    it('should handle deletion denied error', async () => {
      mockDeleteUserProfileUseCase.execute.mockRejectedValue(
        new ProfileDeletionDeniedError('test-user-123', 'Insufficient permissions')
      );

      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      await act(async () => {
        try {
          await result.current.deleteProfile('test-user-123');
        } catch {
          // Expected error
        }
      });

      expect(result.current.state.error).toBeTruthy();
      expect(result.current.state.error?.category).toBe('authorization');
    });
  });

  describe('Utility Functions', () => {
    it('should check if user can be deleted', () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      expect(result.current.canDelete('valid-user-id')).toBe(true);
      expect(result.current.canDelete('')).toBe(false);
      // Test with null and undefined properly
      expect(() => result.current.canDelete(null as any)).toThrow();
      expect(() => result.current.canDelete(undefined as any)).toThrow();
    });

    it('should return correct deletion progress', () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      expect(result.current.getDeletionProgress()).toBe(0);
    });

    it('should estimate time remaining correctly', () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      // At 0% progress
      expect(result.current.getEstimatedTimeRemaining()).toBe(0);
    });
  });

  describe('GDPR Compliance', () => {
    it('should handle GDPR deletion with audit metadata', async () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      const gdprOptions: ProfileDeletionOptions = {
        strategy: DeletionStrategy.HARD_DELETE,
        reason: 'GDPR Article 17 - Right to erasure',
        auditMetadata: {
          compliance: 'gdpr_article_17',
          legalBasis: 'Article 17',
          source: 'gdpr_compliance_portal',
        },
        requireBackup: true,
        auditDeletion: true,
      };

      await act(async () => {
        await result.current.deleteProfile('test-user-123', gdprOptions);
      });

      expect(mockDeleteUserProfileUseCase.execute).toHaveBeenCalledWith('test-user-123', {
        requestingUserId: 'test-user-123',
        ...gdprOptions,
        notifyExternalSystems: false,
        skipAuthorization: false,
        keepAuth: false,
        dryRun: false,
      });
    });

    it('should create backup for GDPR compliance', async () => {
      const { result } = renderHook(() => useProfileDeletion(mockProfileService));

      await act(async () => {
        await result.current.deleteProfile('test-user-123', {
          requireBackup: true,
        });
      });

      expect(result.current.state.deletionResult?.backupCreated).toBe(true);
    });
  });
});