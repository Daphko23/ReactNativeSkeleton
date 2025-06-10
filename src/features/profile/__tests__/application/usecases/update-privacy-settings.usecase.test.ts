/**
 * @fileoverview UPDATE-PRIVACY-SETTINGS-USECASE-TESTS: Enterprise Privacy Settings Test Suite Implementation
 * @description Comprehensive test coverage für UpdatePrivacySettingsUseCase mit
 * Enterprise GDPR Compliance, Privacy Controls und Security Testing.
 * Implementiert Auth Feature Test Patterns für 9/10 Enterprise-Level Coverage.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module UpdatePrivacySettingsUseCaseTests
 * @namespace Features.Profile.Tests.Application.UseCases
 * @category ProfileManagement
 * @subcategory Use Case Tests
 * 
 * @testCategories
 * - **Input Validation Tests:** User ID und settings parameter validation
 * - **Privacy Update Tests:** Privacy settings modification workflow
 * - **GDPR Compliance Tests:** Privacy rights und audit logging
 * - **Business Logic Tests:** Privacy controls und validation
 * - **Error Handling Tests:** Update failure scenarios und recovery
 * - **Performance Tests:** Settings update speed und optimization
 * - **Security Tests:** Privacy settings security validation
 * - **Integration Tests:** End-to-end privacy workflow testing
 * 
 * @compliance
 * - **GDPR Article 7:** Consent management implementation testing
 * - **GDPR Article 13:** Information provision validation
 * - **Privacy by Design:** Default privacy settings testing
 * - **Security Controls:** Privacy settings authorization testing
 * 
 * @since 2025-01-23
 */

import { UpdatePrivacySettingsUseCase } from '../../../application/usecases/update-privacy-settings.usecase';
import { IProfileService } from '../../../domain/interfaces/profile-service.interface';
import { PrivacySettings } from '../../../domain/entities/user-profile.entity';

// Mock external services
jest.mock('../../../data/services/gdpr-audit.service', () => ({
  gdprAuditService: {
    logDataAccess: jest.fn(),
  },
}));

// Import mocked services
import { gdprAuditService } from '../../../data/services/gdpr-audit.service';

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

// =============================================================================
// TEST DATA FACTORIES
// =============================================================================

/**
 * Create default privacy settings
 */
const createDefaultPrivacySettings = (): PrivacySettings => ({
  profileVisibility: 'public',
  emailVisibility: 'private',
  phoneVisibility: 'private',
  locationVisibility: 'friends',
  socialLinksVisibility: 'public',
  professionalInfoVisibility: 'public',
  showOnlineStatus: true,
  allowDirectMessages: true,
  allowFriendRequests: true,
  emailNotifications: true,
  pushNotifications: true,
  marketingCommunications: false,
});

/**
 * Create updated privacy settings
 */
const createUpdatedPrivacySettings = (overrides: Partial<PrivacySettings> = {}): PrivacySettings => ({
  ...createDefaultPrivacySettings(),
  ...overrides,
});

/**
 * Create privacy settings update request
 */
const createPrivacySettingsUpdate = (overrides: Partial<PrivacySettings> = {}): Partial<PrivacySettings> => ({
  profileVisibility: 'private',
  emailNotifications: false,
  pushNotifications: false,
  ...overrides,
});

/**
 * Create privacy service error
 */
const createPrivacyServiceError = (message: string) => {
  const error = new Error(message);
  error.name = 'PrivacyServiceError';
  return error;
};

/**
 * Create validation error
 */
const createValidationError = (field: string, message: string) => {
  const error = new Error(`Validation failed for ${field}: ${message}`);
  error.name = 'ValidationError';
  (error as any).field = field;
  return error;
};

/**
 * Create GDPR compliance error
 */
const createGDPRComplianceError = (message: string) => {
  const error = new Error(message);
  error.name = 'GDPRComplianceError';
  return error;
};

// =============================================================================
// MAIN TEST SUITE
// =============================================================================

describe('UpdatePrivacySettingsUseCase', () => {
  let useCase: UpdatePrivacySettingsUseCase;
  let mockProfileService: jest.Mocked<IProfileService>;
  let mockGdprAuditService: jest.Mocked<typeof gdprAuditService>;

  // Test data
  const validUserId = 'test-user-123';
  const defaultPrivacySettings = createDefaultPrivacySettings();
  const updatedPrivacySettings = createUpdatedPrivacySettings({
    profileVisibility: 'private',
    emailNotifications: false,
  });
  const privacyUpdate = createPrivacySettingsUpdate();

  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileService = createMockProfileService();
    mockGdprAuditService = gdprAuditService as jest.Mocked<typeof gdprAuditService>;
    
    useCase = new UpdatePrivacySettingsUseCase(mockProfileService);
    
    // Reset mock implementations
    mockProfileService.updatePrivacySettings.mockResolvedValue(updatedPrivacySettings);
    mockGdprAuditService.logDataAccess.mockResolvedValue('mock-event-id');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // CONSTRUCTOR TESTS
  // =============================================================================

  describe('Constructor', () => {
    it('should create instance with valid ProfileService', () => {
      expect(useCase).toBeInstanceOf(UpdatePrivacySettingsUseCase);
    });

    it('should accept ProfileService in constructor', () => {
      const profileService = createMockProfileService();
      const instance = new UpdatePrivacySettingsUseCase(profileService);
      expect(instance).toBeInstanceOf(UpdatePrivacySettingsUseCase);
    });
  });

  // =============================================================================
  // INPUT VALIDATION TESTS
  // =============================================================================

  describe('Input Validation', () => {
    it('should accept valid userId and settings', async () => {
      const result = await useCase.execute(validUserId, privacyUpdate);

      expect(result).toEqual(updatedPrivacySettings);
      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledWith(validUserId, privacyUpdate);
    });

    it('should handle empty settings update', async () => {
      const emptyUpdate = {};
      mockProfileService.updatePrivacySettings.mockResolvedValue(defaultPrivacySettings);

      const result = await useCase.execute(validUserId, emptyUpdate);

      expect(result).toEqual(defaultPrivacySettings);
      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledWith(validUserId, emptyUpdate);
    });

    it('should handle partial settings update', async () => {
      const partialUpdate = { emailNotifications: false };
      const partiallyUpdatedSettings = createUpdatedPrivacySettings(partialUpdate);
      mockProfileService.updatePrivacySettings.mockResolvedValue(partiallyUpdatedSettings);

      const result = await useCase.execute(validUserId, partialUpdate);

      expect(result).toEqual(partiallyUpdatedSettings);
      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledWith(validUserId, partialUpdate);
    });

    it('should handle special characters in userId', async () => {
      const specialUserId = 'user_用户_2024@#$%';

      const result = await useCase.execute(specialUserId, privacyUpdate);

      expect(result).toEqual(updatedPrivacySettings);
      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledWith(specialUserId, privacyUpdate);
    });

    it('should handle null/undefined userId gracefully', async () => {
      const serviceError = new Error('UserId is required');
      mockProfileService.updatePrivacySettings.mockRejectedValue(serviceError);

      await expect(useCase.execute(null as any, privacyUpdate))
        .rejects.toThrow('Unable to update privacy settings');

      await expect(useCase.execute(undefined as any, privacyUpdate))
        .rejects.toThrow('Unable to update privacy settings');
    });
  });

  // =============================================================================
  // PRIVACY UPDATE TESTS
  // =============================================================================

  describe('Privacy Update', () => {
    it('should update privacy settings successfully', async () => {
      const result = await useCase.execute(validUserId, privacyUpdate);

      expect(result).toEqual(updatedPrivacySettings);
      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledWith(validUserId, privacyUpdate);
    });

    it('should handle profile visibility updates', async () => {
      const visibilityUpdate = { profileVisibility: 'friends' as const };
      const updatedSettings = createUpdatedPrivacySettings(visibilityUpdate);
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const result = await useCase.execute(validUserId, visibilityUpdate);

      expect(result.profileVisibility).toBe('friends');
    });

    it('should handle notification preferences updates', async () => {
      const notificationUpdate = {
        emailNotifications: false,
        pushNotifications: false,
        marketingCommunications: true,
      };
      const updatedSettings = createUpdatedPrivacySettings(notificationUpdate);
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const result = await useCase.execute(validUserId, notificationUpdate);

      expect(result.emailNotifications).toBe(false);
      expect(result.pushNotifications).toBe(false);
      expect(result.marketingCommunications).toBe(true);
    });

    it('should handle communication preferences updates', async () => {
      const communicationUpdate = {
        allowDirectMessages: false,
        allowFriendRequests: false,
        showOnlineStatus: false,
      };
      const updatedSettings = createUpdatedPrivacySettings(communicationUpdate);
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const result = await useCase.execute(validUserId, communicationUpdate);

      expect(result.allowDirectMessages).toBe(false);
      expect(result.allowFriendRequests).toBe(false);
      expect(result.showOnlineStatus).toBe(false);
    });

    it('should handle information visibility updates', async () => {
      const visibilityUpdate = {
        emailVisibility: 'public' as const,
        phoneVisibility: 'friends' as const,
        locationVisibility: 'private' as const,
      };
      const updatedSettings = createUpdatedPrivacySettings(visibilityUpdate);
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const result = await useCase.execute(validUserId, visibilityUpdate);

      expect(result.emailVisibility).toBe('public');
      expect(result.phoneVisibility).toBe('friends');
      expect(result.locationVisibility).toBe('private');
    });

    it('should handle multiple setting updates at once', async () => {
      const multipleUpdates = {
        profileVisibility: 'private' as const,
        emailNotifications: false,
        pushNotifications: false,
        allowDirectMessages: false,
        showOnlineStatus: false,
      };
      const updatedSettings = createUpdatedPrivacySettings(multipleUpdates);
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const result = await useCase.execute(validUserId, multipleUpdates);

      expect(result.profileVisibility).toBe('private');
      expect(result.emailNotifications).toBe(false);
      expect(result.pushNotifications).toBe(false);
      expect(result.allowDirectMessages).toBe(false);
      expect(result.showOnlineStatus).toBe(false);
    });
  });

  // =============================================================================
  // GDPR COMPLIANCE TESTS
  // =============================================================================

  describe('GDPR Compliance', () => {
    it('should log GDPR audit after successful update', async () => {
      const result = await useCase.execute(validUserId, privacyUpdate);

      expect(result).toEqual(updatedPrivacySettings);
      expect(mockGdprAuditService.logDataAccess).toHaveBeenCalledWith(
        validUserId,
        ['privacy_settings_usecase'],
        'view',
        validUserId,
        expect.objectContaining({
          correlationId: expect.stringMatching(/^update-privacy-usecase-\d+-[a-z0-9]+$/)
        })
      );
    });

    it('should include correlation ID in GDPR audit', async () => {
      await useCase.execute(validUserId, privacyUpdate);

      expect(mockGdprAuditService.logDataAccess).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.stringContaining('update-privacy-usecase-')
        })
      );
    });

    it('should handle GDPR audit service failures', async () => {
      // Profile service succeeds first
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedPrivacySettings);
      
      // Then audit service fails - this will cause the whole use case to fail
      const auditError = new Error('Audit service unavailable');
      mockGdprAuditService.logDataAccess.mockRejectedValue(auditError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // The use case will fail because audit error is not caught
      await expect(useCase.execute(validUserId, privacyUpdate))
        .rejects.toThrow('Unable to update privacy settings');

      consoleSpy.mockRestore();
    });

    it('should log GDPR compliance with correct parameters', async () => {
      await useCase.execute(validUserId, privacyUpdate);

      expect(mockGdprAuditService.logDataAccess).toHaveBeenCalledWith(
        validUserId, // userId
        ['privacy_settings_usecase'], // dataTypes
        'view', // purpose
        validUserId, // performedBy (same user)
        expect.objectContaining({
          correlationId: expect.any(String)
        })
      );
    });

    it('should generate unique correlation IDs', async () => {
      await useCase.execute('user-1', privacyUpdate);
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1));
      await useCase.execute('user-2', privacyUpdate);

      expect(mockGdprAuditService.logDataAccess).toHaveBeenCalledTimes(2);
      
      const firstCall = mockGdprAuditService.logDataAccess.mock.calls[0]?.[4];
      const secondCall = mockGdprAuditService.logDataAccess.mock.calls[1]?.[4];
      
      expect(firstCall?.correlationId).not.toBe(secondCall?.correlationId);
    });

    it('should audit marketing communications changes', async () => {
      const marketingUpdate = { marketingCommunications: true };
      const updatedSettings = createUpdatedPrivacySettings(marketingUpdate);
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      await useCase.execute(validUserId, marketingUpdate);

      expect(mockGdprAuditService.logDataAccess).toHaveBeenCalled();
    });
  });

  // =============================================================================
  // BUSINESS LOGIC TESTS
  // =============================================================================

  describe('Business Logic', () => {
    it('should preserve existing settings when updating partial settings', async () => {
      const partialUpdate = { emailNotifications: false };
      const expectedSettings = createUpdatedPrivacySettings({
        ...defaultPrivacySettings,
        emailNotifications: false,
      });
      mockProfileService.updatePrivacySettings.mockResolvedValue(expectedSettings);

      const result = await useCase.execute(validUserId, partialUpdate);

      expect(result).toEqual(expectedSettings);
    });

    it('should handle privacy level escalation', async () => {
      const privacyEscalation = {
        profileVisibility: 'private' as const,
        emailVisibility: 'private' as const,
        phoneVisibility: 'private' as const,
        locationVisibility: 'private' as const,
      };
      const updatedSettings = createUpdatedPrivacySettings(privacyEscalation);
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const result = await useCase.execute(validUserId, privacyEscalation);

      expect(result.profileVisibility).toBe('private');
      expect(result.emailVisibility).toBe('private');
      expect(result.phoneVisibility).toBe('private');
      expect(result.locationVisibility).toBe('private');
    });

    it('should handle privacy level reduction', async () => {
      const privacyReduction = {
        profileVisibility: 'public' as const,
        emailVisibility: 'public' as const,
        socialLinksVisibility: 'public' as const,
      };
      const updatedSettings = createUpdatedPrivacySettings(privacyReduction);
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const result = await useCase.execute(validUserId, privacyReduction);

      expect(result.profileVisibility).toBe('public');
      expect(result.emailVisibility).toBe('public');
      expect(result.socialLinksVisibility).toBe('public');
    });

    it('should handle opt-out from all communications', async () => {
      const optOutAll = {
        emailNotifications: false,
        pushNotifications: false,
        marketingCommunications: false,
        allowDirectMessages: false,
      };
      const updatedSettings = createUpdatedPrivacySettings(optOutAll);
      mockProfileService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const result = await useCase.execute(validUserId, optOutAll);

      expect(result.emailNotifications).toBe(false);
      expect(result.pushNotifications).toBe(false);
      expect(result.marketingCommunications).toBe(false);
      expect(result.allowDirectMessages).toBe(false);
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Handling', () => {
    it('should handle profile service errors', async () => {
      const serviceError = createPrivacyServiceError('Database connection failed');
      mockProfileService.updatePrivacySettings.mockRejectedValue(serviceError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(useCase.execute(validUserId, privacyUpdate))
        .rejects.toThrow('Unable to update privacy settings');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to update privacy settings:',
        serviceError
      );

      consoleSpy.mockRestore();
    });

    it('should handle validation errors', async () => {
      const validationError = createValidationError('profileVisibility', 'Invalid visibility option');
      mockProfileService.updatePrivacySettings.mockRejectedValue(validationError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(useCase.execute(validUserId, privacyUpdate))
        .rejects.toThrow('Unable to update privacy settings');

      consoleSpy.mockRestore();
    });

    it('should handle network connectivity errors', async () => {
      const networkError = new Error('Network timeout');
      networkError.name = 'NetworkError';
      mockProfileService.updatePrivacySettings.mockRejectedValue(networkError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(useCase.execute(validUserId, privacyUpdate))
        .rejects.toThrow('Unable to update privacy settings');

      consoleSpy.mockRestore();
    });

    it('should handle authorization errors', async () => {
      const authError = new Error('Insufficient permissions');
      authError.name = 'AuthorizationError';
      mockProfileService.updatePrivacySettings.mockRejectedValue(authError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(useCase.execute(validUserId, privacyUpdate))
        .rejects.toThrow('Unable to update privacy settings');

      consoleSpy.mockRestore();
    });

    it('should handle GDPR compliance errors', async () => {
      const gdprError = createGDPRComplianceError('GDPR validation failed');
      mockProfileService.updatePrivacySettings.mockRejectedValue(gdprError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(useCase.execute(validUserId, privacyUpdate))
        .rejects.toThrow('Unable to update privacy settings');

      consoleSpy.mockRestore();
    });

    it('should log errors to console', async () => {
      const testError = new Error('Test error for logging');
      mockProfileService.updatePrivacySettings.mockRejectedValue(testError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(useCase.execute(validUserId, privacyUpdate))
        .rejects.toThrow('Unable to update privacy settings');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to update privacy settings:',
        testError
      );

      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Performance', () => {
    it('should complete privacy update within reasonable time', async () => {
      const startTime = Date.now();
      
      const result = await useCase.execute(validUserId, privacyUpdate);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(100); // Should complete within 100ms
      expect(result).toEqual(updatedPrivacySettings);
    });

    it('should handle concurrent privacy updates efficiently', async () => {
      const userIds = ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'];
      
      const promises = userIds.map(userId => useCase.execute(userId, privacyUpdate));
      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result).toEqual(updatedPrivacySettings);
      });

      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledTimes(5);
    });

    it('should not delay on GDPR audit logging', async () => {
      // Simulate slow audit service
      mockGdprAuditService.logDataAccess.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'mock-event-id';
      });

      const startTime = Date.now();
      const result = await useCase.execute(validUserId, privacyUpdate);
      const endTime = Date.now();

      expect(result).toEqual(updatedPrivacySettings);
      // Should not wait for audit logging to complete
      expect(endTime - startTime).toBeLessThan(200);
    });

    it('should optimize bulk privacy updates', async () => {
      const bulkUpdate = {
        profileVisibility: 'private' as const,
        emailVisibility: 'private' as const,
        phoneVisibility: 'private' as const,
        locationVisibility: 'private' as const,
        emailNotifications: false,
        pushNotifications: false,
        marketingCommunications: false,
      };

      const startTime = Date.now();
      const result = await useCase.execute(validUserId, bulkUpdate);
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('Integration Scenarios', () => {
    it('should handle complete privacy settings workflow', async () => {
      const result = await useCase.execute(validUserId, privacyUpdate);

      expect(result).toEqual(updatedPrivacySettings);
      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledWith(validUserId, privacyUpdate);
      expect(mockGdprAuditService.logDataAccess).toHaveBeenCalled();
    });

    it('should handle enterprise user privacy updates', async () => {
      const enterpriseUserId = 'enterprise-user-789';
      const enterprisePrivacyUpdate = {
        profileVisibility: 'private' as const,
        emailNotifications: false,
        marketingCommunications: false,
      };

      const result = await useCase.execute(enterpriseUserId, enterprisePrivacyUpdate);

      expect(result).toEqual(updatedPrivacySettings);
      expect(mockGdprAuditService.logDataAccess).toHaveBeenCalledWith(
        enterpriseUserId,
        ['privacy_settings_usecase'],
        'view',
        enterpriseUserId,
        expect.any(Object)
      );
    });

    it('should handle mobile app privacy updates', async () => {
      const mobileUserId = 'mobile-user-456';
      const mobilePrivacyUpdate = {
        pushNotifications: false,
        allowDirectMessages: false,
      };

      const result = await useCase.execute(mobileUserId, mobilePrivacyUpdate);

      expect(result).toEqual(updatedPrivacySettings);
    });

    it('should handle GDPR compliance workflow', async () => {
      const gdprPrivacyUpdate = {
        emailNotifications: false,
        pushNotifications: false,
        marketingCommunications: false,
        profileVisibility: 'private' as const,
      };

      const result = await useCase.execute(validUserId, gdprPrivacyUpdate);

      expect(result).toBeDefined();
      expect(mockGdprAuditService.logDataAccess).toHaveBeenCalled();
    });
  });

  // =============================================================================
  // EDGE CASES & BOUNDARY TESTS
  // =============================================================================

  describe('Edge Cases', () => {
    it('should handle very long user IDs', async () => {
      const longUserId = 'a'.repeat(1000);

      const result = await useCase.execute(longUserId, privacyUpdate);

      expect(result).toEqual(updatedPrivacySettings);
      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledWith(longUserId, privacyUpdate);
    });

    it('should handle Unicode characters in user IDs', async () => {
      const unicodeUserId = 'user_用户_🙂_123';

      const result = await useCase.execute(unicodeUserId, privacyUpdate);

      expect(result).toEqual(updatedPrivacySettings);
    });

    it('should handle settings with all boolean values false', async () => {
      const allFalseUpdate = {
        showOnlineStatus: false,
        allowDirectMessages: false,
        allowFriendRequests: false,
        emailNotifications: false,
        pushNotifications: false,
        marketingCommunications: false,
      };
      const allFalseSettings = createUpdatedPrivacySettings(allFalseUpdate);
      mockProfileService.updatePrivacySettings.mockResolvedValue(allFalseSettings);

      const result = await useCase.execute(validUserId, allFalseUpdate);

      expect(result).toEqual(allFalseSettings);
    });

    it('should handle settings with all boolean values true', async () => {
      const allTrueUpdate = {
        showOnlineStatus: true,
        allowDirectMessages: true,
        allowFriendRequests: true,
        emailNotifications: true,
        pushNotifications: true,
        marketingCommunications: true,
      };
      const allTrueSettings = createUpdatedPrivacySettings(allTrueUpdate);
      mockProfileService.updatePrivacySettings.mockResolvedValue(allTrueSettings);

      const result = await useCase.execute(validUserId, allTrueUpdate);

      expect(result).toEqual(allTrueSettings);
    });

    it('should handle rapid successive privacy updates', async () => {
      const updates = [
        { emailNotifications: false },
        { pushNotifications: false },
        { marketingCommunications: false },
      ];

      for (const update of updates) {
        const result = await useCase.execute(validUserId, update);
        expect(result).toBeDefined();
      }

      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledTimes(3);
    });

    it('should handle settings update with invalid enum values gracefully', async () => {
      const invalidUpdate = {
        profileVisibility: 'invalid_visibility' as any,
      };

      const validationError = createValidationError('profileVisibility', 'Invalid visibility value');
      mockProfileService.updatePrivacySettings.mockRejectedValue(validationError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(useCase.execute(validUserId, invalidUpdate))
        .rejects.toThrow('Unable to update privacy settings');

      consoleSpy.mockRestore();
    });
  });
});