/**
 * @fileoverview Security Profile Entity - Enterprise Security Domain
 * 
 * ✅ DOMAIN LAYER: Core security business objects
 * ✅ ENTERPRISE: Production-ready security data structures
 * ✅ CLEAN ARCHITECTURE: Domain-driven design principles
 */

export type SecurityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';
export type ThreatLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AuthMethod = 'PASSWORD' | 'BIOMETRIC' | 'MFA' | 'SSO' | 'DEVICE_TOKEN';
export type ComplianceStatus = 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'UNKNOWN';

/**
 * 🛡️ SECURITY PROFILE - Core Security Entity
 */
export interface SecurityProfile {
  // Identity
  id: string;
  userId: string;
  
  // Security Score & Assessment
  securityScore: number; // 0-100
  securityLevel: SecurityLevel;
  threatLevel: ThreatLevel;
  complianceStatus: ComplianceStatus;
  
  // Authentication Methods
  authMethods: {
    password: {
      enabled: boolean;
      strength: number; // 0-100
      lastChanged: Date;
      requiresUpdate: boolean;
      policy: PasswordPolicy;
    };
    mfa: {
      enabled: boolean;
      methods: MFAMethod[];
      backupCodes: number;
      lastUsed: Date | null;
    };
    biometric: {
      enabled: boolean;
      types: BiometricType[];
      deviceSupport: BiometricSupport;
      lastUsed: Date | null;
    };
    sso: {
      enabled: boolean;
      providers: SSOProvider[];
      lastUsed: Date | null;
    };
  };
  
  // Device Security
  deviceSecurity: {
    trustedDevices: DeviceInfo[];
    currentDevice: DeviceInfo;
    maxDevices: number;
    requireDeviceApproval: boolean;
  };
  
  // Session Management
  sessionSecurity: {
    activeSessions: SessionInfo[];
    maxSessions: number;
    sessionTimeout: number; // minutes
    requireReauth: boolean;
    lastActivity: Date;
  };
  
  // Privacy & Compliance
  privacy: {
    dataProcessingConsent: boolean;
    analyticsConsent: boolean;
    marketingConsent: boolean;
    gdprCompliant: boolean;
    consentTimestamp: Date;
  };
  
  // Security Monitoring
  monitoring: {
    threatDetectionEnabled: boolean;
    anomalyDetectionEnabled: boolean;
    realTimeAlertsEnabled: boolean;
    auditLogRetention: number; // days
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastSecurityReview: Date;
  nextSecurityReview: Date;
  version: string;
}

/**
 * 🔐 PASSWORD POLICY
 */
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number;
  expirationDays: number;
}

/**
 * 📱 MFA METHOD
 */
export interface MFAMethod {
  id: string;
  type: 'TOTP' | 'SMS' | 'EMAIL' | 'HARDWARE_TOKEN';
  name: string;
  enabled: boolean;
  verified: boolean;
  createdAt: Date;
  lastUsed: Date | null;
  metadata: Record<string, any>;
}

/**
 * 👆 BIOMETRIC TYPES
 */
export type BiometricType = 'FACE_ID' | 'TOUCH_ID' | 'FINGERPRINT' | 'VOICE' | 'IRIS';

export interface BiometricSupport {
  available: boolean;
  supportedTypes: BiometricType[];
  deviceCapabilities: {
    secureEnclave: boolean;
    hardwareBackedKeystore: boolean;
    biometricStrongAuth: boolean;
  };
}

/**
 * 🔗 SSO PROVIDER
 */
export interface SSOProvider {
  id: string;
  name: string;
  type: 'GOOGLE' | 'APPLE' | 'MICROSOFT' | 'OKTA' | 'CUSTOM';
  enabled: boolean;
  lastUsed: Date | null;
  metadata: Record<string, any>;
}

/**
 * 📱 DEVICE INFO
 */
export interface DeviceInfo {
  id: string;
  name: string;
  type: 'MOBILE' | 'TABLET' | 'DESKTOP' | 'WATCH' | 'TV';
  platform: 'IOS' | 'ANDROID' | 'WEB' | 'WINDOWS' | 'MACOS';
  osVersion: string;
  appVersion: string;
  trusted: boolean;
  fingerprint: string;
  
  // Security Status
  securityStatus: {
    jailbroken: boolean;
    debuggingEnabled: boolean;
    vpnActive: boolean;
    screenLockEnabled: boolean;
    biometricEnabled: boolean;
  };
  
  // Location & Network
  location: {
    country: string;
    region: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  network: {
    ipAddress: string;
    isp: string;
    connectionType: 'WIFI' | 'CELLULAR' | 'ETHERNET' | 'VPN';
    secure: boolean;
  };
  
  // Timestamps
  firstSeen: Date;
  lastSeen: Date;
  lastActivity: Date;
}

/**
 * 📊 SESSION INFO
 */
export interface SessionInfo {
  id: string;
  deviceId: string;
  deviceName: string;
  
  // Session Details
  startTime: Date;
  lastActivity: Date;
  duration: number; // seconds
  active: boolean;
  
  // Security Context
  authMethod: AuthMethod;
  ipAddress: string;
  location: string;
  userAgent: string;
  
  // Risk Assessment
  riskScore: number; // 0-100
  anomalies: string[];
  requiresReauth: boolean;
}

/**
 * 🎯 SECURITY ACTION
 */
export interface SecurityAction {
  id: string;
  type: SecurityActionType;
  title: string;
  description: string;
  
  // Priority & Impact
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  urgency: 'IMMEDIATE' | 'URGENT' | 'NORMAL' | 'LOW';
  
  // Execution Details
  estimatedTime: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  automatable: boolean;
  
  // Business Context
  businessImpact: string;
  securityBenefit: string;
  complianceImprovement: number; // 0-100
  
  // Metadata
  createdAt: Date;
  validUntil: Date | null;
  dismissed: boolean;
  completed: boolean;
  completedAt: Date | null;
}

export type SecurityActionType = 
  | 'ENABLE_MFA'
  | 'UPDATE_PASSWORD'
  | 'VERIFY_EMAIL'
  | 'REVIEW_DEVICES'
  | 'UPDATE_PRIVACY'
  | 'REVIEW_SESSIONS'
  | 'ENABLE_BIOMETRIC'
  | 'SECURITY_REVIEW'
  | 'COMPLIANCE_UPDATE'
  | 'THREAT_RESPONSE';

/**
 * 📋 SECURITY ASSESSMENT
 */
export interface SecurityAssessment {
  // Overall Score
  score: number; // 0-100
  level: SecurityLevel;
  improvement: number; // change from last assessment
  
  // Factor Breakdown
  factors: {
    authentication: SecurityFactor;
    deviceSecurity: SecurityFactor;
    dataSecurity: SecurityFactor;
    compliance: SecurityFactor;
    monitoring: SecurityFactor;
  };
  
  // Recommendations
  recommendations: SecurityRecommendation[];
  criticalIssues: SecurityIssue[];
  
  // Trends
  trends: {
    scoreHistory: Array<{ date: Date; score: number }>;
    threatTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    complianceTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  };
  
  // Metadata
  assessmentDate: Date;
  assessmentVersion: string;
  nextAssessment: Date;
}

/**
 * 📊 SECURITY FACTOR
 */
export interface SecurityFactor {
  name: string;
  score: number; // 0-100
  weight: number; // factor importance
  status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  details: string[];
  improvements: string[];
}

/**
 * 💡 SECURITY RECOMMENDATION
 */
export interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'AUTHENTICATION' | 'DEVICE' | 'DATA' | 'COMPLIANCE' | 'MONITORING';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  impact: number; // expected score improvement
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedTime: string;
}

/**
 * ⚠️ SECURITY ISSUE
 */
export interface SecurityIssue {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  category: string;
  impact: string;
  remediation: string;
  detectedAt: Date;
  resolved: boolean;
  resolvedAt: Date | null;
}