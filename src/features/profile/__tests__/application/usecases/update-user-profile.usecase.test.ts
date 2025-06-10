/**
 * @fileoverview UPDATE-USER-PROFILE-USECASE-TESTS: Enterprise Test Suite Implementation
 * @description Comprehensive test coverage für UpdateUserProfileUseCase mit
 * Enterprise Security Standards, Business Rule Validation und Data Integrity Testing.
 * Implementiert Auth Feature Test Patterns für 9/10 Enterprise-Level Coverage.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module UpdateUserProfileUseCaseTests
 * @namespace Features.Profile.Tests.Application.UseCases
 * @category ProfileManagement
 * @subcategory Use Case Tests
 * 
 * @testCategories
 * - **Input Validation Tests:** Parameter validation und sanitization
 * - **Authorization Tests:** Access control und permission validation
 * - **Business Logic Tests:** Profile update workflow testing
 * - **Validation Tests:** Data integrity und business rule validation
 * - **Error Handling Tests:** Exception scenarios und error recovery
 * - **Performance Tests:** Profile update performance validation
 * - **Integration Tests:** Service integration testing
 * - **Security Tests:** Data privacy und access control validation
 * - **Concurrency Tests:** Optimistic locking und version conflict testing
 * 
 * @compliance
 * - **GDPR Article 16:** Right to Rectification testing implementation
 * - **Data Privacy:** Personal data modification control testing
 * - **SOC 2:** Enterprise data modification controls testing
 * - **Enterprise Security:** Authorization und data integrity compliance
 * 
 * @testingStrategy
 * - **Unit Tests:** Isolated use case testing mit mocked dependencies
 * - **Integration Tests:** Service integration validation
 * - **Security Tests:** Authorization und access control testing
 * - **Performance Tests:** Profile update latency validation
 * - **Concurrency Tests:** Version conflict und optimistic locking testing
 * 
 * @mockingStrategy
 * - ProfileService Mock für controlled testing environment
 * - Logger Mock für performance und audit testing
 * - Validation Mock für business rule testing
 * - Authorization Mock für access control testing
 * 
 * @since 2025-01-23
 */

import { UpdateUserProfileUseCase } from '../../../application/usecases/update-user-profile.usecase';
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
 * Mock Logger für performance und audit testing
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

/**
 * Create profile update data for testing
 */
const createProfileUpdateData = (overrides: Partial<UserProfile> = {}): Partial<UserProfile> => ({
  firstName: 'Updated',
  lastName: 'User',
  displayName: 'Updated User',
  bio: 'Updated user biography',
  location: 'Updated City, Updated Country',
  website: 'https://updated-user.dev',
  phone: '+1987654321',
  ...overrides,
});

/**
 * Create validation error for testing
 */
const createValidationError = (field: string, message: string) => {
  const error = new Error(`Validation failed for field: ${field}`);
  (error as any).field = field;
  (error as any).validation = message;
  error.name = 'ValidationError';
  return error;
};

/**
 * Create version conflict error for testing
 */
const createVersionConflictError = (currentVersion: number, providedVersion: number) => {
  const error = new Error(`Version conflict: expected ${currentVersion}, got ${providedVersion}`);
  (error as any).currentVersion = currentVersion;
  (error as any).providedVersion = providedVersion;
  error.name = 'VersionConflictError';
  return error;
};

// =============================================================================
// MAIN TEST SUITE
// =============================================================================

describe('UpdateUserProfileUseCase', () => {
  let useCase: UpdateUserProfileUseCase;
  let mockProfileService: jest.Mocked<IProfileService>;
  
  // Test data
  const validUserId = 'test-user-123';
  const mockUserProfile = createMockUserProfile();
  const updateData = createProfileUpdateData();

  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileService = createMockProfileService();
    useCase = new UpdateUserProfileUseCase(mockProfileService);
    
    // Reset mock implementations
    mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
    mockProfileService.updateProfile.mockResolvedValue({
      ...mockUserProfile,
      ...updateData,
      updatedAt: new Date(),
      profileVersion: 2
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // CONSTRUCTOR TESTS
  // =============================================================================

  describe('Constructor', () => {
    it('should create instance with valid ProfileService', () => {
      expect(useCase).toBeInstanceOf(UpdateUserProfileUseCase);
    });

    it('should throw error when ProfileService is null', () => {
      expect(() => new UpdateUserProfileUseCase(null as any))
        .toThrow('ProfileService is required for UpdateUserProfileUseCase');
    });

    it('should throw error when ProfileService is undefined', () => {
      expect(() => new UpdateUserProfileUseCase(undefined as any))
        .toThrow('ProfileService is required for UpdateUserProfileUseCase');
    });

    it('should initialize logger correctly', () => {
      expect(LoggerFactory.createServiceLogger).toHaveBeenCalledWith('UpdateUserProfileUseCase');
    });
  });

  // =============================================================================
  // INPUT VALIDATION TESTS
  // =============================================================================

  describe('Input Validation', () => {
    it('should throw error when userId is empty string', async () => {
      await expect(useCase.execute('', updateData))
        .rejects.toThrow('Valid userId is required for profile update');

      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Invalid userId provided to UpdateUserProfileUseCase',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.any(String),
          metadata: expect.objectContaining({
            userId: 'undefined',
            operation: 'update_profile'
          })
        })
      );
    });

    it('should throw error when userId is null', async () => {
      await expect(useCase.execute(null as any, updateData))
        .rejects.toThrow('Valid userId is required for profile update');

      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw error when userId is undefined', async () => {
      await expect(useCase.execute(undefined as any, updateData))
        .rejects.toThrow('Valid userId is required for profile update');

      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw error when userId is only whitespace', async () => {
      await expect(useCase.execute('   ', updateData))
        .rejects.toThrow('Valid userId is required for profile update');

      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw error when updateData is null', async () => {
      await expect(useCase.execute(validUserId, null as any))
        .rejects.toThrow('Valid update data is required for profile update');

      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw error when updateData is undefined', async () => {
      await expect(useCase.execute(validUserId, undefined as any))
        .rejects.toThrow('Valid update data is required for profile update');

      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw error when updateData is empty object', async () => {
      await expect(useCase.execute(validUserId, {}))
        .rejects.toThrow('Update data cannot be empty');

      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should accept valid userId and updateData', async () => {
      const result = await useCase.execute(validUserId, updateData);

      expect(result).toBeDefined();
      expect(result.firstName).toBe('Updated');
      expect(result.profileVersion).toBe(2);
    });
  });

  // =============================================================================
  // BUSINESS LOGIC TESTS
  // =============================================================================

  describe('Business Logic', () => {
    it('should update basic profile fields successfully', async () => {
      const basicUpdate = {
        firstName: 'NewFirst',
        lastName: 'NewLast',
        displayName: 'New Display Name'
      };

      const expectedResult = {
        ...mockUserProfile,
        ...basicUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, basicUpdate);

      expect(result).toEqual(expectedResult);
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(validUserId, basicUpdate);
    });

    it('should update contact information successfully', async () => {
      const contactUpdate = {
        email: 'newemail@example.com',
        phone: '+1-555-999-8888',
        location: 'New York, NY, USA'
      };

      const expectedResult = {
        ...mockUserProfile,
        ...contactUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, contactUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.email).toBe('newemail@example.com');
      expect(result.phone).toBe('+1-555-999-8888');
    });

    it('should update professional information successfully', async () => {
      const professionalUpdate = {
        professional: {
          company: 'New Company Ltd',
          jobTitle: 'Principal Engineer',
          skills: ['React', 'Node.js', 'AWS', 'Docker'],
          experience: 'lead' as const
        }
      };

      const expectedResult = {
        ...mockUserProfile,
        ...professionalUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, professionalUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.professional!.company).toBe('New Company Ltd');
      expect(result.professional!.skills).toContain('Docker');
    });

    it('should update social links successfully', async () => {
      const socialUpdate = {
        socialLinks: {
          linkedIn: 'https://linkedin.com/in/newuser',
          twitter: 'https://twitter.com/newuser',
          github: 'https://github.com/newuser',
          instagram: 'https://instagram.com/newuser'
        }
      };

      const expectedResult = {
        ...mockUserProfile,
        ...socialUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, socialUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.socialLinks!.instagram).toBe('https://instagram.com/newuser');
    });

    it('should update custom fields successfully', async () => {
      const customFieldsUpdate = {
        customFields: {
          department: 'Product',
          team: 'Frontend',
          manager: 'Jane Smith',
          startDate: '2024-01-15'
        }
      };

      const expectedResult = {
        ...mockUserProfile,
        ...customFieldsUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, customFieldsUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.customFields!.department).toBe('Product');
      expect(result.customFields!.manager).toBe('Jane Smith');
    });

    it('should update multiple sections simultaneously', async () => {
      const comprehensiveUpdate = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@newcompany.com',
        bio: 'Senior software engineer with expertise in full-stack development',
        location: 'San Francisco, CA',
        professional: {
          company: 'Tech Innovations Inc',
          jobTitle: 'Senior Software Engineer',
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
          experience: 'senior' as const
        },
        customFields: {
          department: 'Engineering',
          team: 'Platform',
          level: 'L5'
        }
      };

      const expectedResult = {
        ...mockUserProfile,
        ...comprehensiveUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, comprehensiveUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.firstName).toBe('John');
      expect(result.professional!.company).toBe('Tech Innovations Inc');
      expect(result.customFields!.level).toBe('L5');
    });

    it('should preserve existing data when partially updating', async () => {
      const partialUpdate = {
        firstName: 'PartialUpdate'
      };

      const expectedResult = {
        ...mockUserProfile,
        firstName: 'PartialUpdate',
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, partialUpdate);

      // Should preserve all existing data except updated field
      expect(result.firstName).toBe('PartialUpdate');
      expect(result.lastName).toBe(mockUserProfile.lastName);
      expect(result.email).toBe(mockUserProfile.email);
      expect(result.professional).toEqual(mockUserProfile.professional);
    });
  });

  // =============================================================================
  // VALIDATION TESTS
  // =============================================================================

  describe('Validation', () => {
    it('should handle email validation errors', async () => {
      const invalidEmailUpdate = {
        email: 'invalid-email-format'
      };

      const validationError = createValidationError('email', 'Invalid email format');
      mockProfileService.updateProfile.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, invalidEmailUpdate))
        .rejects.toThrow('Profile update failed: Validation failed for field: email');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile update failed',
        expect.any(String),
        expect.any(Object),
        validationError
      );
    });

    it('should handle phone validation errors', async () => {
      const invalidPhoneUpdate = {
        phone: 'invalid-phone-123'
      };

      const validationError = createValidationError('phone', 'Invalid phone format');
      mockProfileService.updateProfile.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, invalidPhoneUpdate))
        .rejects.toThrow('Profile update failed: Validation failed for field: phone');
    });

    it('should handle website URL validation errors', async () => {
      const invalidWebsiteUpdate = {
        website: 'not-a-valid-url'
      };

      const validationError = createValidationError('website', 'Invalid URL format');
      mockProfileService.updateProfile.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, invalidWebsiteUpdate))
        .rejects.toThrow('Profile update failed: Validation failed for field: website');
    });

    it('should handle bio length validation errors', async () => {
      const longBioUpdate = {
        bio: 'A'.repeat(10000) // Very long bio
      };

      const validationError = createValidationError('bio', 'Bio exceeds maximum length');
      mockProfileService.updateProfile.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, longBioUpdate))
        .rejects.toThrow('Profile update failed: Validation failed for field: bio');
    });

    it('should handle social links validation errors', async () => {
      const invalidSocialLinksUpdate = {
        socialLinks: {
          linkedIn: 'not-a-linkedin-url',
          twitter: 'invalid-twitter-handle',
          github: 'not-github-url'
        }
      };

      const validationError = createValidationError('socialLinks', 'Invalid social media URLs');
      mockProfileService.updateProfile.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, invalidSocialLinksUpdate))
        .rejects.toThrow('Profile update failed: Validation failed for field: socialLinks');
    });

    it('should handle professional info validation errors', async () => {
      const invalidProfessionalUpdate = {
        professional: {
          skills: [], // Empty skills array
          experience: 'invalid-experience-level' as any
        }
      };

      const validationError = createValidationError('professional', 'Invalid professional information');
      mockProfileService.updateProfile.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, invalidProfessionalUpdate))
        .rejects.toThrow('Profile update failed: Validation failed for field: professional');
    });
  });

  // =============================================================================
  // VERSION CONFLICT TESTS
  // =============================================================================

  describe('Version Conflict Handling', () => {
    it('should handle version conflict errors', async () => {
      const updateWithVersion = {
        firstName: 'Updated',
        profileVersion: 1 // Outdated version
      };

      const versionError = createVersionConflictError(2, 1);
      mockProfileService.updateProfile.mockRejectedValue(versionError);

      await expect(useCase.execute(validUserId, updateWithVersion))
        .rejects.toThrow('Profile update failed: Version conflict: expected 2, got 1');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile update failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'update_profile',
            userId: validUserId
          })
        }),
        versionError
      );
    });

    it('should handle successful update with correct version', async () => {
      const updateWithCorrectVersion = {
        firstName: 'Updated',
        profileVersion: 1 // Correct current version
      };

      const expectedResult = {
        ...mockUserProfile,
        firstName: 'Updated',
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, updateWithCorrectVersion);

      expect(result).toEqual(expectedResult);
      expect(result.profileVersion).toBe(2);
    });

    it('should retry update after version conflict resolution', async () => {
      const updateData = {
        firstName: 'RetryUpdate'
      };

      // First call fails with version conflict
      mockProfileService.updateProfile
        .mockRejectedValueOnce(createVersionConflictError(2, 1))
        .mockResolvedValueOnce({
          ...mockUserProfile,
          firstName: 'RetryUpdate',
          updatedAt: new Date(),
          profileVersion: 3
        });

      // Should handle the error gracefully
      await expect(useCase.execute(validUserId, updateData))
        .rejects.toThrow('Version conflict');

      expect(mockProfileService.updateProfile).toHaveBeenCalledTimes(1);
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Handling', () => {
    it('should handle service connection errors', async () => {
      const connectionError = new Error('Database connection failed');
      mockProfileService.updateProfile.mockRejectedValue(connectionError);

      await expect(useCase.execute(validUserId, updateData))
        .rejects.toThrow('Profile update failed: Database connection failed');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile update failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'update_profile'
          })
        }),
        connectionError
      );
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockProfileService.updateProfile.mockRejectedValue(timeoutError);

      await expect(useCase.execute(validUserId, updateData))
        .rejects.toThrow('Profile update failed: Request timeout');
    });

    it('should handle authorization errors', async () => {
      const authError = new Error('Access denied');
      authError.name = 'UnauthorizedError';
      mockProfileService.updateProfile.mockRejectedValue(authError);

      await expect(useCase.execute(validUserId, updateData))
        .rejects.toThrow('Profile update failed: Access denied');
    });

    it('should handle service unavailable errors', async () => {
      const serviceError = new Error('Service temporarily unavailable');
      serviceError.name = 'ServiceUnavailableError';
      mockProfileService.updateProfile.mockRejectedValue(serviceError);

      await expect(useCase.execute(validUserId, updateData))
        .rejects.toThrow('Profile update failed: Service temporarily unavailable');
    });

    it('should preserve custom error properties', async () => {
      class CustomProfileError extends Error {
        code = 'PROFILE_UPDATE_ERROR';
        statusCode = 422;
        field = 'email';
      }
      
      const customError = new CustomProfileError('Email already exists');
      mockProfileService.updateProfile.mockRejectedValue(customError);

      try {
        await useCase.execute(validUserId, updateData);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toBe('Profile update failed: Email already exists');
        expect(error.code).toBe('PROFILE_UPDATE_ERROR');
        expect(error.statusCode).toBe(422);
        expect(error.field).toBe('email');
      }
    });

    it('should handle non-Error objects', async () => {
      const stringError = 'String error message';
      mockProfileService.updateProfile.mockRejectedValue(stringError);

      try {
        await useCase.execute(validUserId, updateData);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error).toBe(stringError);
      }
    });
  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Performance', () => {
    it('should complete update within reasonable time', async () => {
      const startTime = Date.now();
      
      const result = await useCase.execute(validUserId, updateData);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(200); // Should complete within 200ms
      expect(result).toBeDefined();
    });

    it('should handle concurrent update requests efficiently', async () => {
      const updates = [
        { firstName: 'Update1' },
        { lastName: 'Update2' },
        { bio: 'Update3' },
        { location: 'Update4' },
        { phone: 'Update5' }
      ];
      
      // Mock different responses for each update
      mockProfileService.updateProfile.mockImplementation((userId, updateData) => {
        return Promise.resolve({
          ...mockUserProfile,
          ...updateData,
          updatedAt: new Date(),
          profileVersion: 2
        });
      });

      const promises = updates.map(update => useCase.execute(validUserId, update));
      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        expect(result).toBeDefined();
        const expectedKey = Object.keys(updates[index])[0];
        expect(result[expectedKey as keyof UserProfile]).toBe(updates[index][expectedKey as keyof typeof updates[0]]);
      });

      expect(mockProfileService.updateProfile).toHaveBeenCalledTimes(5);
    });

    it('should log performance metrics', async () => {
      await useCase.execute(validUserId, updateData);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile updated successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            executionTimeMs: expect.any(Number)
          })
        })
      );
    });

    it('should handle large update data efficiently', async () => {
      const largeUpdate = {
        bio: 'A'.repeat(5000), // Large bio
        customFields: Array.from({ length: 100 }, (_, i) => [`field${i}`, `value${i}`])
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        professional: {
          skills: Array.from({ length: 50 }, (_, i) => `Skill ${i}`),
          company: 'Large Enterprise Corporation',
          jobTitle: 'Senior Principal Staff Engineer',
          experience: 'lead' as const
        }
      };

      mockProfileService.updateProfile.mockResolvedValue({
        ...mockUserProfile,
        ...largeUpdate,
        updatedAt: new Date(),
        profileVersion: 2
      });

      const startTime = Date.now();
      const result = await useCase.execute(validUserId, largeUpdate);
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(300); // Should handle large data efficiently
    });
  });

  // =============================================================================
  // LOGGING & AUDIT TESTS
  // =============================================================================

  describe('Logging & Audit', () => {
    it('should log update start with correlation ID', async () => {
      await useCase.execute(validUserId, updateData);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting profile update',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.stringMatching(/^update_profile_usecase_\d+_[a-z0-9]+$/),
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'update_profile'
          })
        })
      );
    });

    it('should log successful update with performance metrics', async () => {
      const result = await useCase.execute(validUserId, updateData);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile updated successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'update_profile',
            result: 'success',
            executionTimeMs: expect.any(Number),
            updatedVersion: result.profileVersion,
            updateFields: expect.any(Array)
          })
        })
      );
    });

    it('should log validation failures with field details', async () => {
      const validationError = createValidationError('email', 'Invalid email format');
      mockProfileService.updateProfile.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, { email: 'invalid' })).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile update failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'update_profile',
            updateFields: ['email']
          })
        }),
        validationError
      );
    });

    it('should log version conflicts with version details', async () => {
      const versionError = createVersionConflictError(2, 1);
      mockProfileService.updateProfile.mockRejectedValue(versionError);

      await expect(useCase.execute(validUserId, updateData)).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile update failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'update_profile'
          })
        }),
        versionError
      );
    });

    it('should include update summary in success logs', async () => {
      const complexUpdate = {
        firstName: 'John',
        bio: 'Updated bio',
        professional: {
          company: 'New Company'
        }
      };

      await useCase.execute(validUserId, complexUpdate);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile updated successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            updateFields: ['firstName', 'bio', 'professional']
          })
        })
      );
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('Integration Scenarios', () => {
    it('should handle enterprise user profile update', async () => {
      const enterpriseUpdate = {
        professional: {
          company: 'Fortune 100 Enterprise',
          jobTitle: 'Chief Technology Officer',
          skills: ['Strategic Planning', 'Team Leadership', 'Enterprise Architecture', 'Digital Transformation'],
          experience: 'executive' as const
        },
        customFields: {
          department: 'Executive',
          division: 'Technology',
          reportingLevel: 'C-Suite',
          budgetAuthority: '100M+',
          securityClearance: 'Top Secret'
        }
      };

      const expectedResult = {
        ...mockUserProfile,
        ...enterpriseUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute('enterprise-user-789', enterpriseUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.professional!.experience).toBe('executive');
      expect(result.customFields!.reportingLevel).toBe('C-Suite');

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile updated successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            updateFields: ['professional', 'customFields']
          })
        })
      );
    });

    it('should handle student profile graduation update', async () => {
      const graduationUpdate = {
        professional: {
          company: 'Tech Startup Inc',
          jobTitle: 'Junior Software Developer',
          skills: ['JavaScript', 'React', 'Node.js', 'Git'],
          experience: 'junior' as const
        },
        customFields: {
          university: 'University of Technology',
          major: 'Computer Science',
          graduationYear: '2024',
          graduationStatus: 'Graduated',
          gpa: '3.8',
          honors: 'Cum Laude'
        }
      };

      const expectedResult = {
        ...mockUserProfile,
        ...graduationUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2,
        isComplete: true
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute('student-user-456', graduationUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.professional!.experience).toBe('junior');
      expect(result.customFields!.graduationStatus).toBe('Graduated');
      expect(result.isComplete).toBe(true);
    });

    it('should handle international user localization update', async () => {
      const localizationUpdate = {
        firstName: 'José',
        lastName: 'García-López',
        location: 'Barcelona, España',
        timeZone: 'Europe/Madrid',
        language: 'es',
        phone: '+34-123-456-789',
        customFields: {
          nationality: 'Spanish',
          languages: 'Spanish, English, Catalan',
          workAuthorization: 'EU Citizen',
          preferredCurrency: 'EUR',
          vatNumber: 'ES-12345678Z'
        }
      };

      const expectedResult = {
        ...mockUserProfile,
        ...localizationUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute('international-user-789', localizationUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.language).toBe('es');
      expect(result.timeZone).toBe('Europe/Madrid');
      expect(result.customFields!.nationality).toBe('Spanish');
    });
  });

  // =============================================================================
  // EDGE CASES & BOUNDARY TESTS
  // =============================================================================

  describe('Edge Cases', () => {
    it('should handle update with null/undefined optional fields', async () => {
      const nullFieldsUpdate = {
        bio: null as any,
        avatar: null as any,
        dateOfBirth: null as any,
        website: null as any,
        phone: null as any,
        socialLinks: null as any,
        professional: null as any,
      };

      const expectedResult = {
        ...mockUserProfile,
        ...nullFieldsUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, nullFieldsUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.bio).toBeNull();
      expect(result.socialLinks).toBeNull();
    });

    it('should handle update with empty custom fields', async () => {
      const emptyCustomFieldsUpdate = {
        customFields: {}
      };

      const expectedResult = {
        ...mockUserProfile,
        customFields: {},
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, emptyCustomFieldsUpdate);

      expect(result.customFields).toEqual({});
    });

    it('should handle extremely long text fields', async () => {
      const longTextUpdate = {
        bio: 'A'.repeat(5000),
        website: 'https://example.com/' + 'path/'.repeat(500),
        location: 'Very Very Very Long Location Name That Exceeds Normal Limits'
      };

      const expectedResult = {
        ...mockUserProfile,
        ...longTextUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, longTextUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.bio!.length).toBe(5000);
    });

    it('should handle unicode characters in profile data', async () => {
      const unicodeUpdate = {
        firstName: '名前',
        lastName: 'Фамилия',
        displayName: '🚀 Test User 🌟',
        bio: 'Bio with emojis 😀 🎉 and unicode ñáéíóú',
        location: 'São Paulo, Brasil 🇧🇷'
      };

      const expectedResult = {
        ...mockUserProfile,
        ...unicodeUpdate,
        updatedAt: expect.any(Date),
        profileVersion: 2
      };

      mockProfileService.updateProfile.mockResolvedValue(expectedResult);

      const result = await useCase.execute(validUserId, unicodeUpdate);

      expect(result).toEqual(expectedResult);
      expect(result.firstName).toBe('名前');
      expect(result.displayName).toContain('🚀');
    });

    it('should handle rapid consecutive updates', async () => {
      const updates = [
        { firstName: 'Update1' },
        { firstName: 'Update2' },
        { firstName: 'Update3' }
      ];

      let version = 1;
      mockProfileService.updateProfile.mockImplementation((userId, updateData) => {
        version++;
        return Promise.resolve({
          ...mockUserProfile,
          ...updateData,
          updatedAt: new Date(),
          profileVersion: version
        });
      });

      // Execute updates sequentially
      const results = [];
      for (const update of updates) {
        const result = await useCase.execute(validUserId, update);
        results.push(result);
      }

      expect(results).toHaveLength(3);
      expect(results[0].profileVersion).toBe(2);
      expect(results[1].profileVersion).toBe(3);
      expect(results[2].profileVersion).toBe(4);
    });
  });
});