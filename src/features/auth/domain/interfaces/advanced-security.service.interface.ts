/**
 * @fileoverview DOMAIN-INTERFACE-008: Advanced Security Service Interface - Enterprise Standard
 * @description Domain Layer Interface für Advanced Security Service mit Enterprise Features.
 * 
 * @businessRule BR-280: Advanced security service interface definition
 * @businessRule BR-281: Device fingerprinting interface contracts
 * @businessRule BR-282: Threat assessment interface standards
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

/**
 * @interface DeviceFingerprint
 * @description Device fingerprint data structure
 */
export interface DeviceFingerprint {
  deviceId: string;
  osVersion: string;
  appVersion: string;
  screenResolution: string;
  timeZone: string;
  language: string;
  isJailbroken: boolean;
  isEmulator: boolean;
}

/**
 * @interface ThreatAssessment
 * @description Threat assessment result structure
 */
export interface ThreatAssessment {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  recommendations: string[];
  requiresAction: boolean;
}

/**
 * @interface SecurityMetrics
 * @description Security metrics data structure
 */
export interface SecurityMetrics {
  riskScore: number;
  trustLevel: string;
  anomalies: string[];
  lastSecurityCheck: Date;
}

/**
 * @interface SecurityEvent
 * @description Security event data structure
 */
export interface SecurityEvent {
  id: string;
  type: string;
  severity: string;
  details: any;
  timestamp: Date;
}

/**
 * @interface IAdvancedSecurityService
 * @description Advanced Security Service Interface
 */
export interface IAdvancedSecurityService {
  generateDeviceFingerprint(): Promise<DeviceFingerprint>;
  getGeolocationData(): Promise<any>;
  performThreatAssessment(userId: string, deviceFingerprint: DeviceFingerprint, geolocation: any): Promise<ThreatAssessment>;
  monitorDeviceChanges(userId: string, previousFingerprint?: string): Promise<void>;
  monitorLocationChanges(userId: string, previousLocation?: any): Promise<void>;
  logSecurityEvent(event: SecurityEvent): Promise<void>;
  getSecurityMetrics(): Promise<SecurityMetrics>;
  detectAnomalies(data: any): Promise<string[]>;
  calculateRiskScore(factors: any): Promise<number>;
  assessThreat(context: any): Promise<ThreatAssessment>;
  monitorSecurityEvents(callback: (event: any) => void): () => void;
} 