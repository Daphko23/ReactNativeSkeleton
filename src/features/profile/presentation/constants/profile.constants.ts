/**
 * Profile Constants - Consolidated Enterprise Configuration
 * Centralized configuration for all profile-related constraints, UI, and behavior
 */

export const PROFILE_CONSTANTS = {
  // ===========================================
  // BUSINESS LOGIC & VALIDATION CONSTRAINTS
  // ===========================================
  
  // Field Length Limits
  FIELD_LIMITS: {
    MAX_NAME_LENGTH: 50,
    MAX_DISPLAY_NAME_LENGTH: 100,
    MAX_BIO_LENGTH: 500,
    MAX_COMPANY_LENGTH: 100,
    MAX_JOB_TITLE_LENGTH: 100,
    MAX_LOCATION_LENGTH: 100,
    MAX_WEBSITE_LENGTH: 255,
    MAX_PHONE_LENGTH: 20,
    MAX_INDUSTRY_LENGTH: 100,
    
    // Skills
    MAX_SKILLS: 20,
    MAX_SKILL_LENGTH: 50,
    
    // Custom Fields
    MAX_NOTES_LENGTH: 1000,
    
    // URLs
    MAX_URL_LENGTH: 255,
  },
  
  // Validation Patterns
  VALIDATION: {
    URL_PATTERN: /^https?:\/\/.+\..+/,
    EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE_PATTERN: /^(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/,
  },
  
  // ===========================================
  // UI CONFIGURATION & BEHAVIOR
  // ===========================================
  
  // UI Constants
  UI: {
    AVATAR_SIZE: 80,
    DEFAULT_FORM_SPACING: 16,
    KEYBOARD_OFFSET: 64,
    REFRESH_DEBOUNCE_TIME: 500,
  },
  
  // Completeness Thresholds
  COMPLETENESS_THRESHOLDS: {
    LOW: 33,
    MEDIUM: 66,
    HIGH: 90,
  },
  
  // Animation Durations
  ANIMATION: {
    REFRESH_DURATION: 300,
    FADE_DURATION: 200,
  },
  
  // ===========================================
  // TEST IDS FOR E2E TESTING
  // ===========================================
  TEST_IDS: {
    // Screen Level
    SCREEN: 'profile-screen',
    
    // Header Components
    HEADER_CARD: 'profile-header-card',
    AVATAR: 'profile-avatar',
    DISPLAY_NAME: 'profile-display-name',
    BIO: 'profile-bio',
    COMPLETENESS_INDICATOR: 'profile-completeness-indicator',
    
    // Action Components
    ACTIONS_CARD: 'profile-actions-card',
    EDIT_BUTTON: 'profile-edit-button',
    AVATAR_UPLOAD_BUTTON: 'profile-avatar-upload-button',
    
    // Information Components
    INFO_CARD: 'profile-info-card',
    ERROR_CARD: 'profile-error-card',
    
    // Interaction Components
    REFRESH_CONTROL: 'profile-refresh-control',
    EMPTY_STATE: 'profile-empty-state',
    CREATE_PROFILE_BUTTON: 'create-profile-button',
    
    // Navigation Components
    NAVIGATION_SECTION: 'profile-navigation-section',
    
    // Auth Components
    LOGOUT_BUTTON: 'profile-logout-button',
  },
  
  // ===========================================
  // ANALYTICS EVENTS
  // ===========================================
  ANALYTICS_EVENTS: {
    // Core Profile Events
    SCREEN_VIEW: 'profile_screen_viewed',
    EDIT_PROFILE_CLICKED: 'edit_profile_clicked',
    AVATAR_UPLOAD_CLICKED: 'avatar_upload_clicked',
    PROFILE_REFRESHED: 'profile_refreshed',
    EMPTY_STATE_CREATE_CLICKED: 'empty_state_create_clicked',
    
    // Navigation Events
    ACCOUNT_SETTINGS_CLICKED: 'account_settings_clicked',
    CUSTOM_FIELDS_CLICKED: 'custom_fields_clicked',
    PRIVACY_SETTINGS_CLICKED: 'privacy_settings_clicked',
    PROFILE_HISTORY_CLICKED: 'profile_history_clicked',
    SKILLS_MANAGEMENT_CLICKED: 'skills_management_clicked',
    SOCIAL_LINKS_CLICKED: 'social_links_clicked',
    
    // Auth Events
    LOGOUT_CLICKED: 'profile_logout_clicked',
  },
} as const;

// ===========================================
// TYPE EXPORTS
// ===========================================
export type ProfileConstants = typeof PROFILE_CONSTANTS;
export type ProfileTestIds = typeof PROFILE_CONSTANTS.TEST_IDS;
export type ProfileAnalytics = typeof PROFILE_CONSTANTS.ANALYTICS_EVENTS;
export type ProfileFieldLimits = typeof PROFILE_CONSTANTS.FIELD_LIMITS;
export type ProfileValidation = typeof PROFILE_CONSTANTS.VALIDATION;

// ===========================================
// BACKWARD COMPATIBILITY EXPORTS
// ===========================================
// Für bestehenden Code, der die alten Strukturen erwartet
export const PROFILE_SCREEN_CONSTANTS = PROFILE_CONSTANTS;
export type ProfileScreenTestIds = ProfileTestIds;
export type ProfileScreenAnalytics = ProfileAnalytics; 