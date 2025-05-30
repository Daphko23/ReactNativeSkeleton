/**
 * @fileoverview REPOSITORY-001: Authentication Repository Interface - Enterprise Standard
 * @description Domain Repository Interface für umfassende Enterprise Authentication.
 * Definiert den Contract für alle Authentication-Operationen im Domain Layer.
 * 
 * @businessRule BR-184: Comprehensive authentication interface for all enterprise features
 * @businessRule BR-185: Clean Architecture separation between domain and infrastructure
 * @businessRule BR-186: Consistent error handling across all authentication operations
 * @businessRule BR-187: Enterprise security features integration (MFA, RBAC, Audit)
 * 
 * @securityNote Repository interface abstracts secure authentication implementations
 * @securityNote All methods require appropriate authorization validation
 * @securityNote Security events logged for all authentication operations
 * 
 * @auditLog All authentication operations logged for compliance
 * @auditLog Security events tracked through repository methods
 * @auditLog User activity monitored via repository interface
 * 
 * @compliance GDPR Article 25 - Data protection by design in authentication
 * @compliance NIST 800-63B - Digital identity guidelines implementation
 * @compliance ISO 27001 A.9 - Access control management
 * @compliance PCI-DSS Requirement 8 - Identification and authentication
 * @compliance SOX 404 - Internal controls over authentication
 * 
 * @performance Repository methods optimized for enterprise-scale operations
 * @performance Async/await pattern for non-blocking authentication flows
 * 
 * @monitoring Repository operation metrics tracked for performance
 * @monitoring Authentication success/failure rates monitored
 * @monitoring Enterprise feature usage analytics collected
 * 
 * @example Repository Usage in Use Cases
 * ```typescript
 * // In login use case
 * class LoginUseCase {
 *   constructor(private authRepo: AuthRepository) {}
 * 
 *   async execute(email: string, password: string): Promise<AuthUser> {
 *     try {
 *       const user = await this.authRepo.login(email, password);
 *       await this.authRepo.logSecurityEvent({
 *         type: SecurityEventType.LOGIN,
 *         userId: user.id,
 *         severity: SecurityEventSeverity.LOW
 *       });
 *       return user;
 *     } catch (error) {
 *       if (error instanceof MFARequiredError) {
 *         return this.authRepo.verifyMFAChallenge(error.challengeId, code);
 *       }
 *       throw error;
 *     }
 *   }
 * }
 * ```
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthenticationRepositoryInterface
 * @namespace Auth.Domain.Repository
 */

import { AuthUser, MFAFactor, UserSession } from '../entities/auth-user.interface';
import {
  SecurityEventSeverity,
  SecurityEventType,
  PasswordStrength,
  MFAType,
} from '../types/security.types';

// Re-export security types for use in other modules
export { SecurityEventSeverity, SecurityEventType, PasswordStrength, MFAType };



/**
 * @interface AuthRepository
 * @description REPOSITORY-001: Enterprise Authentication Repository Contract
 * 
 * Comprehensive repository interface for all authentication operations in enterprise applications.
 * Provides clean architecture abstraction between domain logic and infrastructure concerns.
 * Includes basic authentication, MFA, biometrics, OAuth, RBAC, and security monitoring.
 * 
 * @businessRule BR-184: Complete authentication feature coverage
 * @businessRule BR-185: Domain layer isolation from infrastructure details
 * @businessRule BR-186: Consistent error handling patterns across operations
 * @businessRule BR-187: Enterprise security integration requirements
 * 
 * @securityNote All operations require proper authentication/authorization
 * @auditLog Repository methods automatically log security events
 * @compliance Enterprise authentication standards compliance
 * 
 * @since 1.0.0
 */
export interface AuthRepository {
  // ==========================================
  // 🔐 BASIC AUTHENTICATION
  // ==========================================

  /**
   * Authenticate user with email and password credentials.
   * 
   * @param {string} email - User email address (validated format)
   * @param {string} password - User password (validated strength)
   * @returns {Promise<AuthUser>} Authenticated user entity
   * 
   * @throws {InvalidCredentialsError} When credentials are invalid
   * @throws {UserNotFoundError} When user account doesn't exist
   * @throws {MFARequiredError} When multi-factor authentication required
   * @throws {UserNotAuthenticatedError} When session validation fails
   * 
   * @businessRule BR-188: Email/password authentication with security validation
   * @securityNote Rate limiting enforced to prevent brute force attacks
   * @auditLog Login attempts logged for security monitoring
   * @performance Optimized for <200ms response time
   */
  login(email: string, password: string): Promise<AuthUser>;

  /**
   * Register new user account with email and password.
   * 
   * @param {string} email - User email address (uniqueness validated)
   * @param {string} password - User password (policy compliance required)
   * @returns {Promise<AuthUser>} Newly created user entity
   * 
   * @throws {EmailAlreadyInUseError} When email already registered
   * @throws {WeakPasswordError} When password fails strength validation
   * @throws {PasswordPolicyViolationError} When password violates policy
   * 
   * @businessRule BR-189: User registration with email uniqueness validation
   * @securityNote Password strength validation enforced
   * @auditLog Registration attempts logged for compliance
   * @performance Optimized for <300ms response time
   */
  register(email: string, password: string): Promise<AuthUser>;

  /**
   * Logout current authenticated user and invalidate session.
   * 
   * @returns {Promise<void>} Promise resolving when logout complete
   * 
   * @throws {UserNotAuthenticatedError} When no active session exists
   * 
   * @businessRule BR-190: Secure session termination and cleanup
   * @securityNote Session tokens invalidated on logout
   * @auditLog Logout events logged for security monitoring
   * @performance Optimized for <100ms response time
   */
  logout(): Promise<void>;

  /**
   * Retrieve currently authenticated user information.
   * 
   * @returns {Promise<AuthUser | null>} Current user entity or null if not authenticated
   * 
   * @businessRule BR-191: Current user retrieval with session validation
   * @securityNote Session validity checked before user retrieval
   * @performance Cached for optimal response time
   */
  getCurrentUser(): Promise<AuthUser | null>;

  /**
   * Initiate password reset process for user email.
   * 
   * @param {string} email - User email address for password reset
   * @returns {Promise<void>} Promise resolving when reset email sent
   * 
   * @throws {UserNotFoundError} When email not found (security: generic response)
   * 
   * @businessRule BR-192: Secure password reset without information disclosure
   * @securityNote Generic response prevents email enumeration attacks
   * @auditLog Password reset attempts logged for security
   * @performance Optimized for <150ms response time
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Subscribe to authentication state changes for real-time updates.
   * 
   * @param {Function} callback - Called with AuthUser or null on state changes
   * @returns {Function} Unsubscribe function to stop listening
   * 
   * @businessRule BR-193: Real-time authentication state monitoring
   * @performance Optimized observer pattern for minimal overhead
   * @example
   * ```typescript
   * const unsubscribe = authRepo.observeAuthState((user) => {
   *   if (user) {
   *     console.log('User logged in:', user.email);
   *   } else {
   *     console.log('User logged out');
   *   }
   * });
   * // Later: unsubscribe();
   * ```
   */
  observeAuthState(callback: (user: AuthUser | null) => void): () => void;

  /**
   * Validate password against enterprise policy.
   * 
   * @param {string} password - Password to validate
   * @returns {Promise<PasswordValidationResult>} Validation result with details
   * @businessRule BR-221: Enterprise password policy validation
   * @securityNote Password content never logged or stored
   */
  validatePassword(password: string): Promise<PasswordValidationResult>;

  /**
   * Verify user email address with verification token.
   * 
   * @param {string} token - Email verification token from verification email
   * @returns {Promise<AuthUser>} Updated user entity with verified email status
   * 
   * @throws {InvalidTokenError} When verification token is invalid or expired
   * @throws {UserNotFoundError} When user associated with token not found
   * @throws {TokenExpiredError} When verification token has expired
   * @throws {EmailAlreadyVerifiedError} When email is already verified
   * 
   * @businessRule BR-222: Email verification with secure token validation
   * @securityNote Verification tokens single-use with expiration
   * @auditLog Email verification attempts logged for security monitoring
   * @performance Optimized for <200ms response time
   * 
   * @example Email verification flow
   * ```typescript
   * try {
   *   const user = await authRepo.verifyEmail(verificationToken);
   *   console.log(`Email verified for ${user.email}`);
   * } catch (error) {
   *   if (error instanceof TokenExpiredError) {
   *     console.log('Verification token expired, please request new one');
   *   }
   * }
   * ```
   */
  verifyEmail(token: string): Promise<AuthUser>;

  // ==========================================
  // 🔒 MULTI-FACTOR AUTHENTICATION
  // ==========================================

  /**
   * Enable multi-factor authentication for current user.
   * 
   * @param {MFAType} type - MFA method type to enable
   * @param {string} [phoneNumber] - Phone number for SMS MFA (required for SMS type)
   * @returns {Promise<{secret?: string; qrCode?: string}>} Setup information for TOTP
   * 
   * @throws {UserNotAuthenticatedError} When user not logged in
   * @throws {MFARequiredError} When MFA already enabled
   * 
   * @businessRule BR-194: MFA enrollment with secure key generation
   * @securityNote TOTP secrets cryptographically secure
   * @auditLog MFA enablement logged for compliance
   * @compliance NIST 800-63B multi-factor authentication requirements
   */
  enableMFA(
    type: MFAType,
    phoneNumber?: string
  ): Promise<{secret?: string; qrCode?: string}>;

  /**
   * Verify MFA setup with validation code.
   * 
   * @param {string} code - MFA verification code from user
   * @param {string} factorId - MFA factor identifier
   * @returns {Promise<void>} Promise resolving when verification successful
   * 
   * @throws {InvalidCredentialsError} When verification code invalid
   * 
   * @businessRule BR-195: MFA setup verification with time-based validation
   * @securityNote Verification codes time-limited for security
   * @auditLog MFA verification attempts logged
   */
  verifyMFASetup(code: string, factorId: string): Promise<void>;

  /**
   * Disable multi-factor authentication for current user.
   * 
   * @param {string} factorId - MFA factor identifier to disable
   * @returns {Promise<void>} Promise resolving when MFA disabled
   * 
   * @throws {UserNotAuthenticatedError} When user not logged in
   * 
   * @businessRule BR-196: MFA disabling with security validation
   * @securityNote MFA disabling logged as security event
   * @auditLog MFA disabling tracked for compliance
   */
  disableMFA(factorId: string): Promise<void>;

  /**
   * Verify MFA challenge during authentication flow.
   * 
   * @param {string} code - MFA verification code from user
   * @param {string} challengeId - MFA challenge identifier
   * @returns {Promise<AuthUser>} Authenticated user after MFA verification
   * 
   * @throws {InvalidCredentialsError} When MFA code invalid
   * @throws {GenericAuthError} When challenge expired or invalid
   * 
   * @businessRule BR-197: MFA challenge verification with secure validation
   * @securityNote Challenge tokens expire after time limit
   * @auditLog MFA challenge attempts logged for monitoring
   */
  verifyMFAChallenge(code: string, challengeId: string): Promise<AuthUser>;

  /**
   * Retrieve user's enrolled MFA factors.
   * 
   * @returns {Promise<MFAFactor[]>} Array of user's MFA factors
   * 
   * @throws {UserNotAuthenticatedError} When user not logged in
   * 
   * @businessRule BR-198: MFA factor enumeration for authenticated users
   * @securityNote Factor details sanitized for security
   * @performance Cached for optimal response time
   */
  getMFAFactors(): Promise<MFAFactor[]>;

  // ==========================================
  // 📱 BIOMETRIC AUTHENTICATION
  // ==========================================

  /**
   * Check if biometric authentication is available on device.
   * 
   * @returns {Promise<boolean>} True if biometric authentication available
   * @businessRule BR-199: Device biometric capability validation
   * @performance Hardware detection cached for session
   */
  isBiometricAvailable(): Promise<boolean>;

  /**
   * Enable biometric authentication for current user.
   * 
   * @returns {Promise<void>} Promise resolving when biometric enabled
   * @throws {BiometricNotAvailableError} When biometric hardware unavailable
   * @businessRule BR-200: Biometric enrollment with secure key generation
   */
  enableBiometric(): Promise<void>;

  /**
   * Authenticate user with biometric verification.
   * 
   * @returns {Promise<AuthUser>} Authenticated user entity
   * @throws {BiometricNotAvailableError} When biometric unavailable
   * @businessRule BR-201: Biometric authentication with security validation
   */
  authenticateWithBiometric(): Promise<AuthUser>;

  /**
   * Disable biometric authentication for current user.
   * 
   * @returns {Promise<void>} Promise resolving when biometric disabled
   * @businessRule BR-202: Secure biometric disabling with cleanup
   */
  disableBiometric(): Promise<void>;

  // ==========================================
  // 🌐 OAUTH & SOCIAL LOGIN
  // ==========================================

  /**
   * Authenticate user with Google OAuth provider.
   * 
   * @returns {Promise<AuthUser>} Authenticated user entity
   * @throws {GenericAuthError} When OAuth flow fails
   * @businessRule BR-203: Google OAuth integration with security validation
   */
  loginWithGoogle(): Promise<AuthUser>;

  /**
   * Authenticate user with Apple OAuth provider.
   * 
   * @returns {Promise<AuthUser>} Authenticated user entity
   * @throws {GenericAuthError} When OAuth flow fails
   * @businessRule BR-204: Apple OAuth integration with security validation
   */
  loginWithApple(): Promise<AuthUser>;

  /**
   * Authenticate user with Microsoft OAuth provider.
   * 
   * @returns {Promise<AuthUser>} Authenticated user entity
   * @throws {GenericAuthError} When OAuth flow fails
   * @businessRule BR-205: Microsoft OAuth integration with security validation
   */
  loginWithMicrosoft(): Promise<AuthUser>;

  /**
   * Link OAuth provider to existing user account.
   * 
   * @param {string} provider - OAuth provider to link
   * @returns {Promise<void>} Promise resolving when provider linked
   * @businessRule BR-206: OAuth provider linking with security validation
   */
  linkOAuthProvider(provider: 'google' | 'apple' | 'microsoft'): Promise<void>;

  /**
   * Unlink OAuth provider from user account.
   * 
   * @param {string} provider - OAuth provider to unlink
   * @returns {Promise<void>} Promise resolving when provider unlinked
   * @businessRule BR-207: OAuth provider unlinking with security validation
   */
  unlinkOAuthProvider(
    provider: 'google' | 'apple' | 'microsoft'
  ): Promise<void>;

  // ==========================================
  // 👥 ROLE-BASED ACCESS CONTROL
  // ==========================================

  /**
   * Get user roles for authorization.
   * 
   * @param {string} [userId] - Optional user ID (defaults to current user)
   * @returns {Promise<string[]>} Array of user roles
   * @businessRule BR-208: Role-based access control implementation
   */
  getUserRoles(userId?: string): Promise<string[]>;

  /**
   * Get user permissions for fine-grained authorization.
   * 
   * @param {string} [userId] - Optional user ID (defaults to current user)
   * @returns {Promise<string[]>} Array of user permissions
   * @businessRule BR-209: Permission-based access control implementation
   */
  getUserPermissions(userId?: string): Promise<string[]>;

  /**
   * Check if user has specific permission.
   * 
   * @param {string} permission - Permission to check
   * @param {string} [userId] - Optional user ID (defaults to current user)
   * @returns {Promise<boolean>} True if user has permission
   * @businessRule BR-210: Permission validation for access control
   */
  hasPermission(permission: string, userId?: string): Promise<boolean>;

  /**
   * Check if user has specific role.
   * 
   * @param {string} role - Role to check
   * @param {string} [userId] - Optional user ID (defaults to current user)
   * @returns {Promise<boolean>} True if user has role
   * @businessRule BR-211: Role validation for access control
   */
  hasRole(role: string, userId?: string): Promise<boolean>;

  // ==========================================
  // 🕐 SESSION MANAGEMENT
  // ==========================================

  /**
   * Get active user sessions across devices.
   * 
   * @returns {Promise<UserSession[]>} Array of active user sessions
   * @businessRule BR-212: Session enumeration for security monitoring
   * @securityNote Session information sanitized for security
   */
  getActiveSessions(): Promise<UserSession[]>;

  /**
   * Terminate specific user session.
   * 
   * @param {string} sessionId - Session identifier to terminate
   * @returns {Promise<void>} Promise resolving when session terminated
   * @businessRule BR-213: Secure session termination
   */
  terminateSession(sessionId: string): Promise<void>;

  /**
   * Terminate all other user sessions except current.
   * 
   * @returns {Promise<void>} Promise resolving when sessions terminated
   * @businessRule BR-214: Mass session termination for security
   */
  terminateOtherSessions(): Promise<void>;

  /**
   * Refresh current user session.
   * 
   * @returns {Promise<void>} Promise resolving when session refreshed
   * @businessRule BR-215: Session refresh with security validation
   */
  refreshSession(): Promise<void>;

  /**
   * Set session timeout for automatic logout.
   * 
   * @param {number} minutes - Session timeout in minutes
   * @returns {Promise<void>} Promise resolving when timeout set
   * @businessRule BR-216: Configurable session timeout for security
   */
  setSessionTimeout(minutes: number): Promise<void>;

  // ==========================================
  // 🔍 SECURITY & AUDIT
  // ==========================================

  /**
   * Log security event for audit and monitoring.
   * 
   * @param {SecurityEvent} event - Security event to log
   * @returns {Promise<void>} Promise resolving when event logged
   * @businessRule BR-217: Comprehensive security event logging
   * @auditLog All security events logged for compliance
   */
  logSecurityEvent(event: SecurityEvent): Promise<void>;

  /**
   * Get security events for user audit trail.
   * 
   * @param {number} [limit] - Maximum number of events to return
   * @returns {Promise<SecurityEvent[]>} Array of security events
   * @businessRule BR-218: Security event retrieval for audit
   */
  getSecurityEvents(limit?: number): Promise<SecurityEvent[]>;

  /**
   * Check for suspicious user activity patterns.
   * 
   * @returns {Promise<SecurityAlert[]>} Array of security alerts
   * @businessRule BR-219: Automated suspicious activity detection
   * @securityNote Real-time threat detection and alerting
   */
  checkSuspiciousActivity(): Promise<SecurityAlert[]>;

  /**
   * Update user password with policy validation.
   * 
   * @param {string} currentPassword - Current user password
   * @param {string} newPassword - New password to set
   * @returns {Promise<void>} Promise resolving when password updated
   * @throws {WeakPasswordError} When new password fails strength validation
   * @businessRule BR-220: Secure password update with validation
   */
  updatePassword(currentPassword: string, newPassword: string): Promise<void>;
}

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  userId: string;
  timestamp: Date;
  severity: SecurityEventSeverity;
  details: {
    action: string;
    message: string;
    [key: string]: any;
  };
  ipAddress: string;
  userAgent: string;
}

export interface SecurityAlert {
  id: string;
  type:
    | 'multiple_failed_logins'
    | 'unusual_location'
    | 'new_device'
    | 'suspicious_activity';
  message: string;
  severity: SecurityEventSeverity;
  timestamp: Date;
  resolved: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: PasswordStrength;
  score: number; // 0-100
} 