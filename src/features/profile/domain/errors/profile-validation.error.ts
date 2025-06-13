/**
 * Profile Validation Error - React Native 2025 Enterprise Standards
 * Custom error für Profile Validation Business Logic
 */

export class ProfileValidationError extends Error {
  public readonly code: string;
  public readonly field?: string;
  public readonly context?: Record<string, any>;

  constructor(
    code: string, 
    message: string, 
    field?: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ProfileValidationError';
    this.code = code;
    this.field = field;
    this.context = context;

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProfileValidationError);
    }
  }

  /**
   * Create validation error for missing required field
   */
  static missingRequired(field: string): ProfileValidationError {
    return new ProfileValidationError(
      'FIELD_REQUIRED',
      `${field} is required`,
      field
    );
  }

  /**
   * Create validation error for invalid format
   */
  static invalidFormat(field: string, expected: string): ProfileValidationError {
    return new ProfileValidationError(
      'INVALID_FORMAT',
      `${field} has invalid format. Expected: ${expected}`,
      field
    );
  }

  /**
   * Create validation error for business rule violation
   */
  static businessRuleViolation(rule: string, message: string): ProfileValidationError {
    return new ProfileValidationError(
      'BUSINESS_RULE_VIOLATION',
      message,
      undefined,
      { rule }
    );
  }

  /**
   * Convert to JSON for logging/API responses
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      field: this.field,
      context: this.context,
      stack: this.stack
    };
  }
}