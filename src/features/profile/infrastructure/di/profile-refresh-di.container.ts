/**
 * @fileoverview Profile Refresh DI Container - Enterprise Dependency Injection
 * 
 * ✅ ENTERPRISE DI CONTAINER:
 * - Service Registration & Resolution
 * - Singleton Pattern Management
 * - Health Monitoring Integration
 * - Feature Flag Management
 * - A/B Testing Support
 * - Environment-Specific Configuration
 * - Mock/Test Service Injection
 * - Performance Metrics Collection
 * 
 * @module ProfileRefreshDIContainer
 * @since 3.0.0 (Enterprise Clean Architecture)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Infrastructure (DI Container)
 * @architecture Clean Architecture - Infrastructure Layer
 */

import { Result } from '@core/types/result.type';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Repository Interfaces & Implementations
import { ProfileRefreshRepositoryInterface } from '../../domain/repositories/profile-refresh-repository.interface';
import { ProfileRefreshRepositoryImpl } from '../../data/repositories/profile-refresh-repository.impl';

// Use Cases
import { ManageProfileRefreshUseCase } from '../../application/use-cases/refresh/manage-profile-refresh.use-case';
import { RefreshAnalyticsUseCase } from '../../application/use-cases/refresh-analytics/refresh-analytics.use-case';
import { RefreshHealthMonitoringUseCase } from '../../application/use-cases/refresh-analytics/refresh-health-monitoring.use-case';

// Entities
import { RefreshAnalyticsEntity } from '../../domain/entities/refresh/refresh-analytics.entity';
import { RefreshHealthEntity } from '../../domain/entities/refresh/refresh-health.entity';

const logger = LoggerFactory.createServiceLogger('ProfileRefreshDIContainer');

// =============================================================================
// SERVICE TYPES & INTERFACES
// =============================================================================

export type ServiceType = 
  | 'repository'
  | 'use_case'
  | 'service'
  | 'factory'
  | 'singleton'
  | 'transient';

export type ServiceScope = 'singleton' | 'transient' | 'scoped';

export type EnvironmentType = 'development' | 'staging' | 'production' | 'test';

export interface ServiceRegistration<T = any> {
  name: string;
  type: ServiceType;
  scope: ServiceScope;
  factory: () => T;
  dependencies: string[];
  instance?: T;
  metadata: ServiceMetadata;
}

export interface ServiceMetadata {
  version: string;
  description: string;
  tags: string[];
  healthCheckEnabled: boolean;
  performanceMonitoringEnabled: boolean;
  fallbackService?: string;
  configurationKeys: string[];
}

export interface ServiceHealth {
  serviceName: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  responseTime: number;
  errorCount: number;
  metadata: Record<string, any>;
}

export interface ContainerConfiguration {
  environment: EnvironmentType;
  enableHealthMonitoring: boolean;
  enablePerformanceTracking: boolean;
  enableFeatureFlags: boolean;
  healthCheckInterval: number;
  metricsCollectionInterval: number;
  maxServiceInstances: number;
  serviceTimeout: number;
}

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  rolloutPercentage: number;
  conditions: FlagCondition[];
  metadata: Record<string, any>;
}

export interface FlagCondition {
  type: 'user_segment' | 'environment' | 'date_range' | 'custom';
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: any;
}

export interface ABTestConfig {
  experimentId: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  trafficAllocation: number;
  variants: ABTestVariant[];
  startDate: number;
  endDate: number;
  targetMetrics: string[];
}

export interface ABTestVariant {
  variantId: string;
  name: string;
  trafficPercentage: number;
  serviceOverrides: Record<string, any>;
}

export interface PerformanceMetrics {
  serviceName: string;
  operationName: string;
  executionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  timestamp: number;
  success: boolean;
  errorType?: string;
}

export interface ContainerStats {
  totalServices: number;
  healthyServices: number;
  unhealthyServices: number;
  averageResponseTime: number;
  totalOperations: number;
  errorRate: number;
  memoryUsage: number;
  uptime: number;
}

// =============================================================================
// MAIN DI CONTAINER IMPLEMENTATION
// =============================================================================

export class ProfileRefreshDIContainer {
  private static instance: ProfileRefreshDIContainer;
  private services = new Map<string, ServiceRegistration>();
  private serviceInstances = new Map<string, any>();
  private serviceHealth = new Map<string, ServiceHealth>();
  private performanceMetrics: PerformanceMetrics[] = [];
  private featureFlags = new Map<string, FeatureFlag>();
  private abTests = new Map<string, ABTestConfig>();
  
  private configuration: ContainerConfiguration;
  private healthCheckInterval?: NodeJS.Timeout;
  private metricsCollectionInterval?: NodeJS.Timeout;
  private startTime: number;

  private constructor(config?: Partial<ContainerConfiguration>) {
    this.startTime = Date.now();
    this.configuration = {
      environment: 'development',
      enableHealthMonitoring: true,
      enablePerformanceTracking: true,
      enableFeatureFlags: true,
      healthCheckInterval: 30000, // 30 seconds
      metricsCollectionInterval: 60000, // 1 minute
      maxServiceInstances: 1000,
      serviceTimeout: 5000, // 5 seconds
      ...config
    };

    this.initializeDefaultServices();
    this.setupHealthMonitoring();
    this.setupPerformanceTracking();
    this.loadFeatureFlags();
    this.loadABTests();

    logger.info('DI Container initialized', LogCategory.INFRASTRUCTURE, {
      service: 'ProfileRefreshDI',
      metadata: { environment: this.configuration.environment }
    });
  }

  /**
   * Get singleton instance of the DI Container
   */
  public static getInstance(config?: Partial<ContainerConfiguration>): ProfileRefreshDIContainer {
    if (!ProfileRefreshDIContainer.instance) {
      ProfileRefreshDIContainer.instance = new ProfileRefreshDIContainer(config);
    }
    return ProfileRefreshDIContainer.instance;
  }

  /**
   * Reset singleton instance (mainly for testing)
   */
  public static resetInstance(): void {
    if (ProfileRefreshDIContainer.instance) {
      ProfileRefreshDIContainer.instance.shutdown();
      ProfileRefreshDIContainer.instance = null as any;
    }
  }

  // =============================================================================
  // SERVICE REGISTRATION & RESOLUTION
  // =============================================================================

  /**
   * Register a service in the container
   */
  public registerService<T>(registration: ServiceRegistration<T>): void {
    try {
      // Validate registration
      this.validateServiceRegistration(registration);
      
      // Store service registration
      this.services.set(registration.name, registration);
      
      // Initialize health monitoring if enabled
      if (registration.metadata.healthCheckEnabled) {
        this.serviceHealth.set(registration.name, {
          serviceName: registration.name,
          status: 'healthy',
          lastCheck: Date.now(),
          responseTime: 0,
          errorCount: 0,
          metadata: {}
        });
      }

      logger.info('Service registered successfully', LogCategory.INFRASTRUCTURE, {
        metadata: { serviceName: registration.name }
      });

    } catch (error) {
      logger.error('Failed to register service', LogCategory.BUSINESS, {
        metadata: { serviceName: registration.name }
      }, error as Error);
      throw error;
    }
  }

  /**
   * Resolve a service instance
   */
  public getService<T>(serviceName: string): T {
    const startTime = Date.now();
    
    try {
      const registration = this.services.get(serviceName);
      if (!registration) {
        throw new Error(`Service '${serviceName}' not found in container`);
      }

      // Check if service should be available based on feature flags
      if (!this.isServiceEnabled(serviceName)) {
        const fallbackService = registration.metadata.fallbackService;
        if (fallbackService && this.services.has(fallbackService)) {
          logger.warn('Service disabled by feature flag, using fallback', LogCategory.BUSINESS, {
            metadata: { serviceName, fallbackService }
          });
          return this.getService<T>(fallbackService);
        }
        throw new Error(`Service '${serviceName}' is disabled by feature flag`);
      }

      // Apply A/B test overrides if applicable
      const testOverrides = this.getABTestOverrides(serviceName);

      let instance: T;

      if (registration.scope === 'singleton') {
        // Return existing instance or create new one
        if (!this.serviceInstances.has(serviceName)) {
          instance = this.createServiceInstance<T>(registration, testOverrides);
          this.serviceInstances.set(serviceName, instance);
        } else {
          instance = this.serviceInstances.get(serviceName);
        }
      } else if (registration.scope === 'transient') {
        // Always create new instance
        instance = this.createServiceInstance<T>(registration, testOverrides);
      } else {
        // Scoped instances (simplified to singleton for this implementation)
        instance = this.getService<T>(serviceName);
      }

      // Record performance metrics
      if (this.configuration.enablePerformanceTracking && registration.metadata.performanceMonitoringEnabled) {
        this.recordPerformanceMetric({
          serviceName,
          operationName: 'service_resolution',
          executionTime: Date.now() - startTime,
          memoryUsage: this.getMemoryUsage(),
          cpuUsage: 0, // Simplified
          timestamp: Date.now(),
          success: true
        });
      }

      logger.debug('Service resolved', LogCategory.INFRASTRUCTURE, {
        service: 'ProfileRefreshDI',
        metadata: { serviceName: registration.name }
      });

      return instance;

    } catch (error) {
      // Record error metrics
      if (this.configuration.enablePerformanceTracking) {
        this.recordPerformanceMetric({
          serviceName,
          operationName: 'service_resolution',
          executionTime: Date.now() - startTime,
          memoryUsage: this.getMemoryUsage(),
          cpuUsage: 0,
          timestamp: Date.now(),
          success: false,
          errorType: (error as Error).name
        });
      }

      logger.error('Health check failed', LogCategory.BUSINESS, {
        service: 'ProfileRefreshDI',
        metadata: { serviceName }
      });
      throw error;
    }
  }

  /**
   * Check if a service is registered
   */
  public hasService(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  /**
   * Get all registered service names
   */
  public getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  // =============================================================================
  // HEALTH MONITORING
  // =============================================================================

  /**
   * Get health status of a specific service
   */
  public getServiceHealth(serviceName: string): ServiceHealth | null {
    return this.serviceHealth.get(serviceName) || null;
  }

  /**
   * Get health status of all services
   */
  public getAllServiceHealth(): Record<string, ServiceHealth> {
    const health: Record<string, ServiceHealth> = {};
    this.serviceHealth.forEach((value, key) => {
      health[key] = value;
    });
    return health;
  }

  /**
   * Perform health check on a specific service
   */
  public async performHealthCheck(serviceName: string): Promise<Result<ServiceHealth>> {
    try {
      const registration = this.services.get(serviceName);
      if (!registration || !registration.metadata.healthCheckEnabled) {
        return { isSuccess: false, error: `Health check not enabled for service '${serviceName}'` };
      }

      const startTime = Date.now();
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      const metadata: Record<string, any> = {};

      // Perform basic health check (simplified)
      try {
        const instance = this.getService(serviceName);
        
        // Check if instance has health check method
        if (instance && typeof (instance as any).healthCheck === 'function') {
          const healthResult = await (instance as any).healthCheck();
          status = healthResult.status || 'healthy';
          metadata.customHealth = healthResult;
        }
      } catch (error) {
        status = 'unhealthy';
        metadata.error = (error as Error).message;
      }

      const responseTime = Date.now() - startTime;
      const health: ServiceHealth = {
        serviceName,
        status,
        lastCheck: Date.now(),
        responseTime,
        errorCount: this.getServiceErrorCount(serviceName),
        metadata
      };

      this.serviceHealth.set(serviceName, health);

      logger.info('Feature flag evaluated', LogCategory.BUSINESS, {
        service: 'ProfileRefreshDI',
        metadata: { serviceName }
      });

      return { isSuccess: true, value: health };

    } catch (error) {
      logger.error('Health check failed', LogCategory.BUSINESS, {
        service: 'ProfileRefreshDI',
        metadata: { serviceName }
      }, error as Error);
      return { isSuccess: false, error: (error as Error).message };
    }
  }

  // =============================================================================
  // FEATURE FLAGS & A/B TESTING
  // =============================================================================

  /**
   * Check if a feature flag is enabled
   */
  public isFeatureFlagEnabled(flagName: string, context?: Record<string, any>): boolean {
    const flag = this.featureFlags.get(flagName);
    if (!flag) {
      return false;
    }

    if (!flag.enabled) {
      return false;
    }

    // Check rollout percentage
    if (Math.random() * 100 > flag.rolloutPercentage) {
      return false;
    }

    // Check conditions
    if (flag.conditions.length > 0 && context) {
      return this.evaluateConditions(flag.conditions, context);
    }

    return true;
  }

  /**
   * Get A/B test variant for a user
   */
  public getABTestVariant(experimentId: string, userId: string): ABTestVariant | null {
    const experiment = this.abTests.get(experimentId);
    if (!experiment || experiment.status !== 'running') {
      return null;
    }

    // Check if user is in the experiment
    const userHash = this.hashUserId(userId);
    if (userHash > experiment.trafficAllocation) {
      return null;
    }

    // Determine variant based on user hash
    let cumulativePercentage = 0;
    for (const variant of experiment.variants) {
      cumulativePercentage += variant.trafficPercentage;
      if (userHash <= cumulativePercentage) {
        return variant;
      }
    }

    return experiment.variants[0]; // Fallback to first variant
  }

  // =============================================================================
  // PERFORMANCE & METRICS
  // =============================================================================

  /**
   * Get container statistics
   */
  public getContainerStats(): ContainerStats {
    const healthyServices = Array.from(this.serviceHealth.values()).filter(h => h.status === 'healthy').length;
    const totalOperations = this.performanceMetrics.length;
    const successfulOperations = this.performanceMetrics.filter(m => m.success).length;
    const averageResponseTime = totalOperations > 0 
      ? this.performanceMetrics.reduce((sum, m) => sum + m.executionTime, 0) / totalOperations 
      : 0;

    return {
      totalServices: this.services.size,
      healthyServices,
      unhealthyServices: this.serviceHealth.size - healthyServices,
      averageResponseTime,
      totalOperations,
      errorRate: totalOperations > 0 ? (totalOperations - successfulOperations) / totalOperations : 0,
      memoryUsage: this.getMemoryUsage(),
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Get performance metrics for a specific service
   */
  public getServiceMetrics(serviceName: string, timeframe?: number): PerformanceMetrics[] {
    const cutoff = timeframe ? Date.now() - timeframe : 0;
    return this.performanceMetrics.filter(m => 
      m.serviceName === serviceName && m.timestamp >= cutoff
    );
  }

  // =============================================================================
  // CONTAINER LIFECYCLE
  // =============================================================================

  /**
   * Gracefully shutdown the container
   */
  public shutdown(): void {
    logger.info('Shutting down ProfileRefreshDIContainer', LogCategory.BUSINESS);

    // Clear intervals
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.metricsCollectionInterval) {
      clearInterval(this.metricsCollectionInterval);
    }

    // Shutdown services that support it
    this.serviceInstances.forEach((instance, serviceName) => {
      try {
        if (instance && typeof instance.shutdown === 'function') {
          instance.shutdown();
        }
      } catch (error) {
        logger.warn('Error shutting down service', LogCategory.BUSINESS, { 
          metadata: { serviceName }
        });
      }
    });

    // Clear all collections
    this.services.clear();
    this.serviceInstances.clear();
    this.serviceHealth.clear();
    this.performanceMetrics.length = 0;
    this.featureFlags.clear();
    this.abTests.clear();

    logger.info('Services cleared', LogCategory.INFRASTRUCTURE, {
      service: 'ProfileRefreshDI',
      metadata: { servicesCount: this.services.size }
    });
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  private initializeDefaultServices(): void {
    // Register Repository
    this.registerService<ProfileRefreshRepositoryInterface>({
      name: 'ProfileRefreshRepository',
      type: 'repository',
      scope: 'singleton',
      factory: () => new ProfileRefreshRepositoryImpl(),
      dependencies: [],
      metadata: {
        version: '3.0.0',
        description: 'Main repository for profile refresh operations',
        tags: ['repository', 'data', 'core'],
        healthCheckEnabled: true,
        performanceMonitoringEnabled: true,
        configurationKeys: ['database_url', 'cache_settings']
      }
    });

    // Register Main Use Case
    this.registerService<ManageProfileRefreshUseCase>({
      name: 'ManageProfileRefreshUseCase',
      type: 'use_case',
      scope: 'singleton',
      factory: () => new ManageProfileRefreshUseCase(),
      dependencies: ['ProfileRefreshRepository'],
      metadata: {
        version: '3.0.0',
        description: 'Primary use case for refresh management',
        tags: ['use_case', 'business_logic', 'core'],
        healthCheckEnabled: true,
        performanceMonitoringEnabled: true,
        configurationKeys: ['refresh_settings']
      }
    });

    // Register Analytics Use Case
    this.registerService<RefreshAnalyticsUseCase>({
      name: 'RefreshAnalyticsUseCase',
      type: 'use_case',
      scope: 'singleton',
      factory: () => {
        const repository = this.getService<ProfileRefreshRepositoryInterface>('ProfileRefreshRepository');
        return new RefreshAnalyticsUseCase(repository);
      },
      dependencies: ['ProfileRefreshRepository'],
      metadata: {
        version: '3.0.0',
        description: 'Analytics and business intelligence use case',
        tags: ['use_case', 'analytics', 'business_intelligence'],
        healthCheckEnabled: true,
        performanceMonitoringEnabled: true,
        configurationKeys: ['analytics_settings', 'ml_config']
      }
    });

    // Register Health Monitoring Use Case
    this.registerService<RefreshHealthMonitoringUseCase>({
      name: 'RefreshHealthMonitoringUseCase',
      type: 'use_case',
      scope: 'singleton',
      factory: () => {
        const repository = this.getService<ProfileRefreshRepositoryInterface>('ProfileRefreshRepository');
        return new RefreshHealthMonitoringUseCase(repository);
      },
      dependencies: ['ProfileRefreshRepository'],
      metadata: {
        version: '3.0.0',
        description: 'Health monitoring and incident management use case',
        tags: ['use_case', 'health', 'monitoring'],
        healthCheckEnabled: true,
        performanceMonitoringEnabled: true,
        configurationKeys: ['monitoring_settings', 'alert_thresholds']
      }
    });

    logger.info('Container services initialized successfully', LogCategory.INFRASTRUCTURE, {
      metadata: { servicesCount: this.services.size }
    });
  }

  private validateServiceRegistration<T>(registration: ServiceRegistration<T>): void {
    if (!registration.name) {
      throw new Error('Service registration must have a name');
    }
    if (this.services.has(registration.name)) {
      throw new Error(`Service '${registration.name}' is already registered`);
    }
    if (!registration.factory) {
      throw new Error('Service registration must have a factory function');
    }
    if (this.serviceInstances.size >= this.configuration.maxServiceInstances) {
      throw new Error('Maximum number of service instances reached');
    }
  }

  private createServiceInstance<T>(registration: ServiceRegistration<T>, overrides?: Record<string, any>): T {
    try {
      // Apply A/B test overrides if any
      const factory = overrides && overrides.factory ? overrides.factory : registration.factory;
      const instance = factory();

      logger.info('Service created successfully', LogCategory.INFRASTRUCTURE, {
        metadata: { serviceName: registration.name }
      });

      return instance;
    } catch (error) {
      logger.error('Service initialization failed', LogCategory.INFRASTRUCTURE, {
        metadata: { serviceName: registration.name }
      });
      throw error;
    }
  }

  private isServiceEnabled(serviceName: string): boolean {
    const flagName = `service_${serviceName.toLowerCase()}_enabled`;
    return this.isFeatureFlagEnabled(flagName, { service: serviceName });
  }

  private getABTestOverrides(serviceName: string): Record<string, any> {
    // Check all running experiments for service overrides
    const overrides: Record<string, any> = {};
    
    this.abTests.forEach((experiment) => {
      if (experiment.status === 'running') {
        // For simplicity, using a fixed user ID for demonstration
        const variant = this.getABTestVariant(experiment.experimentId, 'default_user');
        if (variant && variant.serviceOverrides[serviceName]) {
          Object.assign(overrides, variant.serviceOverrides[serviceName]);
        }
      }
    });

    return overrides;
  }

  private setupHealthMonitoring(): void {
    if (!this.configuration.enableHealthMonitoring) return;

    this.healthCheckInterval = setInterval(async () => {
      for (const serviceName of this.services.keys()) {
        const registration = this.services.get(serviceName);
        if (registration?.metadata.healthCheckEnabled) {
          await this.performHealthCheck(serviceName);
        }
      }
    }, this.configuration.healthCheckInterval);
  }

  private setupPerformanceTracking(): void {
    if (!this.configuration.enablePerformanceTracking) return;

    this.metricsCollectionInterval = setInterval(() => {
      // Cleanup old metrics (keep only last hour)
      const cutoff = Date.now() - (60 * 60 * 1000);
      this.performanceMetrics = this.performanceMetrics.filter(m => m.timestamp >= cutoff);
    }, this.configuration.metricsCollectionInterval);
  }

  private loadFeatureFlags(): void {
    // Load from configuration or external service
    // For demonstration, setting up some default flags
    this.featureFlags.set('advanced_analytics', {
      name: 'advanced_analytics',
      enabled: true,
      rolloutPercentage: 100,
      conditions: [],
      metadata: { description: 'Enable advanced analytics features' }
    });

    this.featureFlags.set('service_profilerefreshrepository_enabled', {
      name: 'service_profilerefreshrepository_enabled',
      enabled: true,
      rolloutPercentage: 100,
      conditions: [],
      metadata: { description: 'Enable Profile Refresh Repository service' }
    });
  }

  private loadABTests(): void {
    // Load from configuration or external service
    // For demonstration, setting up a sample A/B test
    this.abTests.set('refresh_optimization_001', {
      experimentId: 'refresh_optimization_001',
      name: 'Refresh Performance Optimization',
      status: 'running',
      trafficAllocation: 0.5, // 50% of users
      variants: [
        {
          variantId: 'control',
          name: 'Control',
          trafficPercentage: 0.5,
          serviceOverrides: {}
        },
        {
          variantId: 'optimized',
          name: 'Optimized',
          trafficPercentage: 0.5,
          serviceOverrides: {
            ProfileRefreshRepository: {
              cacheTimeout: 300000, // 5 minutes instead of default
              enablePredictivePreloading: true
            }
          }
        }
      ],
      startDate: Date.now() - (7 * 24 * 60 * 60 * 1000), // Started 7 days ago
      endDate: Date.now() + (7 * 24 * 60 * 60 * 1000), // Ends in 7 days
      targetMetrics: ['response_time', 'cache_hit_rate', 'user_satisfaction']
    });
  }

  private evaluateConditions(conditions: FlagCondition[], context: Record<string, any>): boolean {
    return conditions.every(condition => {
      const contextValue = context[condition.type];
      
      switch (condition.operator) {
        case 'equals':
          return contextValue === condition.value;
        case 'not_equals':
          return contextValue !== condition.value;
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(contextValue);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(contextValue);
        case 'greater_than':
          return typeof contextValue === 'number' && contextValue > condition.value;
        case 'less_than':
          return typeof contextValue === 'number' && contextValue < condition.value;
        default:
          return false;
      }
    });
  }

  private hashUserId(userId: string): number {
    // Simple hash function for demonstration (use a proper hash in production)
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100; // Return value between 0-99
  }

  private recordPerformanceMetric(metric: PerformanceMetrics): void {
    this.performanceMetrics.push(metric);
    
    // Update service health error count
    if (!metric.success) {
      const health = this.serviceHealth.get(metric.serviceName);
      if (health) {
        health.errorCount++;
        this.serviceHealth.set(metric.serviceName, health);
      }
    }
  }

  private getServiceErrorCount(serviceName: string): number {
    const recentTime = Date.now() - (60 * 60 * 1000); // Last hour
    return this.performanceMetrics.filter(m => 
      m.serviceName === serviceName && 
      !m.success && 
      m.timestamp >= recentTime
    ).length;
  }

  private getMemoryUsage(): number {
    // Simplified memory usage calculation
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }

  // Make recordPerformanceMetrics public for interface compatibility
  public recordPerformanceMetrics(operation: string, duration: number, success: boolean): void {
    const metric: PerformanceMetrics = {
      serviceName: operation,
      operationName: operation,
      executionTime: duration,
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: 0,
      timestamp: Date.now(),
      success
    };
    
    this.performanceMetrics.push(metric);
  }
}

// =============================================================================
// CONVENIENCE FACTORY FUNCTIONS
// =============================================================================

/**
 * Create and configure DI container for different environments
 */
export function createDIContainer(environment: EnvironmentType): ProfileRefreshDIContainer {
  const config: Partial<ContainerConfiguration> = {
    environment,
    enableHealthMonitoring: environment !== 'test',
    enablePerformanceTracking: environment === 'production',
    enableFeatureFlags: true,
    healthCheckInterval: environment === 'production' ? 30000 : 60000,
    metricsCollectionInterval: environment === 'production' ? 60000 : 300000,
    serviceTimeout: environment === 'production' ? 5000 : 10000
  };

  return ProfileRefreshDIContainer.getInstance(config);
}

/**
 * Create container for testing with mocks
 */
export function createTestDIContainer(): ProfileRefreshDIContainer {
  const container = ProfileRefreshDIContainer.getInstance({
    environment: 'test',
    enableHealthMonitoring: false,
    enablePerformanceTracking: false,
    enableFeatureFlags: false
  });

  // Register mock services for testing
  // This would be extended based on testing needs
  
  return container;
}

/**
 * Get the global DI container instance
 */
export function getGlobalDIContainer(): ProfileRefreshDIContainer {
  return ProfileRefreshDIContainer.getInstance();
}