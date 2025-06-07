/**
 * UserProfile Entity - Domain Layer
 * Erweiterbares User Profile Model für das Skeleton Project
 */

export interface UserProfile {
  // Core Identity Fields
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  
  // Contact & Location
  location?: string;
  website?: string;
  phone?: string;
  dateOfBirth?: Date;
  timeZone?: string;
  language?: string;
  currency?: string;
  
  // Preferences
  theme?: 'light' | 'dark' | 'system';
  notifications?: NotificationPreferences;
  accessibility?: AccessibilitySettings;
  privacySettings?: PrivacySettings;
  
  // Social Links (erweiterbar)
  socialLinks?: SocialLinks;
  
  // Professional Info (erweiterbar)
  professional?: ProfessionalInfo;
  
  // Custom Fields (für projektspezifische Erweiterungen)
  customFields?: Record<string, any>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
  profileVersion: number;
  isComplete: boolean;
  isVerified: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  security: boolean;
  mentions: boolean;
  comments: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

export interface SocialLinks {
  linkedIn?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  // Für projektspezifische Erweiterungen
  custom?: Record<string, string>;
}

export interface ProfessionalInfo {
  company?: string;
  jobTitle?: string;
  industry?: string;
  skills?: string[];
  experience?: ExperienceLevel;
  workLocation?: 'remote' | 'onsite' | 'hybrid';
  availableForWork?: boolean;
  // Für projektspezifische Erweiterungen
  custom?: Record<string, any>;
}

export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends' | 'custom';
  emailVisibility: 'public' | 'private' | 'friends';
  phoneVisibility: 'public' | 'private' | 'friends';
  locationVisibility: 'public' | 'private' | 'friends';
  socialLinksVisibility: 'public' | 'private' | 'friends';
  professionalInfoVisibility: 'public' | 'private' | 'friends';
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  allowFriendRequests: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingCommunications: boolean;
  // Field-level privacy (erweiterbar)
  fieldPrivacy?: Record<string, 'public' | 'private' | 'friends'>;
}

export interface ProfileHistoryEntry {
  id: string;
  profileId: string;
  version: number;
  changes: Record<string, { oldValue: any; newValue: any }>;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

export interface ProfileDataExport {
  profile: UserProfile;
  privacySettings: PrivacySettings;
  history: ProfileHistoryEntry[];
  exportedAt: Date;
  format: 'json' | 'csv' | 'xml';
}

export interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}

// Für erweiterte Profile Features
export interface ProfileAnalytics {
  profileViews: number;
  profileViewsToday: number;
  searchAppearances: number;
  connectionRequests: number;
  profileCompleteness: number;
  lastUpdated: Date;
}

export interface CustomFieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean' | 'url' | 'phone' | 'location';
  required: boolean;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    options?: string[];
  };
  privacy: 'public' | 'private' | 'friends';
  order: number;
} 