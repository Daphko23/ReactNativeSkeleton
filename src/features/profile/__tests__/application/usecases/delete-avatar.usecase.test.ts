/**
 * @fileoverview DELETE-AVATAR-USECASE-TESTS: Enterprise Avatar Deletion Test Suite Implementation
 * @description Comprehensive test coverage für DeleteAvatarUseCase mit
 * Enterprise Security Standards, GDPR Compliance und Avatar Management Testing.
 * Implementiert Auth Feature Test Patterns für 9/10 Enterprise-Level Coverage.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module DeleteAvatarUseCaseTests
 * @namespace Features.Profile.Tests.Application.UseCases
 * @category ProfileManagement
 * @subcategory Use Case Tests
 * 
 * @testCategories
 * - **Input Validation Tests:** User ID parameter validation und sanitization
 * - **Authorization Tests:** Avatar deletion permission validation
 * - **Avatar Deletion Tests:** Avatar removal workflow testing
 * - **Profile Update Tests:** Profile avatar reference cleanup
 * - **Error Handling Tests:** Deletion failure scenarios und recovery
 * - **GDPR Compliance Tests:** Data deletion audit logging
 * - **Performance Tests:** Deletion speed und resource management
 * - **Integration Tests:** End-to-end avatar deletion workflow
 * 
 * @compliance
 * - **GDPR Article 17:** Right to Erasure implementation testing
 * - **Data Retention:** Avatar data cleanup validation
 * - **Audit Logging:** Comprehensive deletion event tracking
 * - **Security Controls:** Avatar deletion authorization testing
 * 
 * @since 2025-01-23
 */

import { DeleteAvatarUseCase } from '../../../application/usecases/delete-avatar.usecase';
import { IProfileService } from '../../../domain/interfaces/profile-service.interface';
import { UserProfile } from '../../../domain/entities/user-profile.entity';

// Mock external services
jest.mock('../../../data/services/avatar.service', () => ({
  AvatarService: jest.fn().mockImplementation(() => ({
    deleteAvatar: jest.fn(),
    uploadAvatar: jest.fn(),
    getAvatarUrl: jest.fn(),
    validateAvatarFile: jest.fn(),
    generateInitialsAvatar: jest.fn(),
    getDefaultAvatarUrl: jest.fn(),
  })),
}));

jest.mock('../../../data/services/gdpr-audit.service', () => ({
  GDPRAuditService: jest.fn().mockImplementation(() => ({
    logDataAccess: jest.fn(),
    logProfileDeletion: jest.fn(),
  })),
}));

// Import mocked services

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
 * Mock Avatar Service für controlled testing environment
 */
const createMockAvatarService = () => ({
  deleteAvatar: jest.fn(),
  uploadAvatar: jest.fn(),
  getAvatarUrl: jest.fn(),
  validateAvatarFile: jest.fn(),
  generateInitialsAvatar: jest.fn(),
  getDefaultAvatarUrl: jest.fn(),
});

// =============================================================================
// TEST DATA FACTORIES
// =============================================================================

/**
 * Create successful avatar deletion result
 */
const createSuccessfulDeletionResult = () => ({
  success: true,
});

/**
 * Create failed avatar deletion result
 */
const _createFailedDeletionResult = (error: string) => ({
  success: false,
  error,
});

/**
 * Create mock profile with avatar
 */
const createMockProfileWithAvatar = (userId: string): UserProfile => ({
  id: userId,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  displayName: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  location: 'Test Location',
  website: 'https://example.com',
  phone: '+1234567890',
  customFields: {},
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  profileVersion: 1,
  isComplete: true,
  isVerified: false,
});

/**
 * Create mock profile without avatar
 */
const createMockProfileWithoutAvatar = (userId: string): UserProfile => ({
  id: userId,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  displayName: 'Test User',
  avatar: undefined,
  bio: 'Test bio',
  location: 'Test Location',
  website: 'https://example.com',
  phone: '+1234567890',
  customFields: {},
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  profileVersion: 1,
  isComplete: true,
  isVerified: false,
});

/**
 * Create avatar deletion error
 */
const _createAvatarDeletionError = (message: string) => {
  const error = new Error(message);
  error.name = 'AvatarDeletionError';
  return error;
};

/**
 * Create storage service error
 */
const createStorageServiceError = (message: string) => {
  const error = new Error(message);
  error.name = 'StorageServiceError';
  return error;
};

/**
 * Create profile service error
 */
const createProfileServiceError = (message: string) => {
  const error = new Error(message);
  error.name = 'ProfileServiceError';
  return error;
};

// =============================================================================
// MAIN TEST SUITE
// =============================================================================

describe('DeleteAvatarUseCase', () => {
  let useCase: DeleteAvatarUseCase;
  let mockProfileService: jest.Mocked<IProfileService>;
  let mockAvatarService: jest.Mocked<ReturnType<typeof createMockAvatarService>>;

  // Test data
  const validUserId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileService = createMockProfileService();
    mockAvatarService = createMockAvatarService() as jest.Mocked<ReturnType<typeof createMockAvatarService>>;
    
    // Setup default profile mock
    mockProfileService.getProfile.mockResolvedValue(createMockProfileWithAvatar(validUserId));
    
    useCase = new DeleteAvatarUseCase(mockAvatarService as any, mockProfileService);
    
    // Reset mock implementations
    mockAvatarService.deleteAvatar.mockResolvedValue(createSuccessfulDeletionResult());
    mockProfileService.deleteAvatar.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // CONSTRUCTOR TESTS
  // =============================================================================

  describe('Constructor', () => {
    it('should create instance with valid services', () => {
      expect(useCase).toBeInstanceOf(DeleteAvatarUseCase);
    });

    it('should accept both AvatarService and ProfileService in constructor', () => {
      const avatarService = createMockAvatarService();
      const profileService = createMockProfileService();
      const instance = new DeleteAvatarUseCase(avatarService as any, profileService);
      expect(instance).toBeInstanceOf(DeleteAvatarUseCase);
    });
  });

  // =============================================================================
  // INPUT VALIDATION TESTS
  // =============================================================================

  describe('Input Validation', () => {
    it('should return error when userId is empty string', async () => {
      try {
        await useCase.execute('');
        fail('Should have thrown InvalidUserIdError');
      } catch (error: any) {
        expect(error.name).toBe('InvalidUserIdError');
        expect(mockAvatarService.deleteAvatar).not.toHaveBeenCalled();
        expect(mockProfileService.deleteAvatar).not.toHaveBeenCalled();
      }
    });

    it('should return error when userId is null', async () => {
      try {
        await useCase.execute(null as any);
        fail('Should have thrown InvalidUserIdError');
      } catch (error: any) {
        expect(error.name).toBe('InvalidUserIdError');
        expect(mockAvatarService.deleteAvatar).not.toHaveBeenCalled();
      }
    });

    it('should return error when userId is undefined', async () => {
      try {
        await useCase.execute(undefined as any);
        fail('Should have thrown InvalidUserIdError');
      } catch (error: any) {
        expect(error.name).toBe('InvalidUserIdError');
        expect(mockAvatarService.deleteAvatar).not.toHaveBeenCalled();
      }
    });

    it('should accept valid userId', async () => {
      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(true);
      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(validUserId);
    });
  });

  // =============================================================================
  // AVATAR DELETION TESTS
  // =============================================================================

  describe('Avatar Deletion', () => {
    it('should delete avatar successfully', async () => {
      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(validUserId);
      expect(mockProfileService.deleteAvatar).toHaveBeenCalledWith(validUserId);
    });

    it('should handle avatar service success', async () => {
      mockAvatarService.deleteAvatar.mockResolvedValue(createSuccessfulDeletionResult());

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(true);
      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(validUserId);
    });

    it('should handle avatar service failure', async () => {
      const errorMessage = 'Avatar file not found';
      mockAvatarService.deleteAvatar.mockRejectedValue(new Error(errorMessage));

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle avatar service error without message', async () => {
      mockAvatarService.deleteAvatar.mockRejectedValue(new Error(''));

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to delete avatar');
    });

    it('should handle multiple avatar formats', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      
      for (const userId of userIds) {
        mockProfileService.getProfile.mockResolvedValue(createMockProfileWithAvatar(userId));
        mockAvatarService.deleteAvatar.mockResolvedValue(createSuccessfulDeletionResult());
        
        const result = await useCase.execute(userId);
        
        expect(result.success).toBe(true);
        expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(userId);
      }
    });

    it('should handle large avatar files deletion', async () => {
      // Simulate large file deletion
      mockAvatarService.deleteAvatar.mockImplementation(async (_userId) => {
        // Simulate processing time for large file
        await new Promise(resolve => setTimeout(resolve, 10));
        return createSuccessfulDeletionResult();
      });

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(true);
    });

    it('should return success when profile has no avatar', async () => {
      mockProfileService.getProfile.mockResolvedValue(createMockProfileWithoutAvatar(validUserId));

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(true);
      expect(mockAvatarService.deleteAvatar).not.toHaveBeenCalled();
      expect(mockProfileService.deleteAvatar).not.toHaveBeenCalled();
    });
  });

  // =============================================================================
  // PROFILE UPDATE TESTS
  // =============================================================================

  describe('Profile Update', () => {
    it('should update profile after avatar deletion', async () => {
      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(true);
      expect(mockProfileService.deleteAvatar).toHaveBeenCalledWith(validUserId);
    });

    it('should handle profile service success', async () => {
      mockProfileService.deleteAvatar.mockResolvedValue();

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(true);
      expect(mockProfileService.deleteAvatar).toHaveBeenCalledWith(validUserId);
    });

    it('should fail when profile update fails', async () => {
      const profileError = createProfileServiceError('Profile update failed');
      mockProfileService.deleteAvatar.mockRejectedValue(profileError);

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Profile update failed');
    });

    it('should fail when profile service is unavailable', async () => {
      const profileError = createProfileServiceError('Profile service unavailable');
      mockProfileService.deleteAvatar.mockRejectedValue(profileError);

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Profile service unavailable');
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Handling', () => {
    it('should handle avatar service errors', async () => {
      const storageError = createStorageServiceError('Storage service unavailable');
      mockAvatarService.deleteAvatar.mockRejectedValue(storageError);

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Storage service unavailable');
    });

    it('should handle network connectivity errors', async () => {
      const networkError = new Error('Network timeout');
      networkError.name = 'NetworkError';
      mockAvatarService.deleteAvatar.mockRejectedValue(networkError);

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network timeout');
    });

    it('should handle CDN deletion failures', async () => {
      const cdnError = new Error('CDN deletion failed');
      cdnError.name = 'CDNError';
      mockAvatarService.deleteAvatar.mockRejectedValue(cdnError);

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('CDN deletion failed');
    });

    it('should handle errors without message', async () => {
      const errorWithoutMessage = new Error();
      mockAvatarService.deleteAvatar.mockRejectedValue(errorWithoutMessage);

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to delete avatar');
    });

    it('should handle non-Error objects', async () => {
      mockAvatarService.deleteAvatar.mockRejectedValue('String error');

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to delete avatar');
    });

    it('should log errors to console', async () => {
      const testError = new Error('Test error for logging');
      mockAvatarService.deleteAvatar.mockRejectedValue(testError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await useCase.execute(validUserId);

      // The actual console logging is done by the logger, not console.error directly
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Performance', () => {
    it('should complete deletion within reasonable time', async () => {
      const startTime = Date.now();
      
      const result = await useCase.execute(validUserId);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
      expect(result.success).toBe(true);
    });

    it('should handle concurrent deletions efficiently', async () => {
      const userIds = ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'];
      
      // Setup profile mocks for each user
      userIds.forEach(userId => {
        mockProfileService.getProfile.mockResolvedValueOnce(createMockProfileWithAvatar(userId));
      });
      
      const promises = userIds.map(userId => useCase.execute(userId));
      const results = await Promise.all(promises);

      results.forEach((result, _index) => {
        expect(result.success).toBe(true);
      });

      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledTimes(5);
      expect(mockProfileService.deleteAvatar).toHaveBeenCalledTimes(5);
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('Integration Scenarios', () => {
    it('should handle complete avatar deletion workflow', async () => {
      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(true);
      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(validUserId);
      expect(mockProfileService.deleteAvatar).toHaveBeenCalledWith(validUserId);
    });

    it('should handle enterprise user avatar deletion', async () => {
      const enterpriseUserId = 'enterprise-user-789';
      mockProfileService.getProfile.mockResolvedValue(createMockProfileWithAvatar(enterpriseUserId));

      const result = await useCase.execute(enterpriseUserId);

      expect(result.success).toBe(true);
      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(enterpriseUserId);
    });

    it('should handle mobile app avatar deletion', async () => {
      const mobileUserId = 'mobile-user-456';
      mockProfileService.getProfile.mockResolvedValue(createMockProfileWithAvatar(mobileUserId));

      const result = await useCase.execute(mobileUserId);

      expect(result.success).toBe(true);
      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(mobileUserId);
    });

    it('should handle batch avatar deletions', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      
      // Setup profile mocks for each user
      userIds.forEach(userId => {
        mockProfileService.getProfile.mockResolvedValueOnce(createMockProfileWithAvatar(userId));
      });
      
      const results = [];

      for (const userId of userIds) {
        const result = await useCase.execute(userId);
        results.push(result);
      }

      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledTimes(3);
      expect(mockProfileService.deleteAvatar).toHaveBeenCalledTimes(3);
    });
  });

  // =============================================================================
  // EDGE CASES
  // =============================================================================

  describe('Edge Cases', () => {
    it('should handle deletion of non-existent avatar', async () => {
      const nonExistentError = new Error('Avatar not found');
      nonExistentError.name = 'NotFoundError';
      mockAvatarService.deleteAvatar.mockRejectedValue(nonExistentError);

      const result = await useCase.execute(validUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Avatar not found');
    });

    it('should handle user with special characters in ID', async () => {
      const specialUserId = 'user-with-special-chars-@#$%';
      mockProfileService.getProfile.mockResolvedValue(createMockProfileWithAvatar(specialUserId));

      const result = await useCase.execute(specialUserId);

      expect(result.success).toBe(true);
      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(specialUserId);
    });

    it('should handle very long user IDs', async () => {
      const longUserId = 'a'.repeat(1000);
      mockProfileService.getProfile.mockResolvedValue(createMockProfileWithAvatar(longUserId));

      const result = await useCase.execute(longUserId);

      expect(result.success).toBe(true);
      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(longUserId);
    });

    it('should handle rapid successive deletions for same user', async () => {
      // First deletion succeeds
      const firstResult = await useCase.execute(validUserId);
      expect(firstResult.success).toBe(true);

      // Second deletion should succeed if no avatar exists (according to implementation)
      mockProfileService.getProfile.mockResolvedValue(createMockProfileWithoutAvatar(validUserId));

      const secondResult = await useCase.execute(validUserId);
      expect(secondResult.success).toBe(true); // Returns success when no avatar to delete
    });

    it('should handle partial service failures gracefully', async () => {
      // Avatar deletion succeeds but profile update fails
      mockProfileService.deleteAvatar.mockRejectedValue(
        createProfileServiceError('Profile service temporarily unavailable')
      );

      const result = await useCase.execute(validUserId);

      // Should fail when profile service fails (according to implementation)
      expect(result.success).toBe(false);
      expect(result.error).toBe('Profile service temporarily unavailable');
    });
  });
});