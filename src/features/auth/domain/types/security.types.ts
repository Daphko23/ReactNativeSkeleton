/**
 * @fileoverview DOMAIN-TYPES-001: Security Domain Types - Enterprise Standard
 * @description Domain Layer Types für Advanced Security Features.
 * Definiert Type-Safe Enums und Interfaces für Sicherheitsoperationen.
 * 
 * @businessRule BR-280: Security domain types definition
 * @businessRule BR-281: Type-safe enum definitions
 * @businessRule BR-282: Enterprise security data structures
 * @businessRule BR-283: Domain-driven design type definitions
 * 
 * @architecture Domain-driven design with type safety
 * @architecture Clean Architecture domain types
 * @architecture Enterprise type definitions
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module SecurityTypes
 * @namespace Auth.Domain.Types
 */

/**
 * @enum SecurityLevel
 * @description Enterprise security level classification
 * 
 * @businessRule BR-283a: Security level definitions for enterprise compliance
 */
export enum SecurityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * @enum RiskLevel
 * @description Enterprise risk level classification
 * 
 * @businessRule BR-284: Standardized risk level definitions
 * @securityNote Risk levels aligned with enterprise security frameworks
 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * @enum SecurityEventSeverity
 * @description Security event severity levels for audit and monitoring
 */
export enum SecurityEventSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * @enum SecurityEventType
 * @description Security event types for comprehensive audit trail
 */
export enum SecurityEventType {
  LOGIN = 'login',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  REGISTRATION = 'registration',
  PASSWORD_CHANGED = 'password_changed',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION_SUCCESS = 'email_verification_success',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  MFA_CHALLENGE_CREATED = 'mfa_challenge_created',
  MFA_CHALLENGE_VERIFIED = 'mfa_challenge_verified',
  BIOMETRIC_ENABLED = 'biometric_enabled',
  BIOMETRIC_DISABLED = 'biometric_disabled',
  BIOMETRIC_AUTH_SUCCESS = 'biometric_auth_success',
  BIOMETRIC_AUTH_FAILED = 'biometric_auth_failed',
  OAUTH_LINKED = 'oauth_linked',
  OAUTH_UNLINKED = 'oauth_unlinked',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',
  SESSION_CREATED = 'session_created',
  SESSION_EXPIRED = 'session_expired',
  SESSION_TERMINATED = 'session_terminated'
}

/**
 * @enum PasswordStrength
 * @description Password strength assessment levels
 */
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong'
}

/**
 * @enum UserStatus
 * @description User account status types
 */
export enum UserStatus {
  ACTIVE = 'active',
  PENDING_VERIFICATION = 'pending_verification',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
  DISABLED = 'disabled'
}

/**
 * @enum OAuthProvider
 * @description Supported OAuth provider types
 */
export enum OAuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  MICROSOFT = 'microsoft'
}

/**
 * @enum MFAType
 * @description Multi-Factor Authentication method types
 */
export enum MFAType {
  TOTP = 'totp',
  SMS = 'sms', 
  EMAIL = 'email',
  HARDWARE_TOKEN = 'hardware_token'
}

/**
 * @interface GeolocationData
 * @description Enhanced geolocation data for security analysis
 * 
 * @businessRule BR-287: Geolocation data structure definition
 * @securityNote Privacy-compliant location data handling
 * @compliance GDPR Article 6 location data processing
 */
export interface GeolocationData {
  /** GPS latitude coordinate */
  latitude?: number;
  /** GPS longitude coordinate */
  longitude?: number;
  /** Location accuracy in meters */
  accuracy?: number;
  /** ISO country code */
  country?: string;
  /** Administrative region/state */
  region?: string;
  /** City name */
  city?: string;
  /** IANA timezone identifier */
  timezone?: string;
  /** Internet Service Provider */
  isp?: string;
  /** VPN detection flag */
  vpnDetected?: boolean;
  /** Proxy detection flag */
  proxyDetected?: boolean;
  /** TOR network detection */
  torDetected?: boolean;
  /** Data center IP detection */
  datacenterDetected?: boolean;
  /** Location confidence score (0-1) */
  confidence?: number;
}

/**
 * @interface ThreatAssessmentFactors
 * @description Threat assessment calculation factors
 * 
 * @businessRule BR-288: Threat assessment factor definitions
 * @securityNote Risk scoring algorithm components
 */
export interface ThreatAssessmentFactors {
  /** Device trustworthiness score (0-100) */
  deviceTrust: number;
  /** Location-based risk score (0-100) */
  locationRisk: number;
  /** Behavioral analysis risk score (0-100) */
  behaviorRisk: number;
  /** Network security risk score (0-100) */
  networkRisk: number;
  /** Authentication history score (0-100) */
  authenticationRisk: number;
  /** Time-based risk factors (0-100) */
  temporalRisk: number;
}

/**
 * @interface ThreatAssessment
 * @description Comprehensive threat assessment result
 * 
 * @businessRule BR-289: Threat assessment structure definition
 * @securityNote Enterprise threat detection output
 */
export interface ThreatAssessment {
  /** Overall risk level classification */
  riskLevel: RiskLevel;
  /** Numerical risk score (0-100) */
  score: number;
  /** Detailed risk factor breakdown */
  factors: ThreatAssessmentFactors;
  /** Identified security threats */
  threats: string[];
  /** Security recommendations */
  recommendations: string[];
  /** Assessment timestamp */
  assessedAt: string;
  /** Assessment version for auditing */
  assessmentVersion: string;
  /** Confidence level of assessment (0-1) */
  confidence: number;
}

/**
 * @interface SecurityMonitoringEvent
 * @description Security event monitoring structure
 * 
 * @businessRule BR-290: Security event structure definition
 * @securityNote Comprehensive security event logging
 */
export interface SecurityMonitoringEvent {
  /** Unique event identifier */
  id: string;
  /** Event type classification */
  type: SecurityEventType;
  /** Event severity level */
  severity: SecurityEventSeverity;
  /** Human-readable event description */
  description: string;
  /** Structured event details */
  details: Record<string, any>;
  /** Event timestamp (ISO string) */
  timestamp: string;
  /** Associated user identifier */
  userId: string;
  /** Source system/service */
  source: string;
  /** Event correlation ID for tracking */
  correlationId?: string;
  /** Event metadata */
  metadata?: {
    /** Device information */
    device?: string;
    /** IP address */
    ipAddress?: string;
    /** User agent */
    userAgent?: string;
    /** Session ID */
    sessionId?: string;
  };
}

/**
 * @interface DeviceFingerprintComponents
 * @description Device fingerprint data components
 * 
 * @businessRule BR-291: Device fingerprint component definition
 * @securityNote Hardware and software characteristics collection
 */
export interface DeviceFingerprintComponents {
  /** Device hardware information */
  hardware: {
    deviceId: string;
    model: string;
    manufacturer: string;
    cpuArchitecture: string;
    totalMemory: number;
    availableMemory: number;
    screenResolution: string;
    screenDensity: number;
  };
  /** Operating system information */
  software: {
    osVersion: string;
    osName: string;
    kernelVersion?: string;
    buildVersion?: string;
    appVersion: string;
    appBuildNumber: string;
  };
  /** Network configuration */
  network: {
    connectionType: string;
    carrierName?: string;
    networkOperator?: string;
    ipAddress?: string;
    macAddress?: string;
  };
  /** User environment settings */
  environment: {
    timeZone: string;
    language: string;
    locale: string;
    fontScale: number;
    isAccessibilityEnabled: boolean;
  };
  /** Security characteristics */
  security: {
    isJailbroken: boolean;
    isEmulator: boolean;
    isDebuggingEnabled: boolean;
    hasVpn: boolean;
    biometricCapability: string[];
  };
}

/**
 * @interface ThreatDetectionRule
 * @description Security threat detection rule
 * 
 * @businessRule BR-292: Threat detection rule definition
 * @securityNote Configurable threat detection parameters
 */
export interface ThreatDetectionRule {
  /** Rule identifier */
  id: string;
  /** Rule name */
  name: string;
  /** Rule description */
  description: string;
  /** Rule severity if triggered */
  severity: SecurityEventSeverity;
  /** Rule condition logic */
  condition: string;
  /** Rule parameters */
  parameters: Record<string, any>;
  /** Rule enabled status */
  enabled: boolean;
  /** Rule priority (higher = more important) */
  priority: number;
}

/**
 * @enum SupabaseMFAFactorType
 * @description Supabase MFA factor types for API calls
 */
export enum SupabaseMFAFactorType {
  TOTP = 'totp',
  PHONE = 'phone'
}

/**
 * @enum OAuthScope
 * @description OAuth authentication scopes
 */
export enum OAuthScope {
  OPENID = 'openid',
  PROFILE = 'profile',
  EMAIL = 'email'
}

/**
 * @enum SessionEventType
 * @description Session management event types
 */
export enum SessionEventType {
  SESSION_CREATED = 'session_created',
  SESSION_TERMINATED = 'session_terminated',
  SESSION_REFRESHED = 'session_refreshed',
  SESSION_TIMEOUT = 'session_timeout'
}

/**
 * @enum UserRole
 * @description User role definitions for RBAC
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPER_ADMIN = 'super_admin'
} 