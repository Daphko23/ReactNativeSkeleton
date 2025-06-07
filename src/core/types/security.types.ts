/**
 * @fileoverview SECURITY-TYPES-2025: Advanced Security Type Definitions for Enterprise Standard
 * @description Comprehensive security types including Passkeys, WebAuthn, Quantum-Safe Crypto,
 * and Zero Trust Architecture components for Industry Standard 2025 compliance.
 * 
 * @version 2.0.0
 * @since 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module SecurityTypes2025
 * @namespace Core.Types.Security
 * @category Security
 * @subcategory Authentication
 */

/**
 * WebAuthn/Passkeys Authentication Types
 * 
 * @since 2.0.0
 * @category Authentication
 * @subcategory WebAuthn
 */
export interface PasskeyCredential {
  /** Unique credential identifier */
  id: string;
  /** Base64-encoded credential public key */
  publicKey: string;
  /** Credential type (always 'public-key' for Passkeys) */
  type: 'public-key';
  /** Relying Party identifier */
  rpId: string;
  /** User handle for the credential */
  userHandle: string;
  /** Authenticator attachment type */
  authenticatorAttachment: 'platform' | 'cross-platform';
  /** Creation timestamp */
  createdAt: Date;
  /** Last used timestamp */
  lastUsedAt: Date;
  /** Device information */
  deviceInfo: {
    name: string;
    platform: string;
    version: string;
  };
}

/**
 * WebAuthn Registration Response
 * 
 * @since 2.0.0
 * @category Authentication
 * @subcategory WebAuthn
 */
export interface WebAuthnRegistrationResponse {
  /** Attestation response from authenticator */
  attestationResponse: {
    clientDataJSON: string;
    attestationObject: string;
  };
  /** Credential identifier */
  id: string;
  /** Raw credential identifier */
  rawId: ArrayBuffer;
  /** Response type */
  type: 'public-key';
}

/**
 * WebAuthn Authentication Response
 * 
 * @since 2.0.0
 * @category Authentication
 * @subcategory WebAuthn
 */
export interface WebAuthnAuthenticationResponse {
  /** Assertion response from authenticator */
  assertionResponse: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle?: string;
  };
  /** Credential identifier */
  id: string;
  /** Raw credential identifier */
  rawId: ArrayBuffer;
  /** Response type */
  type: 'public-key';
}

/**
 * Quantum-Safe Cryptography Configuration
 * 
 * @since 2.0.0
 * @category Security
 * @subcategory QuantumSafe
 */
export interface QuantumSafeConfig {
  /** Post-quantum cryptographic algorithm */
  algorithm: 'CRYSTALS-Kyber' | 'CRYSTALS-Dilithium' | 'FALCON' | 'SPHINCS+';
  /** Key size in bits */
  keySize: 512 | 768 | 1024 | 2048 | 3072 | 4096;
  /** Security level (NIST categories) */
  securityLevel: 1 | 2 | 3 | 4 | 5;
  /** Hybrid mode with classical crypto */
  hybridMode: boolean;
  /** Key rotation policy */
  keyRotation: {
    enabled: boolean;
    intervalDays: number;
    maxKeys: number;
  };
}

/**
 * Zero Trust Architecture Components
 * 
 * @since 2.0.0
 * @category Security
 * @subcategory ZeroTrust
 */
export interface ZeroTrustPolicy {
  /** Policy identifier */
  id: string;
  /** Policy name */
  name: string;
  /** Trust level required */
  trustLevel: 'none' | 'low' | 'medium' | 'high' | 'verified';
  /** Conditions that must be met */
  conditions: ZeroTrustCondition[];
  /** Actions to take when policy is triggered */
  actions: ZeroTrustAction[];
  /** Policy priority (higher = more important) */
  priority: number;
  /** Policy is active */
  enabled: boolean;
}

export interface ZeroTrustCondition {
  /** Condition type */
  type: 'device_trust' | 'location' | 'time' | 'network' | 'behavior' | 'compliance';
  /** Operator for condition evaluation */
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range';
  /** Expected value */
  value: any;
  /** Current value */
  currentValue?: any;
  /** Condition is met */
  isMet?: boolean;
}

export interface ZeroTrustAction {
  /** Action type */
  type: 'allow' | 'deny' | 'challenge' | 'log' | 'monitor' | 'alert';
  /** Additional parameters for action */
  parameters?: Record<string, any>;
  /** Action severity */
  severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Advanced Threat Intelligence
 * 
 * @since 2.0.0
 * @category Security
 * @subcategory ThreatIntel
 */
export interface ThreatIntelligence {
  /** Threat indicator */
  indicator: string;
  /** Indicator type */
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'user_agent';
  /** Threat severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Confidence level (0-100) */
  confidence: number;
  /** Threat description */
  description: string;
  /** First seen timestamp */
  firstSeen: Date;
  /** Last seen timestamp */
  lastSeen: Date;
  /** Threat tags */
  tags: string[];
  /** Source of intelligence */
  source: string;
}

/**
 * Behavioral Analytics Types
 * 
 * @since 2.0.0
 * @category Security
 * @subcategory Behavioral
 */
export interface BehavioralPattern {
  /** Pattern identifier */
  id: string;
  /** User identifier */
  userId: string;
  /** Pattern type */
  type: 'login_time' | 'device_usage' | 'location' | 'app_usage' | 'navigation';
  /** Normal pattern data */
  baseline: Record<string, any>;
  /** Current behavior data */
  current: Record<string, any>;
  /** Deviation score (0-100) */
  deviationScore: number;
  /** Is anomalous */
  isAnomalous: boolean;
  /** Last updated */
  lastUpdated: Date;
}

/**
 * Compliance Framework Types
 * 
 * @since 2.0.0
 * @category Security
 * @subcategory Compliance
 */
export interface ComplianceFramework {
  /** Framework name */
  name: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOX' | 'PCI-DSS' | 'SOC2' | 'ISO27001' | 'EU-AI-ACT';
  /** Framework version */
  version: string;
  /** Compliance status */
  status: 'compliant' | 'non_compliant' | 'partial' | 'unknown';
  /** Required controls */
  controls: ComplianceControl[];
  /** Last assessment date */
  lastAssessment: Date;
  /** Next assessment due */
  nextAssessment: Date;
  /** Compliance score (0-100) */
  score: number;
}

export interface ComplianceControl {
  /** Control identifier */
  id: string;
  /** Control description */
  description: string;
  /** Implementation status */
  status: 'implemented' | 'not_implemented' | 'partial' | 'not_applicable';
  /** Evidence of implementation */
  evidence: string[];
  /** Risk level if not implemented */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Owner responsible for control */
  owner: string;
}

/**
 * Security Metrics and KPIs
 * 
 * @since 2.0.0
 * @category Security
 * @subcategory Metrics
 */
export interface SecurityMetrics {
  /** Authentication metrics */
  authentication: {
    successRate: number;
    failureRate: number;
    averageTime: number;
    mfaAdoption: number;
    passkeyAdoption: number;
  };
  /** Threat detection metrics */
  threatDetection: {
    threatsDetected: number;
    falsePositives: number;
    averageResponseTime: number;
    blockedThreats: number;
  };
  /** Compliance metrics */
  compliance: {
    overallScore: number;
    criticalIssues: number;
    pendingActions: number;
    lastAudit: Date;
  };
  /** Incident response metrics */
  incidentResponse: {
    openIncidents: number;
    averageResolutionTime: number;
    criticalIncidents: number;
    escalatedIncidents: number;
  };
} 