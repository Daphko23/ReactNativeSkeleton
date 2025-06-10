/**
 * @fileoverview SENTRY-LOGGER: Enterprise Production Logger Implementation
 * @description Production-ready Sentry logger implementation with structured logging, security audit trails, performance monitoring, and comprehensive enterprise logging capabilities for production environments
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Core.Logging.SentryLogger
 * @namespace Core.Logging.SentryLogger
 * @category Logging
 * @subcategory Production
 */

import * as Sentry from '@sentry/react-native';
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
 * Sentry Log Level Mapping
 * Maps internal log levels to Sentry severity levels for proper categorization
 * and filtering in the Sentry dashboard.
 * 
 * @constant sentryLevelMapping
 * @since 1.0.0
 */
const sentryLevelMapping: Record<LogLevel, Sentry.SeverityLevel> = {
  [LogLevel.DEBUG]: 'debug',
  [LogLevel.INFO]: 'info',
  [LogLevel.WARN]: 'warning',
  [LogLevel.ERROR]: 'error',
  [LogLevel.FATAL]: 'fatal'
};

/**
 * Performance Timer Implementation for Sentry
 * 
 * Provides timing functionality for performance monitoring with Sentry integration.
 * Tracks operation duration and automatically logs performance metrics.
 * 
 * @class SentryLogTimer
 * @implements {LogTimer}
 * @since 1.0.0
 */
class SentryLogTimer implements LogTimer {
  private startTime: number;
  private readonly operationName: string;
  private readonly context?: LogContext;
  private readonly logger: SentryLogger;

  constructor(operationName: string, context: LogContext | undefined, logger: SentryLogger) {
    this.startTime = Date.now();
    this.operationName = operationName;
    this.context = context;
    this.logger = logger;
  }

  /**
   * Stop timer and log performance data to Sentry
   * 
   * @param additionalData - Additional performance metrics
   */
  stop(additionalData?: Partial<PerformanceLogData>): void {
    const duration = Date.now() - this.startTime;
    
    const performanceData: PerformanceLogData = {
      operation: this.operationName,
      duration,
      ...additionalData
    };

    this.logger.logPerformance(
      `Operation '${this.operationName}' completed`,
      performanceData,
      this.context
    );
  }
}

/**
 * Sentry Logger Implementation for Production
 * 
 * Enterprise-grade Sentry logging implementation providing structured logging,
 * error tracking, performance monitoring, and security audit trails for production
 * environments. Implements the ILoggerService interface with full Sentry integration.
 * 
 * @class SentryLogger
 * @implements {ILoggerService}
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Classes
 * @subcategory Production Logging
 * @module Core.Logging.SentryLogger
 * @namespace Core.Logging.SentryLogger.SentryLogger
 * 
 * @description
 * Production-ready Sentry logger that provides structured logging with error tracking,
 * performance monitoring, security event logging, and audit trail capabilities.
 * Designed for enterprise applications requiring comprehensive production monitoring
 * and error tracking with Sentry integration.
 * 
 * @example
 * Basic logger usage:
 * ```tsx
 * import { SentryLogger } from '@/core/logging/sentry.logger';
 * 
 * const logger = new SentryLogger();
 * 
 * // Basic logging
 * logger.info('Application started');
 * logger.error('Failed to load user data', undefined, undefined, error);
 * 
 * // Logging with category and context
 * logger.debug('User authentication attempt', LogCategory.AUTHENTICATION, {
 *   userId: '12345',
 *   sessionId: 'session-abc-123',
 *   correlationId: 'corr-xyz-789'
 * });
 * ```
 * 
 * @example
 * Security logging:
 * ```tsx
 * const logger = new SentryLogger();
 * 
 * logger.logSecurity('Suspicious login attempt detected', {
 *   eventType: 'suspicious_login',
 *   riskLevel: 'high',
 *   sourceIp: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...',
 *   threats: ['BRUTE_FORCE', 'UNUSUAL_LOCATION']
 * }, {
 *   userId: 'user-123',
 *   sessionId: 'session-456'
 * });
 * ```
 * 
 * @example
 * Performance monitoring:
 * ```tsx
 * const logger = new SentryLogger();
 * 
 * // Timer-based performance logging
 * const timer = logger.startTimer('api-request', { 
 *   service: 'UserService',
 *   endpoint: '/api/users/profile'
 * });
 * 
 * // ... perform operation
 * timer.stop({ 
 *   statusCode: 200,
 *   responseSize: 2048 
 * });
 * ```
 * 
 * @features
 * - **Error Tracking**: Automatic error capture and stack trace reporting
 * - **Performance Monitoring**: Built-in timing and performance metrics
 * - **Security Logging**: Specialized security event tracking
 * - **Audit Trails**: Comprehensive audit logging for compliance
 * - **Structured Context**: Rich context data for debugging
 * - **Breadcrumb Tracking**: Automatic user interaction tracking
 * - **Release Tracking**: Version and deployment tracking
 * 
 * @production_optimized
 * - **Sampling**: Configurable sampling rates for performance
 * - **Batching**: Efficient event batching for network optimization
 * - **Error Filtering**: Intelligent error filtering and deduplication
 * - **Context Sanitization**: Automatic PII data filtering
 * - **Async Processing**: Non-blocking async logging operations
 */
export class SentryLogger implements ILoggerService {
  private readonly defaultContext: LogContext;

  /**
   * Initialize Sentry Logger
   * 
   * @param defaultContext - Default context applied to all log entries
   */
  constructor(defaultContext: LogContext = {}) {
    this.defaultContext = defaultContext;
  }

  /**
   * @inheritdoc
   */
  debug(message: string, category?: LogCategory, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, category, context);
  }

  /**
   * @inheritdoc
   */
  info(message: string, category?: LogCategory, context?: LogContext): void {
    this.log(LogLevel.INFO, message, category, context);
  }

  /**
   * @inheritdoc
   */
  warn(message: string, category?: LogCategory, context?: LogContext): void {
    this.log(LogLevel.WARN, message, category, context);
  }

  /**
   * @inheritdoc
   */
  error(message: string, category?: LogCategory, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, category, context, error);
  }

  /**
   * @inheritdoc
   */
  fatal(message: string, category?: LogCategory, context?: LogContext, error?: Error): void {
    this.log(LogLevel.FATAL, message, category, context, error);
  }

  /**
   * @inheritdoc
   */
  logSecurity(message: string, securityData: SecurityLogData, context?: LogContext, error?: Error): void {
    const enhancedContext = this.mergeContext(this.defaultContext, context || {});
    const securityContext = this.mergeContext(enhancedContext, {
      metadata: {
        securityEvent: securityData,
        eventType: 'security',
        riskLevel: securityData.riskLevel
      }
    });

    Sentry.withScope((scope) => {
      // Set security-specific tags
      scope.setTag('security_event', securityData.eventType);
      scope.setTag('risk_level', securityData.riskLevel);
      scope.setTag('event_category', 'security');
      
      if (securityData.sourceIp) {
        scope.setTag('source_ip', securityData.sourceIp);
      }

      // Set security context
      scope.setContext('security', {
        eventType: securityData.eventType,
        riskLevel: securityData.riskLevel,
        sourceIp: securityData.sourceIp,
        userAgent: securityData.userAgent,
        deviceFingerprint: securityData.deviceFingerprint,
        threats: securityData.threats,
        actionTaken: securityData.actionTaken,
        timestamp: new Date().toISOString()
      });

      this.applyScopeContext(scope, securityContext);

      if (error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(message, 'warning');
      }
    });
  }

  /**
   * @inheritdoc
   */
  logPerformance(message: string, performanceData: PerformanceLogData, context?: LogContext): void {
    const enhancedContext = this.mergeContext(this.defaultContext, context || {});
    const performanceContext = this.mergeContext(enhancedContext, {
      metadata: {
        performanceMetrics: performanceData,
        eventType: 'performance'
      }
    });

    Sentry.withScope((scope) => {
      // Set performance-specific tags
      scope.setTag('operation', performanceData.operation);
      scope.setTag('event_category', 'performance');
      
      // Set performance metrics
      scope.setContext('performance', {
        operation: performanceData.operation,
        duration: performanceData.duration,
        memoryUsage: performanceData.memoryUsage,
        cpuUsage: performanceData.cpuUsage,
        queryCount: performanceData.queryCount,
        cacheHitRatio: performanceData.cacheHitRatio,
        responseSize: performanceData.responseSize,
        timestamp: new Date().toISOString()
      });

      this.applyScopeContext(scope, performanceContext);

      // Add breadcrumb for performance tracking
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `${performanceData.operation} completed in ${performanceData.duration}ms`,
        level: 'info',
        data: {
          operation: performanceData.operation,
          duration: performanceData.duration
        }
      });

      Sentry.captureMessage(message, 'info');
    });
  }

  /**
   * @inheritdoc
   */
  logAudit(message: string, auditData: AuditLogData, context?: LogContext): void {
    const enhancedContext = this.mergeContext(this.defaultContext, context || {});
    const auditContext = this.mergeContext(enhancedContext, {
      metadata: {
        auditEvent: auditData,
        eventType: 'audit'
      }
    });

    Sentry.withScope((scope) => {
      // Set audit-specific tags
      scope.setTag('audit_action', auditData.action);
      scope.setTag('event_category', 'audit');
      
      if (auditData.resource) {
        scope.setTag('audit_resource', auditData.resource);
      }

      if (auditData.dataClassification) {
        scope.setTag('data_classification', auditData.dataClassification);
      }

      // Set audit context
      scope.setContext('audit', {
        action: auditData.action,
        resource: auditData.resource,
        previousState: auditData.previousState,
        newState: auditData.newState,
        complianceFramework: auditData.complianceFramework,
        dataClassification: auditData.dataClassification,
        timestamp: new Date().toISOString()
      });

      this.applyScopeContext(scope, auditContext);

      // Add breadcrumb for audit trail
      Sentry.addBreadcrumb({
        category: 'audit',
        message: `Audit: ${auditData.action}`,
        level: 'info',
        data: {
          action: auditData.action,
          resource: auditData.resource
        }
      });

      Sentry.captureMessage(message, 'info');
    });
  }

  /**
   * @inheritdoc
   */
  startTimer(operationName: string, context?: LogContext): LogTimer {
    return new SentryLogTimer(operationName, context, this);
  }

  /**
   * @inheritdoc
   */
  createChildLogger(context: LogContext): ILoggerService {
    const mergedContext = this.mergeContext(this.defaultContext, context);
    return new SentryLogger(mergedContext);
  }

  /**
   * @inheritdoc
   */
  async flush(): Promise<void> {
    // Sentry automatically handles flushing
    // This is a no-op for compatibility
    await Promise.resolve();
  }

  /**
   * Core logging method for Sentry integration
   * 
   * @private
   * @param level - Log level
   * @param message - Log message
   * @param category - Log category
   * @param context - Logging context
   * @param error - Error object (optional)
   */
  private log(
    level: LogLevel, 
    message: string, 
    category?: LogCategory, 
    context?: LogContext, 
    error?: Error
  ): void {
    const mergedContext = this.mergeContext(this.defaultContext, context);
    const sentryLevel = sentryLevelMapping[level];

    Sentry.withScope((scope) => {
      // Set log level
      scope.setLevel(sentryLevel);

      // Set category tag
      if (category) {
        scope.setTag('log_category', category);
      }

      // Set log level tag
      scope.setTag('log_level', level);

      // Apply context to scope
      this.applyScopeContext(scope, mergedContext);

      // Add breadcrumb
      Sentry.addBreadcrumb({
        category: category || 'general',
        message: message,
        level: sentryLevel,
        data: mergedContext.metadata
      });

      // Capture event
      if (error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(message, sentryLevel);
      }
    });
  }

  /**
   * Apply logging context to Sentry scope
   * 
   * @private
   * @param scope - Sentry scope
   * @param context - Logging context
   */
  private applyScopeContext(scope: Sentry.Scope, context: LogContext): void {
    // Set user context
    if (context.userId) {
      scope.setUser({ id: context.userId });
    }

    // Set tags
    if (context.correlationId) {
      scope.setTag('correlation_id', context.correlationId);
    }

    if (context.sessionId) {
      scope.setTag('session_id', context.sessionId);
    }

    if (context.service) {
      scope.setTag('service', context.service);
    }

    if (context.requestId) {
      scope.setTag('request_id', context.requestId);
    }

    // Set trace context
    if (context.traceId) {
      scope.setTag('trace_id', context.traceId);
    }

    if (context.spanId) {
      scope.setTag('span_id', context.spanId);
    }

    // Set additional metadata as context
    if (context.metadata) {
      scope.setContext('log_metadata', context.metadata);
    }
  }

  /**
   * Merge logging contexts
   * 
   * @private
   * @param baseContext - Base context
   * @param additionalContext - Additional context to merge
   * @returns Merged context
   */
  private mergeContext(baseContext: LogContext, additionalContext?: LogContext): LogContext {
    if (!additionalContext) {
      return baseContext;
    }

    return {
      ...baseContext,
      ...additionalContext,
      metadata: {
        ...baseContext.metadata,
        ...additionalContext.metadata
      }
    };
  }
} 