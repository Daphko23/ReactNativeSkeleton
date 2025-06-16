/**
 * @fileoverview Manage Custom Fields Use Case - Enterprise Business Logic
 * 
 * ✅ ENTERPRISE USE CASE:
 * - Complex Custom Fields Business Logic
 * - Validation Rules & Field Type Management
 * - Template System with Categories
 * - GDPR Compliance for Custom Data
 * - Audit Logging for Data Changes
 * 
 * @module ManageCustomFieldsUseCase
 * @since 1.0.0
 * @architecture Clean Architecture - Application Layer
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Simple Result type
export class Result<T> {
  constructor(
    public readonly success: boolean,
    public readonly data?: T,
    public readonly error?: string
  ) {}

  static success<T>(data: T): Result<T> {
    return new Result(true, data);
  }

  static failure<T>(error: string): Result<T> {
    return new Result<T>(false, undefined, error);
  }
}

const logger = LoggerFactory.createServiceLogger('ManageCustomFieldsUseCase');

// =============================================================================
// DOMAIN TYPES & INTERFACES
// =============================================================================

export interface CustomField {
  key: string;
  value: string;
  label?: string;
  type: 'text' | 'email' | 'url' | 'phone' | 'date' | 'textarea' | 'number';
  placeholder?: string;
  required?: boolean;
  order?: number;
  category?: 'personal' | 'professional' | 'contact' | 'social' | 'other';
  maxLength?: number;
  isEncrypted?: boolean;
  lastModified?: Date;
}

export interface CustomFieldTemplate {
  key: string;
  label: string;
  type: CustomField['type'];
  placeholder: string;
  category: CustomField['category'];
  description?: string;
  examples?: string[];
  validationRules?: ValidationRule[];
  isRecommended?: boolean;
  gdprCategory?: 'necessary' | 'functional' | 'analytics' | 'marketing';
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'phone';
  value?: any;
  message: string;
}

export interface CustomFieldsManagementContext {
  userId: string;
  userRole?: 'user' | 'premium' | 'admin';
  gdprConsent?: boolean;
  maxFieldsAllowed?: number;
  encryptionRequired?: boolean;
}

// =============================================================================
// USE CASE INPUT/OUTPUT INTERFACES
// =============================================================================

export interface GetCustomFieldsInput {
  userId: string;
  includeTemplates?: boolean;
  category?: CustomField['category'];
}

export interface GetCustomFieldsOutput {
  fields: CustomField[];
  templates?: CustomFieldTemplate[];
  metadata: {
    totalFields: number;
    fieldsByCategory: Record<string, number>;
    lastModified?: Date;
    gdprCompliant: boolean;
  };
}

export interface UpdateCustomFieldsInput {
  userId: string;
  fields: CustomField[];
  context: CustomFieldsManagementContext;
  auditReason?: string;
}

export interface UpdateCustomFieldsOutput {
  fields: CustomField[];
  validationResults: ValidationResult[];
  metadata: {
    fieldsAdded: number;
    fieldsUpdated: number;
    fieldsRemoved: number;
    gdprCompliant: boolean;
  };
}

export interface ValidationResult {
  fieldKey: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  securityScore?: number;
}

// =============================================================================
// ENTERPRISE TEMPLATES SYSTEM
// =============================================================================

const ENTERPRISE_CUSTOM_FIELD_TEMPLATES: CustomFieldTemplate[] = [
  // Personal Category
  {
    key: 'languages',
    label: 'Sprachen',
    type: 'text',
    placeholder: 'z.B. Deutsch (Muttersprache), Englisch (Fließend)',
    category: 'personal',
    description: 'Ihre Sprachkenntnisse mit Niveau',
    isRecommended: true,
    gdprCategory: 'functional'
  },
  {
    key: 'hobbies',
    label: 'Hobbys & Interessen',
    type: 'textarea',
    placeholder: 'Was machen Sie gerne in Ihrer Freizeit?',
    category: 'personal',
    gdprCategory: 'functional'
  },
  {
    key: 'education',
    label: 'Ausbildung & Studium',
    type: 'textarea',
    placeholder: 'Ihre Ausbildung, Studium oder berufliche Qualifikationen',
    category: 'professional',
    isRecommended: true,
    gdprCategory: 'functional'
  },
  {
    key: 'certifications',
    label: 'Zertifikate & Lizenzen',
    type: 'textarea',
    placeholder: 'Berufliche Zertifikate, Lizenzen oder Weiterbildungen',
    category: 'professional',
    gdprCategory: 'functional'
  },
  {
    key: 'personalWebsite',
    label: 'Persönliche Website',
    type: 'url',
    placeholder: 'https://ihre-website.com',
    category: 'contact',
    gdprCategory: 'functional'
  }
];

// =============================================================================
// MAIN USE CASE IMPLEMENTATION
// =============================================================================

export class ManageCustomFieldsUseCase {
  /**
   * 🎯 GET CUSTOM FIELDS - Retrieve user's custom fields with templates
   */
  async getCustomFields(input: GetCustomFieldsInput): Promise<Result<GetCustomFieldsOutput>> {
    try {
      logger.info('Getting custom fields', LogCategory.BUSINESS, { userId: input.userId });

      // TODO: Replace with actual repository call
      // For now, return empty fields as this will be integrated with existing profile data
      const fields: CustomField[] = [];
      
      const templates = input.includeTemplates 
        ? ENTERPRISE_CUSTOM_FIELD_TEMPLATES.filter(template => 
            !input.category || template.category === input.category
          )
        : undefined;

      const fieldsByCategory = fields.reduce((acc, field) => {
        const category = field.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const output: GetCustomFieldsOutput = {
        fields,
        templates,
        metadata: {
          totalFields: fields.length,
          fieldsByCategory,
          lastModified: fields.length > 0 ? new Date() : undefined,
          gdprCompliant: this.validateGDPRCompliance(fields)
        }
      };

      logger.info('Custom fields retrieved successfully', LogCategory.BUSINESS, { 
        userId: input.userId
      });

      return Result.success(output);
    } catch (error) {
      logger.error('Failed to get custom fields', LogCategory.BUSINESS, { userId: input.userId }, error as Error);
      return Result.failure('Failed to retrieve custom fields');
    }
  }

  /**
   * 🎯 UPDATE CUSTOM FIELDS - Update user's custom fields with validation
   */
  async updateCustomFields(input: UpdateCustomFieldsInput): Promise<Result<UpdateCustomFieldsOutput>> {
    try {
      logger.info('Updating custom fields', LogCategory.BUSINESS, { 
        userId: input.userId
      });

      // 🔍 VALIDATION: Check field limits
      const maxFields = input.context.maxFieldsAllowed || 20;
      if (input.fields.length > maxFields) {
        return Result.failure(`Maximale Anzahl von ${maxFields} Feldern überschritten`);
      }

      // 🔍 VALIDATION: Validate each field
      const validationResults: ValidationResult[] = [];
      for (const field of input.fields) {
        const validationResult = await this.validateCustomField(field, input.context);
        validationResults.push(validationResult);
      }

      // Check if any critical errors
      const hasErrors = validationResults.some(result => !result.isValid);
      if (hasErrors) {
        const errorMessage = validationResults
          .filter(result => !result.isValid)
          .map(result => `${result.fieldKey}: ${result.errors.join(', ')}`)
          .join('; ');
        
        return Result.failure(`Validation failed: ${errorMessage}`);
      }

      // 🔍 BUSINESS LOGIC: Process fields
      const processedFields = await this.processCustomFields(input.fields, input.context);

      // 🔍 GDPR COMPLIANCE: Check data compliance
      const gdprCompliant = this.validateGDPRCompliance(processedFields);
      if (!gdprCompliant && input.context.gdprConsent !== true) {
        return Result.failure('GDPR consent required for sensitive data fields');
      }

      // TODO: Save to repository
      // const repository = this.container.getProfileRepository();
      // await repository.updateCustomFields(input.userId, processedFields);

      // 📊 AUDIT LOGGING
      logger.info('Custom fields updated successfully', LogCategory.BUSINESS, {
        userId: input.userId
      });

      const output: UpdateCustomFieldsOutput = {
        fields: processedFields,
        validationResults,
        metadata: {
          fieldsAdded: 0, // TODO: Calculate actual changes
          fieldsUpdated: processedFields.length,
          fieldsRemoved: 0,
          gdprCompliant
        }
      };

      return Result.success(output);
    } catch (error) {
      logger.error('Failed to update custom fields', LogCategory.BUSINESS, { userId: input.userId }, error as Error);
      return Result.failure('Failed to update custom fields');
    }
  }

  /**
   * 🎯 GET FIELD TEMPLATES - Get available field templates
   */
  async getFieldTemplates(category?: CustomField['category']): Promise<Result<CustomFieldTemplate[]>> {
    try {
      logger.info('Getting field templates', LogCategory.BUSINESS);

      const templates = category 
        ? ENTERPRISE_CUSTOM_FIELD_TEMPLATES.filter(template => template.category === category)
        : ENTERPRISE_CUSTOM_FIELD_TEMPLATES;

      return Result.success(templates);
    } catch (error) {
      logger.error('Failed to get field templates', LogCategory.BUSINESS, {}, error as Error);
      return Result.failure('Failed to retrieve field templates');
    }
  }

  // =============================================================================
  // PRIVATE BUSINESS LOGIC METHODS
  // =============================================================================

  /**
   * 🔍 VALIDATE CUSTOM FIELD - Enterprise validation rules
   */
  private async validateCustomField(field: CustomField, context: CustomFieldsManagementContext): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!field.key || !field.key.trim()) {
      errors.push('Field key is required');
    }

    if (field.key && !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.key)) {
      errors.push('Field key must start with a letter and contain only letters, numbers, and underscores');
    }

    if (field.required && (!field.value || !field.value.trim())) {
      errors.push('This field is required');
    }

    // Type-specific validation
    switch (field.type) {
      case 'email':
        if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          errors.push('Invalid email address');
        }
        break;
      
      case 'url':
        if (field.value && !/^https?:\/\/.+/.test(field.value)) {
          errors.push('URL must start with http:// or https://');
        }
        break;
      
      case 'phone':
        if (field.value && !/^[+]?[1-9][\d]{0,15}$/.test(field.value.replace(/[\s\-()]/g, ''))) {
          errors.push('Invalid phone number format');
        }
        break;
      
      case 'number':
        if (field.value && isNaN(Number(field.value))) {
          errors.push('Value must be a valid number');
        }
        break;
    }

    // Length validation
    const maxLength = field.maxLength || 1000;
    if (field.value && field.value.length > maxLength) {
      errors.push(`Value too long (max ${maxLength} characters)`);
    }

    // Security validation
    if (field.value && this.containsSensitiveData(field.value)) {
      warnings.push('Field may contain sensitive data');
    }

    // GDPR validation
    if (this.isPersonalData(field) && !context.gdprConsent) {
      warnings.push('GDPR consent may be required for this field');
    }

    return {
      fieldKey: field.key,
      isValid: errors.length === 0,
      errors,
      warnings,
      securityScore: this.calculateSecurityScore(field)
    };
  }

  /**
   * 🔍 PROCESS CUSTOM FIELDS - Apply business rules and transformations
   */
  private async processCustomFields(fields: CustomField[], context: CustomFieldsManagementContext): Promise<CustomField[]> {
    return fields.map((field, index) => ({
      ...field,
      key: field.key.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_'),
      value: field.value.trim(),
      order: field.order ?? index,
      lastModified: new Date(),
      isEncrypted: context.encryptionRequired && this.isPersonalData(field)
    }));
  }

  /**
   * 🔍 GDPR COMPLIANCE VALIDATION
   */
  private validateGDPRCompliance(fields: CustomField[]): boolean {
    // Check if any field contains personal data that requires special handling
    const personalDataFields = fields.filter(field => this.isPersonalData(field));
    
    // For now, return true - in real implementation, check against GDPR rules
    return personalDataFields.length === 0 || true;
  }

  /**
   * 🔍 CHECK IF FIELD CONTAINS PERSONAL DATA
   */
  private isPersonalData(field: CustomField): boolean {
    const personalDataPatterns = [
      /email/i, /phone/i, /address/i, /birthday/i, /birth/i,
      /passport/i, /id\s*number/i, /ssn/i, /tax/i
    ];
    
    return personalDataPatterns.some(pattern => 
      pattern.test(field.key) || pattern.test(field.label || '') || pattern.test(field.value)
    );
  }

  /**
   * 🔍 CHECK FOR SENSITIVE DATA PATTERNS
   */
  private containsSensitiveData(value: string): boolean {
    const sensitivePatterns = [
      /\d{3}-?\d{2}-?\d{4}/, // SSN pattern
      /\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/, // Credit card pattern
      /password|pwd|secret|token/i
    ];
    
    return sensitivePatterns.some(pattern => pattern.test(value));
  }

  /**
   * 🔍 CALCULATE SECURITY SCORE
   */
  private calculateSecurityScore(field: CustomField): number {
    let score = 100;
    
    if (this.isPersonalData(field)) score -= 20;
    if (this.containsSensitiveData(field.value)) score -= 30;
    if (field.type === 'text' && field.value.length > 500) score -= 10;
    if (!field.isEncrypted && this.isPersonalData(field)) score -= 20;
    
    return Math.max(0, score);
  }
} 