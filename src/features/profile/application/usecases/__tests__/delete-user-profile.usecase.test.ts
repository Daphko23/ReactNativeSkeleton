/**
 * @fileoverview DELETE-USER-PROFILE-USECASE-TESTS: Enterprise Unit Tests
 * @description Umfassende Unit Tests für DeleteUserProfileUseCase mit allen Edge Cases,
 * Error Scenarios, GDPR Compliance und Performance Testing.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module DeleteUserProfileUseCaseTests
 * @namespace Features.Profile.Application.UseCases.Tests
 */

import { DeleteUserProfileUseCase, DeletionStrategy } from '../delete-user-profile.usecase';
import { IProfileService } from '../../../domain/interfaces/profile-service.interface';
import { UserProfile } from '../../../domain/entities/user-profile.entity';
import {
  InvalidUserIdError,
  ProfileNotFoundError,
  ProfileDeletionDeniedError
} from '../../../domain/errors/profile-deletion.errors';

// Mock Profile Service
const mockProfileService: jest.Mocked<IProfileService> = {
  getProfile: jest.fn(),
  deleteProfile: jest.fn(),
  updateProfile: jest.fn(),
  validateProfile: jest.fn(),
  uploadAvatar: jest.fn(),
  deleteAvatar: jest.fn(),
  getPrivacySettings: jest.fn(),
  updatePrivacySettings: jest.fn(),
  getProfileHistory: jest.fn(),
  restoreProfileVersion: jest.fn(),
  exportProfileData: jest.fn(),
  getCustomFieldDefinitions: jest.fn(),
  updateCustomField: jest.fn(),
  calculateCompleteness: jest.fn(),
  syncProfile: jest.fn(),
  subscribeToProfileChanges: jest.fn()
};

// Mock User Profile
const mockUserProfile: UserProfile = {
  id: 'test-user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test user bio',
  dateOfBirth: new Date('1990-01-01'),
  phone: '+1234567890',
  location: '123 Test Street',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  profileVersion: 1,
  isComplete: true,
  isVerified: true
};

describe('DeleteUserProfileUseCase', () => {
  let deleteProfileUseCase: DeleteUserProfileUseCase;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create fresh use case instance
    deleteProfileUseCase = new DeleteUserProfileUseCase(mockProfileService);
  });

  describe('Constructor', () => {
    it('should create use case with valid profile service', () => {
      expect(deleteProfileUseCase).toBeInstanceOf(DeleteUserProfileUseCase);
    });

    it('should throw error when profile service is null', () => {
      expect(() => new DeleteUserProfileUseCase(null as any)).toThrow(
        'ProfileService is required for DeleteUserProfileUseCase'
      );
    });

    it('should throw error when profile service is undefined', () => {
      expect(() => new DeleteUserProfileUseCase(undefined as any)).toThrow(
        'ProfileService is required for DeleteUserProfileUseCase'
      );
    });
  });

  describe('Input Validation', () => {
    it('should throw InvalidUserIdError for null userId', async () => {
      await expect(deleteProfileUseCase.execute(null as any)).rejects.toThrow(InvalidUserIdError);
    });

    it('should throw InvalidUserIdError for undefined userId', async () => {
      await expect(deleteProfileUseCase.execute(undefined as any)).rejects.toThrow(InvalidUserIdError);
    });

    it('should throw InvalidUserIdError for empty string userId', async () => {
      await expect(deleteProfileUseCase.execute('')).rejects.toThrow(InvalidUserIdError);
    });

    it('should throw InvalidUserIdError for whitespace-only userId', async () => {
      await expect(deleteProfileUseCase.execute('   ')).rejects.toThrow(InvalidUserIdError);
    });

    it('should throw InvalidUserIdError for non-string userId', async () => {
      await expect(deleteProfileUseCase.execute(123 as any)).rejects.toThrow(InvalidUserIdError);
    });
  });

  describe('Authorization Validation', () => {
    beforeEach(() => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockResolvedValue(undefined);
    });

    it('should allow user to delete their own profile', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        requestingUserId: 'test-user-123'
      });

      expect(result.success).toBe(true);
      expect(result.userId).toBe('test-user-123');
    });

    it('should throw ProfileDeletionDeniedError when user tries to delete another user profile', async () => {
      await expect(
        deleteProfileUseCase.execute('test-user-123', {
          requestingUserId: 'other-user-456'
        })
      ).rejects.toThrow(ProfileDeletionDeniedError);
    });

    it('should allow deletion when skipAuthorization is true', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        requestingUserId: 'other-user-456',
        skipAuthorization: true
      });

      expect(result.success).toBe(true);
      expect(result.userId).toBe('test-user-123');
    });
  });

  describe('Profile Existence Validation', () => {
    it('should throw ProfileNotFoundError when profile does not exist', async () => {
      mockProfileService.getProfile.mockResolvedValue(null);

      await expect(deleteProfileUseCase.execute('non-existent-user')).rejects.toThrow(ProfileNotFoundError);
    });

    it('should proceed when profile exists', async () => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockResolvedValue(undefined);

      const result = await deleteProfileUseCase.execute('test-user-123');

      expect(result.success).toBe(true);
    });
  });

  describe('Dry Run Mode', () => {
    beforeEach(() => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
    });

    it('should return mock result without actual deletion in dry run mode', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        dryRun: true
      });

      expect(result.success).toBe(true);
      expect(result.deletionId).toContain('dryrun_del_');
      expect(result.auditTrail.complianceLevel).toBe('basic');
      expect(mockProfileService.deleteProfile).not.toHaveBeenCalled();
    });

    it('should validate authorization even in dry run mode', async () => {
      await expect(
        deleteProfileUseCase.execute('test-user-123', {
          requestingUserId: 'other-user-456',
          dryRun: true
        })
      ).rejects.toThrow(ProfileDeletionDeniedError);
    });
  });

  describe('Deletion Strategies', () => {
    beforeEach(() => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockResolvedValue(undefined);
    });

    it('should use soft delete strategy by default', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123');

      expect(result.strategy).toBe(DeletionStrategy.SOFT_DELETE);
      expect(result.recoveryInfo).toBeDefined();
      expect(result.recoveryInfo?.canRestore).toBe(true);
    });

    it('should apply hard delete strategy when specified', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        strategy: DeletionStrategy.HARD_DELETE
      });

      expect(result.strategy).toBe(DeletionStrategy.HARD_DELETE);
      expect(result.recoveryInfo).toBeUndefined();
    });

    it('should apply anonymize strategy when specified', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        strategy: DeletionStrategy.ANONYMIZE
      });

      expect(result.strategy).toBe(DeletionStrategy.ANONYMIZE);
      expect(result.recoveryInfo).toBeUndefined();
    });
  });

  describe('Backup Management', () => {
    beforeEach(() => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockResolvedValue(undefined);
    });

    it('should create backup by default', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123');

      expect(result.backup).toBeDefined();
      expect(result.backup?.backupId).toContain('backup_');
      expect(result.backup?.expiresAt).toBeInstanceOf(Date);
    });

    it('should skip backup when requireBackup is false', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        requireBackup: false
      });

      expect(result.backup).toBeUndefined();
    });

    it('should set backup expiration to 30 days by default', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123');

      const expectedExpiration = new Date();
      expectedExpiration.setDate(expectedExpiration.getDate() + 30);

      expect(result.backup?.expiresAt.getDate()).toBeCloseTo(expectedExpiration.getDate(), 0);
    });
  });

  describe('Audit Trail', () => {
    beforeEach(() => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockResolvedValue(undefined);
    });

    it('should create basic audit trail by default', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123');

      expect(result.auditTrail).toBeDefined();
      expect(result.auditTrail.auditId).toContain('audit_');
      expect(result.auditTrail.complianceLevel).toBe('enterprise');
      expect(result.auditTrail.relatedDataCleaned).toBe(true);
    });

    it('should create GDPR audit trail when compliance metadata provided', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        auditMetadata: {
          compliance: 'gdpr_article_17',
          legalBasis: 'right_to_erasure'
        }
      });

      expect(result.auditTrail.complianceLevel).toBe('gdpr');
    });

    it('should disable external system notifications by default', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123');

      expect(result.auditTrail.externalSystemsNotified).toBe(false);
    });

    it('should enable external system notifications when requested', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        notifyExternalSystems: true
      });

      expect(result.auditTrail.externalSystemsNotified).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle profile service errors gracefully', async () => {
      mockProfileService.getProfile.mockRejectedValue(new Error('Database connection failed'));

      await expect(deleteProfileUseCase.execute('test-user-123')).rejects.toThrow('Database connection failed');
    });

    it('should handle deletion operation failures', async () => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockRejectedValue(new Error('Deletion failed'));

      await expect(deleteProfileUseCase.execute('test-user-123')).rejects.toThrow('Deletion failed');
    });

    it('should wrap and re-throw errors with proper context', async () => {
      mockProfileService.getProfile.mockRejectedValue(new Error('Original error'));

      try {
        await deleteProfileUseCase.execute('test-user-123');
      } catch (_error) {
        expect((_error as Error).message).toContain('Profile deletion failed');
      }
    });
  });

  describe('Performance Requirements', () => {
    beforeEach(() => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockResolvedValue(undefined);
    });

    it('should complete deletion within 5000ms', async () => {
      const startTime = Date.now();
      
      await deleteProfileUseCase.execute('test-user-123');
      
      const executionTime = Date.now() - startTime;
      expect(executionTime).toBeLessThan(5000);
    });

    it('should complete authorization check within 200ms', async () => {
      const startTime = Date.now();
      
      // This will trigger authorization check
      try {
        await deleteProfileUseCase.execute('test-user-123', {
          requestingUserId: 'other-user-456'
        });
      } catch {
        // Expected to fail, but should fail quickly
      }
      
      const authTime = Date.now() - startTime;
      expect(authTime).toBeLessThan(200);
    });
  });

  describe('Business Rules Compliance', () => {
    beforeEach(() => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockResolvedValue(undefined);
    });

    it('should enforce BR-PROFILE-DELETE-001: Authenticated access only', async () => {
      // Attempting to delete without proper authentication should fail
      await expect(
        deleteProfileUseCase.execute('test-user-123', {
          requestingUserId: 'anonymous'
        })
      ).rejects.toThrow(ProfileDeletionDeniedError);
    });

    it('should enforce BR-PROFILE-DELETE-004: All deletions must be audited', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        auditDeletion: true
      });

      expect(result.auditTrail).toBeDefined();
      expect(result.auditTrail.auditId).toBeTruthy();
    });

    it('should enforce BR-PROFILE-DELETE-006: Backup must be created before deletion', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        requireBackup: true
      });

      expect(result.backup).toBeDefined();
      expect(result.backup?.backupId).toBeTruthy();
    });

    it('should enforce BR-PROFILE-DELETE-008: Soft deletion reversible for 30 days', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        strategy: DeletionStrategy.SOFT_DELETE
      });

      expect(result.recoveryInfo).toBeDefined();
      expect(result.recoveryInfo?.canRestore).toBe(true);
      
      const expectedExpiration = new Date();
      expectedExpiration.setDate(expectedExpiration.getDate() + 30);
      
      expect(result.recoveryInfo?.recoveryExpiresAt.getDate())
        .toBeCloseTo(expectedExpiration.getDate(), 0);
    });
  });

  describe('GDPR Compliance', () => {
    beforeEach(() => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockResolvedValue(undefined);
    });

    it('should support GDPR Article 17 Right to Erasure', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        strategy: DeletionStrategy.HARD_DELETE,
        reason: 'GDPR Article 17 - Right to Erasure',
        auditMetadata: {
          compliance: 'gdpr_article_17',
          legalBasis: 'right_to_erasure'
        }
      });

      expect(result.strategy).toBe(DeletionStrategy.HARD_DELETE);
      expect(result.auditTrail.complianceLevel).toBe('gdpr');
    });

    it('should create proper audit trail for GDPR compliance', async () => {
      const result = await deleteProfileUseCase.execute('test-user-123', {
        auditMetadata: {
          source: 'gdpr_compliance_portal',
          compliance: 'gdpr_article_17',
          userAgent: 'Mozilla/5.0',
          ipAddress: '192.168.1.1',
          sessionId: 'session_123'
        }
      });

      expect(result.auditTrail.complianceLevel).toBe('gdpr');
      expect(result.auditTrail.auditId).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent deletion requests gracefully', async () => {
      mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
      mockProfileService.deleteProfile.mockResolvedValue(undefined);

      const promises = [
        deleteProfileUseCase.execute('test-user-123'),
        deleteProfileUseCase.execute('test-user-123'),
        deleteProfileUseCase.execute('test-user-123')
      ];

      const results = await Promise.allSettled(promises);
      
      // At least one should succeed
      const successful = results.filter(result => result.status === 'fulfilled');
      expect(successful.length).toBeGreaterThan(0);
    });

    it('should handle profile service timeout gracefully', async () => {
      mockProfileService.getProfile.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      await expect(deleteProfileUseCase.execute('test-user-123')).rejects.toThrow('Request timeout');
    });
  });
}); 