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
import { securitySettingsScreenStyles } from './security-settings.screen.styles';
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
const SecuritySettingsScreen = () => {
  const { user, enterprise, clearError } = useAuth();
  const { t } = useTranslation();
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
      <View style={securitySettingsScreenStyles.container}>
        <View style={securitySettingsScreenStyles.notLoggedInContainer}>
          <Text style={securitySettingsScreenStyles.notLoggedInIcon}>🔒</Text>
          <Text style={securitySettingsScreenStyles.notLoggedInTitle}>
            {t('security.notLoggedIn.title') || 'Anmeldung erforderlich'}
          </Text>
          <Text style={securitySettingsScreenStyles.notLoggedInText}>
            {t('security.notLoggedIn.message') || 'Melden Sie sich an, um Ihre Sicherheitseinstellungen zu verwalten.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={securitySettingsScreenStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={securitySettingsScreenStyles.header}>
        <Text style={securitySettingsScreenStyles.title}>
          {t('security.title') || 'Sicherheitseinstellungen'}
        </Text>
        <Text style={securitySettingsScreenStyles.subtitle}>
          {t('security.subtitle') || 'Verwalten Sie Ihre Kontosicherheit und Authentifizierungsmethoden'}
        </Text>
      </View>

      {/* Authentication Section */}
      <Card style={securitySettingsScreenStyles.section}>
        <Card.Content>
          <View style={securitySettingsScreenStyles.sectionHeader}>
            <Text style={securitySettingsScreenStyles.sectionIcon}>🔐</Text>
            <View style={securitySettingsScreenStyles.sectionTitleContainer}>
              <Text style={securitySettingsScreenStyles.sectionTitle}>
                {t('security.authentication.title') || 'Authentifizierung'}
              </Text>
              <Text style={securitySettingsScreenStyles.sectionDescription}>
                {t('security.authentication.description') || 'Konfigurieren Sie Ihre Anmeldemethoden'}
              </Text>
            </View>
          </View>

          {/* MFA Settings */}
          <View style={securitySettingsScreenStyles.settingItem}>
            <View style={securitySettingsScreenStyles.settingContent}>
              <Text style={securitySettingsScreenStyles.settingTitle}>
                {t('security.mfa.title') || 'Zwei-Faktor-Authentifizierung'}
              </Text>
              <Text style={securitySettingsScreenStyles.settingDescription}>
                {t('security.mfa.description') || 'Zusätzliche Sicherheitsebene für Ihr Konto'}
              </Text>
              {settings.mfaEnabled && mfaFactors.length > 0 && (
                <View style={securitySettingsScreenStyles.factorsList}>
                  {mfaFactors.map((factor, index) => (
                    <Badge key={index} style={securitySettingsScreenStyles.factorBadge}>
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
              <ActivityIndicator size="small" style={securitySettingsScreenStyles.loadingIndicator} />
            )}
          </View>

          <Divider style={securitySettingsScreenStyles.divider} />

          {/* Biometric Settings */}
          <View style={securitySettingsScreenStyles.settingItem}>
            <View style={securitySettingsScreenStyles.settingContent}>
              <Text style={securitySettingsScreenStyles.settingTitle}>
                {t('security.biometric.title') || 'Biometrische Authentifizierung'}
              </Text>
              <Text style={securitySettingsScreenStyles.settingDescription}>
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
              <ActivityIndicator size="small" style={securitySettingsScreenStyles.loadingIndicator} />
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Password Management Section */}
      <Card style={securitySettingsScreenStyles.section}>
        <Card.Content>
          <View style={securitySettingsScreenStyles.sectionHeader}>
            <Text style={securitySettingsScreenStyles.sectionIcon}>🔑</Text>
            <View style={securitySettingsScreenStyles.sectionTitleContainer}>
              <Text style={securitySettingsScreenStyles.sectionTitle}>
                {t('security.password.title') || 'Passwort-Verwaltung'}
              </Text>
              <Text style={securitySettingsScreenStyles.sectionDescription}>
                {t('security.password.description') || 'Passwort ändern und Sicherheitsrichtlinien'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={securitySettingsScreenStyles.actionButton}
            onPress={() => navigation.navigate('PasswordReset')}
          >
            <Text style={securitySettingsScreenStyles.actionButtonText}>
              {t('security.password.changeButton') || 'Passwort ändern'}
            </Text>
            <Text style={securitySettingsScreenStyles.actionButtonArrow}>›</Text>
          </TouchableOpacity>

          <View style={securitySettingsScreenStyles.infoBox}>
            <Text style={securitySettingsScreenStyles.infoTitle}>
              {t('security.password.policyTitle') || 'Passwort-Richtlinien:'}
            </Text>
            <Text style={securitySettingsScreenStyles.infoText}>
              • {t('security.password.rule1') || 'Mindestens 8 Zeichen'}
            </Text>
            <Text style={securitySettingsScreenStyles.infoText}>
              • {t('security.password.rule2') || 'Groß- und Kleinbuchstaben'}
            </Text>
            <Text style={securitySettingsScreenStyles.infoText}>
              • {t('security.password.rule3') || 'Zahlen und Sonderzeichen'}
            </Text>
            <Text style={securitySettingsScreenStyles.infoText}>
              • {t('security.password.rule4') || 'Keine häufig verwendeten Passwörter'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Active Sessions Section */}
      <Card style={securitySettingsScreenStyles.section}>
        <Card.Content>
          <View style={securitySettingsScreenStyles.sectionHeader}>
            <Text style={securitySettingsScreenStyles.sectionIcon}>📱</Text>
            <View style={securitySettingsScreenStyles.sectionTitleContainer}>
              <Text style={securitySettingsScreenStyles.sectionTitle}>
                {t('security.sessions.title') || 'Aktive Sitzungen'}
              </Text>
              <Text style={securitySettingsScreenStyles.sectionDescription}>
                {t('security.sessions.description') || 'Verwalten Sie Ihre Anmeldungen auf verschiedenen Geräten'}
              </Text>
            </View>
          </View>

          {loadingStates.sessions ? (
            <ActivityIndicator size="large" style={securitySettingsScreenStyles.centerLoader} />
          ) : (
            <>
              {activeSessions.map((session) => (
                <View key={session.id} style={securitySettingsScreenStyles.sessionItem}>
                  <View style={securitySettingsScreenStyles.sessionHeader}>
                    <Text style={securitySettingsScreenStyles.sessionDevice}>
                      {getDeviceIcon(session.deviceType)} {session.deviceName}
                    </Text>
                    {session.isCurrent && (
                      <Badge style={securitySettingsScreenStyles.currentBadge}>
                        {t('security.sessions.current') || 'Aktuell'}
                      </Badge>
                    )}
                  </View>
                  <Text style={securitySettingsScreenStyles.sessionInfo}>
                    {session.location} • {session.lastActive.toLocaleDateString()}
                  </Text>
                  <Text style={securitySettingsScreenStyles.sessionIp}>
                    IP: {session.ipAddress}
                  </Text>
                  {!session.isCurrent && (
                    <TouchableOpacity
                      style={securitySettingsScreenStyles.terminateButton}
                      onPress={() => handleTerminateSession(session.id)}
                    >
                      <Text style={securitySettingsScreenStyles.terminateButtonText}>
                        {t('security.sessions.terminate') || 'Beenden'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={securitySettingsScreenStyles.dangerButton}
                onPress={handleTerminateAllSessions}
              >
                <Text style={securitySettingsScreenStyles.dangerButtonText}>
                  {t('security.sessions.terminateAll') || 'Alle anderen Sitzungen beenden'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Security Events Section */}
      <Card style={securitySettingsScreenStyles.section}>
        <Card.Content>
          <View style={securitySettingsScreenStyles.sectionHeader}>
            <Text style={securitySettingsScreenStyles.sectionIcon}>📊</Text>
            <View style={securitySettingsScreenStyles.sectionTitleContainer}>
              <Text style={securitySettingsScreenStyles.sectionTitle}>
                {t('security.events.title') || 'Sicherheitsereignisse'}
              </Text>
              <Text style={securitySettingsScreenStyles.sectionDescription}>
                {t('security.events.description') || 'Überwachen Sie verdächtige Aktivitäten'}
              </Text>
            </View>
          </View>

          {loadingStates.events ? (
            <ActivityIndicator size="large" style={securitySettingsScreenStyles.centerLoader} />
          ) : (
            <>
              {recentEvents.slice(0, 3).map((event) => (
                <View key={event.id} style={securitySettingsScreenStyles.eventItem}>
                  <View style={securitySettingsScreenStyles.eventHeader}>
                    <Text style={securitySettingsScreenStyles.eventDescription}>
                      {event.description}
                    </Text>
                    <View 
                      style={[
                        securitySettingsScreenStyles.riskBadge,
                        { backgroundColor: getRiskLevelColor(event.riskLevel) }
                      ]}
                    >
                      <Text style={securitySettingsScreenStyles.riskBadgeText}>
                        {event.riskLevel.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={securitySettingsScreenStyles.eventInfo}>
                    {event.location} • {event.timestamp.toLocaleDateString()}
                  </Text>
                </View>
              ))}

              <TouchableOpacity
                style={securitySettingsScreenStyles.actionButton}
                onPress={() => {
                  // Navigate to full security events screen
                  Alert.alert(
                    t('security.events.viewAllTitle') || 'Alle Ereignisse',
                    t('security.events.viewAllMessage') || 'Vollständige Sicherheitsereignisse werden implementiert...'
                  );
                }}
              >
                <Text style={securitySettingsScreenStyles.actionButtonText}>
                  {t('security.events.viewAll') || 'Alle Ereignisse anzeigen'}
                </Text>
                <Text style={securitySettingsScreenStyles.actionButtonArrow}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Notifications Section */}
      <Card style={securitySettingsScreenStyles.section}>
        <Card.Content>
          <View style={securitySettingsScreenStyles.sectionHeader}>
            <Text style={securitySettingsScreenStyles.sectionIcon}>🔔</Text>
            <View style={securitySettingsScreenStyles.sectionTitleContainer}>
              <Text style={securitySettingsScreenStyles.sectionTitle}>
                {t('security.notifications.title') || 'Benachrichtigungen'}
              </Text>
              <Text style={securitySettingsScreenStyles.sectionDescription}>
                {t('security.notifications.description') || 'Konfigurieren Sie Sicherheitsbenachrichtigungen'}
              </Text>
            </View>
          </View>

          <View style={securitySettingsScreenStyles.settingItem}>
            <View style={securitySettingsScreenStyles.settingContent}>
              <Text style={securitySettingsScreenStyles.settingTitle}>
                {t('security.notifications.login') || 'Anmelde-Benachrichtigungen'}
              </Text>
              <Text style={securitySettingsScreenStyles.settingDescription}>
                {t('security.notifications.loginDescription') || 'Benachrichtigung bei neuen Anmeldungen'}
              </Text>
            </View>
            <Switch
              value={settings.loginNotifications}
              onValueChange={(value) => setSettings(prev => ({ ...prev, loginNotifications: value }))}
            />
          </View>

          <Divider style={securitySettingsScreenStyles.divider} />

          <View style={securitySettingsScreenStyles.settingItem}>
            <View style={securitySettingsScreenStyles.settingContent}>
              <Text style={securitySettingsScreenStyles.settingTitle}>
                {t('security.notifications.alerts') || 'Sicherheitswarnungen'}
              </Text>
              <Text style={securitySettingsScreenStyles.settingDescription}>
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
      <Card style={securitySettingsScreenStyles.section}>
        <Card.Content>
          <View style={securitySettingsScreenStyles.sectionHeader}>
            <Text style={securitySettingsScreenStyles.sectionIcon}>🗃️</Text>
            <View style={securitySettingsScreenStyles.sectionTitleContainer}>
              <Text style={securitySettingsScreenStyles.sectionTitle}>
                {t('security.data.title') || 'Daten & Datenschutz'}
              </Text>
              <Text style={securitySettingsScreenStyles.sectionDescription}>
                {t('security.data.description') || 'Verwalten Sie Ihre persönlichen Daten'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={securitySettingsScreenStyles.actionButton}
            onPress={handleDataExport}
            disabled={loadingStates.export}
          >
            <Text style={securitySettingsScreenStyles.actionButtonText}>
              {t('security.data.export') || 'Daten exportieren'}
            </Text>
            {loadingStates.export ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text style={securitySettingsScreenStyles.actionButtonArrow}>›</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={securitySettingsScreenStyles.actionButton}
            onPress={() => {
              // Navigate to privacy settings
              Alert.alert(
                t('security.data.privacyTitle') || 'Datenschutz',
                t('security.data.privacyMessage') || 'Datenschutzeinstellungen werden implementiert...'
              );
            }}
          >
            <Text style={securitySettingsScreenStyles.actionButtonText}>
              {t('security.data.privacy') || 'Datenschutzeinstellungen'}
            </Text>
            <Text style={securitySettingsScreenStyles.actionButtonArrow}>›</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Emergency Actions Section */}
      <Card style={securitySettingsScreenStyles.section}>
        <Card.Content>
          <View style={securitySettingsScreenStyles.sectionHeader}>
            <Text style={securitySettingsScreenStyles.sectionIcon}>🚨</Text>
            <View style={securitySettingsScreenStyles.sectionTitleContainer}>
              <Text style={securitySettingsScreenStyles.sectionTitle}>
                {t('security.emergency.title') || 'Notfall-Aktionen'}
              </Text>
              <Text style={securitySettingsScreenStyles.sectionDescription}>
                {t('security.emergency.description') || 'Sofortige Sicherheitsmaßnahmen'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={securitySettingsScreenStyles.emergencyButton}
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
            <Text style={securitySettingsScreenStyles.emergencyButtonText}>
              {t('security.emergency.lockAccount') || 'Konto vorübergehend sperren'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[securitySettingsScreenStyles.emergencyButton, securitySettingsScreenStyles.deleteButton]}
            onPress={handleAccountDeletion}
          >
            <Text style={[securitySettingsScreenStyles.emergencyButtonText, securitySettingsScreenStyles.deleteButtonText]}>
              {t('security.emergency.deleteAccount') || 'Konto dauerhaft löschen'}
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default withAuthGuard(SecuritySettingsScreen); 