/**
 * Represents a user authenticated via Supabase with Enterprise features.
 */
import { UserStatus } from '../types/security.types';
export interface AuthUser {
  /** Unique identifier from Supabase Authentication. */
  id: string;
  /** Email address of the user. */
  email: string;
  /** Optional display name of the user. */
  displayName?: string;
  /** Optional photo URL of the user. */
  photoURL?: string;
  /** User roles for RBAC */
  roles?: string[];
  /** User permissions */
  permissions?: string[];
  /** MFA enrollment status */
  mfaEnabled?: boolean;
  /** Available MFA factors */
  mfaFactors?: MFAFactor[];
  /** Last login timestamp */
  lastLoginAt?: Date;
  /** Account status */
  status?: 'active' | 'suspended' | 'pending_verification' | UserStatus;
  /** Email verification status */
  emailVerified?: boolean;
  /** Phone number for SMS MFA */
  phoneNumber?: string;
  /** Phone verification status */
  phoneVerified?: boolean;
  /** User metadata */
  metadata?: Record<string, any>;
}

export interface MFAFactor {
  id: string;
  type: 'totp' | 'sms' | 'email';
  status: 'verified' | 'unverified';
  friendlyName?: string;
  createdAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceId?: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
  isActive: boolean;
}
