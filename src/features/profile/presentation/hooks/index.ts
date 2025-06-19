/**
 * @fileoverview Profile Hooks Export - Mobile First
 *
 * 🎯 MOBILE APP HOOK EXPORTS:
 * - Essential Profile Management Hooks
 * - Mobile-First Architecture
 * - Clean & Simple Exports
 */

// =============================================================================
// 🎯 MOBILE APP HOOK EXPORTS
// =============================================================================

// Core Profile Hooks
export { useProfile } from './use-profile.hook';
export { useProfileForm } from './use-profile-form.hook';
export { useProfileQuery } from './use-profile-query.hook';
export { useProfileDeletion } from './use-profile-deletion.hook';
export { useProfileRefresh } from './use-profile-refresh.hook';

// Profile Features
export { useAvatar } from './use-avatar.hook';
export { useAccountSettings } from './use-account-settings.hook';
export { useProfileCompleteness } from './use-profile-completeness.hook';
export { useSkillsManagement } from './use-skills-management.hook';
export { useSocialLinksEdit } from './use-social-links-edit.hook';

// UI & Screen Management
export { useProfileScreen } from './use-profile-screen.hook';
export { useProfileUIState as useProfileUiState } from './use-profile-ui-state.hook';

// Feature Flags
export {
  useFeatureFlag,
  FeatureFlagUtils,
  ProfileScreenFeatureFlag,
  SCREEN_FEATURE_MAP,
  type UseFeatureFlagReturn,
  type ScreenName,
} from './use-feature-flag.hook';

// =============================================================================
// 🏛️ ENTERPRISE FEATURES MOVED TO BACKEND/ADMIN PANEL
// =============================================================================

/**
 * Enterprise Features Documentation:
 *
 * The following features have been moved to appropriate systems:
 * - Professional Intelligence → Web Portal
 * - Skills Analysis → Analytics System
 * - Career Tracking → Learning Platform
 * - Network Analysis → Backend Services
 * - Benchmarking → Admin Panel
 * - Performance Monitoring → Monitoring Dashboard
 * - Advanced Caching → Backend Infrastructure
 *
 * Mobile apps focus on essential user features only.
 */
