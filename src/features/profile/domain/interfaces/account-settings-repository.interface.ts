/**
 * @fileoverview ACCOUNT-SETTINGS-REPOSITORY-INTERFACE: Domain Contract
 * @description Domain Layer Repository Interface für Account Settings Management
 * nach Clean Architecture Prinzipien mit Business Logic Contracts.
 * 
 * @version 1.0.0
 * @since 2.0.0 (Repository Pattern Migration)
 * @author ReactNativeSkeleton Enterprise Team
 */

/**
 * Account Settings Entity für Business Logic
 */
export interface AccountSettings {
  userId: string;
  
  // Privacy Settings
  profileVisibility: 'public' | 'friends' | 'private';
  emailVisibility: 'public' | 'friends' | 'private';
  phoneVisibility: 'public' | 'friends' | 'private';
  
  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingCommunications: boolean;
  
  // Security Settings
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number; // in minutes
  
  // App Preferences
  language: string;
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  
  // GDPR Settings
  allowAnalytics: boolean;
  allowThirdPartySharing: boolean;
  
  // Timestamps
  updatedAt: Date;
  lastPasswordChange?: Date;
}

/**
 * Account Settings Update Request
 */
export interface UpdateAccountSettingsRequest {
  userId: string;
  settings: Partial<AccountSettings>;
  reason?: string;
  gdprUpdate?: boolean;
}

/**
 * Account Settings Update Result
 */
export interface UpdateAccountSettingsResult {
  success: boolean;
  settings?: AccountSettings;
  error?: string;
  auditLogId?: string;
}

/**
 * Account Settings Validation Result
 */
export interface AccountSettingsValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Privacy Settings Entity
 */
export interface PrivacySettings {
  userId: string;
  profileVisibility: 'public' | 'friends' | 'private';
  emailVisibility: 'public' | 'friends' | 'private';
  phoneVisibility: 'public' | 'friends' | 'private';
  socialLinksVisibility: 'public' | 'friends' | 'private';
  professionalInfoVisibility: 'public' | 'friends' | 'private';
  updatedAt: Date;
}

/**
 * Notification Settings Entity
 */
export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  updatedAt: Date;
}

/**
 * 🎯 ACCOUNT SETTINGS REPOSITORY INTERFACE
 * 
 * Domain Layer Contract für Account Settings Operations.
 * Definiert Business Logic Contracts ohne Storage-spezifische Details.
 */
export interface IAccountSettingsRepository {
  /**
   * Get account settings for user
   * 
   * @param userId - User identifier
   * @returns Promise with account settings or null if not found
   * 
   * @description
   * Business Logic Contract für Account Settings Retrieval.
   * Lädt alle Account Settings für den angegebenen Benutzer.
   * 
   * @example
   * ```typescript
   * const settings = await repository.getAccountSettings('user-123');
   * if (settings) {
   *   console.log('Theme:', settings.theme);
   *   console.log('Notifications:', settings.emailNotifications);
   * }
   * ```
   */
  getAccountSettings(userId: string): Promise<AccountSettings | null>;

  /**
   * Update account settings for user
   * 
   * @param request - Update request with user ID and settings
   * @returns Promise with update result
   * 
   * @description
   * Business Logic Contract für Account Settings Update.
   * Aktualisiert Account Settings mit Business Rule Validation.
   * 
   * @example
   * ```typescript
   * const result = await repository.updateAccountSettings({
   *   userId: 'user-123',
   *   settings: {
   *     theme: 'dark',
   *     emailNotifications: false
   *   },
   *   reason: 'User preference update'
   * });
   * 
   * if (result.success) {
   *   console.log('Settings updated:', result.settings);
   * }
   * ```
   */
  updateAccountSettings(request: UpdateAccountSettingsRequest): Promise<UpdateAccountSettingsResult>;

  /**
   * Reset account settings to defaults
   * 
   * @param userId - User identifier
   * @param reason - Reason for reset
   * @returns Promise with reset result
   * 
   * @description
   * Business Logic Contract für Account Settings Reset.
   * Setzt alle Settings auf Enterprise Default Values zurück.
   * 
   * @example
   * ```typescript
   * const result = await repository.resetAccountSettings(
   *   'user-123',
   *   'User requested factory reset'
   * );
   * 
   * if (result.success) {
   *   console.log('Settings reset to defaults');
   * }
   * ```
   */
  resetAccountSettings(userId: string, reason: string): Promise<UpdateAccountSettingsResult>;

  /**
   * Validate account settings
   * 
   * @param settings - Settings to validate
   * @returns Validation result with errors and warnings
   * 
   * @description
   * Business Logic Contract für Account Settings Validation.
   * Prüft Settings auf Business Rules und Compliance.
   * 
   * @example
   * ```typescript
   * const validation = repository.validateAccountSettings({
   *   sessionTimeout: 5, // Too short
   *   emailNotifications: false,
   *   marketingCommunications: true // Requires email notifications
   * });
   * 
   * if (!validation.valid) {
   *   console.error('Validation errors:', validation.errors);
   * }
   * ```
   */
  validateAccountSettings(settings: Partial<AccountSettings>): AccountSettingsValidationResult;

  /**
   * Export account settings for GDPR compliance
   * 
   * @param userId - User identifier
   * @returns Promise with exported settings data
   * 
   * @description
   * Business Logic Contract für GDPR Data Export.
   * Exportiert alle Account Settings für GDPR Compliance.
   * 
   * @example
   * ```typescript
   * const exportData = await repository.exportAccountSettings('user-123');
   * console.log('Exported settings:', exportData);
   * ```
   */
  exportAccountSettings(userId: string): Promise<AccountSettings | null>;

  /**
   * Delete all account settings for user
   * 
   * @param userId - User identifier
   * @param reason - Reason for deletion
   * @param gdprRequest - Whether this is a GDPR deletion request
   * @returns Promise with deletion result
   * 
   * @description
   * Business Logic Contract für Account Settings Deletion.
   * Löscht alle Settings für GDPR "Right to be Forgotten".
   * 
   * @example
   * ```typescript
   * const result = await repository.deleteAccountSettings(
   *   'user-123',
   *   'GDPR deletion request',
   *   true
   * );
   * 
   * if (result.success) {
   *   console.log('Settings deleted for GDPR compliance');
   * }
   * ```
   */
  deleteAccountSettings(
    userId: string, 
    reason: string, 
    gdprRequest?: boolean
  ): Promise<{ success: boolean; error?: string; auditLogId?: string }>;
} 