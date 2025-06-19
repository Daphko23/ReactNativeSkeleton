/**
 * @fileoverview ACCOUNT SETTINGS DI CONTAINER - Enterprise Dependency Injection
 * @description Account Settings Dependency Injection Container nach Enterprise Standards
 * 
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

import { AccountSettingsRepositoryImpl } from '../repositories/account-settings.repository.impl';
import { StorageService } from '@core/services/storage.service';
import { LoggerFactory } from '@core/logging/logger.factory';

/**
 * Account Settings Dependency Injection Container
 * 
 * @description
 * Enterprise DI Container für Account Settings Domain Services.
 * Implementiert Dependency Injection Pattern für lose Kopplung.
 */
class AccountSettingsDIContainer {
  private static instance: AccountSettingsDIContainer;
  
  // Repository instances
  private accountSettingsRepository?: AccountSettingsRepositoryImpl;

  private constructor() {}

  /**
   * Singleton Instance
   */
  public static getInstance(): AccountSettingsDIContainer {
    if (!AccountSettingsDIContainer.instance) {
      AccountSettingsDIContainer.instance = new AccountSettingsDIContainer();
    }
    return AccountSettingsDIContainer.instance;
  }

  /**
   * Get Account Settings Repository
   */
  public getAccountSettingsRepository(): AccountSettingsRepositoryImpl {
    if (!this.accountSettingsRepository) {
      const storageService = StorageService.getInstance();
      const logger = LoggerFactory.createServiceLogger('AccountSettingsRepository');
      
      this.accountSettingsRepository = new AccountSettingsRepositoryImpl(
        storageService,
        logger
      );
    }
    return this.accountSettingsRepository;
  }

  /**
   * Reset all instances (for testing)
   */
  public reset(): void {
    this.accountSettingsRepository = undefined;
  }
}

// Export singleton instance
export const accountSettingsDIContainer = AccountSettingsDIContainer.getInstance();