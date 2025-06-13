/**
 * @fileoverview Profile Completeness DI Container - Enterprise Dependency Injection
 * 
 * ✅ ENTERPRISE DI CONTAINER:
 * - Singleton pattern for service management
 * - Health monitoring with service status tracking
 * - Performance metrics collection for all services
 * - Testing support with mock injection capabilities
 * - Service lifecycle management with initialization/disposal
 */

import {
  IProfileCompletenessRepository
} from '../../domain/interfaces/profile-completeness-repository.interface';
import { ProfileCompletenessRepositoryImpl } from '../../data/repositories/profile-completeness-repository.impl';
import { CalculateProfileCompletenessUseCase } from '../../application/use-cases/completeness/calculate-profile-completeness.use-case';
import { GenerateCompletionRecommendationsUseCase } from '../../application/use-cases/completeness/generate-completion-recommendations.use-case';
import { TrackCompletionProgressUseCase } from '../../application/use-cases/completeness/track-completion-progress.use-case';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// 🎯 SERVICE INTERFACES
export interface ProfileCompletenessServices {
  repository: IProfileCompletenessRepository;
  calculateCompletenessUseCase: CalculateProfileCompletenessUseCase;
  generateRecommendationsUseCase: GenerateCompletionRecommendationsUseCase;
  trackProgressUseCase: TrackCompletionProgressUseCase;
}

export interface ServiceHealthStatus {
  serviceName: string;
  isHealthy: boolean;
  lastChecked: number;
  errorCount: number;
  averageResponseTime: number;
  totalOperations: number;
  uptime: number;
}

export interface ContainerMetrics {
  totalServices: number;
  healthyServices: number;
  totalOperations: number;
  averageResponseTime: number;
  memoryUsage: number;
  cacheEfficiency: number;
  errorRate: number;
  uptime: number;
}

export interface ContainerConfiguration {
  enableHealthMonitoring: boolean;
  enableMetricsCollection: boolean;
  enableCaching: boolean;
  healthCheckInterval: number; // milliseconds
  maxErrorThreshold: number;
  performanceAlertThreshold: number; // milliseconds
}

export class ProfileCompletenessDIContainer {
  private static instance: ProfileCompletenessDIContainer | null = null;
  private readonly logger = LoggerFactory.createServiceLogger('ProfileCompletenessDIContainer');
  
  // 🏗️ SERVICE INSTANCES
  private repository: IProfileCompletenessRepository | null = null;
  private calculateCompletenessUseCase: CalculateProfileCompletenessUseCase | null = null;
  private generateRecommendationsUseCase: GenerateCompletionRecommendationsUseCase | null = null;
  private trackProgressUseCase: TrackCompletionProgressUseCase | null = null;
  
  // 📊 HEALTH & METRICS
  private serviceHealth = new Map<string, ServiceHealthStatus>();
  private containerMetrics: ContainerMetrics;
  private readonly startTime = Date.now();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  
  // 🔧 CONFIGURATION
  private readonly config: ContainerConfiguration = {
    enableHealthMonitoring: true,
    enableMetricsCollection: true,
    enableCaching: true,
    healthCheckInterval: 30000, // 30 seconds
    maxErrorThreshold: 10,
    performanceAlertThreshold: 2000 // 2 seconds
  };

  // 🧪 TESTING SUPPORT
  private mockServices = new Map<string, any>();
  private isTestMode = false;

  private constructor(configuration?: Partial<ContainerConfiguration>) {
    if (configuration) {
      this.config = { ...this.config, ...configuration };
    }

    this.containerMetrics = {
      totalServices: 0,
      healthyServices: 0,
      totalOperations: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      cacheEfficiency: 0,
      errorRate: 0,
      uptime: 0
    };

    this.initializeHealthMonitoring();
    
    this.logger.info('Profile Completeness DI Container initialized', LogCategory.INFRASTRUCTURE, {
      metadata: {
        enableHealthMonitoring: this.config.enableHealthMonitoring,
        enableMetricsCollection: this.config.enableMetricsCollection,
        healthCheckInterval: this.config.healthCheckInterval
      }
    });
  }

  // =============================================================================
  // 🎯 SINGLETON PATTERN
  // =============================================================================

  public static getInstance(configuration?: Partial<ContainerConfiguration>): ProfileCompletenessDIContainer {
    if (!ProfileCompletenessDIContainer.instance) {
      ProfileCompletenessDIContainer.instance = new ProfileCompletenessDIContainer(configuration);
    }
    return ProfileCompletenessDIContainer.instance;
  }

  public static resetInstance(): void {
    if (ProfileCompletenessDIContainer.instance) {
      ProfileCompletenessDIContainer.instance.dispose();
      ProfileCompletenessDIContainer.instance = null;
    }
  }

  // =============================================================================
  // 🎯 SERVICE MANAGEMENT
  // =============================================================================

  public getServices(): ProfileCompletenessServices {
    const startTime = Date.now();
    
    try {
      const services: ProfileCompletenessServices = {
        repository: this.getRepository(),
        calculateCompletenessUseCase: this.getCalculateCompletenessUseCase(),
        generateRecommendationsUseCase: this.getGenerateRecommendationsUseCase(),
        trackProgressUseCase: this.getTrackProgressUseCase()
      };

      this.recordServiceMetric('getServices', Date.now() - startTime, true);
      
      this.logger.info('Profile Completeness services retrieved successfully', LogCategory.INFRASTRUCTURE, {
        metadata: {
          servicesCount: Object.keys(services).length,
          retrievalTime: Date.now() - startTime
        }
      });

      return services;
    } catch (error) {
      this.recordServiceMetric('getServices', Date.now() - startTime, false);
      this.logger.error('Failed to retrieve Profile Completeness services', LogCategory.INFRASTRUCTURE, {}, error as Error);
      throw error;
    }
  }

  private getRepository(): IProfileCompletenessRepository {
    if (!this.repository) {
      const startTime = Date.now();
      
      try {
        // 🧪 TESTING SUPPORT
        if (this.isTestMode && this.mockServices.has('repository')) {
          this.repository = this.mockServices.get('repository');
        } else {
          this.repository = new ProfileCompletenessRepositoryImpl();
        }

        this.initializeServiceHealth('repository');
        this.recordServiceMetric('repository_creation', Date.now() - startTime, true);
        
        this.logger.info('Profile Completeness Repository initialized', LogCategory.INFRASTRUCTURE, {
          metadata: {
            isTestMode: this.isTestMode,
            initializationTime: Date.now() - startTime
          }
        });
      } catch (error) {
        this.recordServiceMetric('repository_creation', Date.now() - startTime, false);
        this.logger.error('Failed to initialize Profile Completeness Repository', LogCategory.INFRASTRUCTURE, {}, error as Error);
        throw error;
      }
    }

    if (!this.repository) {
      throw new Error('Repository initialization failed');
    }
    
    return this.repository;
  }

  private getCalculateCompletenessUseCase(): CalculateProfileCompletenessUseCase {
    if (!this.calculateCompletenessUseCase) {
      const startTime = Date.now();
      
      try {
        // 🧪 TESTING SUPPORT
        if (this.isTestMode && this.mockServices.has('calculateCompletenessUseCase')) {
          this.calculateCompletenessUseCase = this.mockServices.get('calculateCompletenessUseCase');
        } else {
          const repository = this.getRepository();
          this.calculateCompletenessUseCase = new CalculateProfileCompletenessUseCase(repository);
        }

        this.initializeServiceHealth('calculateCompletenessUseCase');
        this.recordServiceMetric('calculate_use_case_creation', Date.now() - startTime, true);
        
        this.logger.info('Calculate Profile Completeness Use Case initialized', LogCategory.INFRASTRUCTURE, {
          metadata: {
            isTestMode: this.isTestMode,
            initializationTime: Date.now() - startTime
          }
        });
      } catch (error) {
        this.recordServiceMetric('calculate_use_case_creation', Date.now() - startTime, false);
        this.logger.error('Failed to initialize Calculate Profile Completeness Use Case', LogCategory.INFRASTRUCTURE, {}, error as Error);
        throw error;
      }
    }

    if (!this.calculateCompletenessUseCase) {
      throw new Error('Calculate Completeness Use Case initialization failed');
    }
    
    return this.calculateCompletenessUseCase;
  }

  private getGenerateRecommendationsUseCase(): GenerateCompletionRecommendationsUseCase {
    if (!this.generateRecommendationsUseCase) {
      const startTime = Date.now();
      
      try {
        // 🧪 TESTING SUPPORT
        if (this.isTestMode && this.mockServices.has('generateRecommendationsUseCase')) {
          this.generateRecommendationsUseCase = this.mockServices.get('generateRecommendationsUseCase');
        } else {
          const repository = this.getRepository();
          this.generateRecommendationsUseCase = new GenerateCompletionRecommendationsUseCase(repository);
        }

        this.initializeServiceHealth('generateRecommendationsUseCase');
        this.recordServiceMetric('recommendations_use_case_creation', Date.now() - startTime, true);
        
        this.logger.info('Generate Completion Recommendations Use Case initialized', LogCategory.INFRASTRUCTURE, {
          metadata: {
            isTestMode: this.isTestMode,
            initializationTime: Date.now() - startTime
          }
        });
      } catch (error) {
        this.recordServiceMetric('recommendations_use_case_creation', Date.now() - startTime, false);
        this.logger.error('Failed to initialize Generate Completion Recommendations Use Case', LogCategory.INFRASTRUCTURE, {}, error as Error);
        throw error;
      }
    }

    if (!this.generateRecommendationsUseCase) {
      throw new Error('Generate Recommendations Use Case initialization failed');
    }
    
    return this.generateRecommendationsUseCase;
  }

  private getTrackProgressUseCase(): TrackCompletionProgressUseCase {
    if (!this.trackProgressUseCase) {
      const startTime = Date.now();
      
      try {
        // 🧪 TESTING SUPPORT
        if (this.isTestMode && this.mockServices.has('trackProgressUseCase')) {
          this.trackProgressUseCase = this.mockServices.get('trackProgressUseCase');
        } else {
          const repository = this.getRepository();
          this.trackProgressUseCase = new TrackCompletionProgressUseCase(repository);
        }

        this.initializeServiceHealth('trackProgressUseCase');
        this.recordServiceMetric('track_progress_use_case_creation', Date.now() - startTime, true);
        
        this.logger.info('Track Completion Progress Use Case initialized', LogCategory.INFRASTRUCTURE, {
          metadata: {
            isTestMode: this.isTestMode,
            initializationTime: Date.now() - startTime
          }
        });
      } catch (error) {
        this.recordServiceMetric('track_progress_use_case_creation', Date.now() - startTime, false);
        this.logger.error('Failed to initialize Track Completion Progress Use Case', LogCategory.INFRASTRUCTURE, {}, error as Error);
        throw error;
      }
    }

    if (!this.trackProgressUseCase) {
      throw new Error('Track Progress Use Case initialization failed');
    }
    
    return this.trackProgressUseCase;
  }

  // =============================================================================
  // 📊 HEALTH MONITORING
  // =============================================================================

  public async checkHealth(): Promise<{
    isHealthy: boolean;
    services: ServiceHealthStatus[];
    container: ContainerMetrics;
    lastUpdated: number;
  }> {
    const startTime = Date.now();
    
    try {
      // 🔍 CHECK REPOSITORY HEALTH
      const repository = this.getRepository();
      const repositoryHealth = await repository.checkRepositoryHealth();
      
      this.updateServiceHealth('repository', repositoryHealth.isHealthy, 0);

      // 📊 UPDATE CONTAINER METRICS
      this.updateContainerMetrics();

      const services = Array.from(this.serviceHealth.values());
      const healthyServices = services.filter(s => s.isHealthy);
      const isHealthy = healthyServices.length === services.length && repositoryHealth.isHealthy;

      const result = {
        isHealthy,
        services,
        container: this.containerMetrics,
        lastUpdated: Date.now()
      };

      this.logger.info('Health check completed', LogCategory.INFRASTRUCTURE, {
        metadata: {
          isHealthy,
          totalServices: services.length,
          healthyServices: healthyServices.length,
          checkDuration: Date.now() - startTime
        }
      });

      return result;
    } catch (error) {
      this.logger.error('Health check failed', LogCategory.INFRASTRUCTURE, {}, error as Error);
      
      return {
        isHealthy: false,
        services: Array.from(this.serviceHealth.values()),
        container: this.containerMetrics,
        lastUpdated: Date.now()
      };
    }
  }

  public getMetrics(): ContainerMetrics {
    this.updateContainerMetrics();
    return { ...this.containerMetrics };
  }

  private initializeHealthMonitoring(): void {
    if (!this.config.enableHealthMonitoring) return;

    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performPeriodicHealthCheck();
      } catch (error) {
        this.logger.error('Periodic health check failed', LogCategory.INFRASTRUCTURE, {}, error as Error);
      }
    }, this.config.healthCheckInterval);
  }

  private async performPeriodicHealthCheck(): Promise<void> {
    const healthStatus = await this.checkHealth();
    
    // 🚨 ALERT ON UNHEALTHY SERVICES
    if (!healthStatus.isHealthy) {
      const unhealthyServices = healthStatus.services.filter(s => !s.isHealthy);
      
      this.logger.warn('Unhealthy services detected', LogCategory.INFRASTRUCTURE, {
        metadata: {
          unhealthyCount: unhealthyServices.length,
          unhealthyServices: unhealthyServices.map(s => s.serviceName)
        }
      });
    }

    // ⚡ PERFORMANCE ALERTS
    if (healthStatus.container.averageResponseTime > this.config.performanceAlertThreshold) {
      this.logger.warn('Performance threshold exceeded', LogCategory.INFRASTRUCTURE, {
        metadata: {
          averageResponseTime: healthStatus.container.averageResponseTime,
          threshold: this.config.performanceAlertThreshold
        }
      });
    }
  }

  private initializeServiceHealth(serviceName: string): void {
    this.serviceHealth.set(serviceName, {
      serviceName,
      isHealthy: true,
      lastChecked: Date.now(),
      errorCount: 0,
      averageResponseTime: 0,
      totalOperations: 0,
      uptime: Date.now() - this.startTime
    });
  }

  private updateServiceHealth(serviceName: string, isHealthy: boolean, responseTime: number): void {
    const current = this.serviceHealth.get(serviceName);
    if (!current) return;

    const updated: ServiceHealthStatus = {
      ...current,
      isHealthy,
      lastChecked: Date.now(),
      averageResponseTime: (current.averageResponseTime + responseTime) / 2,
      totalOperations: current.totalOperations + 1,
      uptime: Date.now() - this.startTime
    };

    if (!isHealthy) {
      updated.errorCount++;
    }

    this.serviceHealth.set(serviceName, updated);
  }

  private updateContainerMetrics(): void {
    const services = Array.from(this.serviceHealth.values());
    const healthyServices = services.filter(s => s.isHealthy);
    
    const totalOperations = services.reduce((sum, s) => sum + s.totalOperations, 0);
    const avgResponseTime = services.length > 0 
      ? services.reduce((sum, s) => sum + s.averageResponseTime, 0) / services.length 
      : 0;
    
    const totalErrors = services.reduce((sum, s) => sum + s.errorCount, 0);
    const errorRate = totalOperations > 0 ? totalErrors / totalOperations : 0;

    this.containerMetrics = {
      totalServices: services.length,
      healthyServices: healthyServices.length,
      totalOperations,
      averageResponseTime: avgResponseTime,
      memoryUsage: this.estimateMemoryUsage(),
      cacheEfficiency: 0.85, // Would be calculated from actual cache metrics
      errorRate,
      uptime: Date.now() - this.startTime
    };
  }

  private estimateMemoryUsage(): number {
    // 📊 SIMPLIFIED MEMORY ESTIMATION
    let memoryUsage = 0;
    
    memoryUsage += this.serviceHealth.size * 1024; // Health tracking
    memoryUsage += this.mockServices.size * 2048; // Mock services
    
    // Service instances memory
    if (this.repository) memoryUsage += 5120; // 5KB estimate
    if (this.calculateCompletenessUseCase) memoryUsage += 2048; // 2KB estimate
    if (this.generateRecommendationsUseCase) memoryUsage += 3072; // 3KB estimate
    if (this.trackProgressUseCase) memoryUsage += 2048; // 2KB estimate
    
    return memoryUsage;
  }

  private recordServiceMetric(operation: string, duration: number, success: boolean): void {
    if (!this.config.enableMetricsCollection) return;

    this.containerMetrics.totalOperations++;
    this.containerMetrics.averageResponseTime = 
      (this.containerMetrics.averageResponseTime + duration) / 2;

    if (!success) {
      // Update error rate
      const totalErrors = this.containerMetrics.totalOperations * this.containerMetrics.errorRate + 1;
      this.containerMetrics.errorRate = totalErrors / this.containerMetrics.totalOperations;
    }
  }

  // =============================================================================
  // 🧪 TESTING SUPPORT
  // =============================================================================

  public enableTestMode(): void {
    this.isTestMode = true;
    this.logger.info('Test mode enabled for Profile Completeness DI Container', LogCategory.INFRASTRUCTURE);
  }

  public disableTestMode(): void {
    this.isTestMode = false;
    this.mockServices.clear();
    this.logger.info('Test mode disabled for Profile Completeness DI Container', LogCategory.INFRASTRUCTURE);
  }

  public injectMockService(serviceName: keyof ProfileCompletenessServices, mockService: any): void {
    if (!this.isTestMode) {
      throw new Error('Mock services can only be injected in test mode');
    }
    
    this.mockServices.set(serviceName, mockService);
    
    this.logger.info('Mock service injected', LogCategory.INFRASTRUCTURE, {
      metadata: { serviceName, isTestMode: this.isTestMode }
    });
  }

  public clearMockServices(): void {
    this.mockServices.clear();
    this.logger.info('Mock services cleared', LogCategory.INFRASTRUCTURE);
  }

  // =============================================================================
  // 🔧 LIFECYCLE MANAGEMENT
  // =============================================================================

  public async initialize(): Promise<void> {
    const startTime = Date.now();
    
    try {
      this.logger.info('Initializing Profile Completeness DI Container', LogCategory.INFRASTRUCTURE);

      // 🚀 PRE-INITIALIZE CORE SERVICES
      this.getRepository();
      this.getCalculateCompletenessUseCase();
      this.getGenerateRecommendationsUseCase();
      this.getTrackProgressUseCase();

      // 📊 INITIAL HEALTH CHECK
      await this.checkHealth();

      this.logger.info('Profile Completeness DI Container initialized successfully', LogCategory.INFRASTRUCTURE, {
        metadata: {
          initializationTime: Date.now() - startTime,
          totalServices: this.serviceHealth.size
        }
      });
    } catch (error) {
      this.logger.error('Failed to initialize Profile Completeness DI Container', LogCategory.INFRASTRUCTURE, {}, error as Error);
      throw error;
    }
  }

  public dispose(): void {
    try {
      // 🧹 CLEANUP HEALTH MONITORING
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = null;
      }

      // 🗑️ CLEAR SERVICES
      this.repository = null;
      this.calculateCompletenessUseCase = null;
      this.generateRecommendationsUseCase = null;
      this.trackProgressUseCase = null;

      // 🧹 CLEAR MAPS
      this.serviceHealth.clear();
      this.mockServices.clear();

      this.logger.info('Profile Completeness DI Container disposed successfully', LogCategory.INFRASTRUCTURE, {
        metadata: {
          uptime: Date.now() - this.startTime
        }
      });
    } catch (error) {
      this.logger.error('Error during Profile Completeness DI Container disposal', LogCategory.INFRASTRUCTURE, {}, error as Error);
    }
  }

  // =============================================================================
  // 🔧 CONFIGURATION MANAGEMENT
  // =============================================================================

  public updateConfiguration(config: Partial<ContainerConfiguration>): void {
    const oldConfig = { ...this.config };
    Object.assign(this.config, config);

    // 🔄 RESTART HEALTH MONITORING IF INTERVAL CHANGED
    if (config.healthCheckInterval && config.healthCheckInterval !== oldConfig.healthCheckInterval) {
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }
      this.initializeHealthMonitoring();
    }

    this.logger.info('Container configuration updated', LogCategory.INFRASTRUCTURE, {
      metadata: {
        oldConfig,
        newConfig: this.config
      }
    });
  }

  public getConfiguration(): ContainerConfiguration {
    return { ...this.config };
  }

  // =============================================================================
  // 📊 DEBUGGING & DIAGNOSTICS
  // =============================================================================

  public getDiagnostics(): {
    isInitialized: boolean;
    serviceInstances: Record<string, boolean>;
    healthStatus: Record<string, ServiceHealthStatus>;
    configuration: ContainerConfiguration;
    metrics: ContainerMetrics;
    memoryFootprint: number;
  } {
    return {
      isInitialized: this.serviceHealth.size > 0,
      serviceInstances: {
        repository: !!this.repository,
        calculateCompletenessUseCase: !!this.calculateCompletenessUseCase,
        generateRecommendationsUseCase: !!this.generateRecommendationsUseCase,
        trackProgressUseCase: !!this.trackProgressUseCase
      },
      healthStatus: Object.fromEntries(this.serviceHealth.entries()),
      configuration: this.config,
      metrics: this.containerMetrics,
      memoryFootprint: this.estimateMemoryUsage()
    };
  }
}