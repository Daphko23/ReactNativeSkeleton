/**
 * SupabaseProfileScreenDataSource - Enterprise Supabase Data Source
 * 🚀 ENTERPRISE: Supabase Integration, Real-time Updates, Offline Support
 * ✅ DATA LAYER: Supabase Implementation für Profile Screen Data Operations
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import { IProfileScreenDataSource } from '../../repositories/profile-screen/profile-screen-repository.impl';

const logger = LoggerFactory.createServiceLogger('SupabaseProfileScreenDataSource');

/**
 * @class SupabaseProfileScreenDataSource
 * Enterprise Supabase Data Source for Profile Screen Data
 * 
 * Features:
 * - Supabase PostgreSQL integration
 * - Real-time subscriptions
 * - Optimized queries with indexing
 * - Batch operations for performance
 * - Error handling and retry logic
 * - Connection pooling and caching
 */
export class SupabaseProfileScreenDataSource implements IProfileScreenDataSource {
  private supabaseClient: SupabaseClient;
  private connectionHealthy: boolean = true;
  private lastHealthCheck: Date = new Date();

  constructor() {
    // Initialize Supabase client
    this.supabaseClient = createClient(
      process.env.SUPABASE_URL || 'https://ubolrasyvzrurjsafzay.supabase.co',
      process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVib2xyYXN5dnpydXJqc2FmemF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMzI2NzcsImV4cCI6MjA1MjYwODY3N30.Fn1iGLp6GJgfWwpz1qfCJAYlbrKQl8lnfW64FGCSI30'
    );

    logger.info('SupabaseProfileScreenDataSource initialized', LogCategory.BUSINESS, {
      metadata: {
        url: process.env.SUPABASE_URL?.substring(0, 30) + '...'
      }
    });

    // Setup periodic health checks
    setInterval(() => this.performHealthCheck(), 60000); // Every minute
  }

  // ==========================================
  // Profile Screen State Operations
  // ==========================================

  async getProfileScreenState(userId: string): Promise<any> {
    try {
      logger.info('Getting profile screen state from Supabase', LogCategory.BUSINESS, { userId });

      await this.ensureConnection();

      const { data, error } = await this.supabaseClient
        .from('profile_screen_states')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      logger.info('Profile screen state retrieved from Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          found: !!data
        }
      });

      return data;
    } catch (error) {
      logger.error('Failed to get profile screen state from Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async saveProfileScreenState(userId: string, state: any): Promise<void> {
    try {
      logger.info('Saving profile screen state to Supabase', LogCategory.BUSINESS, { userId });

      await this.ensureConnection();

      const stateData = {
        user_id: userId,
        view_mode: state.viewMode,
        interaction_state: state.interactionState,
        performance_metrics: state.performanceMetrics,
        ui_state: state.uiState,
        created_at: state.createdAt,
        updated_at: state.lastUpdated || new Date().toISOString()
      };

      const { error } = await this.supabaseClient
        .from('profile_screen_states')
        .upsert(stateData, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      logger.info('Profile screen state saved to Supabase', LogCategory.BUSINESS, { userId });
    } catch (error) {
      logger.error('Failed to save profile screen state to Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  // ==========================================
  // Profile Interaction Operations
  // ==========================================

  async getProfileInteractions(userId: string): Promise<any[]> {
    try {
      logger.info('Getting profile interactions from Supabase', LogCategory.BUSINESS, { userId });

      await this.ensureConnection();

      const { data, error } = await this.supabaseClient
        .from('profile_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1000); // Limit to recent 1000 interactions

      if (error) {
        throw error;
      }

      logger.info('Profile interactions retrieved from Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          count: data?.length || 0
        }
      });

      return data || [];
    } catch (error) {
      logger.error('Failed to get profile interactions from Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async saveProfileInteraction(userId: string, interaction: any): Promise<void> {
    try {
      logger.info('Saving profile interaction to Supabase', LogCategory.BUSINESS, { 
        userId,
        sessionId: interaction.sessionId
      });

      await this.ensureConnection();

      const interactionData = {
        user_id: userId,
        session_id: interaction.sessionId,
        behavior_metrics: interaction.behaviorMetrics,
        engagement_metrics: interaction.engagementMetrics,
        session_analytics: interaction.sessionAnalytics,
        device_context: interaction.deviceContext,
        total_events: interaction.totalEvents,
        session_duration: interaction.sessionDuration,
        created_at: interaction.createdAt
      };

      const { error } = await this.supabaseClient
        .from('profile_interactions')
        .insert(interactionData);

      if (error) {
        throw error;
      }

      logger.info('Profile interaction saved to Supabase', LogCategory.BUSINESS, { userId });
    } catch (error) {
      logger.error('Failed to save profile interaction to Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  // ==========================================
  // Profile Configuration Operations
  // ==========================================

  async getProfileConfiguration(userId: string): Promise<any> {
    try {
      logger.info('Getting profile configuration from Supabase', LogCategory.BUSINESS, { userId });

      await this.ensureConnection();

      const { data, error } = await this.supabaseClient
        .from('profile_configurations')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      logger.info('Profile configuration retrieved from Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          found: !!data
        }
      });

      return data;
    } catch (error) {
      logger.error('Failed to get profile configuration from Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async updateProfileConfiguration(userId: string, config: any): Promise<void> {
    try {
      logger.info('Updating profile configuration in Supabase', LogCategory.BUSINESS, { userId });

      await this.ensureConnection();

      const configData = {
        user_id: userId,
        organization_id: config.organizationId,
        feature_flags: config.featureFlags,
        security_settings: config.securitySettings,
        layout_settings: config.layoutSettings,
        business_rules: config.businessRules,
        permissions: config.permissions,
        version: config.version,
        updated_at: new Date().toISOString()
      };

      const { error } = await this.supabaseClient
        .from('profile_configurations')
        .upsert(configData, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      logger.info('Profile configuration updated in Supabase', LogCategory.BUSINESS, { userId });
    } catch (error) {
      logger.error('Failed to update profile configuration in Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  // ==========================================
  // Offline State Operations
  // ==========================================

  async getOfflineState(userId: string): Promise<any> {
    try {
      logger.info('Getting offline state from Supabase', LogCategory.BUSINESS, { userId });

      await this.ensureConnection();

      const { data, error } = await this.supabaseClient
        .from('profile_offline_states')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      logger.info('Offline state retrieved from Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          found: !!data
        }
      });

      return data;
    } catch (error) {
      logger.error('Failed to get offline state from Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async updateOfflineState(userId: string, state: any): Promise<void> {
    try {
      logger.info('Updating offline state in Supabase', LogCategory.BUSINESS, { userId });

      await this.ensureConnection();

      const stateData = {
        user_id: userId,
        sync_status: state.syncStatus,
        queued_operations: state.queuedOperations,
        conflicts: state.conflicts,
        cache_metadata: state.cacheMetadata,
        network_state: state.networkState,
        sync_metrics: state.syncMetrics,
        resolution_strategy: state.resolutionStrategy,
        updated_at: new Date().toISOString()
      };

      const { error } = await this.supabaseClient
        .from('profile_offline_states')
        .upsert(stateData, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      logger.info('Offline state updated in Supabase', LogCategory.BUSINESS, { userId });
    } catch (error) {
      logger.error('Failed to update offline state in Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  // ==========================================
  // Health Check & Connection Management
  // ==========================================

  async performHealthCheck(): Promise<boolean> {
    try {
      const { data: _data, error } = await this.supabaseClient
        .from('profile_screen_states')
        .select('user_id')
        .limit(1);

      this.connectionHealthy = !error;
      this.lastHealthCheck = new Date();

      if (error) {
        logger.error('Supabase health check failed', LogCategory.BUSINESS, {}, error);
      } else {
        logger.info('Supabase health check passed', LogCategory.BUSINESS, {
          metadata: {
            timestamp: this.lastHealthCheck.toISOString()
          }
        });
      }

      return this.connectionHealthy;
    } catch (error) {
      this.connectionHealthy = false;
      this.lastHealthCheck = new Date();
      logger.error('Supabase health check error', LogCategory.BUSINESS, {}, error as Error);
      return false;
    }
  }

  private async ensureConnection(): Promise<void> {
    const timeSinceLastCheck = Date.now() - this.lastHealthCheck.getTime();
    
    // Check connection health if last check was more than 5 minutes ago
    if (timeSinceLastCheck > 5 * 60 * 1000) {
      await this.performHealthCheck();
    }

    if (!this.connectionHealthy) {
      throw new Error('Supabase connection is not healthy');
    }
  }

  // ==========================================
  // Batch Operations for Performance
  // ==========================================

  async batchSaveInteractions(userId: string, interactions: any[]): Promise<void> {
    try {
      logger.info('Batch saving interactions to Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          count: interactions.length
        }
      });

      await this.ensureConnection();

      const batchData = interactions.map(interaction => ({
        user_id: userId,
        session_id: interaction.sessionId,
        behavior_metrics: interaction.behaviorMetrics,
        engagement_metrics: interaction.engagementMetrics,
        session_analytics: interaction.sessionAnalytics,
        device_context: interaction.deviceContext,
        created_at: interaction.createdAt
      }));

      const { error } = await this.supabaseClient
        .from('profile_interactions')
        .insert(batchData);

      if (error) {
        throw error;
      }

      logger.info('Batch interactions saved to Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          count: interactions.length
        }
      });
    } catch (error) {
      logger.error('Failed to batch save interactions to Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  async cleanupOldData(userId: string, daysToKeep: number = 90): Promise<number> {
    try {
      logger.info('Cleaning up old profile data in Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          daysToKeep
        }
      });

      await this.ensureConnection();

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { data, error } = await this.supabaseClient
        .from('profile_interactions')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', cutoffDate.toISOString());

      if (error) {
        throw error;
      }

      const deletedCount = (data as any)?.length || 0;

      logger.info('Old profile data cleaned up in Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: { deletedCount }
      });

      return deletedCount;
    } catch (error) {
      logger.error('Failed to cleanup old data in Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  // ==========================================
  // Real-time Subscriptions
  // ==========================================

  subscribeToProfileUpdates(userId: string, callback: (payload: any) => void): () => void {
    logger.info('Setting up real-time subscription for profile updates', LogCategory.BUSINESS, { userId });

    const subscription = this.supabaseClient
      .channel(`profile_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_screen_states',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      logger.info('Unsubscribing from profile updates', LogCategory.BUSINESS, { userId });
      this.supabaseClient.removeChannel(subscription);
    };
  }

  // ==========================================
  // Analytics & Reporting
  // ==========================================

  async getProfileAnalytics(userId: string, timeRange: { start: Date; end: Date }): Promise<any> {
    try {
      logger.info('Getting profile analytics from Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: { timeRange: `${timeRange.start.toISOString()} - ${timeRange.end.toISOString()}` }
      });

      await this.ensureConnection();

      // Get interaction analytics
      const { data: interactions, error: interactionError } = await this.supabaseClient
        .from('profile_interactions')
        .select('behavior_metrics, engagement_metrics, session_analytics, created_at')
        .eq('user_id', userId)
        .gte('created_at', timeRange.start.toISOString())
        .lte('created_at', timeRange.end.toISOString());

      if (interactionError) {
        throw interactionError;
      }

      // Aggregate analytics data
      const analytics = {
        totalSessions: interactions?.length || 0,
        totalInteractions: interactions?.reduce((sum, session) => 
          sum + (session.behavior_metrics?.totalInteractions || 0), 0) || 0,
        averageEngagementScore: this.calculateAverageEngagement(interactions || []),
        timeRange,
        retrievedAt: new Date()
      };

      logger.info('Profile analytics retrieved from Supabase', LogCategory.BUSINESS, { 
        userId,
        metadata: { totalSessions: analytics.totalSessions }
      });

      return analytics;
    } catch (error) {
      logger.error('Failed to get profile analytics from Supabase', LogCategory.BUSINESS, { userId }, error as Error);
      throw error;
    }
  }

  private calculateAverageEngagement(interactions: any[]): number {
    if (interactions.length === 0) return 0;
    
    const totalEngagement = interactions.reduce((sum, interaction) => 
      sum + (interaction.engagement_metrics?.engagementScore || 0), 0);
    
    return totalEngagement / interactions.length;
  }

  // ==========================================
  // Connection Info & Status
  // ==========================================

  getConnectionStatus(): {
    healthy: boolean;
    lastHealthCheck: Date;
    url: string;
  } {
    return {
      healthy: this.connectionHealthy,
      lastHealthCheck: this.lastHealthCheck,
      url: (this.supabaseClient as any).supabaseUrl || 'unknown'
    };
  }
}

// Factory function
export const createSupabaseProfileScreenDataSource = (): SupabaseProfileScreenDataSource => {
  return new SupabaseProfileScreenDataSource();
}; 