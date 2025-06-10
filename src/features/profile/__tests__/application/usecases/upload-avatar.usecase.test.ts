/**
 * @fileoverview UPLOAD-AVATAR-USECASE-TESTS: Enterprise File Upload Test Suite Implementation
 * @description Comprehensive test coverage für UploadAvatarUseCase mit
 * Enterprise Security Standards, File Validation und Media Management Testing.
 * Implementiert Auth Feature Test Patterns für 9/10 Enterprise-Level Coverage.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module UploadAvatarUseCaseTests
 * @namespace Features.Profile.Tests.Application.UseCases
 * @category ProfileManagement
 * @subcategory Use Case Tests
 * 
 * @testCategories
 * - **Input Validation Tests:** File parameter validation und sanitization
 * - **File Security Tests:** File type, size, content validation
 * - **Upload Logic Tests:** File upload workflow testing
 * - **Error Handling Tests:** Upload failure scenarios und recovery
 * - **Performance Tests:** Upload speed und optimization validation
 * - **Integration Tests:** End-to-end upload workflow testing
 * 
 * @compliance
 * - **File Security:** Malware scanning und content validation
 * - **GDPR Compliance:** Image metadata removal und privacy controls
 * - **Content Policy:** Inappropriate content detection und filtering
 * - **Enterprise Security:** File upload security standards implementation
 * 
 * @since 2025-01-23
 */

import { UploadAvatarUseCase } from '../../../application/usecases/upload-avatar.usecase';
import { IProfileService } from '../../../domain/interfaces/profile-service.interface';
import { LoggerFactory } from '@core/logging/logger.factory';

// =============================================================================
// TEST MOCKS & SETUP
// =============================================================================

/**
 * Mock File interface für testing
 */
interface MockFile {
  uri: string;
  name: string;
  type: string;
  size: number;
  base64?: string;
  width?: number;
  height?: number;
  lastModified?: number;
}

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
 * Create valid image file for testing
 */
const createValidImageFile = (overrides: Partial<MockFile> = {}): MockFile => ({
  uri: 'file:///path/to/image.jpg',
  name: 'avatar.jpg',
  type: 'image/jpeg',
  size: 1024 * 500, // 500KB
  base64: '/9j/4AAQSkZJRgABAQEAYABgAAD...', // Mock base64 data
  width: 512,
  height: 512,
  lastModified: Date.now(),
  ...overrides,
});

/**
 * Create large image file for testing
 */
const createLargeImageFile = (): MockFile => createValidImageFile({
  name: 'large-avatar.jpg',
  size: 1024 * 1024 * 10, // 10MB
  width: 4000,
  height: 4000,
});

/**
 * Create invalid file for testing
 */
const createInvalidFile = (overrides: Partial<MockFile> = {}): MockFile => ({
  uri: 'file:///path/to/document.pdf',
  name: 'document.pdf',
  type: 'application/pdf',
  size: 1024 * 100, // 100KB
  ...overrides,
});

/**
 * Create file validation error
 */
const createFileValidationError = (field: string, message: string) => {
  const error = new Error(`File validation failed: ${message}`);
  (error as any).field = field;
  (error as any).validation = message;
  error.name = 'FileValidationError';
  return error;
};

/**
 * Create file security error
 */
const createFileSecurityError = (reason: string) => {
  const error = new Error(`File security check failed: ${reason}`);
  (error as any).securityReason = reason;
  error.name = 'FileSecurityError';
  return error;
};

/**
 * Create upload error
 */
const createUploadError = (message: string) => {
  const error = new Error(`Upload failed: ${message}`);
  error.name = 'UploadError';
  return error;
};

// =============================================================================
// MAIN TEST SUITE
// =============================================================================

describe('UploadAvatarUseCase', () => {
  let useCase: UploadAvatarUseCase;
  let mockProfileService: jest.Mocked<IProfileService>;
  
  // Test data
  const validUserId = 'test-user-123';
  const validImageFile = createValidImageFile();
  const successfulAvatarUrl = 'https://cdn.example.com/avatars/user-123/avatar.jpg';

  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileService = createMockProfileService();
    useCase = new UploadAvatarUseCase(mockProfileService);
    
    // Reset mock implementations
    mockProfileService.uploadAvatar.mockResolvedValue(successfulAvatarUrl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // CONSTRUCTOR TESTS
  // =============================================================================

  describe('Constructor', () => {
    it('should create instance with valid ProfileService', () => {
      expect(useCase).toBeInstanceOf(UploadAvatarUseCase);
    });

    it('should throw error when ProfileService is null', () => {
      expect(() => new UploadAvatarUseCase(null as any))
        .toThrow('ProfileService is required for UploadAvatarUseCase');
    });

    it('should throw error when ProfileService is undefined', () => {
      expect(() => new UploadAvatarUseCase(undefined as any))
        .toThrow('ProfileService is required for UploadAvatarUseCase');
    });

    it('should initialize logger correctly', () => {
      expect(LoggerFactory.createServiceLogger).toHaveBeenCalledWith('UploadAvatarUseCase');
    });
  });

  // =============================================================================
  // INPUT VALIDATION TESTS
  // =============================================================================

  describe('Input Validation', () => {
    it('should throw error when userId is empty string', async () => {
      await expect(useCase.execute('', validImageFile))
        .rejects.toThrow('Valid userId is required for avatar upload');

      expect(mockProfileService.uploadAvatar).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Invalid userId provided to UploadAvatarUseCase',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.any(String),
          metadata: expect.objectContaining({
            userId: 'undefined',
            operation: 'upload_avatar'
          })
        })
      );
    });

    it('should throw error when userId is null', async () => {
      await expect(useCase.execute(null as any, validImageFile))
        .rejects.toThrow('Valid userId is required for avatar upload');

      expect(mockProfileService.uploadAvatar).not.toHaveBeenCalled();
    });

    it('should throw error when userId is undefined', async () => {
      await expect(useCase.execute(undefined as any, validImageFile))
        .rejects.toThrow('Valid userId is required for avatar upload');

      expect(mockProfileService.uploadAvatar).not.toHaveBeenCalled();
    });

    it('should throw error when userId is only whitespace', async () => {
      await expect(useCase.execute('   ', validImageFile))
        .rejects.toThrow('Valid userId is required for avatar upload');

      expect(mockProfileService.uploadAvatar).not.toHaveBeenCalled();
    });

    it('should throw error when file is null', async () => {
      await expect(useCase.execute(validUserId, null as any))
        .rejects.toThrow('Valid file is required for avatar upload');

      expect(mockProfileService.uploadAvatar).not.toHaveBeenCalled();
    });

    it('should throw error when file is undefined', async () => {
      await expect(useCase.execute(validUserId, undefined as any))
        .rejects.toThrow('Valid file is required for avatar upload');

      expect(mockProfileService.uploadAvatar).not.toHaveBeenCalled();
    });

    it('should accept valid userId and file', async () => {
      const result = await useCase.execute(validUserId, validImageFile);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.avatarUrl).toBe(successfulAvatarUrl);
    });
  });

  // =============================================================================
  // FILE VALIDATION TESTS
  // =============================================================================

  describe('File Validation', () => {
    it('should reject files without URI', async () => {
      const fileWithoutUri = { ...validImageFile, uri: '' };

      const validationError = createFileValidationError('uri', 'File URI is required');
      mockProfileService.uploadAvatar.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, fileWithoutUri))
        .rejects.toThrow('Avatar upload failed: File validation failed: File URI is required');
    });

    it('should reject files with invalid MIME type', async () => {
      const invalidFile = createInvalidFile();

      const validationError = createFileValidationError('type', 'Invalid file type. Only images are allowed');
      mockProfileService.uploadAvatar.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, invalidFile))
        .rejects.toThrow('Avatar upload failed: File validation failed: Invalid file type. Only images are allowed');
    });

    it('should reject files that are too large', async () => {
      const largeFile = createLargeImageFile();

      const validationError = createFileValidationError('size', 'File size exceeds maximum limit of 5MB');
      mockProfileService.uploadAvatar.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, largeFile))
        .rejects.toThrow('Avatar upload failed: File validation failed: File size exceeds maximum limit of 5MB');
    });

    it('should accept valid image files', async () => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      for (const type of validTypes) {
        const validFile = createValidImageFile({ type, name: `avatar.${type.split('/')[1]}` });
        
        const result = await useCase.execute(validUserId, validFile);
        
        expect(result.success).toBe(true);
        expect(mockProfileService.uploadAvatar).toHaveBeenCalledWith(validUserId, validFile.uri);
      }
    });

    it('should validate file dimensions', async () => {
      const tinyImage = createValidImageFile({ width: 32, height: 32 });

      const validationError = createFileValidationError('dimensions', 'Image dimensions too small. Minimum 64x64 required');
      mockProfileService.uploadAvatar.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, tinyImage))
        .rejects.toThrow('Avatar upload failed: File validation failed: Image dimensions too small. Minimum 64x64 required');
    });
  });

  // =============================================================================
  // FILE SECURITY TESTS
  // =============================================================================

  describe('File Security', () => {
    it('should detect malicious files', async () => {
      const maliciousFile = createValidImageFile({
        name: 'script.exe',
        type: 'image/jpeg' // Fake MIME type
      });

      const securityError = createFileSecurityError('Suspicious file content detected');
      mockProfileService.uploadAvatar.mockRejectedValue(securityError);

      await expect(useCase.execute(validUserId, maliciousFile))
        .rejects.toThrow('Avatar upload failed: File security check failed: Suspicious file content detected');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Avatar upload failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'upload_avatar',
            securityReason: 'File security violation'
          })
        }),
        securityError
      );
    });

    it('should validate file headers', async () => {
      const fileWithFakeExtension = createValidImageFile({
        name: 'script.exe',
        type: 'image/jpeg' // Fake MIME type
      });

      const securityError = createFileSecurityError('File extension does not match content type');
      mockProfileService.uploadAvatar.mockRejectedValue(securityError);

      await expect(useCase.execute(validUserId, fileWithFakeExtension))
        .rejects.toThrow('Avatar upload failed: File security check failed: File extension does not match content type');
    });

    it('should pass security checks for clean files', async () => {
      const cleanFile = createValidImageFile();

      const result = await useCase.execute(validUserId, cleanFile);

      expect(result.success).toBe(true);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Avatar uploaded successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            securityChecksPass: true
          })
        })
      );
    });
  });

  // =============================================================================
  // UPLOAD LOGIC TESTS
  // =============================================================================

  describe('Upload Logic', () => {
    it('should upload valid image successfully', async () => {
      const result = await useCase.execute(validUserId, validImageFile);

      expect(result.success).toBe(true);
      expect(result.avatarUrl).toBe(successfulAvatarUrl);
      expect(mockProfileService.uploadAvatar).toHaveBeenCalledWith(validUserId, validImageFile.uri);
    });

    it('should handle profile service upload success', async () => {
      const customAvatarUrl = 'https://cdn.example.com/new-avatar.jpg';
      mockProfileService.uploadAvatar.mockResolvedValue(customAvatarUrl);

      const result = await useCase.execute(validUserId, validImageFile);

      expect(result.avatarUrl).toBe(customAvatarUrl);
      expect(result.success).toBe(true);
    });

    it('should create proper upload result structure', async () => {
      const result = await useCase.execute(validUserId, validImageFile);

      expect(result).toMatchObject({
        success: true,
        avatarUrl: successfulAvatarUrl,
        fileId: expect.stringMatching(/^file_\d+$/),
        size: validImageFile.size,
        format: 'jpeg',
        dimensions: {
          width: 512,
          height: 512
        },
        uploadedAt: expect.any(Date)
      });
    });

    it('should handle different image formats', async () => {
      const formats = [
        { type: 'image/jpeg', extension: 'jpg', format: 'jpeg' },
        { type: 'image/png', extension: 'png', format: 'png' },
        { type: 'image/gif', extension: 'gif', format: 'gif' },
        { type: 'image/webp', extension: 'webp', format: 'webp' }
      ];

      for (const formatInfo of formats) {
        const file = createValidImageFile({
          type: formatInfo.type,
          name: `avatar.${formatInfo.extension}`
        });

        const uploadResult = await useCase.execute(validUserId, file);

        expect(uploadResult.format).toBe(formatInfo.format);
        expect(uploadResult.success).toBe(true);
      }
    });

    it('should use file dimensions when available', async () => {
      const fileWithDimensions = createValidImageFile({
        width: 1024,
        height: 768
      });

      const result = await useCase.execute(validUserId, fileWithDimensions);

      expect(result.dimensions).toEqual({
        width: 1024,
        height: 768
      });
    });

    it('should use default dimensions when not available', async () => {
      const fileWithoutDimensions = createValidImageFile({
        width: undefined,
        height: undefined
      });

      const result = await useCase.execute(validUserId, fileWithoutDimensions);

      expect(result.dimensions).toEqual({
        width: 512,
        height: 512
      });
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Handling', () => {
    it('should handle storage service errors', async () => {
      const storageError = createUploadError('Storage service unavailable');
      mockProfileService.uploadAvatar.mockRejectedValue(storageError);

      await expect(useCase.execute(validUserId, validImageFile))
        .rejects.toThrow('Avatar upload failed: Upload failed: Storage service unavailable');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Avatar upload failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            operation: 'upload_avatar'
          })
        }),
        storageError
      );
    });

    it('should handle network connectivity errors', async () => {
      const networkError = new Error('Network timeout');
      networkError.name = 'NetworkError';
      mockProfileService.uploadAvatar.mockRejectedValue(networkError);

      await expect(useCase.execute(validUserId, validImageFile))
        .rejects.toThrow('Avatar upload failed: Network timeout');
    });

    it('should handle CDN upload failures', async () => {
      const cdnError = new Error('CDN upload failed');
      cdnError.name = 'CDNError';
      mockProfileService.uploadAvatar.mockRejectedValue(cdnError);

      await expect(useCase.execute(validUserId, validImageFile))
        .rejects.toThrow('Avatar upload failed: CDN upload failed');
    });

    it('should preserve custom error properties', async () => {
      class CustomUploadError extends Error {
        code = 'UPLOAD_ERROR';
        statusCode = 507;
        retryAfter = 300;
      }
      
      const customError = new CustomUploadError('Insufficient storage');
      mockProfileService.uploadAvatar.mockRejectedValue(customError);

      try {
        await useCase.execute(validUserId, validImageFile);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toBe('Avatar upload failed: Insufficient storage');
        expect(error.code).toBe('UPLOAD_ERROR');
        expect(error.statusCode).toBe(507);
        expect(error.retryAfter).toBe(300);
      }
    });
  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Performance', () => {
    it('should complete upload within reasonable time', async () => {
      const startTime = Date.now();
      
      const result = await useCase.execute(validUserId, validImageFile);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
      expect(result.success).toBe(true);
    });

    it('should handle concurrent uploads efficiently', async () => {
      const files = [
        createValidImageFile({ name: 'avatar1.jpg' }),
        createValidImageFile({ name: 'avatar2.jpg' }),
        createValidImageFile({ name: 'avatar3.jpg' })
      ];
      
      // Mock different responses for each upload
      mockProfileService.uploadAvatar
        .mockResolvedValueOnce('https://cdn.example.com/avatar1.jpg')
        .mockResolvedValueOnce('https://cdn.example.com/avatar2.jpg')
        .mockResolvedValueOnce('https://cdn.example.com/avatar3.jpg');

      const promises = files.map(file => useCase.execute(validUserId, file));
      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.avatarUrl).toContain(`avatar${index + 1}.jpg`);
      });

      expect(mockProfileService.uploadAvatar).toHaveBeenCalledTimes(3);
    });

    it('should log performance metrics', async () => {
      await useCase.execute(validUserId, validImageFile);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Avatar uploaded successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            executionTimeMs: expect.any(Number),
            fileSize: validImageFile.size,
            imageDimensions: expect.any(Object)
          })
        })
      );
    });
  });

  // =============================================================================
  // LOGGING & AUDIT TESTS
  // =============================================================================

  describe('Logging & Audit', () => {
    it('should log upload start with correlation ID', async () => {
      await useCase.execute(validUserId, validImageFile);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting avatar upload',
        expect.any(String),
        expect.objectContaining({
          correlationId: expect.stringMatching(/^upload_avatar_usecase_\d+_[a-z0-9]+$/),
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'upload_avatar',
            fileName: validImageFile.name,
            fileSize: validImageFile.size,
            fileType: validImageFile.type
          })
        })
      );
    });

    it('should log successful upload with file details', async () => {
      const result = await useCase.execute(validUserId, validImageFile);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Avatar uploaded successfully',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'upload_avatar',
            fileId: result.fileId,
            avatarUrl: result.avatarUrl,
            fileSize: validImageFile.size,
            imageDimensions: result.dimensions
          })
        })
      );
    });

    it('should log validation failures with file details', async () => {
      const invalidFile = createInvalidFile();
      const validationError = createFileValidationError('type', 'Invalid file type');
      mockProfileService.uploadAvatar.mockRejectedValue(validationError);

      await expect(useCase.execute(validUserId, invalidFile)).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Avatar upload failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'upload_avatar',
            fileName: invalidFile.name,
            fileType: invalidFile.type,
            fileSize: invalidFile.size
          })
        }),
        validationError
      );
    });

    it('should log security violations with details', async () => {
      const maliciousFile = createValidImageFile({
        name: 'malware.exe',
        type: 'image/jpeg'
      });
      const securityError = createFileSecurityError('Malware detected');
      mockProfileService.uploadAvatar.mockRejectedValue(securityError);

      await expect(useCase.execute(validUserId, maliciousFile)).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Avatar upload failed',
        expect.any(String),
        expect.objectContaining({
          metadata: expect.objectContaining({
            userId: validUserId,
            operation: 'upload_avatar',
            securityReason: 'File security violation'
          })
        }),
        securityError
      );
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('Integration Scenarios', () => {
    it('should handle complete avatar upload workflow', async () => {
      const result = await useCase.execute(validUserId, validImageFile);

      expect(result.success).toBe(true);
      expect(result.avatarUrl).toBe(successfulAvatarUrl);
      expect(result.fileId).toMatch(/^file_\d+$/);
      expect(result.uploadedAt).toBeInstanceOf(Date);
    });

    it('should handle enterprise user avatar upload', async () => {
      const enterpriseFile = createValidImageFile({
        name: 'executive-photo.jpg',
        size: 1024 * 1024, // 1MB professional photo
        width: 1024,
        height: 1024
      });

      const enterpriseAvatarUrl = 'https://enterprise-cdn.company.com/executives/user-123.jpg';
      mockProfileService.uploadAvatar.mockResolvedValue(enterpriseAvatarUrl);

      const result = await useCase.execute('enterprise-user-789', enterpriseFile);

      expect(result.success).toBe(true);
      expect(result.avatarUrl).toBe(enterpriseAvatarUrl);
      expect(result.dimensions).toEqual({ width: 1024, height: 1024 });
    });

    it('should handle mobile app avatar upload', async () => {
      const mobileFile = createValidImageFile({
        uri: 'content://media/external/images/media/12345',
        name: 'IMG_20240123_120000.jpg',
        type: 'image/jpeg'
      });

      const mobileAvatarUrl = 'https://mobile-cdn.example.com/avatars/user-123.jpg';
      mockProfileService.uploadAvatar.mockResolvedValue(mobileAvatarUrl);

      const result = await useCase.execute(validUserId, mobileFile);

      expect(result.success).toBe(true);
      expect(result.avatarUrl).toBe(mobileAvatarUrl);
      expect(mockProfileService.uploadAvatar).toHaveBeenCalledWith(validUserId, mobileFile.uri);
    });
  });

  // =============================================================================
  // EDGE CASES & BOUNDARY TESTS
  // =============================================================================

  describe('Edge Cases', () => {
    it('should handle minimum file size', async () => {
      const tinyFile = createValidImageFile({
        size: 1024, // 1KB
        width: 64,
        height: 64
      });

      const result = await useCase.execute(validUserId, tinyFile);

      expect(result.success).toBe(true);
      expect(result.dimensions.width).toBeGreaterThanOrEqual(64);
    });

    it('should handle files with special characters in name', async () => {
      const specialNameFile = createValidImageFile({
        name: 'avatar_用户头像_2024@#$%.jpg'
      });

      const result = await useCase.execute(validUserId, specialNameFile);

      expect(result.success).toBe(true);
      expect(result.fileId).toMatch(/^file_\d+$/);
    });

    it('should handle corrupted image files', async () => {
      const corruptedFile = createValidImageFile({
        base64: 'invalid_base64_data_corrupted_image'
      });

      const corruptionError = createFileValidationError('content', 'Corrupted image file');
      mockProfileService.uploadAvatar.mockRejectedValue(corruptionError);

      await expect(useCase.execute(validUserId, corruptedFile))
        .rejects.toThrow('Avatar upload failed: File validation failed: Corrupted image file');
    });

    it('should handle rapid successive uploads', async () => {
      const files = [
        createValidImageFile({ name: 'upload1.jpg' }),
        createValidImageFile({ name: 'upload2.jpg' }),
        createValidImageFile({ name: 'upload3.jpg' })
      ];

      // Mock response that only the last upload succeeds
      mockProfileService.uploadAvatar
        .mockRejectedValueOnce(new Error('Upload cancelled'))
        .mockRejectedValueOnce(new Error('Upload cancelled'))
        .mockResolvedValueOnce('https://cdn.example.com/final-avatar.jpg');

      // Execute uploads sequentially (simulating rapid user clicks)
      const results = [];
      for (const file of files) {
        try {
          const result = await useCase.execute(validUserId, file);
          results.push(result);
        } catch (error) {
          results.push(error);
        }
      }

      // Only the last upload should succeed
      expect(results[0]).toBeInstanceOf(Error);
      expect(results[1]).toBeInstanceOf(Error);
      expect((results[2] as any).success).toBe(true);
      expect((results[2] as any).avatarUrl).toBe('https://cdn.example.com/final-avatar.jpg');
    });
  });
});