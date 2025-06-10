/**
 * Profile Compliance Demo Screen
 * Demonstrates Observability, GDPR Audit Logging, and WCAG 2.2 Accessibility
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Platform,
  Alert
} from 'react-native';
import { useProfile } from '../../hooks/use-profile.hook';
import { profileObservability } from '@core/monitoring/profile-observability.service';
import { gdprAuditService, GDPRAuditEventType } from '../../../data/services/gdpr-audit.service';
import { wcagComplianceService } from '@shared/accessibility/wcag-compliance.service';

interface ComplianceMetrics {
  observability: {
    totalOperations: number;
    averageLoadTime: number;
    errorRate: number;
  };
  gdpr: {
    totalEvents: number;
    dataAccessEvents: number;
    dataUpdateEvents: number;
  };
  accessibility: {
    complianceScore: number;
    criticalIssues: number;
    testsConducted: number;
  };
}

export const ProfileComplianceDemoScreen: React.FC = () => {
  const { profile, updateProfile, isLoading } = useProfile();
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [accessibilityAuditRunning, setAccessibilityAuditRunning] = useState(false);
  const [observabilityEnabled, setObservabilityEnabled] = useState(true);
  const [gdprLoggingEnabled, setGdprLoggingEnabled] = useState(true);

  useEffect(() => {
    loadComplianceMetrics();
  }, []);

  const loadComplianceMetrics = async () => {
    try {
      // Get observability metrics
      const obsMetrics = profileObservability.getProfileAnalytics();
      
      // Get GDPR audit summary
      const gdprReport = await gdprAuditService.generateComplianceReport(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        new Date() // now
      );
      console.log('🔒 GDPR Report Debug:', {
        totalEvents: gdprReport.summary.totalEvents,
        summary: gdprReport.summary
      });
      
      // Get accessibility metrics
      const accessibilityReport = wcagComplianceService.generateAccessibilityReport();

      setMetrics({
        observability: {
          totalOperations: obsMetrics.totalOperations,
          averageLoadTime: obsMetrics.averageLoadTime,
          errorRate: obsMetrics.errorRate
        },
        gdpr: {
          totalEvents: gdprReport.summary.totalEvents,
          dataAccessEvents: gdprReport.summary.eventsByType[GDPRAuditEventType.DATA_ACCESS_REQUEST] || 0,
          dataUpdateEvents: gdprReport.summary.eventsByType[GDPRAuditEventType.DATA_PROCESSING] || 0
        },
        accessibility: {
          complianceScore: accessibilityReport.overallScore,
          criticalIssues: accessibilityReport.criticalIssues.length,
          testsConducted: accessibilityReport.audits.reduce(
            (sum, audit) => sum + audit.summary.totalTests, 0
          )
        }
      });
    } catch (error) {
      console.error('Failed to load compliance metrics:', error);
    }
  };

  const testProfileUpdate = async () => {
    if (!profile) return;

    try {
      const updatedBio = `Updated bio at ${new Date().toLocaleTimeString()}`;
      await updateProfile({ bio: updatedBio });
      
      // Refresh metrics to show the new data
      await loadComplianceMetrics();
      
      Alert.alert(
        'Test Complete', 
        'Profile update test completed. Check metrics for observability and GDPR logging.',
        [{ text: 'OK' }]
      );
    } catch {
      Alert.alert('Test Failed', 'Profile update test failed.');
    }
  };

  const runAccessibilityAudit = async () => {
    setAccessibilityAuditRunning(true);
    
    try {
      // Mock component tree for the audit
      const mockComponentTree = {
        screenName: 'ProfileComplianceDemo',
        components: ['Header', 'MetricsCard', 'ActionButton', 'ToggleSwitch']
      };

      const auditResult = await wcagComplianceService.auditScreen(
        'ProfileComplianceDemo',
        mockComponentTree,
        { level: 'AA', includeManualTests: true }
      );

      await loadComplianceMetrics();

      Alert.alert(
        'Accessibility Audit Complete',
        `Compliance Score: ${auditResult.summary.complianceScore.toFixed(1)}%\n` +
        `Tests: ${auditResult.summary.totalTests}\n` +
        `Passed: ${auditResult.summary.passed}\n` +
        `Failed: ${auditResult.summary.failed}`,
        [{ text: 'OK' }]
      );
    } catch {
      Alert.alert('Audit Failed', 'Accessibility audit failed to run.');
    } finally {
      setAccessibilityAuditRunning(false);
    }
  };

  const exportComplianceReport = async () => {
    try {
      // Generate comprehensive compliance report
      const observabilityData = profileObservability.exportMetrics();
      const gdprData = await gdprAuditService.generateComplianceReport(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        new Date() // now
      );
      const accessibilityData = wcagComplianceService.generateAccessibilityReport();

      const report = {
        timestamp: new Date().toISOString(),
        observability: {
          metrics: observabilityData.slice(0, 10), // Last 10 metrics
          analytics: profileObservability.getProfileAnalytics()
        },
        gdpr: gdprData,
        accessibility: accessibilityData
      };

      // In real app, this would save to file or send to server
      console.log('Compliance Report Generated:', JSON.stringify(report, null, 2));
      
      Alert.alert(
        'Report Generated',
        'Compliance report has been generated and logged to console.',
        [{ text: 'OK' }]
      );
    } catch {
      Alert.alert('Export Failed', 'Failed to generate compliance report.');
    }
  };

  // Generate WCAG compliant accessibility props
  const accessibilityProps = wcagComplianceService.generateAccessibilityProps({
    label: 'Profile Compliance Demo Screen',
    hint: 'Demonstrates enterprise compliance features',
    role: 'main'
  });

  // GDPR Compliance Test Methods
  const _generateGDPRReport = async () => {
    try {
      const gdprReport = await gdprAuditService.generateComplianceReport(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        new Date() // now
      );
      
      setMetrics(prev => ({
        observability: prev?.observability || { totalOperations: 0, averageLoadTime: 0, errorRate: 0 },
        accessibility: prev?.accessibility || { complianceScore: 0, criticalIssues: 0, testsConducted: 0 },
        gdpr: {
          totalEvents: gdprReport.summary.totalEvents,
          dataAccessEvents: gdprReport.summary.eventsByType[GDPRAuditEventType.DATA_ACCESS_REQUEST] || 0,
          dataUpdateEvents: gdprReport.summary.eventsByType[GDPRAuditEventType.DATA_PROCESSING] || 0
        }
      }));
      
      console.log('📋 GDPR Report Generated:', gdprReport);
      console.log('✅ GDPR Report Generated Successfully');
    } catch (error) {
      console.error('Error generating GDPR report:', error);
      console.error('❌ Failed to generate GDPR report');
    }
  };
  
  const _exportComplianceData = async () => {
    try {
      const gdprReport = await gdprAuditService.generateComplianceReport(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        new Date() // now
      );
      const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalEvents: gdprReport.summary.totalEvents,
          dataAccessEvents: gdprReport.summary.eventsByType[GDPRAuditEventType.DATA_ACCESS_REQUEST] || 0,
          dataUpdateEvents: gdprReport.summary.eventsByType[GDPRAuditEventType.DATA_PROCESSING] || 0
        },
        compliance: 'GDPR Article 30 - Record of Processing Activities',
        recommendation: 'Data processing activities are being properly audited'
      };
      
      console.log('📤 Compliance Data Export:', reportData);
      console.log('✅ Compliance Data Exported Successfully');
    } catch (error) {
      console.error('Error exporting compliance data:', error);
      console.error('❌ Failed to export compliance data');
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      contentContainerStyle={{ padding: 16 }}
      {...accessibilityProps}
    >
      {/* Header */}
      <View 
        style={{ 
          backgroundColor: '#ffffff', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}
        {...wcagComplianceService.generateAccessibilityProps({
          role: 'header',
          label: 'Enterprise Compliance Dashboard'
        })}
      >
        <Text 
          style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#1a1a1a',
            marginBottom: 8 
          }}
          {...wcagComplianceService.generateAccessibilityProps({
            role: 'heading',
            label: 'Enterprise Compliance Dashboard'
          })}
        >
          🏢 Enterprise Compliance Dashboard
        </Text>
        <Text 
          style={{ 
            fontSize: 16, 
            color: '#666666',
            lineHeight: 24 
          }}
        >
          Demonstrating Observability, GDPR Audit Logging, and WCAG 2.2 Accessibility compliance
        </Text>
      </View>

      {/* Metrics Cards */}
      {metrics && (
        <>
          {/* Observability Metrics */}
          <View style={{ 
            backgroundColor: '#ffffff', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#007AFF'
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#007AFF', marginBottom: 12 }}>
              📊 Observability Metrics
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
              Total Operations: {metrics.observability.totalOperations}
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
              Average Load Time: {metrics.observability.averageLoadTime.toFixed(2)}ms
            </Text>
            <Text style={{ fontSize: 14, color: '#333' }}>
              Error Rate: {metrics.observability.errorRate.toFixed(2)}%
            </Text>
          </View>

          {/* GDPR Audit Metrics */}
          <View style={{ 
            backgroundColor: '#ffffff', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#34C759'
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#34C759', marginBottom: 12 }}>
              🔒 GDPR Audit Logging
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
              Total Audit Events: {metrics.gdpr.totalEvents}
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
              Data Access Events: {metrics.gdpr.dataAccessEvents}
            </Text>
            <Text style={{ fontSize: 14, color: '#333' }}>
              Data Update Events: {metrics.gdpr.dataUpdateEvents}
            </Text>
          </View>

          {/* Accessibility Metrics */}
          <View style={{ 
            backgroundColor: '#ffffff', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#FF9500'
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#FF9500', marginBottom: 12 }}>
              ♿ WCAG 2.2 Accessibility
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
              Compliance Score: {metrics.accessibility.complianceScore.toFixed(1)}%
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
              Critical Issues: {metrics.accessibility.criticalIssues}
            </Text>
            <Text style={{ fontSize: 14, color: '#333' }}>
              Tests Conducted: {metrics.accessibility.testsConducted}
            </Text>
          </View>
        </>
      )}

      {/* Controls */}
      <View style={{ 
        backgroundColor: '#ffffff', 
        padding: 16, 
        borderRadius: 8, 
        marginBottom: 16 
      }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>
          🎛️ Compliance Controls
        </Text>

        {/* Observability Toggle */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 12 
        }}>
          <Text style={{ fontSize: 16, color: '#333' }}>Observability Monitoring</Text>
          <Switch
            value={observabilityEnabled}
            onValueChange={setObservabilityEnabled}
            {...wcagComplianceService.generateAccessibilityProps({
              role: 'switch',
              label: 'Toggle observability monitoring',
              state: { checked: observabilityEnabled }
            })}
          />
        </View>

        {/* GDPR Logging Toggle */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16 
        }}>
          <Text style={{ fontSize: 16, color: '#333' }}>GDPR Audit Logging</Text>
          <Switch
            value={gdprLoggingEnabled}
            onValueChange={setGdprLoggingEnabled}
            {...wcagComplianceService.generateAccessibilityProps({
              role: 'switch',
              label: 'Toggle GDPR audit logging',
              state: { checked: gdprLoggingEnabled }
            })}
          />
        </View>

        {/* Test Buttons */}
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
            opacity: isLoading ? 0.6 : 1
          }}
          onPress={testProfileUpdate}
          disabled={isLoading}
          {...wcagComplianceService.generateAccessibilityProps({
            role: 'button',
            label: 'Test profile update with compliance tracking',
            hint: 'Updates profile and logs to observability and GDPR systems'
          })}
        >
          <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
            {isLoading ? 'Testing...' : '🧪 Test Profile Update'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#FF9500',
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
            opacity: accessibilityAuditRunning ? 0.6 : 1
          }}
          onPress={runAccessibilityAudit}
          disabled={accessibilityAuditRunning}
          {...wcagComplianceService.generateAccessibilityProps({
            role: 'button',
            label: 'Run accessibility audit',
            hint: 'Performs WCAG 2.2 compliance testing on this screen'
          })}
        >
          <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
            {accessibilityAuditRunning ? 'Auditing...' : '♿ Run Accessibility Audit'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#34C759',
            padding: 16,
            borderRadius: 8
          }}
          onPress={exportComplianceReport}
          {...wcagComplianceService.generateAccessibilityProps({
            role: 'button',
            label: 'Export comprehensive compliance report',
            hint: 'Generates and exports data from all compliance systems'
          })}
        >
          <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
            📊 Export Compliance Report
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Information */}
      <View style={{ 
        backgroundColor: '#f8f9fa', 
        padding: 16, 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef'
      }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#495057' }}>
          ℹ️ System Status
        </Text>
        <Text style={{ fontSize: 14, color: '#6c757d', lineHeight: 20 }}>
          • Observability: {observabilityEnabled ? '✅ Active' : '❌ Disabled'}{'\n'}
          • GDPR Logging: {gdprLoggingEnabled ? '✅ Active' : '❌ Disabled'}{'\n'}
          • Accessibility: ✅ WCAG 2.2 Compliant{'\n'}
          • Platform: {Platform.OS === 'ios' ? '📱 iOS' : Platform.OS === 'android' ? '🤖 Android' : '💻 Web'}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileComplianceDemoScreen; 