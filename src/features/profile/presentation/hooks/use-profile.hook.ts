/**
 * useProfile - Profile Management Hook
 * Enhanced with error handling and loading states
 */

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../../domain/entities/user-profile.entity';
import { profileContainer } from '../../application/di/profile.container';
import { useErrorHandler } from '@shared/hooks/use-error-handler';
import { useLoadingState } from '@shared/hooks/use-loading-state';
import { useAuth } from '@features/auth/presentation/hooks';

export interface UseProfileReturn {
  // Profile state
  profile: UserProfile | null;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  isRefreshing: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  calculateCompleteness: () => number;
  
  // Privacy settings
  updatePrivacySettings: (settings: any) => Promise<boolean>;
  
  // Avatar management
  uploadAvatar: (imageUri: string) => Promise<boolean>;
  deleteAvatar: () => Promise<boolean>;
}

export const useProfile = (): UseProfileReturn => {
  const { user } = useAuth();
  const { showError, handleAsyncError } = useErrorHandler();
  const { isLoading, withLoading } = useLoadingState();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get profile service instance
  const profileService = profileContainer.profileService;

  // Initial profile load
  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;

    const result = await handleAsyncError(
      () => withLoading('loadProfile', () => profileService.getProfile(user.id)),
      'profile'
    );

    if (result) {
      setProfile(result);
      setError(null);
    }
  }, [user?.id, profileService, handleAsyncError, withLoading]);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;

    const result = await handleAsyncError(
      () => withLoading('refreshProfile', () => profileService.syncProfile(user.id)),
      'profile'
    );

    if (result) {
      setProfile(result);
      setError(null);
    }
  }, [user?.id, profileService, handleAsyncError, withLoading]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user?.id) {
      showError('User not authenticated', 'auth');
      return false;
    }

    const result = await handleAsyncError(
      () => withLoading('updateProfile', () => profileService.updateProfile(user.id, updates)),
      'profile'
    );

    if (result) {
      setProfile(result);
      setError(null);
      return true;
    }
    return false;
  }, [user?.id, profileService, handleAsyncError, withLoading, showError]);

  const calculateCompleteness = useCallback((): number => {
    if (!profile) return 0;
    return profileService.calculateCompleteness(profile);
  }, [profile, profileService]);

  const updatePrivacySettings = useCallback(async (settings: any): Promise<boolean> => {
    if (!user?.id) {
      showError('User not authenticated', 'auth');
      return false;
    }

    const result = await handleAsyncError(
      () => withLoading('updatePrivacy', () => profileService.updatePrivacySettings(user.id, settings)),
      'profile'
    );

    if (result) {
      // Refresh profile to get updated privacy settings
      await refreshProfile();
      return true;
    }
    return false;
  }, [user?.id, profileService, handleAsyncError, withLoading, showError, refreshProfile]);

  const uploadAvatar = useCallback(async (imageUri: string): Promise<boolean> => {
    if (!user?.id) {
      showError('User not authenticated', 'auth');
      return false;
    }

    const result = await handleAsyncError(
      () => withLoading('uploadAvatar', () => profileService.uploadAvatar(user.id, imageUri)),
      'profile'
    );

    if (result) {
      // Refresh profile to get updated avatar
      await refreshProfile();
      return true;
    }
    return false;
  }, [user?.id, profileService, handleAsyncError, withLoading, showError, refreshProfile]);

  const deleteAvatar = useCallback(async (): Promise<boolean> => {
    if (!user?.id) {
      showError('User not authenticated', 'auth');
      return false;
    }

    const result = await handleAsyncError(
      () => withLoading('deleteAvatar', () => profileService.deleteAvatar(user.id)),
      'profile'
    );

    if (result !== null) {
      // Refresh profile to get updated avatar
      await refreshProfile();
      return true;
    }
    return false;
  }, [user?.id, profileService, handleAsyncError, withLoading, showError, refreshProfile]);

  return {
    // Profile state
    profile,
    
    // Loading states
    isLoading: isLoading('loadProfile'),
    isUpdating: isLoading('updateProfile'),
    isRefreshing: isLoading('refreshProfile'),
    
    // Error state
    error,
    
    // Actions
    refreshProfile,
    updateProfile,
    calculateCompleteness,
    
    // Privacy settings
    updatePrivacySettings,
    
    // Avatar management
    uploadAvatar,
    deleteAvatar,
  };
}; 