/**
 * @fileoverview DATA-INTEGRATION-001: Auth Service Factory Integration
 * @description Factory Integration für Enterprise Auth Services mit AuthServiceContainer.
 * Bietet vorkonfigurierte Factory-Funktionen für verschiedene Umgebungen und Use Cases.
 * 
 * @businessRule BR-500: Factory pattern integration for all environments
 * @businessRule BR-501: Environment-specific service configuration
 * @businessRule BR-502: Enterprise and testing factory functions
 * @businessRule BR-503: Consistent factory usage across application
 * 
 * @architecture Factory pattern integration layer
 * @architecture Environment-specific configuration management
 * @architecture Centralized service container access
 * 
 * @performance Optimized factory functions for production
 * @performance Development-friendly configurations for testing
 * 
 * @since 1.1.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthIntegration
 * @namespace Auth.Data.Factories
 */

import { AuthServiceContainer, type AuthServiceContainerConfig } from './auth-service.container';
import type { ILoggerService } from '@core/logging/logger.service.interface';
import { Environment, type EnvironmentConfig } from '@core/config/environment.config.interface';
import type { EnhancedSecurityServiceConfig } from '../interfaces/security-service-factory.interfaces';

/**
 * @class AuthServiceFactory
 * @description Enterprise Auth Service Factory
 * 
 * Factory für environment-spezifische AuthServiceContainer Konfiguration.
 * Implementiert Best Practices für Enterprise Service Management:
 * - Environment-spezifische Optimierungen
 * - Security-Level Abstraktion  
 * - Performance-optimierte Konfigurationen
 * - Konsistente Service Lifecycle Management
 * 
 * @example Factory Usage
 * ```typescript
 * // Production Environment mit allen Enterprise Features
 * const prodContainer = await AuthServiceFactory.createForProduction(logger);
 * 
 * // Development Environment mit vereinfachten Services
 * const devContainer = await AuthServiceFactory.createForDevelopment(logger);
 * 
 * // Testing Environment mit minimalen Services
 * const testContainer = await AuthServiceFactory.createForTesting(logger);
 * 
 * // Custom Environment mit spezifischen Requirements
 * const customContainer = await AuthServiceFactory.createCustom({
 *   logger,
 *   environment: Environment.PRODUCTION,
 *   enableMFA: true,
 *   enableCompliance: false
 * });
 * ```
 * 
 * @businessRule BR-500: Environment-specific service configurations
 * @businessRule BR-501: Performance optimization per environment
 * @businessRule BR-502: Security level adaptation per environment
 * @businessRule BR-503: Development-friendly configurations
 * 
 * @architecture Factory pattern for dependency injection
 * @architecture Environment-based service configuration
 * @architecture Enterprise-ready service management
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthServiceFactory
 * @namespace Auth.Data.Factories
 */
export class AuthServiceFactory {
  /**
   * @static
   * @method createForProduction
   * @description Create auth services für Enterprise Production Environment
   * 
   * @param {ILoggerService} logger - Enterprise logger
   * @param {Partial<AuthServiceContainerConfig>} overrides - Configuration overrides
   * @returns {Promise<AuthServiceContainer>} Configured container
   * 
   * @businessRule BR-500: Production factory with enterprise security
   * @performance Optimized for production performance
   * @security Maximum security configuration enabled
   */
  static async createForProduction(
    logger: ILoggerService,
    overrides: Partial<AuthServiceContainerConfig> = {}
  ): Promise<AuthServiceContainer> {
    const container = AuthServiceContainer.getInstance();
    
    const productionConfig: AuthServiceContainerConfig = {
      logger,
      environment: Environment.PRODUCTION,
      enableAdvancedSecurity: true,
      enableBiometric: true,
      enableOAuth: true,
      enableMFA: true,
      enableCompliance: true,
      enablePasswordPolicy: true,
      // enableAuthOrchestrator removed - architectural simplification
      securityConfig: createSecurityConfig({
        enableThreatAssessment: true,
        enableDeviceFingerprinting: true,
        enableLocationMonitoring: true,
        cache: {
          enabled: true,
          ttl: 300000, // 5 minutes
          maxSize: 1000,
          cleanupInterval: 600000 // 10 minutes
        },
        performance: {
          enableMetrics: true,
          enableCircuitBreaker: true,
          circuitBreakerThreshold: 10,
          circuitBreakerTimeout: 30000,
          enableLazyLoading: true
        }
      }),
      ...overrides
    };

    await container.initialize(productionConfig);
    
    logger.info('Auth services created for PRODUCTION environment', undefined, {
      service: 'AuthServiceFactory',
      metadata: {
        environment: Environment.PRODUCTION,
        servicesEnabled: {
          security: productionConfig.enableAdvancedSecurity,
          mfa: productionConfig.enableMFA,
          compliance: productionConfig.enableCompliance,
          biometric: productionConfig.enableBiometric,
          oauth: productionConfig.enableOAuth
        }
      }
    });

    return container;
  }

  /**
   * @static
   * @method createForDevelopment
   * @description Create auth services für Development Environment
   * 
   * @param {ILoggerService} logger - Development logger
   * @param {Partial<AuthServiceContainerConfig>} overrides - Configuration overrides
   * @returns {Promise<AuthServiceContainer>} Configured container
   * 
   * @businessRule BR-501: Development factory with debug features
   * @performance Development-optimized configuration
   */
  static async createForDevelopment(
    logger: ILoggerService,
    overrides: Partial<AuthServiceContainerConfig> = {}
  ): Promise<AuthServiceContainer> {
    const container = AuthServiceContainer.getInstance();
    
    const developmentConfig: AuthServiceContainerConfig = {
      logger,
      environment: Environment.DEVELOPMENT,
      enableAdvancedSecurity: false, // Simplified for development
      enableBiometric: false, // Often not available in simulators
      enableOAuth: true,
      enableMFA: false, // Simplified auth for development
      enableCompliance: false, // Not needed in development
      enablePasswordPolicy: false, // Relaxed for development
      // enableAuthOrchestrator removed - architectural simplification
      securityConfig: createSecurityConfig({
        enableThreatAssessment: false,
        enableDeviceFingerprinting: false,
        enableLocationMonitoring: false,
        cache: {
          enabled: true,
          ttl: 60000, // 1 minute for development
          maxSize: 100,
          cleanupInterval: 60000 // 1 minute cleanup
        },
        performance: {
          enableMetrics: false,
          enableCircuitBreaker: false,
          circuitBreakerThreshold: 5,
          circuitBreakerTimeout: 30000,
          enableLazyLoading: true
        }
      }),
      ...overrides
    };

    await container.initialize(developmentConfig);
    
    logger.info('Auth services created for DEVELOPMENT environment', undefined, {
      service: 'AuthServiceFactory',
      metadata: {
        environment: Environment.DEVELOPMENT,
        servicesEnabled: {
          security: developmentConfig.enableAdvancedSecurity,
          mfa: developmentConfig.enableMFA,
          compliance: developmentConfig.enableCompliance,
          biometric: developmentConfig.enableBiometric,
          oauth: developmentConfig.enableOAuth
        }
      }
    });

    return container;
  }

  /**
   * @static
   * @method createForTesting
   * @description Create auth services für Testing Environment
   * 
   * @param {ILoggerService} logger - Test logger
   * @param {Partial<AuthServiceContainerConfig>} testConfig - Test-specific configuration
   * @returns {Promise<AuthServiceContainer>} Configured container for testing
   * 
   * @businessRule BR-502: Testing factory with minimal configuration
   * @performance Optimized for test execution speed
   */
  static async createForTesting(
    logger: ILoggerService,
    testConfig: Partial<AuthServiceContainerConfig> = {}
  ): Promise<AuthServiceContainer> {
    // Reset container for clean test state
    AuthServiceContainer.resetInstance();
    const container = AuthServiceContainer.getInstance();
    
    const testingConfig: AuthServiceContainerConfig = {
      logger,
      environment: Environment.TESTING,
      enableAdvancedSecurity: false,
      enableBiometric: false,
      enableOAuth: false,
      enableMFA: false,
      enableCompliance: false,
      enablePasswordPolicy: false,
      // enableAuthOrchestrator removed - architectural simplification
      securityConfig: createSecurityConfig({
        enableThreatAssessment: false,
        enableDeviceFingerprinting: false,
        enableLocationMonitoring: false,
        cache: {
          enabled: false, // No caching in tests
          ttl: 0,
          maxSize: 0,
          cleanupInterval: 5000
        },
        performance: {
          enableMetrics: false,
          enableCircuitBreaker: false,
          circuitBreakerThreshold: 10,
          circuitBreakerTimeout: 5000,
          enableLazyLoading: false
        }
      }),
      ...testConfig
    };

    await container.initialize(testingConfig);
    
    logger.info('Auth services created for TESTING environment', undefined, {
      service: 'AuthServiceFactory',
      metadata: {
        environment: Environment.TESTING,
        servicesEnabled: {
          security: testingConfig.enableAdvancedSecurity,
          mfa: testingConfig.enableMFA,
          compliance: testingConfig.enableCompliance,
          biometric: testingConfig.enableBiometric,
          oauth: testingConfig.enableOAuth
        }
      }
    });

    return container;
  }

  /**
   * @static
   * @method createForStaging
   * @description Create auth services für Staging Environment
   * 
   * @param {ILoggerService} logger - Staging logger
   * @param {Partial<AuthServiceContainerConfig>} overrides - Configuration overrides
   * @returns {Promise<AuthServiceContainer>} Configured container
   * 
   * @businessRule BR-501: Staging factory with production-like configuration
   * @performance Production-like performance with debugging enabled
   */
  static async createForStaging(
    logger: ILoggerService,
    overrides: Partial<AuthServiceContainerConfig> = {}
  ): Promise<AuthServiceContainer> {
    const container = AuthServiceContainer.getInstance();
    
    const stagingConfig: AuthServiceContainerConfig = {
      logger,
      environment: Environment.STAGING,
      enableAdvancedSecurity: true,
      enableBiometric: true,
      enableOAuth: true,
      enableMFA: true,
      enableCompliance: true,
      enablePasswordPolicy: true,
      // enableAuthOrchestrator removed - architectural simplification
      securityConfig: createSecurityConfig({
        enableThreatAssessment: true,
        enableDeviceFingerprinting: true,
        enableLocationMonitoring: false, // Reduced for staging
        cache: {
          enabled: true,
          ttl: 180000, // 3 minutes
          maxSize: 500,
          cleanupInterval: 300000 // 5 minutes
        },
        performance: {
          enableMetrics: true,
          enableCircuitBreaker: true,
          circuitBreakerThreshold: 8,
          circuitBreakerTimeout: 25000,
          enableLazyLoading: true
        }
      }),
      ...overrides
    };

    await container.initialize(stagingConfig);
    

    return container;
  }

  /**
   * @static
   * @method createCustom
   * @description Create auth services mit Custom Configuration
   * 
   * @param {AuthServiceContainerConfig} config - Complete custom configuration
   * @returns {Promise<AuthServiceContainer>} Configured container
   * 
   * @businessRule BR-503: Custom factory for specific requirements
   */
  static async createCustom(config: AuthServiceContainerConfig): Promise<AuthServiceContainer> {
    const container = AuthServiceContainer.getInstance();
    
    await container.initialize(config);
    
    config.logger.info('Auth services created with CUSTOM configuration', undefined, {
      service: 'AuthServiceFactory',
      metadata: {
        environment: config.environment || 'custom',
        customConfig: true
      }
    });

    return container;
  }

  /**
   * @static
   * @method getExistingContainer
   * @description Get bereits initialisierten Container
   * 
   * @returns {AuthServiceContainer | null} Existing container or null
   * 
   * @example Get Existing Container
   * ```typescript
   * const existingContainer = AuthServiceFactory.getExistingContainer();
   * if (existingContainer && existingContainer.isInitialized()) {
   *   const orchestrator = await existingContainer.getAuthOrchestratorService();
   * }
   * ```
   */
  static getExistingContainer(): AuthServiceContainer | null {
    const instance = AuthServiceContainer.getInstance();
    return instance.isInitialized() ? instance : null;
  }

  /**
   * @static
   * @method resetForTesting
   * @description Reset Container für Testing
   * 
   * @businessRule BR-502: Clean test environment setup
   * 
   * @example Reset for Testing
   * ```typescript
   * beforeEach(() => {
   *   AuthServiceFactory.resetForTesting();
   * });
   * ```
   */
  static resetForTesting(): void {
    AuthServiceContainer.resetInstance();
  }
}

/**
 * @function getServiceContainer
 * @description Convenience function für Container Access
 * 
 * @param {EnvironmentConfig} config - Environment configuration
 * @param {ILoggerService} logger - Logger service
 * @returns {Promise<AuthServiceContainer>} Configured container
 * 
 * @example Convenience Function Usage
 * ```typescript
 * const container = await getServiceContainer({
 *   environment: Environment.PRODUCTION,
 *   enableAllServices: true,
 *   securityLevel: 'enterprise'
 * }, logger);
 * ```
 */
export async function getServiceContainer(
  config: EnvironmentConfig,
  logger: ILoggerService
): Promise<AuthServiceContainer> {
  switch (config.environment) {
    case Environment.PRODUCTION:
      return AuthServiceFactory.createForProduction(logger);
    case Environment.STAGING:
      return AuthServiceFactory.createForStaging(logger);
    case Environment.DEVELOPMENT:
      return AuthServiceFactory.createForDevelopment(logger);
    case Environment.TESTING:
      return AuthServiceFactory.createForTesting(logger);
    default:
      throw new Error(`Unsupported environment: ${config.environment}`);
  }
}

/**
 * @function createEnterpriseAuthServices
 * @description Factory für Enterprise Auth Services
 * 
 * @param {ILoggerService} logger - Enterprise logger
 * @returns {Promise<AuthServiceContainer>} Enterprise-configured container
 * 
 * @example Enterprise Services Creation
 * ```typescript
 * const enterpriseServices = await createEnterpriseAuthServices(logger);
 * const orchestrator = await enterpriseServices.getAuthOrchestratorService();
 * const mfaService = enterpriseServices.getMFAService();
 * const complianceService = enterpriseServices.getComplianceService();
 * ```
 */
export async function createEnterpriseAuthServices(
  logger: ILoggerService
): Promise<AuthServiceContainer> {
  return AuthServiceFactory.createForProduction(logger, {
    enableAdvancedSecurity: true,
    enableMFA: true,
    enableCompliance: true,
    enablePasswordPolicy: true,
    enableBiometric: true,
    enableOAuth: true,
    // enableAuthOrchestrator removed - architectural simplification
  });
}

/**
 * Create default security config with all required properties
 */
function createSecurityConfig(overrides: Partial<EnhancedSecurityServiceConfig> = {}): EnhancedSecurityServiceConfig {
  return {
    // Base SecurityServiceConfig properties
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
    // Enhanced properties
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
    // Default additional properties
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
      deviceCheck: 30000,
      locationCheck: 60000,
      threatAssessment: 300000,
      healthCheck: 120000
    },
    cache: {
      enabled: true,
      ttl: 300000,
      maxSize: 100,
      cleanupInterval: 60000
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
      cleanupThreshold: 80,
      memoryLimitMB: 200
    },
    // Apply overrides
    ...overrides
  };
} 