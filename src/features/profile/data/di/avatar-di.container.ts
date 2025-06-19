/**
 * @fileoverview AVATAR DI CONTAINER - Enterprise Dependency Injection
 * @description Avatar Domain Dependency Injection Container nach Enterprise Standards
 *
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

import { IAvatarDataSource } from '../../domain/interfaces/avatar-datasource.interface';
import { AvatarRepositoryImpl } from '../repositories/avatar-repository.impl';
import { SupabaseAvatarDataSource } from '../datasources/supabase-avatar.datasource';
import { AvatarService as _AvatarService } from '../services/avatar.service';
import { StorageService as _StorageService } from '@core/services/storage.service';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory as _LogCategory } from '@core/logging/logger.service.interface';
import { UploadAvatarUseCase } from '../../application/use-cases/avatar/upload-avatar.usecase';
import { DeleteAvatarUseCase } from '../../application/use-cases/avatar/delete-avatar.usecase';
import { ImagePickerService } from '../services/image-picker.service';

/**
 * Avatar Dependency Injection Container
 *
 * @description
 * Enterprise DI Container für Avatar Domain Services und Use Cases.
 * Implementiert Dependency Injection Pattern für lose Kopplung.
 */
class AvatarDIContainer {
  private static instance: AvatarDIContainer;

  // Repository instances
  private avatarRepository?: AvatarRepositoryImpl;

  // Service instances
  private imagePickerService?: ImagePickerService;

  // Use Case instances
  private uploadAvatarUseCase?: UploadAvatarUseCase;
  private deleteAvatarUseCase?: DeleteAvatarUseCase;

  private constructor() {}

  /**
   * Singleton Instance
   */
  public static getInstance(): AvatarDIContainer {
    if (!AvatarDIContainer.instance) {
      AvatarDIContainer.instance = new AvatarDIContainer();
    }
    return AvatarDIContainer.instance;
  }

  /**
   * Get Avatar Repository
   */
  public getAvatarRepository(): AvatarRepositoryImpl {
    if (!this.avatarRepository) {
      const logger = LoggerFactory.createServiceLogger('AvatarRepository');

      // Avatar DataSource konfigurieren
      const avatarDataSource: IAvatarDataSource =
        new SupabaseAvatarDataSource();

      this.avatarRepository = new AvatarRepositoryImpl(
        avatarDataSource,
        logger
      );
    }
    return this.avatarRepository;
  }

  /**
   * Get Image Picker Service
   */
  public getImagePickerService(): ImagePickerService {
    if (!this.imagePickerService) {
      this.imagePickerService = new ImagePickerService();
    }
    return this.imagePickerService;
  }

  /**
   * Get Upload Avatar Use Case
   */
  public getUploadAvatarUseCase(): UploadAvatarUseCase {
    if (!this.uploadAvatarUseCase) {
      const repository = this.getAvatarRepository();
      this.uploadAvatarUseCase = new UploadAvatarUseCase(repository);
    }
    return this.uploadAvatarUseCase;
  }

  /**
   * Get Delete Avatar Use Case
   */
  public getDeleteAvatarUseCase(): DeleteAvatarUseCase {
    if (!this.deleteAvatarUseCase) {
      const repository = this.getAvatarRepository();
      this.deleteAvatarUseCase = new DeleteAvatarUseCase(repository);
    }
    return this.deleteAvatarUseCase;
  }

  /**
   * Reset all instances (for testing)
   */
  public reset(): void {
    this.avatarRepository = undefined;
    this.imagePickerService = undefined;
    this.uploadAvatarUseCase = undefined;
    this.deleteAvatarUseCase = undefined;
    // Reset completed successfully
  }

  configure(): void {
    if (!this.avatarRepository) {
      try {
        const logger = LoggerFactory.createServiceLogger('AvatarRepository');

        // Avatar DataSource konfigurieren
        const avatarDataSource: IAvatarDataSource =
          new SupabaseAvatarDataSource();

        this.avatarRepository = new AvatarRepositoryImpl(
          avatarDataSource,
          logger
        );
      } catch {
        throw new Error('Failed to configure Avatar DI Container');
      }
    }
  }
}

// Export singleton instance
export const avatarDIContainer = AvatarDIContainer.getInstance();
