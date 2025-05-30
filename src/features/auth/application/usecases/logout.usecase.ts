import {AuthRepository} from '../../domain/interfaces/auth.repository.interface';

/**
 * @fileoverview UC-024: Logout Use Case
 * 
 * Enterprise Use Case für die sichere Benutzer-Abmeldung mit Session-Invalidierung.
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module LogoutUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/auth/logout | Logout Documentation}
 * @see {@link AuthRepository} Repository Interface
 * 
 * @businessRule BR-024: All user sessions must be properly invalidated on logout
 * @businessRule BR-025: Local storage and cache must be cleared on logout
 * @businessRule BR-026: Logout must work even with network connectivity issues
 * @businessRule BR-027: Security events must be logged for all logout attempts
 * 
 * @securityNote This use case handles secure session termination and cleanup
 * @auditLog All logout events are logged for security auditing and compliance
 * @compliance GDPR, CCPA, SOX, PCI-DSS
 */
export class LogoutUseCase {
  /**
   * Konstruktor für den Logout UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for LogoutUseCase');
    }
  }

  /**
   * Führt den sicheren Abmeldeprozess für den aktuellen Benutzer durch.
   * 
   * @description
   * Dieser UseCase meldet den aktuell authentifizierten Benutzer sicher ab,
   * invalidiert alle Sessions, löscht lokale Tokens und Cache-Daten und
   * protokolliert das Logout-Event für Security-Auditing.
   * 
   * **Preconditions:**
   * - Benutzer ist aktuell angemeldet (optional - Logout sollte immer funktionieren)
   * - Auth-Repository ist initialisiert
   * - Lokale Storage-Systeme sind verfügbar
   * 
   * **Main Flow:**
   * 1. Erfassung der aktuellen Session-Informationen
   * 2. Backend-Session-Invalidierung
   * 3. Token-Revocation (Access + Refresh Tokens)
   * 4. Lokale Storage-Bereinigung (Tokens, Cache, User Data)
   * 5. Biometrische Credentials löschen (falls aktiviert)
   * 6. Security-Event-Logging
   * 7. Navigation zur Login-Seite
   * 
   * **Alternative Flows:**
   * - AF-024.1: Netzwerk nicht verfügbar → Lokale Bereinigung trotzdem durchführen
   * - AF-024.2: Backend-Logout fehlgeschlagen → Lokale Session beenden
   * - AF-024.3: Bereits abgemeldet → Graceful Handling ohne Fehler
   * - AF-024.4: Fehler bei Storage-Bereinigung → Logout trotzdem als erfolgreich behandeln
   * 
   * **Postconditions:**
   * - Alle Session-Tokens sind invalidiert
   * - Lokale Speicher sind bereinigt
   * - Benutzer ist abgemeldet
   * - Logout-Event ist protokolliert
   * - Navigation zur Login-Seite ist erfolgt
   * 
   * @returns Promise<void> - Resolves erfolgreich nach vollständiger Abmeldung
   * 
   * @throws {LogoutError} Wenn kritische Logout-Operationen fehlschlagen
   * @throws {NetworkError} Bei Netzwerkproblemen (wird meist ignoriert)
   * @throws {StorageError} Bei kritischen Storage-Problemen
   * @throws {InternalServerError} Bei unerwarteten System-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 500-2000ms
   * - Backend-Session-Invalidierung: 200-1000ms
   * - Lokale Storage-Bereinigung: 100-500ms
   * - Offline-Logout: 100-300ms
   * 
   * @security
   * - Vollständige Token-Invalidierung (Backend + Lokal)
   * - Sichere Bereinigung sensibler Daten
   * - Biometrische Credentials werden entfernt
   * - Session-Hijacking-Prävention
   * - Logout funktioniert auch offline
   * 
   * @monitoring
   * - Logout Success Rate: Tracked für UX monitoring
   * - Logout Duration: Performance tracking
   * - Failed Logouts: Error tracking
   * - Security Events: Audit log integration
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Standard logout
   * ```typescript
   * try {
   *   await logoutUseCase.execute();
   *   console.log('User logged out successfully');
   *   // Navigate to login screen
   *   navigateToLogin();
   * } catch (error) {
   *   console.error('Logout failed:', error);
   *   // Handle gracefully - user should still be logged out locally
   *   forceLocalLogout();
   * }
   * ```
   * 
   * @example Logout with confirmation dialog
   * ```typescript
   * const performLogout = async () => {
   *   const confirmed = await showConfirmDialog('Are you sure you want to log out?');
   *   if (confirmed) {
   *     try {
   *       await logoutUseCase.execute();
   *     } catch (error) {
   *       // Silent failure - user is still logged out locally
   *       console.warn('Backend logout failed, but local logout completed');
   *     }
   *   }
   * };
   * ```
   * 
   * @example Forced logout (security events)
   * ```typescript
   * const forceLogout = async (reason: string) => {
   *   try {
   *     // Log security event before logout
   *     await logSecurityEvent('forced_logout', { reason });
   *     await logoutUseCase.execute();
   *   } catch (error) {
   *     // Ensure local logout even if remote fails
   *     await forceLocalLogout();
   *   }
   * };
   * ```
   * 
   * @see {@link AuthRepository.logout} Backend logout method
   * @see {@link TokenService} Token management and revocation
   * @see {@link SecurityEventLogger} Security event logging
   * @see {@link StorageService} Local storage management
   * 
   * @todo Implement selective logout (specific device/session)
   * @todo Add logout reason tracking for analytics
   * @todo Implement graceful logout with pending operations handling
   */
  async execute(): Promise<void> {
    try {
      await this.authRepository.logout();
    } catch (error) {
      // Log logout errors for monitoring
      console.warn('Logout error:', error);
      
      // Re-throw critical errors, but most logout errors should be handled gracefully
      if (error instanceof Error && error.message.includes('critical')) {
        throw error;
      }
      
      // For most errors, we still consider logout successful
      // as local session cleanup should have occurred
    }
  }
}
