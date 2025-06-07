/**
 * Profile Domain Validation Types
 * 
 * @fileoverview Central validation type definitions for profile domain logic.
 * Provides business-level validation rules and patterns used across the entire
 * profile feature domain. These types define the core business validation logic
 * independent of any presentation or infrastructure concerns.
 * 
 * @module ProfileDomainValidation
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Domain
 */

/**
 * Core validation rule interface for domain-level business validation
 * 
 * @description Defines the structure for validation rules that enforce business
 * constraints and data integrity at the domain level. Rules can be simple
 * pattern-based or complex custom logic validators.
 * 
 * @interface ValidationRule
 * @property {'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'phone' | 'url' | 'custom'} type - Type of validation to perform
 * @property {any} [value] - Optional value for validation (e.g., min/max length)
 * @property {string} message - Human-readable error message for validation failure
 * @property {RegExp} [pattern] - Regular expression pattern for pattern validation
 * @property {Function} [validator] - Custom validation function for complex rules
 * 
 * @since 1.0.0
 */
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'phone' | 'url' | 'custom';
  value?: any;
  message: string;
  pattern?: RegExp;
  validator?: (value: string) => boolean;
}

/**
 * Validation result interface for domain validation operations
 * 
 * @description Standardized result structure for all domain validation operations.
 * Provides consistent error reporting and validation state across the domain.
 * 
 * @interface ValidationResult
 * @property {boolean} isValid - Whether the validation passed
 * @property {string[]} errors - Array of validation error messages
 * @property {string[]} [warnings] - Optional array of validation warnings
 * @property {Record<string, any>} [metadata] - Optional validation metadata
 * 
 * @since 1.0.0
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  metadata?: Record<string, any>;
}

/**
 * Field validation configuration for profile fields
 * 
 * @description Configuration object that maps profile fields to their
 * validation rules. Used to enforce business constraints consistently
 * across all profile-related operations.
 * 
 * @interface FieldValidationConfig
 * @property {string} fieldName - Name of the profile field
 * @property {ValidationRule[]} rules - Array of validation rules to apply
 * @property {boolean} [required] - Whether the field is required
 * @property {number} [order] - Validation execution order
 * 
 * @since 1.0.0
 */
export interface FieldValidationConfig {
  fieldName: string;
  rules: ValidationRule[];
  required?: boolean;
  order?: number;
}

/**
 * Profile completeness validation configuration
 * 
 * @description Defines the business rules for calculating profile completeness
 * percentages and determining what constitutes a "complete" profile.
 * 
 * @interface ProfileCompletenessConfig
 * @property {string[]} requiredFields - Fields required for basic profile completeness
 * @property {string[]} optionalFields - Fields that contribute to profile completeness
 * @property {Record<string, number>} fieldWeights - Weight multipliers for completion calculation
 * @property {number} minimumCompleteness - Minimum percentage for "complete" status
 * 
 * @since 1.0.0
 */
export interface ProfileCompletenessConfig {
  requiredFields: string[];
  optionalFields: string[];
  fieldWeights: Record<string, number>;
  minimumCompleteness: number;
}

/**
 * Domain validation error interface
 * 
 * @description Structured error object for domain validation failures.
 * Provides detailed information about validation errors for proper
 * error handling and user feedback.
 * 
 * @interface DomainValidationError
 * @property {string} field - Field name that failed validation
 * @property {string} code - Error code for programmatic handling
 * @property {string} message - Human-readable error message
 * @property {any} [value] - The value that failed validation
 * @property {string} [rule] - The validation rule that failed
 * 
 * @since 1.0.0
 */
export interface DomainValidationError {
  field: string;
  code: string;
  message: string;
  value?: any;
  rule?: string;
}

/**
 * Business validation constraints constants
 * 
 * @description Domain-level constants that define business validation limits
 * and constraints. These represent business rules rather than technical limitations.
 * 
 * @constant
 * @since 1.0.0
 */
export const DOMAIN_VALIDATION_CONSTRAINTS = {
  PROFILE: {
    FIRST_NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
    },
    LAST_NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
    },
    DISPLAY_NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100,
    },
    BIO: {
      MAX_LENGTH: 500,
    },
    WEBSITE: {
      MAX_LENGTH: 255,
    },
    PHONE: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 20,
    },
  },
  SOCIAL_LINKS: {
    MAX_LINKS: 20,
    URL_MAX_LENGTH: 500,
    USERNAME_MIN_LENGTH: 1,
    USERNAME_MAX_LENGTH: 100,
  },
  CUSTOM_FIELDS: {
    MAX_FIELDS: 20,
    LABEL_MIN_LENGTH: 2,
    LABEL_MAX_LENGTH: 50,
    VALUE_MAX_LENGTH: 500,
  },
} as const;

/**
 * Common validation patterns for domain validation
 * 
 * @description Regular expressions and patterns used for domain validation.
 * These patterns enforce business rules for data format and structure.
 * 
 * @constant
 * @since 1.0.0
 */
export const DOMAIN_VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-()]{10,20}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  USERNAME: /^[a-zA-Z0-9._-]{1,100}$/,
  DISPLAY_NAME: /^[a-zA-Z0-9\s._-]{2,100}$/,
} as const; 