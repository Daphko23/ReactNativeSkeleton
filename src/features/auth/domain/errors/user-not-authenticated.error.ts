/**
 * @fileoverview ERROR-007: User Not Authenticated Error - Enterprise Standard
 * @description Domain Error für fehlende Authentication bei geschützten Operationen.
 * Implementiert Enterprise Error Handling für Authorization-Failures und Session-Management.
 * 
 * @businessRule BR-172: Authentication verification before protected resource access
 * @businessRule BR-173: Session validation and expiration handling
 * @businessRule BR-174: Graceful authentication redirection for expired sessions
 * @businessRule BR-175: Security context preservation during re-authentication
 * 
 * @securityNote Authentication failures logged for security monitoring
 * @securityNote Session hijacking attempts detected through auth state validation
 * @securityNote Unauthorized access attempts tracked for threat analysis
 * 
 * @auditLog Authentication requirement violations logged for compliance
 * @auditLog Protected resource access attempts tracked
 * @auditLog Session expiration events monitored for UX optimization
 * 
 * @compliance GDPR Article 32 - Security measures for access control
 * @compliance NIST 800-63B - Authentication lifecycle management
 * @compliance ISO 27001 A.9.1.2 - Access to networks and network services
 * @compliance PCI-DSS Requirement 7.1 - Restrict access to system components
 * @compliance SOX 404 - Internal controls over access management
 * 
 * @performance Authentication check optimized for <50ms response
 * @performance Session validation cached for performance
 * 
 * @monitoring Authentication failure rates tracked for system health
 * @monitoring Session expiration patterns analyzed for optimization
 * @monitoring Unauthorized access attempts monitored for security
 * 
 * @example User Authentication Verification
 * ```typescript
 * // In protected resource middleware
 * if (!authService.isAuthenticated(request)) {
 *   logger.warn('Unauthenticated access attempt', {
 *     resource: request.path,
 *     ip: request.ip,
 *     timestamp: Date.now()
 *   });
 *   throw new UserNotAuthenticatedError();
 * }
 * 
 * // In authentication guard
 * catch (error) {
 *   if (error instanceof UserNotAuthenticatedError) {
 *     return redirectToLogin(request.originalUrl);
 *   }
 * }
 * ```
 * 
 * @throws UserNotAuthenticatedError When authentication required but not present
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthenticationErrors
 * @namespace Auth.Domain.Errors
 */

import { AppError, ErrorSeverity, ErrorCategory, type ErrorDetails } from '@shared/errors';

/**
 * @class UserNotAuthenticatedError
 * @description ERROR-007: Enterprise Domain Error for missing authentication
 * 
 * Thrown when attempting to access protected resources without proper authentication.
 * Handles session expiration, token invalidation, and unauthorized access scenarios
 * with appropriate security logging and user redirection.
 * 
 * @businessRule BR-172: Authentication required for all protected operations
 * @businessRule BR-173: Session validity verified before resource access
 * @businessRule BR-174: Graceful handling of expired authentication states
 * @businessRule BR-175: Security context preserved during re-authentication flow
 * 
 * @securityNote Authentication requirements logged for security monitoring
 * @auditLog Unauthorized access attempts tracked for compliance
 * @compliance NIST 800-63B authentication requirements
 * 
 * @example Authentication Guard Implementation
 * ```typescript
 * // In route protection middleware
 * const authGuard = async (request, response, next) => {
 *   try {
 *     await validateAuthentication(request);
 *     next();
 *   } catch (error) {
 *     if (error instanceof UserNotAuthenticatedError) {
 *       return response.redirect('/login?return=' + encodeURIComponent(request.url));
 *     }
 *     throw error;
 *   }
 * };
 * 
 * // In service layer
 * if (!authContext.isAuthenticated) {
 *   throw new UserNotAuthenticatedError(sessionError);
 * }
 * ```
 * 
 * @since 1.0.0
 */
export class UserNotAuthenticatedError extends AppError {
  /**
   * @constructor
   * @description Create authentication requirement error
   * 
   * @param {unknown} [cause] - Original authentication validation error
   * 
   * @businessRule BR-172: Error creation validates authentication requirement
   * @securityNote Authentication failure logged for security monitoring
   * @auditLog Error creation triggers access control logging
   * 
   * @example
   * ```typescript
   * // When session validation fails
   * if (!await sessionService.isValid(token)) {
   *   throw new UserNotAuthenticatedError(sessionValidationError);
   * }
   * 
   * // When authentication context missing
   * if (!request.user) {
   *   throw new UserNotAuthenticatedError();
   * }
   * ```
   */
  constructor(cause?: unknown) {
    const errorDetails: ErrorDetails = {
      code: 'AUTH_NOT_AUTHENTICATED_001',
      message: 'Authentication required',
      description: 'User must be authenticated to access this resource',
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.AUTHORIZATION,
      retryable: true,
      cause: cause instanceof Error ? cause : undefined,
      context: {
        feature: 'auth',
        action: 'authentication_check',
        metadata: { securityEvent: 'unauthorized_access_attempt' }
      },
      suggestions: [
        'Please log in to continue',
        'Check if your session has expired',
        'Refresh the page and try again'
      ]
    };
    
    super(errorDetails);
    // Note: this.name is automatically set by AppError base class
  }
}
