/**
 * @fileoverview AVATAR-REPOSITORY-IMPL: Data Layer Repository Implementation
 * @description Avatar Repository Implementation mit DataSource Integration
 * für Clean Architecture Compliance und Enterprise-Grade Funktionalität.
 * 
 * @version 1.0.0
 * @since 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

import {
  IAvatarRepository,
  AvatarUploadResult,
  AvatarDeleteResult,
  AvatarFile
} from '@features/profile/domain/interfaces/avatar-repository.interface';

import {
  IAvatarDataSource,
  AvatarUploadOptions
} from '@features/profile/domain/interfaces/avatar-datasource.interface';

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('AvatarRepository');

/**
 * Avatar Repository Implementation
 * 
 * Konkrete Implementierung des Avatar Repository Interface.
 * Orchestriert DataSource Operations und implementiert Business Logic.
 * 
 * @class AvatarRepositoryImpl
 * @implements {IAvatarRepository}
 * @since 2.0.0
 * 
 * @description
 * Enterprise-Grade Avatar Repository Implementation nach Clean Architecture.
 * Verbindet Domain Layer Contracts mit Data Layer DataSources und
 * implementiert Repository Pattern für saubere Separation of Concerns.
 * 
 * @architectural_features
 * - **Repository Pattern**: Orchestriert DataSource Operations
 * - **Dependency Injection**: DataSource wird injiziert, nicht hart gekoppelt
 * - **Clean Architecture**: Implementiert Domain Layer Contracts
 * - **Error Handling**: Robuste Fehlerbehandlung mit Business Logic Context
 * - **Validation**: Business-orientierte Validation Layer
 * 
 * @enterprise_benefits
 * - **Testability**: Einfache Unit Tests durch DataSource Mocking
 * - **Maintainability**: Klare Trennung von Business Logic und Storage Details
 * - **Scalability**: Unterstützt verschiedene DataSource Implementierungen
 * - **Flexibility**: DataSource Austausch ohne Business Logic Änderungen
 * 
 * @example
 * Dependency Injection Usage:
 * ```typescript
 * const dataSource = new SupabaseAvatarDataSource();
 * const repository = new AvatarRepositoryImpl(dataSource);
 * const service = new AvatarService(repository);
 * ```
 * 
 * @example
 * Testing with Mock DataSource:
 * ```typescript
 * const mockDataSource = new MockAvatarDataSource();
 * const repository = new AvatarRepositoryImpl(mockDataSource);
 * // Unit tests ohne echte Storage-Abhängigkeiten
 * ```
 * 
 * @example
 * Alternative DataSource (AWS S3):
 * ```typescript
 * const s3DataSource = new AWSS3AvatarDataSource();
 * const repository = new AvatarRepositoryImpl(s3DataSource);
 * // Gleiche Business Logic, anderer Storage Provider
 * ```
 */
export class AvatarRepositoryImpl implements IAvatarRepository {
  /**
   * Avatar Repository Constructor
   * 
   * @param dataSource - Injected DataSource implementation
   * 
   * @example
   * ```typescript
   * const repository = new AvatarRepositoryImpl(
   *   new SupabaseAvatarDataSource()
   * );
   * ```
   */
  constructor(private readonly dataSource: IAvatarDataSource) {}

  /**
   * Upload avatar for user
   * 
   * @param userId - User identifier
   * @param file - Avatar file information
   * @param onProgress - Optional progress callback (0-100)
   * @returns Promise with upload result
   * 
   * @description
   * Repository implementation für Avatar Upload.
   * Koordiniert DataSource Operations und fügt Business Logic hinzu.
   * 
   * @example
   * ```typescript
   * const result = await repository.uploadAvatar(
   *   'user-123',
   *   {
   *     uri: 'file://avatar.jpg',
   *     fileName: 'avatar.jpg',
   *     size: 1024000,
   *     mime: 'image/jpeg'
   *   },
   *   (progress) => updateUploadProgress(progress)
   * );
   * 
   * if (result.success) {
   *   await updateUserProfile({ avatarUrl: result.avatarUrl });
   * }
   * ```
   */
  async uploadAvatar(
    userId: string,
    file: AvatarFile,
    onProgress?: (progress: number) => void
  ): Promise<AvatarUploadResult> {
    try {
      // Business Logic: Validate user ID
      if (!userId || userId.trim().length === 0) {
        return {
          success: false,
          error: 'User ID is required for avatar upload'
        };
      }

      // Business Logic: Validate file information
      if (!file || !file.uri) {
        return {
          success: false,
          error: 'File information is required for upload'
        };
      }

      // Repository orchestrates DataSource operations
      const uploadOptions: AvatarUploadOptions = {
        userId: userId.trim(),
        file: {
          uri: file.uri,
          fileName: file.fileName,
          size: file.size,
          mime: file.mime
        },
        onProgress
      };

      // Delegate to DataSource for storage operations
      const result = await this.dataSource.uploadAvatar(uploadOptions);

      // Business Logic: Add repository-level context to results
      if (result.success) {
        const correlationId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        logger.info('Avatar upload successful', LogCategory.BUSINESS, {
          correlationId,
          userId,
          avatarUrl: result.data?.publicUrl || 'unknown',
          fileSize: file.size,
          fileName: file.fileName
        });
      } else {
        logger.error('Avatar upload failed', LogCategory.BUSINESS, {
          correlationId,
          userId,
          error: result.error
        });
      }

      return result;

    } catch (error) {
      logger.error('Avatar upload exception occurred', LogCategory.BUSINESS, {
        correlationId,
        userId
      }, error as Error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Avatar upload failed'
      };
    }
  }

  /**
   * Delete avatar for user
   * 
   * @param userId - User identifier
   * @returns Promise with deletion result
   * 
   * @description
   * Repository implementation für Avatar Deletion.
   * Fügt Business Logic für Benutzer-Validierung hinzu.
   * 
   * @example
   * ```typescript
   * const result = await repository.deleteAvatar('user-123');
   * if (result.success) {
   *   await updateUserProfile({ avatarUrl: null });
   *   console.log('User avatar removed successfully');
   * }
   * ```
   */
  async deleteAvatar(userId: string): Promise<AvatarDeleteResult> {
    try {
      // Business Logic: Validate user ID
      if (!userId || userId.trim().length === 0) {
        return {
          success: false,
          error: 'User ID is required for avatar deletion'
        };
      }

      // Delegate to DataSource for storage operations
      const result = await this.dataSource.deleteAvatar(userId.trim());

      // Business Logic: Add repository-level context to results
      if (result.success) {
        const correlationId = `delete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        logger.info('Avatar deletion successful', LogCategory.BUSINESS, {
          correlationId,
          userId
        });
      } else {
        logger.error('Avatar deletion failed', LogCategory.BUSINESS, {
          correlationId,
          userId,
          error: result.error
        });
      }

      return result;

    } catch (error) {
      logger.error('Avatar deletion exception occurred', LogCategory.BUSINESS, {
        correlationId,
        userId
      }, error as Error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Avatar deletion failed'
      };
    }
  }

  /**
   * Get avatar URL for user
   * 
   * @param userId - User identifier
   * @returns Promise with avatar URL or null if not found
   * 
   * @description
   * Repository implementation für Avatar URL Retrieval.
   * Fügt Business Logic für Benutzer-Validierung hinzu.
   * 
   * @example
   * ```typescript
   * const avatarUrl = await repository.getAvatarUrl('user-123');
   * if (avatarUrl) {
   *   setUserAvatar(avatarUrl);
   * } else {
   *   setUserAvatar(defaultAvatarUrl);
   * }
   * ```
   */
  async getAvatarUrl(userId: string): Promise<string | null> {
    try {
      // Business Logic: Validate user ID
      if (!userId || userId.trim().length === 0) {
        logger.warn('Invalid user ID provided for avatar URL retrieval', LogCategory.BUSINESS, {
          providedUserId: userId
        });
        return null;
      }

      // Delegate to DataSource for storage operations
      const avatarUrl = await this.dataSource.getAvatarUrl(userId.trim());

      // Business Logic: Add repository-level logging
      if (avatarUrl) {
        const correlationId = `getUrl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        logger.info('Avatar found for user', LogCategory.BUSINESS, {
          correlationId,
          userId,
          avatarUrl
        });
      } else {
        logger.info('No avatar found for user', LogCategory.BUSINESS, {
          correlationId,
          userId
        });
      }

      return avatarUrl;

    } catch (error) {
      logger.error('Error getting avatar URL', LogCategory.BUSINESS, {
        correlationId,
        userId
      }, error as Error);
      return null;
    }
  }

  /**
   * Check if avatar storage is healthy
   * 
   * @returns Promise with health status
   * 
   * @description
   * Repository implementation für Storage Health Check.
   * Vereinfacht DataSource Health Result für Business Logic.
   * 
   * @example
   * ```typescript
   * const isHealthy = await repository.isStorageHealthy();
   * if (!isHealthy) {
   *   showOfflineMode();
   * } else {
   *   enableAvatarFeatures();
   * }
   * ```
   */
  async isStorageHealthy(): Promise<boolean> {
    try {
      // Delegate to DataSource for health check
      const healthResult = await this.dataSource.checkStorageHealth();

      // Business Logic: Simplify result for repository consumers
      const isHealthy = healthResult.healthy;

      if (isHealthy) {
        const correlationId = `health_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        logger.info('Avatar storage health check passed', LogCategory.BUSINESS, {
          correlationId,
          healthy: true
        });
      } else {
        logger.warn('Avatar storage health check failed', LogCategory.BUSINESS, {
          correlationId,
          healthy: false,
          error: healthResult.error
        });
      }

      return isHealthy;

    } catch (error) {
      logger.error('Avatar storage health check exception', LogCategory.BUSINESS, {
        correlationId
      }, error as Error);
      return false;
    }
  }

  /**
   * Validate avatar file before upload
   * 
   * @param file - File to validate
   * @returns Validation result with errors if any
   * 
   * @description
   * Repository implementation für File Validation.
   * Fügt Business Logic Validierung zu DataSource Validation hinzu.
   * 
   * @example
   * ```typescript
   * const validation = repository.validateFile(selectedFile);
   * if (!validation.valid) {
   *   showErrorDialog('File validation failed', validation.errors);
   *   return;
   * }
   * ```
   */
  validateFile(file: AvatarFile): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // Business Logic: Repository-level validation
      if (!file) {
        errors.push('File information is required');
        return { valid: false, errors };
      }

      if (!file.uri || file.uri.trim().length === 0) {
        errors.push('File URI is required');
      }

      if (!file.size || file.size <= 0) {
        errors.push('File size must be greater than 0');
      }

      if (!file.mime || file.mime.trim().length === 0) {
        errors.push('File MIME type is required');
      }

      // If basic validation fails, return early
      if (errors.length > 0) {
        return { valid: false, errors };
      }

      // Delegate to DataSource for storage-specific validation
      const dataSourceValidation = this.dataSource.validateAvatarFile({
        name: file.fileName || 'avatar.jpg',
        size: file.size,
        type: file.mime,
        uri: file.uri
      });

      // Combine repository and DataSource validation results
      errors.push(...dataSourceValidation.errors);

      const isValid = errors.length === 0;

      if (isValid) {
        logger.info('Avatar file validation passed', LogCategory.BUSINESS, {
          fileName: file.fileName,
          fileSize: file.size,
          mimeType: file.mime
        });
      } else {
        logger.warn('Avatar file validation failed', LogCategory.BUSINESS, {
          fileName: file.fileName,
          fileSize: file.size,
          mimeType: file.mime,
          errors
        });
      }

      return {
        valid: isValid,
        errors
      };

    } catch (error) {
      logger.error('Avatar file validation exception', LogCategory.BUSINESS, {
        fileName: file?.fileName,
        fileSize: file?.size
      }, error as Error);
      return {
        valid: false,
        errors: ['File validation failed due to internal error']
      };
    }
  }
}