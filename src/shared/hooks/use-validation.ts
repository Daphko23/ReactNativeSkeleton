/**
 * useValidation - Security-focused Validation Hook
 * Provides XSS protection, data sanitization, and input validation
 */

import { useState, useCallback, useMemo } from 'react';

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
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}

export interface UseValidationReturn {
  validate: (value: any, rules: ValidationRule) => ValidationResult;
  validateForm: (data: Record<string, any>, schema: FieldValidation) => Record<string, ValidationResult>;
  sanitizeHTML: (html: string) => string;
  sanitizeSQL: (input: string) => string;
  isValidEmail: (email: string) => boolean;
  isValidURL: (url: string) => boolean;
  isValidPhone: (phone: string) => boolean;
  errors: Record<string, string[]>;
  setError: (field: string, error: string) => void;
  clearErrors: (field?: string) => void;
  hasErrors: boolean;
}

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