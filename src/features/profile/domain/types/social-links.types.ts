/**
 * Social Links Domain Types
 * 
 * @fileoverview Domain-level type definitions for social links business logic.
 * Defines the core business entities, rules, and constraints for social media
 * profile management within the profile domain. These types represent the
 * business domain independent of presentation or infrastructure concerns.
 * 
 * @module SocialLinksDomain
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Domain
 */

/**
 * Supported social media platform keys
 * 
 * @description Enumeration of all supported social media platforms in the domain.
 * This defines the business-approved platforms that users can link to their profiles.
 * 
 * @typedef {string} SocialPlatformKey
 * @since 1.0.0
 */
export type SocialPlatformKey = 
  | 'linkedin' 
  | 'github' 
  | 'twitter' 
  | 'instagram' 
  | 'facebook'
  | 'youtube'
  | 'behance' 
  | 'dribbble' 
  | 'medium'
  | 'website'
  | 'portfolio'
  | 'tiktok';

/**
 * Social platform categories for business organization
 * 
 * @description Business categorization of social platforms for better organization
 * and different business rules per category.
 * 
 * @typedef {string} SocialPlatformCategory
 * @since 1.0.0
 */
export type SocialPlatformCategory = 'professional' | 'social' | 'creative' | 'personal';

/**
 * Social link domain entity
 * 
 * @description Core business entity representing a social media link.
 * Contains all business-relevant information about a user's social media presence.
 * 
 * @interface SocialLink
 * @property {SocialPlatformKey} platform - The social media platform
 * @property {string} url - The complete URL to the social profile
 * @property {string} [username] - Extracted username/handle if applicable
 * @property {boolean} [isPublic] - Business visibility setting
 * @property {boolean} [verified] - Whether the link has been verified
 * @property {SocialLinkMetadata} [metadata] - Additional business metadata
 * 
 * @since 1.0.0
 */
export interface SocialLink {
  platform: SocialPlatformKey;
  url: string;
  username?: string;
  isPublic?: boolean;
  verified?: boolean;
  metadata?: SocialLinkMetadata;
}

/**
 * Social link business metadata
 * 
 * @description Business-relevant metadata for social links including
 * tracking, verification, and engagement data.
 * 
 * @interface SocialLinkMetadata
 * @property {Date} [createdAt] - When the link was first added
 * @property {Date} [updatedAt] - When the link was last modified
 * @property {Date} [lastVerified] - When the link was last verified
 * @property {number} [clickCount] - Business metric for link engagement
 * @property {number} [verificationAttempts] - Number of verification attempts
 * @property {string} [source] - How the link was added (manual, import, etc.)
 * 
 * @since 1.0.0
 */
export interface SocialLinkMetadata {
  createdAt?: Date;
  updatedAt?: Date;
  lastVerified?: Date;
  clickCount?: number;
  verificationAttempts?: number;
  source?: string;
}

/**
 * Social platform definition for business rules
 * 
 * @description Business definition of a social platform including
 * validation rules, categorization, and platform-specific business logic.
 * 
 * @interface SocialPlatformDefinition
 * @property {SocialPlatformKey} key - Unique platform identifier
 * @property {string} name - Human-readable platform name
 * @property {string} icon - Icon identifier for UI representation
 * @property {string} baseUrl - Base URL pattern for the platform
 * @property {string} placeholder - Example URL for user guidance
 * @property {RegExp} validation - Business validation pattern
 * @property {SocialPlatformCategory} category - Business category
 * @property {number} priority - Business priority for ordering
 * @property {boolean} isUrlType - Whether this platform uses full URLs
 * @property {Function} [formatUrl] - Business logic for URL formatting
 * @property {Function} [extractUsername] - Business logic for username extraction
 * 
 * @since 1.0.0
 */
export interface SocialPlatformDefinition {
  key: SocialPlatformKey;
  name: string;
  icon: string;
  baseUrl: string;
  placeholder: string;
  validation: RegExp;
  category: SocialPlatformCategory;
  priority: number;
  isUrlType: boolean;
  formatUrl?: (value: string) => string;
  extractUsername?: (value: string) => string;
}

/**
 * Social links collection interface
 * 
 * @description Business entity representing a user's complete social media presence.
 * Extends the base domain entity with business-specific collections and rules.
 * 
 * @interface SocialLinksCollection
 * @property {SocialLink[]} links - Array of social media links
 * @property {Date} lastUpdated - When the collection was last modified
 * @property {number} totalLinks - Business metric for collection size
 * @property {number} verifiedLinks - Business metric for verified links
 * @property {boolean} isComplete - Business completeness status
 * 
 * @since 1.0.0
 */
export interface SocialLinksCollection {
  links: SocialLink[];
  lastUpdated: Date;
  totalLinks: number;
  verifiedLinks: number;
  isComplete: boolean;
}

/**
 * Social links business validation result
 * 
 * @description Result of business-level validation for social links.
 * Provides detailed business validation information.
 * 
 * @interface SocialLinksValidationResult
 * @property {boolean} isValid - Overall validation status
 * @property {Record<SocialPlatformKey, string[]>} errors - Platform-specific errors
 * @property {Record<SocialPlatformKey, string[]>} [warnings] - Platform-specific warnings
 * @property {number} totalValidLinks - Business metric for valid links
 * 
 * @since 1.0.0
 */
export interface SocialLinksValidationResult {
  isValid: boolean;
  errors: Record<SocialPlatformKey, string[]>;
  warnings?: Record<SocialPlatformKey, string[]>;
  totalValidLinks: number;
}

/**
 * Business constants for social links domain
 * 
 * @description Domain-level business constants that define business rules
 * and constraints for social links management.
 * 
 * @constant
 * @since 1.0.0
 */
export const SOCIAL_LINKS_DOMAIN_CONSTANTS = {
  MAX_LINKS_PER_USER: 20,
  MAX_URL_LENGTH: 500,
  MIN_USERNAME_LENGTH: 1,
  MAX_USERNAME_LENGTH: 100,
  VERIFICATION_TIMEOUT_HOURS: 24,
  MAX_VERIFICATION_ATTEMPTS: 3,
  CATEGORIES: {
    PROFESSIONAL: 'professional',
    SOCIAL: 'social',
    CREATIVE: 'creative',
    PERSONAL: 'personal',
  },
} as const;

/**
 * Platform validation patterns for business rules
 * 
 * @description Regular expressions for validating social media URLs
 * based on business requirements and platform standards.
 * 
 * @constant
 * @since 1.0.0
 */
export const SOCIAL_PLATFORM_VALIDATION_PATTERNS = {
  LINKEDIN: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9._-]+\/?$/,
  GITHUB: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9._-]+\/?$/,
  TWITTER: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9._-]+\/?$/,
  INSTAGRAM: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/,
  FACEBOOK: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/,
  YOUTUBE: /^https?:\/\/(www\.)?youtube\.com\/(channel|c|user)\/[a-zA-Z0-9._-]+\/?$/,
  BEHANCE: /^https?:\/\/(www\.)?behance\.net\/[a-zA-Z0-9._-]+\/?$/,
  DRIBBBLE: /^https?:\/\/(www\.)?dribbble\.com\/[a-zA-Z0-9._-]+\/?$/,
  MEDIUM: /^https?:\/\/([a-zA-Z0-9._-]+\.)?medium\.com(\/[a-zA-Z0-9._-]+)?\/?$/,
  WEBSITE: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  PORTFOLIO: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  TIKTOK: /^https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._-]+\/?$/,
} as const;

/**
 * Default platform definitions for business logic
 * 
 * @description Pre-configured platform definitions with business rules
 * and validation patterns for all supported social media platforms.
 * 
 * @constant
 * @since 1.0.0
 */
export const DEFAULT_SOCIAL_PLATFORMS: readonly SocialPlatformDefinition[] = [
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    baseUrl: 'https://linkedin.com/in/',
    placeholder: 'https://linkedin.com/in/username',
    validation: SOCIAL_PLATFORM_VALIDATION_PATTERNS.LINKEDIN,
    category: 'professional',
    priority: 1,
    isUrlType: true,
    extractUsername: (url: string) => url.split('/').pop() || '',
  },
  {
    key: 'github',
    name: 'GitHub',
    icon: 'github',
    baseUrl: 'https://github.com/',
    placeholder: 'https://github.com/username',
    validation: SOCIAL_PLATFORM_VALIDATION_PATTERNS.GITHUB,
    category: 'professional',
    priority: 2,
    isUrlType: true,
    extractUsername: (url: string) => url.split('/').pop() || '',
  },
  {
    key: 'twitter',
    name: 'Twitter/X',
    icon: 'twitter',
    baseUrl: 'https://twitter.com/',
    placeholder: 'https://twitter.com/username',
    validation: SOCIAL_PLATFORM_VALIDATION_PATTERNS.TWITTER,
    category: 'social',
    priority: 3,
    isUrlType: true,
    extractUsername: (url: string) => url.split('/').pop() || '',
  },
  // Additional platforms can be added following the same pattern
] as const; 