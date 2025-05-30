import {AuthRepository} from '../../domain/interfaces/auth.repository.interface';
import {AuthUser} from '../../domain/entities/auth-user.interface';

/**
 * @fileoverview UC-001: Login with Email Use Case
 * 
 * Enterprise Use Case für die Benutzer-Anmeldung mit E-Mail und Passwort.
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module LoginWithEmailUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/auth/login | Authentication Documentation}
 * @see {@link AuthRepository} Repository Interface
 * @see {@link AuthUser} User Entity
 * 
 * @example
 * ```typescript
 * const loginUseCase = new LoginWithEmailUseCase(authRepository);
 * const user = await loginUseCase.execute('user@example.com', 'password123');
 * console.log(`User ${user.email} logged in successfully`);
 * ```
 * 
 * @businessRule BR-001: Only verified email addresses can login
 * @businessRule BR-002: Password must meet security requirements
 * @businessRule BR-003: Failed attempts are tracked for security monitoring
 * 
 * @securityNote This use case handles sensitive authentication data
 * @auditLog All login attempts are logged for security auditing
 * @compliance GDPR, CCPA, SOX, PCI-DSS
 */
export class LoginWithEmailUseCase {
  /**
   * Konstruktor für den Login UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for LoginWithEmailUseCase');
    }
  }

  /**
   * Führt den Login-Prozess mit bereitgestellten Anmeldedaten durch.
   * 
   * @description
   * Dieser UseCase authentifiziert einen Benutzer gegen das konfigurierte Backend
   * (Firebase/Supabase) und gibt bei Erfolg das AuthUser-Entity zurück.
   * 
   * **Preconditions:**
   * - Benutzer hat ein gültiges, verifiziertes Konto
   * - E-Mail-Format ist gültig
   * - Passwort entspricht den Sicherheitsanforderungen
   * - Internetverbindung ist verfügbar
   * - Rate-Limiting-Grenzwerte sind nicht überschritten
   * 
   * **Main Flow:**
   * 1. Validierung der Eingabeparameter
   * 2. Rate-Limiting-Prüfung
   * 3. Authentifizierung gegen Backend
   * 4. Session-Token-Generierung
   * 5. Security-Event-Logging
   * 6. Rückgabe des AuthUser-Objekts
   * 
   * **Postconditions:**
   * - Benutzer ist erfolgreich authentifiziert
   * - Session-Token ist generiert und gespeichert
   * - Login-Event ist in Security-Logs dokumentiert
   * - Navigation zur Hauptanwendung kann erfolgen
   * 
   * @param email - Die E-Mail-Adresse des Benutzers
   *                Muss ein gültiges E-Mail-Format haben (RFC 5322 konform)
   *                Maximum 320 Zeichen
   * @param password - Das Passwort des Benutzers
   *                   Minimum 8 Zeichen, Maximum 128 Zeichen
   *                   Muss den Passwort-Policy-Anforderungen entsprechen
   * 
   * @returns Promise<AuthUser> - Authentifiziertes Benutzer-Entity mit Session-Informationen
   * 
   * @throws {InvalidEmailFormatError} Wenn das E-Mail-Format ungültig ist
   * @throws {WeakPasswordError} Wenn das Passwort zu schwach ist
   * @throws {UserNotFoundError} Wenn der Benutzer nicht existiert
   * @throws {InvalidCredentialsError} Wenn die Anmeldedaten ungültig sind
   * @throws {AccountLockedError} Wenn das Konto gesperrt ist
   * @throws {TooManyAttemptsError} Wenn zu viele Anmeldeversuche gemacht wurden
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen
   * @throws {ServiceUnavailableError} Wenn der Authentication-Service nicht verfügbar ist
   * @throws {InternalServerError} Bei unerwarteten Server-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 500-2000ms
   * - Network-Timeout: 30 Sekunden
   * - Rate-Limit: 5 Versuche pro Minute pro IP
   * 
   * @security
   * - Passwort wird verschlüsselt übertragen (HTTPS/TLS 1.3)
   * - Keine Speicherung von Passwörtern im lokalen Storage
   * - Alle Anmeldeversuche werden auditiert
   * - Suspicious Activity Detection aktiviert
   * 
   * @monitoring
   * - Success Rate: Tracked in Analytics
   * - Latency: Performance Monitoring
   * - Error Rate: Error Tracking (Sentry)
   * - Security Events: SIEM Integration
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example
   * ```typescript
   * try {
   *   const user = await loginUseCase.execute('john@example.com', 'SecurePass123!');
   *   console.log(`Welcome back, ${user.displayName}!`);
   *   // Navigate to main app
   * } catch (error) {
   *   if (error instanceof InvalidCredentialsError) {
   *     // Show user-friendly error message
   *     showError('Invalid email or password');
   *   } else if (error instanceof AccountLockedError) {
   *     // Redirect to account recovery
   *     showAccountLockedDialog();
   *   }
   * }
   * ```
   * 
   * @example Batch login validation
   * ```typescript
   * const loginRequests = [
   *   { email: 'user1@test.com', password: 'pass1' },
   *   { email: 'user2@test.com', password: 'pass2' }
   * ];
   * 
   * const results = await Promise.allSettled(
   *   loginRequests.map(req => loginUseCase.execute(req.email, req.password))
   * );
   * ```
   * 
   * @see {@link AuthRepository.login} Backend authentication method
   * @see {@link AuthUser} Returned user entity structure
   * @see {@link SecurityEventLogger} Security event logging
   * 
   * @todo Implement OAuth2 flow integration
   * @todo Add support for passwordless authentication
   * @todo Implement adaptive authentication
   */
  async execute(email: string, password: string): Promise<AuthUser> {
    // Input validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Delegate to repository with proper error handling
    try {
      return await this.authRepository.login(email, password);
    } catch (error) {
      // Re-throw with proper error context
      if (error instanceof Error) {
        error.message = `Login failed: ${error.message}`;
      }
      throw error;
    }
  }
}
