import React from 'react';
import {NavigationContainer, LinkingOptions, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthStore} from '@features/auth/presentation/store/auth.store';
import {AuthNavigator} from '@features/auth/presentation/navigation/auth.navigator';
import MainTabNavigator from './main-tabs';
import {RootStackParamList} from './navigation.types';
import { useTheme } from '../theme/theme.system';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  linking?: LinkingOptions<RootStackParamList>;
}

export default function AppNavigator({linking}: AppNavigatorProps) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { theme, isDark } = useTheme();

  // Create custom navigation theme based on app theme
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.error,
    },
  };

  return (
    <NavigationContainer linking={linking} theme={navigationTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
