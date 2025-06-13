/**
 * @fileoverview UI Preferences Dependency Injection Container - Enterprise DI Management
 * 
 * ✅ ENTERPRISE DI CONTAINER:
 * - Service registration and lifecycle management
 * - Dependency injection for UI preferences
 * - Repository pattern implementation
 * - Use case composition
 * - Testing abstractions
 */

import { IUIPreferencesRepository } from '../domain/interfaces/ui-preferences-repository.interface';
import { UIPreferencesRepositoryImpl } from '../data/repositories/ui-preferences-repository.impl';
import { TrackUIInteractionUseCase } from '../application/use-cases/ui-management/track-ui-interaction.use-case';
import { ManageUIPreferencesUseCase } from '../application/use-cases/ui-management/manage-ui-preferences.use-case';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// 🎯 SERVICE TYPES
export type UIPreferencesServices = {
  // 🏛️ REPOSITORIES
  uiPreferencesRepository: IUIPreferencesRepository;
  
  // 🎯 USE CASES
  trackUIInteractionUseCase: TrackUIInteractionUseCase;
  manageUIPreferencesUseCase: ManageUIPreferencesUseCase;
  
  // 🔧 UTILITIES
  healthCheck: () => Promise<UIContainerHealthStatus>;
  clearCache: () => void;
  getMetrics: () => UIContainerMetrics;
};

export interface UIContainerHealthStatus {
  isHealthy: boolean;
  services: {
    repository: boolean;
    useCases: boolean;
    storage: boolean;
  };
  metrics: {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    cacheHitRate: number;
  };
  timestamp: number;
}

export interface UIContainerMetrics {
  serviceInstances: number;
  memoryUsage: number;
  requestCount: number;
  errorCount: number;
  cacheHits: number;
  cacheMisses: number;
  averageOperationTime: number;
}

export interface UIContainerConfig {
  enableCaching: boolean;
  enableMetrics: boolean;
  enableHealthChecks: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  storage: {
    provider: 'async-storage' | 'secure-storage' | 'memory';
    encryption: boolean;
    compression: boolean;
  };
  performance: {
    maxCacheSize: number;
    cacheTTL: number;
    operationTimeout: number;
  };
}

class UIPreferencesDIContainer {
  private static instance: UIPreferencesDIContainer;
  private readonly logger = LoggerFactory.createServiceLogger('UIPreferencesDIContainer');
  private services: UIPreferencesServices | null = null;
  private config: UIContainerConfig;
  
  // 📊 METRICS TRACKING
  private metrics: UIContainerMetrics = {
    serviceInstances: 0,
    memoryUsage: 0,
    requestCount: 0,
    errorCount: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageOperationTime: 0
  };

  private operationTimes: number[] = [];
  private readonly MAX_OPERATION_HISTORY = 100;

  private constructor(config?: Partial<UIContainerConfig>) {
    this.config = {
      enableCaching: true,
      enableMetrics: true,
      enableHealthChecks: true,
      logLevel: 'info',
      storage: {
        provider: 'async-storage',
        encryption: false,
        compression: true
      },
      performance: {
        maxCacheSize: 100,
        cacheTTL: 5 * 60 * 1000, // 5 minutes
        operationTimeout: 10000 // 10 seconds
      },
      ...config
    };

    this.logger.info('UI Preferences DI Container initialized', LogCategory.INFRASTRUCTURE, {
      metadata: {
        config: this.config,
        enabledFeatures: {
          caching: this.config.enableCaching,
          metrics: this.config.enableMetrics,
          healthChecks: this.config.enableHealthChecks
        }
      }
    });
  }

  // =============================================================================
  // 🏭 SINGLETON PATTERN
  // =============================================================================

  public static getInstance(config?: Partial<UIContainerConfig>): UIPreferencesDIContainer {
    if (!UIPreferencesDIContainer.instance) {
      UIPreferencesDIContainer.instance = new UIPreferencesDIContainer(config);
    }
    return UIPreferencesDIContainer.instance;
  }

  public static resetInstance(): void {
    UIPreferencesDIContainer.instance = null as any;
  }

  // =============================================================================
  // 🎯 SERVICE REGISTRATION
  // =============================================================================

  public getServices(): UIPreferencesServices {
    if (!this.services) {
      this.services = this.createServices();
      this.metrics.serviceInstances = Object.keys(this.services).length;
      
      this.logger.info('UI Preferences services created', LogCategory.INFRASTRUCTURE, {
        metadata: {
          serviceCount: this.metrics.serviceInstances,
          storageProvider: this.config.storage.provider
        }
      });
    }

    return this.services;
  }

  private createServices(): UIPreferencesServices {
    try {
      // 🏛️ CREATE REPOSITORY
      const uiPreferencesRepository = this.createRepository();

      // 🎯 CREATE USE CASES
      const trackUIInteractionUseCase = new TrackUIInteractionUseCase(uiPreferencesRepository);
      const manageUIPreferencesUseCase = new ManageUIPreferencesUseCase(uiPreferencesRepository);

      // 🔧 CREATE UTILITIES
      const healthCheck = () => this.performHealthCheck(uiPreferencesRepository);
      const clearCache = () => this.clearCache();
      const getMetrics = () => this.getMetrics();

      const services: UIPreferencesServices = {
        uiPreferencesRepository,
        trackUIInteractionUseCase,
        manageUIPreferencesUseCase,
        healthCheck,
        clearCache,
        getMetrics
      };

      this.logger.info('All UI Preferences services registered successfully', LogCategory.INFRASTRUCTURE, {
        metadata: {
          repositoryType: 'UIPreferencesRepositoryImpl',
          useCaseCount: 2,
          storageProvider: this.config.storage.provider
        }
      });

      return services;
    } catch (error) {
      this.logger.error('Failed to create UI Preferences services', LogCategory.INFRASTRUCTURE, {}, error as Error);
      this.metrics.errorCount++;
      throw error;
    }
  }

  private createRepository(): IUIPreferencesRepository {
    // 🏭 FACTORY: Create repository based on config
    switch (this.config.storage.provider) {
      case 'async-storage':
        return new UIPreferencesRepositoryImpl();
      
      case 'secure-storage':
        // TODO: Implement secure storage repository
        this.logger.warn('Secure storage not implemented, falling back to AsyncStorage', LogCategory.INFRASTRUCTURE);
        return new UIPreferencesRepositoryImpl();
      
      case 'memory':
        // TODO: Implement in-memory repository for testing
        this.logger.warn('Memory storage not implemented, falling back to AsyncStorage', LogCategory.INFRASTRUCTURE);
        return new UIPreferencesRepositoryImpl();
      
      default:
        throw new Error(`Unknown storage provider: ${this.config.storage.provider}`);
    }
  }

  // =============================================================================
  // 🔍 HEALTH MONITORING
  // =============================================================================

  private async performHealthCheck(repository: IUIPreferencesRepository): Promise<UIContainerHealthStatus> {
    const startTime = Date.now();
    
    try {
      // 🔍 TEST REPOSITORY HEALTH
      const storageHealth = await repository.checkStorageHealth();
      
      // 🎯 TEST USE CASE OPERATIONS
      const testUserId = 'health_check_user';
      const testPreferences = await repository.getPreferences(testUserId);
      
      // 📊 CALCULATE METRICS
      const operationTime = Date.now() - startTime;
      const cacheHitRate = this.calculateCacheHitRate();
      const errorRate = this.calculateErrorRate();

      const healthStatus: UIContainerHealthStatus = {
        isHealthy: storageHealth.isHealthy && operationTime < this.config.performance.operationTimeout,
        services: {
          repository: storageHealth.isHealthy,
          useCases: operationTime < this.config.performance.operationTimeout,
          storage: storageHealth.isHealthy
        },
        metrics: {
          totalRequests: this.metrics.requestCount,
          averageResponseTime: this.metrics.averageOperationTime,
          errorRate,
          cacheHitRate
        },
        timestamp: Date.now()
      };

      this.logger.info('Health check completed', LogCategory.INFRASTRUCTURE, {
        metadata: {
          isHealthy: healthStatus.isHealthy,
          operationTime,
          storageUsed: storageHealth.storageUsed,
          services: healthStatus.services
        }
      });

      return healthStatus;
    } catch (error) {
      this.logger.error('Health check failed', LogCategory.INFRASTRUCTURE, {}, error as Error);
      this.metrics.errorCount++;

      return {
        isHealthy: false,
        services: {
          repository: false,
          useCases: false,
          storage: false
        },
        metrics: {
          totalRequests: this.metrics.requestCount,
          averageResponseTime: this.metrics.averageOperationTime,
          errorRate: 1.0,
          cacheHitRate: 0
        },
        timestamp: Date.now()
      };
    }
  }

  // =============================================================================
  // 📊 METRICS & MONITORING
  // =============================================================================

  public recordOperation(operationTime: number, success: boolean, cacheHit: boolean = false): void {
    if (!this.config.enableMetrics) return;

    this.metrics.requestCount++;
    
    if (success) {
      this.operationTimes.push(operationTime);
      if (this.operationTimes.length > this.MAX_OPERATION_HISTORY) {
        this.operationTimes.shift();
      }
      
      this.metrics.averageOperationTime = this.operationTimes.reduce((a, b) => a + b, 0) / this.operationTimes.length;
      
      if (cacheHit) {
        this.metrics.cacheHits++;
      } else {
        this.metrics.cacheMisses++;
      }
    } else {
      this.metrics.errorCount++;
    }

    // 🔍 ESTIMATE MEMORY USAGE
    this.metrics.memoryUsage = this.estimateMemoryUsage();

    if (this.config.logLevel === 'debug') {
      this.logger.info('Operation recorded', LogCategory.PERFORMANCE, {
        metadata: {
          operationTime,
          success,
          cacheHit,
          totalRequests: this.metrics.requestCount,
          errorRate: this.calculateErrorRate()
        }
      });
    }
  }

  public getMetrics(): UIContainerMetrics {
    return { ...this.metrics };
  }

  private calculateCacheHitRate(): number {
    const totalCacheOperations = this.metrics.cacheHits + this.metrics.cacheMisses;
    return totalCacheOperations > 0 ? this.metrics.cacheHits / totalCacheOperations : 0;
  }

  private calculateErrorRate(): number {
    return this.metrics.requestCount > 0 ? this.metrics.errorCount / this.metrics.requestCount : 0;
  }

  private estimateMemoryUsage(): number {
    // 🔍 ROUGH ESTIMATION: Base container + services + operation history
    const baseSize = 1024; // 1KB base
    const servicesSize = this.metrics.serviceInstances * 512; // 512B per service
    const historySize = this.operationTimes.length * 8; // 8B per number
    
    return baseSize + servicesSize + historySize;
  }

  // =============================================================================
  // 🧹 CLEANUP & MAINTENANCE
  // =============================================================================

  public clearCache(): void {
    // Clear operation history
    this.operationTimes = [];
    
    // Reset cache metrics
    this.metrics.cacheHits = 0;
    this.metrics.cacheMisses = 0;

    this.logger.info('Container cache cleared', LogCategory.INFRASTRUCTURE, {
      metadata: {
        previousCacheSize: this.operationTimes.length
      }
    });
  }

  public updateConfig(newConfig: Partial<UIContainerConfig>): void {
    const oldConfig = { ...this.config };
    this.config = { ...this.config, ...newConfig };

    this.logger.info('Container configuration updated', LogCategory.INFRASTRUCTURE, {
      metadata: {
        oldConfig,
        newConfig: this.config,
        changedKeys: Object.keys(newConfig)
      }
    });

    // Force service recreation if storage provider changed
    if (newConfig.storage?.provider && newConfig.storage.provider !== oldConfig.storage.provider) {
      this.services = null;
      this.logger.info('Services will be recreated due to storage provider change', LogCategory.INFRASTRUCTURE);
    }
  }

  public dispose(): void {
    this.services = null;
    this.operationTimes = [];
    this.metrics = {
      serviceInstances: 0,
      memoryUsage: 0,
      requestCount: 0,
      errorCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageOperationTime: 0
    };

    this.logger.info('UI Preferences DI Container disposed', LogCategory.INFRASTRUCTURE);
  }
}

// =============================================================================
// 🎯 EXPORTS & FACTORY
// =============================================================================

export const uiPreferencesDIContainer = UIPreferencesDIContainer.getInstance();

export function createUIPreferencesContainer(config?: Partial<UIContainerConfig>): UIPreferencesDIContainer {
  return UIPreferencesDIContainer.getInstance(config);
}

export function getUIPreferencesServices(): UIPreferencesServices {
  return uiPreferencesDIContainer.getServices();
}

// 🧪 TESTING UTILITIES
export function resetUIPreferencesContainer(): void {
  UIPreferencesDIContainer.resetInstance();
}

export function createTestUIPreferencesContainer(
  mockRepository?: IUIPreferencesRepository
): UIPreferencesServices {
  if (mockRepository) {
    // For testing: inject mock repository
    const trackUIInteractionUseCase = new TrackUIInteractionUseCase(mockRepository);
    const manageUIPreferencesUseCase = new ManageUIPreferencesUseCase(mockRepository);

    return {
      uiPreferencesRepository: mockRepository,
      trackUIInteractionUseCase,
      manageUIPreferencesUseCase,
      healthCheck: async () => ({
        isHealthy: true,
        services: { repository: true, useCases: true, storage: true },
        metrics: { totalRequests: 0, averageResponseTime: 0, errorRate: 0, cacheHitRate: 1 },
        timestamp: Date.now()
      }),
      clearCache: () => {},
      getMetrics: () => ({
        serviceInstances: 2,
        memoryUsage: 1024,
        requestCount: 0,
        errorCount: 0,
        cacheHits: 0,
        cacheMisses: 0,
        averageOperationTime: 0
      })
    };
  }

  return uiPreferencesDIContainer.getServices();
}

export { UIPreferencesDIContainer };