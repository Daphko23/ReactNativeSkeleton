/**
 * Profile Feature - Main Export Index
 * Central export point for the Profile feature
 */

// === APPLICATION LAYER ===
// Use Cases - Profile Management
export { GetUserProfileUseCase } from './application/usecases/get-user-profile.usecase';
export { UpdateUserProfileUseCase } from './application/usecases/update-user-profile.usecase';
export { DeleteUserProfileUseCase } from './application/usecases/delete-user-profile.usecase';
export { CalculateProfileCompletionUseCase } from './application/usecases/calculate-profile-completion.usecase';
export { UpdatePrivacySettingsUseCase } from './application/usecases/update-privacy-settings.usecase';

// Use Cases - Avatar Management
export { UploadAvatarUseCase } from './application/usecases/upload-avatar.usecase';
export { DeleteAvatarUseCase } from './application/usecases/delete-avatar.usecase';
export { GetAvatarUrlUseCase } from './application/usecases/get-avatar-url.usecase';

// Application Interfaces
export type { 
  ProfileUpdateData, 
  ProfileValidationResult 
} from './domain/interfaces/profile-update-data.interface';
export type { 
  AvatarBusinessRules, 
  AvatarUrlOptions 
} from './domain/interfaces/avatar-business-rules.interface';
export type { ProfileCompletionResult } from './application/usecases/calculate-profile-completion.usecase';

// === PRESENTATION LAYER ===
// Hooks
export * from './presentation/hooks/use-profile.hook';
export * from './presentation/hooks/use-profile-form.hook';
export * from './presentation/hooks/use-avatar.hook';

// Components
export * from './presentation/components/avatar-uploader';

// Screens
export { default as ProfileScreen } from './presentation/screens/profile';
export * from './presentation/screens/profile-edit';
export { default as ProfileAvatarDemoScreen } from './presentation/screens/profile-avatar-demo/profile-avatar-demo.screen';
export { default as ProfileComplianceDemoScreen } from './presentation/screens/profile-compliance-demo/profile-compliance-demo.screen';

// Navigation
export * from './presentation/navigation/profile.navigator';
export * from './presentation/navigation/avatar-demo.navigator';

// === DATA LAYER ===
// Services
export * from './data/services/avatar.service';

// === DOMAIN LAYER ===
// Entities
export * from './domain/entities/user-profile.entity';

// Interfaces
export * from './domain/interfaces/profile-service.interface';

// === FEATURE LIFECYCLE ===
export const ProfileFeature = {
  // Feature metadata
  name: 'Profile',
  version: '2.0.0', // Updated version for refactored Use Cases
  description: 'Enterprise user profile management with Clean Architecture, modular Use Cases and Avatar Upload',
  
  // Feature capabilities
  capabilities: {
    // Core functionality
    profileManagement: true,
    profileValidation: true,
    avatarManagement: true,
    avatarUpload: true,
    avatarProcessing: true,
    privacyControls: true,
    
    // Advanced features
    profileHistory: true,
    dataExport: true,
    customFields: true,
    realTimeSync: true,
    
    // Avatar features
    multipleAvatarFormats: true,
    avatarThumbnails: true,
    avatarFallbacks: true,
    
    // New modular architecture
    modularUseCases: true, // New
    interfaceSeparation: true, // New
    functionalNaming: true, // New
    
    // Integrations
    rbacIntegration: true,
    authIntegration: true,
    i18nSupport: true,
    storageIntegration: true,
    
    // Extensibility
    customValidation: true,
    pluginSupport: true,
    themeSupport: true,
  },
  
  // Extension points for customization
  extensionPoints: {
    // Custom field definitions
    customFields: [] as any[],
    
    // Custom validation rules
    customValidators: [] as any[],
    
    // Custom UI components
    customComponents: {} as Record<string, React.ComponentType<any>>,
    
    // Custom permissions
    customPermissions: [] as string[],
    
    // Custom actions
    customActions: {} as Record<string, (...args: any[]) => any>,
    
    // Avatar customization
    avatarProviders: [] as any[],
    avatarProcessors: [] as any[],
    
    // Use Case customization - New
    customUseCases: {} as Record<string, any>,
  },
};

// Configuration interface
export interface ProfileFeatureConfig {
  // Service configuration
  service?: {
    enableMockData?: boolean;
    cacheTimeout?: number;
    enableRealTimeSync?: boolean;
  };
  
  // UI configuration
  ui?: {
    theme?: 'light' | 'dark' | 'auto';
    enableCustomFields?: boolean;
    enableAvatarUpload?: boolean;
    enableSocialLinks?: boolean;
    avatarSize?: number;
    showUploadProgress?: boolean;
  };
  
  // Avatar configuration
  avatar?: {
    maxFileSize?: number;
    allowedTypes?: string[];
    enableThumbnails?: boolean;
    enableMultipleFormats?: boolean;
    compressionQuality?: number;
    enableInitialsFallback?: boolean;
  };
  
  // Validation configuration
  validation?: {
    strictMode?: boolean;
    customRules?: Array<{
      field: string;
      rule: (value: any) => boolean | string;
    }>;
  };
  
  // Privacy configuration
  privacy?: {
    defaultVisibility?: 'public' | 'private' | 'friends';
    allowDataExport?: boolean;
    enableProfileHistory?: boolean;
    avatarPrivacy?: 'public' | 'private';
  };
  
  // Integration configuration
  integrations?: {
    auth?: {
      enabled?: boolean;
      permissions?: string[];
    };
    storage?: {
      enabled?: boolean;
      provider?: 'supabase' | 'aws' | 'firebase';
      bucket?: string;
    };
    analytics?: {
      enabled?: boolean;
      trackProfileViews?: boolean;
      trackProfileUpdates?: boolean;
      trackAvatarUploads?: boolean;
    };
  };
}

// Default configuration
export const defaultProfileConfig: ProfileFeatureConfig = {
  service: {
    enableMockData: true,
    cacheTimeout: 300000, // 5 minutes
    enableRealTimeSync: false,
  },
  ui: {
    theme: 'auto',
    enableCustomFields: true,
    enableAvatarUpload: true,
    enableSocialLinks: true,
    avatarSize: 100,
    showUploadProgress: true,
  },
  avatar: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    enableThumbnails: true,
    enableMultipleFormats: false,
    compressionQuality: 0.8,
    enableInitialsFallback: true,
  },
  validation: {
    strictMode: false,
    customRules: [],
  },
  privacy: {
    defaultVisibility: 'private',
    allowDataExport: true,
    enableProfileHistory: true,
    avatarPrivacy: 'public',
  },
  integrations: {
    auth: {
      enabled: true,
      permissions: [
        'PROFILE_READ',
        'PROFILE_UPDATE',
        'PROFILE_DELETE',
        'PROFILE_UPDATE_SENSITIVE',
        'AVATAR_UPLOAD',
        'AVATAR_DELETE',
      ],
    },
    storage: {
      enabled: true,
      provider: 'supabase',
      bucket: 'avatars',
    },
    analytics: {
      enabled: false,
      trackProfileViews: false,
      trackProfileUpdates: false,
      trackAvatarUploads: false,
    },
  },
};

// Utility exports
export const ProfileUtils = {
  // Profile validation helpers
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  validatePhone: (phone: string): boolean => {
    const phonePattern = /^[+]?[\d\s()-]+$/;
    return phonePattern.test(phone);
  },
  
  validateUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  // Avatar validation helpers
  validateAvatarSize: (size: number, maxSize: number = 5 * 1024 * 1024): boolean => {
    return size <= maxSize;
  },
  
  validateAvatarType: (type: string, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']): boolean => {
    return allowedTypes.includes(type);
  },
  
  // Profile data helpers
  getDisplayName: (profile: { firstName?: string; lastName?: string; displayName?: string }): string => {
    if (profile.displayName) return profile.displayName;
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    if (profile.firstName) return profile.firstName;
    return 'Anonymous User';
  },
  
  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },
  
  // Avatar helpers
  generateAvatarPath: (userId: string, timestamp?: number): string => {
    const ts = timestamp || Date.now();
    return `${userId}/avatar_${ts}`;
  },
  
  getAvatarThumbnailPath: (originalPath: string): string => {
    const pathParts = originalPath.split('.');
    const extension = pathParts.pop();
    const basePath = pathParts.join('.');
    return `${basePath}_thumb.${extension}`;
  },
  
  // Privacy helpers
  isFieldVisible: (field: string, privacySettings: any, viewerPermissions: string[]): boolean => {
    // Implementation would depend on privacy rules
    // This is a simplified example
    if (privacySettings?.visibility === 'public') return true;
    if (privacySettings?.visibility === 'private') {
      return viewerPermissions.includes('PROFILE_READ_ALL');
    }
    return false;
  },
  
  // Data export helpers
  exportProfileData: (profile: any): string => {
    return JSON.stringify(profile, null, 2);
  },
  
  // Sanitization helpers
  sanitizeProfileData: (profile: any, includePrivate: boolean = false): any => {
    const sanitized = { ...profile };
    
    if (!includePrivate) {
      delete sanitized.phone;
      delete sanitized.alternativeEmail;
      delete sanitized.customFields;
    }
    
    return sanitized;
  },
};

// === DEPENDENCY INJECTION ===
export * from './application/di/profile.container'; 