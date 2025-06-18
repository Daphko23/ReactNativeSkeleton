/**
 * @fileoverview AUTH-CONTAINER-001: Enterprise Auth DI Container - Industry Standard 2025
 * @description Application Layer DI Container für Authentication Feature nach Profile Feature Pattern.
 * Implementiert Clean Architecture mit sauberer Dependency Injection für alle Auth Operations.
 *
 * @businessRule BR-500: Consistent DI Container pattern across all features
 * @businessRule BR-501: Clean Architecture separation with Application Layer DI
 * @businessRule BR-502: Enterprise service lifecycle management
 * @businessRule BR-503: Testing-friendly dependency injection
 *
 * @architecture Clean Architecture Application Layer
 * @architecture Dependency Injection Container Pattern
 * @architecture Lazy Loading für Performance Optimization
 * @architecture Testing utilities für Mock Integration
 *
 * @performance Lazy loading für alle Services und UseCases
 * @performance Singleton pattern für Container Instance
 * @performance Memory-efficient service instantiation
 *
 * @security Secure service initialization
 * @security Proper error handling in service creation
 * @security Enterprise logging für alle service operations
 *
 * @compliance Industry Standard 2025 - Enterprise DI Container
 * @compliance Clean Architecture - Application Layer Pattern
 * @compliance SOLID Principles - Dependency Inversion
 *
 * @since 2.1.0
 * @version 2.1.0 - Industry Standard 2025 Compliance
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthContainer
 * @namespace Auth.Application.DI
 */

import type { AuthRepository } from '../../domain/interfaces/auth.repository.interface';
// Import IAuthService entfernt - aktuell nicht verwendet
import type { ILoggerService } from '@core/logging/logger.service.interface';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import { isBusinessError } from '../utils/auth-error.utils';

// Data Layer Imports
import { AuthRepositoryImpl } from '../../data/repository/auth.repository.impl';
import { AuthSupabaseDatasource } from '../../data/sources/auth.supabase.datasource';
import { BiometricAuthServiceImpl } from '../../data/services/biometric-auth.service.impl';
import { OAuthServiceImpl } from '../../data/services/oauth.service.impl';
import { MFAServiceImpl } from '../../data/services/mfa.service.impl';
import { PasswordPolicyServiceImpl } from '../../data/services/password-policy.service.impl';
import { AdvancedSecurityServiceImpl } from '../../data/services/advanced-security.service.impl';
import { ComplianceServiceImpl } from '../../data/services/compliance.service.impl';

// Application Layer - Service Implementation removed (redundancy eliminated)

// Application Layer - Use Cases (6 Essential UseCase after Over-Engineering Elimination)
import { LoginWithEmailUseCase } from '../usecases/login-with-email.usecase';
import { RegisterWithEmailUseCase } from '../usecases/register-with-email.usecase';
import { LogoutUseCase } from '../usecases/logout.usecase';
import { PasswordResetUseCase } from '../usecases/password-reset.usecase';
import { IsAuthenticatedUseCase } from '../usecases/is-authenticated.usecase';
import { GetCurrentUserUseCase } from '../usecases/get-current-user.usecase';

// 🗑️ ELIMINATED USE CASES (5.424 Zeilen Over-Engineering removed):
// ❌ UpdatePasswordUseCase - deleted (642 lines)
// ❌ EnableMFAUseCase - deleted (511 lines)
// ❌ VerifyMFAUseCase - deleted (607 lines)
// ❌ EnableBiometricUseCase - deleted (531 lines)
// ❌ AuthenticateWithBiometricUseCase - deleted (459 lines)
// ❌ LoginWithGoogleUseCase - deleted (624 lines)
// ❌ HasPermissionUseCase - deleted (703 lines)
// ❌ GetActiveSessionsUseCase - deleted (656 lines)
// ❌ CheckSuspiciousActivityUseCase - deleted (691 lines)

/**
 * @interface AuthContainerOptions
 * @description Configuration options für Auth Container Initialization
 */
interface AuthContainerOptions {
  /** Enable real-time session synchronization */
  enableRealTimeSync?: boolean;
  /** Enable enterprise security features */
  enableAdvancedSecurity?: boolean;
  /** Enable biometric authentication */
  enableBiometric?: boolean;
  /** Enable OAuth social login */
  enableOAuth?: boolean;
  /** Enable multi-factor authentication */
  enableMFA?: boolean;
  /** Enable compliance and audit features */
  enableCompliance?: boolean;
  /** Enable password policy enforcement */
  enablePasswordPolicy?: boolean;
  /** Maximum concurrent sessions */
  maxConcurrentSessions?: number;
  /** Session timeout in milliseconds */
  sessionTimeout?: number;
  /** Enable enterprise analytics */
  enableAnalytics?: boolean;
}

/**
 * @class AuthContainer
 * @description Enterprise Authentication DI Container
 *
 * Application Layer Dependency Injection Container für alle Authentication Operations.
 * Implementiert Clean Architecture Pattern mit sauberer Trennung zwischen Domain,
 * Application und Data Layers. Bietet Lazy Loading, Testing Support und Enterprise
 * Configuration Management.
 *
 * **Key Features:**
 * - **Clean Architecture**: Saubere Schichtentrennung mit DI Container
 * - **Lazy Loading**: Performance-optimierte Service Instantiation
 * - **Enterprise Features**: MFA, Biometric, OAuth, Compliance, Security
 * - **Testing Support**: Mock injection und Container reset
 * - **Configuration Management**: Environment-specific options
 *
 * **Usage Pattern (nach Profile Feature Pattern):**
 * ```typescript
 * // Container Initialization
 * await authContainer.initialize({
 *   enableAdvancedSecurity: true,
 *   enableMFA: true,
 *   enableBiometric: true
 * });
 *
 * // Service Access
 * const loginUseCase = authContainer.loginUseCase;
 * const authService = authContainer.authService;
 *
 * // Testing
 * authContainer.setAuthRepository(mockRepository);
 * ```
 *
 * @implements Clean Architecture Application Layer Pattern
 * @implements Enterprise DI Container Standards
 *
 * @businessRule BR-500: Consistent DI pattern across features
 * @businessRule BR-501: Clean service lifecycle management
 * @businessRule BR-502: Enterprise configuration support
 * @businessRule BR-503: Testing-friendly design
 *
 * @since 2.1.0
 */
class AuthContainer {
  // ==========================================
  // 🏗️ DATA LAYER DEPENDENCIES
  // ==========================================

  private _authDatasource: AuthSupabaseDatasource | null = null;
  private _authRepository: AuthRepository | null = null;
  private _biometricService: BiometricAuthServiceImpl | null = null;
  private _oauthService: OAuthServiceImpl | null = null;
  private _mfaService: MFAServiceImpl | null = null;
  private _passwordPolicyService: PasswordPolicyServiceImpl | null = null;
  private _advancedSecurityService: AdvancedSecurityServiceImpl | null = null;
  private _complianceService: ComplianceServiceImpl | null = null;

  // ==========================================
  // 🎯 APPLICATION LAYER DEPENDENCIES
  // ==========================================

  // AuthOrchestratorService removed - Hooks use Container directly

  // ==========================================
  // 🔧 USE CASES (6 Essential UseCases after Over-Engineering Elimination)
  // ==========================================

  // Essential Authentication UseCases (React Native-appropriate complexity)
  private _loginWithEmailUseCase: LoginWithEmailUseCase | null = null;
  private _registerWithEmailUseCase: RegisterWithEmailUseCase | null = null;
  private _logoutUseCase: LogoutUseCase | null = null;
  private _passwordResetUseCase: PasswordResetUseCase | null = null;
  private _isAuthenticatedUseCase: IsAuthenticatedUseCase | null = null;
  private _getCurrentUserUseCase: GetCurrentUserUseCase | null = null;

  // 🗑️ ELIMINATED PRIVATE PROPERTIES (9 Over-Engineering UseCase Properties removed)
  // ❌ private _updatePasswordUseCase: UpdatePasswordUseCase | null = null;
  // ❌ private _enableMFAUseCase: EnableMFAUseCase | null = null;
  // ❌ private _verifyMFAUseCase: VerifyMFAUseCase | null = null;
  // ❌ private _enableBiometricUseCase: EnableBiometricUseCase | null = null;
  // ❌ private _authenticateWithBiometricUseCase: AuthenticateWithBiometricUseCase | null = null;
  // ❌ private _loginWithGoogleUseCase: LoginWithGoogleUseCase | null = null;
  // ❌ private _hasPermissionUseCase: HasPermissionUseCase | null = null;
  // ❌ private _getActiveSessionsUseCase: GetActiveSessionsUseCase | null = null;
  // ❌ private _checkSuspiciousActivityUseCase: CheckSuspiciousActivityUseCase | null = null;

  // ==========================================
  // ⚙️ CONFIGURATION & LIFECYCLE
  // ==========================================

  private _options: AuthContainerOptions = {};
  private _isInitialized = false;
  private _logger: ILoggerService | null = null;

  // ==========================================
  // 🏗️ DATA LAYER GETTERS (Lazy Loading)
  // ==========================================

  /**
   * @getter authDatasource
   * @description Get Supabase authentication datasource mit lazy initialization
   *
   * @businessRule BR-623: Datasource verfügbar auch ohne Container-Initialisierung
   * @businessRule BR-624: Default Supabase-Client bei fehlender Konfiguration
   */
  get authDatasource(): AuthSupabaseDatasource {
    if (!this._authDatasource) {
      // Sicherstellen dass Default-Konfiguration verwendet wird
      if (!this._isInitialized) {
        this._options = {
          enableRealTimeSync: true,
          enableAdvancedSecurity: false,
          enableBiometric: false,
          enableOAuth: true,
          enableMFA: false,
          enableCompliance: false,
          enablePasswordPolicy: true,
          maxConcurrentSessions: 5,
          sessionTimeout: 900000,
          enableAnalytics: false,
        };
      }

      this._authDatasource = new AuthSupabaseDatasource();
    }
    return this._authDatasource;
  }

  /**
   * @getter authRepository
   * @description Authentication repository with enterprise features
   * @returns {AuthRepository} Configured repository instance
   */
  get authRepository(): AuthRepository {
    if (!this._authRepository) {
      const logger = this._logger || this.createFallbackLogger();
      this._authRepository = new AuthRepositoryImpl(
        this.authDatasource,
        this.biometricService,
        this.oauthService,
        logger
      );
      logger?.info('Auth repository initialized', undefined, {
        service: 'AuthContainer',
      });
    }
    return this._authRepository;
  }

  /**
   * @getter biometricService
   * @description Biometric authentication service
   * @returns {BiometricAuthServiceImpl} Configured biometric service
   */
  get biometricService(): BiometricAuthServiceImpl {
    if (!this._biometricService) {
      // FIX: Ensure logger is available or create fallback
      const logger = this._logger || this.createFallbackLogger();
      this._biometricService = new BiometricAuthServiceImpl(logger);
      logger?.info('Biometric service initialized', undefined, {
        service: 'AuthContainer',
      });
    }
    return this._biometricService;
  }

  /**
   * @getter oauthService
   * @description OAuth provider service for Google, Apple, Microsoft authentication
   * @returns {OAuthServiceImpl} Configured OAuth service
   */
  get oauthService(): OAuthServiceImpl {
    if (!this._oauthService) {
      const logger = this._logger || this.createFallbackLogger();
      const oauthConfig = {
        google: {
          webClientId:
            process.env.GOOGLE_WEB_CLIENT_ID || 'mock-google-client-id',
          iosClientId:
            process.env.GOOGLE_IOS_CLIENT_ID || 'mock-google-ios-client-id',
          androidClientId:
            process.env.GOOGLE_ANDROID_CLIENT_ID ||
            'mock-google-android-client-id',
        },
        apple: {
          clientId: process.env.APPLE_CLIENT_ID || 'mock-apple-client-id',
          redirectUrl: process.env.APPLE_REDIRECT_URL || 'mock-apple-redirect',
          enabled: true,
        },
        microsoft: {
          clientId:
            process.env.MICROSOFT_CLIENT_ID || 'mock-microsoft-client-id',
          redirectUrl:
            process.env.MICROSOFT_REDIRECT_URL || 'mock-microsoft-redirect',
          scopes: ['openid', 'profile', 'email'],
        },
      };
      this._oauthService = new OAuthServiceImpl(oauthConfig, logger);
      logger?.info('OAuth service initialized', undefined, {
        service: 'AuthContainer',
      });
    }
    return this._oauthService;
  }

  /**
   * @getter mfaService
   * @description Multi-factor authentication service
   * @returns {MFAServiceImpl} Configured MFA service
   */
  get mfaService(): MFAServiceImpl {
    if (!this._mfaService) {
      const logger = this._logger || this.createFallbackLogger();
      this._mfaService = new MFAServiceImpl(logger);
      logger?.info('MFA service initialized', undefined, {
        service: 'AuthContainer',
      });
    }
    return this._mfaService;
  }

  /**
   * @getter passwordPolicyService
   * @description Password policy enforcement service
   * @returns {PasswordPolicyServiceImpl} Configured password policy service
   */
  get passwordPolicyService(): PasswordPolicyServiceImpl {
    if (!this._passwordPolicyService) {
      const logger = this._logger || this.createFallbackLogger();
      this._passwordPolicyService = new PasswordPolicyServiceImpl(logger);
      logger?.info('Password policy service initialized', undefined, {
        service: 'AuthContainer',
      });
    }
    return this._passwordPolicyService;
  }

  /**
   * @getter advancedSecurityService
   * @description Advanced security monitoring and threat detection
   * @returns {AdvancedSecurityServiceImpl} Configured security service
   */
  get advancedSecurityService(): AdvancedSecurityServiceImpl {
    if (!this._advancedSecurityService) {
      const logger = this._logger || this.createFallbackLogger();
      this._advancedSecurityService = new AdvancedSecurityServiceImpl(logger, {
        enableThreatAssessment: true,
        enableDeviceFingerprinting: true,
        enableLocationMonitoring: true,
      });
      logger?.info('Advanced security service initialized', undefined, {
        service: 'AuthContainer',
      });
    }
    return this._advancedSecurityService;
  }

  /**
   * @getter complianceService
   * @description GDPR/CCPA compliance and audit service
   * @returns {ComplianceServiceImpl} Configured compliance service
   */
  get complianceService(): ComplianceServiceImpl {
    if (!this._complianceService) {
      const logger = this._logger || this.createFallbackLogger();
      this._complianceService = new ComplianceServiceImpl(logger);
      logger?.info('Compliance service initialized', undefined, {
        service: 'AuthContainer',
      });
    }
    return this._complianceService;
  }

  // ==========================================
  // 🎯 APPLICATION LAYER GETTERS
  // ==========================================

  // AuthOrchestratorService removed - Hooks use Container directly for Use Cases

  // ==========================================
  // 🔧 USE CASE GETTERS (6 Essential UseCases after Over-Engineering Elimination)
  // ==========================================

  /**
   * @getter loginWithEmailUseCase
   * @description UC-001: Email/Password Authentication UseCase
   */
  get loginWithEmailUseCase(): LoginWithEmailUseCase {
    if (!this._loginWithEmailUseCase) {
      this._loginWithEmailUseCase = new LoginWithEmailUseCase(
        this.authRepository
      );
    }
    return this._loginWithEmailUseCase;
  }

  /**
   * @getter registerWithEmailUseCase
   * @description UC-002: User Registration UseCase
   */
  get registerWithEmailUseCase(): RegisterWithEmailUseCase {
    if (!this._registerWithEmailUseCase) {
      this._registerWithEmailUseCase = new RegisterWithEmailUseCase(
        this.authRepository
      );
    }
    return this._registerWithEmailUseCase;
  }

  /**
   * @getter logoutUseCase
   * @description UC-003: Secure Session Termination UseCase
   */
  get logoutUseCase(): LogoutUseCase {
    if (!this._logoutUseCase) {
      this._logoutUseCase = new LogoutUseCase(this.authRepository);
    }
    return this._logoutUseCase;
  }

  /**
   * @getter passwordResetUseCase
   * @description UC-004: Secure Password Recovery UseCase
   */
  get passwordResetUseCase(): PasswordResetUseCase {
    if (!this._passwordResetUseCase) {
      this._passwordResetUseCase = new PasswordResetUseCase(
        this.authRepository
      );
    }
    return this._passwordResetUseCase;
  }

  /**
   * @getter isAuthenticatedUseCase
   * @description UC-005: Authentication Status Verification UseCase
   */
  get isAuthenticatedUseCase(): IsAuthenticatedUseCase {
    if (!this._isAuthenticatedUseCase) {
      this._isAuthenticatedUseCase = new IsAuthenticatedUseCase(
        this.authRepository
      );
    }
    return this._isAuthenticatedUseCase;
  }

  /**
   * @getter getCurrentUserUseCase
   * @description UC-006: Current User Session Management UseCase
   */
  get getCurrentUserUseCase(): GetCurrentUserUseCase {
    if (!this._getCurrentUserUseCase) {
      this._getCurrentUserUseCase = new GetCurrentUserUseCase(
        this.authRepository
      );
    }
    return this._getCurrentUserUseCase;
  }

  // 🗑️ ELIMINATED GETTERS (9 Over-Engineering UseCase Getters removed)
  // ❌ updatePasswordUseCase - deleted (UC-007: 642 lines)
  // ❌ enableMFAUseCase - deleted (UC-008: 511 lines)
  // ❌ verifyMFAUseCase - deleted (UC-009: 607 lines)
  // ❌ enableBiometricUseCase - deleted (UC-010: 531 lines)
  // ❌ authenticateWithBiometricUseCase - deleted (UC-011: 459 lines)
  // ❌ loginWithGoogleUseCase - deleted (UC-012: 624 lines)
  // ❌ hasPermissionUseCase - deleted (UC-013: 703 lines)
  // ❌ getActiveSessionsUseCase - deleted (UC-014: 656 lines)
  // ❌ checkSuspiciousActivityUseCase - deleted (UC-015: 691 lines)

  // ✅ REMAINING: 6 Essential Use Cases for React Native

  // ==========================================
  // ⚙️ CONFIGURATION & LIFECYCLE MANAGEMENT
  // ==========================================

  /**
   * @method initialize
   * @description Initialize Auth Container mit Enterprise Configuration
   *
   * @param {AuthContainerOptions} options - Container configuration options
   * @param {ILoggerService} logger - Enterprise logger service
   * @returns {Promise<void>} Promise resolving when initialization complete
   *
   * @example Container Initialization
   * ```typescript
   * await authContainer.initialize({
   *   enableAdvancedSecurity: true,
   *   enableMFA: true,
   *   enableBiometric: true,
   *   enableOAuth: true,
   *   enableCompliance: true
   * }, logger);
   * ```
   */
  async initialize(
    options: AuthContainerOptions = {},
    logger?: ILoggerService
  ): Promise<void> {
    if (this._isInitialized) {
      return;
    }

    this._logger = logger || this._logger;
    this._options = {
      enableRealTimeSync: true,
      enableAdvancedSecurity: false,
      enableBiometric: false,
      enableOAuth: true,
      enableMFA: false,
      enableCompliance: false,
      enablePasswordPolicy: true,
      maxConcurrentSessions: 5,
      sessionTimeout: 900000, // 15 minutes
      enableAnalytics: false,
      ...options,
    };

    // AuthOrchestratorService removed - No longer needed for initialization

    this._isInitialized = true;

    this._logger?.info('Auth Container initialized successfully', undefined, {
      service: 'AuthContainer',
      metadata: {
        options: this._options,
        useCasesCount: 6, // Reduced from 15 (9 over-engineered use cases eliminated)
        servicesCount: 7,
      },
    });
  }

  /**
   * @method isReady
   * @description Check if container is initialized and ready
   * @returns {boolean} True if container is ready for use
   *
   * RACE-CONDITION FIX: Container ist IMMER ready - Services werden lazy initialisiert
   * Das vermeidet Race-Conditions zwischen App-Initialization und Hook-Usage
   *
   * @businessRule BR-620: Container bereit ohne vollständige Initialisierung
   * @businessRule BR-621: Lazy service initialization on demand
   * @businessRule BR-622: Graceful fallback zu Default-Konfiguration
   */
  isReady(): boolean {
    // WICHTIG: Container ist IMMER bereit, auch ohne Initialize-Aufruf
    // Services werden bei Bedarf mit Default-Konfiguration erstellt
    // Das löst Race-Conditions zwischen App-Init und Component-Rendering
    return true;
  }

  /**
   * @method getOptions
   * @description Get current container configuration
   * @returns {AuthContainerOptions} Current configuration options
   */
  getOptions(): AuthContainerOptions {
    return { ...this._options };
  }

  // ==========================================
  // 🔧 FALLBACK UTILITIES
  // ==========================================

  /**
   * @method createFallbackLogger
   * @description Create a fallback logger when none is provided
   * @private
   */
  private createFallbackLogger(): ILoggerService {
    // 🏆 ENTERPRISE FIX: Use proper Logger Factory instead of console.*
    const logger = LoggerFactory.createServiceLogger('AuthContainerFallback');

    return {
      info: (message: string, category?: any, context?: any) => {
        logger.info(
          `[AuthContainer] ${message}`,
          category || LogCategory.BUSINESS,
          { metadata: context }
        );
      },
      warn: (message: string, category?: any, context?: any) => {
        logger.warn(
          `[AuthContainer] ${message}`,
          category || LogCategory.BUSINESS,
          { metadata: context }
        );
      },
      error: (
        message: string,
        category?: any,
        context?: any,
        error?: Error
      ) => {
        // 🎯 UX FIX: Unterscheide zwischen Business-Fehlern und technischen Fehlern
        if (error && isBusinessError(error)) {
          // Business-Fehler als Warnings loggen, nicht als Console-Errors
          logger.warn(
            `[AuthContainer] ${message} (Business Error)`,
            category || LogCategory.BUSINESS,
            { metadata: context }
          );
        } else {
          // Nur echte technische Fehler als Console-Errors
          logger.error(
            `[AuthContainer] ${message}`,
            category || LogCategory.BUSINESS,
            { metadata: context },
            error
          );
        }
      },
      debug: (message: string, category?: any, context?: any) => {
        logger.debug(
          `[AuthContainer] ${message}`,
          category || LogCategory.BUSINESS,
          { metadata: context }
        );
      },
      logSecurity: (message: string, securityContext: any, context?: any) => {
        logger.info(`[AuthContainer] ${message}`, LogCategory.SECURITY, {
          metadata: { securityContext, ...context },
        });
      },
    } as ILoggerService;
  }

  // ==========================================
  // 🧪 TESTING UTILITIES (nach Profile Pattern)
  // ==========================================

  /**
   * @method setAuthRepository
   * @description Inject mock repository for testing
   * @param {AuthRepository} repository - Mock repository instance
   */
  setAuthRepository(repository: AuthRepository): void {
    this._authRepository = repository;
    // Reset all use cases to use new repository
    this.resetUseCases();
  }

  // setAuthOrchestratorService removed - Service eliminated from architecture

  /**
   * @method setAuthDatasource
   * @description Inject mock datasource for testing
   * @param {AuthSupabaseDatasource} datasource - Mock datasource instance
   */
  setAuthDatasource(datasource: AuthSupabaseDatasource): void {
    this._authDatasource = datasource;
    // Reset repository to use new datasource
    this._authRepository = null;
  }

  /**
   * @method resetUseCases
   * @description Reset essential use cases to use updated dependencies (9 eliminated)
   * @private
   */
  private resetUseCases(): void {
    // Reset only the 6 remaining essential use cases
    this._loginWithEmailUseCase = null;
    this._registerWithEmailUseCase = null;
    this._logoutUseCase = null;
    this._passwordResetUseCase = null;
    this._isAuthenticatedUseCase = null;
    this._getCurrentUserUseCase = null;

    // 🗑️ ELIMINATED RESET (9 Over-Engineering UseCase resets removed)
    // ❌ this._updatePasswordUseCase = null;
    // ❌ this._enableMFAUseCase = null;
    // ❌ this._verifyMFAUseCase = null;
    // ❌ this._enableBiometricUseCase = null;
    // ❌ this._authenticateWithBiometricUseCase = null;
    // ❌ this._loginWithGoogleUseCase = null;
    // ❌ this._hasPermissionUseCase = null;
    // ❌ this._getActiveSessionsUseCase = null;
    // ❌ this._checkSuspiciousActivityUseCase = null;
  }

  /**
   * @method reset
   * @description Reset all container dependencies (für Testing)
   *
   * @example Testing Reset
   * ```typescript
   * beforeEach(() => {
   *   authContainer.reset();
   * });
   * ```
   */
  reset(): void {
    // Data Layer
    this._authDatasource = null;
    this._authRepository = null;
    this._biometricService = null;
    this._oauthService = null;
    this._mfaService = null;
    this._passwordPolicyService = null;
    this._advancedSecurityService = null;
    this._complianceService = null;

    // Application Layer - orchestrator service removed

    // Use Cases
    this.resetUseCases();

    // Configuration
    this._isInitialized = false;
    this._options = {};
    this._logger = null;
  }
}

// ==========================================
// 🏭 SINGLETON EXPORT (nach Profile Pattern)
// ==========================================

/**
 * @constant authContainer
 * @description Singleton Auth Container Instance
 *
 * Globale Singleton-Instanz des Auth Containers für konsistente
 * Dependency Injection im gesamten Auth Feature. Folgt dem
 * Profile Feature Pattern für einheitliche Architektur.
 *
 * @example Auth Container Usage
 * ```typescript
 * // Initialization
 * await authContainer.initialize({
 *   enableAdvancedSecurity: true,
 *   enableMFA: true
 * }, logger);
 *
 * // UseCase Access
 * const loginUseCase = authContainer.loginWithEmailUseCase;
 * const user = await loginUseCase.execute({ email, password });
 *
 * // Service Access
 * const authService = authContainer.authOrchestratorService;
 * ```
 *
 * @since 2.1.0
 */
export const authContainer = new AuthContainer();

/**
 * @type AuthContainer
 * @description Auth Container class export für testing
 */
export { AuthContainer };

/**
 * @type AuthContainerOptions
 * @description Configuration options export
 */
export type { AuthContainerOptions };
