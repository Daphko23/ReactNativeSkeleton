/**
 * Account Settings Domain Types - Enterprise Domain Layer
 * Core domain types for account settings functionality
 * Following Clean Architecture Domain layer patterns
 */

// Core Domain Types
export interface ProfileSummary {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
  createdAt: Date;
  profileCompleteness: number;
}

export interface DataUsageStats {
  totalSize: string;
  storageUsed: number;
  storageLimit: number;
  lastBackup: Date;
  backupSize?: string;
  activeDevices: number;
}

export interface SecurityStats {
  lastLogin: Date;
  activeDevices: number;
  activeSessions: number;
  twoFactorEnabled: boolean;
  mfaEnabled: boolean;
  loginAttempts?: number;
  lastPasswordChange?: Date;
}

export interface AccountStats {
  profileCompleteness: number;
  dataUsage: DataUsageStats;
  security: SecurityStats;
  memberSince: Date;
}

// Service Interfaces (Domain Layer)
export interface AccountSettingsService {
  getProfileSummary: () => Promise<ProfileSummary>;
  getAccountStats: () => Promise<AccountStats>;
  exportUserData: () => Promise<{ success: boolean; downloadUrl?: string }>;
  deleteAccount: () => Promise<{ success: boolean }>;
}

// Constants
export const ACCOUNT_SETTINGS_CONSTANTS = {
  EXPORT_TIMEOUT: 30000,
  REFRESH_INTERVAL: 300000, // 5 minutes
  MAX_EXPORT_SIZE: 1024 * 1024 * 100, // 100MB
  BACKUP_RETENTION_DAYS: 30,
} as const; 