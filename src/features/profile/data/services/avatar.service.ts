/**
 * @fileoverview AVATAR-SERVICE: Enterprise Avatar Management Service
 * @description Avatar Service mit Repository Pattern für Clean Architecture
 * und Enterprise-Grade Avatar Management ohne direkte Storage-Abhängigkeiten.
 * 
 * @version 3.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

import { avatarDIContainer } from '@core/di/avatar-di.container';
import { IAvatarRepository } from '@features/profile/domain/interfaces/avatar-repository.interface';
import { ImagePickerResult, IAvatarService, AvatarUploadOptions, AvatarUploadResult } from '../../domain/interfaces/avatar.interface';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('AvatarService');

/**
 * Avatar Service - React Native 2025 Enterprise Standards
 * Handles avatar upload, deletion, and management operations
 * 
 * ✅ CLEAN ARCHITECTURE COMPLIANCE:
 * - Domain-driven error handling
 * - Type-safe file operations
 * - Comprehensive logging
 * - GDPR compliance ready
 * 
 * @class AvatarService
 * @implements {IAvatarService}
 * @since 3.0.0
 * 
 * @description
 * Clean Architecture Avatar Service der Repository Pattern verwendet
 * für saubere Trennung von Business Logic und Storage-Implementierungen.
 * Alle Storage-Operationen werden über Repository Interface delegiert.
 * 
 * @architectural_compliance
 * - **Clean Architecture**: Service Layer ohne direkte Infrastructure Dependencies
 * - **Repository Pattern**: Alle Storage-Operationen über Repository Interface
 * - **Dependency Injection**: Repository wird über DI Container injiziert
 * - **SOLID Principles**: Single Responsibility, Dependency Inversion
 * 
 * @enterprise_benefits
 * - **Testability**: Einfache Unit Tests mit Mock Repository
 * - **Maintainability**: Business Logic getrennt von Storage Details
 * - **Scalability**: Storage Provider Austausch ohne Service Änderungen
 * - **Flexibility**: Verschiedene Repository Implementierungen möglich
 * 
 * @example
 * Production Usage:
 * ```typescript
 * const avatarService = new AvatarService();
 * const result = await avatarService.uploadAvatar({
 *   userId: 'user-123',
 *   file: selectedFile,
 *   onProgress: updateProgress
 * });
 * ```
 * 
 * @example
 * Testing with Mock Repository:
 * ```typescript
 * // Setup Mock Repository für Tests
 * avatarDIContainer.setAvatarRepository(new MockAvatarRepository());
 * const service = new AvatarService();
 * // Service verwendet jetzt Mock Repository
 * ```
 */
export class AvatarService implements IAvatarService {
  private readonly avatarRepository: IAvatarRepository;

  /**
   * Avatar Service Constructor
   * 
   * @description
   * Initialisiert Avatar Service mit Repository über Dependency Injection.
   * Repository wird automatisch über DI Container bereitgestellt.
   * 
   * @example
   * ```typescript
   * const service = new AvatarService();
   * // Repository wird automatisch injiziert
   * ```
   */
  constructor() {
    // Repository über Dependency Injection Container
    this.avatarRepository = avatarDIContainer.getAvatarRepository();
    logger.info('Avatar Service initialized with Repository Pattern', LogCategory.BUSINESS, {
      repositoryType: 'DI Container Injected'
    });
  }

  /**
   * Upload avatar using Repository Pattern
   * 
   * @param options - Avatar upload configuration
   * @returns Promise with upload result
   * 
   * @description
   * Service Layer Implementation für Avatar Upload.
   * Delegiert Storage-Operationen an Repository und implementiert
   * Service-spezifische Business Logic.
   * 
   * @example
   * ```typescript
   * const result = await service.uploadAvatar({
   *   userId: 'user-123',
   *   file: {
   *     uri: 'file://avatar.jpg',
   *     fileName: 'avatar.jpg',
   *     size: 1024000,
   *     mime: 'image/jpeg'
   *   },
   *   onProgress: (progress) => updateUI(progress)
   * });
   * 
   * if (result.success) {
   *   console.log('Upload successful:', result.avatarUrl);
   * }
   * ```
   */
  async uploadAvatar(options: AvatarUploadOptions): Promise<AvatarUploadResult> {
    try {
      const correlationId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Starting avatar upload via Repository', LogCategory.BUSINESS, {
        correlationId,
        userId: options.userId,
        fileSize: options.file?.size,
        fileName: options.file?.fileName
      });

      // Service Layer Business Logic: Validate options
      if (!options.userId) {
        return {
          success: false,
          error: 'User ID is required for avatar upload'
        };
      }

      if (!options.file) {
        return {
          success: false,
          error: 'File information is required for upload'
        };
      }

      // Service Layer: Map AvatarUploadOptions to Repository format
      const repositoryFile = {
        uri: options.file.uri,
        fileName: options.file.fileName,
        size: options.file.size,
        mime: options.file.mime
      };

      // Delegate to Repository for storage operations
      const result = await this.avatarRepository.uploadAvatar(
        options.userId,
        repositoryFile,
        options.onProgress
      );

      // Service Layer: Add service-specific logging and context
      if (result.success) {
        logger.info('Avatar upload completed successfully', LogCategory.BUSINESS, {
          correlationId,
          userId: options.userId,
          avatarUrl: result.avatarUrl,
          fileSize: options.file?.size
        });
      } else {
        logger.error('Avatar upload failed', LogCategory.BUSINESS, {
          correlationId,
          userId: options.userId,
          error: result.error
        });
      }

      return result;

    } catch (error) {
      logger.error('Avatar upload exception occurred', LogCategory.BUSINESS, {
        correlationId,
        userId: options.userId
      }, error as Error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Avatar upload failed'
      };
    }
  }

  /**
   * Delete avatar using Repository Pattern
   * 
   * @param userId - User identifier (optional for backward compatibility)
   * @returns Promise with deletion result
   * 
   * @description
   * Service Layer Implementation für Avatar Deletion.
   * Delegiert Storage-Operationen an Repository.
   * 
   * @example
   * ```typescript
   * const result = await service.deleteAvatar('user-123');
   * if (result.success) {
   *   console.log('Avatar deleted successfully');
   * }
   * ```
   */
  async deleteAvatar(userId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const correlationId = `delete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Starting avatar deletion via Repository', LogCategory.BUSINESS, {
        correlationId,
        userId
      });

      // Service Layer Business Logic: Validate user ID
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required for avatar deletion'
        };
      }

      // Delegate to Repository for storage operations
      const result = await this.avatarRepository.deleteAvatar(userId);

      // Service Layer: Add service-specific logging
      if (result.success) {
        logger.info('Avatar deletion completed successfully', LogCategory.BUSINESS, {
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
   * Get avatar URL using Repository Pattern
   * 
   * @param userId - User identifier
   * @returns Promise with avatar URL or default avatar URL
   * 
   * @description
   * Service Layer Implementation für Avatar URL Retrieval.
   * Fügt Service-spezifische Fallback-Logik für Default Avatars hinzu.
   * 
   * @example
   * ```typescript
   * const avatarUrl = await service.getAvatarUrl('user-123');
   * setUserAvatarInUI(avatarUrl);
   * ```
   */
  async getAvatarUrl(userId: string): Promise<string | null> {
    try {
      const correlationId = `getUrl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Getting avatar URL via Repository', LogCategory.BUSINESS, {
        correlationId,
        userId
      });

      // Service Layer Business Logic: Validate user ID
      if (!userId) {
        logger.warn('No user ID provided for avatar URL, returning default', LogCategory.BUSINESS, {
          correlationId
        });
        return this.getDefaultAvatarUrl();
      }

      // Delegate to Repository for storage operations
      const avatarUrl = await this.avatarRepository.getAvatarUrl(userId);

      // Service Layer: Implement fallback logic for default avatars
      if (avatarUrl) {
        logger.info('Found custom avatar for user', LogCategory.BUSINESS, {
          correlationId,
          userId,
          hasCustomAvatar: true
        });
        return avatarUrl;
      } else {
        logger.info('No custom avatar found, returning default', LogCategory.BUSINESS, {
          correlationId,
          userId,
          hasCustomAvatar: false
        });
        return this.getDefaultAvatarUrl();
      }

    } catch (error) {
      logger.error('Error getting avatar URL', LogCategory.BUSINESS, {
        correlationId,
        userId
      }, error as Error);
      return this.getDefaultAvatarUrl();
    }
  }

  /**
   * Validate avatar using Repository Pattern
   * 
   * @param imageResult - Image picker result
   * @returns Boolean validation result
   * 
   * @description
   * Service Layer Implementation für Avatar Validation.
   * Vereinfacht Repository Validation für Service Consumer.
   * 
   * @example
   * ```typescript
   * const isValid = service.validateAvatar(imagePickerResult);
   * if (!isValid) {
   *   showErrorMessage('Invalid avatar file');
   * }
   * ```
   */
  validateAvatar(imageResult: ImagePickerResult): boolean {
    try {
      if (!imageResult) {
        logger.warn('No image selected for avatar validation', LogCategory.BUSINESS);
        return false;
      }

      // Map ImagePickerResult to Repository validation format
      const repositoryFile = {
        uri: imageResult.path,
        fileName: imageResult.fileName || 'avatar.jpg',
        size: imageResult.size || 0,
        mime: imageResult.mime || 'image/jpeg'
      };

      // Delegate to Repository for validation
      const validation = this.avatarRepository.validateFile(repositoryFile);

      // Service Layer: Log validation results
      if (validation.valid) {
        logger.info('Avatar validation passed', LogCategory.BUSINESS, {
          fileName: repositoryFile.fileName,
          fileSize: repositoryFile.size,
          mimeType: repositoryFile.mime
        });
      } else {
        logger.warn('Avatar validation failed', LogCategory.BUSINESS, {
          fileName: repositoryFile.fileName,
          fileSize: repositoryFile.size,
          mimeType: repositoryFile.mime,
          errors: validation.errors
        });
      }

      return validation.valid;

    } catch (error) {
      logger.error('Avatar validation exception occurred', LogCategory.BUSINESS, {}, error as Error);
      return false;
    }
  }

  /**
   * Get default avatar URL
   * 
   * @returns Default avatar URL
   * 
   * @description
   * Service Layer Implementation für Default Avatar Logic.
   * Diese Methode bleibt Service-spezifisch da sie UI/UX Logic enthält.
   * 
   * @example
   * ```typescript
   * const defaultUrl = service.getDefaultAvatarUrl();
   * setFallbackAvatar(defaultUrl);
   * ```
   */
  getDefaultAvatarUrl(): string {
    // Service Layer: Default Avatar Logic (UI/UX specific)
    const defaultAvatarUrl = 'https://ui-avatars.com/api/?name=User&background=6366f1&color=ffffff&size=200';
    logger.info('Using default avatar URL', LogCategory.BUSINESS, {
      defaultUrl: defaultAvatarUrl
    });
    return defaultAvatarUrl;
  }

  /**
   * Generate initials avatar
   * 
   * @param name - User name for initials
   * @param size - Avatar size (default: 200)
   * @returns Generated initials avatar URL
   * 
   * @description
   * Service Layer Implementation für Initials Avatar Generation.
   * Diese Methode bleibt Service-spezifisch da sie UI/UX Logic enthält.
   * 
   * @example
   * ```typescript
   * const initialsUrl = service.generateInitialsAvatar('John Doe', 150);
   * setUserInitialsAvatar(initialsUrl);
   * ```
   */
  generateInitialsAvatar(name: string, size: number = 200): string {
    try {
      // Service Layer: Initials Avatar Generation Logic (UI/UX specific)
      const cleanName = name.trim();
      if (!cleanName) {
        return this.getDefaultAvatarUrl();
      }

      const encodedName = encodeURIComponent(cleanName);
      const initialsUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=6366f1&color=ffffff&size=${size}&font-size=0.33`;
      
      logger.info('Generated initials avatar', LogCategory.BUSINESS, {
        userName: cleanName,
        avatarSize: size,
        initialsUrl
      });
      return initialsUrl;

    } catch (error) {
      logger.error('Error generating initials avatar', LogCategory.BUSINESS, {
        userName: name,
        avatarSize: size
      }, error as Error);
      return this.getDefaultAvatarUrl();
    }
  }

  /**
   * Validate avatar file (Deprecated - use Repository validation)
   * 
   * @deprecated Use avatarRepository.validateFile() instead
   * @param file - File information
   * @returns Validation result
   * 
   * @description
   * Legacy method for backward compatibility.
   * Neue Implementierungen sollten Repository.validateFile() verwenden.
   * 
   * @example
   * ```typescript
   * // Deprecated
   * const validation = service.validateAvatarFile(file);
   * 
   * // Preferred
   * const repository = avatarDIContainer.getAvatarRepository();
   * const validation = repository.validateFile(file);
   * ```
   */
  validateAvatarFile(file: { name: string; size: number; type: string; uri: string }): { valid: boolean; errors: string[] } {
    logger.warn('validateAvatarFile() method is deprecated', LogCategory.BUSINESS, {
      deprecatedMethod: 'validateAvatarFile',
      recommendedMethod: 'Repository.validateFile'
    });
    
    // Delegate to Repository for validation
    const repositoryFile = {
      uri: file.uri,
      fileName: file.name,
      size: file.size,
      mime: file.type
    };

    return this.avatarRepository.validateFile(repositoryFile);
  }

  /**
   * Check storage health using Repository Pattern
   * 
   * @returns Promise with health status
   * 
   * @description
   * Service Layer Implementation für Storage Health Check.
   * Vereinfacht Repository Health Check für Service Consumer.
   * 
   * @example
   * ```typescript
   * const health = await service.checkStorageHealth();
   * if (!health.healthy) {
   *   showOfflineMessage();
   * }
   * ```
   */
  async checkStorageHealth(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const correlationId = `health_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Checking storage health via Repository', LogCategory.BUSINESS, {
        correlationId
      });

      // Delegate to Repository for health check
      const isHealthy = await this.avatarRepository.isStorageHealthy();

      // Service Layer: Create service-specific health response
      const healthResult = {
        healthy: isHealthy,
        error: isHealthy ? undefined : 'Avatar storage service is currently unavailable'
      };

      if (healthResult.healthy) {
        logger.info('Storage health check passed', LogCategory.BUSINESS, {
          correlationId,
          healthy: true
        });
      } else {
        logger.warn('Storage health check failed', LogCategory.BUSINESS, {
          correlationId,
          healthy: false
        });
      }

      return healthResult;

    } catch (error) {
      logger.error('Storage health check exception occurred', LogCategory.BUSINESS, {
        correlationId
      }, error as Error);
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Health check failed'
      };
    }
  }
}