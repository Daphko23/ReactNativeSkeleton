/**
 * @fileoverview PRESENTATION-SCREEN-007: Account Deletion Screen
 * @description Account Deletion Screen für GDPR Compliance mit Supabase Integration.
 * Bietet sichere Account-Löschung mit Bestätigungsprozess und Datenexport.
 * 
 * @businessRule BR-550: GDPR right to deletion (Art. 17)
 * @businessRule BR-551: Secure account deletion with password confirmation
 * @businessRule BR-552: Data export before deletion option
 * @businessRule BR-553: Immediate vs delayed deletion options
 * @businessRule BR-554: Comprehensive data deletion audit
 * 
 * @architecture React functional component with hooks
 * @architecture Supabase account deletion integration
 * @architecture GDPR compliance patterns
 * @architecture Clean Architecture patterns
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AccountDeletionScreen
 * @namespace Auth.Presentation.Screens
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Checkbox, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@core/navigation/navigation.types';
import { PrimaryButton } from '@shared/components/buttons/primary-button.component';
import { FormTextInput } from '@shared/components/form-text-input/form-text-input.component';
import { FormErrorText } from '@shared/components/form-text-input/form-text-error.component';
import { useTheme, createThemedStyles } from '@core/theme/theme.system';
import { useAuth } from '@features/auth/presentation/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { withAuthGuard } from '@shared/hoc/with-auth.guard';

/**
 * @interface AccountDeletionFormData
 * @description Account deletion form state interface
 */
interface AccountDeletionFormData {
  currentPassword: string;
  confirmationText: string;
  deletionReason: string;
}

/**
 * @interface DeletionOptions
 * @description Deletion options interface
 */
interface DeletionOptions {
  exportData: boolean;
  deleteImmediately: boolean;
  keepAnonymizedAnalytics: boolean;
  confirmUnderstanding: boolean;
}

/**
 * @interface ValidationErrors
 * @description Form validation errors interface
 */
interface ValidationErrors {
  currentPassword?: string;
  confirmationText?: string;
  deletionReason?: string;
  options?: string;
}

/**
 * @component AccountDeletionScreen
 * @description Account Deletion Screen mit GDPR Compliance
 * 
 * Features:
 * - GDPR compliant account deletion
 * - Password confirmation required
 * - Data export option before deletion
 * - Immediate vs delayed deletion
 * - Comprehensive deletion audit
 * - Multiple confirmation steps
 * - Deletion reason tracking
 * - Anonymized analytics option
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

  // Warning Step Styles
  warningContainer: {
    alignItems: 'center' as const,
    marginBottom: theme.spacing[8],
  },
  warningIcon: {
    fontSize: theme.typography.fontSizes['4xl'],
    marginBottom: theme.spacing[4],
  },
  warningTitle: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.error,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[3],
    letterSpacing: -0.5,
  },
  warningSubtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },

  // Consequences Styles
  consequencesContainer: {
    backgroundColor: theme.colors.error + '10',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[6],
    borderWidth: 1,
    borderColor: theme.colors.error + '40',
  },
  consequencesTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.error,
    marginBottom: theme.spacing[4],
    textAlign: 'center' as const,
  },
  consequenceItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: theme.spacing[3],
  },
  consequenceIcon: {
    fontSize: theme.typography.fontSizes.base,
    marginRight: theme.spacing[3],
    marginTop: theme.spacing[1],
    color: theme.colors.error,
  },
  consequenceText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.error,
    flex: 1,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },

  // Options Styles
  optionsContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[6],
  },
  optionsTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[4],
  },
  optionItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: theme.spacing[4],
  },
  optionContent: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },
  optionTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  optionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },

  // Confirmation Styles
  confirmationContainer: {
    marginBottom: theme.spacing[6],
  },
  confirmationTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[3],
  },
  confirmationSubtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[6],
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
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

  // Info Box Styles
  infoBox: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    backgroundColor: theme.colors.warning + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.warning + '40',
  },
  infoIcon: {
    fontSize: theme.typography.fontSizes.lg,
    marginRight: theme.spacing[3],
    marginTop: theme.spacing[1],
    color: theme.colors.warning,
  },
  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.warning,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    flex: 1,
  },

  // Progress Styles
  processingContainer: {
    alignItems: 'center' as const,
    paddingVertical: theme.spacing[8],
  },
  processingIcon: {
    fontSize: theme.typography.fontSizes['4xl'],
    marginBottom: theme.spacing[4],
  },
  processingTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[3],
  },
  processingText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: theme.spacing[6],
  },
  progressContainer: {
    width: '100%' as const,
    marginBottom: theme.spacing[4],
  },
  progressText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: theme.spacing[2],
  },

  // Button Styles
  buttonContainer: {
    marginTop: theme.spacing[6],
  },
  dangerButton: {
    backgroundColor: theme.colors.error,
    marginTop: theme.spacing[4],
  },
  cancelButton: {
    marginTop: theme.spacing[4],
    alignItems: 'center' as const,
    paddingVertical: theme.spacing[3],
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
}));

const AccountDeletionScreen = () => {
  const { clearError, logout } = useAuth();
  const _user = useAuth().user;
  const _enterprise = useAuth().enterprise;
  const error = useAuth().error;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // Form State
  const [formData, setFormData] = useState<AccountDeletionFormData>({
    currentPassword: '',
    confirmationText: '',
    deletionReason: '',
  });

  const [deletionOptions, setDeletionOptions] = useState<DeletionOptions>({
    exportData: true,
    deleteImmediately: false,
    keepAnonymizedAnalytics: false,
    confirmUnderstanding: false,
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [currentStep, setCurrentStep] = useState<'warning' | 'confirmation' | 'processing'>('warning');

  // Loading States
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Clear errors when component focuses
  useFocusEffect(
    useCallback(() => {
      clearError();
      setValidationErrors({});
    }, [clearError])
  );

  /**
   * Update form field value
   */
  const updateFormField = (field: keyof AccountDeletionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError();
  };

  /**
   * Update deletion option
   */
  const updateDeletionOption = (option: keyof DeletionOptions, value: boolean) => {
    setDeletionOptions(prev => ({ ...prev, [option]: value }));
  };

  /**
   * Validate current step
   */
  const validateCurrentStep = (): boolean => {
    const errors: ValidationErrors = {};

    if (currentStep === 'warning') {
      if (!deletionOptions.confirmUnderstanding) {
        errors.options = t('auth.accountDeletion.validation.mustConfirmUnderstanding') || 'Sie müssen bestätigen, dass Sie die Konsequenzen verstehen';
      }
    } else if (currentStep === 'confirmation') {
      // Password validation
      if (!formData.currentPassword) {
        errors.currentPassword = t('auth.validation.currentPasswordRequired') || 'Aktuelles Passwort ist erforderlich';
      }

      // Confirmation text validation
      const requiredText = 'ACCOUNT LÖSCHEN';
      if (formData.confirmationText !== requiredText) {
        errors.confirmationText = t('auth.accountDeletion.validation.confirmationTextIncorrect', { text: requiredText }) || `Geben Sie "${requiredText}" ein, um zu bestätigen`;
      }

      // Deletion reason validation
      if (!formData.deletionReason.trim()) {
        errors.deletionReason = t('auth.accountDeletion.validation.deletionReasonRequired') || 'Grund für Löschung ist erforderlich';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle next step
   */
  const handleNextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep === 'warning') {
      setCurrentStep('confirmation');
    } else if (currentStep === 'confirmation') {
      handleAccountDeletion();
    }
  };

  /**
   * Handle data export
   */
  const handleDataExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Mock export implementation - replace with real service call
      const exportData = await exportUserData();
      
      if (exportData) {
        Alert.alert(
          t('auth.accountDeletion.exportSuccessTitle') || 'Daten exportiert',
          t('auth.accountDeletion.exportSuccessMessage') || 'Ihre Daten wurden erfolgreich exportiert und sind in Ihren Downloads verfügbar.'
        );
      }
    } catch (error) {
      console.error('Data export failed:', error);
      Alert.alert(
        t('auth.accountDeletion.exportErrorTitle') || 'Export fehlgeschlagen',
        t('auth.accountDeletion.exportErrorMessage') || 'Datenexport ist fehlgeschlagen. Versuchen Sie es erneut.'
      );
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  /**
   * Handle account deletion
   */
  const handleAccountDeletion = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Final confirmation dialog
    Alert.alert(
      t('auth.accountDeletion.finalConfirmationTitle') || 'Konto endgültig löschen?',
      t('auth.accountDeletion.finalConfirmationMessage') || 'Diese Aktion kann nicht rückgängig gemacht werden. Ihr Konto und alle Daten werden permanent gelöscht.',
      [
        {
          text: t('common.cancel') || 'Abbrechen',
          style: 'cancel'
        },
        {
          text: t('auth.accountDeletion.deleteButton') || 'Konto löschen',
          style: 'destructive',
          onPress: () => proceedWithDeletion()
        }
      ]
    );
  };

  /**
   * Proceed with account deletion
   */
  const proceedWithDeletion = async () => {
    setIsDeleting(true);
    setCurrentStep('processing');

    try {
      // Export data first if requested
      if (deletionOptions.exportData) {
        await handleDataExport();
      }

      // Verify password first
      const isPasswordValid = await verifyCurrentPassword(formData.currentPassword);
      
      if (!isPasswordValid) {
        setValidationErrors(prev => ({
          ...prev,
          currentPassword: t('auth.validation.currentPasswordIncorrect') || 'Aktuelles Passwort ist falsch'
        }));
        setCurrentStep('confirmation');
        return;
      }

      // Delete account
      await deleteAccount({
        password: formData.currentPassword,
        reason: formData.deletionReason,
        deleteImmediately: deletionOptions.deleteImmediately,
        keepAnonymizedAnalytics: deletionOptions.keepAnonymizedAnalytics,
      });

      // Show success and logout
      Alert.alert(
        t('auth.accountDeletion.successTitle') || 'Konto gelöscht',
        t('auth.accountDeletion.successMessage') || 'Ihr Konto wurde erfolgreich gelöscht. Alle persönlichen Daten wurden entfernt.',
        [
          {
            text: 'OK',
            onPress: async () => {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        ]
      );

    } catch (error) {
      console.error('Account deletion failed:', error);
      Alert.alert(
        t('auth.accountDeletion.errorTitle') || 'Löschung fehlgeschlagen',
        t('auth.accountDeletion.errorMessage') || 'Konto konnte nicht gelöscht werden. Versuchen Sie es erneut.'
      );
      setCurrentStep('confirmation');
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Export user data
   */
  const exportUserData = async (): Promise<boolean> => {
    try {
      // Mock implementation - replace with real service call
      console.log('Exporting user data...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    }
  };

  /**
   * Verify current password
   */
  const verifyCurrentPassword = async (password: string): Promise<boolean> => {
    try {
      // Mock implementation - replace with real service call
      console.log('Verifying password for deletion:', password);
      return true;
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
  };

  /**
   * Delete account
   */
  const deleteAccount = async (options: any): Promise<void> => {
    try {
      // Mock implementation - replace with real Supabase call
      console.log('Deleting account with options:', options);
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error('Account deletion failed:', error);
      throw error;
    }
  };

  // Render processing step
  if (currentStep === 'processing') {
    return (
      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.processingTitle}>
          {t('auth.accountDeletion.processingTitle') || 'Konto wird gelöscht...'}
        </Text>
        <Text style={styles.processingText}>
          {t('auth.accountDeletion.processingText') || 'Bitte warten Sie, während Ihr Konto und alle Daten gelöscht werden.'}
        </Text>
        
        {isExporting && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {t('auth.accountDeletion.exportingData') || 'Daten werden exportiert...'} {exportProgress}%
            </Text>
          </View>
        )}
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
        <View style={styles.warningContainer}>
          <Text style={styles.warningIcon}>🗑️</Text>
          <Text style={styles.warningTitle}>
            {t('auth.accountDeletion.warningTitle') || '⚠️ Wichtige Information'}
          </Text>
          <Text style={styles.warningSubtitle}>
            {currentStep === 'warning' 
              ? t('auth.accountDeletion.warningSubtitle') || 'Diese Aktion kann nicht rückgängig gemacht werden'
              : t('auth.accountDeletion.confirmationSubtitle') || 'Bestätigen Sie die Löschung Ihres Kontos'
            }
          </Text>
        </View>

        {/* Warning Step */}
        {currentStep === 'warning' && (
          <View style={styles.consequencesContainer}>
            {/* Warning Info */}
            <View style={styles.consequencesContainer}>
              <Text style={styles.consequencesTitle}>
                {t('auth.accountDeletion.consequencesTitle') || '⚠️ Wichtige Information'}
              </Text>
              <Text style={styles.consequenceItem}>
                <Text style={styles.consequenceIcon}>•</Text>
                <Text style={styles.consequenceText}>
                  {t('auth.accountDeletion.consequencesMessage') || 'Die Löschung Ihres Kontos führt zum permanenten Verlust aller Ihrer Daten, einschließlich:\n\n• Persönliche Informationen\n• Benutzereinstellungen\n• Gespeicherte Inhalte\n• Transaktionshistorie\n\nDiese Aktion kann NICHT rückgängig gemacht werden.'}
                </Text>
              </Text>
            </View>

            {/* GDPR Info */}
            <View style={styles.consequencesContainer}>
              <Text style={styles.consequencesTitle}>
                {t('auth.accountDeletion.gdprTitle') || 'GDPR Rechte'}
              </Text>
              <Text style={styles.consequenceItem}>
                <Text style={styles.consequenceIcon}>•</Text>
                <Text style={styles.consequenceText}>
                  {t('auth.accountDeletion.gdprMessage') || 'Sie haben das Recht auf Löschung Ihrer personenbezogenen Daten gemäß Art. 17 DSGVO. Vor der Löschung können Sie Ihre Daten exportieren.'}
                </Text>
              </Text>
            </View>

            {/* Data Export Option */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => updateDeletionOption('exportData', !deletionOptions.exportData)}
              >
                <Checkbox
                  status={deletionOptions.exportData ? 'checked' : 'unchecked'}
                  onPress={() => updateDeletionOption('exportData', !deletionOptions.exportData)}
                />
                <Text style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    {t('auth.accountDeletion.exportDataOption') || 'Meine Daten vor der Löschung exportieren'}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {t('auth.accountDeletion.exportDataDescription') || 'Diese Option ermöglicht es Ihnen, Ihre Daten vor der Löschung zu exportieren.'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Understanding Confirmation */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => updateDeletionOption('confirmUnderstanding', !deletionOptions.confirmUnderstanding)}
              >
                <Checkbox
                  status={deletionOptions.confirmUnderstanding ? 'checked' : 'unchecked'}
                  onPress={() => updateDeletionOption('confirmUnderstanding', !deletionOptions.confirmUnderstanding)}
                />
                <Text style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    {t('auth.accountDeletion.confirmUnderstanding') || 'Ich verstehe, dass diese Aktion unwiderruflich ist'}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {t('auth.accountDeletion.confirmUnderstandingDescription') || 'Diese Bestätigung ist erforderlich, um die Löschung zu bestätigen.'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {validationErrors.options && (
              <Text style={styles.validationError}>
                {validationErrors.options}
              </Text>
            )}
          </View>
        )}

        {/* Confirmation Step */}
        {currentStep === 'confirmation' && (
          <View style={styles.formContainer}>
            {/* Current Password */}
            <FormTextInput
              label={t('auth.accountDeletion.currentPasswordLabel') || 'Aktuelles Passwort zur Bestätigung'}
              value={formData.currentPassword}
              onChangeText={(value) => updateFormField('currentPassword', value)}
              secureTextEntry
              error={!!validationErrors.currentPassword}
            />
            {validationErrors.currentPassword && (
              <Text style={styles.validationError}>
                {validationErrors.currentPassword}
              </Text>
            )}

            {/* Confirmation Text */}
            <FormTextInput
              label={t('auth.accountDeletion.confirmationTextLabel') || 'Geben Sie "ACCOUNT LÖSCHEN" ein'}
              value={formData.confirmationText}
              onChangeText={(value) => updateFormField('confirmationText', value)}
              error={!!validationErrors.confirmationText}
            />
            {validationErrors.confirmationText && (
              <Text style={styles.validationError}>
                {validationErrors.confirmationText}
              </Text>
            )}

            {/* Deletion Reason */}
            <FormTextInput
              label={t('auth.accountDeletion.deletionReasonLabel') || 'Grund für die Löschung (erforderlich)'}
              value={formData.deletionReason}
              onChangeText={(value) => updateFormField('deletionReason', value)}
              error={!!validationErrors.deletionReason}
            />
            {validationErrors.deletionReason && (
              <Text style={styles.validationError}>
                {validationErrors.deletionReason}
              </Text>
            )}

            {/* Additional Options */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => updateDeletionOption('deleteImmediately', !deletionOptions.deleteImmediately)}
              >
                <Checkbox
                  status={deletionOptions.deleteImmediately ? 'checked' : 'unchecked'}
                  onPress={() => updateDeletionOption('deleteImmediately', !deletionOptions.deleteImmediately)}
                />
                <Text style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    {t('auth.accountDeletion.deleteImmediatelyOption') || 'Sofort löschen (keine 30-Tage Wartezeit)'}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {t('auth.accountDeletion.deleteImmediatelyDescription') || 'Diese Option ermöglicht es Ihnen, Ihr Konto sofort zu löschen, ohne eine Wartezeit zu warten.'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            <FormErrorText errorMessage={error} />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {currentStep === 'warning' && (
            <>
              <PrimaryButton
                label={t('auth.accountDeletion.continueButton') || 'Weiter zur Bestätigung'}
                onPress={handleNextStep}
                disabled={!deletionOptions.confirmUnderstanding}
              />
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>
                  {t('common.cancel') || 'Abbrechen'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {currentStep === 'confirmation' && (
            <>
              <PrimaryButton
                label={t('auth.accountDeletion.deleteButton') || 'Konto löschen'}
                onPress={handleNextStep}
                loading={isDeleting}
                disabled={isDeleting}
              />
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCurrentStep('warning')}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>
                  {t('common.back') || 'Zurück'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withAuthGuard(AccountDeletionScreen); 