/**
 * @file authenticate-with-biometric.usecase.test.ts
 * @description Comprehensive tests for AuthenticateWithBiometric UseCase
 * Tests biometric authentication, hardware availability, security logging and error scenarios
 */

import { AuthenticateWithBiometricUseCase } from '../../../application/usecases/authenticate-with-biometric.usecase';
import { BiometricNotAvailableError } from '../../../domain/errors/biometric-not-available.error';
import { SecurityEventType, SecurityEventSeverity } from '../../../domain/types/security.types';

import { createMockAuthRepository } from '../../mocks/auth-repository.mock';
import { createMockAuthUser } from '../../../helpers/auth-user-test.factory';

describe('AuthenticateWithBiometricUseCase', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new AuthenticateWithBiometricUseCase(mockRepository);

  // Mock biometric authenticated users
  const mockBiometricUser = createMockAuthUser({
    id: 'biometric-user-001',
    email: 'biometric@example.com',
    displayName: 'Biometric User',
    avatarUrl: 'https://example.com/biometric-user.jpg',
    phoneVerified: true,
    mfaEnabled: false,
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  });

  const mockPremiumBiometricUser = createMockAuthUser({
    id: 'premium-biometric-user-001',
    email: 'premium.biometric@example.com',
    displayName: 'Premium Biometric User',
    avatarUrl: 'https://example.com/premium-biometric-user.jpg',
    phoneVerified: true,
    mfaEnabled: true,
    lastLoginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new AuthenticateWithBiometricUseCase(null as any))
        .toThrow('AuthRepository is required for AuthenticateWithBiometricUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(AuthenticateWithBiometricUseCase);
    });
  });

  describe('Biometric Availability Check', () => {
    it('should throw BiometricNotAvailableError when biometric is not available', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(false);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow(BiometricNotAvailableError);

      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
      expect(mockRepository.authenticateWithBiometric).not.toHaveBeenCalled();
    });

    it('should proceed when biometric is available', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
      expect(mockRepository.authenticateWithBiometric).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
    });

    it('should check biometric availability before authentication', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
      expect(mockRepository.authenticateWithBiometric).toHaveBeenCalledTimes(1);
    });
  });

  describe('Successful Biometric Authentication', () => {
    beforeEach(() => {
      mockRepository.isBiometricAvailable.mockResolvedValue(true);
      mockRepository.logSecurityEvent.mockResolvedValue();
    });

    it('should authenticate user with biometric successfully', async () => {
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);

      const result = await useCase.execute();

      expect(result).toEqual({
        success: true,
        user: mockBiometricUser,
        message: 'Biometric authentication successful'
      });
    });

    it('should authenticate premium user with biometric successfully', async () => {
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockPremiumBiometricUser);

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.user.role).toBe('user');
      expect(result.user.metadata.mfaEnabled).toBe(true);
    });

    it('should return authenticated user details correctly', async () => {
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);

      const result = await useCase.execute();

      expect(result.user.id).toBe('biometric-user-001');
      expect(result.user.email).toBe('biometric@example.com');
      expect(result.user.getDisplayName()).toBe('Biometric User');
      expect(result.user.emailVerified).toBe(true);
      expect(result.user.profile?.phoneVerified).toBe(true);
    });

    it('should handle user with minimal profile data', async () => {
      const minimalBiometricUser = createMockAuthUser({
        id: 'minimal-biometric-001',
        email: 'minimal@example.com',
        displayName: 'Minimal User',
        avatarUrl: undefined,
        phoneVerified: false,
        mfaEnabled: false,
      });

      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(minimalBiometricUser);

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.user.profile?.avatarUrl).toBeUndefined();
      expect(result.user.profile?.phoneVerified).toBe(false);
    });
  });

  describe('Security Event Logging', () => {
    beforeEach(() => {
      mockRepository.isBiometricAvailable.mockResolvedValue(true);
    });

    it('should log successful biometric authentication', async () => {
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.LOGIN,
          userId: mockBiometricUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'biometric_auth_success',
            message: 'Biometric authentication successful',
            method: 'biometric',
            authType: 'biometric'
          })
        })
      );
    });

    it('should generate unique event IDs for successful authentication', async () => {
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^biometric-auth-success-\d+$/)
        })
      );
    });

    it('should include current timestamp in security events', async () => {
      const beforeExecution = new Date();
      
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      const afterExecution = new Date();
      const logCall = mockRepository.logSecurityEvent.mock.calls[0][0];
      
      expect(logCall.timestamp).toBeInstanceOf(Date);
      expect(logCall.timestamp.getTime()).toBeGreaterThanOrEqual(beforeExecution.getTime());
      expect(logCall.timestamp.getTime()).toBeLessThanOrEqual(afterExecution.getTime());
    });

    it('should include standard metadata in security events', async () => {
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddress: 'Unknown',
          userAgent: 'React Native App'
        })
      );
    });

    it('should log events for different user types consistently', async () => {
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockPremiumBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockPremiumBiometricUser.id,
          details: expect.objectContaining({
            method: 'biometric',
            authType: 'biometric'
          })
        })
      );
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mockRepository.isBiometricAvailable.mockResolvedValue(true);
      mockRepository.logSecurityEvent.mockResolvedValue();
    });

    it('should handle and log biometric authentication failures', async () => {
      const biometricError = new Error('Biometric authentication failed');
      
      mockRepository.authenticateWithBiometric.mockRejectedValueOnce(biometricError);

      await expect(useCase.execute())
        .rejects.toThrow('Biometric authentication failed');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          userId: 'unknown',
          severity: SecurityEventSeverity.HIGH,
          details: expect.objectContaining({
            action: 'biometric_auth_failed',
            error: 'Biometric authentication failed',
            message: 'Biometric authentication failed',
            method: 'biometric'
          })
        })
      );
    });

    it('should handle biometric not available error with proper logging', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(false);

      await expect(useCase.execute())
        .rejects.toThrow(BiometricNotAvailableError);

      // Should log the failed attempt
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            action: 'biometric_auth_failed',
            error: 'Biometric authentication not available'
          })
        })
      );
    });

    it('should handle unknown errors in logging', async () => {
      mockRepository.authenticateWithBiometric.mockRejectedValueOnce('String error');

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
      
      mockRepository.authenticateWithBiometric.mockRejectedValueOnce(error);

      await expect(useCase.execute()).rejects.toThrow();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^biometric-auth-failed-\d+$/)
        })
      );
    });

    it('should propagate repository errors', async () => {
      const customError = new Error('Custom biometric error');
      
      mockRepository.authenticateWithBiometric.mockRejectedValueOnce(customError);

      await expect(useCase.execute())
        .rejects.toThrow(customError);
    });

    it('should handle hardware security errors', async () => {
      const hardwareError = new Error('Secure enclave access denied');
      
      mockRepository.authenticateWithBiometric.mockRejectedValueOnce(hardwareError);

      await expect(useCase.execute())
        .rejects.toThrow('Secure enclave access denied');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: SecurityEventSeverity.HIGH,
          details: expect.objectContaining({
            error: 'Secure enclave access denied'
          })
        })
      );
    });

    it('should handle user cancellation gracefully', async () => {
      const cancellationError = new Error('User cancelled biometric authentication');
      
      mockRepository.authenticateWithBiometric.mockRejectedValueOnce(cancellationError);

      await expect(useCase.execute())
        .rejects.toThrow('User cancelled biometric authentication');
    });
  });

  describe('Biometric Hardware Scenarios', () => {
    it('should handle Touch ID availability', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
    });

    it('should handle Face ID availability', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockBiometricUser);
    });

    it('should handle device without biometric hardware', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(false);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow(BiometricNotAvailableError);

      expect(mockRepository.authenticateWithBiometric).not.toHaveBeenCalled();
    });

    it('should handle biometric hardware check failure', async () => {
      const hardwareCheckError = new Error('Unable to check biometric availability');
      
      mockRepository.isBiometricAvailable.mockRejectedValueOnce(hardwareCheckError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow('Unable to check biometric availability');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete biometric authentication flow', async () => {
      const comprehensiveBiometricUser = createMockAuthUser({
        id: 'comprehensive-biometric-001',
        email: 'comprehensive.biometric@example.com',
        displayName: 'Comprehensive Biometric User',
        avatarUrl: 'https://example.com/comprehensive-biometric.jpg',
        phoneVerified: true,
        mfaEnabled: true,
        lastLoginAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
      });

      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(comprehensiveBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      // Verify complete flow
      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(1);
      expect(mockRepository.authenticateWithBiometric).toHaveBeenCalledTimes(1);
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(1);
      
      expect(result).toEqual({
        success: true,
        user: comprehensiveBiometricUser,
        message: 'Biometric authentication successful'
      });

      // Verify security logging includes comprehensive details
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.LOGIN,
          userId: comprehensiveBiometricUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'biometric_auth_success',
            message: 'Biometric authentication successful',
            method: 'biometric',
            authType: 'biometric'
          }),
          ipAddress: 'Unknown',
          userAgent: 'React Native App'
        })
      );
    });

    it('should handle biometric authentication with fallback scenario', async () => {
      // First attempt: biometric not available
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(false);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow(BiometricNotAvailableError);

      // Verify no biometric authentication was attempted
      expect(mockRepository.authenticateWithBiometric).not.toHaveBeenCalled();
      
      // Verify error was logged
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            action: 'biometric_auth_failed'
          })
        })
      );
    });

    it('should handle multiple authentication types for premium users', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.authenticateWithBiometric.mockResolvedValueOnce(mockPremiumBiometricUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.user.metadata.mfaEnabled).toBe(true);
      expect(result.user.role).toBe('user');
      
      // Premium users should still use biometric for primary auth
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            method: 'biometric'
          })
        })
      );
    });
  });

  describe('Security and Performance Scenarios', () => {
    it('should handle rapid successive authentication attempts', async () => {
      mockRepository.isBiometricAvailable.mockResolvedValue(true);
      mockRepository.authenticateWithBiometric.mockResolvedValue(mockBiometricUser);
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
        expect(result.user).toEqual(mockBiometricUser);
      });

      expect(mockRepository.isBiometricAvailable).toHaveBeenCalledTimes(3);
      expect(mockRepository.authenticateWithBiometric).toHaveBeenCalledTimes(3);
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(3);
    });

    it('should handle timeout scenarios', async () => {
      const timeoutError = new Error('Biometric authentication timeout');
      
      mockRepository.isBiometricAvailable.mockResolvedValueOnce(true);
      mockRepository.authenticateWithBiometric.mockRejectedValueOnce(timeoutError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow('Biometric authentication timeout');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            error: 'Biometric authentication timeout'
          })
        })
      );
    });
  });
}); 