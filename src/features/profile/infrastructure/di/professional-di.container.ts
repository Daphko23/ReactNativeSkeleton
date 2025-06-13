/**
 * @fileoverview Professional DI Container - Enterprise Clean Architecture 2025
 * 
 * 🎯 ENTERPRISE DEPENDENCY INJECTION:
 * - Complete Professional Intelligence DI Setup
 * - Multi-Layer Dependency Management
 * - Configuration-Driven Architecture
 * - Performance Optimized Singleton Pattern
 * 
 * 🔥 CLEAN ARCHITECTURE PATTERNS:
 * - Dependency Inversion Principle
 * - Interface Segregation
 * - Single Responsibility
 * - Factory Pattern Integration
 * 
 * 🚀 ENTERPRISE FEATURES:
 * - Lazy Loading for Performance
 * - Configuration Management
 * - Health Monitoring
 * - Cache Integration
 * - Metrics Collection
 * 
 * @module ProfessionalDIContainer
 * @since 3.0.0 (Enterprise Clean Architecture)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Infrastructure (Dependency Injection)
 * @architecture Clean Architecture + DI Container Pattern
 */

// =============================================================================
// USE CASES IMPORTS
// =============================================================================

import { AnalyzeProfessionalSkillsUseCase } from '../../application/use-cases/professional/analyze-professional-skills.use-case';
import { BenchmarkIndustryDataUseCase } from '../../application/use-cases/professional/benchmark-industry-data.use-case';
import { ManageProfessionalCacheUseCase } from '../../application/use-cases/professional/manage-professional-cache.use-case';
import { ManageProfessionalNetworkUseCase } from '../../application/use-cases/professional/manage-professional-network.use-case';
import { OptimizeProfessionalProfileUseCase } from '../../application/use-cases/professional/optimize-professional-profile.use-case';
import { ProcessProfessionalInfoUseCase } from '../../application/use-cases/professional/process-professional-info.use-case';
import { TrackCareerProgressionUseCase } from '../../application/use-cases/professional/track-career-progression.use-case';

// =============================================================================
// REPOSITORY & DATA SOURCE IMPORTS
// =============================================================================

import { 
  IProfessionalRepository 
} from '../../domain/interfaces/professional-repository.interface';
import { ProfessionalRepositoryImpl } from '../../data/repositories/professional-repository.impl';
import { 
  SupabaseProfessionalDataSource,
  SupabaseProfessionalDataSourceFactory 
} from '../../data/datasources/supabase-professional.datasource';

// =============================================================================
// CONFIGURATION INTERFACES
// =============================================================================

export interface ProfessionalDIConfig {
  // Data Source Configuration
  dataSource: {
    provider: 'supabase' | 'firebase' | 'api';
    supabaseUrl?: string;
    supabaseKey?: string;
    apiEndpoint?: string;
    apiKey?: string;
  };
  
  // Cache Configuration
  cache: {
    enabled: boolean;
    provider: 'redis' | 'memory' | 'asyncstorage';
    defaultTTL: number;
    maxSize?: number;
    redisUrl?: string;
  };
  
  // Performance Configuration
  performance: {
    enableMetrics: boolean;
    enableHealthCheck: boolean;
    batchSize: number;
    connectionPoolSize: number;
    queryTimeout: number;
  };
  
  // Feature Flags
  features: {
    realTimeUpdates: boolean;
    offlineSupport: boolean;
    advancedAnalytics: boolean;
    marketIntelligence: boolean;
    networkingInsights: boolean;
  };
  
  // Environment
  environment: 'development' | 'staging' | 'production';
  debugMode: boolean;
}

// =============================================================================
// CACHE MANAGER INTERFACE & IMPLEMENTATION
// =============================================================================

interface ICacheManager {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  clear(pattern?: string): Promise<void>;
  getMetrics(): Promise<{
    hitRate: number;
    missRate: number;
    size: number;
    totalOperations: number;
    lastCleanup: Date;
  }>;
}

class MemoryCacheManager implements ICacheManager {
  private cache = new Map<string, { value: any; expiry: number }>();
  private metrics = {
    hits: 0,
    misses: 0,
    operations: 0
  };

  async get<T>(key: string): Promise<T | null> {
    this.metrics.operations++;
    
    const item = this.cache.get(key);
    if (!item) {
      this.metrics.misses++;
      return null;
    }
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.metrics.misses++;
      return null;
    }
    
    this.metrics.hits++;
    return item.value;
  }

  async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    const expiry = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expiry });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async clear(pattern?: string): Promise<void> {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    // Simple pattern matching for demo
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  async getMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      hitRate: total > 0 ? this.metrics.hits / total : 0,
      missRate: total > 0 ? this.metrics.misses / total : 0,
      size: this.cache.size,
      totalOperations: this.metrics.operations,
      lastCleanup: new Date()
    };
  }
}

// =============================================================================
// PROFESSIONAL DI CONTAINER
// =============================================================================

/**
 * ProfessionalDIContainer - Enterprise Dependency Injection Container
 * 
 * 🎯 ENTERPRISE FEATURES:
 * - Complete Professional Intelligence DI Setup
 * - Lazy Loading for Performance
 * - Configuration-Driven Architecture
 * - Health Monitoring & Metrics
 * - Multi-Environment Support
 * 
 * 🔥 DESIGN PATTERNS:
 * - Singleton Pattern for Container
 * - Factory Pattern for Dependencies
 * - Strategy Pattern for Data Sources
 * - Observer Pattern for Health Monitoring
 */
export class ProfessionalDIContainer {
  private static instance: ProfessionalDIContainer;
  private initialized = false;
  
  // Cached instances
  private _config!: ProfessionalDIConfig;
  private _cacheManager!: ICacheManager;
  private _dataSource!: SupabaseProfessionalDataSource;
  private _repository!: IProfessionalRepository;
  
  // Use Cases (Lazy loaded)
  private _analyzeProfessionalSkillsUseCase?: AnalyzeProfessionalSkillsUseCase;
  private _benchmarkIndustryDataUseCase?: BenchmarkIndustryDataUseCase;
  private _manageProfessionalCacheUseCase?: ManageProfessionalCacheUseCase;
  private _manageProfessionalNetworkUseCase?: ManageProfessionalNetworkUseCase;
  private _optimizeProfessionalProfileUseCase?: OptimizeProfessionalProfileUseCase;
  private _processProfessionalInfoUseCase?: ProcessProfessionalInfoUseCase;
  private _trackCareerProgressionUseCase?: TrackCareerProgressionUseCase;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ProfessionalDIContainer {
    if (!ProfessionalDIContainer.instance) {
      ProfessionalDIContainer.instance = new ProfessionalDIContainer();
    }
    return ProfessionalDIContainer.instance;
  }

  /**
   * Initialize container with configuration
   */
  public async initialize(config: ProfessionalDIConfig): Promise<void> {
    if (this.initialized) {
      return;
    }

    this._config = config;
    
    try {
      // Initialize core dependencies
      await this.initializeCacheManager();
      await this.initializeDataSource();
      await this.initializeRepository();
      
      // Validate initialization
      await this.validateInitialization();
      
      this.initialized = true;
      
      if (config.debugMode) {
        console.log('[ProfessionalDI] Container initialized successfully');
      }
      
    } catch (error) {
      console.error('[ProfessionalDI] Initialization failed:', error);
      throw new Error(`Failed to initialize Professional DI Container: ${error}`);
    }
  }

  // =============================================================================
  // CORE DEPENDENCY GETTERS
  // =============================================================================

  /**
   * Get cache manager instance
   */
  public getCacheManager(): ICacheManager {
    this.ensureInitialized();
    return this._cacheManager;
  }

  /**
   * Get data source instance
   */
  public getDataSource(): SupabaseProfessionalDataSource {
    this.ensureInitialized();
    return this._dataSource;
  }

  /**
   * Get repository instance
   */
  public getRepository(): IProfessionalRepository {
    this.ensureInitialized();
    return this._repository;
  }

  // =============================================================================
  // USE CASE GETTERS (Lazy Loaded)
  // =============================================================================

  /**
   * Get Analyze Professional Skills Use Case
   */
  public getAnalyzeProfessionalSkillsUseCase(): AnalyzeProfessionalSkillsUseCase {
    this.ensureInitialized();
    
    if (!this._analyzeProfessionalSkillsUseCase) {
      this._analyzeProfessionalSkillsUseCase = new AnalyzeProfessionalSkillsUseCase();
    }
    
    return this._analyzeProfessionalSkillsUseCase;
  }

  /**
   * Get Benchmark Industry Data Use Case
   */
  public getBenchmarkIndustryDataUseCase(): BenchmarkIndustryDataUseCase {
    this.ensureInitialized();
    
    if (!this._benchmarkIndustryDataUseCase) {
      this._benchmarkIndustryDataUseCase = new BenchmarkIndustryDataUseCase();
    }
    
    return this._benchmarkIndustryDataUseCase;
  }

  /**
   * Get Manage Professional Cache Use Case
   */
  public getManageProfessionalCacheUseCase(): ManageProfessionalCacheUseCase {
    this.ensureInitialized();
    
    if (!this._manageProfessionalCacheUseCase) {
      this._manageProfessionalCacheUseCase = new ManageProfessionalCacheUseCase();
    }
    
    return this._manageProfessionalCacheUseCase;
  }

  /**
   * Get Manage Professional Network Use Case
   */
  public getManageProfessionalNetworkUseCase(): ManageProfessionalNetworkUseCase {
    this.ensureInitialized();
    
    if (!this._manageProfessionalNetworkUseCase) {
      this._manageProfessionalNetworkUseCase = new ManageProfessionalNetworkUseCase();
    }
    
    return this._manageProfessionalNetworkUseCase;
  }

  /**
   * Get Optimize Professional Profile Use Case
   */
  public getOptimizeProfessionalProfileUseCase(): OptimizeProfessionalProfileUseCase {
    this.ensureInitialized();
    
    if (!this._optimizeProfessionalProfileUseCase) {
      this._optimizeProfessionalProfileUseCase = new OptimizeProfessionalProfileUseCase();
    }
    
    return this._optimizeProfessionalProfileUseCase;
  }

  /**
   * Get Process Professional Info Use Case
   */
  public getProcessProfessionalInfoUseCase(): ProcessProfessionalInfoUseCase {
    this.ensureInitialized();
    
    if (!this._processProfessionalInfoUseCase) {
      this._processProfessionalInfoUseCase = new ProcessProfessionalInfoUseCase();
    }
    
    return this._processProfessionalInfoUseCase;
  }

  /**
   * Get Track Career Progression Use Case
   */
  public getTrackCareerProgressionUseCase(): TrackCareerProgressionUseCase {
    this.ensureInitialized();
    
    if (!this._trackCareerProgressionUseCase) {
      this._trackCareerProgressionUseCase = new TrackCareerProgressionUseCase();
    }
    
    return this._trackCareerProgressionUseCase;
  }

  // =============================================================================
  // CONFIGURATION & UTILITIES
  // =============================================================================

  /**
   * Get current configuration
   */
  public getConfig(): ProfessionalDIConfig {
    this.ensureInitialized();
    return { ...this._config };
  }

  /**
   * Get container health status
   */
  public async getHealthStatus(): Promise<{
    healthy: boolean;
    components: {
      cacheManager: boolean;
      dataSource: boolean;
      repository: boolean;
    };
    metrics: {
      initializationTime: number;
      lastHealthCheck: Date;
      errorCount: number;
    };
  }> {
    try {
      const [cacheHealthy, dataSourceHealthy] = await Promise.all([
        this.checkCacheHealth(),
        this.checkDataSourceHealth()
      ]);

      const components = {
        cacheManager: cacheHealthy,
        dataSource: dataSourceHealthy,
        repository: cacheHealthy && dataSourceHealthy
      };

      const healthy = Object.values(components).every(status => status);

      return {
        healthy,
        components,
        metrics: {
          initializationTime: 0, // Would track actual initialization time
          lastHealthCheck: new Date(),
          errorCount: 0 // Would track errors
        }
      };
      
    } catch (error) {
      return {
        healthy: false,
        components: {
          cacheManager: false,
          dataSource: false,
          repository: false
        },
        metrics: {
          initializationTime: 0,
          lastHealthCheck: new Date(),
          errorCount: 1
        }
      };
    }
  }

  /**
   * Reset container (for testing)
   */
  public reset(): void {
    this.initialized = false;
    this._analyzeProfessionalSkillsUseCase = undefined;
    this._benchmarkIndustryDataUseCase = undefined;
    this._manageProfessionalCacheUseCase = undefined;
    this._manageProfessionalNetworkUseCase = undefined;
    this._optimizeProfessionalProfileUseCase = undefined;
    this._processProfessionalInfoUseCase = undefined;
    this._trackCareerProgressionUseCase = undefined;
  }

  // =============================================================================
  // PRIVATE INITIALIZATION METHODS
  // =============================================================================

  private async initializeCacheManager(): Promise<void> {
    if (this._config.cache.provider === 'memory') {
      this._cacheManager = new MemoryCacheManager();
    } else {
      // Redis or AsyncStorage implementation would go here
      throw new Error(`Cache provider ${this._config.cache.provider} not implemented`);
    }
  }

  private async initializeDataSource(): Promise<void> {
    if (this._config.dataSource.provider === 'supabase') {
      if (!this._config.dataSource.supabaseUrl || !this._config.dataSource.supabaseKey) {
        throw new Error('Supabase URL and Key are required for Supabase data source');
      }
      
      this._dataSource = SupabaseProfessionalDataSourceFactory.create(
        this._config.dataSource.supabaseUrl,
        this._config.dataSource.supabaseKey,
        {
          enableRealTime: this._config.features.realTimeUpdates,
          enableMetrics: this._config.performance.enableMetrics,
          connectionPoolSize: this._config.performance.connectionPoolSize
        }
      );
    } else {
      throw new Error(`Data source provider ${this._config.dataSource.provider} not implemented`);
    }
  }

  private async initializeRepository(): Promise<void> {
    this._repository = new ProfessionalRepositoryImpl(
      this._cacheManager,
      this._dataSource.profile as any, // Type assertion for demo
      this._dataSource.skills as any,
      this._dataSource.career as any,
      this._dataSource.benchmark as any,
      this._dataSource.network as any,
      {
        defaultCacheTTL: this._config.cache.defaultTTL,
        metricsEnabled: this._config.performance.enableMetrics,
        batchSize: this._config.performance.batchSize
      }
    );
  }

  private async validateInitialization(): Promise<void> {
    // Validate cache manager
    if (!this._cacheManager) {
      throw new Error('Cache manager not initialized');
    }

    // Validate data source
    if (!this._dataSource) {
      throw new Error('Data source not initialized');
    }

    // Validate repository
    if (!this._repository) {
      throw new Error('Repository not initialized');
    }

    // Health check
    if (this._config.performance.enableHealthCheck) {
      const health = await this.getHealthStatus();
      if (!health.healthy) {
        throw new Error('Health check failed during initialization');
      }
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Professional DI Container not initialized. Call initialize() first.');
    }
  }

  private async checkCacheHealth(): Promise<boolean> {
    try {
      await this._cacheManager.set('health_check', 'ok', 5);
      const result = await this._cacheManager.get('health_check');
      return result === 'ok';
    } catch {
      return false;
    }
  }

  private async checkDataSourceHealth(): Promise<boolean> {
    try {
      const health = await this._dataSource.healthCheck();
      return health.overall;
    } catch {
      return false;
    }
  }
}

// =============================================================================
// CONFIGURATION FACTORY
// =============================================================================

/**
 * Factory for creating Professional DI configurations
 */
export class ProfessionalDIConfigFactory {
  
  /**
   * Create development configuration
   */
  static createDevelopmentConfig(): ProfessionalDIConfig {
    return {
      dataSource: {
        provider: 'supabase',
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseKey: process.env.SUPABASE_ANON_KEY || ''
      },
      cache: {
        enabled: true,
        provider: 'memory',
        defaultTTL: 300,
        maxSize: 1000
      },
      performance: {
        enableMetrics: true,
        enableHealthCheck: true,
        batchSize: 50,
        connectionPoolSize: 10,
        queryTimeout: 5000
      },
      features: {
        realTimeUpdates: false,
        offlineSupport: true,
        advancedAnalytics: true,
        marketIntelligence: true,
        networkingInsights: true
      },
      environment: 'development',
      debugMode: true
    };
  }

  /**
   * Create production configuration
   */
  static createProductionConfig(): ProfessionalDIConfig {
    return {
      ...this.createDevelopmentConfig(),
      cache: {
        enabled: true,
        provider: 'redis',
        defaultTTL: 600,
        maxSize: 10000,
        redisUrl: process.env.REDIS_URL
      },
      performance: {
        enableMetrics: true,
        enableHealthCheck: true,
        batchSize: 100,
        connectionPoolSize: 20,
        queryTimeout: 10000
      },
      features: {
        realTimeUpdates: true,
        offlineSupport: true,
        advancedAnalytics: true,
        marketIntelligence: true,
        networkingInsights: true
      },
      environment: 'production',
      debugMode: false
    };
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

/**
 * Export singleton instance for global access
 */
export const professionalDI = ProfessionalDIContainer.getInstance();