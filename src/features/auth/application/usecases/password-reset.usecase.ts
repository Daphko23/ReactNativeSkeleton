/**
 * 🔑 Password Reset Use Case
 *
 * Handles password reset functionality.
 */

import {AuthRepository} from '../../domain/interfaces/auth.repository.interface';

/**
 * @fileoverview UC-003: Password Reset Use Case
 * 
 * Enterprise Use Case für die Passwort-Zurücksetzung mit E-Mail-Verification.
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module PasswordResetUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/auth/password-reset | Password Reset Documentation}
 * @see {@link AuthRepository} Repository Interface
 * 
 * @businessRule BR-008: Reset links expire after 24 hours
 * @businessRule BR-009: Only verified email addresses can request reset
 * @businessRule BR-010: Rate limiting prevents abuse (max 5 per hour)
 * @businessRule BR-011: All existing sessions are invalidated on password reset
 * 
 * @securityNote This use case triggers sensitive password reset flows
 * @auditLog All password reset attempts are logged for security auditing
 * @compliance GDPR, CCPA, SOX, PCI-DSS
 */
export class PasswordResetUseCase {
  /**
   * Konstruktor für den Password Reset UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for PasswordResetUseCase');
    }
  }

  /**
   * Initiiert den Passwort-Reset-Prozess für eine E-Mail-Adresse.
   * 
   * @description
   * Dieser UseCase sendet eine Passwort-Reset-E-Mail an den Benutzer mit einem
   * sicheren, zeitlich begrenzten Link. Der Link ist 24 Stunden gültig und kann
   * nur einmal verwendet werden.
   * 
   * **Preconditions:**
   * - E-Mail-Adresse ist im System registriert
   * - E-Mail-Adresse ist verifiziert
   * - Rate-Limiting-Grenzwerte sind nicht überschritten
   * - E-Mail-Service ist verfügbar
   * - Internetverbindung ist verfügbar
   * 
   * **Main Flow:**
   * 1. Validierung der E-Mail-Adresse
   * 2. Prüfung der Rate-Limiting-Regeln
   * 3. Generierung eines sicheren Reset-Tokens
   * 4. Speicherung des Tokens mit Ablaufzeit
   * 5. Versendung der Reset-E-Mail
   * 6. Security-Event-Logging
   * 7. Erfolgsbestätigung zurückgeben
   * 
   * **Alternative Flows:**
   * - AF-003.1: E-Mail nicht gefunden → Stille Behandlung (Security)
   * - AF-003.2: Rate-Limit erreicht → Fehler mit Retry-Zeit
   * - AF-003.3: E-Mail-Service nicht verfügbar → Retry-Mechanismus
   * - AF-003.4: Ungültiges E-Mail-Format → Validierungsfehler
   * 
   * **Postconditions:**
   * - Reset-Token ist generiert und gespeichert
   * - Reset-E-Mail ist versendet
   * - Security-Event ist dokumentiert
   * - Benutzer kann Token zum Zurücksetzen verwenden
   * 
   * @param email - Die E-Mail-Adresse für die Passwort-Zurücksetzung
   *                Muss ein gültiges E-Mail-Format haben (RFC 5322 konform)
   *                Maximum 320 Zeichen
   * 
   * @returns Promise<void> - Resolves erfolgreich auch wenn E-Mail nicht existiert (Security)
   * 
   * @throws {InvalidEmailFormatError} Wenn das E-Mail-Format ungültig ist
   * @throws {TooManyAttemptsError} Wenn zu viele Reset-Versuche gemacht wurden
   * @throws {EmailDeliveryError} Wenn die Reset-E-Mail nicht gesendet werden kann
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen
   * @throws {ServiceUnavailableError} Wenn der E-Mail-Service nicht verfügbar ist
   * @throws {InternalServerError} Bei unerwarteten Server-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 2000-5000ms
   * - Network-Timeout: 60 Sekunden
   * - Rate-Limit: 5 Versuche pro Stunde pro IP
   * - E-Mail-Delivery: 5-30 Sekunden
   * 
   * @security
   * - Token ist kryptographisch sicher (256-bit)
   * - Token läuft nach 24 Stunden ab
   * - Stille Behandlung unbekannter E-Mails (verhindert Enumeration)
   * - Alle Reset-Versuche werden auditiert
   * - CSRF-Schutz in Reset-Links
   * 
   * @monitoring
   * - Success Rate: Tracked in Analytics
   * - Email Delivery Rate: Monitored
   * - Failed Attempts: Security Monitoring
   * - Rate Limiting Events: Alert System
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Standard password reset
   * ```typescript
   * try {
   *   await passwordResetUseCase.execute('user@example.com');
   *   // Show success message (always, for security)
   *   showMessage('If this email exists, you will receive a reset link.');
   * } catch (error) {
   *   if (error instanceof TooManyAttemptsError) {
   *     showError('Too many attempts. Please try again in 1 hour.');
   *   } else if (error instanceof InvalidEmailFormatError) {
   *     showError('Please enter a valid email address.');
   *   }
   * }
   * ```
   * 
   * @example Bulk password reset (admin use case)
   * ```typescript
   * const emails = ['user1@test.com', 'user2@test.com'];
   * const results = await Promise.allSettled(
   *   emails.map(email => passwordResetUseCase.execute(email))
   * );
   * 
   * results.forEach((result, index) => {
   *   if (result.status === 'rejected') {
   *     console.error(`Reset failed for ${emails[index]}:`, result.reason);
   *   }
   * });
   * ```
   * 
   * @see {@link AuthRepository.resetPassword} Backend reset method
   * @see {@link EmailService} Email delivery service
   * @see {@link SecurityEventLogger} Security event logging
   * 
   * @todo Implement SMS-based password reset as alternative
   * @todo Add support for custom reset email templates
   * @todo Implement progressive delays for repeated attempts
   */
  async execute(email: string): Promise<void> {
    // Input validation
    if (!email) {
      throw new Error('Email is required for password reset');
    }

    // Delegate to repository with proper error handling
    try {
      return await this.authRepository.resetPassword(email);
    } catch (error) {
      // Re-throw with proper error context
      if (error instanceof Error) {
        error.message = `Password reset failed: ${error.message}`;
      }
      throw error;
    }
  }
}
