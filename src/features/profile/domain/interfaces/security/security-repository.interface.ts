/**
 * @fileoverview Security Repository Interface - Enterprise Security Domain
 * 
 * ✅ DOMAIN LAYER: Repository contracts and business interfaces
 * ✅ ENTERPRISE: Production-ready security operations
 * ✅ CLEAN ARCHITECTURE: Interface segregation principle
 */

import { Result } from '@core/types/result.type';
import { 
  SecurityProfile, 
  SecurityAction, 
  SecurityAssessment,
  SecurityActionType,
  DeviceInfo,
  SessionInfo,
  MFAMethod,
  SecurityLevel,
  ThreatLevel
} from '../../entities/security/security-profile.entity';

/**
 * 🎯 SECURITY REPOSITORY - Core Security Data Operations
 */
export interface ISecurityRepository {
  // ==================================================
  // SECURITY PROFILE MANAGEMENT
  // ==================================================
  
  /**
   * 🔍 Get Security Profile
   */
  getSecurityProfile(userId: string): Promise<Result<SecurityProfile>>;
  
  /**
   * 💾 Save Security Profile
   */
  saveSecurityProfile(profile: SecurityProfile): Promise<Result<void>>;
  
  /**
   * 🔄 Update Security Profile
   */
  updateSecurityProfile(
    userId: string, 
    updates: Partial<SecurityProfile>
  ): Promise<Result<SecurityProfile>>;
  
  // ==================================================
  // SECURITY ASSESSMENT
  // ==================================================
  
  /**
   * 📊 Get Security Assessment
   */
  getSecurityAssessment(userId: string): Promise<Result<SecurityAssessment>>;
  
  /**
   * 🔄 Recalculate Security Assessment
   */
  recalculateSecurityAssessment(userId: string): Promise<Result<SecurityAssessment>>;
  
  /**
   * 📈 Get Security Score History
   */
  getSecurityScoreHistory(
    userId: string, 
    fromDate: Date, 
    toDate: Date
  ): Promise<Result<Array<{ date: Date; score: number }>>>;
  
  // ==================================================
  // SECURITY ACTIONS
  // ==================================================
  
  /**
   * 🎯 Get Security Actions
   */
  getSecurityActions(userId: string): Promise<Result<SecurityAction[]>>;
  
  /**
   * ⚡ Execute Security Action
   */
  executeSecurityAction(
    userId: string, 
    actionId: string, 
    parameters?: Record<string, any>
  ): Promise<Result<boolean>>;
  
  /**
   * ❌ Dismiss Security Action
   */
  dismissSecurityAction(userId: string, actionId: string): Promise<Result<void>>;
  
  /**
   * ✅ Complete Security Action
   */
  completeSecurityAction(
    userId: string, 
    actionId: string,
    metadata?: Record<string, any>
  ): Promise<Result<void>>;
  
  // ==================================================
  // DEVICE MANAGEMENT
  // ==================================================
  
  /**
   * 📱 Get User Devices
   */
  getUserDevices(userId: string): Promise<Result<DeviceInfo[]>>;
  
  /**
   * ✅ Trust Device
   */
  trustDevice(userId: string, deviceId: string): Promise<Result<void>>;
  
  /**
   * ❌ Revoke Device Trust
   */
  revokeDeviceTrust(userId: string, deviceId: string): Promise<Result<void>>;
  
  /**
   * 🔄 Update Device Info
   */
  updateDeviceInfo(deviceInfo: DeviceInfo): Promise<Result<DeviceInfo>>;
  
  /**
   * 🗑️ Remove Device
   */
  removeDevice(userId: string, deviceId: string): Promise<Result<void>>;
  
  // ==================================================
  // SESSION MANAGEMENT
  // ==================================================
  
  /**
   * 📊 Get Active Sessions
   */
  getActiveSessions(userId: string): Promise<Result<SessionInfo[]>>;
  
  /**
   * 🔚 Terminate Session
   */
  terminateSession(userId: string, sessionId: string): Promise<Result<void>>;
  
  /**
   * 🚪 Terminate All Sessions
   */
  terminateAllSessions(userId: string, exceptCurrentSession?: boolean): Promise<Result<void>>;
  
  /**
   * 🔄 Update Session Activity
   */
  updateSessionActivity(sessionId: string): Promise<Result<void>>;
  
  // ==================================================
  // MFA MANAGEMENT
  // ==================================================
  
  /**
   * 🔐 Get MFA Methods
   */
  getMFAMethods(userId: string): Promise<Result<MFAMethod[]>>;
  
  /**
   * ➕ Add MFA Method
   */
  addMFAMethod(userId: string, method: Omit<MFAMethod, 'id' | 'createdAt'>): Promise<Result<MFAMethod>>;
  
  /**
   * ❌ Remove MFA Method
   */
  removeMFAMethod(userId: string, methodId: string): Promise<Result<void>>;
  
  /**
   * ✅ Verify MFA Method
   */
  verifyMFAMethod(userId: string, methodId: string, code: string): Promise<Result<boolean>>;
  
  /**
   * 🔑 Generate Backup Codes
   */
  generateBackupCodes(userId: string): Promise<Result<string[]>>;
  
  // ==================================================
  // THREAT DETECTION
  // ==================================================
  
  /**
   * 🚨 Detect Security Threats
   */
  detectSecurityThreats(userId: string): Promise<Result<SecurityThreat[]>>;
  
  /**
   * 📊 Get Threat Analysis
   */
  getThreatAnalysis(
    userId: string, 
    timeframe: TimeFrame
  ): Promise<Result<ThreatAnalysis>>;
  
  /**
   * ✅ Resolve Security Threat
   */
  resolveSecurityThreat(
    userId: string, 
    threatId: string,
    resolution: string
  ): Promise<Result<void>>;
  
  // ==================================================
  // AUDIT & COMPLIANCE
  // ==================================================
  
  /**
   * 📋 Get Security Audit Log
   */
  getSecurityAuditLog(
    userId: string,
    fromDate: Date,
    toDate: Date,
    eventTypes?: SecurityEventType[]
  ): Promise<Result<SecurityAuditEntry[]>>;
  
  /**
   * 📝 Log Security Event
   */
  logSecurityEvent(event: SecurityAuditEntry): Promise<Result<void>>;
  
  /**
   * 📊 Get Compliance Report
   */
  getComplianceReport(userId: string): Promise<Result<ComplianceReport>>;
  
  /**
   * 🔄 Update Privacy Consent
   */
  updatePrivacyConsent(
    userId: string, 
    consents: PrivacyConsent
  ): Promise<Result<void>>;
  
  // ==================================================
  // ANALYTICS & MONITORING
  // ==================================================
  
  /**
   * 📈 Get Security Metrics
   */
  getSecurityMetrics(
    userId: string,
    timeframe: TimeFrame
  ): Promise<Result<SecurityMetrics>>;
  
  /**
   * 🎯 Track Security Event
   */
  trackSecurityEvent(
    userId: string,
    eventType: SecurityEventType,
    metadata: Record<string, any>
  ): Promise<Result<void>>;
  
  /**
   * 🏥 Get Security Health
   */
  getSecurityHealth(userId: string): Promise<Result<SecurityHealth>>;
  
  // ==================================================
  // SYSTEM OPERATIONS
  // ==================================================
  
  /**
   * 🏥 Check Repository Health
   */
  checkHealth(): Promise<Result<RepositoryHealthStatus>>;
  
  /**
   * 📊 Get Performance Metrics
   */
  getPerformanceMetrics(): Promise<Result<PerformanceMetrics>>;
  
  /**
   * 🧹 Cleanup Expired Data
   */
  cleanupExpiredData(): Promise<Result<CleanupResult>>;
}

// ==================================================
// SUPPORTING TYPES
// ==================================================

/**
 * 🚨 SECURITY THREAT
 */
export interface SecurityThreat {
  id: string;
  userId: string;
  type: ThreatType;
  severity: ThreatLevel;
  title: string;
  description: string;
  detectedAt: Date;
  resolved: boolean;
  resolvedAt: Date | null;
  resolution?: string;
  metadata: Record<string, any>;
}

export type ThreatType = 
  | 'SUSPICIOUS_LOGIN'
  | 'UNUSUAL_LOCATION'
  | 'MULTIPLE_FAILED_ATTEMPTS'
  | 'DEVICE_ANOMALY'
  | 'SESSION_HIJACKING'
  | 'CREDENTIAL_STUFFING'
  | 'ACCOUNT_TAKEOVER'
  | 'DATA_BREACH_EXPOSURE';

/**
 * 📊 THREAT ANALYSIS
 */
export interface ThreatAnalysis {
  userId: string;
  timeframe: TimeFrame;
  summary: {
    totalThreats: number;
    activeThreat: number;
    resolvedThreats: number;
    threatLevel: ThreatLevel;
  };
  threatsByType: Record<ThreatType, number>;
  timeline: Array<{
    date: Date;
    threats: number;
    severity: ThreatLevel;
  }>;
  recommendations: string[];
  generatedAt: Date;
}

/**
 * ⏰ TIME FRAME
 */
export interface TimeFrame {
  start: Date;
  end: Date;
}

/**
 * 📋 SECURITY AUDIT ENTRY
 */
export interface SecurityAuditEntry {
  id: string;
  userId: string;
  eventType: SecurityEventType;
  timestamp: Date;
  deviceId?: string;
  ipAddress?: string;
  location?: string;
  details: Record<string, any>;
  riskScore: number;
  success: boolean;
}

export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'PASSWORD_CHANGE'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED'
  | 'DEVICE_TRUSTED'
  | 'DEVICE_REVOKED'
  | 'SESSION_TERMINATED'
  | 'PRIVACY_CONSENT_UPDATED'
  | 'SECURITY_ASSESSMENT'
  | 'THREAT_DETECTED'
  | 'THREAT_RESOLVED';

/**
 * 📊 COMPLIANCE REPORT
 */
export interface ComplianceReport {
  userId: string;
  generatedAt: Date;
  complianceScore: number; // 0-100
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
  
  requirements: {
    gdpr: ComplianceRequirement;
    ccpa: ComplianceRequirement;
    hipaa: ComplianceRequirement;
    soc2: ComplianceRequirement;
  };
  
  recommendations: ComplianceRecommendation[];
  nextReview: Date;
}

export interface ComplianceRequirement {
  name: string;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
  score: number;
  requirements: string[];
  gaps: string[];
}

export interface ComplianceRecommendation {
  requirement: string;
  action: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  impact: string;
}

/**
 * 🔐 PRIVACY CONSENT
 */
export interface PrivacyConsent {
  dataProcessing: boolean;
  analytics: boolean;
  marketing: boolean;
  thirdPartySharing: boolean;
  consentTimestamp: Date;
  ipAddress: string;
  location: string;
}

/**
 * 📊 SECURITY METRICS
 */
export interface SecurityMetrics {
  userId: string;
  timeframe: TimeFrame;
  
  authentication: {
    successfulLogins: number;
    failedAttempts: number;
    mfaUsage: number;
    biometricUsage: number;
  };
  
  devices: {
    trustedDevices: number;
    activeDevices: number;
    newDevices: number;
    revokedDevices: number;
  };
  
  sessions: {
    activeSessions: number;
    averageSessionDuration: number;
    terminatedSessions: number;
    concurrentSessions: number;
  };
  
  threats: {
    detectedThreats: number;
    resolvedThreats: number;
    averageResolutionTime: number;
    threatLevel: ThreatLevel;
  };
  
  compliance: {
    score: number;
    lastAudit: Date;
    violations: number;
    dataRequests: number;
  };
}

/**
 * 🏥 SECURITY HEALTH
 */
export interface SecurityHealth {
  userId: string;
  overall: SecurityLevel;
  lastAssessment: Date;
  
  components: {
    authentication: HealthComponent;
    devices: HealthComponent;
    sessions: HealthComponent;
    privacy: HealthComponent;
    monitoring: HealthComponent;
  };
  
  alerts: SecurityAlert[];
  recommendations: string[];
}

export interface HealthComponent {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  score: number;
  lastCheck: Date;
  issues: string[];
}

export interface SecurityAlert {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

/**
 * 🏥 REPOSITORY HEALTH STATUS
 */
export interface RepositoryHealthStatus {
  isHealthy: boolean;
  services: {
    database: 'healthy' | 'degraded' | 'unhealthy';
    cache: 'healthy' | 'degraded' | 'unhealthy';
    external: 'healthy' | 'degraded' | 'unhealthy';
  };
  performance: {
    averageResponseTime: number;
    errorRate: number;
    throughput: number;
  };
  lastCheck: Date;
}

/**
 * 📊 PERFORMANCE METRICS
 */
export interface PerformanceMetrics {
  operations: Record<string, OperationMetrics>;
  cache: {
    hitRate: number;
    missRate: number;
    evictionRate: number;
  };
  database: {
    connectionPool: number;
    queryTime: number;
    transactionTime: number;
  };
  generatedAt: Date;
}

export interface OperationMetrics {
  count: number;
  averageTime: number;
  errorRate: number;
  lastExecution: Date;
}

/**
 * 🧹 CLEANUP RESULT
 */
export interface CleanupResult {
  expiredSessions: number;
  oldAuditLogs: number;
  expiredTokens: number;
  obsoleteDevices: number;
  freedSpace: number;
  duration: number;
}