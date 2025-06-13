/**
 * Profile Error Handling - React Native 2025 Enterprise Standards
 * 🚀 PHASE 4: APPLICATION LAYER ORCHESTRATION
 * 
 * ✅ ENTERPRISE FEATURES:
 * - Typed Error Classes mit Kategorisierung
 * - Error Recovery Strategies
 * - Logging Integration
 * - User-friendly Error Messages
 * - Error Analytics & Monitoring
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('ProfileErrors');

// ==========================================
// 🎯 ERROR TYPES & CATEGORIES
// ==========================================

export enum ProfileErrorCode {
  // Validation Errors
  INVALID_USER_ID = 'PROFILE_INVALID_USER_ID',
  INVALID_EMAIL = 'PROFILE_INVALID_EMAIL',
  INVALID_PHONE = 'PROFILE_INVALID_PHONE', 
  INVALID_WEBSITE = 'PROFILE_INVALID_WEBSITE',
  REQUIRED_FIELD_MISSING = 'PROFILE_REQUIRED_FIELD_MISSING',
  
  // Business Logic Errors
  PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND',
  PROFILE_ALREADY_EXISTS = 'PROFILE_ALREADY_EXISTS',
  PERMISSION_DENIED = 'PROFILE_PERMISSION_DENIED',
  PROFILE_LOCKED = 'PROFILE_LOCKED',
  
  // System Errors
  DATABASE_ERROR = 'PROFILE_DATABASE_ERROR',
  NETWORK_ERROR = 'PROFILE_NETWORK_ERROR',
  SERVICE_UNAVAILABLE = 'PROFILE_SERVICE_UNAVAILABLE',
  TIMEOUT_ERROR = 'PROFILE_TIMEOUT_ERROR',
  
  // Privacy & Security
  PRIVACY_VIOLATION = 'PROFILE_PRIVACY_VIOLATION',
  GDPR_COMPLIANCE_ERROR = 'PROFILE_GDPR_COMPLIANCE_ERROR',
  SECURITY_VALIDATION_FAILED = 'PROFILE_SECURITY_VALIDATION_FAILED',
}

export enum ProfileErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ProfileErrorCategory {
  VALIDATION = 'validation',
  BUSINESS = 'business',
  SYSTEM = 'system',
  SECURITY = 'security'
}

// ==========================================
// 🏗️ BASE PROFILE ERROR CLASS
// ==========================================

export abstract class ProfileError extends Error {
  public readonly code: ProfileErrorCode;
  public readonly severity: ProfileErrorSeverity;
  public readonly category: ProfileErrorCategory;
  public readonly timestamp: Date;
  public readonly correlationId: string;
  public readonly metadata: Record<string, any>;
  public readonly userMessage: string;
  public readonly isRetryable: boolean;

  constructor(
    code: ProfileErrorCode,
    message: string,
    userMessage: string,
    severity: ProfileErrorSeverity,
    category: ProfileErrorCategory,
    isRetryable: boolean = false,
    metadata: Record<string, any> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.category = category;
    this.timestamp = new Date();
    this.correlationId = `profile-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.metadata = metadata;
    this.userMessage = userMessage;
    this.isRetryable = isRetryable;

    // Log error automatically
    this.logError();
  }

  private logError(): void {
    const logData = {
      metadata: {
        code: this.code,
        severity: this.severity,
        category: this.category,
        correlationId: this.correlationId,
        isRetryable: this.isRetryable,
        ...this.metadata
      }
    };

    switch (this.severity) {
      case ProfileErrorSeverity.CRITICAL:
        logger.error(this.message, LogCategory.BUSINESS, logData, this);
        break;
      case ProfileErrorSeverity.HIGH:
        logger.error(this.message, LogCategory.BUSINESS, logData, this);
        break;
      case ProfileErrorSeverity.MEDIUM:
        logger.warn(this.message, LogCategory.BUSINESS, logData);
        break;
      case ProfileErrorSeverity.LOW:
        logger.info(this.message, LogCategory.BUSINESS, logData);
        break;
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      severity: this.severity,
      category: this.category,
      timestamp: this.timestamp.toISOString(),
      correlationId: this.correlationId,
      metadata: this.metadata,
      isRetryable: this.isRetryable,
      stack: this.stack
    };
  }
}

// ==========================================
// 🎯 SPECIFIC ERROR CLASSES
// ==========================================

/**
 * 🔍 VALIDATION ERRORS
 */
export class ProfileValidationError extends ProfileError {
  constructor(field: string, value: any, reason: string, metadata: Record<string, any> = {}) {
    super(
      ProfileErrorCode.REQUIRED_FIELD_MISSING,
      `Validation failed for field '${field}': ${reason}`,
      `Bitte überprüfen Sie das Feld '${field}': ${reason}`,
      ProfileErrorSeverity.MEDIUM,
      ProfileErrorCategory.VALIDATION,
      false,
      { field, value, reason, ...metadata }
    );
  }
}

export class ProfileNotFoundError extends ProfileError {
  constructor(userId: string, metadata: Record<string, any> = {}) {
    super(
      ProfileErrorCode.PROFILE_NOT_FOUND,
      `Profile not found for user: ${userId}`,
      'Das angeforderte Profil wurde nicht gefunden.',
      ProfileErrorSeverity.MEDIUM,
      ProfileErrorCategory.BUSINESS,
      false,
      { userId, ...metadata }
    );
  }
}

export class ProfilePermissionError extends ProfileError {
  constructor(userId: string, operation: string, metadata: Record<string, any> = {}) {
    super(
      ProfileErrorCode.PERMISSION_DENIED,
      `Permission denied for user ${userId} to perform operation: ${operation}`,
      'Sie haben keine Berechtigung für diese Aktion.',
      ProfileErrorSeverity.HIGH,
      ProfileErrorCategory.SECURITY,
      false,
      { userId, operation, ...metadata }
    );
  }
}

/**
 * 🛠️ SYSTEM ERRORS
 */
export class ProfileDatabaseError extends ProfileError {
  constructor(operation: string, originalError: Error, metadata: Record<string, any> = {}) {
    super(
      ProfileErrorCode.DATABASE_ERROR,
      `Database error during ${operation}: ${originalError.message}`,
      'Ein Datenbankfehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      ProfileErrorSeverity.HIGH,
      ProfileErrorCategory.SYSTEM,
      true,
      { operation, originalError: originalError.message, ...metadata }
    );
  }
}

export class ProfileNetworkError extends ProfileError {
  constructor(operation: string, metadata: Record<string, any> = {}) {
    super(
      ProfileErrorCode.NETWORK_ERROR,
      `Network error during ${operation}`,
      'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
      ProfileErrorSeverity.MEDIUM,
      ProfileErrorCategory.SYSTEM,
      true,
      { operation, ...metadata }
    );
  }
}

/**
 * 🔐 SECURITY ERRORS
 */
export class ProfileSecurityError extends ProfileError {
  constructor(violation: string, userId: string, metadata: Record<string, any> = {}) {
    super(
      ProfileErrorCode.SECURITY_VALIDATION_FAILED,
      `Security validation failed: ${violation}`,
      'Sicherheitsvalidierung fehlgeschlagen.',
      ProfileErrorSeverity.CRITICAL,
      ProfileErrorCategory.SECURITY,
      false,
      { violation, userId, ...metadata }
    );
  }
}

// ==========================================
// 🛠️ ERROR HANDLING UTILITIES
// ==========================================

/**
 * 🎯 ERROR FACTORY
 * Creates appropriate error types based on error conditions
 */
export class ProfileErrorFactory {
  static createValidationError(field: string, value: any, reason: string): ProfileValidationError {
    return new ProfileValidationError(field, value, reason);
  }

  static createNotFoundError(userId: string): ProfileNotFoundError {
    return new ProfileNotFoundError(userId);
  }

  static createPermissionError(userId: string, operation: string): ProfilePermissionError {
    return new ProfilePermissionError(userId, operation);
  }

  static createDatabaseError(operation: string, originalError: Error): ProfileDatabaseError {
    return new ProfileDatabaseError(operation, originalError);
  }

  static createNetworkError(operation: string): ProfileNetworkError {
    return new ProfileNetworkError(operation);
  }

  static createSecurityError(violation: string, userId: string): ProfileSecurityError {
    return new ProfileSecurityError(violation, userId);
  }

  /**
   * 🔄 CONVERT UNKNOWN ERROR TO PROFILE ERROR
   */
  static fromUnknownError(error: unknown, operation: string, userId?: string): ProfileError {
    if (error instanceof ProfileError) {
      return error;
    }

    if (error instanceof Error) {
      // Check error message patterns to determine type
      const message = error.message.toLowerCase();
      
      if (message.includes('network') || message.includes('fetch')) {
        return new ProfileNetworkError(operation, { originalError: error.message, userId });
      }
      
      if (message.includes('permission') || message.includes('unauthorized')) {
        return new ProfilePermissionError(userId || 'unknown', operation);
      }
      
      if (message.includes('not found') || message.includes('404')) {
        return new ProfileNotFoundError(userId || 'unknown');
      }
      
      // Default to database error for other Error instances
      return new ProfileDatabaseError(operation, error, { userId });
    }

    // Unknown error type - create generic system error
    return new ProfileDatabaseError(
      operation,
      new Error(`Unknown error: ${String(error)}`),
      { userId, originalError: error }
    );
  }
}

/**
 * 🚀 ERROR RECOVERY STRATEGIES
 */
export class ProfileErrorRecovery {
  /**
   * 🔄 DETERMINE IF ERROR IS RETRYABLE
   */
  static isRetryable(error: ProfileError): boolean {
    return error.isRetryable;
  }

  /**
   * ⏱️ GET RETRY DELAY (EXPONENTIAL BACKOFF)
   */
  static getRetryDelay(attemptNumber: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attemptNumber), maxDelay);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    return delay + jitter;
  }

  /**
   * 🎯 GET USER-FRIENDLY ERROR MESSAGE
   */
  static getUserMessage(error: ProfileError): string {
    return error.userMessage;
  }

  /**
   * 📊 GET ERROR ANALYTICS DATA
   */
  static getAnalyticsData(error: ProfileError) {
    return {
      errorCode: error.code,
      severity: error.severity,
      category: error.category,
      correlationId: error.correlationId,
      timestamp: error.timestamp.toISOString(),
      isRetryable: error.isRetryable,
      metadata: error.metadata
    };
  }
}

/**
 * 🎯 ERROR HANDLER DECORATOR
 * Wraps functions mit automatic error handling
 */
export function handleProfileErrors(operation: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        const profileError = ProfileErrorFactory.fromUnknownError(error, operation);
        throw profileError;
      }
    };

    return descriptor;
  };
} 