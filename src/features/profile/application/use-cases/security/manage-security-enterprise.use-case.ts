/**
 * @fileoverview Manage Security Enterprise Use Case - Core Security Business Logic
 * 
 * ✅ APPLICATION LAYER: Security management business rules
 * ✅ ENTERPRISE: Production-ready security operations
 * ✅ CLEAN ARCHITECTURE: Business logic isolation
 */

import { ISecurityRepository } from '../../../domain/interfaces/security/security-repository.interface';
import { LoggerFactory } from '../../../../../core/logging/logger.factory';
import { LogCategory } from '../../../../../core/logging/logger.service.interface';
import { Result } from '../../../../../core/types/result.type';
import {
  SecurityProfile,
  SecurityAction,
  SecurityAssessment,
  SecurityActionType as _SecurityActionType,
  DeviceInfo,
  SessionInfo,
  MFAMethod,
  SecurityLevel,
  ThreatLevel
} from '../../../domain/entities/security/security-profile.entity';

// ==================================================
// INPUT/OUTPUT TYPES
// ==================================================

/**
 * 🎯 MANAGE SECURITY REQUEST
 */
export interface ManageSecurityRequest {
  userId: string;
  action: SecurityManagementAction;
  parameters?: Record<string, any>;
  options?: SecurityOptions;
  context?: SecurityContext;
}

export type SecurityManagementAction =
  | 'GET_SECURITY_PROFILE'
  | 'UPDATE_SECURITY_SETTINGS'
  | 'PERFORM_SECURITY_ASSESSMENT'
  | 'EXECUTE_SECURITY_ACTION'
  | 'MANAGE_DEVICES'
  | 'MANAGE_SESSIONS'
  | 'MANAGE_MFA'
  | 'REVIEW_PRIVACY_SETTINGS'
  | 'GENERATE_SECURITY_REPORT';

/**
 * 🎯 MANAGE SECURITY RESPONSE
 */
export interface ManageSecurityResponse {
  success: boolean;
  data?: {
    securityProfile?: SecurityProfile;
    securityAssessment?: SecurityAssessment;
    securityActions?: SecurityAction[];
    devices?: DeviceInfo[];
    sessions?: SessionInfo[];
    mfaMethods?: MFAMethod[];
    report?: SecurityReport;
  };
  metadata?: {
    operationTime: number;
    cacheUsed: boolean;
    securityLevel: SecurityLevel;
    threatsDetected: number;
    recommendations: string[];
  };
  error?: string;
}

/**
 * ⚙️ SECURITY OPTIONS
 */
export interface SecurityOptions {
  includeAssessment?: boolean;
  includeActions?: boolean;
  includeDevices?: boolean;
  includeSessions?: boolean;
  includeMFA?: boolean;
  enableThreatDetection?: boolean;
  enableRealTimeUpdates?: boolean;
  cacheResults?: boolean;
}

/**
 * 📊 SECURITY CONTEXT
 */
export interface SecurityContext {
  deviceId?: string;
  ipAddress?: string;
  location?: string;
  userAgent?: string;
  sessionId?: string;
  riskScore?: number;
}

/**
 * 📋 SECURITY REPORT
 */
export interface SecurityReport {
  id: string;
  userId: string;
  generatedAt: Date;
  summary: SecuritySummary;
  assessment: SecurityAssessment;
  recommendations: SecurityRecommendation[];
  actions: SecurityAction[];
  complianceStatus: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'UNKNOWN';
  nextReview: Date;
}

export interface SecuritySummary {
  overallScore: number;
  securityLevel: SecurityLevel;
  threatLevel: ThreatLevel;
  criticalIssues: number;
  completedActions: number;
  pendingActions: number;
  devicesSummary: DevicesSummary;
  sessionsSummary: SessionsSummary;
}

export interface DevicesSummary {
  total: number;
  trusted: number;
  active: number;
  suspicious: number;
}

export interface SessionsSummary {
  active: number;
  recent: number;
  suspicious: number;
  averageDuration: number;
}

export interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'AUTHENTICATION' | 'DEVICE' | 'DATA' | 'COMPLIANCE' | 'MONITORING';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  impact: number;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedTime: string;
}

// ==================================================
// MAIN USE CASE
// ==================================================

/**
 * 🛡️ MANAGE SECURITY ENTERPRISE USE CASE
 * 
 * Core business logic for enterprise security management
 */
export class ManageSecurityEnterpriseUseCase {
  private readonly logger = LoggerFactory.createServiceLogger('ManageSecurityUseCase');

  constructor(
    private readonly securityRepository: ISecurityRepository
  ) {}

  /**
   * 🎯 EXECUTE SECURITY MANAGEMENT OPERATION
   */
  async execute(request: ManageSecurityRequest): Promise<Result<ManageSecurityResponse>> {
    const startTime = Date.now();
    
    try {
      this.logger.info('Security management operation started', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: { 
          action: request.action,
          hasOptions: !!request.options,
          hasContext: !!request.context
        }
      });

      // Validate request
      const validationResult = this.validateRequest(request);
      if (!validationResult.success) {
        return Result.error(validationResult.error || 'Invalid request');
      }

      // Execute action based on type
      let response: ManageSecurityResponse;
      
      switch (request.action) {
        case 'GET_SECURITY_PROFILE':
          response = await this.getSecurityProfile(request);
          break;
        case 'UPDATE_SECURITY_SETTINGS':
          response = await this.updateSecuritySettings(request);
          break;
        case 'PERFORM_SECURITY_ASSESSMENT':
          response = await this.performSecurityAssessment(request);
          break;
        case 'EXECUTE_SECURITY_ACTION':
          response = await this.executeSecurityAction(request);
          break;
        case 'MANAGE_DEVICES':
          response = await this.manageDevices(request);
          break;
        case 'MANAGE_SESSIONS':
          response = await this.manageSessions(request);
          break;
        case 'MANAGE_MFA':
          response = await this.manageMFA(request);
          break;
        case 'REVIEW_PRIVACY_SETTINGS':
          response = await this.reviewPrivacySettings(request);
          break;
        case 'GENERATE_SECURITY_REPORT':
          response = await this.generateSecurityReport(request);
          break;
        default:
          return Result.error(`Unsupported action: ${request.action}`);
      }

      // Add operation metadata
      response.metadata = {
        ...response.metadata,
        operationTime: Date.now() - startTime,
        cacheUsed: false,
        securityLevel: response.metadata?.securityLevel || 'MINIMAL',
        threatsDetected: response.metadata?.threatsDetected || 0,
        recommendations: response.metadata?.recommendations || []
      };

      this.logger.info('Security management operation completed', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: {
          action: request.action,
          success: response.success,
          operationTime: response.metadata.operationTime
        }
      });

      return Result.success(response);

    } catch (error) {
      this.logger.error('Security management operation failed', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: { action: request.action }
      }, error as Error);

      return Result.error((error as Error).message);
    }
  }

  // ==================================================
  // SECURITY OPERATIONS
  // ==================================================

  /**
   * 🔍 GET SECURITY PROFILE
   */
  private async getSecurityProfile(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const profileResult = await this.securityRepository.getSecurityProfile(request.userId);
    
    if (!profileResult.success) {
      return {
        success: false,
        error: profileResult.error || 'Failed to get security profile'
      };
    }

    const profile = profileResult.data;
    if (!profile) {
      return {
        success: false,
        error: 'Profile data not available'
      };
    }
    const response: ManageSecurityResponse = {
      success: true,
      data: { securityProfile: profile }
    };

    // Add optional data based on options
    if (request.options?.includeAssessment) {
      const assessmentResult = await this.securityRepository.getSecurityAssessment(request.userId);
      if (assessmentResult.success) {
        response.data!.securityAssessment = assessmentResult.data;
      }
    }

    if (request.options?.includeActions) {
      const actionsResult = await this.securityRepository.getSecurityActions(request.userId);
      if (actionsResult.success) {
        response.data!.securityActions = actionsResult.data;
      }
    }

    if (request.options?.includeDevices) {
      const devicesResult = await this.securityRepository.getUserDevices(request.userId);
      if (devicesResult.success) {
        response.data!.devices = devicesResult.data;
      }
    }

    if (request.options?.includeSessions) {
      const sessionsResult = await this.securityRepository.getActiveSessions(request.userId);
      if (sessionsResult.success) {
        response.data!.sessions = sessionsResult.data;
      }
    }

    if (request.options?.includeMFA) {
      const mfaResult = await this.securityRepository.getMFAMethods(request.userId);
      if (mfaResult.success) {
        response.data!.mfaMethods = mfaResult.data;
      }
    }

    return response;
  }

  /**
   * 🔧 UPDATE SECURITY SETTINGS
   */
  private async updateSecuritySettings(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const updates = request.parameters?.updates as Partial<SecurityProfile>;
    if (!updates) {
      return {
        success: false,
        error: 'No updates provided'
      };
    }

    const updateResult = await this.securityRepository.updateSecurityProfile(request.userId, updates);
    
    if (!updateResult.success) {
      return {
        success: false,
        error: updateResult.error || 'Failed to update security settings'
      };
    }

    // Log security change
    await this.securityRepository.trackSecurityEvent(
      request.userId,
      'SECURITY_PROFILE_UPDATED' as any,
      { updates, context: request.context }
    );

    // Trigger new assessment after changes
    const assessmentResult = await this.securityRepository.recalculateSecurityAssessment(request.userId);

    return {
      success: true,
      data: {
        securityProfile: updateResult.data,
        securityAssessment: assessmentResult.success ? assessmentResult.data : undefined
      }
    };
  }

  /**
   * 📊 PERFORM SECURITY ASSESSMENT
   */
  private async performSecurityAssessment(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const assessmentResult = await this.securityRepository.recalculateSecurityAssessment(request.userId);
    
    if (!assessmentResult.success) {
      return {
        success: false,
        error: assessmentResult.error || 'Failed to perform security assessment'
      };
    }

    const assessment = assessmentResult.data;

    // Get updated security actions based on assessment
    const actionsResult = await this.securityRepository.getSecurityActions(request.userId);

    // Detect threats if enabled
    let threatsDetected = 0;
    if (request.options?.enableThreatDetection) {
      const threatsResult = await this.securityRepository.detectSecurityThreats(request.userId);
      if (threatsResult.success) {
        threatsDetected = threatsResult.data?.length || 0;
      }
    }

    return {
      success: true,
      data: {
        securityAssessment: assessment,
        securityActions: actionsResult.success ? actionsResult.data : []
      },
      metadata: {
        operationTime: 0, // Will be set by main execute method
        cacheUsed: false,
        securityLevel: assessment?.level || 'MINIMAL',
        threatsDetected,
        recommendations: assessment?.recommendations?.map((r: any) => r.title) || []
      }
    };
  }

  /**
   * ⚡ EXECUTE SECURITY ACTION
   */
  private async executeSecurityAction(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const actionId = request.parameters?.actionId as string;
    const actionParams = request.parameters?.actionParams as Record<string, any>;

    if (!actionId) {
      return {
        success: false,
        error: 'Action ID is required'
      };
    }

    const executeResult = await this.securityRepository.executeSecurityAction(
      request.userId,
      actionId,
      actionParams
    );

    if (!executeResult.success) {
      return {
        success: false,
        error: executeResult.error || 'Failed to execute security action'
      };
    }

    // Complete the action
    await this.securityRepository.completeSecurityAction(
      request.userId,
      actionId,
      { executedAt: new Date(), context: request.context }
    );

    // Get updated actions and assessment
    const [actionsResult, assessmentResult] = await Promise.all([
      this.securityRepository.getSecurityActions(request.userId),
      this.securityRepository.recalculateSecurityAssessment(request.userId)
    ]);

    return {
      success: true,
      data: {
        securityActions: actionsResult.success ? actionsResult.data : [],
        securityAssessment: assessmentResult.success ? assessmentResult.data : undefined
      }
    };
  }

  /**
   * 📱 MANAGE DEVICES
   */
  private async manageDevices(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const deviceAction = request.parameters?.deviceAction as string;
    const deviceId = request.parameters?.deviceId as string;

    switch (deviceAction) {
      case 'LIST': {
        const devicesResult = await this.securityRepository.getUserDevices(request.userId);
        return {
          success: devicesResult.success,
          data: devicesResult.success ? { devices: devicesResult.data } : undefined,
          error: devicesResult.success ? undefined : devicesResult.error
        };
      }

      case 'TRUST': {
        if (!deviceId) {
          return { success: false, error: 'Device ID is required' };
        }
        const trustResult = await this.securityRepository.trustDevice(request.userId, deviceId);
        return {
          success: trustResult.success,
          error: trustResult.success ? undefined : trustResult.error
        };
      }

      case 'REVOKE': {
        if (!deviceId) {
          return { success: false, error: 'Device ID is required' };
        }
        const revokeResult = await this.securityRepository.revokeDeviceTrust(request.userId, deviceId);
        return {
          success: revokeResult.success,
          error: revokeResult.success ? undefined : revokeResult.error
        };
      }

      case 'REMOVE': {
        if (!deviceId) {
          return { success: false, error: 'Device ID is required' };
        }
        const removeResult = await this.securityRepository.removeDevice(request.userId, deviceId);
        return {
          success: removeResult.success,
          error: removeResult.success ? undefined : removeResult.error
        };
      }

      default:
        return { success: false, error: `Unsupported device action: ${deviceAction}` };
    }
  }

  /**
   * 📊 MANAGE SESSIONS
   */
  private async manageSessions(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const sessionAction = request.parameters?.sessionAction as string;
    const sessionId = request.parameters?.sessionId as string;

    switch (sessionAction) {
      case 'LIST': {
        const sessionsResult = await this.securityRepository.getActiveSessions(request.userId);
        return {
          success: sessionsResult.success,
          data: sessionsResult.success ? { sessions: sessionsResult.data } : undefined,
          error: sessionsResult.success ? undefined : sessionsResult.error
        };
      }

      case 'TERMINATE': {
        if (!sessionId) {
          return { success: false, error: 'Session ID is required' };
        }
        const terminateResult = await this.securityRepository.terminateSession(request.userId, sessionId);
        return {
          success: terminateResult.success,
          error: terminateResult.success ? undefined : terminateResult.error
        };
      }

      case 'TERMINATE_ALL': {
        const terminateAllResult = await this.securityRepository.terminateAllSessions(
          request.userId,
          request.parameters?.exceptCurrent as boolean
        );
        return {
          success: terminateAllResult.success,
          error: terminateAllResult.success ? undefined : terminateAllResult.error
        };
      }

      default:
        return { success: false, error: `Unsupported session action: ${sessionAction}` };
    }
  }

  /**
   * 🔐 MANAGE MFA
   */
  private async manageMFA(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const mfaAction = request.parameters?.mfaAction as string;

    switch (mfaAction) {
      case 'LIST': {
        const mfaResult = await this.securityRepository.getMFAMethods(request.userId);
        return {
          success: mfaResult.success,
          data: mfaResult.success ? { mfaMethods: mfaResult.data } : undefined,
          error: mfaResult.success ? undefined : mfaResult.error
        };
      }

      case 'ADD': {
        const method = request.parameters?.method as Omit<MFAMethod, 'id' | 'createdAt'>;
        if (!method) {
          return { success: false, error: 'MFA method is required' };
        }
        const addResult = await this.securityRepository.addMFAMethod(request.userId, method);
        return {
          success: addResult.success,
          data: addResult.success ? { mfaMethods: addResult.data ? [addResult.data] : [] } : undefined,
          error: addResult.success ? undefined : addResult.error
        };
      }

      case 'REMOVE': {
        const methodId = request.parameters?.methodId as string;
        if (!methodId) {
          return { success: false, error: 'Method ID is required' };
        }
        const removeResult = await this.securityRepository.removeMFAMethod(request.userId, methodId);
        return {
          success: removeResult.success,
          error: removeResult.success ? undefined : removeResult.error
        };
      }

      case 'VERIFY': {
        const verifyMethodId = request.parameters?.methodId as string;
        const code = request.parameters?.code as string;
        if (!verifyMethodId || !code) {
          return { success: false, error: 'Method ID and code are required' };
        }
        const verifyResult = await this.securityRepository.verifyMFAMethod(request.userId, verifyMethodId, code);
        return {
          success: !!(verifyResult.success && verifyResult.data),
          error: verifyResult.success && verifyResult.data ? undefined : 'Verification failed'
        };
      }

      default:
        return { success: false, error: `Unsupported MFA action: ${mfaAction}` };
    }
  }

  /**
   * 🔒 REVIEW PRIVACY SETTINGS
   */
  private async reviewPrivacySettings(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const profileResult = await this.securityRepository.getSecurityProfile(request.userId);
    
    if (!profileResult.success) {
      return {
        success: false,
        error: profileResult.error || 'Failed to get privacy settings'
      };
    }

    const profile = profileResult.data;
    if (!profile) {
      return {
        success: false,
        error: 'Profile data not available'
      };
    }
    const privacySettings = profile.privacy;

    // If updating privacy settings
    if (request.parameters?.updates) {
      const updates = request.parameters.updates as Partial<SecurityProfile['privacy']>;
      const updateResult = await this.securityRepository.updateSecurityProfile(request.userId, {
        privacy: { ...privacySettings, ...updates }
      });

      if (!updateResult.success) {
        return {
          success: false,
          error: updateResult.error || 'Failed to update privacy settings'
        };
      }

      // Log privacy change
      await this.securityRepository.trackSecurityEvent(
        request.userId,
        'PRIVACY_CONSENT_UPDATED',
        { updates, context: request.context }
      );

      return {
        success: true,
        data: { securityProfile: updateResult.data }
      };
    }

    return {
      success: true,
      data: { securityProfile: profile }
    };
  }

  /**
   * 📋 GENERATE SECURITY REPORT
   */
  private async generateSecurityReport(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    // Get all security data
    const [profileResult, assessmentResult, actionsResult, devicesResult, sessionsResult] = await Promise.all([
      this.securityRepository.getSecurityProfile(request.userId),
      this.securityRepository.getSecurityAssessment(request.userId),
      this.securityRepository.getSecurityActions(request.userId),
      this.securityRepository.getUserDevices(request.userId),
      this.securityRepository.getActiveSessions(request.userId)
    ]);

    if (!profileResult.success || !assessmentResult.success) {
      return {
        success: false,
        error: 'Failed to generate security report: missing data'
      };
    }

    const profile = profileResult.data!;
    const assessment = assessmentResult.data!;
    const actions = actionsResult.success ? actionsResult.data || [] : [];
    const devices = devicesResult.success ? devicesResult.data || [] : [];
    const sessions = sessionsResult.success ? sessionsResult.data || [] : [];

    // Build comprehensive report
    const report: SecurityReport = {
      id: `security_report_${Date.now()}`,
      userId: request.userId,
      generatedAt: new Date(),
      summary: {
        overallScore: assessment.score,
        securityLevel: assessment.level,
        threatLevel: profile.threatLevel,
        criticalIssues: assessment.criticalIssues.length,
        completedActions: actions.filter(a => a.completed).length,
        pendingActions: actions.filter(a => !a.completed && !a.dismissed).length,
        devicesSummary: {
          total: devices.length,
          trusted: devices.filter(d => d.trusted).length,
          active: devices.filter(d => Date.now() - d.lastActivity.getTime() < 24 * 60 * 60 * 1000).length,
          suspicious: devices.filter(d => d.securityStatus.jailbroken || !d.securityStatus.screenLockEnabled).length
        },
        sessionsSummary: {
          active: sessions.filter(s => s.active).length,
          recent: sessions.filter(s => Date.now() - s.lastActivity.getTime() < 7 * 24 * 60 * 60 * 1000).length,
          suspicious: sessions.filter(s => s.riskScore > 70).length,
          averageDuration: sessions.reduce((sum, s) => sum + s.duration, 0) / (sessions.length || 1)
        }
      },
      assessment,
      recommendations: assessment.recommendations,
      actions,
      complianceStatus: profile.complianceStatus,
      nextReview: assessment.nextAssessment
    };

    return {
      success: true,
      data: { report }
    };
  }

  // ==================================================
  // VALIDATION & HELPERS
  // ==================================================

  /**
   * ✅ VALIDATE REQUEST
   */
  private validateRequest(request: ManageSecurityRequest): Result<void> {
    const { userId, action } = request;
    const actionId = request.parameters?.actionId as string;
    const deviceAction = request.parameters?.deviceAction as string;
    const sessionAction = request.parameters?.sessionAction as string;
    const mfaAction = request.parameters?.mfaAction as string;

    if (!userId) {
      return Result.error('User ID is required');
    }
    if (!action) {
      return Result.error('Action is required');
    }

    // Check specific action requirements
    if (action === 'EXECUTE_SECURITY_ACTION' && !actionId) {
      return Result.error('Action ID is required for EXECUTE_SECURITY_ACTION');
    }

    if (action === 'MANAGE_DEVICES' && !deviceAction) {
      return Result.error('Device action is required for MANAGE_DEVICES');
    }

    if (action === 'MANAGE_SESSIONS' && !sessionAction) {
      return Result.error('Session action is required for MANAGE_SESSIONS');
    }

    if (action === 'MANAGE_MFA' && !mfaAction) {
      return Result.error('MFA action is required for MANAGE_MFA');
    }
    
    // All validation passed
    return Result.success(undefined);
  }
}