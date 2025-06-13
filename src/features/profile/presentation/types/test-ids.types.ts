/**
 * Profile Test IDs
 * 
 * @fileoverview Centralized test identifiers for all profile-related UI components.
 * Provides consistent test IDs for E2E testing, automated testing, and accessibility.
 * These IDs are used across all profile screens and components for reliable testing.
 * 
 * @module ProfileTestIDs
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */

/**
 * Test IDs for Privacy Settings screen
 * 
 * @description Test identifiers for privacy settings UI components and interactions.
 * 
 * @constant
 * @since 1.0.0
 */
export const PRIVACY_SETTINGS_TEST_IDS = {
  SCREEN: 'privacy-settings-screen',
  PROFILE_VISIBILITY: 'profile-visibility-setting',
  EMAIL_VISIBILITY: 'email-visibility-setting',
  PHONE_VISIBILITY: 'phone-visibility-setting',
  LOCATION_VISIBILITY: 'location-visibility-setting',
  SOCIAL_LINKS_VISIBILITY: 'social-links-visibility-setting',
  PROFESSIONAL_INFO_VISIBILITY: 'professional-info-visibility-setting',
  SHOW_ONLINE_STATUS: 'show-online-status-setting',
  ALLOW_DIRECT_MESSAGES: 'allow-direct-messages-setting',
  ALLOW_FRIEND_REQUESTS: 'allow-friend-requests-setting',
  EMAIL_NOTIFICATIONS: 'email-notifications-setting',
  PUSH_NOTIFICATIONS: 'push-notifications-setting',
  MARKETING_COMMUNICATIONS: 'marketing-communications-setting',
  SAVE_BUTTON: 'save-button',
  RESET_BUTTON: 'reset-button',
  DATA_DOWNLOAD_BUTTON: 'data-download-button',
  ACCOUNT_DELETION_BUTTON: 'account-deletion-button',
} as const;

/**
 * Test IDs for Custom Fields Edit screen
 * 
 * @description Test identifiers for custom fields management UI components.
 * 
 * @constant
 * @since 1.0.0
 */
export const CUSTOM_FIELDS_TEST_IDS = {
  SCREEN: 'custom-fields-edit-screen',
  ADD_FIELD_BUTTON: 'add-field-button',
  SAVE_BUTTON: 'save-fields-button',
  FIELD_INPUT: 'field-input',
  FIELD_TYPE_SELECT: 'field-type-select',
  SAVE_FAB: 'save-fab',
  LOADING_INDICATOR: 'loading-indicator',
  SCROLL_VIEW: 'scroll-view',
  FIELDS_SECTION: 'fields-section',
  TEMPLATES_SECTION: 'templates-section',
  SHOW_ALL_TEMPLATES_BUTTON: 'show-all-templates-button',
  TEMPLATE_CHIP: 'template-chip',
  TEMPLATE_LIST_ITEM: 'template-list-item',
  NEW_FIELD_MENU: 'new-field-menu',
  FIELD_ITEM: 'field-item',
  FIELD_REMOVE_BUTTON: 'field-remove-button',
  TIPS_SECTION: 'tips-section',
} as const;

/**
 * Test IDs for Account Settings screen
 * 
 * @description Test identifiers for account settings and management UI components.
 * 
 * @constant
 * @since 1.0.0
 */
export const ACCOUNT_SETTINGS_TEST_IDS = {
  SCREEN: 'account-settings-screen',
  PROFILE_CARD: 'profile-summary-card',
  STATS_CARD: 'account-stats-card',
  SECURITY_CARD: 'security-stats-card',
  DATA_CARD: 'data-usage-card',
  EXPORT_BUTTON: 'export-data-button',
  DELETE_BUTTON: 'delete-account-button',
  RETRY_BUTTON: 'retry-button',
  LOADING_INDICATOR: 'loading-indicator',
  SCROLL_VIEW: 'scroll-view',
  OVERVIEW_CARD: 'overview-card',
  EDIT_PROFILE_BUTTON: 'edit-profile-button',
  PRIVACY_SETTINGS_BUTTON: 'privacy-settings-button',
  ACTIONS_CARD: 'actions-card',
  DATA_STORAGE_CARD: 'data-storage-card',
} as const;

/**
 * Test IDs for Social Links Edit screen
 * 
 * @description Test identifiers for social links management UI components.
 * 
 * @constant
 * @since 1.0.0
 */
export const SOCIAL_LINKS_TEST_IDS = {
  SCREEN: 'social-links-edit-screen',
  HEADER: 'social-links-edit-header',
  SCROLL_VIEW: 'social-links-edit-scroll-view',
  LOADING_INDICATOR: 'social-links-edit-loading',
  VALIDATION_ERROR: 'social-links-validation-error',
  
  // Platform Sections
  PLATFORMS_SECTION: 'platforms-section',
  PLATFORM_ITEM: 'platform-item',
  PLATFORM_INPUT: 'platform-input',
  PLATFORM_PREVIEW: 'platform-preview',
  PLATFORM_REMOVE: 'platform-remove',
  
  // Summary Section
  SUMMARY_SECTION: 'summary-section',
  SUMMARY_ITEM: 'summary-item',
  SUMMARY_PREVIEW: 'summary-preview',
  SUMMARY_REMOVE: 'summary-remove',
  
  // Stats Section
  STATS_SECTION: 'stats-section',
  STATS_COMPLETED: 'stats-completed',
  STATS_TOTAL: 'stats-total',
  STATS_PROGRESS: 'stats-progress',
  
  // Tips Section
  TIPS_SECTION: 'social-links-tips-section',
  TIP_ITEM: 'social-link-tip-item',
  
  // Actions
  SAVE_BUTTON: 'save-button',
  SAVE_FAB: 'save-fab',
  RESET_BUTTON: 'reset-button',
  PREVIEW_ALL_BUTTON: 'preview-all-button',
  
  // Platform-specific
  LINKEDIN_INPUT: 'linkedin-input',
  GITHUB_INPUT: 'github-input',
  TWITTER_INPUT: 'twitter-input',
  INSTAGRAM_INPUT: 'instagram-input',
  WEBSITE_INPUT: 'website-input',
  PORTFOLIO_INPUT: 'portfolio-input',
} as const;

/**
 * Test IDs for Profile Edit screen
 * 
 * @description Test identifiers for profile editing UI components.
 * 
 * @constant
 * @since 1.0.0
 */
export const PROFILE_EDIT_TEST_IDS = {
  SCREEN: 'profile-edit-screen',
  FORM: 'profile-edit-form',
  FIRST_NAME_INPUT: 'profile-edit-first-name',
  LAST_NAME_INPUT: 'profile-edit-last-name',
  DISPLAY_NAME_INPUT: 'profile-edit-display-name',
  BIO_INPUT: 'profile-edit-bio',
  EMAIL_INPUT: 'profile-edit-email',
  PHONE_INPUT: 'profile-edit-phone',
  LOCATION_INPUT: 'profile-edit-location',
  WEBSITE_INPUT: 'profile-edit-website',
  COMPANY_INPUT: 'profile-edit-company',
  JOB_TITLE_INPUT: 'profile-edit-job-title',
  INDUSTRY_INPUT: 'profile-edit-industry',
  LINKEDIN_INPUT: 'profile-edit-linkedin',
  TWITTER_INPUT: 'profile-edit-twitter',
  GITHUB_INPUT: 'profile-edit-github',
  INSTAGRAM_INPUT: 'profile-edit-instagram',
  AVATAR_UPLOAD_BUTTON: 'avatar-upload-button',
  SAVE_BUTTON: 'save-button',
  CANCEL_BUTTON: 'cancel-button',
  LOADING_INDICATOR: 'loading-indicator',
  ERROR_MESSAGE: 'error-message',
  SUCCESS_MESSAGE: 'success-message',
} as const;

/**
 * Test IDs for Avatar Upload screen
 * 
 * @description Test identifiers for avatar upload and management UI components.
 * 
 * @constant
 * @since 1.0.0
 */
export const AVATAR_UPLOAD_TEST_IDS = {
  SCREEN: 'avatar-upload-screen',
  CURRENT_AVATAR: 'current-avatar',
  UPLOAD_BUTTON: 'upload-button',
  CAMERA_BUTTON: 'camera-button',
  GALLERY_BUTTON: 'gallery-button',
  CROP_BUTTON: 'crop-button',
  SAVE_BUTTON: 'save-button',
  CANCEL_BUTTON: 'cancel-button',
  PROGRESS_BAR: 'progress-bar',
  PREVIEW_IMAGE: 'preview-image',
  ERROR_MESSAGE: 'error-message',
} as const;

/**
 * Test IDs for Skills Management screen
 * 
 * @description Test identifiers for skills management UI components.
 * 
 * @constant
 * @since 1.0.0
 */
export const SKILLS_MANAGEMENT_TEST_IDS = {
  SCREEN: 'skills-management-screen',
  SKILLS_LIST: 'skills-list',
  ADD_SKILL_BUTTON: 'add-skill-button',
  SKILL_INPUT: 'skill-input',
  SKILL_ITEM: 'skill-item',
  REMOVE_SKILL_BUTTON: 'remove-skill-button',
  SAVE_BUTTON: 'save-button',
  SUGGESTIONS_LIST: 'suggestions-list',
  SUGGESTION_ITEM: 'suggestion-item',
  SEARCH_INPUT: 'search-input',
  CLEAR_ALL_BUTTON: 'clear-all-button',
} as const;

/**
 * Test IDs for Profile Navigation
 * 
 * @description Test identifiers for profile navigation components.
 * 
 * @constant
 * @since 1.0.0
 */
export const PROFILE_NAVIGATION_TEST_IDS = {
  PROFILE_SCREEN: 'profile-screen',
  EDIT_PROFILE_BUTTON: 'edit-profile-button',
  SETTINGS_BUTTON: 'settings-button',
  BACK_BUTTON: 'back-button',
  MENU_BUTTON: 'menu-button',
  TAB_BAR: 'profile-tab-bar',
  HEADER: 'profile-header',
} as const;

/**
 * Combined test IDs type for type safety
 * 
 * @description Union type of all test ID constants for type-safe access.
 * 
 * @typedef {string} ProfileTestID
 * @since 1.0.0
 */
export type PrivacySettingsTestID = typeof PRIVACY_SETTINGS_TEST_IDS[keyof typeof PRIVACY_SETTINGS_TEST_IDS];
export type CustomFieldsTestID = typeof CUSTOM_FIELDS_TEST_IDS[keyof typeof CUSTOM_FIELDS_TEST_IDS];
export type AccountSettingsTestID = typeof ACCOUNT_SETTINGS_TEST_IDS[keyof typeof ACCOUNT_SETTINGS_TEST_IDS];
export type SocialLinksTestID = typeof SOCIAL_LINKS_TEST_IDS[keyof typeof SOCIAL_LINKS_TEST_IDS];
export type ProfileEditTestID = typeof PROFILE_EDIT_TEST_IDS[keyof typeof PROFILE_EDIT_TEST_IDS];
export type AvatarUploadTestID = typeof AVATAR_UPLOAD_TEST_IDS[keyof typeof AVATAR_UPLOAD_TEST_IDS];
export type SkillsManagementTestID = typeof SKILLS_MANAGEMENT_TEST_IDS[keyof typeof SKILLS_MANAGEMENT_TEST_IDS];
export type ProfileNavigationTestID = typeof PROFILE_NAVIGATION_TEST_IDS[keyof typeof PROFILE_NAVIGATION_TEST_IDS];

/**
 * All profile test IDs combined
 * 
 * @description Union of all profile-related test IDs for comprehensive type safety.
 * 
 * @typedef {string} AllProfileTestIDs
 * @since 1.0.0
 */
export type AllProfileTestIDs = 
  | PrivacySettingsTestID
  | CustomFieldsTestID
  | AccountSettingsTestID
  | SocialLinksTestID
  | ProfileEditTestID
  | AvatarUploadTestID
  | SkillsManagementTestID
  | ProfileNavigationTestID; 