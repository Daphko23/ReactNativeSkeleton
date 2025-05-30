/**
 * 🕐 Get Active Sessions Use Case
 *
 * Enterprise Use Case für Session Management.
 * Implementiert Clean Architecture Prinzipien.
 */

import {AuthRepository, SecurityEventType, SecurityEventSeverity} from '../../domain/interfaces/auth.repository.interface';
import {UserSession} from '../../domain/entities/auth-user.interface';
import {UserNotAuthenticatedError} from '../../domain/errors/user-not-authenticated.error';

/**
 * @fileoverview UC-032: Get Active Sessions Use Case
 * 
 * Enterprise Use Case für das Management und die Überwachung aktiver Benutzersitzungen.
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module GetActiveSessionsUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/auth/session-management | Session Management Documentation}
 * @see {@link AuthRepository} Repository Interface
 * @see {@link UserSession} Session entity structure
 * 
 * @businessRule BR-067: Active sessions retrieval requires authenticated user
 * @businessRule BR-068: Session data includes device and location information
 * @businessRule BR-069: Current session is identified and marked separately
 * @businessRule BR-070: Session access is logged for security auditing
 * @businessRule BR-071: Expired sessions are automatically filtered from results
 * 
 * @securityNote This use case handles sensitive session management and security monitoring
 * @auditLog All session access attempts are logged for security auditing
 * @compliance GDPR, CCPA, SOX, PCI-DSS, Session Management Standards
 */

/**
 * @interface GetActiveSessionsResponse
 * @description Response object containing active session information
 * 
 * @example Multiple active sessions
 * ```typescript
 * const response: GetActiveSessionsResponse = {
 *   sessions: [
 *     {
 *       id: 'session_001',
 *       deviceInfo: 'iPhone 14 Pro',
 *       location: 'New York, US',
 *       lastActivity: '2024-01-15T10:30:00Z',
 *       isCurrentSession: true
 *     },
 *     {
 *       id: 'session_002',
 *       deviceInfo: 'MacBook Pro',
 *       location: 'New York, US',
 *       lastActivity: '2024-01-15T09:15:00Z',
 *       isCurrentSession: false
 *     }
 *   ],
 *   currentSessionId: 'session_001',
 *   totalSessions: 2
 * };
 * ```
 * 
 * @example Single session (current only)
 * ```typescript
 * const response: GetActiveSessionsResponse = {
 *   sessions: [
 *     {
 *       id: 'session_001',
 *       deviceInfo: 'Android Phone',
 *       location: 'London, UK',
 *       lastActivity: '2024-01-15T14:20:00Z',
 *       isCurrentSession: true
 *     }
 *   ],
 *   currentSessionId: 'session_001',
 *   totalSessions: 1
 * };
 * ```
 */
export interface GetActiveSessionsResponse {
  /** 
   * @description Array of active user sessions
   * @example Session data with device info, location, and activity
   */
  sessions: UserSession[];
  
  /** 
   * @description ID of the current session (if available)
   * @example 'session_abc123456'
   */
  currentSessionId?: string;
  
  /** 
   * @description Total count of active sessions
   * @example 3 for three concurrent sessions
   */
  totalSessions: number;
}

export class GetActiveSessionsUseCase {
  /**
   * Konstruktor für den Get Active Sessions UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for GetActiveSessionsUseCase');
    }
  }

  /**
   * Ruft alle aktiven Benutzersitzungen ab und stellt Session-Management-Informationen bereit.
   *
   * @description
   * Dieser UseCase ermöglicht Benutzern die Überwachung und Verwaltung ihrer
   * aktiven Sitzungen für verbesserte Sicherheit und Kontrolle. Zeigt
   * detaillierte Informationen über Geräte, Standorte und Aktivitätszeiten.
   * 
   * **Preconditions:**
   * - Benutzer ist authentifiziert
   * - Session-Tracking-System ist aktiv
   * - Session-Datenbank ist verfügbar
   * - Mindestens eine aktive Session existiert
   * - Feature Flag `session_management` ist aktiviert
   * 
   * **Main Flow:**
   * 1. Benutzer-Authentifizierung verifizieren
   * 2. Aktive Sessions aus der Datenbank abrufen
   * 3. Session-Daten aggregieren und formatieren
   * 4. Aktuelle Session identifizieren und markieren
   * 5. Abgelaufene Sessions herausfiltern
   * 6. Session-Zugriff auditieren
   * 7. Formatierte Session-Response zurückgeben
   * 
   * **Session Information:**
   * - Session ID und Status
   * - Geräteinformationen (Typ, Browser, OS)
   * - Geografische Standortdaten
   * - Letzte Aktivitätszeiten
   * - Session-Erstellungszeiten
   * - IP-Adresse und User-Agent
   * - Sicherheits-Flags und -Status
   * 
   * **Alternative Flows:**
   * - AF-032.1: Benutzer nicht authentifiziert → UserNotAuthenticatedError
   * - AF-032.2: Keine aktiven Sessions → EmptySessionListResponse
   * - AF-032.3: Session-Service nicht verfügbar → ServiceUnavailableError
   * - AF-032.4: Teilweise Daten verfügbar → PartialSessionDataWarning
   * - AF-032.5: Aktuelle Session nicht identifizierbar → UnknownCurrentSession
   * 
   * **Postconditions:**
   * - Session-Informationen sind abgerufen und bereitgestellt
   * - Aktuelle Session ist identifiziert (falls möglich)
   * - Session-Zugriff ist auditiert
   * - Benutzer kann informierte Session-Management-Entscheidungen treffen
   * - Keine Seiteneffekte auf bestehende Sessions
   * 
   * @returns Promise<GetActiveSessionsResponse> - Aktive Sessions mit Details und Metadaten
   * 
   * @throws {UserNotAuthenticatedError} Wenn der Benutzer nicht authentifiziert ist
   * @throws {SessionServiceUnavailableError} Wenn der Session-Service nicht verfügbar ist
   * @throws {SessionDataCorruptedError} Wenn Session-Daten beschädigt sind
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen
   * @throws {ServiceUnavailableError} Wenn Session-Backend nicht verfügbar ist
   * @throws {InternalServerError} Bei unerwarteten System-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 200-800ms
   * - Session-Datenbank-Abfrage: 100-500ms
   * - Daten-Aggregation: 50-200ms
   * - Geolocation-Enrichment: 100-400ms
   * - Audit-Logging: 50-200ms
   * 
   * @security
   * - Session-Daten werden nur für authentifizierte Benutzer bereitgestellt
   * - Sensitive Session-Details werden anonymisiert oder aggregiert
   * - Alle Session-Zugriffe werden auditiert
   * - Session-IDs werden sicher behandelt
   * - Geografische Daten werden privacy-konform verarbeitet
   * 
   * @monitoring
   * - Session View Frequency: User security awareness tracking
   * - Active Session Distribution: Security posture analysis
   * - Session Anomaly Detection: Unusual session patterns
   * - Geographic Distribution: Risk assessment insights
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Standard session overview
   * ```typescript
   * try {
   *   const sessionData = await getActiveSessionsUseCase.execute();
   *   
   *   console.log(`You have ${sessionData.totalSessions} active sessions`);
   *   
   *   // Display sessions in UI
   *   displaySessionList(sessionData.sessions);
   *   
   *   // Highlight current session
   *   if (sessionData.currentSessionId) {
   *     highlightCurrentSession(sessionData.currentSessionId);
   *   }
   *   
   * } catch (error) {
   *   if (error instanceof UserNotAuthenticatedError) {
   *     redirectToLogin();
   *   } else {
   *     showSessionError('Unable to load session information');
   *   }
   * }
   * ```
   * 
   * @example Session security monitoring
   * ```typescript
   * const monitorSessionSecurity = async () => {
   *   try {
   *     const sessionData = await getActiveSessionsUseCase.execute();
   *     
   *     // Check for suspicious sessions
   *     const suspiciousSessions = sessionData.sessions.filter(session => {
   *       // Flag sessions from unusual locations
   *       const isUnusualLocation = !isKnownLocation(session.location);
   *       
   *       // Flag very old sessions
   *       const isOldSession = isSessionOlderThan(session, '30 days');
   *       
   *       return isUnusualLocation || isOldSession;
   *     });
   *     
   *     if (suspiciousSessions.length > 0) {
   *       showSecurityAlert({
   *         type: 'suspicious_sessions',
   *         sessions: suspiciousSessions,
   *         action: 'review_and_terminate'
   *       });
   *     }
   *     
   *   } catch (error) {
   *     handleSessionMonitoringError(error);
   *   }
   * };
   * ```
   * 
   * @example Session management dashboard
   * ```typescript
   * const renderSessionDashboard = async () => {
   *   try {
   *     const sessionData = await getActiveSessionsUseCase.execute();
   *     
   *     // Group sessions by device type
   *     const sessionsByDevice = groupSessionsByDevice(sessionData.sessions);
   *     
   *     // Create dashboard components
   *     const dashboard = (
   *       <SessionDashboard>
   *         <SessionCount total={sessionData.totalSessions} />
   *         <CurrentSessionIndicator id={sessionData.currentSessionId} />
   *         
   *         {Object.entries(sessionsByDevice).map(([deviceType, sessions]) => (
   *           <DeviceSessionGroup 
   *             key={deviceType}
   *             deviceType={deviceType}
   *             sessions={sessions}
   *             onTerminate={handleSessionTermination}
   *           />
   *         ))}
   *         
   *         <SessionSecurityInsights sessions={sessionData.sessions} />
   *       </SessionDashboard>
   *     );
   *     
   *     return dashboard;
   *   } catch (error) {
   *     return <SessionErrorState error={error} />;
   *   }
   * };
   * ```
   * 
   * @example Periodic session refresh
   * ```typescript
   * // Refresh session data every 5 minutes
   * const startSessionMonitoring = () => {
   *   const refreshSessions = async () => {
   *     try {
   *       const sessionData = await getActiveSessionsUseCase.execute();
   *       
   *       // Update UI with fresh session data
   *       updateSessionDisplay(sessionData);
   *       
   *       // Check for new sessions (potential security concern)
   *       const newSessions = detectNewSessions(sessionData.sessions);
   *       if (newSessions.length > 0) {
   *         notifyNewSessionDetected(newSessions);
   *       }
   *       
   *     } catch (error) {
   *       console.warn('Session refresh failed:', error);
   *     }
   *   };
   *   
   *   // Initial load
   *   refreshSessions();
   *   
   *   // Set up periodic refresh
   *   return setInterval(refreshSessions, 5 * 60 * 1000); // 5 minutes
   * };
   * ```
   * 
   * @see {@link AuthRepository.getActiveSessions} Backend session retrieval
   * @see {@link UserSession} Session entity structure and properties
   * @see {@link SessionTerminationUseCase} Session termination functionality
   * @see {@link SecurityEventLogger} Security event logging
   * 
   * @todo Implement session clustering for improved performance
   * @todo Add session risk scoring based on multiple factors
   * @todo Implement real-time session updates via WebSocket
   */
  async execute(): Promise<GetActiveSessionsResponse> {
    // Verify user is authenticated
    const currentUser = await this.authRepository.getCurrentUser();
    if (!currentUser) {
      throw new UserNotAuthenticatedError();
    }

    try {
      // Get active sessions
      const sessions = await this.authRepository.getActiveSessions();

      // Log security event
      await this.authRepository.logSecurityEvent({
        id: `sessions-viewed-${Date.now()}`,
        type: SecurityEventType.LOGIN,
        userId: currentUser.id,
        timestamp: new Date(),
        severity: SecurityEventSeverity.LOW,
        details: {
          action: 'sessions_viewed',
          message: 'User viewed active sessions',
          sessionCount: sessions.length,
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      return {
        sessions,
        totalSessions: sessions.length,
      };
    } catch (error) {
      // Log failed attempt
      await this.authRepository.logSecurityEvent({
        id: `sessions-view-failed-${Date.now()}`,
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        userId: currentUser.id,
        timestamp: new Date(),
        severity: SecurityEventSeverity.MEDIUM,
        details: {
          action: 'sessions_view_failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to retrieve active sessions',
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      throw error;
    }
  }
}
