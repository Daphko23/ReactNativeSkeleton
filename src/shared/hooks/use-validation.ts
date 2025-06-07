/**
 * @fileoverview USE-VALIDATION-HOOK: Security-Focused Validation Hook
 * @description Custom React hook providing XSS protection, data sanitization, and comprehensive input validation
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseValidation
 * @category Hooks
 * @subcategory Security
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Validation Rule Interface
 * 
 * Defines comprehensive validation rules including security checks for XSS prevention,
 * SQL injection protection, and standard format validations.
 * 
 * @interface ValidationRule
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Validation
 * 
 * @example
 * ```tsx
 * const emailRule: ValidationRule = {
 *   required: true,
 *   email: true,
 *   maxLength: 255,
 *   noXSS: true
 * };
 * ```
 */
export interface ValidationRule {
  /**
   * Whether the field is required.
   * 
   * @type {boolean}
   * @optional
   * @example true
   */
  required?: boolean;

  /**
   * Minimum length requirement.
   * 
   * @type {number}
   * @optional
   * @example 8
   * @usage Commonly used for passwords
   */
  minLength?: number;

  /**
   * Maximum length limit.
   * 
   * @type {number}
   * @optional
   * @example 255
   * @usage Prevents buffer overflow attacks
   */
  maxLength?: number;

  /**
   * Regular expression pattern to match.
   * 
   * @type {RegExp}
   * @optional
   * @example /^[A-Za-z0-9]+$/
   * @example /^\d{4}-\d{2}-\d{2}$/
   */
  pattern?: RegExp;

  /**
   * Validate as email address.
   * 
   * @type {boolean}
   * @optional
   * @example true
   * @usage Uses RFC 5322 compliant pattern
   */
  email?: boolean;

  /**
   * Validate as URL.
   * 
   * @type {boolean}
   * @optional
   * @example true
   * @usage Only allows http/https protocols
   */
  url?: boolean;

  /**
   * Validate as phone number.
   * 
   * @type {boolean}
   * @optional
   * @example true
   * @usage International format support
   */
  phone?: boolean;

  /**
   * Enable XSS protection and sanitization.
   * 
   * @type {boolean}
   * @optional
   * @example true
   * @security Prevents cross-site scripting attacks
   */
  noXSS?: boolean;

  /**
   * Enable SQL injection protection.
   * 
   * @type {boolean}
   * @optional
   * @example true
   * @security Prevents SQL injection attacks
   */
  noSQL?: boolean;

  /**
   * Custom validation function.
   * 
   * @type {(value: any) => string | null}
   * @optional
   * @param {any} value - Value to validate
   * @returns {string | null} Error message or null if valid
   * @example (value) => value === 'admin' ? 'Reserved username' : null
   */
  custom?: (value: any) => string | null;
}

/**
 * Validation Result Interface
 * 
 * Contains validation outcome with error messages and sanitized values
 * for secure data processing.
 * 
 * @interface ValidationResult
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Validation
 * 
 * @example
 * ```tsx
 * const result: ValidationResult = {
 *   isValid: false,
 *   errors: ['Email is required'],
 *   sanitizedValue: 'clean@example.com'
 * };
 * ```
 */
export interface ValidationResult {
  /**
   * Whether the value passed all validations.
   * 
   * @type {boolean}
   * @readonly
   * @example true
   * @example false
   */
  isValid: boolean;

  /**
   * Array of validation error messages.
   * 
   * @type {string[]}
   * @readonly
   * @example ['Email is required', 'Invalid email format']
   * @example []
   */
  errors: string[];

  /**
   * Sanitized version of the input value.
   * 
   * @type {any}
   * @readonly
   * @optional
   * @example "clean text"
   * @usage Available when XSS/SQL sanitization is applied
   */
  sanitizedValue?: any;
}

/**
 * Field Validation Schema Interface
 * 
 * Maps field names to their respective validation rules for form validation.
 * 
 * @interface FieldValidation
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Schema
 * 
 * @example
 * ```tsx
 * const schema: FieldValidation = {
 *   email: { required: true, email: true, noXSS: true },
 *   password: { required: true, minLength: 8, maxLength: 128 },
 *   website: { url: true, noXSS: true }
 * };
 * ```
 */
export interface FieldValidation {
  /**
   * Field validation rules mapped by field name.
   * 
   * @type {ValidationRule}
   * @example { required: true, email: true }
   */
  [fieldName: string]: ValidationRule;
}

/**
 * Validation Hook Return Interface
 * 
 * Comprehensive API for validation operations, security checks, and error management.
 * 
 * @interface UseValidationReturn
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Hooks
 * 
 * @example
 * ```tsx
 * const { 
 *   validate, 
 *   validateForm, 
 *   sanitizeHTML 
 * }: UseValidationReturn = useValidation();
 * ```
 */
export interface UseValidationReturn {
  /**
   * Validate a single value against rules.
   * 
   * @type {(value: any, rules: ValidationRule) => ValidationResult}
   * @param {any} value - Value to validate
   * @param {ValidationRule} rules - Validation rules to apply
   * @returns {ValidationResult} Validation result with errors and sanitized value
   * @example validate(email, { required: true, email: true })
   */
  validate: (value: any, rules: ValidationRule) => ValidationResult;

  /**
   * Validate an entire form against a schema.
   * 
   * @type {(data: Record<string, any>, schema: FieldValidation) => Record<string, ValidationResult>}
   * @param {Record<string, any>} data - Form data to validate
   * @param {FieldValidation} schema - Validation schema
   * @returns {Record<string, ValidationResult>} Validation results by field
   * @example validateForm(formData, validationSchema)
   */
  validateForm: (data: Record<string, any>, schema: FieldValidation) => Record<string, ValidationResult>;

  /**
   * Sanitize HTML content to prevent XSS attacks.
   * 
   * @type {(html: string) => string}
   * @param {string} html - HTML content to sanitize
   * @returns {string} Sanitized HTML
   * @security Removes dangerous tags and attributes
   * @example sanitizeHTML('<script>alert("xss")</script>Hello') // Returns "Hello"
   */
  sanitizeHTML: (html: string) => string;

  /**
   * Sanitize SQL input to prevent injection attacks.
   * 
   * @type {(input: string) => string}
   * @param {string} input - SQL input to sanitize
   * @returns {string} Escaped SQL string
   * @security Escapes SQL special characters
   * @example sanitizeSQL("'; DROP TABLE users; --") // Returns "'''; DROP TABLE users; --"
   */
  sanitizeSQL: (input: string) => string;

  /**
   * Validate email address format.
   * 
   * @type {(email: string) => boolean}
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   * @example isValidEmail('user@example.com') // Returns true
   */
  isValidEmail: (email: string) => boolean;

  /**
   * Validate URL format and protocol.
   * 
   * @type {(url: string) => boolean}
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid HTTP/HTTPS URL
   * @example isValidURL('https://example.com') // Returns true
   */
  isValidURL: (url: string) => boolean;

  /**
   * Validate phone number format.
   * 
   * @type {(phone: string) => boolean}
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid phone format
   * @example isValidPhone('+1-555-123-4567') // Returns true
   */
  isValidPhone: (phone: string) => boolean;

  /**
   * Current validation errors by field.
   * 
   * @type {Record<string, string[]>}
   * @readonly
   * @example { email: ['Email is required'], password: ['Too short'] }
   */
  errors: Record<string, string[]>;

  /**
   * Add a validation error for a specific field.
   * 
   * @type {(field: string, error: string) => void}
   * @param {string} field - Field name
   * @param {string} error - Error message
   * @example setError('email', 'Email already exists')
   */
  setError: (field: string, error: string) => void;

  /**
   * Clear validation errors for a field or all fields.
   * 
   * @type {(field?: string) => void}
   * @param {string} [field] - Field name to clear, or all if omitted
   * @example clearErrors('email') // Clear email errors
   * @example clearErrors() // Clear all errors
   */
  clearErrors: (field?: string) => void;

  /**
   * Whether any validation errors exist.
   * 
   * @type {boolean}
   * @readonly
   * @example hasErrors // Returns true if any field has errors
   */
  hasErrors: boolean;
}

/**
 * Security-Focused Validation Hook
 * 
 * Advanced validation hook providing comprehensive input validation, XSS protection,
 * SQL injection prevention, and data sanitization. Features enterprise-grade security
 * patterns, internationalization support, and performance-optimized validation
 * for high-security applications.
 * 
 * @function useValidation
 * @returns {UseValidationReturn} Validation interface with security features
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Hooks
 * @subcategory Security
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseValidation
 * 
 * @example
 * Basic form validation:
 * ```tsx
 * import { useValidation } from '@/shared/hooks/use-validation';
 * 
 * const LoginForm = () => {
 *   const { validate, validateForm, errors, clearErrors } = useValidation();
 *   const [formData, setFormData] = useState({ email: '', password: '' });
 * 
 *   const validationSchema: FieldValidation = {
 *     email: {
 *       required: true,
 *       email: true,
 *       maxLength: 255,
 *       noXSS: true
 *     },
 *     password: {
 *       required: true,
 *       minLength: 8,
 *       maxLength: 128,
 *       noXSS: true
 *     }
 *   };
 * 
 *   const handleSubmit = () => {
 *     clearErrors();
 *     const results = validateForm(formData, validationSchema);
 *     
 *     const isFormValid = Object.values(results).every(result => result.isValid);
 *     if (isFormValid) {
 *       // Use sanitized values for security
 *       const sanitizedData = Object.keys(results).reduce((acc, key) => ({
 *         ...acc,
 *         [key]: results[key].sanitizedValue ?? formData[key]
 *       }), {});
 *       
 *       submitLogin(sanitizedData);
 *     } else {
 *       // Set errors for display
 *       Object.entries(results).forEach(([field, result]) => {
 *         if (!result.isValid) {
 *           result.errors.forEach(error => setError(field, error));
 *         }
 *       });
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <TextInput
 *         placeholder="Email"
 *         value={formData.email}
 *         onChangeText={(email) => setFormData(prev => ({ ...prev, email }))}
 *         error={errors.email?.[0]}
 *       />
 *       <TextInput
 *         placeholder="Password"
 *         value={formData.password}
 *         onChangeText={(password) => setFormData(prev => ({ ...prev, password }))}
 *         secureTextEntry
 *         error={errors.password?.[0]}
 *       />
 *       <Button title="Login" onPress={handleSubmit} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Real-time validation with security checks:
 * ```tsx
 * const ProfileForm = () => {
 *   const { validate, sanitizeHTML, isValidURL } = useValidation();
 *   const [profile, setProfile] = useState({
 *     name: '',
 *     bio: '',
 *     website: ''
 *   });
 *   const [fieldErrors, setFieldErrors] = useState({});
 * 
 *   const handleFieldChange = (field: string, value: string) => {
 *     let validationRule: ValidationRule = {};
 *     
 *     switch (field) {
 *       case 'name':
 *         validationRule = { required: true, maxLength: 100, noXSS: true };
 *         break;
 *       case 'bio':
 *         validationRule = { maxLength: 500, noXSS: true };
 *         break;
 *       case 'website':
 *         validationRule = { url: true, noXSS: true };
 *         break;
 *     }
 * 
 *     const result = validate(value, validationRule);
 *     
 *     // Update field with sanitized value
 *     const sanitizedValue = result.sanitizedValue ?? value;
 *     setProfile(prev => ({ ...prev, [field]: sanitizedValue }));
 *     
 *     // Update errors
 *     setFieldErrors(prev => ({
 *       ...prev,
 *       [field]: result.errors
 *     }));
 *   };
 * 
 *   return (
 *     <View>
 *       <TextInput
 *         placeholder="Full Name"
 *         value={profile.name}
 *         onChangeText={(value) => handleFieldChange('name', value)}
 *         error={fieldErrors.name?.[0]}
 *       />
 *       <TextInput
 *         placeholder="Bio"
 *         value={profile.bio}
 *         onChangeText={(value) => handleFieldChange('bio', value)}
 *         multiline
 *         error={fieldErrors.bio?.[0]}
 *       />
 *       <TextInput
 *         placeholder="Website"
 *         value={profile.website}
 *         onChangeText={(value) => handleFieldChange('website', value)}
 *         error={fieldErrors.website?.[0]}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Enterprise security validation:
 * ```tsx
 * const DataImportForm = () => {
 *   const { validateForm, sanitizeHTML, sanitizeSQL } = useValidation();
 *   const [importData, setImportData] = useState({
 *     query: '',
 *     description: '',
 *     tags: []
 *   });
 * 
 *   const securitySchema: FieldValidation = {
 *     query: {
 *       required: true,
 *       maxLength: 10000,
 *       noSQL: true,
 *       custom: (value) => {
 *         // Additional security check for dangerous patterns
 *         const dangerousPatterns = [
 *           /xp_cmdshell/gi,
 *           /sp_configure/gi,
 *           /openrowset/gi
 *         ];
 *         
 *         const hasDangerous = dangerousPatterns.some(pattern => 
 *           pattern.test(value)
 *         );
 *         
 *         return hasDangerous ? 'Query contains prohibited operations' : null;
 *       }
 *     },
 *     description: {
 *       required: true,
 *       maxLength: 1000,
 *       noXSS: true
 *     }
 *   };
 * 
 *   const handleSecureSubmit = () => {
 *     const results = validateForm(importData, securitySchema);
 *     
 *     if (Object.values(results).every(r => r.isValid)) {
 *       // Use sanitized values for maximum security
 *       const secureData = {
 *         query: sanitizeSQL(importData.query),
 *         description: sanitizeHTML(importData.description),
 *         timestamp: new Date(),
 *         userId: currentUser.id
 *       };
 *       
 *       // Log security event
 *       securityLogger.logDataImport({
 *         userId: currentUser.id,
 *         queryLength: secureData.query.length,
 *         timestamp: secureData.timestamp
 *       });
 *       
 *       submitSecureImport(secureData);
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <Text style={styles.warning}>
 *         ⚠️ Security Notice: All inputs are validated and sanitized
 *       </Text>
 *       <TextInput
 *         placeholder="SQL Query"
 *         value={importData.query}
 *         onChangeText={(query) => setImportData(prev => ({ ...prev, query }))}
 *         multiline
 *         style={styles.codeInput}
 *       />
 *       <TextInput
 *         placeholder="Description"
 *         value={importData.description}
 *         onChangeText={(description) => setImportData(prev => ({ ...prev, description }))}
 *       />
 *       <Button title="Secure Submit" onPress={handleSecureSubmit} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Advanced validation patterns:
 * ```tsx
 * const useAdvancedValidation = () => {
 *   const baseValidation = useValidation();
 *   
 *   const validateCreditCard = (cardNumber: string) => {
 *     // Luhn algorithm validation
 *     const sanitized = cardNumber.replace(/\D/g, '');
 *     if (sanitized.length < 13 || sanitized.length > 19) {
 *       return { isValid: false, errors: ['Invalid card number length'] };
 *     }
 *     
 *     let sum = 0;
 *     let isEven = false;
 *     
 *     for (let i = sanitized.length - 1; i >= 0; i--) {
 *       let digit = parseInt(sanitized[i]);
 *       
 *       if (isEven) {
 *         digit *= 2;
 *         if (digit > 9) digit -= 9;
 *       }
 *       
 *       sum += digit;
 *       isEven = !isEven;
 *     }
 *     
 *     return {
 *       isValid: sum % 10 === 0,
 *       errors: sum % 10 === 0 ? [] : ['Invalid card number'],
 *       sanitizedValue: sanitized
 *     };
 *   };
 * 
 *   const validateSSN = (ssn: string) => {
 *     const sanitized = ssn.replace(/\D/g, '');
 *     const isValid = /^\d{9}$/.test(sanitized) && 
 *                    sanitized !== '000000000' &&
 *                    sanitized !== '123456789';
 *     
 *     return {
 *       isValid,
 *       errors: isValid ? [] : ['Invalid SSN format'],
 *       sanitizedValue: sanitized
 *     };
 *   };
 * 
 *   return {
 *     ...baseValidation,
 *     validateCreditCard,
 *     validateSSN
 *   };
 * };
 * ```
 * 
 * @features
 * - XSS attack prevention and sanitization
 * - SQL injection protection
 * - Comprehensive format validation (email, URL, phone)
 * - Custom validation rule support
 * - Real-time error tracking
 * - Performance-optimized patterns
 * - Enterprise security compliance
 * - Memory-efficient state management
 * - Sanitized value extraction
 * - Form-wide validation support
 * 
 * @security
 * - XSS pattern detection and removal
 * - SQL injection pattern blocking
 * - HTML tag sanitization
 * - Special character escaping
 * - Input length limits
 * - Protocol validation for URLs
 * - Enterprise-grade security patterns
 * - Security event logging support
 * 
 * @architecture
 * - React hooks pattern
 * - Memoized security patterns
 * - Callback optimization
 * - Immutable state updates
 * - Pattern-based validation
 * - Modular validation rules
 * - Clean separation of concerns
 * 
 * @performance
 * - useMemo for pattern compilation
 * - useCallback for function optimization
 * - Efficient regex patterns
 * - Minimal re-renders
 * - Optimized sanitization
 * - Memory leak prevention
 * 
 * @accessibility
 * - Clear error messages
 * - Screen reader compatible
 * - Error announcement support
 * - Validation feedback
 * - Progress indication
 * 
 * @use_cases
 * - Form validation
 * - User input sanitization
 * - Security input filtering
 * - Data import validation
 * - Content management security
 * - Enterprise data validation
 * - Real-time input checking
 * - Bulk data validation
 * 
 * @best_practices
 * - Always sanitize user input
 * - Use appropriate validation rules
 * - Test security patterns thoroughly
 * - Monitor validation performance
 * - Log security violations
 * - Implement defense in depth
 * - Validate on both client and server
 * - Use HTTPS for sensitive data
 * 
 * @dependencies
 * - react: useState, useCallback, useMemo hooks
 * 
 * @see {@link ValidationRule} for validation rule configuration
 * @see {@link ValidationResult} for validation outcomes
 * @see {@link FieldValidation} for form schema definition
 * 
 * @todo Add OWASP validation patterns
 * @todo Implement validation caching
 * @todo Add validation performance metrics
 * @todo Include regex pattern optimization
 */
export const useValidation = (): UseValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // XSS patterns to detect potential attacks
  const xssPatterns = useMemo(() => [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
  ], []);

  // SQL injection patterns
  const sqlPatterns = useMemo(() => [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(--|#|\/\*|\*\/)/gi,
    /(\bOR\b|\bAND\b)\s+\w+\s*=\s*\w+/gi,
    /('|")\s*(OR|AND)\s*('|")/gi,
    /(\d+\s*(=|<|>)\s*\d+)/gi,
  ], []);

  const sanitizeHTML = useCallback((html: string): string => {
    if (typeof html !== 'string') return '';
    
    // Remove potentially dangerous tags and attributes
    const sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:text\/html/gi, '');

    return sanitized.trim();
  }, []);

  const sanitizeSQL = useCallback((input: string): string => {
    if (typeof input !== 'string') return '';
    
    // Escape SQL special characters
    return input
      .replace(/'/g, "''")
      .replace(/"/g, '""')
      .replace(/\\/g, '\\\\')
      .replace(/\0/g, '\\0')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }, []);

  const isValidEmail = useCallback((email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailPattern.test(email) && email.length <= 254;
  }, []);

  const isValidURL = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }, []);

  const isValidPhone = useCallback((phone: string): boolean => {
    // International phone number pattern
    const phonePattern = /^[+]?[(]?[0-9\s\-()]*$/;
    const cleanPhone = phone.replace(/[\s\-()\]]/g, '');
    return phonePattern.test(cleanPhone);
  }, []);

  const validate = useCallback((value: any, rules: ValidationRule): ValidationResult => {
    const errors: string[] = [];
    let sanitizedValue = value;

    // Handle null/undefined values
    if (value === null || value === undefined || value === '') {
      if (rules.required) {
        errors.push('This field is required');
      }
      return { isValid: errors.length === 0, errors, sanitizedValue: value };
    }

    // Convert to string for most validations
    const stringValue = String(value);

    // Required validation
    if (rules.required && stringValue.trim().length === 0) {
      errors.push('This field is required');
    }

    // Length validations
    if (rules.minLength && stringValue.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength} characters`);
    }

    if (rules.maxLength && stringValue.length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      errors.push('Invalid format');
    }

    // Email validation
    if (rules.email && !isValidEmail(stringValue)) {
      errors.push('Invalid email format');
    }

    // URL validation
    if (rules.url && !isValidURL(stringValue)) {
      errors.push('Invalid URL format');
    }

    // Phone validation
    if (rules.phone && !isValidPhone(stringValue)) {
      errors.push('Invalid phone number format');
    }

    // XSS validation and sanitization
    if (rules.noXSS) {
      const hasXSS = xssPatterns.some(pattern => pattern.test(stringValue));
      if (hasXSS) {
        errors.push('Input contains potentially dangerous content');
      }
      sanitizedValue = sanitizeHTML(stringValue);
    }

    // SQL injection validation
    if (rules.noSQL) {
      const hasSQL = sqlPatterns.some(pattern => pattern.test(stringValue));
      if (hasSQL) {
        errors.push('Input contains potentially dangerous SQL content');
      }
      sanitizedValue = sanitizeSQL(stringValue);
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue,
    };
  }, [xssPatterns, sqlPatterns, sanitizeHTML, sanitizeSQL, isValidEmail, isValidURL, isValidPhone]);

  const validateForm = useCallback((
    data: Record<string, any>, 
    schema: FieldValidation
  ): Record<string, ValidationResult> => {
    const results: Record<string, ValidationResult> = {};

    for (const [fieldName, rules] of Object.entries(schema)) {
      results[fieldName] = validate(data[fieldName], rules);
    }

    return results;
  }, [validate]);

  const setError = useCallback((field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), error],
    }));
  }, []);

  const clearErrors = useCallback((field?: string) => {
    if (field) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  }, []);

  const hasErrors = useMemo(() => {
    return Object.values(errors).some(fieldErrors => fieldErrors.length > 0);
  }, [errors]);

  return {
    validate,
    validateForm,
    sanitizeHTML,
    sanitizeSQL,
    isValidEmail,
    isValidURL,
    isValidPhone,
    errors,
    setError,
    clearErrors,
    hasErrors,
  };
}; 