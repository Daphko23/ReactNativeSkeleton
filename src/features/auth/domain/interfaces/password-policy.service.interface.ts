/**
 * @fileoverview DOMAIN-INTERFACE-005: Password Policy Service Interface - Enterprise Standard
 * @description Domain Layer Interface für Enterprise Password Policy Validation Service.
 * Definiert Verträge für Passwort-Sicherheitsprüfung, Stärkeberechnung und Policy-Enforcement.
 * 
 * @businessRule BR-237: Password policy domain interface definition
 * @businessRule BR-238: Enterprise password security contracts
 * @businessRule BR-239: Password validation and strength assessment interface
 * 
 * @securityNote Password content validation contracts defined
 * @securityNote Policy enforcement interface specifications
 * @securityNote Strength calculation interface requirements
 * 
 * @compliance NIST 800-63B Digital Identity Guidelines
 * @compliance OWASP Password Guidelines interface compliance
 * @compliance ISO 27001 A.9.4.3 Password management interface
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module IPasswordPolicyService
 * @namespace Auth.Domain.Services.Interfaces
 */

/**
 * @interface PasswordPolicy
 * @description Enterprise password policy configuration
 */
export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minSpecialChars: number;
  preventCommonPasswords: boolean;
  preventUserInfo: boolean;
  preventRepeatingChars: boolean;
  maxRepeatingChars: number;
  preventSequentialChars: boolean;
  historyCount: number;
  expirationDays: number;
  customPatterns?: RegExp[];
  customMessages?: Record<string, string>;
}

/**
 * @interface PasswordValidationResult
 * @description Password validation result with comprehensive feedback
 */
export interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  strength: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';
  errors: string[];
  warnings: string[];
  suggestions: string[];
  estimatedCrackTime: string;
}

/**
 * @interface PasswordHistoryEntry
 * @description Password history entry for reuse prevention
 */
export interface PasswordHistoryEntry {
  hashedPassword: string;
  createdAt: Date;
  userId: string;
}

/**
 * @interface UserInfo
 * @description User information for password validation context
 */
export interface UserInfo {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

/**
 * @interface PasswordPolicyConfig
 * @description Password policy configuration
 */
export interface PasswordPolicyConfig {
  policy: PasswordPolicy;
  customRules?: Array<{
    name: string;
    validator: (password: string) => boolean;
    message: string;
  }>;
}

/**
 * @interface IPasswordPolicyService
 * @description DOMAIN-INTERFACE-005: Password Policy Service Contract
 */
export interface IPasswordPolicyService {
  validatePassword(
    password: string,
    userInfo?: UserInfo,
    policy?: Partial<PasswordPolicy>
  ): Promise<PasswordValidationResult>;

  isPasswordInHistory(
    password: string,
    userId: string,
    history: PasswordHistoryEntry[]
  ): Promise<boolean>;

  generateSecurePassword(
    length?: number,
    policy?: Partial<PasswordPolicy>
  ): string;

  isPasswordExpired(
    lastChanged: Date,
    policy?: Partial<PasswordPolicy>
  ): boolean;

  getDaysUntilExpiration(
    lastChanged: Date,
    policy?: Partial<PasswordPolicy>
  ): number | null;

  calculateStrength(password: string): Promise<number>;

  meetsMinimumRequirements(password: string): Promise<boolean>;

  generatePasswordSuggestions(): Promise<string[]>;

  getPolicyConfiguration(): Promise<PasswordPolicyConfig>;

  isPasswordRecentlyUsed(userId: string, password: string): Promise<boolean>;
} 