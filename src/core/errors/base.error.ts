/**
 * @fileoverview BASE-ERROR: Enterprise Base Error Class Implementation
 * @description Grundlegende Error-Klasse für das gesamte System mit umfassenden
 * Error Context, Stack Trace Management und Recovery Strategies.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module BaseError
 * @namespace Core.Errors
 */

/**
 * @type ErrorCategory
 * @description Kategorien für Error-Klassifizierung
 */
export type ErrorCategory = 
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND_ERROR' 
  | 'AUTHORIZATION_ERROR'
  | 'BACKUP_ERROR'
  | 'SERVICE_ERROR'
  | 'CLEANUP_ERROR'
  | 'NOTIFICATION_ERROR'
  | 'AUDIT_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'BUSINESS_ERROR'
  | 'SYSTEM_ERROR';

/**
 * @interface ErrorContext
 * @description Zusätzlicher Kontext für Error-Details
 */
export interface ErrorContext {
  timestamp: Date;
  correlationId?: string;
  userId?: string;
  operation?: string;
  metadata?: Record<string, any>;
}

/**
 * @class BaseError
 * @description Enterprise Base Error Class
 * 
 * Zentrale Error-Klasse die von allen spezifischen Error-Typen erweitert wird.
 * Bietet einheitliches Error Handling mit strukturierten Error-Informationen,
 * Correlation IDs für Tracing und Recovery-Strategien.
 */
export class BaseError extends Error {
  public readonly code: string;
  public readonly details?: string;
  public readonly category: ErrorCategory;
  public readonly context: ErrorContext;
  public readonly isOperational: boolean = true;

  /**
   * Konstruktor für BaseError
   * 
   * @param code - Eindeutiger Error-Code
   * @param message - Human-readable Error-Message
   * @param details - Zusätzliche Error-Details
   * @param category - Error-Kategorie für Klassifizierung
   * @param context - Zusätzlicher Error-Kontext
   */
  constructor(
    code: string,
    message: string,
    details?: string,
    category: ErrorCategory = 'SYSTEM_ERROR',
    context?: Partial<ErrorContext>
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    this.category = category;
    this.context = {
      timestamp: new Date(),
      ...context
    };

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializes error to JSON for logging/reporting
   * 
   * @returns Serialized error object
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      category: this.category,
      context: this.context,
      stack: this.stack,
      isOperational: this.isOperational
    };
  }

  /**
   * Creates a user-friendly error message
   * 
   * @returns User-friendly error message
   */
  getUserMessage(): string {
    // Override in specific error classes for user-facing messages
    return this.message;
  }

  /**
   * Checks if error is recoverable
   * 
   * @returns Whether error recovery is possible
   */
  isRecoverable(): boolean {
    // Most errors are recoverable unless specified otherwise
    return this.isOperational;
  }
} 