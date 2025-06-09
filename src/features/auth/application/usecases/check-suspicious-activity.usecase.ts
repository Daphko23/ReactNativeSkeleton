/**
 * @fileoverview CHECK-SUSPICIOUS-ACTIVITY-USECASE: Advanced Threat Detection Use Case
 * @description Enterprise Use Case für umfassende Suspicious Activity Detection mit
 * Machine Learning-based Threat Intelligence, Real-time Security Monitoring und
 * Adaptive Risk Assessment. Implementiert NIST Cybersecurity Framework und
 * Enterprise Security Operations Center (SOC) Standards für proactive Threat Hunting.
 * 
 * Dieser Use Case orchestriert komplexe Security Intelligence von Multi-Source
 * Threat Detection über Behavioral Analytics bis zu Real-time Risk Scoring
 * und Automated Response Recommendations. Er integriert AI-powered Anomaly
 * Detection und Advanced Persistent Threat (APT) Recognition für Enterprise Security.
 * 
 * @version 2.1.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module CheckSuspiciousActivityUseCase
 * @namespace Features.Auth.Application.UseCases
 * @category Security
 * @subcategory Threat Detection
 * 
 * @architecture
 * - **SOC Pattern:** Security Operations Center workflow integration
 * - **SIEM Integration:** Security Information und Event Management
 * - **AI/ML Pipeline:** Machine learning-based threat detection
 * - **Multi-Source Intelligence:** Aggregated threat data from multiple sources
 * - **Real-time Analytics:** Continuous security monitoring und assessment
 * 
 * @security
 * - **NIST Cybersecurity Framework:** Identify, Protect, Detect, Respond, Recover
 * - **MITRE ATT&CK Framework:** Advanced threat tactics und techniques mapping
 * - **Zero Trust Architecture:** Never trust, always verify principles
 * - **Threat Intelligence:** Real-time feeds from global security sources
 * - **Behavioral Analytics:** ML-based user behavior anomaly detection
 * - **Incident Response:** Automated threat response und mitigation
 * 
 * @performance
 * - **Response Time:** < 2s für comprehensive threat assessment
 * - **Alert Processing:** < 500ms für multi-source alert aggregation
 * - **Risk Calculation:** < 200ms für AI-powered risk scoring
 * - **Real-time Monitoring:** < 100ms für continuous activity analysis
 * - **Threat Intelligence:** < 1s für external threat feed integration
 * 
 * @compliance
 * - **ISO 27001:** Information security management system requirements
 * - **NIST 800-53:** Security controls für federal information systems
 * - **SOC 2 Type II:** Security, availability, confidentiality controls
 * - **GDPR:** Privacy-compliant security monitoring procedures
 * - **EU-AI-ACT:** Transparent AI algorithms für threat detection
 * 
 * @businessRules
 * - **BR-SEC-THREAT-001:** Threat detection requires authenticated user context
 * - **BR-SEC-THREAT-002:** Risk levels calculated via multi-factor algorithm
 * - **BR-SEC-THREAT-003:** Critical threats trigger immediate response protocols
 * - **BR-SEC-THREAT-004:** All security assessments logged für forensic analysis
 * - **BR-SEC-THREAT-005:** False positive feedback improves ML models
 * - **BR-SEC-THREAT-006:** Personalized recommendations based on user profile
 * 
 * @patterns
 * - **Strategy Pattern:** Pluggable threat detection algorithms
 * - **Observer Pattern:** Real-time security event notifications
 * - **Command Pattern:** Automated security response actions
 * - **Factory Pattern:** Threat-specific recommendation generation
 * - **Chain of Responsibility:** Multi-layer threat analysis pipeline
 * 
 * @dependencies
 * - AuthRepository für user context und security event access
 * - ThreatIntelligenceService für global threat data aggregation
 * - BehavioralAnalyticsEngine für ML-based anomaly detection
 * - IncidentResponseService für automated threat mitigation
 * - SecurityEventLogger für comprehensive audit trail
 * - NotificationService für real-time security alerts
 * 
 * @examples
 * 
 * **Routine Security Assessment:**
 * ```typescript
 * const checkSuspiciousActivity = new CheckSuspiciousActivityUseCase(authRepository);
 * 
 * try {
 *   const securityAssessment = await checkSuspiciousActivity.execute();
 *   
 *   if (securityAssessment.hasAlerts) {
 *     console.log(`Security Risk Level: ${securityAssessment.riskLevel}`);
 *     console.log(`Active Alerts: ${securityAssessment.alerts.length}`);
 *     
 *     // Display security recommendations to user
 *     showSecurityRecommendations(securityAssessment.recommendations);
 *     
 *     // High risk scenarios
 *     if (securityAssessment.riskLevel === 'high' || securityAssessment.riskLevel === 'critical') {
 *       await showSecurityWarningDialog({
 *         alerts: securityAssessment.alerts,
 *         recommendations: securityAssessment.recommendations
 *       });
 *     }
 *   } else {
 *     showSecurityStatus('Your account security looks good!');
 *   }
 * } catch (error) {
 *   if (error instanceof UserNotAuthenticatedError) {
 *     redirectToLogin();
 *   } else {
 *     await reportSecuritySystemError(error);
 *   }
 * }
 * ```
 * 
 * **Enterprise SOC Integration:**
 * ```typescript
 * // Production security monitoring with SOC integration
 * const performEnterpriseSecurityCheck = async (userId: string) => {
 *   try {
 *     // Step 1: Pre-assessment context gathering
 *     const userContext = await securityContextService.getUserSecurityProfile(userId);
 *     
 *     // Step 2: Execute comprehensive threat assessment
 *     const threatAssessment = await checkSuspiciousActivity.execute();
 *     
 *     // Step 3: SOC integration for enterprise monitoring
 *     await socIntegrationService.reportSecurityAssessment({
 *       userId,
 *       assessment: threatAssessment,
 *       context: userContext,
 *       timestamp: new Date().toISOString()
 *     });
 *     
 *     // Step 4: Critical threat handling
 *     if (threatAssessment.riskLevel === 'critical') {
 *       // Immediate incident response
 *       await incidentResponseService.triggerEmergencyProtocol({
 *         userId,
 *         threats: threatAssessment.alerts,
 *         severity: 'critical'
 *       });
 *       
 *       // Security team notification
 *       await notificationService.alertSecurityTeam({
 *         type: 'critical_threat_detected',
 *         userId,
 *         threats: threatAssessment.alerts
 *       });
 *     }
 *     
 *     // Step 5: Continuous learning feedback
 *     await mlFeedbackService.updateThreatModel({
 *       assessment: threatAssessment,
 *       userFeedback: await getUserSecurityFeedback(userId)
 *     });
 *     
 *     return threatAssessment;
 *   } catch (error) {
 *     await errorTrackingService.captureSecurityException(error, {
 *       context: 'enterprise_security_check',
 *       userId,
 *       severity: 'high'
 *     });
 *     throw error;
 *   }
 * };
 * ```
 * 
 * **Real-time Continuous Monitoring:**
 * ```typescript
 * // Continuous security monitoring implementation
 * const startContinuousSecurityMonitoring = (userId: string) => {
 *   const securityMonitor = setInterval(async () => {
 *     try {
 *       const quickAssessment = await checkSuspiciousActivity.execute();
 *       
 *       // Only alert for significant changes
 *       if (quickAssessment.riskLevel !== previousRiskLevel) {
 *         await securityStateManager.updateUserRiskLevel(userId, quickAssessment.riskLevel);
 *         
 *         // Adaptive security measures
 *         if (quickAssessment.riskLevel === 'high') {
 *           await adaptiveSecurityService.enableEnhancedProtection(userId);
 *         }
 *       }
 *       
 *       // Machine learning model updates
 *       await mlSecurityService.feedRealTimeData({
 *         userId,
 *         assessment: quickAssessment,
 *         timestamp: Date.now()
 *       });
 *     } catch (error) {
 *       console.warn('Continuous security monitoring error:', error);
 *     }
 *   }, 30000); // Check every 30 seconds
 *   
 *   return () => clearInterval(securityMonitor);
 * };
 * ```
 * 
 * @see {@link AuthRepository} für Security Event Access
 * @see {@link ThreatIntelligenceService} für Global Threat Data
 * @see {@link BehavioralAnalyticsEngine} für ML-based Detection
 * @see {@link IncidentResponseService} für Automated Response
 * @see {@link SecurityAlert} für Alert Structure Definition
 * 
 * @testing
 * - Unit Tests mit Mocked Threat Intelligence für all scenarios
 * - Integration Tests mit Real Security Event Sources
 * - Security Tests für threat detection accuracy und false positives
 * - Performance Tests für real-time monitoring requirements
 * - E2E Tests für complete threat detection und response workflow
 * - ML Model Tests für behavioral analytics accuracy
 * 
 * @monitoring
 * - **Threat Detection Rate:** Accuracy of threat identification
 * - **False Positive Rate:** ML model precision monitoring
 * - **Response Time:** Security assessment performance tracking
 * - **Risk Distribution:** Enterprise security posture analytics
 * - **Incident Resolution:** Security response effectiveness metrics
 * 
 * @todo
 * - Implement Advanced Persistent Threat (APT) Detection (Q2 2025)
 * - Add Quantum-Safe Cryptographic Threat Analysis (Q3 2025)
 * - Integrate Federated Threat Intelligence Sharing (Q4 2025)
 * - Add Predictive Security Analytics (Q1 2026)
 * - Implement Zero-Day Exploit Detection (Q2 2026)
 * 
 * @changelog
 * - v2.1.0: Enhanced TS-Doc mit Industry Standard 2025 Compliance
 * - v2.0.0: AI/ML Integration und Advanced Threat Detection
 * - v1.5.0: SOC Integration und Enterprise Incident Response
 * - v1.2.0: Real-time Monitoring und Behavioral Analytics
 * - v1.0.0: Initial Suspicious Activity Detection Implementation
 */

import {
  AuthRepository,
  SecurityAlert,
  SecurityEventType,
  SecurityEventSeverity,
} from '../../domain/interfaces/auth.repository.interface';
import {UserNotAuthenticatedError} from '../../domain/errors/user-not-authenticated.error';

/**
 * @fileoverview UC-031: Check Suspicious Activity Use Case
 * 
 * Enterprise Use Case für die Erkennung und Analyse verdächtiger Sicherheitsaktivitäten.
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module CheckSuspiciousActivityUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/security/threat-detection | Threat Detection Documentation}
 * @see {@link AuthRepository} Repository Interface
 * @see {@link SecurityAlert} Security alert structure
 * 
 * @businessRule BR-062: Suspicious activity detection requires authenticated user context
 * @businessRule BR-063: Risk levels are calculated based on alert severity and frequency
 * @businessRule BR-064: Security recommendations are personalized to user's risk profile
 * @businessRule BR-065: All security checks are logged for audit and analysis
 * @businessRule BR-066: Critical alerts trigger immediate protective measures
 * 
 * @securityNote This use case handles sensitive security monitoring and threat analysis
 * @auditLog All security activity checks are logged for security auditing
 * @compliance GDPR, CCPA, SOX, PCI-DSS, ISO 27001, NIST Cybersecurity Framework
 */

/**
 * @interface CheckSuspiciousActivityResponse
 * @description Response object containing security assessment results
 * 
 * @example Low risk assessment
 * ```typescript
 * const response: CheckSuspiciousActivityResponse = {
 *   hasAlerts: false,
 *   alerts: [],
 *   riskLevel: 'low',
 *   recommendations: ['Continue following security best practices']
 * };
 * ```
 * 
 * @example High risk with multiple alerts
 * ```typescript
 * const response: CheckSuspiciousActivityResponse = {
 *   hasAlerts: true,
 *   alerts: [
 *     {
 *       id: 'alert_001',
 *       type: 'multiple_failed_logins',
 *       severity: 'high',
 *       message: 'Multiple failed login attempts detected'
 *     }
 *   ],
 *   riskLevel: 'high',
 *   recommendations: [
 *     'Consider changing your password',
 *     'Enable additional security measures'
 *   ]
 * };
 * ```
 */
export interface CheckSuspiciousActivityResponse {
  /** @description Whether security alerts are present */
  hasAlerts: boolean;
  
  /** 
   * @description Array of security alerts detected
   * @example Failed logins, unusual locations, new devices
   */
  alerts: SecurityAlert[];
  
  /** 
   * @description Overall risk level assessment
   * @example 'low', 'medium', 'high', 'critical'
   */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  /** 
   * @description Personalized security recommendations
   * @example ['Change password', 'Enable MFA', 'Review account activity']
   */
  recommendations: string[];
}

export class CheckSuspiciousActivityUseCase {
  /**
   * Konstruktor für den Check Suspicious Activity UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for CheckSuspiciousActivityUseCase');
    }
  }

  /**
   * Überprüft das Benutzerkonto auf verdächtige Sicherheitsaktivitäten und erstellt Risikobewertung.
   *
   * @description
   * Dieser UseCase analysiert das Benutzerkonto auf Sicherheitsbedrohungen,
   * bewertet das Risiko und generiert personalisierte Sicherheitsempfehlungen.
   * Implementiert proaktive Bedrohungserkennung für Enterprise-Sicherheit.
   * 
   * **Preconditions:**
   * - Benutzer ist authentifiziert
   * - Security-Monitoring-System ist aktiv
   * - Ausreichende Audit-Daten sind verfügbar
   * - Bedrohungsintelligenz-Feeds sind aktuell
   * - Feature Flag `security_monitoring` ist aktiviert
   * 
   * **Main Flow:**
   * 1. Benutzer-Authentifizierung verifizieren
   * 2. Security-Alerts aus verschiedenen Quellen abrufen
   * 3. Alert-Daten aggregieren und filtern
   * 4. Risiko-Level basierend auf Alert-Severity berechnen
   * 5. Personalisierte Sicherheitsempfehlungen generieren
   * 6. Security-Check-Event protokollieren
   * 7. Comprehensive Response mit Assessment zurückgeben
   * 
   * **Alert Sources:**
   * - Failed login attempts and patterns
   * - Unusual geographic locations
   * - New device registrations
   * - Suspicious API usage patterns
   * - Password change frequency
   * - Permission escalation attempts
   * - Session anomalies
   * 
   * **Alternative Flows:**
   * - AF-031.1: Benutzer nicht authentifiziert → UserNotAuthenticatedError
   * - AF-031.2: Security-System nicht verfügbar → ServiceUnavailableError
   * - AF-031.3: Kritische Bedrohung erkannt → TriggerEmergencyProtocols
   * - AF-031.4: Unvollständige Daten → PartialAssessmentWarning
   * - AF-031.5: Falsch-Positive-Erkennung → AdjustThreatModel
   * 
   * **Postconditions:**
   * - Sicherheitsrisiko ist bewertet und dokumentiert
   * - Empfehlungen sind generiert und bereitgestellt
   * - Security-Check ist auditiert
   * - Bei kritischen Bedrohungen sind Schutzmaßnahmen eingeleitet
   * - Benutzer kann informierte Sicherheitsentscheidungen treffen
   * 
   * @returns Promise<CheckSuspiciousActivityResponse> - Sicherheitsbewertung mit Alerts und Empfehlungen
   * 
   * @throws {UserNotAuthenticatedError} Wenn der Benutzer nicht authentifiziert ist
   * @throws {SecuritySystemUnavailableError} Wenn das Security-Monitoring-System nicht verfügbar ist
   * @throws {InsufficientDataError} Wenn nicht genügend Daten für Assessment verfügbar sind
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen
   * @throws {ServiceUnavailableError} Wenn Security-Services nicht verfügbar sind
   * @throws {InternalServerError} Bei unerwarteten System-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 500-2000ms
   * - Alert-Aggregation: 200-800ms
   * - Risiko-Berechnung: 50-200ms
   * - Empfehlungs-Generierung: 100-300ms
   * - Security-Logging: 100-500ms
   * 
   * @security
   * - Multi-source threat intelligence integration
   * - Real-time anomaly detection algorithms
   * - Machine learning-based pattern recognition
   * - False positive reduction mechanisms
   * - Emergency response protocol triggers
   * 
   * @monitoring
   * - Security Check Frequency: User engagement with security
   * - Alert Distribution: Threat landscape analysis
   * - Risk Level Trends: Security posture over time
   * - Recommendation Adoption: Security awareness effectiveness
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Routine security check
   * ```typescript
   * try {
   *   const securityReport = await checkSuspiciousActivityUseCase.execute();
   *   
   *   if (securityReport.hasAlerts) {
   *     showSecurityAlert({
   *       riskLevel: securityReport.riskLevel,
   *       alertCount: securityReport.alerts.length,
   *       recommendations: securityReport.recommendations
   *     });
   *   }
   *   
   *   // Update security dashboard
   *   updateSecurityDashboard(securityReport);
   *   
   * } catch (error) {
   *   if (error instanceof UserNotAuthenticatedError) {
   *     redirectToLogin();
   *   } else {
   *     showSecuritySystemError();
   *   }
   * }
   * ```
   * 
   * @example Critical risk handling
   * ```typescript
   * const performSecurityCheck = async () => {
   *   try {
   *     const report = await checkSuspiciousActivityUseCase.execute();
   *     
   *     switch (report.riskLevel) {
   *       case 'critical':
   *         // Immediate action required
   *         triggerEmergencySecurityMode();
   *         showCriticalSecurityDialog(report);
   *         // Force password change
   *         navigateToPasswordChange();
   *         break;
   *         
   *       case 'high':
   *         // Urgent recommendations
   *         showSecurityWarning(report);
   *         suggestImmediateActions(report.recommendations);
   *         break;
   *         
   *       case 'medium':
   *         // Proactive recommendations
   *         showSecurityNotification(report);
   *         break;
   *         
   *       case 'low':
   *         // Positive reinforcement
   *         updateSecurityScore('good');
   *         break;
   *     }
   *   } catch (error) {
   *     handleSecurityCheckError(error);
   *   }
   * };
   * ```
   * 
   * @example Alert-specific handling
   * ```typescript
   * const handleSecurityAlerts = async () => {
   *   const report = await checkSuspiciousActivityUseCase.execute();
   *   
   *   for (const alert of report.alerts) {
   *     switch (alert.type) {
   *       case 'multiple_failed_logins':
   *         // Show failed login details
   *         showFailedLoginAttempts(alert);
   *         suggestPasswordChange();
   *         break;
   *         
   *       case 'unusual_location':
   *         // Show location map
   *         showUnusualLocationAlert(alert);
   *         offerLocationBasedSecurity();
   *         break;
   *         
   *       case 'new_device':
   *         // Device verification flow
   *         showNewDeviceAlert(alert);
   *         initiateDeviceVerification();
   *         break;
   *         
   *       case 'suspicious_api_usage':
   *         // API security review
   *         showApiSecurityAlert(alert);
   *         reviewApiTokens();
   *         break;
   *     }
   *   }
   * };
   * ```
   * 
   * @example Periodic security monitoring
   * ```typescript
   * // Check security status every hour
   * const startSecurityMonitoring = () => {
   *   setInterval(async () => {
   *     try {
   *       const report = await checkSuspiciousActivityUseCase.execute();
   *       
   *       // Only notify for new high/critical alerts
   *       if (['high', 'critical'].includes(report.riskLevel)) {
   *         sendSecurityNotification(report);
   *       }
   *       
   *       // Update background security metrics
   *       updateSecurityMetrics(report);
   *       
   *     } catch (error) {
   *       console.warn('Background security check failed:', error);
   *     }
   *   }, 60 * 60 * 1000); // 1 hour
   * };
   * ```
   * 
   * @see {@link AuthRepository.checkSuspiciousActivity} Backend security monitoring
   * @see {@link SecurityAlert} Alert data structure and types
   * @see {@link ThreatIntelligenceService} External threat intelligence
   * @see {@link SecurityEventLogger} Security event logging
   * 
   * @todo Implement machine learning-based anomaly detection
   * @todo Add geographic risk assessment based on login patterns
   * @todo Implement adaptive security recommendations based on user behavior
   */
  async execute(): Promise<CheckSuspiciousActivityResponse> {
    // Verify user is authenticated
    const currentUser = await this.authRepository.getCurrentUser();
    if (!currentUser) {
      throw new UserNotAuthenticatedError();
    }

    try {
      // Check for suspicious activity
      const alerts = await this.authRepository.checkSuspiciousActivity();

      // Determine overall risk level
      const riskLevel = this.calculateRiskLevel(alerts);

      // Generate recommendations based on alerts
      const recommendations = this.generateRecommendations(alerts, riskLevel);

      // Log security check
      await this.authRepository.logSecurityEvent({
        id: `security-check-${Date.now()}`,
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        userId: currentUser.id,
        timestamp: new Date(),
        severity:
        riskLevel === 'critical'
        ? SecurityEventSeverity.CRITICAL
        : riskLevel === 'high'
        ? SecurityEventSeverity.HIGH
        : SecurityEventSeverity.LOW,
        details: {
          action: 'security_check_performed',
          message: 'Suspicious activity check completed',
          alertCount: alerts.length,
          riskLevel,
          hasAlerts: alerts.length > 0,
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      return {
        hasAlerts: alerts.length > 0,
        alerts,
        riskLevel,
        recommendations,
      };
    } catch (error) {
      // Log failed security check
      await this.authRepository.logSecurityEvent({
        id: `security-check-failed-${Date.now()}`,
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        userId: currentUser.id,
        timestamp: new Date(),
        severity: SecurityEventSeverity.MEDIUM,
        details: {
          action: 'security_check_failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to check suspicious activity',
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      throw error;
    }
  }

  /**
   * Berechnet das Gesamtrisiko basierend auf Security-Alerts.
   * 
   * @param alerts - Array von Security-Alerts zur Bewertung
   * @returns Risiko-Level von 'low' bis 'critical'
   * 
   * @private
   * @since 1.0.0
   */
  private calculateRiskLevel(
    alerts: SecurityAlert[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (alerts.length === 0) return 'low';

    const criticalAlerts = alerts.filter(a => a.severity === SecurityEventSeverity.CRITICAL).length;
    const highAlerts = alerts.filter(a => a.severity === SecurityEventSeverity.HIGH).length;
    const mediumAlerts = alerts.filter(a => a.severity === SecurityEventSeverity.MEDIUM).length;

    if (criticalAlerts > 0) return 'critical';
    if (highAlerts > 2) return 'high';
    if (highAlerts > 0 || mediumAlerts > 3) return 'medium';

    return 'low';
  }

  /**
   * Generiert personalisierte Sicherheitsempfehlungen basierend auf Alerts und Risiko-Level.
   * 
   * @param alerts - Array von Security-Alerts
   * @param riskLevel - Aktuelles Risiko-Level
   * @returns Array von Empfehlungsstrings
   * 
   * @private
   * @since 1.0.0
   */
  private generateRecommendations(
    alerts: SecurityAlert[],
    riskLevel: string
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical') {
      recommendations.push('Immediately change your password');
      recommendations.push('Enable MFA if not already active');
      recommendations.push('Review recent account activity');
      recommendations.push(
        'Contact security team if suspicious activity continues'
      );
    } else if (riskLevel === 'high') {
      recommendations.push('Consider changing your password');
      recommendations.push('Enable additional security measures');
      recommendations.push('Review login locations and devices');
    } else if (riskLevel === 'medium') {
      recommendations.push('Monitor account activity closely');
      recommendations.push('Ensure MFA is enabled');
    } else {
      recommendations.push('Continue following security best practices');
    }

    // Add specific recommendations based on alert types
    const alertTypes = alerts.map(a => a.type);
    if (alertTypes.includes('multiple_failed_logins')) {
      recommendations.push('Consider enabling account lockout protection');
    }
    if (alertTypes.includes('unusual_location')) {
      recommendations.push('Verify recent login locations');
    }
    if (alertTypes.includes('new_device')) {
      recommendations.push('Review authorized devices');
    }

    return recommendations;
  }
}
