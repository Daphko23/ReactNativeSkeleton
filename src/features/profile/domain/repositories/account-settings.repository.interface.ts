/**
 * @fileoverview Account Settings Repository Interface - Domain Contract
 *
 * ✅ DOMAIN LAYER - REPOSITORY CONTRACT:
 * - Definiert Business-orientierte Data Access Interface
 * - Abstrahiert Storage-Implementation Details
 * - Ermöglicht Repository Pattern mit DI
 * - Unterstützt Enterprise Business Operations
 */

import { SocialLink } from '../types/social-links.types';

/**
 * Account Settings Aggregate Root
 */
export interface AccountSettings {
  userId: string;
  socialLinks: SocialLink[];
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    emailVisibility: 'public' | 'friends' | 'private';
    phoneVisibility: 'public' | 'friends' | 'private';
    socialLinksVisibility: 'public' | 'friends' | 'private';
    allowAnalytics: boolean;
    allowMarketing: boolean;
    allowThirdPartySharing: boolean;
  };
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
    profileUpdates: boolean;
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    securityLevel: 'basic' | 'enhanced' | 'maximum';
    sessionTimeout: number;
    allowMultipleDevices: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    gdprConsentGiven: boolean;
    gdprConsentDate?: Date;
    dataRetentionDate?: Date;
  };
}

/**
 * Repository Query Options
 */
export interface AccountSettingsQueryOptions {
  includePrivacySettings?: boolean;
  includeNotificationSettings?: boolean;
  includeSecuritySettings?: boolean;
  includeSocialLinks?: boolean;
  includeMetadata?: boolean;
}

/**
 * Account Settings Update Request
 */
export interface AccountSettingsUpdateRequest {
  socialLinks?: SocialLink[];
  privacySettings?: Partial<AccountSettings['privacySettings']>;
  notificationSettings?: Partial<AccountSettings['notificationSettings']>;
  securitySettings?: Partial<AccountSettings['securitySettings']>;
  gdprConsent?: boolean;
}

/**
 * Bulk Update Result
 */
export interface BulkUpdateResult {
  successCount: number;
  failureCount: number;
  failures: Array<{
    userId: string;
    error: string;
  }>;
}

/**
 * 🎯 ACCOUNT SETTINGS REPOSITORY INTERFACE - MOBILE FIRST
 *
 * ✅ MOBILE APP REPOSITORY CONTRACT:
 * - Essential CRUD Operations for Mobile Apps
 * - GDPR Compliance (Required by Law)
 * - No Enterprise Analytics/Admin Features
 */
export interface IAccountSettingsRepository {
  // ===== CORE CRUD OPERATIONS =====

  /**
   * Get Account Settings by User ID
   */
  getByUserId(
    userId: string,
    options?: AccountSettingsQueryOptions
  ): Promise<AccountSettings | null>;

  /**
   * Create new Account Settings for User
   */
  create(
    accountSettings: Omit<AccountSettings, 'metadata'> & {
      metadata?: Partial<AccountSettings['metadata']>;
    }
  ): Promise<AccountSettings>;

  /**
   * Update Account Settings with partial data
   */
  update(
    userId: string,
    updates: AccountSettingsUpdateRequest
  ): Promise<AccountSettings>;

  /**
   * Delete Account Settings (GDPR Right to be Forgotten)
   */
  delete(userId: string): Promise<boolean>;

  // ===== MOBILE APP BUSINESS OPERATIONS =====

  /**
   * Update Social Links
   */
  updateSocialLinks(
    userId: string,
    socialLinks: SocialLink[]
  ): Promise<SocialLink[]>;

  /**
   * Update Privacy Settings with GDPR Compliance
   */
  updatePrivacySettings(
    userId: string,
    privacySettings: Partial<AccountSettings['privacySettings']>,
    gdprConsent: boolean
  ): Promise<AccountSettings['privacySettings']>;

  /**
   * Update Notification Preferences
   */
  updateNotificationSettings(
    userId: string,
    notificationSettings: Partial<AccountSettings['notificationSettings']>
  ): Promise<AccountSettings['notificationSettings']>;

  /**
   * Update Security Configuration
   */
  updateSecuritySettings(
    userId: string,
    securitySettings: Partial<AccountSettings['securitySettings']>
  ): Promise<AccountSettings['securitySettings']>;

  // ===== GDPR COMPLIANCE (Required by Law) =====

  /**
   * Export User Data (GDPR Right to Data Portability)
   */
  exportUserData(userId: string): Promise<AccountSettings>;

  /**
   * Update GDPR Consent Status
   */
  updateGdprConsent(
    userId: string,
    consentGiven: boolean,
    consentDate: Date
  ): Promise<boolean>;

  // ===== ENTERPRISE FEATURES MOVED TO ADMIN PANEL =====
  // Analytics, Bulk Operations, Search, Performance Monitoring → Backend/Admin Panel
}
