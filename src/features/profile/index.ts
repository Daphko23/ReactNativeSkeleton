/**
 * Profile Feature - Main Export Index (React Native 2025 Enterprise Standards)
 * Central export point für die Clean Architecture Profile Feature
 */

// === APPLICATION LAYER ===
// ✅ USE CASES - NUR ECHTE BUSINESS LOGIC
export { ValidateProfileDataUseCase } from './application/usecases/validate-profile-data.usecase';
export { CalculateProfileCompletionUseCase } from './application/usecases/calculate-profile-completion.usecase';
export { UpdatePrivacySettingsUseCase } from './application/usecases/update-privacy-settings.usecase';

// ✅ VALIDATION SCHEMAS
export { ProfileValidator } from './application/validation/profile.schemas';

// ✅ DI CONTAINER
export { 
  ProfileContainer, 
  profileContainer, 
  useProfileContainer,
  type ProfileContainerConfig
} from './application/di/profile.container';

// === PRESENTATION LAYER ===
// ✅ TANSTACK QUERY HOOKS (Server State)
export { 
  useProfileQuery, 
  useUpdateProfileMutation,
  useDeleteProfileMutation 
} from './presentation/hooks/use-profile-query.hook';

export { 
  useAvatar 
} from './presentation/hooks/use-avatar.hook';

export { 
  useCustomFieldsQuery,
  useUpdateCustomFieldsMutation 
} from './presentation/hooks/use-custom-fields-query.hook';

// ✅ CLIENT STATE STORE (UI State)
export { useProfileUIStore } from './presentation/store/profile-ui.store';

// ✅ FORM HOOKS
export { useProfileForm } from './presentation/hooks/use-profile-form.hook';

// ✅ COMPONENTS
export * from './presentation/components/avatar-uploader';

// ✅ SCREENS
export { default as ProfileScreen } from './presentation/screens/profile/profile.screen';
export { default as ProfileEditScreen } from './presentation/screens/profile-edit/profile-edit.screen';
export { default as PrivacySettingsScreen } from './presentation/screens/privacy-settings/privacy-settings.screen';
export { default as AccountSettingsScreen } from './presentation/screens/account-settings/account-settings.screen';
export { default as AvatarUploadScreen } from './presentation/screens/avatar-upload/avatar-upload.screen';
export { default as SkillsManagementScreen } from './presentation/screens/skills-management/skills-management.screen';
export { SocialLinksEditScreen } from './presentation/screens/social-links-edit/social-links-edit.screen';
export { default as CustomFieldsEditScreen } from './presentation/screens/custom-fields-edit/custom-fields-edit.screen';

// ✅ NAVIGATION
export * from './presentation/navigation/profile.navigator';

// === DATA LAYER ===
// ✅ SERVICES
export { AvatarService } from './data/services/avatar.service';

// ✅ REPOSITORIES
export { ProfileRepositoryImpl } from './data/repositories/profile.repository.impl';

// === DOMAIN LAYER ===
// ✅ ENTITIES
export * from './domain/entities/user-profile.entity';

// ✅ INTERFACES
// Note: IProfileService interface removed - redundant service layer eliminated

// === FEATURE LIFECYCLE ===
export const ProfileFeature = {
  // Feature metadata
  name: 'Profile',
  version: '3.0.0',
  description: 'Enterprise user profile management mit Clean Architecture + TanStack Query + Client State Store',
  
  // 🎯 NEW ARCHITECTURE
  architecture: {
    pattern: 'Clean Architecture',
    serverState: 'TanStack Query',
    clientState: 'Zustand Store',
    businessLogic: 'Use Cases',
    validation: 'Zod Schemas',
    di: 'Simple Service Registry'
  },
  
  // Feature capabilities
  capabilities: {
    // Core functionality
    profileManagement: true,
    profileValidation: true,
    avatarManagement: true,
    avatarUpload: true,
    privacyControls: true,
    
    // Advanced features
    profileHistory: true,
    dataExport: true,
    customFields: true,
    realTimeSync: true,
    
    // 🎯 NEW 2025 FEATURES
    tanstackQuery: true,
    clientStateStore: true,
    businessLogicUseCases: true,
    zodValidation: true,
    reactNativePerformance: true,
    
    // Integrations
    authIntegration: true,
    i18nSupport: true,
    storageIntegration: true,
    
    // Extensibility
    customValidation: true,
    themeSupport: true,
  },
};