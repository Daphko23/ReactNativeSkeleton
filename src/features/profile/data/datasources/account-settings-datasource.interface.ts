/**
 * @fileoverview ACCOUNT-SETTINGS-DATASOURCE-INTERFACE: Data Layer Contract
 * @description DataSource Interface für Account Settings Management
 * nach Clean Architecture Prinzipien.
 * 
 * @version 1.0.0
 * @since 2.0.0 (Repository Pattern Migration)
 * @author ReactNativeSkeleton Enterprise Team
 */

import { 
  AccountSettings, 
  NotificationSettings,
  PrivacySettings 
} from '../../domain/interfaces/account-settings-repository.interface';

/**
 * Account Settings DataSource Interface
 * 
 * ✅ ENTERPRISE DATA SOURCE CONTRACT:
 * - Pure Data Access Operations
 * - No Business Logic
 * - Database/API Abstraction
 */
export interface IAccountSettingsDataSource {
  /**
   * Get account settings for user
   */
  getAccountSettings(userId: string): Promise<AccountSettings>;
  
  /**
   * Update account settings for user
   */
  updateAccountSettings(userId: string, settings: Partial<AccountSettings>): Promise<AccountSettings>;
  
  /**
   * Get privacy settings for user
   */
  getPrivacySettings(userId: string): Promise<PrivacySettings>;
  
  /**
   * Update privacy settings for user
   */
  updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings>;
  
  /**
   * Get notification settings for user
   */
  getNotificationSettings(userId: string): Promise<NotificationSettings>;
  
  /**
   * Update notification settings for user
   */
  updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings>;
} 