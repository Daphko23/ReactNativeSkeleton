/**
 * Profile Navigation Types
 * 
 * @fileoverview Presentation layer navigation type definitions for profile screens.
 * Defines screen navigation parameters, props interfaces, and route configurations
 * for all profile-related screens. These types are specific to the presentation
 * layer and handle UI navigation concerns.
 * 
 * @module ProfileNavigationTypes
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */

import { StackNavigationProp } from '@react-navigation/stack';

/**
 * Base screen props interface for all profile screens
 * 
 * @description Common properties shared by all profile screen components.
 * Provides consistent navigation and testing interfaces across screens.
 * 
 * @interface BaseProfileScreenProps
 * @property {any} navigation - React Navigation instance
 * @property {any} route - React Navigation route object
 * @property {string} [testID] - Optional test identifier for E2E testing
 * 
 * @since 1.0.0
 */
export interface BaseProfileScreenProps {
  navigation: any;
  route: any;
  testID?: string;
}

/**
 * Generic screen props type for all profile screens
 * 
 * @description Unified type for all profile screen components.
 * Replaces individual screen prop types for better maintainability.
 * 
 * @template T - Additional props specific to the screen
 * @typedef {BaseProfileScreenProps & T} ProfileScreenProps
 * @since 2.0.0
 */
export type ProfileScreenProps<T = object> = BaseProfileScreenProps & T;

// =============================================================================
// LEGACY TYPES - Deprecated but kept for backwards compatibility
// =============================================================================

/**
 * @deprecated Use ProfileScreenProps instead
 * @since 1.0.0
 */
export type PrivacySettingsScreenProps = BaseProfileScreenProps;

/**
 * @deprecated Use ProfileScreenProps instead
 * @since 1.0.0
 */
export type CustomFieldsEditScreenProps = BaseProfileScreenProps;

/**
 * @deprecated Use ProfileScreenProps instead
 * @since 1.0.0
 */
export type AccountSettingsScreenProps = BaseProfileScreenProps;

/**
 * @deprecated Use ProfileScreenProps instead
 * @since 1.0.0
 */
export type SocialLinksEditScreenProps = BaseProfileScreenProps;

/**
 * @deprecated Use ProfileScreenProps instead
 * @since 1.0.0
 */
export type ProfileEditScreenProps = BaseProfileScreenProps;

/**
 * @deprecated Use ProfileScreenProps instead
 * @since 1.0.0
 */
export type AvatarUploadScreenProps = BaseProfileScreenProps;

/**
 * @deprecated Use ProfileScreenProps instead
 * @since 1.0.0
 */
export type SkillsManagementScreenProps = BaseProfileScreenProps;

/**
 * Navigation prop type for Social Links Edit screen
 * 
 * @description Typed navigation prop with specific route parameters.
 * 
 * @interface SocialLinksEditScreenNavigationProp
 * @property {StackNavigationProp<any>} navigation - Stack navigation instance
 * @property {any} [route] - Route object with parameters
 * 
 * @since 1.0.0
 */
export interface SocialLinksEditScreenNavigationProp {
  navigation: StackNavigationProp<any>;
  route?: any;
}

/**
 * Screen state interface for complex screens
 * 
 * @description Generic interface for screen-level state management.
 * Used by screens that manage complex local state.
 * 
 * @interface BaseScreenState
 * @template T - Type of the main data
 * @property {T} data - Main screen data
 * @property {boolean} isLoading - Loading state
 * @property {boolean} isSaving - Saving state
 * @property {boolean} hasChanges - Unsaved changes indicator
 * @property {string | null} error - Current error message
 * @property {Record<string, string>} validationErrors - Field validation errors
 * 
 * @since 1.0.0
 */
export interface BaseScreenState<T = any> {
  data: T;
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
}

/**
 * Common navigation methods interface
 * 
 * @description Standard navigation methods available to screen components.
 * Provides type safety for common navigation operations.
 * 
 * @interface NavigationMethods
 * @since 1.0.0
 */
export interface NavigationMethods {
  goBack(): void;
  navigate(name: string, params?: any): void;
  push(name: string, params?: any): void;
  replace(name: string, params?: any): void;
  reset(state: any): void;
  canGoBack(): boolean;
}

/**
 * Screen lifecycle methods interface
 * 
 * @description Common lifecycle methods for screen components.
 * Provides consistent patterns for screen initialization and cleanup.
 * 
 * @interface ScreenLifecycleMethods
 * @since 1.0.0
 */
export interface ScreenLifecycleMethods {
  onScreenFocus?(): void;
  onScreenBlur?(): void;
  onScreenEnter?(): void;
  onScreenLeave?(): void;
  onRefresh?(): Promise<void>;
} 