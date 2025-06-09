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
// import { useAuth } from '@features/auth/presentation/hooks';
import { useAuthStore } from '@features/auth/presentation/store/auth.store';
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
  
  // Direct auth store subscription to avoid race conditions
  const authUser = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // Use auth user directly for better reliability
  const currentUser = React.useMemo(() => authUser, [authUser]);
  
  // Debug current user from auth
  React.useEffect(() => {
    console.log('🔍 useProfileScreen - Auth User Debug:', { 
      currentUser: currentUser?.email || 'null', 
      userId: currentUser?.id || 'null',
      isAuthenticated,
      authUser: authUser?.email || 'null'
    });
  }, [currentUser, isAuthenticated, authUser]);
  
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
    shouldCheckForProfileUpdate,
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
    shouldCheckForProfileUpdate,
  });

  // Computed Values with Performance Optimization
  const currentProfile = React.useMemo(() => {
    const result = profile || profileFromStore;
    console.log('🔍 useProfileScreen - Profile Computation:', { 
      profileFromHook: !!profile, 
      profileFromStore: !!profileFromStore, 
      finalProfile: !!result,
      profileId: result?.id || 'null',
      firstName: result?.firstName || 'null'
    });
    return result;
  }, [profile, profileFromStore]);

  const completeness = React.useMemo(() => {
    const result = calculateCompleteness();
    return result;
  }, [calculateCompleteness]);

  const hasProfile = React.useMemo(() => {
    const result = !!currentProfile;
    console.log('🔍 useProfileScreen - hasProfile Computation:', { 
      currentProfile: !!currentProfile, 
      hasProfile: result,
      profileId: currentProfile?.id || 'null'
    });
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
        currentUserId: currentUser?.id,
        currentUserEmail: currentUser?.email,
      });
    }
  }, [hasProfile, hasInitialized, isLoading, error, hasAvatar, currentProfile?.id, currentUser?.id, currentUser?.email]);

  const screenReturn = {
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

  // Debug final return values
  React.useEffect(() => {
    console.log('🔍 useProfileScreen - Final Return Debug:', {
      hasCurrentProfile: !!screenReturn.currentProfile,
      hasProfile: screenReturn.hasProfile,
      isLoading: screenReturn.isLoading,
      refreshing: screenReturn.refreshing,
      error: !!screenReturn.error,
      currentUserId: screenReturn.currentUser?.id || 'null'
    });
  }, [screenReturn.currentProfile, screenReturn.hasProfile, screenReturn.isLoading, screenReturn.refreshing, screenReturn.error, screenReturn.currentUser?.id]);

  return screenReturn;
}; 