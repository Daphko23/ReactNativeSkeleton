/**
 * @fileoverview PROFILE DI CONTAINER - Enterprise Dependency Injection
 * @description Profile Domain Dependency Injection Container nach Enterprise Standards
 *
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

import { ProfileRepositoryImpl } from '../../data/repositories/profile.repository.impl';
import { UpdateProfileUseCase } from '../use-cases/profile/update-profile.use-case';
// import { GetProfileUseCase } from '../use-cases/get-profile.usecase'; // TODO: Check if needed
// import { DeleteProfileUseCase } from '../use-cases/delete-profile.usecase'; // TODO: Check if needed
import { StorageService } from '@core/services/storage.service';
import { LoggerFactory } from '@core/logging/logger.factory';

/**
 * Profile Dependency Injection Container Dependencies
 */
export interface ProfileContainerDependencies {
  storageService?: StorageService;
  loggerFactory?: typeof LoggerFactory;
}

/**
 * Profile Dependency Injection Container
 *
 * @description
 * Enterprise DI Container für Profile Domain Services und Use Cases.
 * Implementiert echte Dependency Injection ohne Singleton Anti-Pattern.
 *
 * SOLID Principles:
 * - Single Responsibility: Nur DI-Container Logic
 * - Open/Closed: Erweiterbar für neue Dependencies
 * - Dependency Inversion: Abhängigkeiten werden injiziert
 */
export class ProfileDIContainer {
  private readonly storageService: StorageService;
  private readonly loggerFactory: typeof LoggerFactory;

  // Repository instances (lazy loaded)
  private profileRepository?: ProfileRepositoryImpl;

  // Use Case instances (lazy loaded)
  private updateProfileUseCase?: UpdateProfileUseCase;
  // private getProfileUseCase?: GetProfileUseCase;
  // private deleteProfileUseCase?: DeleteProfileUseCase;

  /**
   * Constructor mit expliziter Dependency Injection
   *
   * @param dependencies - Optional dependencies für Testing und Flexibilität
   */
  constructor(dependencies: ProfileContainerDependencies = {}) {
    this.storageService =
      dependencies.storageService ?? StorageService.getInstance();
    this.loggerFactory = dependencies.loggerFactory ?? LoggerFactory;
  }

  /**
   * Get Profile Repository
   *
   * @returns ProfileRepositoryImpl instance mit injected dependencies
   */
  public getProfileRepository(): ProfileRepositoryImpl {
    if (!this.profileRepository) {
      const logger =
        this.loggerFactory.createServiceLogger('ProfileRepository');

      this.profileRepository = new ProfileRepositoryImpl(
        this.storageService,
        logger
      );
    }
    return this.profileRepository;
  }

  /**
   * Get Update Profile Use Case
   *
   * @returns UpdateProfileUseCase instance
   */
  public getUpdateProfileUseCase(): UpdateProfileUseCase {
    if (!this.updateProfileUseCase) {
      this.updateProfileUseCase = new UpdateProfileUseCase();
    }
    return this.updateProfileUseCase;
  }

  /**
   * Get Profile Use Case
   */
  // public getGetProfileUseCase(): GetProfileUseCase {
  //   if (!this.getProfileUseCase) {
  //     const repository = this.getProfileRepository();
  //     const logger = LoggerFactory.createServiceLogger('GetProfileUseCase');
  //
  //     this.getProfileUseCase = new GetProfileUseCase(
  //       repository,
  //       logger
  //     );
  //   }
  //   return this.getProfileUseCase;
  // }

  /**
   * Get Delete Profile Use Case
   */
  // public getDeleteProfileUseCase(): DeleteProfileUseCase {
  //   if (!this.deleteProfileUseCase) {
  //     const repository = this.getProfileRepository();
  //     const logger = LoggerFactory.createServiceLogger('DeleteProfileUseCase');
  //
  //     this.deleteProfileUseCase = new DeleteProfileUseCase(
  //       repository,
  //       logger
  //     );
  //   }
  //   return this.deleteProfileUseCase;
  // }

  /**
   * Reset all instances (für Testing)
   *
   * @description Setzt alle lazy-loaded instances zurück
   */
  public reset(): void {
    this.profileRepository = undefined;
    this.updateProfileUseCase = undefined;
    // this.getProfileUseCase = undefined;
    // this.deleteProfileUseCase = undefined;
  }
}

/**
 * Profile Container Factory
 *
 * @description Factory Function für ProfileDIContainer Erstellung
 * @param dependencies - Optional dependencies für Testing/Mocking
 * @returns Neue ProfileDIContainer instance
 */
export function createProfileContainer(
  dependencies?: ProfileContainerDependencies
): ProfileDIContainer {
  return new ProfileDIContainer(dependencies);
}

/**
 * Profile Container Hook für React Components
 *
 * @description Hook-Pattern für React Components ohne Singleton
 * @param dependencies - Optional dependencies für Testing
 * @returns ProfileDIContainer instance
 */
export function useProfileContainer(
  dependencies?: ProfileContainerDependencies
): ProfileDIContainer {
  // In echten React Apps würde hier useMemo/useContext verwendet werden
  // Für jetzt simple Factory-Pattern
  return createProfileContainer(dependencies);
}
