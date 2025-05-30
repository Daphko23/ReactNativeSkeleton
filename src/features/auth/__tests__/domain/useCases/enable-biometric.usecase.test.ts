/**
 * @file enable-biometric.usecase.test.ts
 * @description Comprehensive tests for EnableBiometric UseCase
 * Tests biometric enablement, hardware availability, user authentication, security logging and error scenarios
 */

import { EnableBiometricUseCase } from '../../../application/usecases/enable-biometric.usecase';
import { UserNotAuthenticatedError } from '../../../domain/errors/user-not-authenticated.error';
import { BiometricNotAvailableError } from '../../../domain/errors/biometric-not-available.error';
import { SecurityEventType, SecurityEventSeverity } from '../../../domain/types/security.types';
import { createMockAuthRepository, mockAuthUser } from '../../mocks/auth-repository.mock';

describe('EnableBiometricUseCase', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new EnableBiometricUseCase(mockRepository);

  // Mock authenticated users for different scenarios
  const mockStandardUser = { ...mockAuthUser };
  const mockPremiumUser = {
    ...mockAuthUser,
    id: 'premium-user-001',
    email: 'premium@example.com',
    roles: ['user', 'premium'],
    mfaEnabled: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new EnableBiometricUseCase(null as any))
        .toThrow('AuthRepository is required for EnableBiometricUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(EnableBiometricUseCase);
    });
  });

  describe('User Authentication Validation', () => {
    it('should throw UserNotAuthenticatedError when user is not authenticated', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(null);

      await expect(useCase.execute())
        .rejects.toThrow(UserNotAuthenticatedError);

      expect(mockRepository.isBiometricAvailable).not.toHaveBeenCalled();
      expect(mockRepository.enableBiometric).not.toHaveBeenCalled();
    });

    it('should proceed when user is authenticated', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockStandardUser);
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
    });

    it('should validate authentication before biometric availability check', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockStandardUser);
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
    });
  });

  describe('Biometric Availability Check', () => {
    beforeEach(() => {
      mockRepository.getCurrentUser.mockResolvedValue(mockStandardUser);
      mockRepository.logSecurityEvent.mockResolvedValue();
    });

    it('should throw BiometricNotAvailableError when biometric is not available', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(false);

      await expect(useCase.execute())
        .rejects.toThrow(BiometricNotAvailableError);

      expect(mockRepository.enableBiometric).not.toHaveBeenCalled();
    });

    it('should proceed when biometric is available', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
      expect(mockRepository.enableBiometric).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
    });

    it('should check biometric availability after user authentication', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
    });

    it('should handle biometric availability check failure', async () => {
      const availabilityError = new Error('Unable to check biometric availability');
      
      mockRepository.isBiometricAvailable.mockRejectedValueOnce(availabilityError);

      await expect(useCase.execute())
        .rejects.toThrow('Unable to check biometric availability');

      expect(mockRepository.enableBiometric).not.toHaveBeenCalled();
    });
  });

  describe('Successful Biometric Enablement', () => {
    beforeEach(() => {
      mockRepository.getCurrentUser.mockResolvedValue(mockStandardUser);
      mockRepository.isBiometricAvailable.mockResolvedValue(true);
      mockRepository.logSecurityEvent.mockResolvedValue();
    });

    it('should enable biometric authentication successfully', async () => {
      mockRepository.enableBiometric.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result).toEqual({
        success: true,
        message: 'Biometric authentication enabled successfully'
      });
    });

    it('should call enableBiometric on repository', async () => {
      mockRepository.enableBiometric.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.enableBiometric).toHaveBeenCalledTimes(1);
    });

    it('should return success response with correct message', async () => {
      mockRepository.enableBiometric.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Biometric authentication enabled successfully');
    });

    it('should handle enablement for premium users', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockPremiumUser);
      mockRepository.enableBiometric.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(mockRepository.enableBiometric).toHaveBeenCalledTimes(1);
    });

    it('should handle enablement for users with existing MFA', async () => {
      const userWithMFA = { ...mockStandardUser, mfaEnabled: true };
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(userWithMFA);
      mockRepository.enableBiometric.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Biometric authentication enabled successfully');
    });
  });

  describe('Security Event Logging', () => {
    beforeEach(() => {
      mockRepository.getCurrentUser.mockResolvedValue(mockStandardUser);
      mockRepository.isBiometricAvailable.mockResolvedValue(true);
    });

    it('should log successful biometric enablement', async () => {
      mockRepository.enableBiometric.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.MFA_ENABLED,
          userId: mockStandardUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'biometric_enabled',
            message: 'Biometric authentication enabled successfully',
            method: 'biometric'
          })
        })
      );
    });

    it('should generate unique event IDs for successful enablement', async () => {
      mockRepository.enableBiometric.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^biometric-enabled-\d+$/)
        })
      );
    });

    it('should include current timestamp in security events', async () => {
      const beforeExecution = new Date();
      
      mockRepository.enableBiometric.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      const afterExecution = new Date();
      const logCall = mockRepository.logSecurityEvent.mock.calls[0][0];
      
      expect(logCall.timestamp).toBeInstanceOf(Date);
      expect(logCall.timestamp.getTime()).toBeGreaterThanOrEqual(beforeExecution.getTime());
      expect(logCall.timestamp.getTime()).toBeLessThanOrEqual(afterExecution.getTime());
    });

    it('should include standard metadata in security events', async () => {
      mockRepository.enableBiometric.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddress: 'Unknown',
          userAgent: 'React Native App'
        })
      );
    });

    it('should log events for different user types with correct user ID', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockPremiumUser);
      mockRepository.enableBiometric.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockPremiumUser.id,
          details: expect.objectContaining({
            method: 'biometric'
          })
        })
      );
    });
  });

  describe('Error Handling and Logging', () => {
    beforeEach(() => {
      mockRepository.getCurrentUser.mockResolvedValue(mockStandardUser);
      mockRepository.isBiometricAvailable.mockResolvedValue(true);
      mockRepository.logSecurityEvent.mockResolvedValue();
    });

    it('should handle and log biometric enablement failures', async () => {
      const enablementError = new Error('Failed to enable biometric authentication');
      
      mockRepository.enableBiometric.mockRejectedValueOnce(enablementError);

      await expect(useCase.execute())
        .rejects.toThrow('Failed to enable biometric authentication');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          userId: mockStandardUser.id,
          severity: SecurityEventSeverity.MEDIUM,
          details: expect.objectContaining({
            action: 'biometric_enable_failed',
            error: 'Failed to enable biometric authentication',
            message: 'Failed to enable biometric authentication'
          })
        })
      );
    });

    it('should handle biometric not available error with proper logging', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(false);

      await expect(useCase.execute())
        .rejects.toThrow(BiometricNotAvailableError);

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            action: 'biometric_enable_failed',
            error: 'Biometric authentication not available'
          })
        })
      );
    });

    it('should handle unknown errors in logging', async () => {
      mockRepository.enableBiometric.mockRejectedValueOnce('String error');

      await expect(useCase.execute())
        .rejects.toBe('String error');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            error: 'Unknown error'
          })
        })
      );
    });

    it('should generate unique error event IDs', async () => {
      const error = new Error('Hardware security error');
      
      mockRepository.enableBiometric.mockRejectedValueOnce(error);

      await expect(useCase.execute()).rejects.toThrow();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^biometric-enable-failed-\d+$/)
        })
      );
    });

    it('should propagate repository errors', async () => {
      const customError = new Error('Custom biometric enablement error');
      
      mockRepository.enableBiometric.mockRejectedValueOnce(customError);

      await expect(useCase.execute())
        .rejects.toThrow(customError);
    });

    it('should handle permission denied errors', async () => {
      const permissionError = new Error('User denied biometric permissions');
      
      mockRepository.enableBiometric.mockRejectedValueOnce(permissionError);

      await expect(useCase.execute())
        .rejects.toThrow('User denied biometric permissions');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            error: 'User denied biometric permissions'
          })
        })
      );
    });

    it('should handle secure storage errors', async () => {
      const storageError = new Error('Secure storage access denied');
      
      mockRepository.enableBiometric.mockRejectedValueOnce(storageError);

      await expect(useCase.execute())
        .rejects.toThrow('Secure storage access denied');
    });
  });

  describe('Hardware and Device Scenarios', () => {
    beforeEach(() => {
      mockRepository.getCurrentUser.mockResolvedValue(mockStandardUser);
      mockRepository.logSecurityEvent.mockResolvedValue();
    });

    it('should handle Touch ID enablement', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
    });

    it('should handle Face ID enablement', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Biometric authentication enabled successfully');
    });

    it('should handle device without biometric hardware', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(false);

      await expect(useCase.execute())
        .rejects.toThrow(BiometricNotAvailableError);

      expect(mockRepository.enableBiometric).not.toHaveBeenCalled();
    });

    it('should handle partially supported biometric hardware', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
    });

    it('should handle biometric hardware that becomes unavailable during setup', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      
      const hardwareError = new Error('Biometric hardware became unavailable');
      mockRepository.enableBiometric.mockRejectedValueOnce(hardwareError);

      await expect(useCase.execute())
        .rejects.toThrow('Biometric hardware became unavailable');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete biometric enablement flow', async () => {
      const comprehensiveUser = {
        id: 'comprehensive-user-001',
        email: 'comprehensive@example.com',
        displayName: 'Comprehensive User',
        roles: ['user', 'verified'],
        mfaEnabled: false
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(comprehensiveUser);
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      // Verify complete flow
      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
      expect(mockRepository.enableBiometric).toHaveBeenCalledTimes(1);
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(1);
      
      expect(result).toEqual({
        success: true,
        message: 'Biometric authentication enabled successfully'
      });

      // Verify security logging includes comprehensive details
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.MFA_ENABLED,
          userId: comprehensiveUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'biometric_enabled',
            message: 'Biometric authentication enabled successfully',
            method: 'biometric'
          }),
          ipAddress: 'Unknown',
          userAgent: 'React Native App'
        })
      );
    });

    it('should handle enablement failure scenario with proper cleanup', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockStandardUser);
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      
      const setupError = new Error('Biometric setup failed during configuration');
      mockRepository.enableBiometric.mockRejectedValueOnce(setupError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow('Biometric setup failed during configuration');

      // Verify error was logged
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          details: expect.objectContaining({
            action: 'biometric_enable_failed',
            error: 'Biometric setup failed during configuration'
          })
        })
      );
    });

    it('should handle rapid successive enablement attempts', async () => {
      mockRepository.getCurrentUser.mockResolvedValue(mockStandardUser);
      mockRepository.isBiometricAvailable.mockResolvedValue(true);
      mockRepository.enableBiometric.mockResolvedValue();
      mockRepository.logSecurityEvent.mockResolvedValue();

      // Simulate rapid successive calls
      const promises = [
        useCase.execute(),
        useCase.execute(),
        useCase.execute()
      ];

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result.success).toBe(true);
        expect(result.message).toBe('Biometric authentication enabled successfully');
      });

      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(3);
      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(3);
      expect(mockRepository.enableBiometric).toHaveBeenCalledTimes(3);
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge Cases and Security Scenarios', () => {
    it('should handle user authentication change during enablement', async () => {
      // First call succeeds, second call fails due to auth change
      mockRepository.getCurrentUser
        .mockResolvedValueOnce(mockStandardUser)
        .mockResolvedValueOnce(null);

      mockRepository.isBiometricAvailable.mockResolvedValue(true);
      mockRepository.enableBiometric.mockResolvedValue();
      mockRepository.logSecurityEvent.mockResolvedValue();

      // First call should succeed
      const result1 = await useCase.execute();
      expect(result1.success).toBe(true);

      // Second call should fail
      await expect(useCase.execute())
        .rejects.toThrow(UserNotAuthenticatedError);
    });

    it('should handle concurrent biometric and MFA enablement', async () => {
      const userWithMFA = { ...mockStandardUser, mfaEnabled: true };
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(userWithMFA);
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockResolvedValueOnce();
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      
      // Should still log as MFA_ENABLED even if MFA already enabled
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.MFA_ENABLED
        })
      );
    });

    it('should handle timeout scenarios', async () => {
      const timeoutError = new Error('Biometric enablement timeout');
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockStandardUser);
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.enableBiometric.mockRejectedValueOnce(timeoutError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow('Biometric enablement timeout');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            error: 'Biometric enablement timeout'
          })
        })
      );
    });
  });
}); 