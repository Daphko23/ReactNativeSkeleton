/**
 * @fileoverview PRESENTATION-SCREEN-004: Optimized Enterprise Security Settings Screen
 * @description Vollständig optimierter Security Settings Screen mit Enterprise Features.
 * Bietet umfassende Sicherheitseinstellungen mit modernem UX Design.
 * 
 * @businessRule BR-600: Comprehensive security settings management
 * @businessRule BR-601: Multi-factor authentication configuration
 * @businessRule BR-602: Biometric authentication settings
 * @businessRule BR-603: Password policy management
 * @businessRule BR-604: Session and device management
 * @businessRule BR-605: Security event monitoring
 * @businessRule BR-606: Data export and account management
 * 
 * @architecture React functional component with hooks
 * @architecture Integration with enterprise auth services
 * @architecture Clean Architecture patterns
 * @architecture Responsive design with modern UX patterns
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module SecuritySettingsScreen
 * @namespace Auth.Presentation.Screens
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { 
  Text, 
  Card, 
  Switch, 
  Divider, 
  ActivityIndicator,
  Badge,
} from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@core/navigation/navigation.types';
import { useTheme, createThemedStyles } from '@core/theme/theme.system';
import { useAuth } from '@features/auth/presentation/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { withAuthGuard } from '@shared/hoc/with-auth.guard';

/**
 * @interface SecuritySettings
 * @description Security settings state interface
 */
interface SecuritySettings {
  mfaEnabled: boolean;
  biometricEnabled: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  securityAlerts: boolean;
  dataExportEnabled: boolean;
  accountLocked: boolean;
}

/**
 * @interface ActiveSession
 * @description Active session interface
 */
interface ActiveSession {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  location: string;
  lastActive: Date;
  isCurrent: boolean;
  ipAddress: string;
}

/**
 * @interface SecurityEvent
 * @description Security event interface
 */
interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'mfa_setup' | 'suspicious_activity';
  description: string;
  timestamp: Date;
  location: string;
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * @component SecuritySettingsScreen
 * @description Optimized Enterprise Security Settings Screen
 * 
 * Features:
 * - Comprehensive security settings management
 * - Multi-factor authentication setup
 * - Biometric authentication configuration
 * - Active session management
 * - Security event monitoring
 * - Password policy configuration
 * - Data export and privacy controls
 * - Emergency security actions
 */

const useStyles = createThemedStyles((theme) => ({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing[8],
  },
  notLoggedInIcon: {
    fontSize: theme.typography.fontSizes['4xl'],
    marginBottom: theme.spacing[4],
  },
  notLoggedInTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[3],
    textAlign: 'center' as const,
  },
  notLoggedInText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
  },

  // Header Styles
  header: {
    padding: theme.spacing[6],
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[3],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
  },

  // Section Styles
  section: {
    backgroundColor: theme.colors.surface,
    marginVertical: theme.spacing[3],
    marginHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing[6],
  },
  sectionIcon: {
    fontSize: theme.typography.fontSizes.xl,
    marginRight: theme.spacing[4],
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  sectionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },

  // Setting Item Styles
  settingItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing[4],
    minHeight: 64,
  },
  settingContent: {
    flex: 1,
    marginRight: theme.spacing[4],
  },
  settingTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  settingDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  loadingIndicator: {
    marginLeft: theme.spacing[3],
  },

  // MFA Factors Styles
  factorsList: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: theme.spacing[3],
  },
  factorBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing[3],
    marginBottom: theme.spacing[1],
  },

  // Divider Styles
  divider: {
    marginVertical: theme.spacing[4],
    backgroundColor: theme.colors.border,
  },

  // Action Button Styles
  actionButton: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.medium,
  },
  actionButtonArrow: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textSecondary,
  },

  // Info Box Styles
  infoBox: {
    backgroundColor: theme.colors.info + '20',
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    marginTop: theme.spacing[4],
  },
  infoTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing[3],
  },
  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    marginBottom: theme.spacing[1],
  },

  // Session Styles
  centerLoader: {
    paddingVertical: theme.spacing[8],
  },
  sessionItem: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
  },
  sessionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing[2],
  },
  sessionDevice: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  currentBadge: {
    backgroundColor: theme.colors.success,
  },
  sessionInfo: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[1],
  },
  sessionIp: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textTertiary,
    fontFamily: 'monospace',
    marginBottom: theme.spacing[2],
  },
  terminateButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start' as const,
  },
  terminateButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },

  // Events Styles
  eventItem: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
    borderLeftWidth: 3,
  },
  eventHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing[2],
  },
  eventType: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
  },
  eventBadge: {
    borderRadius: theme.borderRadius.sm,
  },
  eventDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[1],
  },
  eventMeta: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textTertiary,
  },
  eventInfo: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[1],
  },
  riskBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  riskBadgeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.surface,
  },

  // Danger Zone Styles
  dangerZone: {
    backgroundColor: theme.colors.error + '10',
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  dangerTitle: {
    color: theme.colors.error,
  },
  dangerDescription: {
    color: theme.colors.error + 'CC',
  },
  dangerButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  dangerButtonText: {
    color: theme.colors.surface,
  },

  // Emergency Styles
  emergencyButton: {
    backgroundColor: theme.colors.warning,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
    alignItems: 'center' as const,
  },
  emergencyButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  deleteButtonText: {
    color: theme.colors.surface,
  },

  // Notifications Styles
  notificationItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing[4],
  },
}));

const SecuritySettingsScreen = () => {
  const { user, enterprise, clearError } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // State Management
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    mfaEnabled: false,
    biometricEnabled: false,
    sessionTimeout: 30, // minutes
    loginNotifications: true,
    securityAlerts: true,
    dataExportEnabled: true,
    accountLocked: false,
  });

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [mfaFactors, setMfaFactors] = useState<any[]>([]);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    mfa: false,
    biometric: false,
    sessions: false,
    events: false,
    export: false,
  });

  // Clear errors when component focuses
  useFocusEffect(
    useCallback(() => {
      clearError();
    }, [clearError])
  );

  // Load security data on mount
  useEffect(() => {
    loadSecurityData();
    checkBiometricAvailability();
  }, []);

  /**
   * Load all security-related data
   */
  const loadSecurityData = async () => {
    try {
      setRefreshing(true);
      
      // Load security settings
      await loadSecuritySettings();
      
      // Load MFA factors
      await loadMFAFactors();
      
      // Load active sessions
      await loadActiveSessions();
      
      // Load recent security events
      await loadSecurityEvents();
      
    } catch (error) {
      console.error('Failed to load security data:', error);
      Alert.alert(
        t('security.loadError.title') || 'Fehler',
        t('security.loadError.message') || 'Sicherheitsdaten konnten nicht geladen werden.'
      );
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Load security settings
   */
  const loadSecuritySettings = async () => {
    try {
      // Mock implementation - replace with real API calls
      setSettings({
        mfaEnabled: false,
        biometricEnabled: false,
        sessionTimeout: 30,
        loginNotifications: true,
        securityAlerts: true,
        dataExportEnabled: true,
        accountLocked: false,
      });
    } catch (error) {
      console.error('Failed to load security settings:', error);
    }
  };

  /**
   * Load MFA factors
   */
  const loadMFAFactors = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, mfa: true }));
      // Use AuthServiceContainer methods - mock for now
      const factors: any[] = []; // await enterprise.getMFAFactors();
      setMfaFactors(factors);
      setSettings(prev => ({ ...prev, mfaEnabled: factors.length > 0 }));
    } catch (error) {
      console.error('Failed to load MFA factors:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, mfa: false }));
    }
  };

  /**
   * Load active sessions
   */
  const loadActiveSessions = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, sessions: true }));
      // Mock implementation
      setActiveSessions([
        {
          id: 'current',
          deviceName: Platform.OS === 'ios' ? 'iPhone' : 'Android Device',
          deviceType: 'mobile',
          location: 'Deutschland',
          lastActive: new Date(),
          isCurrent: true,
          ipAddress: '192.168.1.1',
        },
        {
          id: 'desktop',
          deviceName: 'MacBook Pro',
          deviceType: 'desktop',
          location: 'Deutschland',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isCurrent: false,
          ipAddress: '192.168.1.2',
        },
      ]);
    } catch (error) {
      console.error('Failed to load active sessions:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, sessions: false }));
    }
  };

  /**
   * Load recent security events
   */
  const loadSecurityEvents = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, events: true }));
      // Mock implementation
      setRecentEvents([
        {
          id: '1',
          type: 'login',
          description: 'Erfolgreiche Anmeldung',
          timestamp: new Date(),
          location: 'Deutschland',
          riskLevel: 'low',
        },
        {
          id: '2',
          type: 'password_change',
          description: 'Passwort geändert',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          location: 'Deutschland',
          riskLevel: 'low',
        },
      ]);
    } catch (error) {
      console.error('Failed to load security events:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, events: false }));
    }
  };

  /**
   * Check biometric availability
   */
  const checkBiometricAvailability = async () => {
    try {
      // Use the same pattern as in login screen
      const available = await enterprise.biometric.isAvailable();
      setBiometricAvailable(Boolean(available));
      
      if (available) {
        // Check if biometric is already enabled
        // This would come from user preferences or settings
        setSettings(prev => ({ ...prev, biometricEnabled: false }));
      }
    } catch (error) {
      console.error('Failed to check biometric availability:', error);
      setBiometricAvailable(false);
    }
  };

  /**
   * Handle MFA toggle
   */
  const handleMFAToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        setLoadingStates(prev => ({ ...prev, mfa: true }));
        // Mock implementation for now - replace with real container call
        const result = { success: true }; // await enterprise.enableMFA('totp');
        
        if (result.success) {
          Alert.alert(
            t('security.mfa.setupTitle') || 'MFA Einrichtung',
            t('security.mfa.setupMessage') || 'Scannen Sie den QR-Code mit Ihrer Authenticator-App.',
            [{ text: 'OK', onPress: () => loadMFAFactors() }]
          );
        }
      } catch (error) {
        console.error('Failed to enable MFA:', error);
        Alert.alert(
          t('security.mfa.errorTitle') || 'Fehler',
          t('security.mfa.errorMessage') || 'MFA konnte nicht aktiviert werden.'
        );
      } finally {
        setLoadingStates(prev => ({ ...prev, mfa: false }));
      }
    } else {
      Alert.alert(
        t('security.mfa.disableTitle') || 'MFA deaktivieren',
        t('security.mfa.disableMessage') || 'Möchten Sie die Zwei-Faktor-Authentifizierung wirklich deaktivieren?',
        [
          { text: t('common.cancel') || 'Abbrechen', style: 'cancel' },
          { 
            text: t('common.disable') || 'Deaktivieren', 
            style: 'destructive',
            onPress: async () => {
              // Implement MFA disable logic
              setSettings(prev => ({ ...prev, mfaEnabled: false }));
              await loadMFAFactors();
            }
          }
        ]
      );
    }
  };

  /**
   * Handle biometric toggle
   */
  const handleBiometricToggle = async (enabled: boolean) => {
    if (!biometricAvailable) {
      Alert.alert(
        t('security.biometric.unavailableTitle') || 'Nicht verfügbar',
        t('security.biometric.unavailableMessage') || 'Biometrische Authentifizierung ist auf diesem Gerät nicht verfügbar.'
      );
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, biometric: true }));
      
      if (enabled) {
        // Use the same pattern as in login screen
        await enterprise.biometric.authenticate();
        Alert.alert(
          t('security.biometric.enabledTitle') || 'Aktiviert',
          t('security.biometric.enabledMessage') || 'Biometrische Authentifizierung wurde aktiviert.'
        );
      } else {
        // Disable biometric authentication
        Alert.alert(
          t('security.biometric.disableTitle') || 'Deaktivieren',
          t('security.biometric.disableMessage') || 'Biometrische Authentifizierung deaktivieren?',
          [
            { text: t('common.cancel') || 'Abbrechen', style: 'cancel' },
            { 
              text: t('common.disable') || 'Deaktivieren',
              onPress: () => setSettings(prev => ({ ...prev, biometricEnabled: false }))
            }
          ]
        );
        return;
      }
      
      setSettings(prev => ({ ...prev, biometricEnabled: enabled }));
    } catch (error) {
      console.error('Failed to toggle biometric:', error);
      Alert.alert(
        t('security.biometric.errorTitle') || 'Fehler',
        t('security.biometric.errorMessage') || 'Biometrische Authentifizierung konnte nicht konfiguriert werden.'
      );
    } finally {
      setLoadingStates(prev => ({ ...prev, biometric: false }));
    }
  };

  /**
   * Handle session termination
   */
  const handleTerminateSession = (sessionId: string) => {
    Alert.alert(
      t('security.sessions.terminateTitle') || 'Sitzung beenden',
      t('security.sessions.terminateMessage') || 'Möchten Sie diese Sitzung beenden?',
      [
        { text: t('common.cancel') || 'Abbrechen', style: 'cancel' },
        {
          text: t('common.terminate') || 'Beenden',
          style: 'destructive',
          onPress: async () => {
            try {
              // Implement session termination
              setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
              Alert.alert(
                t('common.success') || 'Erfolg',
                t('security.sessions.terminatedMessage') || 'Sitzung wurde beendet.'
              );
            } catch (error) {
              console.error('Failed to terminate session:', error);
            }
          }
        }
      ]
    );
  };

  /**
   * Handle terminate all sessions
   */
  const handleTerminateAllSessions = () => {
    Alert.alert(
      t('security.sessions.terminateAllTitle') || 'Alle Sitzungen beenden',
      t('security.sessions.terminateAllMessage') || 'Möchten Sie sich auf allen anderen Geräten abmelden?',
      [
        { text: t('common.cancel') || 'Abbrechen', style: 'cancel' },
        {
          text: t('common.terminate') || 'Beenden',
          style: 'destructive',
          onPress: async () => {
            try {
              // Keep only current session
              setActiveSessions(prev => prev.filter(session => session.isCurrent));
              Alert.alert(
                t('common.success') || 'Erfolg',
                t('security.sessions.allTerminatedMessage') || 'Alle anderen Sitzungen wurden beendet.'
              );
            } catch (error) {
              console.error('Failed to terminate all sessions:', error);
            }
          }
        }
      ]
    );
  };

  /**
   * Handle data export
   */
  const handleDataExport = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, export: true }));
      // Mock implementation for now - replace with real container call
      // const data = await enterprise.exportUserData();
      
      Alert.alert(
        t('security.export.successTitle') || 'Export erfolgreich',
        t('security.export.successMessage') || 'Ihre Daten wurden exportiert und per E-Mail gesendet.'
      );
    } catch (error) {
      console.error('Failed to export data:', error);
      Alert.alert(
        t('security.export.errorTitle') || 'Export fehlgeschlagen',
        t('security.export.errorMessage') || 'Datenexport konnte nicht durchgeführt werden.'
      );
    } finally {
      setLoadingStates(prev => ({ ...prev, export: false }));
    }
  };

  /**
   * Handle account deletion request
   */
  const handleAccountDeletion = () => {
    Alert.alert(
      t('security.account.deleteTitle') || 'Konto löschen',
      t('security.account.deleteMessage') || 'WARNUNG: Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden dauerhaft gelöscht.',
      [
        { text: t('common.cancel') || 'Abbrechen', style: 'cancel' },
        {
          text: t('common.delete') || 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              // Mock implementation for now - replace with real container call
              // await enterprise.requestDataDeletion('User requested account deletion');
              Alert.alert(
                t('security.account.deletionRequestedTitle') || 'Löschung beantragt',
                t('security.account.deletionRequestedMessage') || 'Ihr Konto wird in 30 Tagen gelöscht. Sie erhalten eine Bestätigungs-E-Mail.'
              );
            } catch (error) {
              console.error('Failed to request account deletion:', error);
            }
          }
        }
      ]
    );
  };

  /**
   * Get device icon based on type
   */
  const getDeviceIcon = (deviceType: string): string => {
    switch (deviceType) {
      case 'mobile': return '📱';
      case 'desktop': return '💻';
      case 'tablet': return '📲';
      default: return '📱';
    }
  };

  /**
   * Get risk level color
   */
  const getRiskLevelColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#666666';
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(() => {
    loadSecurityData();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInIcon}>🔒</Text>
          <Text style={styles.notLoggedInTitle}>
            {t('security.notLoggedIn.title') || 'Anmeldung erforderlich'}
          </Text>
          <Text style={styles.notLoggedInText}>
            {t('security.notLoggedIn.message') || 'Melden Sie sich an, um Ihre Sicherheitseinstellungen zu verwalten.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('security.title') || 'Sicherheitseinstellungen'}
        </Text>
        <Text style={styles.subtitle}>
          {t('security.subtitle') || 'Verwalten Sie Ihre Kontosicherheit und Authentifizierungsmethoden'}
        </Text>
      </View>

      {/* Authentication Section */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔐</Text>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                {t('security.authentication.title') || 'Authentifizierung'}
              </Text>
              <Text style={styles.sectionDescription}>
                {t('security.authentication.description') || 'Konfigurieren Sie Ihre Anmeldemethoden'}
              </Text>
            </View>
          </View>

          {/* MFA Settings */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {t('security.mfa.title') || 'Zwei-Faktor-Authentifizierung'}
              </Text>
              <Text style={styles.settingDescription}>
                {t('security.mfa.description') || 'Zusätzliche Sicherheitsebene für Ihr Konto'}
              </Text>
              {settings.mfaEnabled && mfaFactors.length > 0 && (
                <View style={styles.factorsList}>
                  {mfaFactors.map((factor, index) => (
                    <Badge key={index} style={styles.factorBadge}>
                      {factor.type.toUpperCase()}
                    </Badge>
                  ))}
                </View>
              )}
            </View>
            <Switch
              value={settings.mfaEnabled}
              onValueChange={handleMFAToggle}
              disabled={loadingStates.mfa}
            />
            {loadingStates.mfa && (
              <ActivityIndicator size="small" style={styles.loadingIndicator} />
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Biometric Settings */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {t('security.biometric.title') || 'Biometrische Authentifizierung'}
              </Text>
              <Text style={styles.settingDescription}>
                {biometricAvailable 
                  ? (t('security.biometric.availableDescription') || 'Touch ID / Face ID / Fingerabdruck')
                  : (t('security.biometric.unavailableDescription') || 'Nicht verfügbar auf diesem Gerät')
                }
              </Text>
            </View>
            <Switch
              value={settings.biometricEnabled}
              onValueChange={handleBiometricToggle}
              disabled={!biometricAvailable || loadingStates.biometric}
            />
            {loadingStates.biometric && (
              <ActivityIndicator size="small" style={styles.loadingIndicator} />
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Password Management Section */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔑</Text>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                {t('security.password.title') || 'Passwort-Verwaltung'}
              </Text>
              <Text style={styles.sectionDescription}>
                {t('security.password.description') || 'Passwort ändern und Sicherheitsrichtlinien'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('PasswordReset')}
          >
            <Text style={styles.actionButtonText}>
              {t('security.password.changeButton') || 'Passwort ändern'}
            </Text>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              {t('security.password.policyTitle') || 'Passwort-Richtlinien:'}
            </Text>
            <Text style={styles.infoText}>
              • {t('security.password.rule1') || 'Mindestens 8 Zeichen'}
            </Text>
            <Text style={styles.infoText}>
              • {t('security.password.rule2') || 'Groß- und Kleinbuchstaben'}
            </Text>
            <Text style={styles.infoText}>
              • {t('security.password.rule3') || 'Zahlen und Sonderzeichen'}
            </Text>
            <Text style={styles.infoText}>
              • {t('security.password.rule4') || 'Keine häufig verwendeten Passwörter'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Active Sessions Section */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📱</Text>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                {t('security.sessions.title') || 'Aktive Sitzungen'}
              </Text>
              <Text style={styles.sectionDescription}>
                {t('security.sessions.description') || 'Verwalten Sie Ihre Anmeldungen auf verschiedenen Geräten'}
              </Text>
            </View>
          </View>

          {loadingStates.sessions ? (
            <ActivityIndicator size="large" style={styles.centerLoader} />
          ) : (
            <>
              {activeSessions.map((session) => (
                <View key={session.id} style={styles.sessionItem}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionDevice}>
                      {getDeviceIcon(session.deviceType)} {session.deviceName}
                    </Text>
                    {session.isCurrent && (
                      <Badge style={styles.currentBadge}>
                        {t('security.sessions.current') || 'Aktuell'}
                      </Badge>
                    )}
                  </View>
                  <Text style={styles.sessionInfo}>
                    {session.location} • {session.lastActive.toLocaleDateString()}
                  </Text>
                  <Text style={styles.sessionIp}>
                    IP: {session.ipAddress}
                  </Text>
                  {!session.isCurrent && (
                    <TouchableOpacity
                      style={styles.terminateButton}
                      onPress={() => handleTerminateSession(session.id)}
                    >
                      <Text style={styles.terminateButtonText}>
                        {t('security.sessions.terminate') || 'Beenden'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={styles.dangerButton}
                onPress={handleTerminateAllSessions}
              >
                <Text style={styles.dangerButtonText}>
                  {t('security.sessions.terminateAll') || 'Alle anderen Sitzungen beenden'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Security Events Section */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📊</Text>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                {t('security.events.title') || 'Sicherheitsereignisse'}
              </Text>
              <Text style={styles.sectionDescription}>
                {t('security.events.description') || 'Überwachen Sie verdächtige Aktivitäten'}
              </Text>
            </View>
          </View>

          {loadingStates.events ? (
            <ActivityIndicator size="large" style={styles.centerLoader} />
          ) : (
            <>
              {recentEvents.slice(0, 3).map((event) => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventDescription}>
                      {event.description}
                    </Text>
                    <View 
                      style={[
                        styles.riskBadge,
                        { backgroundColor: getRiskLevelColor(event.riskLevel) }
                      ]}
                    >
                      <Text style={styles.riskBadgeText}>
                        {event.riskLevel.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.eventInfo}>
                    {event.location} • {event.timestamp.toLocaleDateString()}
                  </Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // Navigate to full security events screen
                  Alert.alert(
                    t('security.events.viewAllTitle') || 'Alle Ereignisse',
                    t('security.events.viewAllMessage') || 'Vollständige Sicherheitsereignisse werden implementiert...'
                  );
                }}
              >
                <Text style={styles.actionButtonText}>
                  {t('security.events.viewAll') || 'Alle Ereignisse anzeigen'}
                </Text>
                <Text style={styles.actionButtonArrow}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Notifications Section */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔔</Text>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                {t('security.notifications.title') || 'Benachrichtigungen'}
              </Text>
              <Text style={styles.sectionDescription}>
                {t('security.notifications.description') || 'Konfigurieren Sie Sicherheitsbenachrichtigungen'}
              </Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {t('security.notifications.login') || 'Anmelde-Benachrichtigungen'}
              </Text>
              <Text style={styles.settingDescription}>
                {t('security.notifications.loginDescription') || 'Benachrichtigung bei neuen Anmeldungen'}
              </Text>
            </View>
            <Switch
              value={settings.loginNotifications}
              onValueChange={(value) => setSettings(prev => ({ ...prev, loginNotifications: value }))}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {t('security.notifications.alerts') || 'Sicherheitswarnungen'}
              </Text>
              <Text style={styles.settingDescription}>
                {t('security.notifications.alertsDescription') || 'Benachrichtigung bei verdächtigen Aktivitäten'}
              </Text>
            </View>
            <Switch
              value={settings.securityAlerts}
              onValueChange={(value) => setSettings(prev => ({ ...prev, securityAlerts: value }))}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Data & Privacy Section */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🗃️</Text>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                {t('security.data.title') || 'Daten & Datenschutz'}
              </Text>
              <Text style={styles.sectionDescription}>
                {t('security.data.description') || 'Verwalten Sie Ihre persönlichen Daten'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDataExport}
            disabled={loadingStates.export}
          >
            <Text style={styles.actionButtonText}>
              {t('security.data.export') || 'Daten exportieren'}
            </Text>
            {loadingStates.export ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text style={styles.actionButtonArrow}>›</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to privacy settings
              Alert.alert(
                t('security.data.privacyTitle') || 'Datenschutz',
                t('security.data.privacyMessage') || 'Datenschutzeinstellungen werden implementiert...'
              );
            }}
          >
            <Text style={styles.actionButtonText}>
              {t('security.data.privacy') || 'Datenschutzeinstellungen'}
            </Text>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Emergency Actions Section */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🚨</Text>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                {t('security.emergency.title') || 'Notfall-Aktionen'}
              </Text>
              <Text style={styles.sectionDescription}>
                {t('security.emergency.description') || 'Sofortige Sicherheitsmaßnahmen'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => {
              Alert.alert(
                t('security.emergency.lockTitle') || 'Konto sperren',
                t('security.emergency.lockMessage') || 'Möchten Sie Ihr Konto vorübergehend sperren?',
                [
                  { text: t('common.cancel') || 'Abbrechen', style: 'cancel' },
                  { 
                    text: t('security.emergency.lock') || 'Sperren', 
                    style: 'destructive',
                    onPress: () => {
                      setSettings(prev => ({ ...prev, accountLocked: true }));
                      Alert.alert(
                        t('common.success') || 'Erfolg',
                        t('security.emergency.lockSuccess') || 'Konto wurde gesperrt.'
                      );
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.emergencyButtonText}>
              {t('security.emergency.lockAccount') || 'Konto vorübergehend sperren'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.emergencyButton, styles.deleteButton]}
            onPress={handleAccountDeletion}
          >
            <Text style={[styles.emergencyButtonText, styles.deleteButtonText]}>
              {t('security.emergency.deleteAccount') || 'Konto dauerhaft löschen'}
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default withAuthGuard(SecuritySettingsScreen); 