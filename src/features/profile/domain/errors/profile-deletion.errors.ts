/**
 * @fileoverview PROFILE-DELETION-ERRORS: Enterprise Profile Deletion Error Definitions
 * @description Spezifische Error-Klassen für Profile Deletion Operations mit umfassenden
 * Error Context und Recovery Strategies. Implementiert Enterprise Error Handling Standards.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module ProfileDeletionErrors
 * @namespace Features.Profile.Domain.Errors
 */

import { BaseError } from '@core/errors/base.error';

/**
 * @class InvalidUserIdError
 * @description Error für ungültige oder malformed User IDs
 */
export class InvalidUserIdError extends BaseError {
  constructor(userId: string, details?: string) {
    super(
      'INVALID_USER_ID',
      `Invalid user ID provided: ${userId}`,
      details,
      'VALIDATION_ERROR'
    );
  }
}

/**
 * @class ProfileNotFoundError
 * @description Error wenn das Profile nicht existiert
 */
export class ProfileNotFoundError extends BaseError {
  constructor(userId: string) {
    super(
      'PROFILE_NOT_FOUND',
      `Profile not found for user: ${userId}`,
      undefined,
      'NOT_FOUND_ERROR'
    );
  }
}

/**
 * @class ProfileDeletionDeniedError
 * @description Error für verweigerte Deletion Authorization
 */
export class ProfileDeletionDeniedError extends BaseError {
  constructor(userId: string, reason: string) {
    super(
      'PROFILE_DELETION_DENIED',
      `Profile deletion denied for user ${userId}: ${reason}`,
      undefined,
      'AUTHORIZATION_ERROR'
    );
  }
}

/**
 * @class ProfileDeletionValidationError
 * @description Error für Deletion Validation Failures
 */
export class ProfileDeletionValidationError extends BaseError {
  constructor(validationErrors: string[]) {
    super(
      'PROFILE_DELETION_VALIDATION_FAILED',
      `Profile deletion validation failed: ${validationErrors.join(', ')}`,
      JSON.stringify(validationErrors),
      'VALIDATION_ERROR'
    );
  }
}

/**
 * @class ProfileBackupError
 * @description Error bei Backup Creation Failures
 */
export class ProfileBackupError extends BaseError {
  constructor(userId: string, backupError: string) {
    super(
      'PROFILE_BACKUP_FAILED',
      `Profile backup failed for user ${userId}: ${backupError}`,
      undefined,
      'BACKUP_ERROR'
    );
  }
}

/**
 * @class ProfileServiceUnavailableError
 * @description Error wenn der Profile Service nicht erreichbar ist
 */
export class ProfileServiceUnavailableError extends BaseError {
  constructor(serviceName: string) {
    super(
      'PROFILE_SERVICE_UNAVAILABLE',
      `Profile service unavailable: ${serviceName}`,
      undefined,
      'SERVICE_ERROR'
    );
  }
}

/**
 * @class RelatedDataCleanupError
 * @description Error bei Related Data Cleanup Failures
 */
export class RelatedDataCleanupError extends BaseError {
  constructor(userId: string, cleanupError: string) {
    super(
      'RELATED_DATA_CLEANUP_FAILED',
      `Related data cleanup failed for user ${userId}: ${cleanupError}`,
      undefined,
      'CLEANUP_ERROR'
    );
  }
}

/**
 * @class ExternalSystemNotificationError
 * @description Error bei External System Notification Failures
 */
export class ExternalSystemNotificationError extends BaseError {
  constructor(system: string, error: string) {
    super(
      'EXTERNAL_NOTIFICATION_FAILED',
      `External system notification failed for ${system}: ${error}`,
      undefined,
      'NOTIFICATION_ERROR'
    );
  }
}

/**
 * @class ProfileAuditError
 * @description Error bei Audit-Logging Failures
 */
export class ProfileAuditError extends BaseError {
  constructor(auditError: string) {
    super(
      'PROFILE_AUDIT_FAILED',
      `Profile audit logging failed: ${auditError}`,
      undefined,
      'AUDIT_ERROR'
    );
  }
}

/**
 * @class NetworkError
 * @description Error bei Netzwerkverbindungsproblemen
 */
export class NetworkError extends BaseError {
  constructor(details: string) {
    super(
      'NETWORK_ERROR',
      `Network error occurred: ${details}`,
      undefined,
      'NETWORK_ERROR'
    );
  }
}

/**
 * @class InternalServerError
 * @description Error bei unerwarteten Server-Fehlern
 */
export class InternalServerError extends BaseError {
  constructor(details: string) {
    super(
      'INTERNAL_SERVER_ERROR',
      `Internal server error: ${details}`,
      undefined,
      'SERVER_ERROR'
    );
  }
} 