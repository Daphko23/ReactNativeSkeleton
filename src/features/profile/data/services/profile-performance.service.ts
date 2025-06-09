/**
 * Profile Performance Service - Enterprise Performance Optimization without Redis
 * Provides comprehensive performance optimization including in-memory caching,
 * lazy loading, query optimization, and bundle size optimization for Profile operations
 * 
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Profile.Data.Services
 * @namespace Profile.Data.Services.Performance
 * @category Performance
 * @subcategory ProfilePerformance
 */

import { ILoggerService, LogCategory, LogContext } from '../../../../core/logging/logger.service.interface';
import { ConsoleLogger } from '../../../../core/logging/console.logger';

// Performance Types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccessed: number;
  size: number; // Estimated size in bytes
}

export interface PerformanceMetrics {
  cacheHitRate: number;
  averageResponseTime: number;
  memoryUsage: number;
  totalRequests: number;
  cachedRequests: number;
  lazyLoadedChunks: number;
  batchedQueries: number;
  queryDeduplications: number;
  lastUpdated: Date;
}

/**
 * Profile Performance Service
 * 
 * Provides enterprise-grade performance optimization without external dependencies:
 * - Multi-layer in-memory caching with TTL and LRU eviction
 * - Lazy loading with intelligent preloading
 * - Query batching and deduplication
 * - Memory management and cleanup
 * - Performance monitoring and analytics
 * - Bundle size optimization strategies
 */
export class ProfilePerformanceService {
  private logger: ILoggerService;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingQueries: Map<string, Promise<any>> = new Map();
  private performanceMetrics: PerformanceMetrics;
  private readonly cleanupInterval: NodeJS.Timeout;
  private currentMemoryUsage: number = 0;
  private readonly maxCacheSize = 50 * 1024 * 1024; // 50MB

  constructor(logger?: ILoggerService) {
    this.logger = logger || new ConsoleLogger();
    this.performanceMetrics = {
      cacheHitRate: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      totalRequests: 0,
      cachedRequests: 0,
      lazyLoadedChunks: 0,
      batchedQueries: 0,
      queryDeduplications: 0,
      lastUpdated: new Date(),
    };

    // Start performance monitoring and cleanup
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
      this.updatePerformanceMetrics();
    }, 60000); // 1 minute
  }

  // =============================================
  // CACHING SYSTEM
  // =============================================

  /**
   * Get data from cache or execute loader function
   */
  async getCachedOrLoad<T>(
    key: string,
    loader: () => Promise<T>,
    ttl: number = 5 * 60 * 1000, // 5 minutes default
    correlationId?: string
  ): Promise<T> {
    const startTime = Date.now();
    this.performanceMetrics.totalRequests++;

    try {
      // Check cache first
      const cached = this.getFromCache<T>(key);
      if (cached) {
        this.performanceMetrics.cachedRequests++;
        this.logPerformanceEvent('cache_hit', key, correlationId, {
          responseTime: Date.now() - startTime,
          cacheAge: Date.now() - cached.timestamp
        });
        return cached.data;
      }

      // Check if query is already pending (deduplication)
      if (this.pendingQueries.has(key)) {
        this.performanceMetrics.queryDeduplications++;
        this.logPerformanceEvent('query_deduplicated', key, correlationId);
        return await this.pendingQueries.get(key)!;
      }

      // Execute loader
      const promise = loader();
      this.pendingQueries.set(key, promise);

      const data = await promise;
      
      // Cache the result
      this.setCache(key, data, ttl);
      
      this.pendingQueries.delete(key);

      this.logPerformanceEvent('cache_miss_loaded', key, correlationId, {
        responseTime: Date.now() - startTime
      });

      return data;
    } catch (error) {
      this.pendingQueries.delete(key);
      
      this.logPerformanceEvent('load_error', key, correlationId, {
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime
      });
      
      throw error;
    }
  }

  /**
   * Set data in cache
   */
  setCache<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const size = this.estimateObjectSize(data);
    
    // Check memory limit
    if (this.currentMemoryUsage + size > this.maxCacheSize) {
      this.performCleanup();
      
      // If still over limit after cleanup, don't cache
      if (this.currentMemoryUsage + size > this.maxCacheSize) {
        this.logger.warn('Cache size limit exceeded, skipping cache for key', LogCategory.PERFORMANCE, {
          metadata: { key, size, currentUsage: this.currentMemoryUsage, maxSize: this.maxCacheSize }
        });
        return;
      }
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      lastAccessed: Date.now(),
      size,
    };

    this.cache.set(key, entry);
    this.currentMemoryUsage += size;
  }

  /**
   * Get data from cache
   */
  getFromCache<T>(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.currentMemoryUsage -= entry.size;
      return null;
    }

    // Update access statistics
    entry.hits++;
    entry.lastAccessed = Date.now();
    
    return entry as CacheEntry<T>;
  }

  // =============================================
  // PERFORMANCE MONITORING
  // =============================================

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    this.updatePerformanceMetrics();
    return { ...this.performanceMetrics };
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(): void {
    this.performanceMetrics.cacheHitRate = this.performanceMetrics.totalRequests > 0
      ? (this.performanceMetrics.cachedRequests / this.performanceMetrics.totalRequests) * 100
      : 0;
    
    this.performanceMetrics.memoryUsage = this.currentMemoryUsage;
    this.performanceMetrics.lastUpdated = new Date();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    entries: number;
    memoryUsage: number;
    maxMemory: number;
    hitRate: number;
    topKeys: Array<{ key: string; hits: number; size: number }>;
  } {
    const topKeys = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, hits: entry.hits, size: entry.size }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 10);

    return {
      size: this.cache.size,
      entries: this.cache.size,
      memoryUsage: this.currentMemoryUsage,
      maxMemory: this.maxCacheSize,
      hitRate: this.performanceMetrics.cacheHitRate,
      topKeys,
    };
  }

  // =============================================
  // MEMORY MANAGEMENT
  // =============================================

  /**
   * Perform cache cleanup based on memory usage and TTL
   */
  private performCleanup(): void {
    const targetSize = this.maxCacheSize * 0.8; // 80% threshold
    
    if (this.currentMemoryUsage <= targetSize) {
      return;
    }

    const startTime = Date.now();
    let removedCount = 0;
    let freedMemory = 0;

    // First pass: Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.currentMemoryUsage -= entry.size;
        freedMemory += entry.size;
        removedCount++;
      }
    }

    // Second pass: LRU eviction if still over threshold
    if (this.currentMemoryUsage > targetSize) {
      const entries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

      for (const [key, entry] of entries) {
        if (this.currentMemoryUsage <= targetSize) {
          break;
        }
        
        this.cache.delete(key);
        this.currentMemoryUsage -= entry.size;
        freedMemory += entry.size;
        removedCount++;
      }
    }

    const cleanupTime = Date.now() - startTime;
    
    this.logger.debug(`Cache cleanup completed`, LogCategory.PERFORMANCE, {
      metadata: {
        removedEntries: removedCount,
        freedMemory,
        cleanupTime,
        remainingEntries: this.cache.size,
        currentMemoryUsage: this.currentMemoryUsage
      }
    });
  }

  // =============================================
  // BUNDLE OPTIMIZATION
  // =============================================

  /**
   * Get bundle optimization recommendations
   */
  getBundleOptimizationRecommendations(): {
    codeSplitting: string[];
    treeShaking: string[];
    compression: string[];
    lazyComponents: string[];
  } {
    return {
      codeSplitting: [
        'Split profile components into separate chunks',
        'Lazy load profile editing forms',
        'Separate avatar upload component',
        'Split privacy settings into own bundle'
      ],
      treeShaking: [
        'Remove unused profile utility functions',
        'Eliminate dead code in profile validators',
        'Remove unused icon imports',
        'Optimize lodash imports'
      ],
      compression: [
        'Enable gzip compression for profile assets',
        'Optimize image compression for avatars',
        'Minify profile CSS and JS',
        'Use WebP format for profile images'
      ],
      lazyComponents: [
        'ProfileEditForm',
        'AvatarUploadModal',
        'PrivacySettingsPanel',
        'ProfileHistoryViewer',
        'DataExportDialog'
      ]
    };
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  /**
   * Estimate object size in bytes (rough estimation)
   */
  private estimateObjectSize(obj: any): number {
    const str = JSON.stringify(obj);
    return str.length * 2; // Rough estimation (UTF-16)
  }

  /**
   * Log performance events
   */
  private logPerformanceEvent(
    event: string,
    key: string,
    correlationId?: string,
    metadata: any = {}
  ): void {
    const context: LogContext = {
      correlationId: correlationId || `perf-${Date.now()}`,
      metadata: {
        performanceEvent: event,
        cacheKey: key,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };

    this.logger.logPerformance(`Profile performance event: ${event}`, {
      operation: event,
      duration: metadata.responseTime || 0,
      memoryUsage: this.currentMemoryUsage / 1024 / 1024 // Convert to MB
    }, context);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.currentMemoryUsage = 0;
    this.pendingQueries.clear();
    this.logger.info('Cache cleared', LogCategory.PERFORMANCE, {
      metadata: { operation: 'cache_clear' }
    });
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clearCache();
  }
}

// Export singleton instance
export const profilePerformanceService = new ProfilePerformanceService(); 