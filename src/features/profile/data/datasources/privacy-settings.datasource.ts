import { supabase } from '@core/config/supabase.config';
import type { PrivacySettings } from '../../domain/entities/user-profile.entity';

// Database row interface (matching profile_privacy_settings schema)
export interface PrivacySettingsRow {
  user_id: string;
  
  // Visibility Settings
  profile_visibility?: 'public' | 'friends' | 'private' | 'custom';
  search_visibility?: boolean;
  directory_listing?: boolean;
  
  // Field-specific Privacy
  field_privacy?: Record<string, any>;
  
  // Communication Preferences
  allow_friend_requests?: boolean;
  allow_direct_messages?: boolean;
  allow_profile_views?: boolean;
  
  // Data Sharing
  allow_analytics?: boolean;
  allow_marketing?: boolean;
  allow_third_party_sharing?: boolean;
  
 // Notifications
  email_notifications?: boolean;
  push_notifications?: boolean;
  
  // Online Presence Controls
  show_online_status?: boolean;
  show_last_active?: boolean;
  
  // Analytics & Tracking
  track_profile_views?: boolean;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
}

/**
 * 🔐 ENTERPRISE PRIVACY SETTINGS DATASOURCE
 * Separate table-based privacy settings management with GDPR compliance
 */
export interface IPrivacySettingsDataSource {
  /**
   * Get privacy settings for user
   */
  getPrivacySettings(userId: string): Promise<PrivacySettingsRow | null>;
  
  /**
   * Create privacy settings for user
   */
  createPrivacySettings(userId: string, settings: Partial<PrivacySettingsRow>): Promise<PrivacySettingsRow>;
  
  /**
   * Update privacy settings for user
   */
  updatePrivacySettings(userId: string, settings: Partial<PrivacySettingsRow>): Promise<PrivacySettingsRow>;
  
  /**
   * Delete privacy settings for user (GDPR)
   */
  deletePrivacySettings(userId: string): Promise<void>;
}

/**
 * 🔐 SUPABASE PRIVACY SETTINGS DATASOURCE
 * Enterprise-grade privacy settings with separate table storage
 */
export class SupabasePrivacySettingsDataSource implements IPrivacySettingsDataSource {

  /**
   * 📖 Get privacy settings for user
   */
  async getPrivacySettings(userId: string): Promise<PrivacySettingsRow | null> {
    try {
      const { data, error } = await supabase
        .from('profile_privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No privacy settings found - return null (will create defaults)
          return null;
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * ➕ Create privacy settings for user
   */
  async createPrivacySettings(userId: string, settings: Partial<PrivacySettingsRow>): Promise<PrivacySettingsRow> {
    try {
      const newSettings: Partial<PrivacySettingsRow> = {
        user_id: userId,
        ...settings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profile_privacy_settings')
        .insert(newSettings)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 📝 Update privacy settings for user
   */
  async updatePrivacySettings(userId: string, settings: Partial<PrivacySettingsRow>): Promise<PrivacySettingsRow> {
    try {
      const updateData: Partial<PrivacySettingsRow> = {
        ...settings,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profile_privacy_settings')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 🗑️ Delete privacy settings for user (GDPR)
   */
  async deletePrivacySettings(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profile_privacy_settings')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

/**
 * 🔄 DOMAIN MAPPING UTILITIES
 */

/**
 * Map database row to domain entity
 */
export function mapPrivacySettingsRowToDomain(row: PrivacySettingsRow): PrivacySettings {
  // Extract field privacy settings from JSONB
  const fieldPrivacy = row.field_privacy || {};
  
  return {
    // Profile Visibility Controls
    profileVisibility: row.profile_visibility || 'friends',
    emailVisibility: fieldPrivacy.email || 'private',
    phoneVisibility: fieldPrivacy.phone || 'private', 
    locationVisibility: fieldPrivacy.location || 'public',
    socialLinksVisibility: fieldPrivacy.social_links || 'public',
    professionalInfoVisibility: fieldPrivacy.professional_info || 'public',
    
    // Social Interaction Controls
    allowDirectMessages: row.allow_direct_messages ?? true,
    allowFriendRequests: row.allow_friend_requests ?? true,
    
    // Online Presence Controls
    showOnlineStatus: row.show_online_status ?? true,
    showLastActive: row.show_last_active ?? false,
    
    // Discovery & Search Controls
    searchVisibility: row.search_visibility ?? true,
    directoryListing: row.directory_listing ?? true,
    allowProfileViews: row.allow_profile_views ?? true,
    
    // Analytics & Tracking Controls (GDPR Compliance)
    allowAnalytics: row.allow_analytics ?? true,
    allowThirdPartySharing: row.allow_third_party_sharing ?? false,
    trackProfileViews: row.track_profile_views ?? true,
    
    // Communication Preferences
    emailNotifications: row.email_notifications ?? true,
    pushNotifications: row.push_notifications ?? true,
    marketingCommunications: row.allow_marketing ?? false,
    
    // Field-level privacy
    fieldPrivacy: fieldPrivacy,
  };
}

/**
 * Map domain entity to database row
 */
export function mapPrivacySettingsDomainToRow(settings: PrivacySettings): Partial<PrivacySettingsRow> {
  return {
    // Profile Visibility
    profile_visibility: settings.profileVisibility,
    
    // Social Interaction Controls
    allow_friend_requests: settings.allowFriendRequests,
    allow_direct_messages: settings.allowDirectMessages,
    
    // Online Presence Controls
    show_online_status: settings.showOnlineStatus,
    show_last_active: settings.showLastActive,
    
    // Discovery & Search Controls
    search_visibility: settings.searchVisibility,
    directory_listing: settings.directoryListing,
    allow_profile_views: settings.allowProfileViews,
    
    // Analytics & Tracking Controls
    allow_analytics: settings.allowAnalytics,
    allow_third_party_sharing: settings.allowThirdPartySharing,
    track_profile_views: settings.trackProfileViews,
    
    // Communication Preferences
    allow_marketing: settings.marketingCommunications,
    email_notifications: settings.emailNotifications,
    push_notifications: settings.pushNotifications,
    
    // Field Privacy JSONB
    field_privacy: {
      email: settings.emailVisibility,
      phone: settings.phoneVisibility,
      location: settings.locationVisibility,
      social_links: settings.socialLinksVisibility,
      professional_info: settings.professionalInfoVisibility,
      date_of_birth: settings.fieldPrivacy?.date_of_birth || 'friends',
      ...settings.fieldPrivacy,
    },
  };
} 