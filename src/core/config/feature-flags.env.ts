/**
 * @fileoverview Environment Feature Flag Configuration
 * 
 * @description Environment-based feature flag management system that loads
 * configuration from process.env variables and provides different app variants.
 * Supports build-time feature toggling for different deployment environments.
 * 
 * @module FeatureFlagsEnv
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Core/Configuration
 */

import { LoggerFactory } from '@core/logging/logger.factory';

const logger = LoggerFactory.createServiceLogger('FeatureFlagsEnv');

// =============================================================================
// ENVIRONMENT FEATURE FLAG TYPES
// =============================================================================

/**
 * App Variant Types
 */
export type AppVariant = 'development' | 'basic' | 'premium' | 'enterprise' | 'demo';

/**
 * Environment Feature Flag Configuration
 */
export interface EnvironmentFeatureFlags {
  // App Configuration
  appVariant: AppVariant;
  debugMode: boolean;

  // Screen-Level Feature Flags
  screens: {
    enableAccountSettings: boolean;
    enableCustomFieldsEdit: boolean;
    enablePrivacySettings: boolean;
    enableSkillsManagement: boolean;
    enableSocialLinksEdit: boolean;
  };

  // Background Functionality
  background: {
    enableAnalytics: boolean;
    enablePerformanceMonitoring: boolean;
    enableAuditLogging: boolean;
    enableBackgroundSync: boolean;
    enableRealTimeUpdates: boolean;
    enableOfflineMode: boolean;
    enableCloudBackup: boolean;
    enableOptimisticUpdates: boolean;
    enableProfileVersioning: boolean;
    enableCachePreloading: boolean;
    enableEncryption: boolean;
    enableBiometricAuth: boolean;
    enableSessionManagement: boolean;
    enableGdprCompliance: boolean;
    enableAutoCompletion: boolean;
    enableDuplicateDetection: boolean;
    enableDataValidation: boolean;
    enableSmartSuggestions: boolean;
  };

  // UI Component Toggles
  ui: {
    showCompletionBanner: boolean;
    showEnhancementSuggestions: boolean;
    showQuickActions: boolean;
    showSecurityStatus: boolean;
    showPermissionsPanel: boolean;
    showCustomFields: boolean;
    showSocialLinks: boolean;
    showProfessionalInfo: boolean;
    showSkillsManagement: boolean;
    showAvatarUpload: boolean;
    showProfileAnalytics: boolean;
    showExportOptions: boolean;
    showSharingOptions: boolean;
    showTemplateSelector: boolean;
    showPrivacyControls: boolean;
    showValidationPreview: boolean;
    showBulkOperations: boolean;
    showVersionHistory: boolean;
    showTabNavigation: boolean;
    showFloatingActions: boolean;
    showBreadcrumbs: boolean;
    showSectionCollapse: boolean;
  };
}

// =============================================================================
// APP VARIANT CONFIGURATIONS
// =============================================================================

/**
 * Development Configuration - Full Feature Set
 */
const DEVELOPMENT_CONFIG: EnvironmentFeatureFlags = {
  appVariant: 'development',
  debugMode: true,
  screens: {
    enableAccountSettings: true,
    enableCustomFieldsEdit: true,    // ✅ AKTIVIERT FÜR DEVELOPMENT
    enablePrivacySettings: true,     // ✅ AKTIVIERT FÜR DEVELOPMENT
    enableSkillsManagement: true,    // ✅ AKTIVIERT FÜR DEVELOPMENT
    enableSocialLinksEdit: true,     // ✅ AKTIVIERT FÜR DEVELOPMENT
  },
  background: {
    enableAnalytics: true,
    enablePerformanceMonitoring: true,
    enableAuditLogging: true,
    enableBackgroundSync: true,
    enableRealTimeUpdates: true,
    enableOfflineMode: true,
    enableCloudBackup: true,
    enableOptimisticUpdates: true,
    enableProfileVersioning: true,
    enableCachePreloading: true,
    enableEncryption: true,
    enableBiometricAuth: true,
    enableSessionManagement: true,
    enableGdprCompliance: true,
    enableAutoCompletion: true,
    enableDuplicateDetection: true,
    enableDataValidation: true,
    enableSmartSuggestions: true,
  },
  ui: {
    showCompletionBanner: true,
    showEnhancementSuggestions: true,
    showQuickActions: true,
    showSecurityStatus: true,
    showPermissionsPanel: true,
    showCustomFields: true,
    showSocialLinks: true,
    showProfessionalInfo: true,
    showSkillsManagement: true,
    showAvatarUpload: true,
    showProfileAnalytics: true,
    showExportOptions: true,
    showSharingOptions: true,
    showTemplateSelector: true,
    showPrivacyControls: true,
    showValidationPreview: true,
    showBulkOperations: true,
    showVersionHistory: true,
    showTabNavigation: true,
    showFloatingActions: true,
    showBreadcrumbs: true,
    showSectionCollapse: true,
  },
};

/**
 * Basic Configuration - Minimal Feature Set
 */
const BASIC_CONFIG: EnvironmentFeatureFlags = {
  appVariant: 'basic',
  debugMode: false,
  screens: {
    enableAccountSettings: true,
    enableCustomFieldsEdit: false,
    enablePrivacySettings: false,
    enableSkillsManagement: false,
    enableSocialLinksEdit: false,
  },
  background: {
    enableAnalytics: false,
    enablePerformanceMonitoring: false,
    enableAuditLogging: false,
    enableBackgroundSync: true,
    enableRealTimeUpdates: false,
    enableOfflineMode: false,
    enableCloudBackup: false,
    enableOptimisticUpdates: false,
    enableProfileVersioning: false,
    enableCachePreloading: false,
    enableEncryption: false,
    enableBiometricAuth: false,
    enableSessionManagement: true,
    enableGdprCompliance: true,
    enableAutoCompletion: false,
    enableDuplicateDetection: false,
    enableDataValidation: true,
    enableSmartSuggestions: false,
  },
  ui: {
    showCompletionBanner: true,
    showEnhancementSuggestions: false,
    showQuickActions: true,
    showSecurityStatus: false,
    showPermissionsPanel: false,
    showCustomFields: false,
    showSocialLinks: false,
    showProfessionalInfo: false,
    showSkillsManagement: false,
    showAvatarUpload: true,
    showProfileAnalytics: false,
    showExportOptions: false,
    showSharingOptions: false,
    showTemplateSelector: false,
    showPrivacyControls: true,
    showValidationPreview: false,
    showBulkOperations: false,
    showVersionHistory: false,
    showTabNavigation: false,
    showFloatingActions: false,
    showBreadcrumbs: false,
    showSectionCollapse: false,
  },
};

/**
 * Enterprise Configuration - Full Professional Feature Set
 */
const ENTERPRISE_CONFIG: EnvironmentFeatureFlags = {
  appVariant: 'enterprise',
  debugMode: false,
  screens: {
    enableAccountSettings: true,
    enableCustomFieldsEdit: true,
    enablePrivacySettings: true,
    enableSkillsManagement: true,
    enableSocialLinksEdit: true,
  },
  background: {
    enableAnalytics: true,
    enablePerformanceMonitoring: true,
    enableAuditLogging: true,
    enableBackgroundSync: true,
    enableRealTimeUpdates: true,
    enableOfflineMode: true,
    enableCloudBackup: true,
    enableOptimisticUpdates: true,
    enableProfileVersioning: true,
    enableCachePreloading: true,
    enableEncryption: true,
    enableBiometricAuth: true,
    enableSessionManagement: true,
    enableGdprCompliance: true,
    enableAutoCompletion: true,
    enableDuplicateDetection: true,
    enableDataValidation: true,
    enableSmartSuggestions: true,
  },
  ui: {
    showCompletionBanner: true,
    showEnhancementSuggestions: true,
    showQuickActions: true,
    showSecurityStatus: true,
    showPermissionsPanel: true,
    showCustomFields: true,
    showSocialLinks: true,
    showProfessionalInfo: true,
    showSkillsManagement: true,
    showAvatarUpload: true,
    showProfileAnalytics: true,
    showExportOptions: true,
    showSharingOptions: true,
    showTemplateSelector: true,
    showPrivacyControls: true,
    showValidationPreview: true,
    showBulkOperations: true,
    showVersionHistory: true,
    showTabNavigation: true,
    showFloatingActions: true,
    showBreadcrumbs: true,
    showSectionCollapse: true,
  },
};

// =============================================================================
// ENVIRONMENT LOADING FUNCTIONS
// =============================================================================

/**
 * Loads boolean feature flag from environment variable
 */
function loadBooleanFlag(envKey: string, defaultValue: boolean): boolean {
  const envValue = process.env[envKey];
  if (envValue === undefined) return defaultValue;
  return envValue.toLowerCase() === 'true';
}

/**
 * Loads app variant from environment variable
 */
function loadAppVariant(): AppVariant {
  const envVariant = process.env.APP_VARIANT || process.env.NODE_ENV || 'development';
  
  switch (envVariant) {
    case 'development':
      return 'development';
    case 'basic':
      return 'basic';
    case 'premium':
      return 'premium';
    case 'enterprise':
      return 'enterprise';
    case 'demo':
      return 'demo';
    default:
      logger.warn('Unknown app variant, defaulting to development', undefined, {
        metadata: {
          envVariant,
          availableVariants: ['development', 'basic', 'premium', 'enterprise', 'demo']
        }
      });
      return 'development';
  }
}

/**
 * Loads feature flags from environment variables
 */
function loadEnvironmentFeatureFlags(): EnvironmentFeatureFlags {
  const appVariant = loadAppVariant();
  
  // Get base configuration for app variant
  let baseConfig: EnvironmentFeatureFlags;
  switch (appVariant) {
    case 'basic':
      baseConfig = BASIC_CONFIG;
      break;
    case 'enterprise':
      baseConfig = ENTERPRISE_CONFIG;
      break;
    case 'development':
    default:
      baseConfig = DEVELOPMENT_CONFIG;
      break;
  }
  
  // Override with environment variables if present
  return {
    appVariant,
    debugMode: loadBooleanFlag('DEBUG_MODE', baseConfig.debugMode),
    
    screens: {
      enableAccountSettings: loadBooleanFlag('ENABLE_ACCOUNT_SETTINGS', baseConfig.screens.enableAccountSettings),
      enableCustomFieldsEdit: loadBooleanFlag('ENABLE_CUSTOM_FIELDS_EDIT', baseConfig.screens.enableCustomFieldsEdit),
      enablePrivacySettings: loadBooleanFlag('ENABLE_PRIVACY_SETTINGS', baseConfig.screens.enablePrivacySettings),
      enableSkillsManagement: loadBooleanFlag('ENABLE_SKILLS_MANAGEMENT', baseConfig.screens.enableSkillsManagement),
      enableSocialLinksEdit: loadBooleanFlag('ENABLE_SOCIAL_LINKS_EDIT', baseConfig.screens.enableSocialLinksEdit),
    },
    
    background: {
      enableAnalytics: loadBooleanFlag('ENABLE_ANALYTICS', baseConfig.background.enableAnalytics),
      enablePerformanceMonitoring: loadBooleanFlag('ENABLE_PERFORMANCE_MONITORING', baseConfig.background.enablePerformanceMonitoring),
      enableAuditLogging: loadBooleanFlag('ENABLE_AUDIT_LOGGING', baseConfig.background.enableAuditLogging),
      enableBackgroundSync: loadBooleanFlag('ENABLE_BACKGROUND_SYNC', baseConfig.background.enableBackgroundSync),
      enableRealTimeUpdates: loadBooleanFlag('ENABLE_REAL_TIME_UPDATES', baseConfig.background.enableRealTimeUpdates),
      enableOfflineMode: loadBooleanFlag('ENABLE_OFFLINE_MODE', baseConfig.background.enableOfflineMode),
      enableCloudBackup: loadBooleanFlag('ENABLE_CLOUD_BACKUP', baseConfig.background.enableCloudBackup),
      enableOptimisticUpdates: loadBooleanFlag('ENABLE_OPTIMISTIC_UPDATES', baseConfig.background.enableOptimisticUpdates),
      enableProfileVersioning: loadBooleanFlag('ENABLE_PROFILE_VERSIONING', baseConfig.background.enableProfileVersioning),
      enableCachePreloading: loadBooleanFlag('ENABLE_CACHE_PRELOADING', baseConfig.background.enableCachePreloading),
      enableEncryption: loadBooleanFlag('ENABLE_ENCRYPTION', baseConfig.background.enableEncryption),
      enableBiometricAuth: loadBooleanFlag('ENABLE_BIOMETRIC_AUTH', baseConfig.background.enableBiometricAuth),
      enableSessionManagement: loadBooleanFlag('ENABLE_SESSION_MANAGEMENT', baseConfig.background.enableSessionManagement),
      enableGdprCompliance: loadBooleanFlag('ENABLE_GDPR_COMPLIANCE', baseConfig.background.enableGdprCompliance),
      enableAutoCompletion: loadBooleanFlag('ENABLE_AUTO_COMPLETION', baseConfig.background.enableAutoCompletion),
      enableDuplicateDetection: loadBooleanFlag('ENABLE_DUPLICATE_DETECTION', baseConfig.background.enableDuplicateDetection),
      enableDataValidation: loadBooleanFlag('ENABLE_DATA_VALIDATION', baseConfig.background.enableDataValidation),
      enableSmartSuggestions: loadBooleanFlag('ENABLE_SMART_SUGGESTIONS', baseConfig.background.enableSmartSuggestions),
    },
    
    ui: {
      showCompletionBanner: loadBooleanFlag('SHOW_COMPLETION_BANNER', baseConfig.ui.showCompletionBanner),
      showEnhancementSuggestions: loadBooleanFlag('SHOW_ENHANCEMENT_SUGGESTIONS', baseConfig.ui.showEnhancementSuggestions),
      showQuickActions: loadBooleanFlag('SHOW_QUICK_ACTIONS', baseConfig.ui.showQuickActions),
      showSecurityStatus: loadBooleanFlag('SHOW_SECURITY_STATUS', baseConfig.ui.showSecurityStatus),
      showPermissionsPanel: loadBooleanFlag('SHOW_PERMISSIONS_PANEL', baseConfig.ui.showPermissionsPanel),
      showCustomFields: loadBooleanFlag('SHOW_CUSTOM_FIELDS', baseConfig.ui.showCustomFields),
      showSocialLinks: loadBooleanFlag('SHOW_SOCIAL_LINKS', baseConfig.ui.showSocialLinks),
      showProfessionalInfo: loadBooleanFlag('SHOW_PROFESSIONAL_INFO', baseConfig.ui.showProfessionalInfo),
      showSkillsManagement: loadBooleanFlag('SHOW_SKILLS_MANAGEMENT', baseConfig.ui.showSkillsManagement),
      showAvatarUpload: loadBooleanFlag('SHOW_AVATAR_UPLOAD', baseConfig.ui.showAvatarUpload),
      showProfileAnalytics: loadBooleanFlag('SHOW_PROFILE_ANALYTICS', baseConfig.ui.showProfileAnalytics),
      showExportOptions: loadBooleanFlag('SHOW_EXPORT_OPTIONS', baseConfig.ui.showExportOptions),
      showSharingOptions: loadBooleanFlag('SHOW_SHARING_OPTIONS', baseConfig.ui.showSharingOptions),
      showTemplateSelector: loadBooleanFlag('SHOW_TEMPLATE_SELECTOR', baseConfig.ui.showTemplateSelector),
      showPrivacyControls: loadBooleanFlag('SHOW_PRIVACY_CONTROLS', baseConfig.ui.showPrivacyControls),
      showValidationPreview: loadBooleanFlag('SHOW_VALIDATION_PREVIEW', baseConfig.ui.showValidationPreview),
      showBulkOperations: loadBooleanFlag('SHOW_BULK_OPERATIONS', baseConfig.ui.showBulkOperations),
      showVersionHistory: loadBooleanFlag('SHOW_VERSION_HISTORY', baseConfig.ui.showVersionHistory),
      showTabNavigation: loadBooleanFlag('SHOW_TAB_NAVIGATION', baseConfig.ui.showTabNavigation),
      showFloatingActions: loadBooleanFlag('SHOW_FLOATING_ACTIONS', baseConfig.ui.showFloatingActions),
      showBreadcrumbs: loadBooleanFlag('SHOW_BREADCRUMBS', baseConfig.ui.showBreadcrumbs),
      showSectionCollapse: loadBooleanFlag('SHOW_SECTION_COLLAPSE', baseConfig.ui.showSectionCollapse),
    },
  };
}

// =============================================================================
// ENVIRONMENT FEATURE FLAG SERVICE
// =============================================================================

/**
 * Environment Feature Flag Service
 */
export class EnvironmentFeatureFlagService {
  private static instance: EnvironmentFeatureFlagService;
  private config: EnvironmentFeatureFlags;

  private constructor() {
    this.config = loadEnvironmentFeatureFlags();
    
    logger.info('Environment feature flags loaded');
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): EnvironmentFeatureFlagService {
    if (!EnvironmentFeatureFlagService.instance) {
      EnvironmentFeatureFlagService.instance = new EnvironmentFeatureFlagService();
    }
    return EnvironmentFeatureFlagService.instance;
  }

  /**
   * Get complete feature flag configuration
   */
  public getConfig(): EnvironmentFeatureFlags {
    return this.config;
  }

  /**
   * Get app variant
   */
  public getAppVariant(): AppVariant {
    return this.config.appVariant;
  }

  /**
   * Check if screen is enabled
   */
  public isScreenEnabled(screen: keyof EnvironmentFeatureFlags['screens']): boolean {
    return this.config.screens[screen];
  }

  /**
   * Check if background feature is enabled
   */
  public isBackgroundFeatureEnabled(feature: keyof EnvironmentFeatureFlags['background']): boolean {
    return this.config.background[feature];
  }

  /**
   * Check if UI component should be shown
   */
  public shouldShowUIComponent(component: keyof EnvironmentFeatureFlags['ui']): boolean {
    return this.config.ui[component];
  }

  /**
   * Get debug mode status
   */
  public isDebugMode(): boolean {
    return this.config.debugMode;
  }

  /**
   * Reload configuration from environment
   */
  public reloadConfig(): void {
    this.config = loadEnvironmentFeatureFlags();
    
    logger.info('Environment feature flags reloaded');
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const environmentFeatureFlags = EnvironmentFeatureFlagService.getInstance();
export default environmentFeatureFlags; 