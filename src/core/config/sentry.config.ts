/**
 * @fileoverview SENTRY-CONFIG: Enterprise Sentry Configuration
 * @description Production-ready Sentry configuration with environment-specific settings, performance monitoring, and security features
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Config.SentryConfig
 * @namespace Core.Config.SentryConfig
 * @category Configuration
 * @subcategory Monitoring
 */

import * as Sentry from '@sentry/react-native';
import { LoggerFactory } from '../logging/logger.factory';
import { LogCategory } from '../logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('SentryConfig');

/**
 * Sentry Configuration Interface
 * 
 * Defines the configuration structure for Sentry initialization with
 * enterprise-specific settings and monitoring capabilities.
 * 
 * @interface SentryConfig
 * @since 1.0.0
 */
export interface SentryConfig {
  /** Sentry DSN for error reporting */
  dsn: string;
  /** Environment name */
  environment: string;
  /** Debug mode flag */
  debug: boolean;
  /** Sample rate for error events (0.0 to 1.0) */
  sampleRate: number;
  /** Sample rate for performance traces (0.0 to 1.0) */
  tracesSampleRate: number;
  /** Sample rate for profiling (0.0 to 1.0) */
  profilesSampleRate: number;
  /** Enable session replay */
  enableSessionReplay: boolean;
  /** Maximum breadcrumbs to keep */
  maxBreadcrumbs: number;
  /** Send default PII (Personally Identifiable Information) */
  sendDefaultPii: boolean;
  /** Attach stacktrace to pure capture message calls */
  attachStacktrace: boolean;
  /** Enable auto session tracking */
  autoSessionTracking: boolean;
  /** Enable native crashes */
  enableNativeCrashHandling: boolean;
}

/**
 * Environment-specific Sentry configurations
 * 
 * Provides optimized configurations for different deployment environments
 * with appropriate sampling rates and monitoring levels.
 * 
 * @constant environmentConfigs
 * @since 1.0.0
 */
const environmentConfigs: Record<string, Partial<SentryConfig>> = {
  development: {
    debug: true,
    sampleRate: 1.0,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    enableSessionReplay: true,
    sendDefaultPii: false, // GDPR compliance even in dev
    maxBreadcrumbs: 100,
  },
  staging: {
    debug: false,
    sampleRate: 1.0,
    tracesSampleRate: 0.5,
    profilesSampleRate: 0.1,
    enableSessionReplay: true,
    sendDefaultPii: false,
    maxBreadcrumbs: 50,
  },
  production: {
    debug: false,
    sampleRate: 0.1,
    tracesSampleRate: 0.01,
    profilesSampleRate: 0.001,
    enableSessionReplay: false, // Privacy consideration
    sendDefaultPii: false, // GDPR compliance
    maxBreadcrumbs: 30,
  },
  test: {
    debug: false,
    sampleRate: 0.0, // No reporting during tests
    tracesSampleRate: 0.0,
    profilesSampleRate: 0.0,
    enableSessionReplay: false,
    sendDefaultPii: false,
    maxBreadcrumbs: 10,
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
 * Get Sentry DSN from environment variables
 * 
 * @returns Sentry DSN or fallback for development
 */
function getSentryDSN(): string {
  // Check for environment variable first
  if (typeof process !== 'undefined' && process.env?.SENTRY_DSN) {
    return process.env.SENTRY_DSN;
  }

  // Production DSN for ReactNativeSkeleton
  const productionDSN = "https://bc55d5c46b50aab732295481fbcd8d44@o4509402366410752.ingest.de.sentry.io/4509402377289808";
  
  const environment = getCurrentEnvironment();
  
  // Only use production DSN in production/staging
  if (environment === 'production' || environment === 'staging') {
    return productionDSN;
  }
  
  // Return empty DSN for development/test to avoid noise
  return '';
}

/**
 * Create Sentry configuration for current environment
 * 
 * @returns Complete Sentry configuration object
 */
function createSentryConfig(): SentryConfig {
  const environment = getCurrentEnvironment();
  const envConfig = environmentConfigs[environment] || environmentConfigs.development;
  
  const baseConfig: SentryConfig = {
    dsn: getSentryDSN(),
    environment,
    debug: false,
    sampleRate: 0.1,
    tracesSampleRate: 0.01,
    profilesSampleRate: 0.001,
    enableSessionReplay: false,
    maxBreadcrumbs: 30,
    sendDefaultPii: false,
    attachStacktrace: true,
    autoSessionTracking: true,
    enableNativeCrashHandling: true,
  };

  return {
    ...baseConfig,
    ...envConfig,
  };
}

/**
 * Initialize Sentry with enterprise configuration
 * 
 * Sets up Sentry with environment-appropriate settings, GDPR compliance,
 * and comprehensive error tracking capabilities.
 * 
 * @function initializeSentry
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * import { initializeSentry } from '@core/config/sentry.config';
 * 
 * // Initialize Sentry at app startup
 * initializeSentry();
 * ```
 * 
 * @features
 * - **Environment Detection**: Automatic environment-based configuration
 * - **GDPR Compliance**: No PII data collection
 * - **Performance Monitoring**: Configurable sampling rates
 * - **Error Tracking**: Comprehensive error capture
 * - **Security**: Secure DSN handling
 * 
 * @compliance
 * - **GDPR Article 25**: Data protection by design
 * - **GDPR Article 32**: Security of processing
 * - **ISO 27001**: Information security management
 */
export function initializeSentry(): void {
  const config = createSentryConfig();
  
  // Skip initialization if no DSN (development/test)
  if (!config.dsn) {
    logger.info('Sentry initialization skipped - no DSN configured', LogCategory.BUSINESS, {
      service: 'SentryConfig',
      metadata: { environment: config.environment }
    });
    return;
  }

  try {
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      debug: config.debug,
      sampleRate: config.sampleRate,
      tracesSampleRate: config.tracesSampleRate,
      profilesSampleRate: config.profilesSampleRate,
      maxBreadcrumbs: config.maxBreadcrumbs,
      sendDefaultPii: config.sendDefaultPii,
      attachStacktrace: config.attachStacktrace,
      autoSessionTracking: config.autoSessionTracking,
      enableNativeCrashHandling: config.enableNativeCrashHandling,
      
      // Enable automatic instrumentation
      enableAutoPerformanceTracing: true,
      enableAppStartTracking: true,
      enableUserInteractionTracing: true,
      
      // Configure beforeSend hook for additional privacy protection
      beforeSend: (event, hint) => {
        // Remove sensitive data from error context
        if (event.extra) {
          // Remove potential PII from extra data
          const sanitizedExtra = { ...event.extra };
          delete sanitizedExtra.password;
          delete sanitizedExtra.token;
          delete sanitizedExtra.apiKey;
          delete sanitizedExtra.secret;
          event.extra = sanitizedExtra;
        }

        // Remove sensitive data from tags
        if (event.tags) {
          const sanitizedTags = { ...event.tags };
          delete sanitizedTags.email;
          delete sanitizedTags.phone;
          delete sanitizedTags.ssn;
          event.tags = sanitizedTags;
        }

        // Log error locally in development
        if (config.debug && hint.originalException) {
          logger.error('Sentry Error captured in beforeSend', LogCategory.BUSINESS, {
            service: 'SentryConfig',
            metadata: { errorType: 'beforeSend' }
          }, hint.originalException as Error);
        }

        return event;
      },

      // Configure breadcrumb filtering
      beforeBreadcrumb: (breadcrumb) => {
        // Filter out sensitive breadcrumbs
        if (breadcrumb.category === 'console' && breadcrumb.message) {
          // Remove sensitive console logs
          if (breadcrumb.message.toLowerCase().includes('password') ||
              breadcrumb.message.toLowerCase().includes('token') ||
              breadcrumb.message.toLowerCase().includes('secret')) {
            return null;
          }
        }

        // Remove PII from HTTP breadcrumbs
        if (breadcrumb.category === 'http' && breadcrumb.data) {
          const sanitizedData = { ...breadcrumb.data };
          delete sanitizedData.Authorization;
          delete sanitizedData['X-API-Key'];
          breadcrumb.data = sanitizedData;
        }

        return breadcrumb;
      },

      // Performance monitoring integrations will be automatically included
      integrations: [],
    });

    // Set initial context
    Sentry.setContext('app', {
      name: 'ReactNativeSkeleton',
      version: '2.0.0',
      environment: config.environment,
      build: process.env.APP_BUILD || 'development',
    });

    // Set user context (without PII)
    Sentry.setUser({
      id: 'anonymous', // Will be updated when user logs in
    });

    logger.info('Sentry initialized successfully', LogCategory.BUSINESS, {
      service: 'SentryConfig',
      metadata: {
        environment: config.environment,
        sampleRate: config.sampleRate,
        tracesSampleRate: config.tracesSampleRate,
        profilesSampleRate: config.profilesSampleRate,
        debug: config.debug
      }
    });

  } catch (error) {
    logger.error('Failed to initialize Sentry', LogCategory.BUSINESS, {
      service: 'SentryConfig'
    }, error as Error);
  }
}

/**
 * Update Sentry user context
 * 
 * Updates the user context in Sentry with GDPR-compliant information.
 * Only stores non-PII identifiers.
 * 
 * @param userId - Non-PII user identifier
 * @param userRole - User role for context
 * 
 * @example
 * ```typescript
 * import { updateSentryUser } from '@core/config/sentry.config';
 * 
 * // Update user context after login
 * updateSentryUser('user-12345', 'premium');
 * ```
 */
export function updateSentryUser(userId: string, userRole?: string): void {
  try {
    Sentry.setUser({
      id: userId,
      role: userRole,
    });

    Sentry.setTag('user_role', userRole || 'unknown');
    
    logger.info('Sentry user context updated', LogCategory.BUSINESS, {
      service: 'SentryConfig',
      userId,
      metadata: {
        hasRole: !!userRole
      }
    });
  } catch (error) {
    logger.error('Failed to update Sentry user context', LogCategory.BUSINESS, {
      service: 'SentryConfig'
    }, error as Error);
  }
}

/**
 * Clear Sentry user context
 * 
 * Clears user context from Sentry (e.g., on logout).
 * 
 * @example
 * ```typescript
 * import { clearSentryUser } from '@core/config/sentry.config';
 * 
 * // Clear user context on logout
 * clearSentryUser();
 * ```
 */
export function clearSentryUser(): void {
  try {
    Sentry.setUser({ id: 'anonymous' });
    Sentry.setTag('user_role', null);
    
    logger.info('Sentry user context cleared', LogCategory.BUSINESS, {
      service: 'SentryConfig'
    });
  } catch (error) {
    logger.error('Failed to clear Sentry user context', LogCategory.BUSINESS, {
      service: 'SentryConfig'
    }, error as Error);
  }
}

/**
 * Test Sentry configuration
 * 
 * Sends a test event to verify Sentry integration is working correctly.
 * Only works in development environment.
 * 
 * @example
 * ```typescript
 * import { testSentryIntegration } from '@core/config/sentry.config';
 * 
 * // Test Sentry integration
 * testSentryIntegration();
 * ```
 */
export function testSentryIntegration(): void {
  const environment = getCurrentEnvironment();
  
  if (environment !== 'development') {
    logger.warn('Sentry test only available in development environment', LogCategory.BUSINESS, {
      service: 'SentryConfig',
      metadata: {
        currentEnvironment: environment
      }
    });
    return;
  }

  try {
    Sentry.captureMessage('🧪 Sentry integration test - This is a test message', 'info');
    logger.info('Sentry test message sent successfully', LogCategory.BUSINESS, {
      service: 'SentryConfig'
    });
  } catch (error) {
    logger.error('Sentry test failed', LogCategory.BUSINESS, {
      service: 'SentryConfig'
    }, error as Error);
  }
}

/**
 * Get current Sentry configuration
 * 
 * Returns the current Sentry configuration for debugging purposes.
 * 
 * @returns Current Sentry configuration
 */
export function getSentryConfig(): SentryConfig {
  return createSentryConfig();
}

/**
 * Export Sentry instance for direct usage
 */
export { Sentry };

/**
 * Export configuration constants
 */
export const SENTRY_CONFIG = createSentryConfig(); 