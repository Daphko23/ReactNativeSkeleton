/**
 * Core Validation Service - Enterprise Clean Architecture
 * Zentrale Validierungs-Engine für alle Feature-übergreifenden Validierungen
 * 
 * @description
 * Single Source of Truth für alle Basis-Validierungen (Email, URL, Phone etc.)
 * Eliminiert redundante Validation-Implementierungen über das gesamte System
 * 
 * @module CoreValidationService
 * @layer Core
 * @since 1.0.0
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

/**
 * Validation Result Interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  fieldName?: string;
}

/**
 * Advanced Validation Options
 */
export interface ValidationOptions {
  allowEmpty?: boolean;
  customErrorMessage?: string;
  locale?: string;
  strictMode?: boolean;
}

/**
 * Core Validation Patterns - Single Source of Truth
 * Konsolidiert alle Pattern-Definitionen aus dem System
 */
export const CORE_VALIDATION_PATTERNS = {
  // Email Patterns (konsolidiert von 5 verschiedenen Orten)
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_STRICT: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Phone Patterns (konsolidiert von 3 verschiedenen Orten)
  PHONE: /^[+]?[\d\s()-]+$/,
  PHONE_INTERNATIONAL: /^\+?[\d\s\-()]{10,20}$/,
  PHONE_STRICT: /^(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/,
  
  // URL Patterns (konsolidiert von 4 verschiedenen Orten)
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  URL_SIMPLE: /^https?:\/\/.+\..+/,
  
  // Username & Display Name Patterns
  USERNAME: /^[a-zA-Z0-9._-]{1,100}$/,
  DISPLAY_NAME: /^[a-zA-Z0-9\s._-]{2,100}$/,
  
  // Special Patterns
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHANUMERIC_SPACES: /^[a-zA-Z0-9\s]+$/,
} as const;

/**
 * Validation Constraints - Single Source of Truth
 * Konsolidiert alle Constraint-Definitionen aus dem System
 */
export const CORE_VALIDATION_CONSTRAINTS = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 254,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 20,
  },
  URL: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 2048,
  },
  NAME: {
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
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
} as const;

/**
 * Core Validation Service
 * 
 * @description
 * Zentrale Validierungs-Engine die alle redundanten Validierungen konsolidiert:
 * - ProfileService.validateProfile() → delegiert hierher
 * - ProfileSecurityService validation → nutzt diese Patterns
 * - FormValidation hooks → nutzen diese Service
 * - CustomFieldsEdit validation → delegiert hierher
 * - Alle redundanten Regex-Patterns → konsolidiert hier
 */
export class CoreValidationService {
  private logger = LoggerFactory.createServiceLogger('CoreValidationService');
  private static instance: CoreValidationService;

  /**
   * Singleton Pattern für globale Verfügbarkeit
   */
  static getInstance(): CoreValidationService {
    if (!CoreValidationService.instance) {
      CoreValidationService.instance = new CoreValidationService();
    }
    return CoreValidationService.instance;
  }

  // =============================================
  // EMAIL VALIDATION (konsolidiert von 5 Orten)
  // =============================================

  /**
   * Email Validation - Single Source of Truth
   * Ersetzt alle redundanten Email-Validierungen im System
   */
  validateEmail(email: string, options: ValidationOptions = {}): ValidationResult {
    const errors: string[] = [];
    const { allowEmpty = false, strictMode = false } = options;

    try {
      // Empty Check
      if (!email || email.trim().length === 0) {
        if (!allowEmpty) {
          errors.push('Email ist erforderlich');
        }
        return { isValid: allowEmpty, errors, fieldName: 'email' };
      }

      const trimmedEmail = email.trim();

      // Length Validation
      if (trimmedEmail.length < CORE_VALIDATION_CONSTRAINTS.EMAIL.MIN_LENGTH) {
        errors.push(`Email muss mindestens ${CORE_VALIDATION_CONSTRAINTS.EMAIL.MIN_LENGTH} Zeichen haben`);
      }

      if (trimmedEmail.length > CORE_VALIDATION_CONSTRAINTS.EMAIL.MAX_LENGTH) {
        errors.push(`Email darf maximal ${CORE_VALIDATION_CONSTRAINTS.EMAIL.MAX_LENGTH} Zeichen haben`);
      }

      // Pattern Validation
      const pattern = strictMode ? CORE_VALIDATION_PATTERNS.EMAIL_STRICT : CORE_VALIDATION_PATTERNS.EMAIL;
      if (!pattern.test(trimmedEmail)) {
        errors.push(options.customErrorMessage || 'Ungültige E-Mail-Adresse');
      }

      const isValid = errors.length === 0;

      this.logger.debug('Email validation completed', LogCategory.BUSINESS, {
        metadata: { email: trimmedEmail, isValid, strictMode, errorsCount: errors.length }
      });

      return { isValid, errors, fieldName: 'email' };

    } catch (error) {
      this.logger.error('Email validation failed', LogCategory.BUSINESS, {
        metadata: { email }
      }, error as Error);
      return { isValid: false, errors: ['Email-Validierung fehlgeschlagen'], fieldName: 'email' };
    }
  }

  // =============================================
  // PHONE VALIDATION (konsolidiert von 3 Orten)
  // =============================================

  /**
   * Phone Number Validation - Single Source of Truth
   * Ersetzt alle redundanten Phone-Validierungen im System
   */
  validatePhone(phone: string, options: ValidationOptions = {}): ValidationResult {
    const errors: string[] = [];
    const { allowEmpty = false, strictMode = false } = options;

    try {
      // Empty Check
      if (!phone || phone.trim().length === 0) {
        if (!allowEmpty) {
          errors.push('Telefonnummer ist erforderlich');
        }
        return { isValid: allowEmpty, errors, fieldName: 'phone' };
      }

      const cleanPhone = phone.replace(/[\s\-()]/g, '');

      // Length Validation
      if (cleanPhone.length < CORE_VALIDATION_CONSTRAINTS.PHONE.MIN_LENGTH) {
        errors.push(`Telefonnummer muss mindestens ${CORE_VALIDATION_CONSTRAINTS.PHONE.MIN_LENGTH} Ziffern haben`);
      }

      if (cleanPhone.length > CORE_VALIDATION_CONSTRAINTS.PHONE.MAX_LENGTH) {
        errors.push(`Telefonnummer darf maximal ${CORE_VALIDATION_CONSTRAINTS.PHONE.MAX_LENGTH} Ziffern haben`);
      }

      // Pattern Validation
      const pattern = strictMode ? CORE_VALIDATION_PATTERNS.PHONE_STRICT : CORE_VALIDATION_PATTERNS.PHONE_INTERNATIONAL;
      if (!pattern.test(phone)) {
        errors.push(options.customErrorMessage || 'Ungültige Telefonnummer');
      }

      const isValid = errors.length === 0;

      this.logger.debug('Phone validation completed', LogCategory.BUSINESS, {
        metadata: { phone: cleanPhone, isValid, strictMode, errorsCount: errors.length }
      });

      return { isValid, errors, fieldName: 'phone' };

    } catch (error) {
      this.logger.error('Phone validation failed', LogCategory.BUSINESS, {
        metadata: { phone }
      }, error as Error);
      return { isValid: false, errors: ['Telefonnummer-Validierung fehlgeschlagen'], fieldName: 'phone' };
    }
  }

  // =============================================
  // URL VALIDATION (konsolidiert von 4 Orten)
  // =============================================

  /**
   * URL Validation - Single Source of Truth
   * Ersetzt alle redundanten URL-Validierungen im System
   */
  validateUrl(url: string, options: ValidationOptions = {}): ValidationResult {
    const errors: string[] = [];
    const { allowEmpty = false, strictMode = false } = options;

    try {
      // Empty Check
      if (!url || url.trim().length === 0) {
        if (!allowEmpty) {
          errors.push('URL ist erforderlich');
        }
        return { isValid: allowEmpty, errors, fieldName: 'url' };
      }

      const trimmedUrl = url.trim();

      // Length Validation
      if (trimmedUrl.length < CORE_VALIDATION_CONSTRAINTS.URL.MIN_LENGTH) {
        errors.push(`URL muss mindestens ${CORE_VALIDATION_CONSTRAINTS.URL.MIN_LENGTH} Zeichen haben`);
      }

      if (trimmedUrl.length > CORE_VALIDATION_CONSTRAINTS.URL.MAX_LENGTH) {
        errors.push(`URL darf maximal ${CORE_VALIDATION_CONSTRAINTS.URL.MAX_LENGTH} Zeichen haben`);
      }

      // Pattern Validation
      const pattern = strictMode ? CORE_VALIDATION_PATTERNS.URL : CORE_VALIDATION_PATTERNS.URL_SIMPLE;
      if (!pattern.test(trimmedUrl)) {
        errors.push(options.customErrorMessage || 'Ungültige URL');
      }

      // Advanced URL Validation (native URL constructor)
      if (strictMode) {
        try {
          new URL(trimmedUrl);
        } catch {
          errors.push('URL-Format ist ungültig');
        }
      }

      const isValid = errors.length === 0;

      this.logger.debug('URL validation completed', LogCategory.BUSINESS, {
        metadata: { url: trimmedUrl, isValid, strictMode, errorsCount: errors.length }
      });

      return { isValid, errors, fieldName: 'url' };

    } catch (error) {
      this.logger.error('URL validation failed', LogCategory.BUSINESS, {
        metadata: { url }
      }, error as Error);
      return { isValid: false, errors: ['URL-Validierung fehlgeschlagen'], fieldName: 'url' };
    }
  }

  // =============================================
  // STRING LENGTH VALIDATION
  // =============================================

  /**
   * String Length Validation - Universal
   */
  validateLength(
    value: string, 
    fieldName: string, 
    minLength: number, 
    maxLength: number, 
    options: ValidationOptions = {}
  ): ValidationResult {
    const errors: string[] = [];
    const { allowEmpty = false } = options;

    try {
      if (!value || value.trim().length === 0) {
        if (!allowEmpty) {
          errors.push(`${fieldName} ist erforderlich`);
        }
        return { isValid: allowEmpty, errors, fieldName };
      }

      const trimmedValue = value.trim();

      if (trimmedValue.length < minLength) {
        errors.push(`${fieldName} muss mindestens ${minLength} Zeichen haben`);
      }

      if (trimmedValue.length > maxLength) {
        errors.push(`${fieldName} darf maximal ${maxLength} Zeichen haben`);
      }

      const isValid = errors.length === 0;

      this.logger.debug('Length validation completed', LogCategory.BUSINESS, {
        metadata: { fieldName, length: trimmedValue.length, minLength, maxLength, isValid }
      });

      return { isValid, errors, fieldName };

    } catch (error) {
      this.logger.error('Length validation failed', LogCategory.BUSINESS, {
        metadata: { fieldName, value }
      }, error as Error);
      return { isValid: false, errors: [`${fieldName}-Validierung fehlgeschlagen`], fieldName };
    }
  }

  // =============================================
  // COMPOSITE VALIDATION METHODS
  // =============================================

  /**
   * Validate Multiple Fields
   * Für komplexe Form-Validierung
   */
  validateFields(validations: Array<() => ValidationResult>): ValidationResult {
    const allErrors: string[] = [];
    let allValid = true;

    try {
      for (const validation of validations) {
        const result = validation();
        if (!result.isValid) {
          allValid = false;
          allErrors.push(...result.errors);
        }
      }

      this.logger.debug('Multi-field validation completed', LogCategory.BUSINESS, {
        metadata: { totalValidations: validations.length, isValid: allValid, errorsCount: allErrors.length }
      });

      return {
        isValid: allValid,
        errors: allErrors
      };

    } catch (error) {
      this.logger.error('Multi-field validation failed', LogCategory.BUSINESS, {}, error as Error);
      return { isValid: false, errors: ['Validierung fehlgeschlagen'] };
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  /**
   * Quick Email Check (Legacy Support)
   * Für existierende Code-Kompatibilität
   */
  isValidEmail(email: string): boolean {
    return this.validateEmail(email, { allowEmpty: false }).isValid;
  }

  /**
   * Quick Phone Check (Legacy Support)
   */
  isValidPhone(phone: string): boolean {
    return this.validatePhone(phone, { allowEmpty: false }).isValid;
  }

  /**
   * Quick URL Check (Legacy Support)
   */
  isValidUrl(url: string): boolean {
    return this.validateUrl(url, { allowEmpty: false }).isValid;
  }

  /**
   * Get All Validation Patterns
   * Für externe Services die Patterns benötigen
   */
  getValidationPatterns() {
    return CORE_VALIDATION_PATTERNS;
  }

  /**
   * Get All Validation Constraints
   * Für externe Services die Constraints benötigen
   */
  getValidationConstraints() {
    return CORE_VALIDATION_CONSTRAINTS;
  }
}

/**
 * Global Validation Service Instance
 * Für einfache Import/Usage in anderen Services
 */
export const coreValidationService = CoreValidationService.getInstance(); 