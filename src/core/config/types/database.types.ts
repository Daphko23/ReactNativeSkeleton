/**
 * @fileoverview CORE-CONFIG-002: Database Type Definitions
 * @description Type-safe database schema definitions for Supabase
 * 
 * @businessRule BR-110: Type-safe database operations
 * @businessRule BR-111: Schema versioning and migration support
 * @businessRule BR-112: Row Level Security (RLS) policy types
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module DatabaseTypes
 * @namespace Core.Config.Types
 */

/**
 * @interface Database
 * @description Main database schema interface
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      user_sessions: {
        Row: UserSessionRow;
        Insert: UserSessionInsert;
        Update: UserSessionUpdate;
      };
      security_events: {
        Row: SecurityEventRow;
        Insert: SecurityEventInsert;
        Update: SecurityEventUpdate;
      };
      mfa_factors: {
        Row: MFAFactorRow;
        Insert: MFAFactorInsert;
        Update: MFAFactorUpdate;
      };
      // Add more tables as needed
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_status: 'active' | 'pending_verification' | 'suspended' | 'locked' | 'disabled';
      oauth_provider: 'google' | 'apple' | 'microsoft';
      mfa_type: 'totp' | 'sms' | 'email' | 'hardware_token';
      security_event_type: 'login' | 'login_failed' | 'logout' | 'registration' | 'password_changed' | 'password_reset' | 'email_verification_success' | 'mfa_enabled' | 'mfa_disabled' | 'mfa_challenge_created' | 'mfa_challenge_verified' | 'biometric_enabled' | 'biometric_disabled' | 'biometric_auth_success' | 'biometric_auth_failed' | 'oauth_linked' | 'oauth_unlinked' | 'suspicious_activity' | 'account_locked' | 'account_unlocked' | 'session_created' | 'session_expired' | 'session_terminated';
      security_event_severity: 'low' | 'medium' | 'high' | 'critical';
    };
  };
}

/**
 * @interface UserRow
 * @description User table row structure
 */
export interface UserRow {
  id: string;
  email: string;
  email_verified: boolean;
  phone?: string;
  phone_verified: boolean;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  status: Database['public']['Enums']['user_status'];
  role: string;
  metadata: Record<string, any>;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * @interface UserInsert
 * @description User table insert structure
 */
export interface UserInsert {
  id?: string;
  email: string;
  email_verified?: boolean;
  phone?: string;
  phone_verified?: boolean;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  status?: Database['public']['Enums']['user_status'];
  role?: string;
  metadata?: Record<string, any>;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * @interface UserUpdate
 * @description User table update structure
 */
export interface UserUpdate {
  email?: string;
  email_verified?: boolean;
  phone?: string;
  phone_verified?: boolean;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  status?: Database['public']['Enums']['user_status'];
  role?: string;
  metadata?: Record<string, any>;
  last_login_at?: string;
  updated_at?: string;
}

/**
 * @interface UserSessionRow
 * @description User session table row structure
 */
export interface UserSessionRow {
  id: string;
  user_id: string;
  session_token: string;
  device_info: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * @interface UserSessionInsert
 * @description User session table insert structure
 */
export interface UserSessionInsert {
  id?: string;
  user_id: string;
  session_token: string;
  device_info?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  is_active?: boolean;
  expires_at: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * @interface UserSessionUpdate
 * @description User session table update structure
 */
export interface UserSessionUpdate {
  device_info?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  is_active?: boolean;
  expires_at?: string;
  updated_at?: string;
}

/**
 * @interface SecurityEventRow
 * @description Security event table row structure
 */
export interface SecurityEventRow {
  id: string;
  user_id: string;
  event_type: Database['public']['Enums']['security_event_type'];
  severity: Database['public']['Enums']['security_event_severity'];
  description: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

/**
 * @interface SecurityEventInsert
 * @description Security event table insert structure
 */
export interface SecurityEventInsert {
  id?: string;
  user_id: string;
  event_type: Database['public']['Enums']['security_event_type'];
  severity: Database['public']['Enums']['security_event_severity'];
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

/**
 * @interface SecurityEventUpdate
 * @description Security event table update structure
 */
export interface SecurityEventUpdate {
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * @interface MFAFactorRow
 * @description MFA factor table row structure
 */
export interface MFAFactorRow {
  id: string;
  user_id: string;
  factor_type: Database['public']['Enums']['mfa_type'];
  friendly_name: string;
  secret?: string;
  phone_number?: string;
  backup_codes?: string[];
  is_verified: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * @interface MFAFactorInsert
 * @description MFA factor table insert structure
 */
export interface MFAFactorInsert {
  id?: string;
  user_id: string;
  factor_type: Database['public']['Enums']['mfa_type'];
  friendly_name: string;
  secret?: string;
  phone_number?: string;
  backup_codes?: string[];
  is_verified?: boolean;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * @interface MFAFactorUpdate
 * @description MFA factor table update structure
 */
export interface MFAFactorUpdate {
  friendly_name?: string;
  secret?: string;
  phone_number?: string;
  backup_codes?: string[];
  is_verified?: boolean;
  is_primary?: boolean;
  updated_at?: string;
}

// Type helpers for better developer experience - consistent with security.types.ts enums
export type UserStatus = Database['public']['Enums']['user_status'];
export type OAuthProvider = Database['public']['Enums']['oauth_provider'];
export type MFAType = Database['public']['Enums']['mfa_type'];
export type SecurityEventType = Database['public']['Enums']['security_event_type'];
export type SecurityEventSeverity = Database['public']['Enums']['security_event_severity'];

// Note: Types are already exported via interface declarations above