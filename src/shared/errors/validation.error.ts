import {AppError, ErrorSeverity, ErrorCategory, type ErrorDetails} from './app.error';

/**
 * Error thrown when input validation fails.
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', cause?: unknown) {
    const errorDetails: ErrorDetails = {
      code: 'VALIDATION_FAILED_001',
      message: message,
      description: 'Input validation failed',
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.VALIDATION,
      retryable: true,
      cause: cause instanceof Error ? cause : undefined,
      context: {
        feature: 'validation',
        action: 'input_validation'
      },
      suggestions: ['Please check your input and try again']
    };
    
    super(errorDetails);
    // Note: this.name is automatically set by AppError base class
  }
}
