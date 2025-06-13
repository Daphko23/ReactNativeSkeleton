/**
 * 🔐 Multi-Factor Authentication Setup Modal
 *
 * Allows users to enable MFA with different methods:
 * - TOTP (Time-based One-Time Password)
 * - SMS (Text Message)
 * - Email
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {useAuthSecurity} from '../../hooks';
// import { EnterpriseAlert } from '../../../../shared/components/enterprise-alert/enterprise-alert.component';
// import { AlertType } from '../../../../shared/types/alert.types';
import { useAuthTranslations } from '../../../../../core/i18n/hooks';
import { mfaSetupModalStyles as styles } from './mfa-setup-modal.component.style';

export interface MFASetupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type MFAMethod = 'totp' | 'sms' | 'email';

export const MFASetupModal: React.FC<MFASetupModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<MFAMethod>('totp');
  const [step, setStep] = useState<'select' | 'setup' | 'verify'>('select');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const authT = useAuthTranslations();

  const {enableMFA} = useAuthSecurity();

  const handleMethodSelect = (method: MFAMethod) => {
    setSelectedMethod(method);
    setStep('setup');
  };

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      if (selectedMethod === 'email') {
        // TODO: Implement email MFA setup
        setStep('verify');
        return;
      }

      // Convert string to MFAType enum
      const mfaType = selectedMethod === 'totp' ? 'totp' : 'sms';
      const result = await enableMFA(mfaType as any);

      if (selectedMethod === 'totp' && result.qrCode) {
        setQrCode(result.qrCode);
        if (result.backupCodes && result.backupCodes.length > 0) {
          setSecret(result.backupCodes.join(' ')); // Use backup codes as secret display
        }
      }

      setStep('verify');
    } catch {
      setIsLoading(false);
      Alert.alert('Fehler', 'MFA konnte nicht aktiviert werden.');
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie den 6-stelligen Code ein.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement verification with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Erfolg', 'MFA wurde erfolgreich aktiviert!');
      onSuccess?.();
      handleClose();
    } catch {
      Alert.alert('Fehler', 'Code konnte nicht verifiziert werden.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setSelectedMethod('totp');
    setPhoneNumber('');
    setVerificationCode('');
    setQrCode(null);
    setSecret(null);
    onClose();
  };

  const renderMethodSelection = () => (
    <View style={styles.content}>
      <Text style={styles.title}>
        {authT.mfa.title}
      </Text>
      <Text style={styles.subtitle}>
        {authT.mfa.subtitle}
      </Text>

      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => handleMethodSelect('totp')}>
        <View style={styles.methodIcon}>
          <Text style={styles.methodIconText}>{authT.mfa.methods.totp.icon}</Text>
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>{authT.mfa.methods.totp.title}</Text>
          <Text style={styles.methodDescription}>
            {authT.mfa.methods.totp.description}
          </Text>
        </View>
        <Text style={styles.methodArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => handleMethodSelect('sms')}>
        <View style={styles.methodIcon}>
          <Text style={styles.methodIconText}>{authT.mfa.methods.sms.icon}</Text>
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>{authT.mfa.methods.sms.title}</Text>
          <Text style={styles.methodDescription}>
            {authT.mfa.methods.sms.description}
          </Text>
        </View>
        <Text style={styles.methodArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => handleMethodSelect('email')}>
        <View style={styles.methodIcon}>
          <Text style={styles.methodIconText}>{authT.mfa.methods.email.icon}</Text>
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>{authT.mfa.methods.email.title}</Text>
          <Text style={styles.methodDescription}>
            {authT.mfa.methods.email.description}
          </Text>
        </View>
        <Text style={styles.methodArrow}>›</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSetup = () => (
    <View style={styles.content}>
      <Text style={styles.title}>
        {selectedMethod === 'totp' && authT.mfa.setup.totp.title}
        {selectedMethod === 'sms' && authT.mfa.setup.sms.title}
        {selectedMethod === 'email' && authT.mfa.setup.email.title}
      </Text>

      {selectedMethod === 'totp' && (
        <View style={styles.totpSetup}>
          <Text style={styles.instruction}>
            {authT.mfa.setup.totp.instructions['1']}
          </Text>
          <Text style={styles.instruction}>
            {authT.mfa.setup.totp.instructions['2']}
          </Text>

          {qrCode && (
            <View style={styles.qrContainer}>
              <Image source={{uri: qrCode}} style={styles.qrCode} />
            </View>
          )}

          {secret && (
            <View style={styles.secretContainer}>
              <Text style={styles.secretLabel}>{authT.mfa.setup.totp.secretLabel}</Text>
              <Text style={styles.secretText}>{secret}</Text>
            </View>
          )}
        </View>
      )}

      {selectedMethod === 'sms' && (
        <View style={styles.smsSetup}>
          <Text style={styles.instruction}>
            {authT.mfa.setup.sms.instruction}
          </Text>
          <TextInput
            style={styles.phoneInput}
            placeholder={authT.mfa.setup.sms.placeholder}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
      )}

      {selectedMethod === 'email' && (
        <View style={styles.emailSetup}>
          <Text style={styles.instruction}>
            {authT.mfa.setup.email.instruction}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep('select')}>
          <Text style={styles.backButtonText}>{authT.mfa.buttons.back}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.disabledButton]}
          onPress={handleSetup}
          disabled={
            isLoading || (selectedMethod === 'sms' && !phoneNumber.trim())
          }>
          <Text style={styles.continueButtonText}>
            {isLoading ? authT.mfa.buttons.setting : authT.mfa.buttons.continue}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVerification = () => (
    <View style={styles.content}>
      <Text style={styles.title}>{authT.mfa.verification.title}</Text>
      <Text style={styles.instruction}>
        {authT.mfa.verification.instruction(selectedMethod)}
      </Text>

      <TextInput
        style={styles.codeInput}
        placeholder={authT.mfa.verification.placeholder}
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep('setup')}>
          <Text style={styles.backButtonText}>{authT.mfa.buttons.back}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={isLoading || verificationCode.length !== 6}>
          <Text style={styles.continueButtonText}>
            {isLoading ? authT.mfa.buttons.verifying : authT.mfa.buttons.verify}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {step === 'select' && renderMethodSelection()}
          {step === 'setup' && renderSetup()}
          {step === 'verify' && renderVerification()}
        </ScrollView>
      </View>
    </Modal>
  );
};
