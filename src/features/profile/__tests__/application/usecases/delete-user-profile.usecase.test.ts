/**
 * @fileoverview DELETE-USER-PROFILE-USECASE-TESTS: Enterprise Test Suite Implementation
 * @description Comprehensive test coverage für DeleteUserProfileUseCase mit
 * Enterprise Security Standards, GDPR Compliance Testing und Business Logic Validation.
 * Implementiert Auth Feature Test Patterns für 9/10 Enterprise-Level Coverage.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module DeleteUserProfileUseCaseTests
 * @namespace Features.Profile.Tests.Application.UseCases
 * @category ProfileManagement
 * @subcategory Use Case Tests
 * 
 * @testCategories
 * - **Input Validation Tests:** Parameter validation und sanitization
 * - **Authorization Tests:** Access control und permission validation
 * - **Business Logic Tests:** Profile deletion workflow testing
 * - **Error Handling Tests:** Exception scenarios und error recovery
 * - **GDPR Compliance Tests:** Data deletion und privacy compliance
 * - **Performance Tests:** Deletion operation performance validation
 * - **Integration Tests:** Service integration testing
 * - **Security Tests:** Authorization und audit trail validation
 * 
 * @compliance
 * - **GDPR Article 17:** Right to Erasure testing implementation
 * - **CCPA Section 1798.105:** Consumer data deletion testing
 * - **SOC 2:** Enterprise deletion controls testing
 * - **Enterprise Security:** Authorization und audit compliance
 * 
 * @testingStrategy
 * - **Unit Tests:** Isolated use case testing mit mocked dependencies
 * - **Integration Tests:** Service integration validation
 * - **Security Tests:** Authorization und access control testing
 * - **Performance Tests:** Deletion operation latency validation
 * - **Compliance Tests:** GDPR/CCPA deletion requirements testing
 * 
 * @mockingStrategy
 * - ProfileService Mock für controlled testing environment
 * - Logger Mock für audit trail testing
 * - Error Handler Mock für exception testing
 * - Authorization Mock für access control testing
 * 
 * @since 2025-01-23
 */

import { DeleteUserProfileUseCase } from '../../../application/usecases/delete-user-profile.usecase';
import { IProfileService } from '../../../domain/interfaces/profile-service.interface';
import { UserProfile } from '../../../domain/entities/user-profile.entity';
import { LoggerFactory } from '@core/logging/logger.factory';

// =============================================================================
// TEST MOCKS & SETUP
// =============================================================================

/**
 * Mock Profile Service für controlled testing environment
 */
const createMockProfileService = (): jest.Mocked<IProfileService> => ({
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
});

/**
 * Mock Logger für audit trail testing
 */
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
};

// Mock LoggerFactory
jest.mock('@core/logging/logger.factory', () => ({
  LoggerFactory: {
    createServiceLogger: jest.fn(() => mockLogger),
  },
}));

// =============================================================================
// TEST DATA FACTORIES
// =============================================================================

/**
 * Create mock user profile for testing
 */
const createMockUserProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: 'test-user-123',
  firstName: 'Test',
  lastName: 'User',
  displayName: 'Test User',
  email: 'test@example.com',
  bio: 'Test user biography',
  avatar: 'https://example.com/avatar.jpg',
  dateOfBirth: new Date('1990-01-01'),
  location: 'Test City, Test Country',
  website: 'https://testuser.dev',
  phone: '+1234567890',
  timeZone: 'America/New_York',
  language: 'en',
  socialLinks: {
    linkedIn: 'https://linkedin.com/in/testuser',
    twitter: 'https://twitter.com/testuser',
    github: 'https://github.com/testuser',
  },
  professional: {
    skills: ['JavaScript', 'TypeScript', 'React Native'],
    company: 'Test Corp',
    jobTitle: 'Senior Test Engineer',
    experience: 'senior',
  },
  customFields: {
    department: 'Engineering',
    team: 'Mobile',
  },
  privacySettings: {
    profileVisibility: 'public',
    emailVisibility: 'private',
    phoneVisibility: 'private',
    locationVisibility: 'public',
    socialLinksVisibility: 'public',
    professionalInfoVisibility: 'public',
    showOnlineStatus: true,
    allowDirectMessages: true,
    allowFriendRequests: true,
    emailNotifications: true,
    pushNotifications: true,
    marketingCommunications: false,
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-01'),
  profileVersion: 1,
  isComplete: true,
  isVerified: false,
  ...overrides,
});

// =============================================================================
// MAIN TEST SUITE
// =============================================================================

describe('DeleteUserProfileUseCase', () => {
  let useCase: DeleteUserProfileUseCase;
  let mockProfileService: jest.Mocked<IProfileService>;
  
  // Test data
  const validUserId = 'test-user-123';
  const _validRequestingUserId = 'test-user-123';
  const adminUserId = 'admin-user-456';
  const mockUserProfile = createMockUserProfile();

  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileService = createMockProfileService();
    useCase = new DeleteUserProfileUseCase(mockProfileService);
    
    // Reset mock implementations
    mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
    mockProfileService.deleteProfile.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // CONSTRUCTOR TESTS
  // =============================================================================

  describe('Constructor', () => {
    it('should create instance with valid ProfileService', () => {
      expect(useCase).toBeInstanceOf(DeleteUserProfileUseCase);
    });

    it('should throw error when ProfileService is null', () => {
      expect(() => new DeleteUserProfileUseCase(null as any))
        .toThrow('ProfileService is required for DeleteUserProfileUseCase');
    });

    it('should throw error when ProfileService is undefined', () => {
      expect(() => new DeleteUserProfileUseCase(undefined as any))
        .toThrow('ProfileService is required for DeleteUserProfileUseCase');
    });

    it('should initialize logger correctly', () => {
      expect(LoggerFactory.createServiceLogger).toHaveBeenCalledWith('DeleteUserProfileUseCase');
    });
  });

  // =============================================================================
  // INPUT VALIDATION TESTS
  // =============================================================================

  describe('Input Validation', () => {
    it('should throw error when userId is empty string', async () => {
      await expect(useCase.execute('', {}))
        .rejects.toThrow('Invalid user ID provided');

      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Invalid userId provided to DeleteUserProfileUseCase',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.any(String),
          metadata: expect.objectContaining({
            userId: 'undefined',
            operation: 'delete_profile'
          })
        })
      );
    });

    it('should throw error when userId is null', async () => {
      await expect(useCase.execute(null as any, {}))
        .rejects.toThrow('Invalid user ID provided');

      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should throw error when userId is undefined', async () => {
      await expect(useCase.execute(undefined as any, {}))
        .rejects.toThrow('Invalid user ID provided');

      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should throw error when userId is only whitespace', async () => {
      await expect(useCase.execute('   ', {}))
        .rejects.toThrow('Invalid user ID provided');

      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should accept valid userId', async () => {
      const result = await useCase.execute(validUserId, { dryRun: true });

      expect(result).toBeDefined();
      expect(result.userId).toBe(validUserId);
      expect(result.success).toBe(true);
    });

    it('should handle userId with special characters', async () => {
      const specialUserId = 'user-123_abc@domain.com';
      mockProfileService.getProfile.mockResolvedValue({
        ...mockUserProfile,
        id: specialUserId
      });

      const result = await useCase.execute(specialUserId, { dryRun: true });

      expect(result.userId).toBe(specialUserId);
    });
  });

  // =============================================================================
  // AUTHORIZATION TESTS
  // =============================================================================

  describe('Authorization', () => {
    it('should allow user to delete own profile', async () => {
      const result = await useCase.execute(validUserId, {
        requestingUserId: validUserId,
        dryRun: true
      });

      expect(result.success).toBe(true);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Profile deletion authorization successful',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.any(String),
          metadata: expect.objectContaining({
            userId: validUserId,
            requestingUserId: validUserId,
            operation: 'deletion_authorization_check',
            result: 'granted'
          })
        })
      );
    });

    it('should deny deletion when user tries to delete another user profile', async () => {
      const otherUserId = 'other-user-456';

      await expect(useCase.execute(validUserId, {
        requestingUserId: otherUserId
      })).rejects.toThrow('Users can only delete their own profiles');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile deletion authorization failed',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.any(String),
          metadata: expect.objectContaining({
            userId: validUserId,
            requestingUserId: otherUserId,
            operation: 'deletion_authorization_check',
            result: 'denied'
          })
        })
      );
    });

    it('should skip authorization when skipAuthorization is true', async () => {
      const result = await useCase.execute(validUserId, {
        requestingUserId: 'other-user-456',
        skipAuthorization: true,
        dryRun: true
      });

      expect(result.success).toBe(true);
      expect(mockLogger.debug).not.toHaveBeenCalledWith(
        expect.stringContaining('authorization'),
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should use userId as requestingUserId when not provided', async () => {
      const result = await useCase.execute(validUserId, { dryRun: true });

      expect(result.success).toBe(true);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Profile deletion authorization successful',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            requestingUserId: validUserId
          })
        })
      );
    });
  });

  // =============================================================================
  // PROFILE EXISTENCE TESTS
  // =============================================================================

  describe('Profile Existence Validation', () => {
    it('should throw error when profile does not exist', async () => {
      mockProfileService.getProfile.mockResolvedValue(null);

      await expect(useCase.execute(validUserId, {}))
        .rejects.toThrow('Profile not found for user');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile not found for deletion',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.any(String),
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'delete_profile',
            result: 'profile_not_found'
          })
        })
      );
    });

    it('should proceed when profile exists', async () => {
      const result = await useCase.execute(validUserId, { dryRun: true });

      expect(mockProfileService.getProfile).toHaveBeenCalledWith(validUserId);
      expect(result.success).toBe(true);
    });

    it('should handle getProfile service errors', async () => {
      const serviceError = new Error('Database connection failed');
      mockProfileService.getProfile.mockRejectedValue(serviceError);

      await expect(useCase.execute(validUserId, {}))
        .rejects.toThrow('Profile deletion failed: Database connection failed');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile deletion failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'delete_profile'
          })
        }),
        serviceError
      );
    });
  });

  // =============================================================================
  // DRY RUN TESTS
  // =============================================================================

  describe('Dry Run Mode', () => {
    it('should return mock result without actual deletion in dry run', async () => {
      const result = await useCase.execute(validUserId, { 
        dryRun: true,
        strategy: 'hard_delete' as any
      });

      expect(result.success).toBe(true);
      expect(result.userId).toBe(validUserId);
      expect(result.strategy).toBe('hard_delete');
      expect(result.deletionId).toMatch(/^dryrun_del_/);
      expect(result.auditTrail.complianceLevel).toBe('basic');
      expect(result.auditTrail.relatedDataCleaned).toBe(false);

      // Verify no actual deletion occurred
      expect(mockProfileService.deleteProfile).not.toHaveBeenCalled();

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile deletion dry run completed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'delete_profile_dry_run',
            strategy: 'hard_delete'
          })
        })
      );
    });

    it('should respect all options in dry run mode', async () => {
      const options = {
        dryRun: true,
        strategy: 'soft_delete' as any,
        requireBackup: false,
        reason: 'Test deletion'
      };

      const result = await useCase.execute(validUserId, options);

      expect(result.strategy).toBe('soft_delete');
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile deletion dry run completed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            wouldRequireBackup: false
          })
        })
      );
    });
  });

  // =============================================================================
  // DELETION STRATEGY TESTS
  // =============================================================================

  describe('Deletion Strategies', () => {
    it('should use soft_delete as default strategy', async () => {
      const result = await useCase.execute(validUserId, {});

      expect(result.strategy).toBe('soft_delete');
      expect(mockProfileService.deleteProfile).toHaveBeenCalledWith(validUserId, false);
    });

    it('should apply hard_delete strategy', async () => {
      const result = await useCase.execute(validUserId, {
        strategy: 'hard_delete' as any
      });

      expect(result.strategy).toBe('hard_delete');
      expect(mockProfileService.deleteProfile).toHaveBeenCalledWith(validUserId, false);
    });

    it('should apply anonymize strategy', async () => {
      const result = await useCase.execute(validUserId, {
        strategy: 'anonymize' as any
      });

      expect(result.strategy).toBe('anonymize');
      expect(mockProfileService.deleteProfile).toHaveBeenCalledWith(validUserId, false);
    });

    it('should respect keepAuth option', async () => {
      const result = await useCase.execute(validUserId, {
        keepAuth: true
      });

      expect(mockProfileService.deleteProfile).toHaveBeenCalledWith(validUserId, true);
      expect(result.success).toBe(true);
    });
  });

  // =============================================================================
  // BACKUP CREATION TESTS
  // =============================================================================

  describe('Backup Creation', () => {
    it('should create backup when requireBackup is true (default)', async () => {
      const result = await useCase.execute(validUserId, {
        requireBackup: true
      });

      expect(result.backup).toBeDefined();
      expect(result.backup!.backupId).toMatch(/^backup_test-user-123_/);
      expect(result.backup!.location).toMatch(/^backups\/profiles\//);
      expect(result.backup!.expiresAt).toBeInstanceOf(Date);

      // Verify backup expires in 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const backupExpiry = result.backup!.expiresAt;
      const timeDiff = Math.abs(backupExpiry.getTime() - thirtyDaysFromNow.getTime());
      expect(timeDiff).toBeLessThan(60000); // Within 1 minute

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile backup created',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'create_profile_backup',
            backupId: result.backup!.backupId
          })
        })
      );
    });

    it('should skip backup when requireBackup is false', async () => {
      const result = await useCase.execute(validUserId, {
        requireBackup: false
      });

      expect(result.backup).toBeUndefined();
    });

    it('should create backup with correct profile data', async () => {
      const customProfile = createMockUserProfile({
        id: 'custom-user-789',
        firstName: 'Custom',
        lastName: 'Profile'
      });
      mockProfileService.getProfile.mockResolvedValue(customProfile);

      const result = await useCase.execute('custom-user-789', {
        requireBackup: true
      });

      expect(result.backup!.backupId).toMatch(/^backup_custom-user-789_/);
    });
  });

  // =============================================================================
  // DELETION EXECUTION TESTS
  // =============================================================================

  describe('Deletion Execution', () => {
    it('should execute profile deletion successfully', async () => {
      const result = await useCase.execute(validUserId, {});

      expect(mockProfileService.deleteProfile).toHaveBeenCalledWith(validUserId, false);
      expect(result.success).toBe(true);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Executing profile deletion',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'execute_profile_deletion',
            strategy: 'soft_delete'
          })
        })
      );

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile deletion executed successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            success: true
          })
        })
      );
    });

    it('should handle deletion service errors', async () => {
      const deletionError = new Error('Deletion service unavailable');
      mockProfileService.deleteProfile.mockRejectedValue(deletionError);

      await expect(useCase.execute(validUserId, {}))
        .rejects.toThrow('Profile deletion failed: Deletion service unavailable');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile deletion execution failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'execute_profile_deletion'
          })
        }),
        deletionError
      );
    });

    it('should log deletion parameters correctly', async () => {
      await useCase.execute(validUserId, {
        strategy: 'hard_delete' as any,
        keepAuth: true
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Executing profile deletion',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            strategy: 'hard_delete',
            keepAuth: true
          })
        })
      );
    });
  });

  // =============================================================================
  // RESULT CREATION TESTS
  // =============================================================================

  describe('Deletion Result Creation', () => {
    it('should create comprehensive deletion result', async () => {
      const result = await useCase.execute(validUserId, {
        strategy: 'hard_delete' as any,
        reason: 'GDPR compliance request',
        requireBackup: true,
        auditMetadata: {
          source: 'admin_panel',
          compliance: 'gdpr_article_17'
        }
      });

      expect(result.deletionId).toMatch(/^del_test-user-123_/);
      expect(result.userId).toBe(validUserId);
      expect(result.strategy).toBe('hard_delete');
      expect(result.success).toBe(true);
      expect(result.deletedAt).toBeInstanceOf(Date);
      
      expect(result.auditTrail.auditId).toMatch(/^audit_del_test-user-123_/);
      expect(result.auditTrail.complianceLevel).toBe('gdpr');
      expect(result.auditTrail.relatedDataCleaned).toBe(true);
      expect(result.auditTrail.externalSystemsNotified).toBe(false);

      expect(result.backup).toBeDefined();
      expect(result.recoveryInfo).toBeUndefined(); // No recovery for hard delete
    });

    it('should create recovery info for soft delete', async () => {
      const result = await useCase.execute(validUserId, {
        strategy: 'soft_delete' as any
      });

      expect(result.recoveryInfo).toBeDefined();
      expect(result.recoveryInfo!.recoveryToken).toMatch(/^recovery_test-user-123_/);
      expect(result.recoveryInfo!.canRestore).toBe(true);
      expect(result.recoveryInfo!.recoveryExpiresAt).toBeInstanceOf(Date);

      // Verify recovery expires in 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const recoveryExpiry = result.recoveryInfo!.recoveryExpiresAt;
      const timeDiff = Math.abs(recoveryExpiry.getTime() - thirtyDaysFromNow.getTime());
      expect(timeDiff).toBeLessThan(60000); // Within 1 minute
    });

    it('should set correct compliance level based on audit metadata', async () => {
      const gdprResult = await useCase.execute(validUserId, {
        auditMetadata: { compliance: 'gdpr_article_17' }
      });

      const enterpriseResult = await useCase.execute(validUserId, {
        auditMetadata: { compliance: 'enterprise_policy' }
      });

      expect(gdprResult.auditTrail.complianceLevel).toBe('gdpr');
      expect(enterpriseResult.auditTrail.complianceLevel).toBe('enterprise');
    });

    it('should respect notifyExternalSystems option', async () => {
      const result = await useCase.execute(validUserId, {
        notifyExternalSystems: true
      });

      expect(result.auditTrail.externalSystemsNotified).toBe(true);
    });
  });

  // =============================================================================
  // LOGGING & AUDIT TESTS
  // =============================================================================

  describe('Logging & Audit', () => {
    it('should log deletion start with correlation ID', async () => {
      await useCase.execute(validUserId, {
        strategy: 'hard_delete' as any,
        reason: 'User request'
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting profile deletion',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.stringMatching(/^delete_profile_usecase_\d+_[a-z0-9]+$/),
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'delete_profile',
            strategy: 'hard_delete',
            reason: 'User request'
          })
        })
      );
    });

    it('should log successful deletion with performance metrics', async () => {
      const result = await useCase.execute(validUserId, {});

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile deletion completed successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'delete_profile',
            result: 'success',
            executionTimeMs: expect.any(Number),
            deletionId: result.deletionId
          })
        })
      );
    });

    it('should log audit trail when auditDeletion is true', async () => {
      const result = await useCase.execute(validUserId, {
        auditDeletion: true,
        auditMetadata: {
          source: 'mobile_app',
          userAgent: 'ReactNative/1.0',
          ipAddress: '192.168.1.100'
        }
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile deletion audit logged',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'profile_deletion_audit',
            deletionId: result.deletionId,
            auditMetadata: expect.objectContaining({
              source: 'mobile_app',
              userAgent: 'ReactNative/1.0',
              ipAddress: '192.168.1.100'
            }),
            complianceLevel: 'enterprise'
          })
        })
      );
    });

    it('should log audit failure when deletion fails', async () => {
      const deletionError = new Error('Service unavailable');
      mockProfileService.deleteProfile.mockRejectedValue(deletionError);

      await expect(useCase.execute(validUserId, {
        auditDeletion: true
      })).rejects.toThrow('Profile deletion failed: Service unavailable');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile deletion failure audit logged',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'profile_deletion_audit_failure',
            errorType: 'Error'
          })
        }),
        expect.any(Error)
      );
    });

    it('should skip audit logging when auditDeletion is false', async () => {
      await useCase.execute(validUserId, {
        auditDeletion: false
      });

      expect(mockLogger.info).not.toHaveBeenCalledWith(
        expect.stringContaining('audit'),
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Handling', () => {
    it('should handle and re-throw service errors with context', async () => {
      const originalError = new Error('Database connection lost');
      mockProfileService.deleteProfile.mockRejectedValue(originalError);

      await expect(useCase.execute(validUserId, {}))
        .rejects.toThrow('Profile deletion failed: Database connection lost');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile deletion failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'delete_profile'
          })
        }),
        originalError
      );
    });

    it('should preserve original error types', async () => {
      class CustomError extends Error {
        code = 'CUSTOM_ERROR';
      }
      
      const customError = new CustomError('Custom error message');
      mockProfileService.deleteProfile.mockRejectedValue(customError);

      try {
        await useCase.execute(validUserId, {});
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toBe('Profile deletion failed: Custom error message');
        expect(error.code).toBe('CUSTOM_ERROR'); // Custom properties are preserved in our implementation
      }
    });

    it('should handle non-Error objects', async () => {
      const stringError = 'String error message';
      mockProfileService.deleteProfile.mockRejectedValue(stringError);

      try {
        await useCase.execute(validUserId, {});
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error).toBe(stringError);
      }
    });

    it('should log error timing information', async () => {
      const serviceError = new Error('Service error');
      mockProfileService.deleteProfile.mockRejectedValue(serviceError);

      await expect(useCase.execute(validUserId, {})).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile deletion failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            executionTimeMs: expect.any(Number)
          })
        }),
        serviceError
      );
    });
  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Performance', () => {
    it('should complete deletion within reasonable time', async () => {
      const startTime = Date.now();
      
      const result = await useCase.execute(validUserId, {});
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
      expect(result.success).toBe(true);
    });

    it('should handle concurrent deletion requests', async () => {
      const promises = [
        useCase.execute('user-1', { dryRun: true }),
        useCase.execute('user-2', { dryRun: true }),
        useCase.execute('user-3', { dryRun: true })
      ];

      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.userId).toBe(`user-${index + 1}`);
      });
    });

    it('should log performance metrics', async () => {
      await useCase.execute(validUserId, {});

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile deletion completed successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            executionTimeMs: expect.any(Number)
          })
        })
      );
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('Integration Scenarios', () => {
    it('should handle complete enterprise deletion workflow', async () => {
      const enterpriseOptions = {
        strategy: 'hard_delete' as any,
        requestingUserId: adminUserId,
        skipAuthorization: true,
        reason: 'GDPR Article 17 - Right to Erasure',
        requireBackup: true,
        notifyExternalSystems: true,
        auditDeletion: true,
        auditMetadata: {
          source: 'enterprise_admin_panel',
          compliance: 'gdpr_article_17',
          legalBasis: 'right_to_erasure',
          userAgent: 'Mozilla/5.0 (Enterprise Admin)',
          ipAddress: '10.0.0.100',
          sessionId: 'enterprise-session-123'
        }
      };

      const result = await useCase.execute(validUserId, enterpriseOptions);

      expect(result.success).toBe(true);
      expect(result.strategy).toBe('hard_delete');
      expect(result.auditTrail.complianceLevel).toBe('gdpr');
      expect(result.auditTrail.externalSystemsNotified).toBe(true);
      expect(result.backup).toBeDefined();
      expect(result.recoveryInfo).toBeUndefined(); // No recovery for hard delete

      // Verify all logging occurred
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting profile deletion',
        expect.any(String),
        expect.any(Object)
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile deletion completed successfully',
        expect.any(String),
        expect.any(Object)
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile deletion audit logged',
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should handle standard user self-deletion', async () => {
      const standardOptions = {
        strategy: 'soft_delete' as any,
        reason: 'User decided to delete account',
        requireBackup: false,
        auditDeletion: true
      };

      const result = await useCase.execute(validUserId, standardOptions);

      expect(result.success).toBe(true);
      expect(result.strategy).toBe('soft_delete');
      expect(result.recoveryInfo).toBeDefined();
      expect(result.backup).toBeUndefined();
      expect(result.auditTrail.complianceLevel).toBe('enterprise');
    });

    it('should handle minimal deletion scenario', async () => {
      const result = await useCase.execute(validUserId, {});

      expect(result.success).toBe(true);
      expect(result.strategy).toBe('soft_delete'); // Default
      expect(result.backup).toBeDefined(); // Default requireBackup: true
      expect(result.recoveryInfo).toBeDefined(); // Soft delete recovery
    });
  });

  // =============================================================================
  // EDGE CASES & BOUNDARY TESTS
  // =============================================================================

  describe('Edge Cases', () => {
    it('should handle very long userId', async () => {
      const longUserId = 'a'.repeat(255);
      mockProfileService.getProfile.mockResolvedValue({
        ...mockUserProfile,
        id: longUserId
      });

      const result = await useCase.execute(longUserId, { dryRun: true });

      expect(result.userId).toBe(longUserId);
      expect(result.success).toBe(true);
    });

    it('should handle special characters in userId', async () => {
      const specialUserId = 'user@domain.com_123-test';
      mockProfileService.getProfile.mockResolvedValue({
        ...mockUserProfile,
        id: specialUserId
      });

      const result = await useCase.execute(specialUserId, { dryRun: true });

      expect(result.userId).toBe(specialUserId);
    });

    it('should handle empty options object', async () => {
      const result = await useCase.execute(validUserId, {});

      expect(result.success).toBe(true);
      expect(result.strategy).toBe('soft_delete');
      expect(result.backup).toBeDefined();
    });

    it('should handle undefined options', async () => {
      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(true);
      expect(result.strategy).toBe('soft_delete');
    });

    it('should handle profile with minimal data', async () => {
      const minimalProfile = createMockUserProfile({
        bio: undefined,
        avatar: undefined,
        socialLinks: undefined,
        professional: undefined,
        customFields: {}
      });
      mockProfileService.getProfile.mockResolvedValue(minimalProfile);

      const result = await useCase.execute(validUserId, {});

      expect(result.success).toBe(true);
    });
  });
});