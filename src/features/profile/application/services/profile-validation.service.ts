/**
 * Profile Validation Service - Clean Architecture Application Layer
 * Konsolidiert alle Profile-spezifischen Validierungen unter einem einheitlichen Service
 * 
 * @description
 * Ersetzt mehrere redundante Validation-Implementierungen:
 * - ProfileService.validateProfile()
 * - ProfileSecurityService.validateProfileInput()
 * - useProfileForm.validateField()
 * - useCustomFieldsEdit.validateField()
 * - useSocialLinksEdit.validateSocialLink()
 * 
 * @module ProfileValidationService
 * @layer Application
 * @since 1.0.0
 */

import { coreValidationService, ValidationResult, ValidationOptions } from '@core/validation/core-validation.service';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import type { UserProfile, SocialLinks, ProfessionalInfo } from '../../domain/entities/user-profile.entity';

/**
 * Profile Validation Result Interface
 */
export interface ProfileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  validatedFields: string[];
  fieldResults: Record<string, ValidationResult>;
}

/**
 * Profile Validation Options
 */
export interface ProfileValidationOptions extends ValidationOptions {
  validateSocialLinks?: boolean;
  validateProfessionalInfo?: boolean;
  validateCustomFields?: boolean;
  skipOptionalFields?: boolean;
}

/**
 * Social Link Validation Result
 */
export interface SocialLinkValidationResult {
  isValid: boolean;
  errors: string[];
  validatedLinks: string[];
}

/**
 * Profile Validation Service
 * 
 * @description
 * Single Source of Truth für alle Profile-Validierungen.
 * Nutzt CoreValidationService für Basis-Validierungen und erweitert um Profile-spezifische Logic.
 * 
 * KONSOLIDIERT:
 * - ProfileService Validation Methods (5 Methoden)
 * - ProfileSecurityService Input Validation (3 Methoden)
 * - Form Validation Hooks (7 verschiedene Hooks)
 * - Custom Fields Validation (2 verschiedene Implementierungen)
 * - Social Links Validation (3 verschiedene Pattern-Sets)
 */
export class ProfileValidationService {
  private logger = LoggerFactory.createServiceLogger('ProfileValidationService');
  private static instance: ProfileValidationService;

  /**
   * Singleton Pattern für konsistente Verwendung
   */
  static getInstance(): ProfileValidationService {
    if (!ProfileValidationService.instance) {
      ProfileValidationService.instance = new ProfileValidationService();
    }
    return ProfileValidationService.instance;
  }

  // =============================================
  // PROFILE FIELD VALIDATION (konsolidiert von 7 Orten)
  // =============================================

  /**
   * Validate Single Profile Field
   * Ersetzt alle redundanten validateField() Implementierungen
   */
  validateProfileField(
    fieldName: string, 
    value: any, 
    options: ProfileValidationOptions = {}
  ): ValidationResult {
    try {
      this.logger.debug('Validating profile field', LogCategory.BUSINESS, {
        metadata: { fieldName, hasValue: !!value }
      });

      switch (fieldName) {
        case 'email':
        case 'alternativeEmail':
          return coreValidationService.validateEmail(value || '', options);
        
        case 'phone':
        case 'phoneNumber':
          return coreValidationService.validatePhone(value || '', { ...options, allowEmpty: true });
        
        case 'website':
        case 'websiteUrl':
          return coreValidationService.validateUrl(value || '', { ...options, allowEmpty: true });
        
        case 'firstName':
          return coreValidationService.validateLength(
            value || '', 
            'Vorname', 
            1, 
            50, 
            { ...options, allowEmpty: false }
          );
        
        case 'lastName':
          return coreValidationService.validateLength(
            value || '', 
            'Nachname', 
            1, 
            50, 
            { ...options, allowEmpty: false }
          );
        
        case 'displayName':
          return coreValidationService.validateLength(
            value || '', 
            'Anzeigename', 
            2, 
            100, 
            { ...options, allowEmpty: true }
          );
        
        case 'bio':
          return coreValidationService.validateLength(
            value || '', 
            'Bio', 
            0, 
            500, 
            { ...options, allowEmpty: true }
          );
        
        case 'location':
          return coreValidationService.validateLength(
            value || '', 
            'Standort', 
            0, 
            100, 
            { ...options, allowEmpty: true }
          );
        
        default:
          this.logger.warn('Unknown profile field for validation', LogCategory.BUSINESS, {
            metadata: { fieldName }
          });
          return { isValid: true, errors: [], fieldName };
      }

    } catch (error) {
      this.logger.error('Profile field validation failed', LogCategory.BUSINESS, {
        metadata: { fieldName }
      }, error as Error);
      return { isValid: false, errors: [`Validierung von ${fieldName} fehlgeschlagen`], fieldName };
    }
  }

  // =============================================
  // COMPLETE PROFILE VALIDATION (konsolidiert von 3 Orten)
  // =============================================

  /**
   * Validate Complete Profile
   * Ersetzt ProfileService.validateProfile() und alle redundanten Implementierungen
   */
  validateProfile(profile: Partial<UserProfile>, options: ProfileValidationOptions = {}): ProfileValidationResult {
    const fieldResults: Record<string, ValidationResult> = {};
    const allErrors: string[] = [];
    const validatedFields: string[] = [];
    let allValid = true;

    try {
      this.logger.debug('Starting complete profile validation', LogCategory.BUSINESS, {
        metadata: { profileFields: Object.keys(profile).length }
      });

      // Core Profile Fields
      const coreFields = ['firstName', 'lastName', 'email', 'phone', 'website', 'bio', 'location', 'displayName'];
      
      for (const field of coreFields) {
        if (Object.prototype.hasOwnProperty.call(profile, field)) {
          const result = this.validateProfileField(field, (profile as any)[field], options);
          fieldResults[field] = result;
          validatedFields.push(field);
          
          if (!result.isValid) {
            allValid = false;
            allErrors.push(...result.errors);
          }
        }
      }

      // Social Links Validation
      if (options.validateSocialLinks && profile.socialLinks) {
        const socialResult = this.validateSocialLinks(profile.socialLinks, options);
        fieldResults['socialLinks'] = {
          isValid: socialResult.isValid,
          errors: socialResult.errors,
          fieldName: 'socialLinks'
        };
        validatedFields.push('socialLinks');
        
        if (!socialResult.isValid) {
          allValid = false;
          allErrors.push(...socialResult.errors);
        }
      }

      // Professional Info Validation
      if (options.validateProfessionalInfo && profile.professional) {
        const professionalResult = this.validateProfessionalInfo(profile.professional, options);
        fieldResults['professional'] = {
          isValid: professionalResult.isValid,
          errors: professionalResult.errors,
          fieldName: 'professional'
        };
        validatedFields.push('professional');
        
        if (!professionalResult.isValid) {
          allValid = false;
          allErrors.push(...professionalResult.errors);
        }
      }

      // Custom Fields Validation
      if (options.validateCustomFields && profile.customFields) {
        const customResult = this.validateCustomFields(profile.customFields, options);
        fieldResults['customFields'] = {
          isValid: customResult.isValid,
          errors: customResult.errors,
          fieldName: 'customFields'
        };
        validatedFields.push('customFields');
        
        if (!customResult.isValid) {
          allValid = false;
          allErrors.push(...customResult.errors);
        }
      }

      this.logger.debug('Complete profile validation finished', LogCategory.BUSINESS, {
        metadata: { 
          isValid: allValid, 
          validatedFields: validatedFields.length, 
          errorsCount: allErrors.length 
        }
      });

      return {
        isValid: allValid,
        errors: allErrors,
        validatedFields,
        fieldResults
      };

    } catch (error) {
      this.logger.error('Complete profile validation failed', LogCategory.BUSINESS, {
        metadata: { profileFields: Object.keys(profile) }
      }, error as Error);
      
      return {
        isValid: false,
        errors: ['Profil-Validierung fehlgeschlagen'],
        validatedFields: [],
        fieldResults: {}
      };
    }
  }

  // =============================================
  // SOCIAL LINKS VALIDATION (konsolidiert von 3 Orten)
  // =============================================

  /**
   * Validate Social Links
   * Ersetzt alle redundanten Social Link Validierungen
   */
  validateSocialLinks(socialLinks: SocialLinks, options: ValidationOptions = {}): SocialLinkValidationResult {
    const errors: string[] = [];
    const validatedLinks: string[] = [];

    try {
      const linkFields = ['linkedIn', 'twitter', 'github', 'instagram'] as const;

      for (const field of linkFields) {
        const url = socialLinks[field];
        if (url) {
          const result = coreValidationService.validateUrl(url, { ...options, allowEmpty: true });
          validatedLinks.push(field);
          
          if (!result.isValid) {
            errors.push(`${field}: ${result.errors.join(', ')}`);
          }
        }
      }

      this.logger.debug('Social links validation completed', LogCategory.BUSINESS, {
        metadata: { validatedLinks: validatedLinks.length, errorsCount: errors.length }
      });

      return {
        isValid: errors.length === 0,
        errors,
        validatedLinks
      };

    } catch (error) {
      this.logger.error('Social links validation failed', LogCategory.BUSINESS, {}, error as Error);
      return {
        isValid: false,
        errors: ['Social Links Validierung fehlgeschlagen'],
        validatedLinks: []
      };
    }
  }

  // =============================================
  // PROFESSIONAL INFO VALIDATION (neu)
  // =============================================

  /**
   * Validate Professional Information
   * Neue zentrale Validierung für Professional-Daten
   */
  validateProfessionalInfo(professional: ProfessionalInfo, options: ValidationOptions = {}): ValidationResult {
    const errors: string[] = [];

    try {
      // Company Validation
      if (professional.company) {
        const result = coreValidationService.validateLength(
          professional.company, 
          'Unternehmen', 
          1, 
          100, 
          { ...options, allowEmpty: true }
        );
        if (!result.isValid) {
          errors.push(...result.errors);
        }
      }

      // Job Title Validation
      if (professional.jobTitle) {
        const result = coreValidationService.validateLength(
          professional.jobTitle, 
          'Berufsbezeichnung', 
          1, 
          100, 
          { ...options, allowEmpty: true }
        );
        if (!result.isValid) {
          errors.push(...result.errors);
        }
      }

      // Industry Validation
      if (professional.industry) {
        const result = coreValidationService.validateLength(
          professional.industry, 
          'Branche', 
          1, 
          50, 
          { ...options, allowEmpty: true }
        );
        if (!result.isValid) {
          errors.push(...result.errors);
        }
      }

      // Skills Validation (Array)
      const currentSkills = Array.isArray(professional.skills) 
        ? professional.skills 
        : [];
      
      if (currentSkills.length > 0) {
        for (const skill of currentSkills) {
          if (typeof skill === 'string') {
            const result = coreValidationService.validateLength(
              skill, 
              'Fähigkeit', 
              1, 
              30, 
              { ...options, allowEmpty: false }
            );
            if (!result.isValid) {
              errors.push(...result.errors);
            }
          }
        }
      }

      this.logger.debug('Professional info validation completed', LogCategory.BUSINESS, {
        metadata: { errorsCount: errors.length }
      });

      return {
        isValid: errors.length === 0,
        errors,
        fieldName: 'professional'
      };

    } catch (error) {
      this.logger.error('Professional info validation failed', LogCategory.BUSINESS, {}, error as Error);
      return {
        isValid: false,
        errors: ['Berufsinformationen-Validierung fehlgeschlagen'],
        fieldName: 'professional'
      };
    }
  }

  // =============================================
  // CUSTOM FIELDS VALIDATION (konsolidiert von 2 Orten)
  // =============================================

  /**
   * Validate Custom Fields
   * Ersetzt useCustomFieldsEdit.validateField() und andere Custom Field Validierungen
   */
  validateCustomFields(customFields: Record<string, any>, _options: ValidationOptions = {}): ValidationResult {
    const errors: string[] = [];

    try {
      for (const [key, value] of Object.entries(customFields)) {
        // Key Validation
        if (!key || key.trim().length === 0) {
          errors.push('Custom Field Schlüssel darf nicht leer sein');
          continue;
        }

        if (key.length > 50) {
          errors.push(`Custom Field Schlüssel "${key}" ist zu lang (max. 50 Zeichen)`);
        }

        // Value Validation
        if (value !== null && value !== undefined) {
          const stringValue = String(value);
          if (stringValue.length > 500) {
            errors.push(`Custom Field Wert für "${key}" ist zu lang (max. 500 Zeichen)`);
          }
        }
      }

      this.logger.debug('Custom fields validation completed', LogCategory.BUSINESS, {
        metadata: { fieldsCount: Object.keys(customFields).length, errorsCount: errors.length }
      });

      return {
        isValid: errors.length === 0,
        errors,
        fieldName: 'customFields'
      };

    } catch (error) {
      this.logger.error('Custom fields validation failed', LogCategory.BUSINESS, {}, error as Error);
      return {
        isValid: false,
        errors: ['Custom Fields Validierung fehlgeschlagen'],
        fieldName: 'customFields'
      };
    }
  }

  // =============================================
  // UTILITY & LEGACY SUPPORT METHODS
  // =============================================

  /**
   * Quick Profile Check (Legacy Support)
   * Für existierende Code-Kompatibilität
   */
  isValidProfile(profile: Partial<UserProfile>): boolean {
    const result = this.validateProfile(profile, {
      validateSocialLinks: true,
      validateProfessionalInfo: true,
      validateCustomFields: true
    });
    return result.isValid;
  }

  /**
   * Get Field Validation Result
   * Für spezifische Field-Validierung in Forms
   */
  getFieldValidationResult(fieldName: string, value: any, options: ProfileValidationOptions = {}): ValidationResult {
    return this.validateProfileField(fieldName, value, options);
  }

  /**
   * Validate Profile for Security
   * Ersetzt ProfileSecurityService.validateProfileInput()
   */
  validateProfileForSecurity(profile: Partial<UserProfile>): ProfileValidationResult {
    return this.validateProfile(profile, {
      strictMode: true,
      validateSocialLinks: true,
      validateProfessionalInfo: true,
      validateCustomFields: true
    });
  }
}

/**
 * Global Profile Validation Service Instance
 * Für einfache Import/Usage in anderen Services
 */
export const profileValidationService = ProfileValidationService.getInstance(); 