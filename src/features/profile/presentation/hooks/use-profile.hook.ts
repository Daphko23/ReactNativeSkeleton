/**
 * useProfile - Profile Management Hook
 * Enhanced with error handling, loading states, and observability
 */

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../../domain/entities/user-profile.entity';
import { profileContainer } from '../../application/di/profile.container';
import { useErrorHandler } from '@shared/hooks/use-error-handler';
import { useLoadingState } from '@shared/hooks/use-loading-state';
// import { useAuth } from '@features/auth/presentation/hooks';
import { useAuthStore } from '@features/auth/presentation/store/auth.store';
import { profileObservability } from '@core/monitoring/profile-observability.service';
import { gdprAuditService } from '../../data/services/gdpr-audit.service';

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
  // Direct auth store subscription to avoid race conditions
  const user = useAuthStore(state => state.user);
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

    // Start observability tracking
    const correlationId = profileObservability.startProfileOperation('load', user.id);

    try {
      const result = await handleAsyncError(
        () => withLoading('loadProfile', () => profileService.getProfile(user.id)),
        'profile'
      );

      if (result) {
        setProfile(result);
        setError(null);
        
        // Record successful operation
        profileObservability.endProfileOperation(correlationId, 'success', undefined, result);
        
        // Record metrics
        profileObservability.recordProfileMetrics(user.id, {
          profileLoadTime: Date.now() - performance.now(),
          profileCompletionRate: profileService.calculateCompleteness(result)
        });

        // GDPR Audit Logging - Data Access
        await gdprAuditService.logDataAccess(
          user.id,
          ['firstName', 'lastName', 'email', 'bio', 'avatar'],
          'read',
          user.id,
          { correlationId }
        );
      } else {
        profileObservability.endProfileOperation(correlationId, 'error', new Error('Profile not found'));
      }
    } catch (error) {
      profileObservability.endProfileOperation(correlationId, 'error', error as Error);
      setError('Failed to load profile');
    }
  }, [user?.id, profileService, handleAsyncError, withLoading]);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      const result = await handleAsyncError(
        () => withLoading('refreshProfile', () => profileService.syncProfile(user.id)),
        'profile'
      );

      if (result) {
        setProfile(result);
        setError(null);
      }
    } catch {
      // Silent error handling for refresh
    }
  }, [user?.id, profileService, handleAsyncError, withLoading]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user?.id) {
      showError('User not authenticated', 'auth');
      return false;
    }

    // Start observability tracking
    const correlationId = profileObservability.startProfileOperation('update', user.id, {
      fieldsUpdated: Object.keys(updates)
    });

    try {
      const result = await handleAsyncError(
        () => withLoading('updateProfile', () => profileService.updateProfile(user.id, updates)),
        'profile'
      );

      if (result) {
        const previousProfile = profile; // Store for GDPR logging
        setProfile(result);
        setError(null);
        
        // Record successful operation
        profileObservability.endProfileOperation(correlationId, 'success', undefined, result);
        
        // Record metrics
        profileObservability.recordProfileMetrics(user.id, {
          profileUpdateTime: Date.now() - performance.now(),
          profileCompletionRate: profileService.calculateCompleteness(result)
        });

        // GDPR Audit Logging - Data Update
        if (previousProfile) {
          await gdprAuditService.logDataUpdate(
            user.id,
            Object.keys(updates),
            'profile_update',
            user.id,
            { 
              correlationId,
              previousProfile,
              updatedProfile: result
            }
          );
        }
        
        return true;
      }
      
      profileObservability.endProfileOperation(correlationId, 'error', new Error('Update failed'));
      return false;
    } catch (error) {
      profileObservability.endProfileOperation(correlationId, 'error', error as Error);
      return false;
    }
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

    // Start observability tracking
    const correlationId = profileObservability.startProfileOperation('privacy_update', user.id, {
      settingsUpdated: Object.keys(settings)
    });

    try {
      const previousProfile = profile; // Store for GDPR logging
      
      const result = await handleAsyncError(
        () => withLoading('updatePrivacy', () => profileService.updatePrivacySettings(user.id, settings)),
        'profile'
      );

      if (result) {
        // Record successful operation
        profileObservability.endProfileOperation(correlationId, 'success', undefined, result);
        
        // 🔒 GDPR Audit Logging - Privacy Settings Update
        if (previousProfile?.privacySettings) {
          await gdprAuditService.logPrivacySettingsUpdate(
            user.id,
            Object.keys(settings),
            previousProfile.privacySettings,
            result,
            user.id,
            { correlationId }
          );
        }
        
        // Refresh profile to get updated privacy settings
        await refreshProfile();
        return true;
      }
      
      profileObservability.endProfileOperation(correlationId, 'error', new Error('Privacy update failed'));
      return false;
    } catch {
      profileObservability.endProfileOperation(correlationId, 'error', new Error('Privacy update error'));
      return false;
    }
  }, [user?.id, profile, profileService, handleAsyncError, withLoading, showError, refreshProfile]);

  const uploadAvatar = useCallback(async (imageUri: string): Promise<boolean> => {
    if (!user?.id) {
      showError('User not authenticated', 'auth');
      return false;
    }

    // Start observability tracking
    const correlationId = profileObservability.startProfileOperation('avatar_upload', user.id, {
      imageUri: imageUri.substring(0, 50) + '...' // Log truncated URI for privacy
    });

    try {
      const previousProfile = profile; // Store for GDPR logging
      
      const result = await handleAsyncError(
        () => withLoading('uploadAvatar', () => profileService.uploadAvatar(user.id, imageUri)),
        'profile'
      );

      if (result) {
        // Record successful operation
        profileObservability.endProfileOperation(correlationId, 'success', undefined, result);
        
        // 🔒 GDPR Audit Logging - Avatar Upload (Data Update)
        if (previousProfile) {
          const updatedProfile = { ...previousProfile, avatar: result };
          await gdprAuditService.logDataUpdate(
            user.id,
            ['avatar'],
            'avatar_upload',
            user.id,
            { 
              correlationId,
              previousProfile,
              updatedProfile
            }
          );
        }
        
        // Refresh profile to get updated avatar
        await refreshProfile();
        return true;
      }
      
      profileObservability.endProfileOperation(correlationId, 'error', new Error('Avatar upload failed'));
      return false;
    } catch {
      profileObservability.endProfileOperation(correlationId, 'error', new Error('Avatar upload error'));
      return false;
    }
  }, [user?.id, profile, profileService, handleAsyncError, withLoading, showError, refreshProfile]);

  const deleteAvatar = useCallback(async (): Promise<boolean> => {
    if (!user?.id) {
      showError('User not authenticated', 'auth');
      return false;
    }

    // Start observability tracking
    const correlationId = profileObservability.startProfileOperation('delete', user.id, {
      operation: 'avatar_delete'
    });

    try {
      const previousProfile = profile; // Store for GDPR logging
      
      const result = await handleAsyncError(
        () => withLoading('deleteAvatar', () => profileService.deleteAvatar(user.id)),
        'profile'
      );

      if (result !== null) {
        // Record successful operation
        profileObservability.endProfileOperation(correlationId, 'success');
        
        // 🔒 GDPR Audit Logging - Avatar Deletion (Data Delete)
        if (previousProfile?.avatar) {
          await gdprAuditService.logDataDeletion(
            user.id,
            ['avatar'],
            'user_request',
            user.id,
            { 
              correlationId,
              deletedAvatar: previousProfile.avatar
            }
          );
        }
        
        // Refresh profile to get updated avatar
        await refreshProfile();
        return true;
      }
      
      profileObservability.endProfileOperation(correlationId, 'error', new Error('Avatar delete failed'));
      return false;
    } catch (error) {
      profileObservability.endProfileOperation(correlationId, 'error', error as Error);
      return false;
    }
  }, [user?.id, profile, profileService, handleAsyncError, withLoading, showError, refreshProfile]);

  const hookReturn = {
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

  return hookReturn;
}; 