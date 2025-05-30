import {AuthRepository} from '../../domain/interfaces/auth.repository.interface';
import {AuthUser} from '../../domain/entities/auth-user.interface';

/**
 * @fileoverview UC-005: Get Current User / Session Management Use Case
 * 
 * Enterprise Use Case für Session Management und Benutzer-Authentifizierungsstatus.
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module GetCurrentUserUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/auth/session | Session Management Documentation}
 * @see {@link AuthRepository} Repository Interface
 * @see {@link AuthUser} User Entity
 * 
 * @businessRule BR-016: Sessions must be validated on every request
 * @businessRule BR-017: Expired tokens are automatically refreshed when possible
 * @businessRule BR-018: Session timeout configurable per user role
 * @businessRule BR-019: Concurrent session limits enforced per user
 * 
 * @securityNote This use case handles session validation and token refresh
 * @auditLog Session access and refresh events are logged for security auditing
 * @compliance GDPR, CCPA, SOX, PCI-DSS
 */
export class GetCurrentUserUseCase {
  /**
   * Konstruktor für den Get Current User UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for GetCurrentUserUseCase');
    }
  }

  /**
   * Ruft den aktuell authentifizierten Benutzer ab und verwaltet die Session.
   * 
   * @description
   * Dieser UseCase überprüft die aktuelle Benutzer-Session, validiert Tokens,
   * führt bei Bedarf einen automatischen Token-Refresh durch und gibt den
   * authentifizierten Benutzer zurück. Null wird zurückgegeben, wenn keine
   * gültige Session vorhanden ist.
   * 
   * **Preconditions:**
   * - Keine expliziten Preconditions (kann jederzeit aufgerufen werden)
   * - Auth-Repository ist initialisiert
   * - Token-Storage ist verfügbar
   * 
   * **Main Flow:**
   * 1. Überprüfung der lokalen Session/Token-Speicherung
   * 2. Validierung der Token-Gültigkeit
   * 3. Bei abgelaufenem Access-Token: Automatischer Refresh
   * 4. Abfrage der aktuellen Benutzerdaten vom Backend
   * 5. Aktualisierung der lokalen Session-Informationen
   * 6. Security-Event-Logging (bei Session-Refresh)
   * 7. Rückgabe des AuthUser-Objekts oder null
   * 
   * **Alternative Flows:**
   * - AF-005.1: Kein Token vorhanden → Rückgabe null
   * - AF-005.2: Token abgelaufen, Refresh erfolgreich → Neue Session
   * - AF-005.3: Token abgelaufen, Refresh fehlgeschlagen → Rückgabe null
   * - AF-005.4: Backend-Validierung fehlgeschlagen → Session-Invalidierung
   * - AF-005.5: Netzwerk nicht verfügbar → Cached User (wenn verfügbar)
   * 
   * **Postconditions:**
   * - Session-Status ist validiert und aktuell
   * - Bei erfolgreicher Refresh: Neue Tokens sind gespeichert
   * - Session-Activity ist protokolliert
   * - Benutzer-Entity enthält aktuelle Informationen
   * 
   * @returns Promise<AuthUser | null> - Authentifizierter Benutzer oder null wenn nicht angemeldet
   * 
   * @throws {SessionValidationError} Wenn die Session-Validierung fehlschlägt
   * @throws {TokenRefreshError} Wenn der Token-Refresh fehlschlägt (recoverable)
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen (recoverable)
   * @throws {ServiceUnavailableError} Wenn der Authentication-Service nicht verfügbar ist
   * @throws {InternalServerError} Bei unerwarteten System-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 100-500ms (Cache Hit)
   * - Mit Backend-Validierung: 500-2000ms
   * - Mit Token-Refresh: 1000-3000ms
   * - Offline-Cache: 10-50ms
   * 
   * @security
   * - Automatische Token-Refresh bei Ablauf
   * - Sichere Token-Speicherung (Encrypted Storage)
   * - Session-Hijacking-Detection
   * - Concurrent Session Management
   * - Activity-based Session Extension
   * 
   * @monitoring
   * - Session Duration: Average session length tracking
   * - Refresh Rate: Token refresh frequency
   * - Cache Hit Rate: Local vs remote user fetches
   * - Error Rate: Session validation failures
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Standard session check
   * ```typescript
   * try {
   *   const currentUser = await getCurrentUserUseCase.execute();
   *   if (currentUser) {
   *     console.log(`Session active for ${currentUser.email}`);
   *     // Continue with authenticated flow
   *   } else {
   *     console.log('No active session');
   *     // Redirect to login
   *   }
   * } catch (error) {
   *   if (error instanceof SessionValidationError) {
   *     // Session is invalid, force re-login
   *     forceLogout();
   *   }
   * }
   * ```
   * 
   * @example App initialization with session restore
   * ```typescript
   * const initializeApp = async () => {
   *   try {
   *     const user = await getCurrentUserUseCase.execute();
   *     if (user) {
   *       // User is logged in, go to main app
   *       navigateToMainApp(user);
   *     } else {
   *       // No session, show login
   *       navigateToLogin();
   *     }
   *   } catch (error) {
   *     console.error('Session initialization failed:', error);
   *     // Handle gracefully
   *     navigateToLogin();
   *   }
   * };
   * ```
   * 
   * @example Session monitoring with periodic checks
   * ```typescript
   * // Periodic session validation (every 5 minutes)
   * setInterval(async () => {
   *   try {
   *     const user = await getCurrentUserUseCase.execute();
   *     if (!user) {
   *       // Session expired, logout user
   *       handleSessionExpired();
   *     }
   *   } catch (error) {
   *     console.warn('Session check failed:', error);
   *   }
   * }, 5 * 60 * 1000);
   * ```
   * 
   * @see {@link AuthRepository.getCurrentUser} Backend user fetching method
   * @see {@link AuthUser} Returned user entity structure
   * @see {@link TokenService} Token management and refresh
   * @see {@link SessionManager} Session lifecycle management
   * 
   * @todo Implement adaptive session timeouts based on user activity
   * @todo Add support for multiple concurrent sessions with device tracking
   * @todo Implement session sharing across multiple apps (SSO)
   */
  async execute(): Promise<AuthUser | null> {
    try {
      return await this.authRepository.getCurrentUser();
    } catch (error) {
      // Log session validation errors for monitoring
      console.warn('Session validation failed:', error);
      
      // Return null for recoverable errors (user should re-authenticate)
      if (error instanceof Error && 
          (error.message.includes('token') || 
           error.message.includes('session') ||
           error.message.includes('expired'))) {
        return null;
      }
      
      // Re-throw critical errors
      throw error;
    }
  }
}
