/**
 * @fileoverview PRESENTATION-SCREEN-006: Email Verification Screen
 * @description Email Verification Screen für Supabase Auth mit Deep Link und Manual Code Support.
 * Behandelt Email-Bestätigung über Verification Links und manuelle Code-Eingabe.
 * 
 * @businessRule BR-540: Email verification for account activation
 * @businessRule BR-541: Deep link support for verification emails
 * @businessRule BR-542: Manual verification code entry fallback
 * @businessRule BR-543: Resend verification email functionality
 * @businessRule BR-544: Automatic navigation after successful verification
 * 
 * @architecture React functional component with hooks
 * @architecture Supabase email verification integration
 * @architecture Deep link handling for verification
 * @architecture Clean Architecture patterns
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module EmailVerificationScreen
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
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@core/navigation/navigation.types';
import { PrimaryButton } from '@shared/components/buttons/primary-button.component';
import { FormTextInput } from '@shared/components/form-text-input/form-text-input.component';
import { FormErrorText } from '@shared/components/form-text-input/form-text-error.component';
import { emailVerificationScreenStyles } from './email-verification.screen.styles';
import { useAuth } from '@features/auth/presentation/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { withGuestGuard } from '@shared/hoc/with-guest.guard';

/**
 * @interface EmailVerificationFormData
 * @description Email verification form state interface
 */
interface EmailVerificationFormData {
  verificationCode: string;
  email: string;
}

/**
 * @interface ValidationErrors
 * @description Form validation errors interface
 */
interface ValidationErrors {
  verificationCode?: string;
  email?: string;
}

/**
 * @interface EmailVerificationScreenProps
 * @description Screen props interface for deep link params
 */
interface EmailVerificationScreenProps {
  email?: string;
  token?: string;
  type?: 'signup' | 'email_change';
}

/**
 * @component EmailVerificationScreen
 * @description Email Verification Screen mit Supabase Integration
 * 
 * Features:
 * - Deep link handling für Verification Emails
 * - Manual verification code entry
 * - Resend verification email
 * - Real-time validation
 * - Loading states and error handling
 * - Automatic navigation nach success
 * - Supabase email verification API
 * - GDPR compliant email handling
 */
const EmailVerificationScreen = () => {
  const { user: _user, error, clearError, logout: _logout } = useAuth();
  const _isLoading = useAuth().isLoading;
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute();
  const routeParams = route.params as EmailVerificationScreenProps;

  // Form State
  const [formData, setFormData] = useState<EmailVerificationFormData>({
    verificationCode: '',
    email: routeParams?.email || '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Loading States
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);

  // Status States
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);

  // Clear errors when component focuses
  useFocusEffect(
    useCallback(() => {
      clearError();
      setValidationErrors({});
    }, [clearError])
  );

  // Handle deep link verification on mount
  useEffect(() => {
    if (routeParams?.token) {
      handleDeepLinkVerification(routeParams.token, routeParams.type || 'signup');
    }
  }, [routeParams?.token]);

  // Form validation
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = t('auth.validation.emailRequired') || 'Email ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('auth.validation.emailInvalid') || 'Ungültige E-Mail-Adresse';
    }

    // Verification code validation (for manual entry)
    if (!routeParams?.token && !formData.verificationCode) {
      errors.verificationCode = t('auth.validation.verificationCodeRequired') || 'Bestätigungscode ist erforderlich';
    } else if (!routeParams?.token && formData.verificationCode.length !== 6) {
      errors.verificationCode = t('auth.validation.verificationCodeInvalid') || 'Bestätigungscode muss 6 Zeichen haben';
    }

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0 && !!formData.email);
  };

  /**
   * Update form field value
   */
  const updateFormField = (field: keyof EmailVerificationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError();
  };

  /**
   * Handle deep link email verification
   */
  const handleDeepLinkVerification = async (token: string, type: string) => {
    setIsAutoVerifying(true);
    try {
      const success = await verifyEmailWithToken(token, type);
      
      if (success) {
        setVerificationSuccess(true);
        showSuccessAndNavigate();
      } else {
        Alert.alert(
          t('auth.emailVerification.errorTitle') || 'Verification fehlgeschlagen',
          t('auth.emailVerification.tokenErrorMessage') || 'Der Verification-Link ist ungültig oder abgelaufen.'
        );
      }
    } catch (error) {
      console.error('Deep link verification failed:', error);
      Alert.alert(
        t('auth.emailVerification.errorTitle') || 'Fehler',
        t('auth.emailVerification.genericErrorMessage') || 'Verification fehlgeschlagen. Versuchen Sie es erneut.'
      );
    } finally {
      setIsAutoVerifying(false);
    }
  };

  /**
   * Handle manual code verification
   */
  const handleManualVerification = async () => {
    if (!isFormValid || attemptsRemaining <= 0) {
      return;
    }

    setIsVerifying(true);
    try {
      const success = await verifyEmailWithCode(formData.email, formData.verificationCode);
      
      if (success) {
        setVerificationSuccess(true);
        showSuccessAndNavigate();
      } else {
        setAttemptsRemaining(prev => prev - 1);
        
        if (attemptsRemaining <= 1) {
          Alert.alert(
            t('auth.emailVerification.attemptsExhaustedTitle') || 'Zu viele Versuche',
            t('auth.emailVerification.attemptsExhaustedMessage') || 'Sie haben zu viele ungültige Codes eingegeben. Bitte fordern Sie einen neuen Code an.'
          );
        } else {
          Alert.alert(
            t('auth.emailVerification.invalidCodeTitle') || 'Ungültiger Code',
            t('auth.emailVerification.invalidCodeMessage', { attempts: attemptsRemaining - 1 }) || `Ungültiger Code. ${attemptsRemaining - 1} Versuche übrig.`
          );
        }
      }
    } catch (error) {
      console.error('Manual verification failed:', error);
      Alert.alert(
        t('auth.emailVerification.errorTitle') || 'Fehler',
        t('auth.emailVerification.genericErrorMessage') || 'Verification fehlgeschlagen. Versuchen Sie es erneut.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle resend verification email
   */
  const handleResendEmail = async () => {
    if (resendCooldown > 0 || !formData.email) {
      return;
    }

    setIsResending(true);
    try {
      const success = await resendVerificationEmail(formData.email);
      
      if (success) {
        setResendCooldown(60); // 60 second cooldown
        setAttemptsRemaining(5); // Reset attempts
        Alert.alert(
          t('auth.emailVerification.resendSuccessTitle') || 'Email gesendet',
          t('auth.emailVerification.resendSuccessMessage') || 'Eine neue Bestätigungs-Email wurde gesendet.'
        );
      } else {
        Alert.alert(
          t('auth.emailVerification.resendErrorTitle') || 'Fehler',
          t('auth.emailVerification.resendErrorMessage') || 'Email konnte nicht gesendet werden. Versuchen Sie es später erneut.'
        );
      }
    } catch (error) {
      console.error('Resend email failed:', error);
      Alert.alert(
        t('auth.emailVerification.resendErrorTitle') || 'Fehler',
        t('auth.emailVerification.resendErrorMessage') || 'Email konnte nicht gesendet werden. Versuchen Sie es später erneut.'
      );
    } finally {
      setIsResending(false);
    }
  };

  /**
   * Verify email with token (deep link)
   */
  const verifyEmailWithToken = async (token: string, type: string): Promise<boolean> => {
    try {
      // Supabase email verification with token
      // Mock implementation - replace with real Supabase call
      console.log('Verifying email with token:', token, type);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  /**
   * Verify email with manual code
   */
  const verifyEmailWithCode = async (email: string, code: string): Promise<boolean> => {
    try {
      // Supabase email verification with OTP code
      // Mock implementation - replace with real Supabase call
      console.log('Verifying email with code:', email, code);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success (90% success rate for demo)
      return Math.random() > 0.1;
    } catch (error) {
      console.error('Code verification failed:', error);
      return false;
    }
  };

  /**
   * Resend verification email
   */
  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      // Supabase resend verification email
      // Mock implementation - replace with real Supabase call
      console.log('Resending verification email to:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success
      return true;
    } catch (error) {
      console.error('Resend email failed:', error);
      return false;
    }
  };

  /**
   * Show success message and navigate
   */
  const showSuccessAndNavigate = () => {
    Alert.alert(
      t('auth.emailVerification.successTitle') || 'Email bestätigt!',
      t('auth.emailVerification.successMessage') || 'Ihre Email wurde erfolgreich bestätigt. Sie können sich jetzt anmelden.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  // Show auto-verification loading
  if (isAutoVerifying) {
    return (
      <View style={emailVerificationScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={emailVerificationScreenStyles.loadingText}>
          {t('auth.emailVerification.verifyingMessage') || 'Email wird bestätigt...'}
        </Text>
      </View>
    );
  }

  // Show success state
  if (verificationSuccess) {
    return (
      <View style={emailVerificationScreenStyles.successContainer}>
        <Text style={emailVerificationScreenStyles.successIcon}>✅</Text>
        <Text style={emailVerificationScreenStyles.successTitle}>
          {t('auth.emailVerification.successTitle') || 'Email bestätigt!'}
        </Text>
        <Text style={emailVerificationScreenStyles.successMessage}>
          {t('auth.emailVerification.successMessage') || 'Ihre Email wurde erfolgreich bestätigt.'}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={emailVerificationScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={emailVerificationScreenStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={emailVerificationScreenStyles.header}>
          <Text style={emailVerificationScreenStyles.headerIcon}>📧</Text>
          <Text style={emailVerificationScreenStyles.title}>
            {t('auth.emailVerification.title') || 'Email bestätigen'}
          </Text>
          <Text style={emailVerificationScreenStyles.subtitle}>
            {t('auth.emailVerification.subtitle') || 'Bestätigen Sie Ihre Email-Adresse, um Ihr Konto zu aktivieren'}
          </Text>
        </View>

        {/* Form */}
        <View style={emailVerificationScreenStyles.formContainer}>
          {/* Email Field */}
          <FormTextInput
            label={t('auth.emailVerification.emailLabel') || 'Email-Adresse'}
            value={formData.email}
            onChangeText={(value) => updateFormField('email', value)}
            keyboardType="email-address"
            error={!!validationErrors.email}
          />
          {validationErrors.email && (
            <Text style={emailVerificationScreenStyles.validationError}>
              {validationErrors.email}
            </Text>
          )}

          {/* Verification Code Field (only if no token) */}
          {!routeParams?.token && (
            <>
              <FormTextInput
                label={t('auth.emailVerification.codeLabel') || 'Bestätigungscode (6 Zeichen)'}
                value={formData.verificationCode}
                onChangeText={(value) => updateFormField('verificationCode', value.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="default"
                error={!!validationErrors.verificationCode}
              />
              {validationErrors.verificationCode && (
                <Text style={emailVerificationScreenStyles.validationError}>
                  {validationErrors.verificationCode}
                </Text>
              )}

              {/* Attempts Counter */}
              <Text style={emailVerificationScreenStyles.attemptsText}>
                {t('auth.emailVerification.attemptsRemaining', { count: attemptsRemaining }) || `${attemptsRemaining} Versuche übrig`}
              </Text>
            </>
          )}

          <FormErrorText errorMessage={error} />

          {/* Verify Button (only if no token) */}
          {!routeParams?.token && (
            <PrimaryButton
              label={t('auth.emailVerification.verifyButton') || 'Email bestätigen'}
              onPress={handleManualVerification}
              loading={isVerifying}
              disabled={!isFormValid || isVerifying || attemptsRemaining <= 0}
            />
          )}

          {/* Resend Email Button */}
          <PrimaryButton
            label={
              resendCooldown > 0
                ? t('auth.emailVerification.resendCooldown', { seconds: resendCooldown }) || `Email erneut senden (${resendCooldown}s)`
                : t('auth.emailVerification.resendButton') || 'Email erneut senden'
            }
            onPress={handleResendEmail}
            loading={isResending}
            disabled={resendCooldown > 0 || isResending || !formData.email}
          />

          {/* Info Box */}
          <View style={emailVerificationScreenStyles.infoBox}>
            <Text style={emailVerificationScreenStyles.infoIcon}>💡</Text>
            <Text style={emailVerificationScreenStyles.infoText}>
              {t('auth.emailVerification.infoMessage') || 'Prüfen Sie auch Ihren Spam-Ordner, falls Sie keine Email erhalten haben.'}
            </Text>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={emailVerificationScreenStyles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={emailVerificationScreenStyles.backButtonText}>
              {t('auth.emailVerification.backToLogin') || 'Zurück zur Anmeldung'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withGuestGuard(EmailVerificationScreen); 