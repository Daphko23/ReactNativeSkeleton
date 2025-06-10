/**
 * Auth GDPR Demo Screen - Demonstration der GDPR-Audit Funktionalität
 * Zeigt alle Auth-bezogenen GDPR-Events und deren Audit-Logs
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { authGDPRAuditService, AuthGDPREventType, AuthGDPRAuditEvent } from '../../data/services/auth-gdpr-audit.service';
import { useAuth } from '../hooks/use-auth.hook';

interface AuthGDPRDemoScreenProps {
  navigation: any;
}

export const AuthGDPRDemoScreen: React.FC<AuthGDPRDemoScreenProps> = ({ navigation }) => {
  const { user, login, register, logout } = useAuth();
  const [auditEvents, setAuditEvents] = useState<AuthGDPRAuditEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Demo-Daten
  const demoCredentials = {
    email: 'demo@gdpr-audit.com',
    password: 'SecureDemo123!',
  };

  /**
   * Lade GDPR-Audit Events
   */
  const loadAuditEvents = async () => {
    try {
      setIsRefreshing(true);
      const userId = user?.id || 'demo-auth-user-123';
      const events = await authGDPRAuditService.getAuditEvents(userId, 50);
      setAuditEvents(events);
    } catch (error) {
      console.error('Failed to load audit events:', error);
      Alert.alert('Fehler', 'Audit-Events konnten nicht geladen werden');
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Demo Login mit GDPR-Logging
   */
  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      await login(demoCredentials.email, demoCredentials.password);
      Alert.alert('Erfolg', 'Demo-Login erfolgreich! GDPR-Events wurden geloggt.');
      await loadAuditEvents();
    } catch (error) {
      console.error('Demo login failed:', error);
      Alert.alert('Info', 'Demo-Login fehlgeschlagen (erwartet) - GDPR-Events wurden trotzdem geloggt.');
      await loadAuditEvents();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Demo Registration mit GDPR-Logging
   */
  const handleDemoRegister = async () => {
    try {
      setIsLoading(true);
      await register(demoCredentials.email, demoCredentials.password, demoCredentials.password);
      Alert.alert('Erfolg', 'Demo-Registrierung erfolgreich! GDPR-Events wurden geloggt.');
      await loadAuditEvents();
    } catch (error) {
      console.error('Demo registration failed:', error);
      Alert.alert('Info', 'Demo-Registrierung fehlgeschlagen (erwartet) - GDPR-Events wurden trotzdem geloggt.');
      await loadAuditEvents();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Demo Logout mit GDPR-Logging
   */
  const handleDemoLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      Alert.alert('Erfolg', 'Demo-Logout erfolgreich! GDPR-Events wurden geloggt.');
      await loadAuditEvents();
    } catch (error) {
      console.error('Demo logout failed:', error);
      Alert.alert('Info', 'Demo-Logout - GDPR-Events wurden geloggt.');
      await loadAuditEvents();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manuelles GDPR-Event erstellen
   */
  const createManualGDPREvent = async () => {
    try {
      await authGDPRAuditService.logPasswordReset('demo-user-123', 'request', {
        email: 'demo@gdpr-audit.com',
        correlationId: `manual_demo_${Date.now()}`,
      });
      Alert.alert('Erfolg', 'Manuelles GDPR-Event erstellt!');
      await loadAuditEvents();
    } catch (error) {
      console.error('Failed to create manual GDPR event:', error);
      Alert.alert('Fehler', 'Manuelles GDPR-Event konnte nicht erstellt werden');
    }
  };

  /**
   * Event-Type zu deutschem Text
   */
  const getEventTypeLabel = (eventType: AuthGDPREventType): string => {
    const labels: Record<AuthGDPREventType, string> = {
      [AuthGDPREventType.LOGIN_ATTEMPT]: 'Login-Versuch',
      [AuthGDPREventType.LOGIN_SUCCESS]: 'Login erfolgreich',
      [AuthGDPREventType.LOGIN_FAILURE]: 'Login fehlgeschlagen',
      [AuthGDPREventType.LOGOUT]: 'Logout',
      [AuthGDPREventType.REGISTRATION_ATTEMPT]: 'Registrierung-Versuch',
      [AuthGDPREventType.REGISTRATION_SUCCESS]: 'Registrierung erfolgreich',
      [AuthGDPREventType.REGISTRATION_FAILURE]: 'Registrierung fehlgeschlagen',
      [AuthGDPREventType.PASSWORD_RESET_REQUEST]: 'Passwort-Reset angefordert',
      [AuthGDPREventType.PASSWORD_RESET_SUCCESS]: 'Passwort-Reset erfolgreich',
      [AuthGDPREventType.PASSWORD_CHANGE]: 'Passwort geändert',
      [AuthGDPREventType.ACCOUNT_DELETION]: 'Konto gelöscht',
      [AuthGDPREventType.MFA_ENABLED]: 'MFA aktiviert',
      [AuthGDPREventType.MFA_DISABLED]: 'MFA deaktiviert',
      [AuthGDPREventType.MFA_CHALLENGE]: 'MFA-Challenge',
      [AuthGDPREventType.MFA_VERIFICATION]: 'MFA-Verifizierung',
      [AuthGDPREventType.SUSPICIOUS_ACTIVITY]: 'Verdächtige Aktivität',
      [AuthGDPREventType.RATE_LIMIT_EXCEEDED]: 'Rate-Limit überschritten',
      [AuthGDPREventType.USER_DATA_ACCESS]: 'Benutzerdaten-Zugriff',
    };
    return labels[eventType] || eventType;
  };

  /**
   * Formatiere Zeitstempel
   */
  const formatTimestamp = (timestamp: Date): string => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(timestamp);
  };

  /**
   * Lade Events beim Mount
   */
  useEffect(() => {
    loadAuditEvents();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Auth GDPR Audit Demo</Text>
        <Text style={styles.subtitle}>
          Demonstration der GDPR-Compliance Funktionalität
        </Text>
      </View>

      {/* Demo Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Demo-Aktionen</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.loginButton]}
          onPress={handleDemoLogin}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>Demo Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.registerButton]}
          onPress={handleDemoRegister}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>Demo Registrierung</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleDemoLogout}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>Demo Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.manualButton]}
          onPress={createManualGDPREvent}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>Manuelles GDPR-Event</Text>
        </TouchableOpacity>
      </View>

      {/* Audit Events List */}
      <View style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <Text style={styles.sectionTitle}>GDPR Audit Events</Text>
          <Text style={styles.eventsCount}>({auditEvents.length} Events)</Text>
        </View>

        <ScrollView
          style={styles.eventsList}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={loadAuditEvents} />
          }
        >
          {auditEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Keine GDPR-Events gefunden.{'\n'}
                Führe eine Demo-Aktion aus, um Events zu generieren.
              </Text>
            </View>
          ) : (
            auditEvents.map((event, _index) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventType}>
                    {getEventTypeLabel(event.eventType)}
                  </Text>
                  <Text style={styles.eventTimestamp}>
                    {formatTimestamp(event.timestamp)}
                  </Text>
                </View>

                <View style={styles.eventDetails}>
                  <Text style={styles.eventDetail}>
                    <Text style={styles.eventDetailLabel}>Benutzer:</Text> {event.dataSubject}
                  </Text>
                  <Text style={styles.eventDetail}>
                    <Text style={styles.eventDetailLabel}>Rechtsgrundlage:</Text> {event.lawfulBasis}
                  </Text>
                  <Text style={styles.eventDetail}>
                    <Text style={styles.eventDetailLabel}>Zweck:</Text> {event.processingPurpose}
                  </Text>
                  <Text style={styles.eventDetail}>
                    <Text style={styles.eventDetailLabel}>Erfolg:</Text>{' '}
                    {event.details.success ? '✅ Ja' : '❌ Nein'}
                  </Text>
                  {event.details.securityLevel && (
                    <Text style={styles.eventDetail}>
                      <Text style={styles.eventDetailLabel}>Sicherheitslevel:</Text>{' '}
                      {event.details.securityLevel}
                    </Text>
                  )}
                  {event.correlationId && (
                    <Text style={styles.eventDetail}>
                      <Text style={styles.eventDetailLabel}>Korrelations-ID:</Text>{' '}
                      {event.correlationId}
                    </Text>
                  )}
                </View>

                <View style={styles.eventCategories}>
                  <Text style={styles.eventDetailLabel}>Datenkategorien:</Text>
                  <View style={styles.categoriesContainer}>
                    {event.dataCategories.map((category, catIndex) => (
                      <View key={catIndex} style={styles.categoryTag}>
                        <Text style={styles.categoryText}>{category}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Zurück</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
  },
  registerButton: {
    backgroundColor: '#2196F3',
  },
  logoutButton: {
    backgroundColor: '#FF9800',
  },
  manualButton: {
    backgroundColor: '#9C27B0',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  eventsContainer: {
    flex: 1,
  },
  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventsCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  eventsList: {
    flex: 1,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  eventTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  eventDetailLabel: {
    fontWeight: '600',
    color: '#555',
  },
  eventCategories: {
    marginTop: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  categoryTag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#1976D2',
  },
  backButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 