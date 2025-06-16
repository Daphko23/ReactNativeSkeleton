/**
 * @fileoverview Account Settings Repository Implementation - Data Layer
 * 
 * ✅ DATA LAYER - REPOSITORY IMPLEMENTATION:
 * - Implementiert Repository Interface mit Supabase
 * - Enterprise CRUD Operations mit Performance Optimization
 * - GDPR Compliance Methods
 * - Business Query Support
 * - Caching und Error Handling
 */

import { SupabaseClient } from '@supabase/supabase-js';

// Domain Interfaces
import { 
  IAccountSettingsRepository,
  AccountSettings,
  AccountSettingsQueryOptions,
  AccountSettingsUpdateRequest,
  BulkUpdateResult
} from '../../domain/repositories/account-settings.repository.interface';
import { SocialLink } from '../../domain/types/social-links.types';

/**
 * Database Schema Mapping
 */
interface AccountSettingsRow {
  user_id: string;
  social_links: any; // JSONB
  privacy_settings: any; // JSONB
  notification_settings: any; // JSONB
  security_settings: any; // JSONB
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  gdpr_consent_given: boolean;
  gdpr_consent_date?: string;
  data_retention_date?: string;
}

/**
 * 🎯 ACCOUNT SETTINGS REPOSITORY IMPLEMENTATION
 * 
 * ✅ ENTERPRISE DATA ACCESS:
 * - Supabase Integration mit Type Safety
 * - Performance Optimized Queries
 * - Business Logic Abstraction
 * - GDPR Compliance Implementation
 * - Comprehensive Error Handling
 * - Caching Layer Integration
 */
export class AccountSettingsRepositoryImpl implements IAccountSettingsRepository {
  private readonly TABLE_NAME = 'account_settings';
  private readonly cache = new Map<string, { data: AccountSettings; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly supabase: SupabaseClient
  ) {}

  // ===== CORE CRUD OPERATIONS =====

  async getByUserId(
    userId: string, 
    options: AccountSettingsQueryOptions = {}
  ): Promise<AccountSettings | null> {
    try {
      // Check cache first
      const cached = this.getCachedData(userId);
      if (cached) {
        return this.applyQueryOptions(cached, options);
      }

      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to get account settings: ${error.message}`);
      }

      const accountSettings = this.mapRowToDomain(data as AccountSettingsRow);
      this.setCachedData(userId, accountSettings);
      
      return this.applyQueryOptions(accountSettings, options);
    } catch (error) {
      console.error(`Error getting account settings for user ${userId}:`, error);
      throw error;
    }
  }

  async create(
    accountSettings: Omit<AccountSettings, 'metadata'> & { 
      metadata?: Partial<AccountSettings['metadata']> 
    }
  ): Promise<AccountSettings> {
    try {
      const _now = new Date().toISOString();
      const row: Omit<AccountSettingsRow, 'created_at' | 'updated_at'> = {
        user_id: accountSettings.userId,
        social_links: accountSettings.socialLinks,
        privacy_settings: accountSettings.privacySettings,
        notification_settings: accountSettings.notificationSettings,
        security_settings: accountSettings.securitySettings,
        last_login_at: accountSettings.metadata?.lastLoginAt?.toISOString(),
        gdpr_consent_given: accountSettings.metadata?.gdprConsentGiven ?? false,
        gdpr_consent_date: accountSettings.metadata?.gdprConsentDate?.toISOString(),
        data_retention_date: accountSettings.metadata?.dataRetentionDate?.toISOString()
      };

      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .insert(row)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create account settings: ${error.message}`);
      }

      const result = this.mapRowToDomain(data as AccountSettingsRow);
      this.setCachedData(accountSettings.userId, result);
      
      return result;
    } catch (error) {
      console.error(`Error creating account settings:`, error);
      throw error;
    }
  }

  async update(
    userId: string, 
    updates: AccountSettingsUpdateRequest
  ): Promise<AccountSettings> {
    try {
      const updateData: Partial<AccountSettingsRow> = {
        updated_at: new Date().toISOString()
      };

      if (updates.socialLinks) {
        updateData.social_links = updates.socialLinks;
      }

      if (updates.privacySettings) {
        // Get current privacy settings and merge
        const current = await this.getByUserId(userId);
        if (current) {
          updateData.privacy_settings = {
            ...current.privacySettings,
            ...updates.privacySettings
          };
        } else {
          updateData.privacy_settings = updates.privacySettings;
        }
      }

      if (updates.notificationSettings) {
        const current = await this.getByUserId(userId);
        if (current) {
          updateData.notification_settings = {
            ...current.notificationSettings,
            ...updates.notificationSettings
          };
        } else {
          updateData.notification_settings = updates.notificationSettings;
        }
      }

      if (updates.securitySettings) {
        const current = await this.getByUserId(userId);
        if (current) {
          updateData.security_settings = {
            ...current.securitySettings,
            ...updates.securitySettings
          };
        } else {
          updateData.security_settings = updates.securitySettings;
        }
      }

      if (updates.gdprConsent !== undefined) {
        updateData.gdpr_consent_given = updates.gdprConsent;
        if (updates.gdprConsent) {
          updateData.gdpr_consent_date = new Date().toISOString();
        }
      }

      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update account settings: ${error.message}`);
      }

      const result = this.mapRowToDomain(data as AccountSettingsRow);
      this.setCachedData(userId, result);
      
      return result;
    } catch (error) {
      console.error(`Error updating account settings for user ${userId}:`, error);
      throw error;
    }
  }

  async delete(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to delete account settings: ${error.message}`);
      }

      this.clearCache(userId);
      return true;
    } catch (error) {
      console.error(`Error deleting account settings for user ${userId}:`, error);
      throw error;
    }
  }

  // ===== BUSINESS OPERATIONS =====

  async updateSocialLinks(
    userId: string, 
    socialLinks: SocialLink[]
  ): Promise<SocialLink[]> {
    const updated = await this.update(userId, { socialLinks });
    return updated.socialLinks;
  }

  async updatePrivacySettings(
    userId: string, 
    privacySettings: Partial<AccountSettings['privacySettings']>,
    gdprConsent: boolean
  ): Promise<AccountSettings['privacySettings']> {
    const updated = await this.update(userId, { 
      privacySettings, 
      gdprConsent 
    });
    return updated.privacySettings;
  }

  async updateNotificationSettings(
    userId: string, 
    notificationSettings: Partial<AccountSettings['notificationSettings']>
  ): Promise<AccountSettings['notificationSettings']> {
    const updated = await this.update(userId, { notificationSettings });
    return updated.notificationSettings;
  }

  async updateSecuritySettings(
    userId: string, 
    securitySettings: Partial<AccountSettings['securitySettings']>
  ): Promise<AccountSettings['securitySettings']> {
    const updated = await this.update(userId, { securitySettings });
    return updated.securitySettings;
  }

  // ===== BATCH OPERATIONS =====

  async getMultiple(
    userIds: string[], 
    options: AccountSettingsQueryOptions = {}
  ): Promise<AccountSettings[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .in('user_id', userIds);

      if (error) {
        throw new Error(`Failed to get multiple account settings: ${error.message}`);
      }

      return (data as AccountSettingsRow[]).map(row => {
        const accountSettings = this.mapRowToDomain(row);
        this.setCachedData(row.user_id, accountSettings);
        return this.applyQueryOptions(accountSettings, options);
      });
    } catch (error) {
      console.error(`Error getting multiple account settings:`, error);
      throw error;
    }
  }

  async bulkUpdate(
    updates: Array<{ userId: string; updates: AccountSettingsUpdateRequest }>
  ): Promise<BulkUpdateResult> {
    const result: BulkUpdateResult = {
      successCount: 0,
      failureCount: 0,
      failures: []
    };

    for (const { userId, updates: userUpdates } of updates) {
      try {
        await this.update(userId, userUpdates);
        result.successCount++;
      } catch (error) {
        result.failureCount++;
        result.failures.push({
          userId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return result;
  }

  // ===== BUSINESS QUERIES =====

  async findByPrivacySetting(
    settingKey: keyof AccountSettings['privacySettings'],
    value: any
  ): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('user_id')
        .contains('privacy_settings', { [settingKey]: value });

      if (error) {
        throw new Error(`Failed to find by privacy setting: ${error.message}`);
      }

      return data.map(row => row.user_id);
    } catch (error) {
      console.error(`Error finding by privacy setting:`, error);
      throw error;
    }
  }

  async findUsersWithSocialPlatform(platform: string): Promise<Array<{
    userId: string;
    socialLink: SocialLink;
  }>> {
    try {
      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('user_id, social_links');

      if (error) {
        throw new Error(`Failed to find users with social platform: ${error.message}`);
      }

      const results: Array<{ userId: string; socialLink: SocialLink }> = [];

      for (const row of data) {
        const socialLinks = row.social_links as SocialLink[];
        const platformLink = socialLinks.find(link => link.platform === platform);
        if (platformLink) {
          results.push({
            userId: row.user_id,
            socialLink: platformLink
          });
        }
      }

      return results;
    } catch (error) {
      console.error(`Error finding users with social platform:`, error);
      throw error;
    }
  }

  async getSecurityStatistics(): Promise<{
    totalUsers: number;
    twoFactorEnabled: number;
    securityLevelDistribution: Record<string, number>;
    averageSessionTimeout: number;
  }> {
    try {
      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('security_settings');

      if (error) {
        throw new Error(`Failed to get security statistics: ${error.message}`);
      }

      const stats = {
        totalUsers: data.length,
        twoFactorEnabled: 0,
        securityLevelDistribution: {} as Record<string, number>,
        averageSessionTimeout: 0
      };

      let totalSessionTimeout = 0;

      for (const row of data) {
        const securitySettings = row.security_settings;
        
        if (securitySettings.twoFactorEnabled) {
          stats.twoFactorEnabled++;
        }

        const level = securitySettings.securityLevel || 'basic';
        stats.securityLevelDistribution[level] = (stats.securityLevelDistribution[level] || 0) + 1;

        totalSessionTimeout += securitySettings.sessionTimeout || 30;
      }

      stats.averageSessionTimeout = data.length > 0 ? totalSessionTimeout / data.length : 0;

      return stats;
    } catch (error) {
      console.error(`Error getting security statistics:`, error);
      throw error;
    }
  }

  // ===== GDPR COMPLIANCE =====

  async exportUserData(userId: string): Promise<AccountSettings> {
    const data = await this.getByUserId(userId);
    if (!data) {
      throw new Error(`No account settings found for user ${userId}`);
    }
    return data;
  }

  async anonymizeUserData(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from(this.TABLE_NAME)
        .update({
          social_links: [],
          privacy_settings: {
            profileVisibility: 'private',
            emailVisibility: 'private',
            phoneVisibility: 'private',
            socialLinksVisibility: 'private',
            allowAnalytics: false,
            allowMarketing: false,
            allowThirdPartySharing: false
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to anonymize user data: ${error.message}`);
      }

      this.clearCache(userId);
      return true;
    } catch (error) {
      console.error(`Error anonymizing user data:`, error);
      throw error;
    }
  }

  async findDataRetentionCandidates(cutoffDate: Date): Promise<Array<{
    userId: string;
    dataRetentionDate: Date;
    lastActivity: Date;
  }>> {
    try {
      const { data, error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('user_id, data_retention_date, last_login_at, updated_at')
        .not('data_retention_date', 'is', null)
        .lt('data_retention_date', cutoffDate.toISOString());

      if (error) {
        throw new Error(`Failed to find data retention candidates: ${error.message}`);
      }

      return data.map(row => ({
        userId: row.user_id,
        dataRetentionDate: new Date(row.data_retention_date),
        lastActivity: new Date(row.last_login_at || row.updated_at)
      }));
    } catch (error) {
      console.error(`Error finding data retention candidates:`, error);
      throw error;
    }
  }

  async updateGdprConsent(
    userId: string, 
    consentGiven: boolean, 
    consentDate: Date
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from(this.TABLE_NAME)
        .update({
          gdpr_consent_given: consentGiven,
          gdpr_consent_date: consentDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to update GDPR consent: ${error.message}`);
      }

      this.clearCache(userId);
      return true;
    } catch (error) {
      console.error(`Error updating GDPR consent:`, error);
      throw error;
    }
  }

  // ===== ADVANCED OPERATIONS =====

  async search(filters: any, pagination?: { page: number; limit: number }): Promise<any> {
    // Implementation would be complex - simplified for now
    try {
      let query = this.supabase.from(this.TABLE_NAME).select('*', { count: 'exact' });
      
      // Apply filters (simplified)
      if (filters.gdprConsent !== undefined) {
        query = query.eq('gdpr_consent_given', filters.gdprConsent);
      }

      if (pagination) {
        const offset = (pagination.page - 1) * pagination.limit;
        query = query.range(offset, offset + pagination.limit - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Search failed: ${error.message}`);
      }

      const items = (data as AccountSettingsRow[]).map(row => this.mapRowToDomain(row));
      const total = count || 0;
      const pages = pagination ? Math.ceil(total / pagination.limit) : 1;

      return {
        items,
        total,
        page: pagination?.page || 1,
        pages
      };
    } catch (error) {
      console.error(`Error in search:`, error);
      throw error;
    }
  }

  async getAnalytics(dateRange: { startDate: Date; endDate: Date }): Promise<any> {
    // Simplified analytics implementation
    const { data, error } = await this.supabase
      .from(this.TABLE_NAME)
      .select('*')
      .gte('created_at', dateRange.startDate.toISOString())
      .lte('created_at', dateRange.endDate.toISOString());

    if (error) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }

    return {
      totalUsers: data.length,
      newUsers: data.length, // All users in date range are "new"
      activeUsers: data.filter(row => row.last_login_at).length,
      privacyDistribution: {},
      platformPopularity: {},
      securityAdoption: {},
      gdprCompliance: {
        consentRate: data.filter(row => row.gdpr_consent_given).length / data.length,
        optOutRate: data.filter(row => !row.gdpr_consent_given).length / data.length,
        dataExportRequests: 0,
        deletionRequests: 0
      }
    };
  }

  // ===== PERFORMANCE & MAINTENANCE =====

  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    responseTime: number;
    connectionStatus: boolean;
    lastError?: string;
  }> {
    const startTime = Date.now();
    
    try {
      const { error } = await this.supabase
        .from(this.TABLE_NAME)
        .select('user_id')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'unhealthy',
          responseTime,
          connectionStatus: false,
          lastError: error.message
        };
      }

      return {
        status: responseTime > 1000 ? 'degraded' : 'healthy',
        responseTime,
        connectionStatus: true
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        connectionStatus: false,
        lastError: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async clearCache(userId: string): Promise<boolean> {
    this.cache.delete(userId);
    return true;
  }

  async optimize(): Promise<{
    indexesCreated: number;
    queriesOptimized: number;
    cacheCleared: boolean;
  }> {
    // Clear all cache
    this.cache.clear();
    
    return {
      indexesCreated: 0, // Database indexes would be created via migrations
      queriesOptimized: 0, // Query optimization would be database-specific
      cacheCleared: true
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private mapRowToDomain(row: AccountSettingsRow): AccountSettings {
    return {
      userId: row.user_id,
      socialLinks: row.social_links || [],
      privacySettings: row.privacy_settings || {
        profileVisibility: 'private',
        emailVisibility: 'private',
        phoneVisibility: 'private',
        socialLinksVisibility: 'private',
        allowAnalytics: false,
        allowMarketing: false,
        allowThirdPartySharing: false
      },
      notificationSettings: row.notification_settings || {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
        profileUpdates: true
      },
      securitySettings: row.security_settings || {
        twoFactorEnabled: false,
        securityLevel: 'basic',
        sessionTimeout: 30,
        allowMultipleDevices: true
      },
      metadata: {
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : undefined,
        gdprConsentGiven: row.gdpr_consent_given,
        gdprConsentDate: row.gdpr_consent_date ? new Date(row.gdpr_consent_date) : undefined,
        dataRetentionDate: row.data_retention_date ? new Date(row.data_retention_date) : undefined
      }
    };
  }

  private applyQueryOptions(
    accountSettings: AccountSettings, 
    options: AccountSettingsQueryOptions
  ): AccountSettings {
    const result = { ...accountSettings };

    if (options.includePrivacySettings === false) {
      delete (result as any).privacySettings;
    }
    if (options.includeNotificationSettings === false) {
      delete (result as any).notificationSettings;
    }
    if (options.includeSecuritySettings === false) {
      delete (result as any).securitySettings;
    }
    if (options.includeSocialLinks === false) {
      delete (result as any).socialLinks;
    }
    if (options.includeMetadata === false) {
      delete (result as any).metadata;
    }

    return result;
  }

  private getCachedData(userId: string): AccountSettings | null {
    const cached = this.cache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(userId: string, data: AccountSettings): void {
    this.cache.set(userId, {
      data,
      timestamp: Date.now()
    });
  }
} 