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
import { Result, ResultFactory } from '../../../../../core/types/result.type';
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
      if (!validationResult.isSuccess) {
        return ResultFactory.failure(new Error(validationResult.error || 'Invalid request'));
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
          return ResultFactory.failure(new Error(`Unsupported action: ${request.action}`));
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

      return ResultFactory.success(response);

    } catch (error) {
      this.logger.error('Security management operation failed', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: { action: request.action }
      }, error as Error);

      return ResultFactory.failure(error as Error);
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
    
    if (!profileResult.isSuccess) {
      return {
        success: false,
        error: profileResult.error || 'Failed to get security profile'
      };
    }

    const profile = profileResult.value;
    const response: ManageSecurityResponse = {
      success: true,
      data: { securityProfile: profile }
    };

    // Add optional data based on options
    if (request.options?.includeAssessment) {
      const assessmentResult = await this.securityRepository.getSecurityAssessment(request.userId);
      if (assessmentResult.isSuccess) {
        response.data!.securityAssessment = assessmentResult.value;
      }
    }

    if (request.options?.includeActions) {
      const actionsResult = await this.securityRepository.getSecurityActions(request.userId);
      if (actionsResult.isSuccess) {
        response.data!.securityActions = actionsResult.value;
      }
    }

    if (request.options?.includeDevices) {
      const devicesResult = await this.securityRepository.getUserDevices(request.userId);
      if (devicesResult.isSuccess) {
        response.data!.devices = devicesResult.value;
      }
    }

    if (request.options?.includeSessions) {
      const sessionsResult = await this.securityRepository.getActiveSessions(request.userId);
      if (sessionsResult.isSuccess) {
        response.data!.sessions = sessionsResult.value;
      }
    }

    if (request.options?.includeMFA) {
      const mfaResult = await this.securityRepository.getMFAMethods(request.userId);
      if (mfaResult.isSuccess) {
        response.data!.mfaMethods = mfaResult.value;
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
    
    if (!updateResult.isSuccess) {
      return {
        success: false,
        error: updateResult.error || 'Failed to update security settings'
      };
    }

    // Log security change
    await this.securityRepository.trackSecurityEvent(
      request.userId,
      'SECURITY_SETTINGS_UPDATED',
      { updates, context: request.context }
    );

    // Trigger new assessment after changes
    const assessmentResult = await this.securityRepository.recalculateSecurityAssessment(request.userId);

    return {
      success: true,
      data: {
        securityProfile: updateResult.value,
        securityAssessment: assessmentResult.isSuccess ? assessmentResult.value : undefined
      }
    };
  }

  /**
   * 📊 PERFORM SECURITY ASSESSMENT
   */
  private async performSecurityAssessment(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const assessmentResult = await this.securityRepository.recalculateSecurityAssessment(request.userId);
    
    if (!assessmentResult.isSuccess) {
      return {
        success: false,
        error: assessmentResult.error || 'Failed to perform security assessment'
      };
    }

    const assessment = assessmentResult.value;

    // Get updated security actions based on assessment
    const actionsResult = await this.securityRepository.getSecurityActions(request.userId);

    // Detect threats if enabled
    let threatsDetected = 0;
    if (request.options?.enableThreatDetection) {
      const threatsResult = await this.securityRepository.detectSecurityThreats(request.userId);
      if (threatsResult.isSuccess) {
        threatsDetected = threatsResult.value.length;
      }
    }

    return {
      success: true,
      data: {
        securityAssessment: assessment,
        securityActions: actionsResult.isSuccess ? actionsResult.value : []
      },
      metadata: {
        operationTime: 0, // Will be set by main execute method
        cacheUsed: false,
        securityLevel: assessment.level,
        threatsDetected,
        recommendations: assessment.recommendations.map(r => r.title)
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

    if (!executeResult.isSuccess) {
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
        securityActions: actionsResult.isSuccess ? actionsResult.value : [],
        securityAssessment: assessmentResult.isSuccess ? assessmentResult.value : undefined
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
      case 'LIST':
        const devicesResult = await this.securityRepository.getUserDevices(request.userId);
        return {
          success: devicesResult.isSuccess,
          data: devicesResult.isSuccess ? { devices: devicesResult.value } : undefined,
          error: devicesResult.isSuccess ? undefined : devicesResult.error
        };

      case 'TRUST':
        if (!deviceId) {
          return { success: false, error: 'Device ID is required' };
        }
        const trustResult = await this.securityRepository.trustDevice(request.userId, deviceId);
        return {
          success: trustResult.isSuccess,
          error: trustResult.isSuccess ? undefined : trustResult.error
        };

      case 'REVOKE':
        if (!deviceId) {
          return { success: false, error: 'Device ID is required' };
        }
        const revokeResult = await this.securityRepository.revokeDeviceTrust(request.userId, deviceId);
        return {
          success: revokeResult.isSuccess,
          error: revokeResult.isSuccess ? undefined : revokeResult.error
        };

      case 'REMOVE':
        if (!deviceId) {
          return { success: false, error: 'Device ID is required' };
        }
        const removeResult = await this.securityRepository.removeDevice(request.userId, deviceId);
        return {
          success: removeResult.isSuccess,
          error: removeResult.isSuccess ? undefined : removeResult.error
        };

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
      case 'LIST':
        const sessionsResult = await this.securityRepository.getActiveSessions(request.userId);
        return {
          success: sessionsResult.isSuccess,
          data: sessionsResult.isSuccess ? { sessions: sessionsResult.value } : undefined,
          error: sessionsResult.isSuccess ? undefined : sessionsResult.error
        };

      case 'TERMINATE':
        if (!sessionId) {
          return { success: false, error: 'Session ID is required' };
        }
        const terminateResult = await this.securityRepository.terminateSession(request.userId, sessionId);
        return {
          success: terminateResult.isSuccess,
          error: terminateResult.isSuccess ? undefined : terminateResult.error
        };

      case 'TERMINATE_ALL':
        const terminateAllResult = await this.securityRepository.terminateAllSessions(
          request.userId,
          request.parameters?.exceptCurrent as boolean
        );
        return {
          success: terminateAllResult.isSuccess,
          error: terminateAllResult.isSuccess ? undefined : terminateAllResult.error
        };

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
      case 'LIST':
        const mfaResult = await this.securityRepository.getMFAMethods(request.userId);
        return {
          success: mfaResult.isSuccess,
          data: mfaResult.isSuccess ? { mfaMethods: mfaResult.value } : undefined,
          error: mfaResult.isSuccess ? undefined : mfaResult.error
        };

      case 'ADD':
        const method = request.parameters?.method as Omit<MFAMethod, 'id' | 'createdAt'>;
        if (!method) {
          return { success: false, error: 'MFA method is required' };
        }
        const addResult = await this.securityRepository.addMFAMethod(request.userId, method);
        return {
          success: addResult.isSuccess,
          data: addResult.isSuccess ? { mfaMethods: [addResult.value] } : undefined,
          error: addResult.isSuccess ? undefined : addResult.error
        };

      case 'REMOVE':
        const methodId = request.parameters?.methodId as string;
        if (!methodId) {
          return { success: false, error: 'Method ID is required' };
        }
        const removeResult = await this.securityRepository.removeMFAMethod(request.userId, methodId);
        return {
          success: removeResult.isSuccess,
          error: removeResult.isSuccess ? undefined : removeResult.error
        };

      case 'VERIFY':
        const verifyMethodId = request.parameters?.methodId as string;
        const code = request.parameters?.code as string;
        if (!verifyMethodId || !code) {
          return { success: false, error: 'Method ID and code are required' };
        }
        const verifyResult = await this.securityRepository.verifyMFAMethod(request.userId, verifyMethodId, code);
        return {
          success: verifyResult.isSuccess && verifyResult.value,
          error: verifyResult.isSuccess && verifyResult.value ? undefined : 'Verification failed'
        };

      default:
        return { success: false, error: `Unsupported MFA action: ${mfaAction}` };
    }
  }

  /**
   * 🔒 REVIEW PRIVACY SETTINGS
   */
  private async reviewPrivacySettings(request: ManageSecurityRequest): Promise<ManageSecurityResponse> {
    const profileResult = await this.securityRepository.getSecurityProfile(request.userId);
    
    if (!profileResult.isSuccess) {
      return {
        success: false,
        error: profileResult.error || 'Failed to get privacy settings'
      };
    }

    const profile = profileResult.value;
    const privacySettings = profile.privacy;

    // If updating privacy settings
    if (request.parameters?.updates) {
      const updates = request.parameters.updates as Partial<SecurityProfile['privacy']>;
      const updateResult = await this.securityRepository.updateSecurityProfile(request.userId, {
        privacy: { ...privacySettings, ...updates }
      });

      if (!updateResult.isSuccess) {
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
        data: { securityProfile: updateResult.value }
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

    if (!profileResult.isSuccess || !assessmentResult.isSuccess) {
      return {
        success: false,
        error: 'Failed to generate security report: missing data'
      };
    }

    const profile = profileResult.value;
    const assessment = assessmentResult.value;
    const actions = actionsResult.isSuccess ? actionsResult.value : [];
    const devices = devicesResult.isSuccess ? devicesResult.value : [];
    const sessions = sessionsResult.isSuccess ? sessionsResult.value : [];

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
    if (!request.userId) {
      return ResultFactory.failure(new Error('User ID is required'));
    }

    if (!request.action) {
      return ResultFactory.failure(new Error('Action is required'));
    }

    // Validate action-specific parameters
    switch (request.action) {
      case 'EXECUTE_SECURITY_ACTION':
        if (!request.parameters?.actionId) {
          return ResultFactory.failure(new Error('Action ID is required for EXECUTE_SECURITY_ACTION'));
        }

      case 'MANAGE_DEVICES':
        if (!request.parameters?.deviceAction) {
          return ResultFactory.failure(new Error('Device action is required for MANAGE_DEVICES'));
        }
        break;

      case 'MANAGE_SESSIONS':
        if (!request.parameters?.sessionAction) {
          return ResultFactory.failure(new Error('Session action is required for MANAGE_SESSIONS'));
        }
        break;

      case 'MANAGE_MFA':
        if (!request.parameters?.mfaAction) {
          return ResultFactory.failure(new Error('MFA action is required for MANAGE_MFA'));
        }
        break;
    }

    return ResultFactory.success(undefined);
  }
}