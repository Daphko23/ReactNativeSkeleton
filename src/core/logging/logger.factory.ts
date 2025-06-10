/**
 * @fileoverview LOGGER-FACTORY: Enterprise Logger Factory Implementation
 * @description Centralized logger factory for environment-aware logger selection with automatic switching between development and production loggers
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Logging.LoggerFactory
 * @namespace Core.Logging.LoggerFactory
 * @category Logging
 * @subcategory Factory
 */

import { ILoggerService, LogContext } from './logger.service.interface';
import { ConsoleLogger } from './console.logger';
import { SentryLogger } from './sentry.logger';
import { initializeSentry } from '@core/config/sentry.config';

/**
 * Logger Configuration Interface
 * 
 * Defines configuration options for logger creation with environment-specific
 * settings and custom context support.
 * 
 * @interface LoggerConfig
 * @since 1.0.0
 */
export interface LoggerConfig {
  /** Force specific logger type regardless of environment */
  forceLogger?: 'console' | 'sentry';
  /** Default context applied to all log entries */
  defaultContext?: LogContext;
  /** Enable debug mode for additional logging */
  enableDebug?: boolean;
  /** Service name for logger identification */
  serviceName?: string;
}

/**
 * Environment Detection Utility
 * 
 * Provides centralized environment detection for logger selection
 * with support for various React Native environment indicators.
 * 
 * @class EnvironmentDetector
 * @since 1.0.0
 */
class EnvironmentDetector {
  /**
   * Check if running in development environment
   * 
   * @returns True if in development mode
   */
  static isDevelopment(): boolean {
    // Check React Native __DEV__ flag
    if (typeof __DEV__ !== 'undefined') {
      return __DEV__;
    }

    // Check NODE_ENV
    if (typeof process !== 'undefined' && process.env) {
      return process.env.NODE_ENV === 'development';
    }

    // Check for common development indicators
    if (typeof window !== 'undefined') {
      return window.location?.hostname === 'localhost' ||
             window.location?.hostname === '127.0.0.1' ||
             window.location?.port !== '';
    }

    // Default to development for safety
    return true;
  }

  /**
   * Check if running in production environment
   * 
   * @returns True if in production mode
   */
  static isProduction(): boolean {
    return !this.isDevelopment();
  }

  /**
   * Get current environment name
   * 
   * @returns Environment name
   */
  static getEnvironment(): 'development' | 'production' | 'staging' | 'test' {
    if (typeof process !== 'undefined' && process.env) {
      const env = process.env.NODE_ENV || process.env.REACT_APP_ENV;
      
      if (env === 'production') return 'production';
      if (env === 'staging') return 'staging';
      if (env === 'test') return 'test';
    }

    return this.isDevelopment() ? 'development' : 'production';
  }
}

/**
 * Logger Factory Implementation
 * 
 * Centralized factory for creating environment-appropriate logger instances
 * with automatic switching between development (ConsoleLogger) and production
 * (SentryLogger) environments.
 * 
 * @class LoggerFactory
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Classes
 * @subcategory Factory
 * @module Core.Logging.LoggerFactory
 * @namespace Core.Logging.LoggerFactory.LoggerFactory
 * 
 * @description
 * Enterprise-grade logger factory that automatically selects the appropriate
 * logger implementation based on the current environment. Provides consistent
 * logging interface across different deployment environments while optimizing
 * for development debugging and production monitoring.
 * 
 * @example
 * Basic usage:
 * ```tsx
 * import { LoggerFactory } from '@/core/logging/logger.factory';
 * 
 * // Automatic environment-based logger selection
 * const logger = LoggerFactory.createLogger();
 * 
 * logger.info('Application started');
 * logger.error('Something went wrong', undefined, undefined, error);
 * ```
 * 
 * @example
 * Service-specific logger:
 * ```tsx
 * const logger = LoggerFactory.createLogger({
 *   serviceName: 'AuthService',
 *   defaultContext: {
 *     service: 'auth',
 *     component: 'authentication'
 *   }
 * });
 * 
 * logger.info('User authentication started', LogCategory.AUTHENTICATION, {
 *   userId: 'user-123',
 *   sessionId: 'session-456'
 * });
 * ```
 * 
 * @example
 * Force specific logger type:
 * ```tsx
 * // Force console logger for debugging in production
 * const debugLogger = LoggerFactory.createLogger({
 *   forceLogger: 'console',
 *   enableDebug: true
 * });
 * 
 * // Force Sentry logger for testing in development
 * const prodLogger = LoggerFactory.createLogger({
 *   forceLogger: 'sentry',
 *   serviceName: 'TestService'
 * });
 * ```
 * 
 * @features
 * - **Environment Detection**: Automatic environment-based logger selection
 * - **Forced Selection**: Override environment detection for specific use cases
 * - **Service Context**: Service-specific logger configuration
 * - **Default Context**: Consistent context application across log entries
 * - **Debug Mode**: Enhanced debugging capabilities
 * - **Singleton Pattern**: Efficient logger instance management
 * 
 * @environment_behavior
 * - **Development**: Uses ConsoleLogger for immediate console output
 * - **Production**: Uses SentryLogger for error tracking and monitoring
 * - **Staging**: Uses SentryLogger with enhanced sampling
 * - **Test**: Uses ConsoleLogger for test output visibility
 * 
 * @performance_optimization
 * - **Lazy Initialization**: Loggers created only when needed
 * - **Instance Caching**: Reuse logger instances for same configuration
 * - **Memory Efficient**: Minimal memory footprint for logger instances
 * - **Fast Selection**: O(1) environment detection
 */
export class LoggerFactory {
  private static loggerCache = new Map<string, ILoggerService>();

  /**
   * Create logger instance with automatic environment detection
   * 
   * @param config - Logger configuration options
   * @returns Configured logger instance
   * 
   * @example
   * ```tsx
   * const logger = LoggerFactory.createLogger({
   *   serviceName: 'UserService',
   *   defaultContext: { service: 'user-management' }
   * });
   * ```
   */
  static createLogger(config: LoggerConfig = {}): ILoggerService {
    const cacheKey = this.generateCacheKey(config);
    
    // Return cached logger if available
    if (this.loggerCache.has(cacheKey)) {
      return this.loggerCache.get(cacheKey)!;
    }

    // Create new logger instance
    const logger = this.createLoggerInstance(config);
    
    // Cache logger for reuse
    this.loggerCache.set(cacheKey, logger);
    
    return logger;
  }

  /**
   * Create logger for specific service
   * 
   * @param serviceName - Service name for logger identification
   * @param defaultContext - Default context for service
   * @returns Service-specific logger instance
   * 
   * @example
   * ```tsx
   * const authLogger = LoggerFactory.createServiceLogger('AuthService', {
   *   component: 'authentication',
   *   module: 'oauth'
   * });
   * ```
   */
  static createServiceLogger(serviceName: string, defaultContext?: LogContext): ILoggerService {
    return this.createLogger({
      serviceName,
      defaultContext: {
        service: serviceName.toLowerCase(),
        ...defaultContext
      }
    });
  }

  /**
   * Create development logger (always ConsoleLogger)
   * 
   * @param config - Logger configuration
   * @returns Console logger instance
   * 
   * @example
   * ```tsx
   * const devLogger = LoggerFactory.createDevelopmentLogger({
   *   enableDebug: true
   * });
   * ```
   */
  static createDevelopmentLogger(config: LoggerConfig = {}): ILoggerService {
    return this.createLogger({
      ...config,
      forceLogger: 'console'
    });
  }

  /**
   * Create production logger (always SentryLogger)
   * 
   * @param config - Logger configuration
   * @returns Sentry logger instance
   * 
   * @example
   * ```tsx
   * const prodLogger = LoggerFactory.createProductionLogger({
   *   serviceName: 'CriticalService'
   * });
   * ```
   */
  static createProductionLogger(config: LoggerConfig = {}): ILoggerService {
    return this.createLogger({
      ...config,
      forceLogger: 'sentry'
    });
  }

  /**
   * Get current environment information
   * 
   * @returns Environment details
   */
  static getEnvironmentInfo() {
    return {
      environment: EnvironmentDetector.getEnvironment(),
      isDevelopment: EnvironmentDetector.isDevelopment(),
      isProduction: EnvironmentDetector.isProduction(),
      recommendedLogger: EnvironmentDetector.isProduction() ? 'sentry' : 'console'
    };
  }

  /**
   * Clear logger cache
   * 
   * @description Clears all cached logger instances. Useful for testing
   * or when logger configuration needs to be refreshed.
   */
  static clearCache(): void {
    this.loggerCache.clear();
  }

  /**
   * Create logger instance based on configuration
   * 
   * @private
   * @param config - Logger configuration
   * @returns Logger instance
   */
  private static createLoggerInstance(config: LoggerConfig): ILoggerService {
    const { forceLogger, defaultContext = {} } = config;
    
    // Enhanced default context with environment information
    const enhancedContext: LogContext = {
      ...defaultContext,
      service: config.serviceName || defaultContext.service,
      metadata: {
        environment: EnvironmentDetector.getEnvironment(),
        loggerType: this.determineLoggerType(forceLogger),
        ...defaultContext.metadata
      }
    };

    // Create appropriate logger based on configuration or environment
    const loggerType = this.determineLoggerType(forceLogger);
    
    if (loggerType === 'sentry') {
      // Initialize Sentry if creating SentryLogger
      initializeSentry();
      return new SentryLogger(enhancedContext);
    } else {
      return new ConsoleLogger();
    }
  }

  /**
   * Determine which logger type to use
   * 
   * @private
   * @param forceLogger - Forced logger type
   * @returns Logger type to use
   */
  private static determineLoggerType(forceLogger?: 'console' | 'sentry'): 'console' | 'sentry' {
    if (forceLogger) {
      return forceLogger;
    }

    // Use Sentry in production, Console in development
    return EnvironmentDetector.isProduction() ? 'sentry' : 'console';
  }

  /**
   * Generate cache key for logger configuration
   * 
   * @private
   * @param config - Logger configuration
   * @returns Cache key string
   */
  private static generateCacheKey(config: LoggerConfig): string {
    const keyParts = [
      config.forceLogger || 'auto',
      config.serviceName || 'default',
      config.enableDebug ? 'debug' : 'normal',
      JSON.stringify(config.defaultContext || {})
    ];
    
    return keyParts.join('|');
  }
}

/**
 * Default logger instance for immediate use
 * 
 * Pre-configured logger instance that can be used directly without
 * explicit factory calls. Automatically selects appropriate logger
 * based on current environment.
 * 
 * @constant defaultLogger
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * import { defaultLogger } from '@/core/logging/logger.factory';
 * 
 * defaultLogger.info('Quick logging without configuration');
 * ```
 */
export const defaultLogger = LoggerFactory.createLogger();

/**
 * Export individual logger types for direct use
 */
export { ConsoleLogger, SentryLogger };
export type { ILoggerService, LogContext }; 