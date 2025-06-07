/**
 * ProfileContainer - Application Layer DI Container
 * Handles dependency injection for the profile feature following Clean Architecture
 */

import { ProfileDataSource } from '../../data/datasources/profile.datasource';
import { ProfileRepositoryImpl } from '../../data/repositories/profile.repository.impl';
import { IProfileService, ProfileServiceOptions } from '../../domain/interfaces/profile-service.interface';
import { ProfileServiceImpl } from '../../data/services/profile.service.impl';

// Use Cases
import { GetUserProfileUseCase } from '../usecases/get-user-profile.usecase';
import { UpdateUserProfileUseCase } from '../usecases/update-user-profile.usecase';
import { DeleteUserProfileUseCase } from '../usecases/delete-user-profile.usecase';
import { UploadAvatarUseCase } from '../usecases/upload-avatar.usecase';
import { DeleteAvatarUseCase } from '../usecases/delete-avatar.usecase';
import { GetAvatarUrlUseCase } from '../usecases/get-avatar-url.usecase';
import { UpdatePrivacySettingsUseCase } from '../usecases/update-privacy-settings.usecase';
import { CalculateProfileCompletionUseCase } from '../usecases/calculate-profile-completion.usecase';

import type { IProfileRepository } from '../../data/repositories/profile.repository.impl';

class ProfileContainer {
  // Data Layer
  private _profileDataSource: ProfileDataSource | null = null;
  private _profileRepository: IProfileRepository | null = null;
  private _profileService: IProfileService | null = null;
  
  // Application Layer - Use Cases
  private _getUserProfileUseCase: GetUserProfileUseCase | null = null;
  private _updateUserProfileUseCase: UpdateUserProfileUseCase | null = null;
  private _deleteUserProfileUseCase: DeleteUserProfileUseCase | null = null;
  private _uploadAvatarUseCase: UploadAvatarUseCase | null = null;
  private _deleteAvatarUseCase: DeleteAvatarUseCase | null = null;
  private _getAvatarUrlUseCase: GetAvatarUrlUseCase | null = null;
  private _updatePrivacySettingsUseCase: UpdatePrivacySettingsUseCase | null = null;
  private _calculateProfileCompletionUseCase: CalculateProfileCompletionUseCase | null = null;

  // Configuration
  private _options: ProfileServiceOptions = {};
  private _isInitialized = false;

  // === DATA LAYER DEPENDENCIES ===

  get profileDataSource(): ProfileDataSource {
    if (!this._profileDataSource) {
      this._profileDataSource = new ProfileDataSource();
    }
    return this._profileDataSource;
  }

  get profileRepository(): IProfileRepository {
    if (!this._profileRepository) {
      this._profileRepository = new ProfileRepositoryImpl(this.profileDataSource);
    }
    return this._profileRepository;
  }

  get profileService(): IProfileService {
    if (!this._profileService) {
      this._profileService = new ProfileServiceImpl(this.profileRepository, this._options);
    }
    return this._profileService;
  }

  // === APPLICATION LAYER DEPENDENCIES - USE CASES ===

  get getUserProfileUseCase(): GetUserProfileUseCase {
    if (!this._getUserProfileUseCase) {
      this._getUserProfileUseCase = new GetUserProfileUseCase(this.profileService);
    }
    return this._getUserProfileUseCase;
  }

  get updateUserProfileUseCase(): UpdateUserProfileUseCase {
    if (!this._updateUserProfileUseCase) {
      this._updateUserProfileUseCase = new UpdateUserProfileUseCase(this.profileService);
    }
    return this._updateUserProfileUseCase;
  }

  get deleteUserProfileUseCase(): DeleteUserProfileUseCase {
    if (!this._deleteUserProfileUseCase) {
      this._deleteUserProfileUseCase = new DeleteUserProfileUseCase(this.profileService);
    }
    return this._deleteUserProfileUseCase;
  }

  get uploadAvatarUseCase(): UploadAvatarUseCase {
    if (!this._uploadAvatarUseCase) {
      this._uploadAvatarUseCase = new UploadAvatarUseCase(this.profileService);
    }
    return this._uploadAvatarUseCase;
  }

  get deleteAvatarUseCase(): DeleteAvatarUseCase {
    if (!this._deleteAvatarUseCase) {
      this._deleteAvatarUseCase = new DeleteAvatarUseCase(this.profileService);
    }
    return this._deleteAvatarUseCase;
  }

  get getAvatarUrlUseCase(): GetAvatarUrlUseCase {
    if (!this._getAvatarUrlUseCase) {
      this._getAvatarUrlUseCase = new GetAvatarUrlUseCase();
    }
    return this._getAvatarUrlUseCase;
  }

  get updatePrivacySettingsUseCase(): UpdatePrivacySettingsUseCase {
    if (!this._updatePrivacySettingsUseCase) {
      this._updatePrivacySettingsUseCase = new UpdatePrivacySettingsUseCase(this.profileService);
    }
    return this._updatePrivacySettingsUseCase;
  }

  get calculateProfileCompletionUseCase(): CalculateProfileCompletionUseCase {
    if (!this._calculateProfileCompletionUseCase) {
      this._calculateProfileCompletionUseCase = new CalculateProfileCompletionUseCase();
    }
    return this._calculateProfileCompletionUseCase;
  }

  // === CONFIGURATION & LIFECYCLE ===

  async initialize(options: ProfileServiceOptions = {}): Promise<void> {
    if (this._isInitialized) {
      return;
    }

    this._options = {
      enableRealTimeSync: true,
      enableVersioning: true,
      enableAnalytics: false,
      maxVersions: 50,
      compressionLevel: 5,
      ...options,
    };

    // Initialize service if needed
    const service = this.profileService;
    if ('initialize' in service) {
      await (service as any).initialize();
    }
    
    this._isInitialized = true;
    console.log('ProfileContainer initialized with options:', this._options);
  }

  isReady(): boolean {
    return this._isInitialized;
  }

  getOptions(): ProfileServiceOptions {
    return { ...this._options };
  }

  // === TESTING UTILITIES ===

  /**
   * For testing - allow injection of mock services
   */
  setProfileService(service: IProfileService): void {
    this._profileService = service;
    // Reset use cases to use new service
    this._getUserProfileUseCase = null;
    this._updateUserProfileUseCase = null;
    this._deleteUserProfileUseCase = null;
    this._uploadAvatarUseCase = null;
    this._deleteAvatarUseCase = null;
    this._getAvatarUrlUseCase = null;
    this._updatePrivacySettingsUseCase = null;
    this._calculateProfileCompletionUseCase = null;
  }

  /**
   * For testing - allow injection of mock repository
   */
  setProfileRepository(repository: IProfileRepository): void {
    this._profileRepository = repository;
  }

  /**
   * For testing - allow injection of mock data source
   */
  setProfileDataSource(dataSource: ProfileDataSource): void {
    this._profileDataSource = dataSource;
    // Reset repository to use new data source
    this._profileRepository = null;
  }

  /**
   * Reset all dependencies (for testing)
   */
  reset(): void {
    this._profileDataSource = null;
    this._profileRepository = null;
    this._profileService = null;
    this._getUserProfileUseCase = null;
    this._updateUserProfileUseCase = null;
    this._deleteUserProfileUseCase = null;
    this._uploadAvatarUseCase = null;
    this._deleteAvatarUseCase = null;
    this._getAvatarUrlUseCase = null;
    this._updatePrivacySettingsUseCase = null;
    this._calculateProfileCompletionUseCase = null;
    this._isInitialized = false;
    this._options = {};
  }
}

export const profileContainer = new ProfileContainer(); 