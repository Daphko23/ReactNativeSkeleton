/**
 * Profile Validation Schemas - React Native 2025 Enterprise Standards  
 * 🚀 PHASE 4: APPLICATION LAYER ORCHESTRATION
 * 
 * ✅ ENTERPRISE FEATURES:
 * - Zod Schema Validation für Type Safety
 * - Domain-level Business Rules
 * - Internationalization Support
 * - Nested Object Validation
 * - Custom Validation Rules
 * - Performance Optimized
 */

import { z } from 'zod';
import { ProfileErrorFactory } from '../errors/profile.errors';

// ==========================================
// 🎯 BASE VALIDATION RULES
// ==========================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[1-9][\d]{0,15}$/;
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

// ==========================================
// 🔤 PRIMITIVE SCHEMAS
// ==========================================

export const UserIdSchema = z.string()
  .min(1, 'User ID ist erforderlich')
  .uuid('User ID muss eine gültige UUID sein');

export const EmailSchema = z.string()
  .email('Ungültige E-Mail-Adresse')
  .max(254, 'E-Mail-Adresse zu lang (max. 254 Zeichen)')
  .refine((email) => EMAIL_REGEX.test(email), {
    message: 'E-Mail-Format ist ungültig'
  });

export const PhoneSchema = z.string()
  .optional()
  .refine((phone) => !phone || PHONE_REGEX.test(phone), {
    message: 'Ungültiges Telefonnummer-Format'
  });

export const WebsiteSchema = z.string()
  .optional()
  .refine((url) => !url || URL_REGEX.test(url), {
    message: 'Ungültige Website-URL'
  });

export const NameSchema = z.string()
  .min(1, 'Name ist erforderlich')
  .max(50, 'Name zu lang (max. 50 Zeichen)')
  .refine((name) => /^[a-zA-ZäöüÄÖÜß\s\-']+$/.test(name), {
    message: 'Name enthält ungültige Zeichen'
  });

export const BioSchema = z.string()
  .max(500, 'Bio zu lang (max. 500 Zeichen)')
  .optional();

export const LocationSchema = z.string()
  .max(100, 'Ortsangabe zu lang (max. 100 Zeichen)')
  .optional();

// ==========================================
// 🏢 PROFESSIONAL INFO SCHEMA
// ==========================================

export const WorkLocationSchema = z.enum(['remote', 'onsite', 'hybrid'], {
  errorMap: () => ({ message: 'Arbeitsort muss remote, onsite oder hybrid sein' })
});

export const ExperienceLevelSchema = z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'], {
  errorMap: () => ({ message: 'Erfahrungslevel ist ungültig' })
});

export const SkillsSchema = z.array(z.string().min(1).max(50))
  .max(20, 'Zu viele Skills (max. 20)')
  .optional();

export const ProfessionalInfoSchema = z.object({
  company: z.string().max(100, 'Firmenname zu lang').optional(),
  jobTitle: z.string().max(100, 'Jobtitel zu lang').optional(),
  industry: z.string().max(100, 'Branche zu lang').optional(),
  skills: SkillsSchema,
  workLocation: WorkLocationSchema.optional(),
  experience: ExperienceLevelSchema.optional()
}).optional();

// ==========================================
// 🔗 SOCIAL LINKS SCHEMA
// ==========================================

export const SocialLinksSchema = z.object({
  linkedIn: WebsiteSchema,
  twitter: WebsiteSchema,
  github: WebsiteSchema,
  instagram: WebsiteSchema
}).optional();

// ==========================================
// 🔐 PRIVACY SETTINGS SCHEMA
// ==========================================

export const VisibilityLevelSchema = z.enum(['public', 'friends', 'private'], {
  errorMap: () => ({ message: 'Sichtbarkeit muss public, friends oder private sein' })
});

export const PrivacySettingsSchema = z.object({
  profileVisibility: VisibilityLevelSchema,
  emailVisibility: VisibilityLevelSchema,
  phoneVisibility: VisibilityLevelSchema,
  locationVisibility: VisibilityLevelSchema,
  socialLinksVisibility: VisibilityLevelSchema,
  professionalInfoVisibility: VisibilityLevelSchema,
  showOnlineStatus: z.boolean(),
  allowDirectMessages: z.boolean(),
  allowFriendRequests: z.boolean(),
  showLastActive: z.boolean(),
  searchVisibility: z.boolean(),
  directoryListing: z.boolean(),
  allowProfileViews: z.boolean(),
  allowAnalytics: z.boolean(),
  allowThirdPartySharing: z.boolean(),
  trackProfileViews: z.boolean(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingCommunications: z.boolean(),
  fieldPrivacy: z.record(z.string(), VisibilityLevelSchema).optional()
}).optional();

// ==========================================
// 🎯 MAIN PROFILE SCHEMAS
// ==========================================

/**
 * 🏗️ CREATE PROFILE SCHEMA
 * Validation für neue Profile creation
 */
export const CreateProfileSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  displayName: z.string().max(100, 'Anzeigename zu lang').optional(),
  bio: BioSchema,
  phone: PhoneSchema,
  location: LocationSchema,
  website: WebsiteSchema,
  dateOfBirth: z.date().optional(),
  avatar: z.string().url('Avatar muss eine gültige URL sein').optional(),
  socialLinks: SocialLinksSchema,
  professional: ProfessionalInfoSchema,
  privacySettings: PrivacySettingsSchema,
  customFields: z.record(z.string(), z.any()).optional()
});

/**
 * ✏️ UPDATE PROFILE SCHEMA  
 * Validation für profile updates (alle Felder optional)
 */
export const UpdateProfileSchema = z.object({
  firstName: NameSchema.optional(),
  lastName: NameSchema.optional(),
  email: EmailSchema.optional(),
  displayName: z.string().max(100, 'Anzeigename zu lang').optional(),
  bio: BioSchema,
  phone: PhoneSchema,
  location: LocationSchema,
  website: WebsiteSchema,
  dateOfBirth: z.date().optional(),
  avatar: z.string().url('Avatar muss eine gültige URL sein').optional(),
  socialLinks: SocialLinksSchema,
  professional: ProfessionalInfoSchema,
  privacySettings: PrivacySettingsSchema,
  customFields: z.record(z.string(), z.any()).optional()
});

/**
 * 🔍 PROFILE SEARCH SCHEMA
 * Validation für search parameters
 */
export const ProfileSearchSchema = z.object({
  query: z.string().min(2, 'Suchbegriff zu kurz (min. 2 Zeichen)').max(100, 'Suchbegriff zu lang'),
  filters: z.object({
    role: z.string().optional(),
    isActive: z.boolean().optional(),
    location: z.string().optional(),
    industry: z.string().optional(),
    skills: z.array(z.string()).optional()
  }).optional()
});

// ==========================================
// 🎯 VALIDATION UTILITIES
// ==========================================

/**
 * 🛠️ PROFILE VALIDATOR CLASS
 * Centralized validation logic mit enterprise features
 */
export class ProfileValidator {
  /**
   * 🔍 VALIDATE CREATE PROFILE
   */
     static async validateCreateProfile(data: unknown) {
     try {
       return await CreateProfileSchema.parseAsync(data);
     } catch (error) {
       if (error instanceof z.ZodError) {
         throw ProfileErrorFactory.createValidationError(
           error.issues[0].path.join('.'),
           'invalid_data',
           error.issues[0].message
         );
       }
       throw error;
     }
   }

  /**
   * ✏️ VALIDATE UPDATE PROFILE
   */
     static async validateUpdateProfile(data: unknown) {
     try {
       return await UpdateProfileSchema.parseAsync(data);
     } catch (error) {
       if (error instanceof z.ZodError) {
         throw ProfileErrorFactory.createValidationError(
           error.issues[0].path.join('.'),
           'invalid_data',
           error.issues[0].message
         );
       }
       throw error;
     }
   }

  /**
   * 🔍 VALIDATE SEARCH PARAMETERS
   */
     static async validateSearchParams(data: unknown) {
     try {
       return await ProfileSearchSchema.parseAsync(data);
     } catch (error) {
       if (error instanceof z.ZodError) {
         throw ProfileErrorFactory.createValidationError(
           error.issues[0].path.join('.'),
           'invalid_data',
           error.issues[0].message
         );
       }
       throw error;
     }
   }

  /**
   * 🎯 VALIDATE SINGLE FIELD
   */
  static validateField(fieldName: string, value: any): { isValid: boolean; error?: string } {
    try {
      switch (fieldName) {
        case 'firstName':
        case 'lastName':
          NameSchema.parse(value);
          break;
        case 'email':
          EmailSchema.parse(value);
          break;
        case 'phone':
          PhoneSchema.parse(value);
          break;
        case 'website':
          WebsiteSchema.parse(value);
          break;
        case 'bio':
          BioSchema.parse(value);
          break;
        case 'location':
          LocationSchema.parse(value);
          break;
        default:
          return { isValid: true }; // Unknown fields are valid by default
      }
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          isValid: false, 
          error: error.issues[0].message 
        };
      }
      return { 
        isValid: false, 
        error: 'Unbekannter Validierungsfehler' 
      };
    }
  }

  /**
   * 📊 CALCULATE PROFILE COMPLETENESS
   */
  static calculateCompleteness(profile: any): number {
    const requiredFields = ['firstName', 'lastName', 'email'];
    const optionalFields = ['bio', 'phone', 'location', 'website', 'avatar'];
    const professionalFields = ['company', 'jobTitle', 'industry'];
    const socialFields = ['linkedIn', 'twitter', 'github'];

    const totalFields = requiredFields.length + optionalFields.length + professionalFields.length + socialFields.length;
    let filledFields = 0;

    // Count required fields
    for (const field of requiredFields) {
      if (profile[field]) filledFields++;
    }

    // Count optional fields
    for (const field of optionalFields) {
      if (profile[field]) filledFields++;
    }

    // Count professional fields
    if (profile.professional) {
      for (const field of professionalFields) {
        if (profile.professional[field]) filledFields++;
      }
    }

    // Count social fields
    if (profile.socialLinks) {
      for (const field of socialFields) {
        if (profile.socialLinks[field]) filledFields++;
      }
    }

    return Math.round((filledFields / totalFields) * 100);
  }

  /**
   * 🔐 VALIDATE PRIVACY SETTINGS
   */
  static validatePrivacySettings(data: unknown) {
    try {
      return PrivacySettingsSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ProfileErrorFactory.createValidationError(
          'privacySettings',
          data,
          error.issues[0].message
        );
      }
      throw error;
    }
  }
}

// ==========================================
// 🎯 TYPE EXPORTS
// ==========================================

export type CreateProfileData = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;
export type ProfileSearchData = z.infer<typeof ProfileSearchSchema>;
export type PrivacySettingsData = z.infer<typeof PrivacySettingsSchema>;

/**
 * 📋 MIGRATION GUIDE:
 * 
 * OLD WAY (React Hook Form validation only):
 * ```typescript
 * const validationRules = { required: true, maxLength: 50 };
 * ```
 * 
 * NEW WAY (Domain validation + UI validation):
 * ```typescript
 * // Domain validation
 * const validatedData = await ProfileValidator.validateUpdateProfile(data);
 * 
 * // UI validation (for real-time feedback)
 * const fieldValidation = ProfileValidator.validateField('firstName', value);
 * ```
 */ 