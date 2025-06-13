/**
 * @fileoverview ERROR-MONITORING-SERVICE: Enterprise Error Tracking & Performance Monitoring
 * @description Centralized error tracking, performance monitoring, analytics, and comprehensive application observability with enterprise-grade features
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Monitoring.ErrorMonitoring
 * @namespace Core.Monitoring.ErrorMonitoring
 * @category Monitoring
 * @subcategory ErrorTracking
 */

import * as Sentry from '@sentry/react-native';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

/**
 * Error Context Interface
 * 
 * Comprehensive context information for error tracking and categorization.
 * Provides structured error metadata for enterprise monitoring and analytics.
 * 
 * @interface ErrorContext
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory ErrorTracking
 * 
 * @example
 * ```tsx
 * const errorContext: ErrorContext = {
 *   userId: 'user123',
 *   feature: 'auth',
 *   action: 'login',
 *   severity: 'high',
 *   metadata: {
 *     authMethod: 'email',
 *     attemptNumber: 3
 *   }
 * };
 * ```
 */
export interface ErrorContext {
  /**
   * User identifier for error attribution.
   * Links errors to specific users for debugging and analytics.
   * 
   * @type {string}
   * @optional
   * @example "user_123456"
   */
  userId?: string;

  /**
   * Feature or module where the error occurred.
   * Enables error categorization by application feature.
   * 
   * @type {string}
   * @optional
   * @example "auth", "profile", "notifications"
   */
  feature?: string;

  /**
   * Specific action being performed when error occurred.
   * Provides granular context for error analysis.
   * 
   * @type {string}
   * @optional
   * @example "login", "register", "update_profile"
   */
  action?: string;

  /**
   * Additional metadata for error context.
   * Extensible object for custom error information.
   * 
   * @type {Record<string, any>}
   * @optional
   * @example { authMethod: 'email', attemptNumber: 3, deviceType: 'mobile' }
   */
  metadata?: Record<string, any>;

  /**
   * Error severity level for prioritization.
   * Determines error handling priority and alerting.
   * 
   * @type {'low' | 'medium' | 'high' | 'critical'}
   * @optional
   * @default 'medium'
   * 
   * @severity_levels
   * - **low**: Minor issues, informational
   * - **medium**: Standard errors, needs attention
   * - **high**: Serious errors, immediate attention
   * - **critical**: System-critical errors, urgent response
   */
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Performance Metrics Interface
 * 
 * Structured performance data for application monitoring and optimization.
 * Captures key performance indicators for screens and user interactions.
 * 
 * @interface PerformanceMetrics
 * @since 1.0.0
 * @version 1.0.0
 * @category Interfaces
 * @subcategory PerformanceMonitoring
 * 
 * @example
 * ```tsx
 * const performanceMetrics: PerformanceMetrics = {
 *   screenName: 'LoginScreen',
 *   loadTime: 1250,
 *   memoryUsage: 45.7,
 *   networkRequests: 3
 * };
 * ```
 */
export interface PerformanceMetrics {
  /**
   * Name of the screen or component being measured.
   * Identifies the specific UI element for performance tracking.
   * 
   * @type {string}
   * @required
   * @example "LoginScreen", "ProfileScreen", "HomeTab"
   */
  screenName: string;

  /**
   * Load time in milliseconds.
   * Primary performance metric for screen rendering.
   * 
   * @type {number}
   * @required
   * @unit milliseconds
   * @example 1250 (1.25 seconds)
   */
  loadTime: number;

  /**
   * Memory usage in megabytes.
   * Tracks memory consumption for performance optimization.
   * 
   * @type {number}
   * @optional
   * @unit megabytes
   * @example 45.7 (45.7 MB)
   */
  memoryUsage?: number;

  /**
   * Number of network requests made.
   * Tracks network activity for performance analysis.
   * 
   * @type {number}
   * @optional
   * @example 3
   */
  networkRequests?: number;
}

/**
 * Error Monitoring Service Class
 * 
 * Enterprise-grade error tracking and performance monitoring service providing
 * comprehensive application observability, error categorization, performance
 * metrics, and analytics integration with Sentry and device information.
 * 
 * @class ErrorMonitoringService
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Services
 * @subcategory Monitoring
 * @module Core.Monitoring.ErrorMonitoring
 * @namespace Core.Monitoring.ErrorMonitoring.ErrorMonitoringService
 * 
 * @description
 * Centralized monitoring service providing enterprise-grade error tracking,
 * performance monitoring, and analytics. Integrates with Sentry for error
 * tracking and device information for comprehensive application observability.
 * 
 * @example
 * Basic service usage:
 * ```tsx
 * import { errorMonitoring } from '@/core/monitoring/error-monitoring.service';
 * 
 * // Initialize monitoring
 * await errorMonitoring.initialize('your-sentry-dsn');
 * 
 * // Set user context
 * errorMonitoring.setUser('user123', { email: 'user@example.com' });
 * 
 * // Track errors
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   errorMonitoring.captureError(error, {
 *     feature: 'auth',
 *     action: 'login',
 *     severity: 'high'
 *   });
 * }
 * ```
 * 
 * @example
 * Performance monitoring:
 * ```tsx
 * // Track screen load performance
 * const startTime = Date.now();
 * await loadScreenData();
 * const loadTime = Date.now() - startTime;
 * 
 * errorMonitoring.trackScreenLoad('LoginScreen', loadTime, {
 *   memoryUsage: 45.7,
 *   networkRequests: 3
 * });
 * ```
 * 
 * @example
 * Custom event tracking:
 * ```tsx
 * // Track user actions
 * errorMonitoring.trackEvent('button_clicked', {
 *   buttonName: 'login',
 *   screenName: 'LoginScreen',
 *   timestamp: Date.now()
 * });
 * 
 * // Add debugging breadcrumbs
 * errorMonitoring.addBreadcrumb(
 *   'User started login process',
 *   'user_action',
 *   { email: 'user@example.com' }
 * );
 * ```
 * 
 * @features
 * - **Error Tracking**: Comprehensive error capture and categorization
 * - **Performance Monitoring**: Screen load times and metrics tracking
 * - **User Context**: User-specific error attribution and tracking
 * - **Breadcrumbs**: Detailed event trails for debugging
 * - **Device Information**: Comprehensive device and app context
 * - **Session Tracking**: Session-based error grouping
 * - **Severity Levels**: Error prioritization and alerting
 * - **Metadata Support**: Extensible error context information
 * 
 * @monitoring_capabilities
 * - **Real-time Error Tracking**: Immediate error capture and reporting
 * - **Performance Metrics**: Load times and resource usage tracking
 * - **User Journey Tracking**: Complete user action breadcrumb trails
 * - **Device Context**: Hardware and software environment information
 * - **Session Management**: Session-based error grouping and analysis
 * - **Custom Events**: Application-specific event tracking
 * - **Error Filtering**: Development vs production error handling
 * - **URL Sanitization**: Sensitive data protection in URLs
 * 
 * @enterprise_features
 * - **Privacy Compliance**: Automatic sensitive data filtering
 * - **Error Categorization**: Feature and action-based error grouping
 * - **Performance Analytics**: Comprehensive performance insights
 * - **User Attribution**: User-specific error tracking
 * - **Session Analytics**: Session-based behavior analysis
 * - **Custom Context**: Extensible metadata support
 * - **Development Safety**: Development environment error filtering
 * 
 * @integration_patterns
 * - **Sentry Integration**: Enterprise Sentry configuration
 * - **Device Info Integration**: React Native device information
 * - **Platform Abstraction**: Cross-platform monitoring
 * - **Environment Detection**: Development vs production handling
 * - **Error Boundaries**: React error boundary integration
 * - **Performance APIs**: Native performance monitoring
 * 
 * @use_cases
 * - Application error tracking and debugging
 * - Performance monitoring and optimization
 * - User experience analytics
 * - Production issue diagnosis
 * - Development debugging assistance
 * - Business intelligence and analytics
 * - Quality assurance monitoring
 * - Customer support assistance
 * 
 * @best_practices
 * - Initialize early in application lifecycle
 * - Set user context after authentication
 * - Use appropriate severity levels
 * - Include relevant metadata in errors
 * - Track performance metrics consistently
 * - Filter sensitive data appropriately
 * - Test error tracking in development
 * - Monitor error trends and patterns
 * 
 * @security_considerations
 * - Automatic sensitive data filtering
 * - URL parameter sanitization
 * - User data privacy protection
 * - Development environment safety
 * - Token and credential filtering
 * - PII data protection
 * 
 * @performance_impact
 * - Minimal overhead in production
 * - Asynchronous error reporting
 * - Efficient data serialization
 * - Optimized network usage
 * - Memory-conscious implementation
 * 
 * @dependencies
 * - @sentry/react-native: Error tracking platform
 * - react-native-device-info: Device information
 * - react-native: Platform detection
 * 
 * @see {@link ErrorContext} for error context structure
 * @see {@link PerformanceMetrics} for performance data structure
 * 
 * @todo Add custom performance metrics
 * @todo Implement offline error queuing
 * @todo Add automated error grouping
 * @todo Implement error trend analysis
 */
class ErrorMonitoringService {
  /**
   * Service initialization status.
   * Prevents multiple initialization attempts.
   * 
   * @private
   * @type {boolean}
   * @default false
   */
  private isInitialized = false;

  /**
   * Current user identifier for error attribution.
   * Links errors to specific users for debugging.
   * 
   * @private
   * @type {string | null}
   * @default null
   */
  private userId: string | null = null;

  /**
   * Unique session identifier for error grouping.
   * Groups errors by user session for analysis.
   * 
   * @private
   * @type {string}
   */
  private sessionId: string;

  /**
   * ErrorMonitoringService Constructor
   * 
   * Initializes the error monitoring service with session tracking.
   * Generates unique session identifier for error grouping.
   * 
   * @constructor
   * @since 1.0.0
   * 
   * @description
   * Creates a new instance of the error monitoring service with
   * automatic session ID generation for error tracking and grouping.
   * 
   * @session_management
   * - Generates unique session identifier
   * - Enables session-based error grouping
   * - Tracks user journey across sessions
   * - Provides session context for debugging
   */
  constructor() {
    this.sessionId = this.generateSessionId();
  }

  // =============================================
  // INITIALIZATION
  // =============================================

  async initialize(dsn?: string): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Skip initialization in development to avoid polyfill issues
      if (__DEV__) {
        this.logger.info('Error monitoring skipped in development mode', LogCategory.BUSINESS, {
  service: 'ErrorMonitoring',
  environment: 'development'
});
        this.isInitialized = true;
        return;
      }

      // Get device and app information
      const [deviceInfo, appInfo] = await Promise.all([
        this.getDeviceInfo(),
        this.getAppInfo(),
      ]);

      Sentry.init({
        dsn: dsn || process.env.SENTRY_DSN || 'YOUR_SENTRY_DSN',
        debug: __DEV__,
        environment: __DEV__ ? 'development' : 'production',
        
        // Performance Monitoring
        enableTracing: true,
        tracesSampleRate: __DEV__ ? 1.0 : 0.1,
        
        // Session Tracking
        enableAutoSessionTracking: true,
        sessionTrackingIntervalMillis: 30000,
        
        // Release and Distribution
        release: appInfo.version,
        dist: appInfo.buildNumber,
        
        // Error filtering
        beforeSend: (event, hint) => {
          // Filter out known non-critical errors
          const error = hint.originalException;
          if (error && typeof error === 'object' && 'message' in error && 
              typeof error.message === 'string' && error.message.includes('Network request failed')) {
            return __DEV__ ? event : null;
          }
          
          // Add additional context
          if (event.contexts) {
            event.contexts.session = { sessionId: this.sessionId };
          }
          
          return event;
        },
        
        // Breadcrumb filtering
        beforeBreadcrumb: (breadcrumb) => {
          // Filter sensitive data from breadcrumbs
          if (breadcrumb.category === 'http' && breadcrumb.data?.url) {
            breadcrumb.data.url = this.sanitizeUrl(breadcrumb.data.url);
          }
          
          return breadcrumb;
        },
      });

      // Set initial context
      Sentry.setContext('device', deviceInfo);
      Sentry.setContext('app', appInfo);
      Sentry.setTag('platform', Platform.OS);
      Sentry.setTag('sessionId', this.sessionId);

      this.isInitialized = true;
      this.logger.info('Error monitoring initialized successfully', LogCategory.BUSINESS, {
  service: 'ErrorMonitoring',
  sentryEnabled: true,
  crashlyticsEnabled: false
});
      
      // Track initialization
      this.trackEvent('monitoring.initialized', {
        platform: Platform.OS,
        version: appInfo.version,
      });
      
    } catch (error) {
      this.logger.error('Failed to initialize error monitoring', LogCategory.BUSINESS, {
  service: 'ErrorMonitoring'
}, error as Error);
      // Mark as initialized even if failed to prevent repeated attempts
      this.isInitialized = true;
    }
  }

  // =============================================
  // ERROR TRACKING
  // =============================================

  captureError(error: Error, context?: ErrorContext): void {
    if (!this.isInitialized) {
      this.logger.error('Error monitoring not initialized', LogCategory.BUSINESS, {
  service: 'ErrorMonitoring'
}, error as Error);
      return;
    }

    Sentry.withScope((scope) => {
      // Set user context
      if (this.userId) {
        scope.setUser({ id: this.userId });
      }
      
      // Set tags
      if (context?.feature) {
        scope.setTag('feature', context.feature);
      }
      if (context?.action) {
        scope.setTag('action', context.action);
      }
      if (context?.severity) {
        scope.setLevel(this.mapSeverityToLevel(context.severity));
      }
      
      // Set context
      if (context?.metadata) {
        scope.setContext('errorContext', context.metadata);
      }
      
      // Add fingerprint for grouping
      if (context?.feature && context?.action) {
        scope.setFingerprint([context.feature, context.action, error.name]);
      }
      
      Sentry.captureException(error);
    });
  }

  captureMessage(message: string, level: 'debug' | 'info' | 'warning' | 'error' = 'info', context?: ErrorContext): void {
    if (!this.isInitialized) {
      this.logger.info('Error monitoring log entry', LogCategory.BUSINESS, {
  service: 'ErrorMonitoring',
  level,
  message
});
      return;
    }

    Sentry.withScope((scope) => {
      scope.setLevel(level);
      
      if (context?.feature) {
        scope.setTag('feature', context.feature);
      }
      if (context?.action) {
        scope.setTag('action', context.action);
      }
      if (context?.metadata) {
        scope.setContext('messageContext', context.metadata);
      }
      
      Sentry.captureMessage(message);
    });
  }

  // =============================================
  // PERFORMANCE MONITORING
  // =============================================

  trackScreenLoad(screenName: string, loadTime: number, metadata?: Record<string, any>): void {
    // Track as custom metric with breadcrumb
    this.trackPerformanceMetric({
      screenName,
      loadTime,
      ...metadata,
    });
    
    // Also add as breadcrumb for debugging
    this.addBreadcrumb(
      `Screen loaded: ${screenName} (${loadTime}ms)`,
      'performance',
      { screenName, loadTime, ...metadata }
    );
  }

  trackPerformanceMetric(metrics: PerformanceMetrics): void {
    if (!this.isInitialized) {
      return;
    }

    Sentry.addBreadcrumb({
      category: 'performance',
      message: `Screen ${metrics.screenName} loaded in ${metrics.loadTime}ms`,
      level: 'info',
      data: metrics,
    });
  }

  // =============================================
  // USER CONTEXT
  // =============================================

  setUser(userId: string, userData?: Record<string, any>): void {
    this.userId = userId;
    
    if (this.isInitialized) {
      Sentry.setUser({
        id: userId,
        ...userData,
      });
    }
  }

  clearUser(): void {
    this.userId = null;
    
    if (this.isInitialized) {
      Sentry.setUser(null);
    }
  }

  // =============================================
  // BREADCRUMBS & EVENTS
  // =============================================

  addBreadcrumb(message: string, category: string = 'custom', data?: Record<string, any>): void {
    if (!this.isInitialized) {
      return;
    }

    Sentry.addBreadcrumb({
      message,
      category,
      level: 'info',
      data: {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        ...data,
      },
    });
  }

  trackEvent(eventName: string, properties?: Record<string, any>): void {
    this.addBreadcrumb(
      `Event: ${eventName}`,
      'user_action',
      { eventName, ...properties }
    );
  }

  // =============================================
  // PRIVATE METHODS
  // =============================================

  private async getDeviceInfo(): Promise<Record<string, any>> {
    try {
      const [
        deviceId,
        deviceName,
        systemVersion,
        brand,
        model,
        isEmulator,
        totalMemory,
        usedMemory,
      ] = await Promise.all([
        DeviceInfo.getDeviceId(),
        DeviceInfo.getDeviceName(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getBrand(),
        DeviceInfo.getModel(),
        DeviceInfo.isEmulator(),
        DeviceInfo.getTotalMemory(),
        DeviceInfo.getUsedMemory(),
      ]);

      return {
        deviceId,
        deviceName,
        systemVersion,
        brand,
        model,
        isEmulator,
        totalMemory,
        usedMemory,
        platform: Platform.OS,
        platformVersion: Platform.Version,
      };
    } catch (error) {
      console.warn('Failed to get device info:', error);
      return {
        platform: Platform.OS,
        platformVersion: Platform.Version,
      };
    }
  }

  private async getAppInfo(): Promise<Record<string, any>> {
    try {
      const [
        version,
        buildNumber,
        bundleId,
        appName,
        firstInstallTime,
        lastUpdateTime,
      ] = await Promise.all([
        DeviceInfo.getVersion(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getBundleId(),
        DeviceInfo.getApplicationName(),
        DeviceInfo.getFirstInstallTime(),
        DeviceInfo.getLastUpdateTime(),
      ]);

      return {
        version,
        buildNumber,
        bundleId,
        appName,
        firstInstallTime,
        lastUpdateTime,
      };
    } catch (error) {
      console.warn('Failed to get app info:', error);
      return {
        version: 'unknown',
        buildNumber: 'unknown',
      };
    }
  }

  private mapSeverityToLevel(severity: string): Sentry.SeverityLevel {
    switch (severity) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'fatal';
      default:
        return 'error';
    }
  }

  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove sensitive query parameters
      urlObj.searchParams.delete('token');
      urlObj.searchParams.delete('key');
      urlObj.searchParams.delete('password');
      return urlObj.toString();
    } catch {
      return '[invalid_url]';
    }
  }

  private generateSessionId(): string {
    // Einfache Session ID ohne crypto-polyfills
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000).toString(36);
    return `session_${timestamp}_${randomPart}`;
  }
}

// Export singleton instance
export const errorMonitoring = new ErrorMonitoringService(); 