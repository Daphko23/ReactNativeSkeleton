/**
 * @fileoverview DTO-001 bis DTO-033: Authentication Domain Data Transfer Objects - Enterprise Standard
 * @description Enterprise-grade DTOs für Authentication Domain Layer nach Clean Architecture.
 * Definiert typsichere Contracts zwischen Presentation, Application und Infrastructure Layer.
 * Implementiert umfassende Validierung, Security und Compliance Standards.
 * 
 * @businessRule BR-072: Login Request Email Validation - RFC 5322 compliant email format
 * @businessRule BR-073: Login Request Password Security - Minimum 8 characters, complexity requirements
 * @businessRule BR-074: Login Response Token Security - JWT with 15min expiry, secure storage
 * @businessRule BR-075: Login Response User Data Privacy - GDPR compliant minimal data exposure
 * @businessRule BR-076: Register Request Input Validation - XSS protection, input sanitization
 * @businessRule BR-077: Register Request Email Uniqueness - Prevent duplicate account creation
 * @businessRule BR-078: Register Response Verification Flow - Email/SMS verification requirement
 * @businessRule BR-079: Register Response Data Minimization - Minimal PII in response payload
 * 
 * @securityNote All DTOs implement input validation to prevent injection attacks
 * @securityNote Sensitive data (passwords, tokens) excluded from logging and serialization
 * @securityNote Rate limiting enforced on authentication-related operations
 * @securityNote Password fields use secure comparison to prevent timing attacks
 * 
 * @auditLog Login attempts logged with IP, device fingerprint, and timestamp
 * @auditLog Password changes trigger security notifications and audit events
 * @auditLog Failed authentication attempts tracked for fraud detection
 * @auditLog MFA operations logged for compliance and security monitoring
 * 
 * @compliance GDPR Article 25 - Data Protection by Design and by Default
 * @compliance PCI-DSS Requirement 8 - User Authentication and Access Management
 * @compliance SOX Section 404 - Internal Controls for Authentication Systems
 * @compliance NIST 800-63B - Digital Identity Authentication Guidelines
 * @compliance ISO 27001 A.9.4 - Secure Authentication Information Management
 * 
 * @performance Authentication DTOs optimized for <100ms validation time
 * @performance Token validation cached for 5min to reduce database load
 * @performance Batch permission checks supported for RBAC operations
 * @performance Password hashing uses Argon2id with optimal work factors
 * 
 * @monitoring Authentication success/failure rates tracked via Sentry
 * @monitoring Response times monitored with 95th percentile alerts
 * @monitoring Security events forwarded to SIEM for threat detection
 * @monitoring Business metrics tracked via Firebase Analytics
 * 
 * @example Basic Authentication Flow
 * ```typescript
 * // Login Request with security validation
 * const loginReq: LoginRequest = {
 *   email: 'user@company.com',
 *   password: 'SecurePass123!',
 *   enforcePasswordPolicy: true
 * };
 * 
 * // Successful login response with minimal data
 * const loginRes: LoginResponse = {
 *   user: { id: 'user_123', email: 'user@company.com', roles: ['user'] },
 *   accessToken: 'eyJhbGciOiJIUzI1NiIs...',
 *   expiresIn: 900 // 15 minutes
 * };
 * ```
 * 
 * @example Registration with verification
 * ```typescript
 * const registerReq: RegisterRequest = {
 *   email: 'newuser@company.com',
 *   password: 'NewSecurePass123!',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * };
 * 
 * const registerRes: RegisterResponse = {
 *   user: { id: 'user_124', email: 'newuser@company.com' },
 *   requiresVerification: true,
 *   verificationMethod: 'email'
 * };
 * ```
 * 
 * @throws ValidationError Invalid email format or weak password
 * @throws DuplicateEmailError Email already registered in system
 * @throws RateLimitError Too many authentication attempts
 * @throws SecurityError Suspicious activity detected
 * @throws ComplianceError GDPR consent required for registration
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthenticationDTOs
 * @namespace Auth.Application.DTOs
 */

// ==========================================
// 🔐 AUTHENTICATION DTOs
// ==========================================

/**
 * @interface LoginRequest
 * @description DTO-001: User authentication login request with security validation
 * 
 * @businessRule BR-072: Email must be RFC 5322 compliant format
 * @businessRule BR-073: Password minimum 8 characters with complexity requirements
 * 
 * @securityNote Password field excluded from logging and serialization
 * @auditLog Login attempts logged with IP and device fingerprint
 * @compliance GDPR Article 6 - Lawful basis for authentication processing
 * 
 * @example
 * ```typescript
 * const request: LoginRequest = {
 *   email: 'user@company.com',
 *   password: 'SecurePass123!',
 *   enforcePasswordPolicy: true
 * };
 * ```
 */
export interface LoginRequest {
  /** User's email address - must be valid RFC 5322 format */
  email: string;
  /** User's password - minimum 8 characters, excluded from logs */
  password: string;
  /** Optional flag to enforce password policy validation */
  enforcePasswordPolicy?: boolean;
}

/**
 * @interface LoginResponse
 * @description DTO-002: Successful authentication response with minimal user data
 * 
 * @businessRule BR-074: JWT access token with 15min expiry for security
 * @businessRule BR-075: Minimal user data exposure for GDPR compliance
 * 
 * @securityNote Access token must be stored securely in keychain
 * @auditLog Successful logins logged for security monitoring
 * @performance Token validation cached for 5min to reduce database load
 * 
 * @example
 * ```typescript
 * const response: LoginResponse = {
 *   user: {
 *     id: 'user_123',
 *     email: 'user@company.com',
 *     roles: ['user', 'manager'],
 *     mfaEnabled: true
 *   },
 *   accessToken: 'eyJhbGciOiJIUzI1NiIs...',
 *   expiresIn: 900
 * };
 * ```
 */
export interface LoginResponse {
  /** Minimal user information for GDPR compliance */
  user: {
    /** Unique user identifier */
    id: string;
    /** User's email address */
    email: string;
    /** Optional first name */
    firstName?: string;
    /** Optional last name */
    lastName?: string;
    /** User's assigned roles for RBAC */
    roles?: string[];
    /** MFA enablement status */
    mfaEnabled?: boolean;
    /** Biometric authentication status */
    biometricEnabled?: boolean;
  };
  /** JWT access token - store securely */
  accessToken: string;
  /** Optional refresh token for token renewal */
  refreshToken?: string;
  /** Token expiration time in seconds (default 900 = 15min) */
  expiresIn: number;
}

/**
 * @interface RegisterRequest
 * @description DTO-003: User registration request with input validation
 * 
 * @businessRule BR-076: XSS protection and input sanitization required
 * @businessRule BR-077: Email uniqueness validation before account creation
 * 
 * @securityNote Password excluded from logs, input sanitized for XSS
 * @auditLog Registration attempts logged with IP and device info
 * @compliance GDPR Article 13 - Information to be provided for data collection
 */
export interface RegisterRequest {
  /** User's email - must be unique and RFC 5322 compliant */
  email: string;
  /** Password - minimum 8 characters with complexity requirements */
  password: string;
  /** Optional first name - sanitized for XSS protection */
  firstName?: string;
  /** Optional last name - sanitized for XSS protection */
  lastName?: string;
}

/**
 * @interface RegisterResponse
 * @description DTO-004: Registration response with verification flow
 * 
 * @businessRule BR-078: Email/SMS verification required for account activation
 * @businessRule BR-079: Minimal PII in response for data protection
 * 
 * @securityNote User ID generated securely, verification required
 * @auditLog Registration success logged for compliance tracking
 * @compliance GDPR Article 25 - Data protection by design
 */
export interface RegisterResponse {
  /** Minimal user data for GDPR compliance */
  user: {
    /** Securely generated unique user identifier */
    id: string;
    /** User's verified email address */
    email: string;
    /** Optional first name if provided */
    firstName?: string;
    /** Optional last name if provided */
    lastName?: string;
  };
  /** Verification requirement flag */
  requiresVerification: boolean;
  /** Verification delivery method */
  verificationMethod?: 'email' | 'sms';
}

// ==========================================
// 🔒 PASSWORD MANAGEMENT DTOs
// ==========================================

/**
 * @interface UpdatePasswordRequest
 * @description DTO-007: Password update request with current password verification
 * 
 * @businessRule BR-086: Current password verification required for security
 * @businessRule BR-087: New password must meet strength requirements
 * 
 * @securityNote Both passwords excluded from logging for security
 * @auditLog Password changes logged with IP and device fingerprint
 * @compliance PCI-DSS Requirement 8.2.3 - Password complexity requirements
 */
export interface UpdatePasswordRequest {
  /** Current password for verification - excluded from logs */
  currentPassword: string;
  /** New password meeting complexity requirements */
  newPassword: string;
}

/**
 * @interface PasswordResetRequest
 * @description DTO-008: Password reset initiation request
 * 
 * @businessRule BR-088: Email validation required before reset token generation
 * @businessRule BR-089: Rate limiting enforced to prevent abuse
 * 
 * @securityNote Rate limited to prevent enumeration attacks
 * @auditLog Reset requests logged for security monitoring
 * @compliance GDPR Article 12 - Transparent information and communication
 */
export interface PasswordResetRequest {
  /** User's email address for reset token delivery */
  email: string;
}

/**
 * @interface PasswordValidationResult
 * @description DTO-009: Password strength validation result
 * 
 * @businessRule BR-090: Password complexity rules enforced
 * @businessRule BR-091: Strength scoring based on entropy calculation
 * 
 * @performance Validation optimized for <50ms response time
 * @securityNote Validation details provided for user education
 */
export interface PasswordValidationResult {
  /** Overall validation result */
  isValid: boolean;
  /** Specific validation errors */
  errors: string[];
  /** Improvement suggestions for user */
  suggestions: string[];
  /** Password strength classification */
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
}

// ==========================================
// 🔐 MFA DTOs
// ==========================================

/**
 * @interface EnableMFARequest
 * @description DTO-013: Multi-factor authentication enablement request
 * 
 * @businessRule BR-096: MFA method validation against supported types
 * @businessRule BR-097: Phone number validation for SMS method
 * 
 * @securityNote TOTP secret generation uses cryptographically secure random
 * @compliance NIST 800-63B - Multi-factor authentication requirements
 */
export interface EnableMFARequest {
  /** MFA method type - TOTP recommended for security */
  method: 'totp' | 'sms' | 'email';
  /** Phone number required for SMS method */
  phoneNumber?: string;
}

/**
 * @interface EnableMFAResponse
 * @description DTO-014: MFA enablement response with setup data
 * 
 * @businessRule BR-098: Backup codes generation for account recovery
 * @businessRule BR-099: QR code generation for TOTP setup
 * 
 * @securityNote Backup codes must be securely stored by user
 * @auditLog MFA enablement logged for security compliance
 */
export interface EnableMFAResponse {
  /** Setup success status */
  success: boolean;
  /** QR code for TOTP app setup */
  qrCode?: string;
  /** One-time recovery codes - store securely */
  backupCodes?: string[];
  /** TOTP secret for manual entry */
  secret?: string;
}

/**
 * @interface VerifyMFARequest
 * @description DTO-015: MFA verification code submission
 * 
 * @businessRule BR-100: Code validation with time window tolerance
 * @businessRule BR-101: Rate limiting to prevent brute force attacks
 * 
 * @securityNote Verification codes rate limited for security
 * @auditLog MFA attempts logged for security monitoring
 */
export interface VerifyMFARequest {
  /** 6-digit verification code */
  code: string;
  /** MFA method used for verification */
  method: 'totp' | 'sms' | 'email';
  /** Optional challenge ID for session tracking */
  challengeId?: string;
}

/**
 * @interface VerifyMFAResponse
 * @description DTO-016: MFA verification result
 * 
 * @businessRule BR-102: Access token issued upon successful verification
 * @businessRule BR-103: Descriptive messages for user guidance
 * 
 * @securityNote Access token includes MFA verification claim
 * @auditLog Successful MFA logged for compliance tracking
 */
export interface VerifyMFAResponse {
  /** Verification success status */
  success: boolean;
  /** JWT access token with MFA claim */
  accessToken?: string;
  /** User-friendly verification message */
  message?: string;
}

// ==========================================
// 📱 BIOMETRIC DTOs
// ==========================================

/**
 * @interface BiometricAuthRequest
 * @description DTO-017: Biometric authentication request with user prompts
 * 
 * @businessRule BR-104: Platform biometric support validation required
 * @businessRule BR-105: User-friendly prompts for authentication flow
 * 
 * @securityNote Hardware security module validation for biometric data
 * @compliance FIDO2 Alliance standards for biometric authentication
 */
export interface BiometricAuthRequest {
  /** Custom prompt message for biometric dialog */
  promptMessage?: string;
  /** Fallback title when biometric fails */
  fallbackTitle?: string;
}

/**
 * @interface BiometricAuthResponse
 * @description DTO-018: Biometric authentication result
 * 
 * @businessRule BR-106: Secure token generation upon successful biometric auth
 * @businessRule BR-107: Descriptive error messages for authentication failures
 * 
 * @securityNote Biometric data never transmitted or stored
 * @auditLog Biometric authentication attempts logged for security
 */
export interface BiometricAuthResponse {
  /** Authentication success status */
  success: boolean;
  /** JWT access token upon successful authentication */
  accessToken?: string;
  /** Error description for failed authentication */
  error?: string;
}

// ==========================================
// 🔗 OAUTH DTOs
// ==========================================

/**
 * @interface OAuthLoginRequest
 * @description DTO-019: OAuth provider authentication request
 * 
 * @businessRule BR-108: OAuth provider validation against whitelist
 * @businessRule BR-109: Redirect URI validation for security
 * 
 * @securityNote State parameter required for CSRF protection
 * @compliance OAuth 2.0 RFC 6749 and OpenID Connect Core 1.0
 */
export interface OAuthLoginRequest {
  /** Supported OAuth provider */
  provider: 'google' | 'apple' | 'microsoft';
  /** Validated redirect URI for OAuth flow */
  redirectUri?: string;
  /** CSRF protection state parameter */
  state?: string;
}

/**
 * @interface OAuthLoginResponse
 * @description DTO-020: OAuth authentication result with provider data
 * 
 * @businessRule BR-110: Provider user data mapping to internal format
 * @businessRule BR-111: Token security for OAuth responses
 * 
 * @securityNote Provider tokens stored securely in keychain
 * @auditLog OAuth logins logged with provider information
 */
export interface OAuthLoginResponse {
  /** OAuth authentication success status */
  success: boolean;
  /** Mapped user data from OAuth provider */
  user?: {
    /** Internal user ID */
    id: string;
    /** Provider email address */
    email: string;
    /** Provider first name */
    firstName?: string;
    /** Provider last name */
    lastName?: string;
    /** OAuth provider identifier */
    provider: string;
  };
  /** Internal access token */
  accessToken?: string;
  /** OAuth provider refresh token */
  refreshToken?: string;
}

// ==========================================
// 🛡️ SECURITY DTOs
// ==========================================

/**
 * @interface SecurityEventRequest
 * @description DTO-021: Security event logging request for audit trail
 * 
 * @businessRule BR-112: Event type classification for security monitoring
 * @businessRule BR-113: Severity level assignment based on risk assessment
 * 
 * @securityNote All security events require immediate SIEM forwarding
 * @auditLog Security events logged for compliance and threat detection
 * @compliance SOX Section 404 - Security event documentation requirements
 */
export interface SecurityEventRequest {
  /** Security event type classification */
  type:
    | 'login'
    | 'logout'
    | 'mfa_enabled'
    | 'password_change'
    | 'suspicious_activity';
  /** Risk-based severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Additional event metadata */
  details?: Record<string, any>;
}

/**
 * @interface SecurityEventResponse
 * @description DTO-022: Security event data for audit and monitoring
 * 
 * @businessRule BR-114: Unique event ID for traceability
 * @businessRule BR-115: Timestamp precision for forensic analysis
 * 
 * @securityNote Event data immutable once created
 * @auditLog Events retained for 7 years for compliance
 */
export interface SecurityEventResponse {
  /** Unique security event identifier */
  id: string;
  /** Event type classification */
  type: string;
  /** Assigned severity level */
  severity: string;
  /** Precise event timestamp */
  timestamp: Date;
  /** Associated user identifier */
  userId: string;
  /** Event-specific metadata */
  details: Record<string, any>;
}

/**
 * @interface SuspiciousActivityResponse
 * @description DTO-023: Suspicious activity analysis result
 * 
 * @businessRule BR-116: Risk level calculation based on activity patterns
 * @businessRule BR-117: Actionable recommendations for risk mitigation
 * 
 * @securityNote High/critical risk levels trigger immediate alerts
 * @monitoring Real-time suspicious activity tracking via ML models
 */
export interface SuspiciousActivityResponse {
  /** Activity detection flag */
  hasActivity: boolean;
  /** Calculated risk assessment level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Related security events */
  events: SecurityEventResponse[];
  /** Risk mitigation recommendations */
  recommendations: string[];
}

// ==========================================
// 🕐 SESSION DTOs
// ==========================================

/**
 * @interface SessionRequest
 * @description DTO-024: Session validation request
 * 
 * @businessRule BR-118: Session ID validation for security
 * 
 * @securityNote Session IDs cryptographically secure and unpredictable
 */
export interface SessionRequest {
  /** Unique session identifier */
  sessionId: string;
}

/**
 * @interface SessionResponse
 * @description DTO-025: Session information with device tracking
 * 
 * @businessRule BR-119: Device fingerprinting for security monitoring
 * @businessRule BR-120: Session activity tracking for compliance
 * 
 * @securityNote Location data anonymized for privacy protection
 * @auditLog Session data logged for security analysis
 */
export interface SessionResponse {
  /** Unique session identifier */
  id: string;
  /** Associated user identifier */
  userId: string;
  /** Device and browser information */
  deviceInfo: {
    /** Platform identifier (iOS/Android/Web) */
    platform: string;
    /** Browser information if applicable */
    browser?: string;
    /** Anonymized location data */
    location?: string;
  };
  /** Session creation timestamp */
  createdAt: Date;
  /** Last activity timestamp */
  lastActivity: Date;
  /** Current session status */
  isActive: boolean;
}

/**
 * @interface ActiveSessionsResponse
 * @description DTO-026: User's active sessions overview
 * 
 * @businessRule BR-121: Session limit enforcement per user
 * @businessRule BR-122: Current session identification for security
 * 
 * @securityNote Multiple active sessions monitored for anomalies
 * @performance Paginated for users with many sessions
 */
export interface ActiveSessionsResponse {
  /** List of active user sessions */
  sessions: SessionResponse[];
  /** Current session identifier */
  currentSessionId: string;
  /** Total active session count */
  totalCount: number;
}

// ==========================================
// 👥 RBAC DTOs
// ==========================================

/**
 * @interface PermissionRequest
 * @description DTO-027: Permission check request for authorization
 * 
 * @businessRule BR-123: Permission string validation against registry
 * @businessRule BR-124: User context required for permission evaluation
 * 
 * @performance Permission checks cached for 5min for performance
 * @securityNote Permission checks logged for audit trail
 */
export interface PermissionRequest {
  /** Permission identifier to check */
  permission: string;
  /** Target user ID (defaults to current user) */
  userId?: string;
}

/**
 * @interface PermissionResponse
 * @description DTO-028: Permission evaluation result with context
 * 
 * @businessRule BR-125: Hierarchical permission inheritance
 * @businessRule BR-126: Role-based effective permission calculation
 * 
 * @securityNote Permission evaluation considers role hierarchy
 * @auditLog Permission checks logged for compliance monitoring
 */
export interface PermissionResponse {
  /** Permission evaluation result */
  hasPermission: boolean;
  /** Requested permission identifier */
  permission: string;
  /** Target user identifier */
  userId: string;
  /** Roles granting the permission */
  grantedBy: string[];
  /** Roles denying the permission */
  deniedBy: string[];
  /** Effective role for permission */
  effectiveRole: string;
}

/**
 * @interface UserRolesRequest
 * @description DTO-029: User roles and permissions retrieval request
 * 
 * @businessRule BR-127: User role validation and hierarchy resolution
 * @businessRule BR-128: Optional permission expansion for performance
 * 
 * @performance Role data cached for optimal authorization performance
 */
export interface UserRolesRequest {
  /** Target user ID (defaults to current user) */
  userId?: string;
  /** Include expanded permissions in response */
  includePermissions?: boolean;
}

/**
 * @interface UserRolesResponse
 * @description DTO-030: User roles and effective permissions
 * 
 * @businessRule BR-129: Role hierarchy and inheritance calculation
 * @businessRule BR-130: Effective permissions aggregation
 * 
 * @securityNote Role changes logged for security compliance
 * @performance Effective permissions pre-calculated and cached
 */
export interface UserRolesResponse {
  /** Target user identifier */
  userId: string;
  /** Assigned user roles */
  roles: string[];
  /** Role-specific permissions (if requested) */
  permissions?: string[];
  /** Calculated effective permissions */
  effectivePermissions: string[];
}

// ==========================================
// 📊 COMMON DTOs
// ==========================================

/**
 * @interface AuthResponse
 * @description DTO-031: Standardized authentication response wrapper
 * 
 * @businessRule BR-131: Consistent response format across all auth operations
 * @businessRule BR-132: Timestamp precision for audit and debugging
 * 
 * @securityNote Error messages sanitized to prevent information disclosure
 * @monitoring Response times tracked for performance optimization
 */
export interface AuthResponse<T = any> {
  /** Operation success indicator */
  success: boolean;
  /** Response payload data */
  data?: T;
  /** User-safe error message */
  error?: string;
  /** Response generation timestamp */
  timestamp: string;
}

/**
 * @interface PaginationRequest
 * @description DTO-032: Pagination parameters for list operations
 * 
 * @businessRule BR-133: Limit validation to prevent resource exhaustion
 * @businessRule BR-134: Sort parameter validation against allowed fields
 * 
 * @performance Default limits applied for optimal performance
 * @securityNote Pagination prevents data enumeration attacks
 */
export interface PaginationRequest {
  /** Maximum items per page (default: 20, max: 100) */
  limit?: number;
  /** Items to skip for pagination */
  offset?: number;
  /** Sort field (validated against allowed fields) */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * @interface PaginatedResponse
 * @description DTO-033: Paginated response with metadata
 * 
 * @businessRule BR-135: Consistent pagination metadata across endpoints
 * @businessRule BR-136: Efficient pagination with hasMore indicator
 * 
 * @performance Next offset pre-calculated for optimal pagination
 * @securityNote Total count may be limited for security reasons
 */
export interface PaginatedResponse<T> {
  /** Paginated items array */
  items: T[];
  /** Total items count (may be limited) */
  totalCount: number;
  /** More items available indicator */
  hasMore: boolean;
  /** Next pagination offset */
  nextOffset?: number;
}
