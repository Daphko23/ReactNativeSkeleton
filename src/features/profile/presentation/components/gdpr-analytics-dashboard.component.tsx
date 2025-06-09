/**
 * GDPR Analytics Dashboard Component
 * KI-basierte Auswertung von GDPR Audit Logs mit interaktiven Visualisierungen
 * 
 * ✅ Features:
 * - Real-time Compliance Monitoring
 * - Risk Assessment Visualizations
 * - Anomaly Detection Alerts
 * - Interactive Charts und Metrics
 * - Drill-down Analytics
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { 
  gdprAIAnalyticsService, 
  GDPRRiskAssessment, 
  ComplianceMetrics, 
  AnomalyDetection,
  ComplianceAlert
} from '../../data/services/gdpr-ai-analytics.service';

// =============================================
// INTERFACES & TYPES
// =============================================

interface DashboardState {
  riskAssessment: GDPRRiskAssessment | null;
  complianceMetrics: ComplianceMetrics | null;
  anomalies: AnomalyDetection[];
  alerts: ComplianceAlert[];
  loading: boolean;
  selectedTimeframe: 'LAST_24H' | 'LAST_7D' | 'LAST_30D' | 'LAST_90D';
  refreshing: boolean;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }>;
}

// =============================================
// MAIN COMPONENT
// =============================================

export const GDPRAnalyticsDashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    riskAssessment: null,
    complianceMetrics: null,
    anomalies: [],
    alerts: [],
    loading: true,
    selectedTimeframe: 'LAST_30D',
    refreshing: false
  });

  const screenWidth = Dimensions.get('window').width;
  const chartConfig = {
    backgroundColor: '#f8f9fa',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#f8f9fa',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3b82f6'
    }
  };

  // =============================================
  // DATA LOADING
  // =============================================

  const loadDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setState(prev => ({ ...prev, refreshing: true }));
      } else {
        setState(prev => ({ ...prev, loading: true }));
      }

      // Parallel loading für bessere Performance
      const [riskAssessment, complianceMetrics, anomalies, alerts] = await Promise.all([
        gdprAIAnalyticsService.analyzeGDPRCompliance(undefined, state.selectedTimeframe),
        gdprAIAnalyticsService.generateComplianceMetrics(state.selectedTimeframe as any),
        gdprAIAnalyticsService.detectAnomalies(undefined, 'LAST_24H'),
        gdprAIAnalyticsService.generateRealTimeAlerts()
      ]);

      setState(prev => ({
        ...prev,
        riskAssessment,
        complianceMetrics,
        anomalies,
        alerts,
        loading: false,
        refreshing: false
      }));

      // Show critical alerts
      const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
      if (criticalAlerts.length > 0) {
        Alert.alert(
          '🚨 Kritische GDPR-Warnung',
          `${criticalAlerts.length} kritische Compliance-Probleme erkannt. Sofortiges Handeln erforderlich.`,
          [
            { text: 'Details anzeigen', onPress: () => showAlertDetails(criticalAlerts[0]) },
            { text: 'Später', style: 'cancel' }
          ]
        );
      }

    } catch (error) {
      console.error('Error loading GDPR analytics:', error);
      Alert.alert('Fehler', 'Konnte GDPR-Analytics nicht laden.');
      setState(prev => ({ ...prev, loading: false, refreshing: false }));
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [state.selectedTimeframe]);

  // =============================================
  // CHART DATA PREPARATION
  // =============================================

  const riskCategoriesChart: ChartData = useMemo(() => {
    if (!state.riskAssessment) return { labels: [], datasets: [{ data: [] }] };

    const { categories } = state.riskAssessment;
    return {
      labels: ['Consent', 'Minimization', 'Access', 'Retention', 'Portability'],
      datasets: [{
        data: [
          100 - categories.consentCompliance,
          100 - categories.dataMinimization,
          100 - categories.accessControl,
          100 - categories.retentionPolicy,
          100 - categories.dataPortability
        ],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red for risk
        strokeWidth: 2
      }]
    };
  }, [state.riskAssessment]);

  const complianceScoreChart = useMemo(() => {
    if (!state.complianceMetrics) return [];

    const score = state.complianceMetrics.complianceScore;
    return [
      {
        name: 'Compliant',
        score: score,
        color: score > 80 ? '#10b981' : score > 60 ? '#f59e0b' : '#ef4444',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Non-Compliant',
        score: 100 - score,
        color: '#e5e7eb',
        legendFontColor: '#374151',
        legendFontSize: 12,
      }
    ];
  }, [state.complianceMetrics]);

  const riskDistributionChart = useMemo(() => {
    if (!state.complianceMetrics) return [];

    const { riskDistribution } = state.complianceMetrics;
    return [
      {
        name: 'Low Risk',
        population: riskDistribution.low,
        color: '#10b981',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Medium Risk',
        population: riskDistribution.medium,
        color: '#f59e0b',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'High Risk',
        population: riskDistribution.high,
        color: '#ef4444',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Critical Risk',
        population: riskDistribution.critical,
        color: '#7c2d12',
        legendFontColor: '#374151',
        legendFontSize: 12,
      }
    ].filter(item => item.population > 0);
  }, [state.complianceMetrics]);

  // =============================================
  // EVENT HANDLERS
  // =============================================

  const showAlertDetails = (alert: ComplianceAlert) => {
    Alert.alert(
      `🚨 ${alert.title}`,
      `${alert.description}\\n\\nBetroffene Nutzer: ${alert.affectedUsers.length}\\nGDPR Artikel: ${alert.gdprArticle || 'N/A'}\\n\\nSofortiges Handeln erforderlich: ${alert.requiresImmediateAction ? 'JA' : 'NEIN'}`,
      [
        { text: 'Verstanden', style: 'default' }
      ]
    );
  };

  const showAnomalyDetails = (anomaly: AnomalyDetection) => {
    Alert.alert(
      `🔍 Anomalie erkannt`,
      `${anomaly.description}\\n\\nKonfidenz: ${anomaly.confidence}%\\nRisiko-Score: ${anomaly.riskScore}\\nBetroffene Events: ${anomaly.events.length}`,
      [
        { text: 'Details', onPress: () => console.log('Anomaly details:', anomaly) },
        { text: 'Schließen', style: 'cancel' }
      ]
    );
  };

  const onRefresh = () => {
    loadDashboardData(true);
  };

  // =============================================
  // RENDER METHODS
  // =============================================

  const renderTimeframeSelector = () => (
    <View style={styles.timeframeContainer}>
      <Text style={styles.sectionTitle}>Zeitraum:</Text>
      <View style={styles.timeframeButtons}>
        {(['LAST_24H', 'LAST_7D', 'LAST_30D', 'LAST_90D'] as const).map((timeframe) => (
          <TouchableOpacity
            key={timeframe}
            style={[
              styles.timeframeButton,
              state.selectedTimeframe === timeframe && styles.timeframeButtonActive
            ]}
            onPress={() => setState(prev => ({ ...prev, selectedTimeframe: timeframe }))}
          >
            <Text style={[
              styles.timeframeButtonText,
              state.selectedTimeframe === timeframe && styles.timeframeButtonTextActive
            ]}>
              {timeframe === 'LAST_24H' ? '24h' : 
               timeframe === 'LAST_7D' ? '7T' :
               timeframe === 'LAST_30D' ? '30T' : '90T'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderComplianceOverview = () => {
    if (!state.riskAssessment || !state.complianceMetrics) return null;

    const { overallRiskScore, riskLevel } = state.riskAssessment;
    const { complianceScore } = state.complianceMetrics;

    return (
      <View style={styles.overviewContainer}>
        <Text style={styles.sectionTitle}>🛡️ Compliance Übersicht</Text>
        
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{complianceScore.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Compliance Score</Text>
            <View style={[styles.statusIndicator, { 
              backgroundColor: complianceScore > 90 ? '#10b981' : 
                             complianceScore > 75 ? '#f59e0b' : '#ef4444' 
            }]} />
          </View>
          
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { 
              color: riskLevel === 'LOW' ? '#10b981' : 
                     riskLevel === 'MEDIUM' ? '#f59e0b' : '#ef4444' 
            }]}>
              {riskLevel}
            </Text>
            <Text style={styles.metricLabel}>Risk Level</Text>
            <Text style={styles.metricSubtext}>{overallRiskScore.toFixed(1)} Score</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{state.alerts.length}</Text>
            <Text style={styles.metricLabel}>Aktive Alerts</Text>
            <Text style={[styles.metricSubtext, { 
              color: state.alerts.filter(a => a.severity === 'CRITICAL').length > 0 ? '#ef4444' : '#10b981' 
            }]}>
              {state.alerts.filter(a => a.severity === 'CRITICAL').length} kritisch
            </Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{state.anomalies.length}</Text>
            <Text style={styles.metricLabel}>Anomalien (24h)</Text>
            <Text style={styles.metricSubtext}>
              {state.anomalies.filter(a => a.confidence > 80).length} high confidence
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRiskAnalysis = () => {
    if (riskCategoriesChart.labels.length === 0) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>📊 Risk Analysis by Category</Text>
        <BarChart
          data={riskCategoriesChart}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero={true}
          showValuesOnTopOfBars={true}
          yAxisLabel=""
          yAxisSuffix=""
        />
        <Text style={styles.chartNote}>
          Höhere Werte = Höheres Risiko. Ziel: Alle Kategorien unter 25.
        </Text>
      </View>
    );
  };

  const renderComplianceDistribution = () => {
    if (complianceScoreChart.length === 0) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>🎯 Overall Compliance Score</Text>
        <PieChart
          data={complianceScoreChart}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          accessor={'score'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          center={[10, 10]}
          absolute={false}
        />
      </View>
    );
  };

  const renderRiskDistribution = () => {
    if (riskDistributionChart.length === 0) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>👥 User Risk Distribution</Text>
        <PieChart
          data={riskDistributionChart}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          center={[10, 10]}
          absolute={true}
        />
      </View>
    );
  };

  const renderActiveAlerts = () => {
    if (state.alerts.length === 0) return null;

    return (
      <View style={styles.alertsContainer}>
        <Text style={styles.sectionTitle}>🚨 Aktive Compliance Alerts</Text>
        {state.alerts.slice(0, 3).map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={[styles.alertCard, { 
              borderLeftColor: alert.severity === 'CRITICAL' ? '#ef4444' :
                              alert.severity === 'ERROR' ? '#f59e0b' : '#3b82f6'
            }]}
            onPress={() => showAlertDetails(alert)}
          >
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={[styles.alertSeverity, {
                backgroundColor: alert.severity === 'CRITICAL' ? '#fef2f2' :
                               alert.severity === 'ERROR' ? '#fffbeb' : '#eff6ff',
                color: alert.severity === 'CRITICAL' ? '#dc2626' :
                       alert.severity === 'ERROR' ? '#d97706' : '#2563eb'
              }]}>
                {alert.severity}
              </Text>
            </View>
            <Text style={styles.alertDescription}>{alert.description}</Text>
            <Text style={styles.alertUsers}>
              {alert.affectedUsers.length} Nutzer betroffen
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderAnomalies = () => {
    if (state.anomalies.length === 0) return null;

    return (
      <View style={styles.anomaliesContainer}>
        <Text style={styles.sectionTitle}>🔍 Erkannte Anomalien (24h)</Text>
        {state.anomalies.slice(0, 3).map((anomaly) => (
          <TouchableOpacity
            key={`${anomaly.userId}-${anomaly.detectedAt.getTime()}`}
            style={styles.anomalyCard}
            onPress={() => showAnomalyDetails(anomaly)}
          >
            <View style={styles.anomalyHeader}>
              <Text style={styles.anomalyType}>{anomaly.anomalyType}</Text>
              <Text style={styles.anomalyConfidence}>{anomaly.confidence}%</Text>
            </View>
            <Text style={styles.anomalyDescription}>{anomaly.description}</Text>
            <View style={styles.anomalyFooter}>
              <Text style={styles.anomalyUser}>User: {anomaly.userId}</Text>
              <Text style={[styles.anomalyRisk, {
                color: anomaly.riskScore > 75 ? '#ef4444' : 
                       anomaly.riskScore > 50 ? '#f59e0b' : '#10b981'
              }]}>
                Risk: {anomaly.riskScore}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRecommendations = () => {
    if (!state.riskAssessment?.recommendations.length) return null;

    return (
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>💡 KI-Empfehlungen</Text>
        {state.riskAssessment.recommendations.slice(0, 3).map((rec) => (
          <View key={rec.id} style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <Text style={styles.recommendationTitle}>{rec.title}</Text>
              <Text style={[styles.recommendationPriority, {
                backgroundColor: rec.priority === 'CRITICAL' ? '#fef2f2' :
                               rec.priority === 'HIGH' ? '#fffbeb' : '#f0f9ff',
                color: rec.priority === 'CRITICAL' ? '#dc2626' :
                       rec.priority === 'HIGH' ? '#d97706' : '#2563eb'
              }]}>
                {rec.priority}
              </Text>
            </View>
            <Text style={styles.recommendationDescription}>{rec.description}</Text>
            <Text style={styles.recommendationAction}>
              Aktion: {rec.actionRequired}
            </Text>
            <View style={styles.recommendationFooter}>
              <Text style={styles.recommendationTime}>⏱️ {rec.timeToImplement}</Text>
              <Text style={styles.recommendationImpact}>📈 Impact: {rec.estimatedImpact}%</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // =============================================
  // MAIN RENDER
  // =============================================

  if (state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Lade GDPR Analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={state.refreshing}
          onRefresh={onRefresh}
          colors={['#3b82f6']}
        />
      }
    >
      {renderTimeframeSelector()}
      {renderComplianceOverview()}
      {renderActiveAlerts()}
      {renderRiskAnalysis()}
      {renderComplianceDistribution()}
      {renderRiskDistribution()}
      {renderAnomalies()}
      {renderRecommendations()}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🤖 KI-basierte GDPR Analytics • Letzte Aktualisierung: {new Date().toLocaleTimeString('de-DE')}
        </Text>
      </View>
    </ScrollView>
  );
};

// =============================================
// STYLES
// =============================================

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  timeframeContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  timeframeButtons: {
    flexDirection: 'row' as const,
    marginTop: 8,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  timeframeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  timeframeButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500' as const,
  },
  timeframeButtonTextActive: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: 16,
  },
  overviewContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row' as const,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    position: 'relative' as const,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    fontWeight: '500' as const,
  },
  metricSubtext: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  statusIndicator: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  chartNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center' as const,
    marginTop: 8,
    fontStyle: 'italic' as const,
  },
  alertsContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  alertCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1f2937',
    flex: 1,
  },
  alertSeverity: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  alertDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertUsers: {
    fontSize: 12,
    color: '#6b7280',
  },
  anomaliesContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  anomalyCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  anomalyHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  anomalyType: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1f2937',
  },
  anomalyConfidence: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600' as const,
  },
  anomalyDescription: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 18,
  },
  anomalyFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  anomalyUser: {
    fontSize: 11,
    color: '#6b7280',
  },
  anomalyRisk: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  recommendationsContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  recommendationCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  recommendationHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  recommendationPriority: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  recommendationDescription: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 18,
  },
  recommendationAction: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  recommendationFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  recommendationTime: {
    fontSize: 11,
    color: '#6b7280',
  },
  recommendationImpact: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500' as const,
  },
  footer: {
    padding: 20,
    alignItems: 'center' as const,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center' as const,
  },
};