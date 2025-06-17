/**
 * @fileoverview DOMAIN-ERROR-012: Email Already Verified Error
 * @description Domain Error für bereits verifizierte Email-Adressen
 * 
 * @businessRule BR-229: Mehrfache Email-Verifizierung wird verhindert
 * @businessRule BR-230: Verifizierungsstatus wird eindeutig verwaltet
 * @businessRule BR-231: Benutzerfreundliche Behandlung von Duplikat-Versuchen
 * 
 * @securityNote Verifizierungsstatus wird für Security Monitoring geloggt
 * @auditLog Email-Verifizierungsversuche werden getrackt
 * @compliance Email Verification Best Practices
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module EmailAlreadyVerifiedError
 * @namespace Auth.Domain.Errors
 */

import { AppError, ErrorSeverity, ErrorCategory, type ErrorDetails } from '@shared/errors';

/**
 * @class EmailAlreadyVerifiedError
 * @description ERROR-012: Enterprise Domain Error für bereits verifizierte Emails
 * 
 * Wird geworfen wenn versucht wird, eine bereits verifizierte Email-Adresse
 * erneut zu verifizieren. Bietet benutzerfreundliche Behandlung von Duplikaten.
 * 
 * @businessRule BR-229: Verhinderung mehrfacher Email-Verifizierung
 * @businessRule BR-230: Eindeutige Verifizierungsstatus-Verwaltung
 * @businessRule BR-231: Benutzerfreundliche Duplikat-Behandlung
 * @securityNote Verifizierungsversuche werden für Monitoring geloggt
 * @auditLog Duplikat-Versuche werden für Analyse getrackt
 * 
 * @example Email Verification Status Check
 * ```typescript
 * // Bei Verifizierungsversuch
 * if (user.emailVerified) {
 *   throw new EmailAlreadyVerifiedError('Email is already verified');
 * }
 * 
 * // In Verifizierungsservice
 * if (await isEmailAlreadyVerified(email)) {
 *   throw new EmailAlreadyVerifiedError();
 * }
 * ```
 * 
 * @since 1.0.0
 */
export class EmailAlreadyVerifiedError extends AppError {
  /**
   * @constructor
   * @description Erstellt einen Email Already Verified Error
   * 
   * @param {string} [message] - Spezifische Fehlermeldung (optional)
   * @param {unknown} [cause] - Original Verification-Error für Debugging
   * 
   * @businessRule BR-229: Error-Erstellung dokumentiert Duplikat-Versuch
   * @securityNote Error Message benutzerfreundlich ohne sensible Details
   * @auditLog Error-Erstellung löst Duplikat-Monitoring aus
   * 
   * @example
   * ```typescript
   * // Bei bereits verifizierter Email
   * throw new EmailAlreadyVerifiedError('Email address is already verified');
   * 
   * // Bei Duplikat-Verifizierungsversuch
   * throw new EmailAlreadyVerifiedError();
   * ```
   */
  constructor(message?: string, cause?: unknown) {
    const errorDetails: ErrorDetails = {
      code: 'AUTH_EMAIL_VERIFIED_001',
      message: message || 'Email address is already verified',
      description: 'The email address has already been verified and does not need verification again',
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.VALIDATION,
      retryable: false,
      cause: cause instanceof Error ? cause : undefined,
      context: {
        feature: 'auth',
        action: 'email_verification',
        metadata: { securityEvent: 'duplicate_verification_attempt' }
      },
      suggestions: [
        'You can proceed to log in',
        'No further verification is needed',
        'Contact support if you believe this is an error'
      ]
    };
    
    super(errorDetails);
    // Note: this.name is automatically set by AppError base class
  }
} 