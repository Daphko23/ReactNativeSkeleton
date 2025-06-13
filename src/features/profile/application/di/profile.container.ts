/**
 * 🎯 PROFILE DI CONTAINER - React Native 2025 Enterprise Standards
 * 
 * ✅ OPTIMIZED: ProfileService eliminated - redundant pass-through layer removed
 * ✅ VEREINFACHT: Einfaches Service Registry Pattern
 * - Keine externen DI Dependencies
 * - Clean Architecture Compliance
 * - Testing Support
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// 🎯 USE CASES
import { ValidateProfileDataUseCase } from '../usecases/validate-profile-data.usecase';
import { UpdatePrivacySettingsUseCase } from '../usecases/update-privacy-settings.usecase';
import { ProfileValidator } from '../validation/profile.schemas';

// 🏪 REPOSITORIES & SERVICES
import { ProfileRepositoryImpl } from '../../data/repositories/profile.repository.impl';
import { AvatarService } from '../../data/services/avatar.service';

// 📊 CONFIGURATION
export interface ProfileContainerConfig {
  enableMockData?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Profile DI Container - Service Registry Pattern
 * OPTIMIZED: Direct Repository usage, no redundant Service layer
 */
export class ProfileContainer {
  private logger = LoggerFactory.createServiceLogger('ProfileContainer');
  private _isReady = false;
  private config: ProfileContainerConfig;
  
  // 🏪 SERVICE INSTANCES
  private _avatarService!: AvatarService;
  
  // 🎯 USE CASES
  private _validateProfileDataUseCase!: ValidateProfileDataUseCase;
  private _updatePrivacySettingsUseCase!: UpdatePrivacySettingsUseCase;
  
  // 🏭 REPOSITORIES
  private _profileRepository!: ProfileRepositoryImpl;

  // Validation
  private _profileValidator!: ProfileValidator;

  constructor(config: ProfileContainerConfig = {}) {
    this.config = {
      enableMockData: false,
      logLevel: 'info',
      ...config
    };
  }

  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Profile Container', LogCategory.BUSINESS, {});
      
      // Initialize Repository (Direct usage - no Service layer)
      this._profileRepository = new ProfileRepositoryImpl();
      
      // Initialize Services
      this._avatarService = new AvatarService();
      
      // Initialize Use Cases with Repository
      this._validateProfileDataUseCase = new ValidateProfileDataUseCase();
      this._updatePrivacySettingsUseCase = new UpdatePrivacySettingsUseCase(this._profileRepository);
      
      // Initialize Validation
      this._profileValidator = new ProfileValidator();
      
      this._isReady = true;
      this.logger.info('Profile Container initialized successfully (optimized)', LogCategory.BUSINESS, {});
    } catch (error) {
      this.logger.error('Profile Container initialization failed', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  // 🏪 REPOSITORIES (Direct access - no Service layer)
  getProfileRepository(): ProfileRepositoryImpl {
    this.ensureReady();
    return this._profileRepository;
  }

  // 🎯 USE CASES
  getValidateProfileDataUseCase(): ValidateProfileDataUseCase {
    this.ensureReady();
    return this._validateProfileDataUseCase;
  }

  getUpdatePrivacySettingsUseCase(): UpdatePrivacySettingsUseCase {
    this.ensureReady();
    return this._updatePrivacySettingsUseCase;
  }

  // 🏭 SERVICES
  getAvatarService(): AvatarService {
    this.ensureReady();
    return this._avatarService;
  }

  getProfileValidator(): ProfileValidator {
    this.ensureReady();
    return this._profileValidator;
  }

  // 🎯 PUBLIC GETTERS
  isReady(): boolean {
    return this._isReady;
  }

  getConfig(): ProfileContainerConfig {
    return { ...this.config };
  }

  async reset(): Promise<void> {
    this._isReady = false;
    await this.initialize();
  }

  setMockService(serviceName: string, mockInstance: any): void {
    if (!this._isReady) {
      this.logger.warn('Container not initialized for mocking', LogCategory.BUSINESS);
      return;
    }
    
    switch (serviceName) {
      case 'profileRepository':
        this._profileRepository = mockInstance;
        break;
      case 'avatarService':
        this._avatarService = mockInstance;
        break;
      case 'updatePrivacySettingsUseCase':
        this._updatePrivacySettingsUseCase = mockInstance;
        break;
      default:
        this.logger.warn(`Unknown service for mocking: ${serviceName}`, LogCategory.BUSINESS);
    }
  }

  private ensureReady(): void {
    if (!this._isReady) {
      throw new Error('ProfileContainer is not initialized. Call initialize() first.');
    }
  }
}

// 🏭 SINGLETON INSTANCE
export const profileContainer = new ProfileContainer();

// 🎯 CONVENIENCE HOOK
export function useProfileContainer(): ProfileContainer {
  return profileContainer;
}

// 🧪 TESTING UTILITIES
export const resetProfileContainerForTesting = () => {
  profileContainer.reset();
};

export const setMockProfileRepository = (mockRepository: any) => {
  profileContainer.setMockService('profileRepository', mockRepository);
};

export const setMockUpdatePrivacySettingsUseCase = (mockUseCase: any) => {
  profileContainer.setMockService('updatePrivacySettingsUseCase', mockUseCase);
}; 