/**
 * @fileoverview PRESENTATION-SCREEN-002: Optimized Enterprise Password Reset Screen
 * @description Vollständig optimierter Password Reset Screen mit Enterprise Features.
 * Bietet sichere Passwort-Wiederherstellung mit modernem UX Design.
 * 
 * @businessRule BR-510: Secure password reset with email validation
 * @businessRule BR-511: Multi-step password reset flow
 * @businessRule BR-512: Real-time form validation
 * @businessRule BR-513: Success and error state management
 * @businessRule BR-514: Accessibility and internationalization
 * 
 * @architecture React functional component with hooks
 * @architecture Integration with enterprise auth services
 * @architecture Responsive design with modern UX patterns
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module PasswordResetScreen
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
import { Text, /* Divider, */ ActivityIndicator } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@core/navigation/navigation.types';
import { PrimaryButton } from '@shared/components/buttons/primary-button.component';
import { FormTextInput } from '@shared/components/form-text-input/form-text-input.component';
import { FormErrorText } from '@shared/components/form-text-input/form-text-error.component';
import { passwordResetScreenStyles } from './password-reset.screen.styles';
import { useAuth } from '@features/auth/presentation/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { withGuestGuard } from '@shared/hoc/with-guest.guard';

/**
 * @enum ResetStep
 * @description Password reset flow steps
 */
enum ResetStep {
  EMAIL_INPUT = 'email_input',
  EMAIL_SENT = 'email_sent',
  SUCCESS = 'success'
}

/**
 * @interface ValidationErrors
 * @description Form validation errors interface
 */
interface ValidationErrors {
  email?: string;
}

/**
 * @component PasswordResetScreen
 * @description Optimized Enterprise Password Reset Screen
 * 
 * Features:
 * - Multi-step password reset flow
 * - Real-time email validation
 * - Success and error state management
 * - Accessibility support
 * - Loading states with proper feedback
 * - Security best practices
 * - Professional UI design
 */
const PasswordResetScreen = () => {
  const { resetPassword, isLoading, error, clearError, enterprise: _enterprise } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // State Management
  const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.EMAIL_INPUT);
  const [email, setEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [resetAttempts, setResetAttempts] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Clear errors when component focuses
  useFocusEffect(
    useCallback(() => {
      clearError();
      setValidationErrors({});
    }, [clearError])
  );

  // Form validation
  useEffect(() => {
    validateForm();
  }, [email]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  /**
   * Validate email field in real-time
   */
  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    // Email validation
    if (!email) {
      errors.email = t('auth.validation.emailRequired') || 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t('auth.validation.emailInvalid') || 'Ungültige E-Mail-Adresse';
    }

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0 && !!email);
  };

  /**
   * Handle email input change
   */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    clearError();
  };

  /**
   * Handle password reset request
   */
  const handleReset = async () => {
    if (!isFormValid || isLoading) {
      return;
    }

    try {
      await resetPassword(email);
      
      // Track reset attempts for rate limiting
      setResetAttempts(prev => prev + 1);
      
      // Move to success step
      setCurrentStep(ResetStep.EMAIL_SENT);
      
      // Start resend cooldown (60 seconds)
      setResendCooldown(60);
      setCanResend(false);

      // Show success feedback
      Alert.alert(
        t('auth.reset.successTitle') || 'E-Mail gesendet',
        t('auth.reset.successMessage') || 'Prüfen Sie Ihr E-Mail-Postfach für weitere Anweisungen.'
      );

    } catch (error) {
      // Error handling is done by the auth hook
      console.error('Password reset failed:', error);
      
      // Show appropriate error based on attempts
      if (resetAttempts >= 3) {
        Alert.alert(
          t('auth.reset.rateLimitTitle') || 'Zu viele Versuche',
          t('auth.reset.rateLimitMessage') || 'Bitte warten Sie 15 Minuten bevor Sie es erneut versuchen.'
        );
      }
    }
  };

  /**
   * Handle resend reset email
   */
  const handleResendEmail = async () => {
    if (!canResend || isLoading) {
      return;
    }

    try {
      await resetPassword(email);
      
      // Restart cooldown
      setResendCooldown(60);
      setCanResend(false);
      
      Alert.alert(
        t('auth.reset.resendSuccessTitle') || 'E-Mail erneut gesendet',
        t('auth.reset.resendSuccessMessage') || 'Eine neue E-Mail wurde an Ihre Adresse gesendet.'
      );

    } catch (error) {
      console.error('Resend failed:', error);
    }
  };

  /**
   * Navigate back to login
   */
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  /**
   * Reset the form and go back to email input
   */
  const resetForm = () => {
    setCurrentStep(ResetStep.EMAIL_INPUT);
    setEmail('');
    setValidationErrors({});
    setResetAttempts(0);
    setCanResend(false);
    setResendCooldown(0);
    clearError();
  };

  /**
   * Render email input step
   */
  const renderEmailInputStep = () => (
    <>
      {/* Header */}
      <View style={passwordResetScreenStyles.header}>
        <Text style={passwordResetScreenStyles.title}>
          {t('auth.reset.title') || 'Passwort zurücksetzen'}
        </Text>
        <Text style={passwordResetScreenStyles.subtitle}>
          {t('auth.reset.subtitle') || 'Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen'}
        </Text>
      </View>

      {/* Email Form */}
      <View style={passwordResetScreenStyles.formContainer}>
        <FormTextInput
          label={t('auth.reset.emailLabel') || 'E-Mail-Adresse'}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          error={!!validationErrors.email || !!error}
        />
        
        {validationErrors.email && (
          <Text style={passwordResetScreenStyles.validationError}>
            {validationErrors.email}
          </Text>
        )}

        <FormErrorText errorMessage={error} />

        <PrimaryButton
          label={t('auth.reset.button') || 'Passwort zurücksetzen'}
          onPress={handleReset}
          loading={isLoading}
          disabled={!isFormValid || isLoading}
        />
      </View>

      {/* Security Notice */}
      <View style={passwordResetScreenStyles.securityNotice}>
        <Text style={passwordResetScreenStyles.securityText}>
          🔒 {t('auth.reset.securityNotice') || 'Aus Sicherheitsgründen erhalten Sie nur dann eine E-Mail, wenn Ihr Konto existiert.'}
        </Text>
      </View>
    </>
  );

  /**
   * Render email sent confirmation step
   */
  const renderEmailSentStep = () => (
    <>
      {/* Success Header */}
      <View style={passwordResetScreenStyles.successHeader}>
        <Text style={passwordResetScreenStyles.successIcon}>📧</Text>
        <Text style={passwordResetScreenStyles.successTitle}>
          {t('auth.reset.emailSentTitle') || 'E-Mail gesendet!'}
        </Text>
        <Text style={passwordResetScreenStyles.successSubtitle}>
          {t('auth.reset.emailSentMessage') || `Wir haben eine E-Mail an ${email} gesendet. Folgen Sie den Anweisungen in der E-Mail, um Ihr Passwort zurückzusetzen.`}
        </Text>
      </View>

      {/* Instructions */}
      <View style={passwordResetScreenStyles.instructionsContainer}>
        <Text style={passwordResetScreenStyles.instructionsTitle}>
          {t('auth.reset.nextStepsTitle') || 'Nächste Schritte:'}
        </Text>
        <Text style={passwordResetScreenStyles.instructionStep}>
          1. {t('auth.reset.step1') || 'Prüfen Sie Ihr E-Mail-Postfach'}
        </Text>
        <Text style={passwordResetScreenStyles.instructionStep}>
          2. {t('auth.reset.step2') || 'Klicken Sie auf den Link in der E-Mail'}
        </Text>
        <Text style={passwordResetScreenStyles.instructionStep}>
          3. {t('auth.reset.step3') || 'Erstellen Sie ein neues Passwort'}
        </Text>
      </View>

      {/* Resend Section */}
      <View style={passwordResetScreenStyles.resendContainer}>
        <Text style={passwordResetScreenStyles.resendText}>
          {t('auth.reset.noEmailReceived') || 'Keine E-Mail erhalten?'}
        </Text>
        
        {canResend ? (
          <TouchableOpacity
            style={passwordResetScreenStyles.resendButton}
            onPress={handleResendEmail}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#007bff" />
            ) : (
              <Text style={passwordResetScreenStyles.resendButtonText}>
                {t('auth.reset.resendButton') || 'E-Mail erneut senden'}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <Text style={passwordResetScreenStyles.cooldownText}>
            {t('auth.reset.resendCooldown') || `Erneut senden in ${resendCooldown}s`}
          </Text>
        )}
      </View>

      {/* Try Different Email */}
      <TouchableOpacity
        style={passwordResetScreenStyles.changeEmailButton}
        onPress={resetForm}
      >
        <Text style={passwordResetScreenStyles.changeEmailText}>
          {t('auth.reset.tryDifferentEmail') || 'Andere E-Mail-Adresse verwenden'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={passwordResetScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={passwordResetScreenStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Render appropriate step */}
        {currentStep === ResetStep.EMAIL_INPUT && renderEmailInputStep()}
        {currentStep === ResetStep.EMAIL_SENT && renderEmailSentStep()}

        {/* Navigation */}
        <View style={passwordResetScreenStyles.navigationContainer}>
          <TouchableOpacity
            onPress={navigateToLogin}
            style={passwordResetScreenStyles.linkContainer}
          >
            <Text style={passwordResetScreenStyles.linkText}>
              ← {t('auth.navigation.backToLogin') || 'Zurück zur Anmeldung'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withGuestGuard(PasswordResetScreen);
