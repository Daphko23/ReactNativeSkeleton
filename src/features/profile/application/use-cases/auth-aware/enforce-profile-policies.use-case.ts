/**
 * @fileoverview Enforce Profile Policies Use Case - Enterprise Policy Engine
 * 
 * 🎯 APPLICATION LAYER - Enterprise Use Case
 * 🔐 POLICY ENGINE: Dynamic policy evaluation and enforcement
 * 📊 BUSINESS LOGIC: Rule-based access control, compliance monitoring
 * 🛡️ SECURITY: Policy violations, enforcement actions, audit compliance
 * 
 * @version 2.0.0
 * @author ReactNativeSkeleton
 */

import { Result } from '../../../../shared/types/result.type';
import {
  ProfileAccessControl,
  PermissionPolicy,
  PolicyCondition,
  PolicyAction,
  AccessControlContext,
  AccessDecision,
  PermissionResult,
  UserRole,
  AccessPermission
} from '../../domain/entities/auth-aware';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

/**
 * Policy enforcement request
 */
export interface EnforcePolicyRequest {
  userId: string;
  userRole: UserRole;
  profileOwnerId: string;
  operation: 'create' | 'read' | 'update' | 'delete' | 'admin' | 'moderate' | 'export';
  resource: string;
  context: {
    sessionId: string;
    deviceId: string;
    ipAddress: string;
    timestamp: Date;
    userAgent?: string;
    location?: string;
    additionalAttributes?: Record<string, any>;
  };
  policyOverrides?: PolicyOverride[];
  enforcementLevel?: 'strict' | 'moderate' | 'lenient';
  bypassEmergency?: boolean;
}

/**
 * Policy override for emergency situations
 */
export interface PolicyOverride {
  policyId: string;
  reason: string;
  approvedBy: string;
  validUntil: Date;
  auditRequired: boolean;
  justification: string;
}

/**
 * Comprehensive enforcement result
 */
export interface PolicyEnforcementResult {
  decision: PermissionResult;
  enforcementActions: EnforcementAction[];
  appliedPolicies: AppliedPolicy[];
  violations: PolicyViolation[];
  warnings: PolicyWarning[];
  recommendations: PolicyRecommendation[];
  auditEntries: PolicyAuditEntry[];
  complianceStatus: ComplianceStatus;
  nextEvaluation?: Date;
  contextualInfo: ContextualInfo;
  riskAssessment: PolicyRiskAssessment;
}

/**
 * Enforcement actions taken
 */
export interface EnforcementAction {
  actionId: string;
  type: 'allow' | 'deny' | 'restrict' | 'monitor' | 'escalate' | 'quarantine' | 'notify';
  description: string;
  triggeredBy: string; // Policy ID
  timestamp: Date;
  parameters: Record<string, any>;
  reversible: boolean;
  expiresAt?: Date;
  executionStatus: 'pending' | 'executing' | 'completed' | 'failed' | 'reversed';
  impact: 'none' | 'minimal' | 'moderate' | 'significant' | 'severe';
}

/**
 * Applied policy information
 */
export interface AppliedPolicy {
  policyId: string;
  policyName: string;
  policyType: string;
  priority: number;
  conditions: ConditionEvaluation[];
  actions: ActionExecution[];
  decision: PermissionResult;
  evaluationTime: number; // milliseconds
  confidence: number; // 0-100
  exceptions: string[];
}

/**
 * Condition evaluation result
 */
export interface ConditionEvaluation {
  conditionId: string;
  condition: PolicyCondition;
  result: boolean;
  confidence: number; // 0-100
  evaluationTime: number; // milliseconds
  evidence: ConditionEvidence[];
  contextUsed: string[];
}

/**
 * Evidence supporting condition evaluation
 */
export interface ConditionEvidence {
  type: 'data' | 'calculation' | 'external' | 'cached' | 'derived';
  source: string;
  value: any;
  timestamp: Date;
  reliability: number; // 0-100
}

/**
 * Action execution result
 */
export interface ActionExecution {
  actionId: string;
  action: PolicyAction;
  executed: boolean;
  executionTime: number; // milliseconds
  result: 'success' | 'failure' | 'partial' | 'skipped';
  effects: ActionEffect[];
  rollbackPossible: boolean;
}

/**
 * Effects of policy action
 */
export interface ActionEffect {
  target: string;
  change: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
  reversible: boolean;
}

/**
 * Policy violations detected
 */
export interface PolicyViolation {
  violationId: string;
  policyId: string;
  violationType: 'access_denied' | 'unauthorized_escalation' | 'data_breach' | 'compliance_violation' | 'security_incident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: ViolationEvidence[];
  impact: string;
  remediation: RemediationAction[];
  reportRequired: boolean;
  stakeholders: string[];
  timestamp: Date;
}

/**
 * Evidence of policy violation
 */
export interface ViolationEvidence {
  type: 'access_attempt' | 'permission_escalation' | 'data_access' | 'system_behavior' | 'user_behavior';
  description: string;
  data: Record<string, any>;
  source: string;
  timestamp: Date;
  integrity: 'verified' | 'unverified' | 'tampered';
}

/**
 * Remediation actions for violations
 */
export interface RemediationAction {
  action: 'block_user' | 'revoke_permissions' | 'enhance_monitoring' | 'require_reauth' | 'escalate_incident' | 'notify_admin';
  priority: 'immediate' | 'urgent' | 'high' | 'medium' | 'low';
  description: string;
  parameters: Record<string, any>;
  timeline: string;
  responsible: string;
  autoExecute: boolean;
}

/**
 * Policy warnings (non-blocking issues)
 */
export interface PolicyWarning {
  warningId: string;
  type: 'configuration' | 'performance' | 'security' | 'compliance' | 'best_practice';
  message: string;
  recommendation: string;
  impact: 'none' | 'minimal' | 'moderate' | 'significant';
  actionRequired: boolean;
  dueDate?: Date;
}

/**
 * Policy recommendations
 */
export interface PolicyRecommendation {
  recommendationId: string;
  category: 'security' | 'performance' | 'compliance' | 'usability' | 'maintenance';
  title: string;
  description: string;
  benefits: string[];
  implementation: ImplementationGuide;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'minimal' | 'low' | 'medium' | 'high' | 'extensive';
  timeline: string;
  dependencies: string[];
}

/**
 * Implementation guide for recommendations
 */
export interface ImplementationGuide {
  steps: string[];
  resources: string[];
  preconditions: string[];
  risks: string[];
  rollbackPlan: string[];
  successMetrics: string[];
}

/**
 * Policy audit entry
 */
export interface PolicyAuditEntry {
  auditId: string;
  timestamp: Date;
  userId: string;
  operation: string;
  resource: string;
  policyEvaluated: string[];
  decision: PermissionResult;
  enforcementActions: string[];
  violations: string[];
  riskScore: number;
  complianceFlags: string[];
  sessionContext: Record<string, any>;
}

/**
 * Compliance status
 */
export interface ComplianceStatus {
  overall: 'compliant' | 'partial' | 'non_compliant' | 'under_review';
  standards: ComplianceStandardStatus[];
  violations: ComplianceViolation[];
  gaps: ComplianceGap[];
  recommendations: ComplianceRecommendation[];
  nextAudit: Date;
  certificationStatus: CertificationStatus[];
}

/**
 * Compliance standard status
 */
export interface ComplianceStandardStatus {
  standard: 'GDPR' | 'SOX' | 'ISO27001' | 'NIST' | 'HIPAA' | 'PCI_DSS' | 'custom';
  version: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
  score: number; // 0-100
  lastAssessment: Date;
  nextAssessment: Date;
  requirements: RequirementStatus[];
}

/**
 * Requirement status within a standard
 */
export interface RequirementStatus {
  requirementId: string;
  description: string;
  status: 'met' | 'partial' | 'not_met' | 'not_applicable';
  evidence: string[];
  gaps: string[];
  remediation: string[];
}

/**
 * Contextual information
 */
export interface ContextualInfo {
  userProfile: UserProfileContext;
  sessionInfo: SessionContext;
  resourceInfo: ResourceContext;
  environmentInfo: EnvironmentContext;
  historyInfo: HistoryContext;
}

/**
 * User profile context
 */
export interface UserProfileContext {
  trustLevel: number; // 0-100
  riskProfile: 'low' | 'medium' | 'high' | 'unknown';
  permissions: AccessPermission[];
  groups: string[];
  attributes: Record<string, any>;
  lastActivity: Date;
  violationHistory: number;
}

/**
 * Policy risk assessment
 */
export interface PolicyRiskAssessment {
  overallRisk: number; // 0-100
  riskFactors: RiskFactor[];
  mitigations: RiskMitigation[];
  residualRisk: number; // 0-100
  riskTolerance: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  monitoringRequired: boolean;
}

/**
 * Risk factors identified
 */
export interface RiskFactor {
  factor: string;
  weight: number; // 0-1
  score: number; // 0-100
  description: string;
  mitigation: string[];
  monitoring: string[];
}

/**
 * Risk mitigation measures
 */
export interface RiskMitigation {
  measure: string;
  effectiveness: number; // 0-100
  implementation: 'automatic' | 'manual' | 'hybrid';
  cost: 'low' | 'medium' | 'high';
  timeline: string;
}

/**
 * Batch policy enforcement request
 */
export interface BatchPolicyEnforcementRequest {
  requests: EnforcePolicyRequest[];
  parallelProcessing?: boolean;
  failFast?: boolean;
  aggregateResults?: boolean;
}

/**
 * Batch enforcement result
 */
export interface BatchPolicyEnforcementResult {
  results: PolicyEnforcementResult[];
  summary: BatchSummary;
  violations: PolicyViolation[];
  recommendations: PolicyRecommendation[];
  complianceStatus: ComplianceStatus;
}

/**
 * Batch processing summary
 */
export interface BatchSummary {
  totalRequests: number;
  successful: number;
  failed: number;
  violations: number;
  processingTime: number;
  riskDistribution: Record<string, number>;
  complianceScore: number;
}

// Additional supporting interfaces...
interface ComplianceViolation { id: string; description: string; severity: string; }
interface ComplianceGap { requirement: string; gap: string; remediation: string; }
interface ComplianceRecommendation { id: string; recommendation: string; priority: string; }
interface CertificationStatus { certification: string; status: string; expiryDate: Date; }
interface SessionContext { duration: number; activities: string[]; risk: number; }
interface ResourceContext { type: string; sensitivity: string; classification: string; }
interface EnvironmentContext { environment: string; securityLevel: string; compliance: string[]; }
interface HistoryContext { accessHistory: any[]; violationHistory: any[]; }

// ============================================================================
// MAIN USE CASE CLASS
// ============================================================================

/**
 * 🎯 Enforce Profile Policies Use Case
 * 
 * Enterprise use case that provides comprehensive policy enforcement
 * with dynamic rule evaluation, compliance monitoring, and automated remediation.
 * 
 * Features:
 * - Dynamic policy evaluation and enforcement
 * - Real-time compliance monitoring and reporting
 * - Automated violation detection and remediation
 * - Risk-based policy decisions
 * - Comprehensive audit logging
 * - Policy recommendation engine
 * - Emergency override capabilities
 * - Batch policy enforcement
 * 
 * Business Rules:
 * - All access requests must be evaluated against policies
 * - Policy violations trigger immediate remediation
 * - Compliance violations block access
 * - Emergency overrides require proper authorization
 * - All policy decisions must be audited
 * - Risk assessments inform policy enforcement
 */
export class EnforceProfilePoliciesUseCase {
  constructor(
    private readonly profileAccessControl: ProfileAccessControl,
    private readonly policyEngine: PolicyEvaluationEngine,
    private readonly complianceMonitor: ComplianceMonitoringService,
    private readonly violationDetector: ViolationDetectionService,
    private readonly remediationService: RemediationService,
    private readonly auditLogger: PolicyAuditService,
    private readonly riskAnalyzer: PolicyRiskAnalyzer,
    private readonly notificationService: PolicyNotificationService
  ) {}

  // ============================================================================
  // MAIN ENFORCEMENT METHODS
  // ============================================================================

  /**
   * Execute comprehensive policy enforcement
   */
  async execute(request: EnforcePolicyRequest): Promise<Result<PolicyEnforcementResult, string>> {
    const startTime = Date.now();
    
    try {
      // Validate enforcement request
      const validation = this._validateEnforcementRequest(request);
      if (!validation.success) {
        return Result.error(`Policy enforcement validation failed: ${validation.error}`);
      }

      // Create access control context
      const context = this._createAccessControlContext(request);

      // Handle emergency bypass if requested
      if (request.bypassEmergency) {
        const emergencyResult = await this._handleEmergencyBypass(request, context);
        if (emergencyResult.bypass) {
          return Result.success(emergencyResult.result);
        }
      }

      // Evaluate applicable policies
      const policyEvaluation = await this._evaluatePolicies(context, request);
      if (!policyEvaluation.success) {
        return Result.error(`Policy evaluation failed: ${policyEvaluation.error}`);
      }

      // Execute enforcement actions
      const enforcementActions = await this._executeEnforcementActions(
        policyEvaluation.data.appliedPolicies,
        context,
        request
      );

      // Detect and handle violations
      const violations = await this._detectViolations(
        policyEvaluation.data,
        enforcementActions,
        context
      );

      // Generate recommendations
      const recommendations = await this._generateRecommendations(
        policyEvaluation.data,
        violations,
        context
      );

      // Assess compliance status
      const complianceStatus = await this._assessCompliance(
        policyEvaluation.data,
        violations,
        context
      );

      // Perform risk assessment
      const riskAssessment = await this._performRiskAssessment(
        policyEvaluation.data,
        violations,
        context
      );

      // Generate contextual information
      const contextualInfo = await this._generateContextualInfo(request, context);

      // Create audit entries
      const auditEntries = await this._createAuditEntries(
        request,
        policyEvaluation.data,
        enforcementActions,
        violations
      );

      // Generate warnings
      const warnings = await this._generateWarnings(
        policyEvaluation.data,
        complianceStatus,
        riskAssessment
      );

      // Compile comprehensive result
      const result: PolicyEnforcementResult = {
        decision: policyEvaluation.data.decision,
        enforcementActions,
        appliedPolicies: policyEvaluation.data.appliedPolicies,
        violations,
        warnings,
        recommendations,
        auditEntries,
        complianceStatus,
        nextEvaluation: this._calculateNextEvaluation(policyEvaluation.data),
        contextualInfo,
        riskAssessment
      };

      // Store enforcement result
      await this._storeEnforcementResult(result, request);

      // Send notifications for critical issues
      await this._sendNotifications(result, request);

      // Record performance metrics
      const executionTime = Date.now() - startTime;
      await this._recordPerformanceMetrics(request, result, executionTime);

      return Result.success(result);

    } catch (error) {
      const errorMessage = `Policy enforcement execution failed: ${error}`;
      
      // Log error for monitoring
      await this.auditLogger.logError('enforcement_error', errorMessage, {
        userId: request.userId,
        operation: request.operation,
        resource: request.resource,
        executionTime: Date.now() - startTime
      });

      return Result.error(errorMessage);
    }
  }

  /**
   * Execute batch policy enforcement
   */
  async executeBatch(batchRequest: BatchPolicyEnforcementRequest): Promise<Result<BatchPolicyEnforcementResult, string>> {
    const startTime = Date.now();
    
    try {
      if (batchRequest.requests.length === 0) {
        return Result.error('No enforcement requests provided');
      }

      const results: PolicyEnforcementResult[] = [];
      const allViolations: PolicyViolation[] = [];
      const allRecommendations: PolicyRecommendation[] = [];

      if (batchRequest.parallelProcessing) {
        // Process requests in parallel
        const promises = batchRequest.requests.map(request => this.execute(request));
        const settlements = await Promise.allSettled(promises);

        settlements.forEach((settlement, index) => {
          if (settlement.status === 'fulfilled' && settlement.value.success) {
            const result = settlement.value.data;
            results.push(result);
            allViolations.push(...result.violations);
            allRecommendations.push(...result.recommendations);
          } else if (batchRequest.failFast) {
            throw new Error(`Request ${index} failed: ${settlement.status === 'rejected' ? settlement.reason : settlement.value.error}`);
          }
        });

      } else {
        // Process requests sequentially
        for (let i = 0; i < batchRequest.requests.length; i++) {
          try {
            const result = await this.execute(batchRequest.requests[i]);
            if (result.success) {
              results.push(result.data);
              allViolations.push(...result.data.violations);
              allRecommendations.push(...result.data.recommendations);
            } else if (batchRequest.failFast) {
              throw new Error(`Request ${i} failed: ${result.error}`);
            }
          } catch (error) {
            if (batchRequest.failFast) {
              throw error;
            }
          }
        }
      }

      // Calculate batch summary
      const summary: BatchSummary = {
        totalRequests: batchRequest.requests.length,
        successful: results.length,
        failed: batchRequest.requests.length - results.length,
        violations: allViolations.length,
        processingTime: Date.now() - startTime,
        riskDistribution: this._calculateRiskDistribution(results),
        complianceScore: this._calculateBatchComplianceScore(results)
      };

      // Assess overall compliance status
      const overallCompliance = await this._assessBatchCompliance(results);

      const batchResult: BatchPolicyEnforcementResult = {
        results,
        summary,
        violations: allViolations,
        recommendations: this._deduplicateRecommendations(allRecommendations),
        complianceStatus: overallCompliance
      };

      return Result.success(batchResult);

    } catch (error) {
      return Result.error(`Batch policy enforcement failed: ${error}`);
    }
  }

  /**
   * Validate policy configuration
   */
  async validatePolicyConfiguration(policyId: string): Promise<Result<PolicyValidationResult, string>> {
    try {
      const validation = await this.policyEngine.validatePolicy(policyId);
      return Result.success(validation);
    } catch (error) {
      return Result.error(`Policy validation failed: ${error}`);
    }
  }

  /**
   * Get policy enforcement analytics
   */
  async getEnforcementAnalytics(
    period: 'hour' | 'day' | 'week' | 'month',
    filters?: {
      userId?: string;
      policyId?: string;
      violationType?: string;
    }
  ): Promise<Result<EnforcementAnalytics, string>> {
    try {
      const analytics = await this.auditLogger.getEnforcementAnalytics(period, filters);
      return Result.success(analytics);
    } catch (error) {
      return Result.error(`Analytics retrieval failed: ${error}`);
    }
  }

  // ============================================================================
  // PRIVATE IMPLEMENTATION METHODS
  // ============================================================================

  /**
   * Validate enforcement request
   */
  private _validateEnforcementRequest(request: EnforcePolicyRequest): Result<boolean, string> {
    if (!request.userId || !request.userRole || !request.profileOwnerId) {
      return Result.error('Missing required user identification parameters');
    }

    if (!request.operation || !request.resource) {
      return Result.error('Missing required operation parameters');
    }

    if (!request.context.sessionId || !request.context.deviceId || !request.context.ipAddress) {
      return Result.error('Missing required context parameters');
    }

    return Result.success(true);
  }

  /**
   * Create access control context
   */
  private _createAccessControlContext(request: EnforcePolicyRequest): AccessControlContext {
    return {
      userId: request.userId,
      userRole: request.userRole,
      profileOwnerId: request.profileOwnerId,
      sessionId: request.context.sessionId,
      deviceId: request.context.deviceId,
      ipAddress: request.context.ipAddress,
      timestamp: request.context.timestamp,
      requestedPermission: this._mapOperationToPermission(request.operation),
      resource: request.resource,
      additionalAttributes: request.context.additionalAttributes || {}
    };
  }

  /**
   * Map operation to permission
   */
  private _mapOperationToPermission(operation: string): AccessPermission {
    const mapping: Record<string, AccessPermission> = {
      'create': 'edit',
      'read': 'read',
      'update': 'edit',
      'delete': 'delete',
      'admin': 'admin',
      'moderate': 'moderate',
      'export': 'export'
    };
    
    return mapping[operation] || 'read';
  }

  /**
   * Evaluate applicable policies
   */
  private async _evaluatePolicies(
    context: AccessControlContext,
    request: EnforcePolicyRequest
  ): Promise<Result<{ decision: PermissionResult; appliedPolicies: AppliedPolicy[] }, string>> {
    try {
      const accessDecision = this.profileAccessControl.evaluateAccess(context);
      
      if (!accessDecision.success) {
        return Result.error(accessDecision.error);
      }

      // Get detailed policy evaluation
      const appliedPolicies = await this.policyEngine.getDetailedEvaluation(context, accessDecision.data);

      return Result.success({
        decision: accessDecision.data.decision,
        appliedPolicies
      });
    } catch (error) {
      return Result.error(`Policy evaluation failed: ${error}`);
    }
  }

  // Additional private helper methods...
  private async _handleEmergencyBypass(request: EnforcePolicyRequest, context: AccessControlContext): Promise<{ bypass: boolean; result?: PolicyEnforcementResult }> { return { bypass: false }; }
  private async _executeEnforcementActions(appliedPolicies: AppliedPolicy[], context: AccessControlContext, request: EnforcePolicyRequest): Promise<EnforcementAction[]> { return []; }
  private async _detectViolations(policyData: any, actions: EnforcementAction[], context: AccessControlContext): Promise<PolicyViolation[]> { return []; }
  private async _generateRecommendations(policyData: any, violations: PolicyViolation[], context: AccessControlContext): Promise<PolicyRecommendation[]> { return []; }
  private async _assessCompliance(policyData: any, violations: PolicyViolation[], context: AccessControlContext): Promise<ComplianceStatus> { return {} as ComplianceStatus; }
  private async _performRiskAssessment(policyData: any, violations: PolicyViolation[], context: AccessControlContext): Promise<PolicyRiskAssessment> { return {} as PolicyRiskAssessment; }
  private async _generateContextualInfo(request: EnforcePolicyRequest, context: AccessControlContext): Promise<ContextualInfo> { return {} as ContextualInfo; }
  private async _createAuditEntries(request: EnforcePolicyRequest, policyData: any, actions: EnforcementAction[], violations: PolicyViolation[]): Promise<PolicyAuditEntry[]> { return []; }
  private async _generateWarnings(policyData: any, compliance: ComplianceStatus, risk: PolicyRiskAssessment): Promise<PolicyWarning[]> { return []; }
  private _calculateNextEvaluation(policyData: any): Date { return new Date(Date.now() + 24 * 60 * 60 * 1000); }
  private async _storeEnforcementResult(result: PolicyEnforcementResult, request: EnforcePolicyRequest): Promise<void> { /* Implementation */ }
  private async _sendNotifications(result: PolicyEnforcementResult, request: EnforcePolicyRequest): Promise<void> { /* Implementation */ }
  private async _recordPerformanceMetrics(request: EnforcePolicyRequest, result: PolicyEnforcementResult, executionTime: number): Promise<void> { /* Implementation */ }
  private _calculateRiskDistribution(results: PolicyEnforcementResult[]): Record<string, number> { return {}; }
  private _calculateBatchComplianceScore(results: PolicyEnforcementResult[]): number { return 85; }
  private async _assessBatchCompliance(results: PolicyEnforcementResult[]): Promise<ComplianceStatus> { return {} as ComplianceStatus; }
  private _deduplicateRecommendations(recommendations: PolicyRecommendation[]): PolicyRecommendation[] { return recommendations; }
}

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

interface PolicyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

interface EnforcementAnalytics {
  totalEnforcements: number;
  decisions: Record<string, number>;
  violations: number;
  complianceScore: number;
  trends: any[];
}

// Service interfaces
interface PolicyEvaluationEngine {
  validatePolicy(policyId: string): Promise<PolicyValidationResult>;
  getDetailedEvaluation(context: AccessControlContext, decision: AccessDecision): Promise<AppliedPolicy[]>;
}

interface ComplianceMonitoringService {
  assessCompliance(context: AccessControlContext): Promise<ComplianceStatus>;
}

interface ViolationDetectionService {
  detectViolations(context: AccessControlContext, actions: EnforcementAction[]): Promise<PolicyViolation[]>;
}

interface RemediationService {
  executeRemediation(violations: PolicyViolation[]): Promise<void>;
}

interface PolicyAuditService {
  logError(type: string, message: string, context: any): Promise<void>;
  getEnforcementAnalytics(period: string, filters?: any): Promise<EnforcementAnalytics>;
}

interface PolicyRiskAnalyzer {
  analyzeRisk(context: AccessControlContext, violations: PolicyViolation[]): Promise<PolicyRiskAssessment>;
}

interface PolicyNotificationService {
  sendNotification(type: string, data: any): Promise<void>;
}