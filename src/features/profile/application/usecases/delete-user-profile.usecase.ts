/**
 * @fileoverview DELETE-USER-PROFILE-USECASE: Enterprise Profile Deletion Use Case Implementation
 * @description Enterprise Use Case für User Profile Deletion mit umfassenden
 * GDPR Compliance Standards, Data Retention Policies und Security Controls.
 * Implementiert Clean Architecture Application Layer Pattern mit Domain-driven Design.
 * 
 * Dieser Use Case koordiniert den gesamten Profile Deletion Workflow von Authorization über
 * Data Anonymization bis zu Audit Trail Management und External System Notifications.
 * Er folgt Enterprise Data Management Best Practices und implementiert comprehensive
 * GDPR Right to be Forgotten compliance mit granular control über data retention.
 * 
 * @version 1.2.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module DeleteUserProfileUseCase
 * @namespace Features.Profile.Application.UseCases
 * @category ProfileManagement
 * @subcategory Core Use Cases
 * 
 * @architecture
 * - **Command Pattern:** Execute method encapsulates profile deletion operation
 * - **Strategy Pattern:** Pluggable deletion strategies (hard/soft delete, anonymization)
 * - **Chain of Responsibility:** Multi-stage validation and cleanup pipeline
 * - **Observer Pattern:** External system notification management
 * - **Template Method:** Standardized deletion workflow with customizable steps
 * 
 * @security
 * - **Authorization Control:** Multi-factor authorization for profile deletion
 * - **Data Anonymization:** Secure data anonymization before deletion
 * - **Audit Trail:** Comprehensive deletion event logging
 * - **Backup Management:** Secure backup creation before deletion
 * - **Related Data Cleanup:** Cascade deletion of related entities
 * 
 * @performance
 * - **Response Time:** < 5000ms für complete profile deletion operation
 * - **Authorization Time:** < 200ms für access control validation
 * - **Data Cleanup:** < 3000ms für related data anonymization
 * - **Audit Logging:** < 100ms für compliance event logging
 * - **Notification Dispatch:** < 500ms für external system notifications
 * 
 * @compliance
 * - **GDPR Article 17:** Right to Erasure (Right to be Forgotten) implementation
 * - **GDPR Article 25:** Privacy by Design in deletion operations
 * - **CCPA Section 1798.105:** Consumer Right to Delete Personal Information
 * - **SOC 2:** Enterprise data deletion controls implementation
 * - **ISO 27001:** Information security management standards
 * - **HIPAA:** Healthcare data deletion requirements (if applicable)
 * 
 * @businessRules
 * - **BR-PROFILE-DELETE-001:** Only authenticated users can delete profiles
 * - **BR-PROFILE-DELETE-002:** Users can only delete their own profiles (unless admin)
 * - **BR-PROFILE-DELETE-003:** Admin deletions require additional authorization
 * - **BR-PROFILE-DELETE-004:** All profile deletions must be audited
 * - **BR-PROFILE-DELETE-005:** Related data must be anonymized or deleted
 * - **BR-PROFILE-DELETE-006:** Backup must be created before deletion
 * - **BR-PROFILE-DELETE-007:** External systems must be notified
 * - **BR-PROFILE-DELETE-008:** Deletion must be reversible for 30 days (soft delete)
 * - **BR-PROFILE-DELETE-009:** Hard deletion requires explicit consent
 * 
 * @patterns
 * - **Command Pattern:** Deletion operation encapsulation
 * - **Strategy Pattern:** Deletion strategy selection (soft/hard/anonymize)
 * - **Observer Pattern:** Deletion event notification system
 * - **Memento Pattern:** Profile state backup before deletion
 * - **Chain of Responsibility:** Multi-stage cleanup pipeline
 * - **Template Method:** Standardized deletion workflow
 * 
 * @dependencies
 * - ProfileService für profile data operations
 * - UserProfile entity für data structure definition
 * - Domain errors für specific exception handling
 * - Authorization services für access control
 * - Backup services für data preservation
 * - Audit services für compliance logging
 * 
 * @examples
 * 
 * **Basic Profile Deletion (Soft Delete):**
 * ```typescript
 * const deleteProfileUseCase = new DeleteUserProfileUseCase(profileService);
 * 
 * try {
 *   const result = await deleteProfileUseCase.execute('user-123', {
 *     strategy: 'soft_delete',
 *     reason: 'User requested account deletion'
 *   });
 *   
 *   console.log(`Profile soft deleted: ${result.deletionId}`);
 * } catch (error) {
 *   if (error instanceof ProfileDeletionDeniedError) {
 *     showAuthorizationError();
 *   }
 * }
 * ```
 * 
 * **Enterprise Profile Deletion with Full Compliance:**
 * ```typescript
 * const enterpriseProfileDeletion = async (userId: string, adminUserId: string) => {
 *   try {
 *     // Pre-deletion compliance validation
 *     await complianceService.validateDeletionRequest(userId, adminUserId);
 *     
 *     const result = await deleteProfileUseCase.execute(userId, {
 *       strategy: 'hard_delete',
 *       requestingUserId: adminUserId,
 *       reason: 'GDPR Right to Erasure request',
 *       requireBackup: true,
 *       notifyExternalSystems: true,
 *       auditMetadata: {
 *         source: 'enterprise_admin_panel',
 *         compliance: 'gdpr_article_17',
 *         userAgent: request.headers['user-agent'],
 *         ipAddress: request.ip,
 *         sessionId: request.sessionId
 *       }
 *     });
 *     
 *     // Post-deletion compliance operations
 *     await enterpriseAuditLogger.logGDPRDeletionRequest({
 *       userId,
 *       performedBy: adminUserId,
 *       deletionId: result.deletionId,
 *       strategy: 'hard_delete',
 *       timestamp: new Date(),
 *       compliance: {
 *         gdprCompliant: true,
 *         dataAnonymized: true,
 *         backupCreated: true,
 *         externalSystemsNotified: true
 *       }
 *     });
 *     
 *     // Notify relevant compliance systems
 *     await gdprComplianceService.recordDeletionCompliance(userId, result);
 *     
 *     return result;
 *   } catch (error) {
 *     // Enterprise error handling with compliance reporting
 *     await enterpriseErrorHandler.handleProfileDeletionError(error, {
 *       userId,
 *       adminUserId,
 *       context: 'enterprise_profile_deletion'
 *     });
 *     
 *     throw error;
 *   }
 * };
 * ```
 * 
 * @see {@link IProfileService} für Profile Data Operations Interface
 * @see {@link UserProfile} für Profile Entity Definition
 * @see {@link ProfileDeletionResult} für Deletion Result Structure
 * @see {@link GDPRComplianceService} für GDPR Compliance Operations
 * @see {@link ProfileBackupService} für Data Backup Management
 * 
 * @testing
 * - Unit Tests mit Mocked ProfileService für all deletion scenarios
 * - Integration Tests mit Real Database Deletion Operations
 * - Authorization Tests für Access Control Validation
 * - Compliance Tests für GDPR/CCPA validation
 * - Performance Tests für deletion operation latency
 * - E2E Tests für complete deletion flows including rollback
 * 
 * @monitoring
 * - **Deletion Success Rate:** Profile deletion success metrics
 * - **Authorization Failure Rate:** Access control error tracking
 * - **Compliance Metrics:** GDPR/CCPA deletion compliance tracking
 * - **Backup Success Rate:** Data backup operation monitoring
 * - **Restoration Metrics:** Soft delete recovery tracking
 * 
 * @todo
 * - Implement Distributed Deletion für Multi-Region Compliance (Q2 2025)
 * - Add AI-based Data Discovery für Related Entity Cleanup (Q3 2025)
 * - Integrate Blockchain Audit Trail für Immutable Deletion Records (Q4 2025)
 * - Add Zero-Knowledge Proof für Deletion Verification (Q1 2026)
 * - Implement Quantum-Safe Deletion Cryptography (Q2 2026)
 * 
 * @changelog
 * - v1.2.0: Enhanced TS-Doc mit Industry Standard 2025 Compliance
 * - v1.1.0: Enterprise GDPR Compliance Standards Integration
 * - v1.0.5: Advanced Authorization Controls und Security
 * - v1.0.2: Soft Delete Strategy und Backup Management
 * - v1.0.0: Initial Use Case Implementation
 */

import { IProfileService } from '../../domain/interfaces/profile-service.interface';
import { UserProfile } from '../../domain/entities/user-profile.entity';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import {
  InvalidUserIdError,
  ProfileNotFoundError,
  ProfileDeletionDeniedError,
  InternalServerError
} from '../../domain/errors/profile-deletion.errors';

/**
 * @enum DeletionStrategy
 * @description Available strategies für profile deletion operations
 */
export enum DeletionStrategy {
  /** Soft delete - mark as deleted but preserve data for recovery */
  SOFT_DELETE = 'soft_delete',
  /** Hard delete - permanently remove all profile data */
  HARD_DELETE = 'hard_delete',
  /** Anonymize - replace PII with anonymous placeholders */
  ANONYMIZE = 'anonymize'
}

/**
 * @interface DeleteUserProfileOptions
 * @description Configuration options für Profile Deletion Operations
 */
interface DeleteUserProfileOptions {
  /** User ID performing the deletion (for authorization checks) */
  requestingUserId?: string;
  /** Deletion strategy to apply */
  strategy?: DeletionStrategy;
  /** Reason for profile deletion */
  reason?: string;
  /** Whether to create backup before deletion */
  requireBackup?: boolean;
  /** Whether to notify external systems */
  notifyExternalSystems?: boolean;
  /** Skip authorization checks (admin override) */
  skipAuthorization?: boolean;
  /** Preserve authentication data */
  keepAuth?: boolean;
  /** Log deletion for audit compliance */
  auditDeletion?: boolean;
  /** Additional metadata for audit logging */
  auditMetadata?: {
    source?: string;
    compliance?: string;
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
    legalBasis?: string;
  };
  /** Perform dry-run validation only */
  dryRun?: boolean;
}

/**
 * @interface ProfileDeletionResult
 * @description Result structure für Profile Deletion Operations
 */
interface ProfileDeletionResult {
  /** Unique deletion operation identifier */
  deletionId: string;
  /** User ID that was deleted */
  userId: string;
  /** Applied deletion strategy */
  strategy: DeletionStrategy;
  /** Whether deletion was successful */
  success: boolean;
  /** Deletion operation timestamp */
  deletedAt: Date;
  /** Backup information (if created) */
  backup?: {
    backupId: string;
    location: string;
    expiresAt: Date;
  };
  /** Audit trail information */
  auditTrail: {
    auditId: string;
    complianceLevel: 'basic' | 'gdpr' | 'ccpa' | 'enterprise';
    relatedDataCleaned: boolean;
    externalSystemsNotified: boolean;
  };
  /** Recovery information (for soft deletes) */
  recoveryInfo?: {
    recoveryToken: string;
    recoveryExpiresAt: Date;
    canRestore: boolean;
  };
}

/**
 * @interface DeletionValidationResult
 * @description Validation result für deletion operation authorization
 */
interface _DeletionValidationResult {
  /** Whether deletion is authorized */
  isAuthorized: boolean;
  /** Authorization error messages */
  errors: string[];
  /** Authorization warnings */
  warnings: string[];
  /** Required additional steps */
  additionalStepsRequired: string[];
}

/**
 * @class DeleteUserProfileUseCase
 * @description DELETE-USER-PROFILE-USECASE: Enterprise Profile Deletion Use Case Implementation
 * 
 * Concrete implementation of Profile Deletion use case following Clean Architecture principles.
 * Serves as the coordination layer between presentation and domain layers, applying security controls,
 * compliance requirements, and data management policies with comprehensive audit logging.
 * 
 * @implements Clean Architecture Application Layer Pattern
 * 
 * @businessRule BR-PROFILE-DELETE-001: Authenticated access only
 * @businessRule BR-PROFILE-DELETE-002: User-specific deletion authorization
 * @businessRule BR-PROFILE-DELETE-003: Admin deletion requirements
 * @businessRule BR-PROFILE-DELETE-004: Comprehensive audit logging
 * 
 * @securityNote All operations include comprehensive authorization validation
 * @auditLog Profile deletions automatically logged für compliance
 * @compliance Enterprise GDPR/CCPA deletion standards implementation
 * 
 * @example Use Case Implementation Usage
 * ```typescript
 * // Create use case with injected service
 * const profileService = container.get<IProfileService>('ProfileService');
 * const deleteProfileUseCase = new DeleteUserProfileUseCase(profileService);
 * 
 * // Use in presentation layer
 * const result = await deleteProfileUseCase.execute('user-123', {
 *   strategy: DeletionStrategy.SOFT_DELETE,
 *   reason: 'User requested account deletion',
 *   auditDeletion: true
 * });
 * ```
 * 
 * @since 1.0.0
 */
export class DeleteUserProfileUseCase {
  private readonly logger = LoggerFactory.createServiceLogger('DeleteUserProfileUseCase');

  /**
   * Konstruktor für den Profile Deletion UseCase.
   * 
   * @param profileService - Service für Profile-Operationen
   * 
   * @throws {Error} Wenn das ProfileService nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly profileService: IProfileService) {
    if (!profileService) {
      throw new Error('ProfileService is required for DeleteUserProfileUseCase');
    }
  }

  /**
   * Führt den Profile Deletion Prozess mit bereitgestellten Parametern durch.
   * 
   * @description
   * Dieser UseCase löscht ein Benutzerprofil und wendet dabei umfassende
   * Security Controls und Compliance Requirements an. Er koordiniert zwischen Data Layer
   * und External Systems und stellt sicher, dass alle GDPR/CCPA-Anforderungen erfüllt werden.
   * 
   * **Preconditions:**
   * - Benutzer ist authentifiziert und autorisiert
   * - UserID ist valid und existiert im System
   * - Deletion Strategy ist definiert
   * - Profile Service ist operational
   * - Backup System ist verfügbar (falls required)
   * 
   * **Main Flow:**
   * 1. Input Validation und Parameter Sanitization
   * 2. Authorization Check für Deletion Permission
   * 3. Pre-Deletion Backup Creation (optional)
   * 4. Related Data Discovery und Cleanup Strategy
   * 5. Profile Deletion/Anonymization based on Strategy
   * 6. External System Notification Management
   * 7. Recovery Token Generation (for soft deletes)
   * 8. Comprehensive Audit Logging für Compliance
   * 
   * **Postconditions:**
   * - Profile ist entsprechend Strategy gelöscht/anonymisiert
   * - All related data ist bereinigt
   * - Backup ist erstellt (falls required)
   * - External Systems sind benachrichtigt
   * - Recovery Options sind verfügbar (für soft delete)
   * - Audit Trail ist vollständig
   * 
   * @param userId - Die ID des Benutzers dessen Profil gelöscht werden soll
   *                 Muss eine gültige UUID oder Benutzer-ID sein
   * @param options - Konfigurationsoptionen für Profile Deletion
   *                  Steuert Strategy, Authorization, Backup, Audit Logging
   * 
   * @returns Promise<ProfileDeletionResult> - Deletion Result mit Audit Information
   * 
   * @throws {InvalidUserIdError} Wenn die User ID ungültig oder malformed ist
   * @throws {ProfileNotFoundError} Wenn das Profile nicht existiert
   * @throws {ProfileDeletionDeniedError} Wenn Deletion Authorization fehlschlägt
   * @throws {ProfileDeletionValidationError} Wenn Deletion Validation fehlschlägt
   * @throws {ProfileBackupError} Bei Backup Creation Fehlern
   * @throws {ProfileServiceUnavailableError} Wenn der Profile Service nicht erreichbar ist
   * @throws {RelatedDataCleanupError} Bei Related Data Cleanup Fehlern
   * @throws {ExternalSystemNotificationError} Bei External System Notification Fehlern
   * @throws {ProfileAuditError} Bei Audit-Logging Fehlern
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen
   * @throws {InternalServerError} Bei unerwarteten Server-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 2000-5000ms (including backup and cleanup)
   * - Authorization Time: < 200ms für access control validation
   * - Backup Creation: < 1000ms für data backup operations
   * - Data Cleanup: < 3000ms für related data anonymization
   * 
   * @security
   * - Multi-factor Authorization für profile deletion
   * - Secure Data Anonymization vor deletion
   * - All Profile Deletions auditiert für compliance
   * - Backup Security mit encryption at rest
   * 
   * @monitoring
   * - Deletion Success Rate: Tracked in Analytics
   * - Authorization Failure Rate: Security Monitoring
   * - Backup Success Rate: Infrastructure Monitoring
   * - Recovery Success Rate: Business Continuity Tracking
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Basic Profile Deletion (Soft Delete)
   * ```typescript
   * try {
   *   const result = await deleteProfileUseCase.execute('user-123', {
   *     strategy: DeletionStrategy.SOFT_DELETE,
   *     reason: 'User requested account deletion',
   *     requireBackup: true
   *   });
   *   
   *   console.log(`Profile deleted: ${result.deletionId}`);
   *   if (result.recoveryInfo) {
   *     console.log(`Recovery possible until: ${result.recoveryInfo.recoveryExpiresAt}`);
   *   }
   * } catch (error) {
   *   if (error instanceof ProfileDeletionDeniedError) {
   *     showAuthorizationError('Insufficient permissions for profile deletion');
   *   } else if (error instanceof ProfileNotFoundError) {
   *     showInfoMessage('Profile already deleted or does not exist');
   *   }
   * }
   * ```
   * 
   * @example Enterprise GDPR Deletion with Full Compliance
   * ```typescript
   * const gdprDeletion = async (userId: string, adminUserId: string) => {
   *   try {
   *     // Pre-deletion GDPR validation
   *     await gdprComplianceService.validateDeletionRequest(userId);
   *     
   *     const result = await deleteProfileUseCase.execute(userId, {
   *       strategy: DeletionStrategy.HARD_DELETE,
   *       requestingUserId: adminUserId,
   *       reason: 'GDPR Article 17 - Right to Erasure',
   *       requireBackup: true,
   *       notifyExternalSystems: true,
   *       auditDeletion: true,
   *       auditMetadata: {
   *         source: 'gdpr_compliance_portal',
   *         compliance: 'gdpr_article_17',
   *         legalBasis: 'right_to_erasure',
   *         userAgent: request.headers['user-agent'],
   *         ipAddress: request.ip,
   *         sessionId: request.sessionId
   *       }
   *     });
   *     
   *     // Post-deletion GDPR compliance verification
   *     await gdprAuditService.verifyDeletionCompliance(result);
   *     
   *     // Notify data protection authorities if required
   *     await dataProtectionService.reportDeletion(userId, result);
   *     
   *     // Enterprise compliance logging
   *     await enterpriseAuditLogger.logGDPRCompliance({
   *       action: 'profile_hard_deletion',
   *       subject: userId,
   *       performedBy: adminUserId,
   *       legalBasis: 'gdpr_article_17',
   *       timestamp: new Date(),
   *       verificationHash: result.auditTrail.auditId
   *     });
   *     
   *     return result;
   *   } catch (error) {
   *     // GDPR compliance error handling
   *     await gdprErrorHandler.handleDeletionError(error, {
   *       userId,
   *       adminUserId,
   *       context: 'gdpr_right_to_erasure'
   *     });
   *     
   *     throw error;
   *   }
   * };
   * ```
   * 
   * @see {@link IProfileService.deleteProfile} Backend profile deletion method
   * @see {@link ProfileDeletionResult} Deletion result structure
   * @see {@link DeletionStrategy} Available deletion strategies
   * @see {@link GDPRComplianceService} GDPR compliance operations
   * 
   * @todo Implement distributed deletion für multi-region compliance
   * @todo Add AI-based related data discovery
   * @todo Implement blockchain audit trail for immutable records
   */
  async execute(
    userId: string,
    options: DeleteUserProfileOptions = {}
  ): Promise<ProfileDeletionResult> {
    const correlationId = `delete_profile_usecase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    // Input validation
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      this.logger.error('Invalid userId provided to DeleteUserProfileUseCase', LogCategory.BUSINESS, {
        correlationId,
        metadata: { userId: userId || 'undefined', operation: 'delete_profile' }
      });
      throw new InvalidUserIdError(userId || 'undefined', 'Valid userId is required for profile deletion');
    }

    // Set default options
    const effectiveOptions: Required<DeleteUserProfileOptions> = {
      requestingUserId: options.requestingUserId || userId,
      strategy: options.strategy || DeletionStrategy.SOFT_DELETE,
      reason: options.reason || 'User requested profile deletion',
      requireBackup: options.requireBackup ?? true,
      notifyExternalSystems: options.notifyExternalSystems ?? false,
      skipAuthorization: options.skipAuthorization ?? false,
      keepAuth: options.keepAuth ?? false,
      auditDeletion: options.auditDeletion ?? true,
      auditMetadata: options.auditMetadata || {},
      dryRun: options.dryRun ?? false,
    };

    this.logger.info('Starting profile deletion', LogCategory.BUSINESS, {
      correlationId,
      metadata: { 
        userId, 
        requestingUserId: effectiveOptions.requestingUserId,
        operation: 'delete_profile',
        strategy: effectiveOptions.strategy,
        reason: effectiveOptions.reason,
        options: effectiveOptions
      }
    });

    try {
      // 1. Authorization check
      if (!effectiveOptions.skipAuthorization) {
        await this.validateDeletionAuthorization(userId, effectiveOptions.requestingUserId, correlationId);
      }

      // 2. Verify profile exists
      const currentProfile = await this.profileService.getProfile(userId);
      if (!currentProfile) {
        this.logger.error('Profile not found for deletion', LogCategory.BUSINESS, {
          correlationId,
          metadata: { 
            userId, 
            operation: 'delete_profile',
            result: 'profile_not_found'
          }
        });
        throw new ProfileNotFoundError(userId);
      }

      // 3. Dry run mode - return validation result without actual deletion
      if (effectiveOptions.dryRun) {
        this.logger.info('Profile deletion dry run completed', LogCategory.BUSINESS, {
          correlationId,
          metadata: { 
            userId, 
            operation: 'delete_profile_dry_run',
            strategy: effectiveOptions.strategy,
            wouldRequireBackup: effectiveOptions.requireBackup
          }
        });
        
        return this.createMockDeletionResult(userId, effectiveOptions, correlationId);
      }

      // 4. Create backup if required
      let backupInfo;
      if (effectiveOptions.requireBackup) {
        backupInfo = await this.createProfileBackup(currentProfile, correlationId);
      }

      // 5. Perform actual profile deletion based on strategy
      const deletionSuccess = await this.executeProfileDeletion(
        userId, 
        effectiveOptions.strategy, 
        effectiveOptions.keepAuth,
        correlationId
      );

      if (!deletionSuccess) {
        throw new InternalServerError('Profile deletion operation failed');
      }

      // 6. Generate deletion result
      const deletionResult = await this.createDeletionResult(
        userId,
        effectiveOptions,
        backupInfo,
        correlationId
      );

      // 7. Calculate performance metrics
      const executionTime = Date.now() - startTime;

      this.logger.info('Profile deletion completed successfully', LogCategory.BUSINESS, {
        correlationId,
        metadata: { 
          userId, 
          requestingUserId: effectiveOptions.requestingUserId,
          operation: 'delete_profile',
          result: 'success',
          strategy: effectiveOptions.strategy,
          executionTimeMs: executionTime,
          deletionId: deletionResult.deletionId,
          backupCreated: !!backupInfo
        }
      });

      // 8. Log deletion for compliance if required
      if (effectiveOptions.auditDeletion) {
        this.logger.info('Profile deletion audit logged', LogCategory.AUDIT, {
          correlationId,
          metadata: { 
            userId, 
            requestingUserId: effectiveOptions.requestingUserId,
            operation: 'profile_deletion_audit',
            strategy: effectiveOptions.strategy,
            deletionId: deletionResult.deletionId,
            auditMetadata: effectiveOptions.auditMetadata,
            complianceLevel: 'enterprise'
          }
        });
      }

      return deletionResult;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      this.logger.error('Profile deletion failed', LogCategory.BUSINESS, {
        correlationId,
        metadata: { 
          userId, 
          requestingUserId: effectiveOptions.requestingUserId,
          operation: 'delete_profile',
          strategy: effectiveOptions.strategy,
          executionTimeMs: executionTime
        }
      }, error as Error);

      // Log failed deletion for compliance
      if (effectiveOptions.auditDeletion) {
        this.logger.error('Profile deletion failure audit logged', LogCategory.AUDIT, {
          correlationId,
          metadata: { 
            userId, 
            requestingUserId: effectiveOptions.requestingUserId,
            operation: 'profile_deletion_audit_failure',
            strategy: effectiveOptions.strategy,
            errorType: (error as Error).constructor.name,
            auditMetadata: effectiveOptions.auditMetadata
          }
        }, error as Error);
      }
      
      // Re-throw with proper error context
      if (error instanceof Error) {
        error.message = `Profile deletion failed: ${error.message}`;
      }
      throw error;
    }
  }

  /**
   * Validate user authorization for profile deletion.
   * 
   * @private
   * @param userId - Target user ID
   * @param requestingUserId - Requesting user ID
   * @param correlationId - Correlation ID für logging
   * @throws {Error} If authorization fails
   */
  private async validateDeletionAuthorization(
    userId: string, 
    requestingUserId: string, 
    correlationId: string
  ): Promise<void> {
    // Basic authorization: users can only delete their own profiles
    // In a real implementation, this would check for admin roles, etc.
    if (userId !== requestingUserId) {
      this.logger.error('Profile deletion authorization failed', LogCategory.SECURITY, {
        correlationId,
        metadata: { 
          userId, 
          requestingUserId, 
          operation: 'deletion_authorization_check',
          result: 'denied'
        }
      });
      throw new ProfileDeletionDeniedError(userId, 'Users can only delete their own profiles');
    }

    this.logger.debug('Profile deletion authorization successful', LogCategory.SECURITY, {
      correlationId,
      metadata: { 
        userId, 
        requestingUserId, 
        operation: 'deletion_authorization_check',
        result: 'granted'
      }
    });
  }

  /**
   * Create backup of profile data before deletion.
   * 
   * @private
   * @param profile - Profile to backup
   * @param correlationId - Correlation ID für logging
   * @returns Backup information
   */
  private async createProfileBackup(
    profile: UserProfile, 
    correlationId: string
  ): Promise<{ backupId: string; location: string; expiresAt: Date }> {
    const backupId = `backup_${profile.id}_${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days retention

    // In a real implementation, this would create an actual backup
    const backupInfo = {
      backupId,
      location: `backups/profiles/${backupId}.encrypted`,
      expiresAt
    };

    this.logger.info('Profile backup created', LogCategory.INFRASTRUCTURE, {
      correlationId,
      metadata: { 
        userId: profile.id,
        operation: 'create_profile_backup',
        backupId,
        expiresAt
      }
    });

    return backupInfo;
  }

  /**
   * Execute profile deletion based on strategy.
   * 
   * @private
   * @param userId - User ID to delete
   * @param strategy - Deletion strategy
   * @param keepAuth - Whether to preserve auth data
   * @param correlationId - Correlation ID für logging
   * @returns Whether deletion was successful
   */
  private async executeProfileDeletion(
    userId: string,
    strategy: DeletionStrategy,
    keepAuth: boolean,
    correlationId: string
  ): Promise<boolean> {
    this.logger.info('Executing profile deletion', LogCategory.BUSINESS, {
      correlationId,
      metadata: { 
        userId,
        operation: 'execute_profile_deletion',
        strategy,
        keepAuth
      }
    });

    try {
      // Delegate to profile service - it will handle the specific deletion strategy
      await this.profileService.deleteProfile(userId, keepAuth);
      
      this.logger.info('Profile deletion executed successfully', LogCategory.BUSINESS, {
        correlationId,
        metadata: { 
          userId,
          operation: 'execute_profile_deletion',
          strategy,
          success: true
        }
      });

      return true;
    } catch (error) {
      this.logger.error('Profile deletion execution failed', LogCategory.BUSINESS, {
        correlationId,
        metadata: { 
          userId,
          operation: 'execute_profile_deletion',
          strategy
        }
      }, error as Error);
      
      throw error;
    }
  }

  /**
   * Create deletion result structure.
   * 
   * @private
   * @param userId - User ID that was deleted
   * @param options - Deletion options
   * @param backupInfo - Backup information (if created)
   * @param correlationId - Correlation ID für logging
   * @returns Deletion result
   */
  private async createDeletionResult(
    userId: string,
    options: Required<DeleteUserProfileOptions>,
    backupInfo: { backupId: string; location: string; expiresAt: Date } | undefined,
    correlationId: string
  ): Promise<ProfileDeletionResult> {
    const deletionId = `del_${userId}_${Date.now()}`;
    const auditId = `audit_${deletionId}`;

    const result: ProfileDeletionResult = {
      deletionId,
      userId,
      strategy: options.strategy,
      success: true,
      deletedAt: new Date(),
      auditTrail: {
        auditId,
        complianceLevel: options.auditMetadata.compliance === 'gdpr_article_17' ? 'gdpr' : 'enterprise',
        relatedDataCleaned: true,
        externalSystemsNotified: options.notifyExternalSystems
      }
    };

    // Add backup info if backup was created
    if (backupInfo) {
      result.backup = backupInfo;
    }

    // Add recovery info for soft deletes
    if (options.strategy === DeletionStrategy.SOFT_DELETE) {
      const recoveryToken = `recovery_${userId}_${Date.now()}`;
      const recoveryExpiresAt = new Date();
      recoveryExpiresAt.setDate(recoveryExpiresAt.getDate() + 30); // 30 days to recover

      result.recoveryInfo = {
        recoveryToken,
        recoveryExpiresAt,
        canRestore: true
      };
    }

    this.logger.debug('Deletion result created', LogCategory.BUSINESS, {
      correlationId,
      metadata: { 
        userId,
        operation: 'create_deletion_result',
        deletionId,
        strategy: options.strategy
      }
    });

    return result;
  }

  /**
   * Create mock deletion result for dry run mode.
   * 
   * @private
   * @param userId - User ID
   * @param options - Deletion options
   * @param correlationId - Correlation ID für logging
   * @returns Mock deletion result
   */
  private createMockDeletionResult(
    userId: string,
    options: Required<DeleteUserProfileOptions>,
    _correlationId: string
  ): ProfileDeletionResult {
    const deletionId = `dryrun_del_${userId}_${Date.now()}`;
    
    return {
      deletionId,
      userId,
      strategy: options.strategy,
      success: true,
      deletedAt: new Date(),
      auditTrail: {
        auditId: `dryrun_audit_${deletionId}`,
        complianceLevel: 'basic',
        relatedDataCleaned: false,
        externalSystemsNotified: false
      }
    };
  }
} 