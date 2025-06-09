/**
 * @fileoverview AUTH-HOOKS-COMPLETE-DEMO-SCREEN: Enterprise Auth Demo Screen
 * @description Comprehensive demonstration of all Enterprise Auth Hooks in action.
 * This screen showcases the complete Hook-Centric Architecture implementation.
 * 
 * ⚠️ NOTE: This is a demonstration screen with some TypeScript suppression
 * for showcasing Hook capabilities that may not be fully implemented.
 * 
 * @businessRule BR-700: Complete Hook demonstration and testing interface
 * @businessRule BR-701: Live metrics and analytics dashboard
 * @businessRule BR-702: Interactive testing environment
 * @businessRule BR-703: Performance monitoring and debugging tools
 * 
 * @architecture React functional component with ALL Enterprise Auth Hooks
 * @architecture Complete Hook-Centric Architecture demonstration
 * @architecture Live metrics and monitoring dashboard
 * @architecture Interactive testing and debugging interface
 * 
 * @since 3.0.0
 * @version 3.0.0 - Hook-Centric Architecture Complete Demo
 * @author ReactNativeSkeleton Phase3 Team
 * @module AuthHooksCompleteDemoScreen
 * @namespace Auth.Presentation.Screens.Demo
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  
  Switch,
  ActivityIndicator,
} from 'react-native';

// ** ENTERPRISE AUTH HOOKS **
import { useAuthComposite } from '@features/auth/presentation/hooks/use-auth-composite.hook';
import { useAuthFlow, AuthFlowType } from '@features/auth/presentation/hooks/use-auth-flow.hook';
import { useAuthTesting, TestScenarioType } from '@features/auth/presentation/hooks/use-auth-testing.hook';

// ** SPECIALIZED AUTH HOOKS **
import { useAuth } from '@features/auth/presentation/hooks/use-auth.hook';
import { useAuthSecurity } from '@features/auth/presentation/hooks/use-auth-security.hook';
import { useAuthPassword } from '@features/auth/presentation/hooks/use-auth-password.hook';
import { useAuthSocial } from '@features/auth/presentation/hooks/use-auth-social.hook';

// ** TYPES & INTERFACES **
import { MFAType, SecurityLevel } from '@features/auth/domain/types/security.types';

/**
 * @interface DemoSection
 * @description Demo section configuration
 */
interface DemoSection {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  isActive: boolean;
}

/**
 * @interface DemoMetrics
 * @description Real-time demo metrics
 */
interface DemoMetrics {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageResponseTime: number;
  activeHooks: string[];
  performanceScore: number;
}

/**
 * @component EnterpriseAuthDemoScreen
 * @description Complete Enterprise Auth Demo Screen mit allen Hook Patterns
 * 
 * ENTERPRISE FEATURES DEMONSTRATED:
 * ✅ useAuthComposite - Unified Auth Management
 * ✅ useAuthFlow - State Machine Auth Flows
 * ✅ useAuthTesting - Comprehensive Testing Infrastructure
 * ✅ useAuth - Core Authentication Operations
 * ✅ useAuthSecurity - Advanced Security Management
 * ✅ useAuthPassword - Password Management
 * ✅ useAuthSocial - Social Authentication
 * ✅ Real-time Performance Monitoring
 * ✅ Interactive Testing and Debugging
 * ✅ Enterprise Analytics Dashboard
 * ✅ Advanced Error Handling
 * 
 * @example
 * ```typescript
 * // Navigation to demo screen
 * navigation.navigate('EnterpriseAuthDemo');
 * ```
 */
export const EnterpriseAuthDemoScreen: React.FC = () => {
  // ==========================================
  // 📊 ENTERPRISE HOOKS INTEGRATION
  // ==========================================
  
  // ** ADVANCED HOOKS **
  const authComposite = useAuthComposite();
  const authFlow = useAuthFlow();
  const authTesting = useAuthTesting();
  
  // ** SPECIALIZED HOOKS **
  const auth = useAuth();
  const authSecurity = useAuthSecurity();
  const authPassword = useAuthPassword();
  const authSocial = useAuthSocial();

  // ==========================================
  // 📈 DEMO STATE MANAGEMENT
  // ==========================================
  
  const [demoSections, setDemoSections] = useState<DemoSection[]>([
    {
      id: 'composite',
      title: 'Composite Auth Hook',
      description: 'Unified Auth Management with workflow orchestration',
      isExpanded: false,
      isActive: false,
    },
    {
      id: 'flow',
      title: 'Auth Flow Hook',
      description: 'State Machine Auth Flow Management',
      isExpanded: false,
      isActive: false,
    },
    {
      id: 'testing',
      title: 'Auth Testing Hook',
      description: 'Comprehensive Testing Infrastructure',
      isExpanded: false,
      isActive: false,
    },
    {
      id: 'security',
      title: 'Security Management',
      description: 'Advanced Security Features',
      isExpanded: false,
      isActive: false,
    },
    {
      id: 'social',
      title: 'Social Authentication',
      description: 'OAuth and Social Login Features',
      isExpanded: false,
      isActive: false,
    },
    {
      id: 'password',
      title: 'Password Management',
      description: 'Advanced Password Operations',
      isExpanded: false,
      isActive: false,
    },
  ]);

  const [demoMetrics, setDemoMetrics] = useState<DemoMetrics>({
    totalOperations: 0,
    successfulOperations: 0,
    failedOperations: 0,
    averageResponseTime: 0,
    activeHooks: [],
    performanceScore: 100,
  });

  const [_showAnalytics, _setShowAnalytics] = useState(false);
  const [_showDebugInfo, _setShowDebugInfo] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [_selectedTestScenario, setSelectedTestScenario] = useState<TestScenarioType | null>(null);

  // ==========================================
  // 📊 REAL-TIME MONITORING
  // ==========================================
  
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Update demo metrics
        setDemoMetrics(prev => ({
          ...prev,
          totalOperations: prev.totalOperations + Math.floor(Math.random() * 3),
          averageResponseTime: Math.random() * 200 + 50,
          performanceScore: Math.max(50, Math.random() * 100),
          activeHooks: getActiveHooks(),
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getActiveHooks = useCallback((): string[] => {
    const hooks: string[] = [];
    
    if (auth.isLoading) hooks.push('useAuth');
    if (authSecurity.isLoading) hooks.push('useAuthSecurity');
    if (authPassword.isLoading) hooks.push('useAuthPassword');
    if (authComposite.isLoading) hooks.push('useAuthComposite');
    if (authFlow.context.isLoading) hooks.push('useAuthFlow');
    if (authTesting.isTestingActive) hooks.push('useAuthTesting');
    
    return hooks;
  }, [auth, authSecurity, authPassword, authComposite, authFlow, authTesting]);

  // ==========================================
  // 🔧 DEMO SECTION MANAGEMENT
  // ==========================================
  
  const toggleSection = useCallback((sectionId: string) => {
    setDemoSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  }, []);

  const activateSection = useCallback((sectionId: string) => {
    setDemoSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isActive: true }
        : { ...section, isActive: false }
    ));
  }, []);

  // ==========================================
  // 🎬 COMPOSITE HOOK DEMONSTRATIONS
  // ==========================================
  
  const demonstrateCompositeLogin = useCallback(async () => {
    activateSection('composite');
    try {
      setDemoMetrics(prev => ({ ...prev, totalOperations: prev.totalOperations + 1 }));
      
      Alert.alert(
        'Composite Login Demo',
        'Starting enhanced login with security setup...',
        [{ text: 'OK', onPress: async () => {
          try {
            await authComposite.enhancedLogin('demo@example.com', 'demoPassword123', {
              enableMFA: true,
              enableBiometric: true,
              rememberDevice: true,
            });
            
            setDemoMetrics(prev => ({ ...prev, successfulOperations: prev.successfulOperations + 1 }));
            Alert.alert('Success', 'Enhanced login completed successfully!');
          } catch (error) {
            setDemoMetrics(prev => ({ ...prev, failedOperations: prev.failedOperations + 1 }));
            Alert.alert('Demo Error', `Login demo failed: ${error}`);
          }
        }}]
      );
    } catch (error) {
      console.error('Composite login demo error:', error);
    }
  }, [authComposite, activateSection]);

  const demonstrateCompleteRegistration = useCallback(async () => {
    activateSection('composite');
    try {
      await authComposite.completeRegistration({
        email: 'newuser@example.com',
        password: 'securePassword123!',
        confirmPassword: 'securePassword123!',
        firstName: 'Demo',
        lastName: 'User',
        enableSecurity: true,
      });
      
      Alert.alert('Success', 'Complete registration demo successful!');
    } catch (error) {
      Alert.alert('Demo Error', `Registration demo failed: ${error}`);
    }
  }, [authComposite, activateSection]);

  const demonstrateSecuritySetup = useCallback(async () => {
    activateSection('composite');
    try {
      await authComposite.setupCompleteSecurity({
        enableMFA: true,
        mfaType: MFAType.TOTP,
        enableBiometric: true,
        securityLevel: SecurityLevel.HIGH,
      });
      
      Alert.alert('Success', 'Security setup demo completed!');
    } catch (error) {
      Alert.alert('Demo Error', `Security setup demo failed: ${error}`);
    }
  }, [authComposite, activateSection]);

  // ==========================================
  // 🔄 FLOW HOOK DEMONSTRATIONS
  // ==========================================
  
  const demonstrateLoginFlow = useCallback(async () => {
    activateSection('flow');
    
    authFlow.startFlow(AuthFlowType.LOGIN, {
      allowSkipSteps: true,
      enableAutoProgress: false,
      maxRetries: 3,
    });

    Alert.alert(
      'Login Flow Demo',
      `Flow started. Current state: ${authFlow.context.currentState}`,
      [
        { text: 'Next Step', onPress: () => authFlow.nextStep() },
        { text: 'Submit Credentials', onPress: () => {
          authFlow.submitCredentials({
            email: 'demo@example.com',
            password: 'demoPassword'
          });
        }},
        { text: 'Cancel', onPress: () => authFlow.cancelFlow() },
      ]
    );
  }, [authFlow, activateSection]);

  const demonstrateRegistrationFlow = useCallback(() => {
    activateSection('flow');
    
    authFlow.startFlow(AuthFlowType.REGISTER);
    Alert.alert('Registration Flow', `Registration flow started. Progress: ${authFlow.progress}%`);
  }, [authFlow, activateSection]);

  // ==========================================
  // 🧪 TESTING HOOK DEMONSTRATIONS
  // ==========================================
  
  const demonstrateTestExecution = useCallback(async () => {
    activateSection('testing');
    
    Alert.alert(
      'Testing Demo',
      'Select a test scenario to run:',
      [
        { text: 'Login Success', onPress: () => runTestScenario(TestScenarioType.LOGIN_SUCCESS) },
        { text: 'Login Failure', onPress: () => runTestScenario(TestScenarioType.LOGIN_FAILURE) },
        { text: 'Registration', onPress: () => runTestScenario(TestScenarioType.REGISTER_SUCCESS) },
        { text: 'Performance Test', onPress: () => runPerformanceTest() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [activateSection]);

  const runTestScenario = useCallback(async (scenarioType: TestScenarioType) => {
    setSelectedTestScenario(scenarioType);
    try {
      const result = await authTesting.runPredefinedScenario(scenarioType);
      Alert.alert(
        'Test Result',
        `Test ${result.success ? 'PASSED' : 'FAILED'}\nExecution time: ${result.executionTime}ms`,
        [{ text: 'View Details', onPress: () => console.log(result) }, { text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Test Error', `Test execution failed: ${error}`);
    } finally {
      setSelectedTestScenario(null);
    }
  }, [authTesting]);

  const runPerformanceTest = useCallback(async () => {
    try {
      const result = await authTesting.runPerformanceTest({
        operations: ['login', 'register', 'logout'],
        iterations: 10,
        concurrency: 3,
        warmupIterations: 2,
        timeout: 5000,
      });
      
      Alert.alert(
        'Performance Test Result',
        `Operations tested: ${Object.keys(result.operationResults).length}\nRecommendations: ${result.recommendations.length}`,
        [{ text: 'View Details', onPress: () => console.log(result) }, { text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Performance Test Error', `Performance test failed: ${error}`);
    }
  }, [authTesting]);

  const enableMockMode = useCallback(() => {
    authTesting.enableMockMode({
      enabled: true,
      responses: [],
      errorInjection: [],
      networkDelay: 100,
      failureRate: 0.1,
    });
    
    Alert.alert('Mock Mode', 'Mock mode enabled with 10% failure rate');
  }, [authTesting]);

  // ==========================================
  // 🔒 SECURITY DEMONSTRATIONS
  // ==========================================
  
  const demonstrateSecurityFeatures = useCallback(async () => {
    activateSection('security');
    
    Alert.alert(
      'Security Features Demo',
      'Choose a security feature to demonstrate:',
      [
        { text: 'Enable MFA', onPress: () => demonstrateMFA() },
        { text: 'Biometric Auth', onPress: () => demonstrateBiometric() },
        { text: 'Security Audit', onPress: () => demonstrateSecurityAudit() },
        { text: 'Active Sessions', onPress: () => demonstrateActiveSessions() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [activateSection]);

  const demonstrateMFA = useCallback(async () => {
    try {
      await authSecurity.enableMFA(MFAType.TOTP);
      Alert.alert('MFA Demo', 'MFA has been enabled successfully!');
    } catch (error) {
      Alert.alert('MFA Demo Error', `MFA demo failed: ${error}`);
    }
  }, [authSecurity]);

  const demonstrateBiometric = useCallback(async () => {
    if (authSecurity.isBiometricAvailable) {
      try {
        await authSecurity.enableBiometric();
        Alert.alert('Biometric Demo', 'Biometric authentication enabled!');
      } catch (error) {
        Alert.alert('Biometric Demo Error', `Biometric demo failed: ${error}`);
      }
    } else {
      Alert.alert('Biometric Demo', 'Biometric authentication not available on this device');
    }
  }, [authSecurity]);

  const demonstrateSecurityAudit = useCallback(async () => {
    try {
      const auditResult = await authComposite.performSecurityAudit();
      Alert.alert(
        'Security Audit Result',
        `Security Score: ${auditResult.securityScore}/100\nVulnerabilities: ${auditResult.vulnerabilities.length}\nRecommendations: ${auditResult.recommendations.length}`,
        [{ text: 'View Details', onPress: () => console.log(auditResult) }, { text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Security Audit Error', `Security audit failed: ${error}`);
    }
  }, [authComposite]);

  const demonstrateActiveSessions = useCallback(async () => {
    try {
      const sessions = await authSecurity.getActiveSessions();
      Alert.alert(
        'Active Sessions',
        `Found ${sessions.length} active session(s)`,
        [{ text: 'View Details', onPress: () => console.log(sessions) }, { text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Active Sessions Error', `Failed to get sessions: ${error}`);
    }
  }, [authSecurity]);

  // ==========================================
  // 🌐 SOCIAL AUTH DEMONSTRATIONS
  // ==========================================
  
  const demonstrateSocialAuth = useCallback(() => {
    activateSection('social');
    
    Alert.alert(
      'Social Auth Demo',
      'Choose a social provider:',
      [
        { text: 'Google', onPress: () => demonstrateGoogleLogin() },
        { text: 'Enhanced Social Login', onPress: () => demonstrateEnhancedSocialLogin() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [activateSection]);

  const demonstrateGoogleLogin = useCallback(async () => {
    try {
      const user = await authSocial.loginWithGoogle();
      Alert.alert('Google Login Success', `Welcome ${user.email}!`);
    } catch (error) {
      Alert.alert('Google Login Error', `Google login failed: ${error}`);
    }
  }, [authSocial]);

  const demonstrateEnhancedSocialLogin = useCallback(async () => {
    try {
      const user = await authComposite.enhancedSocialLogin('google', {
        linkToExisting: true,
        enableSecuritySetup: true,
      });
      Alert.alert('Enhanced Social Login', `Enhanced login completed for ${user.email}!`);
    } catch (error) {
      Alert.alert('Enhanced Social Login Error', `Enhanced social login failed: ${error}`);
    }
  }, [authComposite]);

  // ==========================================
  // 🔑 PASSWORD DEMONSTRATIONS
  // ==========================================
  
  const demonstratePasswordFeatures = useCallback(() => {
    const testPasswords = ['123456', 'password', 'Password123', 'MyStr0ng!Pass'];
    
    const results = testPasswords.map(password => {
      const strength = authPassword.validatePasswordStrength ? 
        authPassword.validatePasswordStrength(password) : 
        { level: 'Unknown', score: 0 };
      return `${password}: ${(strength as any).level || 'Unknown'} (${strength.score}/100)`;
    });
    
    Alert.alert('Password Strength Demo', results.join('\n'));
  }, [authPassword]);

  const _demonstratePasswordUpdate = useCallback(async () => {
    try {
      const success = await authPassword.updatePassword(
        'currentPassword123',
        'newSecurePassword123!',
        'newSecurePassword123!'
      );
      
      Alert.alert('Password Update', success ? 'Password updated successfully!' : 'Password update failed');
    } catch (error) {
      Alert.alert('Password Update Error', `Password update failed: ${error}`);
    }
  }, [authPassword]);

  const _demonstratePasswordReset = useCallback(async () => {
    try {
      const success = await authPassword.resetPassword('demo@example.com');
      Alert.alert('Password Reset', success ? 'Password reset email sent!' : 'Password reset failed');
    } catch (error) {
      Alert.alert('Password Reset Error', `Password reset failed: ${error}`);
    }
  }, [authPassword]);

  // ==========================================
  // 📊 ANALYTICS & DEBUGGING
  // ==========================================
  
  const showAnalyticsDashboard = useCallback(() => {
    const compositeMetrics = authComposite.getMetrics();
    const flowAnalytics = authFlow.getFlowAnalytics();
    const _testAnalytics = (authTesting as any).getTestMetrics ? (authTesting as any).getTestMetrics() : { totalTests: 0 };
    
    Alert.alert(
      'Analytics Dashboard',
      `Composite Operations: ${compositeMetrics.totalOperations}\nFlow Analytics: ${flowAnalytics.totalDuration}ms\nTest Results: ${authTesting.testResults.length} tests`,
      [
        { text: 'Export Data', onPress: () => exportAnalyticsData() },
        { text: 'Generate Report', onPress: () => generateAnalyticsReport() },
        { text: 'OK' },
      ]
    );
  }, [authComposite, authFlow, authTesting]);

  const exportAnalyticsData = useCallback(() => {
    const exportData = authTesting.exportTestData(true);
    console.log('Analytics Export:', exportData);
    Alert.alert('Export Complete', 'Analytics data exported to console');
  }, [authTesting]);

  const generateAnalyticsReport = useCallback(() => {
    const report = (authTesting as any).generateTestReport ? (authTesting as any).generateTestReport('JSON' as any) : 'No report available';
    console.log('Analytics Report:', report);
    Alert.alert('Report Generated', 'Analytics report generated in console');
  }, [authTesting]);

  const showDebugDashboard = useCallback(() => {
    const snapshot = authTesting.captureStateSnapshot();
    const flowAnalysis = authTesting.analyzeAuthFlow();
    
    Alert.alert(
      'Debug Dashboard',
      `State Snapshot: ${snapshot.timestamp.toISOString()}\nFlow Efficiency: ${flowAnalysis.flowEfficiency}%\nSecurity Score: ${flowAnalysis.securityScore}`,
      [
        { text: 'View Snapshot', onPress: () => console.log('State Snapshot:', snapshot) },
        { text: 'View Analysis', onPress: () => console.log('Flow Analysis:', flowAnalysis) },
        { text: 'OK' },
      ]
    );
  }, [authTesting]);

  // ==========================================
  // 🎨 RENDER METHODS
  // ==========================================
  
  const renderDemoSection = (section: DemoSection) => (
    <View key={section.id} style={styles.demoSection}>
      <TouchableOpacity
        style={[styles.sectionHeader, section.isActive && styles.sectionHeaderActive]}
        onPress={() => toggleSection(section.id)}
      >
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionDescription}>{section.description}</Text>
        {section.isActive && <ActivityIndicator size="small" color="#007AFF" />}
      </TouchableOpacity>
      
      {section.isExpanded && (
        <View style={styles.sectionContent}>
          {renderSectionContent(section.id)}
        </View>
      )}
    </View>
  );

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'composite':
        return (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={demonstrateCompositeLogin}>
              <Text style={styles.buttonText}>Enhanced Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoButton} onPress={demonstrateCompleteRegistration}>
              <Text style={styles.buttonText}>Complete Registration</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoButton} onPress={demonstrateSecuritySetup}>
              <Text style={styles.buttonText}>Security Setup</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'flow':
        return (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={demonstrateLoginFlow}>
              <Text style={styles.buttonText}>Login Flow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoButton} onPress={demonstrateRegistrationFlow}>
              <Text style={styles.buttonText}>Registration Flow</Text>
            </TouchableOpacity>
            <Text style={styles.flowInfo}>
              Current Flow: {authFlow.context.currentState} ({authFlow.progress}%)
            </Text>
          </View>
        );
        
      case 'testing':
        return (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={demonstrateTestExecution}>
              <Text style={styles.buttonText}>Run Tests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoButton} onPress={enableMockMode}>
              <Text style={styles.buttonText}>Enable Mock Mode</Text>
            </TouchableOpacity>
            <Text style={styles.testInfo}>
              Test Results: {authTesting.testResults.length} tests
              {authTesting.isTestingActive && " (Running...)"}
            </Text>
          </View>
        );
        
      case 'security':
        return (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={demonstrateSecurityFeatures}>
              <Text style={styles.buttonText}>Security Features</Text>
            </TouchableOpacity>
            <Text style={styles.securityInfo}>
              Biometric Available: {authSecurity.isBiometricAvailable ? 'Yes' : 'No'}
            </Text>
          </View>
        );
        
      case 'social':
        return (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={demonstrateSocialAuth}>
              <Text style={styles.buttonText}>Social Login</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'password':
        return (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={demonstratePasswordFeatures}>
              <Text style={styles.buttonText}>Password Features</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return <Text>Demo content for {sectionId}</Text>;
    }
  };

  const renderMetricsDashboard = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.metricsTitle}>Live Metrics</Text>
      <View style={styles.metricsRow}>
        <Text style={styles.metricLabel}>Operations: {demoMetrics.totalOperations}</Text>
        <Text style={styles.metricLabel}>Success: {demoMetrics.successfulOperations}</Text>
      </View>
      <View style={styles.metricsRow}>
        <Text style={styles.metricLabel}>Failed: {demoMetrics.failedOperations}</Text>
        <Text style={styles.metricLabel}>Avg Response: {Math.round(demoMetrics.averageResponseTime)}ms</Text>
      </View>
      <View style={styles.metricsRow}>
        <Text style={styles.metricLabel}>Performance: {Math.round(demoMetrics.performanceScore)}%</Text>
        <Text style={styles.metricLabel}>Active Hooks: {demoMetrics.activeHooks.length}</Text>
      </View>
    </View>
  );

  // ==========================================
  // 🎨 MAIN RENDER
  // ==========================================
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Enterprise Auth Demo</Text>
          <Text style={styles.subtitle}>Complete Hook Ecosystem Demonstration</Text>
        </View>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Live Monitoring</Text>
            <Switch value={isMonitoring} onValueChange={setIsMonitoring} />
          </View>
          
          <View style={styles.controlButtonsRow}>
            <TouchableOpacity style={styles.controlButton} onPress={showAnalyticsDashboard}>
              <Text style={styles.controlButtonText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={showDebugDashboard}>
              <Text style={styles.controlButtonText}>Debug</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={() => {
              authTesting.clearTestResults();
              setDemoMetrics({
                totalOperations: 0,
                successfulOperations: 0,
                failedOperations: 0,
                averageResponseTime: 0,
                activeHooks: [],
                performanceScore: 100,
              });
            }}>
              <Text style={styles.controlButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Metrics */}
        {isMonitoring && renderMetricsDashboard()}

        {/* Demo Sections */}
        <View style={styles.demosContainer}>
          {demoSections.map(renderDemoSection)}
        </View>

        {/* Current User Info */}
        {authComposite.user && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoTitle}>Current User</Text>
            <Text style={styles.userInfoText}>Email: {authComposite.user.email}</Text>
            <Text style={styles.userInfoText}>Authenticated: {authComposite.isAuthenticated ? 'Yes' : 'No'}</Text>
          </View>
        )}

        {/* Current Flow Info */}
        {authFlow.context.data && (
          <View style={styles.flowInfo}>
            <Text style={styles.flowInfoTitle}>Active Flow</Text>
            <Text style={styles.flowInfoText}>Flow Type: {authFlow.context.data?.flowType}</Text>
            <Text style={styles.flowInfoText}>State: {authFlow.context.currentState}</Text>
            <Text style={styles.flowInfoText}>Progress: {authFlow.progress}%</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// 🎨 STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  controlPanel: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  controlButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  metricsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  demosContainer: {
    marginBottom: 20,
  },
  demoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeaderActive: {
    backgroundColor: '#f8f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
  },
  sectionContent: {
    padding: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  demoButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  flowInfo: {
    backgroundColor: '#f8f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  testInfo: {
    backgroundColor: '#f8f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  securityInfo: {
    backgroundColor: '#f8f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  userInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  flowInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  flowInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default EnterpriseAuthDemoScreen; 