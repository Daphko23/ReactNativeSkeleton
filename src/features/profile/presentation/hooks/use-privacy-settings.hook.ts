/**
 * usePrivacySettings Hook - Privacy Management
 * Manages privacy settings state and operations
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../core/theme/theme.system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for privacy settings
const PRIVACY_SETTINGS_STORAGE_KEY = '@privacy_settings';

// Environment check for logging
const isDevelopment = __DEV__;
const isTestEnvironment = process.env.NODE_ENV === 'test';

export interface PrivacySetting {
  id: string;
  key: string;
  title: string;
  description: string;
  enabled: boolean;
  value?: string; // For visibility settings: 'public', 'friends', 'private'
  category: 'visibility' | 'data' | 'communication' | 'tracking';
  required?: boolean;
}

export interface UsePrivacySettingsReturn {
  settings: PrivacySetting[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateSetting: (id: string, enabled: boolean) => void;
  updateVisibilitySetting: (id: string, value: string) => void; // New method for visibility
  saveSettings: () => Promise<void>;
  resetToDefaults: () => void;
  hasChanges: boolean;
  
  // Theme and translations
  theme: any;
  t: (key: string, options?: any) => string;
  
  // Additional properties for UI consistency
  isUpdating: boolean;
  showSuccessMessage: (message: string) => void;
  showErrorMessage: (message: string) => void;
}

// Utility function for conditional logging
const log = (message: string, data?: any) => {
  if (isDevelopment && !isTestEnvironment) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

export const usePrivacySettings = (): UsePrivacySettingsReturn => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [settings, setSettings] = useState<PrivacySetting[]>([]);
  const [originalSettings, setOriginalSettings] = useState<PrivacySetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized default settings to prevent recreation on every render
  const getDefaultSettings = useCallback((): PrivacySetting[] => [
    // Visibility Settings (with string values)
    {
      id: '1',
      key: 'profile_visibility',
      title: t('privacy.profileVisibility.title', { defaultValue: 'Profil-Sichtbarkeit' }),
      description: t('privacy.profileVisibility.description', { defaultValue: 'Wer kann Ihr Profil sehen' }),
      enabled: true,
      value: 'public',
      category: 'visibility',
    },
    {
      id: '4',
      key: 'email_visibility',
      title: t('privacy.emailVisibility.title', { defaultValue: 'E-Mail-Sichtbarkeit' }),
      description: t('privacy.emailVisibility.description', { defaultValue: 'Wer kann Ihre E-Mail sehen' }),
      enabled: true,
      value: 'public',
      category: 'visibility',
    },
    {
      id: '5',
      key: 'phone_visibility',
      title: t('privacy.phoneVisibility.title', { defaultValue: 'Telefon-Sichtbarkeit' }),
      description: t('privacy.phoneVisibility.description', { defaultValue: 'Wer kann Ihre Telefonnummer sehen' }),
      enabled: true,
      value: 'private',
      category: 'visibility',
    },
    {
      id: '6',
      key: 'location_visibility',
      title: t('privacy.locationVisibility.title', { defaultValue: 'Standort-Sichtbarkeit' }),
      description: t('privacy.locationVisibility.description', { defaultValue: 'Wer kann Ihren Standort sehen' }),
      enabled: true,
      value: 'private',
      category: 'visibility',
    },
    {
      id: '7',
      key: 'social_links_visibility',
      title: t('privacy.socialLinksVisibility.title', { defaultValue: 'Social Links-Sichtbarkeit' }),
      description: t('privacy.socialLinksVisibility.description', { defaultValue: 'Wer kann Ihre Social Links sehen' }),
      enabled: true,
      value: 'public',
      category: 'visibility',
    },
    {
      id: '8',
      key: 'professional_info_visibility',
      title: t('privacy.professionalInfoVisibility.title', { defaultValue: 'Berufliche Info-Sichtbarkeit' }),
      description: t('privacy.professionalInfoVisibility.description', { defaultValue: 'Wer kann Ihre beruflichen Informationen sehen' }),
      enabled: true,
      value: 'public',
      category: 'visibility',
    },
    
    // Communication Settings
    {
      id: '3',
      key: 'email_notifications',
      title: t('privacy.emailNotifications.title', { defaultValue: 'E-Mail-Benachrichtigungen' }),
      description: t('privacy.emailNotifications.description', { defaultValue: 'Marketing-E-Mails erhalten' }),
      enabled: true,
      category: 'communication',
    },
    {
      id: '9',
      key: 'push_notifications',
      title: t('privacy.pushNotifications.title', { defaultValue: 'Push-Benachrichtigungen' }),
      description: t('privacy.pushNotifications.description', { defaultValue: 'App-Benachrichtigungen erhalten' }),
      enabled: true,
      category: 'communication',
    },
    
    // Data Settings
    {
      id: '2',
      key: 'data_collection',
      title: t('privacy.dataCollection.title', { defaultValue: 'Datensammlung' }),
      description: t('privacy.dataCollection.description', { defaultValue: 'Anonyme Nutzungsdaten sammeln' }),
      enabled: false,
      category: 'data',
    },
  ], [t]);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        log('📱 PRIVACY HOOK: Loading settings from AsyncStorage...');
        
        // Try to load saved settings from AsyncStorage
        const savedSettings = await AsyncStorage.getItem(PRIVACY_SETTINGS_STORAGE_KEY);
        
        // Get default settings
        const defaultSettings = getDefaultSettings();
        
        let finalSettings: PrivacySetting[];
        
        if (savedSettings) {
          log('📱 PRIVACY HOOK: Found saved settings, loading...');
          try {
            const parsedSettings = JSON.parse(savedSettings);
            // Merge saved settings with defaults (in case new settings were added)
            finalSettings = defaultSettings.map(defaultSetting => {
              const savedSetting = parsedSettings.find((s: PrivacySetting) => s.id === defaultSetting.id);
              return savedSetting ? { ...defaultSetting, ...savedSetting } : defaultSetting;
            });
            log('✅ PRIVACY HOOK: Loaded settings from storage', finalSettings);
          } catch {
            log('⚠️ PRIVACY HOOK: Failed to parse saved settings, using defaults');
            finalSettings = defaultSettings;
          }
        } else {
          log('📱 PRIVACY HOOK: No saved settings found, using defaults');
          finalSettings = defaultSettings;
        }
        
        setSettings(finalSettings);
        setOriginalSettings([...finalSettings]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load privacy settings';
        setError(errorMessage);
        log('❌ PRIVACY HOOK: Load failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [getDefaultSettings]);

  // Optimized hasChanges computation using useMemo
  const hasChanges = React.useMemo(() => {
    if (settings.length !== originalSettings.length) return true;
    
    return settings.some((setting, index) => {
      const original = originalSettings[index];
      if (!original) return true;
      
      // Check both enabled and value properties for changes
      return original.enabled !== setting.enabled || original.value !== setting.value;
    });
  }, [settings, originalSettings]);

  const updateSetting = useCallback((id: string, enabled: boolean) => {
    log(`🔄 PRIVACY HOOK: updateSetting(${id}, ${enabled})`);
    
    setSettings(prev => {
      const updated = prev.map(setting => 
        setting.id === id ? { ...setting, enabled } : setting
      );
      log('📊 PRIVACY HOOK: Updated Settings', updated);
      return updated;
    });
  }, []);

  const updateVisibilitySetting = useCallback((id: string, value: string) => {
    log(`🔄 PRIVACY HOOK: updateVisibilitySetting(${id}, ${value})`);
    
    setSettings(prev => {
      const updated = prev.map(setting => 
        setting.id === id ? { ...setting, value, enabled: true } : setting
      );
      log('📊 PRIVACY HOOK: Updated Visibility Settings', updated);
      return updated;
    });
  }, []);

  const saveSettings = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      log('💾 PRIVACY HOOK: Saving settings to AsyncStorage...', settings);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(PRIVACY_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      
      setOriginalSettings([...settings]);
      log('✅ PRIVACY HOOK: Settings saved successfully to AsyncStorage!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save privacy settings';
      setError(errorMessage);
      log('❌ PRIVACY HOOK: Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const resetToDefaults = useCallback(() => {
    log('🔄 PRIVACY HOOK: Resetting to defaults');
    setSettings([...originalSettings]);
  }, [originalSettings]);

  // Additional helper methods
  const isUpdating = isSaving;
  
  const showSuccessMessage = React.useCallback((message: string) => {
    log('✅ Privacy Success:', message);
    // TODO: Integrate with AlertService or Toast system
  }, []);
  
  const showErrorMessage = React.useCallback((message: string) => {
    log('❌ Privacy Error:', message);
    // TODO: Integrate with AlertService or Toast system  
  }, []);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateSetting,
    updateVisibilitySetting,
    saveSettings,
    resetToDefaults,
    hasChanges,
    theme,
    t,
    
    // Additional properties
    isUpdating,
    showSuccessMessage,
    showErrorMessage,
  };
}; 