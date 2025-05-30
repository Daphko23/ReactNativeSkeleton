/**
 * @fileoverview PRESENTATION-INTEGRATION-001: Auth System Factory Integration
 * @description Vereinfachte Integration für konsistente Factory-Nutzung im Auth System.
 * Eliminiert redundante Abstraktionsschichten und fokussiert auf Container + Hook Pattern.
 * 
 * @businessRule BR-600: Centralized factory pattern integration
 * @businessRule BR-601: Direct container usage without redundant interfaces
 * @businessRule BR-602: Clear separation: Container for services, Hook for UI
 * @businessRule BR-603: Simplified service lifecycle management
 * 
 * @architecture Factory pattern integration layer
 * @architecture Direct service container access
 * @architecture Clean separation of concerns
 * @architecture No redundant abstraction layers
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthIntegration
 * @namespace Auth.Presentation.Integration
 */

import { AuthServiceContainer } from '../../data/factories/auth-service.container';
import { AuthServiceFactory } from '../../data/factories/auth.integration';
import type { ILoggerService } from '../../../../core/logging/logger.service.interface';
import { Environment, type EnvironmentValue } from '../../../../core/config/environment.config.interface';

/**
 * @interface AuthIntegrationConfig
 * @description Simplified configuration für Enterprise Auth Integration
 */
export interface AuthIntegrationConfig {
  /** Logger service instance */
  logger: ILoggerService;
  
  /** Environment configuration using enum */
  environment: Environment | EnvironmentValue;
  
  /** Security features to enable */
  securityFeatures: {
    enableAdvancedSecurity: boolean;
    enableBiometric: boolean;
    enableOAuth: boolean;
    enableMFA: boolean;
    enableCompliance: boolean;
    enablePasswordPolicy: boolean;
  };
  
  /** Performance configuration */
  performance: {
    enableCaching: boolean;
    enableMetrics: boolean;
    enableCircuitBreaker: boolean;
  };
}

/**
 * @class AuthIntegration
 * @description Simplified Enterprise Auth System Integration
 * 
 * Vereinfachte Klasse für konsistente Factory-Pattern Nutzung:
 * - Direct AuthServiceContainer Access
 * - No redundant service interfaces
 * - Clear separation: Container for services, Hook for UI
 * - Simplified configuration management
 * 
 * @example Enterprise Integration Usage
 * ```typescript
 * // Method 1: Quick environment-based setup (using enum)
 * const container = await AuthIntegration.createForEnvironment(Environment.PRODUCTION, logger);
 * const mfaService = container.getMFAService();
 * 
 * // Method 2: Custom configuration
 * const integration = new AuthIntegration();
 * await integration.initialize({
 *   environment: Environment.STAGING,
 *   securityFeatures: { enableMFA: true }
 * });
 * const container = integration.getContainer();
 * 
 * // Method 3: UI components (recommended)
 * const { enterprise, login } = useAuth();
 * await enterprise.mfa.enable('totp');
 * ```
 */
export class AuthIntegration {
  /**
   * @private
   * @description Service container instance
   */
  private container: AuthServiceContainer | null = null;

  /**
   * @private
   * @description Configuration
   */
  private config: AuthIntegrationConfig | null = null;

  /**
   * @private
   * @description Initialization status
   */
  private initialized = false;

  /**
   * @static
   * @method createForEnvironment
   * @description Quick factory method für environment-based setup
   * 
   * @param {Environment | EnvironmentValue} environment - Target environment
   * @param {ILoggerService} logger - Logger service
   * @returns {Promise<AuthServiceContainer>} Configured container
   * 
   * @example Quick Environment Setup
   * ```typescript
   * // Production with all enterprise features
   * const container = await AuthIntegration.createForEnvironment(Environment.PRODUCTION, logger);
   * 
   * // Development with minimal features
   * const devContainer = await AuthIntegration.createForEnvironment(Environment.DEVELOPMENT, logger);
   * 
   * // Use services directly
   * const authRepository = container.getAuthRepository();
   * const user = await authRepository.login(email, password);
   * ```
   */
  public static async createForEnvironment(
    environment: Environment | EnvironmentValue,
    logger: ILoggerService
  ): Promise<AuthServiceContainer> {
    switch (environment) {
      case Environment.PRODUCTION:
        return AuthServiceFactory.createForProduction(logger);
      case Environment.STAGING:
        return AuthServiceFactory.createForStaging(logger);
      case Environment.DEVELOPMENT:
        return AuthServiceFactory.createForDevelopment(logger);
      case Environment.TESTING:
        return AuthServiceFactory.createForTesting(logger);
      default:
        throw new Error(`Unsupported environment: ${environment}`);
    }
  }

  /**
   * @method initialize
   * @description Initialize auth system with custom configuration
   * 
   * @param {AuthIntegrationConfig} config - Integration configuration
   * @returns {Promise<void>} Promise resolving when initialization complete
   * 
   * @businessRule BR-600: Centralized factory pattern initialization
   * @businessRule BR-601: Direct container configuration without redundant layers
   * 
   * @example Custom Configuration
   * ```typescript
   * const integration = new AuthIntegration();
   * await integration.initialize({
   *   logger: enterpriseLogger,
   *   environment: Environment.PRODUCTION,
   *   securityFeatures: { 
   *     enableAdvancedSecurity: true,
   *     enableMFA: true,
   *     enableCompliance: true 
   *   },
   *   performance: { enableCaching: true }
   * });
   * 
   * const container = integration.getContainer();
   * const complianceService = container.getComplianceService();
   * ```
   */
  public async initialize(config: AuthIntegrationConfig): Promise<void> {
    if (this.initialized) {
      config.logger.warn('AuthIntegration already initialized', undefined, {
        service: 'AuthIntegration'
      });
      return;
    }

    this.config = config;

    config.logger.info('Initializing Enterprise Auth Integration', undefined, {
      service: 'AuthIntegration',
      metadata: {
        environment: config.environment,
        securityFeatures: config.securityFeatures,
        performance: config.performance
      }
    });

    // Initialize AuthServiceContainer with custom configuration
    this.container = AuthServiceContainer.getInstance();
    
    await this.container.initialize({
      logger: config.logger,
      enableAdvancedSecurity: config.securityFeatures.enableAdvancedSecurity,
      enableBiometric: config.securityFeatures.enableBiometric,
      enableOAuth: config.securityFeatures.enableOAuth,
      enableMFA: config.securityFeatures.enableMFA,
      enableCompliance: config.securityFeatures.enableCompliance,
      enablePasswordPolicy: config.securityFeatures.enablePasswordPolicy,
      enableAuthOrchestrator: true,
      securityConfig: {
        enableThreatAssessment: config.securityFeatures.enableAdvancedSecurity,
        enableDeviceFingerprinting: config.securityFeatures.enableAdvancedSecurity,
        enableLocationMonitoring: config.securityFeatures.enableAdvancedSecurity,
        cache: {
          enabled: config.performance.enableCaching,
          ttl: this.getCacheTTLForEnvironment(config.environment),
          maxSize: this.getCacheSizeForEnvironment(config.environment),
          cleanupInterval: 60000
        },
        performance: {
          enableMetrics: config.performance.enableMetrics,
          enableCircuitBreaker: config.performance.enableCircuitBreaker,
          circuitBreakerThreshold: 5,
          circuitBreakerTimeout: 30000,
          enableLazyLoading: true
        }
      }
    });

    this.initialized = true;

    config.logger.info('Enterprise Auth Integration initialized successfully', undefined, {
      service: 'AuthIntegration',
      metadata: {
        containerInitialized: true,
        environment: config.environment
      }
    });
  }

  /**
   * @method getContainer
   * @description Get the initialized service container
   * 
   * @returns {AuthServiceContainer} Service container instance
   * 
   * @throws {Error} When integration not initialized
   * 
   * @example Direct Container Access
   * ```typescript
   * const container = integration.getContainer();
   * 
   * // Get any service directly
   * const authRepository = container.getAuthRepository();
   * const mfaService = container.getMFAService();
   * const complianceService = container.getComplianceService();
   * 
   * // Use services
   * const user = await authRepository.login(email, password);
   * await mfaService.setupTOTP(user.id);
   * ```
   */
  public getContainer(): AuthServiceContainer {
    this.ensureInitialized();
    return this.container!;
  }

  /**
   * @method reset
   * @description Reset integration for clean state
   * 
   * @businessRule BR-603: Clean lifecycle management
   * 
   * @example Reset Integration
   * ```typescript
   * integration.reset();
   * // Integration is now in clean state, ready for re-initialization
   * ```
   */
  public reset(): void {
    if (this.container) {
      this.container.reset();
    }
    this.container = null;
    this.config = null;
    this.initialized = false;
  }

  /**
   * @method isInitialized
   * @description Check if integration is initialized
   * 
   * @returns {boolean} Initialization status
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  // ==========================================
  // 🔧 PRIVATE HELPER METHODS
  // ==========================================

  /**
   * @private
   * @method ensureInitialized
   * @description Ensure integration is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('AuthIntegration not initialized. Call initialize() first.');
    }
  }

  /**
   * @private
   * @method getCacheTTLForEnvironment
   * @description Get cache TTL based on environment
   */
  private getCacheTTLForEnvironment(environment: Environment | EnvironmentValue): number {
    switch (environment) {
      case Environment.PRODUCTION: return 300000; // 5 minutes
      case Environment.STAGING: return 180000;    // 3 minutes
      case Environment.DEVELOPMENT: return 60000; // 1 minute
      case Environment.TESTING: return 0;         // No cache
      default: return 180000;                     // Default 3 minutes
    }
  }

  /**
   * @private
   * @method getCacheSizeForEnvironment
   * @description Get cache size based on environment
   */
  private getCacheSizeForEnvironment(environment: Environment | EnvironmentValue): number {
    switch (environment) {
      case Environment.PRODUCTION: return 1000;
      case Environment.STAGING: return 500;
      case Environment.DEVELOPMENT: return 100;
      case Environment.TESTING: return 0;
      default: return 500;
    }
  }
}

// ==========================================
// 🚀 CONVENIENCE FUNCTIONS
// ==========================================

/**
 * @function createEnterpriseAuthIntegration
 * @description Quick factory für Enterprise Auth Integration
 * 
 * @param {Partial<AuthIntegrationConfig> & { logger: ILoggerService; environment: Environment | EnvironmentValue }} config - Basic config
 * @returns {Promise<AuthIntegration>} Configured integration
 * 
 * @example Enterprise Integration
 * ```typescript
 * const integration = await createEnterpriseAuthIntegration({
 *   logger: enterpriseLogger,
 *   environment: Environment.PRODUCTION
 * });
 * 
 * const container = integration.getContainer();
 * const complianceService = container.getComplianceService();
 * ```
 */
export async function createEnterpriseAuthIntegration(
  config: Partial<AuthIntegrationConfig> & { logger: ILoggerService; environment: Environment | EnvironmentValue }
): Promise<AuthIntegration> {
  const integration = new AuthIntegration();
  
  await integration.initialize({
    logger: config.logger,
    environment: config.environment,
    securityFeatures: {
      enableAdvancedSecurity: true,
      enableBiometric: true,
      enableOAuth: true,
      enableMFA: true,
      enableCompliance: true,
      enablePasswordPolicy: true,
      ...config.securityFeatures
    },
    performance: {
      enableCaching: true,
      enableMetrics: true,
      enableCircuitBreaker: true,
      ...config.performance
    }
  });

  return integration;
}

/**
 * @function createTestingAuthIntegration
 * @description Quick factory für Testing Auth Integration
 * 
 * @param {ILoggerService} logger - Test logger
 * @returns {Promise<AuthIntegration>} Test-configured integration
 * 
 * @example Testing Integration
 * ```typescript
 * const testIntegration = await createTestingAuthIntegration(testLogger);
 * const container = testIntegration.getContainer();
 * const authRepository = container.getAuthRepository();
 * ```
 */
export async function createTestingAuthIntegration(logger: ILoggerService): Promise<AuthIntegration> {
  const integration = new AuthIntegration();
  
  await integration.initialize({
    logger,
    environment: Environment.TESTING,
    securityFeatures: {
      enableAdvancedSecurity: false,
      enableBiometric: false,
      enableOAuth: false,
      enableMFA: false,
      enableCompliance: false,
      enablePasswordPolicy: false
    },
    performance: {
      enableCaching: false,
      enableMetrics: false,
      enableCircuitBreaker: false
    }
  });

  return integration;
}

// ==========================================
// 🎯 USAGE RECOMMENDATIONS
// ==========================================

/**
 * @example Recommended Usage Patterns
 * 
 * // 🏭 For Service Layer (Backend/Enterprise Logic):
 * ```typescript
 * // Quick environment setup
 * const container = await AuthIntegration.createForEnvironment(Environment.PRODUCTION, logger);
 * const mfaService = container.getMFAService();
 * const complianceService = container.getComplianceService();
 * 
 * // Use services directly
 * await mfaService.setupTOTP(userId);
 * const report = await complianceService.generateComplianceReport();
 * ```
 * 
 * // 🎨 For UI Components (React Native):
 * ```typescript
 * import { useAuth } from '@features/auth/presentation/hooks';
 * 
 * function MyComponent() {
 *   const { enterprise, user, login } = useAuth();
 *   
 *   const handleMFASetup = () => enterprise.mfa.enable('totp');
 *   const handleLogin = () => login(email, password);
 *   
 *   return <Button onPress={handleMFASetup}>Enable 2FA</Button>;
 * }
 * ```
 * 
 * // 🧪 For Testing:
 * ```typescript
 * const testIntegration = await createTestingAuthIntegration(mockLogger);
 * const container = testIntegration.getContainer();
 * const authRepository = container.getAuthRepository();
 * ```
 */ 