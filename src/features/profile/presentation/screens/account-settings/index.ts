/**
 * Account Settings Screen - Module Exports
 * Centralized exports for the account settings screen module
 */

export { AccountSettingsScreen as default } from './account-settings.screen';
export { AccountSettingsScreen } from './account-settings.screen';

// Components are deleted - they are now part of shared components

// Hooks and types are migrated to presentation layer
export { useAccountSettings } from '../../hooks/use-account-settings.hook';

export { createAccountSettingsScreenStyles } from './account-settings.screen.styles'; 