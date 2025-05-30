/**
 * @fileoverview DOMAIN-INTERFACE-006: MFA Service Interface - Enterprise Standard
 * @description Domain Layer Interface für Multi-Factor Authentication Service.
 * Definiert Verträge für TOTP, SMS und Hardware-basierte MFA-Implementierung.
 * 
 * @businessRule BR-252: MFA domain service interface definition
 * @businessRule BR-253: Multi-factor authentication contracts
 * @businessRule BR-254: Secure MFA token management interface
 * 
 * @securityNote MFA authentication interface specifications
 * @securityNote TOTP and SMS verification contracts
 * @securityNote Hardware token interface requirements
 * 
 * @compliance NIST 800-63B MFA interface standards
 * @compliance RFC 6238 TOTP interface compliance
 * @compliance ISO 27001 A.9.4.2 MFA interface requirements
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module IMFAService
 * @namespace Auth.Domain.Services.Interfaces
 */

/**
 * @interface MFASetupResult
 * @description MFA setup result information
 */
export interface MFASetupResult {
  success: boolean;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
  error?: string;
}

/**
 * @interface MFAVerificationResult
 * @description MFA verification result
 */
export interface MFAVerificationResult {
  success: boolean;
  verified: boolean;
  remainingAttempts?: number;
  error?: string;
}

/**
 * @interface MFAMethod
 * @description MFA method information
 */
export interface MFAMethod {
  id: string;
  type: 'totp' | 'sms' | 'hardware' | 'backup_codes';
  name: string;
  isEnabled: boolean;
  isPrimary: boolean;
  createdAt: Date;
}

/**
 * @interface MFAConfig
 * @description MFA configuration settings
 */
export interface MFAConfig {
  totpWindow: number;
  smsTimeout: number;
  maxAttempts: number;
  lockoutDuration: number;
  requireMFA: boolean;
  allowedMethods: string[];
}

/**
 * @interface IMFAService
 * @description DOMAIN-INTERFACE-006: MFA Service Contract
 */
export interface IMFAService {
  setupTOTP(userId: string): Promise<MFASetupResult>;
  verifyTOTP(userId: string, token: string): Promise<MFAVerificationResult>;
  setupSMS(userId: string, phoneNumber: string): Promise<MFASetupResult>;
  sendSMSCode(userId: string): Promise<{success: boolean; error?: string}>;
  verifySMSCode(userId: string, code: string): Promise<MFAVerificationResult>;
  getMFAMethods(userId: string): Promise<MFAMethod[]>;
  disableMFA(userId: string, methodId: string): Promise<{success: boolean; error?: string}>;
  generateBackupCodes(userId: string): Promise<string[]>;
  verifyBackupCode(userId: string, code: string): Promise<MFAVerificationResult>;
  getMFAConfig(): Promise<MFAConfig>;
} 