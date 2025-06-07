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
import { useTheme, createThemedStyles } from '@core/theme/theme.system';
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

const useStyles = createThemedStyles((theme) => ({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[10],
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing[6],
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[4],
    textAlign: 'center' as const,
  },

  // Success Styles
  successContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing[6],
  },
  successIcon: {
    fontSize: theme.typography.fontSizes['4xl'],
    marginBottom: theme.spacing[6],
  },
  successTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.success,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[3],
  },
  successMessage: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
  },

  // Header Styles
  header: {
    marginBottom: theme.spacing[8],
    alignItems: 'center' as const,
  },
  headerIcon: {
    fontSize: theme.typography.fontSizes['4xl'],
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[2],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
    paddingHorizontal: theme.spacing[4],
  },

  // Form Styles
  formContainer: {
    gap: theme.spacing[5],
  },
  validationError: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    marginTop: -theme.spacing[4],
    marginBottom: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
  },
  attemptsText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.warning,
    textAlign: 'center' as const,
    marginTop: -theme.spacing[2],
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Info Box Styles
  infoBox: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    backgroundColor: theme.colors.info + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginTop: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.info + '40',
  },
  infoIcon: {
    fontSize: theme.typography.fontSizes.lg,
    marginRight: theme.spacing[3],
    marginTop: theme.spacing[1],
  },
  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.info,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    flex: 1,
  },

  // Back Button Styles
  backButton: {
    marginTop: theme.spacing[6],
    alignItems: 'center' as const,
    paddingVertical: theme.spacing[3],
  },
  backButtonText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Resend Button Styles
  resendContainer: {
    marginTop: theme.spacing[4],
    alignItems: 'center' as const,
  },
  resendText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[2],
  },
  resendButton: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  resendButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  resendDisabledText: {
    color: theme.colors.textTertiary,
  },
}));

const EmailVerificationScreen = () => {
  const { user: _user, error, clearError, logout: _logout } = useAuth();
  const _isLoading = useAuth().isLoading;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles(theme);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>
          {t('auth.emailVerification.verifyingMessage') || 'Email wird bestätigt...'}
        </Text>
      </View>
    );
  }

  // Show success state
  if (verificationSuccess) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>
          {t('auth.emailVerification.successTitle') || 'Email bestätigt!'}
        </Text>
        <Text style={styles.successMessage}>
          {t('auth.emailVerification.successMessage') || 'Ihre Email wurde erfolgreich bestätigt.'}
        </Text>
      </View>
    );
  }

  return (
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
          <Text style={styles.headerIcon}>📧</Text>
          <Text style={styles.title}>
            {t('auth.emailVerification.title') || 'Email bestätigen'}
          </Text>
          <Text style={styles.subtitle}>
            {t('auth.emailVerification.subtitle') || 'Bestätigen Sie Ihre Email-Adresse, um Ihr Konto zu aktivieren'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Field */}
          <FormTextInput
            label={t('auth.emailVerification.emailLabel') || 'Email-Adresse'}
            value={formData.email}
            onChangeText={(value) => updateFormField('email', value)}
            keyboardType="email-address"
            error={!!validationErrors.email}
          />
          {validationErrors.email && (
            <Text style={styles.validationError}>
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
                <Text style={styles.validationError}>
                  {validationErrors.verificationCode}
                </Text>
              )}

              {/* Attempts Counter */}
              <Text style={styles.attemptsText}>
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
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              {t('auth.emailVerification.infoMessage') || 'Prüfen Sie auch Ihren Spam-Ordner, falls Sie keine Email erhalten haben.'}
            </Text>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backButtonText}>
              {t('auth.emailVerification.backToLogin') || 'Zurück zur Anmeldung'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withGuestGuard(EmailVerificationScreen); 