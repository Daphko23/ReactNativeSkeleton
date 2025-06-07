/**
 * useProfileNavigation Hook - Navigation Management
 * Extracted navigation logic from useProfileScreen for better separation of concerns
 */

import React from 'react';


export interface UseProfileNavigationParams {
  navigation: any;
  avatarUrl: string | null;
}

export interface UseProfileNavigationReturn {
  // Navigation Handlers
  navigateToProfileEdit: () => void;
  navigateToAvatarUpload: () => void;
  navigateToAccountSettings: () => void;
  navigateToCustomFieldsEdit: () => void;
  navigateToPrivacySettings: () => void;
  navigateToProfileAvatarDemo: () => void;
  navigateToSkillsManagement: () => void;
  navigateToSocialLinksEdit: () => void;
  
  // Navigation State
  shouldCheckForAvatarUpdate: React.MutableRefObject<boolean>;
}

export const useProfileNavigation = ({ 
  navigation, 
  avatarUrl 
}: UseProfileNavigationParams): UseProfileNavigationReturn => {
  
  // Navigation state to track avatar uploads
  const shouldCheckForAvatarUpdate = React.useRef<boolean>(false);

  // Core Navigation Handlers
  const navigateToProfileEdit = React.useCallback(() => {
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.EDIT_PROFILE_CLICKED);
    navigation.navigate('ProfileEdit');
  }, [navigation]);

  const navigateToAvatarUpload = React.useCallback(() => {
    // Set flag that we're going to avatar upload
    // This will trigger avatar refresh when we return
    shouldCheckForAvatarUpdate.current = true;
    
    console.log('🎯 useProfileNavigation - Navigating to AvatarUpload, will check for updates on return');
    
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.AVATAR_UPLOAD_CLICKED);
    navigation.navigate('AvatarUpload', {
      currentAvatar: avatarUrl,
      // Avatar will be refreshed automatically when returning via useFocusEffect
    });
  }, [navigation, avatarUrl]);

  // Settings Navigation Handlers
  const navigateToAccountSettings = React.useCallback(() => {
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.ACCOUNT_SETTINGS_CLICKED);
    navigation.navigate('AccountSettings');
  }, [navigation]);

  const navigateToCustomFieldsEdit = React.useCallback(() => {
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.CUSTOM_FIELDS_CLICKED);
    navigation.navigate('CustomFieldsEdit');
  }, [navigation]);

  const navigateToPrivacySettings = React.useCallback(() => {
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.PRIVACY_SETTINGS_CLICKED);
    navigation.navigate('PrivacySettings');
  }, [navigation]);

  const navigateToProfileAvatarDemo = React.useCallback(() => {
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.AVATAR_DEMO_CLICKED);
    navigation.navigate('ProfileAvatarDemo');
  }, [navigation]);

  const navigateToSkillsManagement = React.useCallback(() => {
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.SKILLS_MANAGEMENT_CLICKED);
    navigation.navigate('SkillsManagement');
  }, [navigation]);

  const navigateToSocialLinksEdit = React.useCallback(() => {
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.SOCIAL_LINKS_CLICKED);
    navigation.navigate('SocialLinksEdit');
  }, [navigation]);

  return {
    // Navigation Handlers
    navigateToProfileEdit,
    navigateToAvatarUpload,
    navigateToAccountSettings,
    navigateToCustomFieldsEdit,
    navigateToPrivacySettings,
    navigateToProfileAvatarDemo,
    navigateToSkillsManagement,
    navigateToSocialLinksEdit,
    
    // Navigation State
    shouldCheckForAvatarUpdate,
  };
}; 