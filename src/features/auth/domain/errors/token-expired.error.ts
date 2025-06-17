/**
 * @fileoverview DOMAIN-ERROR-011: Token Expired Error
 * @description Domain Error für abgelaufene Token bei Email-Verifizierung
 * 
 * @businessRule BR-226: Token haben begrenzte Gültigkeitsdauer für Security
 * @businessRule BR-227: Ablaufzeit wird für verschiedene Token-Typen konfiguriert
 * @businessRule BR-228: Abgelaufene Token erfordern Neuausstellung
 * 
 * @securityNote Token-Expiration verhindert zeitlich unbegrenzte Nutzung
 * @auditLog Token-Ablauf wird für Security Monitoring geloggt
 * @compliance Token Lifecycle Security Best Practices
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module TokenExpiredError
 * @namespace Auth.Domain.Errors
 */

import { AppError, ErrorSeverity, ErrorCategory, type ErrorDetails } from '@shared/errors';

/**
 * @class TokenExpiredError
 * @description ERROR-011: Enterprise Domain Error für abgelaufene Token
 * 
 * Wird geworfen wenn Token für Email-Verifizierung oder andere Token-basierte
 * Operationen ihre Gültigkeitsdauer überschritten haben.
 * 
 * @businessRule BR-226: Token-Expiration für Security-Compliance
 * @businessRule BR-227: Konfigurierbare Ablaufzeiten je Token-Typ
 * @businessRule BR-228: Abgelaufene Token erfordern Erneuerung
 * @securityNote Token-Expiration verhindert lange Attack-Windows
 * @auditLog Token-Ablauf wird für Compliance geloggt
 * 
 * @example Token Expiration Handling
 * ```typescript
 * // Bei Token-Expiration-Prüfung
 * if (token.expiresAt < new Date()) {
 *   throw new TokenExpiredError('Email verification token expired');
 * }
 * 
 * // Bei JWT-Token-Validierung
 * try {
 *   jwt.verify(token, secret);
 * } catch (error) {
 *   if (error.name === 'TokenExpiredError') {
 *     throw new TokenExpiredError('JWT token expired', error);
 *   }
 * }
 * ```
 * 
 * @since 1.0.0
 */
export class TokenExpiredError extends AppError {
  /**
   * @constructor
   * @description Erstellt einen Token Expired Error
   * 
   * @param {string} [message] - Spezifische Fehlermeldung (optional)
   * @param {unknown} [cause] - Original Expiration-Error für Debugging
   * 
   * @businessRule BR-226: Error-Erstellung dokumentiert Token-Ablauf
   * @securityNote Error Message ohne sensible Token-Details
   * @auditLog Error-Erstellung löst Expiration-Monitoring aus
   * 
   * @example
   * ```typescript
   * // Bei überschrittener Token-Gültigkeitsdauer
   * throw new TokenExpiredError('Verification token has expired');
   * 
   * // Bei JWT-Expiration
   * throw new TokenExpiredError('Authentication token expired', jwtError);
   * ```
   */
  constructor(message?: string, cause?: unknown) {
    const errorDetails: ErrorDetails = {
      code: 'AUTH_TOKEN_EXPIRED_001',
      message: message || 'Token has expired',
      description: 'The authentication token has exceeded its validity period and can no longer be used',
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.AUTHENTICATION,
      retryable: true,
      cause: cause instanceof Error ? cause : undefined,
      context: {
        feature: 'auth',
        action: 'token_expiration_check',
        metadata: { securityEvent: 'token_expired' }
      },
      suggestions: [
        'Request a new verification token',
        'Complete the verification process more quickly',
        'Check your email for the latest verification link'
      ]
    };
    
    super(errorDetails);
    // Note: this.name is automatically set by AppError base class
  }
} 