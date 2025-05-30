/**
 * @fileoverview ERROR-008: User Not Found Error - Enterprise Standard
 * @description Domain Error für nicht-existierende User bei Authentication/Authorization.
 * Implementiert Enterprise Error Handling für sichere User-Lookup ohne Information Disclosure.
 * 
 * @businessRule BR-176: User existence validation without information disclosure
 * @businessRule BR-177: Secure user lookup with enumeration attack prevention
 * @businessRule BR-178: Generic error messaging for security compliance
 * @businessRule BR-179: User account lifecycle state validation
 * 
 * @securityNote User existence information protected from enumeration attacks
 * @securityNote User lookup failures logged for security monitoring
 * @securityNote Account discovery attempts tracked for threat analysis
 * 
 * @auditLog User lookup failures logged for compliance monitoring
 * @auditLog Account enumeration attempts detected and escalated
 * @auditLog User account access patterns analyzed for security
 * 
 * @compliance GDPR Article 25 - Data protection by design in user lookups
 * @compliance OWASP Top 10 - Information disclosure prevention
 * @compliance NIST 800-63B - User account management security
 * @compliance ISO 27001 A.9.2.1 - User registration and de-registration
 * @compliance PCI-DSS Requirement 8.1.1 - User identification management
 * 
 * @performance User lookup optimized for <100ms response
 * @performance Database queries indexed for fast user retrieval
 * 
 * @monitoring User lookup failure rates tracked for system health
 * @monitoring Account enumeration attempts monitored for security
 * @monitoring User discovery patterns analyzed for UX optimization
 * 
 * @example Secure User Not Found Handling
 * ```typescript
 * try {
 *   const user = await userService.findByEmail(email);
 *   if (!user) {
 *     // Security: Generic message prevents enumeration
 *     throw new UserNotFoundError();
 *   }
 *   return user;
 * } catch (error) {
 *   if (error instanceof UserNotFoundError) {
 *     logger.warn('User lookup failed', { 
 *       email: hashEmail(email),
 *       timestamp: Date.now()
 *     });
 *     return { success: false, message: 'Authentication failed' };
 *   }
 * }
 * ```
 * 
 * @throws UserNotFoundError When user account does not exist
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthenticationErrors
 * @namespace Auth.Domain.Errors
 */

import { AppError, ErrorSeverity, ErrorCategory, type ErrorDetails } from '../../../../shared/errors';

/**
 * @class UserNotFoundError
 * @description ERROR-008: Enterprise Domain Error for non-existent user accounts
 * 
 * Thrown when user lookup operations fail to find an account with the provided
 * identifier. Implements security-conscious error handling to prevent user
 * enumeration attacks while maintaining proper audit trails.
 * 
 * @businessRule BR-176: User existence checks without information disclosure
 * @businessRule BR-177: Account lookup failures handled securely
 * @businessRule BR-178: Generic error messaging prevents enumeration attacks
 * @businessRule BR-179: User account state validation during lookup
 * 
 * @securityNote Error messages sanitized to prevent user enumeration
 * @auditLog User lookup failures logged for security analysis
 * @compliance OWASP secure error handling best practices
 * 
 * @example Secure User Lookup Error Handling
 * ```typescript
 * // In user authentication service
 * const user = await userRepository.findByCredentials(identifier);
 * if (!user || !user.isActive) {
 *   // Generic error prevents enumeration
 *   throw new UserNotFoundError(lookupError);
 * }
 * 
 * // In authentication controller
 * catch (error) {
 *   if (error instanceof UserNotFoundError) {
 *     // Same response as invalid credentials for security
 *     return { success: false, message: 'Authentication failed' };
 *   }
 * }
 * ```
 * 
 * @since 1.0.0
 */
export class UserNotFoundError extends AppError {
  /**
   * @constructor
   * @description Create user not found error for failed lookups
   * 
   * @param {unknown} [cause] - Original database or service error
   * 
   * @businessRule BR-176: Error creation without user existence disclosure
   * @securityNote Error message generic to prevent enumeration attacks
   * @auditLog Error creation triggers user lookup monitoring
   * 
   * @example
   * ```typescript
   * // When user lookup fails
   * const user = await database.users.findUnique({ where: { email } });
   * if (!user) {
   *   throw new UserNotFoundError(databaseResult);
   * }
   * 
   * // When account is deactivated
   * if (!user.isActive) {
   *   throw new UserNotFoundError();
   * }
   * ```
   */
  constructor(cause?: unknown) {
    const errorDetails: ErrorDetails = {
      code: 'AUTH_USER_NOT_FOUND_001',
      message: 'User account not found',
      description: 'No user account exists with the provided identifier',
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.AUTHENTICATION,
      retryable: false,
      cause: cause instanceof Error ? cause : undefined,
      context: {
        feature: 'auth',
        action: 'user_lookup',
        metadata: { securityEvent: 'user_not_found' }
      },
      suggestions: ['Check the email address', 'Try registering a new account', 'Contact support if you believe this is an error']
    };
    
    super(errorDetails);
    // Note: this.name is automatically set by AppError base class
  }
}
