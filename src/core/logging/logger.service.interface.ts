/**
 * @fileoverview CORE-INTERFACE-001: Logger Service Interface - Enterprise Standard
 * @description Core Logging Interface für Enterprise-Standard Logging.
 * Definiert strukturiertes Logging mit Observability und Compliance Features.
 * 
 * @businessRule BR-295: Enterprise logging interface definition
 * @businessRule BR-296: Structured logging requirements
 * @businessRule BR-297: Observability and compliance logging
 * @businessRule BR-298: Performance and security logging standards
 * 
 * @architecture Observer pattern for log event handling
 * @architecture Strategy pattern for log destination routing
 * @architecture Factory pattern for logger creation
 * 
 * @observability Structured logging with correlation IDs
 * @observability Distributed tracing integration
 * @observability APM integration support
 * 
 * @compliance Audit logging requirements
 * @compliance GDPR logging compliance
 * @compliance SOC 2 logging standards
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module ILoggerService
 * @namespace Core.Logging
 */

/**
 * @enum LogLevel
 * @description Enterprise logging levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

/**
 * @enum LogCategory
 * @description Log categorization for filtering and routing
 */
export enum LogCategory {
  SECURITY = 'security',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  BUSINESS = 'business',
  PERFORMANCE = 'performance',
  AUDIT = 'audit',
  COMPLIANCE = 'compliance',
  INFRASTRUCTURE = 'infrastructure',
  API = 'api',
  DATABASE = 'database'
}

/**
 * @interface LogContext
 * @description Structured logging context
 */
export interface LogContext {
  /** Correlation ID for request tracing */
  correlationId?: string;
  /** User ID for audit trails */
  userId?: string;
  /** Session ID for session tracking */
  sessionId?: string;
  /** Service name */
  service?: string;
  /** Request ID */
  requestId?: string;
  /** Trace ID for distributed tracing */
  traceId?: string;
  /** Span ID for distributed tracing */
  spanId?: string;
  /** Additional structured data */
  metadata?: Record<string, any>;
}

/**
 * @interface LogEntry
 * @description Complete log entry structure
 */
export interface LogEntry {
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Log category */
  category: LogCategory;
  /** Timestamp (ISO string) */
  timestamp: string;
  /** Logging context */
  context?: LogContext;
  /** Error object (for error logs) */
  error?: Error;
  /** Performance metrics */
  metrics?: {
    duration?: number;
    memoryUsage?: number;
    cpuUsage?: number;
  };
}

/**
 * @interface SecurityLogData
 * @description Security-specific logging data
 */
export interface SecurityLogData {
  /** Security event type */
  eventType: string;
  /** Risk level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Source IP address */
  sourceIp?: string;
  /** User agent */
  userAgent?: string;
  /** Device fingerprint */
  deviceFingerprint?: string;
  /** Threat indicators */
  threats?: string[];
  /** Action taken */
  actionTaken?: string;
}

/**
 * @interface PerformanceLogData
 * @description Performance-specific logging data
 */
export interface PerformanceLogData {
  /** Operation name */
  operation: string;
  /** Duration in milliseconds */
  duration: number;
  /** Memory usage in MB */
  memoryUsage?: number;
  /** CPU usage percentage */
  cpuUsage?: number;
  /** Database query count */
  queryCount?: number;
  /** Cache hit ratio */
  cacheHitRatio?: number;
  /** Response size in bytes */
  responseSize?: number;
}

/**
 * @interface AuditLogData
 * @description Audit-specific logging data
 */
export interface AuditLogData {
  /** Audited action */
  action: string;
  /** Resource affected */
  resource?: string;
  /** Previous state */
  previousState?: any;
  /** New state */
  newState?: any;
  /** Compliance framework */
  complianceFramework?: string[];
  /** Data classification */
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
}

/**
 * @interface ILoggerService
 * @description Enterprise Logger Service Interface
 * 
 * Provides comprehensive logging functionality with enterprise features:
 * - Structured logging with correlation IDs
 * - Security and audit logging
 * - Performance monitoring integration
 * - Compliance and regulatory support
 * - Distributed tracing integration
 * - Multiple destination support
 * 
 * @example Enterprise Logger Usage
 * ```typescript
 * class SecurityService {
 *   constructor(private logger: ILoggerService) {}
 * 
 *   async authenticateUser(credentials: LoginCredentials): Promise<AuthResult> {
 *     const correlationId = generateCorrelationId();
 *     
 *     this.logger.info('User authentication started', LogCategory.AUTHENTICATION, {
 *       correlationId,
 *       userId: credentials.email,
 *       metadata: { attempt: 'login' }
 *     });
 * 
 *     try {
 *       const result = await this.performAuth(credentials);
 *       
 *       this.logger.logSecurity('User authentication successful', {
 *         eventType: 'authentication_success',
 *         riskLevel: 'low',
 *         sourceIp: credentials.ipAddress,
 *         userAgent: credentials.userAgent
 *       }, { correlationId, userId: result.user.id });
 * 
 *       return result;
 *     } catch (error) {
 *       this.logger.logSecurity('User authentication failed', {
 *         eventType: 'authentication_failure',
 *         riskLevel: 'medium',
 *         sourceIp: credentials.ipAddress,
 *         threats: ['credential_stuffing_attempt']
 *       }, { correlationId }, error);
 * 
 *       throw error;
 *     }
 *   }
 * }
 * ```
 */
export interface ILoggerService {
  /**
   * @method debug
   * @description Log debug information
   * 
   * @param message - Debug message
   * @param category - Log category
   * @param context - Logging context
   */
  debug(message: string, category?: LogCategory, context?: LogContext): void;

  /**
   * @method info
   * @description Log informational message
   * 
   * @param message - Info message
   * @param category - Log category
   * @param context - Logging context
   */
  info(message: string, category?: LogCategory, context?: LogContext): void;

  /**
   * @method warn
   * @description Log warning message
   * 
   * @param message - Warning message
   * @param category - Log category
   * @param context - Logging context
   */
  warn(message: string, category?: LogCategory, context?: LogContext): void;

  /**
   * @method error
   * @description Log error message
   * 
   * @param message - Error message
   * @param category - Log category
   * @param context - Logging context
   * @param error - Error object
   */
  error(message: string, category?: LogCategory, context?: LogContext, error?: Error): void;

  /**
   * @method fatal
   * @description Log fatal error message
   * 
   * @param message - Fatal error message
   * @param category - Log category
   * @param context - Logging context
   * @param error - Error object
   */
  fatal(message: string, category?: LogCategory, context?: LogContext, error?: Error): void;

  /**
   * @method logSecurity
   * @description Log security-related events
   * 
   * @param message - Security event message
   * @param securityData - Security-specific data
   * @param context - Logging context
   * @param error - Error object (optional)
   */
  logSecurity(
    message: string,
    securityData: SecurityLogData,
    context?: LogContext,
    error?: Error
  ): void;

  /**
   * @method logPerformance
   * @description Log performance metrics
   * 
   * @param message - Performance event message
   * @param performanceData - Performance-specific data
   * @param context - Logging context
   */
  logPerformance(
    message: string,
    performanceData: PerformanceLogData,
    context?: LogContext
  ): void;

  /**
   * @method logAudit
   * @description Log audit events for compliance
   * 
   * @param message - Audit event message
   * @param auditData - Audit-specific data
   * @param context - Logging context
   */
  logAudit(
    message: string,
    auditData: AuditLogData,
    context?: LogContext
  ): void;

  /**
   * @method startTimer
   * @description Start performance timer
   * 
   * @param operationName - Name of operation being timed
   * @param context - Logging context
   * @returns Timer instance for stopping
   */
  startTimer(operationName: string, context?: LogContext): LogTimer;

  /**
   * @method createChildLogger
   * @description Create child logger with inherited context
   * 
   * @param context - Additional context for child logger
   * @returns Child logger instance
   */
  createChildLogger(context: LogContext): ILoggerService;

  /**
   * @method flush
   * @description Flush all pending log entries
   * 
   * @returns Promise resolving when flush complete
   */
  flush(): Promise<void>;
}

/**
 * @interface LogTimer
 * @description Performance timer interface
 */
export interface LogTimer {
  /**
   * @method stop
   * @description Stop timer and log performance data
   * 
   * @param additionalData - Additional performance data
   */
  stop(additionalData?: Partial<PerformanceLogData>): void;
}

/**
 * @interface ILoggerFactory
 * @description Logger factory interface for dependency injection
 */
export interface ILoggerFactory {
  /**
   * @method createLogger
   * @description Create logger instance
   * 
   * @param service - Service name
   * @param context - Default context
   * @returns Logger instance
   */
  createLogger(service: string, context?: LogContext): ILoggerService;
} 