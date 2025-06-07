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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@core/navigation/navigation.types';
import { PrimaryButton } from '@shared/components/buttons/primary-button.component';
import { FormTextInput } from '@shared/components/form-text-input/form-text-input.component';
import { FormErrorText } from '@shared/components/form-text-input/form-text-error.component';
import { createLoginScreenStyles } from './login.screen.styles';
import { useAuth } from '@features/auth/presentation/hooks/use-auth';
import { useAuthTranslations } from '@core/i18n/hooks/useAuthTranslations';
import { withGuestGuard } from '@shared/hoc/with-guest.guard';
import { useTheme } from '@core/theme/theme.system';

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
 * @interface TouchedFields
 * @description Tracks which fields have been touched by the user
 */
interface TouchedFields {
  email: boolean;
  password: boolean;
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
  const authT = useAuthTranslations();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { theme } = useTheme();

  const styles = createLoginScreenStyles(theme);

  // Form State
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    email: false,
    password: false,
  });
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
      setTouchedFields({
        email: false,
        password: false,
      });
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
      errors.email = authT.validation.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = authT.validation.emailInvalid;
    }

    // Password validation
    if (!formData.password) {
      errors.password = authT.validation.passwordRequired;
    } else if (formData.password.length < 6) {
      errors.password = authT.validation.passwordTooShort;
    }

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0 && !!formData.email && !!formData.password);
  };

  /**
   * Update form field value and mark as touched
   */
  const updateFormField = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    clearError();
  };

  /**
   * Handle traditional email/password login
   */
  const handleEmailLogin = async () => {
    if (!isFormValid) {
      console.log('[LoginScreen] Form is not valid, aborting login');
      return;
    }

    console.log('[LoginScreen] Starting login process for:', formData.email);
    try {
      await login(formData.email, formData.password);
      console.log('[LoginScreen] Login completed successfully');
    } catch (error) {
      console.error('[LoginScreen] Login failed:', error);
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
        authT.biometric.errorTitle,
        authT.biometric.errorMessage
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
        authT.oauth.errorTitle,
        authT.oauth.googleErrorMessage
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
        authT.oauth.errorTitle,
        authT.oauth.appleErrorMessage
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
        authT.forgotPassword.errorTitle,
        authT.forgotPassword.errorMessage
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{authT.login.title}</Text>
            <Text style={styles.subtitle}>{authT.login.subtitle}</Text>
          </View>

          {/* Email/Password Form */}
          <View style={styles.formContainer}>
            <FormTextInput
              label={authT.login.emailLabel}
              value={formData.email}
              onChangeText={(value) => updateFormField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={(touchedFields.email && !!validationErrors.email) || !!error}
            />
            {touchedFields.email && validationErrors.email && (
              <Text style={styles.validationError}>
                {validationErrors.email}
              </Text>
            )}

            <FormTextInput
              label={authT.login.passwordLabel}
              value={formData.password}
              onChangeText={(value) => updateFormField('password', value)}
              secureTextEntry
              error={(touchedFields.password && !!validationErrors.password) || !!error}
            />
            {touchedFields.password && validationErrors.password && (
              <Text style={styles.validationError}>
                {validationErrors.password}
              </Text>
            )}

            <FormErrorText errorMessage={error} />

            <PrimaryButton
              label={authT.login.button}
              onPress={handleEmailLogin}
              loading={isLoading}
              disabled={!isFormValid || isLoading}
            />
          </View>

          {/* Biometric Authentication */}
          {isBiometricAvailable && (
            <View style={styles.biometricContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.orText}>{authT.login.orText}</Text>
              
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                disabled={isBiometricLoading}
              >
                {isBiometricLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.biometricIcon}>👆</Text>
                    <Text style={styles.biometricText}>
                      {authT.login.biometricButton}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* OAuth Social Login */}
          <View style={styles.oauthContainer}>
            <Divider style={styles.divider} />
            <Text style={styles.socialText}>{authT.login.socialText}</Text>
            
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={handleGoogleLogin}
                disabled={isOAuthLoading.google}
              >
                {isOAuthLoading.google ? (
                  <ActivityIndicator size="small" color="#4285f4" />
                ) : (
                  <>
                    <Text style={styles.socialIcon}>🔍</Text>
                    <Text style={styles.socialButtonText}>Google</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleLogin}
                disabled={isOAuthLoading.apple}
              >
                {isOAuthLoading.apple ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <>
                    <Text style={styles.socialIcon}>🍎</Text>
                    <Text style={styles.socialButtonText}>Apple</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Navigation Links */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                {authT.navigation.noAccount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                {authT.navigation.forgotPassword}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default withGuestGuard(LoginScreen);
