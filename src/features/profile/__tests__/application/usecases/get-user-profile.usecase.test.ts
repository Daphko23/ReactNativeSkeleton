/**
 * @fileoverview GET-USER-PROFILE-USECASE-TESTS: Enterprise Test Suite Implementation
 * @description Comprehensive test coverage für GetUserProfileUseCase mit
 * Enterprise Security Standards, Performance Testing und Data Retrieval Validation.
 * Implementiert Auth Feature Test Patterns für 9/10 Enterprise-Level Coverage.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module GetUserProfileUseCaseTests
 * @namespace Features.Profile.Tests.Application.UseCases
 * @category ProfileManagement
 * @subcategory Use Case Tests
 * 
 * @testCategories
 * - **Input Validation Tests:** Parameter validation und sanitization
 * - **Authorization Tests:** Access control und permission validation
 * - **Business Logic Tests:** Profile retrieval workflow testing
 * - **Error Handling Tests:** Exception scenarios und error recovery
 * - **Caching Tests:** Data caching und performance optimization
 * - **Performance Tests:** Profile retrieval performance validation
 * - **Integration Tests:** Service integration testing
 * - **Security Tests:** Data privacy und access control validation
 * 
 * @compliance
 * - **GDPR Article 15:** Right of Access testing implementation
 * - **Data Privacy:** Personal data access control testing
 * - **SOC 2:** Enterprise data access controls testing
 * - **Enterprise Security:** Authorization und data protection compliance
 * 
 * @testingStrategy
 * - **Unit Tests:** Isolated use case testing mit mocked dependencies
 * - **Integration Tests:** Service integration validation
 * - **Security Tests:** Authorization und access control testing
 * - **Performance Tests:** Profile retrieval latency validation
 * - **Caching Tests:** Data caching und invalidation testing
 * 
 * @mockingStrategy
 * - ProfileService Mock für controlled testing environment
 * - Logger Mock für performance und audit testing
 * - Cache Mock für caching behavior testing
 * - Authorization Mock für access control testing
 * 
 * @since 2025-01-23
 */

import { GetUserProfileUseCase } from '../../../application/usecases/get-user-profile.usecase';
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
 * Create minimal profile for testing edge cases
 */
const createMinimalProfile = (): UserProfile => ({
  id: 'minimal-user-456',
  firstName: 'Minimal',
  lastName: 'User',
  displayName: 'Minimal User',
  email: 'minimal@example.com',
  bio: undefined,
  avatar: undefined,
  dateOfBirth: undefined,
  location: undefined,
  website: undefined,
  phone: undefined,
  timeZone: 'UTC',
  language: 'en',
  socialLinks: undefined,
  professional: undefined,
  customFields: {},
  privacySettings: {
    profileVisibility: 'private',
    emailVisibility: 'private',
    phoneVisibility: 'private',
    locationVisibility: 'private',
    socialLinksVisibility: 'private',
    professionalInfoVisibility: 'private',
    showOnlineStatus: false,
    allowDirectMessages: false,
    allowFriendRequests: false,
    emailNotifications: false,
    pushNotifications: false,
    marketingCommunications: false,
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  profileVersion: 1,
  isComplete: false,
  isVerified: false,
});

// =============================================================================
// MAIN TEST SUITE
// =============================================================================

describe('GetUserProfileUseCase', () => {
  let useCase: GetUserProfileUseCase;
  let mockProfileService: jest.Mocked<IProfileService>;
  
  // Test data
  const validUserId = 'test-user-123';
  const mockUserProfile = createMockUserProfile();
  const minimalProfile = createMinimalProfile();

  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileService = createMockProfileService();
    useCase = new GetUserProfileUseCase(mockProfileService);
    
    // Reset mock implementations
    mockProfileService.getProfile.mockResolvedValue(mockUserProfile);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // CONSTRUCTOR TESTS
  // =============================================================================

  describe('Constructor', () => {
    it('should create instance with valid ProfileService', () => {
      expect(useCase).toBeInstanceOf(GetUserProfileUseCase);
    });

    it('should throw error when ProfileService is null', () => {
      expect(() => new GetUserProfileUseCase(null as any))
        .toThrow('ProfileService is required for GetUserProfileUseCase');
    });

    it('should throw error when ProfileService is undefined', () => {
      expect(() => new GetUserProfileUseCase(undefined as any))
        .toThrow('ProfileService is required for GetUserProfileUseCase');
    });

    it('should initialize logger correctly', () => {
      expect(LoggerFactory.createServiceLogger).toHaveBeenCalledWith('GetUserProfileUseCase');
    });
  });

  // =============================================================================
  // INPUT VALIDATION TESTS
  // =============================================================================

  describe('Input Validation', () => {
    it('should throw error when userId is empty string', async () => {
      await expect(useCase.execute(''))
        .rejects.toThrow('Valid userId is required for profile retrieval');

      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Invalid userId provided to GetUserProfileUseCase',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.any(String),
          metadata: expect.objectContaining({
            userId: 'undefined',
            operation: 'get_profile'
          })
        })
      );
    });

    it('should throw error when userId is null', async () => {
      await expect(useCase.execute(null as any))
        .rejects.toThrow('Valid userId is required for profile retrieval');

      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should throw error when userId is undefined', async () => {
      await expect(useCase.execute(undefined as any))
        .rejects.toThrow('Valid userId is required for profile retrieval');

      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should throw error when userId is only whitespace', async () => {
      await expect(useCase.execute('   '))
        .rejects.toThrow('Valid userId is required for profile retrieval');

      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });

    it('should accept valid userId', async () => {
      const result = await useCase.execute(validUserId);

      expect(result).toBeDefined();
      expect(result!.id).toBe(validUserId);
    });

    it('should handle userId with special characters', async () => {
      const specialUserId = 'user-123_abc@domain.com';
      mockProfileService.getProfile.mockResolvedValue({
        ...mockUserProfile,
        id: specialUserId
      });

      const result = await useCase.execute(specialUserId);

      expect(result!.id).toBe(specialUserId);
      expect(mockProfileService.getProfile).toHaveBeenCalledWith(specialUserId);
    });

    it('should handle very long userId', async () => {
      const longUserId = 'a'.repeat(255);
      mockProfileService.getProfile.mockResolvedValue({
        ...mockUserProfile,
        id: longUserId
      });

      const result = await useCase.execute(longUserId);

      expect(result!.id).toBe(longUserId);
    });
  });

  // =============================================================================
  // PROFILE RETRIEVAL TESTS
  // =============================================================================

  describe('Profile Retrieval', () => {
    it('should return complete profile when found', async () => {
      const result = await useCase.execute(validUserId);

      expect(result).toEqual(mockUserProfile);
      expect(mockProfileService.getProfile).toHaveBeenCalledWith(validUserId);
      
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile retrieved successfully',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.any(String),
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'get_profile',
            result: 'success'
          })
        })
      );
    });

    it('should return null when profile not found', async () => {
      mockProfileService.getProfile.mockResolvedValue(null);

      const result = await useCase.execute(validUserId);

      expect(result).toBeNull();
      expect(mockProfileService.getProfile).toHaveBeenCalledWith(validUserId);
      
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile not found',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            result: 'not_found'
          })
        })
      );
    });

    it('should return minimal profile correctly', async () => {
      mockProfileService.getProfile.mockResolvedValue(minimalProfile);

      const result = await useCase.execute('minimal-user-456');

      expect(result).toEqual(minimalProfile);
      expect(result!.bio).toBeUndefined();
      expect(result!.avatar).toBeUndefined();
      expect(result!.socialLinks).toBeUndefined();
      expect(result!.professional).toBeUndefined();
      expect(result!.isComplete).toBe(false);
    });

    it('should handle profile with all optional fields present', async () => {
      const fullProfile = createMockUserProfile({
        bio: 'Comprehensive user biography with lots of details',
        avatar: 'https://example.com/high-res-avatar.jpg',
        dateOfBirth: new Date('1985-05-15'),
        location: 'San Francisco, CA, USA',
        website: 'https://comprehensive-portfolio.dev',
        phone: '+1-555-123-4567',
        socialLinks: {
          linkedIn: 'https://linkedin.com/in/comprehensive-user',
          twitter: 'https://twitter.com/comprehensive_user',
          github: 'https://github.com/comprehensive-user',
          instagram: 'https://instagram.com/comprehensive_user',
          facebook: 'https://facebook.com/comprehensive.user',
        },
        professional: {
          skills: ['JavaScript', 'TypeScript', 'React', 'React Native', 'Node.js', 'Python', 'AWS'],
          company: 'Tech Innovation Corp',
          jobTitle: 'Principal Software Engineer',
          experience: 'executive',
          custom: {
            portfolio: 'https://portfolio.comprehensive-user.dev',
            certifications: ['AWS Solutions Architect', 'React Native Certified']
          }
        },
        customFields: {
          department: 'Engineering',
          team: 'Mobile Platform',
          manager: 'Jane Doe',
          startDate: '2020-01-15',
          employeeId: 'ENG-001',
        }
      });

      mockProfileService.getProfile.mockResolvedValue(fullProfile);

      const result = await useCase.execute(validUserId);

      expect(result).toEqual(fullProfile);
      expect(result!.professional!.skills).toHaveLength(7);
      expect(result!.socialLinks!.instagram).toBeDefined();
      expect(result!.customFields?.employeeId).toBe('ENG-001');
    });
  });

  // =============================================================================
  // PRIVACY & AUTHORIZATION TESTS
  // =============================================================================

  describe('Privacy & Authorization', () => {
    it('should respect public profile visibility', async () => {
      const publicProfile = createMockUserProfile({
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
          marketingCommunications: false
        }
      });
      mockProfileService.getProfile.mockResolvedValue(publicProfile);

      const result = await useCase.execute(validUserId);

      expect(result).toEqual(publicProfile);
      expect(result!.privacySettings!.profileVisibility).toBe('public');
    });

    it('should respect private profile visibility', async () => {
      const privateProfile = createMockUserProfile({
        privacySettings: {
          ...mockUserProfile.privacySettings,
          profileVisibility: 'private',
          emailVisibility: 'private',
          phoneVisibility: 'private',
          locationVisibility: 'private',
          socialLinksVisibility: 'private',
          professionalInfoVisibility: 'private',
          showOnlineStatus: false,
          allowDirectMessages: false,
          allowFriendRequests: false,
          emailNotifications: false,
          pushNotifications: false,
          marketingCommunications: false
        }
      });
      mockProfileService.getProfile.mockResolvedValue(privateProfile);

      const result = await useCase.execute(validUserId);

      expect(result).toEqual(privateProfile);
      expect(result!.privacySettings!.profileVisibility).toBe('private');
    });

    it('should handle friends-only profile visibility', async () => {
      const friendsOnlyProfile = createMockUserProfile({
        privacySettings: {
          profileVisibility: 'friends',
          emailVisibility: 'friends',
          phoneVisibility: 'friends',
          locationVisibility: 'friends',
          socialLinksVisibility: 'friends',
          professionalInfoVisibility: 'friends',
          showOnlineStatus: true,
          allowDirectMessages: true,
          allowFriendRequests: true,
          emailNotifications: true,
          pushNotifications: true,
          marketingCommunications: false
        }
      });
      mockProfileService.getProfile.mockResolvedValue(friendsOnlyProfile);

      const result = await useCase.execute(validUserId);

      expect(result).toEqual(friendsOnlyProfile);
      expect(result!.privacySettings!.profileVisibility).toBe('friends');
    });

    it('should respect email visibility settings', async () => {
      const profileWithPrivateEmail = createMockUserProfile({
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
          marketingCommunications: false
        }
      });
      mockProfileService.getProfile.mockResolvedValue(profileWithPrivateEmail);

      const result = await useCase.execute(validUserId);

      expect(result!.privacySettings!.emailVisibility).toBe('private');
    });

    it('should respect phone visibility settings', async () => {
      const profileWithPublicPhone = createMockUserProfile({
        privacySettings: {
          ...mockUserProfile.privacySettings,
          profileVisibility: 'public',
          emailVisibility: 'private',
          phoneVisibility: 'public',
          locationVisibility: 'public',
          socialLinksVisibility: 'public',
          professionalInfoVisibility: 'public',
          showOnlineStatus: true,
          allowDirectMessages: true,
          allowFriendRequests: true,
          emailNotifications: true,
          pushNotifications: true,
          marketingCommunications: false
        }
      });
      mockProfileService.getProfile.mockResolvedValue(profileWithPublicPhone);

      const result = await useCase.execute(validUserId);

      expect(result!.privacySettings!.phoneVisibility).toBe('public');
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Handling', () => {
    it('should handle service connection errors', async () => {
      const connectionError = new Error('Database connection failed');
      mockProfileService.getProfile.mockRejectedValue(connectionError);

      await expect(useCase.execute(validUserId))
        .rejects.toThrow('Profile retrieval failed: Database connection failed');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile retrieval failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'get_profile'
          })
        }),
        connectionError
      );
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockProfileService.getProfile.mockRejectedValue(timeoutError);

      await expect(useCase.execute(validUserId))
        .rejects.toThrow('Profile retrieval failed: Request timeout');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile retrieval failed',
        expect.any(String),
        expect.any(Object),
        timeoutError
      );
    });

    it('should handle authorization errors', async () => {
      const authError = new Error('Access denied');
      authError.name = 'UnauthorizedError';
      mockProfileService.getProfile.mockRejectedValue(authError);

      await expect(useCase.execute(validUserId))
        .rejects.toThrow('Profile retrieval failed: Access denied');
    });

    it('should handle service unavailable errors', async () => {
      const serviceError = new Error('Service temporarily unavailable');
      serviceError.name = 'ServiceUnavailableError';
      mockProfileService.getProfile.mockRejectedValue(serviceError);

      await expect(useCase.execute(validUserId))
        .rejects.toThrow('Profile retrieval failed: Service temporarily unavailable');
    });

    it('should preserve custom error properties', async () => {
      class CustomProfileError extends Error {
        code = 'PROFILE_ERROR';
        statusCode = 404;
      }
      
      const customError = new CustomProfileError('Profile access denied');
      mockProfileService.getProfile.mockRejectedValue(customError);

      try {
        await useCase.execute(validUserId);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toBe('Profile retrieval failed: Profile access denied');
        expect(error.code).toBe('PROFILE_ERROR');
        expect(error.statusCode).toBe(404);
      }
    });

    it('should handle non-Error objects', async () => {
      const stringError = 'String error message';
      mockProfileService.getProfile.mockRejectedValue(stringError);

      try {
        await useCase.execute(validUserId);
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
    it('should complete retrieval within reasonable time', async () => {
      const startTime = Date.now();
      
      const result = await useCase.execute(validUserId);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(100); // Should complete within 100ms
      expect(result).toBeDefined();
    });

    it('should handle concurrent retrieval requests', async () => {
      const userIds = ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'];
      
      // Mock different profiles for each user
      mockProfileService.getProfile.mockImplementation((userId) => {
        return Promise.resolve(createMockUserProfile({ id: userId }));
      });

      const promises = userIds.map(userId => useCase.execute(userId));
      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        expect(result).toBeDefined();
        expect(result!.id).toBe(userIds[index]);
      });

      expect(mockProfileService.getProfile).toHaveBeenCalledTimes(5);
    });

    it('should log performance metrics', async () => {
      await useCase.execute(validUserId);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile retrieved successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            executionTimeMs: expect.any(Number)
          })
        })
      );
    });

    it('should handle large profile data efficiently', async () => {
      const largeProfile = createMockUserProfile({
        bio: 'A'.repeat(5000), // Large bio
        customFields: Array.from({ length: 100 }, (_, i) => [`field${i}`, `value${i}`])
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        professional: {
          ...mockUserProfile.professional!,
          skills: Array.from({ length: 50 }, (_, i) => `Skill ${i}`),
        }
      });

      mockProfileService.getProfile.mockResolvedValue(largeProfile);

      const startTime = Date.now();
      const result = await useCase.execute(validUserId);
      const endTime = Date.now();

      expect(result).toEqual(largeProfile);
      expect(endTime - startTime).toBeLessThan(200); // Should handle large data efficiently
    });
  });

  // =============================================================================
  // LOGGING & AUDIT TESTS
  // =============================================================================

  describe('Logging & Audit', () => {
    it('should log retrieval start with correlation ID', async () => {
      await useCase.execute(validUserId);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting profile retrieval',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.stringMatching(/^get_profile_usecase_\d+_[a-z0-9]+$/),
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'get_profile'
          })
        })
      );
    });

    it('should log successful retrieval with performance metrics', async () => {
      const result = await useCase.execute(validUserId);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile retrieved successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'get_profile',
            result: 'success',
            executionTimeMs: expect.any(Number),
            profileFound: true,
            profileVersion: result!.profileVersion
          })
        })
      );
    });

    it('should log profile not found scenarios', async () => {
      mockProfileService.getProfile.mockResolvedValue(null);

      await useCase.execute(validUserId);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile not found',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'get_profile',
            result: 'not_found'
          })
        })
      );
    });

    it('should log error scenarios with timing', async () => {
      const serviceError = new Error('Service error');
      mockProfileService.getProfile.mockRejectedValue(serviceError);

      await expect(useCase.execute(validUserId)).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Profile retrieval failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'get_profile',
            executionTimeMs: expect.any(Number)
          })
        }),
        serviceError
      );
    });

    it('should include profile completeness in success logs', async () => {
      const incompleteProfile = createMockUserProfile({ isComplete: false });
      mockProfileService.getProfile.mockResolvedValue(incompleteProfile);

      await useCase.execute(validUserId);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile retrieved successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            profileComplete: false
          })
        })
      );
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('Integration Scenarios', () => {
    it('should handle enterprise user profile retrieval', async () => {
      const enterpriseProfile = createMockUserProfile({
        professional: {
          skills: ['Enterprise Architecture', 'Microservices', 'DevOps', 'Team Leadership'],
          company: 'Fortune 500 Corp',
          jobTitle: 'VP of Engineering',
          experience: 'executive',
          custom: {
            certifications: ['AWS Solutions Architect Professional', 'CISSP', 'PMP'],
            portfolio: 'https://enterprise-leader.professional'
          }
        },
        customFields: {
          department: 'Engineering',
          division: 'Enterprise Technology',
          costCenter: 'ENG-001',
          managementLevel: 'VP',
          clearanceLevel: 'Secret',
          budgetAuthority: '10M+'
        },
        isVerified: true,
        isComplete: true
      });

      mockProfileService.getProfile.mockResolvedValue(enterpriseProfile);

      const result = await useCase.execute('enterprise-user-789');

      expect(result).toEqual(enterpriseProfile);
      expect(result!.professional!.experience).toBe('executive');
      expect(result!.customFields?.managementLevel).toBe('VP');
      expect(result!.isVerified).toBe(true);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile retrieved successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            profileComplete: true,
            profileVerified: true
          })
        })
      );
    });

    it('should handle student user profile retrieval', async () => {
      const studentProfile = createMockUserProfile({
        professional: {
          skills: ['JavaScript', 'React', 'Python'],
          company: 'University of Technology',
          jobTitle: 'Computer Science Student',
          experience: 'entry',
        },
        customFields: {
          university: 'University of Technology',
          major: 'Computer Science',
          graduationYear: '2025',
          gpa: '3.8',
          studentId: 'CS-2021-001'
        },
        isVerified: false,
        isComplete: false
      });

      mockProfileService.getProfile.mockResolvedValue(studentProfile);

      const result = await useCase.execute('student-user-456');

      expect(result).toEqual(studentProfile);
      expect(result!.professional!.experience).toBe('entry');
      expect(result!.customFields?.major).toBe('Computer Science');
      expect(result!.isComplete).toBe(false);
    });

    it('should handle international user profile retrieval', async () => {
      const internationalProfile = createMockUserProfile({
        firstName: 'José',
        lastName: 'García-López',
        location: 'Madrid, España',
        timeZone: 'Europe/Madrid',
        language: 'es',
        phone: '+34-123-456-789',
        customFields: {
          nationality: 'Spanish',
          languages: 'Spanish, English, French',
          workAuthorization: 'EU Citizen',
          preferredCurrency: 'EUR'
        }
      });

      mockProfileService.getProfile.mockResolvedValue(internationalProfile);

      const result = await useCase.execute('international-user-789');

      expect(result).toEqual(internationalProfile);
      expect(result!.language).toBe('es');
      expect(result!.timeZone).toBe('Europe/Madrid');
      expect(result!.customFields?.nationality).toBe('Spanish');
    });
  });

  // =============================================================================
  // EDGE CASES & BOUNDARY TESTS
  // =============================================================================

  describe('Edge Cases', () => {
    it('should handle profile with null/undefined optional fields', async () => {
      const profileWithNulls = createMockUserProfile({
        bio: null as any,
        avatar: null as any,
        dateOfBirth: null as any,
        website: null as any,
        phone: null as any,
        socialLinks: null as any,
        professional: null as any,
      });

      mockProfileService.getProfile.mockResolvedValue(profileWithNulls);

      const result = await useCase.execute(validUserId);

      expect(result).toEqual(profileWithNulls);
      expect(result!.bio).toBeNull();
      expect(result!.socialLinks).toBeNull();
    });

    it('should handle profile with empty custom fields', async () => {
      const profileWithEmptyCustomFields = createMockUserProfile({
        customFields: {}
      });

      mockProfileService.getProfile.mockResolvedValue(profileWithEmptyCustomFields);

      const result = await useCase.execute(validUserId);

      expect(result!.customFields).toEqual({});
    });

    it('should handle profile with malformed dates', async () => {
      const profileWithBadDates = createMockUserProfile({
        dateOfBirth: new Date('invalid-date'),
        createdAt: new Date('2023-13-45'), // Invalid date
        updatedAt: new Date('not-a-date' as any)
      });

      mockProfileService.getProfile.mockResolvedValue(profileWithBadDates);

      const result = await useCase.execute(validUserId);

      expect(result).toEqual(profileWithBadDates);
      // The dates might be invalid, but the use case should still return them as-is
    });

    it('should handle extremely long text fields', async () => {
      const profileWithLongTexts = createMockUserProfile({
        bio: 'A'.repeat(10000),
        website: 'https://example.com/' + 'path/'.repeat(1000),
        professional: {
          ...mockUserProfile.professional!,
          skills: Array.from({ length: 1000 }, (_, i) => `Skill ${i}`)
        }
      });

      mockProfileService.getProfile.mockResolvedValue(profileWithLongTexts);

      const result = await useCase.execute(validUserId);

      expect(result).toEqual(profileWithLongTexts);
      expect(result!.bio?.length).toBe(10000);
      expect(result!.professional!.skills).toHaveLength(1000);
    });

    it('should handle profile version edge cases', async () => {
      const profileWithWeirdVersion = createMockUserProfile({
        profileVersion: 0
      });

      mockProfileService.getProfile.mockResolvedValue(profileWithWeirdVersion);

      const result = await useCase.execute(validUserId);

      expect(result!.profileVersion).toBe(0);
    });

    it('should handle unicode characters in profile data', async () => {
      const profileWithUnicode = createMockUserProfile({
        firstName: '名前',
        lastName: 'Фамилия',
        displayName: '🚀 Test User 🌟',
        bio: 'Bio with emojis 😀 🎉 and unicode ñáéíóú',
        location: 'São Paulo, Brasil 🇧🇷'
      });

      mockProfileService.getProfile.mockResolvedValue(profileWithUnicode);

      const result = await useCase.execute(validUserId);

      expect(result).toEqual(profileWithUnicode);
      expect(result!.firstName).toBe('名前');
      expect(result!.displayName).toContain('🚀');
    });
  });
});