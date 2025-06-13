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
    console.log('AvatarService: Initialized with Repository Pattern');
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
      console.log('AvatarService: Starting avatar upload via Repository');

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
        console.log('AvatarService: Avatar upload completed successfully');
        console.log('AvatarService: Avatar URL:', result.avatarUrl);
      } else {
        console.error('AvatarService: Upload failed:', result.error);
      }

      return result;

    } catch (error) {
      console.error('AvatarService: Upload exception:', error);
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
      console.log('AvatarService: Starting avatar deletion via Repository');

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
        console.log('AvatarService: Avatar deletion completed successfully');
      } else {
        console.error('AvatarService: Deletion failed:', result.error);
      }

      return result;

    } catch (error) {
      console.error('AvatarService: Delete exception:', error);
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
      console.log('AvatarService: Getting avatar URL via Repository for user:', userId);

      // Service Layer Business Logic: Validate user ID
      if (!userId) {
        console.warn('AvatarService: No user ID provided, returning default avatar');
        return this.getDefaultAvatarUrl();
      }

      // Delegate to Repository for storage operations
      const avatarUrl = await this.avatarRepository.getAvatarUrl(userId);

      // Service Layer: Implement fallback logic for default avatars
      if (avatarUrl) {
        console.log('AvatarService: Found custom avatar for user:', userId);
        return avatarUrl;
      } else {
        console.log('AvatarService: No custom avatar found, returning default avatar');
        return this.getDefaultAvatarUrl();
      }

    } catch (error) {
      console.error('AvatarService: Error getting avatar URL:', error);
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
        console.warn('AvatarService: No image selected for validation');
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
        console.log('AvatarService: Avatar validation passed');
      } else {
        console.warn('AvatarService: Avatar validation failed:', validation.errors);
      }

      return validation.valid;

    } catch (error) {
      console.error('AvatarService: Validation exception:', error);
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
    console.log('AvatarService: Using default avatar URL');
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
      
      console.log('AvatarService: Generated initials avatar for:', cleanName);
      return initialsUrl;

    } catch (error) {
      console.error('AvatarService: Error generating initials avatar:', error);
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
    console.warn('AvatarService.validateAvatarFile() is deprecated. Use Repository.validateFile() instead.');
    
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
      console.log('AvatarService: Checking storage health via Repository');

      // Delegate to Repository for health check
      const isHealthy = await this.avatarRepository.isStorageHealthy();

      // Service Layer: Create service-specific health response
      const healthResult = {
        healthy: isHealthy,
        error: isHealthy ? undefined : 'Avatar storage service is currently unavailable'
      };

      if (healthResult.healthy) {
        console.log('AvatarService: Storage health check passed');
      } else {
        console.warn('AvatarService: Storage health check failed');
      }

      return healthResult;

    } catch (error) {
      console.error('AvatarService: Health check exception:', error);
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Health check failed'
      };
    }
  }
}