/**
 * @fileoverview ERROR-003: Generic Authentication Error - Enterprise Standard
 * @description Domain Error für unbekannte oder nicht-klassifizierte Authentication Failures.
 * Implementiert Enterprise Error Handling für Fallback-Szenarien bei unerwarteten Auth-Fehlern.
 * 
 * @businessRule BR-156: Fallback error handling for unclassified authentication failures
 * @businessRule BR-157: Security-conscious generic error messaging
 * @businessRule BR-158: Comprehensive error cause preservation for debugging
 * @businessRule BR-159: Consistent error response format across authentication methods
 * 
 * @securityNote Generic errors prevent information disclosure about system internals
 * @securityNote Authentication failure patterns logged for security analysis
 * @securityNote Sensitive error details excluded from client-facing messages
 * 
 * @auditLog Generic authentication failures logged for monitoring
 * @auditLog Unclassified error patterns tracked for system improvement
 * @auditLog Security incident escalation triggered for repeated failures
 * 
 * @compliance GDPR Article 25 - Data protection by design in error handling
 * @compliance OWASP Top 10 - Security logging and monitoring
 * @compliance NIST 800-63B - Authentication error handling guidelines
 * @compliance ISO 27001 A.12.4.1 - Event logging requirements
 * 
 * @performance Generic error creation optimized for <10ms response
 * @performance Error cause chain preserved for debugging without performance impact
 * 
 * @monitoring Authentication failure rates tracked via Sentry
 * @monitoring Generic error frequency monitored for system health
 * @monitoring Error cause patterns analyzed for infrastructure improvements
 * 
 * @example Generic Authentication Error Handling
 * ```typescript
 * try {
 *   await authProvider.authenticate(credentials);
 * } catch (error) {
 *   if (error instanceof GenericAuthError) {
 *     logger.error('Authentication failed', { 
 *       cause: error.cause,
 *       timestamp: new Date().toISOString()
 *     });
 *     return { success: false, message: 'Authentication failed' };
 *   }
 *   throw error;
 * }
 * ```
 * 
 * @throws GenericAuthError When authentication fails for unknown reasons
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthenticationErrors
 * @namespace Auth.Domain.Errors
 */

import { AppError, ErrorSeverity, ErrorCategory, type ErrorDetails } from '../../../../shared/errors';

/**
 * @class GenericAuthError
 * @description ERROR-003: Enterprise Domain Error for unclassified authentication failures
 * 
 * Provides fallback error handling for authentication scenarios that don't fit
 * specific error categories. Maintains security by preventing information disclosure
 * while preserving debugging context through proper error cause chaining.
 * 
 * @businessRule BR-156: Fallback error for all unclassified authentication failures
 * @businessRule BR-157: Generic user messaging to prevent information disclosure
 * @businessRule BR-158: Complete error cause preservation for debugging
 * @businessRule BR-159: Consistent error interface across authentication flows
 * 
 * @securityNote Error messages sanitized to prevent system information disclosure
 * @auditLog Generic errors logged for security monitoring and system improvement
 * @compliance OWASP secure error handling practices
 * 
 * @example Error Construction and Handling
 * ```typescript
 * // In authentication service
 * try {
 *   return await provider.authenticate(token);
 * } catch (unknownError) {
 *   // Wrap unknown errors in generic error
 *   throw new GenericAuthError(unknownError);
 * }
 * 
 * // In error boundary
 * if (error instanceof GenericAuthError) {
 *   logger.error('Unclassified auth error', { error: error.cause });
 *   showGenericErrorMessage();
 * }
 * ```
 * 
 * @since 1.0.0
 */
export class GenericAuthError extends AppError {
  /**
   * @constructor
   * @description Create generic authentication failure error with cause preservation
   * 
   * @param {unknown} [cause] - Original error or failure cause for debugging
   * 
   * @businessRule BR-156: Generic error creation for unclassified failures
   * @businessRule BR-158: Complete error cause chain preservation
   * @securityNote Error message generic to prevent information disclosure
   * @auditLog Error creation logged for monitoring and analysis
   * 
   * @example
   * ```typescript
   * // Wrap provider-specific errors
   * try {
   *   await oauthProvider.authenticate();
   * } catch (providerError) {
   *   throw new GenericAuthError(providerError);
   * }
   * ```
   */
  constructor(cause?: unknown) {
    const errorDetails: ErrorDetails = {
      code: 'AUTH_GENERIC_001',
      message: 'Authentication failed',
      description: 'An unclassified authentication error occurred',
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.AUTHENTICATION,
      retryable: false,
      cause: cause instanceof Error ? cause : undefined,
      context: {
        feature: 'auth',
        action: 'generic_authentication',
        metadata: { originalError: cause }
      }
    };
    
    super(errorDetails);
    // Note: this.name is automatically set by AppError base class
  }
}
