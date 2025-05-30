/**
 * @fileoverview DOMAIN-INTERFACE-007: Compliance Service Interface - Enterprise Standard
 * @description Domain Layer Interface für Enterprise Compliance Management Service.
 * Definiert Verträge für GDPR, CCPA und weitere Compliance-Anforderungen.
 * 
 * @businessRule BR-275: Compliance domain service interface definition
 * @businessRule BR-276: GDPR data subject rights interface contracts
 * @businessRule BR-277: Enterprise audit trail interface standards
 * 
 * @securityNote Compliance interface specifications defined
 * @securityNote Data protection contracts established
 * @securityNote Audit trail interface requirements
 * 
 * @compliance GDPR Articles 15, 17, 20 interface compliance
 * @compliance CCPA Consumer Privacy Rights interface standards
 * @compliance ISO 27001 A.18.1.4 compliance interface requirements
 * 
 * @example Interface Usage
 * ```typescript
 * class ComplianceServiceImpl implements IComplianceService {
 *   async exportUserData(userId: string): Promise<UserDataExport> {
 *     // Implementation
 *   }
 * }
 * ```
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module IComplianceService
 * @namespace Auth.Domain.Services.Interfaces
 */

/**
 * @interface UserDataExport
 * @description GDPR Article 20 compliant user data export structure
 */
export interface UserDataExport {
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at?: string;
    metadata: any;
  };
  securityEvents: any[];
  sessions: any[];
  mfaFactors: any[];
  oauthProviders: string[];
  exportedAt: string;
  exportVersion: string;
}

/**
 * @interface ComplianceReport
 * @description Enterprise compliance reporting structure
 */
export interface ComplianceReport {
  reportId: string;
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newRegistrations: number;
    securityEvents: number;
    dataExportRequests: number;
    dataDeletionRequests: number;
  };
  compliance: {
    gdprCompliant: boolean;
    dataRetentionPolicy: string;
    encryptionStatus: string;
    auditTrailComplete: boolean;
  };
}

/**
 * @interface DataDeletionRequest
 * @description GDPR Article 17 data deletion request structure
 */
export interface DataDeletionRequest {
  id: string;
  userId: string;
  requestedAt: string;
  scheduledFor: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reason: string;
  deletionType: 'soft' | 'hard';
}

/**
 * @interface IComplianceService
 * @description DOMAIN-INTERFACE-007: Enterprise Compliance Service Interface
 * 
 * Domain layer interface defining contracts for comprehensive compliance management.
 * Supports GDPR, CCPA, and enterprise regulatory requirements with audit trails.
 * 
 * @businessRule BR-275: Clean compliance service interface definition
 * @businessRule BR-276: GDPR data subject rights interface contracts
 * @businessRule BR-277: Enterprise audit trail and reporting interface
 * 
 * @securityNote Interface specifies secure compliance operation contracts
 * @securityNote Data protection requirements defined in interface
 * @securityNote Audit logging contracts established for all operations
 * 
 * @compliance GDPR Articles 15, 17, 20 interface implementation requirements
 * @compliance CCPA consumer privacy rights interface standards
 * @compliance ISO 27001 A.18.1.4 privacy and data protection interface
 * 
 * @example Complete Compliance Interface Implementation
 * ```typescript
 * class ComplianceServiceImpl implements IComplianceService {
 *   async exportUserData(userId: string): Promise<UserDataExport> {
 *     return {
 *       user: {},
 *       securityEvents: [],
 *       sessions: [],
 *       mfaFactors: [],
 *       oauthProviders: [],
 *       exportedAt: new Date().toISOString(),
 *       exportVersion: '1.0'
 *     };
 *   }
 * 
 *   async requestDataDeletion(userId: string, reason: string): Promise<DataDeletionRequest> {
 *     return {
 *       id: 'deletion-id',
 *       userId,
 *       requestedAt: new Date().toISOString(),
 *       scheduledFor: new Date().toISOString(),
 *       status: 'pending',
 *       reason,
 *       deletionType: 'soft'
 *     };
 *   }
 * 
 *   async generateComplianceReport(startDate: Date, endDate: Date): Promise<ComplianceReport> {
 *     return {
 *       reportId: 'report-id',
 *       generatedAt: new Date().toISOString(),
 *       period: { start: startDate.toISOString(), end: endDate.toISOString() },
 *       metrics: { totalUsers: 0, activeUsers: 0, newRegistrations: 0, securityEvents: 0, dataExportRequests: 0, dataDeletionRequests: 0 },
 *       compliance: { gdprCompliant: true, dataRetentionPolicy: 'standard', encryptionStatus: 'enabled', auditTrailComplete: true }
 *     };
 *   }
 * }
 * ```
 * 
 * @since 1.0.0
 */
export interface IComplianceService {
  /**
   * @method exportUserData
   * @description Export user data for GDPR Article 20 compliance
   * 
   * @param {string} userId - User identifier for data export
   * @returns {Promise<UserDataExport>} Complete user data export
   */
  exportUserData(userId: string): Promise<UserDataExport>;

  /**
   * @method requestDataDeletion
   * @description Request user data deletion for GDPR Article 17 compliance
   * 
   * @param {string} userId - User identifier for data deletion
   * @param {string} reason - Reason for deletion request
   * @param {'soft' | 'hard'} deletionType - Type of deletion
   * @param {number} delayDays - Grace period before deletion
   * @returns {Promise<DataDeletionRequest>} Deletion request details
   */
  requestDataDeletion(
    userId: string,
    reason: string,
    deletionType?: 'soft' | 'hard',
    delayDays?: number
  ): Promise<DataDeletionRequest>;

  /**
   * @method executeDataDeletion
   * @description Execute scheduled data deletion
   * 
   * @param {string} deletionRequestId - Deletion request identifier
   * @returns {Promise<void>} Promise resolving when deletion complete
   */
  executeDataDeletion(deletionRequestId: string): Promise<void>;

  /**
   * @method generateComplianceReport
   * @description Generate enterprise compliance report
   * 
   * @param {Date} startDate - Report period start date
   * @param {Date} endDate - Report period end date
   * @returns {Promise<ComplianceReport>} Comprehensive compliance report
   */
  generateComplianceReport(startDate: Date, endDate: Date): Promise<ComplianceReport>;

  /**
   * @method exportAuditTrail
   * @description Export audit trail for compliance verification
   * 
   * @param {Date} startDate - Audit trail start date
   * @param {Date} endDate - Audit trail end date
   * @param {'json' | 'csv'} format - Export format
   * @returns {Promise<string>} Formatted audit trail data
   */
  exportAuditTrail(
    startDate: Date,
    endDate: Date,
    format?: 'json' | 'csv'
  ): Promise<string>;
} 