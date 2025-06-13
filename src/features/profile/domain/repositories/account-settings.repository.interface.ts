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
 * 🎯 ACCOUNT SETTINGS REPOSITORY INTERFACE
 * 
 * ✅ ENTERPRISE REPOSITORY CONTRACT:
 * - Complete CRUD Operations with Business Context
 * - Batch Operations for Performance
 * - GDPR Compliance Methods
 * - Security-focused Query Methods
 * - Analytics and Reporting Support
 * - Transaction Support for Data Consistency
 */
export interface IAccountSettingsRepository {
  // ===== CORE CRUD OPERATIONS =====
  
  /**
   * Get Account Settings by User ID with selective loading
   */
  getByUserId(
    userId: string, 
    options?: AccountSettingsQueryOptions
  ): Promise<AccountSettings | null>;

  /**
   * Create new Account Settings for User
   */
  create(accountSettings: Omit<AccountSettings, 'metadata'> & { 
    metadata?: Partial<AccountSettings['metadata']> 
  }): Promise<AccountSettings>;

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

  // ===== BUSINESS OPERATIONS =====

  /**
   * Update Social Links with Business Validation
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

  // ===== BATCH OPERATIONS =====

  /**
   * Get Multiple Account Settings (for admin operations)
   */
  getMultiple(
    userIds: string[], 
    options?: AccountSettingsQueryOptions
  ): Promise<AccountSettings[]>;

  /**
   * Bulk Update Account Settings
   */
  bulkUpdate(
    updates: Array<{ userId: string; updates: AccountSettingsUpdateRequest }>
  ): Promise<BulkUpdateResult>;

  // ===== BUSINESS QUERIES =====

  /**
   * Find Users by Privacy Setting
   */
  findByPrivacySetting(
    settingKey: keyof AccountSettings['privacySettings'],
    value: any
  ): Promise<string[]>; // Returns user IDs

  /**
   * Find Users with Social Platform
   */
  findUsersWithSocialPlatform(platform: string): Promise<Array<{
    userId: string;
    socialLink: SocialLink;
  }>>;

  /**
   * Get Security Statistics (for compliance reporting)
   */
  getSecurityStatistics(): Promise<{
    totalUsers: number;
    twoFactorEnabled: number;
    securityLevelDistribution: Record<string, number>;
    averageSessionTimeout: number;
  }>;

  // ===== GDPR COMPLIANCE =====

  /**
   * Export User Data (GDPR Right to Data Portability)
   */
  exportUserData(userId: string): Promise<AccountSettings>;

  /**
   * Anonymize User Data (GDPR Right to be Forgotten - partial)
   */
  anonymizeUserData(userId: string): Promise<boolean>;

  /**
   * Find Users requiring Data Retention Cleanup
   */
  findDataRetentionCandidates(
    cutoffDate: Date
  ): Promise<Array<{
    userId: string;
    dataRetentionDate: Date;
    lastActivity: Date;
  }>>;

  /**
   * Update GDPR Consent Status
   */
  updateGdprConsent(
    userId: string, 
    consentGiven: boolean, 
    consentDate: Date
  ): Promise<boolean>;

  // ===== ADVANCED OPERATIONS =====

  /**
   * Search Account Settings with Business Filters
   */
  search(filters: {
    privacyLevel?: 'public' | 'friends' | 'private';
    hasNotifications?: boolean;
    securityLevel?: 'basic' | 'enhanced' | 'maximum';
    socialPlatforms?: string[];
    gdprConsent?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    lastLoginAfter?: Date;
    lastLoginBefore?: Date;
  }, pagination?: {
    page: number;
    limit: number;
  }): Promise<{
    items: AccountSettings[];
    total: number;
    page: number;
    pages: number;
  }>;

  /**
   * Get Account Settings Analytics
   */
  getAnalytics(dateRange: {
    startDate: Date;
    endDate: Date;
  }): Promise<{
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    privacyDistribution: Record<string, number>;
    platformPopularity: Record<string, number>;
    securityAdoption: Record<string, number>;
    gdprCompliance: {
      consentRate: number;
      optOutRate: number;
      dataExportRequests: number;
      deletionRequests: number;
    };
  }>;

  // ===== PERFORMANCE & MAINTENANCE =====

  /**
   * Health Check for Repository
   */
  healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    responseTime: number;
    connectionStatus: boolean;
    lastError?: string;
  }>;

  /**
   * Clear Cache for User (if applicable)
   */
  clearCache(userId: string): Promise<boolean>;

  /**
   * Optimize Repository Performance
   */
  optimize(): Promise<{
    indexesCreated: number;
    queriesOptimized: number;
    cacheCleared: boolean;
  }>;
} 