/**
 * @fileoverview Detect Security Threats Use Case - Advanced Threat Detection
 * 
 * ✅ APPLICATION LAYER: Threat detection business logic
 * ✅ ENTERPRISE: Real-time threat analysis and response
 * ✅ CLEAN ARCHITECTURE: Isolated threat detection rules
 */

import { ISecurityRepository } from '../../../domain/interfaces/security/security-repository.interface';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import { Result } from '@core/types/result.type';
import { SecurityThreat, ThreatType as _ThreatType } from '../../../domain/interfaces/security/security-repository.interface';

// Add ThreatLevel export
export type ThreatLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * 🚨 THREAT DETECTION REQUEST
 */
export interface ThreatDetectionRequest {
  userId: string;
  deviceInfo?: {
    deviceId: string;
    ipAddress: string;
    location: string;
    userAgent: string;
  };
  sessionInfo?: {
    sessionId: string;
    duration: number;
    anomalies: string[];
  };
  behaviorData?: {
    loginAttempts: number;
    failedAttempts: number;
    locationChanges: number;
    deviceChanges: number;
  };
  options?: {
    enableRealTimeResponse?: boolean;
    threatThreshold?: number;
    includeRecommendations?: boolean;
  };
}

/**
 * 🚨 THREAT DETECTION RESPONSE
 */
export interface ThreatDetectionResponse {
  success: boolean;
  threats: SecurityThreat[];
  overallThreatLevel: ThreatLevel;
  recommendations: string[];
  immediateActions: string[];
  metadata: {
    analysisTime: number;
    threatsDetected: number;
    highSeverityThreats: number;
    autoResponseTriggered: boolean;
  };
}

/**
 * 🛡️ DETECT SECURITY THREATS USE CASE
 */
export class DetectSecurityThreatsUseCase {
  private readonly logger = LoggerFactory.createServiceLogger('DetectSecurityThreatsUseCase');

  constructor(
    private readonly securityRepository: ISecurityRepository
  ) {}

  /**
   * 🎯 EXECUTE THREAT DETECTION
   */
  async execute(request: ThreatDetectionRequest): Promise<Result<ThreatDetectionResponse>> {
    const startTime = Date.now();
    
    try {
      this.logger.info('Threat detection started', LogCategory.SECURITY, {
        userId: request.userId,
        metadata: { hasDeviceInfo: !!request.deviceInfo, hasBehaviorData: !!request.behaviorData }
      });

      // Validate request
      if (!request.userId) {
        return Result.error('User ID is required');
      }

      // Detect threats from multiple sources
      const [repositoryThreats, behaviorThreats, deviceThreats, sessionThreats] = await Promise.all([
        this.securityRepository.detectSecurityThreats(request.userId),
        this.analyzeBehavioralThreats(request),
        this.analyzeDeviceThreats(request),
        this.analyzeSessionThreats(request)
      ]);

      // Combine all threats
      const allThreats: SecurityThreat[] = [
        ...(repositoryThreats.success ? repositoryThreats.data || [] : []),
        ...behaviorThreats,
        ...deviceThreats,
        ...sessionThreats
      ];

      // Calculate overall threat level
      const overallThreatLevel = this.calculateOverallThreatLevel(allThreats);

      // Generate recommendations
      const recommendations = this.generateRecommendations(allThreats, overallThreatLevel);
      const immediateActions = this.getImmediateActions(allThreats);

      // Auto-response if enabled and high threat
      let autoResponseTriggered = false;
      if (request.options?.enableRealTimeResponse && this.shouldTriggerAutoResponse(overallThreatLevel)) {
        autoResponseTriggered = await this.triggerAutoResponse(request.userId, allThreats);
      }

      const response: ThreatDetectionResponse = {
        success: true,
        threats: allThreats,
        overallThreatLevel,
        recommendations,
        immediateActions,
        metadata: {
          analysisTime: Date.now() - startTime,
          threatsDetected: allThreats.length,
          highSeverityThreats: allThreats.filter(t => t.severity === 'HIGH' || t.severity === 'CRITICAL').length,
          autoResponseTriggered
        }
      };

      this.logger.info('Threat detection completed', LogCategory.SECURITY, {
        userId: request.userId,
        metadata: {
          threatsFound: allThreats.length,
          overallThreatLevel,
          autoResponseTriggered
        }
      });

      return Result.success(response);

    } catch (error) {
      this.logger.error('Threat detection failed', LogCategory.SECURITY, {
        userId: request.userId
      }, error as Error);

      return Result.error((error as Error).message);
    }
  }

  /**
   * 📊 ANALYZE BEHAVIORAL THREATS
   */
  private async analyzeBehavioralThreats(request: ThreatDetectionRequest): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];
    const behavior = request.behaviorData;

    if (!behavior) return threats;

    // Multiple failed login attempts
    if (behavior.failedAttempts > 5) {
      threats.push({
        id: `behavioral_failed_attempts_${Date.now()}`,
        userId: request.userId,
        type: 'MULTIPLE_FAILED_ATTEMPTS',
        severity: behavior.failedAttempts > 10 ? 'HIGH' : 'MEDIUM',
        title: 'Multiple Failed Login Attempts',
        description: `${behavior.failedAttempts} failed login attempts detected`,
        detectedAt: new Date(),
        resolved: false,
        resolvedAt: null,
        metadata: { failedAttempts: behavior.failedAttempts }
      });
    }

    // Unusual location changes
    if (behavior.locationChanges > 3) {
      threats.push({
        id: `behavioral_location_${Date.now()}`,
        userId: request.userId,
        type: 'UNUSUAL_LOCATION',
        severity: 'MEDIUM',
        title: 'Unusual Location Activity',
        description: `Multiple location changes (${behavior.locationChanges}) detected`,
        detectedAt: new Date(),
        resolved: false,
        resolvedAt: null,
        metadata: { locationChanges: behavior.locationChanges }
      });
    }

    return threats;
  }

  /**
   * 📱 ANALYZE DEVICE THREATS
   */
  private async analyzeDeviceThreats(request: ThreatDetectionRequest): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];
    const deviceInfo = request.deviceInfo;

    if (!deviceInfo) return threats;

    // Get user devices for comparison
    const devicesResult = await this.securityRepository.getUserDevices(request.userId);
    if (!devicesResult.success) return threats;

    const userDevices = devicesResult.data || [];
    const currentDevice = userDevices.find((d: any) => d.id === deviceInfo.deviceId);

    // Unknown device
    if (!currentDevice) {
      threats.push({
        id: `device_unknown_${Date.now()}`,
        userId: request.userId,
        type: 'DEVICE_ANOMALY',
        severity: 'HIGH',
        title: 'Unknown Device Access',
        description: 'Login from unrecognized device',
        detectedAt: new Date(),
        resolved: false,
        resolvedAt: null,
        metadata: { deviceId: deviceInfo.deviceId, userAgent: deviceInfo.userAgent }
      });
    }

    // Check for jailbroken device
    if (currentDevice?.securityStatus.jailbroken) {
      threats.push({
        id: `device_jailbroken_${Date.now()}`,
        userId: request.userId,
        type: 'DEVICE_ANOMALY',
        severity: 'CRITICAL',
        title: 'Compromised Device Detected',
        description: 'Login from jailbroken/rooted device',
        detectedAt: new Date(),
        resolved: false,
        resolvedAt: null,
        metadata: { deviceId: deviceInfo.deviceId, jailbroken: true }
      });
    }

    return threats;
  }

  /**
   * 🤖 SHOULD TRIGGER AUTO RESPONSE
   */
  private shouldTriggerAutoResponse(threatLevel: ThreatLevel): boolean {
    return threatLevel === 'HIGH' || threatLevel === 'CRITICAL';
  }

  /**
   * 🤖 TRIGGER AUTO RESPONSE
   */
  private async triggerAutoResponse(userId: string, threats: SecurityThreat[]): Promise<boolean> {
    try {
      const criticalThreats = threats.filter(t => t.severity === 'CRITICAL');
      
      for (const threat of criticalThreats) {
        switch (threat.type) {
          case 'SESSION_HIJACKING': {
            // Terminate suspicious session
            const sessionId = threat.metadata.sessionId as string;
            if (sessionId) {
              await this.securityRepository.terminateSession(userId, sessionId);
            }
            break;
          }
            
          case 'DEVICE_ANOMALY': {
            // Revoke device trust if jailbroken
            const deviceId = threat.metadata.deviceId as string;
            if (deviceId && threat.metadata.jailbroken) {
              await this.securityRepository.revokeDeviceTrust(userId, deviceId);
            }
            break;
          }
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Auto-response failed', LogCategory.SECURITY, { userId }, error as Error);
      return false;
    }
  }

  /**
   * 📊 CALCULATE OVERALL THREAT LEVEL
   */
  private calculateOverallThreatLevel(threats: SecurityThreat[]): ThreatLevel {
    if (threats.length === 0) return 'NONE';

    const criticalThreats = threats.filter(t => t.severity === 'CRITICAL').length;
    const highThreats = threats.filter(t => t.severity === 'HIGH').length;
    const mediumThreats = threats.filter(t => t.severity === 'MEDIUM').length;

    if (criticalThreats > 0) return 'CRITICAL';
    if (highThreats > 1) return 'HIGH';
    if (highThreats > 0 || mediumThreats > 2) return 'MEDIUM';
    if (mediumThreats > 0) return 'LOW';

    return 'NONE';
  }

  /**
   * 📊 ANALYZE SESSION THREATS
   */
  private async analyzeSessionThreats(request: ThreatDetectionRequest): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];
    const sessionInfo = request.sessionInfo;

    if (!sessionInfo) return threats;

    // Session hijacking indicators
    if (sessionInfo.anomalies.length > 0) {
      threats.push({
        id: `session_hijacking_${Date.now()}`,
        userId: request.userId,
        type: 'SESSION_HIJACKING',
        severity: 'HIGH',
        title: 'Potential Session Hijacking',
        description: `Session anomalies detected: ${sessionInfo.anomalies.join(', ')}`,
        detectedAt: new Date(),
        resolved: false,
        resolvedAt: null,
        metadata: { sessionId: sessionInfo.sessionId, anomalies: sessionInfo.anomalies }
      });
    }

    return threats;
  }

  /**
   * 💡 GENERATE RECOMMENDATIONS
   */
  private generateRecommendations(threats: SecurityThreat[], threatLevel: ThreatLevel): string[] {
    const recommendations: string[] = [];

    if (threatLevel === 'NONE') {
      recommendations.push('Security status is good - continue monitoring');
      return recommendations;
    }

    // Threat-specific recommendations
    threats.forEach(threat => {
      switch (threat.type) {
        case 'MULTIPLE_FAILED_ATTEMPTS':
          recommendations.push('Consider enabling account lockout after failed attempts');
          break;
        case 'UNUSUAL_LOCATION':
          recommendations.push('Enable location-based security alerts');
          break;
        case 'DEVICE_ANOMALY':
          recommendations.push('Review and revoke access from unknown devices');
          break;
        case 'SESSION_HIJACKING':
          recommendations.push('Terminate suspicious sessions immediately');
          break;
      }
    });

    return [...new Set(recommendations)];
  }

  /**
   * ⚡ GET IMMEDIATE ACTIONS
   */
  private getImmediateActions(threats: SecurityThreat[]): string[] {
    const actions: string[] = [];

    threats.forEach(threat => {
      if (threat.severity === 'CRITICAL') {
        switch (threat.type) {
          case 'DEVICE_ANOMALY':
            actions.push('Terminate all sessions from compromised device');
            break;
          case 'SESSION_HIJACKING':
            actions.push('Terminate suspicious session immediately');
            break;
        }
      }
    });

    return [...new Set(actions)];
  }
}