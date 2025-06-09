/**
 * useProfileNavigation Hook - Navigation Management
 * Extracted navigation logic from useProfileScreen for better separation of concerns
 */

import React from 'react';
// import { PROFILE_CONSTANTS } from '../constants/profile.constants';

export interface UseProfileNavigationParams {
  navigation: any;
  avatarUrl?: string | null;
}

export interface UseProfileNavigationReturn {
  // Core Navigation Handlers
  navigateToProfileEdit: () => void;
  navigateToAvatarUpload: () => void;
  
  // Settings Navigation Handlers
  navigateToAccountSettings: () => void;
  navigateToCustomFieldsEdit: () => void;
  navigateToPrivacySettings: () => void;
  navigateToProfileAvatarDemo: () => void;
  navigateToSkillsManagement: () => void;
  navigateToSocialLinksEdit: () => void;
  
  // Navigation state tracking
  shouldCheckForAvatarUpdate: React.MutableRefObject<boolean>;
  shouldCheckForProfileUpdate: React.MutableRefObject<boolean>;
}

export const useProfileNavigation = ({ 
  navigation, 
  avatarUrl 
}: UseProfileNavigationParams): UseProfileNavigationReturn => {
  
  // Navigation state to track updates
  const shouldCheckForAvatarUpdate = React.useRef<boolean>(false);
  const shouldCheckForProfileUpdate = React.useRef<boolean>(false);

  // Core Navigation Handlers
  const navigateToProfileEdit = React.useCallback(() => {
    // Set flag that we're going to profile edit
    // This will trigger profile refresh when we return
    shouldCheckForProfileUpdate.current = true;
    
    console.log('🎯 useProfileNavigation - Navigating to ProfileEdit, will check for updates on return');
    
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
    // Set flag for potential profile updates
    shouldCheckForProfileUpdate.current = true;
    
    console.log('🎯 useProfileNavigation - Navigating to CustomFieldsEdit, will check for updates on return');
    
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.CUSTOM_FIELDS_CLICKED);
    navigation.navigate('CustomFieldsEdit');
  }, [navigation]);

  const navigateToPrivacySettings = React.useCallback(() => {
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.PRIVACY_SETTINGS_CLICKED);
    navigation.navigate('PrivacySettings');
  }, [navigation]);

  const navigateToSkillsManagement = React.useCallback(() => {
    // Set flag for potential profile updates (skills are part of profile)
    shouldCheckForProfileUpdate.current = true;
    
    console.log('🎯 useProfileNavigation - Navigating to SkillsManagement, will check for updates on return');
    
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.SKILLS_MANAGEMENT_CLICKED);
    navigation.navigate('SkillsManagement');
  }, [navigation]);

  const navigateToSocialLinksEdit = React.useCallback(() => {
    // Set flag for potential profile updates (social links are part of profile)
    shouldCheckForProfileUpdate.current = true;
    
    console.log('🎯 useProfileNavigation - Navigating to SocialLinksEdit, will check for updates on return');
    
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.SOCIAL_LINKS_CLICKED);
    navigation.navigate('SocialLinksEdit');
  }, [navigation]);

  const navigateToProfileAvatarDemo = React.useCallback(() => {
    // TODO: Analytics tracking
    // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.AVATAR_DEMO_CLICKED);
    navigation.navigate('ProfileAvatarDemo');
  }, [navigation]);

  return {
    // Core Navigation Handlers
    navigateToProfileEdit,
    navigateToAvatarUpload,
    
    // Settings Navigation Handlers
    navigateToAccountSettings,
    navigateToCustomFieldsEdit,
    navigateToPrivacySettings,
    navigateToProfileAvatarDemo,
    navigateToSkillsManagement,
    navigateToSocialLinksEdit,
    
    // Navigation state tracking
    shouldCheckForAvatarUpdate,
    shouldCheckForProfileUpdate,
  };
}; 