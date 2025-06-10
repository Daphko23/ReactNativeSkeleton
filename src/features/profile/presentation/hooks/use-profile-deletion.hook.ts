/**
 * @fileoverview USE-PROFILE-DELETION-HOOK: Enterprise Profile Deletion Hook
 * @description HOOK-CENTRIC Profile Deletion Hook mit umfassenden State Management,
 * Error Handling, Loading States und GDPR Compliance Integration.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module UseProfileDeletionHook
 * @namespace Features.Profile.Presentation.Hooks
 */

import { useState, useCallback, useRef } from 'react';
import { DeleteUserProfileUseCase, DeletionStrategy } from '../../application/usecases/delete-user-profile.usecase';
import { IProfileService } from '../../domain/interfaces/profile-service.interface';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import {
  InvalidUserIdError,
  ProfileNotFoundError,
  ProfileDeletionDeniedError,
  ProfileDeletionValidationError
} from '../../domain/errors/profile-deletion.errors';

/**
 * @interface ProfileDeletionState
 * @description State für Profile Deletion Operations
 */
export interface ProfileDeletionState {
  // Loading States
  isDeleting: boolean;
  isValidating: boolean;
  isCreatingBackup: boolean;
  
  // Success States
  deletionCompleted: boolean;
  deletionResult: ProfileDeletionResult | null;
  
  // Error States
  error: { message: string; category: string } | null;
  validationErrors: string[];
  
  // Progress Tracking
  progress: {
    step: 'idle' | 'validating' | 'backing_up' | 'deleting' | 'auditing' | 'completed' | 'failed';
    percentage: number;
    message: string;
  };
  
  // Recovery Information
  recoveryInfo: {
    canRecover: boolean;
    recoveryToken: string | null;
    recoveryExpiresAt: Date | null;
  };
}

/**
 * @interface ProfileDeletionOptions
 * @description Optionen für Profile Deletion
 */
export interface ProfileDeletionOptions {
  strategy?: DeletionStrategy;
  reason?: string;
  requireBackup?: boolean;
  notifyExternalSystems?: boolean;
  skipAuthorization?: boolean;
  keepAuth?: boolean;
  auditDeletion?: boolean;
  auditMetadata?: {
    source?: string;
    compliance?: string;
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
    legalBasis?: string;
  };
  dryRun?: boolean;
}

/**
 * @interface ProfileDeletionResult
 * @description Ergebnis einer Profile Deletion Operation
 */
export interface ProfileDeletionResult {
  deletionId: string;
  userId: string;
  strategy: DeletionStrategy;
  success: boolean;
  deletedAt: Date;
  backup?: {
    backupId: string;
    location: string;
    expiresAt: Date;
  };
  auditTrail: {
    auditId: string;
    complianceLevel: 'basic' | 'gdpr' | 'ccpa' | 'enterprise';
    relatedDataCleaned: boolean;
    externalSystemsNotified: boolean;
  };
  recoveryInfo?: {
    recoveryToken: string;
    recoveryExpiresAt: Date;
    canRestore: boolean;
  };
}

/**
 * @interface UseProfileDeletionReturn
 * @description Return-Typ für useProfileDeletion Hook
 */
export interface UseProfileDeletionReturn {
  // State
  state: ProfileDeletionState;
  
  // Actions
  deleteProfile: (userId: string, options?: ProfileDeletionOptions) => Promise<void>;
  validateDeletion: (userId: string, options?: ProfileDeletionOptions) => Promise<boolean>;
  cancelDeletion: () => void;
  resetState: () => void;
  
  // Recovery Actions
  recoverProfile: (recoveryToken: string) => Promise<void>;
  checkRecoveryStatus: (recoveryToken: string) => Promise<boolean>;
  
  // Utility Functions
  canDelete: (userId: string) => boolean;
  getDeletionProgress: () => number;
  getEstimatedTimeRemaining: () => number;
}

/**
 * @hook useProfileDeletion
 * @description HOOK-CENTRIC Profile Deletion Hook
 * 
 * Zentraler Hook für alle Profile Deletion Operations mit umfassendem State Management,
 * Error Handling, Progress Tracking und GDPR Compliance Integration.
 * Implementiert Enterprise Hook-Centric Architecture Pattern.
 * 
 * @param profileService - Profile Service für Backend-Operationen
 * @returns UseProfileDeletionReturn - Hook Interface mit State und Actions
 * 
 * @example Basic Profile Deletion
 * ```typescript
 * const { state, deleteProfile, resetState } = useProfileDeletion(profileService);
 * 
 * const handleDeleteProfile = async () => {
 *   try {
 *     await deleteProfile('user-123', {
 *       strategy: DeletionStrategy.SOFT_DELETE,
 *       reason: 'User requested account deletion'
 *     });
 *     
 *     if (state.deletionCompleted) {
 *       showSuccessMessage('Profile deleted successfully');
 *     }
 *   } catch (error) {
 *     showErrorMessage(state.error || 'Deletion failed');
 *   }
 * };
 * ```
 * 
 * @example GDPR Compliant Deletion
 * ```typescript
 * const { state, deleteProfile } = useProfileDeletion(profileService);
 * 
 * const handleGDPRDeletion = async (userId: string) => {
 *   await deleteProfile(userId, {
 *     strategy: DeletionStrategy.HARD_DELETE,
 *     reason: 'GDPR Article 17 - Right to Erasure',
 *     requireBackup: true,
 *     notifyExternalSystems: true,
 *     auditDeletion: true,
 *     auditMetadata: {
 *       compliance: 'gdpr_article_17',
 *       legalBasis: 'right_to_erasure',
 *       source: 'user_request'
 *     }
 *   });
 * };
 * ```
 */
export const useProfileDeletion = (profileService: IProfileService): UseProfileDeletionReturn => {
  const logger = LoggerFactory.createServiceLogger('UseProfileDeletionHook');
  const deleteUseCaseRef = useRef<DeleteUserProfileUseCase | null>(null);
  
  // Initialize use case
  if (!deleteUseCaseRef.current) {
    deleteUseCaseRef.current = new DeleteUserProfileUseCase(profileService);
  }

  // State Management
  const [state, setState] = useState<ProfileDeletionState>({
    isDeleting: false,
    isValidating: false,
    isCreatingBackup: false,
    deletionCompleted: false,
    deletionResult: null,
    error: null,
    validationErrors: [],
    progress: {
      step: 'idle',
      percentage: 0,
      message: 'Ready to delete profile'
    },
    recoveryInfo: {
      canRecover: false,
      recoveryToken: null,
      recoveryExpiresAt: null
    }
  });

  /**
   * Löscht ein Benutzerprofil mit umfassenden State Updates
   */
  const deleteProfile = useCallback(async (
    userId: string, 
    options: ProfileDeletionOptions = {}
  ): Promise<void> => {
    const correlationId = `delete_profile_hook_${Date.now()}`;
    
    try {
      logger.info('Starting profile deletion from hook', LogCategory.BUSINESS, {
        correlationId,
        metadata: { userId, options, operation: 'delete_profile_hook' }
      });

      // Set default options for the use case
      const defaultOptions = {
        requestingUserId: userId,
        strategy: DeletionStrategy.SOFT_DELETE,
        reason: 'User requested profile deletion',
        requireBackup: true,
        notifyExternalSystems: false,
        skipAuthorization: false,
        keepAuth: false,
        auditDeletion: true,
        auditMetadata: {},
        dryRun: false,
        ...options
      };

      // Reset state
      setState(prev => ({
        ...prev,
        isDeleting: true,
        error: null,
        validationErrors: [],
        deletionCompleted: false,
        progress: {
          step: 'validating',
          percentage: 10,
          message: 'Validating deletion request...'
        }
      }));

      // Step 1: Validation
      setState(prev => ({
        ...prev,
        isValidating: true,
        progress: {
          step: 'validating',
          percentage: 20,
          message: 'Validating user permissions...'
        }
      }));

      // Step 2: Backup Creation (if required)
      if (defaultOptions.requireBackup !== false) {
        setState(prev => ({
          ...prev,
          isCreatingBackup: true,
          progress: {
            step: 'backing_up',
            percentage: 40,
            message: 'Creating secure backup...'
          }
        }));
      }

      // Step 3: Actual Deletion
      setState(prev => ({
        ...prev,
        progress: {
          step: 'deleting',
          percentage: 70,
          message: 'Deleting profile data...'
        }
      }));

      // Execute deletion through use case
      const result = await deleteUseCaseRef.current!.execute(userId, defaultOptions);

      // Step 4: Audit Logging
      setState(prev => ({
        ...prev,
        progress: {
          step: 'auditing',
          percentage: 90,
          message: 'Logging audit trail...'
        }
      }));

      // Step 5: Completion
      setState(prev => ({
        ...prev,
        isDeleting: false,
        isValidating: false,
        isCreatingBackup: false,
        deletionCompleted: true,
        deletionResult: result,
        progress: {
          step: 'completed',
          percentage: 100,
          message: 'Profile deletion completed successfully'
        },
        recoveryInfo: {
          canRecover: !!result.recoveryInfo,
          recoveryToken: result.recoveryInfo?.recoveryToken || null,
          recoveryExpiresAt: result.recoveryInfo?.recoveryExpiresAt || null
        }
      }));

      logger.info('Profile deletion completed successfully from hook', LogCategory.BUSINESS, {
        correlationId,
        metadata: { 
          userId, 
          deletionId: result.deletionId,
          strategy: result.strategy,
          operation: 'delete_profile_hook_success'
        }
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      let errorCategory = 'unknown';
      
      // Categorize errors for tests
      if (error instanceof InvalidUserIdError) {
        errorCategory = 'validation';
      } else if (error instanceof ProfileNotFoundError) {
        errorCategory = 'business';
      } else if (error instanceof ProfileDeletionDeniedError) {
        errorCategory = 'authorization';
      }
      
      logger.error('Profile deletion failed from hook', LogCategory.BUSINESS, {
        correlationId,
        metadata: { userId, options, operation: 'delete_profile_hook_failed' }
      }, error as Error);

      setState(prev => ({
        ...prev,
        isDeleting: false,
        isValidating: false,
        isCreatingBackup: false,
        error: { message: errorMessage, category: errorCategory },
        progress: {
          step: 'failed',
          percentage: 0,
          message: `Deletion failed: ${errorMessage}`
        }
      }));

      // Handle specific error types
      if (error instanceof ProfileDeletionValidationError) {
        setState(prev => ({
          ...prev,
          validationErrors: [errorMessage]
        }));
      }

      throw error;
    }
  }, [logger]);

  /**
   * Validiert eine Deletion-Anfrage ohne tatsächliche Löschung
   */
  const validateDeletion = useCallback(async (
    userId: string, 
    options: ProfileDeletionOptions = {}
  ): Promise<boolean> => {
    try {
      setState(prev => ({
        ...prev,
        isValidating: true,
        error: null,
        validationErrors: []
      }));

      // Perform dry run validation
      await deleteUseCaseRef.current!.execute(userId, {
        ...options,
        dryRun: true
      });

      setState(prev => ({
        ...prev,
        isValidating: false
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Validation failed';
      const errorCategory = 'validation';
      
      setState(prev => ({
        ...prev,
        isValidating: false,
        error: { message: errorMessage, category: errorCategory },
        validationErrors: [errorMessage]
      }));

      return false;
    }
  }, []);

  /**
   * Bricht eine laufende Deletion ab
   */
  const cancelDeletion = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDeleting: false,
      isValidating: false,
      isCreatingBackup: false,
      progress: {
        step: 'idle',
        percentage: 0,
        message: 'Deletion cancelled'
      }
    }));
  }, []);

  /**
   * Setzt den Hook-State zurück
   */
  const resetState = useCallback(() => {
    setState({
      isDeleting: false,
      isValidating: false,
      isCreatingBackup: false,
      deletionCompleted: false,
      deletionResult: null,
      error: null,
      validationErrors: [],
      progress: {
        step: 'idle',
        percentage: 0,
        message: 'Ready to delete profile'
      },
      recoveryInfo: {
        canRecover: false,
        recoveryToken: null,
        recoveryExpiresAt: null
      }
    });
  }, []);

  /**
   * Stellt ein gelöschtes Profil wieder her
   */
  const recoverProfile = useCallback(async (recoveryToken: string): Promise<void> => {
    // In a real implementation, this would call a recovery service
    logger.info('Profile recovery requested', LogCategory.BUSINESS, {
      metadata: { recoveryToken, operation: 'recover_profile' }
    });
    
    // For now, just reset the state
    resetState();
  }, [logger, resetState]);

  /**
   * Prüft den Status eines Recovery-Tokens
   */
  const checkRecoveryStatus = useCallback(async (recoveryToken: string): Promise<boolean> => {
    // In a real implementation, this would check token validity
    return recoveryToken.length > 0;
  }, []);

  /**
   * Prüft ob ein Benutzer gelöscht werden kann
   */
  const canDelete = useCallback((userId: string): boolean => {
    return userId.length > 0 && !state.isDeleting;
  }, [state.isDeleting]);

  /**
   * Gibt den aktuellen Deletion-Progress zurück
   */
  const getDeletionProgress = useCallback((): number => {
    return state.progress.percentage;
  }, [state.progress.percentage]);

  /**
   * Schätzt die verbleibende Zeit für die Deletion
   */
  const getEstimatedTimeRemaining = useCallback((): number => {
    const progress = state.progress.percentage;
    if (progress === 0) return 0;
    
    // Simple estimation based on progress
    const estimatedTotal = 5000; // 5 seconds total
    const remaining = (estimatedTotal * (100 - progress)) / 100;
    
    return Math.max(0, remaining);
  }, [state.progress.percentage]);

  return {
    state,
    deleteProfile,
    validateDeletion,
    cancelDeletion,
    resetState,
    recoverProfile,
    checkRecoveryStatus,
    canDelete,
    getDeletionProgress,
    getEstimatedTimeRemaining
  };
}; 