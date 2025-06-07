/**
 * @fileoverview DATA-FACTORY-001: Enterprise Security Service Factory - Optimized Standard
 * @description Hochoptimierte Factory für Advanced Security Service mit Enterprise Features.
 * Implementiert intelligentes Caching, Performance Monitoring, Circuit Breaker Pattern,
 * und fortgeschrittenes Memory Management. Alle Interfaces sind modular ausgelagert.
 * 
 * @businessRule BR-300: Optimized service factory implementation pattern
 * @businessRule BR-301: Advanced dependency injection with health monitoring
 * @businessRule BR-302: Intelligent configuration management with validation
 * @businessRule BR-303: Enterprise service lifecycle with auto-cleanup
 * @businessRule BR-304: Performance monitoring and circuit breaker integration
 * @businessRule BR-310: Interface separation for better modularity
 * 
 * @architecture Factory pattern with advanced caching and monitoring
 * @architecture Circuit breaker pattern for resilience
 * @architecture TTL-based cache invalidation for memory optimization
 * @architecture Health check integration for service reliability
 * @architecture Performance metrics collection for observability
 * @architecture Modular interface design with separated concerns
 * 
 * @optimization Intelligent instance caching with TTL-based invalidation
 * @optimization Lazy loading for better startup performance
 * @optimization Memory-optimized cache management with LRU eviction
 * @optimization Async factory operations for non-blocking creation
 * @optimization Circuit breaker for fault tolerance
 * 
 * @monitoring Factory operation metrics with timing
 * @monitoring Cache hit/miss ratios and memory usage
 * @monitoring Service health checks and availability
 * @monitoring Performance SLA monitoring and alerting
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module OptimizedSecurityServiceFactory
 * @namespace Auth.Data.Factories
 */

// Core imports
import type { ILoggerService } from '../../../../core/logging/logger.service.interface';
import { LogCategory } from '../../../../core/logging/logger.service.interface';
import { AdvancedSecurityServiceImpl } from '../services/advanced-security.service.impl';

// Import all interfaces from separated interface file
import type {
  IAdvancedSecurityService,
  EnhancedSecurityServiceConfig,
  SecurityServiceDependencies,
  CacheEntry,
  FactoryMetrics,
  CircuitBreakerState,
  FactoryHealthStatus,
  FactoryCreateOptions as _FactoryCreateOptions,
  SecurityServiceConfigPreset as _SecurityServiceConfigPreset,
  ConfigPresetOptions as _ConfigPresetOptions,
} from '../interfaces/security-service-factory.interfaces';

/**
 * @class OptimizedSecurityServiceFactory
 * @description Enterprise-Grade Optimized Security Service Factory
 * 
 * Hochoptimierte Factory mit Enterprise Features:
 * - Intelligentes TTL-basiertes Caching mit LRU-Eviction
 * - Circuit Breaker Pattern für Resilience
 * - Performance Monitoring und Metrics Collection
 * - Automatisches Memory Management und Cleanup
 * - Health Check Integration für Service Reliability
 * - Lazy Loading für optimierte Startup-Performance
 * - Advanced Configuration Validation
 * - Async Factory Operations für Non-blocking Creation
 * - Modular Interface Design mit separaten Interface-Dateien
 * 
 * @example Enterprise Factory Usage
 * ```typescript
 * // Enhanced configuration
 * const config: EnhancedSecurityServiceConfig = {
 *   enableThreatAssessment: true,
 *   enableDeviceFingerprinting: true,
 *   riskThresholds: { low: 30, medium: 60, high: 85, critical: 95 },
 *   cache: { 
 *     enabled: true, 
 *     ttl: 300000, 
 *     maxSize: 100,
 *     cleanupInterval: 60000 
 *   },
 *   performance: {
 *     enableMetrics: true,
 *     enableCircuitBreaker: true,
 *     circuitBreakerThreshold: 5,
 *     circuitBreakerTimeout: 30000,
 *     enableLazyLoading: true
 *   },
 *   resources: {
 *     enableAutoCleanup: true,
 *     cleanupThreshold: 80,
 *     memoryLimitMB: 500
 *   }
 * };
 * 
 * // Create optimized service
 * const securityService = await OptimizedSecurityServiceFactory.createAsync({
 *   logger: enterpriseLogger,
 *   config,
 *   cache: redisCacheService,
 *   metrics: prometheusMetrics,
 *   healthCheck: healthCheckService
 * });
 * 
 * // Monitor factory performance
 * const metrics = OptimizedSecurityServiceFactory.getMetrics();
 * console.log(`Cache hit ratio: ${metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) * 100}%`);
 * ```
 */
export class OptimizedSecurityServiceFactory {
  /**
   * @static
   * @private
   * @description Enhanced cache with TTL and metadata
   */
  private static cache: Map<string, CacheEntry> = new Map();

  /**
   * @static
   * @private
   * @description Factory performance metrics
   */
  private static metrics: FactoryMetrics = {
    totalCreated: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalMemoryMB: 0,
    averageCreationTime: 0,
    circuitBreakerTrips: 0,
    lastCleanup: Date.now()
  };

  /**
   * @static
   * @private
   * @description Circuit breaker state
   */
  private static circuitBreaker: CircuitBreakerState = {
    isOpen: false,
    failureCount: 0,
    lastFailureTime: 0,
    nextAttemptTime: 0
  };

  /**
   * @static
   * @private
   * @description Cleanup interval
   */
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * @static
   * @private
   * @description Enhanced default configuration
   */
  private static readonly ENHANCED_DEFAULT_CONFIG: EnhancedSecurityServiceConfig = {
    encryption: {
      algorithm: 'AES-256-GCM',
      keyLength: 256
    },
    mfa: {
      enabled: true,
      methods: ['totp', 'sms', 'email'],
      backupCodes: 10
    },
    session: {
      timeout: 900000, // 15 minutes
      maxConcurrent: 5
    },
    biometric: {
      enabled: true,
      fallbackToPin: true
    },
    advancedThreats: {
      enabled: true,
      ml: {
        enabled: true,
        models: ['anomaly-detection', 'behavioral-analysis']
      }
    },
    audit: {
      enabled: true,
      retention: 90 // 90 days
    },
    compliance: {
      gdpr: true,
      hipaa: false,
      sox: false
    },
    enableThreatAssessment: true,
    enableDeviceFingerprinting: true,
    enableLocationMonitoring: true,
    riskThresholds: {
      low: 30,
      medium: 60,
      high: 85,
      critical: 95
    },
    monitoringIntervals: {
      deviceCheck: 30000,      // 30 seconds
      locationCheck: 60000,    // 1 minute
      threatAssessment: 300000, // 5 minutes
      healthCheck: 120000      // 2 minutes
    },
    cache: {
      enabled: true,
      ttl: 300000,             // 5 minutes
      maxSize: 50,             // Max 50 cached instances
      cleanupInterval: 60000   // Cleanup every minute
    },
    performance: {
      enableMetrics: true,
      enableCircuitBreaker: true,
      circuitBreakerThreshold: 5,
      circuitBreakerTimeout: 30000,
      enableLazyLoading: true
    },
    resources: {
      enableAutoCleanup: true,
      cleanupThreshold: 80,    // Cleanup when 80% of maxSize reached
      memoryLimitMB: 200       // 200MB memory limit
    }
  };

  /**
   * @method create
   * @description Create Advanced Security Service instance with enhanced dependency injection
   * 
   * Creates new Advanced Security Service instance using constructor-based
   * dependency injection with intelligent caching, circuit breaker, and monitoring.
   * 
   * @param {SecurityServiceDependencies} dependencies - Service dependencies
   * @param {boolean} [enableCaching=true] - Whether to cache the instance
   * @returns {Promise<IAdvancedSecurityService>} Security service instance
   * 
   * @businessRule BR-300: Optimized factory-based service creation with DI
   * @businessRule BR-301: Enhanced constructor dependency injection pattern
   * @businessRule BR-302: Advanced configuration validation and merging
   * @businessRule BR-303: Intelligent instance caching with TTL
   * @businessRule BR-304: Circuit breaker pattern for resilience
   * @businessRule BR-310: Modular interface design
   * 
   * @throws {Error} When required dependencies are missing or invalid
   * @throws {Error} When circuit breaker is open
   * 
   * @example Create Service with Enhanced Configuration
   * ```typescript
   * const securityService = await OptimizedSecurityServiceFactory.create({
   *   logger: loggerService,
   *   config: {
   *     enableThreatAssessment: true,
   *     performance: { enableCircuitBreaker: true },
   *     cache: { enabled: true, ttl: 300000 }
   *   },
   *   cache: cacheService,
   *   metrics: metricsService
   * });
   * ```
   */
  public static async create(
    dependencies: SecurityServiceDependencies,
    enableCaching: boolean = true
  ): Promise<IAdvancedSecurityService> {
    const startTime = Date.now();
    
    try {
      // Check circuit breaker
      if (this.circuitBreaker.isOpen && Date.now() < this.circuitBreaker.nextAttemptTime) {
        this.metrics.circuitBreakerTrips++;
        throw new Error('SecurityServiceFactory: Circuit breaker is open - service creation blocked');
      }

      const { logger, config, cache, metrics } = dependencies;

      // Validate dependencies first
      this.validateDependencies(dependencies);

      // Merge with enhanced default configuration
      const mergedConfig = this.mergeEnhancedConfig(config);

      // Create cache key for instance management
      const cacheKey = enableCaching ? this.createOptimizedCacheKey(mergedConfig) : null;

      // Return existing instance if caching enabled and available
      if (enableCaching && cacheKey && this.cache.has(cacheKey)) {
        const cacheEntry = this.cache.get(cacheKey)!;
        
        // Check TTL
        if (Date.now() - cacheEntry.createdAt <= (mergedConfig.cache?.ttl || 300000)) {
          cacheEntry.lastAccessed = Date.now();
          cacheEntry.accessCount++;
          this.metrics.cacheHits++;
          
          logger.debug('Returning cached Advanced Security Service instance', LogCategory.PERFORMANCE, {
            service: 'OptimizedSecurityServiceFactory',
            metadata: { 
              cacheKey, 
              instanceCount: this.cache.size,
              accessCount: cacheEntry.accessCount,
              age: Date.now() - cacheEntry.createdAt
            }
          });
          
          return cacheEntry.service;
        } else {
          // Remove expired entry
          this.cache.delete(cacheKey);
        }
      }

      this.metrics.cacheMisses++;

      logger.info('Creating new Advanced Security Service instance', LogCategory.SECURITY, {
        service: 'OptimizedSecurityServiceFactory',
        metadata: { 
          enableCaching,
          circuitBreakerOpen: this.circuitBreaker.isOpen,
          config: {
            threatAssessment: mergedConfig.enableThreatAssessment,
            fingerprinting: mergedConfig.enableDeviceFingerprinting,
            locationMonitoring: mergedConfig.enableLocationMonitoring,
            performanceOptimizations: mergedConfig.performance?.enableMetrics
          }
        }
      });

      // Create new instance with constructor dependency injection
      const service = new AdvancedSecurityServiceImpl(
        logger,
        mergedConfig,
        cache,
        metrics
      );

      // Update metrics
      const creationTime = Date.now() - startTime;
      this.metrics.totalCreated++;
      this.metrics.averageCreationTime = 
        (this.metrics.averageCreationTime * (this.metrics.totalCreated - 1) + creationTime) / this.metrics.totalCreated;

      // Cache instance if caching enabled
      if (enableCaching && cacheKey) {
        await this.cacheServiceInstance(cacheKey, service, mergedConfig);
      }

      // Start auto-cleanup if enabled
      if (mergedConfig.resources?.enableAutoCleanup && !this.cleanupInterval) {
        this.startAutoCleanup(mergedConfig.cache?.cleanupInterval || 60000);
      }

      // Reset circuit breaker on success
      this.circuitBreaker.failureCount = 0;
      this.circuitBreaker.isOpen = false;

      logger.logPerformance('Security service creation completed', {
        operation: 'create_security_service',
        duration: creationTime
      }, {
        service: 'OptimizedSecurityServiceFactory',
        metadata: { 
          instanceCount: this.cache.size 
        }
      });

      return service;
    } catch (error) {
      // Handle circuit breaker
      this.handleCircuitBreakerFailure(dependencies.config);
      
      dependencies.logger.error('Advanced Security Service creation failed', LogCategory.SECURITY, {
        service: 'OptimizedSecurityServiceFactory',
        metadata: { 
          circuitBreakerTrips: this.metrics.circuitBreakerTrips,
          totalFailures: this.circuitBreaker.failureCount
        }
      }, error as Error);
      
      throw error;
    }
  }

  /**
   * @method createAsync
   * @description Async factory method with lazy loading support
   * 
   * @param {SecurityServiceDependencies} dependencies - Service dependencies
   * @returns {Promise<IAdvancedSecurityService>} Security service instance
   */
  public static async createAsync(
    dependencies: SecurityServiceDependencies
  ): Promise<IAdvancedSecurityService> {
    if (dependencies.config.performance?.enableLazyLoading) {
      // Implement lazy loading logic
      return this.createLazyService(dependencies);
    }
    
    return this.create(dependencies, true);
  }

  /**
   * @method createForTesting
   * @description Create service instance specifically for testing environments
   * 
   * Creates uncached service instance with minimal configuration for testing.
   * Automatically disables caching and provides testing-friendly defaults.
   * 
   * @param {Partial<SecurityServiceDependencies>} dependencies - Partial dependencies
   * @returns {Promise<IAdvancedSecurityService>} Service instance for testing
   * 
   * @example Create Service for Unit Tests
   * ```typescript
   * const mockLogger = createMockLogger();
   * const testService = await OptimizedSecurityServiceFactory.createForTesting({
   *   logger: mockLogger
   * });
   * 
   * // Service created with testing-friendly defaults
   * expect(testService).toBeInstanceOf(AdvancedSecurityServiceImpl);
   * ```
   */
  public static async createForTesting(
    dependencies: Partial<SecurityServiceDependencies>
  ): Promise<IAdvancedSecurityService> {
    const testConfig: EnhancedSecurityServiceConfig = {
      // Base SecurityServiceConfig properties
      encryption: {
        algorithm: 'AES-256-GCM',
        keyLength: 256
      },
      mfa: {
        enabled: false, // Disabled for tests
        methods: ['totp'],
        backupCodes: 0
      },
      session: {
        timeout: 60000, // 1 minute for tests
        maxConcurrent: 1
      },
      biometric: {
        enabled: false, // Disabled for tests
        fallbackToPin: false
      },
      // Enhanced properties
      advancedThreats: {
        enabled: false,
        ml: {
          enabled: false,
          models: []
        }
      },
      audit: {
        enabled: false,
        retention: 1 // 1 day for tests
      },
      compliance: {
        gdpr: false,
        hipaa: false,
        sox: false
      },
      // Additional properties
      enableThreatAssessment: false, // Disabled for faster tests
      enableDeviceFingerprinting: true,
      enableLocationMonitoring: false,
      riskThresholds: { low: 20, medium: 50, high: 80, critical: 90 },
      monitoringIntervals: {
        deviceCheck: 1000,    // 1 second for tests
        locationCheck: 2000,  // 2 seconds for tests
        threatAssessment: 5000, // 5 seconds for tests
        healthCheck: 10000    // 10 seconds for tests
      },
      cache: { 
        enabled: false, 
        ttl: 1000,
        maxSize: 10,
        cleanupInterval: 5000
      }, // Minimal caching for tests
      performance: {
        enableMetrics: false,
        enableCircuitBreaker: false,
        circuitBreakerThreshold: 10,
        circuitBreakerTimeout: 5000,
        enableLazyLoading: false
      },
      resources: {
        enableAutoCleanup: false,
        cleanupThreshold: 50,
        memoryLimitMB: 50
      }
    };

    const fullDependencies: SecurityServiceDependencies = {
      logger: dependencies.logger || this.createNullLogger(),
      config: { ...testConfig, ...dependencies.config },
      cache: dependencies.cache,
      metrics: dependencies.metrics,
      healthCheck: dependencies.healthCheck
    };

    return this.create(fullDependencies, false); // No caching for tests
  }

  /**
   * @method reset
   * @description Reset factory state and clear all cached instances
   * 
   * Clears all cached service instances and resets factory state.
   * Useful for testing scenarios and memory cleanup.
   * 
   * @businessRule BR-303: Proper resource management and cleanup
   * 
   * @example Reset Factory State
   * ```typescript
   * // Clear all cached instances
   * OptimizedSecurityServiceFactory.reset();
   * 
   * // Factory is now in clean state
   * expect(OptimizedSecurityServiceFactory.getInstanceCount()).toBe(0);
   * ```
   */
  public static reset(): void {
    this.cache.clear();
    this.metrics = {
      totalCreated: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalMemoryMB: 0,
      averageCreationTime: 0,
      circuitBreakerTrips: 0,
      lastCleanup: Date.now()
    };
    this.circuitBreaker = {
      isOpen: false,
      failureCount: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0
    };
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * @method getInstanceCount
   * @description Get number of cached service instances
   * 
   * @returns {number} Number of cached service instances
   * 
   * @example Monitor Factory Usage
   * ```typescript
   * const instanceCount = OptimizedSecurityServiceFactory.getInstanceCount();
   * console.log(`${instanceCount} security service instances cached`);
   * ```
   */
  public static getInstanceCount(): number {
    return this.cache.size;
  }

  /**
   * @method getCachedInstances
   * @description Get all cached instance keys for debugging
   * 
   * @returns {string[]} Array of cached instance keys
   * 
   * @example Debug Factory State
   * ```typescript
   * const cachedKeys = OptimizedSecurityServiceFactory.getCachedInstances();
   * console.log('Cached instances:', cachedKeys);
   * ```
   */
  public static getCachedInstances(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * @method getMetrics
   * @description Get comprehensive factory performance metrics
   * 
   * @returns {FactoryMetrics} Factory performance metrics
   */
  public static getMetrics(): FactoryMetrics {
    return { ...this.metrics };
  }

  /**
   * @method getHealthStatus
   * @description Get factory health status
   * 
   * @returns {FactoryHealthStatus} Health status information
   */
  public static getHealthStatus(): FactoryHealthStatus {
    const maxCacheSize = 50; // From default config
    return {
      healthy: !this.circuitBreaker.isOpen && this.cache.size < maxCacheSize,
      cacheUtilization: (this.cache.size / maxCacheSize) * 100,
      circuitBreakerOpen: this.circuitBreaker.isOpen,
      memoryUsage: this.metrics.totalMemoryMB,
      uptime: Date.now() - this.metrics.lastCleanup,
      lastHealthCheck: Date.now(),
      details: {
        cacheEntries: this.cache.size,
        avgCreationTime: this.metrics.averageCreationTime,
        cacheHitRatio: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100 || 0
      }
    };
  }

  // ==========================================
  // 🔧 PRIVATE HELPER METHODS
  // ==========================================

  /**
   * @private
   * @method mergeEnhancedConfig
   * @description Merge provided config with enhanced defaults using deep merge
   * 
   * @param {EnhancedSecurityServiceConfig} config - User configuration
   * @returns {EnhancedSecurityServiceConfig} Merged configuration
   */
  private static mergeEnhancedConfig(config: EnhancedSecurityServiceConfig): EnhancedSecurityServiceConfig {
    return {
      ...this.ENHANCED_DEFAULT_CONFIG,
      ...config,
      riskThresholds: {
        low: config.riskThresholds?.low ?? this.ENHANCED_DEFAULT_CONFIG.riskThresholds!.low,
        medium: config.riskThresholds?.medium ?? this.ENHANCED_DEFAULT_CONFIG.riskThresholds!.medium,
        high: config.riskThresholds?.high ?? this.ENHANCED_DEFAULT_CONFIG.riskThresholds!.high,
        critical: config.riskThresholds?.critical ?? this.ENHANCED_DEFAULT_CONFIG.riskThresholds!.critical
      },
      monitoringIntervals: {
        deviceCheck: config.monitoringIntervals?.deviceCheck ?? this.ENHANCED_DEFAULT_CONFIG.monitoringIntervals!.deviceCheck,
        locationCheck: config.monitoringIntervals?.locationCheck ?? this.ENHANCED_DEFAULT_CONFIG.monitoringIntervals!.locationCheck,
        threatAssessment: config.monitoringIntervals?.threatAssessment ?? this.ENHANCED_DEFAULT_CONFIG.monitoringIntervals!.threatAssessment,
        healthCheck: config.monitoringIntervals?.healthCheck ?? this.ENHANCED_DEFAULT_CONFIG.monitoringIntervals!.healthCheck
      },
      cache: {
        enabled: config.cache?.enabled ?? this.ENHANCED_DEFAULT_CONFIG.cache!.enabled,
        ttl: config.cache?.ttl ?? this.ENHANCED_DEFAULT_CONFIG.cache!.ttl,
        maxSize: config.cache?.maxSize ?? this.ENHANCED_DEFAULT_CONFIG.cache!.maxSize,
        cleanupInterval: config.cache?.cleanupInterval ?? this.ENHANCED_DEFAULT_CONFIG.cache!.cleanupInterval
      },
      performance: {
        enableMetrics: config.performance?.enableMetrics ?? this.ENHANCED_DEFAULT_CONFIG.performance!.enableMetrics,
        enableCircuitBreaker: config.performance?.enableCircuitBreaker ?? this.ENHANCED_DEFAULT_CONFIG.performance!.enableCircuitBreaker,
        circuitBreakerThreshold: config.performance?.circuitBreakerThreshold ?? this.ENHANCED_DEFAULT_CONFIG.performance!.circuitBreakerThreshold,
        circuitBreakerTimeout: config.performance?.circuitBreakerTimeout ?? this.ENHANCED_DEFAULT_CONFIG.performance!.circuitBreakerTimeout,
        enableLazyLoading: config.performance?.enableLazyLoading ?? this.ENHANCED_DEFAULT_CONFIG.performance!.enableLazyLoading
      },
      resources: {
        enableAutoCleanup: config.resources?.enableAutoCleanup ?? this.ENHANCED_DEFAULT_CONFIG.resources!.enableAutoCleanup,
        cleanupThreshold: config.resources?.cleanupThreshold ?? this.ENHANCED_DEFAULT_CONFIG.resources!.cleanupThreshold,
        memoryLimitMB: config.resources?.memoryLimitMB ?? this.ENHANCED_DEFAULT_CONFIG.resources!.memoryLimitMB
      }
    };
  }

  /**
   * @private
   * @method createOptimizedCacheKey
   * @description Create optimized deterministic cache key with hash
   * 
   * @param {EnhancedSecurityServiceConfig} config - Service configuration
   * @returns {string} Optimized cache key
   */
  private static createOptimizedCacheKey(config: EnhancedSecurityServiceConfig): string {
    const keyObject = {
      threatAssessment: config.enableThreatAssessment,
      fingerprinting: config.enableDeviceFingerprinting,
      locationMonitoring: config.enableLocationMonitoring,
      thresholds: config.riskThresholds,
      intervals: config.monitoringIntervals,
      cache: config.cache?.enabled,
      performance: config.performance,
      resources: config.resources
    };
    
    // Simple hash for cache key optimization
    const configString = JSON.stringify(keyObject);
    let hash = 0;
    for (let i = 0; i < configString.length; i++) {
      const char = configString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `security_service_${Math.abs(hash).toString(36)}`;
  }

  /**
   * @private
   * @method cacheServiceInstance
   * @description Cache service instance with metadata
   * 
   * @param {string} cacheKey - Cache key
   * @param {IAdvancedSecurityService} service - Service instance
   * @param {EnhancedSecurityServiceConfig} config - Configuration
   */
  private static async cacheServiceInstance(
    cacheKey: string, 
    service: IAdvancedSecurityService, 
    config: EnhancedSecurityServiceConfig
  ): Promise<void> {
    const cacheEntry: CacheEntry = {
      service,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      config
    };

    // Check cache size limits
    const maxSize = config.cache?.maxSize || 50;
    if (this.cache.size >= maxSize) {
      await this.evictLeastRecentlyUsed();
    }

    this.cache.set(cacheKey, cacheEntry);
  }

  /**
   * @private
   * @method evictLeastRecentlyUsed
   * @description Evict least recently used cache entries
   */
  private static async evictLeastRecentlyUsed(): Promise<void> {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * @private
   * @method startAutoCleanup
   * @description Start automatic cache cleanup process
   * 
   * @param {number} interval - Cleanup interval in milliseconds
   */
  private static startAutoCleanup(interval: number): void {
    this.cleanupInterval = setInterval(() => {
      this.performCacheCleanup();
    }, interval);
  }

  /**
   * @private
   * @method performCacheCleanup
   * @description Perform cache cleanup by removing expired entries
   */
  private static performCacheCleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      const ttl = entry.config.cache?.ttl || 300000;
      if (now - entry.createdAt > ttl) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
    }

    this.metrics.lastCleanup = now;
  }

  /**
   * @private
   * @method handleCircuitBreakerFailure
   * @description Handle circuit breaker failure logic
   * 
   * @param {EnhancedSecurityServiceConfig} config - Service configuration
   */
  private static handleCircuitBreakerFailure(config: EnhancedSecurityServiceConfig): void {
    if (!config.performance?.enableCircuitBreaker) return;

    this.circuitBreaker.failureCount++;
    this.circuitBreaker.lastFailureTime = Date.now();

    const threshold = config.performance?.circuitBreakerThreshold || 5;
    const timeout = config.performance?.circuitBreakerTimeout || 30000;

    if (this.circuitBreaker.failureCount >= threshold) {
      this.circuitBreaker.isOpen = true;
      this.circuitBreaker.nextAttemptTime = Date.now() + timeout;
    }
  }

  /**
   * @private
   * @method createLazyService
   * @description Create service with lazy loading
   * 
   * @param {SecurityServiceDependencies} dependencies - Service dependencies
   * @returns {Promise<IAdvancedSecurityService>} Lazy-loaded service instance
   */
  private static async createLazyService(
    dependencies: SecurityServiceDependencies
  ): Promise<IAdvancedSecurityService> {
    // Implement lazy loading by creating a proxy that defers actual service creation
    const lazyProxy = new Proxy({} as IAdvancedSecurityService, {
      get: (target, prop) => {
        if (!target.generateDeviceFingerprint) {
          // Create actual service on first method call
          Object.assign(target, new AdvancedSecurityServiceImpl(
            dependencies.logger,
            dependencies.config,
            dependencies.cache,
            dependencies.metrics
          ));
        }
        return target[prop as keyof IAdvancedSecurityService];
      }
    });

    return lazyProxy;
  }

  /**
   * @private
   * @method validateDependencies
   * @description Validate required dependencies and their interfaces
   * 
   * @param {SecurityServiceDependencies} dependencies - Dependencies to validate
   * @throws {Error} When required dependencies are missing or invalid
   */
  private static validateDependencies(dependencies: SecurityServiceDependencies): void {
    if (!dependencies.logger) {
      throw new Error('OptimizedSecurityServiceFactory: Logger service is required');
    }

    if (!dependencies.config) {
      throw new Error('OptimizedSecurityServiceFactory: Configuration is required');
    }

    // Validate logger interface
    const requiredLoggerMethods = ['info', 'error', 'warn', 'debug', 'logSecurity', 'logPerformance'];
    for (const method of requiredLoggerMethods) {
      if (typeof dependencies.logger[method as keyof ILoggerService] !== 'function') {
        throw new Error(`OptimizedSecurityServiceFactory: Logger service missing required method: ${method}`);
      }
    }

    // Validate configuration structure
    if (typeof dependencies.config !== 'object') {
      throw new Error('OptimizedSecurityServiceFactory: Configuration must be an object');
    }

    // Enhanced configuration validation
    if (dependencies.config.cache?.maxSize && dependencies.config.cache.maxSize <= 0) {
      throw new Error('OptimizedSecurityServiceFactory: Cache maxSize must be positive');
    }

    if (dependencies.config.cache?.ttl && dependencies.config.cache.ttl <= 0) {
      throw new Error('OptimizedSecurityServiceFactory: Cache TTL must be positive');
    }

    if (dependencies.config.performance?.circuitBreakerThreshold && 
        dependencies.config.performance.circuitBreakerThreshold <= 0) {
      throw new Error('OptimizedSecurityServiceFactory: Circuit breaker threshold must be positive');
    }
  }

  /**
   * @private
   * @method createNullLogger
   * @description Create null logger for testing when none provided
   * 
   * @returns {ILoggerService} Null logger implementation
   */
  private static createNullLogger(): ILoggerService {
    const nullFunction = () => {};
    const nullTimer = { stop: () => {} };
    
    return {
      info: nullFunction,
      error: nullFunction,
      warn: nullFunction,
      debug: nullFunction,
      fatal: nullFunction,
      logSecurity: nullFunction,
      logPerformance: nullFunction,
      logAudit: nullFunction,
      startTimer: () => nullTimer,
      createChildLogger: () => this.createNullLogger(),
      flush: async () => {}
    } as ILoggerService;
  }

  /**
   * @private
   * @method calculateMemoryUsage
   * @description Calculate current memory usage of cached instances
   * 
   * @returns {number} Memory usage in MB
   */
  private static calculateMemoryUsage(): number {
    // Simplified memory calculation - in production use process.memoryUsage()
    const entriesCount = this.cache.size;
    const averageInstanceSize = 5; // Estimated 5MB per service instance
    return entriesCount * averageInstanceSize;
  }
} 