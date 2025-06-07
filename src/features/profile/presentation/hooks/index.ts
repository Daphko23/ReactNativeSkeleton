/**
 * Profile Hooks - Barrel Exports
 * Centralized export for all profile-related hooks
 */

// Core Business Logic Hooks
export { useProfile } from './use-profile.hook';
export type { UseProfileReturn } from './use-profile.hook';

// Screen Management Hooks
export { useProfileScreen } from './use-profile-screen.hook';
export type { UseProfileScreenParams, UseProfileScreenReturn } from './use-profile-screen.hook';

// Specialized Hooks (Refactored from useProfileScreen)
export { useProfileNavigation } from './use-profile-navigation.hook';
export type { UseProfileNavigationParams, UseProfileNavigationReturn } from './use-profile-navigation.hook';

export { useProfileRefresh } from './use-profile-refresh.hook';
export type { UseProfileRefreshParams, UseProfileRefreshReturn } from './use-profile-refresh.hook';

// Form Management
export { useProfileForm } from './use-profile-form.hook';

// Avatar Management
export { useAvatar } from './use-avatar.hook';
export { useAvatarUpload } from './use-avatar-upload.hook';

// Integration Hooks
export { useAuthProfileIntegration } from './use-auth-profile-integration.hook'; 