import { SupabaseAccountSettingsDataSource } from '../datasources/supabase-account-settings.datasource';
import { AccountSettingsRepositoryImpl } from '../repositories/account-settings-repository.impl';

/**
 * AccountSettingsDIContainer
 *
 * @description
 * Dependency Injection Container für AccountSettings Feature.
 * Stellt Singleton-Instanzen für DataSource, Repository und UseCases bereit.
 */
export class AccountSettingsDIContainer {
  private static instance: AccountSettingsDIContainer;

  // Data Layer
  private _accountSettingsDataSource?: SupabaseAccountSettingsDataSource;
  private _accountSettingsRepository?: AccountSettingsRepositoryImpl;

  private constructor() {}

  public static getInstance(): AccountSettingsDIContainer {
    if (!AccountSettingsDIContainer.instance) {
      AccountSettingsDIContainer.instance = new AccountSettingsDIContainer();
    }
    return AccountSettingsDIContainer.instance;
  }

  public getAccountSettingsDataSource(): SupabaseAccountSettingsDataSource {
    if (!this._accountSettingsDataSource) {
      this._accountSettingsDataSource = new SupabaseAccountSettingsDataSource();
    }
    return this._accountSettingsDataSource;
  }

  public getAccountSettingsRepository(): AccountSettingsRepositoryImpl {
    if (!this._accountSettingsRepository) {
      this._accountSettingsRepository = new AccountSettingsRepositoryImpl(
        this.getAccountSettingsDataSource()
      );
    }
    return this._accountSettingsRepository;
  }

  /**
   * Reset all instances (for testing)
   */
  public reset(): void {
    this._accountSettingsDataSource = undefined;
    this._accountSettingsRepository = undefined;
  }
}

// Singleton Export
export const accountSettingsDIContainer = AccountSettingsDIContainer.getInstance(); 