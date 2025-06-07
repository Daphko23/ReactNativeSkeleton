/**
 * useProfileScreen Hook - Business Logic Layer (Refactored)
 * Enterprise custom hook for ProfileScreen state and logic management
 * Now using specialized hooks for better separation of concerns
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

import { useProfile } from './use-profile.hook';
import { useAvatar } from './use-avatar.hook';
import { useProfileNavigation } from './use-profile-navigation.hook';
import { useProfileRefresh } from './use-profile-refresh.hook';
import { useAuth } from '@features/auth/presentation/hooks';
import { useTheme } from '../../../../core/theme/theme.system';
import { useProfileStore } from '../store/profile.store';
import { PROFILE_CONSTANTS } from '../constants/profile.constants';

export interface UseProfileScreenParams {
  navigation: any;
}

export interface UseProfileScreenReturn {
  // Profile Data
  currentProfile: any;
  currentUser: any;
  
  // Avatar Data
  avatarUrl: string | null;
  hasAvatar: boolean;
  shouldShowSkeleton: boolean;
  shouldShowDefaultAvatar: boolean;
  loadingState: 'idle' | 'loading' | 'loaded' | 'error';
  
  // States
  isLoading: boolean;
  refreshing: boolean;
  error: string | null;
  
  // Computed Values
  completeness: number;
  hasProfile: boolean;
  
  // Handlers
  onRefresh: () => Promise<void>;
  navigateToProfileEdit: () => void;
  navigateToAvatarUpload: () => void;
  
  // Navigation Handlers
  navigateToAccountSettings: () => void;
  navigateToCustomFieldsEdit: () => void;
  navigateToPrivacySettings: () => void;
  navigateToProfileAvatarDemo: () => void;
  navigateToSkillsManagement: () => void;
  navigateToSocialLinksEdit: () => void;
  
  // Theme & Translation
  theme: any;
  t: (key: string, options?: any) => string;
  
  // Constants
  testIds: typeof PROFILE_CONSTANTS.TEST_IDS;
  analytics: typeof PROFILE_CONSTANTS.ANALYTICS_EVENTS;
}

export const useProfileScreen = ({ navigation }: UseProfileScreenParams): UseProfileScreenReturn => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  
  // Profile State Management
  const profileFromStore = useProfileStore(state => state.profile);
  const storeError = useProfileStore(state => state.error);
  
  // Core Profile Business Logic
  const {
    profile,
    isLoading,
    refreshProfile,
    calculateCompleteness,
  } = useProfile();

  // Avatar Management
  const {
    avatarUrl,
    hasAvatar,
    shouldShowSkeleton,
    shouldShowDefaultAvatar,
    loadingState,
    refreshAvatarAfterUpload,
    preloadAvatar,
  } = useAvatar();

  // Navigation Management (Specialized Hook)
  const {
    navigateToProfileEdit,
    navigateToAvatarUpload,
    navigateToAccountSettings,
    navigateToCustomFieldsEdit,
    navigateToPrivacySettings,
    navigateToProfileAvatarDemo,
    navigateToSkillsManagement,
    navigateToSocialLinksEdit,
    shouldCheckForAvatarUpdate,
  } = useProfileNavigation({
    navigation,
    avatarUrl,
  });

  // Refresh & Focus Management (Specialized Hook)
  const {
    refreshing,
    hasInitialized,
    onRefresh,
  } = useProfileRefresh({
    currentUser,
    refreshProfile,
    refreshAvatarAfterUpload,
    preloadAvatar,
    shouldCheckForAvatarUpdate,
  });

  // Computed Values with Performance Optimization
  const currentProfile = React.useMemo(() => {
    const result = profile || profileFromStore;
    return result;
  }, [profile, profileFromStore]);

  const completeness = React.useMemo(() => {
    const result = calculateCompleteness();
    return result;
  }, [calculateCompleteness]);

  const hasProfile = React.useMemo(() => {
    const result = !!currentProfile;
    return result;
  }, [currentProfile]);

  const error = React.useMemo(() => {
    const result = storeError;
    return result;
  }, [storeError]);

  // Development Debug Logging
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('useProfileScreen State Update:', {
        hasProfile,
        hasInitialized,
        isLoading,
        error: !!error,
        hasAvatar,
        profileId: currentProfile?.id,
      });
    }
  }, [hasProfile, hasInitialized, isLoading, error, hasAvatar, currentProfile?.id]);

  return {
    // Profile Data
    currentProfile,
    currentUser,
    
    // Avatar Data
    avatarUrl,
    hasAvatar,
    shouldShowSkeleton,
    shouldShowDefaultAvatar,
    loadingState,
    
    // States
    isLoading,
    refreshing,
    error,
    
    // Computed Values
    completeness,
    hasProfile,
    
    // Handlers
    onRefresh,
    navigateToProfileEdit,
    navigateToAvatarUpload,
    
    // Navigation Handlers (from specialized hook)
    navigateToAccountSettings,
    navigateToCustomFieldsEdit,
    navigateToPrivacySettings,
    navigateToProfileAvatarDemo,
    navigateToSkillsManagement,
    navigateToSocialLinksEdit,
    
    // Theme & Translation
    theme,
    t,
    
    // Constants
    testIds: PROFILE_CONSTANTS.TEST_IDS,
    analytics: PROFILE_CONSTANTS.ANALYTICS_EVENTS,
  };
}; 