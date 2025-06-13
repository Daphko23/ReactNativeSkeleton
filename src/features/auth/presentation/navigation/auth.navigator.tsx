/**
 * @fileoverview PRESENTATION-NAVIGATION-001: Auth Navigator
 * @description Navigator für alle Auth-bezogenen Screens mit Enterprise Features.
 * Implementiert vollständige Authentication Navigation Stack.
 * 
 * @businessRule BR-700: Complete auth navigation coverage
 * @businessRule BR-701: Enterprise auth screens integration
 * @businessRule BR-702: Consistent navigation patterns
 * @businessRule BR-703: Internationalization support
 * 
 * @architecture React Navigation v6 implementation
 * @architecture Type-safe navigation with TypeScript
 * @architecture Modular screen organization
 * @architecture i18next internationalization
 * 
 * @since 1.0.0
 * @version 2.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthNavigator
 * @namespace Auth.Presentation.Navigation
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import LoginScreen from '@features/auth/presentation/screens/login/login.screen';
import RegisterScreen from '@features/auth/presentation/screens/register/register.screen';
import PasswordResetScreen from '@features/auth/presentation/screens/password-reset/password-reset.screen';
import PasswordChangeScreen from '@features/auth/presentation/screens/password-change/password-change.screen';
import SecuritySettingsScreen from '@features/auth/presentation/screens/security-settings/security-settings.screen';
import EmailVerificationScreen from '@features/auth/presentation/screens/email-verification/email-verification.screen';
import AccountDeletionScreen from '@features/auth/presentation/screens/account-deletion/account-deletion.screen';
import {AuthStackParamList} from '@core/navigation/navigation.types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * @component AuthNavigator
 * @description Complete Auth Navigation Stack with Internationalization
 * 
 * Provides navigation für alle Authentication-bezogenen Screens:
 * - Login/Register Flow
 * - Password Reset/Change
 * - Security Settings (Enterprise)
 * - Auth Demo/Testing
 * 
 * Features:
 * - Internationalization support
 * - Type-safe navigation
 * - Consistent screen transitions
 * - Enterprise screen integration
 * 
 * @example Auth Navigator Usage
 * ```typescript
 * // In RootNavigator
 * <Stack.Screen name="Auth" component={AuthNavigator} />
 * 
 * // Navigation zu Auth Screens
 * navigation.navigate('Auth', { screen: 'Login' });
 * navigation.navigate('Auth', { screen: 'SecuritySettings' });
 * navigation.navigate('Auth', { screen: 'PasswordChange' });
 * ```
 */
export const AuthNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animationTypeForReplace: 'push',
        animation: 'slide_from_right'
      }}
      initialRouteName="Login"
    >
      {/* Core Authentication Screens */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          title: t('auth.loginScreen.title') || 'Anmelden',
          headerShown: false
        }}
      />
      
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          title: t('auth.registerScreen.title') || 'Registrieren',
          headerShown: false
        }}
      />
      
      <Stack.Screen 
        name="PasswordReset" 
        component={PasswordResetScreen}
        options={{
          title: t('auth.resetScreen.title') || 'Passwort zurücksetzen',
          headerShown: false
        }}
      />
      
      <Stack.Screen 
        name="PasswordChange" 
        component={PasswordChangeScreen}
        options={{
          title: t('auth.passwordChangeScreen.title') || 'Passwort ändern',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      
      <Stack.Screen 
        name="EmailVerification" 
        component={EmailVerificationScreen}
        options={{
          title: t('auth.emailVerificationScreen.title') || 'Email bestätigen',
          headerShown: true
        }}
      />
      
      <Stack.Screen 
        name="AccountDeletion" 
        component={AccountDeletionScreen}
        options={{
          title: t('auth.accountDeletionScreen.title') || 'Konto löschen',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      
      {/* Enterprise Security Screens */}
      <Stack.Screen 
        name="SecuritySettings" 
        component={SecuritySettingsScreen}
        options={{
          title: t('auth.securityScreen.title') || 'Sicherheitseinstellungen',
          headerShown: true,
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
};
