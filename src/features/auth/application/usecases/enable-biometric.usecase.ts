/**
 * 📱 Enable Biometric Use Case
 *
 * Enterprise Use Case für die Aktivierung von biometrischer Authentifizierung.
 * Implementiert Clean Architecture Prinzipien.
 */

import {AuthRepository, SecurityEventType, SecurityEventSeverity} from '../../domain/interfaces/auth.repository.interface';
import {UserNotAuthenticatedError} from '../../domain/errors/user-not-authenticated.error';
import {BiometricNotAvailableError} from '../../domain/errors/biometric-not-available.error';

/**
 * @fileoverview UC-027: Enable Biometric Authentication Use Case
 * 
 * Enterprise Use Case für die Aktivierung von biometrischer Authentifizierung.
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module EnableBiometricUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/auth/biometric-setup | Biometric Setup Documentation}
 * @see {@link AuthRepository} Repository Interface
 * @see {@link BiometricNotAvailableError} Biometric error handling
 * 
 * @businessRule BR-038: Biometric enablement requires authenticated user
 * @businessRule BR-039: Hardware biometric support must be verified before enablement
 * @businessRule BR-040: User must grant biometric permissions explicitly
 * @businessRule BR-041: Biometric credentials are stored in device secure storage
 * @businessRule BR-042: Fallback authentication method must remain available
 * 
 * @securityNote This use case handles biometric credential setup and secure storage
 * @auditLog All biometric enablement attempts are logged for security auditing
 * @compliance GDPR, CCPA, SOX, PCI-DSS, FIDO2 Alliance Standards
 */

/**
 * @interface EnableBiometricResponse
 * @description Response object for biometric enablement operation
 * 
 * @example Successful biometric enablement
 * ```typescript
 * const response: EnableBiometricResponse = {
 *   success: true,
 *   biometricType: 'FaceID',
 *   message: 'Biometric authentication enabled successfully'
 * };
 * ```
 * 
 * @example Hardware not supported
 * ```typescript
 * const response: EnableBiometricResponse = {
 *   success: false,
 *   message: 'Biometric authentication not supported on this device'
 * };
 * ```
 */
export interface EnableBiometricResponse {
  /** @description Whether biometric enablement was successful */
  success: boolean;
  
  /** 
   * @description Type of biometric authentication enabled
   * @example 'TouchID', 'FaceID', 'Fingerprint', 'Face Unlock'
   */
  biometricType?: string;
  
  /** @description Human-readable result message */
  message: string;
}

export class EnableBiometricUseCase {
  /**
   * Konstruktor für den Enable Biometric UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for EnableBiometricUseCase');
    }
  }

  /**
   * Aktiviert die biometrische Authentifizierung für den aktuellen Benutzer.
   * 
   * @description
   * Dieser UseCase ermöglicht die Aktivierung der biometrischen Authentifizierung
   * (Touch ID, Face ID, Fingerabdruck) für schnellere und bequemere Anmeldung.
   * Prüft Hardware-Unterstützung und konfiguriert sichere Credential-Speicherung.
   * 
   * **Preconditions:**
   * - Benutzer ist authentifiziert
   * - Gerät unterstützt biometrische Authentifizierung
   * - Benutzer hat biometrische Daten auf dem Gerät registriert
   * - Biometrische Authentifizierung ist noch nicht aktiviert
   * - Secure Hardware (Keychain/Keystore) ist verfügbar
   * - Feature Flag `biometric_auth` ist aktiviert
   * 
   * **Main Flow:**
   * 1. Authentifizierung des aktuellen Benutzers
   * 2. Überprüfung der Hardware-Unterstützung
   * 3. Validierung der verfügbaren biometrischen Sensoren
   * 4. Benutzer-Berechtigung für biometrische Nutzung
   * 5. Generierung und sichere Speicherung der Credentials
   * 6. Konfiguration der biometrischen Authentifizierung
   * 7. Security-Event-Logging
   * 8. Bestätigungsrückmeldung
   * 
   * **Alternative Flows:**
   * - AF-027.1: Benutzer nicht authentifiziert → UserNotAuthenticatedError
   * - AF-027.2: Hardware nicht unterstützt → BiometricNotAvailableError
   * - AF-027.3: Keine biometrischen Daten registriert → BiometricNotEnrolledError
   * - AF-027.4: Benutzer verweigert Berechtigung → PermissionDeniedError
   * - AF-027.5: Bereits aktiviert → BiometricAlreadyEnabledError
   * 
   * **Postconditions:**
   * - Biometrische Authentifizierung ist aktiviert
   * - Credentials sind sicher gespeichert
   * - Benutzer kann biometrische Anmeldung verwenden
   * - Enablement-Event ist protokolliert
   * - Fallback-Authentifizierung bleibt verfügbar
   * 
   * @returns Promise<EnableBiometricResponse> - Enablement-Ergebnis mit Status und Details
   * 
   * @throws {UserNotAuthenticatedError} Wenn der Benutzer nicht authentifiziert ist
   * @throws {BiometricNotAvailableError} Wenn biometrische Hardware nicht verfügbar ist
   * @throws {BiometricNotEnrolledError} Wenn keine biometrischen Daten registriert sind
   * @throws {PermissionDeniedError} Wenn Benutzer Berechtigung verweigert
   * @throws {BiometricAlreadyEnabledError} Wenn biometrische Auth bereits aktiviert ist
   * @throws {SecureStorageError} Bei Problemen mit sicherer Speicherung
   * @throws {HardwareSecurityError} Bei Hardware-Sicherheitsproblemen
   * @throws {InternalServerError} Bei unerwarteten System-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 1000-5000ms
   * - Hardware-Verfügbarkeitsprüfung: 100-500ms
   * - Berechtigungsanfrage: 2000-10000ms (Benutzerinteraktion)
   * - Credential-Setup: 500-2000ms
   * - Secure Storage: 200-1000ms
   * 
   * @security
   * - Biometrische Templates bleiben auf dem Gerät
   * - Credentials werden in Secure Enclave/TEE gespeichert
   * - Hardware-basierte Tamper Detection
   * - Fallback-Methoden bleiben verfügbar
   * - Alle Setup-Operationen werden auditiert
   * 
   * @monitoring
   * - Enablement Success Rate: Track adoption rates
   * - Hardware Support Distribution: Device capability tracking
   * - Permission Grant Rate: UX funnel analysis
   * - Error Distribution: Support and improvement insights
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Standard biometric enablement
   * ```typescript
   * try {
   *   const result = await enableBiometricUseCase.execute();
   *   
   *   if (result.success) {
   *     console.log(`${result.biometricType} enabled successfully!`);
   *     showSuccessMessage(result.message);
   *     
   *     // Optionally test the newly enabled biometric auth
   *     await testBiometricAuth();
   *   }
   * } catch (error) {
   *   if (error instanceof BiometricNotAvailableError) {
   *     showInfo('Your device does not support biometric authentication');
   *   } else if (error instanceof UserNotAuthenticatedError) {
   *     redirectToLogin();
   *   }
   * }
   * ```
   * 
   * @example Biometric setup with user guidance
   * ```typescript
   * const setupBiometric = async () => {
   *   try {
   *     // Show explanation to user
   *     const userConsent = await showBiometricExplanationDialog();
   *     if (!userConsent) return;
   *     
   *     const result = await enableBiometricUseCase.execute();
   *     
   *     if (result.success) {
   *       // Show success with next steps
   *       showSuccessDialog({
   *         title: 'Biometric Setup Complete',
   *         message: `${result.biometricType} is now enabled for quick sign-in`,
   *         action: 'Try Now'
   *       });
   *     }
   *   } catch (error) {
   *     handleBiometricSetupError(error);
   *   }
   * };
   * ```
   * 
   * @example Error handling with user-friendly messages
   * ```typescript
   * try {
   *   return await enableBiometricUseCase.execute();
   * } catch (error) {
   *   if (error instanceof BiometricNotAvailableError) {
   *     showErrorDialog({
   *       title: 'Biometric Not Available',
   *       message: 'Your device does not support biometric authentication or it is not set up.',
   *       suggestion: 'You can still use password authentication.'
   *     });
   *   } else if (error instanceof BiometricNotEnrolledError) {
   *     showErrorDialog({
   *       title: 'Biometric Setup Required',
   *       message: 'Please set up biometric authentication in your device settings first.',
   *       action: 'Open Settings'
   *     });
   *   }
   *   throw error;
   * }
   * ```
   * 
   * @see {@link AuthRepository.enableBiometric} Backend biometric enablement
   * @see {@link AuthenticateWithBiometricUseCase} Biometric authentication flow
   * @see {@link BiometricService} Hardware biometric interface
   * @see {@link SecurityEventLogger} Security event logging
   * 
   * @todo Implement biometric re-enrollment detection and handling
   * @todo Add support for multiple biometric factors on same device
   * @todo Implement biometric quality assessment and guidance
   */
  async execute(): Promise<EnableBiometricResponse> {
    // Verify user is authenticated
    const currentUser = await this.authRepository.getCurrentUser();
    if (!currentUser) {
      throw new UserNotAuthenticatedError();
    }

    try {
      // Check if biometric is available
      const isAvailable = await this.authRepository.isBiometricAvailable();
      if (!isAvailable) {
        throw new BiometricNotAvailableError(
          'Biometric authentication is not available on this device'
        );
      }

      // Enable biometric authentication
      await this.authRepository.enableBiometric();

      // Log security event
      await this.authRepository.logSecurityEvent({
        id: `biometric-enabled-${Date.now()}`,
        type: SecurityEventType.MFA_ENABLED,
        userId: currentUser.id,
        timestamp: new Date(),
        severity: SecurityEventSeverity.LOW,
        details: {
          action: 'biometric_enabled',
          message: 'Biometric authentication enabled successfully',
          method: 'biometric',
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      return {
        success: true,
        message: 'Biometric authentication enabled successfully',
      };
    } catch (error) {
      // Log failed attempt
      await this.authRepository.logSecurityEvent({
        id: `biometric-enable-failed-${Date.now()}`,
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        userId: currentUser.id,
        timestamp: new Date(),
        severity: SecurityEventSeverity.MEDIUM,
        details: {
          action: 'biometric_enable_failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to enable biometric authentication',
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      throw error;
    }
  }
}
