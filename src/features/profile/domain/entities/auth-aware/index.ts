/**
 * @fileoverview Auth-Aware Domain Entities - Enterprise Export Index
 * 
 * 🏛️ DOMAIN LAYER - Enterprise Auth-Aware Entities
 * 🎯 EXPORT INDEX: Centralized exports for all auth-aware domain entities
 * 
 * @version 2.0.0
 * @author ReactNativeSkeleton
 */

// ============================================================================
// AUTH-AWARE PROFILE ENTITY EXPORTS
// ============================================================================
export {
  AuthAwareProfile,
  AuthAwareProfileFactory,
  type UserRole,
  type ProfileVisibility,
  type AccessPermission,
  type ProfileFieldAccess,
  type AuthProfileMetadata,
  type ProfileAccessAudit,
  type RolePermissionMatrix,
  type PermissionCondition,
  type ProfileSecurityAssessment,
  type SecurityThreat,
  type SecurityRecommendation,
  type ComplianceStatus,
  type ComplianceCheck,
  type ComplianceRequirement,
  type AccessPattern
} from './auth-aware-profile.entity';

// ============================================================================
// AUTH SESSION ENTITY EXPORTS
// ============================================================================
export {
  AuthSession,
  AuthSessionFactory,
  type SessionStatus,
  type DeviceType,
  type SessionSecurityLevel,
  type SessionActivityType,
  type SessionInfo,
  type SessionLocation,
  type SessionActivity,
  type SessionSecurityMetrics,
  type SessionAnomaly,
  type SessionSecurityEvent,
  type MultiDeviceSession,
  type CrossDeviceAnalytics,
  type DeviceUsagePattern,
  type SessionTransition,
  type SessionSyncEvent,
  type DeviceRiskCorrelation,
  type SessionPerformanceMetrics,
  type SessionResourceUsage,
  type SessionOptimization,
  type PerformanceTrend
} from './auth-session.entity';

// ============================================================================
// PROFILE ACCESS CONTROL ENTITY EXPORTS
// ============================================================================
export {
  ProfileAccessControl,
  type PolicyType,
  type PermissionResult,
  type AccessControlContext,
  type PermissionPolicy,
  type PolicyCondition,
  type PolicyAction,
  type PolicyException,
  type PolicyMetadata,
  type ComplianceRequirement,
  type RoleDefinition,
  type ConditionalPermission,
  type FieldAccessRule,
  type DataMaskingRule,
  type TimeRestriction,
  type PermissionRequirement,
  type RoleMetadata,
  type ProvisioningRule,
  type ProvisioningAction,
  type DeprovisioningRule,
  type DeprovisioningAction,
  type DataRetentionPolicy,
  type AccessDecision,
  type ConditionalPermissionGrant,
  type AccessAuditEntry,
  type AccessPattern,
  type PatternDeviation
} from './profile-access-control.entity';

// ============================================================================
// AUTH-AWARE ANALYTICS ENTITY EXPORTS
// ============================================================================
export {
  AuthAwareAnalytics,
  type AnalyticsEventType,
  type DataClassification,
  type PrivacyLevel,
  type ConsentType,
  type AnalyticsEvent,
  type AnalyticsContext,
  type DeviceInfo,
  type NetworkInfo,
  type UserBehaviorPattern,
  type BehaviorInsight,
  type InsightEvidence,
  type InsightRecommendation,
  type BehaviorAnomaly,
  type AnomalyEvidence,
  type BehaviorPrediction,
  type PredictionFactor,
  type AnalyticsMetrics,
  type EngagementMetrics,
  type FeatureUsageMetrics,
  type PerformanceMetrics,
  type SecurityMetrics,
  type ErrorMetrics,
  type ConversionMetrics,
  type RetentionMetrics,
  type TrendAnalysis,
  type ComparisonAnalysis,
  type GoalTracking,
  type PrivacyCompliance
} from './auth-aware-analytics.entity';

// ============================================================================
// ENTITY REGISTRY & METADATA
// ============================================================================

/**
 * Auth-Aware Domain Entity Registry
 */
export const AUTH_AWARE_ENTITIES = {
  AuthAwareProfile: 'auth-aware-profile.entity.ts',
  AuthSession: 'auth-session.entity.ts', 
  ProfileAccessControl: 'profile-access-control.entity.ts',
  AuthAwareAnalytics: 'auth-aware-analytics.entity.ts'
} as const;

/**
 * Entity metadata for reflection and documentation
 */
export const AUTH_AWARE_ENTITY_METADATA = {
  version: '2.0.0',
  totalEntities: 4,
  totalInterfaces: 120,
  totalLines: 3224,
  features: [
    'Role-Based Access Control (RBAC)',
    'Attribute-Based Access Control (ABAC)', 
    'Multi-Device Session Management',
    'Security Threat Detection',
    'Behavioral Analytics with Privacy',
    'GDPR Compliance & Consent Management',
    'Anomaly Detection & Response',
    'Performance Optimization',
    'Audit Logging & Compliance',
    'Predictive Analytics',
    'Real-time Monitoring',
    'Data Masking & Anonymization'
  ],
  businessCapabilities: [
    'Enterprise Authentication & Authorization',
    'Privacy-Compliant User Analytics',
    'Security Monitoring & Response',
    'Session Lifecycle Management',
    'Compliance Reporting & Auditing',
    'Behavioral Insights & Predictions',
    'Performance Analytics & Optimization',
    'Multi-Device User Experience'
  ],
  complianceStandards: [
    'GDPR (General Data Protection Regulation)',
    'SOX (Sarbanes-Oxley Act)',
    'ISO 27001 (Information Security Management)',
    'NIST Cybersecurity Framework',
    'HIPAA (Health Insurance Portability)',
    'PCI DSS (Payment Card Industry Data Security)'
  ],
  architecturalPatterns: [
    'Domain-Driven Design (DDD)',
    'Clean Architecture',
    'Enterprise Integration Patterns',
    'Privacy by Design',
    'Security by Design',
    'Event-Driven Architecture',
    'CQRS (Command Query Responsibility Segregation)',
    'Repository Pattern',
    'Factory Pattern',
    'Strategy Pattern'
  ],
  lastUpdated: new Date().toISOString(),
  maintainedBy: 'ReactNativeSkeleton Enterprise Team'
};

/**
 * Entity validation helpers
 */
export const AUTH_AWARE_VALIDATORS = {
  isValidUserRole: (role: string): role is UserRole => {
    return ['guest', 'user', 'premium', 'moderator', 'admin', 'superadmin'].includes(role);
  },
  
  isValidPermission: (permission: string): permission is AccessPermission => {
    return ['read', 'edit', 'delete', 'admin', 'moderate', 'export', 'audit'].includes(permission);
  },
  
  isValidEventType: (eventType: string): eventType is AnalyticsEventType => {
    return ['profile_view', 'profile_edit', 'profile_share', 'auth_login', 'auth_logout', 
            'permission_request', 'security_action', 'feature_usage', 'performance', 'error', 'custom'].includes(eventType);
  },
  
  isValidConsentType: (consentType: string): consentType is ConsentType => {
    return ['necessary', 'functional', 'performance', 'marketing', 'personalization'].includes(consentType);
  }
};

/**
 * Entity factory registry
 */
export const AUTH_AWARE_FACTORIES = {
  AuthAwareProfile: AuthAwareProfileFactory,
  AuthSession: AuthSessionFactory
} as const;

/**
 * Default configuration for auth-aware entities
 */
export const AUTH_AWARE_CONFIG = {
  security: {
    defaultSecurityLevel: 'enhanced' as const,
    maxSessionDuration: 24 * 60 * 60 * 1000, // 24 hours in ms
    riskThreshold: 80,
    anomalyDetectionEnabled: true,
    complianceMode: 'strict' as const
  },
  privacy: {
    defaultPrivacyLevel: 'enhanced' as const,
    dataRetentionPeriod: 365, // days
    anonymizationRequired: true,
    consentRequired: true,
    gdprCompliant: true
  },
  analytics: {
    realTimeProcessing: true,
    batchSize: 1000,
    aggregationInterval: 300000, // 5 minutes in ms
    anomalyThreshold: 0.8,
    predictionAccuracy: 0.85
  },
  performance: {
    cacheEnabled: true,
    cacheTTL: 300000, // 5 minutes in ms
    optimizationEnabled: true,
    monitoringEnabled: true,
    alertThreshold: 90
  }
} as const;

/**
 * Export everything for convenience
 */
export * from './auth-aware-profile.entity';
export * from './auth-session.entity';
export * from './profile-access-control.entity';
export * from './auth-aware-analytics.entity';