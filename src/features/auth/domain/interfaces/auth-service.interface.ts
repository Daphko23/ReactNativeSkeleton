/**
 * @fileoverview AUTH-SERVICE-INTERFACE: Enterprise Authentication Service Contract
 * @description Umfassende Interface-Definition für Authentication Services mit Enterprise-Standard
 * TS-Doc Dokumentation. Implementiert Interface Segregation Principle (ISP) und definiert
 * alle Auth-Operationen für bessere Testbarkeit und Dependency Injection.
 * 
 * Dieses Interface stellt einen einheitlichen Vertrag für alle Authentifizierungsoperationen
 * in Enterprise-Anwendungen bereit. Es kombiniert mehrere spezialisierte Interfaces um
 * umfassende Auth-Funktionalität bereitzustellen bei gleichzeitiger Wahrung der Trennung
 * von Belangen durch das Interface Segregation Principle.
 * 
 * @version 2.1.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthServiceInterface
 * @namespace Features.Auth.Domain.Interfaces
 * @category Authentication
 * @subcategory Service Contracts
 * 
 * @security 
 * - Alle Operationen implementieren Enterprise Security Standards
 * - Umfassende Audit-Protokollierung für Compliance
 * - Rate Limiting und DDoS-Schutz
 * - Input-Validierung und -Bereinigung
 * - Sichere Session-Verwaltung
 * 
 * @compliance
 * - GDPR-konforme Datenverarbeitung
 * - SOC 2 Audit-Anforderungen  
 * - ISO 27001 Sicherheitsstandards
 * - OWASP Sicherheitsrichtlinien
 * - EU-AI-ACT 2025 Compliance
 * 
 * @performance
 * - Sub-Second Response Times für alle Operationen
 * - Optimierte Caching-Strategien
 * - Connection Pooling und Ressourcen-Optimierung
 * - Async/await Patterns für non-blocking Operations
 * - Memory-efficient Implementierungen
 * 
 * @patterns
 * - Interface Segregation Principle (ISP)
 * - Dependency Injection Pattern
 * - Enterprise Service Layer Pattern
 * - Authentication/Authorization Pattern
 * - Observer Pattern für Security Events
 * 
 * @dependencies
 * - AuthUser Entity für User-Datenstrukturen
 * - MFAFactor für Multi-Factor Authentication
 * - Request/Response DTOs für Type Safety
 * - Error Types für spezifische Exception Handling
 * 
 * @examples
 * 
 * **Basic Authentication:**
 * ```typescript
 * // Dependency Injection mit Interface
 * const authService: IAuthService = container.get<IAuthService>('AuthService');
 * 
 * // Enterprise Login mit MFA
 * try {
 *   const user = await authService.login({
 *     email: 'user@company.com',
 *     password: 'SecurePass123!',
 *     enforcePasswordPolicy: true
 *   });
 *   console.log(`Welcome ${user.email}!`);
 * } catch (error) {
 *   if (error instanceof MFARequiredError) {
 *     // Handle MFA flow
 *   }
 * }
 * ```
 * 
 * **Multi-Factor Authentication:**
 * ```typescript
 * // Enable TOTP MFA
 * const mfaResult = await authService.enableMFA({
 *   method: 'totp'
 * });
 * 
 * // Verify MFA code
 * const verification = await authService.verifyMFA({
 *   code: '123456',
 *   method: 'totp'
 * });
 * ```
 * 
 * **Role-Based Access Control:**
 * ```typescript
 * // Check permissions
 * const hasAccess = await authService.hasPermission('admin:users:read');
 * if (hasAccess) {
 *   // Show admin interface
 * }
 * 
 * // Get user roles
 * const roles = await authService.getUserRoles();
 * console.log(`User roles: ${roles.join(', ')}`);
 * ```
 * 
 * @see {@link AuthUser} für User Entity Definition
 * @see {@link MFAFactor} für Multi-Factor Authentication
 * @see {@link LoginRequest} für Authentication Request DTOs
 * @see {@link BiometricAuthResponse} für Biometric Authentication
 * @see {@link PermissionResponse} für RBAC Response Types
 * 
 * @todo 
 * - Implement WebAuthn/Passkeys Interface (Q2 2025)
 * - Add Zero Trust Architecture Interface (Q3 2025)  
 * - Integrate Quantum-Safe Crypto Interface (Q4 2025)
 * - Add Advanced Threat Intelligence Interface (Q1 2026)
 * 
 * @changelog
 * - v2.1.0: Enhanced TS-Doc mit Industry Standard 2025 Compliance
 * - v2.0.0: Interface Segregation und Enterprise Patterns
 * - v1.5.0: Biometric und OAuth Integration
 * - v1.0.0: Initial Enterprise Interface Definition
 */

import {AuthUser, MFAFactor} from '../../domain/entities/auth-user.interface';
import {
  LoginRequest,
  RegisterRequest,
  UpdatePasswordRequest,
  EnableMFARequest,
  EnableMFAResponse,
  VerifyMFARequest,
  VerifyMFAResponse,
  BiometricAuthResponse,
  OAuthLoginResponse,
  SuspiciousActivityResponse,
  ActiveSessionsResponse,
  PermissionResponse,
} from '../dtos';

// ==========================================
// 🔐 ENTERPRISE AUTH SERVICE INTERFACE
// ==========================================

/**
 * 🏢 Enterprise Authentication Service Interface
 *
 * Comprehensive authentication service interface implementing all enterprise
 * authentication patterns including MFA, Biometric, OAuth, RBAC, and Security Monitoring.
 *
 * @interface IAuthService
 * @extends ICoreAuthService, IMFAService, IBiometricAuthService, IOAuthService, ISecurityService, IPasswordService, ISessionService, IRBACService
 *
 * @description
 * This interface provides a unified contract for all authentication operations
 * in enterprise applications. It combines multiple specialized interfaces to
 * provide comprehensive auth functionality while maintaining clean separation
 * of concerns through Interface Segregation Principle.
 *
 * @security
 * - All operations implement enterprise security standards
 * - Comprehensive audit logging for compliance
 * - Rate limiting and DDoS protection
 * - Input validation and sanitization
 * - Secure session management
 *
 * @performance
 * - Sub-second response times for all operations
 * - Optimized caching strategies
 * - Connection pooling and resource optimization
 * - Async/await patterns for non-blocking operations
 *
 * @compliance
 * - GDPR compliant data handling
 * - SOC 2 audit requirements
 * - ISO 27001 security standards
 * - OWASP security guidelines
 */
export interface IAuthService
  extends ICoreAuthService,
    IMFAService,
    IBiometricAuthService,
    IOAuthService,
    ISecurityService,
    IPasswordService,
    ISessionService,
    IRBACService {}

// ==========================================
// 🎯 SPECIALIZED INTERFACES (ISP)
// ==========================================

/**
 * 🔐 Core Authentication Operations Interface
 *
 * Defines fundamental authentication operations including login, registration,
 * logout, and basic user management functionality.
 *
 * @interface ICoreAuthService
 * @description
 * Core authentication interface following Single Responsibility Principle.
 * Handles basic authentication flows without additional security layers.
 *
 * @security Basic authentication with password policy enforcement
 * @performance Optimized for < 500ms response times
 */
export interface ICoreAuthService {
  /**
   * Authenticates user with email and password credentials.
   *
   * @description
   * Performs enterprise-grade email/password authentication with comprehensive
   * security checks, password policy validation, and audit logging.
   *
   * @param request - Login credentials and configuration
   * @param request.email - User email address (validated format)
   * @param request.password - User password (policy validated if enabled)
   * @param request.enforcePasswordPolicy - Enable password policy validation
   * @param request.rememberMe - Enable persistent session (optional)
   *
   * @returns Promise resolving to authenticated user with security context
   *
   * @throws {InvalidCredentialsError} When email/password combination is invalid
   * @throws {UserLockedError} When user account is locked due to failed attempts
   * @throws {PasswordPolicyViolationError} When password policy is enforced and fails
   * @throws {MFARequiredError} When Multi-Factor Authentication is required
   * @throws {UserNotActivatedError} When user account requires activation
   * @throws {GenericAuthError} For unexpected authentication errors
   *
   * @security
   * - Rate limiting: 5 attempts per 15 minutes per IP
   * - Password policy enforcement (configurable)
   * - Audit logging for all login attempts
   * - Session security with secure cookies
   * - Anti-brute force protection
   *
   * @performance
   * - Target response time: < 300ms
   * - Database query optimization
   * - Memory-efficient validation
   * - Cached password policy rules
   *
   * @example
   * ```typescript
   * const user = await authService.login({
   *   email: 'john.doe@company.com',
   *   password: 'SecurePassword123!',
   *   enforcePasswordPolicy: true,
   *   rememberMe: false
   * });
   *
   * console.log(`Welcome ${user.email}!`);
   * console.log(`Roles: ${user.roles.join(', ')}`);
   * ```
   */
  login(request: LoginRequest): Promise<AuthUser>;

  /**
   * Registers new user account with comprehensive validation.
   *
   * @description
   * Creates new user account with enterprise-grade validation, password policy
   * enforcement, and automatic role assignment based on business rules.
   *
   * @param request - Registration data and configuration
   * @param request.email - Unique email address (format validated)
   * @param request.password - Password (policy validated)
   * @param request.firstName - User first name (optional)
   * @param request.lastName - User last name (optional)
   * @param request.acceptTerms - Terms acceptance flag
   *
   * @returns Promise resolving to newly created user account
   *
   * @throws {EmailAlreadyExistsError} When email is already registered
   * @throws {PasswordPolicyViolationError} When password doesn't meet policy
   * @throws {InvalidEmailFormatError} When email format is invalid
   * @throws {TermsNotAcceptedError} When terms acceptance is required but missing
   * @throws {GenericAuthError} For unexpected registration errors
   *
   * @security
   * - Email uniqueness validation
   * - Password strength enforcement
   * - Terms acceptance tracking
   * - Audit logging for registrations
   * - Anti-spam protection
   *
   * @performance
   * - Target response time: < 500ms
   * - Asynchronous email verification
   * - Batch validation optimizations
   *
   * @example
   * ```typescript
   * const newUser = await authService.register({
   *   email: 'jane.smith@company.com',
   *   password: 'MySecurePass123!',
   *   firstName: 'Jane',
   *   lastName: 'Smith',
   *   acceptTerms: true
   * });
   *
   * console.log(`Account created for ${newUser.email}`);
   * ```
   */
  register(request: RegisterRequest): Promise<AuthUser>;

  /**
   * Securely logs out current authenticated user.
   *
   * @description
   * Performs secure logout by invalidating session tokens, clearing cookies,
   * and logging security events for audit purposes.
   *
   * @returns Promise resolving when logout is complete
   *
   * @throws {UserNotAuthenticatedError} When no active session exists
   * @throws {GenericAuthError} For unexpected logout errors
   *
   * @security
   * - Session token invalidation
   * - Secure cookie clearing
   * - Audit logging for logout events
   * - Cross-device session termination (optional)
   *
   * @performance
   * - Target response time: < 100ms
   * - Asynchronous cleanup operations
   * - Minimal database operations
   *
   * @example
   * ```typescript
   * await authService.logout();
   * console.log('User logged out successfully');
   * ```
   */
  logout(): Promise<void>;

  /**
   * Retrieves current authenticated user with security context.
   *
   * @description
   * Returns currently authenticated user information including roles, permissions,
   * and security metadata. Returns null if no user is authenticated.
   *
   * @returns Promise resolving to current user or null
   *
   * @throws {GenericAuthError} For unexpected retrieval errors
   *
   * @security
   * - Session validation
   * - Token integrity verification
   * - Sensitive data sanitization
   * - Access logging
   *
   * @performance
   * - Target response time: < 50ms
   * - Cached user data when possible
   * - Optimized database queries
   *
   * @example
   * ```typescript
   * const currentUser = await authService.getCurrentUser();
   * if (currentUser) {
   *   console.log(`Current user: ${currentUser.email}`);
   *   console.log(`Roles: ${currentUser.roles.join(', ')}`);
   * } else {
   *   console.log('No user authenticated');
   * }
   * ```
   */
  getCurrentUser(): Promise<AuthUser | null>;

  /**
   * Checks if user is currently authenticated.
   *
   * @description
   * Fast authentication status check without full user data retrieval.
   * Validates session tokens and returns boolean authentication status.
   *
   * @returns Promise resolving to boolean authentication status
   *
   * @security
   * - Session token validation
   * - Expiration checking
   * - Security context verification
   *
   * @performance
   * - Target response time: < 25ms
   * - Minimal database impact
   * - Cached validation results
   *
   * @example
   * ```typescript
   * const isAuth = await authService.isAuthenticated();
   * if (isAuth) {
   *   // Show authenticated UI
   * } else {
   *   // Redirect to login
   * }
   * ```
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Initiates secure password reset process.
   *
   * @description
   * Initiates password reset by sending secure reset link to user's email.
   * Implements rate limiting and security checks to prevent abuse.
   *
   * @param email - Email address for password reset
   *
   * @returns Promise resolving when reset email is sent
   *
   * @throws {UserNotFoundError} When email address is not registered
   * @throws {RateLimitExceededError} When reset requests exceed rate limit
   * @throws {EmailServiceError} When email sending fails
   * @throws {GenericAuthError} For unexpected reset errors
   *
   * @security
   * - Rate limiting: 3 requests per hour per email
   * - Secure token generation
   * - Email verification
   * - Audit logging for reset attempts
   * - Anti-abuse protection
   *
   * @performance
   * - Target response time: < 200ms
   * - Asynchronous email sending
   * - Optimized token generation
   *
   * @example
   * ```typescript
   * await authService.resetPassword('user@company.com');
   * console.log('Password reset email sent');
   * ```
   */
  resetPassword(email: string): Promise<void>;
}

/**
 * 🔐 Multi-Factor Authentication Operations Interface
 *
 * Defines MFA operations including TOTP, SMS, and Email-based authentication
 * with comprehensive security and compliance features.
 *
 * @interface IMFAService
 * @description
 * Enterprise MFA interface supporting multiple authentication factors
 * with security logging and compliance tracking.
 *
 * @security Enhanced security with multiple authentication factors
 * @performance Optimized for < 100ms MFA verification
 */
export interface IMFAService {
  /**
   * Enables Multi-Factor Authentication for authenticated user.
   *
   * @description
   * Configures MFA for the current user with support for TOTP, SMS, and Email
   * methods. Generates backup codes and QR codes for TOTP setup.
   *
   * @param request - MFA configuration request
   * @param request.method - MFA method ('totp' | 'sms' | 'email')
   * @param request.phoneNumber - Phone number for SMS (required for SMS method)
   *
   * @returns Promise resolving to MFA setup result with QR code and backup codes
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {MFAAlreadyEnabledError} When MFA is already enabled for user
   * @throws {InvalidPhoneNumberError} When phone number format is invalid
   * @throws {GenericAuthError} For unexpected MFA setup errors
   *
   * @security
   * - Secure secret generation
   * - Backup code generation and encryption
   * - Audit logging for MFA enablement
   * - Rate limiting for setup attempts
   *
   * @performance
   * - Target response time: < 500ms
   * - Cached setup data for 5 minutes
   * - Optimized QR code generation
   *
   * @example
   * ```typescript
   * const mfaResult = await authService.enableMFA({
   *   method: 'totp'
   * });
   *
   * console.log('Scan QR Code:', mfaResult.qrCode);
   * console.log('Backup Codes:', mfaResult.backupCodes);
   * ```
   */
  enableMFA(request: EnableMFARequest): Promise<EnableMFAResponse>;

  /**
   * Verifies Multi-Factor Authentication challenge code.
   *
   * @description
   * Validates MFA codes from TOTP apps, SMS, or Email with comprehensive
   * security checks and rate limiting to prevent brute force attacks.
   *
   * @param request - MFA verification request
   * @param request.code - 6-digit verification code
   * @param request.method - MFA method used for verification
   * @param request.challengeId - Challenge identifier (optional)
   *
   * @returns Promise resolving to verification result with access token
   *
   * @throws {InvalidMFACodeError} When verification code is invalid
   * @throws {MFAChallengeExpiredError} When challenge has expired
   * @throws {RateLimitExceededError} When verification attempts exceed limit
   * @throws {GenericAuthError} For unexpected verification errors
   *
   * @security
   * - Rate limiting: 5 attempts per 5 minutes
   * - Time-based code validation
   * - Replay attack prevention
   * - Audit logging for all attempts
   *
   * @performance
   * - Target response time: < 100ms
   * - Optimized code validation
   * - Minimal database operations
   *
   * @example
   * ```typescript
   * const result = await authService.verifyMFA({
   *   code: '123456',
   *   method: 'totp'
   * });
   *
   * if (result.success) {
   *   console.log('MFA verified, access token:', result.accessToken);
   * }
   * ```
   */
  verifyMFA(request: VerifyMFARequest): Promise<VerifyMFAResponse>;

  /**
   * Retrieves configured MFA factors for current user.
   *
   * @description
   * Returns list of configured MFA methods including TOTP authenticators,
   * SMS numbers, and email addresses with sanitized metadata.
   *
   * @returns Promise resolving to array of configured MFA factors
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {GenericAuthError} For unexpected retrieval errors
   *
   * @security
   * - Sensitive data sanitization
   * - Access control verification
   * - Audit logging for factor access
   *
   * @performance
   * - Target response time: < 100ms
   * - Cached factor data for 2 minutes
   * - Optimized queries
   *
   * @example
   * ```typescript
   * const factors = await authService.getMFAFactors();
   * factors.forEach(factor => {
   *   console.log(`${factor.type}: ${factor.isEnabled ? 'Enabled' : 'Disabled'}`);
   * });
   * ```
   */
  getMFAFactors(): Promise<MFAFactor[]>;
}

/**
 * 📱 Biometric Authentication Operations Interface
 *
 * Defines biometric authentication operations including Face ID, Touch ID,
 * and fingerprint authentication with device capability checking.
 *
 * @interface IBiometricAuthService
 * @description
 * Enterprise biometric authentication interface with comprehensive device
 * support and security validation.
 *
 * @security Anti-spoofing measures and secure biometric validation
 * @performance Optimized for < 2s biometric authentication
 */
export interface IBiometricAuthService {
  /**
   * Checks biometric authentication availability on current device.
   *
   * @description
   * Performs comprehensive device capability check for biometric authentication
   * including Face ID, Touch ID, fingerprint sensors, and device security status.
   *
   * @returns Promise resolving to boolean indicating biometric availability
   *
   * @security
   * - Device security validation
   * - Hardware capability verification
   * - No sensitive data exposure
   *
   * @performance
   * - Target response time: < 50ms
   * - Cached results for 1 minute
   * - Minimal hardware queries
   *
   * @example
   * ```typescript
   * const isAvailable = await authService.isBiometricAvailable();
   * if (isAvailable) {
   *   // Show biometric login option
   *   console.log('Biometric authentication available');
   * }
   * ```
   */
  isBiometricAvailable(): Promise<boolean>;

  /**
   * Enables biometric authentication for current user.
   *
   * @description
   * Configures biometric authentication with enterprise security validation.
   * Verifies device capabilities and user authentication state before enablement.
   *
   * @returns Promise resolving to biometric enablement result
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {BiometricNotAvailableError} When biometric hardware is unavailable
   * @throws {BiometricNotEnrolledError} When no biometric data is enrolled
   * @throws {GenericAuthError} For unexpected enablement errors
   *
   * @security
   * - Device security validation
   * - Biometric enrollment verification
   * - Audit logging for enablement
   * - Anti-spoofing measures
   *
   * @performance
   * - Target response time: < 1s
   * - Optimized hardware validation
   * - Minimal UI blocking
   *
   * @example
   * ```typescript
   * const result = await authService.enableBiometric();
   * if (result.success) {
   *   console.log('Biometric authentication enabled');
   * }
   * ```
   */
  enableBiometric(): Promise<BiometricAuthResponse>;

  /**
   * Authenticates user using biometric credentials.
   *
   * @description
   * Performs biometric authentication with enterprise security validation.
   * Supports Face ID, Touch ID, and fingerprint authentication with anti-spoofing.
   *
   * @returns Promise resolving to authentication result with access token
   *
   * @throws {BiometricNotAvailableError} When biometric is not available
   * @throws {BiometricAuthFailedError} When biometric authentication fails
   * @throws {BiometricCancelledError} When user cancels biometric prompt
   * @throws {GenericAuthError} For unexpected authentication errors
   *
   * @security
   * - Anti-spoofing protection
   * - Liveness detection
   * - Audit logging for attempts
   * - Secure token generation
   *
   * @performance
   * - Target response time: < 2s
   * - Optimized biometric validation
   * - Hardware acceleration support
   *
   * @example
   * ```typescript
   * const result = await authService.authenticateWithBiometric();
   * if (result.success) {
   *   console.log('Biometric authentication successful');
   *   console.log('Access Token:', result.accessToken);
   * }
   * ```
   */
  authenticateWithBiometric(): Promise<BiometricAuthResponse>;
}

/**
 * 🔗 OAuth Authentication Operations Interface
 *
 * Defines OAuth 2.0 authentication operations for third-party providers
 * including Google, Apple, and Microsoft with PKCE security.
 *
 * @interface IOAuthService
 * @description
 * Enterprise OAuth interface implementing OAuth 2.0 with PKCE for secure
 * third-party authentication and account linking.
 *
 * @security OAuth 2.0 with PKCE and state validation
 * @performance Optimized for mobile OAuth flows
 */
export interface IOAuthService {
  /**
   * Authenticates user using Google OAuth provider.
   *
   * @description
   * Implements OAuth 2.0 authentication with Google using PKCE for enhanced
   * security. Handles token exchange, user profile retrieval, and account linking.
   *
   * @returns Promise resolving to OAuth authentication result
   *
   * @throws {OAuthProviderError} When Google OAuth returns error
   * @throws {OAuthCancelledError} When user cancels OAuth flow
   * @throws {NetworkError} When network connectivity issues occur
   * @throws {GenericAuthError} For unexpected OAuth errors
   *
   * @security
   * - OAuth 2.0 with PKCE implementation
   * - State parameter validation
   * - Secure token handling
   * - Account linking protection
   *
   * @performance
   * - Target response time: < 3s
   * - Optimized for mobile flows
   * - Efficient token management
   *
   * @example
   * ```typescript
   * const result = await authService.loginWithGoogle();
   * if (result.success && result.user) {
   *   console.log(`Welcome ${result.user.email}!`);
   *   console.log('Provider: Google');
   * }
   * ```
   */
  loginWithGoogle(): Promise<OAuthLoginResponse>;

  /**
   * Authenticates user using Apple OAuth provider.
   *
   * @description
   * Implements Sign in with Apple using OAuth 2.0 with enhanced privacy
   * features including email relay and private email addresses.
   *
   * @returns Promise resolving to authenticated user
   *
   * @throws {OAuthProviderError} When Apple OAuth returns error
   * @throws {OAuthCancelledError} When user cancels OAuth flow
   * @throws {NetworkError} When network connectivity issues occur
   * @throws {GenericAuthError} For unexpected OAuth errors
   *
   * @security
   * - Apple's enhanced privacy features
   * - Secure token validation
   * - Email relay support
   * - Account linking protection
   *
   * @performance
   * - Target response time: < 3s
   * - Native iOS integration
   * - Optimized token flows
   *
   * @example
   * ```typescript
   * const user = await authService.loginWithApple();
   * console.log(`Welcome ${user.email}!`);
   * console.log('Provider: Apple');
   * ```
   */
  loginWithApple(): Promise<AuthUser>;

  /**
   * Authenticates user using Microsoft OAuth provider.
   *
   * @description
   * Implements Microsoft OAuth 2.0 authentication with Azure AD integration
   * for enterprise environments and Office 365 connectivity.
   *
   * @returns Promise resolving to authenticated user
   *
   * @throws {OAuthProviderError} When Microsoft OAuth returns error
   * @throws {OAuthCancelledError} When user cancels OAuth flow
   * @throws {NetworkError} When network connectivity issues occur
   * @throws {GenericAuthError} For unexpected OAuth errors
   *
   * @security
   * - Azure AD integration
   * - Enterprise security compliance
   * - Secure token management
   * - Account linking validation
   *
   * @performance
   * - Target response time: < 3s
   * - Enterprise-optimized flows
   * - Efficient Azure integration
   *
   * @example
   * ```typescript
   * const user = await authService.loginWithMicrosoft();
   * console.log(`Welcome ${user.email}!`);
   * console.log('Provider: Microsoft');
   * ```
   */
  loginWithMicrosoft(): Promise<AuthUser>;
}

/**
 * 🛡️ Security & Monitoring Operations Interface
 *
 * Defines security monitoring and threat detection operations including
 * suspicious activity analysis and security event logging.
 *
 * @interface ISecurityService
 * @description
 * Enterprise security interface providing comprehensive threat detection,
 * behavioral analysis, and security event management.
 *
 * @security Advanced threat detection with ML algorithms
 * @performance Real-time analysis with < 500ms response
 */
export interface ISecurityService {
  /**
   * Analyzes and reports suspicious activity for current user.
   *
   * @description
   * Performs comprehensive security analysis using machine learning algorithms
   * to detect anomalous behavior patterns and potential security threats.
   *
   * @returns Promise resolving to suspicious activity analysis report
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {GenericAuthError} For unexpected analysis errors
   *
   * @security
   * - Privacy-preserving analysis
   * - ML-based threat detection
   * - Behavioral pattern analysis
   * - Real-time risk assessment
   *
   * @performance
   * - Target response time: < 500ms
   * - Real-time analysis engine
   * - Optimized ML algorithms
   *
   * @example
   * ```typescript
   * const analysis = await authService.checkSuspiciousActivity();
   * if (analysis.hasActivity) {
   *   console.log(`Risk Level: ${analysis.riskLevel}`);
   *   analysis.recommendations.forEach(rec => {
   *     console.log(`Recommendation: ${rec}`);
   *   });
   * }
   * ```
   */
  checkSuspiciousActivity(): Promise<SuspiciousActivityResponse>;

  /**
   * Retrieves security events for current user.
   *
   * @description
   * Returns paginated list of security events including login attempts,
   * failed authentications, and security-related activities with filtering.
   *
   * @param limit - Maximum number of events to return (default: 50)
   *
   * @returns Promise resolving to array of security events
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {GenericAuthError} For unexpected retrieval errors
   *
   * @security
   * - Sensitive data sanitization
   * - Access control verification
   * - Audit logging compliance
   *
   * @performance
   * - Target response time: < 200ms
   * - Paginated results
   * - Optimized event queries
   *
   * @example
   * ```typescript
   * const events = await authService.getSecurityEvents(25);
   * events.forEach(event => {
   *   console.log(`${event.type}: ${event.timestamp}`);
   * });
   * ```
   */
  getSecurityEvents(limit?: number): Promise<any[]>;
}

/**
 * 🔑 Password Management Operations Interface
 *
 * Defines password management operations including updates, validation,
 * and policy enforcement with enterprise security standards.
 *
 * @interface IPasswordService
 * @description
 * Enterprise password management interface with comprehensive policy
 * enforcement and security validation.
 *
 * @security Advanced password policies and entropy validation
 * @performance Optimized validation with < 100ms response
 */
export interface IPasswordService {
  /**
   * Updates user password with comprehensive validation.
   *
   * @description
   * Updates current user's password with enterprise security validation,
   * password policy enforcement, and audit logging.
   *
   * @param request - Password update request
   * @param request.currentPassword - Current password for verification
   * @param request.newPassword - New password (policy validated)
   *
   * @returns Promise resolving when password is successfully updated
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {InvalidCurrentPasswordError} When current password is incorrect
   * @throws {PasswordPolicyViolationError} When new password violates policy
   * @throws {PasswordReuseError} When new password was recently used
   * @throws {GenericAuthError} For unexpected update errors
   *
   * @security
   * - Current password verification
   * - Password policy enforcement
   * - Password history checking
   * - Audit logging for changes
   *
   * @performance
   * - Target response time: < 300ms
   * - Optimized policy validation
   * - Secure hash generation
   *
   * @example
   * ```typescript
   * await authService.updatePassword({
   *   currentPassword: 'OldPassword123!',
   *   newPassword: 'NewSecurePassword456!'
   * });
   * console.log('Password updated successfully');
   * ```
   */
  updatePassword(request: UpdatePasswordRequest): Promise<void>;

  /**
   * Updates password using enterprise UseCase pattern.
   *
   * @description
   * Alternative password update method using UseCase pattern for complex
   * enterprise scenarios with additional business logic validation.
   *
   * @param request - UseCase-specific password update request
   *
   * @returns Promise resolving to update result with metadata
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {PasswordPolicyViolationError} When password violates policy
   * @throws {GenericAuthError} For unexpected errors
   *
   * @security
   * - Enhanced business rule validation
   * - Enterprise policy enforcement
   * - Comprehensive audit logging
   *
   * @performance
   * - Target response time: < 400ms
   * - UseCase-optimized processing
   * - Business rule caching
   */
  updatePasswordWithUseCase(request: any): Promise<any>;

  /**
   * Validates password against enterprise security policies.
   *
   * @description
   * Comprehensive password validation against configurable enterprise policies
   * including length, complexity, entropy, and dictionary checks.
   *
   * @param password - Password to validate
   * @param userInfo - Optional user context for validation
   *
   * @returns Promise resolving to validation result with suggestions
   *
   * @throws {GenericAuthError} For unexpected validation errors
   *
   * @security
   * - Entropy analysis
   * - Dictionary attack protection
   * - Common password detection
   * - Context-aware validation
   *
   * @performance
   * - Target response time: < 50ms
   * - Cached policy rules
   * - Optimized algorithms
   *
   * @example
   * ```typescript
   * const validation = await authService.validatePassword(
   *   'ProposedPassword123!',
   *   { email: 'user@company.com' }
   * );
   *
   * if (!validation.isValid) {
   *   validation.errors.forEach(error => console.log(error));
   *   validation.suggestions.forEach(suggestion => console.log(suggestion));
   * }
   * ```
   */
  validatePassword(password: string, userInfo?: any): Promise<any>;
}

/**
 * 🕐 Session Management Operations Interface
 *
 * Defines session management operations including active session tracking,
 * termination, and cross-device session control.
 *
 * @interface ISessionService
 * @description
 * Enterprise session management interface providing comprehensive session
 * control and monitoring across multiple devices and platforms.
 *
 * @security Secure session management with device tracking
 * @performance Optimized queries with pagination support
 */
export interface ISessionService {
  /**
   * Retrieves all active sessions for current user.
   *
   * @description
   * Returns comprehensive session information including device details,
   * location data, and activity timestamps with enterprise security context.
   *
   * @returns Promise resolving to active sessions with metadata
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {GenericAuthError} For unexpected retrieval errors
   *
   * @security
   * - Sensitive location data sanitization
   * - Device fingerprinting
   * - Session integrity verification
   * - Access control validation
   *
   * @performance
   * - Target response time: < 200ms
   * - Paginated session data
   * - Optimized device queries
   *
   * @example
   * ```typescript
   * const sessions = await authService.getActiveSessions();
   * console.log(`Total active sessions: ${sessions.totalCount}`);
   *
   * sessions.sessions.forEach(session => {
   *   console.log(`Device: ${session.deviceInfo.platform}`);
   *   console.log(`Last Activity: ${session.lastActivity}`);
   * });
   * ```
   */
  getActiveSessions(): Promise<ActiveSessionsResponse>;

  /**
   * Terminates specific user session across all devices.
   *
   * @description
   * Securely terminates specified session by invalidating tokens, clearing
   * cookies, and notifying affected devices with audit logging.
   *
   * @param sessionId - Unique session identifier to terminate
   *
   * @returns Promise resolving when session is successfully terminated
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {SessionNotFoundError} When session ID is invalid
   * @throws {PermissionDeniedError} When user cannot terminate the session
   * @throws {GenericAuthError} For unexpected termination errors
   *
   * @security
   * - Session ownership validation
   * - Secure token invalidation
   * - Cross-device notification
   * - Audit logging for termination
   *
   * @performance
   * - Target response time: < 150ms
   * - Asynchronous cleanup
   * - Efficient token invalidation
   *
   * @example
   * ```typescript
   * await authService.terminateSession('session-uuid-123');
   * console.log('Session terminated successfully');
   * ```
   */
  terminateSession(sessionId: string): Promise<void>;
}

/**
 * 👥 Role-Based Access Control Operations Interface
 *
 * Defines RBAC operations including permission checking, role management,
 * and access control with hierarchical role support.
 *
 * @interface IRBACService
 * @description
 * Enterprise RBAC interface providing comprehensive role and permission
 * management with hierarchical inheritance and audit compliance.
 *
 * @security Comprehensive RBAC with audit logging
 * @performance Cached permissions with < 30s response
 */
export interface IRBACService {
  /**
   * Checks if user has specific permission.
   *
   * @description
   * Performs efficient permission check using cached RBAC data with support
   * for hierarchical permissions and role inheritance patterns.
   *
   * @param permission - Permission to check (e.g., 'admin:users:read')
   * @param userId - Optional user ID (defaults to current user)
   *
   * @returns Promise resolving to boolean indicating permission status
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   *
   * @security
   * - Hierarchical permission checking
   * - Role inheritance support
   * - Audit logging for checks
   * - Context-aware validation
   *
   * @performance
   * - Target response time: < 30ms
   * - Cached permission data (30s)
   * - Optimized RBAC queries
   *
   * @example
   * ```typescript
   * const canRead = await authService.hasPermission('admin:users:read');
   * if (canRead) {
   *   // Show admin user interface
   *   console.log('User has admin read access');
   * }
   * ```
   */
  hasPermission(permission: string, userId?: string): Promise<boolean>;

  /**
   * Retrieves all roles assigned to user.
   *
   * @description
   * Returns comprehensive role information including inherited roles,
   * role hierarchy, and role metadata with enterprise security context.
   *
   * @param userId - Optional user ID (defaults to current user)
   *
   * @returns Promise resolving to array of role names
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {GenericAuthError} For unexpected retrieval errors
   *
   * @security
   * - Role data sanitization
   * - Inheritance chain validation
   * - Access control verification
   * - Audit logging for access
   *
   * @performance
   * - Target response time: < 100ms
   * - Cached role data (5 minutes)
   * - Optimized hierarchy queries
   *
   * @example
   * ```typescript
   * const roles = await authService.getUserRoles();
   * console.log(`User roles: ${roles.join(', ')}`);
   *
   * // Check for specific role
   * if (roles.includes('admin')) {
   *   console.log('User is an administrator');
   * }
   * ```
   */
  getUserRoles(userId?: string): Promise<string[]>;

  /**
   * Retrieves detailed permission information with analysis.
   *
   * @description
   * Performs comprehensive RBAC analysis including permission inheritance,
   * role hierarchy evaluation, and access control decision logging.
   *
   * @param permission - Permission to analyze (e.g., 'admin:users:read')
   * @param userId - Optional user ID (defaults to current user)
   *
   * @returns Promise resolving to detailed permission analysis
   *
   * @throws {UserNotAuthenticatedError} When user is not authenticated
   * @throws {GenericAuthError} For unexpected analysis errors
   *
   * @security
   * - Comprehensive audit logging
   * - Permission inheritance analysis
   * - Access control decision tracking
   * - Compliance reporting support
   *
   * @performance
   * - Target response time: < 100ms
   * - Cached analysis results (30s)
   * - Optimized decision algorithms
   *
   * @example
   * ```typescript
   * const details = await authService.getPermissionDetails('admin:users:read');
   *
   * console.log(`Permission granted: ${details.hasPermission}`);
   * console.log(`Effective role: ${details.effectiveRole}`);
   * console.log(`Granted by: ${details.grantedBy.join(', ')}`);
   *
   * if (!details.hasPermission) {
   *   console.log(`Denied by: ${details.deniedBy.join(', ')}`);
   * }
   * ```
   */
  getPermissionDetails(
    permission: string,
    userId?: string
  ): Promise<PermissionResponse>;
}
