/**
 * @fileoverview Security DI Container - Enterprise Dependency Injection
 * 
 * ✅ INFRASTRUCTURE LAYER: Dependency injection and service configuration
 * ✅ ENTERPRISE: Production-ready service registry
 * ✅ CLEAN ARCHITECTURE: Dependency inversion principle
 */

import { ISecurityRepository } from '../../domain/interfaces/security/security-repository.interface';
import { SecurityRepositoryImpl } from '../../data/repositories/security/security-repository.impl';
import { ManageSecurityEnterpriseUseCase } from '../../application/use-cases/security/manage-security-enterprise.use-case';
import { DetectSecurityThreatsUseCase } from '../../application/use-cases/security/detect-security-threats.use-case';
import { LoggerFactory } from '../../../../core/logging/logger.factory';
import { LogCategory } from '../../../../core/logging/logger.service.interface';

/**
 * 🛡️ SECURITY DI CONTAINER
 * 
 * Enterprise dependency injection container for security services
 */
export class SecurityDIContainer {
  private static instance: SecurityDIContainer;
  private readonly logger = LoggerFactory.createServiceLogger('SecurityDIContainer');
  
  // Repository instances
  private securityRepository?: ISecurityRepository;
  
  // Use case instances
  private manageSecurityUseCase?: ManageSecurityEnterpriseUseCase;
  private detectThreatsUseCase?: DetectSecurityThreatsUseCase;
  
  // Service health
  private isInitialized = false;
  private initializationTime?: Date;

  private constructor() {
    this.logger.info('Security DI Container created', LogCategory.SYSTEM, {
      metadata: { containerType: 'SecurityDI', singleton: true }
    });
  }

  /**
   * 🎯 GET SINGLETON INSTANCE
   */
  static getInstance(): SecurityDIContainer {
    if (!SecurityDIContainer.instance) {
      SecurityDIContainer.instance = new SecurityDIContainer();
    }
    return SecurityDIContainer.instance;
  }

  /**
   * 🚀 INITIALIZE CONTAINER
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.info('Security DI Container already initialized', LogCategory.SYSTEM, {
        metadata: { initializationTime: this.initializationTime }
      });
      return;
    }

    try {
      this.logger.info('Initializing Security DI Container', LogCategory.SYSTEM, {
        metadata: { containerType: 'SecurityDI' }
      });

      // Initialize repositories
      await this.initializeRepositories();
      
      // Initialize use cases
      await this.initializeUseCases();
      
      // Mark as initialized
      this.isInitialized = true;
      this.initializationTime = new Date();

      this.logger.info('Security DI Container initialized successfully', LogCategory.SYSTEM, {
        metadata: { 
          initializationTime: this.initializationTime,
          repositoriesCount: 1,
          useCasesCount: 2
        }
      });

    } catch (error) {
      this.logger.error('Failed to initialize Security DI Container', LogCategory.SYSTEM, {}, error as Error);
      throw error;
    }
  }

  /**
   * 📊 CHECK CONTAINER HEALTH
   */
  async checkHealth(): Promise<SecurityContainerHealth> {
    try {
      const health: SecurityContainerHealth = {
        isHealthy: this.isInitialized,
        initializationTime: this.initializationTime,
        services: {
          securityRepository: !!this.securityRepository,
          manageSecurityUseCase: !!this.manageSecurityUseCase,
          detectThreatsUseCase: !!this.detectThreatsUseCase
        },
        performance: {
          memoryUsage: process.memoryUsage?.()?.heapUsed || 0,
          uptime: this.initializationTime ? Date.now() - this.initializationTime.getTime() : 0
        },
        lastCheck: new Date()
      };

      // Test repository health if available
      if (this.securityRepository) {
        const repositoryHealth = await this.securityRepository.checkHealth();
        health.repositoryHealth = repositoryHealth.isSuccess ? repositoryHealth.value : undefined;
      }

      return health;

    } catch (error) {
      this.logger.error('Security container health check failed', LogCategory.SYSTEM, {}, error as Error);
      return {
        isHealthy: false,
        initializationTime: this.initializationTime,
        services: { securityRepository: false, manageSecurityUseCase: false, detectThreatsUseCase: false },
        performance: { memoryUsage: 0, uptime: 0 },
        lastCheck: new Date(),
        error: (error as Error).message
      };
    }
  }

  // ==================================================
  // REPOSITORY GETTERS
  // ==================================================

  /**
   * 🔍 GET SECURITY REPOSITORY
   */
  getSecurityRepository(): ISecurityRepository {
    if (!this.securityRepository) {
      throw new Error('Security repository not initialized. Call initialize() first.');
    }
    return this.securityRepository;
  }

  // ==================================================
  // USE CASE GETTERS
  // ==================================================

  /**
   * 🛡️ GET MANAGE SECURITY USE CASE
   */
  getManageSecurityUseCase(): ManageSecurityEnterpriseUseCase {
    if (!this.manageSecurityUseCase) {
      throw new Error('Manage security use case not initialized. Call initialize() first.');
    }
    return this.manageSecurityUseCase;
  }

  /**
   * 🚨 GET DETECT THREATS USE CASE
   */
  getDetectThreatsUseCase(): DetectSecurityThreatsUseCase {
    if (!this.detectThreatsUseCase) {
      throw new Error('Detect threats use case not initialized. Call initialize() first.');
    }
    return this.detectThreatsUseCase;
  }

  // ==================================================
  // FACTORY METHODS
  // ==================================================

  /**
   * 🏭 CREATE SECURITY SERVICE INSTANCE
   */
  createSecurityService(): SecurityService {
    if (!this.isInitialized) {
      throw new Error('Security DI Container not initialized. Call initialize() first.');
    }

    return new SecurityService(
      this.getSecurityRepository(),
      this.getManageSecurityUseCase(),
      this.getDetectThreatsUseCase()
    );
  }

  /**
   * 🔄 RELOAD CONTAINER
   */
  async reload(): Promise<void> {
    this.logger.info('Reloading Security DI Container', LogCategory.SYSTEM, {
      metadata: { containerType: 'SecurityDI' }
    });

    // Reset state
    this.isInitialized = false;
    this.securityRepository = undefined;
    this.manageSecurityUseCase = undefined;
    this.detectThreatsUseCase = undefined;

    // Reinitialize
    await this.initialize();
  }

  /**
   * 🧹 CLEANUP CONTAINER
   */
  async cleanup(): Promise<void> {
    try {
      this.logger.info('Cleaning up Security DI Container', LogCategory.SYSTEM, {
        metadata: { containerType: 'SecurityDI' }
      });

      // Cleanup repositories if they have cleanup methods
      if (this.securityRepository && 'cleanup' in this.securityRepository) {
        await (this.securityRepository as any).cleanup();
      }

      // Reset state
      this.isInitialized = false;
      this.securityRepository = undefined;
      this.manageSecurityUseCase = undefined;
      this.detectThreatsUseCase = undefined;
      this.initializationTime = undefined;

      this.logger.info('Security DI Container cleaned up successfully', LogCategory.SYSTEM, {
        metadata: { containerType: 'SecurityDI' }
      });

    } catch (error) {
      this.logger.error('Failed to cleanup Security DI Container', LogCategory.SYSTEM, {}, error as Error);
      throw error;
    }
  }

  // ==================================================
  // PRIVATE INITIALIZATION METHODS
  // ==================================================

  /**
   * 🔧 INITIALIZE REPOSITORIES
   */
  private async initializeRepositories(): Promise<void> {
    this.logger.info('Initializing security repositories', LogCategory.SYSTEM, {
      metadata: { step: 'repositories' }
    });

    try {
      // Initialize Security Repository
      this.securityRepository = new SecurityRepositoryImpl();

      // Test repository health
      const healthResult = await this.securityRepository.checkHealth();
      if (!healthResult.isSuccess || !healthResult.value.isHealthy) {
        throw new Error('Security repository health check failed');
      }

      this.logger.info('Security repositories initialized', LogCategory.SYSTEM, {
        metadata: { 
          repositoriesInitialized: 1,
          repositoryHealth: healthResult.value.isHealthy
        }
      });

    } catch (error) {
      this.logger.error('Failed to initialize security repositories', LogCategory.SYSTEM, {}, error as Error);
      throw error;
    }
  }

  /**
   * 🔧 INITIALIZE USE CASES
   */
  private async initializeUseCases(): Promise<void> {
    this.logger.info('Initializing security use cases', LogCategory.SYSTEM, {
      metadata: { step: 'useCases' }
    });

    try {
      if (!this.securityRepository) {
        throw new Error('Security repository must be initialized before use cases');
      }

      // Initialize use cases with repository dependencies
      this.manageSecurityUseCase = new ManageSecurityEnterpriseUseCase(this.securityRepository);
      this.detectThreatsUseCase = new DetectSecurityThreatsUseCase(this.securityRepository);

      this.logger.info('Security use cases initialized', LogCategory.SYSTEM, {
        metadata: { 
          useCasesInitialized: 2,
          manageSecurityUseCase: true,
          detectThreatsUseCase: true
        }
      });

    } catch (error) {
      this.logger.error('Failed to initialize security use cases', LogCategory.SYSTEM, {}, error as Error);
      throw error;
    }
  }
}

// ==================================================
// SUPPORTING TYPES
// ==================================================

/**
 * 🏥 SECURITY CONTAINER HEALTH
 */
export interface SecurityContainerHealth {
  isHealthy: boolean;
  initializationTime?: Date;
  services: {
    securityRepository: boolean;
    manageSecurityUseCase: boolean;
    detectThreatsUseCase: boolean;
  };
  performance: {
    memoryUsage: number;
    uptime: number;
  };
  repositoryHealth?: any;
  lastCheck: Date;
  error?: string;
}

/**
 * 🛡️ SECURITY SERVICE
 * 
 * High-level security service that orchestrates use cases
 */
export class SecurityService {
  private readonly logger = LoggerFactory.createServiceLogger('SecurityService');

  constructor(
    private readonly securityRepository: ISecurityRepository,
    private readonly manageSecurityUseCase: ManageSecurityEnterpriseUseCase,
    private readonly detectThreatsUseCase: DetectSecurityThreatsUseCase
  ) {
    this.logger.info('Security Service initialized', LogCategory.SERVICE, {
      metadata: { hasRepository: !!securityRepository, hasUseCases: true }
    });
  }

  /**
   * 🛡️ GET MANAGE SECURITY USE CASE
   */
  getManageSecurityUseCase(): ManageSecurityEnterpriseUseCase {
    return this.manageSecurityUseCase;
  }

  /**
   * 🚨 GET DETECT THREATS USE CASE
   */
  getDetectThreatsUseCase(): DetectSecurityThreatsUseCase {
    return this.detectThreatsUseCase;
  }

  /**
   * 📊 GET SECURITY REPOSITORY
   */
  getSecurityRepository(): ISecurityRepository {
    return this.securityRepository;
  }

  /**
   * 🏥 CHECK SERVICE HEALTH
   */
  async checkHealth(): Promise<{ isHealthy: boolean; details: any }> {
    try {
      const repositoryHealth = await this.securityRepository.checkHealth();
      
      return {
        isHealthy: repositoryHealth.isSuccess && repositoryHealth.value.isHealthy,
        details: {
          repository: repositoryHealth.isSuccess ? repositoryHealth.value : { error: repositoryHealth.error },
          useCases: {
            manageSecurityUseCase: !!this.manageSecurityUseCase,
            detectThreatsUseCase: !!this.detectThreatsUseCase
          }
        }
      };
    } catch (error) {
      return {
        isHealthy: false,
        details: { error: (error as Error).message }
      };
    }
  }
}

// ==================================================
// CONTAINER FACTORY
// ==================================================

/**
 * 🏭 SECURITY CONTAINER FACTORY
 */
export class SecurityContainerFactory {
  private static containerInstance?: SecurityDIContainer;

  /**
   * 🎯 GET OR CREATE SECURITY CONTAINER
   */
  static async getContainer(): Promise<SecurityDIContainer> {
    if (!SecurityContainerFactory.containerInstance) {
      SecurityContainerFactory.containerInstance = SecurityDIContainer.getInstance();
      await SecurityContainerFactory.containerInstance.initialize();
    }
    return SecurityContainerFactory.containerInstance;
  }

  /**
   * 🔄 RESET CONTAINER (for testing)
   */
  static async resetContainer(): Promise<void> {
    if (SecurityContainerFactory.containerInstance) {
      await SecurityContainerFactory.containerInstance.cleanup();
      SecurityContainerFactory.containerInstance = undefined;
    }
  }

  /**
   * 🏥 CHECK CONTAINER HEALTH
   */
  static async checkHealth(): Promise<SecurityContainerHealth> {
    try {
      const container = await SecurityContainerFactory.getContainer();
      return container.checkHealth();
    } catch (error) {
      return {
        isHealthy: false,
        services: { securityRepository: false, manageSecurityUseCase: false, detectThreatsUseCase: false },
        performance: { memoryUsage: 0, uptime: 0 },
        lastCheck: new Date(),
        error: (error as Error).message
      };
    }
  }
}

// ==================================================
// EXPORTS
// ==================================================

export { SecurityDIContainer as default, SecurityContainerFactory };