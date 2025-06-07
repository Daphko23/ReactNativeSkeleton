/**
 * Avatar Demo Navigator - Standalone Navigation für Avatar-Upload Demo
 * 
 * @fileoverview Standalone navigation component for the avatar upload demo feature.
 * Provides isolated navigation stack for testing and demoing avatar upload functionality
 * without dependencies on the main application navigation structure.
 * 
 * @module AvatarDemoNavigator
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ProfileAvatarDemoScreen from '../screens/profile-avatar-demo/profile-avatar-demo.screen';
import { useTheme } from '@core/theme/theme.system';

/**
 * Type definition for the Avatar Demo navigation stack parameters.
 * 
 * @description Defines the parameter types for the avatar demo navigation stack.
 * Currently contains only the demo screen with no parameters, but structured
 * for future extensibility.
 * 
 * @interface AvatarDemoStackParamList
 * @property {undefined} AvatarDemo - Avatar demo screen (no parameters required)
 * 
 * @since 1.0.0
 */
export type AvatarDemoStackParamList = {
  AvatarDemo: undefined;
};

const Stack = createStackNavigator<AvatarDemoStackParamList>();

/**
 * Avatar Demo Navigator Component
 * 
 * @description Standalone navigation component for the avatar upload demo feature.
 * Configures a single-screen navigation stack with custom header styling and options.
 * Used for isolated testing and demonstration of avatar upload functionality.
 * 
 * @component
 * @returns {React.JSX.Element} The configured stack navigator for avatar demo
 * 
 * @example
 * ```tsx
 * // Use within existing navigation structure
 * <AvatarDemoNavigator />
 * 
 * // Or as standalone app
 * <AvatarDemoApp />
 * ```
 * 
 * @since 1.0.0
 * @see {@link AvatarDemoStackParamList} for parameter types
 * @see {@link AvatarDemoApp} for standalone usage
 */
export const AvatarDemoNavigator: React.FC = (): React.JSX.Element => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      initialRouteName="AvatarDemo"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.colors.text,
        },
      }}
    >
      <Stack.Screen
        name="AvatarDemo"
        component={ProfileAvatarDemoScreen}
        options={{
          title: 'Avatar Upload Demo',
          headerBackTitle: 'Zurück',
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Standalone Avatar Demo Application
 * 
 * @description Complete standalone application wrapper for the avatar demo navigator.
 * Includes its own NavigationContainer for independent operation outside of the
 * main application navigation structure. Ideal for development, testing, and
 * demonstration purposes.
 * 
 * @component
 * @returns {React.JSX.Element} Complete navigation-wrapped avatar demo application
 * 
 * @example
 * ```tsx
 * // Render as standalone app
 * export default function App() {
 *   return <AvatarDemoApp />;
 * }
 * 
 * // Or for testing purposes
 * render(<AvatarDemoApp />);
 * ```
 * 
 * @since 1.0.0
 * @see {@link AvatarDemoNavigator} for the core navigator component
 */
export const AvatarDemoApp: React.FC = (): React.JSX.Element => {
  return (
    <NavigationContainer>
      <AvatarDemoNavigator />
    </NavigationContainer>
  );
};

export default AvatarDemoNavigator; 