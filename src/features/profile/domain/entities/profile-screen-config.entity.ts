/**
 * ProfileScreenConfiguration Entity - Enterprise Configuration Management
 * 🚀 ENTERPRISE: Feature Flags, Security Settings, Business Rules, Permissions
 * ✅ DOMAIN LAYER: Configuration Business Logic für Profile Screen
 */

/**
 * @enum FeatureFlag - Available feature flags for profile screen
 */
export enum ProfileScreenFeatureFlag {
  // Background Functionality Flags
  ENABLE_ANALYTICS = 'enable_analytics',
  ENABLE_OFFLINE_MODE = 'enable_offline_mode',
  ENABLE_REAL_TIME = 'enable_real_time',
  ENABLE_ADVANCED_SHARING = 'enable_advanced_sharing',
  ENABLE_CUSTOM_FIELDS = 'enable_custom_fields',
  ENABLE_AVATAR_UPLOAD = 'enable_avatar_upload',
  ENABLE_EXPORT = 'enable_export',
  ENABLE_PERFORMANCE_MONITORING = 'enable_performance_monitoring',

  // Screen-Level Feature Flags (Build-Time Configuration)
  ENABLE_ACCOUNT_SETTINGS = 'enable_account_settings',
  ENABLE_CUSTOM_FIELDS_EDIT = 'enable_custom_fields_edit',
  ENABLE_PRIVACY_SETTINGS = 'enable_privacy_settings',
  ENABLE_SKILLS_MANAGEMENT = 'enable_skills_management',
  ENABLE_SOCIAL_LINKS_EDIT = 'enable_social_links_edit'
}

/**
 * @enum SecurityLevel - Security levels for profile access
 */
export enum ProfileSecurityLevel {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  VERIFIED = 'verified',
  ADMIN = 'admin'
}

/**
 * @enum ThemeMode - Available theme options
 */
export enum ProfileThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  HIGH_CONTRAST = 'high_contrast'
}

/**
 * @interface SecuritySettings - Security configuration for profile screen
 */
export interface ProfileSecuritySettings {
  readonly requiredSecurityLevel: ProfileSecurityLevel;
  readonly enableAuditLogging: boolean;
  readonly maxFailedAttempts: number;
  readonly sessionTimeoutMinutes: number;
  readonly requireReauthForSensitiveActions: boolean;
  readonly allowedFileTypes: string[];
  readonly maxFileSize: number; // bytes
  readonly enableDataEncryption: boolean;
}

/**
 * @interface LayoutSettings - UI layout and display configuration
 */
export interface ProfileLayoutSettings {
  readonly defaultTheme: ProfileThemeMode;
  readonly defaultDensity: 'compact' | 'comfortable' | 'spacious';
  readonly enableAnimations: boolean;
  readonly maxCustomFieldsVisible: number;
  readonly showCompletionBanner: boolean;
  readonly enableHapticFeedback: boolean;
  readonly defaultLanguage: string;
}

/**
 * @interface BusinessRules - Business logic rules and constraints
 */
export interface ProfileBusinessRules {
  readonly maxCustomFields: number;
  readonly maxBioLength: number;
  readonly allowedCountries: string[];
  readonly requiredFields: string[];
  readonly cacheStrategy: 'aggressive' | 'conservative' | 'disabled';
  readonly syncFrequencyMinutes: number;
  readonly dataRetentionDays: number;
  readonly enableGDPRCompliance: boolean;
}

/**
 * @interface PermissionSettings - User permissions and access control
 */
export interface ProfilePermissionSettings {
  readonly canEdit: boolean;
  readonly canShare: boolean;
  readonly canExport: boolean;
  readonly canDeleteAvatar: boolean;
  readonly canViewAnalytics: boolean;
  readonly canAccessPrivacySettings: boolean;
  readonly canManageCustomFields: boolean;
  readonly restrictedSections: string[];
}

/**
 * @interface FeatureFlagState - Current state of all feature flags
 */
export interface ProfileFeatureFlagState {
  readonly flags: Record<ProfileScreenFeatureFlag, boolean>;
  readonly overrides: Record<string, boolean>; // User-specific overrides
  readonly experiments: Record<string, any>; // A/B testing
  readonly rolloutPercentage: Record<ProfileScreenFeatureFlag, number>;
}

/**
 * @class ProfileScreenConfiguration - Enterprise Configuration Management
 */
export class ProfileScreenConfiguration {
  private readonly _userId: string;
  private readonly _organizationId: string;
  private _featureFlags: ProfileFeatureFlagState;
  private _securitySettings: ProfileSecuritySettings;
  private _layoutSettings: ProfileLayoutSettings;
  private _businessRules: ProfileBusinessRules;
  private _permissions: ProfilePermissionSettings;
  private readonly _version: string;
  private readonly _createdAt: Date;
  private _lastUpdated: Date;

  constructor(config: {
    userId: string;
    organizationId: string;
    version?: string;
  }) {
    this._userId = config.userId;
    this._organizationId = config.organizationId;
    this._version = config.version || '1.0.0';
    this._createdAt = new Date();
    this._lastUpdated = new Date();

         // Initialize default feature flags
     this._featureFlags = {
       flags: {
         // Background Functionality Flags
         [ProfileScreenFeatureFlag.ENABLE_ANALYTICS]: true,
         [ProfileScreenFeatureFlag.ENABLE_OFFLINE_MODE]: true,
         [ProfileScreenFeatureFlag.ENABLE_REAL_TIME]: false,
         [ProfileScreenFeatureFlag.ENABLE_ADVANCED_SHARING]: true,
         [ProfileScreenFeatureFlag.ENABLE_CUSTOM_FIELDS]: true,
         [ProfileScreenFeatureFlag.ENABLE_AVATAR_UPLOAD]: true,
         [ProfileScreenFeatureFlag.ENABLE_EXPORT]: false,
         [ProfileScreenFeatureFlag.ENABLE_PERFORMANCE_MONITORING]: true,

         // Screen-Level Feature Flags (Build-Time Configuration)
         [ProfileScreenFeatureFlag.ENABLE_ACCOUNT_SETTINGS]: true,
         [ProfileScreenFeatureFlag.ENABLE_CUSTOM_FIELDS_EDIT]: true,
         [ProfileScreenFeatureFlag.ENABLE_PRIVACY_SETTINGS]: true,
         [ProfileScreenFeatureFlag.ENABLE_SKILLS_MANAGEMENT]: true,
         [ProfileScreenFeatureFlag.ENABLE_SOCIAL_LINKS_EDIT]: true
       },
       overrides: {},
       experiments: {},
       rolloutPercentage: {} as Record<ProfileScreenFeatureFlag, number>
     };

    // Initialize default security settings
    this._securitySettings = {
      requiredSecurityLevel: ProfileSecurityLevel.AUTHENTICATED,
      enableAuditLogging: true,
      maxFailedAttempts: 5,
      sessionTimeoutMinutes: 60,
      requireReauthForSensitiveActions: false,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif'],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      enableDataEncryption: true
    };

    // Initialize default layout settings
    this._layoutSettings = {
      defaultTheme: ProfileThemeMode.AUTO,
      defaultDensity: 'comfortable',
      enableAnimations: true,
      maxCustomFieldsVisible: 5,
      showCompletionBanner: true,
      enableHapticFeedback: true,
      defaultLanguage: 'en'
    };

    // Initialize default business rules
    this._businessRules = {
      maxCustomFields: 10,
      maxBioLength: 500,
      allowedCountries: [],
      requiredFields: ['firstName', 'lastName'],
      cacheStrategy: 'conservative',
      syncFrequencyMinutes: 15,
      dataRetentionDays: 365,
      enableGDPRCompliance: true
    };

    // Initialize default permissions
    this._permissions = {
      canEdit: true,
      canShare: true,
      canExport: false,
      canDeleteAvatar: true,
      canViewAnalytics: false,
      canAccessPrivacySettings: true,
      canManageCustomFields: true,
      restrictedSections: []
    };
  }

  // Getters
  get userId(): string { return this._userId; }
  get organizationId(): string { return this._organizationId; }
  get featureFlags(): ProfileFeatureFlagState { return { ...this._featureFlags }; }
  get securitySettings(): ProfileSecuritySettings { return { ...this._securitySettings }; }
  get layoutSettings(): ProfileLayoutSettings { return { ...this._layoutSettings }; }
  get businessRules(): ProfileBusinessRules { return { ...this._businessRules }; }
  get permissions(): ProfilePermissionSettings { return { ...this._permissions }; }
  get version(): string { return this._version; }
  get lastUpdated(): Date { return this._lastUpdated; }

  // Feature Flag Methods
  isFeatureEnabled(flag: ProfileScreenFeatureFlag): boolean {
    // Check user-specific override first
    const userOverride = this._featureFlags.overrides[`${this._userId}_${flag}`];
    if (userOverride !== undefined) {
      return userOverride;
    }

    // Check rollout percentage
    const rollout = this._featureFlags.rolloutPercentage[flag];
    if (rollout !== undefined) {
      const userHash = this.getUserHash();
      if (userHash > rollout) {
        return false;
      }
    }

    return this._featureFlags.flags[flag] || false;
  }

  enableFeature(flag: ProfileScreenFeatureFlag, override?: boolean): boolean {
    if (this.canModifyFeature(flag)) {
      if (override) {
        this._featureFlags.overrides[`${this._userId}_${flag}`] = true;
      } else {
        this._featureFlags.flags[flag] = true;
      }
      this._lastUpdated = new Date();
      return true;
    }
    return false;
  }

  disableFeature(flag: ProfileScreenFeatureFlag, override?: boolean): boolean {
    if (this.canModifyFeature(flag)) {
      if (override) {
        this._featureFlags.overrides[`${this._userId}_${flag}`] = false;
      } else {
        this._featureFlags.flags[flag] = false;
      }
      this._lastUpdated = new Date();
      return true;
    }
    return false;
  }

  // Permission Methods
  hasPermission(action: keyof ProfilePermissionSettings): boolean {
    return this._permissions[action] === true;
  }

  updatePermissions(permissions: Partial<ProfilePermissionSettings>): boolean {
    if (this.canModifyPermissions()) {
      this._permissions = { ...this._permissions, ...permissions };
      this._lastUpdated = new Date();
      return true;
    }
    return false;
  }

  // Security Methods
  updateSecuritySettings(settings: Partial<ProfileSecuritySettings>): boolean {
    if (this.canModifySecuritySettings()) {
      this._securitySettings = { ...this._securitySettings, ...settings };
      this._lastUpdated = new Date();
      return true;
    }
    return false;
  }

  validateFileUpload(fileName: string, fileSize: number): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (!extension || !this._securitySettings.allowedFileTypes.includes(extension)) {
      return false;
    }
    
    if (fileSize > this._securitySettings.maxFileSize) {
      return false;
    }

    return true;
  }

  // Business Rules Methods
  validateCustomFieldCount(currentCount: number): boolean {
    return currentCount < this._businessRules.maxCustomFields;
  }

  validateBioLength(bioText: string): boolean {
    return bioText.length <= this._businessRules.maxBioLength;
  }

  isFieldRequired(fieldName: string): boolean {
    return this._businessRules.requiredFields.includes(fieldName);
  }

  // Layout Methods
  updateLayoutSettings(settings: Partial<ProfileLayoutSettings>): void {
    this._layoutSettings = { ...this._layoutSettings, ...settings };
    this._lastUpdated = new Date();
  }

  // Validation Methods
  private canModifyFeature(flag: ProfileScreenFeatureFlag): boolean {
    // Add business logic for who can modify which features
    return this.hasAdminAccess() || flag !== ProfileScreenFeatureFlag.ENABLE_PERFORMANCE_MONITORING;
  }

  private canModifyPermissions(): boolean {
    return this.hasAdminAccess();
  }

  private canModifySecuritySettings(): boolean {
    return this.hasAdminAccess();
  }

  private hasAdminAccess(): boolean {
    return this._securitySettings.requiredSecurityLevel === ProfileSecurityLevel.ADMIN;
  }

  private getUserHash(): number {
    // Simple hash function for rollout percentage
    let hash = 0;
    for (let i = 0; i < this._userId.length; i++) {
      const char = this._userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 100;
  }

  // Utility Methods
  toJSON(): Record<string, any> {
    return {
      userId: this._userId,
      organizationId: this._organizationId,
      featureFlags: this._featureFlags,
      securitySettings: this._securitySettings,
      layoutSettings: this._layoutSettings,
      businessRules: this._businessRules,
      permissions: this._permissions,
      version: this._version,
      createdAt: this._createdAt.toISOString(),
      lastUpdated: this._lastUpdated.toISOString()
    };
  }

  getEnabledFeatures(): ProfileScreenFeatureFlag[] {
    return Object.values(ProfileScreenFeatureFlag).filter(flag => this.isFeatureEnabled(flag));
  }

  getSecuritySummary(): Record<string, any> {
    return {
      securityLevel: this._securitySettings.requiredSecurityLevel,
      auditingEnabled: this._securitySettings.enableAuditLogging,
      encryptionEnabled: this._securitySettings.enableDataEncryption,
      maxFileSize: `${this._securitySettings.maxFileSize / (1024 * 1024)}MB`,
      allowedFileTypes: this._securitySettings.allowedFileTypes.join(', ')
    };
  }
}

export const createProfileScreenConfiguration = (config: {
  userId: string;
  organizationId: string;
  version?: string;
}): ProfileScreenConfiguration => {
  return new ProfileScreenConfiguration(config);
}; 