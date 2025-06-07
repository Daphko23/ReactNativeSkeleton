/**
 * Domain DTOs for Auth Feature
 * Export all DTOs used in the domain layer
 */

// Request DTOs
export interface LoginRequest {
  email: string;
  password: string;
  enforcePasswordPolicy?: boolean;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}

export interface EnableMFARequest {
  method: 'totp' | 'sms' | 'email';
  phoneNumber?: string;
}

export interface VerifyMFARequest {
  code: string;
  method: 'totp' | 'sms' | 'email';
  challengeId?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Response DTOs
export interface EnableMFAResponse {
  success: boolean;
  qrCode?: string;
  backupCodes?: string[];
  secret?: string;
}

export interface VerifyMFAResponse {
  success: boolean;
  accessToken?: string;
  message?: string;
}

export interface BiometricAuthResponse {
  success: boolean;
  accessToken?: string;
  message?: string;
}

export interface OAuthLoginResponse {
  success: boolean;
  user?: any; // Will be typed properly based on requirements
  accessToken?: string;
  message?: string;
}

export interface SuspiciousActivityResponse {
  hasActivity: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  timestamp: string;
}

export interface ActiveSessionsResponse {
  totalCount: number;
  sessions: Array<{
    sessionId: string;
    deviceInfo: {
      platform: string;
      browser?: string;
      os?: string;
    };
    lastActivity: string;
    location?: string;
    isCurrentSession: boolean;
  }>;
}

export interface PermissionResponse {
  hasPermission: boolean;
  effectiveRole?: string;
  grantedBy: string[];
  deniedBy?: string[];
  metadata?: Record<string, any>;
}

export interface MFAFactor {
  id: string;
  type: 'totp' | 'sms' | 'email';
  isEnabled: boolean;
  displayName: string;
  createdAt: string;
  lastUsed?: string;
} 