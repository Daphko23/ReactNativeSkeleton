/**
 * ProfileNavigator - Presentation Layer
 * Navigation configuration for the profile feature
 * 
 * @fileoverview Defines the navigation stack and routing for the profile feature module.
 * Includes type-safe navigation parameters and helper functions for navigation operations.
 * 
 * @module ProfileNavigator
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'react-native-paper';
import { useTheme } from '@core/theme/theme.system';

// Screens
import ProfileScreen from '../screens/profile';
import ProfileEditScreen from '../screens/profile-edit';
import { PrivacySettingsScreen } from '../screens/privacy-settings';
import { AccountSettingsScreen } from '../screens/account-settings';
import { AvatarUploadScreen } from '../screens/avatar-upload';
import { SkillsManagementScreen } from '../screens/skills-management';
import { SocialLinksEditScreen } from '../screens/social-links-edit';
import { CustomFieldsEditScreen } from '../screens/custom-fields-edit';
import { ProfileAvatarDemoScreen } from '../screens/profile-avatar-demo/profile-avatar-demo.screen';

/**
 * Type definition for the Profile navigation stack parameters.
 * 
 * @description Defines the parameter types for each screen in the profile navigation stack.
 * This ensures type safety when navigating between screens and passing parameters.
 * 
 * @interface ProfileStackParamList
 * @property {Object} Profile - Main profile screen parameters
 * @property {string} [Profile.userId] - Optional user ID for viewing other users' profiles
 * @property {boolean} [Profile.readOnly] - Whether the profile should be displayed in read-only mode
 * @property {undefined} ProfileEdit - Profile edit screen (no parameters)
 * @property {undefined} PrivacySettings - Privacy settings screen (no parameters)
 * @property {undefined} AccountSettings - Account settings screen (no parameters)
 * @property {undefined} ProfileAvatarDemo - Avatar demo screen (no parameters)
 * @property {Object} AvatarUpload - Avatar upload screen parameters
 * @property {string} [AvatarUpload.currentAvatar] - Current avatar URL for preview
 * @property {undefined} SkillsManagement - Skills management screen (no parameters)
 * @property {undefined} SocialLinksEdit - Social links edit screen (no parameters)
 * @property {undefined} CustomFieldsEdit - Custom fields edit screen (no parameters)
 * 
 * @since 1.0.0
 */
export type ProfileStackParamList = {
  Profile: {
    userId?: string;
    readOnly?: boolean;
  };
  ProfileEdit: undefined;
  PrivacySettings: undefined;
  AccountSettings: undefined;
  ProfileAvatarDemo: undefined;
  AvatarUpload: {
    currentAvatar?: string;
  };
  SkillsManagement: undefined;
  SocialLinksEdit: undefined;
  CustomFieldsEdit: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

/**
 * Profile Navigator Component
 * 
 * @description Main navigation component for the profile feature. Configures the stack navigator
 * with all profile-related screens and their options. Implements type-safe navigation with proper
 * header configurations and screen options.
 * 
 * @component
 * @returns {React.JSX.Element} The configured stack navigator for profile screens
 * 
 * @example
 * ```tsx
 * <ProfileNavigator />
 * ```
 * 
 * @since 1.0.0
 * @see {@link ProfileStackParamList} for parameter types
 */
export function ProfileNavigator(): React.JSX.Element {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text,
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {/* Main Profile Screen */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation, route }) => ({
          title: t('profile.mainScreen.title'),
          headerRight: () => {
            // Only show edit button for own profile
            if (!route.params?.userId && !route.params?.readOnly) {
              return (
                <IconButton
                  icon="pencil"
                  onPress={() => navigation.navigate('ProfileEdit')}
                />
              );
            }
            return null;
          },
        })}
      />

      {/* Profile Edit Screen */}
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={({ navigation }) => ({
          title: t('profile.editScreen.title'),
          presentation: 'modal',
          headerLeft: () => (
            <IconButton
              icon="close"
              onPress={() => navigation.goBack()}
            />
          ),
          headerRight: () => (
            <IconButton
              icon="content-save"
              onPress={() => {
                // This will be handled by the screen component
                // We need to pass the save function to the navigation options
              }}
            />
          ),
        })}
      />

      {/* Privacy Settings Screen */}
      <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettingsScreen}
        options={{
          title: t('profile.privacyScreen.title'),
        }}
      />

      {/* Account Settings Screen */}
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{
          title: t('profile.accountScreen.title'),
        }}
      />

      {/* Avatar Upload Screen */}
      <Stack.Screen
        name="AvatarUpload"
        component={AvatarUploadScreen}
        options={{
          title: t('profile.navigation.avatarUpload'),
          presentation: 'modal',
        }}
      />

      {/* Skills Management Screen */}
      <Stack.Screen
        name="SkillsManagement"
        component={SkillsManagementScreen}
        options={{
          title: t('profile.skillsScreen.title'),
        }}
      />

      {/* Social Links Edit Screen */}
      <Stack.Screen
        name="SocialLinksEdit"
        component={SocialLinksEditScreen}
        options={{
          title: t('profile.socialLinksScreen.title'),
        }}
      />

      {/* Custom Fields Edit Screen */}
      <Stack.Screen
        name="CustomFieldsEdit"
        component={CustomFieldsEditScreen}
        options={{
          title: t('profile.customFieldsScreen.title'),
        }}
      />

      {/* Profile Avatar Demo Screen */}
      <Stack.Screen
        name="ProfileAvatarDemo"
        component={ProfileAvatarDemoScreen}
        options={{
          title: t('profile.avatarDemoScreen.title'),
        }}
      />
    </Stack.Navigator>
  );
}

/**
 * Navigation Helper Functions
 * 
 * @description Collection of type-safe navigation helper functions for the profile feature.
 * These functions provide a consistent API for navigating between profile screens and
 * ensure proper parameter passing.
 * 
 * @namespace profileNavigationHelpers
 * @since 1.0.0
 */
export const profileNavigationHelpers = {
  /**
   * Navigate to user profile screen
   * 
   * @description Navigates to the main profile screen with optional parameters for viewing
   * other users' profiles or setting read-only mode.
   * 
   * @param {any} navigation - React Navigation instance
   * @param {string} [userId] - Optional user ID to view specific user's profile
   * @param {boolean} [readOnly=false] - Whether to display profile in read-only mode
   * 
   * @example
   * ```tsx
   * // Navigate to own profile
   * profileNavigationHelpers.navigateToProfile(navigation);
   * 
   * // Navigate to another user's profile
   * profileNavigationHelpers.navigateToProfile(navigation, 'user123', true);
   * ```
   * 
   * @since 1.0.0
   */
  navigateToProfile: (navigation: any, userId?: string, readOnly = false): void => {
    navigation.navigate('Profile', { userId, readOnly });
  },

  /**
   * Navigate to profile edit screen
   * 
   * @description Navigates to the profile edit screen where users can modify their profile
   * information. Opens as a modal presentation.
   * 
   * @param {any} navigation - React Navigation instance
   * 
   * @example
   * ```tsx
   * profileNavigationHelpers.navigateToEditProfile(navigation);
   * ```
   * 
   * @since 1.0.0
   */
  navigateToEditProfile: (navigation: any): void => {
    navigation.navigate('ProfileEdit');
  },

  /**
   * Navigate to privacy settings screen
   * 
   * @description Navigates to the privacy settings screen where users can configure
   * their profile visibility and privacy preferences.
   * 
   * @param {any} navigation - React Navigation instance
   * 
   * @example
   * ```tsx
   * profileNavigationHelpers.navigateToPrivacySettings(navigation);
   * ```
   * 
   * @since 1.0.0
   */
  navigateToPrivacySettings: (navigation: any): void => {
    navigation.navigate('PrivacySettings');
  },

  /**
   * Navigate to account settings screen
   * 
   * @description Navigates to the account settings screen where users can manage
   * their account preferences and configurations.
   * 
   * @param {any} navigation - React Navigation instance
   * 
   * @example
   * ```tsx
   * profileNavigationHelpers.navigateToAccountSettings(navigation);
   * ```
   * 
   * @since 1.0.0
   */
  navigateToAccountSettings: (navigation: any): void => {
    navigation.navigate('AccountSettings');
  },

  /**
   * Navigate to avatar upload screen
   * 
   * @description Navigates to the avatar upload screen where users can select and upload
   * a new profile picture. Opens as a modal presentation.
   * 
   * @param {any} navigation - React Navigation instance
   * @param {string} [currentAvatar] - Optional current avatar URL for preview
   * 
   * @example
   * ```tsx
   * // Navigate without current avatar
   * profileNavigationHelpers.navigateToAvatarUpload(navigation);
   * 
   * // Navigate with current avatar for preview
   * profileNavigationHelpers.navigateToAvatarUpload(navigation, 'https://example.com/avatar.jpg');
   * ```
   * 
   * @since 1.0.0
   */
  navigateToAvatarUpload: (navigation: any, currentAvatar?: string): void => {
    navigation.navigate('AvatarUpload', { currentAvatar });
  },

  /**
   * Navigate to skills management screen
   * 
   * @description Navigates to the skills management screen where users can add, edit,
   * and organize their professional skills and competencies.
   * 
   * @param {any} navigation - React Navigation instance
   * 
   * @example
   * ```tsx
   * profileNavigationHelpers.navigateToSkillsManagement(navigation);
   * ```
   * 
   * @since 1.0.0
   */
  navigateToSkillsManagement: (navigation: any): void => {
    navigation.navigate('SkillsManagement');
  },

  /**
   * Navigate to social links edit screen
   * 
   * @description Navigates to the social links edit screen where users can manage
   * their social media profiles and external links.
   * 
   * @param {any} navigation - React Navigation instance
   * 
   * @example
   * ```tsx
   * profileNavigationHelpers.navigateToSocialLinksEdit(navigation);
   * ```
   * 
   * @since 1.0.0
   */
  navigateToSocialLinksEdit: (navigation: any): void => {
    navigation.navigate('SocialLinksEdit');
  },

  /**
   * Navigate to custom fields edit screen
   * 
   * @description Navigates to the custom fields edit screen where users can manage
   * additional profile fields and custom information.
   * 
   * @param {any} navigation - React Navigation instance
   * 
   * @example
   * ```tsx
   * profileNavigationHelpers.navigateToCustomFieldsEdit(navigation);
   * ```
   * 
   * @since 1.0.0
   */
  navigateToCustomFieldsEdit: (navigation: any): void => {
    navigation.navigate('CustomFieldsEdit');
  },

  /**
   * Navigate to profile avatar demo screen
   * 
   * @description Navigates to the avatar demo screen where users can preview
   * different avatar styles and configurations.
   * 
   * @param {any} navigation - React Navigation instance
   * 
   * @example
   * ```tsx
   * profileNavigationHelpers.navigateToProfileAvatarDemo(navigation);
   * ```
   * 
   * @since 1.0.0
   */
  navigateToProfileAvatarDemo: (navigation: any): void => {
    navigation.navigate('ProfileAvatarDemo');
  },
};

export default ProfileNavigator; 