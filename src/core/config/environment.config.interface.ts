/**
 * @fileoverview CORE-CONFIG-001: Environment Configuration Interface - Shared Standard
 * @description Shared environment configuration interface für alle Features und Services.
 * Definiert standardisierte Umgebungs-, Sicherheits- und Performance-Konfigurationen.
 * 
 * @businessRule BR-600: Shared environment configuration standards
 * @businessRule BR-601: Consistent environment detection across features
 * @businessRule BR-602: Standardized security levels for all services
 * @businessRule BR-603: Performance mode configuration standardization
 * 
 * @architecture Shared core configuration layer
 * @architecture Environment-agnostic interface design
 * @architecture Cross-feature compatibility standards
 * 
 * @example Environment Configuration Usage
 * ```typescript
 * // Auth Service verwendung
 * const authConfig: EnvironmentConfig = {
 *   environment: 'production',
 *   enableAllServices: true,
 *   securityLevel: 'enterprise',
 *   performanceMode: 'production'
 * };
 * 
 * // User Service verwendung  
 * const userConfig: EnvironmentConfig = {
 *   environment: 'development',
 *   enableAllServices: false,
 *   securityLevel: 'standard',
 *   performanceMode: 'development'
 * };
 * 
 * // Testing verwendung
 * const testConfig: EnvironmentConfig = {
 *   environment: 'testing',
 *   enableAllServices: false,
 *   securityLevel: 'minimal',
 *   performanceMode: 'development'
 * };
 * ```
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module EnvironmentConfig
 * @namespace Core.Config
 */

/**
 * @enum Environment
 * @description Supported application environments
 * 
 * @businessRule BR-604: Enum-based environment definition for type safety
 * @businessRule BR-605: Consistent environment values across application
 * 
 * @example Environment Usage
 * ```typescript
 * import { Environment } from '@core/config';
 * 
 * const config = {
 *   environment: Environment.PRODUCTION,
 *   securityLevel: 'enterprise'
 * };
 * 
 * // Type-safe environment checks
 * if (config.environment === Environment.PRODUCTION) {
 *   // Production-specific logic
 * }
 * ```
 * 
 * @since 1.1.0
 */
export enum Environment {
  /** Local development with debug features */
  DEVELOPMENT = 'development',
  
  /** Pre-production testing environment */
  STAGING = 'staging',
  
  /** Live production environment */
  PRODUCTION = 'production',
  
  /** Automated testing environment */
  TESTING = 'testing'
}

/**
 * @enum SecurityLevel
 * @description Security level classifications
 * 
 * @since 1.1.0
 */
export enum SecurityLevel {
  /** Basic security for development/testing */
  MINIMAL = 'minimal',
  
  /** Standard security for staging */
  STANDARD = 'standard',
  
  /** Full enterprise security for production */
  ENTERPRISE = 'enterprise'
}

/**
 * @enum PerformanceMode
 * @description Performance optimization modes
 * 
 * @since 1.1.0
 */
export enum PerformanceMode {
  /** Debug-friendly, slower performance */
  DEVELOPMENT = 'development',
  
  /** Optimized for speed and efficiency */
  PRODUCTION = 'production'
}

/**
 * @type EnvironmentValue
 * @description Environment type based on enum values for backwards compatibility
 */
export type EnvironmentValue = `${Environment}`;

/**
 * @type SecurityLevelValue  
 * @description Security level type based on enum values for backwards compatibility
 */
export type SecurityLevelValue = `${SecurityLevel}`;

/**
 * @type PerformanceModeValue
 * @description Performance mode type based on enum values for backwards compatibility
 */
export type PerformanceModeValue = `${PerformanceMode}`;

/**
 * @interface EnvironmentConfig
 * @description CORE-CONFIG-001: Shared Environment Configuration Interface
 * 
 * Standardized environment configuration interface for all features and services.
 * Provides consistent environment detection, security levels, and performance modes.
 * 
 * @businessRule BR-600: Shared environment standards
 * @businessRule BR-601: Consistent environment detection
 * @businessRule BR-602: Standardized security levels
 * @businessRule BR-603: Performance mode standardization
 * 
 * @example Environment Configurations
 * ```typescript
 * // Production Enterprise Configuration
 * const prodConfig: EnvironmentConfig = {
 *   environment: 'production',
 *   enableAllServices: true,
 *   securityLevel: 'enterprise',
 *   performanceMode: 'production'
 * };
 * 
 * // Development Configuration
 * const devConfig: EnvironmentConfig = {
 *   environment: 'development',
 *   enableAllServices: false,
 *   securityLevel: 'minimal',
 *   performanceMode: 'development'
 * };
 * 
 * // Testing Configuration
 * const testConfig: EnvironmentConfig = {
 *   environment: 'testing',
 *   enableAllServices: false,
 *   securityLevel: 'minimal',
 *   performanceMode: 'development'
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface EnvironmentConfig {
  /**
   * @property environment
   * @description Current application environment
   * 
   * - `Environment.DEVELOPMENT`: Local development with debug features
   * - `Environment.STAGING`: Pre-production testing environment  
   * - `Environment.PRODUCTION`: Live production environment
   * - `Environment.TESTING`: Automated testing environment
   */
  environment: Environment | EnvironmentValue;

  /**
   * @property enableAllServices
   * @description Enable all available services for the feature
   * 
   * - `true`: All services enabled (production/staging)
   * - `false`: Selective service enablement (development/testing)
   * 
   * @default undefined (feature-specific default)
   */
  enableAllServices?: boolean;

  /**
   * @property securityLevel
   * @description Security level for service configuration
   * 
   * - `SecurityLevel.MINIMAL`: Basic security (development/testing)
   * - `SecurityLevel.STANDARD`: Standard security (staging)
   * - `SecurityLevel.ENTERPRISE`: Full enterprise security (production)
   * 
   * @default undefined (feature-specific default)
   */
  securityLevel?: SecurityLevel | SecurityLevelValue;

  /**
   * @property performanceMode
   * @description Performance optimization mode
   * 
   * - `PerformanceMode.DEVELOPMENT`: Debug-friendly, slower performance
   * - `PerformanceMode.PRODUCTION`: Optimized for speed and efficiency
   * 
   * @default undefined (feature-specific default)
   */
  performanceMode?: PerformanceMode | PerformanceModeValue;
}

/**
 * @interface FeatureEnvironmentConfig
 * @description Extended environment configuration for specific features
 * 
 * Allows features to extend the base environment configuration with
 * feature-specific settings while maintaining shared standards.
 * 
 * @template T Feature-specific configuration properties
 * 
 * @example Feature-Specific Configuration
 * ```typescript
 * interface AuthEnvironmentConfig extends FeatureEnvironmentConfig<{
 *   enableMFA: boolean;
 *   enableCompliance: boolean;
 * }> {}
 * 
 * const authConfig: AuthEnvironmentConfig = {
 *   environment: 'production',
 *   securityLevel: 'enterprise',
 *   featureConfig: {
 *     enableMFA: true,
 *     enableCompliance: true
 *   }
 * };
 * ```
 * 
 * @since 1.0.0
 */
export interface FeatureEnvironmentConfig<T = Record<string, any>> extends EnvironmentConfig {
  /**
   * @property featureConfig
   * @description Feature-specific configuration properties
   */
  featureConfig?: T;
}

/**
 * @function getEnvironmentDefaults
 * @description Get default configuration for environment
 * 
 * @param {Environment | EnvironmentValue} environment - Target environment
 * @returns {EnvironmentConfig} Default environment configuration
 * 
 * @example Environment Defaults
 * ```typescript
 * const prodDefaults = getEnvironmentDefaults(Environment.PRODUCTION);
 * // Returns: { environment: Environment.PRODUCTION, enableAllServices: true, securityLevel: SecurityLevel.ENTERPRISE, performanceMode: PerformanceMode.PRODUCTION }
 * 
 * const devDefaults = getEnvironmentDefaults(Environment.DEVELOPMENT);
 * // Returns: { environment: Environment.DEVELOPMENT, enableAllServices: false, securityLevel: SecurityLevel.MINIMAL, performanceMode: PerformanceMode.DEVELOPMENT }
 * ```
 * 
 * @since 1.0.0
 */
export function getEnvironmentDefaults(environment: Environment | EnvironmentValue): EnvironmentConfig {
  switch (environment) {
    case Environment.PRODUCTION:
    case 'production':
      return {
        environment: Environment.PRODUCTION,
        enableAllServices: true,
        securityLevel: SecurityLevel.ENTERPRISE,
        performanceMode: PerformanceMode.PRODUCTION
      };
    
    case Environment.STAGING:
    case 'staging':
      return {
        environment: Environment.STAGING,
        enableAllServices: true,
        securityLevel: SecurityLevel.STANDARD,
        performanceMode: PerformanceMode.PRODUCTION
      };
    
    case Environment.DEVELOPMENT:
    case 'development':
      return {
        environment: Environment.DEVELOPMENT,
        enableAllServices: false,
        securityLevel: SecurityLevel.MINIMAL,
        performanceMode: PerformanceMode.DEVELOPMENT
      };
    
    case Environment.TESTING:
    case 'testing':
      return {
        environment: Environment.TESTING,
        enableAllServices: false,
        securityLevel: SecurityLevel.MINIMAL,
        performanceMode: PerformanceMode.DEVELOPMENT
      };
    
    default:
      return {
        environment: Environment.DEVELOPMENT,
        enableAllServices: false,
        securityLevel: SecurityLevel.MINIMAL,
        performanceMode: PerformanceMode.DEVELOPMENT
      };
  }
}

/**
 * @function isProductionEnvironment
 * @description Check if environment is production
 * 
 * @param {EnvironmentConfig} config - Environment configuration
 * @returns {boolean} True if production environment
 * 
 * @since 1.0.0
 */
export function isProductionEnvironment(config: EnvironmentConfig): boolean {
  return config.environment === Environment.PRODUCTION || config.environment === Environment.PRODUCTION.valueOf();
}

/**
 * @function isDevelopmentEnvironment
 * @description Check if environment is development
 * 
 * @param {EnvironmentConfig} config - Environment configuration
 * @returns {boolean} True if development environment
 * 
 * @since 1.0.0
 */
export function isDevelopmentEnvironment(config: EnvironmentConfig): boolean {
  return config.environment === Environment.DEVELOPMENT || config.environment === Environment.DEVELOPMENT.valueOf();
}

/**
 * @function isTestingEnvironment
 * @description Check if environment is testing
 * 
 * @param {EnvironmentConfig} config - Environment configuration
 * @returns {boolean} True if testing environment
 * 
 * @since 1.0.0
 */
export function isTestingEnvironment(config: EnvironmentConfig): boolean {
  return config.environment === Environment.TESTING || config.environment === Environment.TESTING.valueOf();
} 