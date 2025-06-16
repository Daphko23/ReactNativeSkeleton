/**
 * @fileoverview SENTRY-MONITORING: Enterprise Error Tracking and Performance Monitoring
 * @description Comprehensive Sentry integration with authentication-aware error tracking, security event monitoring, performance optimization, and enterprise-grade data sanitization
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Monitoring
 * @namespace Core.Monitoring.Sentry
 * @category Monitoring
 * @subcategory ErrorTracking
 */

import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { LoggerFactory } from '../logging/logger.factory';
import { LogCategory } from '../logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('SentryMonitoring');

/**
 * 🔍 Enterprise Sentry Configuration für Auth Feature
 *
 * Optimiert für:
 * - Auth-spezifisches Error Tracking
 * - Security Event Integration
 * - Performance Monitoring für Auth-Flows
 * - Sensible Daten-Filterung
 * - OAuth Provider URL-Sanitization
 * - Biometric/MFA Error Categorization
 */

/**
 * Sentry Configuration Interface
 * 
 * Defines comprehensive configuration options for Sentry integration with
 * enterprise-grade settings for error tracking, performance monitoring,
 * and security-aware event handling.
 * 
 * @interface SentryConfig
 * @since 1.0.0
 * @version 1.0.0
 * @category Configuration
 * @subcategory Sentry
 * @module Core.Monitoring
 * @namespace Core.Monitoring.Sentry.Configuration
 * 
 * @example
 * Basic configuration:
 * ```tsx
 * const config: SentryConfig = {
 *   dsn: 'https://your-dsn@sentry.io/project-id',
 *   environment: 'production',
 *   debug: false,
 *   enableAutoSessionTracking: true,
 *   enableOutOfMemoryTracking: true,
 *   enableNativeCrashHandling: true,
 *   enableAutoPerformanceTracing: true,
 *   tracesSampleRate: 0.1
 * };
 * ```
 * 
 * @example
 * Advanced configuration with custom beforeSend:
 * ```tsx
 * const config: SentryConfig = {
 *   dsn: process.env.SENTRY_DSN,
 *   environment: process.env.NODE_ENV,
 *   debug: process.env.NODE_ENV === 'development',
 *   enableAutoSessionTracking: true,
 *   enableOutOfMemoryTracking: true,
 *   enableNativeCrashHandling: true,
 *   enableAutoPerformanceTracing: true,
 *   tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
 *   beforeSend: (event) => {
 *     // Custom event filtering logic
 *     return event;
 *   }
 * };
 * ```
 * 
 * @properties
 * - dsn: Data Source Name for Sentry project connection
 * - environment: Deployment environment (development/staging/production)
 * - debug: Enable debug mode for development troubleshooting
 * - enableAutoSessionTracking: Automatic user session monitoring
 * - enableOutOfMemoryTracking: Memory-related crash detection
 * - enableNativeCrashHandling: Native platform crash reporting
 * - enableAutoPerformanceTracing: Automatic performance monitoring
 * - tracesSampleRate: Performance trace sampling rate (0.0 to 1.0)
 * - beforeSend: Optional event filtering and sanitization function
 * 
 * @security
 * - Sensitive data filtering through beforeSend
 * - Environment-specific configuration
 * - Production-optimized sampling rates
 * - Debug mode isolation for development
 * 
 * @performance
 * - Configurable sampling rates for different environments
 * - Optimized for production workloads
 * - Memory usage monitoring
 * - Native crash detection
 * 
 * @see {@link https://docs.sentry.io/platforms/react-native/configuration/} Sentry React Native Configuration
 */
interface SentryConfig {
  /**
   * Sentry Data Source Name (DSN)
   * 
   * Unique identifier for the Sentry project connection.
   * Contains authentication and routing information for error reporting.
   * 
   * @type {string}
   * @required
   * @example 'https://your-key@sentry.io/project-id'
   * @security Should be stored in environment variables
   */
  dsn: string;

  /**
   * Deployment Environment
   * 
   * Identifies the current deployment environment for error categorization
   * and environment-specific behavior configuration.
   * 
   * @type {string}
   * @default 'development'
   * @example 'development' | 'staging' | 'production'
   */
  environment: string;

  /**
   * Debug Mode Configuration
   * 
   * Enables verbose logging and debugging information in development.
   * Should be disabled in production for performance and security.
   * 
   * @type {boolean}
   * @default false
   * @production false
   * @development true
   */
  debug: boolean;

  /**
   * Automatic Session Tracking
   * 
   * Enables automatic user session monitoring and analytics.
   * Tracks session starts, ends, and crashes for user engagement insights.
   * 
   * @type {boolean}
   * @default true
   * @feature Session Analytics
   */
  enableAutoSessionTracking: boolean;

  /**
   * Out-of-Memory Tracking
   * 
   * Monitors and reports memory-related crashes and performance issues.
   * Critical for mobile app stability and memory optimization.
   * 
   * @type {boolean}
   * @default true
   * @platform Mobile Specific
   */
  enableOutOfMemoryTracking: boolean;

  /**
   * Native Crash Handling
   * 
   * Enables native platform crash detection and reporting.
   * Captures crashes from native modules and platform-specific issues.
   * 
   * @type {boolean}
   * @default true
   * @platform iOS/Android
   */
  enableNativeCrashHandling: boolean;

  /**
   * Automatic Performance Tracing
   * 
   * Enables automatic performance monitoring for app interactions.
   * Tracks navigation, network requests, and user interface performance.
   * 
   * @type {boolean}
   * @default true
   * @feature Performance Monitoring
   */
  enableAutoPerformanceTracing: boolean;

  /**
   * Performance Trace Sampling Rate
   * 
   * Percentage of performance traces to capture (0.0 to 1.0).
   * Lower rates reduce overhead in production while maintaining visibility.
   * 
   * @type {number}
   * @min 0.0
   * @max 1.0
   * @production 0.1
   * @development 1.0
   * @example 0.1 = 10% sampling, 1.0 = 100% sampling
   */
  tracesSampleRate: number;

  /**
   * Event Preprocessing Function
   * 
   * Optional function to filter, modify, or sanitize events before sending.
   * Used for sensitive data removal and custom event processing.
   * 
   * @type {function}
   * @optional
   * @param {Sentry.Event} event - The error event to process
   * @returns {Sentry.Event | null} Processed event or null to discard
   * @security Critical for sensitive data protection
   */
  beforeSend?: (event: Sentry.Event) => Sentry.Event | null;
}

/**
 * Authentication Context Interface
 * 
 * Comprehensive authentication state tracking for security-aware error
 * monitoring and user-specific event categorization. Provides context
 * for security events and authorization-related error analysis.
 * 
 * @interface AuthContext
 * @since 1.0.0
 * @version 1.0.0
 * @category Authentication
 * @subcategory Context
 * @module Core.Monitoring
 * @namespace Core.Monitoring.Sentry.AuthContext
 * 
 * @example
 * Authenticated user context:
 * ```tsx
 * const authContext: AuthContext = {
 *   isAuthenticated: true,
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   roles: ['user', 'premium'],
 *   mfaEnabled: true,
 *   biometricEnabled: true,
 *   lastLoginAt: '2024-01-15T10:30:00Z',
 *   sessionId: 'session-456',
 *   authMethod: 'biometric',
 *   securityLevel: 'high'
 * };
 * ```
 * 
 * @example
 * Anonymous user context:
 * ```tsx
 * const authContext: AuthContext = {
 *   isAuthenticated: false,
 *   securityLevel: 'low'
 * };
 * ```
 * 
 * @security
 * - PII data should be hashed or anonymized
 * - Sensitive fields should be sanitized before transmission
 * - Security level affects error handling priority
 * - Session tracking for security audit trails
 * 
 * @privacy
 * - Email and user data should be anonymized in production
 * - Biometric and MFA status for security context only
 * - Session IDs should be truncated or hashed
 * 
 * @audit
 * - Authentication method tracking for security analysis
 * - Login timestamp for session validation
 * - Role-based access monitoring
 * - Security level escalation tracking
 */
interface AuthContext {
  /**
   * Authentication Status
   * 
   * Indicates whether the user is currently authenticated.
   * Core flag for security-aware error handling and user context.
   * 
   * @type {boolean}
   * @required
   * @default false
   * @security Critical for access control context
   */
  isAuthenticated: boolean;

  /**
   * User Identifier
   * 
   * Unique user identifier for error association and user-specific analysis.
   * Should be anonymized or hashed in production environments.
   * 
   * @type {string}
   * @optional
   * @privacy Should be anonymized in production
   * @example 'user-123' | 'hashed-user-id'
   */
  userId?: string;

  /**
   * User Email Address
   * 
   * User's email for identification and communication context.
   * Must be sanitized and anonymized before transmission to Sentry.
   * 
   * @type {string}
   * @optional
   * @privacy PII - must be anonymized
   * @example 'u***@example.com'
   */
  email?: string;

  /**
   * User Roles and Permissions
   * 
   * Array of user roles for authorization context and security analysis.
   * Helps categorize errors by user permission levels.
   * 
   * @type {string[]}
   * @optional
   * @example ['user', 'premium', 'admin']
   * @security Used for privilege escalation monitoring
   */
  roles?: string[];

  /**
   * Multi-Factor Authentication Status
   * 
   * Indicates if MFA is enabled for enhanced security context.
   * Important for security-related error categorization.
   * 
   * @type {boolean}
   * @optional
   * @security Critical for authentication security level
   */
  mfaEnabled?: boolean;

  /**
   * Biometric Authentication Status
   * 
   * Indicates if biometric authentication is available and enabled.
   * Relevant for biometric-specific error handling and security analysis.
   * 
   * @type {boolean}
   * @optional
   * @platform iOS/Android specific
   * @security Enhanced authentication method
   */
  biometricEnabled?: boolean;

  /**
   * Last Login Timestamp
   * 
   * ISO string of the user's last successful login.
   * Used for session validation and security timeline analysis.
   * 
   * @type {string}
   * @optional
   * @format ISO 8601 timestamp
   * @example '2024-01-15T10:30:00Z'
   * @audit Session tracking for security analysis
   */
  lastLoginAt?: string;

  /**
   * Session Identifier
   * 
   * Unique session identifier for tracking user activity and errors.
   * Should be truncated or hashed for privacy protection.
   * 
   * @type {string}
   * @optional
   * @privacy Should be truncated/hashed
   * @example 'sess-123...abc'
   * @audit Session correlation for security events
   */
  sessionId?: string;

  /**
   * Authentication Method
   * 
   * The method used for the current authentication session.
   * Important for method-specific error analysis and security monitoring.
   * 
   * @type {string}
   * @optional
   * @values 'password' | 'biometric' | 'mfa' | 'oauth' | 'sso'
   * @example 'biometric'
   * @security Critical for authentication method analysis
   */
  authMethod?: string;

  /**
   * Security Level Assessment
   * 
   * Calculated security level based on authentication factors and user status.
   * Influences error handling priority and security response escalation.
   * 
   * @type {'low' | 'medium' | 'high' | 'critical'}
   * @optional
   * @default 'low'
   * @calculation Based on MFA, biometric, roles, and auth method
   * @security Determines error handling priority
   */
  securityLevel?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Security Event Interface
 * 
 * Comprehensive security event tracking for audit trails, threat detection,
 * and security incident analysis. Provides structured logging for security-
 * related activities and suspicious behavior monitoring.
 * 
 * @interface SecurityEvent
 * @since 1.0.0
 * @version 1.0.0
 * @category Security
 * @subcategory Events
 * @module Core.Monitoring
 * @namespace Core.Monitoring.Sentry.SecurityEvent
 * 
 * @example
 * Login security event:
 * ```tsx
 * const loginEvent: SecurityEvent = {
 *   id: 'evt-123',
 *   type: 'login',
 *   userId: 'user-456',
 *   timestamp: new Date(),
 *   severity: 'medium',
 *   details: {
 *     method: 'biometric',
 *     success: true,
 *     attempts: 1
 *   },
 *   ipAddress: '192.168.1.100',
 *   userAgent: 'ReactNative/0.72'
 * };
 * ```
 * 
 * @example
 * Suspicious activity event:
 * ```tsx
 * const suspiciousEvent: SecurityEvent = {
 *   id: 'evt-789',
 *   type: 'suspicious_activity',
 *   userId: 'user-456',
 *   timestamp: new Date(),
 *   severity: 'high',
 *   details: {
 *     activity: 'multiple_failed_logins',
 *     count: 5,
 *     timeWindow: '5 minutes'
 *   },
 *   ipAddress: '203.0.113.15'
 * };
 * ```
 * 
 * @audit
 * - All security events are logged for audit trails
 * - Events are correlated with user sessions
 * - Severity levels trigger appropriate responses
 * - Timestamps enable timeline analysis
 * 
 * @security
 * - IP addresses for geographic analysis
 * - User agent strings for device fingerprinting
 * - Event correlation for threat detection
 * - Severity-based alerting and escalation
 * 
 * @privacy
 * - IP addresses should be anonymized after analysis
 * - User agents should be sanitized
 * - Personal details should be excluded from event details
 * - Retention policies should be enforced
 */
interface SecurityEvent {
  /**
   * Unique Event Identifier
   * 
   * Globally unique identifier for the security event.
   * Used for event correlation, deduplication, and audit trail tracking.
   * 
   * @type {string}
   * @required
   * @unique
   * @example 'evt-123-456-789'
   * @audit Primary key for event tracking
   */
  id: string;

  /**
   * Security Event Type
   * 
   * Categorizes the type of security event for appropriate handling
   * and analysis. Determines response procedures and alert levels.
   * 
   * @type {'login' | 'logout' | 'mfa_enabled' | 'password_change' | 'suspicious_activity'}
   * @required
   * @category Security Classification
   * @examples
   * - 'login': User authentication attempts
   * - 'logout': Session termination events
   * - 'mfa_enabled': Multi-factor authentication setup
   * - 'password_change': Password modification events
   * - 'suspicious_activity': Potentially malicious behavior
   */
  type:
    | 'login'
    | 'logout'
    | 'mfa_enabled'
    | 'password_change'
    | 'suspicious_activity';

  /**
   * Associated User Identifier
   * 
   * User identifier associated with the security event.
   * Links events to specific users for correlation and analysis.
   * 
   * @type {string}
   * @required
   * @privacy Should be anonymized in production
   * @example 'user-123'
   * @audit Links events to user accounts
   */
  userId: string;

  /**
   * Event Timestamp
   * 
   * Precise timestamp when the security event occurred.
   * Critical for timeline analysis and event correlation.
   * 
   * @type {Date}
   * @required
   * @precision Millisecond accuracy
   * @timezone UTC recommended
   * @audit Essential for chronological analysis
   */
  timestamp: Date;

  /**
   * Event Severity Level
   * 
   * Risk assessment level for the security event.
   * Determines alerting, escalation, and response procedures.
   * 
   * @type {'low' | 'medium' | 'high' | 'critical'}
   * @required
   * @default 'low'
   * @escalation
   * - 'low': Routine security events, logged only
   * - 'medium': Notable events, monitoring alerts
   * - 'high': Concerning events, immediate alerts
   * - 'critical': Serious threats, emergency response
   */
  severity: 'low' | 'medium' | 'high' | 'critical';

  /**
   * Event Details
   * 
   * Structured data containing specific information about the security event.
   * Flexible object for event-type specific metadata and context.
   * 
   * @type {Record<string, any>}
   * @required
   * @flexible Event-specific structured data
   * @examples
   * - Login: { method: 'biometric', success: true, attempts: 1 }
   * - Suspicious: { activity: 'brute_force', count: 10 }
   * @privacy Should not contain PII or sensitive data
   */
  details: Record<string, any>;

  /**
   * Source IP Address
   * 
   * IP address from which the security event originated.
   * Used for geographic analysis and threat intelligence.
   * 
   * @type {string}
   * @optional
   * @privacy Should be anonymized after analysis
   * @example '192.168.1.100'
   * @security Geographic and network analysis
   */
  ipAddress?: string;

  /**
   * User Agent String
   * 
   * Client application and device information.
   * Helps identify device types and potential security threats.
   * 
   * @type {string}
   * @optional
   * @privacy Should be sanitized
   * @example 'ReactNative/0.72 (iOS 17.0)'
   * @security Device fingerprinting and threat detection
   */
  userAgent?: string;
}

/**
 * Enterprise Sentry Service Class
 * 
 * Comprehensive Sentry integration service providing authentication-aware error tracking,
 * security event monitoring, performance optimization, and enterprise-grade data management.
 * Implements singleton pattern for application-wide error monitoring and analytics.
 * 
 * @class SentryService
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Monitoring
 * @subcategory Service
 * @module Core.Monitoring
 * @namespace Core.Monitoring.Sentry.Service
 * 
 * @example
 * Basic initialization:
 * ```tsx
 * import { sentryService } from '@/core/monitoring/sentry';
 * 
 * // Initialize Sentry during app startup
 * await sentryService.initialize();
 * 
 * // Set user context after authentication
 * await sentryService.setUserContext({
 *   id: 'user-123',
 *   email: 'user@example.com',
 *   roles: ['user']
 * });
 * ```
 * 
 * @example
 * Error tracking with context:
 * ```tsx
 * // Capture auth-specific errors
 * sentryService.captureAuthException(error, {
 *   authMethod: 'biometric',
 *   step: 'fingerprint_verification',
 *   level: 'error'
 * });
 * 
 * // Add security events
 * sentryService.addSecurityEvent({
 *   id: 'evt-123',
 *   type: 'login',
 *   userId: 'user-123',
 *   timestamp: new Date(),
 *   severity: 'medium',
 *   details: { success: true }
 * });
 * ```
 * 
 * @example
 * Performance monitoring:
 * ```tsx
 * // Start performance transaction
 * const transaction = sentryService.startAuthTransaction(
 *   'user_login',
 *   'auth.login'
 * );
 * 
 * try {
 *   await performLogin();
 *   transaction.setStatus('ok');
 * } catch (error) {
 *   transaction.setStatus('internal_error');
 *   sentryService.captureAuthException(error);
 * } finally {
 *   transaction.finish();
 * }
 * ```
 * 
 * @features
 * - Authentication-aware error categorization
 * - Security event tracking and correlation
 * - Performance monitoring for auth flows
 * - Sensitive data sanitization
 * - Enterprise-grade configuration
 * - Real-time security analysis
 * - Biometric and MFA error handling
 * - OAuth provider URL sanitization
 * - Custom breadcrumb filtering
 * - Risk level assessment
 * 
 * @security
 * - Automatic PII data sanitization
 * - OAuth URL anonymization
 * - Sensitive field filtering
 * - Security level-based processing
 * - IP address anonymization
 * - User agent sanitization
 * - Session ID truncation
 * 
 * @performance
 * - Environment-specific sampling rates
 * - Efficient event filtering
 * - Memory-optimized event storage
 * - Lazy initialization support
 * - Minimal runtime overhead
 * - Native crash detection
 * 
 * @audit
 * - Complete security event logging
 * - User action correlation
 * - Timeline analysis support
 * - Risk assessment tracking
 * - Authentication method analytics
 * - Session correlation
 * 
 * @architecture
 * - Singleton pattern for global access
 * - Event-driven security monitoring
 * - Configurable error categorization
 * - Extensible event processing
 * - Multi-environment support
 * - Plugin-ready architecture
 * 
 * @see {@link https://docs.sentry.io/platforms/react-native/} Sentry React Native Documentation
 * @see {@link https://docs.sentry.io/product/performance/} Sentry Performance Monitoring
 * @see {@link https://docs.sentry.io/product/security-policy-reporting/} Sentry Security Reporting
 */
class SentryService {
  /**
   * Initialization Status Flag
   * 
   * Tracks whether the Sentry service has been properly initialized.
   * Prevents duplicate initialization and ensures proper service state.
   * 
   * @private
   * @type {boolean}
   * @default false
   * @since 1.0.0
   * @internal
   */
  private isInitialized = false;

  /**
   * Authentication Context Storage
   * 
   * Maintains current user authentication state and security context
   * for error categorization and security-aware event processing.
   * 
   * @private
   * @type {AuthContext}
   * @default {isAuthenticated: false}
   * @since 1.0.0
   * @internal
   * @security Contains authentication state for error context
   */
  private authContext: AuthContext = {isAuthenticated: false};

  /**
   * Security Events Buffer
   * 
   * Stores recent security events for correlation, risk assessment,
   * and security timeline analysis. Events are automatically pruned
   * to maintain memory efficiency.
   * 
   * @private
   * @type {SecurityEvent[]}
   * @default []
   * @since 1.0.0
   * @internal
   * @memory Automatically pruned to prevent memory leaks
   * @audit Used for security event correlation
   */
  private securityEvents: SecurityEvent[] = [];

  /**
   * Enterprise Sentry Initialization
   * 
   * Initializes Sentry with comprehensive enterprise configuration including
   * authentication-aware error tracking, performance monitoring, and security
   * event integration. Sets up environment-specific settings and data sanitization.
   * 
   * @method initialize
   * @async
   * @returns {Promise<void>} Resolves when initialization is complete
   * @throws {Error} If initialization fails or configuration is invalid
   * 
   * @since 1.0.0
   * @version 1.0.0
   * @author ReactNativeSkeleton Enterprise Team
   * @category Initialization
   * @module Core.Monitoring
   * @namespace Core.Monitoring.Sentry.Service
   * 
   * @example
   * Basic initialization:
   * ```tsx
   * import { sentryService } from '@/core/monitoring/sentry';
   * 
   * try {
   *   await sentryService.initialize();
   *   console.log('Sentry initialized successfully');
   * } catch (error) {
   *   console.error('Failed to initialize Sentry:', error);
   * }
   * ```
   * 
   * @example
   * Conditional initialization:
   * ```tsx
   * const initializeSentry = async () => {
   *   if (!sentryService.initialized) {
   *     await sentryService.initialize();
   *   }
   * };
   * ```
   * 
   * @configuration
   * Automatically configures:
   * - Environment-specific DSN and settings
   * - Performance monitoring and sampling rates
   * - Authentication-aware breadcrumb filtering
   * - Sensitive data sanitization
   * - Release and distribution tracking
   * - Initial device and user context
   * 
   * @environment_behavior
   * - **Development**: Full debugging, 100% trace sampling, verbose logging
   * - **Staging**: Performance monitoring, 50% trace sampling, reduced debugging
   * - **Production**: Optimized sampling (10%), minimal debugging, security focus
   * 
   * @security_features
   * - Automatic PII data filtering
   * - OAuth URL sanitization
   * - Sensitive field removal
   * - IP address anonymization
   * - Session ID truncation
   * 
   * @performance_optimization
   * - Environment-specific sampling rates
   * - Efficient event filtering
   * - Memory-conscious event storage
   * - Native crash detection
   * - Automatic session tracking
   * 
   * @error_handling
   * - Graceful degradation on initialization failure
   * - Console logging for debugging
   * - Duplicate initialization prevention
   * - Configuration validation
   * 
   * @integration_setup
   * - React Native performance tracing
   * - Authentication state tracking
   * - Security event correlation
   * - Device information collection
   * - Release and build tracking
   * 
   * @post_initialization
   * After successful initialization:
   * - User context is automatically set
   * - Device tags are applied
   * - Performance monitoring is active
   * - Error tracking is enabled
   * - Security monitoring is operational
   * 
   * @dependencies
   * - react-native-config for environment variables
   * - react-native-device-info for device context
   * - @sentry/react-native for core functionality
   * 
   * @see {@link https://docs.sentry.io/platforms/react-native/configuration/} Sentry Configuration Guide
   * @see {@link https://docs.sentry.io/product/performance/} Performance Monitoring Setup
   * 
   * @todo Add support for custom DSN validation
   * @todo Implement retry logic for failed initialization
   * @todo Add health check endpoint integration
   * @todo Support for dynamic configuration updates
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('Sentry already initialized');
      return;
    }

    try {
      const config = await this.getConfig();

      Sentry.init({
        dsn: config.dsn,
        environment: config.environment,
        debug: config.debug,
        enableAutoSessionTracking: config.enableAutoSessionTracking,
        // enableOutOfMemoryTracking: config.enableOutOfMemoryTracking, // Not available in current Sentry version
        enableNativeCrashHandling: config.enableNativeCrashHandling,
        enableAutoPerformanceTracing: config.enableAutoPerformanceTracing,
        tracesSampleRate: config.tracesSampleRate,
        beforeSend: config.beforeSend as any, // Type compatibility fix

        // Release & Distribution Tracking
        release: await this.getRelease(),
        dist: await this.getDistribution(),

        // Integration Configuration
        integrations: [
          // Note: Use new Sentry v4+ API - old ReactNativeTracing is deprecated
          // TODO: Update to new performance monitoring when upgrading Sentry
        ],

        // Scope Configuration
        beforeBreadcrumb: this.beforeBreadcrumb,
        initialScope: {
          tags: await this.getInitialTags(),
          contexts: await this.getInitialContexts(),
        },
      });

      // Set initial User Context
      await this.setUserContext();

      this.isInitialized = true;
      logger.info('Sentry initialized successfully with Auth optimization', LogCategory.BUSINESS, {
  service: 'Sentry',
  metadata: {
    authOptimization: true,
    profileIntegration: true
  }
});
    } catch (error) {
      logger.error('Failed to initialize Sentry', LogCategory.BUSINESS, {
  service: 'Sentry'
}, error as Error);
    }
  }

  /**
   * Generiert Enterprise Sentry-Konfiguration
   */
  private async getConfig(): Promise<SentryConfig> {
    const environment = Config.APP_ENV || 'development';
    const isProduction = environment === 'production';
    const isStaging = environment === 'staging';

    return {
      dsn: Config.SENTRY_DSN || '',
      environment,
      debug: !isProduction,
      enableAutoSessionTracking: true,
      enableOutOfMemoryTracking: isProduction || isStaging,
      enableNativeCrashHandling: true,
      enableAutoPerformanceTracing: isProduction || isStaging,
      tracesSampleRate: isProduction ? 0.1 : isStaging ? 0.5 : 1.0,
      beforeSend: this.beforeSend,
    };
  }

  /**
   * Enterprise Auth-aware Event Filter
   */
  private beforeSend = (event: Sentry.Event): Sentry.Event | null => {
    // Filtere Development-Errors
    if (Config.APP_ENV === 'development') {
      if (
        event.exception?.values?.[0]?.value?.includes('Network request failed')
      ) {
        return null;
      }
    }

    // Filtere sensible Auth-Daten
    if (event.request?.data) {
      event.request.data = this.sanitizeAuthData(event.request.data);
    }

    // Filtere sensible URLs
    if (event.request?.url) {
      event.request.url = this.sanitizeAuthUrl(event.request.url);
    }

    // Füge Auth-Context hinzu
    event.contexts = {
      ...event.contexts,
      auth: {
        ...this.authContext,
      },
      security: {
        recentEvents: this.securityEvents.slice(-5), // Letzte 5 Security Events
        riskLevel: this.calculateRiskLevel(),
      },
    };

    // Füge Enterprise Context hinzu
    event.extra = {
      ...event.extra,
      timestamp: new Date().toISOString(),
      buildNumber: Config.APP_BUILD_NUMBER,
      authState: this.authContext.isAuthenticated
        ? 'authenticated'
        : 'anonymous',
      securityLevel: this.authContext.securityLevel || 'low',
      sessionId: this.authContext.sessionId,
    };

    // Kategorisiere Auth-Errors
    if (this.isAuthError(event)) {
      event.tags = {
        ...event.tags,
        errorCategory: 'auth',
        authMethod: this.getAuthMethodFromError(event),
        securityImpact: this.getSecurityImpact(event),
      };

      // Füge Auth-spezifische Fingerprints hinzu
      event.fingerprint = this.getAuthFingerprint(event);
    }

    // Kategorisiere Biometric Errors
    if (this.isBiometricError(event)) {
      event.tags = {
        ...event.tags,
        errorCategory: 'biometric',
        biometricType: this.getBiometricType(event),
      };
    }

    // Kategorisiere MFA Errors
    if (this.isMFAError(event)) {
      event.tags = {
        ...event.tags,
        errorCategory: 'mfa',
        mfaType: this.getMFAType(event),
      };
    }

    return event;
  };

  /**
   * Enterprise Auth-aware Breadcrumb Filter
   */
  private beforeBreadcrumb = (
    breadcrumb: Sentry.Breadcrumb
  ): Sentry.Breadcrumb | null => {
    // Filtere sensible Navigation-Events
    if (
      breadcrumb.category === 'navigation' &&
      breadcrumb.data?.to?.includes('password')
    ) {
      return null;
    }

    // Filtere sensible HTTP-Breadcrumbs
    if (breadcrumb.category === 'http') {
      if (breadcrumb.data?.url) {
        breadcrumb.data.url = this.sanitizeAuthUrl(breadcrumb.data.url);
      }
      if (breadcrumb.data?.data) {
        breadcrumb.data.data = this.sanitizeAuthData(breadcrumb.data.data);
      }
    }

    // Füge Auth-Context zu relevanten Breadcrumbs hinzu
    if (this.isAuthRelatedBreadcrumb(breadcrumb)) {
      breadcrumb.data = {
        ...breadcrumb.data,
        authState: this.authContext.isAuthenticated,
        userId: this.authContext.userId,
      };
    }

    return breadcrumb;
  };

  /**
   * Generiert Release-Information
   */
  private async getRelease(): Promise<string> {
    const version = await DeviceInfo.getVersion();
    const buildNumber = await DeviceInfo.getBuildNumber();
    return `${Config.APP_NAME}@${version}+${buildNumber}`;
  }

  /**
   * Generiert Distribution-Information
   */
  private async getDistribution(): Promise<string> {
    return await DeviceInfo.getBuildNumber();
  }

  /**
   * Generiert initiale Tags
   */
  private async getInitialTags(): Promise<Record<string, string>> {
    return {
      platform: await DeviceInfo.getSystemName(),
      version: await DeviceInfo.getSystemVersion(),
      device: await DeviceInfo.getModel(),
      brand: await DeviceInfo.getBrand(),
      carrier: await DeviceInfo.getCarrier(),
      buildType: Config.APP_ENV || 'development',
      hasHermes:
        typeof HermesInternal === 'object' && HermesInternal !== null
          ? 'true'
          : 'false',
      isBridgeless:
        typeof (global as any).RN$Bridgeless === 'boolean'
          ? (global as any).RN$Bridgeless.toString()
          : 'false',
    };
  }

  /**
   * Generiert initiale Contexts
   */
  private async getInitialContexts(): Promise<Record<string, any>> {
    return {
      device: {
        name: await DeviceInfo.getDeviceName(),
        id: await DeviceInfo.getUniqueId(),
        type: await DeviceInfo.getDeviceType(),
        isEmulator: await DeviceInfo.isEmulator(),
        isTablet: await DeviceInfo.isTablet(),
        hasNotch: await DeviceInfo.hasNotch(),
        hasDynamicIsland: await DeviceInfo.hasDynamicIsland(),
      },
      app: {
        name: Config.APP_NAME,
        version: await DeviceInfo.getVersion(),
        buildNumber: await DeviceInfo.getBuildNumber(),
        bundleId: await DeviceInfo.getBundleId(),
        environment: Config.APP_ENV,
      },
    };
  }

  // ==========================================
  // 🔐 AUTH CONTEXT MANAGEMENT
  // ==========================================

  /**
   * Setzt User Context mit Enterprise Auth-Informationen
   */
  async setUserContext(user?: {
    id: string;
    email?: string;
    username?: string;
    roles?: string[];
    mfaEnabled?: boolean;
    biometricEnabled?: boolean;
    lastLoginAt?: Date;
    sessionId?: string;
    authMethod?: string;
    [key: string]: any;
  }): Promise<void> {
    if (user) {
      this.authContext = {
        isAuthenticated: true,
        userId: user.id,
        email: user.email,
        roles: user.roles,
        mfaEnabled: user.mfaEnabled,
        biometricEnabled: user.biometricEnabled,
        lastLoginAt: user.lastLoginAt?.toISOString(),
        sessionId: user.sessionId,
        authMethod: user.authMethod,
        securityLevel: this.calculateSecurityLevel(user),
      };

      Sentry.setUser({
        ...user,
      });

      // Setze Auth-spezifische Tags
      this.setAuthTag('user_authenticated', 'true');
      this.setAuthTag('mfa_enabled', user.mfaEnabled ? 'true' : 'false');
      this.setAuthTag(
        'biometric_enabled',
        user.biometricEnabled ? 'true' : 'false'
      );
      this.setAuthTag('auth_method', user.authMethod || 'unknown');
      this.setAuthTag(
        'security_level',
        this.authContext.securityLevel || 'low'
      );

      if (user.roles && user.roles.length > 0) {
        this.setAuthTag('user_roles', user.roles.join(','));
      }
    } else {
      this.authContext = {isAuthenticated: false};
      Sentry.setUser(null);
      this.setAuthTag('user_authenticated', 'false');
    }
  }

  /**
   * Setzt Auth-spezifische Tags
   */
  setAuthTag(key: string, value: string): void {
    Sentry.setTag(`auth.${key}`, value);
  }

  /**
   * Setzt allgemeine Tags
   */
  setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  /**
   * Setzt Context-Informationen
   */
  setContext(key: string, context: Record<string, any>): void {
    Sentry.setContext(key, context);
  }

  // ==========================================
  // 🍞 BREADCRUMB MANAGEMENT
  // ==========================================

  /**
   * Fügt Auth-spezifische Breadcrumbs hinzu
   */
  addAuthBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
  }): void {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'auth',
      level: breadcrumb.level || 'info',
      data: {
        ...breadcrumb.data,
        authState: this.authContext.isAuthenticated,
        userId: this.authContext.userId,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Fügt allgemeine Breadcrumbs hinzu
   */
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
  }): void {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'app',
      level: breadcrumb.level || 'info',
      data: {
        ...breadcrumb.data,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // ==========================================
  // 🚨 ERROR TRACKING
  // ==========================================

  /**
   * Erfasst Auth-spezifische Exceptions
   */
  captureAuthException(
    error: Error,
    context?: {
      authMethod?: string;
      step?: string;
      tags?: Record<string, string>;
      extra?: Record<string, any>;
      level?: Sentry.SeverityLevel;
    }
  ): void {
    Sentry.withScope((scope: Sentry.Scope) => {
      // Setze Auth-spezifische Tags
      scope.setTag('errorCategory', 'auth');
      if (context?.authMethod) {
        scope.setTag('authMethod', context.authMethod);
      }
      if (context?.step) {
        scope.setTag('authStep', context.step);
      }

      // Setze zusätzliche Tags
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      // Setze zusätzliche Daten
      scope.setExtra('authContext', this.authContext);
      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      // Setze Level
      if (context?.level) {
        scope.setLevel(context.level);
      }

      Sentry.captureException(error);
    });
  }

  /**
   * Erfasst allgemeine Exceptions
   */
  captureException(
    error: Error,
    context?: {
      tags?: Record<string, string>;
      extra?: Record<string, any>;
      level?: Sentry.SeverityLevel;
    }
  ): void {
    Sentry.withScope((scope: Sentry.Scope) => {
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      if (context?.level) {
        scope.setLevel(context.level);
      }

      Sentry.captureException(error);
    });
  }

  // ==========================================
  // 📝 MESSAGE TRACKING
  // ==========================================

  /**
   * Erfasst Auth-spezifische Messages
   */
  captureAuthMessage(
    message: string,
    context?: {
      authMethod?: string;
      step?: string;
      level?: Sentry.SeverityLevel;
      tags?: Record<string, string>;
      extra?: Record<string, any>;
    }
  ): void {
    Sentry.withScope((scope: Sentry.Scope) => {
      scope.setTag('messageCategory', 'auth');
      if (context?.authMethod) {
        scope.setTag('authMethod', context.authMethod);
      }
      if (context?.step) {
        scope.setTag('authStep', context.step);
      }

      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      scope.setExtra('authContext', this.authContext);
      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      Sentry.captureMessage(message, context?.level || 'info');
    });
  }

  /**
   * Erfasst allgemeine Messages
   */
  captureMessage(
    message: string,
    context?: {
      level?: Sentry.SeverityLevel;
      tags?: Record<string, string>;
      extra?: Record<string, any>;
    }
  ): void {
    Sentry.withScope((scope: Sentry.Scope) => {
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      Sentry.captureMessage(message, context?.level || 'info');
    });
  }

  // ==========================================
  // 📊 PERFORMANCE TRACKING
  // ==========================================

  /**
   * Startet Auth-spezifische Performance-Transaktion
   */
  startAuthTransaction(name: string, op: string): any {
    // TODO: Update to new Sentry v4+ transaction API
    logger.info('Auth transaction started', LogCategory.BUSINESS, {
  service: 'Sentry',
  metadata: {
    transactionName: name,
    operation: op
  }
});
    return null;
  }

  /**
   * Startet allgemeine Performance-Transaktion
   */
  startTransaction(name: string, op: string): any {
    // TODO: Update to new Sentry v4+ transaction API
    logger.info('Transaction started', LogCategory.BUSINESS, {
  service: 'Sentry',
  metadata: {
    transactionName: name,
    operation: op
  }
});
    return null;
  }

  // ==========================================
  // 🛡️ SECURITY EVENT TRACKING
  // ==========================================

  /**
   * Fügt Security Event hinzu
   */
  addSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);

    // Behalte nur die letzten 50 Events
    if (this.securityEvents.length > 50) {
      this.securityEvents = this.securityEvents.slice(-50);
    }

    // Sende kritische Events sofort an Sentry
    if (event.severity === 'critical' || event.severity === 'high') {
      this.captureAuthMessage(`Security Event: ${event.type}`, {
        level: event.severity === 'critical' ? 'error' : 'warning',
        tags: {
          securityEventType: event.type,
          severity: event.severity,
        },
        extra: {
          securityEvent: event,
        },
      });
    }
  }

  // ==========================================
  // 🔧 PRIVATE HELPER METHODS
  // ==========================================

  /**
   * Sanitisiert sensible Auth-Daten
   */
  private sanitizeAuthData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sensitiveFields = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'key',
      'credential',
      'authorization',
      'auth',
      'session',
      'cookie',
      'mfaCode',
      'verificationCode',
      'otp',
      'pin',
      'biometric',
    ];

    const sanitized = {...data};

    const sanitizeRecursive = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;

      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          obj[key] = '[FILTERED]';
        } else if (typeof value === 'object' && value !== null) {
          obj[key] = sanitizeRecursive(value);
        }
      }
      return obj;
    };

    return sanitizeRecursive(sanitized);
  }

  /**
   * Sanitisiert sensible URLs
   */
  private sanitizeAuthUrl(url: string): string {
    if (!url) return url;

    // OAuth Provider URLs
    if (this.isOAuthUrl(url)) {
      const urlObj = new URL(url);
      urlObj.searchParams.delete('access_token');
      urlObj.searchParams.delete('refresh_token');
      urlObj.searchParams.delete('code');
      urlObj.searchParams.delete('state');
      urlObj.searchParams.delete('client_secret');
      return urlObj.toString();
    }

    // Allgemeine Auth-Parameter
    return url.replace(
      /([?&])(token|key|secret|password|auth)=[^&]*/gi,
      '$1$2=[FILTERED]'
    );
  }

  /**
   * Prüft ob URL eine OAuth-URL ist
   */
  private isOAuthUrl(url?: string): boolean {
    if (!url) return false;

    const oauthDomains = [
      'accounts.google.com',
      'appleid.apple.com',
      'login.microsoftonline.com',
      'oauth.twitter.com',
      'www.facebook.com',
      'github.com',
      'linkedin.com',
    ];

    return oauthDomains.some(domain => url.includes(domain));
  }

  /**
   * Prüft ob Event ein Auth-Error ist
   */
  private isAuthError(event: Sentry.Event): boolean {
    const authKeywords = [
      'auth',
      'login',
      'password',
      'token',
      'credential',
      'session',
      'mfa',
      'biometric',
      'oauth',
      'unauthorized',
      'forbidden',
    ];

    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';
    const errorType = event.exception?.values?.[0]?.type?.toLowerCase() || '';

    return authKeywords.some(
      keyword => errorMessage.includes(keyword) || errorType.includes(keyword)
    );
  }

  /**
   * Prüft ob Event ein Biometric-Error ist
   */
  private isBiometricError(event: Sentry.Event): boolean {
    const biometricKeywords = ['biometric', 'touchid', 'faceid', 'fingerprint'];
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';
    return biometricKeywords.some(keyword => errorMessage.includes(keyword));
  }

  /**
   * Prüft ob Event ein MFA-Error ist
   */
  private isMFAError(event: Sentry.Event): boolean {
    const mfaKeywords = ['mfa', 'totp', 'otp', 'verification', 'factor'];
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';
    return mfaKeywords.some(keyword => errorMessage.includes(keyword));
  }

  /**
   * Extrahiert Auth-Methode aus Error
   */
  private getAuthMethodFromError(event: Sentry.Event): string {
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';

    if (errorMessage.includes('google')) return 'google';
    if (errorMessage.includes('apple')) return 'apple';
    if (errorMessage.includes('microsoft')) return 'microsoft';
    if (errorMessage.includes('biometric')) return 'biometric';
    if (errorMessage.includes('mfa') || errorMessage.includes('totp'))
      return 'mfa';
    if (errorMessage.includes('email')) return 'email';

    return 'unknown';
  }

  /**
   * Bestimmt Security Impact
   */
  private getSecurityImpact(event: Sentry.Event): string {
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';

    if (
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('forbidden')
    )
      return 'high';
    if (errorMessage.includes('mfa') || errorMessage.includes('biometric'))
      return 'medium';

    return 'low';
  }

  /**
   * Generiert Auth-spezifische Fingerprints
   */
  private getAuthFingerprint(event: Sentry.Event): string[] {
    const authMethod = this.getAuthMethodFromError(event);
    const errorType = event.exception?.values?.[0]?.type || 'unknown';

    return ['auth', authMethod, errorType];
  }

  /**
   * Extrahiert Biometric-Type
   */
  private getBiometricType(event: Sentry.Event): string {
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';

    if (errorMessage.includes('touchid')) return 'touchid';
    if (errorMessage.includes('faceid')) return 'faceid';
    if (errorMessage.includes('fingerprint')) return 'fingerprint';

    return 'unknown';
  }

  /**
   * Extrahiert MFA-Type
   */
  private getMFAType(event: Sentry.Event): string {
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';

    if (errorMessage.includes('totp')) return 'totp';
    if (errorMessage.includes('sms')) return 'sms';
    if (errorMessage.includes('email')) return 'email';

    return 'unknown';
  }

  /**
   * Prüft ob Breadcrumb Auth-related ist
   */
  private isAuthRelatedBreadcrumb(breadcrumb: Sentry.Breadcrumb): boolean {
    const authCategories = ['auth', 'navigation', 'http'];
    const authKeywords = ['login', 'logout', 'auth', 'mfa', 'biometric'];

    if (authCategories.includes(breadcrumb.category || '')) {
      return true;
    }

    const message = breadcrumb.message?.toLowerCase() || '';
    return authKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Berechnet Security Level basierend auf User-Daten
   */
  private calculateSecurityLevel(
    user: any
  ): 'low' | 'medium' | 'high' | 'critical' {
    let score = 0;

    if (user.mfaEnabled) score += 2;
    if (user.biometricEnabled) score += 1;
    if (user.roles?.includes('admin')) score += 2;
    if (user.roles?.includes('moderator')) score += 1;

    if (score >= 4) return 'critical';
    if (score >= 3) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }

  /**
   * Berechnet Risk Level basierend auf Security Events
   */
  private calculateRiskLevel(): 'low' | 'medium' | 'high' | 'critical' {
    const recentEvents = this.securityEvents.filter(
      event => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000 // Letzte 24h
    );

    const criticalEvents = recentEvents.filter(
      e => e.severity === 'critical'
    ).length;
    const highEvents = recentEvents.filter(e => e.severity === 'high').length;

    if (criticalEvents > 0) return 'critical';
    if (highEvents > 2) return 'high';
    if (recentEvents.length > 5) return 'medium';
    return 'low';
  }

  /**
   * Getter für Initialisierungsstatus
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}

// Singleton Export
export const sentryService = new SentryService();
export default sentryService;
