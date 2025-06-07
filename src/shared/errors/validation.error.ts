/**
 * @fileoverview VALIDATION-ERROR: Input Validation Error Component
 * @description Specialized error class for handling input validation failures with comprehensive error details
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Errors
 * @namespace Shared.Errors.ValidationError
 * @category Errors
 * @subcategory Validation
 */

import {AppError, ErrorSeverity, ErrorCategory, type ErrorDetails} from './app.error';

/**
 * Validation Error Class
 * 
 * Specialized error class designed to handle input validation failures across
 * the application. Provides structured error information with predefined
 * configuration for validation-specific scenarios, including form validation,
 * API input validation, and business rule validation.
 * 
 * @class ValidationError
 * @extends AppError
 * @param {string} message - User-friendly error message
 * @param {unknown} cause - Optional original error that caused this validation error
 * @returns {ValidationError} New validation error instance
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Errors
 * @subcategory Validation
 * @module Shared.Errors
 * @namespace Shared.Errors.ValidationError
 * 
 * @example
 * Basic form validation error:
 * ```tsx
 * import { ValidationError } from '@/shared/errors/validation.error';
 * 
 * const validateEmail = (email: string) => {
 *   if (!email || !email.includes('@')) {
 *     throw new ValidationError('Please enter a valid email address');
 *   }
 * };
 * 
 * try {
 *   validateEmail('invalid-email');
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.log('Validation failed:', error.message);
 *     console.log('Suggestions:', error.getSuggestions());
 *   }
 * }
 * ```
 * 
 * @example
 * Complex form validation with field-specific errors:
 * ```tsx
 * const validateUserRegistration = (userData: UserRegistrationData) => {
 *   const errors: ValidationError[] = [];
 * 
 *   if (!userData.email) {
 *     errors.push(new ValidationError('Email is required'));
 *   }
 * 
 *   if (!userData.password || userData.password.length < 8) {
 *     errors.push(new ValidationError('Password must be at least 8 characters'));
 *   }
 * 
 *   if (!userData.firstName?.trim()) {
 *     errors.push(new ValidationError('First name is required'));
 *   }
 * 
 *   if (errors.length > 0) {
 *     throw errors[0]; // Throw first validation error
 *   }
 * };
 * ```
 * 
 * @example
 * API validation error with original cause:
 * ```tsx
 * const processApiData = async (data: any) => {
 *   try {
 *     await apiClient.post('/users', data);
 *   } catch (apiError) {
 *     if (apiError.response?.status === 400) {
 *       throw new ValidationError(
 *         'The provided data is invalid',
 *         apiError
 *       );
 *     }
 *   }
 * };
 * ```
 * 
 * @example
 * Business rule validation:
 * ```tsx
 * const validateBusinessRules = (orderData: OrderData) => {
 *   if (orderData.items.length === 0) {
 *     throw new ValidationError('Order must contain at least one item');
 *   }
 * 
 *   if (orderData.totalAmount < 0) {
 *     throw new ValidationError('Order total cannot be negative');
 *   }
 * 
 *   if (!orderData.customerId) {
 *     throw new ValidationError('Customer ID is required for orders');
 *   }
 * };
 * 
 * try {
 *   validateBusinessRules(orderData);
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     // Handle validation error appropriately
 *     showUserFriendlyError(error.message);
 *     logTechnicalDetails(error.getTechnicalDetails());
 *   }
 * }
 * ```
 * 
 * @features
 * - Pre-configured error details for validation scenarios
 * - Low severity level appropriate for user input errors
 * - Retryable flag set to true for user correction
 * - Standardized error code VALIDATION_FAILED_001
 * - Built-in recovery suggestions
 * - Validation category classification
 * - Cause chain support for nested errors
 * - Context tracking for debugging
 * - User-friendly error messages
 * - Enterprise error handling integration
 * 
 * @architecture
 * - Extends AppError for consistent error handling
 * - Predefined ErrorDetails configuration
 * - Automatic error categorization
 * - Context-aware error tracking
 * - Cause chain preservation
 * - Recovery suggestion system
 * - Severity classification
 * - Error code standardization
 * 
 * @error_handling
 * - Validation-specific error classification
 * - User input error categorization
 * - Retryable error marking
 * - Low severity for non-critical errors
 * - Contextual error information
 * - Recovery guidance provision
 * - Technical detail preservation
 * - Cause chain maintenance
 * 
 * @validation_types
 * - Form field validation
 * - API input validation
 * - Business rule validation
 * - Data type validation
 * - Format validation
 * - Range validation
 * - Required field validation
 * - Custom validation rules
 * 
 * @recovery_mechanisms
 * - User-friendly error messages
 * - Clear recovery suggestions
 * - Retryable error classification
 * - Input correction guidance
 * - Validation rule explanation
 * - Error context preservation
 * - Debugging information retention
 * 
 * @integration
 * - Form validation libraries
 * - API validation middleware
 * - Business logic validation
 * - Input sanitization systems
 * - Error reporting services
 * - User interface error display
 * - Logging and monitoring
 * - Analytics and metrics
 * 
 * @use_cases
 * - User registration form validation
 * - Login credential validation
 * - Profile update validation
 * - API request validation
 * - Business rule enforcement
 * - Data integrity checks
 * - Input sanitization failures
 * - Schema validation errors
 * 
 * @best_practices
 * - Provide clear, actionable error messages
 * - Include specific validation requirements
 * - Preserve original error cause when wrapping
 * - Use consistent error codes
 * - Implement proper error categorization
 * - Provide recovery suggestions
 * - Maintain error context for debugging
 * - Test validation scenarios thoroughly
 * 
 * @dependencies
 * - ./app.error: Base AppError class and enums
 * 
 * @see {@link AppError} for base error functionality
 * @see {@link ErrorSeverity} for severity level definitions
 * @see {@link ErrorCategory} for category classifications
 * @see {@link ErrorDetails} for error detail structure
 * 
 * @todo Add field-specific validation error support
 * @todo Implement validation rule documentation
 * @todo Add multi-language validation messages
 * @todo Include validation schema integration
 */
export class ValidationError extends AppError {
  /**
   * Constructor for ValidationError.
   * Creates a new validation error instance with predefined configuration
   * for validation failure scenarios.
   * 
   * @constructor
   * @param {string} message - User-friendly error message describing the validation failure
   * @param {unknown} cause - Optional original error that caused this validation error
   * 
   * @since 1.0.0
   * @example
   * ```tsx
   * // Basic validation error
   * throw new ValidationError('Email format is invalid');
   * 
   * // Validation error with cause
   * try {
   *   await validateSchema(data);
   * } catch (schemaError) {
   *   throw new ValidationError('Schema validation failed', schemaError);
   * }
   * ```
   */
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
