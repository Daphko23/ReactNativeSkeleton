/**
 * useSocialLinksEdit Hook - Enterprise Business Logic
 * Comprehensive social links management with state management, validation, and API integration
 * Following enterprise patterns with proper error handling and performance optimization
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../core/theme/theme.system';
import { 
  SocialLink,
  SocialPlatformKey,
  SocialPlatformDefinition,
  SOCIAL_LINKS_TEST_IDS,
} from '../types';
import { 
  DEFAULT_SOCIAL_PLATFORMS,
} from '../../domain/types/social-links.types';
import { useProfile } from './use-profile.hook';

// Service interface for Social Links
interface SocialLinksService {
  getSocialLinks(): Promise<SocialLink[]>;
  updateSocialLinks(links: SocialLink[]): Promise<{ success: boolean; links: SocialLink[] }>;
  validateSocialLink(platform: SocialPlatformKey, url: string): Promise<{ isValid: boolean; verified: boolean }>;
  previewSocialLink(link: SocialLink): Promise<{ title: string; description: string; image?: string }>;
}

// Hook return interface
interface UseSocialLinksEditReturn {
  // State
  socialLinks: SocialLink[];
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
  hasValidationErrors: boolean;
  
  // Actions
  addLink: (platform: SocialPlatformKey, url: string) => void;
  updateLink: (platform: SocialPlatformKey, url: string) => void;
  updateSocialLink: (platform: SocialPlatformKey, url: string) => void;
  removeLink: (platform: SocialPlatformKey) => void;
  toggleLinkVisibility: (platform: SocialPlatformKey, isPublic: boolean) => void;
  save: () => Promise<void>;
  saveSocialLinks: () => Promise<void>;
  reset: () => void;
  resetSocialLinks: () => void;
  
  // Navigation & Actions
  openSocialLink: (platform: SocialPlatformKey) => void;
  
  // Data Getters
  getSocialLinkData: (platform: SocialPlatformKey) => SocialLink | undefined;
  getValidationError: (platform: SocialPlatformKey) => string | undefined;
  
  // Validation
  validateLink: (platform: SocialPlatformKey, value: string) => boolean;
  
  // Platform data
  socialPlatforms: readonly SocialPlatformDefinition[];
  availablePlatforms: SocialPlatformDefinition[];
  completedPlatforms: SocialPlatformDefinition[];
}

// Constants
const SOCIAL_LINKS_CONSTANTS = {
  MAX_LINKS: 10,
  MAX_URL_LENGTH: 500,
  MIN_USERNAME_LENGTH: 1,
  MAX_USERNAME_LENGTH: 100,
} as const;

// Removed hardcoded validation messages - now using i18n only

// Mock Social Links Service - Enterprise Pattern
const _mockSocialLinksService: SocialLinksService = {
  getSocialLinks: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      { 
        platform: 'linkedin', 
        url: 'https://linkedin.com/in/max-mustermann', 
        username: 'max-mustermann',
        isPublic: true,
        verified: true
      },
      { 
        platform: 'github', 
        url: 'https://github.com/maxmustermann', 
        username: 'maxmustermann',
        isPublic: true,
        verified: true
      },
      { 
        platform: 'website', 
        url: 'https://max-mustermann.dev',
        isPublic: true,
        verified: false
      },
    ];
  },
  
  updateSocialLinks: async (links: SocialLink[]) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, links };
  },

  validateSocialLink: async (_platform: SocialPlatformKey, _url: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { isValid: true, verified: Math.random() > 0.3 };
  },

  previewSocialLink: async (link: SocialLink) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const platform = DEFAULT_SOCIAL_PLATFORMS.find(p => p.key === link.platform);
    return {
      title: `${platform?.name} - ${link.username || 'Profil'}`,
      description: `Besuchen Sie das ${platform?.name} Profil`,
      image: undefined
    };
  }
};

/**
 * Social Links Edit Hook Interface
 */
interface _UseSocialLinksEditParams {
  navigation?: any; // NavigationProp type from React Navigation
}

/**
 * Enterprise Social Links Edit Hook
 * Handles all business logic for social links management
 */
export const useSocialLinksEdit = (_navigation?: any): UseSocialLinksEditReturn & {
  // Extended return type for screen-specific functionality
  theme: any;
  t: (key: string, options?: any) => string;
  testIds: typeof SOCIAL_LINKS_TEST_IDS;
  socialPlatforms: SocialPlatformDefinition[];
  getInputValue: (platform: SocialPlatformKey) => string;
} => {
  // Dependencies
  const { t } = useTranslation();
  const { theme } = useTheme();
  

  
  // Profile integration
  const { profile, updateProfile, isLoading: profileIsLoading, isUpdating } = useProfile();

  // State Management
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [initialLinks, setInitialLinks] = useState<SocialLink[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  // Social Platforms Configuration
  const socialPlatforms = useMemo<SocialPlatformDefinition[]>(() => 
    [...DEFAULT_SOCIAL_PLATFORMS].sort((a: SocialPlatformDefinition, b: SocialPlatformDefinition) => a.priority - b.priority),
  []);

  // Computed Values
  const hasValidationErrors = useMemo(() => 
    Object.keys(validationErrors).length > 0,
  [validationErrors]);

  const completedPlatforms = useMemo(() => 
    socialPlatforms.filter(platform => 
      socialLinks.some(link => link.platform === platform.key)
    ),
  [socialPlatforms, socialLinks]);

  const availablePlatforms = useMemo(() => 
    socialPlatforms.filter(platform => 
      !socialLinks.some(link => link.platform === platform.key)
    ),
  [socialPlatforms, socialLinks]);

  // Load social links from profile (only once on mount)
  useEffect(() => {
    if (profile?.socialLinks && initialLinks.length === 0) {
      // Reverse mapping from profile format to platform keys
      const reversePlatformMapping: Record<string, string> = {
        'linkedIn': 'linkedin',
        'twitter': 'twitter',
        'github': 'github', 
        'instagram': 'instagram',
        'facebook': 'facebook',
        'youtube': 'youtube',
        'tiktok': 'tiktok'
      };
      
      // Convert profile social links to SocialLink format
      const links: SocialLink[] = Object.entries(profile.socialLinks)
        .filter(([_, url]) => url) // Only include non-empty links
        .map(([profileKey, url]) => {
          const platformKey = reversePlatformMapping[profileKey] || profileKey.toLowerCase();
          const platformConfig = socialPlatforms.find(p => p.key === platformKey);
          return {
            platform: platformKey as SocialPlatformKey,
            url: url as string,
            username: platformConfig?.extractUsername ? platformConfig.extractUsername(url as string) : undefined,
            isPublic: true,
            verified: false
          };
        });
      
      console.log('🔍 Loaded Social Links from Profile:', profile.socialLinks);
      console.log('🔍 Converted to SocialLink[]:', links);
      
      setSocialLinks(links);
      setInitialLinks([...links]);
      
      // Initialize input values
      const inputVals = links.reduce((acc, link) => {
        acc[link.platform] = link.url;
        return acc;
      }, {} as Record<string, string>);
      setInputValues(inputVals);
    }
  }, [profile, initialLinks.length, socialPlatforms]);

  // Track changes
  useEffect(() => {
    const currentLinksJson = JSON.stringify(socialLinks.sort((a, b) => a.platform.localeCompare(b.platform)));
    const initialLinksJson = JSON.stringify(initialLinks.sort((a, b) => a.platform.localeCompare(b.platform)));
    setHasChanges(currentLinksJson !== initialLinksJson);
  }, [socialLinks, initialLinks]);

  /**
   * Helper to extract username from URL
   */
  const _extractUsernameFromUrl = useCallback((platform: SocialPlatformKey, url: string): string | undefined => {
    const platformConfig = socialPlatforms.find(p => p.key === platform);
    return platformConfig?.extractUsername ? platformConfig.extractUsername(url) : undefined;
  }, [socialPlatforms]);

  /**
   * Validate social link
   */
  const validateLink = useCallback((platform: SocialPlatformKey, value: string): boolean => {
    if (!value.trim()) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[platform];
        return newErrors;
      });
      return true; // Empty is valid (removes link)
    }
    
    const platformConfig = socialPlatforms.find(p => p.key === platform);
    if (!platformConfig) {
      setValidationErrors(prev => ({
        ...prev,
        [platform]: t('profile.socialLinks.validation.invalid', { platform: platform })
      }));
      return false;
    }

    // Length validation
    if (value.length > SOCIAL_LINKS_CONSTANTS.MAX_URL_LENGTH) {
      setValidationErrors(prev => ({
        ...prev,
        [platform]: t('profile.socialLinks.validation.tooLong', { max: SOCIAL_LINKS_CONSTANTS.MAX_URL_LENGTH })
      }));
      return false;
    }

    if (value.length < SOCIAL_LINKS_CONSTANTS.MIN_USERNAME_LENGTH) {
      setValidationErrors(prev => ({
        ...prev,
        [platform]: t('profile.socialLinks.validation.tooShort', { min: SOCIAL_LINKS_CONSTANTS.MIN_USERNAME_LENGTH })
      }));
      return false;
    }

    // Pattern validation
    const isValid = platformConfig.validation.test(value);
    
    if (!isValid) {
      setValidationErrors(prev => ({
        ...prev,
        [platform]: t('profile.socialLinks.validation.invalid', { platform: platformConfig.name })
      }));
      return false;
    }

    // Clear validation error if valid
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[platform];
      return newErrors;
    });
    
    return true;
  }, [socialPlatforms, t]);

  /**
   * Update social link
   */
  const updateSocialLink = useCallback((platform: SocialPlatformKey, value: string) => {
    // Always update input value immediately for responsive UI
    setInputValues(prev => ({
      ...prev,
      [platform]: value
    }));
    
    const isValid = validateLink(platform, value);
    
    // Update social links state only for valid values or empty (to remove)
    setSocialLinks(prev => {
      const existingIndex = prev.findIndex(link => link.platform === platform);
      const trimmedValue = value.trim();
      
      if (!trimmedValue) {
        // Remove link if empty
        return prev.filter(link => link.platform !== platform);
      }
      
      // Only update social links if valid
      if (!isValid) {
        return prev; // Keep existing state for invalid input
      }
      
      const platformConfig = socialPlatforms.find(p => p.key === platform);
      const newLink: SocialLink = {
        platform,
        url: platformConfig?.formatUrl ? platformConfig.formatUrl(trimmedValue) : trimmedValue,
        username: platformConfig?.extractUsername ? platformConfig.extractUsername(trimmedValue) : undefined,
        isPublic: true,
        verified: false
      };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newLink;
        return updated;
      } else {
        return [...prev, newLink];
      }
    });
  }, [validateLink, socialPlatforms]);

  /**
   * Remove social link
   */
  const removeSocialLink = useCallback((platform: SocialPlatformKey) => {
    setSocialLinks(prev => prev.filter(link => link.platform !== platform));
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[platform];
      return newErrors;
    });
  }, []);

  /**
   * Toggle link visibility
   */
      const _toggleLinkVisibility = useCallback((platform: SocialPlatformKey) => {
    setSocialLinks(prev => prev.map(link => 
      link.platform === platform 
        ? { ...link, isPublic: !link.isPublic }
        : link
    ));
  }, []);

  /**
   * Save all social links
   */
  const saveSocialLinks = useCallback(async () => {
    if (hasValidationErrors) {
      Alert.alert(
        t('profile.socialLinks.validation.hasErrors.title'),
        t('profile.socialLinks.validation.hasErrors.message')
      );
      return false;
    }

    try {
      setError(null);
      
      // Convert SocialLink[] to socialLinks object format for profile
      // Map platform keys to match repository expectations
      const platformMapping: Record<string, string> = {
        'linkedin': 'linkedIn',
        'twitter': 'twitter', 
        'github': 'github',
        'instagram': 'instagram',
        'facebook': 'facebook',
        'youtube': 'youtube',
        'tiktok': 'tiktok'
      };
      
      const socialLinksUpdate = socialLinks.reduce((acc, link) => {
        const mappedKey = platformMapping[link.platform] || link.platform;
        acc[mappedKey] = link.url;
        return acc;
      }, {} as Record<string, string>);

      console.log('🔍 Social Links Update:', socialLinksUpdate);
      
      const success = await updateProfile({
        socialLinks: socialLinksUpdate
      });
      
      if (success) {
        setInitialLinks([...socialLinks]);
        setHasChanges(false);
        console.log('🔍 EXACT KEY TEST:', {
          profileKey: t('profile.socialLinks.save.success.title'),
          directTest: t('profile', { ns: 'translation', returnObjects: true }),
          currentLang: t('common.save') // Test if i18n works at all
        });
        
        Alert.alert(
          t('profile.socialLinks.save.success.title'),
          t('profile.socialLinks.save.success.message')
        );
        return true;
      }
      
      throw new Error('Save failed');
    } catch (error) {
      console.error('❌ Save Social Links Error:', error);
      setError(t('profile.socialLinks.errors.saveFailed'));
      Alert.alert(
        t('profile.socialLinks.save.error.title'),
        t('profile.socialLinks.save.error.message')
      );
      return false;
    }
  }, [socialLinks, hasValidationErrors, t, updateProfile]);

  /**
   * Reset to initial state
   */
  const resetSocialLinks = useCallback(() => {
    Alert.alert(
      t('profile.socialLinks.reset.title'),
      t('profile.socialLinks.reset.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.reset'),
          style: 'destructive',
          onPress: () => {
            setSocialLinks([...initialLinks]);
            setValidationErrors({});
            setError(null);
            setHasChanges(false);
          }
        }
      ]
    );
  }, [initialLinks, t]);

  /**
   * Open social link
   */
  const openSocialLink = useCallback(async (link: SocialLink) => {
    try {
      const supported = await Linking.canOpenURL(link.url);
      if (supported) {
        await Linking.openURL(link.url);
      } else {
        Alert.alert(
          t('profile.socialLinks.open.error.title'),
          t('profile.socialLinks.open.error.message')
        );
      }
    } catch {
      Alert.alert(
        t('profile.socialLinks.open.error.title'),
        t('profile.socialLinks.open.error.message')
      );
    }
  }, [t]);

  /**
   * Get social link data
   */
  const getSocialLinkData = useCallback((platform: SocialPlatformKey): SocialLink | undefined => {
    return socialLinks.find(link => link.platform === platform);
  }, [socialLinks]);

  /**
   * Get input value for platform
   */
  const getInputValue = useCallback((platform: SocialPlatformKey): string => {
    return inputValues[platform] || '';
  }, [inputValues]);

  /**
   * Get platform icon
   */
      const _getPlatformIcon = useCallback((platform: SocialPlatformKey): string => {
    const platformConfig = socialPlatforms.find(p => p.key === platform);
    return platformConfig?.icon || 'link';
  }, [socialPlatforms]);

  /**
   * Get platform name
   */
      const _getPlatformName = useCallback((platform: SocialPlatformKey): string => {
    const platformConfig = socialPlatforms.find(p => p.key === platform);
    return platformConfig?.name || platform;
  }, [socialPlatforms]);

  /**
   * Get validation error for platform
   */
  const getValidationError = useCallback((platform: SocialPlatformKey): string | undefined => {
    return validationErrors[platform];
  }, [validationErrors]);

  return {
    // Interface requirements
    socialLinks,
    isLoading: profileIsLoading,
    isSaving: isUpdating,
    hasChanges,
    error,
    validationErrors,
    hasValidationErrors,
    
    // Actions (interface requirements) 
    addLink: updateSocialLink,
    updateLink: updateSocialLink,
    updateSocialLink: updateSocialLink,
    removeLink: removeSocialLink,
    toggleLinkVisibility: (platform: SocialPlatformKey, isPublic: boolean) => {
      setSocialLinks(prev => prev.map(link => 
        link.platform === platform 
          ? { ...link, isPublic }
          : link
      ));
    },
    save: async () => { await saveSocialLinks(); },
    saveSocialLinks: async () => { await saveSocialLinks(); },
    reset: resetSocialLinks,
    resetSocialLinks: resetSocialLinks,
    
    // Navigation & Actions
    openSocialLink: (platform: SocialPlatformKey) => {
      const link = socialLinks.find(l => l.platform === platform);
      if (link) {
        openSocialLink(link);
      }
    },
    
    // Data Getters
    getSocialLinkData,
    getValidationError,
    
    // Validation (interface requirements)
    validateLink,
    
    // Platform data (interface requirements)
    socialPlatforms,
    availablePlatforms,
    completedPlatforms,
    
    // Screen dependencies
    theme,
    t,
    testIds: SOCIAL_LINKS_TEST_IDS,
    getInputValue,
  };
}; 