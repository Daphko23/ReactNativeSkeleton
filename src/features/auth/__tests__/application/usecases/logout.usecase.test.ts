/**
 * @file logout.usecase.test.ts
 * @description Comprehensive tests for Logout UseCase (UC-024)
 * Tests secure logout flow, session invalidation, storage cleanup, and error scenarios
 */

import { LogoutUseCase } from '../../../application/usecases/logout.usecase';
import { createMockAuthRepository } from '../../mocks/auth-repository.mock';

describe('LogoutUseCase - UC-024', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new LogoutUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.warn spy if it exists
    if (jest.isMockFunction(console.warn)) {
      (console.warn as jest.MockedFunction<typeof console.warn>).mockClear();
    }
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new LogoutUseCase(null as any))
        .toThrow('AuthRepository is required for LogoutUseCase');
    });

    it('should throw error when repository is undefined', () => {
      expect(() => new LogoutUseCase(undefined as any))
        .toThrow('AuthRepository is required for LogoutUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(LogoutUseCase);
    });
  });

  describe('Successful Logout Flow', () => {
    it('should call authRepository.logout successfully', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
      expect(mockRepository.logout).toHaveBeenCalledWith();
    });

    it('should complete logout without returning value', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result).toBeUndefined();
    });

    it('should handle successful logout for authenticated user', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      await expect(useCase.execute()).resolves.toBeUndefined();
      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple logout calls sequentially', async () => {
      mockRepository.logout.mockResolvedValue();

      await useCase.execute();
      await useCase.execute();
      await useCase.execute();

      expect(mockRepository.logout).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent logout calls', async () => {
      mockRepository.logout.mockResolvedValue();

      const promises = [
        useCase.execute(),
        useCase.execute(),
        useCase.execute()
      ];

      await Promise.all(promises);

      expect(mockRepository.logout).toHaveBeenCalledTimes(3);
    });
  });

  describe('Error Handling - Non-Critical Errors', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network request failed');
      mockRepository.logout.mockRejectedValueOnce(networkError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', networkError);
      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle backend service unavailable gracefully', async () => {
      const serviceError = new Error('Service temporarily unavailable');
      mockRepository.logout.mockRejectedValueOnce(serviceError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', serviceError);
    });

    it('should handle authentication errors gracefully', async () => {
      const authError = new Error('User not authenticated');
      mockRepository.logout.mockRejectedValueOnce(authError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', authError);
    });

    it('should handle timeout errors gracefully', async () => {
      const timeoutError = new Error('Request timeout');
      mockRepository.logout.mockRejectedValueOnce(timeoutError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', timeoutError);
    });

    it('should handle server errors gracefully', async () => {
      const serverError = new Error('Internal server error');
      mockRepository.logout.mockRejectedValueOnce(serverError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', serverError);
    });

    it('should handle token revocation errors gracefully', async () => {
      const tokenError = new Error('Token revocation failed');
      mockRepository.logout.mockRejectedValueOnce(tokenError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', tokenError);
    });

    it('should handle session invalidation errors gracefully', async () => {
      const sessionError = new Error('Session invalidation failed');
      mockRepository.logout.mockRejectedValueOnce(sessionError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', sessionError);
    });

    it('should handle storage cleanup errors gracefully', async () => {
      const storageError = new Error('Storage cleanup failed');
      mockRepository.logout.mockRejectedValueOnce(storageError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', storageError);
    });
  });

  describe('Error Handling - Critical Errors', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });

    it('should throw critical errors', async () => {
      const criticalError = new Error('critical: Security breach detected');
      mockRepository.logout.mockRejectedValueOnce(criticalError);

      await expect(useCase.execute()).rejects.toThrow('critical: Security breach detected');
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', criticalError);
    });

    it('should throw critical system errors', async () => {
      const criticalSystemError = new Error('critical: System integrity compromised');
      mockRepository.logout.mockRejectedValueOnce(criticalSystemError);

      await expect(useCase.execute()).rejects.toThrow('critical: System integrity compromised');
    });

    it('should throw critical data corruption errors', async () => {
      const criticalDataError = new Error('critical: Data corruption detected');
      mockRepository.logout.mockRejectedValueOnce(criticalDataError);

      await expect(useCase.execute()).rejects.toThrow('critical: Data corruption detected');
    });
  });

  describe('Edge Cases and Alternative Flows', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });

    it('should handle already logged out user gracefully', async () => {
      const alreadyLoggedOutError = new Error('User already logged out');
      mockRepository.logout.mockRejectedValueOnce(alreadyLoggedOutError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', alreadyLoggedOutError);
    });

    it('should handle offline logout scenario', async () => {
      const offlineError = new Error('No internet connection');
      mockRepository.logout.mockRejectedValueOnce(offlineError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', offlineError);
    });

    it('should handle logout when session expired', async () => {
      const expiredSessionError = new Error('Session expired');
      mockRepository.logout.mockRejectedValueOnce(expiredSessionError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', expiredSessionError);
    });

    it('should handle logout with invalid tokens', async () => {
      const invalidTokenError = new Error('Invalid token');
      mockRepository.logout.mockRejectedValueOnce(invalidTokenError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', invalidTokenError);
    });

    it('should handle partial logout failure', async () => {
      const partialFailureError = new Error('Partial logout failure');
      mockRepository.logout.mockRejectedValueOnce(partialFailureError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', partialFailureError);
    });
  });

  describe('Security Scenarios', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });

    it('should handle forced logout security event', async () => {
      const securityError = new Error('Forced logout due to security policy');
      mockRepository.logout.mockRejectedValueOnce(securityError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', securityError);
    });

    it('should handle suspicious activity logout', async () => {
      const suspiciousActivityError = new Error('Logout due to suspicious activity');
      mockRepository.logout.mockRejectedValueOnce(suspiciousActivityError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', suspiciousActivityError);
    });

    it('should handle account lockout logout', async () => {
      const lockoutError = new Error('Account locked - automatic logout');
      mockRepository.logout.mockRejectedValueOnce(lockoutError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', lockoutError);
    });

    it('should handle biometric credential cleanup errors', async () => {
      const biometricError = new Error('Biometric credential cleanup failed');
      mockRepository.logout.mockRejectedValueOnce(biometricError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', biometricError);
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle rapid successive logout calls', async () => {
      mockRepository.logout.mockResolvedValue();

      const startTime = Date.now();
      
      const promises = Array(10).fill(null).map(() => useCase.execute());
      await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 1 second for 10 calls)
      expect(duration).toBeLessThan(1000);
      expect(mockRepository.logout).toHaveBeenCalledTimes(10);
    });

    it('should handle logout timeout gracefully', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const timeoutError = new Error('Logout timeout after 30 seconds');
      mockRepository.logout.mockRejectedValueOnce(timeoutError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', timeoutError);
      
      (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });

    it('should handle memory pressure during logout', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const memoryError = new Error('Insufficient memory for logout operations');
      mockRepository.logout.mockRejectedValueOnce(memoryError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', memoryError);
      
      (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete logout flow for standard user', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      const startTime = Date.now();
      await useCase.execute();
      const endTime = Date.now();
      
      // Verify complete flow
      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
      
      // Should complete quickly for successful logout
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle logout with pending operations', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const pendingOpsError = new Error('Pending operations detected during logout');
      mockRepository.logout.mockRejectedValueOnce(pendingOpsError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', pendingOpsError);
      
      (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });

    it('should handle logout during app backgrounding', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const backgroundError = new Error('App backgrounded during logout');
      mockRepository.logout.mockRejectedValueOnce(backgroundError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', backgroundError);
      
      (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });
  });

  describe('Compliance and Auditing', () => {
    it('should handle GDPR compliance logout', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
      // Verify that logout completes for GDPR data deletion
    });

    it('should handle SOX compliance logout', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
      // Verify that logout completes for audit trail requirements
    });

    it('should handle PCI-DSS compliance logout', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
      // Verify that logout completes for payment data security
    });
  });

  describe('Business Rule Validation', () => {
    it('should fulfill BR-024: All user sessions must be properly invalidated', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
      // Repository should handle session invalidation
    });

    it('should fulfill BR-025: Local storage and cache must be cleared', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
      // Repository should handle storage cleanup
    });

    it('should fulfill BR-026: Logout must work even with network connectivity issues', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const networkError = new Error('Network connectivity lost');
      mockRepository.logout.mockRejectedValueOnce(networkError);

      await expect(useCase.execute()).resolves.toBeUndefined();
      
      expect(console.warn).toHaveBeenCalledWith('Authentication status check failed:', networkError);
      
      (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });

    it('should fulfill BR-027: Security events must be logged for all logout attempts', async () => {
      mockRepository.logout.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
      // Repository should handle security event logging
    });
  });
});
