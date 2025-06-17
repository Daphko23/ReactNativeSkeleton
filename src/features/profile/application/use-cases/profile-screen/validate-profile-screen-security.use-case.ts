/**
 * ValidateProfileScreenSecurityUseCase - Enterprise Security Validation
 */

import { Result } from '@core/types/result.type';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import {
  ProfileScreenConfiguration,
  ProfileSecurityLevel
} from '../../../domain/entities/profile-screen-config.entity';

const logger = LoggerFactory.createServiceLogger('ValidateProfileScreenSecurityUseCase');

export interface SecurityValidationRequest {
  userId: string;
  organizationId: string;
  action: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  deviceInfo: {
    deviceId: string;
    platform: string;
    appVersion: string;
    ipAddress: string;
    userAgent: string;
  };
  sessionInfo: {
    sessionId: string;
    startTime: Date;
    lastActivity: Date;
    authLevel: ProfileSecurityLevel;
  };
}

export interface SecurityValidationResponse {
  allowed: boolean;
  securityLevel: ProfileSecurityLevel;
  reasons: string[];
  requiredActions: string[];
  auditEntryId: string;
  riskScore: number;
  recommendations: string[];
}

export interface PermissionCheckRequest {
  userId: string;
  organizationId: string;
  permissions: string[];
  context?: Record<string, any>;
}

export interface PermissionCheckResponse {
  grantedPermissions: string[];
  deniedPermissions: string[];
  conditionalPermissions: { permission: string; condition: string }[];
  effectiveLevel: ProfileSecurityLevel;
}

export interface AuditLogRequest {
  userId: string;
  action: string;
  result: 'success' | 'failure' | 'blocked';
  details: Record<string, any>;
  securityLevel: ProfileSecurityLevel;
  riskFactors?: string[];
}

export class ValidateProfileScreenSecurityUseCase {
  private auditLog: Map<string, any> = new Map();
  private securityCache: Map<string, any> = new Map();

  constructor() {
    logger.info('ValidateProfileScreenSecurityUseCase initialized', LogCategory.BUSINESS);
  }

  async validateSecurity(
    request: SecurityValidationRequest
  ): Promise<Result<SecurityValidationResponse, string>> {
    try {
      logger.info('Validating profile screen security', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: {
          action: request.action,
          securityLevel: request.sessionInfo.authLevel
        }
      });

      const authorizationResult = await this.checkAuthorization(request);
      const riskScore = await this.calculateRiskScore(request);
      const complianceCheck = await this.validateCompliance(request);
      
      const allowed = authorizationResult.allowed && 
                     riskScore < 80 && 
                     complianceCheck.compliant;

      const recommendations = this.generateSecurityRecommendations(
        authorizationResult, riskScore, complianceCheck
      );

      const auditEntryResult = await this.createAuditEntry({
        userId: request.userId,
        action: request.action,
        result: allowed ? 'success' : 'blocked',
        details: {
          riskScore,
          authorizationResult,
          complianceCheck,
          deviceInfo: request.deviceInfo
        },
        securityLevel: request.sessionInfo.authLevel,
        riskFactors: this.identifyRiskFactors(request, riskScore)
      });
      
      const auditEntryId: string = auditEntryResult.success ? (auditEntryResult.data || 'audit_failed') : 'audit_failed';

      const response: SecurityValidationResponse = {
        allowed,
        securityLevel: request.sessionInfo.authLevel,
        reasons: allowed ? ['Authorization successful'] : authorizationResult.reasons,
        requiredActions: allowed ? [] : this.getRequiredActions(authorizationResult, riskScore),
        auditEntryId,
        riskScore,
        recommendations
      };

      return Result.success(response);
    } catch (error) {
      logger.error('Failed to validate security', LogCategory.BUSINESS, 
        { userId: request.userId }, error as Error);
      return Result.error(`Security validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkPermissions(
    request: PermissionCheckRequest
  ): Promise<Result<PermissionCheckResponse, string>> {
    try {
      const config = await this.getUserConfiguration(request.userId, request.organizationId);
      
      const grantedPermissions: string[] = [];
      const deniedPermissions: string[] = [];
      const conditionalPermissions: { permission: string; condition: string }[] = [];

      for (const permission of request.permissions) {
        const permissionResult = this.evaluatePermission(permission, config, request.context);
        
        if (permissionResult.granted) {
          grantedPermissions.push(permission);
        } else if (permissionResult.conditional) {
          conditionalPermissions.push({
            permission,
            condition: permissionResult.condition || 'Unknown condition'
          });
        } else {
          deniedPermissions.push(permission);
        }
      }

      const response: PermissionCheckResponse = {
        grantedPermissions,
        deniedPermissions,
        conditionalPermissions,
        effectiveLevel: config.securitySettings.requiredSecurityLevel
      };

      return Result.success(response);
    } catch (error) {
      return Result.error(`Permission check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createAuditEntry(request: AuditLogRequest): Promise<Result<string, string>> {
    try {
      const auditEntryId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const auditEntry = {
        id: auditEntryId,
        userId: request.userId,
        action: request.action,
        result: request.result,
        timestamp: new Date(),
        details: request.details,
        securityLevel: request.securityLevel,
        riskFactors: request.riskFactors || [],
        metadata: {
          source: 'profile_screen',
          version: '1.0.0'
        }
      };

      this.auditLog.set(auditEntryId, auditEntry);

      return Result.success(auditEntryId);
    } catch (error) {
      return Result.error(`Audit entry creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkAuthorization(request: SecurityValidationRequest): Promise<{
    allowed: boolean;
    reasons: string[];
    requiredLevel: ProfileSecurityLevel;
  }> {
    const reasons: string[] = [];
    let allowed = true;

    const sessionAge = Date.now() - request.sessionInfo.startTime.getTime();
    const maxSessionAge = 8 * 60 * 60 * 1000;
    
    if (sessionAge > maxSessionAge) {
      allowed = false;
      reasons.push('Session expired - re-authentication required');
    }

    const inactivityTime = Date.now() - request.sessionInfo.lastActivity.getTime();
    const maxInactivity = 30 * 60 * 1000;
    
    if (inactivityTime > maxInactivity) {
      allowed = false;
      reasons.push('Session inactive for too long');
    }

    const actionRequirements = this.getActionSecurityRequirements(request.action);
    if (request.sessionInfo.authLevel !== actionRequirements.requiredLevel) {
      reasons.push(`Action requires ${actionRequirements.requiredLevel} level`);
    }

    return {
      allowed,
      reasons: allowed ? ['Authorization successful'] : reasons,
      requiredLevel: actionRequirements.requiredLevel
    };
  }

  private async calculateRiskScore(request: SecurityValidationRequest): Promise<number> {
    let riskScore = 0;

    if (request.deviceInfo.platform === 'unknown') riskScore += 20;
    if (!request.deviceInfo.appVersion.startsWith('1.')) riskScore += 10;

    const sessionAge = Date.now() - request.sessionInfo.startTime.getTime();
    if (sessionAge > 4 * 60 * 60 * 1000) riskScore += 15;

    if (request.deviceInfo.ipAddress.startsWith('10.')) riskScore += 5;

    const actionRisk = this.getActionRiskScore(request.action);
    riskScore += actionRisk;

    return Math.min(100, riskScore);
  }

  private async validateCompliance(request: SecurityValidationRequest): Promise<{
    compliant: boolean;
    violations: string[];
  }> {
    const violations: string[] = [];

    if (request.action.includes('export') && !request.metadata?.gdprConsent) {
      violations.push('GDPR consent required for data export');
    }

    if (request.action.includes('delete') && !request.metadata?.retentionPolicy) {
      violations.push('Data retention policy validation required');
    }

    return {
      compliant: violations.length === 0,
      violations
    };
  }

  private generateSecurityRecommendations(
    authResult: any, 
    riskScore: number, 
    complianceCheck: any
  ): string[] {
    const recommendations: string[] = [];

    if (riskScore > 60) {
      recommendations.push('Consider requiring additional authentication');
    }

    if (!complianceCheck.compliant) {
      recommendations.push('Ensure compliance requirements are met before proceeding');
    }

    if (authResult.reasons.length > 1) {
      recommendations.push('Review and update security policies');
    }

    return recommendations;
  }

  private identifyRiskFactors(request: SecurityValidationRequest, riskScore: number): string[] {
    const factors: string[] = [];

    if (riskScore > 50) factors.push('elevated_risk_score');
    if (!request.deviceInfo.deviceId) factors.push('unknown_device');
    if (request.sessionInfo.authLevel === ProfileSecurityLevel.PUBLIC) factors.push('low_auth_level');

    return factors;
  }

  private getRequiredActions(authResult: any, riskScore: number): string[] {
    const actions: string[] = [];

    if (riskScore > 70) {
      actions.push('additional_authentication_required');
    }

    if (authResult.reasons.includes('Session expired')) {
      actions.push('re_authentication_required');
    }

    return actions;
  }

  private async getUserConfiguration(userId: string, organizationId: string): Promise<ProfileScreenConfiguration> {
    return new ProfileScreenConfiguration({
      userId,
      organizationId: organizationId || 'default',
      version: '1.0.0'
    });
  }

  private evaluatePermission(permission: string, config: ProfileScreenConfiguration, context?: any): {
    granted: boolean;
    conditional?: boolean;
    condition?: string;
  } {
    const permissionMap: Record<string, keyof typeof config.permissions> = {
      'edit_profile': 'canEdit',
      'share_profile': 'canShare',
      'export_profile': 'canExport',
      'delete_avatar': 'canDeleteAvatar',
      'view_analytics': 'canViewAnalytics',
      'access_privacy_settings': 'canAccessPrivacySettings',
      'manage_custom_fields': 'canManageCustomFields'
    };

    const configKey = permissionMap[permission];
    if (configKey && config.permissions[configKey]) {
      return { granted: true };
    }

    if (permission === 'export_profile' && context?.gdprConsent) {
      return { granted: true, conditional: true, condition: 'GDPR consent provided' };
    }

    return { granted: false };
  }

  private getActionSecurityRequirements(action: string): {
    requiredLevel: ProfileSecurityLevel;
    additionalChecks: string[];
  } {
    const requirements: Record<string, any> = {
      'edit_profile': { requiredLevel: ProfileSecurityLevel.AUTHENTICATED, additionalChecks: [] },
      'delete_avatar': { requiredLevel: ProfileSecurityLevel.AUTHENTICATED, additionalChecks: [] },
      'export_profile': { requiredLevel: ProfileSecurityLevel.VERIFIED, additionalChecks: ['gdpr_consent'] },
      'view_analytics': { requiredLevel: ProfileSecurityLevel.VERIFIED, additionalChecks: [] },
      'admin_action': { requiredLevel: ProfileSecurityLevel.ADMIN, additionalChecks: ['admin_approval'] }
    };

    return requirements[action] || { 
      requiredLevel: ProfileSecurityLevel.AUTHENTICATED, 
      additionalChecks: [] 
    };
  }

  private getActionRiskScore(action: string): number {
    const riskScores: Record<string, number> = {
      'view_profile': 0,
      'edit_profile': 10,
      'delete_avatar': 15,
      'share_profile': 20,
      'export_profile': 30,
      'admin_action': 40
    };

    return riskScores[action] || 5;
  }
}

export const createValidateProfileScreenSecurityUseCase = (): ValidateProfileScreenSecurityUseCase => {
  return new ValidateProfileScreenSecurityUseCase();
};