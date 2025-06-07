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
 * Privacy Settings screen props
 * 
 * @description Type-safe props for the Privacy Settings screen component.
 * 
 * @typedef {BaseProfileScreenProps} PrivacySettingsScreenProps
 * @since 1.0.0
 */
export type PrivacySettingsScreenProps = BaseProfileScreenProps;

/**
 * Custom Fields Edit screen props
 * 
 * @description Type-safe props for the Custom Fields Edit screen component.
 * 
 * @typedef {BaseProfileScreenProps} CustomFieldsEditScreenProps
 * @since 1.0.0
 */
export type CustomFieldsEditScreenProps = BaseProfileScreenProps;

/**
 * Account Settings screen props
 * 
 * @description Type-safe props for the Account Settings screen component.
 * 
 * @typedef {BaseProfileScreenProps} AccountSettingsScreenProps
 * @since 1.0.0
 */
export type AccountSettingsScreenProps = BaseProfileScreenProps;

/**
 * Social Links Edit screen props
 * 
 * @description Type-safe props for the Social Links Edit screen component.
 * 
 * @typedef {BaseProfileScreenProps} SocialLinksEditScreenProps
 * @since 1.0.0
 */
export type SocialLinksEditScreenProps = BaseProfileScreenProps;

/**
 * Profile Edit screen props
 * 
 * @description Type-safe props for the Profile Edit screen component.
 * 
 * @typedef {BaseProfileScreenProps} ProfileEditScreenProps
 * @since 1.0.0
 */
export type ProfileEditScreenProps = BaseProfileScreenProps;

/**
 * Avatar Upload screen props
 * 
 * @description Type-safe props for the Avatar Upload screen component.
 * 
 * @typedef {BaseProfileScreenProps} AvatarUploadScreenProps
 * @since 1.0.0
 */
export type AvatarUploadScreenProps = BaseProfileScreenProps;

/**
 * Skills Management screen props
 * 
 * @description Type-safe props for the Skills Management screen component.
 * 
 * @typedef {BaseProfileScreenProps} SkillsManagementScreenProps
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