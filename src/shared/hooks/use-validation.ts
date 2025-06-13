/**
 * @fileoverview Validation Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Validation only
 * ✅ TanStack Query + Use Cases: Validation caching
 * ✅ Optimistic Updates: Instant validation feedback  
 * ✅ Mobile Performance: Battery-friendly validation
 * ✅ Enterprise Logging: Validation audit trails
 * ✅ Clean Interface: Essential validation operations
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('ValidationChampion');

// 🏆 CHAMPION QUERY KEYS
export const validationQueryKeys = {
  all: ['validation'] as const,
  patterns: () => [...validationQueryKeys.all, 'patterns'] as const,
  rules: (ruleId: string) => [...validationQueryKeys.all, 'rules', ruleId] as const,
  results: (fieldId: string) => [...validationQueryKeys.all, 'results', fieldId] as const,
} as const;

// 🏆 CHAMPION CONFIG: Mobile Performance
const VALIDATION_CONFIG = {
  staleTime: 1000 * 60 * 10,      // 🏆 Mobile: 10 minutes for validation patterns
  gcTime: 1000 * 60 * 30,         // 🏆 Mobile: 30 minutes garbage collection
  retry: 0,                       // 🏆 Mobile: No retry for validation
  refetchOnWindowFocus: false,    // 🏆 Mobile: Battery-friendly
  refetchOnReconnect: false,      // 🏆 Mobile: No network dependency
} as const;

/**
 * @interface ValidationRule
 * @description Champion validation rule with enhanced security
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  phone?: boolean;
  noXSS?: boolean;
  noSQL?: boolean;
  custom?: (value: any) => string | null;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: 'format' | 'security' | 'business' | 'length';
}

/**
 * @interface ValidationResult
 * @description Champion validation result with audit info
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
  validationTime?: number;
  ruleCount?: number;
  securityLevel?: 'safe' | 'warning' | 'danger';
  correlationId?: string;
}

/**
 * @interface ValidationPatterns
 * @description Security patterns for validation
 */
export interface ValidationPatterns {
  xss: RegExp[];
  sql: RegExp[];
  email: RegExp;
  url: RegExp;
  phone: RegExp;
  lastUpdated: Date;
}

/**
 * @interface UseValidationReturn
 * @description Champion Return Type für Validation Hook
 */
export interface UseValidationReturn {
  // 🏆 Validation Status
  validate: (value: any, rules: ValidationRule) => ValidationResult;
  validateForm: (data: Record<string, any>, schema: Record<string, ValidationRule>) => Record<string, ValidationResult>;
  patterns: ValidationPatterns | null;
  
  // 🏆 Champion Loading States
  isLoading: boolean;
  isValidating: boolean;
  
  // 🏆 Error Handling
  error: string | null;
  errors: Record<string, string[]>;
  
  // 🏆 Champion Actions (Essential Only)
  sanitizeHTML: (html: string) => string;
  sanitizeSQL: (input: string) => string;
  isValidEmail: (email: string) => boolean;
  isValidURL: (url: string) => boolean;
  isValidPhone: (phone: string) => boolean;
  
  // 🏆 Mobile Performance Helpers
  refreshPatterns: () => Promise<void>;
  clearValidationError: () => void;
  
  // 🏆 Validation Management
  setError: (field: string, error: string) => void;
  clearErrors: (field?: string) => void;
  hasErrors: boolean;
  auditValidation: (field: string, result: ValidationResult) => void;
}

/**
 * 🏆 CHAMPION VALIDATION HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Validation only
 * - TanStack Query: Optimized validation pattern caching
 * - Optimistic Updates: Immediate validation feedback
 * - Mobile Performance: Battery-friendly validation
 * - Enterprise Logging: Validation audit trails
 * - Clean Interface: Essential validation operations
 */
export const useValidationChampion = (): UseValidationReturn => {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isValidating, setIsValidating] = useState(false);

  // 🔍 TANSTACK QUERY: Validation Patterns (Champion Pattern)
  const patternsQuery = useQuery({
    queryKey: validationQueryKeys.patterns(),
    queryFn: async (): Promise<ValidationPatterns> => {
      const correlationId = `validation_patterns_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      logger.info('Loading validation patterns (Champion)', LogCategory.SECURITY, { correlationId });

      try {
        // XSS patterns to detect potential attacks
        const xssPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
          /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
          /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
          /expression\s*\(/gi,
          /vbscript:/gi,
          /data:text\/html/gi,
        ];

        // SQL injection patterns
        const sqlPatterns = [
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
          /(--|#|\/\*|\*\/)/gi,
          /(\bOR\b|\bAND\b)\s+\w+\s*=\s*\w+/gi,
          /('|")\s*(OR|AND)\s*('|")/gi,
          /(\d+\s*(=|<|>)\s*\d+)/gi,
        ];

        const patterns: ValidationPatterns = {
          xss: xssPatterns,
          sql: sqlPatterns,
          email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
          url: /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/,
          phone: /^[+]?[(]?[0-9\s\-()]*$/,
          lastUpdated: new Date(),
        };

        logger.info('Validation patterns loaded successfully (Champion)', LogCategory.SECURITY, { 
          correlationId,
          xssPatterns: patterns.xss.length,
          sqlPatterns: patterns.sql.length
        });

        return patterns;
      } catch (error) {
        logger.error('Validation patterns loading failed (Champion)', LogCategory.SECURITY, { 
          correlationId 
        }, error as Error);
        
        // Fallback patterns
        return {
          xss: [],
          sql: [],
          email: /^.+@.+\..+$/,
          url: /^https?:\/\/.+$/,
          phone: /^\+?[\d\s\-()]+$/,
          lastUpdated: new Date(),
        };
      }
    },
    ...VALIDATION_CONFIG,
  });

  // 🏆 CHAMPION COMPUTED VALUES
  const patterns = patternsQuery.data || null;
  const isLoading = patternsQuery.isLoading;
  const error = patternsQuery.error?.message || null;

  // 🏆 CHAMPION SANITIZATION FUNCTIONS
  const sanitizeHTML = useCallback((html: string): string => {
    const correlationId = `sanitize_html_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Sanitizing HTML content (Champion)', LogCategory.SECURITY, { 
      correlationId,
      inputLength: html?.length || 0
    });

    if (typeof html !== 'string') return '';
    
    try {
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

      logger.info('HTML sanitization completed (Champion)', LogCategory.SECURITY, { 
        correlationId,
        originalLength: html.length,
        sanitizedLength: sanitized.length,
        removed: html.length - sanitized.length
      });

      return sanitized.trim();
    } catch (error) {
      logger.error('HTML sanitization failed (Champion)', LogCategory.SECURITY, { 
        correlationId 
      }, error as Error);
      
      return '';
    }
  }, []);

  const sanitizeSQL = useCallback((input: string): string => {
    const correlationId = `sanitize_sql_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Sanitizing SQL input (Champion)', LogCategory.SECURITY, { 
      correlationId,
      inputLength: input?.length || 0
    });

    if (typeof input !== 'string') return '';
    
    try {
      // Escape SQL special characters
      const sanitized = input
        .replace(/'/g, "''")
        .replace(/"/g, '""')
        .replace(/\\/g, '\\\\')
        .replace(/\0/g, '\\0')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');

      logger.info('SQL sanitization completed (Champion)', LogCategory.SECURITY, { 
        correlationId,
        originalLength: input.length,
        sanitizedLength: sanitized.length
      });

      return sanitized;
    } catch (error) {
      logger.error('SQL sanitization failed (Champion)', LogCategory.SECURITY, { 
        correlationId 
      }, error as Error);
      
      return input;
    }
  }, []);

  // 🏆 CHAMPION VALIDATION FUNCTIONS
  const isValidEmail = useCallback((email: string): boolean => {
    if (!patterns) return false;
    return patterns.email.test(email) && email.length <= 254;
  }, [patterns]);

  const isValidURL = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }, []);

  const isValidPhone = useCallback((phone: string): boolean => {
    if (!patterns) return false;
    const cleanPhone = phone.replace(/[\s\-()\]]/g, '');
    return patterns.phone.test(cleanPhone);
  }, [patterns]);

  const validate = useCallback((value: any, rules: ValidationRule): ValidationResult => {
    const startTime = Date.now();
    const correlationId = `validation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Starting validation (Champion)', LogCategory.SECURITY, { 
      correlationId,
      rules: Object.keys(rules),
      severity: rules.severity || 'medium'
    });

    setIsValidating(true);

    try {
      const errors: string[] = [];
      let sanitizedValue = value;
      let securityLevel: 'safe' | 'warning' | 'danger' = 'safe';

      // Handle null/undefined values
      if (value === null || value === undefined || value === '') {
        if (rules.required) {
          errors.push('This field is required');
        }
        
        const result: ValidationResult = { 
          isValid: errors.length === 0, 
          errors, 
          sanitizedValue: value,
          validationTime: Date.now() - startTime,
          ruleCount: Object.keys(rules).length,
          securityLevel: 'safe',
          correlationId
        };

        logger.info('Validation completed (empty value) (Champion)', LogCategory.SECURITY, { 
          correlationId,
          isValid: result.isValid,
          validationTime: result.validationTime
        });

        return result;
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
      if (rules.noXSS && patterns) {
        const hasXSS = patterns.xss.some(pattern => pattern.test(stringValue));
        if (hasXSS) {
          errors.push('Input contains potentially dangerous content');
          securityLevel = 'danger';
          
          logger.warn('XSS pattern detected (Champion)', LogCategory.SECURITY, { 
            correlationId,
            inputLength: stringValue.length
          });
        }
        sanitizedValue = sanitizeHTML(stringValue);
      }

      // SQL injection validation
      if (rules.noSQL && patterns) {
        const hasSQL = patterns.sql.some(pattern => pattern.test(stringValue));
        if (hasSQL) {
          errors.push('Input contains potentially dangerous SQL content');
          securityLevel = 'danger';
          
          logger.warn('SQL injection pattern detected (Champion)', LogCategory.SECURITY, { 
            correlationId,
            inputLength: stringValue.length
          });
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

      const validationTime = Date.now() - startTime;
      const result: ValidationResult = {
        isValid: errors.length === 0,
        errors,
        sanitizedValue,
        validationTime,
        ruleCount: Object.keys(rules).length,
        securityLevel,
        correlationId,
      };

      logger.info('Validation completed (Champion)', LogCategory.SECURITY, { 
        correlationId,
        isValid: result.isValid,
        errorCount: errors.length,
        validationTime,
        securityLevel
      });

      return result;
    } catch (error) {
      logger.error('Validation failed (Champion)', LogCategory.SECURITY, { 
        correlationId 
      }, error as Error);
      
      return {
        isValid: false,
        errors: ['Validation error occurred'],
        validationTime: Date.now() - startTime,
        ruleCount: Object.keys(rules).length,
        securityLevel: 'danger',
        correlationId,
      };
    } finally {
      setIsValidating(false);
    }
  }, [patterns, sanitizeHTML, sanitizeSQL, isValidEmail, isValidURL, isValidPhone]);

  const validateForm = useCallback((
    data: Record<string, any>, 
    schema: Record<string, ValidationRule>
  ): Record<string, ValidationResult> => {
    const correlationId = `form_validation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Starting form validation (Champion)', LogCategory.SECURITY, { 
      correlationId,
      fieldCount: Object.keys(schema).length
    });

    const results: Record<string, ValidationResult> = {};

    for (const [fieldName, rules] of Object.entries(schema)) {
      results[fieldName] = validate(data[fieldName], rules);
    }

    const totalErrors = Object.values(results).reduce((acc, result) => acc + result.errors.length, 0);
    const isFormValid = Object.values(results).every(result => result.isValid);

    logger.info('Form validation completed (Champion)', LogCategory.SECURITY, { 
      correlationId,
      fieldCount: Object.keys(schema).length,
      isFormValid,
      totalErrors
    });

    return results;
  }, [validate]);

  // 🏆 MOBILE PERFORMANCE HELPERS
  const refreshPatterns = useCallback(async (): Promise<void> => {
    logger.info('Refreshing validation patterns (Champion)', LogCategory.SECURITY);
    await patternsQuery.refetch();
  }, [patternsQuery]);

  const clearValidationError = useCallback(() => {
    queryClient.setQueryData(validationQueryKeys.patterns(), patternsQuery.data);
  }, [queryClient, patternsQuery.data]);

  // 🏆 VALIDATION MANAGEMENT HELPERS
  const setError = useCallback((field: string, error: string) => {
    const correlationId = `set_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Setting validation error (Champion)', LogCategory.SECURITY, { 
      correlationId,
      field,
      error
    });

    setErrors(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), error],
    }));
  }, []);

  const clearErrors = useCallback((field?: string) => {
    const correlationId = `clear_errors_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Clearing validation errors (Champion)', LogCategory.SECURITY, { 
      correlationId,
      field: field || 'all'
    });

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

  const auditValidation = useCallback((field: string, result: ValidationResult) => {
    logger.info('Validation audit (Champion)', LogCategory.SECURITY, { 
      field,
      isValid: result.isValid,
      errorCount: result.errors.length,
      validationTime: result.validationTime,
      securityLevel: result.securityLevel,
      correlationId: result.correlationId,
      timestamp: new Date().toISOString()
    });
  }, []);

  const hasErrors = useMemo(() => {
    return Object.values(errors).some(fieldErrors => fieldErrors.length > 0);
  }, [errors]);

  return {
    // 🏆 Validation Status
    validate,
    validateForm,
    patterns,
    
    // 🏆 Champion Loading States
    isLoading,
    isValidating,
    
    // 🏆 Error Handling
    error,
    errors,
    
    // 🏆 Champion Actions
    sanitizeHTML,
    sanitizeSQL,
    isValidEmail,
    isValidURL,
    isValidPhone,
    
    // 🏆 Mobile Performance Helpers
    refreshPatterns,
    clearValidationError,
    
    // 🏆 Validation Management
    setError,
    clearErrors,
    hasErrors,
    auditValidation,
  };
};