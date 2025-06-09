/**
 * useProfileRefresh Hook - Refresh & Focus Management  
 * Extracted refresh logic from useProfileScreen for better separation of concerns
 */

import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { PROFILE_CONSTANTS } from '../constants/profile.constants';

export interface UseProfileRefreshParams {
  currentUser: any;
  refreshProfile: () => Promise<void>;
  refreshAvatarAfterUpload: () => Promise<void>;
  preloadAvatar: () => Promise<void>;
  shouldCheckForAvatarUpdate: React.MutableRefObject<boolean>;
  shouldCheckForProfileUpdate: React.MutableRefObject<boolean>;
}

export interface UseProfileRefreshReturn {
  refreshing: boolean;
  hasInitialized: boolean;
  onRefresh: () => Promise<void>;
}

export const useProfileRefresh = ({
  currentUser,
  refreshProfile,
  refreshAvatarAfterUpload,
  preloadAvatar,
  shouldCheckForAvatarUpdate,
  shouldCheckForProfileUpdate,
}: UseProfileRefreshParams): UseProfileRefreshReturn => {
  
  const [refreshing, setRefreshing] = React.useState(false);
  const [hasInitialized, setHasInitialized] = React.useState(false);
  const lastFocusTime = React.useRef<number>(0);

  // Preload avatar when component mounts for smooth UX
  React.useEffect(() => {
    if (currentUser?.id && !hasInitialized) {
      console.log('useProfileRefresh - Preloading avatar for smooth UX');
      preloadAvatar().catch(err => {
        console.warn('useProfileRefresh - Avatar preload failed:', err);
      });
    }
  }, [currentUser?.id, hasInitialized, preloadAvatar]);

  // Smart focus handling - distinguish between tab navigation and screen navigation
  useFocusEffect(
    React.useCallback(() => {
      const now = Date.now();
      const _timeSinceLastFocus = now - lastFocusTime.current;
      
      console.log('🎯 useProfileRefresh - Focus detected:', { 
        hasInitialized, 
        currentUserId: currentUser?.id, 
        shouldCheckForAvatarUpdate: shouldCheckForAvatarUpdate.current,
        shouldCheckForProfileUpdate: shouldCheckForProfileUpdate.current
      });
      
      // Always refresh profile if we have a user and haven't initialized
      if (!hasInitialized && currentUser?.id) {
        console.log('🎯 useProfileRefresh - Initial focus, refreshing profile');
        refreshProfile();
        setHasInitialized(true);
        lastFocusTime.current = now;
      } else if (shouldCheckForProfileUpdate.current) {
        console.log('🎯 useProfileRefresh - Returning from profile edit, refreshing profile data');
        // Reset the flag
        shouldCheckForProfileUpdate.current = false;
        // Force refresh profile after editing
        refreshProfile();
        lastFocusTime.current = now;
      } else if (shouldCheckForAvatarUpdate.current) {
        console.log('🎯 useProfileRefresh - Returning from potential avatar upload, checking for updates');
        // Reset the flag
        shouldCheckForAvatarUpdate.current = false;
        // Force refresh avatar after potential upload
        refreshAvatarAfterUpload();
        lastFocusTime.current = now;
      } else {
        console.log('🎯 useProfileRefresh - Tab navigation detected, NO refresh to prevent issues');
        // For regular tab navigation, we completely skip any refresh
        // Profile and avatar should stay in their current cached state
        lastFocusTime.current = now;
      }
      
      // TODO: Analytics tracking
      // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.SCREEN_VIEW);
    }, [refreshProfile, refreshAvatarAfterUpload, hasInitialized, shouldCheckForAvatarUpdate, shouldCheckForProfileUpdate, currentUser?.id])
  );

  // Pull-to-refresh handler
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    lastFocusTime.current = Date.now(); // Update to prevent duplicate refreshes
    
    try {
      console.log('useProfileRefresh - Pull-to-refresh: Force refreshing profile and avatar');
      
      await Promise.all([
        refreshProfile(),
        refreshAvatarAfterUpload(), // Use force refresh to invalidate cache
      ]);
      
      console.log('useProfileRefresh - Pull-to-refresh completed successfully');
      // TODO: Analytics tracking
      // analytics.track(PROFILE_CONSTANTS.ANALYTICS_EVENTS.PROFILE_REFRESHED);
    } catch (err) {
      console.error('Profile refresh failed:', err);
    } finally {
      // Minimum refresh time for better UX
      setTimeout(() => {
        setRefreshing(false);
      }, PROFILE_CONSTANTS.UI.REFRESH_DEBOUNCE_TIME);
    }
  }, [refreshProfile, refreshAvatarAfterUpload]);

  return {
    refreshing,
    hasInitialized,
    onRefresh,
  };
}; 