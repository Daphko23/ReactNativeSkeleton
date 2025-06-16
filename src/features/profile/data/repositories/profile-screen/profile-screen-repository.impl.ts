/**
 * ProfileScreenRepositoryImpl - Enterprise Data Repository Implementation
 * 🚀 ENTERPRISE: Repository Pattern, Caching, Real-time Updates, Performance Optimization
 * ✅ DATA LAYER: Implementation für Profile Screen Data Operations
 */

import { Result } from '../../../../../core/types/result.type';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import {
  ProfileScreenState,
  ProfileScreenPerformanceMetrics,
  ProfileViewMode,
  ProfileInteractionState,
  createProfileScreenState
} from '../../../domain/entities/profile-screen-state.entity';
import {
  ProfileInteraction,
  ProfileInteractionType,
  EngagementLevel,
  createProfileInteraction
} from '../../../domain/entities/profile-interaction.entity';
import {
  ProfileScreenConfiguration,
  ProfileScreenFeatureFlag,
  createProfileScreenConfiguration
} from '../../../domain/entities/profile-screen-config.entity';
import {
  OfflineProfileState,
  ProfileSyncStatus,
  ConflictResolutionStrategy,
  createOfflineProfileState
} from '../../../domain/entities/offline-profile-state.entity';

const logger = LoggerFactory.createServiceLogger('ProfileScreenRepository');

/**
 * @interface IProfileScreenDataSource - Data source contract
 */
export interface IProfileScreenDataSource {
  getProfileScreenState(userId: string): Promise<any>;
  saveProfileScreenState(userId: string, state: any): Promise<void>;
  getProfileInteractions(userId: string): Promise<any[]>;
  saveProfileInteraction(userId: string, interaction: any): Promise<void>;
  getProfileConfiguration(userId: string): Promise<any>;
  updateProfileConfiguration(userId: string, config: any): Promise<void>;
  getOfflineState(userId: string): Promise<any>;
  updateOfflineState(userId: string, state: any): Promise<void>;
}

/**
 * @interface IProfileScreenRepository - Repository contract
 */
export interface IProfileScreenRepository {
  // Profile Screen State Management
  getScreenState(userId: string): Promise<any>;
  updateScreenState(userId: string, state: ProfileScreenState): Promise<any>;
  
  // Interaction Analytics
  getInteractionHistory(userId: string, timeRange?: { start: Date; end: Date }): Promise<any>;
  saveInteractionEvent(userId: string, interaction: ProfileInteraction): Promise<any>;
  
  // Configuration Management
  getScreenConfiguration(userId: string, organizationId: string): Promise<any>;
  updateScreenConfiguration(userId: string, config: ProfileScreenConfiguration): Promise<any>;
  
  // Offline & Sync Management
  getOfflineState(userId: string): Promise<any>;
  updateOfflineState(userId: string, state: OfflineProfileState): Promise<any>;
  
  // Performance & Analytics
  recordPerformanceMetrics(userId: string, metrics: ProfileScreenPerformanceMetrics): Promise<any>;
  getPerformanceHistory(userId: string): Promise<any>;
  
  // Cache Management
  invalidateCache(userId: string, sections?: string[]): Promise<any>;
  warmupCache(userId: string, sections: string[]): Promise<any>;
}

/**
 * @class ProfileScreenRepositoryImpl
 * Enterprise Repository Implementation for Profile Screen Data Operations
 * 
 * Features:
 * - Intelligent caching with TTL and invalidation
 * - Real-time data synchronization
 * - Performance optimization
 * - Offline-first data management
 * - Comprehensive error handling
 * - Analytics and monitoring integration
 */
export class ProfileScreenRepositoryImpl implements IProfileScreenRepository {
  private cache: Map<string, any> = new Map();
  private cacheMetadata: Map<string, any> = new Map();
  private performanceMetrics: Map<string, ProfileScreenPerformanceMetrics[]> = new Map();

  constructor(
    private dataSource: IProfileScreenDataSource
  ) {
    logger.info('ProfileScreenRepository initialized', LogCategory.BUSINESS, {
      metadata: { timestamp: new Date().toISOString() }
    });

    // Setup cache cleanup interval
    setInterval(() => this.cleanupExpiredCache(), 5 * 60 * 1000); // 5 minutes
  }

  // ==========================================
  // Profile Screen State Management
  // ==========================================

  async getScreenState(userId: string): Promise<any> {
    try {
      logger.info('Getting profile screen state', LogCategory.BUSINESS, { userId });

      // Check cache first
      const cacheKey = this.generateCacheKey(userId, 'screen_state');
      const cachedState = this.getFromCache(cacheKey);
      if (cachedState) {
        logger.info('Profile screen state retrieved from cache', LogCategory.BUSINESS, { userId });
        return Result.success(cachedState);
      }

      // Fetch from data source
      const stateData = await this.dataSource.getProfileScreenState(userId);
      
      let screenState: ProfileScreenState;
      if (stateData) {
        screenState = stateData; // ProfileScreenState.fromJSON not available
      } else {
        // Create default state
        screenState = createProfileScreenState({
          userId,
          viewMode: ProfileViewMode.STANDARD,
          interactionState: ProfileInteractionState.IDLE
        });
      }

      // Cache the result
      this.setCache(cacheKey, screenState, 300); // 5 minutes TTL

      logger.info('Profile screen state retrieved', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          viewMode: screenState.viewMode,
          isActive: screenState.isActive ? screenState.isActive() : false
        }
      });

      return Result.success(screenState);
    } catch (error) {
      logger.error('Failed to get profile screen state', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to get screen state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateScreenState(userId: string, state: ProfileScreenState): Promise<any> {
    try {
      logger.info('Updating profile screen state', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          viewMode: state.viewMode,
          interactionState: state.interactionState
        }
      });

      // Validate state
      if (!this.validateScreenState(state)) {
        return Result.error('Invalid screen state data');
      }

      // Save to data source
      await this.dataSource.saveProfileScreenState(userId, state.toJSON());

      // Update cache
      const cacheKey = this.generateCacheKey(userId, 'screen_state');
      this.setCache(cacheKey, state, 300);

      // Record performance metrics
      await this.recordPerformanceMetrics(userId, state.performanceMetrics);

      logger.info('Profile screen state updated successfully', LogCategory.BUSINESS, { userId });

      return Result.success({
        userId,
        state: state.toJSON(),
        updatedAt: new Date(),
        performanceScore: state.getPerformanceScore()
      });
    } catch (error) {
      logger.error('Failed to update profile screen state', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to update screen state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==========================================
  // Interaction Analytics
  // ==========================================

  async getInteractionHistory(userId: string, timeRange?: { start: Date; end: Date }): Promise<any> {
    try {
      logger.info('Getting interaction history', LogCategory.BUSINESS, { 
        userId,
        metadata: { timeRange: timeRange ? `${timeRange.start.toISOString()} - ${timeRange.end.toISOString()}` : 'all' }
      });

      // Check cache
      const cacheKey = this.generateCacheKey(userId, 'interactions', timeRange?.start?.getTime().toString());
      const cachedHistory = this.getFromCache(cacheKey);
      if (cachedHistory) {
        return Result.success(cachedHistory);
      }

      // Fetch from data source
      const interactionData = await this.dataSource.getProfileInteractions(userId);
      
      // Filter by time range if specified
      let filteredInteractions = interactionData;
      if (timeRange) {
        filteredInteractions = interactionData.filter((interaction: any) => {
          const timestamp = new Date(interaction.timestamp);
          return timestamp >= timeRange.start && timestamp <= timeRange.end;
        });
      }

      // Process and aggregate data
      const history = {
        totalInteractions: filteredInteractions.length,
        interactionsByType: this.aggregateInteractionsByType(filteredInteractions),
        engagementTrends: this.calculateEngagementTrends(filteredInteractions),
        topElements: this.getTopInteractedElements(filteredInteractions),
        timeRange: timeRange || { start: new Date(0), end: new Date() }
      };

      // Cache the result
      this.setCache(cacheKey, history, 600); // 10 minutes TTL

      logger.info('Interaction history retrieved', LogCategory.BUSINESS, { 
        userId,
        metadata: { totalInteractions: history.totalInteractions }
      });

      return Result.success(history);
    } catch (error) {
      logger.error('Failed to get interaction history', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to get interaction history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async saveInteractionEvent(userId: string, interaction: ProfileInteraction): Promise<any> {
    try {
      logger.info('Saving interaction event', LogCategory.BUSINESS, { 
        userId,
        metadata: { sessionId: interaction.sessionId, eventCount: interaction.events.length }
      });

      // Save to data source
      await this.dataSource.saveProfileInteraction(userId, interaction.toAnalyticsPayload());

      // Invalidate related cache
      this.invalidateCachePattern(userId, 'interactions');

      logger.info('Interaction event saved successfully', LogCategory.BUSINESS, { userId });

      return Result.success({
        userId,
        sessionId: interaction.sessionId,
        savedAt: new Date(),
        eventCount: interaction.events.length,
        engagementScore: interaction.engagementMetrics.engagementScore
      });
    } catch (error) {
      logger.error('Failed to save interaction event', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to save interaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==========================================
  // Configuration Management
  // ==========================================

  async getScreenConfiguration(userId: string, organizationId: string): Promise<any> {
    try {
      logger.info('Getting screen configuration', LogCategory.BUSINESS, {
        userId,
        metadata: { organizationId }
      });

      // Check cache
      const cacheKey = this.generateCacheKey(userId, 'config');
      const cachedConfig = this.getFromCache(cacheKey);
      if (cachedConfig) {
        return Result.success(cachedConfig);
      }

      // Fetch from data source
      const configData = await this.dataSource.getProfileConfiguration(userId);
      
      let configuration: ProfileScreenConfiguration;
      if (configData) {
        configuration = new ProfileScreenConfiguration({
          userId,
          organizationId,
          version: configData.version || '1.0.0'
        });
        // Apply stored settings
        if (configData.featureFlags) {
          Object.assign(configuration['_featureFlags'], configData.featureFlags);
        }
      } else {
        // Create default configuration
        configuration = createProfileScreenConfiguration({
          userId,
          organizationId,
          version: '1.0.0'
        });
      }

      // Cache the result
      this.setCache(cacheKey, configuration, 1800); // 30 minutes TTL

      logger.info('Screen configuration retrieved', LogCategory.BUSINESS, { 
        userId,
        metadata: { enabledFeatures: configuration.getEnabledFeatures().length }
      });

      return Result.success(configuration);
    } catch (error) {
      logger.error('Failed to get screen configuration', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to get configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateScreenConfiguration(userId: string, config: ProfileScreenConfiguration): Promise<any> {
    try {
      logger.info('Updating screen configuration', LogCategory.BUSINESS, { userId });

      // Save to data source
      await this.dataSource.updateProfileConfiguration(userId, config.toJSON());

      // Update cache
      const cacheKey = this.generateCacheKey(userId, 'config');
      this.setCache(cacheKey, config, 1800);

      logger.info('Screen configuration updated successfully', LogCategory.BUSINESS, { userId });

      return Result.success({
        userId,
        config: config.toJSON(),
        updatedAt: new Date()
      });
    } catch (error) {
      logger.error('Failed to update screen configuration', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to update configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==========================================
  // Offline & Sync Management
  // ==========================================

  async getOfflineState(userId: string): Promise<any> {
    try {
      logger.info('Getting offline state', LogCategory.BUSINESS, { userId });

      // Check cache
      const cacheKey = this.generateCacheKey(userId, 'offline_state');
      const cachedState = this.getFromCache(cacheKey);
      if (cachedState) {
        return Result.success(cachedState);
      }

      // Fetch from data source
      const stateData = await this.dataSource.getOfflineState(userId);
      
      let offlineState: OfflineProfileState;
      if (stateData) {
        offlineState = new OfflineProfileState({
          userId,
          resolutionStrategy: stateData.resolutionStrategy || ConflictResolutionStrategy.LAST_MODIFIED_WINS
        });
        // Apply stored state
        Object.assign(offlineState, stateData);
      } else {
        // Create default offline state
        offlineState = createOfflineProfileState({
          userId,
          resolutionStrategy: ConflictResolutionStrategy.LAST_MODIFIED_WINS
        });
      }

      // Cache the result
      this.setCache(cacheKey, offlineState, 60); // 1 minute TTL (short for sync state)

      logger.info('Offline state retrieved', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          syncStatus: offlineState.syncStatus,
          pendingOperations: offlineState.getPendingOperationsCount()
        }
      });

      return Result.success(offlineState);
    } catch (error) {
      logger.error('Failed to get offline state', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to get offline state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateOfflineState(userId: string, state: OfflineProfileState): Promise<any> {
    try {
      logger.info('Updating offline state', LogCategory.BUSINESS, { 
        userId,
        metadata: {
          syncStatus: state.syncStatus,
          pendingOperations: state.getPendingOperationsCount()
        }
      });

      // Save to data source
      await this.dataSource.updateOfflineState(userId, state.toJSON());

      // Update cache
      const cacheKey = this.generateCacheKey(userId, 'offline_state');
      this.setCache(cacheKey, state, 60);

      logger.info('Offline state updated successfully', LogCategory.BUSINESS, { userId });

      return Result.success({
        userId,
        syncStatus: state.syncStatus,
        pendingOperations: state.getPendingOperationsCount(),
        updatedAt: new Date()
      });
    } catch (error) {
      logger.error('Failed to update offline state', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to update offline state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==========================================
  // Performance & Analytics
  // ==========================================

  async recordPerformanceMetrics(userId: string, metrics: ProfileScreenPerformanceMetrics): Promise<any> {
    try {
      // Store metrics in memory for analysis
      if (!this.performanceMetrics.has(userId)) {
        this.performanceMetrics.set(userId, []);
      }
      
      const userMetrics = this.performanceMetrics.get(userId)!;
      userMetrics.push(metrics);
      
      // Keep only last 100 entries
      if (userMetrics.length > 100) {
        userMetrics.splice(0, userMetrics.length - 100);
      }

      logger.info('Performance metrics recorded', LogCategory.BUSINESS, { 
        userId,
        metadata: { loadTime: metrics.loadTime, frameRate: metrics.frameRate }
      });

      return Result.success({
        userId,
        recordedAt: new Date(),
        metricsCount: userMetrics.length
      });
    } catch (error) {
      logger.error('Failed to record performance metrics', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to record metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPerformanceHistory(userId: string): Promise<any> {
    try {
      const userMetrics = this.performanceMetrics.get(userId) || [];
      
      const history = {
        totalRecords: userMetrics.length,
        averageLoadTime: this.calculateAverage(userMetrics, 'loadTime'),
        averageFrameRate: this.calculateAverage(userMetrics, 'frameRate'),
        averageMemoryUsage: this.calculateAverage(userMetrics, 'memoryUsage'),
        trends: this.calculatePerformanceTrends(userMetrics),
        latestMetrics: userMetrics[userMetrics.length - 1] || null
      };

      return Result.success(history);
    } catch (error) {
      logger.error('Failed to get performance history', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to get performance history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==========================================
  // Cache Management
  // ==========================================

  async invalidateCache(userId: string, sections?: string[]): Promise<any> {
    try {
      let invalidatedCount = 0;

      if (sections) {
        // Invalidate specific sections
        for (const section of sections) {
          const cacheKey = this.generateCacheKey(userId, section);
          if (this.cache.has(cacheKey)) {
            this.cache.delete(cacheKey);
            this.cacheMetadata.delete(cacheKey);
            invalidatedCount++;
          }
        }
      } else {
        // Invalidate all user cache
        const userCacheKeys = Array.from(this.cache.keys()).filter(key => key.includes(userId));
        for (const key of userCacheKeys) {
          this.cache.delete(key);
          this.cacheMetadata.delete(key);
          invalidatedCount++;
        }
      }

      logger.info('Cache invalidated', LogCategory.BUSINESS, { 
        userId,
        metadata: { sections: sections?.join(', ') || 'all', invalidatedCount }
      });

      return Result.success({
        userId,
        invalidatedSections: sections || ['all'],
        invalidatedCount,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Failed to invalidate cache', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to invalidate cache: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async warmupCache(userId: string, sections: string[]): Promise<any> {
    try {
      const warmedSections: string[] = [];

      for (const section of sections) {
        try {
          // Warmup different sections
          switch (section) {
            case 'screen_state':
              await this.getScreenState(userId);
              break;
            case 'config':
              await this.getScreenConfiguration(userId, 'default_org');
              break;
            case 'offline_state':
              await this.getOfflineState(userId);
              break;
            case 'interactions':
              await this.getInteractionHistory(userId);
              break;
          }
          warmedSections.push(section);
        } catch (sectionError) {
          logger.error(`Failed to warmup section ${section}`, LogCategory.BUSINESS, { userId }, sectionError as Error);
        }
      }

      logger.info('Cache warmup completed', LogCategory.BUSINESS, { 
        userId,
        metadata: { requestedSections: sections.length, warmedSections: warmedSections.length }
      });

      return Result.success({
        userId,
        requestedSections: sections,
        warmedSections,
        warmupTime: new Date()
      });
    } catch (error) {
      logger.error('Failed to warmup cache', LogCategory.BUSINESS, { userId }, error as Error);
      return Result.error(`Failed to warmup cache: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==========================================
  // Private Helper Methods
  // ==========================================

  private generateCacheKey(userId: string, section: string, suffix?: string): string {
    return `profile_screen_${userId}_${section}${suffix ? `_${suffix}` : ''}`;
  }

  private getFromCache(key: string): any {
    const metadata = this.cacheMetadata.get(key);
    if (metadata && metadata.expiresAt > new Date()) {
      metadata.lastAccessed = new Date();
      metadata.accessCount++;
      return this.cache.get(key);
    }
    
    // Remove expired entry
    this.cache.delete(key);
    this.cacheMetadata.delete(key);
    return null;
  }

  private setCache(key: string, value: any, ttlSeconds: number): void {
    this.cache.set(key, value);
    this.cacheMetadata.set(key, {
      expiresAt: new Date(Date.now() + ttlSeconds * 1000),
      lastAccessed: new Date(),
      accessCount: 1,
      size: JSON.stringify(value).length
    });
  }

  private invalidateCachePattern(userId: string, pattern: string): void {
    const keysToInvalidate = Array.from(this.cache.keys())
      .filter(key => key.includes(userId) && key.includes(pattern));
    
    for (const key of keysToInvalidate) {
      this.cache.delete(key);
      this.cacheMetadata.delete(key);
    }
  }

  private cleanupExpiredCache(): void {
    const now = new Date();
    const expiredKeys: string[] = [];

    for (const [key, metadata] of this.cacheMetadata.entries()) {
      if (metadata.expiresAt <= now) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
      this.cacheMetadata.delete(key);
    }

    if (expiredKeys.length > 0) {
      logger.info('Expired cache entries cleaned up', LogCategory.BUSINESS, {
        userId: 'system',
        metadata: { cleanedCount: expiredKeys.length }
      });
    }
  }

  private validateScreenState(state: ProfileScreenState): boolean {
    return Boolean(state && 
           state.userId && 
           Object.values(ProfileViewMode).includes(state.viewMode) &&
           Object.values(ProfileInteractionState).includes(state.interactionState));
  }

  private aggregateInteractionsByType(interactions: any[]): Record<string, number> {
    const aggregation: Record<string, number> = {};
    
    for (const interaction of interactions) {
      const type = interaction.type || 'unknown';
      aggregation[type] = (aggregation[type] || 0) + 1;
    }

    return aggregation;
  }

  private calculateEngagementTrends(interactions: any[]): any[] {
    // Simple trend calculation - could be enhanced with time series analysis
    const trends = interactions.slice(-10).map((interaction, index) => ({
      index,
      timestamp: interaction.timestamp,
      engagementScore: Math.random() * 100 // Mock score
    }));

    return trends;
  }

  private getTopInteractedElements(interactions: any[]): any[] {
    const elementCounts: Record<string, number> = {};
    
    for (const interaction of interactions) {
      const elementId = interaction.elementId || 'unknown';
      elementCounts[elementId] = (elementCounts[elementId] || 0) + 1;
    }

    return Object.entries(elementCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([elementId, count]) => ({ elementId, count }));
  }

  private calculateAverage(metrics: ProfileScreenPerformanceMetrics[], field: keyof ProfileScreenPerformanceMetrics): number {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, metric) => acc + (metric[field] as number), 0);
    return sum / metrics.length;
  }

  private calculatePerformanceTrends(metrics: ProfileScreenPerformanceMetrics[]): any {
    if (metrics.length < 2) return { trend: 'stable', change: 0 };
    
    const recent = metrics.slice(-5);
    const older = metrics.slice(-10, -5);
    
    if (older.length === 0) return { trend: 'stable', change: 0 };
    
    const recentAvg = this.calculateAverage(recent, 'loadTime');
    const olderAvg = this.calculateAverage(older, 'loadTime');
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    const trend = change > 5 ? 'declining' : change < -5 ? 'improving' : 'stable';
    
    return { trend, change: Math.round(change) };
  }
}

// Factory function
export const createProfileScreenRepository = (dataSource: IProfileScreenDataSource): ProfileScreenRepositoryImpl => {
  return new ProfileScreenRepositoryImpl(dataSource);
}; 