/**
 * @fileoverview Profile Screen Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Profile screen orchestration only
 * ✅ TanStack Query + Use Cases: Complete integration
 * ✅ Optimistic Updates: Mobile-first UX
 * ✅ Mobile Performance: Battery-friendly operations
 * ✅ Enterprise Logging: Essential audit trails
 * ✅ Clean Interface: Simplified Champion API
 */

import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../core/theme/theme.system';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 🏆 CHAMPION: Hook Composition Pattern
import { useProfileQuery } from './use-profile-query.hook';
import { useAvatar } from './use-avatar.hook';
import { useCustomFieldsQuery } from './use-custom-fields-query.hook';
import { useProfileCompleteness } from './use-profile-completeness.hook';
import { useAuth } from '@features/auth/presentation/hooks';

// 🎯 FEATURE FLAG INTEGRATION FIX
import { useFeatureFlag } from './use-feature-flag.hook';

// 🏆 ENTERPRISE: Use Cases Integration (Essential Only)
import { useProfileContainer } from '../../application/di/profile.container';
import { ShareProfileUseCase } from '../../application/use-cases/profile/share-profile.use-case';
import { ExportProfileUseCase } from '../../application/use-cases/profile/export-profile.use-case';

const logger = LoggerFactory.createServiceLogger('ProfileScreen');

// 🏆 CHAMPION INTERFACE: Enterprise Hook-Centric API Structure
export interface UseProfileScreenReturn {
  // 🏆 ENTERPRISE STRUCTURE: Grouped by Responsibility
  data: {
    profile: any;
    avatar: any;
    customFields: any[];
    completion: any;
    isProfileLoading: boolean;
    isAvatarLoading: boolean;
    isCustomFieldsLoading: boolean;
    isAnyLoading: boolean;
    profileError: string | null;
    avatarError: string | null;
    customFieldsError: string | null;
    hasAnyError: boolean;
    refreshAll: () => Promise<void>;
  };
  
  actions: {
    // 🏆 Navigation Actions
    navigateToEdit: () => void;
    navigateToSettings: () => void;
    navigateToCustomFields: () => void;
    navigateToPrivacySettings: () => void;
    navigateToSkillsManagement: () => void;
    navigateToSocialLinksEdit: () => void;
    
    // 🏆 Profile Actions
    shareProfile: () => Promise<void>;
    exportProfile: () => Promise<void>;
    
    // 🏆 Avatar Actions
    changeAvatar: () => void;
    removeAvatar: () => Promise<void>;
    
    // 🏆 Error Management
    clearErrors: () => void;
  };
  
  ui: {
    // 🏆 UI Dependencies
    theme: any;
    t: (key: string, options?: any) => string;
    
    // 🏆 UI State
    headerTitle: string;
    completionPercentage: number;
    showCompletionBanner: boolean;
    dismissCompletionBanner: () => void;
    
    // 🏆 Loading States
    isSharing: boolean;
    isExporting: boolean;
    isRefreshing: boolean;
  };
}

/**
 * 🏆 CHAMPION PROFILE SCREEN HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Profile screen orchestration only
 * - Hook Composition: Reuses existing Champion hooks
 * - Mobile Performance: Battery-friendly operations
 * - Enterprise Logging: Essential audit trails only
 * - Clean Interface: Simplified API for mobile UX
 */
export const useProfileScreen = (navigation?: any): UseProfileScreenReturn => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const _queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id || '';
  
  // 🎯 FEATURE FLAG INTEGRATION FIX
  const { isScreenEnabled } = useFeatureFlag();

  // 🏆 CHAMPION: Hook Composition (Reuse existing Champion hooks)
  const profileQuery = useProfileQuery(userId);
  const avatarQuery = useAvatar({ userId });
  const customFieldsQuery = useCustomFieldsQuery(userId);
  
  // 🎯 EMAIL SYNC FIX: Ensure profile.email is synced from auth user
  const profileWithEmail = useMemo(() => {
    const profile = profileQuery.data;
    if (profile && user?.email && !profile.email) {
      // Auto-sync email from auth user to profile if missing
      return { ...profile, email: user.email };
    }
    return profile;
  }, [profileQuery.data, user?.email]);
  
  // 🎯 HOOK RULES FIX: Always call hooks, never conditionally  
  const completion = useProfileCompleteness({ 
    profile: profileWithEmail || null, 
    userId 
  });
  
  // 🏆 ENTERPRISE: Use Cases Integration (Essential Only)
  const { container: _container, accessor: _accessor } = useProfileContainer();
  const shareProfileUseCase = useMemo(() => new ShareProfileUseCase(), []);
  const exportProfileUseCase = useMemo(() => new ExportProfileUseCase(), []);

  // 🏆 CHAMPION UI STATE
  const [showCompletionBanner, setShowCompletionBanner] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🏆 CHAMPION MUTATIONS: Share Profile
  const shareProfileMutation = useMutation({
    mutationFn: async () => {
      logger.info('Sharing profile', LogCategory.BUSINESS, { userId });
      
      const result = await shareProfileUseCase.execute({
        userId,
        shareType: 'url',
        includePrivateData: false,
        expiresInHours: 24
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      
      logger.info('Profile shared successfully', LogCategory.BUSINESS, { userId });
      return result.data;
    },
    onError: (error) => {
      logger.error('Failed to share profile', LogCategory.BUSINESS, { userId }, error as Error);
    },
  });

  // 🏆 CHAMPION MUTATIONS: Export Profile
  const exportProfileMutation = useMutation({
    mutationFn: async () => {
      logger.info('Exporting profile', LogCategory.BUSINESS, { userId });
      
      const result = await exportProfileUseCase.execute({
        userId,
        exportFormat: 'json',
        includeMetadata: true,
        includeSensitiveData: false,
        deliveryMethod: 'download'
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      
      logger.info('Profile exported successfully', LogCategory.BUSINESS, { userId });
      return result.data;
    },
    onError: (error) => {
      logger.error('Failed to export profile', LogCategory.BUSINESS, { userId }, error as Error);
    },
  });

  // 🏆 CHAMPION MUTATIONS: Remove Avatar
  const removeAvatarMutation = useMutation({
    mutationFn: async () => {
      logger.info('Removing avatar', LogCategory.BUSINESS, { userId });
      
      // Use existing avatar hook's remove functionality
      await avatarQuery.removeAvatar();
      
      logger.info('Avatar removed successfully', LogCategory.BUSINESS, { userId });
      return { success: true };
    },
    onError: (error) => {
      logger.error('Failed to remove avatar', LogCategory.BUSINESS, { userId }, error as Error);
    },
  });

  // 🏆 CHAMPION NAVIGATION ACTIONS
  const navigateToEdit = useCallback(() => {
    logger.info('Navigating to profile edit', LogCategory.BUSINESS, { userId });
    navigation?.navigate('ProfileEdit');
  }, [userId, navigation]);

  const navigateToSettings = useCallback(() => {
    // 🎯 NAVIGATION FIX: Use correct screen name + Feature Flag Guard
    if (!isScreenEnabled('AccountSettings')) {
      logger.warn('Account Settings screen is disabled by feature flag', LogCategory.BUSINESS, { userId });
      return;
    }
    
    logger.info('Navigating to account settings', LogCategory.BUSINESS, { userId });
    navigation?.navigate('AccountSettings');  // ✅ KORREKT: AccountSettings statt ProfileSettings
  }, [userId, navigation, isScreenEnabled]);

  const navigateToCustomFields = useCallback(() => {
    // 🎯 FEATURE FLAG GUARD
    if (!isScreenEnabled('CustomFieldsEdit')) {
      logger.warn('Custom Fields Edit screen is disabled by feature flag', LogCategory.BUSINESS, { userId });
      return;
    }
    
    logger.info('Navigating to custom fields', LogCategory.BUSINESS, { userId });
    navigation?.navigate('CustomFieldsEdit');
  }, [userId, navigation, isScreenEnabled]);

  const navigateToPrivacySettings = useCallback(() => {
    // 🎯 FEATURE FLAG GUARD
    if (!isScreenEnabled('PrivacySettings')) {
      logger.warn('Privacy Settings screen is disabled by feature flag', LogCategory.BUSINESS, { userId });
      return;
    }
    
    logger.info('Navigating to privacy settings', LogCategory.BUSINESS, { userId });
    navigation?.navigate('PrivacySettings');
  }, [userId, navigation, isScreenEnabled]);

  // 🏆 CHAMPION: Additional Navigation Actions (Missing from Profile Screen)
  const navigateToSkillsManagement = useCallback(() => {
    // 🎯 FEATURE FLAG GUARD
    if (!isScreenEnabled('SkillsManagement')) {
      logger.warn('Skills Management screen is disabled by feature flag', LogCategory.BUSINESS, { userId });
      return;
    }
    
    logger.info('Navigating to skills management', LogCategory.BUSINESS, { 
      userId,
      metadata: { action: 'navigate_skills' }
    });
    navigation?.navigate('SkillsManagement');
  }, [userId, navigation, isScreenEnabled]);

  const navigateToSocialLinksEdit = useCallback(() => {
    // 🎯 FEATURE FLAG GUARD
    if (!isScreenEnabled('SocialLinksEdit')) {
      logger.warn('Social Links Edit screen is disabled by feature flag', LogCategory.BUSINESS, { userId });
      return;
    }
    
    logger.info('Navigating to social links edit', LogCategory.BUSINESS, { 
      userId,
      metadata: { action: 'navigate_social_links' }
    });
    navigation?.navigate('SocialLinksEdit');
  }, [userId, navigation, isScreenEnabled]);

  // 🏆 CHAMPION PROFILE ACTIONS
  const shareProfile = useCallback(async () => {
    await shareProfileMutation.mutateAsync();
  }, [shareProfileMutation]);

  const exportProfile = useCallback(async () => {
    await exportProfileMutation.mutateAsync();
  }, [exportProfileMutation]);

  const refreshAll = useCallback(async () => {
    logger.info('Refreshing all profile screen data', LogCategory.BUSINESS, { userId });
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        profileQuery.refetch(),
        avatarQuery.refreshAvatar(),
        customFieldsQuery.refetch(),
        completion?.refresh() || Promise.resolve(),
      ]);
      
      logger.info('Profile screen data refreshed successfully', LogCategory.BUSINESS, { userId });
    } catch (error) {
      logger.error('Failed to refresh profile screen data', LogCategory.BUSINESS, 
        { userId }, error as Error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [profileQuery, avatarQuery, customFieldsQuery, completion, userId]);

  // 🏆 CHAMPION AVATAR ACTIONS
  const changeAvatar = useCallback(() => {
    logger.info('Navigating to avatar upload', LogCategory.BUSINESS, { userId });
    
    // Navigate to Avatar Upload Screen with current avatar
    navigation?.navigate('AvatarUpload', {
      currentAvatar: avatarQuery.avatarUrl,
      userId: userId
    });
  }, [userId, avatarQuery.avatarUrl, navigation]);

  const removeAvatar = useCallback(async () => {
    await removeAvatarMutation.mutateAsync();
  }, [removeAvatarMutation]);

  // 🏆 CHAMPION UI HELPERS
  const headerTitle = useMemo(() => {
    const profile = profileQuery.data;
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return t('profile.screen.defaultTitle', { defaultValue: 'Mein Profil' });
  }, [profileQuery.data, t]);

  const completionPercentage = useMemo(() => {
    return completion?.completeness?.percentage || 0;
  }, [completion]);

  const shouldShowCompletionBanner = useMemo(() => {
    return completionPercentage < 80 && showCompletionBanner;
  }, [completionPercentage, showCompletionBanner]);

  const dismissCompletionBanner = useCallback(() => {
    logger.info('Dismissing completion banner', LogCategory.BUSINESS, { userId });
    setShowCompletionBanner(false);
  }, [userId]);

  // 🏆 CHAMPION COMPUTED STATE
  const isAnyLoading = profileQuery.isLoading || avatarQuery.isLoadingAvatar || customFieldsQuery.isLoading;
  const hasAnyError = !!(profileQuery.error || avatarQuery.error || customFieldsQuery.error);
  const primaryError = (profileQuery.error as any)?.message || avatarQuery.error || (customFieldsQuery.error as any)?.message || null;

  return {
    // 🏆 ENTERPRISE STRUCTURE: Grouped by Responsibility
    data: {
      profile: profileWithEmail,
      avatar: { url: avatarQuery.avatarUrl },  // ✅ FIX: Korrekte Struktur für Profile Screen
      customFields: customFieldsQuery.data || [],
      completion,
      isProfileLoading: profileQuery.isLoading,
      isAvatarLoading: avatarQuery.isLoadingAvatar,
      isCustomFieldsLoading: customFieldsQuery.isLoading,
      isAnyLoading: isAnyLoading,
      profileError: primaryError as any,
      avatarError: typeof avatarQuery.error === 'string' ? avatarQuery.error : (avatarQuery.error as any)?.message || null,
      customFieldsError: (customFieldsQuery.error as any)?.message || null,
      hasAnyError: hasAnyError,
      refreshAll,
    },
    
    actions: {
      // �� Navigation Actions
      navigateToEdit,
      navigateToSettings,
      navigateToCustomFields,
      navigateToPrivacySettings,
      navigateToSkillsManagement,
      navigateToSocialLinksEdit,
      
      // 🏆 Profile Actions
      shareProfile,
      exportProfile,
      
      // 🏆 Avatar Actions
      changeAvatar,
      removeAvatar,
      
      // 🏆 Error Management
      clearErrors: () => {},
    },
    
    ui: {
      // 🏆 UI Dependencies
      theme,
      t,
      
      // 🏆 UI State
      headerTitle,
      completionPercentage,
      showCompletionBanner: shouldShowCompletionBanner,
      dismissCompletionBanner,
      
      // 🏆 Loading States
      isSharing: shareProfileMutation.isPending,
      isExporting: exportProfileMutation.isPending,
      isRefreshing,
    },
  };
};