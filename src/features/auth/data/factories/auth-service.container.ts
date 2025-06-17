/**
 * @fileoverview DATA-CONTAINER-001: Enterprise Auth Service Container
 * @description Container für alle Auth Services mit Factory-basierter Dependency Injection.
 * Implementiert Singleton Pattern für Service Management und konsistente Factory-Nutzung.
 * Eliminiert alle Service-Singleton-Pattern zugunsten von zentraler DI.
 * 
 * @businessRule BR-400: Centralized service container for dependency management
 * @businessRule BR-401: Factory-based service creation for all auth services
 * @businessRule BR-402: Singleton pattern for service lifecycle management
 * @businessRule BR-403: Lazy loading and optimal resource management
 * @businessRule BR-404: Elimination of service-level singleton patterns
 * @businessRule BR-405: Complete dependency injection for all services
 * 
 * @architecture Service container pattern with factory delegation
 * @architecture Dependency injection container for Clean Architecture
 * @architecture Centralized service lifecycle management
 * @architecture Factory pattern integration for all services
 * @architecture No singleton services - only container-level singleton
 * 
 * @performance Lazy loading for optimal startup performance
 * @performance Service caching for reduced instantiation overhead
 * @performance Memory-optimized service management
 * 
 * @since 1.0.0
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthServiceContainer
 * @namespace Auth.Data.Factories
 */

// Core imports
import type { ILoggerService } from '@core/logging/logger.service.interface';
import { Environment } from '@core/config/environment.config.interface';

// Factory imports
import { OptimizedSecurityServiceFactory } from './security-service.factory';
import type { 
  IAdvancedSecurityService, 
  EnhancedSecurityServiceConfig 
} from '../interfaces/security-service-factory.interfaces';

// Service implementations
import { AuthRepositoryImpl } from '../repository/auth.repository.impl';
import { AuthSupabaseDatasource } from '../sources/auth.supabase.datasource';
import { BiometricAuthServiceImpl } from '../services/biometric-auth.service.impl';
import { OAuthServiceImpl } from '../services/oauth.service.impl';
import { MFAServiceImpl } from '../services/mfa.service.impl';
import { ComplianceServiceImpl } from '../services/compliance.service.impl';
import { PasswordPolicyServiceImpl } from '../services/password-policy.service.impl';

// Application services - AuthOrchestratorService removed for architectural simplification

// Domain interfaces
import type { AuthRepository } from '../../domain/interfaces/auth.repository.interface';
import type { OAuthConfig } from '../../domain/interfaces/oauth.service.interface';
import type { MFAMethod } from '../../domain/interfaces/mfa.service.interface';
import type { UserDataExport, ComplianceReport } from '../../domain/interfaces/compliance.service.interface';

/**
 * @interface AuthServiceContainerConfig
 * @description Configuration for the auth service container
 */
export interface AuthServiceContainerConfig {
  /** Logger service instance */
  logger: ILoggerService;
  
  /** Security service configuration */
  securityConfig?: EnhancedSecurityServiceConfig;
  
  /** OAuth configuration */
  oauthConfig?: OAuthConfig;
  
  /** MFA configuration */
  mfaConfig?: Record<string, unknown>;
  
  /** Compliance configuration */
  complianceConfig?: Record<string, unknown>;
  
  /** Password policy configuration */
  passwordPolicyConfig?: Record<string, unknown>;
  
  /** Enable advanced security features */
  enableAdvancedSecurity?: boolean;
  
  /** Enable biometric authentication */
  enableBiometric?: boolean;
  
  /** Enable OAuth providers */
  enableOAuth?: boolean;
  
  /** Enable MFA services */
  enableMFA?: boolean;
  
  /** Enable compliance services */
  enableCompliance?: boolean;
  
  /** Enable password policy enforcement */
  enablePasswordPolicy?: boolean;
  
  // enableAuthOrchestrator removed - architectural simplification
  
  /** Cache service instance */
  cache?: Record<string, unknown>;
  
  /** Metrics service instance */
  metrics?: Record<string, unknown>;
  
  /** Health check service instance */
  healthCheck?: Record<string, unknown>;
  
  /** Environment configuration */
  environment?: Environment;
}

/**
 * @interface AuthServices
 * @description Container für alle Auth Services
 */
export interface AuthServices {
  /** Main auth repository */
  authRepository: AuthRepository;
  
  /** Advanced security service */
  securityService?: IAdvancedSecurityService;
  
  /** Biometric auth service */
  biometricService?: BiometricAuthServiceImpl;
  
  /** OAuth service */
  oauthService?: OAuthServiceImpl;
  
  /** MFA service */
  mfaService?: MFAServiceImpl;
  
  /** Compliance service */
  complianceService?: ComplianceServiceImpl;
  
  /** Password policy service */
  passwordPolicyService?: PasswordPolicyServiceImpl;
  
  // authOrchestratorService removed - architectural simplification
  
  /** Logger service */
  logger: ILoggerService;
}

/**
 * @class AuthServiceContainer
 * @description Enterprise Auth Service Container
 * 
 * Centralized container für alle Auth Services mit:
 * - Factory-basierte Service-Erstellung
 * - Dependency Injection Management
 * - Lazy Loading für Performance
 * - Singleton Pattern für Service Lifecycle
 * - Konsistente Configuration Management
 * - Elimination aller Service-Singleton-Pattern
 * 
 * @example Enterprise Service Container Usage
 * ```typescript
 * // Container initialisieren
 * const container = AuthServiceContainer.getInstance();
 * 
 * // Services konfigurieren
 * await container.initialize({
 *   logger: enterpriseLogger,
 *   enableAdvancedSecurity: true,
 *   enableBiometric: true,
 *   enableOAuth: true,
 *   enableMFA: true,
 *   enableCompliance: true,
 *   enablePasswordPolicy: true,
 *   securityConfig: {
 *     enableThreatAssessment: true,
 *     cache: { enabled: true, ttl: 300000 }
 *   }
 * });
 * 
 * // Services abrufen
 * const authRepository = container.getAuthRepository();
 * const mfaService = container.getMFAService();
 * const complianceService = container.getComplianceService();
 * // AuthOrchestratorService removed - use container.getAuthRepository() directly
 * ```
 */
export class AuthServiceContainer {
  /**
   * @static
   * @private
   * @description Singleton instance
   */
  private static instance: AuthServiceContainer | null = null;

  /**
   * @private
   * @description Container configuration
   */
  private config: AuthServiceContainerConfig | null = null;

  /**
   * @private
   * @description Cached services
   */
  private services: Partial<AuthServices> = {};

  /**
   * @private
   * @description Initialization status
   */
  private initialized = false;

  /**
   * @private
   * @constructor
   * @description Private constructor for singleton pattern
   */
  private constructor() {}

  /**
   * @static
   * @method getInstance
   * @description Get singleton instance of the auth service container
   * 
   * @returns {AuthServiceContainer} Container instance
   * 
   * @example Get Container Instance
   * ```typescript
   * const container = AuthServiceContainer.getInstance();
   * ```
   */
  public static getInstance(): AuthServiceContainer {
    if (!AuthServiceContainer.instance) {
      AuthServiceContainer.instance = new AuthServiceContainer();
    }
    return AuthServiceContainer.instance;
  }

  /**
   * @method initialize
   * @description Initialize the container with configuration and create core services
   * 
   * @param {AuthServiceContainerConfig} config - Container configuration
   * @returns {Promise<void>} Promise resolving when initialization complete
   * 
   * @businessRule BR-400: Centralized service container initialization
   * @businessRule BR-401: Factory-based service creation for all services
   * @businessRule BR-403: Lazy loading and optimal resource management
   * 
   * @example Initialize Container
   * ```typescript
   * await container.initialize({
   *   logger: enterpriseLogger,
   *   enableAdvancedSecurity: true,
   *   securityConfig: {
   *     enableThreatAssessment: true,
   *     cache: { enabled: true, ttl: 300000 }
   *   }
   * });
   * ```
   */
  public async initialize(config: AuthServiceContainerConfig): Promise<void> {
    if (this.initialized) {
      config.logger.warn('AuthServiceContainer already initialized', undefined, {
        service: 'AuthServiceContainer'
      });
      return;
    }

    this.config = config;
    this.services.logger = config.logger;

    config.logger.info('Initializing Auth Service Container', undefined, {
      service: 'AuthServiceContainer',
      metadata: {
        enableAdvancedSecurity: config.enableAdvancedSecurity,
        enableBiometric: config.enableBiometric,
        enableOAuth: config.enableOAuth,
        enableMFA: config.enableMFA,
        enableCompliance: config.enableCompliance,
        enablePasswordPolicy: config.enablePasswordPolicy,
        // enableAuthOrchestrator removed - architectural simplification
        environment: config.environment || Environment.DEVELOPMENT
      }
    });

    // Initialize core services eagerly
    await this.initializeCoreServices();

    this.initialized = true;
    
    config.logger.info('Auth Service Container initialized successfully', undefined, {
      service: 'AuthServiceContainer',
      metadata: {
        servicesCreated: Object.keys(this.services).length
      }
    });
  }

  /**
   * @method getAuthRepository
   * @description Get the main auth repository with all dependencies
   * 
   * @returns {AuthRepository} Auth repository instance
   * 
   * @throws {Error} When container not initialized
   * 
   * @example Get Auth Repository
   * ```typescript
   * const authRepository = container.getAuthRepository();
   * const user = await authRepository.login(email, password);
   * ```
   */
  public getAuthRepository(): AuthRepository {
    this.ensureInitialized();

    if (!this.services.authRepository) {
      throw new Error('AuthRepository not available. Check container initialization.');
    }

    return this.services.authRepository;
  }

  /**
   * @method getSecurityService
   * @description Get the advanced security service (lazy loaded)
   * 
   * @returns {Promise<IAdvancedSecurityService>} Security service instance
   * 
   * @throws {Error} When container not initialized or security not enabled
   * 
   * @example Get Security Service
   * ```typescript
   * const securityService = await container.getSecurityService();
   * const fingerprint = await securityService.generateDeviceFingerprint();
   * ```
   */
  public async getSecurityService(): Promise<IAdvancedSecurityService> {
    this.ensureInitialized();

    if (!this.config!.enableAdvancedSecurity) {
      throw new Error('Advanced security not enabled in container configuration');
    }

    if (!this.services.securityService) {
      this.services.securityService = await this.createSecurityService();
    }

    return this.services.securityService;
  }

  /**
   * @method getBiometricService
   * @description Get the biometric auth service (lazy loaded)
   * 
   * @returns {BiometricAuthServiceImpl} Biometric service instance
   * 
   * @throws {Error} When container not initialized or biometric not enabled
   */
  public getBiometricService(): BiometricAuthServiceImpl {
    this.ensureInitialized();

    if (!this.config!.enableBiometric) {
      throw new Error('Biometric authentication not enabled in container configuration');
    }

    if (!this.services.biometricService) {
      this.services.biometricService = this.createBiometricService();
    }

    return this.services.biometricService;
  }

  /**
   * @method getOAuthService
   * @description Get the OAuth service (lazy loaded)
   * 
   * @returns {OAuthServiceImpl} OAuth service instance
   * 
   * @throws {Error} When container not initialized or OAuth not enabled
   */
  public getOAuthService(): OAuthServiceImpl {
    this.ensureInitialized();

    if (!this.config!.enableOAuth) {
      throw new Error('OAuth authentication not enabled in container configuration');
    }

    if (!this.services.oauthService) {
      this.services.oauthService = this.createOAuthService();
    }

    return this.services.oauthService;
  }

  /**
   * @method getMFAService
   * @description Get the MFA service (lazy loaded)
   * 
   * @returns {MFAServiceImpl} MFA service instance
   * 
   * @throws {Error} When container not initialized or MFA not enabled
   */
  public getMFAService(): MFAServiceImpl {
    this.ensureInitialized();

    if (!this.config!.enableMFA) {
      throw new Error('MFA service not enabled in container configuration');
    }

    if (!this.services.mfaService) {
      this.services.mfaService = this.createMFAService();
    }

    return this.services.mfaService;
  }

  /**
   * @method getComplianceService
   * @description Get the compliance service (lazy loaded)
   * 
   * @returns {ComplianceServiceImpl} Compliance service instance
   * 
   * @throws {Error} When container not initialized or compliance not enabled
   */
  public getComplianceService(): ComplianceServiceImpl {
    this.ensureInitialized();

    if (!this.config!.enableCompliance) {
      throw new Error('Compliance service not enabled in container configuration');
    }

    if (!this.services.complianceService) {
      this.services.complianceService = this.createComplianceService();
    }

    return this.services.complianceService;
  }

  /**
   * @method getPasswordPolicyService
   * @description Get the password policy service (lazy loaded)
   * 
   * @returns {PasswordPolicyServiceImpl} Password policy service instance
   * 
   * @throws {Error} When container not initialized or password policy not enabled
   */
  public getPasswordPolicyService(): PasswordPolicyServiceImpl {
    this.ensureInitialized();

    if (!this.config!.enablePasswordPolicy) {
      throw new Error('Password policy service not enabled in container configuration');
    }

    if (!this.services.passwordPolicyService) {
      this.services.passwordPolicyService = this.createPasswordPolicyService();
    }

    return this.services.passwordPolicyService;
  }

  // getAuthOrchestratorService removed - architectural simplification

  /**
   * @method getAllServices
   * @description Get all initialized services
   * 
   * @returns {Partial<AuthServices>} All available services
   * 
   * @example Get All Services
   * ```typescript
   * const services = container.getAllServices();
   * console.log('Available services:', Object.keys(services));
   * ```
   */
  public getAllServices(): Partial<AuthServices> {
    this.ensureInitialized();
    return { ...this.services };
  }

  /**
   * @method reset
   * @description Reset the container and clear all cached services
   * 
   * @businessRule BR-402: Proper container lifecycle management
   * 
   * @example Reset Container
   * ```typescript
   * container.reset();
   * // Container is now in clean state
   * ```
   */
  public reset(): void {
    this.services = {};
    this.config = null;
    this.initialized = false;

    if (this.services.logger) {
      this.services.logger.info('Auth Service Container reset', undefined, {
        service: 'AuthServiceContainer'
      });
    }
  }

  /**
   * @method isInitialized
   * @description Check if container is initialized
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
   * @method initializeCoreServices
   * @description Initialize core services that are always needed
   */
  private async initializeCoreServices(): Promise<void> {
    const logger = this.config!.logger;

    try {
      // Create auth datasource
      const authDataSource = new AuthSupabaseDatasource();

      // Create optional services first (for repository dependencies)
      const biometricService = this.config!.enableBiometric 
        ? this.createBiometricService() 
        : undefined;

      const oauthService = this.config!.enableOAuth 
        ? this.createOAuthService() 
        : undefined;

      // Create auth repository with all dependencies
      this.services.authRepository = new AuthRepositoryImpl(
        authDataSource,
        biometricService || new BiometricAuthServiceImpl(logger), // Fallback
        oauthService || new OAuthServiceImpl({
          google: { webClientId: 'fallback-google-client-id' },
          apple: { enabled: false },
          microsoft: { 
            clientId: 'fallback-microsoft-client-id',
            redirectUrl: 'com.app://oauth/microsoft',
            scopes: ['openid', 'profile', 'email']
          }
        }, logger), // Fallback
        logger
      );

      // Store optional services if created
      if (biometricService) {
        this.services.biometricService = biometricService;
      }
      if (oauthService) {
        this.services.oauthService = oauthService;
      }

      logger.info('Core auth services initialized', undefined, {
        service: 'AuthServiceContainer',
        metadata: {
          authRepository: true,
          biometricService: !!biometricService,
          oauthService: !!oauthService
        }
      });
    } catch (error) {
      logger.error('Failed to initialize core services', undefined, {
        service: 'AuthServiceContainer'
      }, error as Error);
      throw error;
    }
  }

  /**
   * @private
   * @method createSecurityService
   * @description Create advanced security service using factory
   */
  private async createSecurityService(): Promise<IAdvancedSecurityService> {
    const logger = this.config!.logger;

    logger.info('Creating advanced security service', undefined, {
      service: 'AuthServiceContainer'
    });

    const securityConfig: EnhancedSecurityServiceConfig = {
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
      // Additional properties
      enableThreatAssessment: true,
      enableDeviceFingerprinting: true,
      enableLocationMonitoring: true,
      // Override with user config
      ...this.config!.securityConfig
    };

    return await OptimizedSecurityServiceFactory.create({
      logger,
      config: securityConfig,
      cache: this.config!.cache,
      metrics: this.config!.metrics,
      healthCheck: this.config!.healthCheck
    });
  }

  /**
   * @private
   * @method createBiometricService
   * @description Create biometric auth service
   */
  private createBiometricService(): BiometricAuthServiceImpl {
    const logger = this.config!.logger;

    logger.info('Creating biometric auth service', undefined, {
      service: 'AuthServiceContainer'
    });

    return new BiometricAuthServiceImpl(logger);
  }

  /**
   * @private
   * @method createOAuthService
   * @description Create OAuth service
   */
  private createOAuthService(): OAuthServiceImpl {
    const logger = this.config!.logger;

    logger.info('Creating OAuth service', undefined, {
      service: 'AuthServiceContainer'
    });

    // Default OAuth configuration if none provided
    const defaultOAuthConfig = {
      google: {
        webClientId: 'default-google-client-id'
      },
      apple: {
        enabled: false
      },
      microsoft: {
        clientId: 'default-microsoft-client-id',
        redirectUrl: 'com.app://oauth/microsoft',
        scopes: ['openid', 'profile', 'email']
      }
    };

    const oauthConfig = this.config!.oauthConfig || defaultOAuthConfig;
    return new OAuthServiceImpl(oauthConfig, logger);
  }

  /**
   * @private
   * @method createMFAService
   * @description Create MFA service
   */
  private createMFAService(): MFAServiceImpl {
    const logger = this.config!.logger;

    logger.info('Creating MFA service', undefined, {
      service: 'AuthServiceContainer'
    });

    return new MFAServiceImpl(logger);
  }

  /**
   * @private
   * @method createComplianceService
   * @description Create compliance service
   */
  private createComplianceService(): ComplianceServiceImpl {
    const logger = this.config!.logger;

    logger.info('Creating compliance service', undefined, {
      service: 'AuthServiceContainer'
    });

    return new ComplianceServiceImpl(logger);
  }

  /**
   * @private
   * @method createPasswordPolicyService
   * @description Create password policy service
   */
  private createPasswordPolicyService(): PasswordPolicyServiceImpl {
    const logger = this.config!.logger;

    logger.info('Creating password policy service', undefined, {
      service: 'AuthServiceContainer'
    });

    return new PasswordPolicyServiceImpl(logger);
  }

  // createAuthOrchestratorService removed - architectural simplification

  /**
   * @private
   * @method ensureInitialized
   * @description Ensure container is initialized before service access
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('AuthServiceContainer not initialized. Call initialize() first.');
    }
  }

  /**
   * @static
   * @method resetInstance
   * @description Reset singleton instance (for testing)
   */
  public static resetInstance(): void {
    if (AuthServiceContainer.instance) {
      AuthServiceContainer.instance.reset();
      AuthServiceContainer.instance = null;
    }
  }

  // ===================================
  // ENTERPRISE SERVICE METHODS
  // ===================================

  /**
   * @method enableMFA
   * @description Enable MFA for user
   */
  public async enableMFA(method: 'totp' | 'sms', phoneNumber?: string): Promise<{ qrCode?: string; backupCodes?: string[]; success: boolean }> {
    const mfaService = this.getMFAService();
    if (method === 'totp') {
      const result = await mfaService.setupTOTP('current-user-id');
      return {
        qrCode: result.qrCode,
        backupCodes: result.backupCodes,
        success: result.success
      };
    } else if (method === 'sms' && phoneNumber) {
      const result = await mfaService.setupSMS('current-user-id', phoneNumber);
      return {
        success: result.success
      };
    }
    return { success: false };
  }

  /**
   * @method verifyMFA
   * @description Verify MFA code
   */
  public async verifyMFA(code: string, method: 'totp' | 'sms'): Promise<boolean> {
    const mfaService = this.getMFAService();
    if (method === 'totp') {
      const result = await mfaService.verifyTOTP('current-user-id', code);
      return result.verified;
    } else if (method === 'sms') {
      const result = await mfaService.verifySMSCode('current-user-id', code);
      return result.verified;
    }
    return false;
  }

  /**
   * @method getMFAFactors
   * @description Get user's MFA factors
   */
  public async getMFAFactors(): Promise<MFAMethod[]> {
    const mfaService = this.getMFAService();
    return await mfaService.getMFAMethods('current-user-id');
  }

  /**
   * @method enableBiometric
   * @description Enable biometric authentication
   */
  public async enableBiometric(): Promise<boolean> {
    const biometricService = this.getBiometricService();
    const availability = await biometricService.isBiometricAvailable();
    if (availability.available) {
      const keys = await biometricService.createBiometricKeys('current-user-id');
      return !!keys.publicKey;
    }
    return false;
  }

  /**
   * @method authenticateWithBiometric
   * @description Authenticate using biometric
   */
  public async authenticateWithBiometric(): Promise<void> {
    const biometricService = this.getBiometricService();
    const availability = await biometricService.isBiometricAvailable();
    if (!availability.available) {
      throw new Error('Biometric authentication not available');
    }
    
    const promptMessage = biometricService.getPromptMessage(availability.biometryType);
    const result = await biometricService.authenticateWithBiometric('current-user-id', promptMessage);
    
    if (!result.success) {
      throw new Error(result.error || 'Biometric authentication failed');
    }
  }

  /**
   * @method isBiometricAvailable
   * @description Check if biometric is available
   */
  public async isBiometricAvailable(): Promise<boolean> {
    const biometricService = this.getBiometricService();
    const availability = await biometricService.isBiometricAvailable();
    return availability.available;
  }

  /**
   * @method validatePassword
   * @description Validate password against policy
   */
  public async validatePassword(password: string): Promise<{ isValid: boolean; errors: string[]; suggestions: string[] }> {
    const passwordPolicyService = this.getPasswordPolicyService();
    return await passwordPolicyService.validatePassword(password);
  }

  /**
   * @method exportUserData
   * @description Export user data for compliance
   */
  public async exportUserData(): Promise<UserDataExport> {
    const complianceService = this.getComplianceService();
    return await complianceService.exportUserData('current-user-id');
  }

  /**
   * @method requestDataDeletion
   * @description Request data deletion for user
   */
  public async requestDataDeletion(reason: string): Promise<void> {
    const complianceService = this.getComplianceService();
    await complianceService.requestDataDeletion('current-user-id', reason);
  }

  /**
   * @method generateComplianceReport
   * @description Generate compliance report
   */
  public async generateComplianceReport(): Promise<ComplianceReport> {
    const complianceService = this.getComplianceService();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    return await complianceService.generateComplianceReport(startDate, endDate);
  }

  /**
   * @method loginWithGoogle
   * @description Login with Google OAuth
   */
  public async loginWithGoogle(): Promise<void> {
    const oauthService = this.getOAuthService();
    const result = await oauthService.signInWithGoogle();
    if (!result.success) {
      throw new Error(result.error || 'Google login failed');
    }
  }

  /**
   * @method loginWithApple
   * @description Login with Apple OAuth
   */
  public async loginWithApple(): Promise<void> {
    const oauthService = this.getOAuthService();
    const result = await oauthService.signInWithApple();
    if (!result.success) {
      throw new Error(result.error || 'Apple login failed');
    }
  }
} 