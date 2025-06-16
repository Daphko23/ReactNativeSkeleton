/**
 * ProfileDataSource - Direct Supabase Integration
 * Handles all database operations for user profiles
 */

import { supabase } from '@core/config/supabase.config';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('ProfileDataSource');

// Database row interfaces (matching Supabase schema)
export interface UserProfileRow {
  id?: string;
  user_id: string;
  email?: string; // Primary email from auth.users (populated by trigger)
  first_name?: string;
  last_name?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  date_of_birth?: string;
  phone_number?: string;
  phone?: string;
  alternative_email?: string;
  job_title?: string;
  company?: string;
  department?: string;
  work_location?: string;
  work_location_preference?: string;
  skills?: string[];
  experience_years?: number;
  salary_range?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  website_url?: string;
  website?: string;
  instagram_url?: string;
  location?: string;
  industry?: string;
  profile_visibility?: string;
  show_email?: boolean;
  show_phone?: boolean;
  show_social_links?: boolean;
  privacy_settings?: Record<string, any>;
  custom_fields?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  version?: number;
}

export interface ProfileHistoryRow {
  id: string;
  user_id: string;
  field_name: string;
  old_value: any;
  new_value: any;
  change_type: 'create' | 'update' | 'delete';
  change_reason?: string;
  changed_by?: string;
  changed_from_ip?: string;
  user_agent?: string;
  metadata: Record<string, any>;
  changed_at: string;
}

export interface ProfileVersionRow {
  id: string;
  user_id: string;
  version_number: number;
  description?: string;
  tags?: string[];
  profile_data: Record<string, any>;
  is_backup: boolean;
  created_by?: string;
  created_at: string;
}

export interface IProfileDataSource {
  // Profile CRUD
  createProfile(profile: Omit<UserProfileRow, 'created_at' | 'updated_at'>): Promise<UserProfileRow>;
  getProfileByUserId(userId: string): Promise<UserProfileRow | null>;
  updateProfile(userId: string, updates: Partial<UserProfileRow>): Promise<UserProfileRow>;
  deleteProfile(userId: string): Promise<boolean>;
  
  // Profile Search
  searchProfiles(query: string, filters?: { role?: string; isActive?: boolean }, limit?: number): Promise<UserProfileRow[]>;
  
  // History & Versioning
  getProfileHistory(userId: string, limit?: number): Promise<ProfileHistoryRow[]>;
  createProfileHistoryEntry(entry: Omit<ProfileHistoryRow, 'id' | 'changed_at'>): Promise<ProfileHistoryRow>;
  createProfileVersion(version: Omit<ProfileVersionRow, 'id' | 'created_at'>): Promise<ProfileVersionRow>;
  getProfileVersions(userId: string): Promise<ProfileVersionRow[]>;
  getProfileVersion(versionId: string): Promise<ProfileVersionRow | null>;
  
  // Analytics
  getProfileStats(): Promise<{
    totalProfiles: number;
    activeProfiles: number;
    verifiedProfiles: number;
    avgCompletionRate: number;
  }>;
  
  // Bulk Operations
  getMultipleProfiles(userIds: string[]): Promise<UserProfileRow[]>;
}

export class ProfileDataSource implements IProfileDataSource {
  // Enterprise logger injected via DI
  private readonly logger = LoggerFactory.createServiceLogger('ProfileDataSource');

  // =============================================
  // PROFILE CRUD
  // =============================================

  async createProfile(profile: Omit<UserProfileRow, 'created_at' | 'updated_at'>): Promise<UserProfileRow> {
    try {
      logger.info('Creating profile in database', LogCategory.BUSINESS, { userId: profile.user_id });

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create profile', LogCategory.BUSINESS, { userId: profile.user_id }, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      logger.info('Profile created successfully', LogCategory.BUSINESS, { userId: data.user_id });
      return data;
    } catch (error) {
      logger.error('Error in createProfile', LogCategory.BUSINESS, { userId: profile.user_id }, error as Error);
      throw error;
    }
  }

  async getProfileByUserId(userId: string): Promise<UserProfileRow | null> {
    try {
      logger.info('Fetching profile by user ID', LogCategory.BUSINESS, { userId });

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not found
          logger.info('Profile not found', LogCategory.BUSINESS, { userId });
          return null;
        }
        logger.error('Failed to fetch profile', LogCategory.BUSINESS, { userId }, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      // If email is missing in profile, get it from auth.users
      if (!data.email) {
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
        if (!authError && authUser?.user?.email) {
          data.email = authUser.user.email;
          logger.info('Added missing email from auth users', LogCategory.BUSINESS, {
            userId,
            metadata: {
              email: authUser.user.email,
              source: 'auth.users'
            }
          });
        }
      }

      logger.info('Profile fetched successfully', LogCategory.BUSINESS, { userId });
      return data;
    } catch (error) {
      logger.error('Error in getProfileByUserId', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfileRow>): Promise<UserProfileRow> {
    try {
      logger.info('Updating profile in database', LogCategory.BUSINESS, { 
        userId, 
        metadata: {
          updateFields: Object.keys(updates)
        }
      });

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update profile', LogCategory.BUSINESS, { userId }, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      logger.info('Profile updated successfully', LogCategory.BUSINESS, { userId });
      return data;
    } catch (error) {
      logger.error('Error in updateProfile', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async deleteProfile(userId: string): Promise<boolean> {
    try {
      logger.info('Deleting profile', LogCategory.BUSINESS, { userId });

      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        logger.error('Failed to delete profile', LogCategory.BUSINESS, { userId }, new Error(error.message));
        return false;
      }

      logger.info('Profile deleted successfully', LogCategory.BUSINESS, { userId });
      return true;
    } catch (error) {
      logger.error('Error in deleteProfile', LogCategory.BUSINESS, { userId }, error as Error);
      return false;
    }
  }

  // =============================================
  // PROFILE SEARCH
  // =============================================

  async searchProfiles(
    query: string,
    filters?: { role?: string; isActive?: boolean },
    limit: number = 50
  ): Promise<UserProfileRow[]> {
    try {
      logger.debug('Searching profiles', LogCategory.BUSINESS, {
        metadata: { query, filters, limit }
      });

      let queryBuilder = supabase
        .from('user_profiles')
        .select('*');

      // Add text search
      if (query.trim()) {
        queryBuilder = queryBuilder.or(
          `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`
        );
      }

      // Add filters
      if (filters?.role) {
        queryBuilder = queryBuilder.eq('role', filters.role);
      }
      
      if (filters?.isActive !== undefined) {
        queryBuilder = queryBuilder.eq('is_active', filters.isActive);
      }

      const { data, error } = await queryBuilder
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Failed to search profiles', LogCategory.BUSINESS, {}, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      logger.debug('Profiles search completed', LogCategory.BUSINESS, {
        metadata: { count: data.length }
      });
      return data;
    } catch (error) {
      logger.error('Error in searchProfiles', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  // =============================================
  // HISTORY & VERSIONING
  // =============================================

  async getProfileHistory(userId: string, limit: number = 50): Promise<ProfileHistoryRow[]> {
    try {
      logger.debug('Fetching profile history', LogCategory.BUSINESS, {
        userId,
        metadata: { limit }
      });

      const { data, error } = await supabase
        .from('profile_history')
        .select('*')
        .eq('user_id', userId)
        .order('changed_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Failed to fetch profile history', LogCategory.BUSINESS, { userId }, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      logger.debug('Profile history fetched successfully', LogCategory.BUSINESS, {
        metadata: { count: data.length }
      });
      return data;
    } catch (error) {
      logger.error('Error in getProfileHistory', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async createProfileHistoryEntry(
    entry: Omit<ProfileHistoryRow, 'id' | 'changed_at'>
  ): Promise<ProfileHistoryRow> {
    try {
      logger.debug('Creating profile history entry', LogCategory.BUSINESS, {
        metadata: entry
      });

      const { data, error } = await supabase
        .from('profile_history')
        .insert({
          ...entry,
          changed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create history entry', LogCategory.BUSINESS, {
        metadata: { id: entry.user_id }
      }, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      logger.info('Profile history entry created successfully', LogCategory.BUSINESS, { metadata: { id: data.id } });
      return data;
    } catch (error) {
      logger.error('Error in createProfileHistoryEntry', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  async createProfileVersion(
    version: Omit<ProfileVersionRow, 'id' | 'created_at'>
  ): Promise<ProfileVersionRow> {
    try {
      logger.debug('Creating profile version', LogCategory.BUSINESS);

      const { data, error } = await supabase
        .from('profile_versions')
        .insert({
          ...version,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create profile version', LogCategory.BUSINESS, {}, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      logger.info('Profile version created successfully', LogCategory.BUSINESS, { metadata: { id: data.id } });
      return data;
    } catch (error) {
      logger.error('Error in createProfileVersion', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  async getProfileVersions(userId: string): Promise<ProfileVersionRow[]> {
    try {
      logger.debug('Fetching profile versions', LogCategory.BUSINESS);

      const { data, error } = await supabase
        .from('profile_versions')
        .select('*')
        .eq('user_id', userId)
        .order('version_number', { ascending: false });

      if (error) {
        logger.error('Failed to fetch profile versions', LogCategory.BUSINESS, { userId }, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      logger.debug('Profile versions fetched successfully', LogCategory.BUSINESS);
      return data;
    } catch (error) {
      logger.error('Error in getProfileVersions', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async getProfileVersion(versionId: string): Promise<ProfileVersionRow | null> {
    try {
      logger.debug('Fetching profile version', LogCategory.BUSINESS);

      const { data, error } = await supabase
        .from('profile_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not found
          logger.debug('Profile version not found', LogCategory.BUSINESS);
          return null;
        }
        logger.error('Failed to fetch profile version', LogCategory.BUSINESS, { metadata: { versionId } }, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      logger.debug('Profile version fetched successfully', LogCategory.BUSINESS);
      return data;
    } catch (error) {
      logger.error('Error in getProfileVersion', LogCategory.BUSINESS, { metadata: { versionId } }, error as Error);
      throw error;
    }
  }

  // =============================================
  // ANALYTICS
  // =============================================

  async getProfileStats(): Promise<{
    totalProfiles: number;
    activeProfiles: number;
    verifiedProfiles: number;
    avgCompletionRate: number;
  }> {
    try {
      logger.debug('Fetching profile statistics', LogCategory.BUSINESS);

      // Get total profiles count
      const { count: totalProfiles, error: totalError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        throw new Error(`Failed to get total profiles: ${totalError.message}`);
      }

      // Get active profiles count
      const { count: activeProfiles, error: activeError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) {
        throw new Error(`Failed to get active profiles: ${activeError.message}`);
      }

      // Get verified profiles count
      const { count: verifiedProfiles, error: verifiedError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true);

      if (verifiedError) {
        throw new Error(`Failed to get verified profiles: ${verifiedError.message}`);
      }

      // Get average completion rate
      const { data: avgData, error: avgError } = await supabase
        .from('user_profiles')
        .select('profile_completion_rate')
        .eq('is_active', true);

      if (avgError) {
        throw new Error(`Failed to get completion rates: ${avgError.message}`);
      }

      const avgCompletionRate = avgData.length > 0 
        ? avgData.reduce((sum, profile) => sum + profile.profile_completion_rate, 0) / avgData.length
        : 0;

      const stats = {
        totalProfiles: totalProfiles || 0,
        activeProfiles: activeProfiles || 0,
        verifiedProfiles: verifiedProfiles || 0,
        avgCompletionRate: Math.round(avgCompletionRate * 100) / 100
      };

      logger.debug('Profile statistics fetched successfully', LogCategory.BUSINESS);
      return stats;
    } catch (error) {
      logger.error('Error in getProfileStats', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  // =============================================
  // BULK OPERATIONS
  // =============================================

  async getMultipleProfiles(userIds: string[]): Promise<UserProfileRow[]> {
    try {
      logger.debug('Fetching multiple profiles', LogCategory.BUSINESS);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('user_id', userIds);

      if (error) {
        logger.error('Failed to fetch multiple profiles', LogCategory.BUSINESS, {}, new Error(error.message));
        throw new Error(`Database error: ${error.message}`);
      }

      logger.debug('Multiple profiles fetched successfully', LogCategory.BUSINESS);
      return data;
    } catch (error) {
      logger.error('Error in getMultipleProfiles', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }
} 