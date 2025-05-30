/**
 * @fileoverview DOMAIN-INTERFACE-002: Biometric Authentication Service Interface - Enterprise Standard
 * @description Domain Layer Interface für Biometric Authentication Service.
 * Definiert Verträge für Hardware-basierte biometrische Authentifizierung.
 * 
 * @businessRule BR-231: Biometric authentication domain interface definition
 * @businessRule BR-232: Hardware security module interface contracts
 * @businessRule BR-233: Cross-platform biometric interface standards
 * 
 * @securityNote Biometric authentication interface specifications
 * @securityNote Hardware security integration contracts
 * @securityNote Secure key management interface requirements
 * 
 * @compliance FIDO2 Alliance interface standards
 * @compliance ISO 27001 A.9.4.2 interface compliance
 * @compliance GDPR Article 9 biometric interface protection
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module IBiometricAuthService
 * @namespace Auth.Domain.Services.Interfaces
 */

/**
 * @interface BiometricAvailability
 * @description Biometric hardware availability information
 */
export interface BiometricAvailability {
  available: boolean;
  biometryType: 'TouchID' | 'FaceID' | 'Fingerprint' | 'None';
  error?: string;
}

/**
 * @interface BiometricKeys
 * @description Biometric cryptographic key information
 */
export interface BiometricKeys {
  publicKey: string;
  keyAlias: string;
}

/**
 * @interface BiometricAuthResult
 * @description Biometric authentication result
 */
export interface BiometricAuthResult {
  success: boolean;
  signature?: string;
  error?: string;
}

/**
 * @interface IBiometricAuthService
 * @description DOMAIN-INTERFACE-002: Biometric Authentication Service Contract
 */
export interface IBiometricAuthService {
  /**
   * Check if biometric authentication is available
   * @returns Promise<BiometricAvailability> Hardware capability info
   */
  isBiometricAvailable(): Promise<BiometricAvailability>;

  /**
   * Create biometric keys for user
   * @param userId User identifier
   * @returns Promise<BiometricKeys> Generated key information
   */
  createBiometricKeys(userId: string): Promise<BiometricKeys>;

  /**
   * Authenticate with biometric verification
   * @param userId User identifier
   * @param promptMessage Message for biometric prompt
   * @returns Promise<BiometricAuthResult> Authentication result
   */
  authenticateWithBiometric(userId: string, promptMessage: string): Promise<BiometricAuthResult>;

  /**
   * Check if biometric keys exist for user
   * @returns Promise<boolean> True if keys exist
   */
  biometricKeysExist(): Promise<boolean>;

  /**
   * Delete biometric keys for user
   * @returns Promise<void> Resolves when keys deleted
   */
  deleteBiometricKeys(): Promise<void>;

  /**
   * Get prompt message for biometric type
   * @param biometryType Type of biometric authentication
   * @returns string Localized prompt message
   */
  getPromptMessage(biometryType: string): string;
} 