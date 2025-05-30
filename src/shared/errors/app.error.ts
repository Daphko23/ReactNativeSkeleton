/**
 * @fileoverview SHARED-ERROR-001: Base Application Error
 * @description Enterprise-grade Basis-Error-Klasse für die gesamte Anwendung
 * 
 * @businessRule BR-800: Standardized error handling across the application
 * @businessRule BR-801: Error categorization and severity levels
 * @businessRule BR-802: Proper error logging and monitoring integration
 * @businessRule BR-803: User-friendly error messages with localization support
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AppError
 * @namespace Shared.Errors
 */

/**
 * @enum ErrorSeverity
 * @description Error severity levels for monitoring and alerting
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * @enum ErrorCategory
 * @description Error categories for classification and handling
 */
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NETWORK = 'network',
  DATABASE = 'database',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  EXTERNAL_SERVICE = 'external_service',
  USER_INPUT = 'user_input',
  CONFIGURATION = 'configuration'
}

/**
 * @interface ErrorContext
 * @description Additional context information for errors
 */
export interface ErrorContext {
  /** User ID when error occurred */
  userId?: string;
  
  /** Request ID for tracing */
  requestId?: string;
  
  /** Feature/module where error occurred */
  feature?: string;
  
  /** Action being performed */
  action?: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
  
  /** Stack trace information */
  stackTrace?: string;
  
  /** Timestamp when error occurred */
  timestamp?: Date;
  
  /** User agent/device information */
  userAgent?: string;
  
  /** IP address (if available) */
  ipAddress?: string;
}

/**
 * @interface ErrorDetails
 * @description Detailed error information for logging and debugging
 */
export interface ErrorDetails {
  /** Technical error code */
  code: string;
  
  /** User-friendly message */
  message: string;
  
  /** Detailed technical description */
  description?: string;
  
  /** Error severity level */
  severity: ErrorSeverity;
  
  /** Error category */
  category: ErrorCategory;
  
  /** Whether error should be retryable */
  retryable: boolean;
  
  /** Additional context */
  context?: ErrorContext;
  
  /** Related errors or causes */
  cause?: Error;
  
  /** Recovery suggestions */
  suggestions?: string[];
}

/**
 * @class AppError
 * @description Enterprise-grade base error class with comprehensive error handling
 * 
 * Features:
 * - Structured error information
 * - Severity and category classification
 * - Context tracking for debugging
 * - User-friendly message handling
 * - Monitoring integration support
 * - Retry logic support
 * 
 * @example Basic error usage
 * ```typescript
 * throw new AppError({
 *   code: 'AUTH_001',
 *   message: 'Invalid credentials provided',
 *   description: 'User authentication failed due to incorrect email or password',
 *   severity: ErrorSeverity.MEDIUM,
 *   category: ErrorCategory.AUTHENTICATION,
 *   retryable: false,
 *   context: {
 *     userId: 'user-123',
 *     action: 'login',
 *     feature: 'auth'
 *   }
 * });
 * ```
 * 
 * @example Error with cause chain
 * ```typescript
 * try {
 *   await databaseOperation();
 * } catch (originalError) {
 *   throw new AppError({
 *     code: 'DB_001',
 *     message: 'Database operation failed',
 *     severity: ErrorSeverity.HIGH,
 *     category: ErrorCategory.DATABASE,
 *     retryable: true,
 *     cause: originalError,
 *     suggestions: ['Check database connection', 'Retry after delay']
 *   });
 * }
 * ```
 */
export class AppError extends Error {
  /** Technical error code */
  public readonly code: string;
  
  /** Error severity level */
  public readonly severity: ErrorSeverity;
  
  /** Error category */
  public readonly category: ErrorCategory;
  
  /** Whether error should be retryable */
  public readonly retryable: boolean;
  
  /** Additional context information */
  public readonly context?: ErrorContext;
  
  /** Original error that caused this error */
  public readonly cause?: Error;
  
  /** Recovery suggestions */
  public readonly suggestions?: string[];
  
  /** Detailed technical description */
  public readonly description?: string;
  
  /** Timestamp when error was created */
  public readonly timestamp: Date;
  
  /** Unique error instance ID */
  public readonly errorId: string;

  constructor(details: ErrorDetails) {
    super(details.message);
    
    // Set error name and ensure proper prototype chain
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    
    // Set error properties
    this.code = details.code;
    this.severity = details.severity;
    this.category = details.category;
    this.retryable = details.retryable;
    this.context = details.context;
    this.cause = details.cause;
    this.suggestions = details.suggestions;
    this.description = details.description;
    this.timestamp = new Date();
    this.errorId = this.generateErrorId();
    
    // Enhance context with additional information
    if (this.context) {
      this.context.timestamp = this.timestamp;
      this.context.stackTrace = this.stack;
    }
    
    // Capture stack trace (Node.js/V8 specific)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Generates unique error ID for tracking
   */
  private generateErrorId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${this.code}_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Converts error to JSON for logging/serialization
   */
  public toJSON(): Record<string, any> {
    return {
      errorId: this.errorId,
      name: this.name,
      code: this.code,
      message: this.message,
      description: this.description,
      severity: this.severity,
      category: this.category,
      retryable: this.retryable,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      suggestions: this.suggestions,
      stack: this.stack,
      cause: this.cause ? {
        name: this.cause.name,
        message: this.cause.message,
        stack: this.cause.stack
      } : undefined
    };
  }

  /**
   * Gets user-friendly error message
   */
  public getUserMessage(): string {
    return this.message;
  }

  /**
   * Gets technical error details
   */
  public getTechnicalDetails(): string {
    return this.description || this.message;
  }

  /**
   * Checks if error is retryable
   */
  public isRetryable(): boolean {
    return this.retryable;
  }

  /**
   * Gets error severity level
   */
  public getSeverity(): ErrorSeverity {
    return this.severity;
  }

  /**
   * Gets error category
   */
  public getCategory(): ErrorCategory {
    return this.category;
  }

  /**
   * Gets recovery suggestions
   */
  public getSuggestions(): string[] {
    return this.suggestions || [];
  }

  /**
   * Creates a child error with additional context
   */
  public withContext(additionalContext: Partial<ErrorContext>): AppError {
    return new AppError({
      code: this.code,
      message: this.message,
      description: this.description,
      severity: this.severity,
      category: this.category,
      retryable: this.retryable,
      context: {
        ...this.context,
        ...additionalContext
      },
      cause: this.cause,
      suggestions: this.suggestions
    });
  }

  /**
   * Creates an error from an unknown error object
   */
  public static fromUnknown(
    error: unknown,
    defaultCode: string = 'UNKNOWN_ERROR',
    defaultCategory: ErrorCategory = ErrorCategory.SYSTEM
  ): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError({
        code: defaultCode,
        message: error.message,
        description: `Unexpected error: ${error.name}`,
        severity: ErrorSeverity.MEDIUM,
        category: defaultCategory,
        retryable: false,
        cause: error
      });
    }

    return new AppError({
      code: defaultCode,
      message: 'An unexpected error occurred',
      description: `Unknown error type: ${typeof error}`,
      severity: ErrorSeverity.MEDIUM,
      category: defaultCategory,
      retryable: false,
      context: {
        metadata: { originalError: error }
      }
    });
  }
}

/**
 * @function isAppError
 * @description Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * @function createAppError
 * @description Factory function to create AppError instances
 */
export function createAppError(details: ErrorDetails): AppError {
  return new AppError(details);
}