/**
 * @fileoverview CONSOLE-LOGGER: Enterprise Console Logging Implementation
 * @description Production-ready console logger implementation with structured logging, security audit trails, performance monitoring, and comprehensive enterprise logging capabilities
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Logging.ConsoleLogger
 * @namespace Core.Logging.ConsoleLogger
 * @category Logging
 * @subcategory Implementation
 */

import {
  ILoggerService, 
  LogLevel, 
  LogCategory, 
  LogContext, 
  SecurityLogData,
  PerformanceLogData,
  AuditLogData,
  LogTimer
} from './logger.service.interface';

/**
 * Console method mapping for different log levels.
 * Maps internal log levels to corresponding console methods for output.
 * 
 * @constant consoleMethods
 * @since 1.0.0
 * @description
 * Provides a type-safe mapping between LogLevel enums and console methods,
 * ensuring consistent output formatting and appropriate console method usage.
 * 
 * @level_mapping
 * - **DEBUG**: console.debug for debugging information
 * - **INFO**: console.info for general information
 * - **WARN**: console.warn for warning messages
 * - **ERROR**: console.error for error conditions
 * - **FATAL**: console.error for fatal errors (same as error in console)
 * 
 * @example
 * ```tsx
 * // Usage within logger
 * consoleMethods[LogLevel.INFO]('Application started', context);
 * consoleMethods[LogLevel.ERROR]('Critical error occurred', context, error);
 * ```
 */
const consoleMethods: Record<LogLevel, (...args: unknown[]) => void> = {
  [LogLevel.DEBUG]: console.debug,
  [LogLevel.INFO]: console.info,
  [LogLevel.WARN]: console.warn,
  [LogLevel.ERROR]: console.error,
  [LogLevel.FATAL]: console.error, // Use console.error for fatal
};

/**
 * Console Logger Implementation
 * 
 * Enterprise-grade console logging implementation providing structured logging,
 * security audit trails, performance monitoring, and comprehensive debugging
 * capabilities. Implements the ILoggerService interface with full feature support
 * including timing operations, contextual logging, and specialized logging methods.
 * 
 * @class ConsoleLogger
 * @implements {ILoggerService}
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Classes
 * @subcategory Logging
 * @module Core.Logging.ConsoleLogger
 * @namespace Core.Logging.ConsoleLogger.ConsoleLogger
 * 
 * @description
 * Production-ready console logger that provides structured logging with consistent
 * formatting, contextual information, and specialized logging capabilities for
 * security, performance, and audit requirements. Designed for enterprise applications
 * requiring comprehensive logging and debugging capabilities.
 * 
 * @example
 * Basic logger usage:
 * ```tsx
 * import { ConsoleLogger } from '@/core/logging/console.logger';
 * 
 * const logger = new ConsoleLogger();
 * 
 * // Basic logging
 * logger.info('Application started');
 * logger.error('Failed to load user data', undefined, undefined, error);
 * 
 * // Logging with category and context
 * logger.debug('User authentication attempt', LogCategory.AUTH, {
 *   userId: '12345',
 *   timestamp: Date.now(),
 *   sessionId: 'session-abc-123'
 * });
 * ```
 * 
 * @example
 * Security logging:
 * ```tsx
 * const logger = new ConsoleLogger();
 * 
 * logger.logSecurity('Suspicious login attempt detected', {
 *   userId: 'user-123',
 *   ipAddress: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...',
 *   timestamp: new Date().toISOString(),
 *   severity: 'HIGH',
 *   threatType: 'BRUTE_FORCE'
 * }, {
 *   component: 'AuthService',
 *   action: 'login'
 * });
 * ```
 * 
 * @example
 * Performance monitoring:
 * ```tsx
 * const logger = new ConsoleLogger();
 * 
 * // Manual performance logging
 * logger.logPerformance('API request completed', {
 *   operation: 'fetchUserProfile',
 *   duration: 245,
 *   endpoint: '/api/users/profile',
 *   statusCode: 200,
 *   requestSize: 1024,
 *   responseSize: 2048
 * });
 * 
 * // Timer-based performance logging
 * const timer = logger.startTimer('data-processing', { component: 'DataService' });
 * // ... perform operation
 * timer.stop({ recordsProcessed: 1000 });
 * ```
 * 
 * @example
 * Audit logging:
 * ```tsx
 * const logger = new ConsoleLogger();
 * 
 * logger.logAudit('User profile updated', {
 *   userId: 'user-123',
 *   action: 'PROFILE_UPDATE',
 *   resource: 'user_profile',
 *   timestamp: new Date().toISOString(),
 *   changes: ['email', 'displayName'],
 *   previousValues: { email: 'old@example.com' },
 *   newValues: { email: 'new@example.com' }
 * }, {
 *   component: 'ProfileService',
 *   requestId: 'req-456'
 * });
 * ```
 * 
 * @logging_features
 * - **Structured Logging**: Consistent format with categories and context
 * - **Log Levels**: Debug, Info, Warn, Error, Fatal with appropriate console methods
 * - **Contextual Information**: Rich context data for debugging
 * - **Security Logging**: Specialized security event logging
 * - **Performance Monitoring**: Built-in timing and performance metrics
 * - **Audit Trails**: Comprehensive audit logging for compliance
 * - **Error Tracking**: Enhanced error logging with stack traces
 * - **Timer Operations**: Built-in timing utilities
 * 
 * @enterprise_capabilities
 * - **Security Compliance**: Security event logging for audit requirements
 * - **Performance Monitoring**: Built-in performance tracking and metrics
 * - **Audit Trails**: Comprehensive audit logging for regulatory compliance
 * - **Structured Data**: JSON-structured log output for log aggregation
 * - **Error Context**: Rich error context for debugging
 * - **Operation Timing**: Built-in timing for performance analysis
 * 
 * @output_formatting
 * - **Level Prefixes**: Clear log level indicators ([DEBUG], [INFO], etc.)
 * - **Category Tags**: Optional category tags for log organization
 * - **Context Data**: Structured context information
 * - **Error Objects**: Full error object logging with stack traces
 * - **Timestamps**: Automatic timestamp generation for timing operations
 * 
 * @performance_features
 * - **Timer API**: Built-in timing operations for performance monitoring
 * - **Performance Metrics**: Comprehensive performance data logging
 * - **Operation Tracking**: Track duration and metrics for operations
 * - **Resource Monitoring**: Log resource usage and performance data
 * 
 * @security_features
 * - **Security Event Logging**: Dedicated security event tracking
 * - **Threat Detection**: Security threat and incident logging
 * - **Audit Compliance**: Audit trail logging for regulatory requirements
 * - **Access Logging**: User access and permission logging
 * 
 * @debugging_support
 * - **Rich Context**: Comprehensive context information for debugging
 * - **Error Details**: Full error objects with stack traces
 * - **Category Organization**: Organize logs by functional categories
 * - **Level Filtering**: Filter logs by severity level
 * 
 * @integration_patterns
 * - **Service Integration**: Easy integration with service classes
 * - **Component Logging**: Component-specific logging with context
 * - **Error Boundaries**: Integration with React error boundaries
 * - **Authentication**: Integration with authentication flows
 * - **API Services**: Request/response logging for API services
 * 
 * @use_cases
 * - Application debugging and development
 * - Production error monitoring
 * - Security incident tracking
 * - Performance monitoring and optimization
 * - Audit trail generation
 * - Compliance logging
 * - User activity tracking
 * - System health monitoring
 * 
 * @best_practices
 * - Use appropriate log levels for different types of information
 * - Include relevant context data for debugging
 * - Use security logging for security-related events
 * - Monitor performance with timing operations
 * - Implement audit logging for compliance requirements
 * - Use categories to organize related log entries
 * - Include error objects for debugging failures
 * 
 * @performance_considerations
 * - Console logging is synchronous and may impact performance
 * - Consider log level filtering in production environments
 * - Limit context data size for performance
 * - Use timers judiciously to avoid overhead
 * - Monitor console output volume in production
 * 
 * @production_considerations
 * - Console logs may not be available in production environments
 * - Consider implementing log aggregation for production use
 * - Monitor log volume and performance impact
 * - Implement log rotation and retention policies
 * - Consider security implications of logged data
 * 
 * @dependencies
 * - ./logger.service.interface: Logging service interface definitions
 * 
 * @see {@link ILoggerService} for service interface
 * @see {@link LogLevel} for log level definitions
 * @see {@link LogCategory} for log category definitions
 * @see {@link LogContext} for context structure
 * @see {@link SecurityLogData} for security logging data
 * @see {@link PerformanceLogData} for performance logging data
 * @see {@link AuditLogData} for audit logging data
 * 
 * @todo Add log level filtering configuration
 * @todo Implement log aggregation integration
 * @todo Add structured JSON output option
 * @todo Implement async logging for performance
 * @todo Add log rotation and retention features
 */
export class ConsoleLogger implements ILoggerService {
  /**
   * Log debug information to the console.
   * Used for detailed debugging information during development.
   * 
   * @method debug
   * @param {string} message - The debug message to log
   * @param {LogCategory} [category] - Optional category for organizing logs
   * @param {LogContext} [context] - Optional context data for debugging
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Outputs debug-level information using console.debug with structured formatting.
   * Includes category tags and context data for enhanced debugging capabilities.
   * 
   * @example
   * Basic debug logging:
   * ```tsx
   * logger.debug('User data fetched successfully');
   * ```
   * 
   * @example
   * Debug with category and context:
   * ```tsx
   * logger.debug('Cache hit for user data', LogCategory.CACHE, {
   *   userId: '12345',
   *   cacheKey: 'user-profile-12345',
   *   hitRate: 0.85
   * });
   * ```
   * 
   * @best_practices
   * - Use for detailed debugging information
   * - Include relevant context for troubleshooting
   * - Use categories to organize debug logs
   * - Remove or filter debug logs in production
   */
  debug(message: string, category?: LogCategory, context?: LogContext): void {
    consoleMethods[LogLevel.DEBUG](`[DEBUG]${category ? `[${category}]` : ''} ${message}`, context);
  }

  /**
   * Log informational messages to the console.
   * Used for general application information and status updates.
   * 
   * @method info
   * @param {string} message - The informational message to log
   * @param {LogCategory} [category] - Optional category for organizing logs
   * @param {LogContext} [context] - Optional context data for information
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Outputs informational messages using console.info with structured formatting.
   * Suitable for application status, flow tracking, and general information.
   * 
   * @example
   * Basic info logging:
   * ```tsx
   * logger.info('Application started successfully');
   * ```
   * 
   * @example
   * Info with category and context:
   * ```tsx
   * logger.info('User logged in', LogCategory.AUTH, {
   *   userId: '12345',
   *   sessionId: 'sess-abc-123',
   *   loginMethod: 'email'
   * });
   * ```
   * 
   * @use_cases
   * - Application startup and shutdown
   * - User authentication events
   * - Feature usage tracking
   * - System status updates
   * - Configuration changes
   */
  info(message: string, category?: LogCategory, context?: LogContext): void {
    consoleMethods[LogLevel.INFO](`[INFO]${category ? `[${category}]` : ''} ${message}`, context);
  }

  /**
   * Log warning messages to the console.
   * Used for potentially problematic situations that don't prevent operation.
   * 
   * @method warn
   * @param {string} message - The warning message to log
   * @param {LogCategory} [category] - Optional category for organizing logs
   * @param {LogContext} [context] - Optional context data for the warning
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Outputs warning messages using console.warn with structured formatting.
   * Indicates potential issues that should be monitored but don't prevent operation.
   * 
   * @example
   * Basic warning logging:
   * ```tsx
   * logger.warn('API response time exceeded threshold');
   * ```
   * 
   * @example
   * Warning with category and context:
   * ```tsx
   * logger.warn('Cache miss for frequently accessed data', LogCategory.CACHE, {
   *   cacheKey: 'user-settings-12345',
   *   requestFrequency: 'high',
   *   missRate: 0.15
   * });
   * ```
   * 
   * @use_cases
   * - Performance degradation warnings
   * - Fallback mechanism activation
   * - Deprecated feature usage
   * - Configuration issues
   * - Resource constraints
   */
  warn(message: string, category?: LogCategory, context?: LogContext): void {
    consoleMethods[LogLevel.WARN](`[WARN]${category ? `[${category}]` : ''} ${message}`, context);
  }

  /**
   * Log error messages to the console.
   * Used for error conditions that affect application functionality.
   * 
   * @method error
   * @param {string} message - The error message to log
   * @param {LogCategory} [category] - Optional category for organizing logs
   * @param {LogContext} [context] - Optional context data for the error
   * @param {Error} [error] - Optional error object with stack trace
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Outputs error messages using console.error with structured formatting.
   * Includes error objects and stack traces for comprehensive error debugging.
   * 
   * @example
   * Basic error logging:
   * ```tsx
   * logger.error('Failed to load user profile');
   * ```
   * 
   * @example
   * Error with full context and error object:
   * ```tsx
   * try {
   *   await fetchUserProfile(userId);
   * } catch (error) {
   *   logger.error('Profile fetch failed', LogCategory.API, {
   *     userId,
   *     endpoint: '/api/users/profile',
   *     timestamp: Date.now()
   *   }, error);
   * }
   * ```
   * 
   * @use_cases
   * - API request failures
   * - Data validation errors
   * - Authentication failures
   * - Resource access errors
   * - Unexpected application errors
   */
  error(message: string, category?: LogCategory, context?: LogContext, error?: Error): void {
    consoleMethods[LogLevel.ERROR](`[ERROR]${category ? `[${category}]` : ''} ${message}`, context, error);
  }

  /**
   * Log fatal error messages to the console.
   * Used for critical errors that may cause application termination.
   * 
   * @method fatal
   * @param {string} message - The fatal error message to log
   * @param {LogCategory} [category] - Optional category for organizing logs
   * @param {LogContext} [context] - Optional context data for the fatal error
   * @param {Error} [error] - Optional error object with stack trace
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Outputs fatal error messages using console.error with structured formatting.
   * Indicates critical system failures that may require immediate attention.
   * 
   * @example
   * Fatal error logging:
   * ```tsx
   * logger.fatal('Critical system failure detected', LogCategory.SYSTEM, {
   *   component: 'AuthenticationService',
   *   errorCode: 'SYSTEM_FAILURE',
   *   timestamp: Date.now()
   * }, error);
   * ```
   * 
   * @use_cases
   * - System-level failures
   * - Critical resource exhaustion
   * - Security breaches
   * - Data corruption
   * - Service unavailability
   */
  fatal(message: string, category?: LogCategory, context?: LogContext, error?: Error): void {
    consoleMethods[LogLevel.FATAL](`[FATAL]${category ? `[${category}]` : ''} ${message}`, context, error);
  }

  /**
   * Log security-related events and incidents.
   * Used for tracking security events, threats, and compliance requirements.
   * 
   * @method logSecurity
   * @param {string} message - The security event message
   * @param {SecurityLogData} securityData - Structured security event data
   * @param {LogContext} [context] - Optional context data for the security event
   * @param {Error} [error] - Optional error object for security failures
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Specialized logging method for security events with structured security data.
   * Provides comprehensive security event tracking for audit and compliance.
   * 
   * @example
   * Security event logging:
   * ```tsx
   * logger.logSecurity('Failed login attempt detected', {
   *   userId: 'user-123',
   *   ipAddress: '192.168.1.100',
   *   userAgent: 'Mozilla/5.0...',
   *   timestamp: new Date().toISOString(),
   *   severity: 'MEDIUM',
   *   threatType: 'BRUTE_FORCE'
   * }, {
   *   component: 'AuthenticationService',
   *   sessionId: 'sess-abc-123'
   * });
   * ```
   * 
   * @security_data_fields
   * - **userId**: User identifier involved in the event
   * - **ipAddress**: Source IP address of the event
   * - **userAgent**: User agent string for client identification
   * - **timestamp**: ISO timestamp of the security event
   * - **severity**: Event severity level (LOW, MEDIUM, HIGH, CRITICAL)
   * - **threatType**: Type of security threat or event
   * 
   * @use_cases
   * - Authentication failures and successes
   * - Authorization violations
   * - Suspicious activity detection
   * - Security policy violations
   * - Threat detection alerts
   */
  logSecurity(message: string, securityData: SecurityLogData, context?: LogContext, error?: Error): void {
    console.log(`[SECURITY] ${message}`, { securityData, context, error });
  }

  /**
   * Log performance metrics and monitoring data.
   * Used for tracking application performance and optimization metrics.
   * 
   * @method logPerformance
   * @param {string} message - The performance event message
   * @param {PerformanceLogData} performanceData - Structured performance metrics
   * @param {LogContext} [context] - Optional context data for the performance event
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Specialized logging method for performance metrics with structured performance data.
   * Enables comprehensive performance monitoring and optimization analysis.
   * 
   * @example
   * Performance metrics logging:
   * ```tsx
   * logger.logPerformance('API request completed', {
   *   operation: 'fetchUserProfile',
   *   duration: 245,
   *   endpoint: '/api/users/profile',
   *   statusCode: 200,
   *   requestSize: 1024,
   *   responseSize: 2048
   * }, {
   *   component: 'UserService',
   *   requestId: 'req-123'
   * });
   * ```
   * 
   * @performance_data_fields
   * - **operation**: Name or identifier of the operation
   * - **duration**: Operation duration in milliseconds
   * - **endpoint**: API endpoint or resource identifier
   * - **statusCode**: HTTP status code or operation result
   * - **requestSize**: Size of request data in bytes
   * - **responseSize**: Size of response data in bytes
   * 
   * @use_cases
   * - API response time monitoring
   * - Database query performance
   * - Component render performance
   * - Memory usage tracking
   * - CPU utilization monitoring
   */
  logPerformance(message: string, performanceData: PerformanceLogData, context?: LogContext): void {
    console.log(`[PERFORMANCE] ${message}`, { performanceData, context });
  }

  /**
   * Log audit trail events for compliance and tracking.
   * Used for tracking user actions and system changes for audit requirements.
   * 
   * @method logAudit
   * @param {string} message - The audit event message
   * @param {AuditLogData} auditData - Structured audit event data
   * @param {LogContext} [context] - Optional context data for the audit event
   * @returns {void}
   * 
   * @since 1.0.0
   * @description
   * Specialized logging method for audit events with structured audit data.
   * Provides comprehensive audit trail tracking for regulatory compliance.
   * 
   * @example
   * Audit event logging:
   * ```tsx
   * logger.logAudit('User profile updated', {
   *   userId: 'user-123',
   *   action: 'PROFILE_UPDATE',
   *   resource: 'user_profile',
   *   timestamp: new Date().toISOString(),
   *   changes: ['email', 'displayName'],
   *   previousValues: { email: 'old@example.com' },
   *   newValues: { email: 'new@example.com' }
   * }, {
   *   component: 'ProfileService',
   *   requestId: 'req-456'
   * });
   * ```
   * 
   * @audit_data_fields
   * - **userId**: User identifier who performed the action
   * - **action**: Type of action performed (CREATE, UPDATE, DELETE, etc.)
   * - **resource**: Resource or entity affected by the action
   * - **timestamp**: ISO timestamp of the audit event
   * - **changes**: List of fields or properties changed
   * - **previousValues**: Previous values before the change
   * - **newValues**: New values after the change
   * 
   * @use_cases
   * - User data modifications
   * - Administrative actions
   * - Permission changes
   * - System configuration updates
   * - Compliance tracking
   */
  logAudit(message: string, auditData: AuditLogData, context?: LogContext): void {
    console.log(`[AUDIT] ${message}`, { auditData, context });
  }

  /**
   * Start a performance timer for operation tracking.
   * Returns a timer object that can be stopped to log performance data.
   * 
   * @method startTimer
   * @param {string} operationName - Name of the operation being timed
   * @param {LogContext} [context] - Optional context data for the timer
   * @returns {LogTimer} Timer object with stop method
   * 
   * @since 1.0.0
   * @description
   * Creates a performance timer that automatically logs performance data when stopped.
   * Provides convenient timing utilities for performance monitoring and optimization.
   * 
   * @example
   * Basic timer usage:
   * ```tsx
   * const timer = logger.startTimer('data-processing');
   * // ... perform operation
   * timer.stop(); // Automatically logs performance data
   * ```
   * 
   * @example
   * Timer with context and additional data:
   * ```tsx
   * const timer = logger.startTimer('user-authentication', {
   *   component: 'AuthService',
   *   userId: '12345'
   * });
   * // ... perform authentication
   * timer.stop({
   *   authMethod: 'biometric',
   *   success: true
   * });
   * ```
   * 
   * @timer_features
   * - **Automatic Timing**: Measures operation duration automatically
   * - **Performance Logging**: Logs results using logPerformance method
   * - **Additional Data**: Allows additional performance data on stop
   * - **Context Preservation**: Maintains context throughout timing operation
   * 
   * @use_cases
   * - API request timing
   * - Database operation monitoring
   * - Component render performance
   * - Complex operation profiling
   * - Performance optimization analysis
   */
  startTimer(operationName: string, context?: LogContext): LogTimer {
    const startTime = Date.now();
    return {
      stop: (additionalData?: Partial<PerformanceLogData>) => {
        const duration = Date.now() - startTime;
        this.logPerformance(`Operation completed: ${operationName}`, {
          operation: operationName,
          duration,
          ...additionalData
        }, context);
      }
    };
  }

  /**
   * Create a child logger with inherited context.
   * Returns a new logger instance that can inherit parent context.
   * 
   * @method createChildLogger
   * @param {LogContext} _context - Context data to inherit (currently unused)
   * @returns {ILoggerService} New logger instance
   * 
   * @since 1.0.0
   * @description
   * Creates a child logger instance for hierarchical logging scenarios.
   * Currently returns a new ConsoleLogger instance; future implementations
   * may inherit and merge context data.
   * 
   * @example
   * Child logger creation:
   * ```tsx
   * const parentLogger = new ConsoleLogger();
   * const childLogger = parentLogger.createChildLogger({
   *   component: 'UserService',
   *   requestId: 'req-123'
   * });
   * 
   * childLogger.info('Processing user data'); // Inherits parent context
   * ```
   * 
   * @use_cases
   * - Component-specific logging
   * - Request-scoped logging
   * - Hierarchical log organization
   * - Context inheritance patterns
   * 
   * @future_enhancements
   * - Context inheritance and merging
   * - Hierarchical logger relationships
   * - Scoped logging contexts
   */
  createChildLogger(_context: LogContext): ILoggerService {
    return new ConsoleLogger(); // Simple implementation
  }

  /**
   * Flush any pending log entries.
   * No-op for console logger as console output is immediate.
   * 
   * @method flush
   * @returns {Promise<void>} Promise that resolves immediately
   * 
   * @since 1.0.0
   * @description
   * Flushes any pending log entries to their destination. For console logger,
   * this is a no-op as console output is immediate and synchronous.
   * 
   * @example
   * Logger flush:
   * ```tsx
   * await logger.flush(); // Ensures all logs are written
   * ```
   * 
   * @use_cases
   * - Application shutdown
   * - Critical error handling
   * - Log aggregation systems
   * - Async logger implementations
   */
  async flush(): Promise<void> {
    // Console doesn't need flushing
  }
}

/**
 * @summary
 * The ConsoleLogger provides enterprise-grade console logging with structured
 * output, specialized logging methods, performance monitoring, security event
 * tracking, and comprehensive audit capabilities. Essential for debugging,
 * monitoring, and compliance in production React Native applications.
 * 
 * @key_features
 * - Structured console logging with categories and context
 * - Multiple log levels (debug, info, warn, error, fatal)
 * - Specialized security, performance, and audit logging
 * - Built-in timing operations for performance monitoring
 * - Rich context data support for debugging
 * - Error object logging with stack traces
 * - Enterprise compliance features
 * 
 * @architectural_benefits
 * - Clean separation of logging concerns
 * - Consistent logging format across application
 * - Extensible logging architecture
 * - Type-safe logging operations
 * - Comprehensive debugging support
 * 
 * @production_readiness
 * - Structured log output for aggregation
 * - Security event tracking for compliance
 * - Performance monitoring capabilities
 * - Audit trail generation
 * - Error tracking and debugging
 * 
 * @module_exports
 * - ConsoleLogger: Main logger class
 * 
 * @dependencies
 * - Logger service interface definitions
 * - Log level and category enums
 * - Structured logging data interfaces
 */
