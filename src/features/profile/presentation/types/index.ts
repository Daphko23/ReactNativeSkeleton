/**
 * Profile Presentation Types - Barrel Export
 * 
 * @fileoverview Centralized export point for all presentation layer types.
 * Provides clean, organized imports for profile-related presentation types
 * following Enterprise architecture patterns with proper layer separation.
 * 
 * @module ProfilePresentationTypes
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */

import type { BaseProfileScreenProps } from './navigation.types';

// =============================================================================
// NAVIGATION TYPES
// =============================================================================

export type {
  BaseProfileScreenProps,
  PrivacySettingsScreenProps,
  CustomFieldsEditScreenProps,
  AccountSettingsScreenProps,
  SocialLinksEditScreenProps,
  ProfileEditScreenProps,
  AvatarUploadScreenProps,
  SkillsManagementScreenProps,
  SocialLinksEditScreenNavigationProp,
  BaseScreenState,
  NavigationMethods,
  ScreenLifecycleMethods,
} from './navigation.types';

// =============================================================================
// TEST IDS
// =============================================================================

export {
  PRIVACY_SETTINGS_TEST_IDS,
  CUSTOM_FIELDS_TEST_IDS,
  ACCOUNT_SETTINGS_TEST_IDS,
  SOCIAL_LINKS_TEST_IDS,
  PROFILE_EDIT_TEST_IDS,
  AVATAR_UPLOAD_TEST_IDS,
  SKILLS_MANAGEMENT_TEST_IDS,
  PROFILE_NAVIGATION_TEST_IDS,
} from './test-ids.types';

export type {
  PrivacySettingsTestID,
  CustomFieldsTestID,
  AccountSettingsTestID,
  SocialLinksTestID,
  ProfileEditTestID,
  AvatarUploadTestID,
  SkillsManagementTestID,
  ProfileNavigationTestID,
  AllProfileTestIDs,
} from './test-ids.types';

// =============================================================================
// CUSTOM FIELDS TYPES (Required by Hooks & Screens)
// =============================================================================

/**
 * Custom field type definitions for presentation layer
 * 
 * @description Extended from domain entity with presentation-specific metadata
 * @since 1.0.0
 */
export type CustomFieldType = 
  | 'text' 
  | 'email' 
  | 'url' 
  | 'phone' 
  | 'date' 
  | 'select' 
  | 'multiselect' 
  | 'textarea'
  | 'number'
  | 'boolean';

/**
 * Custom field instance for editing
 * 
 * @description Extends domain CustomFieldDefinition with presentation state
 * @since 1.0.0
 */
export interface CustomField {
  id: string;
  key: string;
  label: string;
  value: string;
  type: CustomFieldType;
  required: boolean;
  placeholder?: string;
  order: number;
  options?: string[];
  metadata?: {
    createdAt?: Date;
    updatedAt?: Date;
    source?: 'user' | 'template' | 'import';
  };
}

/**
 * Custom field template for quick creation
 * 
 * @description Pre-defined field templates for common use cases
 * @since 1.0.0
 */
export interface CustomFieldTemplate {
  key: string;
  label: string;
  type: CustomFieldType;
  placeholder?: string;
  required?: boolean;
  category: 'personal' | 'professional' | 'contact' | 'other';
  description?: string;
  icon?: string;
}

/**
 * Custom fields edit hook return interface
 * 
 * @description Complete interface for custom fields editing functionality
 * @since 1.0.0
 */
export interface UseCustomFieldsEditReturn {
  // State
  customFields: CustomField[];
  localFields: CustomField[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasChanges: boolean;
  
  // Field operations
  addField: (label: string, type: CustomFieldType) => void;
  updateField: (id: string, updates: Partial<CustomField>) => void;
  removeField: (id: string) => void;
  reorderFields: (fields: CustomField[]) => void;
  
  // Form operations
  save: () => Promise<void>;
  reset: () => void;
  
  // Validation
  validateField: (field: CustomField) => { isValid: boolean; errors: string[] };
  validateAllFields: () => Promise<boolean>;
  
  // Templates
  fieldTemplates: CustomFieldTemplate[];
  fieldTypes: CustomFieldType[];
  
  // Screen helpers
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
}

/**
 * Default field types available in the system
 * 
 * @description Standard field types with localized labels
 * @since 1.0.0
 */
export const DEFAULT_FIELD_TYPES: Array<{
  type: CustomFieldType;
  label: string;
  icon: string;
}> = [
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'email', label: 'E-Mail', icon: '📧' },
  { type: 'url', label: 'URL', icon: '🔗' },
  { type: 'phone', label: 'Telefon', icon: '📞' },
  { type: 'date', label: 'Datum', icon: '📅' },
  { type: 'textarea', label: 'Langtext', icon: '📄' },
  { type: 'select', label: 'Auswahl', icon: '📋' },
  { type: 'number', label: 'Zahl', icon: '🔢' },
];

/**
 * Default field templates for quick creation
 * 
 * @description Pre-configured templates for common custom fields
 * @since 1.0.0
 */
export const DEFAULT_FIELD_TEMPLATES: CustomFieldTemplate[] = [
  {
    key: 'languages',
    label: 'Sprachen',
    type: 'text',
    placeholder: 'Deutsch, Englisch, Spanisch...',
    category: 'personal',
    description: 'Ihre Sprachkenntnisse',
    icon: '🌍',
  },
  {
    key: 'hobbies',
    label: 'Hobbys',
    type: 'text',
    placeholder: 'Fotografie, Sport, Musik...',
    category: 'personal',
    description: 'Ihre Interessen und Hobbys',
    icon: '🎨',
  },
  {
    key: 'personalWebsite',
    label: 'Persönliche Website',
    type: 'url',
    placeholder: 'https://ihre-website.com',
    category: 'contact',
    description: 'Link zu Ihrer persönlichen Website',
    icon: '🌐',
  },
  {
    key: 'certifications',
    label: 'Zertifikate',
    type: 'textarea',
    placeholder: 'AWS Certified, Google Cloud...',
    category: 'professional',
    description: 'Ihre beruflichen Zertifikate',
    icon: '🏆',
  },
  {
    key: 'education',
    label: 'Ausbildung',
    type: 'textarea',
    placeholder: 'Universität, Abschluss, Jahr...',
    category: 'professional',
    description: 'Ihr Bildungsweg',
    icon: '🎓',
  },
  {
    key: 'emergencyContact',
    label: 'Notfallkontakt',
    type: 'phone',
    placeholder: '+49 123 456789',
    category: 'contact',
    description: 'Notfallkontakt Telefonnummer',
    icon: '🚨',
  },
];

/**
 * Custom fields constants
 * 
 * @description Configuration constants for custom fields
 * @since 1.0.0
 */
export const CUSTOM_FIELDS_CONSTANTS = {
  MAX_FIELDS: 20,
  MIN_LABEL_LENGTH: 2,
  MAX_LABEL_LENGTH: 50,
  MAX_FIELD_LENGTH: 500,
  MAX_OPTIONS: 10,
} as const;

// =============================================================================
// LEGACY FORM TYPES (Backwards Compatibility)
// =============================================================================

/**
 * Legacy profile form types for backwards compatibility
 * 
 * @description These types are maintained for backwards compatibility with
 * existing form implementations. New implementations should use domain types.
 * 
 * @deprecated Use domain types from user-profile.entity.ts instead
 * @since 1.0.0
 */
export interface ProfileFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  
  // Contact Information
  location?: string;
  website?: string;
  phone?: string;
  
  // Professional Information
  company?: string;
  jobTitle?: string;
  industry?: string;
  workLocation?: 'remote' | 'onsite' | 'hybrid';
  skills: string[];
  
  // Social Links (use domain types for new implementations)
  linkedIn?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  
  // Custom Fields (extensible)
  customFields?: {
    notes?: string;
    [key: string]: any;
  };
}

/**
 * Legacy profile form errors for backwards compatibility
 * 
 * @deprecated Use domain validation types instead
 * @since 1.0.0
 */
export interface ProfileFormErrors {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  website?: string;
  phone?: string;
  linkedIn?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  skills?: string;
  customFields?: {
    notes?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Legacy profile form options for backwards compatibility
 * 
 * @deprecated Use domain configuration types instead
 * @since 1.0.0
 */
export interface ProfileFormOptions {
  workLocationOptions: Array<{
    value: 'remote' | 'onsite' | 'hybrid';
    label: string;
  }>;
}

/**
 * Legacy profile form state for backwards compatibility
 * 
 * @deprecated Use BaseScreenState generic instead
 * @since 1.0.0
 */
export interface ProfileFormState {
  data: ProfileFormData;
  errors: ProfileFormErrors;
  isLoading: boolean;
  hasChanges: boolean;
  isValid: boolean;
}

/**
 * Legacy form field types for backwards compatibility
 * 
 * @deprecated Use domain field definitions instead
 * @since 1.0.0
 */
export type ProfileFormField = keyof ProfileFormData;
export type ProfileFormErrorField = keyof ProfileFormErrors;

// =============================================================================
// RE-EXPORTS FROM DOMAIN LAYER
// =============================================================================

/**
 * Re-exported domain types for presentation layer convenience
 * 
 * @description These re-exports provide convenient access to domain types
 * commonly used in presentation components without requiring direct domain imports.
 */

// Domain entities (primary source of truth)
export type {
  UserProfile,
  PrivacySettings,
  SocialLinks,
  ProfessionalInfo,
  NotificationPreferences,
  AccessibilitySettings,
  ProfileHistoryEntry,
} from '../../domain/entities/user-profile.entity';

// Domain social links types
export type {
  SocialPlatformKey,
  SocialPlatformCategory,
  SocialLink,
  SocialPlatformDefinition,
  SocialLinksCollection,
} from '../../domain/types/social-links.types';

// Domain validation types
export type {
  ValidationRule,
  ValidationResult,
  FieldValidationConfig,
  DomainValidationError,
} from '../../domain/types/validation.types';

// =============================================================================
// RE-EXPORTS FROM APPLICATION LAYER
// =============================================================================

/**
 * Re-exported application types for presentation layer convenience
 * 
 * @description These re-exports provide convenient access to application layer
 * DTOs and service interfaces commonly used in presentation components.
 */

export type {
  ProfileSummaryDTO,
  ProfileUpdateRequestDTO,
  ProfileServiceResult,
  IProfileService,
  ISocialLinksService,
  AccountStatsDTO,
  VerificationStatusDTO,
  DataUsageDTO,
  SecurityStatsDTO,
  ProfileAnalyticsDTO,
} from '../../application/types/profile-service.types';

// =============================================================================
// TYPE UTILITIES
// =============================================================================

/**
 * Utility type for optional profile fields
 * 
 * @description Helper type for making all profile fields optional.
 * Useful for partial updates and form state management.
 * 
 * @template T - Base profile type
 * @since 1.0.0
 */
export type PartialProfile<T extends Record<string, any>> = Partial<T>;

/**
 * Utility type for required profile fields
 * 
 * @description Helper type for defining which profile fields are required.
 * Useful for form validation and completeness checking.
 * 
 * @template T - Base profile type
 * @template K - Keys to make required
 * @since 1.0.0
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Screen component props utility type
 * 
 * @description Generic utility type for screen component props with navigation.
 * 
 * @template T - Additional props type
 * @since 1.0.0
 */
export type ScreenProps<T = object> = BaseProfileScreenProps & T; 