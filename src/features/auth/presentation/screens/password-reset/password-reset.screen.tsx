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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@core/navigation/navigation.types';
import { PrimaryButton } from '@shared/components/buttons/primary-button.component';
import { FormTextInput } from '@shared/components/form-text-input/form-text-input.component';
import { FormErrorText } from '@shared/components/form-text-input/form-text-error.component';
import { createPasswordResetScreenStyles } from './password-reset.screen.styles';
import { useAuthPassword } from '@features/auth/presentation/hooks';
import { useTranslation } from 'react-i18next';
import { withGuestGuard } from '@shared/hoc/with-guest.guard';
import { useTheme } from '@core/theme/theme.system';

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
 * @interface TouchedFields
 * @description Tracks which fields have been touched by the user
 */
interface TouchedFields {
  email: boolean;
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
  const { resetPassword, isLoading, error, clearPasswordError } = useAuthPassword();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { theme } = useTheme();

  const styles = createPasswordResetScreenStyles(theme);

  // State Management
  const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.EMAIL_INPUT);
  const [email, setEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [resetAttempts, setResetAttempts] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({ email: false });

  // Clear errors when component focuses
  useFocusEffect(
    useCallback(() => {
      clearPasswordError();
      setValidationErrors({});
    }, [clearPasswordError])
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
      errors.email = t('auth.registerScreen.errors.emailRequired') || 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t('auth.registerScreen.errors.emailInvalid') || 'Ungültige E-Mail-Adresse';
    }

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0 && !!email);
  };

  /**
   * Handle email input change
   */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    clearPasswordError();
    setTouchedFields({ ...touchedFields, email: true });
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
        t('auth.resetScreen.successTitle') || 'E-Mail gesendet',
        t('auth.resetScreen.successMessage') || 'Prüfen Sie Ihr E-Mail-Postfach für weitere Anweisungen.'
      );

    } catch (error) {
      // Error handling is done by the auth hook
      console.error('Password reset failed:', error);
      
      // Show appropriate error based on attempts
      if (resetAttempts >= 3) {
        Alert.alert(
          t('auth.resetScreen.rateLimitTitle') || 'Zu viele Versuche',
          t('auth.resetScreen.rateLimitMessage') || 'Bitte warten Sie 15 Minuten bevor Sie es erneut versuchen.'
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
        t('auth.resetScreen.resendSuccessTitle') || 'E-Mail erneut gesendet',
        t('auth.resetScreen.resendSuccessMessage') || 'Eine neue E-Mail wurde an Ihre Adresse gesendet.'
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
    setTouchedFields({ email: false });
    clearPasswordError();
  };

  /**
   * Render email input step
   */
  const renderEmailInputStep = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('auth.resetScreen.title') || 'Passwort zurücksetzen'}
        </Text>
        <Text style={styles.subtitle}>
          {t('auth.resetScreen.subtitle') || 'Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen'}
        </Text>
      </View>

      {/* Email Form */}
      <View style={styles.formContainer}>
        <FormTextInput
          label={t('auth.resetScreen.emailLabel') || 'E-Mail-Adresse'}
          value={email}
          onChangeText={handleEmailChange}
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

        <FormErrorText errorMessage={error || ''} />

        <PrimaryButton
          label={t('auth.resetScreen.button') || 'Passwort zurücksetzen'}
          onPress={handleReset}
          loading={isLoading}
          disabled={!isFormValid || isLoading}
        />
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityText}>
          🔒 {t('auth.resetScreen.securityNotice') || 'Aus Sicherheitsgründen erhalten Sie nur dann eine E-Mail, wenn Ihr Konto existiert.'}
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
      <View style={styles.successHeader}>
        <Text style={styles.successIcon}>📧</Text>
        <Text style={styles.successTitle}>
          {t('auth.resetScreen.emailSentTitle') || 'E-Mail gesendet!'}
        </Text>
        <Text style={styles.successSubtitle}>
          {t('auth.resetScreen.emailSentMessage') || `Wir haben eine E-Mail an ${email} gesendet. Folgen Sie den Anweisungen in der E-Mail, um Ihr Passwort zurückzusetzen.`}
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>
          {t('auth.resetScreen.nextStepsTitle') || 'Nächste Schritte:'}
        </Text>
        <Text style={styles.instructionStep}>
          1. {t('auth.resetScreen.step1') || 'Prüfen Sie Ihr E-Mail-Postfach'}
        </Text>
        <Text style={styles.instructionStep}>
          2. {t('auth.resetScreen.step2') || 'Klicken Sie auf den Link in der E-Mail'}
        </Text>
        <Text style={styles.instructionStep}>
          3. {t('auth.resetScreen.step3') || 'Erstellen Sie ein neues Passwort'}
        </Text>
      </View>

      {/* Resend Section */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          {t('auth.resetScreen.noEmailReceived') || 'Keine E-Mail erhalten?'}
        </Text>
        
        {canResend ? (
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendEmail}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#007bff" />
            ) : (
              <Text style={styles.resendButtonText}>
                {t('auth.resetScreen.resendButton') || 'E-Mail erneut senden'}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <Text style={styles.cooldownText}>
            {t('auth.resetScreen.resendCooldown') || `Erneut senden in ${resendCooldown}s`}
          </Text>
        )}
      </View>

      {/* Try Different Email */}
      <TouchableOpacity
        style={styles.changeEmailButton}
        onPress={resetForm}
      >
        <Text style={styles.changeEmailText}>
          {t('auth.resetScreen.tryDifferentEmail') || 'Andere E-Mail-Adresse verwenden'}
        </Text>
      </TouchableOpacity>
    </>
  );

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
          {/* Render appropriate step */}
          {currentStep === ResetStep.EMAIL_INPUT && renderEmailInputStep()}
          {currentStep === ResetStep.EMAIL_SENT && renderEmailSentStep()}

          {/* Navigation */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={navigateToLogin}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                ← {t('auth.navigation.backToLogin') || 'Zurück zur Anmeldung'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default withGuestGuard(PasswordResetScreen);
