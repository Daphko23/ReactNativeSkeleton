/**
 * @file update-password.usecase.test.ts
 * @description Comprehensive tests for UpdatePassword UseCase
 * Tests password updates, validation, security logging and error scenarios
 */

import { UpdatePasswordUseCase, UpdatePasswordRequest } from '../../../application/usecases/update-password.usecase';
import { UserNotAuthenticatedError } from '../../../domain/errors/user-not-authenticated.error';
import { PasswordPolicyViolationError } from '../../../domain/errors/password-policy-violation.error';
import { SecurityEventType, SecurityEventSeverity } from '../../../domain/types/security.types';
import { createMockAuthRepository, mockAuthUser } from '../../mocks/auth-repository.mock';

describe('UpdatePasswordUseCase', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new UpdatePasswordUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new UpdatePasswordUseCase(null as any)).toThrow('AuthRepository is required for UpdatePasswordUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(UpdatePasswordUseCase);
    });
  });

  describe('Request Validation', () => {
    const _validRequest = {
      currentPassword: 'CurrentPass123!',
      newPassword: 'NewSecurePass456!',
      confirmPassword: 'NewSecurePass456!'
    };

    it('should throw error when current password is missing', async () => {
      const invalidRequest: UpdatePasswordRequest = {
        currentPassword: '',
        newPassword: 'newPassword123'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);

      await expect(useCase.execute(invalidRequest))
        .rejects.toThrow('Current password and new password are required');
    });

    it('should throw error when new password is missing', async () => {
      const invalidRequest: UpdatePasswordRequest = {
        currentPassword: 'currentPassword123',
        newPassword: ''
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);

      await expect(useCase.execute(invalidRequest))
        .rejects.toThrow('Current password and new password are required');
    });

    it('should throw error when passwords do not match', async () => {
      const invalidRequest: UpdatePasswordRequest = {
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'differentPassword456'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);

      await expect(useCase.execute(invalidRequest))
        .rejects.toThrow('New password and confirmation do not match');
    });

    it('should throw error when new password is same as current', async () => {
      const invalidRequest: UpdatePasswordRequest = {
        currentPassword: 'samePassword123',
        newPassword: 'samePassword123'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);

      await expect(useCase.execute(invalidRequest))
        .rejects.toThrow('New password must be different from current password');
    });

    it('should accept valid request without confirm password', async () => {
      const validRequestNoConfirm: UpdatePasswordRequest = {
        currentPassword: 'currentPassword123',
        newPassword: 'newSecurePassword456'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute(validRequestNoConfirm);
      expect(result.success).toBe(true);
    });
  });

  describe('Authentication Validation', () => {
    it('should throw UserNotAuthenticatedError when user is not authenticated', async () => {
      const request: UpdatePasswordRequest = {
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword456'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(null);

      await expect(useCase.execute(request))
        .rejects.toThrow(UserNotAuthenticatedError);
      
      expect(mockRepository.updatePassword).not.toHaveBeenCalled();
    });
  });

  describe('Successful Password Update', () => {
    const validRequest: UpdatePasswordRequest = {
      currentPassword: 'oldPassword123',
      newPassword: 'newStrongPassword456',
      confirmPassword: 'newStrongPassword456'
    };

    it('should update password successfully', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute(validRequest);

      expect(mockRepository.updatePassword).toHaveBeenCalledWith('oldPassword123', 'newStrongPassword456');
      expect(result).toEqual({
        success: true,
        message: 'Password updated successfully'
      });
    });

    it('should log security event on successful update', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute(validRequest);

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.PASSWORD_CHANGED,
          userId: mockAuthUser.id,
          severity: SecurityEventSeverity.MEDIUM,
          details: expect.objectContaining({
            action: 'password_updated',
            message: 'Password updated successfully',
            method: 'manual',
            passwordLength: validRequest.newPassword.length
          })
        })
      );
    });

    it('should include password length in security event', async () => {
      const requestWithLongPassword: UpdatePasswordRequest = {
        currentPassword: 'old123',
        newPassword: 'veryLongNewPasswordWith123Characters'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute(requestWithLongPassword);

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            passwordLength: 36
          })
        })
      );
    });
  });

  describe('Error Handling', () => {
    const validRequest: UpdatePasswordRequest = {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword456'
    };

    it('should handle and log repository errors', async () => {
      const repositoryError = new Error('Repository update failed');
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockRejectedValueOnce(repositoryError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute(validRequest))
        .rejects.toThrow('Repository update failed');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          userId: mockAuthUser.id,
          severity: SecurityEventSeverity.HIGH,
          details: expect.objectContaining({
            action: 'password_update_failed',
            error: 'Repository update failed',
            message: 'Failed to update password',
            method: 'manual'
          })
        })
      );
    });

    it('should handle PasswordPolicyViolationError specifically', async () => {
      const policyError = new PasswordPolicyViolationError(['Password too weak']);
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockRejectedValueOnce(policyError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute(validRequest))
        .rejects.toThrow(PasswordPolicyViolationError);

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            action: 'password_update_failed',
            error: 'Password does not meet policy requirements'
          })
        })
      );
    });

    it('should handle unknown errors in logging', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockRejectedValueOnce('String error');
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute(validRequest))
        .rejects.toBe('String error');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            error: 'Unknown error'
          })
        })
      );
    });

    it('should propagate repository errors', async () => {
      const customError = new Error('Custom update error');
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockRejectedValueOnce(customError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute(validRequest))
        .rejects.toThrow(customError);
    });
  });

  describe('Security Event Logging', () => {
    const request: UpdatePasswordRequest = {
      currentPassword: 'current123',
      newPassword: 'newSecure456'
    };

    it('should generate unique event IDs', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute(request);

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^password-updated-\d+$/)
        })
      );
    });

    it('should include current timestamp in events', async () => {
      const beforeExecution = new Date();
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute(request);

      const afterExecution = new Date();
      const logCall = mockRepository.logSecurityEvent.mock.calls[0][0];
      
      expect(logCall.timestamp).toBeInstanceOf(Date);
      expect(logCall.timestamp.getTime()).toBeGreaterThanOrEqual(beforeExecution.getTime());
      expect(logCall.timestamp.getTime()).toBeLessThanOrEqual(afterExecution.getTime());
    });

    it('should include standard metadata in events', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute(request);

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddress: 'Unknown',
          userAgent: 'React Native App'
        })
      );
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete password update flow', async () => {
      const complexRequest: UpdatePasswordRequest = {
        currentPassword: 'MyOldPassword123!',
        newPassword: 'MyNewSecurePassword456@',
        confirmPassword: 'MyNewSecurePassword456@'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.updatePassword.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute(complexRequest);

      // Verify complete flow
      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockRepository.updatePassword).toHaveBeenCalledWith(
        'MyOldPassword123!', 
        'MyNewSecurePassword456@'
      );
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(1);
      
      expect(result).toEqual({
        success: true,
        message: 'Password updated successfully'
      });
    });
  });
}); 