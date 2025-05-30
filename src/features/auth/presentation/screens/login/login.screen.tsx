/**
 * @fileoverview PRESENTATION-SCREEN-001: Optimized Enterprise Login Screen
 * @description Vollständig optimierter Login Screen mit Enterprise Features.
 * Bietet umfassende Authentifizierung mit modernem UX Design.
 * 
 * @businessRule BR-500: Enterprise authentication with multiple methods
 * @businessRule BR-501: Biometric authentication integration
 * @businessRule BR-502: OAuth social login providers
 * @businessRule BR-503: Real-time form validation
 * @businessRule BR-504: Accessibility and internationalization
 * 
 * @architecture React functional component with hooks
 * @architecture Integration with enterprise auth services
 * @architecture Responsive design with modern UX patterns
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module LoginScreen
 * @namespace Auth.Presentation.Screens
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Divider, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@core/navigation/navigation.types';
import { PrimaryButton } from '@shared/components/buttons/primary-button.component';
import { FormTextInput } from '@shared/components/form-text-input/form-text-input.component';
import { FormErrorText } from '@shared/components/form-text-input/form-text-error.component';
import { loginScreenStyles } from './login.screen.styles';
import { useAuth } from '@features/auth/presentation/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { withGuestGuard } from '@shared/hoc/with-guest.guard';

/**
 * @interface LoginFormData
 * @description Login form state interface
 */
interface LoginFormData {
  email: string;
  password: string;
}

/**
 * @interface ValidationErrors
 * @description Form validation errors interface
 */
interface ValidationErrors {
  email?: string;
  password?: string;
}

/**
 * @component LoginScreen
 * @description Optimized Enterprise Login Screen
 * 
 * Features:
 * - Email/Password authentication with validation
 * - Biometric authentication (Face ID, Touch ID, Fingerprint)
 * - OAuth social login (Google, Apple)
 * - Real-time form validation
 * - Loading states and error handling
 * - Accessibility support
 * - Responsive design
 */
const LoginScreen = () => {
  const { login, isLoading, error, clearError, enterprise } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // Form State
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Biometric State
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  // OAuth State
  const [isOAuthLoading, setIsOAuthLoading] = useState({
    google: false,
    apple: false,
  });

  // Clear errors when component focuses
  useFocusEffect(
    useCallback(() => {
      clearError();
      setValidationErrors({});
    }, [clearError])
  );

  // Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  // Form validation
  useEffect(() => {
    validateForm();
  }, [formData]);

  /**
   * Check if biometric authentication is available
   */
  const checkBiometricAvailability = async () => {
    try {
      const available = await enterprise.biometric.isAvailable();
      setIsBiometricAvailable(Boolean(available));
    } catch {
      setIsBiometricAvailable(false);
    }
  };

  /**
   * Validate form fields in real-time
   */
  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = t('auth.validation.emailRequired') || 'Email ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('auth.validation.emailInvalid') || 'Ungültige E-Mail-Adresse';
    }

    // Password validation
    if (!formData.password) {
      errors.password = t('auth.validation.passwordRequired') || 'Passwort ist erforderlich';
    } else if (formData.password.length < 6) {
      errors.password = t('auth.validation.passwordTooShort') || 'Passwort zu kurz (min. 6 Zeichen)';
    }

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0 && !!formData.email && !!formData.password);
  };

  /**
   * Update form field value
   */
  const updateFormField = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError();
  };

  /**
   * Handle traditional email/password login
   */
  const handleEmailLogin = async () => {
    if (!isFormValid) {
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch {
      // Error handling is done by the auth hook
    }
  };

  /**
   * Handle biometric authentication
   */
  const handleBiometricLogin = async () => {
    setIsBiometricLoading(true);
    try {
      await enterprise.biometric.authenticate();
      // Success handled by auth state change
    } catch {
      Alert.alert(
        t('auth.biometric.errorTitle') || 'Fehler',
        t('auth.biometric.errorMessage') || 'Biometrische Authentifizierung fehlgeschlagen'
      );
    } finally {
      setIsBiometricLoading(false);
    }
  };

  /**
   * Handle Google OAuth login
   */
  const handleGoogleLogin = async () => {
    setIsOAuthLoading(prev => ({ ...prev, google: true }));
    try {
      await enterprise.oauth.loginWithGoogle();
    } catch {
      Alert.alert(
        t('auth.oauth.errorTitle') || 'Fehler',
        t('auth.oauth.googleErrorMessage') || 'Google-Anmeldung fehlgeschlagen'
      );
    } finally {
      setIsOAuthLoading(prev => ({ ...prev, google: false }));
    }
  };

  /**
   * Handle Apple OAuth login
   */
  const handleAppleLogin = async () => {
    setIsOAuthLoading(prev => ({ ...prev, apple: true }));
    try {
      await enterprise.oauth.loginWithApple();
    } catch {
      Alert.alert(
        t('auth.oauth.errorTitle') || 'Fehler',
        t('auth.oauth.appleErrorMessage') || 'Apple-Anmeldung fehlgeschlagen'
      );
    } finally {
      setIsOAuthLoading(prev => ({ ...prev, apple: false }));
    }
  };

  /**
   * Handle forgot password
   */
  const handleForgotPassword = async () => {
    try {
      // Navigate to password reset screen
      navigation.navigate('PasswordReset');
    } catch {
      Alert.alert(
        t('auth.forgotPassword.errorTitle') || 'Fehler',
        t('auth.forgotPassword.errorMessage') || 'Passwort-Reset konnte nicht gestartet werden'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={loginScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={loginScreenStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={loginScreenStyles.header}>
          <Text style={loginScreenStyles.title}>{t('auth.login.title')}</Text>
          <Text style={loginScreenStyles.subtitle}>{t('auth.login.subtitle')}</Text>
        </View>

        {/* Email/Password Form */}
        <View style={loginScreenStyles.formContainer}>
          <FormTextInput
            label={t('auth.login.emailLabel')}
            value={formData.email}
            onChangeText={(value) => updateFormField('email', value)}
            keyboardType="email-address"
            error={!!validationErrors.email || !!error}
          />
          {validationErrors.email && (
            <Text style={loginScreenStyles.validationError}>
              {validationErrors.email}
            </Text>
          )}

          <FormTextInput
            label={t('auth.login.passwordLabel')}
            value={formData.password}
            onChangeText={(value) => updateFormField('password', value)}
            secureTextEntry
            error={!!validationErrors.password || !!error}
          />
          {validationErrors.password && (
            <Text style={loginScreenStyles.validationError}>
              {validationErrors.password}
            </Text>
          )}

          <FormErrorText errorMessage={error} />

          <PrimaryButton
            label={t('auth.login.button')}
            onPress={handleEmailLogin}
            loading={isLoading}
            disabled={!isFormValid || isLoading}
          />
        </View>

        {/* Biometric Authentication */}
        {isBiometricAvailable && (
          <View style={loginScreenStyles.biometricContainer}>
            <Divider style={loginScreenStyles.divider} />
            <Text style={loginScreenStyles.orText}>{t('auth.login.orText')}</Text>
            
            <TouchableOpacity
              style={loginScreenStyles.biometricButton}
              onPress={handleBiometricLogin}
              disabled={isBiometricLoading}
            >
              {isBiometricLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={loginScreenStyles.biometricIcon}>👆</Text>
                  <Text style={loginScreenStyles.biometricText}>
                    {t('auth.login.biometricButton')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* OAuth Social Login */}
        <View style={loginScreenStyles.oauthContainer}>
          <Divider style={loginScreenStyles.divider} />
          <Text style={loginScreenStyles.socialText}>{t('auth.login.socialText')}</Text>
          
          <View style={loginScreenStyles.socialButtonsContainer}>
            <TouchableOpacity
              style={[loginScreenStyles.socialButton, loginScreenStyles.googleButton]}
              onPress={handleGoogleLogin}
              disabled={isOAuthLoading.google}
            >
              {isOAuthLoading.google ? (
                <ActivityIndicator size="small" color="#4285f4" />
              ) : (
                <>
                  <Text style={loginScreenStyles.socialIcon}>🔍</Text>
                  <Text style={loginScreenStyles.socialButtonText}>Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[loginScreenStyles.socialButton, loginScreenStyles.appleButton]}
              onPress={handleAppleLogin}
              disabled={isOAuthLoading.apple}
            >
              {isOAuthLoading.apple ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Text style={loginScreenStyles.socialIcon}>🍎</Text>
                  <Text style={loginScreenStyles.socialButtonText}>Apple</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Links */}
        <View style={loginScreenStyles.navigationContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={loginScreenStyles.linkContainer}
          >
            <Text style={loginScreenStyles.linkText}>
              {t('auth.navigation.noAccount')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleForgotPassword}
            style={loginScreenStyles.linkContainer}
          >
            <Text style={loginScreenStyles.linkText}>
              {t('auth.navigation.forgotPassword')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withGuestGuard(LoginScreen);
