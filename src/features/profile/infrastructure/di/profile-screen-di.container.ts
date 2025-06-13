/**
 * ProfileScreenDIContainer - Enterprise Dependency Injection Container
 * 🚀 ENTERPRISE: Service Management, Factory Patterns, Health Monitoring
 * ✅ INFRASTRUCTURE LAYER: DI Container für Profile Screen Services
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Domain Entities
import {
  ProfileScreenState,
  createProfileScreenState
} from '../../domain/entities/profile-screen-state.entity';
import {
  ProfileInteraction,
  createProfileInteraction
} from '../../domain/entities/profile-interaction.entity';
import {
  ProfileScreenConfiguration,
  createProfileScreenConfiguration
} from '../../domain/entities/profile-screen-config.entity';
import {
  OfflineProfileState,
  createOfflineProfileState
} from '../../domain/entities/offline-profile-state.entity';

// Use Cases
import {
  TrackProfileInteractionUseCase,
  createTrackProfileInteractionUseCase
} from '../../application/use-cases/profile-screen/track-profile-interaction.use-case';
import {
  OptimizeProfilePerformanceUseCase,
  createOptimizeProfilePerformanceUseCase
} from '../../application/use-cases/profile-screen/optimize-profile-performance.use-case';
import {
  ManageProfileCacheUseCase,
  createManageProfileCacheUseCase
} from '../../application/use-cases/profile-screen/manage-profile-cache.use-case';
import {
  ValidateProfileScreenSecurityUseCase,
  createValidateProfileScreenSecurityUseCase
} from '../../application/use-cases/profile-screen/validate-profile-screen-security.use-case';

// Data Layer
import {
  ProfileScreenRepositoryImpl,
  createProfileScreenRepository,
  IProfileScreenRepository,
  IProfileScreenDataSource
} from '../../data/repositories/profile-screen/profile-screen-repository.impl';
import {
  SupabaseProfileScreenDataSource,
  createSupabaseProfileScreenDataSource
} from '../../data/datasources/profile-screen/supabase-profile-screen.datasource';

const logger = LoggerFactory.createServiceLogger('ProfileScreenDIContainer');

/**
 * @interface ProfileScreenServices - All available services
 */
export interface ProfileScreenServices {
  // Use Cases
  trackInteractionUseCase: TrackProfileInteractionUseCase;
  optimizePerformanceUseCase: OptimizeProfilePerformanceUseCase;
  manageCacheUseCase: ManageProfileCacheUseCase;
  validateSecurityUseCase: ValidateProfileScreenSecurityUseCase;
  
  // Repository
  profileScreenRepository: IProfileScreenRepository;
  
  // Data Source
  profileScreenDataSource: IProfileScreenDataSource;
  
  // Entity Factories
  createProfileScreenState: typeof createProfileScreenState;
  createProfileInteraction: typeof createProfileInteraction;
  createProfileScreenConfiguration: typeof createProfileScreenConfiguration;
  createOfflineProfileState: typeof createOfflineProfileState;
}

/**
 * @interface ContainerHealth - Health status of the container
 */
export interface ContainerHealth {
  healthy: boolean;
  services: Record<string, boolean>;
  lastHealthCheck: Date;
  initializationTime: Date;
  errors: string[];
}

/**
 * @class ProfileScreenDIContainer
 * Enterprise Dependency Injection Container for Profile Screen Services
 * 
 * Features:
 * - Service registration and resolution
 * - Factory pattern implementation
 * - Health monitoring and diagnostics
 * - Lazy loading of services
 * - Service lifecycle management
 * - Error handling and fallbacks
 */
export class ProfileScreenDIContainer {
  private services: Partial<ProfileScreenServices> = {};
  private initialized: boolean = false;
  private initializationTime: Date = new Date();
  private serviceHealth: Map<string, boolean> = new Map();
  private errors: string[] = [];

  constructor() {
    logger.info('ProfileScreenDIContainer created', LogCategory.BUSINESS, {
      timestamp: this.initializationTime.toISOString()
    });
  }

  // ==========================================
  // Container Initialization
  // ==========================================

  async initialize(): Promise<void> {
    if (this.initialized) {
      logger.info('ProfileScreenDIContainer already initialized', LogCategory.BUSINESS, {
        initializationTime: this.initializationTime.toISOString()
      });
      return;
    }

    try {
      logger.info('Initializing ProfileScreenDIContainer', LogCategory.BUSINESS, {
        timestamp: new Date().toISOString()
      });

      // Initialize in dependency order
      await this.initializeDataSources();
      await this.initializeRepositories();
      await this.initializeUseCases();
      await this.initializeEntityFactories();

      this.initialized = true;

      logger.info('ProfileScreenDIContainer initialized successfully', LogCategory.BUSINESS, {
        serviceCount: Object.keys(this.services).length,
        initializationTime: this.initializationTime.toISOString()
      });

    } catch (error) {
      this.errors.push(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      logger.error('Failed to initialize ProfileScreenDIContainer', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  // ==========================================
  // Service Resolution
  // ==========================================

  getTrackInteractionUseCase(): TrackProfileInteractionUseCase {
    this.ensureInitialized();
    return this.getService('trackInteractionUseCase') as TrackProfileInteractionUseCase;
  }

  getOptimizePerformanceUseCase(): OptimizeProfilePerformanceUseCase {
    this.ensureInitialized();
    return this.getService('optimizePerformanceUseCase') as OptimizeProfilePerformanceUseCase;
  }

  getManageCacheUseCase(): ManageProfileCacheUseCase {
    this.ensureInitialized();
    return this.getService('manageCacheUseCase') as ManageProfileCacheUseCase;
  }

  getValidateSecurityUseCase(): ValidateProfileScreenSecurityUseCase {
    this.ensureInitialized();
    return this.getService('validateSecurityUseCase') as ValidateProfileScreenSecurityUseCase;
  }

  getProfileScreenRepository(): IProfileScreenRepository {
    this.ensureInitialized();
    return this.getService('profileScreenRepository') as IProfileScreenRepository;
  }

  getProfileScreenDataSource(): IProfileScreenDataSource {
    this.ensureInitialized();
    return this.getService('profileScreenDataSource') as IProfileScreenDataSource;
  }

  // Entity Factory Methods
  createProfileScreenState = createProfileScreenState;
  createProfileInteraction = createProfileInteraction;
  createProfileScreenConfiguration = createProfileScreenConfiguration;
  createOfflineProfileState = createOfflineProfileState;

  // ==========================================
  // Health Monitoring
  // ==========================================

  async performHealthCheck(): Promise<ContainerHealth> {
    try {
      const serviceHealthChecks = await Promise.allSettled([
        this.checkDataSourceHealth(),
        this.checkRepositoryHealth(),
        this.checkUseCaseHealth()
      ]);

      const services: Record<string, boolean> = {};
      serviceHealthChecks.forEach((result, index) => {
        const serviceName = ['dataSource', 'repository', 'useCases'][index];
        services[serviceName] = result.status === 'fulfilled' && result.value;
        this.serviceHealth.set(serviceName, services[serviceName]);
      });

      const healthy = Object.values(services).every(status => status);

      const health: ContainerHealth = {
        healthy,
        services,
        lastHealthCheck: new Date(),
        initializationTime: this.initializationTime,
        errors: [...this.errors]
      };

      logger.info('ProfileScreenDIContainer health check completed', LogCategory.BUSINESS, {
        healthy,
        serviceCount: Object.keys(services).length
      });

      return health;
    } catch (error) {
      logger.error('ProfileScreenDIContainer health check failed', LogCategory.BUSINESS, {}, error as Error);
      
      return {
        healthy: false,
        services: {},
        lastHealthCheck: new Date(),
        initializationTime: this.initializationTime,
        errors: [...this.errors, `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  // ==========================================
  // Container Management
  // ==========================================

  isInitialized(): boolean {
    return this.initialized;
  }

  getServiceCount(): number {
    return Object.keys(this.services).length;
  }

  getErrors(): string[] {
    return [...this.errors];
  }

  async reload(): Promise<void> {
    logger.info('Reloading ProfileScreenDIContainer', LogCategory.BUSINESS, {
      timestamp: new Date().toISOString()
    });

    try {
      // Clear existing services
      this.services = {};
      this.serviceHealth.clear();
      this.errors = [];
      this.initialized = false;

      // Reinitialize
      await this.initialize();

      logger.info('ProfileScreenDIContainer reloaded successfully', LogCategory.BUSINESS, {
        serviceCount: Object.keys(this.services).length
      });
    } catch (error) {
      logger.error('Failed to reload ProfileScreenDIContainer', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      logger.info('Cleaning up ProfileScreenDIContainer', LogCategory.BUSINESS, {
        serviceCount: Object.keys(this.services).length
      });

      // Cleanup services that have cleanup methods
      const cleanupPromises: Promise<void>[] = [];

      // Add cleanup logic for services that need it
      if (this.services.profileScreenDataSource) {
        // DataSource cleanup if needed
      }

      await Promise.all(cleanupPromises);

      // Clear all services
      this.services = {};
      this.serviceHealth.clear();
      this.initialized = false;

      logger.info('ProfileScreenDIContainer cleaned up successfully', LogCategory.BUSINESS, {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to cleanup ProfileScreenDIContainer', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  // ==========================================
  // Private Initialization Methods
  // ==========================================

  private async initializeDataSources(): Promise<void> {
    logger.info('Initializing profile screen data sources', LogCategory.BUSINESS, {
      timestamp: new Date().toISOString()
    });

    try {
      // Initialize Supabase data source
      this.services.profileScreenDataSource = createSupabaseProfileScreenDataSource();
      
      // Test connection
      if ('performHealthCheck' in this.services.profileScreenDataSource) {
        await (this.services.profileScreenDataSource as any).performHealthCheck();
      }

      this.serviceHealth.set('dataSource', true);

      logger.info('Profile screen data sources initialized', LogCategory.BUSINESS, {
        dataSourceType: 'Supabase'
      });
    } catch (error) {
      this.serviceHealth.set('dataSource', false);
      this.errors.push(`Data source initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      logger.error('Failed to initialize profile screen data sources', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  private async initializeRepositories(): Promise<void> {
    logger.info('Initializing profile screen repositories', LogCategory.BUSINESS, {
      timestamp: new Date().toISOString()
    });

    try {
      if (!this.services.profileScreenDataSource) {
        throw new Error('Data source not initialized');
      }

      // Initialize repository with data source
      this.services.profileScreenRepository = createProfileScreenRepository(
        this.services.profileScreenDataSource
      );

      this.serviceHealth.set('repository', true);

      logger.info('Profile screen repositories initialized', LogCategory.BUSINESS, {
        repositoryType: 'ProfileScreenRepository'
      });
    } catch (error) {
      this.serviceHealth.set('repository', false);
      this.errors.push(`Repository initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      logger.error('Failed to initialize profile screen repositories', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  private async initializeUseCases(): Promise<void> {
    logger.info('Initializing profile screen use cases', LogCategory.BUSINESS, {
      timestamp: new Date().toISOString()
    });

    try {
      // Initialize use cases
      this.services.trackInteractionUseCase = createTrackProfileInteractionUseCase();
      this.services.optimizePerformanceUseCase = createOptimizeProfilePerformanceUseCase();
      this.services.manageCacheUseCase = createManageProfileCacheUseCase();
      this.services.validateSecurityUseCase = createValidateProfileScreenSecurityUseCase();

      this.serviceHealth.set('useCases', true);

      logger.info('Profile screen use cases initialized', LogCategory.BUSINESS, {
        useCaseCount: 4
      });
    } catch (error) {
      this.serviceHealth.set('useCases', false);
      this.errors.push(`Use case initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      logger.error('Failed to initialize profile screen use cases', LogCategory.BUSINESS, {}, error as Error);
      throw error;
    }
  }

  private async initializeEntityFactories(): Promise<void> {
    // Entity factories are static functions, no initialization needed
    this.services.createProfileScreenState = createProfileScreenState;
    this.services.createProfileInteraction = createProfileInteraction;
    this.services.createProfileScreenConfiguration = createProfileScreenConfiguration;
    this.services.createOfflineProfileState = createOfflineProfileState;

    this.serviceHealth.set('entityFactories', true);

    logger.info('Profile screen entity factories initialized', LogCategory.BUSINESS, {
      factoryCount: 4
    });
  }

  // ==========================================
  // Private Helper Methods
  // ==========================================

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('ProfileScreenDIContainer is not initialized. Call initialize() first.');
    }
  }

  private getService<K extends keyof ProfileScreenServices>(serviceName: K): ProfileScreenServices[K] {
    const service = this.services[serviceName];
    if (!service) {
      throw new Error(`Service '${String(serviceName)}' is not available`);
    }
    return service;
  }

  private async checkDataSourceHealth(): Promise<boolean> {
    try {
      const dataSource = this.services.profileScreenDataSource;
      if (!dataSource) return false;

      // Check if data source has health check method
      if ('performHealthCheck' in dataSource) {
        return await (dataSource as any).performHealthCheck();
      }

      return true; // Assume healthy if no health check available
    } catch (error) {
      logger.error('Data source health check failed', LogCategory.BUSINESS, {}, error as Error);
      return false;
    }
  }

  private async checkRepositoryHealth(): Promise<boolean> {
    try {
      const repository = this.services.profileScreenRepository;
      if (!repository) return false;

      // Simple test operation
      // Could test with a mock user ID or health check endpoint
      return true;
    } catch (error) {
      logger.error('Repository health check failed', LogCategory.BUSINESS, {}, error as Error);
      return false;
    }
  }

  private async checkUseCaseHealth(): Promise<boolean> {
    try {
      const useCases = [
        this.services.trackInteractionUseCase,
        this.services.optimizePerformanceUseCase,
        this.services.manageCacheUseCase,
        this.services.validateSecurityUseCase
      ];

      return useCases.every(useCase => useCase !== undefined);
    } catch (error) {
      logger.error('Use case health check failed', LogCategory.BUSINESS, {}, error as Error);
      return false;
    }
  }
}

/**
 * Container Factory and Singleton Management
 */
class ProfileScreenContainerFactory {
  private static instance: ProfileScreenDIContainer | null = null;
  private static initializing: Promise<ProfileScreenDIContainer> | null = null;

  static async getInstance(): Promise<ProfileScreenDIContainer> {
    if (this.instance) {
      return this.instance;
    }

    if (this.initializing) {
      return this.initializing;
    }

    this.initializing = this.createAndInitializeContainer();
    this.instance = await this.initializing;
    this.initializing = null;

    return this.instance;
  }

  private static async createAndInitializeContainer(): Promise<ProfileScreenDIContainer> {
    const container = new ProfileScreenDIContainer();
    await container.initialize();
    return container;
  }

  static async resetInstance(): Promise<void> {
    if (this.instance) {
      await this.instance.cleanup();
      this.instance = null;
    }
    this.initializing = null;
  }
}

// Export factory and container
export { ProfileScreenDIContainer as default, ProfileScreenContainerFactory }; 