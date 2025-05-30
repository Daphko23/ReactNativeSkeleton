/**
 * @fileoverview DOMAIN-ERROR-010: Invalid Token Error
 * @description Domain Error für ungültige oder abgelaufene Token bei Email-Verifizierung
 * 
 * @businessRule BR-223: Token-Validierung verhindert Sicherheitslücken
 * @businessRule BR-224: Token-Format-Validierung vor Verarbeitung
 * @businessRule BR-225: Sichere Token-Expiration mit angemessenen Timeouts
 * 
 * @securityNote Token-Details werden nicht in Error Messages preisgegeben
 * @auditLog Token-Validierungsfehler werden für Security Monitoring geloggt
 * @compliance OWASP Token Security Best Practices
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module InvalidTokenError
 * @namespace Auth.Domain.Errors
 */

import { AppError, ErrorSeverity, ErrorCategory, type ErrorDetails } from '../../../../shared/errors';

/**
 * @class InvalidTokenError
 * @description ERROR-010: Enterprise Domain Error für ungültige Token
 * 
 * Wird geworfen wenn Token für Email-Verifizierung oder andere Token-basierte
 * Operationen ungültig, falsch formatiert oder manipuliert sind.
 * 
 * @businessRule BR-223: Token-Validierung verhindert unbefugten Zugriff
 * @businessRule BR-224: Token-Format wird vor Verarbeitung validiert
 * @securityNote Token-Details werden aus Sicherheitsgründen nicht preisgegeben
 * @auditLog Token-Validierungsfehler werden für Monitoring geloggt
 * 
 * @example Token Validation Usage
 * ```typescript
 * // Bei Token-Format-Validierung
 * if (!isValidTokenFormat(token)) {
 *   throw new InvalidTokenError('Invalid token format');
 * }
 * 
 * // Bei Token-Verarbeitung
 * try {
 *   const payload = decodeToken(token);
 * } catch (error) {
 *   throw new InvalidTokenError('Token decoding failed', error);
 * }
 * ```
 * 
 * @since 1.0.0
 */
export class InvalidTokenError extends AppError {
  /**
   * @constructor
   * @description Erstellt einen Invalid Token Error
   * 
   * @param {string} [message] - Spezifische Fehlermeldung (optional)
   * @param {unknown} [cause] - Original Validierungsfehler für Debugging
   * 
   * @businessRule BR-223: Error-Erstellung ohne Token-Preisgabe
   * @securityNote Error Message sanitized für Security
   * @auditLog Error-Erstellung löst Security Monitoring aus
   * 
   * @example
   * ```typescript
   * // Bei ungültigem Token-Format
   * throw new InvalidTokenError('Token format validation failed');
   * 
   * // Bei Token-Dekodierungsfehler
   * throw new InvalidTokenError('Token decoding failed', originalError);
   * ```
   */
  constructor(message?: string, cause?: unknown) {
    const errorDetails: ErrorDetails = {
      code: 'AUTH_INVALID_TOKEN_001',
      message: message || 'Invalid verification token',
      description: 'The provided authentication token is invalid, malformed, or corrupted',
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.AUTHENTICATION,
      retryable: false,
      cause: cause instanceof Error ? cause : undefined,
      context: {
        feature: 'auth',
        action: 'token_validation',
        metadata: { securityEvent: 'invalid_token_attempt' }
      },
      suggestions: [
        'Please request a new verification token',
        'Check if the token was copied correctly',
        'Contact support if the problem persists'
      ]
    };
    
    super(errorDetails);
    // Note: this.name is automatically set by AppError base class
  }
} 