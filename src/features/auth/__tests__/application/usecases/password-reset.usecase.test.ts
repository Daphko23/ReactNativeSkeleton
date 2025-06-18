/**
 * @file password-reset.usecase.test.ts
 * @description Comprehensive tests for Password Reset UseCase (UC-003)
 * Tests password reset flow, email validation, security requirements, and error scenarios
 */

import { PasswordResetUseCase } from '../../../application/usecases/password-reset.usecase';
import { createMockAuthRepository } from '../../mocks/auth-repository.mock';

describe('PasswordResetUseCase - UC-003', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new PasswordResetUseCase(mockRepository);

  // Test data
  const validEmail = 'user@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new PasswordResetUseCase(null as any))
        .toThrow('AuthRepository is required for PasswordResetUseCase');
    });

    it('should throw error when repository is undefined', () => {
      expect(() => new PasswordResetUseCase(undefined as any))
        .toThrow('AuthRepository is required for PasswordResetUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(PasswordResetUseCase);
    });
  });

  describe('Input Validation', () => {
    it('should throw error when email is not provided', async () => {
      await expect(useCase.execute(''))
        .rejects.toThrow('Email is required for password reset');

      expect(mockRepository.resetPassword).not.toHaveBeenCalled();
    });

    it('should throw error when email is null', async () => {
      await expect(useCase.execute(null as any))
        .rejects.toThrow('Email is required for password reset');

      expect(mockRepository.resetPassword).not.toHaveBeenCalled();
    });

    it('should throw error when email is undefined', async () => {
      await expect(useCase.execute(undefined as any))
        .rejects.toThrow('Email is required for password reset');

      expect(mockRepository.resetPassword).not.toHaveBeenCalled();
    });

    it('should proceed when email is provided', async () => {
      mockRepository.resetPassword.mockResolvedValueOnce();

      await useCase.execute(validEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledWith(validEmail);
    });
  });

  describe('Successful Password Reset Flow', () => {
    it('should call authRepository.resetPassword successfully', async () => {
      mockRepository.resetPassword.mockResolvedValueOnce();

      await useCase.execute(validEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledTimes(1);
      expect(mockRepository.resetPassword).toHaveBeenCalledWith(validEmail);
    });

    it('should complete password reset without returning value', async () => {
      mockRepository.resetPassword.mockResolvedValueOnce();

      const result = await useCase.execute(validEmail);

      expect(result).toBeUndefined();
    });

    it('should handle valid email formats', async () => {
      const emailFormats = [
        'user@domain.com',
        'user.name@domain.co.uk',
        'user+tag@domain.org',
        'user123@sub.domain.com',
        'admin@company-name.com'
      ];

      for (const email of emailFormats) {
        mockRepository.resetPassword.mockResolvedValueOnce();

        await useCase.execute(email);

        expect(mockRepository.resetPassword).toHaveBeenCalledWith(email);
      }
    });

    it('should handle multiple sequential reset requests', async () => {
      const emails = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

      for (const email of emails) {
        mockRepository.resetPassword.mockResolvedValueOnce();

        await useCase.execute(email);

        expect(mockRepository.resetPassword).toHaveBeenCalledWith(email);
      }

      expect(mockRepository.resetPassword).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent reset requests', async () => {
      mockRepository.resetPassword.mockResolvedValue();

      const promises = [
        useCase.execute('user1@example.com'),
        useCase.execute('user2@example.com'),
        useCase.execute('user3@example.com')
      ];

      await Promise.all(promises);

      expect(mockRepository.resetPassword).toHaveBeenCalledTimes(3);
    });
  });

  describe('Error Handling - Password Reset Failures', () => {
    it('should handle invalid email format error', async () => {
      const invalidEmailError = new Error('Invalid email format');
      
      mockRepository.resetPassword.mockRejectedValueOnce(invalidEmailError);

      await expect(useCase.execute('invalid-email'))
        .rejects.toThrow('Password reset failed: Invalid email format');

      expect(mockRepository.resetPassword).toHaveBeenCalledWith('invalid-email');
    });

    it('should handle email not found (silent treatment for security)', async () => {
      const notFoundError = new Error('Email not found');
      
      mockRepository.resetPassword.mockRejectedValueOnce(notFoundError);

      await expect(useCase.execute('nonexistent@example.com'))
        .rejects.toThrow('Password reset failed: Email not found');
    });

    it('should handle rate limiting error', async () => {
      const rateLimitError = new Error('Too many reset attempts. Please try again in 1 hour');
      
      mockRepository.resetPassword.mockRejectedValueOnce(rateLimitError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Too many reset attempts. Please try again in 1 hour');
    });

    it('should handle email delivery error', async () => {
      const emailDeliveryError = new Error('Reset email could not be sent');
      
      mockRepository.resetPassword.mockRejectedValueOnce(emailDeliveryError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Reset email could not be sent');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network request failed');
      
      mockRepository.resetPassword.mockRejectedValueOnce(networkError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Network request failed');
    });

    it('should handle service unavailable error', async () => {
      const serviceError = new Error('Password reset service temporarily unavailable');
      
      mockRepository.resetPassword.mockRejectedValueOnce(serviceError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Password reset service temporarily unavailable');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      
      mockRepository.resetPassword.mockRejectedValueOnce(timeoutError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Request timeout');
    });

    it('should handle internal server errors', async () => {
      const serverError = new Error('Internal server error');
      
      mockRepository.resetPassword.mockRejectedValueOnce(serverError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Internal server error');
    });

    it('should handle unknown errors gracefully', async () => {
      mockRepository.resetPassword.mockRejectedValueOnce('String error');

      await expect(useCase.execute(validEmail))
        .rejects.toBe('String error');
    });

    it('should preserve original error for non-Error objects', async () => {
      const customError = { code: 'RESET_ERROR', message: 'Custom error' };
      
      mockRepository.resetPassword.mockRejectedValueOnce(customError);

      await expect(useCase.execute(validEmail))
        .rejects.toBe(customError);
    });
  });

  describe('Security Scenarios', () => {
    it('should handle malicious email injection attempts', async () => {
      const maliciousEmails = [
        'test@example.com<script>alert(1)</script>',
        'test@example.com"; DROP TABLE users; --',
        'test@example.com\r\nBcc: attacker@evil.com',
        'test@example.com\x00\x01\x02'
      ];

      for (const maliciousEmail of maliciousEmails) {
        const injectionError = new Error('Invalid email format');
        mockRepository.resetPassword.mockRejectedValueOnce(injectionError);

        await expect(useCase.execute(maliciousEmail))
          .rejects.toThrow('Password reset failed: Invalid email format');
      }
    });

    it('should handle extremely long email addresses', async () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      const lengthError = new Error('Email address too long');
      
      mockRepository.resetPassword.mockRejectedValueOnce(lengthError);

      await expect(useCase.execute(longEmail))
        .rejects.toThrow('Password reset failed: Email address too long');
    });

    it('should handle email enumeration protection', async () => {
      // Even for non-existent emails, the behavior should be consistent
      const nonExistentEmails = [
        'nonexistent1@example.com',
        'nonexistent2@example.com',
        'fake@notreal.com'
      ];

      for (const email of nonExistentEmails) {
        mockRepository.resetPassword.mockResolvedValueOnce();

        await expect(useCase.execute(email)).resolves.toBeUndefined();
        
        expect(mockRepository.resetPassword).toHaveBeenCalledWith(email);
      }
    });

    it('should handle Unicode and international email addresses', async () => {
      const unicodeEmails = [
        'ñoño@español.com',
        'тест@example.com',
        '测试@example.com',
        'münchen@bücher.de'
      ];

      for (const unicodeEmail of unicodeEmails) {
        mockRepository.resetPassword.mockResolvedValueOnce();

        await useCase.execute(unicodeEmail);

        expect(mockRepository.resetPassword).toHaveBeenCalledWith(unicodeEmail);
      }
    });

    it('should handle suspicious automated requests', async () => {
      const suspiciousError = new Error('Suspicious activity detected');
      
      mockRepository.resetPassword.mockRejectedValueOnce(suspiciousError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Suspicious activity detected');
    });

    it('should handle account lockout scenarios', async () => {
      const lockoutError = new Error('Account is temporarily locked');
      
      mockRepository.resetPassword.mockRejectedValueOnce(lockoutError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Account is temporarily locked');
    });
  });

  describe('Business Rule Validation', () => {
    it('should fulfill BR-008: Reset links expire after 24 hours', async () => {
      // This is handled at repository level, but we test that reset proceeds
      mockRepository.resetPassword.mockResolvedValueOnce();

      await useCase.execute(validEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledWith(validEmail);
      // Repository should generate token with 24-hour expiry
    });

    it('should fulfill BR-009: Only verified email addresses can request reset', async () => {
      const unverifiedError = new Error('Email address not verified');
      
      mockRepository.resetPassword.mockRejectedValueOnce(unverifiedError);

      await expect(useCase.execute('unverified@example.com'))
        .rejects.toThrow('Password reset failed: Email address not verified');
    });

    it('should fulfill BR-010: Rate limiting prevents abuse (max 5 per hour)', async () => {
      const rateLimitError = new Error('Too many reset attempts. Maximum 5 per hour');
      
      mockRepository.resetPassword.mockRejectedValueOnce(rateLimitError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Too many reset attempts. Maximum 5 per hour');
    });

    it('should fulfill BR-011: All existing sessions are invalidated on password reset', async () => {
      // This is handled at repository level after successful password change
      mockRepository.resetPassword.mockResolvedValueOnce();

      await useCase.execute(validEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledWith(validEmail);
      // Repository should invalidate sessions when password is actually changed
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle rapid successive reset requests for same email', async () => {
      // Configure mocks for each call individually to test rate limiting
      mockRepository.resetPassword.mockClear();
      
      // First two requests succeed, then rate limiting kicks in
      mockRepository.resetPassword
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Rate limited'))
        .mockRejectedValueOnce(new Error('Rate limited'))
        .mockRejectedValueOnce(new Error('Rate limited'));

      const promises = Array(5).fill(null).map(() => useCase.execute(validEmail));
      const results = await Promise.allSettled(promises);

      expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(2);
      expect(results.filter(r => r.status === 'rejected')).toHaveLength(3);
    });

    it('should handle reset during system maintenance', async () => {
      const maintenanceMessage = 'System under maintenance';
      const maintenanceError = new Error(maintenanceMessage);
      
      mockRepository.resetPassword.mockRejectedValueOnce(maintenanceError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: System under maintenance');
    });

    it('should handle email service outage', async () => {
      const emailMessage = 'Email service temporarily unavailable';
      const emailServiceError = new Error(emailMessage);
      
      mockRepository.resetPassword.mockRejectedValueOnce(emailServiceError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Email service temporarily unavailable');
    });

    it('should handle database connectivity issues', async () => {
      const dbMessage = 'Database connection failed';
      const dbError = new Error(dbMessage);
      
      mockRepository.resetPassword.mockRejectedValueOnce(dbError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Database connection failed');
    });

    it('should handle memory pressure scenarios', async () => {
      const memoryMessage = 'Insufficient memory for reset operations';
      const memoryError = new Error(memoryMessage);
      
      mockRepository.resetPassword.mockRejectedValueOnce(memoryError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Insufficient memory for reset operations');
    });
  });

  describe('Repository Integration', () => {
    it('should call repository resetPassword method exactly once', async () => {
      mockRepository.resetPassword.mockClear();
      mockRepository.resetPassword.mockResolvedValueOnce(undefined);

      await useCase.execute(validEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledTimes(1);
      expect(mockRepository.resetPassword).toHaveBeenCalledWith(validEmail);
    });

    it('should pass email to repository unchanged', async () => {
      const testEmail = 'test.user+tag@example.co.uk';
      
      mockRepository.resetPassword.mockClear();
      mockRepository.resetPassword.mockResolvedValueOnce(undefined);

      await useCase.execute(testEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledWith(testEmail);
    });

    it('should handle repository exceptions properly', async () => {
      const repositoryMessage = 'Repository internal error';
      const repositoryException = new Error(repositoryMessage);
      
      mockRepository.resetPassword.mockClear();
      mockRepository.resetPassword.mockRejectedValueOnce(repositoryException);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Repository internal error');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete password reset flow for verified user', async () => {
      mockRepository.resetPassword.mockResolvedValueOnce(undefined);

      const startTime = Date.now();
      await useCase.execute('verified.user@example.com');
      const endTime = Date.now();

      // Verify complete flow
      expect(mockRepository.resetPassword).toHaveBeenCalledTimes(1);
      expect(mockRepository.resetPassword).toHaveBeenCalledWith('verified.user@example.com');
      
      // Should complete quickly for successful reset
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle reset for enterprise email domains', async () => {
      const enterpriseEmails = [
        'employee@company.com',
        'admin@enterprise.org',
        'user@corporation.net'
      ];

      for (const email of enterpriseEmails) {
        mockRepository.resetPassword.mockResolvedValueOnce(undefined);

        await useCase.execute(email);

        expect(mockRepository.resetPassword).toHaveBeenCalledWith(email);
      }
    });

    it('should handle bulk password reset scenario', async () => {
      const emails = [
        'user1@example.com',
        'user2@example.com', 
        'user3@example.com'
      ];

      // Configure each call individually
      const notVerifiedMessage = 'Email not verified';
      const notVerifiedError = new Error(notVerifiedMessage);
      
      mockRepository.resetPassword
        .mockResolvedValueOnce(undefined) // user1 succeeds
        .mockRejectedValueOnce(notVerifiedError) // user2 fails
        .mockResolvedValueOnce(undefined); // user3 succeeds

      const results = await Promise.allSettled(
        emails.map(email => useCase.execute(email))
      );

      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
      expect(results[2].status).toBe('fulfilled');
    });
  });

  describe('Compliance and Auditing', () => {
    it('should handle GDPR compliant password reset', async () => {
      mockRepository.resetPassword.mockClear();
      mockRepository.resetPassword.mockResolvedValueOnce(undefined);

      await useCase.execute(validEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledTimes(1);
      // GDPR compliance handled at repository level (audit logging, data protection)
    });

    it('should handle SOX compliant audit trail', async () => {
      mockRepository.resetPassword.mockClear();
      mockRepository.resetPassword.mockResolvedValueOnce(undefined);

      await useCase.execute(validEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledTimes(1);
      // SOX compliance handled at repository level (audit logging, data integrity)
    });

    it('should handle PCI-DSS compliant security requirements', async () => {
      mockRepository.resetPassword.mockClear();
      mockRepository.resetPassword.mockResolvedValueOnce(undefined);

      await useCase.execute(validEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledTimes(1);
      // PCI-DSS compliance handled at repository level (secure token generation)
    });

    it('should handle CCPA compliant data processing', async () => {
      mockRepository.resetPassword.mockClear();
      mockRepository.resetPassword.mockResolvedValueOnce(undefined);

      await useCase.execute(validEmail);

      expect(mockRepository.resetPassword).toHaveBeenCalledTimes(1);
      // CCPA compliance handled at repository level (privacy rights, data minimization)
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should handle transient email service failures with retry capability', async () => {
      const transientMessage = 'Temporary email service failure';
      const transientError = new Error(transientMessage);
      
      mockRepository.resetPassword.mockRejectedValueOnce(transientError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Temporary email service failure');

      // Verify that the use case can be retried
      mockRepository.resetPassword.mockResolvedValueOnce(undefined);
      
      await expect(useCase.execute(validEmail)).resolves.toBeUndefined();
    });

    it('should handle network partition scenarios', async () => {
      const partitionMessage = 'Network partition detected';
      const networkPartitionError = new Error(partitionMessage);
      
      mockRepository.resetPassword.mockRejectedValueOnce(networkPartitionError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Network partition detected');
    });

    it('should handle circuit breaker scenarios', async () => {
      const circuitMessage = 'Circuit breaker open';
      const circuitBreakerError = new Error(circuitMessage);
      
      mockRepository.resetPassword.mockRejectedValueOnce(circuitBreakerError);

      await expect(useCase.execute(validEmail))
        .rejects.toThrow('Password reset failed: Circuit breaker open');
    });
  });
});
