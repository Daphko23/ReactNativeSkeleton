/**
 * ManageProfileCacheUseCase - Enterprise Cache Management
 * 🚀 ENTERPRISE: Intelligent Caching, Cache Invalidation, Offline Data Management
 * ✅ APPLICATION LAYER: Business Logic für Profile Cache Operations
 */

import { Result } from '../../../../../core/types/result.type';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('ManageProfileCacheUseCase');

/**
 * @interface CacheManagementRequest - Input for cache operations
 */
export interface CacheManagementRequest {
  userId: string;
  operation: 'set' | 'get' | 'invalidate' | 'warm' | 'cleanup';
  cacheKey?: string;
  data?: any;
  ttl?: number; // seconds
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * @interface CacheManagementResponse - Result of cache operations
 */
export interface CacheManagementResponse {
  success: boolean;
  cacheKey: string;
  operation: string;
  cacheSize: number; // bytes
  hitRate: number; // 0-1
  metadata: {
    expiresAt?: Date;
    lastAccessed: Date;
    accessCount: number;
    compressionRatio?: number;
  };
}

/**
 * @interface CacheWarmupRequest - Input for cache warming
 */
export interface CacheWarmupRequest {
  userId: string;
  profileSections: string[];
  priorityOrder: string[];
  deviceCapabilities: {
    availableMemory: number;
    connectionType: 'wifi' | 'cellular' | 'offline';
    batteryLevel: number;
  };
}

/**
 * @interface CacheAnalyticsResponse - Cache performance analytics
 */
export interface CacheAnalyticsResponse {
  overall: {
    hitRate: number;
    missRate: number;
    totalSize: number;
    entryCount: number;
    averageAccessTime: number;
  };
  sections: Record<string, {
    hitRate: number;
    accessFrequency: number;
    averageSize: number;
    lastUpdated: Date;
  }>;
  recommendations: string[];
  optimizations: {
    suggestedEvictions: string[];
    preloadCandidates: string[];
    compressionOpportunities: string[];
  };
}

/**
 * @class ManageProfileCacheUseCase
 * Enterprise Use Case for Profile Cache Management
 * 
 * Handles:
 * - Intelligent cache strategies
 * - Cache warming and preloading
 * - Cache invalidation policies
 * - Offline data management
 * - Cache analytics and optimization
 * - Memory-efficient storage
 */
export class ManageProfileCacheUseCase {
  private cacheStore: Map<string, any> = new Map();
  private cacheMetadata: Map<string, any> = new Map();
  private accessStats: Map<string, any> = new Map();

  constructor() {
    logger.info('ManageProfileCacheUseCase initialized', LogCategory.BUSINESS);
  }

  /**
   * Manages cache operations (get, set, invalidate, etc.)
   */
  async manageCache(request: CacheManagementRequest): Promise<Result<CacheManagementResponse, string>> {
    try {
      logger.info('Managing cache operation', LogCategory.BUSINESS, {
        userId: request.userId,
        operation: request.operation,
        cacheKey: request.cacheKey
      });

      let result: CacheManagementResponse;

      switch (request.operation) {
        case 'set':
          result = await this.setCacheData(request);
          break;
        case 'get':
          result = await this.getCacheData(request);
          break;
        case 'invalidate':
          result = await this.invalidateCache(request);
          break;
        case 'warm':
          result = await this.warmCache(request);
          break;
        case 'cleanup':
          result = await this.cleanupCache(request);
          break;
        default:
          return Result.failure(`Unsupported cache operation: ${request.operation}`);
      }

      logger.info('Cache operation completed', LogCategory.BUSINESS, {
        userId: request.userId,
        operation: request.operation,
        success: result.success
      });

      return Result.success(result);
    } catch (error) {
      logger.error('Failed to manage cache', LogCategory.BUSINESS, 
        { userId: request.userId }, error as Error);
      return Result.failure(`Cache management failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Warms up cache with predicted user needs
   */
  async warmupCache(request: CacheWarmupRequest): Promise<Result<CacheAnalyticsResponse, string>> {
    try {
      logger.info('Starting cache warmup', LogCategory.BUSINESS, {
        userId: request.userId,
        sections: request.profileSections.length,
        connectionType: request.deviceCapabilities.connectionType
      });

      // Prioritize sections based on device capabilities
      const prioritizedSections = this.prioritizeCacheWarmup(request);
      
      // Warm up cache for each section
      const warmupResults: any[] = [];
      for (const section of prioritizedSections) {
        const warmupResult = await this.warmupSection(request.userId, section, request.deviceCapabilities);
        warmupResults.push(warmupResult);
      }

      // Generate analytics after warmup
      const analytics = await this.generateCacheAnalytics(request.userId);

      logger.info('Cache warmup completed', LogCategory.BUSINESS, {
        userId: request.userId,
        sectionsWarmed: warmupResults.length,
        totalCacheSize: analytics.overall.totalSize
      });

      return Result.success(analytics);
    } catch (error) {
      logger.error('Failed to warmup cache', LogCategory.BUSINESS, 
        { userId: request.userId }, error as Error);
      return Result.failure(`Cache warmup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates comprehensive cache analytics
   */
  async getCacheAnalytics(userId: string): Promise<Result<CacheAnalyticsResponse, string>> {
    try {
      logger.info('Generating cache analytics', LogCategory.BUSINESS, { userId });

      const analytics = await this.generateCacheAnalytics(userId);

      logger.info('Cache analytics generated', LogCategory.BUSINESS, {
        userId,
        hitRate: analytics.overall.hitRate,
        totalSize: analytics.overall.totalSize
      });

      return Result.success(analytics);
    } catch (error) {
      logger.error('Failed to generate cache analytics', LogCategory.BUSINESS, 
        { userId }, error as Error);
      return Result.failure(`Cache analytics failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods
  private async setCacheData(request: CacheManagementRequest): Promise<CacheManagementResponse> {
    const cacheKey = request.cacheKey || this.generateCacheKey(request.userId, 'default');
    const ttl = request.ttl || 3600; // 1 hour default
    const expiresAt = new Date(Date.now() + ttl * 1000);

    // Store data
    this.cacheStore.set(cacheKey, request.data);
    
    // Store metadata
    this.cacheMetadata.set(cacheKey, {
      expiresAt,
      lastAccessed: new Date(),
      accessCount: 1,
      priority: request.priority || 'medium',
      dataSize: this.calculateDataSize(request.data)
    });

    // Update access stats
    this.updateAccessStats(cacheKey, 'set');

    return {
      success: true,
      cacheKey,
      operation: 'set',
      cacheSize: this.calculateDataSize(request.data),
      hitRate: this.calculateHitRate(),
      metadata: {
        expiresAt,
        lastAccessed: new Date(),
        accessCount: 1
      }
    };
  }

  private async getCacheData(request: CacheManagementRequest): Promise<CacheManagementResponse> {
    const cacheKey = request.cacheKey || this.generateCacheKey(request.userId, 'default');
    
    // Check if data exists and is valid
    if (!this.cacheStore.has(cacheKey)) {
      this.updateAccessStats(cacheKey, 'miss');
      throw new Error('Cache miss');
    }

    const metadata = this.cacheMetadata.get(cacheKey);
    if (metadata && metadata.expiresAt < new Date()) {
      // Data expired
      this.cacheStore.delete(cacheKey);
      this.cacheMetadata.delete(cacheKey);
      this.updateAccessStats(cacheKey, 'miss');
      throw new Error('Cache expired');
    }

    // Update access metadata
    if (metadata) {
      metadata.lastAccessed = new Date();
      metadata.accessCount++;
      this.cacheMetadata.set(cacheKey, metadata);
    }

    this.updateAccessStats(cacheKey, 'hit');

    return {
      success: true,
      cacheKey,
      operation: 'get',
      cacheSize: metadata?.dataSize || 0,
      hitRate: this.calculateHitRate(),
      metadata: {
        expiresAt: metadata?.expiresAt,
        lastAccessed: new Date(),
        accessCount: metadata?.accessCount || 1
      }
    };
  }

  private async invalidateCache(request: CacheManagementRequest): Promise<CacheManagementResponse> {
    const cacheKey = request.cacheKey || this.generateCacheKey(request.userId, 'default');
    
    let success = false;
    let cacheSize = 0;

    if (this.cacheStore.has(cacheKey)) {
      const metadata = this.cacheMetadata.get(cacheKey);
      cacheSize = metadata?.dataSize || 0;
      
      this.cacheStore.delete(cacheKey);
      this.cacheMetadata.delete(cacheKey);
      this.accessStats.delete(cacheKey);
      success = true;
    }

    return {
      success,
      cacheKey,
      operation: 'invalidate',
      cacheSize,
      hitRate: this.calculateHitRate(),
      metadata: {
        lastAccessed: new Date(),
        accessCount: 0
      }
    };
  }

  private async warmCache(request: CacheManagementRequest): Promise<CacheManagementResponse> {
    // Mock warm cache operation
    const cacheKey = this.generateCacheKey(request.userId, 'warmup');
    
    // Simulate loading common profile data
    const warmupData = {
      profile: { id: request.userId, warmedAt: new Date() },
      avatar: { url: 'cached_avatar.jpg' },
      customFields: [],
      settings: {}
    };

    return await this.setCacheData({
      ...request,
      cacheKey,
      data: warmupData,
      ttl: 7200 // 2 hours
    });
  }

  private async cleanupCache(request: CacheManagementRequest): Promise<CacheManagementResponse> {
    let cleanedCount = 0;
    let freedBytes = 0;

    // Remove expired entries
    for (const [key, metadata] of this.cacheMetadata.entries()) {
      if (metadata.expiresAt < new Date()) {
        freedBytes += metadata.dataSize || 0;
        this.cacheStore.delete(key);
        this.cacheMetadata.delete(key);
        this.accessStats.delete(key);
        cleanedCount++;
      }
    }

    // If still over memory limit, remove LRU entries
    const memoryLimit = 50 * 1024 * 1024; // 50MB
    const currentSize = this.calculateTotalCacheSize();
    
    if (currentSize > memoryLimit) {
      const lruKeys = this.getLRUKeys(Math.ceil((currentSize - memoryLimit) / 1024));
      for (const key of lruKeys) {
        const metadata = this.cacheMetadata.get(key);
        freedBytes += metadata?.dataSize || 0;
        this.cacheStore.delete(key);
        this.cacheMetadata.delete(key);
        this.accessStats.delete(key);
        cleanedCount++;
      }
    }

    return {
      success: true,
      cacheKey: 'cleanup',
      operation: 'cleanup',
      cacheSize: freedBytes,
      hitRate: this.calculateHitRate(),
      metadata: {
        lastAccessed: new Date(),
        accessCount: cleanedCount
      }
    };
  }

  private prioritizeCacheWarmup(request: CacheWarmupRequest): string[] {
    const { profileSections, priorityOrder, deviceCapabilities } = request;
    
    // Filter sections based on device capabilities
    let sectionsToWarm = [...profileSections];
    
    if (deviceCapabilities.availableMemory < 50 * 1024 * 1024) { // < 50MB
      sectionsToWarm = sectionsToWarm.slice(0, 3); // Limit to 3 sections
    }

    if (deviceCapabilities.connectionType === 'cellular') {
      // Prioritize lightweight sections
      sectionsToWarm = sectionsToWarm.filter(s => 
        !['analytics', 'detailed_settings'].includes(s)
      );
    }

    // Sort by priority order
    return sectionsToWarm.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a);
      const bIndex = priorityOrder.indexOf(b);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
  }

  private async warmupSection(userId: string, section: string, capabilities: any): Promise<any> {
    // Simulate section-specific warmup
    const sectionData = this.generateSectionData(section);
    const cacheKey = this.generateCacheKey(userId, section);
    
    await this.setCacheData({
      userId,
      operation: 'set',
      cacheKey,
      data: sectionData,
      ttl: 3600,
      priority: 'high'
    });

    return { section, warmedAt: new Date(), size: this.calculateDataSize(sectionData) };
  }

  private generateSectionData(section: string): any {
    // Mock data for different sections
    const mockData: Record<string, any> = {
      avatar: { url: 'avatar.jpg', size: '150x150' },
      custom_fields: [{ key: 'bio', value: 'Sample bio' }],
      settings: { theme: 'auto', notifications: true },
      analytics: { views: 100, edits: 5 }
    };

    return mockData[section] || { data: `mock_${section}` };
  }

  private async generateCacheAnalytics(userId: string): Promise<CacheAnalyticsResponse> {
    const overall = {
      hitRate: this.calculateHitRate(),
      missRate: 1 - this.calculateHitRate(),
      totalSize: this.calculateTotalCacheSize(),
      entryCount: this.cacheStore.size,
      averageAccessTime: 50 // ms
    };

    const sections: Record<string, any> = {};
    
    // Analyze each cached section
    for (const [key, metadata] of this.cacheMetadata.entries()) {
      const section = this.extractSectionFromKey(key);
      if (!sections[section]) {
        sections[section] = {
          hitRate: 0.85,
          accessFrequency: metadata.accessCount,
          averageSize: metadata.dataSize,
          lastUpdated: metadata.lastAccessed
        };
      }
    }

    const recommendations = this.generateCacheRecommendations(overall, sections);
    const optimizations = this.generateCacheOptimizations();

    return {
      overall,
      sections,
      recommendations,
      optimizations
    };
  }

  private generateCacheRecommendations(overall: any, sections: any): string[] {
    const recommendations: string[] = [];

    if (overall.hitRate < 0.7) {
      recommendations.push('Consider increasing cache TTL for frequently accessed data');
    }

    if (overall.totalSize > 40 * 1024 * 1024) { // > 40MB
      recommendations.push('Cache size is high, consider implementing more aggressive cleanup');
    }

    if (Object.keys(sections).length > 10) {
      recommendations.push('Too many cached sections, consider section prioritization');
    }

    return recommendations;
  }

  private generateCacheOptimizations(): CacheAnalyticsResponse['optimizations'] {
    return {
      suggestedEvictions: this.getLRUKeys(5),
      preloadCandidates: ['avatar', 'custom_fields'],
      compressionOpportunities: ['analytics', 'large_images']
    };
  }

  // Utility methods
  private generateCacheKey(userId: string, section: string): string {
    return `profile_${userId}_${section}`;
  }

  private calculateDataSize(data: any): number {
    return JSON.stringify(data).length * 2; // Rough estimate
  }

  private calculateHitRate(): number {
    let totalHits = 0;
    let totalRequests = 0;

    for (const stats of this.accessStats.values()) {
      totalHits += stats.hits || 0;
      totalRequests += (stats.hits || 0) + (stats.misses || 0);
    }

    return totalRequests > 0 ? totalHits / totalRequests : 0;
  }

  private calculateTotalCacheSize(): number {
    let totalSize = 0;
    for (const metadata of this.cacheMetadata.values()) {
      totalSize += metadata.dataSize || 0;
    }
    return totalSize;
  }

  private updateAccessStats(cacheKey: string, operation: 'hit' | 'miss' | 'set'): void {
    if (!this.accessStats.has(cacheKey)) {
      this.accessStats.set(cacheKey, { hits: 0, misses: 0, sets: 0 });
    }

    const stats = this.accessStats.get(cacheKey);
    if (operation === 'hit') stats.hits++;
    else if (operation === 'miss') stats.misses++;
    else if (operation === 'set') stats.sets++;
  }

  private getLRUKeys(count: number): string[] {
    const entries = Array.from(this.cacheMetadata.entries())
      .sort(([, a], [, b]) => a.lastAccessed.getTime() - b.lastAccessed.getTime())
      .slice(0, count);
    
    return entries.map(([key]) => key);
  }

  private extractSectionFromKey(key: string): string {
    const parts = key.split('_');
    return parts[parts.length - 1] || 'unknown';
  }
}

// Factory function
export const createManageProfileCacheUseCase = (): ManageProfileCacheUseCase => {
  return new ManageProfileCacheUseCase();
}; 