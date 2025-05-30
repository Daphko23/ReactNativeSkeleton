/**
 * @file verify-mfa.usecase.test.ts
 * @description Comprehensive tests for VerifyMFA UseCase
 * Tests MFA code verification, challenge validation, and security logging
 */

import { VerifyMFAUseCase, VerifyMFARequest } from '../../../application/usecases/verify-mfa.usecase';
import { SecurityEventType, SecurityEventSeverity } from '../../../domain/types/security.types';
import { createMockAuthRepository, mockAuthUser } from '../../mocks/auth-repository.mock';

describe('VerifyMFAUseCase', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new VerifyMFAUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new VerifyMFAUseCase(null as any)).toThrow('AuthRepository is required for VerifyMFAUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(VerifyMFAUseCase);
    });
  });

  describe('Input Validation', () => {
    it('should throw error when challengeId is missing', async () => {
      const invalidRequest: VerifyMFARequest = {
        challengeId: '',
        code: '123456'
      };

      await expect(useCase.execute(invalidRequest))
        .rejects.toThrow('Challenge ID and verification code are required');
    });

    it('should throw error when code is missing', async () => {
      const invalidRequest: VerifyMFARequest = {
        challengeId: 'challenge_123',
        code: ''
      };

      await expect(useCase.execute(invalidRequest))
        .rejects.toThrow('Challenge ID and verification code are required');
    });

    it('should throw error when code is too short', async () => {
      const invalidRequest: VerifyMFARequest = {
        challengeId: 'challenge_123',
        code: '123'
      };

      await expect(useCase.execute(invalidRequest))
        .rejects.toThrow('Invalid verification code format');
    });

    it('should throw error when code is too long', async () => {
      const invalidRequest: VerifyMFARequest = {
        challengeId: 'challenge_123',
        code: '123456789'
      };

      await expect(useCase.execute(invalidRequest))
        .rejects.toThrow('Invalid verification code format');
    });

    it('should accept valid code lengths (4-8 characters)', async () => {
      const validRequest: VerifyMFARequest = {
        challengeId: 'challenge_123',
        code: '1234'
      };

      mockRepository.verifyMFAChallenge.mockResolvedValueOnce(mockAuthUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute(validRequest)).resolves.toBeDefined();
    });
  });

  describe('Successful Verification', () => {
    const validRequest: VerifyMFARequest = {
      challengeId: 'challenge_abc123',
      code: '123456'
    };

    it('should verify MFA code successfully', async () => {
      // Arrange
      mockRepository.verifyMFAChallenge.mockResolvedValueOnce(mockAuthUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(mockRepository.verifyMFAChallenge).toHaveBeenCalledWith('123456', 'challenge_abc123');
      expect(result).toEqual({
        success: true,
        user: mockAuthUser
      });
    });

    it('should log security event on successful verification', async () => {
      // Arrange
      mockRepository.verifyMFAChallenge.mockResolvedValueOnce(mockAuthUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      await useCase.execute(validRequest);

      // Assert
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.LOGIN,
          userId: mockAuthUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'mfa_verified',
            challengeId: 'challenge_abc123',
            message: 'MFA verification successful',
            method: 'mfa'
          })
        })
      );
    });

    it('should include factorId in security event when provided', async () => {
      // Arrange
      const requestWithFactor: VerifyMFARequest = {
        challengeId: 'challenge_abc123',
        code: '123456',
        factorId: 'factor_totp_001'
      };
      mockRepository.verifyMFAChallenge.mockResolvedValueOnce(mockAuthUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      await useCase.execute(requestWithFactor);

      // Assert
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            factorId: 'factor_totp_001'
          })
        })
      );
    });
  });

  describe('Failed Verification', () => {
    const validRequest: VerifyMFARequest = {
      challengeId: 'challenge_abc123',
      code: '123456'
    };

    it('should handle verification failure and log security event', async () => {
      // Arrange
      const verificationError = new Error('Invalid MFA code');
      mockRepository.verifyMFAChallenge.mockRejectedValueOnce(verificationError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act & Assert
      await expect(useCase.execute(validRequest))
        .rejects.toThrow('Invalid MFA code');

      // Verify failure is logged
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          severity: SecurityEventSeverity.HIGH,
          details: expect.objectContaining({
            action: 'mfa_verify_failed',
            challengeId: 'challenge_abc123',
            error: 'Invalid MFA code',
            message: 'MFA verification failed',
            codeLength: 6
          })
        })
      );
    });

    it('should handle unknown errors in logging', async () => {
      // Arrange
      mockRepository.verifyMFAChallenge.mockRejectedValueOnce('String error');
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act & Assert
      await expect(useCase.execute(validRequest))
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
      const customError = new Error('Custom verification error');
      mockRepository.verifyMFAChallenge.mockRejectedValueOnce(customError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act & Assert
      await expect(useCase.execute(validRequest))
        .rejects.toThrow(customError);
    });
  });

  describe('TOTP Verification Scenarios', () => {
    it('should handle TOTP code verification', async () => {
      // Arrange
      const totpRequest: VerifyMFARequest = {
        challengeId: 'challenge_totp_123',
        code: '654321',
        factorId: 'factor_totp_001'
      };
      mockRepository.verifyMFAChallenge.mockResolvedValueOnce(mockAuthUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      const result = await useCase.execute(totpRequest);

      // Assert
      expect(mockRepository.verifyMFAChallenge).toHaveBeenCalledWith('654321', 'challenge_totp_123');
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockAuthUser);
    });
  });

  describe('SMS Verification Scenarios', () => {
    it('should handle SMS code verification', async () => {
      // Arrange
      const smsRequest: VerifyMFARequest = {
        challengeId: 'challenge_sms_456',
        code: '789012',
        factorId: 'factor_sms_002'
      };
      mockRepository.verifyMFAChallenge.mockResolvedValueOnce(mockAuthUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      const result = await useCase.execute(smsRequest);

      // Assert
      expect(mockRepository.verifyMFAChallenge).toHaveBeenCalledWith('789012', 'challenge_sms_456');
      expect(result.success).toBe(true);
    });
  });

  describe('Backup Code Scenarios', () => {
    it('should handle backup code verification', async () => {
      // Arrange
      const backupRequest: VerifyMFARequest = {
        challengeId: 'challenge_backup_789',
        code: '12345678',
        factorId: 'factor_backup'
      };
      mockRepository.verifyMFAChallenge.mockResolvedValueOnce(mockAuthUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      const result = await useCase.execute(backupRequest);

      // Assert
      expect(mockRepository.verifyMFAChallenge).toHaveBeenCalledWith('12345678', 'challenge_backup_789');
      expect(result.success).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle 4-digit codes (minimum length)', async () => {
      const request: VerifyMFARequest = {
        challengeId: 'challenge_123',
        code: '1234'
      };
      
      mockRepository.verifyMFAChallenge.mockResolvedValueOnce(mockAuthUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute(request);
      expect(result.success).toBe(true);
    });

    it('should handle 8-digit codes (maximum length)', async () => {
      const request: VerifyMFARequest = {
        challengeId: 'challenge_123',
        code: '12345678'
      };
      
      mockRepository.verifyMFAChallenge.mockResolvedValueOnce(mockAuthUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute(request);
      expect(result.success).toBe(true);
    });
  });

  describe('Security Event Logging', () => {
    it('should log code length in failure events for security analysis', async () => {
      // Arrange
      const request: VerifyMFARequest = {
        challengeId: 'challenge_123',
        code: '12345'
      };
      mockRepository.verifyMFAChallenge.mockRejectedValueOnce(new Error('Invalid code'));
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      await expect(useCase.execute(request)).rejects.toThrow();

      // Assert
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            codeLength: 5
          })
        })
      );
    });

    it('should always log failure with high severity', async () => {
      // Arrange
      const request: VerifyMFARequest = {
        challengeId: 'challenge_123',
        code: '123456'
      };
      mockRepository.verifyMFAChallenge.mockRejectedValueOnce(new Error('Failed'));
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      // Act
      await expect(useCase.execute(request)).rejects.toThrow();

      // Assert
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: SecurityEventSeverity.HIGH
        })
      );
    });
  });
}); 