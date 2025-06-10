/**
 * Delete Avatar Use Case
 * Handles profile avatar deletion with cleanup
 * 
 * ✅ NEW: GDPR Audit Integration for Enterprise Compliance
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import { IAvatarService } from '../../domain/interfaces/avatar.interface';
import { IProfileService } from '../../domain/interfaces/profile-service.interface';
import { 
  InvalidUserIdError,
  ProfileNotFoundError,
  ProfileServiceUnavailableError
} from '../../domain/errors/profile-deletion.errors';

/**
 * @class DeleteAvatarUseCase
 * @description Use Case für das Löschen von Benutzer-Avataren
 */
export class DeleteAvatarUseCase {
  private readonly logger = LoggerFactory.createServiceLogger('DeleteAvatarUseCase');

  constructor(
    private readonly avatarService: IAvatarService,
    private readonly profileService: IProfileService
  ) {}

  /**
   * Delete user's avatar and cleanup
   */
  async execute(userId: string): Promise<{ success: boolean; error?: string }> {
    const correlationId = `delete_avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Validate input
      if (!userId || userId.trim().length === 0) {
        throw new InvalidUserIdError(userId);
      }

      // Get current profile to get avatar URL
      const profile = await this.profileService.getProfile(userId);
      if (!profile) {
        throw new ProfileNotFoundError(userId);
      }

      if (!profile.avatar) {
        return { success: true }; // No avatar to delete
      }

      // Delete avatar from storage service
      await this.avatarService.deleteAvatar(userId);

      // Delete avatar from profile service
      await this.profileService.deleteAvatar(userId);

      // Log GDPR audit event asynchronously - don't let it block the operation
      this.logGDPRAuditEvent(userId, correlationId).catch(error => {
        this.logger.error('Failed to log GDPR audit event', LogCategory.AUDIT, {
          correlationId,
          metadata: { userId, operation: 'gdpr_audit_failure' }
        }, error);
      });

      this.logger.info('Avatar deleted successfully', LogCategory.BUSINESS, {
        correlationId,
        metadata: {
          userId,
          operation: 'delete_avatar_success'
        }
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Failed to delete avatar', LogCategory.BUSINESS, {
        correlationId,
        metadata: {
          userId,
          operation: 'delete_avatar_failed'
        }
      }, error as Error);

      if (error instanceof InvalidUserIdError || 
          error instanceof ProfileNotFoundError ||
          error instanceof ProfileServiceUnavailableError) {
        throw error;
      }

      return {
        success: false,
        error: (error as Error).message || 'Failed to delete avatar'
      };
    }
  }

  /**
   * Log GDPR audit event for avatar deletion
   */
  private async logGDPRAuditEvent(userId: string, correlationId: string): Promise<void> {
    try {
      // Import GDPRAuditService dynamically to avoid constructor issues
      const { GDPRAuditService } = await import('../../data/services/gdpr-audit.service');
      const gdprAuditService = new GDPRAuditService();
      
      await gdprAuditService.logProfileDeletion(userId, {
        strategy: 'avatar_deletion',
        reason: 'User requested avatar deletion',
        performedBy: userId,
        backupCreated: false,
        legalBasis: 'user_consent',
        metadata: {
          correlationId,
          operation: 'delete_avatar'
        }
      });
    } catch (error) {
      this.logger.error('GDPR audit logging failed', LogCategory.AUDIT, {
        correlationId,
        metadata: { userId, operation: 'gdpr_audit_error' }
      }, error as Error);
    }
  }
} 