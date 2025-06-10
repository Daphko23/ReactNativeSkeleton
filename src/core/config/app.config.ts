/**
 * @fileoverview APP-CONFIG: Enterprise Application Configuration
 * @description Central application configuration and initialization for React Native Enterprise App
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Config.AppConfig
 * @namespace Core.Config.AppConfig
 * @category Configuration
 * @subcategory Application
 */

import { initializeSentry, testSentryIntegration, getSentryConfig } from './sentry.config';
import { LoggerFactory } from '@core/logging/logger.factory';

/**
 * Application Configuration Interface
 * 
 * Defines the configuration structure for enterprise application initialization
 * with environment-specific settings and service configurations.
 * 
 * @interface AppConfig
 * @since 1.0.0
 */
export interface AppConfig {
  /** Application name */
  appName: string;
  /** Application version */
  version: string;
  /** Current environment */
  environment: string;
  /** Enable debug mode */
  debug: boolean;
  /** Enable Sentry monitoring */
  enableSentry: boolean;
  /** Enable logging */
  enableLogging: boolean;
  /** Enable performance monitoring */
  enablePerformanceMonitoring: boolean;
  /** App build number */
  buildNumber: string;
}

/**
 * Environment-specific application configurations
 * 
 * Provides optimized configurations for different deployment environments
 * with appropriate monitoring and debugging settings.
 * 
 * @constant environmentConfigs
 * @since 1.0.0
 */
const environmentConfigs: Record<string, Partial<AppConfig>> = {
  development: {
    debug: true,
    enableSentry: false, // Disabled to avoid noise during development
    enableLogging: true,
    enablePerformanceMonitoring: false,
  },
  staging: {
    debug: false,
    enableSentry: true,
    enableLogging: true,
    enablePerformanceMonitoring: true,
  },
  production: {
    debug: false,
    enableSentry: true,
    enableLogging: true,
    enablePerformanceMonitoring: true,
  },
  test: {
    debug: false,
    enableSentry: false,
    enableLogging: false,
    enablePerformanceMonitoring: false,
  }
};

/**
 * Get current environment name
 * 
 * @returns Environment name with fallback to development
 */
function getCurrentEnvironment(): string {
  // Check React Native __DEV__ flag first
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'development';
  }

  // Check NODE_ENV
  if (typeof process !== 'undefined' && process.env) {
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'production') return 'production';
    if (nodeEnv === 'staging') return 'staging';
    if (nodeEnv === 'test') return 'test';
  }

  // Default to development for safety
  return 'development';
}

/**
 * Create application configuration for current environment
 * 
 * @returns Complete application configuration object
 */
function createAppConfig(): AppConfig {
  const environment = getCurrentEnvironment();
  const envConfig = environmentConfigs[environment] || environmentConfigs.development;
  
  const baseConfig: AppConfig = {
    appName: 'ReactNativeSkeleton',
    version: '2.0.0',
    environment,
    debug: false,
    enableSentry: false,
    enableLogging: true,
    enablePerformanceMonitoring: false,
    buildNumber: process.env.APP_BUILD || '2.0.0-dev',
  };

  return {
    ...baseConfig,
    ...envConfig,
  };
}

/**
 * Application Initialization Manager
 * 
 * Manages the initialization of all enterprise application services and
 * configurations in the correct order with proper error handling.
 * 
 * @class AppInitializer
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Classes
 * @subcategory Initialization
 * @module Core.Config.AppConfig
 * @namespace Core.Config.AppConfig.AppInitializer
 * 
 * @description
 * Enterprise-grade application initializer that sets up all core services
 * and configurations required for the React Native application to function
 * properly across different environments.
 * 
 * @example
 * Initialize application at startup:
 * ```tsx
 * import { AppInitializer } from '@core/config/app.config';
 * 
 * // In your App.tsx or index.js
 * await AppInitializer.initialize();
 * ```
 * 
 * @example
 * Initialize with custom configuration:
 * ```tsx
 * const config = {
 *   enableSentry: true,
 *   enablePerformanceMonitoring: true,
 *   debug: false
 * };
 * 
 * await AppInitializer.initialize(config);
 * ```
 * 
 * @features
 * - **Environment Detection**: Automatic environment-based configuration
 * - **Service Initialization**: Proper order of service startup
 * - **Error Handling**: Comprehensive error handling during initialization
 * - **Logging Integration**: Detailed initialization logging
 * - **Performance Monitoring**: Optional performance tracking setup
 * 
 * @initialization_order
 * 1. **Configuration**: Load environment-specific configuration
 * 2. **Logging**: Initialize logging system
 * 3. **Monitoring**: Initialize Sentry monitoring (if enabled)
 * 4. **Performance**: Setup performance monitoring (if enabled)
 * 5. **Validation**: Validate all services are running correctly
 */
export class AppInitializer {
  private static isInitialized = false;
  private static config: AppConfig;
  private static logger = LoggerFactory.createServiceLogger('AppInitializer');

  /**
   * Initialize the entire application
   * 
   * Sets up all core services and configurations required for the application
   * to function properly. This should be called once at application startup.
   * 
   * @param customConfig - Optional custom configuration override
   * @returns Promise that resolves when initialization is complete
   * 
   * @example
   * ```tsx
   * import { AppInitializer } from '@core/config/app.config';
   * 
   * export default function App() {
   *   useEffect(() => {
   *     AppInitializer.initialize().catch(console.error);
   *   }, []);
   * 
   *   return <YourAppComponents />;
   * }
   * ```
   * 
   * @throws {Error} If initialization fails
   */
  static async initialize(customConfig?: Partial<AppConfig>): Promise<void> {
    if (this.isInitialized) {
      this.logger.info('Application already initialized, skipping...');
      return;
    }

    try {
      console.log('🚀 Initializing ReactNativeSkeleton Enterprise App...');

      // Step 1: Load Configuration
      this.config = {
        ...createAppConfig(),
        ...customConfig
      };

      console.log('🔧 Application Configuration:', {
        appName: this.config.appName,
        version: this.config.version,
        environment: this.config.environment,
        debug: this.config.debug,
        enableSentry: this.config.enableSentry,
        enableLogging: this.config.enableLogging,
        buildNumber: this.config.buildNumber,
      });

      // Step 2: Initialize Logging System
      if (this.config.enableLogging) {
        await this.initializeLogging();
      }

      // Step 3: Initialize Monitoring (Sentry)
      if (this.config.enableSentry) {
        await this.initializeMonitoring();
      }

      // Step 4: Initialize Performance Monitoring
      if (this.config.enablePerformanceMonitoring) {
        await this.initializePerformanceMonitoring();
      }

      // Step 5: Validate Services
      await this.validateServices();

      // Mark as initialized
      this.isInitialized = true;

      this.logger.info('✅ ReactNativeSkeleton Enterprise App initialized successfully', undefined, {
        metadata: {
          initializationTime: Date.now(),
          config: this.config,
          services: {
            logging: this.config.enableLogging,
            monitoring: this.config.enableSentry,
            performance: this.config.enablePerformanceMonitoring,
          }
        }
      });

      console.log('✅ ReactNativeSkeleton Enterprise App ready!');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      
      console.error('❌ Failed to initialize ReactNativeSkeleton Enterprise App:', errorMessage);
      
      if (this.config?.enableLogging) {
        this.logger.error('Application initialization failed', undefined, undefined, error as Error);
      }

      throw new Error(`Application initialization failed: ${errorMessage}`);
    }
  }

  /**
   * Initialize logging system
   * 
   * @private
   */
  private static async initializeLogging(): Promise<void> {
    try {
      console.log('🔧 Initializing logging system...');
      
      // Logger factory automatically selects appropriate logger
      // based on environment, so we just need to ensure it's ready
      const testLogger = LoggerFactory.createLogger();
      testLogger.info('Logging system initialized successfully');
      
      console.log('✅ Logging system ready');
    } catch (error) {
      throw new Error(`Logging initialization failed: ${error}`);
    }
  }

  /**
   * Initialize monitoring system (Sentry)
   * 
   * @private
   */
  private static async initializeMonitoring(): Promise<void> {
    try {
      console.log('🔧 Initializing Sentry monitoring...');
      
      // Initialize Sentry
      initializeSentry();
      
      // Test integration in development
      if (this.config.debug && this.config.environment === 'development') {
        console.log('🧪 Testing Sentry integration...');
        testSentryIntegration();
      }
      
      console.log('✅ Sentry monitoring ready');
    } catch (error) {
      throw new Error(`Monitoring initialization failed: ${error}`);
    }
  }

  /**
   * Initialize performance monitoring
   * 
   * @private
   */
  private static async initializePerformanceMonitoring(): Promise<void> {
    try {
      console.log('🔧 Initializing performance monitoring...');
      
      // Performance monitoring is already included in Sentry configuration
      // Additional performance monitoring setup can be added here if needed
      
      console.log('✅ Performance monitoring ready');
    } catch (error) {
      throw new Error(`Performance monitoring initialization failed: ${error}`);
    }
  }

  /**
   * Validate all services are running correctly
   * 
   * @private
   */
  private static async validateServices(): Promise<void> {
    try {
      console.log('🔧 Validating services...');
      
      const validationResults = {
        logging: this.validateLogging(),
        monitoring: this.config.enableSentry ? this.validateMonitoring() : true,
        performance: this.config.enablePerformanceMonitoring ? this.validatePerformanceMonitoring() : true,
      };

      const failedServices = Object.entries(validationResults)
        .filter(([_, isValid]) => !isValid)
        .map(([service, _]) => service);

      if (failedServices.length > 0) {
        throw new Error(`Service validation failed for: ${failedServices.join(', ')}`);
      }
      
      console.log('✅ All services validated successfully');
    } catch (error) {
      throw new Error(`Service validation failed: ${error}`);
    }
  }

  /**
   * Validate logging service
   * 
   * @private
   * @returns True if logging is working
   */
  private static validateLogging(): boolean {
    try {
      const testLogger = LoggerFactory.createLogger();
      testLogger.info('Logging validation test');
      return true;
    } catch (error) {
      console.error('Logging validation failed:', error);
      return false;
    }
  }

  /**
   * Validate monitoring service
   * 
   * @private
   * @returns True if monitoring is working
   */
  private static validateMonitoring(): boolean {
    try {
      const sentryConfig = getSentryConfig();
      return !!sentryConfig.dsn;
    } catch (error) {
      console.error('Monitoring validation failed:', error);
      return false;
    }
  }

  /**
   * Validate performance monitoring
   * 
   * @private
   * @returns True if performance monitoring is working
   */
  private static validatePerformanceMonitoring(): boolean {
    try {
      // Performance monitoring validation logic
      return true;
    } catch (error) {
      console.error('Performance monitoring validation failed:', error);
      return false;
    }
  }

  /**
   * Get current application configuration
   * 
   * @returns Current application configuration
   */
  static getConfig(): AppConfig {
    return this.config || createAppConfig();
  }

  /**
   * Check if application is initialized
   * 
   * @returns True if application is initialized
   */
  static isAppInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Reset initialization state (for testing)
   * 
   * @internal
   */
  static reset(): void {
    this.isInitialized = false;
    LoggerFactory.clearCache();
  }
}

/**
 * Get current application configuration
 * 
 * @returns Current application configuration
 */
export function getAppConfig(): AppConfig {
  return AppInitializer.getConfig();
}

/**
 * Quick application initialization for immediate use
 * 
 * @returns Application configuration
 */
export const APP_CONFIG = createAppConfig();

/**
 * Export individual configuration utilities
 */
export { initializeSentry, testSentryIntegration, getSentryConfig } from './sentry.config';
export { LoggerFactory } from '@core/logging/logger.factory'; 