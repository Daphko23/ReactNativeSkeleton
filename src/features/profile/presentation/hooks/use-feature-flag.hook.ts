/**
 * @fileoverview Use Feature Flag Hook - Profile Screen Feature Toggles
 *
 * 🚀 BUILD-TIME FEATURE TOGGLES:
 * ✅ Screen-Level Feature Gates
 * ✅ Component Visibility Control
 * ✅ Navigation Conditional Rendering
 * ✅ Enterprise vs Basic App Variants
 * ✅ Environment Variable Integration
 */

import { useMemo } from 'react';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
// import {
//   ProfileScreenConfig,
//   FeatureToggle,
// } from '../../domain/entities/profile-screen-config.entity'; // TODO: Create or fix import

// Environment Feature Flag Integration
import { environmentFeatureFlags } from '@core/config/feature-flags.env';

const logger = LoggerFactory.createServiceLogger('UseFeatureFlag');

// =============================================================================
// PROFILE SCREEN FEATURE FLAG ENUM
// =============================================================================

/**
 * Profile Screen Feature Flag Enumeration
 *
 * @description Bridge Enum für Profile-spezifische Feature Flags
 * Mappt auf die Environment Feature Flag Konfiguration
 */
export enum ProfileScreenFeatureFlag {
  // Screen-Level Flags
  ENABLE_ACCOUNT_SETTINGS = 'ENABLE_ACCOUNT_SETTINGS',
  ENABLE_CUSTOM_FIELDS_EDIT = 'ENABLE_CUSTOM_FIELDS_EDIT',
  ENABLE_PRIVACY_SETTINGS = 'ENABLE_PRIVACY_SETTINGS',
  ENABLE_SKILLS_MANAGEMENT = 'ENABLE_SKILLS_MANAGEMENT',
  ENABLE_SOCIAL_LINKS_EDIT = 'ENABLE_SOCIAL_LINKS_EDIT',

  // Background Functionality Flags
  ENABLE_ANALYTICS = 'ENABLE_ANALYTICS',
  ENABLE_OFFLINE_MODE = 'ENABLE_OFFLINE_MODE',
  ENABLE_REAL_TIME = 'ENABLE_REAL_TIME',
  ENABLE_PERFORMANCE_MONITORING = 'ENABLE_PERFORMANCE_MONITORING',

  // UI Component Flags
  ENABLE_ADVANCED_SHARING = 'ENABLE_ADVANCED_SHARING',
  ENABLE_CUSTOM_FIELDS = 'ENABLE_CUSTOM_FIELDS',
  ENABLE_AVATAR_UPLOAD = 'ENABLE_AVATAR_UPLOAD',
  ENABLE_EXPORT = 'ENABLE_EXPORT',
}

/**
 * 🎯 FEATURE FLAG HOOK INTERFACE
 */
export interface UseFeatureFlagReturn {
  isFeatureEnabled: (flag: ProfileScreenFeatureFlag) => boolean;
  getEnabledFeatures: () => ProfileScreenFeatureFlag[];
  isScreenEnabled: (
    screenName:
      | 'AccountSettings'
      | 'CustomFieldsEdit'
      | 'PrivacySettings'
      | 'SkillsManagement'
      | 'SocialLinksEdit'
  ) => boolean;
  getAppVariant: () => string;
  isDebugMode: () => boolean;
  isBackgroundFeatureEnabled: (feature: string) => boolean;
  shouldShowUIComponent: (component: string) => boolean;
}

/**
 * 🎯 SCREEN NAME TO FEATURE FLAG MAPPING
 */
const SCREEN_FEATURE_MAP = {
  AccountSettings: ProfileScreenFeatureFlag.ENABLE_ACCOUNT_SETTINGS,
  CustomFieldsEdit: ProfileScreenFeatureFlag.ENABLE_CUSTOM_FIELDS_EDIT,
  PrivacySettings: ProfileScreenFeatureFlag.ENABLE_PRIVACY_SETTINGS,
  SkillsManagement: ProfileScreenFeatureFlag.ENABLE_SKILLS_MANAGEMENT,
  SocialLinksEdit: ProfileScreenFeatureFlag.ENABLE_SOCIAL_LINKS_EDIT,
} as const;

/**
 * Profile Screen Configuration Creation (simplified)
 */
function createProfileScreenConfiguration(_options: {
  userId: string;
  organizationId: string;
}) {
  const envConfig = environmentFeatureFlags.getConfig();

  return {
    isFeatureEnabled: (flag: ProfileScreenFeatureFlag): boolean => {
      // Direct mapping to environment config
      switch (flag) {
        case ProfileScreenFeatureFlag.ENABLE_ANALYTICS:
          return envConfig.background.enableAnalytics;
        case ProfileScreenFeatureFlag.ENABLE_OFFLINE_MODE:
          return envConfig.background.enableOfflineMode;
        case ProfileScreenFeatureFlag.ENABLE_REAL_TIME:
          return envConfig.background.enableRealTimeUpdates;
        case ProfileScreenFeatureFlag.ENABLE_ADVANCED_SHARING:
          return envConfig.ui.showSharingOptions;
        case ProfileScreenFeatureFlag.ENABLE_CUSTOM_FIELDS:
          return envConfig.ui.showCustomFields;
        case ProfileScreenFeatureFlag.ENABLE_AVATAR_UPLOAD:
          return envConfig.ui.showAvatarUpload;
        case ProfileScreenFeatureFlag.ENABLE_EXPORT:
          return envConfig.ui.showExportOptions;
        case ProfileScreenFeatureFlag.ENABLE_PERFORMANCE_MONITORING:
          return envConfig.background.enablePerformanceMonitoring;
        case ProfileScreenFeatureFlag.ENABLE_ACCOUNT_SETTINGS:
          return envConfig.screens.enableAccountSettings;
        case ProfileScreenFeatureFlag.ENABLE_CUSTOM_FIELDS_EDIT:
          return envConfig.screens.enableCustomFieldsEdit;
        case ProfileScreenFeatureFlag.ENABLE_PRIVACY_SETTINGS:
          return envConfig.screens.enablePrivacySettings;
        case ProfileScreenFeatureFlag.ENABLE_SKILLS_MANAGEMENT:
          return envConfig.screens.enableSkillsManagement;
        case ProfileScreenFeatureFlag.ENABLE_SOCIAL_LINKS_EDIT:
          return envConfig.screens.enableSocialLinksEdit;
        default:
          return false;
      }
    },
    getEnabledFeatures: (): ProfileScreenFeatureFlag[] => {
      const allFlags = Object.values(ProfileScreenFeatureFlag);
      return allFlags.filter(flag =>
        createProfileScreenConfiguration(_options).isFeatureEnabled(flag)
      );
    },
  };
}

/**
 * 🚀 USE FEATURE FLAG HOOK
 *
 * @description Hook für Feature Flag Überprüfung in Profile Components und Navigation
 *
 * @example
 * ```tsx
 * const { isFeatureEnabled, isScreenEnabled } = useFeatureFlag();
 *
 * // Screen Navigation Guard:
 * {isScreenEnabled('SkillsManagement') && (
 *   <Screen name="SkillsManagement" component={SkillsScreen} />
 * )}
 *
 * // Component Visibility:
 * {isFeatureEnabled(ProfileScreenFeatureFlag.ENABLE_CUSTOM_FIELDS) && (
 *   <CustomFieldsSection />
 * )}
 *
 * // Button Conditional:
 * {isScreenEnabled('PrivacySettings') && (
 *   <Button onPress={() => navigate('PrivacySettings')}>
 *     Privacy Settings
 *   </Button>
 * )}
 * ```
 */
export function useFeatureFlag(): UseFeatureFlagReturn {
  const profileConfig = useMemo(
    () =>
      createProfileScreenConfiguration({
        userId: 'default', // Build-time flags don't depend on specific user
        organizationId: 'default',
      }),
    []
  );
  const envConfig = useMemo(() => environmentFeatureFlags.getConfig(), []);

  const isFeatureEnabled = useMemo(
    () =>
      (flag: ProfileScreenFeatureFlag): boolean => {
        return profileConfig.isFeatureEnabled(flag);
      },
    [profileConfig]
  );

  const isScreenEnabled = useMemo(
    () =>
      (screenName: ScreenName): boolean => {
        const flagMapping = SCREEN_FEATURE_MAP[screenName];
        if (!flagMapping) return false;

        // 🚀 ENVIRONMENT INTEGRATION: Use environment config for screen flags
        switch (screenName) {
          case 'AccountSettings':
            return envConfig.screens.enableAccountSettings;
          case 'CustomFieldsEdit':
            return envConfig.screens.enableCustomFieldsEdit;
          case 'PrivacySettings':
            return envConfig.screens.enablePrivacySettings;
          case 'SkillsManagement':
            return envConfig.screens.enableSkillsManagement;
          case 'SocialLinksEdit':
            return envConfig.screens.enableSocialLinksEdit;
          default:
            // Fallback to feature flag check
            return isFeatureEnabled(flagMapping);
        }
      },
    [isFeatureEnabled, envConfig]
  );

  // 🎯 APP VARIANT INFO
  const appVariant = useMemo(() => environmentFeatureFlags.getAppVariant(), []);
  const isDebugMode = useMemo(() => environmentFeatureFlags.isDebugMode(), []);

  // 📋 GET ALL ENABLED FEATURES
  const getEnabledFeatures = useMemo(() => {
    return (): ProfileScreenFeatureFlag[] => {
      if (!profileConfig) {
        logger.warn(
          'Profile configuration not available for enabled features list',
          LogCategory.BUSINESS
        );
        return [];
      }

      try {
        const enabledFeatures = profileConfig.getEnabledFeatures();

        logger.info('Retrieved enabled features list', LogCategory.BUSINESS, {
          metadata: {
            count: enabledFeatures.length,
            features: enabledFeatures,
          },
        });

        return enabledFeatures;
      } catch (error) {
        logger.error(
          'Error getting enabled features',
          LogCategory.BUSINESS,
          {},
          error as Error
        );
        return [];
      }
    };
  }, [profileConfig]);

  return {
    isFeatureEnabled,
    isScreenEnabled,
    getEnabledFeatures,
    getAppVariant: () => appVariant,
    isDebugMode: () => isDebugMode,
    // Additional environment helpers
    isBackgroundFeatureEnabled: (feature: string) => {
      return environmentFeatureFlags.isBackgroundFeatureEnabled(feature as any);
    },
    shouldShowUIComponent: (component: string) => {
      return environmentFeatureFlags.shouldShowUIComponent(component as any);
    },
  };
}

/**
 * 🎯 FEATURE FLAG UTILITIES
 */
export const FeatureFlagUtils = {
  /**
   * Check if all screens in a list are enabled
   */
  areAllScreensEnabled: (
    screens: (keyof typeof SCREEN_FEATURE_MAP)[],
    checker: UseFeatureFlagReturn['isScreenEnabled']
  ): boolean => {
    return screens.every(screen => checker(screen));
  },

  /**
   * Check if any screen in a list is enabled
   */
  isAnyScreenEnabled: (
    screens: (keyof typeof SCREEN_FEATURE_MAP)[],
    checker: UseFeatureFlagReturn['isScreenEnabled']
  ): boolean => {
    return screens.some(screen => checker(screen));
  },

  /**
   * Get enabled screens from a list
   */
  getEnabledScreens: (
    screens: (keyof typeof SCREEN_FEATURE_MAP)[],
    checker: UseFeatureFlagReturn['isScreenEnabled']
  ): (keyof typeof SCREEN_FEATURE_MAP)[] => {
    return screens.filter(screen => checker(screen));
  },
};

/**
 * 🚀 EXPORT ADDITIONAL CONSTANTS
 */
export { SCREEN_FEATURE_MAP };
export type ScreenName = keyof typeof SCREEN_FEATURE_MAP;
