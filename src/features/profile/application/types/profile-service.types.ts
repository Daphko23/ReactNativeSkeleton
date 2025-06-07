/**
 * Profile Application Service Types
 * 
 * @fileoverview Application layer type definitions for profile services and DTOs.
 * Defines interfaces for use cases, service contracts, and data transfer objects
 * that orchestrate between the domain and infrastructure layers. These types
 * represent application-specific concerns and business workflows.
 * 
 * @module ProfileApplicationTypes
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Application
 */

import { UserProfile, PrivacySettings } from '../../domain/entities/user-profile.entity';
import { SocialLink, SocialLinksCollection } from '../../domain/types/social-links.types';
import { ValidationResult, DomainValidationError } from '../../domain/types/validation.types';

/**
 * Profile summary data transfer object
 * 
 * @description Lightweight DTO containing essential profile information
 * for application use cases that don't require the full profile entity.
 * Used for performance optimization and reduced data transfer.
 * 
 * @interface ProfileSummaryDTO
 * @property {string} id - User profile identifier
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email address
 * @property {string} displayName - User's display name
 * @property {string} [avatarUrl] - URL to user's avatar image
 * @property {Date} createdAt - Account creation date
 * @property {Date} [lastLoginAt] - Last login timestamp
 * @property {boolean} emailVerified - Email verification status
 * @property {boolean} phoneVerified - Phone verification status
 * @property {number} [profileCompleteness] - Profile completion percentage
 * 
 * @since 1.0.0
 */
export interface ProfileSummaryDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  profileCompleteness?: number;
}

/**
 * Profile update request DTO
 * 
 * @description Data transfer object for profile update operations.
 * Represents the application-level contract for profile modifications.
 * 
 * @interface ProfileUpdateRequestDTO
 * @property {Partial<UserProfile>} profileData - Profile fields to update
 * @property {Partial<PrivacySettings>} [privacySettings] - Privacy settings to update
 * @property {SocialLink[]} [socialLinks] - Social links to update
 * @property {Record<string, any>} [customFields] - Custom fields to update
 * @property {string} [updateReason] - Reason for the update (audit trail)
 * 
 * @since 1.0.0
 */
export interface ProfileUpdateRequestDTO {
  profileData: Partial<UserProfile>;
  privacySettings?: Partial<PrivacySettings>;
  socialLinks?: SocialLink[];
  customFields?: Record<string, any>;
  updateReason?: string;
}

/**
 * Profile service operation result
 * 
 * @description Standardized result type for all profile service operations.
 * Provides consistent success/error handling across application use cases.
 * 
 * @interface ProfileServiceResult
 * @template T - Type of the result data
 * @property {boolean} success - Whether the operation succeeded
 * @property {T} [data] - Result data if successful
 * @property {string} [error] - Error message if failed
 * @property {DomainValidationError[]} [validationErrors] - Domain validation errors
 * @property {Record<string, any>} [metadata] - Additional operation metadata
 * 
 * @since 1.0.0
 */
export interface ProfileServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: DomainValidationError[];
  metadata?: Record<string, any>;
}

/**
 * Profile service interface
 * 
 * @description Application service contract for profile management operations.
 * Defines the use cases and business workflows for profile functionality.
 * 
 * @interface IProfileService
 * @since 1.0.0
 */
export interface IProfileService {
  /**
   * Retrieves a user profile by ID
   * 
   * @param {string} userId - User identifier
   * @returns {Promise<ProfileServiceResult<UserProfile>>} Profile data or error
   */
  getProfile(userId: string): Promise<ProfileServiceResult<UserProfile>>;

  /**
   * Updates a user profile
   * 
   * @param {string} userId - User identifier
   * @param {ProfileUpdateRequestDTO} updateData - Profile update data
   * @returns {Promise<ProfileServiceResult<UserProfile>>} Updated profile or error
   */
  updateProfile(userId: string, updateData: ProfileUpdateRequestDTO): Promise<ProfileServiceResult<UserProfile>>;

  /**
   * Validates profile data
   * 
   * @param {Partial<UserProfile>} profileData - Profile data to validate
   * @returns {Promise<ValidationResult>} Validation result
   */
  validateProfile(profileData: Partial<UserProfile>): Promise<ValidationResult>;

  /**
   * Calculates profile completeness
   * 
   * @param {UserProfile} profile - Profile to analyze
   * @returns {Promise<number>} Completeness percentage
   */
  calculateCompleteness(profile: UserProfile): Promise<number>;

  /**
   * Exports user profile data
   * 
   * @param {string} userId - User identifier
   * @param {'json' | 'csv' | 'xml'} format - Export format
   * @returns {Promise<ProfileServiceResult<string>>} Exported data or error
   */
  exportProfileData(userId: string, format: 'json' | 'csv' | 'xml'): Promise<ProfileServiceResult<string>>;
}

/**
 * Social links service interface
 * 
 * @description Application service contract for social links management.
 * Handles business workflows for social media profile integration.
 * 
 * @interface ISocialLinksService
 * @since 1.0.0
 */
export interface ISocialLinksService {
  /**
   * Retrieves user's social links
   * 
   * @param {string} userId - User identifier
   * @returns {Promise<ProfileServiceResult<SocialLinksCollection>>} Social links or error
   */
  getSocialLinks(userId: string): Promise<ProfileServiceResult<SocialLinksCollection>>;

  /**
   * Updates user's social links
   * 
   * @param {string} userId - User identifier
   * @param {SocialLink[]} links - Social links to update
   * @returns {Promise<ProfileServiceResult<SocialLinksCollection>>} Updated links or error
   */
  updateSocialLinks(userId: string, links: SocialLink[]): Promise<ProfileServiceResult<SocialLinksCollection>>;

  /**
   * Validates a social media link
   * 
   * @param {SocialLink} link - Link to validate
   * @returns {Promise<ValidationResult>} Validation result
   */
  validateSocialLink(link: SocialLink): Promise<ValidationResult>;

  /**
   * Verifies a social media link
   * 
   * @param {string} userId - User identifier
   * @param {string} platform - Social platform
   * @returns {Promise<ProfileServiceResult<boolean>>} Verification result
   */
  verifySocialLink(userId: string, platform: string): Promise<ProfileServiceResult<boolean>>;
}

/**
 * Account statistics DTO
 * 
 * @description Data transfer object for account-related statistics and metrics.
 * Used by application services to provide account insights and analytics.
 * 
 * @interface AccountStatsDTO
 * @property {number} profileCompleteness - Profile completion percentage
 * @property {Date} memberSince - Account creation date
 * @property {number} totalLogins - Total number of logins
 * @property {Date} lastActivityAt - Last activity timestamp
 * @property {VerificationStatusDTO} verificationStatus - Verification status details
 * @property {DataUsageDTO} [dataUsage] - Data usage statistics
 * @property {SecurityStatsDTO} [security] - Security-related statistics
 * 
 * @since 1.0.0
 */
export interface AccountStatsDTO {
  profileCompleteness: number;
  memberSince: Date;
  totalLogins: number;
  lastActivityAt: Date;
  verificationStatus: VerificationStatusDTO;
  dataUsage?: DataUsageDTO;
  security?: SecurityStatsDTO;
}

/**
 * Verification status DTO
 * 
 * @description Data transfer object for user verification status across different channels.
 * 
 * @interface VerificationStatusDTO
 * @property {boolean} email - Email verification status
 * @property {boolean} phone - Phone verification status
 * @property {boolean} identity - Identity verification status
 * 
 * @since 1.0.0
 */
export interface VerificationStatusDTO {
  email: boolean;
  phone: boolean;
  identity: boolean;
}

/**
 * Data usage statistics DTO
 * 
 * @description Data transfer object for user data usage metrics and storage information.
 * 
 * @interface DataUsageDTO
 * @property {number} totalSize - Total data size in bytes
 * @property {number} activeDevices - Number of active devices
 * 
 * @since 1.0.0
 */
export interface DataUsageDTO {
  totalSize: number;
  activeDevices: number;
}

/**
 * Security statistics DTO
 * 
 * @description Data transfer object for security-related metrics and information.
 * 
 * @interface SecurityStatsDTO
 * @property {Date} lastLogin - Last login timestamp
 * @property {number} activeSessions - Number of active sessions
 * @property {boolean} mfaEnabled - Multi-factor authentication status
 * @property {number} activeDevices - Number of active devices
 * 
 * @since 1.0.0
 */
export interface SecurityStatsDTO {
  lastLogin: Date;
  activeSessions: number;
  mfaEnabled: boolean;
  activeDevices: number;
}

/**
 * Profile analytics DTO
 * 
 * @description Data transfer object for profile-related analytics and engagement metrics.
 * 
 * @interface ProfileAnalyticsDTO
 * @property {number} profileViews - Total profile views
 * @property {number} profileViewsToday - Profile views today
 * @property {number} searchAppearances - Search result appearances
 * @property {number} connectionRequests - Connection requests received
 * @property {Date} lastUpdated - Last analytics update
 * 
 * @since 1.0.0
 */
export interface ProfileAnalyticsDTO {
  profileViews: number;
  profileViewsToday: number;
  searchAppearances: number;
  connectionRequests: number;
  lastUpdated: Date;
} 