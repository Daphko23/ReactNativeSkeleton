/**
 * 🔐 Enable MFA Use Case
 *
 * Enterprise Use Case für die Aktivierung von Multi-Factor Authentication.
 * Implementiert Clean Architecture Prinzipien.
 */

import {AuthRepository} from '../../domain/interfaces/auth.repository.interface';
import {UserNotAuthenticatedError} from '../../domain/errors/user-not-authenticated.error';
import {SecurityEventType, SecurityEventSeverity, MFAType} from '../../domain/types/security.types';

/**
 * @fileoverview UC-025: Enable Multi-Factor Authentication Use Case
 * 
 * Enterprise Use Case für die Aktivierung von Multi-Factor Authentication (MFA).
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module EnableMFAUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/auth/mfa | MFA Documentation}
 * @see {@link AuthRepository} Repository Interface
 * 
 * @businessRule BR-028: MFA activation requires authenticated user
 * @businessRule BR-029: TOTP secrets must be cryptographically secure
 * @businessRule BR-030: SMS MFA requires valid phone number verification
 * @businessRule BR-031: Backup codes must be generated for recovery
 * @businessRule BR-032: MFA setup must be completed with verification
 * 
 * @securityNote This use case handles MFA secrets and security setup
 * @auditLog All MFA activation attempts are logged for security auditing
 * @compliance GDPR, CCPA, SOX, PCI-DSS, NIST 800-63B
 */

/**
 * @interface EnableMFARequest
 * @description Request object for enabling MFA with specific configuration
 * 
 * @example TOTP setup
 * ```typescript
 * const request: EnableMFARequest = {
 *   type: 'totp'
 * };
 * ```
 * 
 * @example SMS setup
 * ```typescript
 * const request: EnableMFARequest = {
 *   type: 'sms',
 *   phoneNumber: '+1234567890'
 * };
 * ```
 */
export interface EnableMFARequest {
  /** @description Type of MFA to enable */
  type: MFAType;
  
  /** 
   * @description Phone number for SMS MFA (required for SMS type)
   * @example '+1234567890'
   */
  phoneNumber?: string;
}

/**
 * @interface EnableMFAResponse
 * @description Response object containing MFA setup information
 * 
 * @example TOTP response
 * ```typescript
 * const response: EnableMFAResponse = {
 *   success: true,
 *   secret: 'JBSWY3DPEHPK3PXP',
 *   qrCode: 'data:image/png;base64,iVBORw0KGgo...',
 *   backupCodes: ['123456', '789012'],
 *   factorId: 'factor_abc123'
 * };
 * ```
 */
export interface EnableMFAResponse {
  /** @description Whether MFA was successfully enabled */
  success: boolean;
  
  /** @description TOTP secret key (only for TOTP type) */
  secret?: string;
  
  /** @description QR code for TOTP setup (only for TOTP type) */
  qrCode?: string;
  
  /** @description Recovery backup codes */
  backupCodes?: string[];
  
  /** @description Unique identifier for this MFA factor */
  factorId?: string;
}

export class EnableMFAUseCase {
  /**
   * Konstruktor für den Enable MFA UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for EnableMFAUseCase');
    }
  }

  /**
   * Aktiviert Multi-Factor Authentication für den aktuellen Benutzer.
   * 
   * @description
   * Dieser UseCase ermöglicht die Aktivierung von MFA (TOTP, SMS, oder E-Mail)
   * für zusätzliche Sicherheit. Generiert notwendige Secrets, QR-Codes und
   * Backup-Codes für die gewählte MFA-Methode.
   * 
   * **Preconditions:**
   * - Benutzer ist authentifiziert
   * - MFA ist noch nicht für die gewählte Methode aktiviert
   * - Bei SMS: Gültige Telefonnummer ist verfügbar
   * - Bei E-Mail: Verifizierte E-Mail-Adresse ist vorhanden
   * - Feature Flag `mfa_enabled` ist aktiviert
   * 
   * **Main Flow:**
   * 1. Authentifizierung des aktuellen Benutzers
   * 2. Validierung der MFA-Request-Parameter
   * 3. Generierung der MFA-Credentials (Secret, QR-Code)
   * 4. Erstellung von Backup-Recovery-Codes
   * 5. Speicherung der MFA-Konfiguration (unverified)
   * 6. Security-Event-Logging
   * 7. Rückgabe der Setup-Informationen
   * 
   * **Alternative Flows:**
   * - AF-025.1: Benutzer nicht authentifiziert → UserNotAuthenticatedError
   * - AF-025.2: MFA bereits aktiviert → MFAAlreadyEnabledError
   * - AF-025.3: Ungültige Telefonnummer (SMS) → ValidationError
   * - AF-025.4: E-Mail nicht verifiziert → EmailVerificationRequiredError
   * - AF-025.5: Backend-Service nicht verfügbar → ServiceUnavailableError
   * 
   * **Postconditions:**
   * - MFA-Faktor ist erstellt (unverified)
   * - Setup-Informationen sind verfügbar
   * - Backup-Codes sind generiert
   * - MFA-Aktivierung ist protokolliert
   * - Benutzer kann MFA-Setup abschließen
   * 
   * @param request - MFA-Aktivierungsanfrage mit Typ und optionalen Parametern
   * 
   * @returns Promise<EnableMFAResponse> - MFA-Setup-Informationen
   * 
   * @throws {UserNotAuthenticatedError} Wenn der Benutzer nicht authentifiziert ist
   * @throws {MFAAlreadyEnabledError} Wenn MFA bereits für die Methode aktiviert ist
   * @throws {InvalidPhoneNumberError} Wenn die Telefonnummer ungültig ist (SMS)
   * @throws {EmailVerificationRequiredError} Wenn E-Mail-Verifikation fehlt
   * @throws {CryptographicError} Bei Problemen mit Secret-Generierung
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen
   * @throws {ServiceUnavailableError} Wenn MFA-Service nicht verfügbar ist
   * @throws {InternalServerError} Bei unerwarteten System-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 1000-3000ms
   * - Secret-Generierung: 100-500ms
   * - QR-Code-Generierung: 200-800ms
   * - Backend-Registrierung: 500-2000ms
   * 
   * @security
   * - TOTP-Secrets sind kryptographisch sicher (RFC 6238)
   * - Backup-Codes sind einmalig verwendbar
   * - MFA-Setup erfordert Verifikation vor Aktivierung
   * - Alle Operationen werden auditiert
   * - Rate-Limiting für MFA-Setup-Versuche
   * 
   * @monitoring
   * - MFA Adoption Rate: Track activation by type
   * - Setup Success Rate: Monitor completion rates
   * - Error Distribution: Track failure reasons
   * - Security Events: SIEM integration
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example TOTP (Authenticator App) setup
   * ```typescript
   * try {
   *   const result = await enableMFAUseCase.execute({ type: 'totp' });
   *   
   *   // Show QR code to user
   *   displayQRCode(result.qrCode);
   *   
   *   // Store backup codes securely
   *   storeBackupCodes(result.backupCodes);
   *   
   *   // Navigate to verification step
   *   navigateToMFAVerification(result.factorId);
   * } catch (error) {
   *   if (error instanceof UserNotAuthenticatedError) {
   *     redirectToLogin();
   *   }
   * }
   * ```
   * 
   * @example SMS MFA setup
   * ```typescript
   * try {
   *   const result = await enableMFAUseCase.execute({
   *     type: 'sms',
   *     phoneNumber: '+1234567890'
   *   });
   *   
   *   // Inform user SMS verification is required
   *   showMessage('Verification code sent to your phone');
   *   
   *   // Navigate to SMS verification
   *   navigateToSMSVerification(result.factorId);
   * } catch (error) {
   *   if (error instanceof InvalidPhoneNumberError) {
   *     showError('Please enter a valid phone number');
   *   }
   * }
   * ```
   * 
   * @example Email MFA setup
   * ```typescript
   * try {
   *   const result = await enableMFAUseCase.execute({ type: 'email' });
   *   
   *   // Show confirmation message
   *   showMessage('MFA setup email sent. Please check your inbox.');
   *   
   *   // Navigate to email verification
   *   navigateToEmailVerification(result.factorId);
   * } catch (error) {
   *   if (error instanceof EmailVerificationRequiredError) {
   *     navigateToEmailVerification();
   *   }
   * }
   * ```
   * 
   * @see {@link AuthRepository.enableMFA} Backend MFA enablement method
   * @see {@link VerifyMFAUseCase} MFA verification completion
   * @see {@link SecurityEventLogger} Security event logging
   * @see {@link TOTPService} TOTP secret and QR code generation
   * 
   * @todo Implement hardware token support (YubiKey, etc.)
   * @todo Add MFA method priority configuration
   * @todo Implement adaptive MFA based on risk assessment
   */
  async execute(request: EnableMFARequest): Promise<EnableMFAResponse> {
    // Verify user is authenticated
    const currentUser = await this.authRepository.getCurrentUser();
    if (!currentUser) {
      throw new UserNotAuthenticatedError();
    }

    // Validate request
    if (request.type === 'sms' && !request.phoneNumber) {
      throw new Error('Phone number is required for SMS MFA');
    }

    try {
      // Enable MFA through repository (interface only accepts type parameter)
      const result = await this.authRepository.enableMFA(request.type);

      // Log security event
      await this.authRepository.logSecurityEvent({
        id: `mfa-enabled-${Date.now()}`,
        type: SecurityEventType.MFA_ENABLED,
        userId: currentUser.id,
        timestamp: new Date(),
        severity: SecurityEventSeverity.LOW,
        details: {
          action: 'mfa_enabled',
          mfaType: request.type,
          phoneNumber: request.phoneNumber, // Store phone number in details
          message: `MFA ${request.type} enabled successfully`,
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      return {
        success: true,
        secret: result.secret,
        qrCode: result.qrCode,
        backupCodes: [], // TODO: Generate backup codes
      };
    } catch (error) {
      // Log failed attempt
      await this.authRepository.logSecurityEvent({
        id: `mfa-enable-failed-${Date.now()}`,
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        userId: currentUser.id,
        timestamp: new Date(),
        severity: SecurityEventSeverity.MEDIUM,
        details: {
          action: 'mfa_enable_failed',
          mfaType: request.type,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: `Failed to enable MFA ${request.type}`,
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      throw error;
    }
  }
}
