/**
 * @file enable-mfa.usecase.test.ts
 * @description Comprehensive tests for EnableMFA UseCase
 * Tests MFA activation, error scenarios, and security logging
 */

import { EnableMFAUseCase, EnableMFARequest } from '../../../application/usecases/enable-mfa.usecase';
import { UserNotAuthenticatedError } from '../../../domain/errors/user-not-authenticated.error';
import { SecurityEventType, SecurityEventSeverity, MFAType } from '../../../domain/types/security.types';
import { createMockAuthRepository, mockAuthUser } from '../../mocks/auth-repository.mock';

describe('EnableMFAUseCase', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new EnableMFAUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new EnableMFAUseCase(null as any)).toThrow('AuthRepository is required for EnableMFAUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(EnableMFAUseCase);
    });
  });

  describe('TOTP MFA Activation', () => {
    const totpRequest: EnableMFARequest = { type: MFAType.TOTP };

    it('should enable TOTP MFA successfully', async () => {
      // Arrange
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.enableMFA.mockResolvedValueOnce({
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,test-qr-code'
      });
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      const result = await useCase.execute(totpRequest);

      // Assert
      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockRepository.enableMFA).toHaveBeenCalledWith(MFAType.TOTP);
      expect(result).toEqual({
        success: true,
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,test-qr-code',
        backupCodes: []
      });
    });

    it('should log security event on successful TOTP activation', async () => {
      // Arrange
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.enableMFA.mockResolvedValueOnce({
        secret: 'test-secret',
        qrCode: 'test-qr'
      });
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      await useCase.execute(totpRequest);

      // Assert
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.MFA_ENABLED,
          userId: mockAuthUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'mfa_enabled',
            mfaType: MFAType.TOTP,
            message: `MFA ${MFAType.TOTP} enabled successfully`
          })
        })
      );
    });
  });

  describe('SMS MFA Activation', () => {
    const smsRequest: EnableMFARequest = { 
      type: MFAType.SMS, 
      phoneNumber: '+1234567890' 
    };

    it('should enable SMS MFA with phone number', async () => {
      // Arrange
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.enableMFA.mockResolvedValueOnce({
        secret: undefined,
        qrCode: undefined
      });
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      const result = await useCase.execute(smsRequest);

      // Assert
      expect(mockRepository.enableMFA).toHaveBeenCalledWith(MFAType.SMS);
      expect(result.success).toBe(true);
      expect(result.secret).toBeUndefined();
      expect(result.qrCode).toBeUndefined();
    });

    it('should log phone number in security event details', async () => {
      // Arrange
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.enableMFA.mockResolvedValueOnce({});
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      await useCase.execute(smsRequest);

      // Assert
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            phoneNumber: '+1234567890',
            mfaType: MFAType.SMS
          })
        })
      );
    });

    it('should throw error when phone number is missing for SMS', async () => {
      // Arrange
      const invalidSmsRequest: EnableMFARequest = { type: MFAType.SMS };
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);

      // Act & Assert
      await expect(useCase.execute(invalidSmsRequest))
        .rejects.toThrow('Phone number is required for SMS MFA');
      
      expect(mockRepository.enableMFA).not.toHaveBeenCalled();
    });
  });

  describe('Email MFA Activation', () => {
    const emailRequest: EnableMFARequest = { type: MFAType.EMAIL };

    it('should enable Email MFA successfully', async () => {
      // Arrange
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.enableMFA.mockResolvedValueOnce({});
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      const result = await useCase.execute(emailRequest);

      // Assert
      expect(mockRepository.enableMFA).toHaveBeenCalledWith(MFAType.EMAIL);
      expect(result.success).toBe(true);
    });
  });

  describe('Authentication Validation', () => {
    it('should throw UserNotAuthenticatedError when user is not authenticated', async () => {
      // Arrange
      mockRepository.getCurrentUser.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(useCase.execute({ type: MFAType.TOTP }))
        .rejects.toThrow(UserNotAuthenticatedError);
      
      expect(mockRepository.enableMFA).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should log security event on MFA enablement failure', async () => {
      // Arrange
      const repositoryError = new Error('Repository failed');
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.enableMFA.mockRejectedValueOnce(repositoryError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act & Assert
      await expect(useCase.execute({ type: MFAType.TOTP }))
        .rejects.toThrow('Repository failed');

      // Verify failure is logged
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          severity: SecurityEventSeverity.MEDIUM,
          details: expect.objectContaining({
            action: 'mfa_enable_failed',
            error: 'Repository failed'
          })
        })
      );
    });

    it('should handle unknown errors in logging', async () => {
      // Arrange
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.enableMFA.mockRejectedValueOnce('String error');
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act & Assert
      await expect(useCase.execute({ type: MFAType.TOTP }))
        .rejects.toBe('String error');

      // Verify unknown error is logged
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            error: 'Unknown error'
          })
        })
      );
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const customError = new Error('Custom MFA error');
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.enableMFA.mockRejectedValueOnce(customError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act & Assert
      await expect(useCase.execute({ type: MFAType.TOTP }))
        .rejects.toThrow(customError);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete TOTP flow with all components', async () => {
      // Arrange
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.enableMFA.mockResolvedValueOnce({
        secret: 'COMPLETE_SECRET',
        qrCode: 'data:image/png;base64,complete'
      });
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      const result = await useCase.execute({ type: MFAType.TOTP });

      // Assert - Complete flow verification
      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockRepository.enableMFA).toHaveBeenCalledWith(MFAType.TOTP);
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(1);
      
      expect(result).toEqual({
        success: true,
        secret: 'COMPLETE_SECRET',
        qrCode: 'data:image/png;base64,complete',
        backupCodes: []
      });
    });
  });
}); 