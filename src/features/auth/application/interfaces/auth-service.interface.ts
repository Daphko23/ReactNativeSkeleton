/**
 * Auth Service Interfaces - Application Layer
 * Modular service interfaces for different auth concerns
 */

import { AuthUser } from '../../domain/entities/auth-user.entity';

export interface ICoreAuthService {
  login(email: string, password: string): Promise<AuthUser>;
  register(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  isAuthenticated(): Promise<boolean>;
}

export interface IMFAService {
  enableMFA(type: string): Promise<{ qrCode: string; backupCodes: string[] }>;
  verifyMFA(code: string): Promise<{ success: boolean; accessToken?: string }>;
  disableMFA(): Promise<void>;
  getMFAFactors(): Promise<any[]>;
}

export interface IBiometricAuthService {
  isBiometricAvailable(): Promise<boolean>;
  enableBiometric(): Promise<{ success: boolean }>;
  authenticateWithBiometric(): Promise<{ success: boolean; accessToken?: string }>;
}

export interface IOAuthService {
  loginWithGoogle(): Promise<AuthUser>;
  loginWithApple(): Promise<AuthUser>;
  loginWithMicrosoft(): Promise<AuthUser>;
}

export interface ISecurityService {
  checkSuspiciousActivity(): Promise<any>;
  getSecurityEvents(): Promise<any[]>;
  getActiveSessions(): Promise<any>;
  terminateSession(sessionId: string): Promise<void>;
}

export interface IPasswordService {
  updatePassword(currentPassword: string, newPassword: string): Promise<void>;
  validatePassword(password: string): Promise<{ isValid: boolean; errors: string[] }>;
  resetPassword(email: string): Promise<void>;
}

export interface ISessionService {
  getActiveSessions(): Promise<any>;
  terminateSession(sessionId: string): Promise<void>;
  terminateAllSessions(): Promise<void>;
}

export interface IRBACService {
  hasPermission(permission: string, userId?: string): Promise<boolean>;
  getUserRoles(userId?: string): Promise<string[]>;
  getPermissionDetails(permission: string, userId?: string): Promise<any>;
} 