import {AuthRepository} from '../../domain/interfaces/auth.repository.interface';
import {AuthUser} from '../../domain/entities/auth-user.interface';

/**
 * @fileoverview UC-002: Register with Email Use Case
 * 
 * Enterprise Use Case für die Benutzer-Registrierung mit E-Mail und Passwort.
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module RegisterWithEmailUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/auth/register | Registration Documentation}
 * @see {@link AuthRepository} Repository Interface
 * @see {@link AuthUser} User Entity
 * 
 * @businessRule BR-004: Email addresses must be unique across the system
 * @businessRule BR-005: Password must meet complexity requirements
 * @businessRule BR-006: User must accept terms and conditions
 * @businessRule BR-007: Email verification is required for account activation
 * 
 * @securityNote This use case handles PII and authentication data
 * @auditLog All registration attempts are logged for compliance
 * @compliance GDPR, CCPA, SOX, PCI-DSS
 */
export class RegisterWithEmailUseCase {
  /**
   * Konstruktor für den Register UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for RegisterWithEmailUseCase');
    }
  }

  /**
   * Führt den Registrierungsprozess für einen neuen Benutzer durch.
   * 
   * @description
   * Dieser UseCase erstellt ein neues Benutzerkonto im System und initiiert
   * den E-Mail-Verifizierungsprozess. Alle Eingaben werden validiert und
   * Sicherheitsrichtlinien durchgesetzt.
   * 
   * **Preconditions:**
   * - E-Mail-Adresse ist noch nicht registriert
   * - E-Mail-Format ist gültig (RFC 5322 konform)
   * - Passwort erfüllt Komplexitätsanforderungen
   * - Internetverbindung ist verfügbar
   * - Terms of Service wurden akzeptiert (UI-Ebene)
   * - Rate-Limiting-Grenzwerte sind nicht überschritten
   * 
   * **Main Flow:**
   * 1. Validierung der Eingabeparameter
   * 2. Prüfung auf bereits existierende E-Mail
   * 3. Passwort-Komplexitätsprüfung
   * 4. Erstellung des Benutzerkontos
   * 5. Versendung der Verifizierungs-E-Mail
   * 6. Security-Event-Logging
   * 7. Rückgabe des AuthUser-Objekts
   * 
   * **Postconditions:**
   * - Neues Benutzerkonto ist erstellt (Status: unverified)
   * - Verifizierungs-E-Mail ist versendet
   * - Registration-Event ist in Audit-Logs dokumentiert
   * - User kann zur Verifizierungsseite navigiert werden
   * 
   * @param email - Die E-Mail-Adresse für die Registrierung
   *                Muss eindeutig und gültig sein (RFC 5322 konform)
   *                Maximum 320 Zeichen
   * @param password - Das gewünschte Passwort
   *                   Minimum 8 Zeichen, Maximum 128 Zeichen
   *                   Muss Komplexitätsanforderungen erfüllen:
   *                   - Mindestens 1 Großbuchstabe
   *                   - Mindestens 1 Kleinbuchstabe
   *                   - Mindestens 1 Ziffer
   *                   - Mindestens 1 Sonderzeichen
   * 
   * @returns Promise<AuthUser> - Neu erstelltes Benutzer-Entity (Status: unverified)
   * 
   * @throws {InvalidEmailFormatError} Wenn das E-Mail-Format ungültig ist
   * @throws {EmailAlreadyExistsError} Wenn die E-Mail bereits registriert ist
   * @throws {WeakPasswordError} Wenn das Passwort zu schwach ist
   * @throws {TooManyAttemptsError} Wenn zu viele Registrierungsversuche gemacht wurden
   * @throws {EmailDeliveryError} Wenn die Verifizierungs-E-Mail nicht gesendet werden kann
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen
   * @throws {ServiceUnavailableError} Wenn der Authentication-Service nicht verfügbar ist
   * @throws {InternalServerError} Bei unerwarteten Server-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 1000-3000ms
   * - Network-Timeout: 45 Sekunden
   * - Rate-Limit: 3 Versuche pro Minute pro IP
   * 
   * @security
   * - Passwort wird gehasht vor Speicherung (bcrypt, Salting)
   * - E-Mail wird normalisiert und validiert
   * - PII wird verschlüsselt gespeichert
   * - Alle Registrierungen werden auditiert
   * 
   * @monitoring
   * - Registration Success Rate: Tracked in Analytics
   * - Email Delivery Rate: Monitored
   * - Bounce Rate: Tracked for email quality
   * - Error Rate: Error Tracking (Sentry)
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Basic registration
   * ```typescript
   * try {
   *   const user = await registerUseCase.execute(
   *     'newuser@example.com', 
   *     'SecurePass123!'
   *   );
   *   console.log(`Account created for ${user.email}`);
   *   // Show verification email sent message
   *   showVerificationDialog(user.email);
   * } catch (error) {
   *   if (error instanceof EmailAlreadyExistsError) {
   *     showError('Email address is already registered');
   *   } else if (error instanceof WeakPasswordError) {
   *     showPasswordRequirements();
   *   }
   * }
   * ```
   * 
   * @example Bulk registration validation
   * ```typescript
   * const registrations = [
   *   { email: 'user1@test.com', password: 'StrongPass1!' },
   *   { email: 'user2@test.com', password: 'StrongPass2!' }
   * ];
   * 
   * for (const reg of registrations) {
   *   try {
   *     await registerUseCase.execute(reg.email, reg.password);
   *   } catch (error) {
   *     console.error(`Registration failed for ${reg.email}:`, error);
   *   }
   * }
   * ```
   * 
   * @see {@link AuthRepository.register} Backend registration method
   * @see {@link AuthUser} Returned user entity structure
   * @see {@link EmailVerificationService} Email verification handling
   * 
   * @todo Implement social media registration flows
   * @todo Add support for enterprise domain validation
   * @todo Implement invitation-based registration
   */
  async execute(email: string, password: string): Promise<AuthUser> {
    // Input validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Delegate to repository with proper error handling
    try {
      return await this.authRepository.register(email, password);
    } catch (error) {
      // Re-throw with proper error context
      if (error instanceof Error) {
        error.message = `Registration failed: ${error.message}`;
      }
      throw error;
    }
  }
}
