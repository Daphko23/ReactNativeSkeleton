/**
 * @fileoverview AUTH USER ENTITY - Enterprise User Domain Entity
 * @description Domain Entity für authenticated user mit Enterprise features.
 * Teil der Clean Architecture Domain Layer.
 * 
 * @businessRule BR-401: User entity with complete profile data
 * @businessRule BR-402: Security metadata integration
 * @businessRule BR-403: Domain-driven design entity pattern
 * @businessRule BR-404: Type-safe user data structure
 * 
 * @architecture Domain-driven design entity
 * @architecture Clean Architecture domain layer
 * @architecture Enterprise user data modeling
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthUserEntity
 * @namespace Auth.Domain.Entities
 */

import { UserStatus, UserRole } from '../types/security.types';

/**
 * @interface AuthUserMetadata
 * @description Extended user metadata for enterprise features
 */
export interface AuthUserMetadata {
  /** Last login timestamp */
  lastLoginAt?: string | null;
  /** Last activity timestamp */
  lastActiveAt?: string;
  /** Login count */
  loginCount: number;
  /** Device registration count */
  deviceCount: number;
  /** MFA setup status */
  mfaEnabled: boolean;
  /** Biometric auth enabled */
  biometricEnabled: boolean;
  /** Account security score (0-100) */
  securityScore: number;
  /** Account risk level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Preferred language */
  language: string;
  /** Timezone preference */
  timezone: string;
  /** Terms acceptance timestamp */
  termsAcceptedAt?: string;
  /** Privacy policy acceptance */
  privacyAcceptedAt?: string;
  /** Legacy compatibility fields */
  firstName?: string;
  lastName?: string;
  displayName?: string;
  theme?: string;
  sessionTimeout?: number;
  preferences?: any;
  billing?: any;
  lastAppVersion?: string;
}

/**
 * @interface AuthUserProfile
 * @description User profile information
 */
export interface AuthUserProfile {
  /** Profile display name */
  displayName?: string;
  /** Profile avatar URL */
  avatarUrl?: string;
  /** User bio/description */
  bio?: string;
  /** Phone number (verified) */
  phoneNumber?: string;
  /** Phone verification status */
  phoneVerified: boolean;
  /** Date of birth */
  dateOfBirth?: string;
  /** Gender */
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  /** Location information */
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  /** Social profile links */
  socialLinks?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

/**
 * @class AuthUser
 * @description Main authenticated user entity with enterprise features
 * 
 * @businessRule BR-405: Complete user entity with all required fields
 * @securityNote Contains sensitive user data - handle with care
 * @compliance GDPR Article 5 data minimization principle
 */
export class AuthUser {
  /** Unique user identifier */
  public readonly id: string;
  
  /** User email address */
  public readonly email: string;
  
  /** Email verification status */
  public readonly emailVerified: boolean;
  
  /** User first name */
  public readonly firstName?: string;
  
  /** User last name */
  public readonly lastName?: string;
  
  /** User account status */
  public readonly status: UserStatus;
  
  /** User role */
  public readonly role: UserRole;
  
  /** Account creation timestamp */
  public readonly createdAt: string;
  
  /** Last update timestamp */
  public readonly updatedAt: string;
  
  /** Extended user profile */
  public readonly profile?: AuthUserProfile;
  
  /** User metadata */
  public readonly metadata: AuthUserMetadata;

  constructor(data: {
    id: string;
    email: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    status: UserStatus;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    profile?: AuthUserProfile;
    metadata: AuthUserMetadata;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.emailVerified = data.emailVerified;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.status = data.status;
    this.role = data.role;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.profile = data.profile;
    this.metadata = data.metadata;

    // Add legacy properties for backward compatibility
    (this as any).displayName = this.getDisplayName();
    (this as any).photoURL = this.profile?.avatarUrl;
    (this as any).phoneVerified = this.profile?.phoneVerified;
    (this as any).mfaEnabled = this.metadata.mfaEnabled;
    (this as any).lastLoginAt = this.metadata.lastLoginAt ? new Date(this.metadata.lastLoginAt) : undefined;
    (this as any).roles = [this.role.toLowerCase()]; // Convert role to roles array for legacy compatibility
    (this as any).permissions = ['read:profile', 'write:profile']; // Basic permissions for all users
  }

  /**
   * @method getFullName
   * @description Get user's full name
   * @returns {string} Combined first and last name
   */
  public getFullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    if (this.firstName) return this.firstName;
    if (this.lastName) return this.lastName;
    return this.profile?.displayName || this.email.split('@')[0];
  }

  /**
   * @method getDisplayName
   * @description Get user's display name
   * @returns {string} Preferred display name
   */
  public getDisplayName(): string {
    return this.profile?.displayName || this.getFullName();
  }

  /**
   * @method isActive
   * @description Check if user account is active
   * @returns {boolean} True if account is active
   */
  public isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * @method isVerified
   * @description Check if user is fully verified
   * @returns {boolean} True if email is verified
   */
  public isVerified(): boolean {
    return this.emailVerified;
  }

  /**
   * @method hasSecuritySetup
   * @description Check if user has security features enabled
   * @returns {boolean} True if MFA or biometric is enabled
   */
  public hasSecuritySetup(): boolean {
    return this.metadata.mfaEnabled || this.metadata.biometricEnabled;
  }

  /**
   * @method getSecurityLevel
   * @description Get user's security level based on setup
   * @returns {string} Security level description
   */
  public getSecurityLevel(): 'basic' | 'enhanced' | 'maximum' {
    if (this.metadata.mfaEnabled && this.metadata.biometricEnabled) {
      return 'maximum';
    }
    if (this.metadata.mfaEnabled || this.metadata.biometricEnabled) {
      return 'enhanced';
    }
    return 'basic';
  }

  /**
   * @method canPerformAction
   * @description Check if user can perform specific action based on role
   * @param {string} action Action to check
   * @returns {boolean} True if action is allowed
   */
  public canPerformAction(action: string): boolean {
    const rolePermissions = {
      [UserRole.USER]: ['read_profile', 'update_profile', 'change_password'],
      [UserRole.MODERATOR]: ['read_profile', 'update_profile', 'change_password', 'moderate_content'],
      [UserRole.ADMIN]: ['read_profile', 'update_profile', 'change_password', 'moderate_content', 'admin_access'],
      [UserRole.SUPER_ADMIN]: ['*'], // All permissions
    };

    const permissions = rolePermissions[this.role] || [];
    return permissions.includes('*') || permissions.includes(action);
  }

  /**
   * @method toPublicData
   * @description Get sanitized user data for public consumption
   * @returns {object} Public user data without sensitive information
   */
  public toPublicData() {
    return {
      id: this.id,
      displayName: this.getDisplayName(),
      avatarUrl: this.profile?.avatarUrl,
      isVerified: this.isVerified(),
      securityLevel: this.getSecurityLevel(),
    };
  }

  /**
   * @method toSessionData
   * @description Get user data for session storage
   * @returns {object} Session-safe user data
   */
  public toSessionData() {
    return {
      id: this.id,
      email: this.email,
      emailVerified: this.emailVerified,
      firstName: this.firstName,
      lastName: this.lastName,
      status: this.status,
      role: this.role,
      profile: this.profile,
      metadata: {
        ...this.metadata,
        // Remove sensitive metadata for session
        securityScore: undefined,
        riskLevel: undefined,
      },
    };
  }

  /**
   * @static fromSupabaseUser
   * @description Create AuthUser from Supabase user data
   * @param {any} supabaseUser Supabase user object
   * @param {any} userMetadata Additional user metadata
   * @returns {AuthUser} AuthUser instance
   */
  public static fromSupabaseUser(
    supabaseUser: any,
    userMetadata?: Partial<AuthUserMetadata>
  ): AuthUser {
    return new AuthUser({
      id: supabaseUser.id,
      email: supabaseUser.email,
      emailVerified: supabaseUser.email_confirmed_at !== null,
      firstName: supabaseUser.user_metadata?.firstName,
      lastName: supabaseUser.user_metadata?.lastName,
      status: supabaseUser.user_metadata?.status || UserStatus.ACTIVE,
      role: supabaseUser.user_metadata?.role || UserRole.USER,
      createdAt: supabaseUser.created_at,
      updatedAt: supabaseUser.updated_at,
      profile: supabaseUser.user_metadata?.profile,
      metadata: {
        lastLoginAt: supabaseUser.last_sign_in_at,
        lastActiveAt: userMetadata?.lastActiveAt,
        loginCount: userMetadata?.loginCount || 0,
        deviceCount: userMetadata?.deviceCount || 0,
        mfaEnabled: userMetadata?.mfaEnabled || false,
        biometricEnabled: userMetadata?.biometricEnabled || false,
        securityScore: userMetadata?.securityScore || 75,
        riskLevel: userMetadata?.riskLevel || 'low',
        language: userMetadata?.language || 'de',
        timezone: userMetadata?.timezone || 'Europe/Berlin',
        termsAcceptedAt: userMetadata?.termsAcceptedAt,
        privacyAcceptedAt: userMetadata?.privacyAcceptedAt,
        ...userMetadata,
      },
    });
  }
}

/**
 * @type AuthUserData
 * @description Type for user data without methods
 */
export type AuthUserData = {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  profile?: AuthUserProfile;
  metadata: AuthUserMetadata;
};

/**
 * @type CreateAuthUserData
 * @description Type for creating new user
 */
export type CreateAuthUserData = Omit<AuthUserData, 'id' | 'createdAt' | 'updatedAt'> & {
  password?: string;
};

/**
 * @type UpdateAuthUserData
 * @description Type for updating user data
 */
export type UpdateAuthUserData = Partial<Pick<AuthUserData, 'firstName' | 'lastName' | 'profile'>>;

export default AuthUser; 