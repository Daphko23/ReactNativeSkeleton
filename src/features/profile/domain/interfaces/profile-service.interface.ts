/**
 * IProfileService Interface - Domain Layer
 * Defines the contract for profile operations
 */

import { 
  UserProfile, 
  PrivacySettings, 
  ProfileHistoryEntry, 
  ProfileDataExport,
  ProfileValidationResult,
  CustomFieldDefinition 
} from '../entities/user-profile.entity';

export interface IProfileService {
  // Core Profile Operations
  getProfile(userId: string): Promise<UserProfile | null>;
  updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile>;
  deleteProfile(userId: string, keepAuth: boolean): Promise<void>;
  
  // Avatar Management
  uploadAvatar(userId: string, imageUri: string): Promise<string>;
  deleteAvatar(userId: string): Promise<void>;
  
  // Privacy Settings
  getPrivacySettings(userId: string): Promise<PrivacySettings>;
  updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings>;
  
  // Profile History & Versioning
  getProfileHistory(userId: string): Promise<ProfileHistoryEntry[]>;
  restoreProfileVersion(userId: string, versionId: string): Promise<UserProfile>;
  
  // Data Management
  exportProfileData(userId: string, format: 'json' | 'csv' | 'xml'): Promise<ProfileDataExport>;
  
  // Validation
  validateProfile(profile: Partial<UserProfile>): Promise<ProfileValidationResult>;
  
  // Custom Fields (für Erweiterungen)
  getCustomFieldDefinitions(): Promise<CustomFieldDefinition[]>;
  updateCustomField(userId: string, fieldKey: string, value: any): Promise<void>;
  
  // Profile Completeness
  calculateCompleteness(profile: UserProfile): number;
  
  // Sync & Real-time
  syncProfile(userId: string): Promise<UserProfile>;
  subscribeToProfileChanges(userId: string, callback: (profile: UserProfile) => void): () => void;
}

// Request/Response DTOs für bessere Type Safety
export interface UpdateProfileRequest {
  profile: Partial<UserProfile>;
  reason?: string;
  notify?: boolean;
}

export interface UploadAvatarRequest {
  imageUri: string;
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  compress?: boolean;
}

export interface ExportDataRequest {
  format: 'json' | 'csv' | 'xml';
  includeHistory?: boolean;
  includePrivacySettings?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface ProfileServiceOptions {
  enableRealTimeSync?: boolean;
  enableVersioning?: boolean;
  enableAnalytics?: boolean;
  maxVersions?: number;
  compressionLevel?: number;
}

// Events für Profile Service
export type ProfileEvent = 
  | { type: 'PROFILE_UPDATED'; payload: { userId: string; profile: UserProfile } }
  | { type: 'AVATAR_UPLOADED'; payload: { userId: string; avatarUrl: string } }
  | { type: 'PRIVACY_UPDATED'; payload: { userId: string; settings: PrivacySettings } }
  | { type: 'PROFILE_DELETED'; payload: { userId: string; keepAuth: boolean } };

export interface IProfileEventEmitter {
  emit(event: ProfileEvent): void;
  subscribe(eventType: ProfileEvent['type'], callback: (payload: any) => void): () => void;
} 