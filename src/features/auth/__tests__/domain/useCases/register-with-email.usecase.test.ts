/**
 * @file register-with-email.usecase.test.ts
 * @description Comprehensive tests for Register with Email UseCase (UC-002)
 * Tests user registration, input validation, security requirements, and error scenarios
 */

import { RegisterWithEmailUseCase } from '../../../application/usecases/register-with-email.usecase';
import { AuthUser } from '../../../domain/entities/auth-user.interface';
import { createMockAuthRepository } from '../../mocks/auth-repository.mock';

describe('RegisterWithEmailUseCase - UC-002', () => {
  let mockRepository: jest.Mocked<any>;
  let useCase: RegisterWithEmailUseCase;

  // Test data
  const validEmail = 'newuser@example.com';
  const validPassword = 'SecurePass123!';
  
  const mockNewUser: AuthUser = {
    id: 'new-user-001',
    email: 'newuser@example.com',
    displayName: 'New User',
    photoURL: undefined,
    emailVerified: false, // New user starts unverified
    phoneVerified: false,
    mfaEnabled: false,
    roles: ['user'],
    status: 'pending_verification', // New user starts with pending_verification status
    lastLoginAt: undefined
  };

  beforeEach(() => {
    mockRepository = createMockAuthRepository();
    useCase = new RegisterWithEmailUseCase(mockRepository);
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new RegisterWithEmailUseCase(null as any))
        .toThrow('AuthRepository is required for RegisterWithEmailUseCase');
    });

    it('should throw error when repository is undefined', () => {
      expect(() => new RegisterWithEmailUseCase(undefined as any))
        .toThrow('AuthRepository is required for RegisterWithEmailUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(RegisterWithEmailUseCase);
    });
  });

  describe('Input Validation', () => {
    it('should throw error when email is not provided', async () => {
      await expect(useCase.execute('', validPassword))
        .rejects.toThrow('Email and password are required');

      expect(mockRepository.register).not.toHaveBeenCalled();
    });

    it('should throw error when password is not provided', async () => {
      await expect(useCase.execute(validEmail, ''))
        .rejects.toThrow('Email and password are required');

      expect(mockRepository.register).not.toHaveBeenCalled();
    });

    it('should throw error when both email and password are empty', async () => {
      await expect(useCase.execute('', ''))
        .rejects.toThrow('Email and password are required');

      expect(mockRepository.register).not.toHaveBeenCalled();
    });

    it('should throw error when email is null', async () => {
      await expect(useCase.execute(null as any, validPassword))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error when password is null', async () => {
      await expect(useCase.execute(validEmail, null as any))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error when email is undefined', async () => {
      await expect(useCase.execute(undefined as any, validPassword))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error when password is undefined', async () => {
      await expect(useCase.execute(validEmail, undefined as any))
        .rejects.toThrow('Email and password are required');
    });

    it('should proceed when both email and password are provided', async () => {
      mockRepository.register.mockResolvedValueOnce(mockNewUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(mockRepository.register).toHaveBeenCalledWith(validEmail, validPassword);
      expect(result).toEqual(mockNewUser);
    });
  });

  describe('Successful Registration', () => {
    it('should register user with valid credentials', async () => {
      mockRepository.register.mockResolvedValueOnce(mockNewUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(mockRepository.register).toHaveBeenCalledWith(validEmail, validPassword);
      expect(result).toEqual(mockNewUser);
    });

    it('should return user with unverified email status', async () => {
      mockRepository.register.mockResolvedValueOnce(mockNewUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(result.emailVerified).toBe(false);
      expect(result.status).toBe('pending_verification');
    });

    it('should register user with default role', async () => {
      mockRepository.register.mockResolvedValueOnce(mockNewUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(result.roles).toEqual(['user']);
    });

    it('should handle different email formats', async () => {
      const emailFormats = [
        'user@domain.com',
        'user.name@domain.co.uk',
        'user+tag@domain.org',
        'user123@sub.domain.com',
        'user-name@example-domain.com'
      ];

      for (const email of emailFormats) {
        const user = { ...mockNewUser, email };
        mockRepository.register.mockResolvedValueOnce(user);

        const result = await useCase.execute(email, validPassword);

        expect(result.email).toBe(email);
        expect(mockRepository.register).toHaveBeenCalledWith(email, validPassword);
      }
    });

    it('should handle different password complexities', async () => {
      const complexPasswords = [
        'StrongPassword123!',
        'MySecure$Pass2024',
        'Complex!Password@789',
        'Test#Password$123'
      ];

      for (const password of complexPasswords) {
        mockRepository.register.mockResolvedValueOnce(mockNewUser);

        const result = await useCase.execute(validEmail, password);

        expect(result).toEqual(mockNewUser);
        expect(mockRepository.register).toHaveBeenCalledWith(validEmail, password);
      }
    });
  });

  describe('Error Handling - Registration Failures', () => {
    it('should handle email already exists error', async () => {
      const existsMessage = 'Email already registered';
      const existsError = new Error(existsMessage);
      
      mockRepository.register.mockRejectedValueOnce(existsError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Registration failed: Email already registered');

      expect(mockRepository.register).toHaveBeenCalledWith(validEmail, validPassword);
    });

    it('should handle weak password error', async () => {
      const weakMessage = 'Password does not meet complexity requirements';
      const weakPasswordError = new Error(weakMessage);
      
      mockRepository.register.mockRejectedValueOnce(weakPasswordError);

      await expect(useCase.execute(validEmail, 'weak'))
        .rejects.toThrow('Registration failed: Password does not meet complexity requirements');
    });

    it('should handle invalid email format error', async () => {
      const invalidMessage = 'Invalid email format';
      const invalidEmailError = new Error(invalidMessage);
      
      mockRepository.register.mockRejectedValueOnce(invalidEmailError);

      await expect(useCase.execute('invalid-email', validPassword))
        .rejects.toThrow('Registration failed: Invalid email format');
    });

    it('should handle network errors', async () => {
      const networkMessage = 'Network request failed';
      const networkError = new Error(networkMessage);
      
      mockRepository.register.mockRejectedValueOnce(networkError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Registration failed: Network request failed');
    });

    it('should handle service unavailable error', async () => {
      const serviceMessage = 'Authentication service temporarily unavailable';
      const serviceError = new Error(serviceMessage);
      
      mockRepository.register.mockRejectedValueOnce(serviceError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Registration failed: Authentication service temporarily unavailable');
    });

    it('should handle rate limiting error', async () => {
      const rateLimitMessage = 'Too many registration attempts. Please try again later';
      const rateLimitError = new Error(rateLimitMessage);
      
      mockRepository.register.mockRejectedValueOnce(rateLimitError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Registration failed: Too many registration attempts. Please try again later');
    });

    it('should handle email delivery error', async () => {
      const emailDeliveryMessage = 'Verification email could not be sent';
      const emailDeliveryError = new Error(emailDeliveryMessage);
      
      mockRepository.register.mockRejectedValueOnce(emailDeliveryError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Registration failed: Verification email could not be sent');
    });

    it('should handle internal server error', async () => {
      const serverMessage = 'Internal server error';
      const serverError = new Error(serverMessage);
      
      mockRepository.register.mockRejectedValueOnce(serverError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Registration failed: Internal server error');
    });

    it('should handle unknown errors gracefully', async () => {
      mockRepository.register.mockRejectedValueOnce('String error');

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toBe('String error');
    });

    it('should preserve original error for non-Error objects', async () => {
      const customError = { code: 'REG_ERROR', message: 'Custom error' };
      
      mockRepository.register.mockRejectedValueOnce(customError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toBe(customError);
    });
  });

  describe('Security Scenarios', () => {
    it('should handle malicious email injection attempts', async () => {
      const maliciousEmails = [
        'test@example.com<script>alert(1)</script>',
        'test@example.com"; DROP TABLE users; --',
        'test@example.com\r\nBcc: attacker@evil.com'
      ];

      for (const maliciousEmail of maliciousEmails) {
        const injectionMessage = 'Invalid email format';
        const injectionError = new Error(injectionMessage);
        mockRepository.register.mockRejectedValueOnce(injectionError);

        await expect(useCase.execute(maliciousEmail, validPassword))
          .rejects.toThrow('Registration failed: Invalid email format');
      }
    });

    it('should handle malicious password injection attempts', async () => {
      const maliciousPasswords = [
        'password\'; DROP TABLE users; --',
        'password<script>alert(1)</script>',
        'password\x00\x01\x02'
      ];

      for (const maliciousPassword of maliciousPasswords) {
        const injectionMessage = 'Invalid password format';
        const injectionError = new Error(injectionMessage);
        mockRepository.register.mockRejectedValueOnce(injectionError);

        await expect(useCase.execute(validEmail, maliciousPassword))
          .rejects.toThrow('Registration failed: Invalid password format');
      }
    });

    it('should handle extremely long email addresses', async () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      const lengthMessage = 'Email address too long';
      const lengthError = new Error(lengthMessage);
      
      mockRepository.register.mockRejectedValueOnce(lengthError);

      await expect(useCase.execute(longEmail, validPassword))
        .rejects.toThrow('Registration failed: Email address too long');
    });

    it('should handle extremely long passwords', async () => {
      const longPassword = 'A'.repeat(200) + '123!';
      const lengthMessage = 'Password too long';
      const lengthError = new Error(lengthMessage);
      
      mockRepository.register.mockRejectedValueOnce(lengthError);

      await expect(useCase.execute(validEmail, longPassword))
        .rejects.toThrow('Registration failed: Password too long');
    });

    it('should handle Unicode and special character emails', async () => {
      const unicodeEmails = [
        'ñoño@español.com',
        'тест@example.com',
        '测试@example.com'
      ];

      for (const unicodeEmail of unicodeEmails) {
        const user = { ...mockNewUser, email: unicodeEmail };
        mockRepository.register.mockResolvedValueOnce(user);

        const result = await useCase.execute(unicodeEmail, validPassword);

        expect(result.email).toBe(unicodeEmail);
      }
    });
  });

  describe('Business Rule Validation', () => {
    it('should fulfill BR-004: Email addresses must be unique', async () => {
      const duplicateMessage = 'Email address already exists';
      const duplicateError = new Error(duplicateMessage);
      
      mockRepository.register.mockRejectedValueOnce(duplicateError);

      await expect(useCase.execute('existing@example.com', validPassword))
        .rejects.toThrow('Registration failed: Email address already exists');
    });

    it('should fulfill BR-005: Password must meet complexity requirements', async () => {
      const weakPasswords = [
        'simple',
        '12345678',
        'password',
        'ALLCAPS',
        'nocaps123'
      ];

      for (const weakPassword of weakPasswords) {
        const complexityMessage = 'Password does not meet complexity requirements';
        const complexityError = new Error(complexityMessage);
        mockRepository.register.mockRejectedValueOnce(complexityError);

        await expect(useCase.execute(validEmail, weakPassword))
          .rejects.toThrow('Registration failed: Password does not meet complexity requirements');
      }
    });

    it('should fulfill BR-006: User must accept terms and conditions (handled at UI level)', async () => {
      // This rule is enforced at UI level, but we test that registration proceeds
      mockRepository.register.mockResolvedValueOnce(mockNewUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(result).toEqual(mockNewUser);
      // Terms acceptance would be validated before calling this use case
    });

    it('should fulfill BR-007: Email verification is required for account activation', async () => {
      mockRepository.register.mockResolvedValueOnce(mockNewUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(result.emailVerified).toBe(false);
      expect(result.status).toBe('pending_verification');
      // User should receive verification email (handled by repository)
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle concurrent registration attempts with same email', async () => {
      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);
      
      const duplicateMessage = 'Email already registered';
      const duplicateError = new Error(duplicateMessage);
      
      freshRepository.register
        .mockResolvedValueOnce(mockNewUser) // First registration succeeds
        .mockRejectedValueOnce(duplicateError); // Second registration fails

      const user1Promise = freshUseCase.execute(validEmail, validPassword);
      const user2Promise = freshUseCase.execute(validEmail, 'DifferentPass123!');

      const results = await Promise.allSettled([user1Promise, user2Promise]);

      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
    });

    it('should handle multiple sequential registrations', async () => {
      const users = [
        { email: 'user1@example.com', password: 'Pass1234!' },
        { email: 'user2@example.com', password: 'Pass5678!' },
        { email: 'user3@example.com', password: 'Pass9012!' }
      ];

      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);

      for (let i = 0; i < users.length; i++) {
        const userResponse = { ...mockNewUser, id: `user-${i+1}`, email: users[i].email };
        freshRepository.register.mockResolvedValueOnce(userResponse);

        const result = await freshUseCase.execute(users[i].email, users[i].password);

        expect(result.email).toBe(users[i].email);
        expect(freshRepository.register).toHaveBeenCalledWith(users[i].email, users[i].password);
      }
    });

    it('should handle registration timeout (isolated test)', async () => {
      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);
      
      const timeoutMessage = 'Registration timeout';
      const timeoutError = new Error(timeoutMessage);
      
      freshRepository.register.mockRejectedValueOnce(timeoutError);

      await expect(freshUseCase.execute(validEmail, validPassword))
        .rejects.toThrow('Registration failed: Registration timeout');
    });

    it('should handle registration during maintenance (isolated test)', async () => {
      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);
      
      const maintenanceMessage = 'Service under maintenance';
      const maintenanceError = new Error(maintenanceMessage);
      
      freshRepository.register.mockRejectedValueOnce(maintenanceError);

      await expect(freshUseCase.execute(validEmail, validPassword))
        .rejects.toThrow('Registration failed: Service under maintenance');
    });
  });

  describe('Repository Integration', () => {
    it('should call repository register method exactly once', async () => {
      mockRepository.register.mockResolvedValueOnce(mockNewUser);

      await useCase.execute(validEmail, validPassword);

      expect(mockRepository.register).toHaveBeenCalledTimes(1);
      expect(mockRepository.register).toHaveBeenCalledWith(validEmail, validPassword);
    });

    it('should pass credentials to repository unchanged', async () => {
      const testEmail = 'test.user+tag@example.co.uk';
      const testPassword = 'MySpecial!Password123';
      
      const testUser = { ...mockNewUser, email: testEmail };
      mockRepository.register.mockResolvedValueOnce(testUser);

      await useCase.execute(testEmail, testPassword);

      expect(mockRepository.register).toHaveBeenCalledWith(testEmail, testPassword);
    });

    it('should return repository response unchanged (isolated test)', async () => {
      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);
      
      const repositoryResponse = {
        id: 'repo-user-001',
        email: 'repo@example.com',
        displayName: 'Repository User',
        photoURL: undefined,
        emailVerified: false,
        phoneVerified: false,
        mfaEnabled: false,
        roles: ['user', 'beta'],
        status: 'pending_verification' as const,
        lastLoginAt: undefined
      };

      freshRepository.register.mockResolvedValueOnce(repositoryResponse);

      const result = await freshUseCase.execute(validEmail, validPassword);

      expect(result).toEqual(repositoryResponse);
      expect(result).toBe(repositoryResponse);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete registration flow for new user (isolated test)', async () => {
      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);
      
      const newUserRegistration: AuthUser = {
        id: 'integration-user-001',
        email: 'integration@example.com',
        displayName: 'Integration User',
        photoURL: undefined,
        emailVerified: false,
        phoneVerified: false,
        mfaEnabled: false,
        roles: ['user'],
        status: 'pending_verification',
        lastLoginAt: undefined
      };

      freshRepository.register.mockResolvedValueOnce(newUserRegistration);

      const result = await freshUseCase.execute('integration@example.com', 'IntegrationPass123!');

      // Verify complete flow
      expect(freshRepository.register).toHaveBeenCalledTimes(1);
      expect(freshRepository.register).toHaveBeenCalledWith('integration@example.com', 'IntegrationPass123!');
      
      expect(result).toEqual(newUserRegistration);
      expect(result.emailVerified).toBe(false);
      expect(result.status).toBe('pending_verification');
      expect(result.roles).toEqual(['user']);
    });

    it('should handle registration with enterprise email domain (isolated test)', async () => {
      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);
      
      const enterpriseUser: AuthUser = {
        id: 'enterprise-user-001',
        email: 'employee@company.com',
        displayName: 'Enterprise Employee',
        photoURL: undefined,
        emailVerified: false,
        phoneVerified: false,
        mfaEnabled: false,
        roles: ['user', 'enterprise'],
        status: 'pending_verification',
        lastLoginAt: undefined
      };

      freshRepository.register.mockResolvedValueOnce(enterpriseUser);

      const result = await freshUseCase.execute('employee@company.com', 'EnterprisePass123!');

      expect(result.email).toBe('employee@company.com');
      expect(result.roles).toContain('enterprise');
    });
  });

  describe('Compliance Scenarios', () => {
    it('should handle GDPR compliant registration (isolated test)', async () => {
      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);
      
      freshRepository.register.mockResolvedValueOnce(mockNewUser);

      const result = await freshUseCase.execute(validEmail, validPassword);

      expect(result).toEqual(mockNewUser);
      // GDPR compliance handled at repository level (data encryption, consent tracking)
    });

    it('should handle CCPA compliant registration (isolated test)', async () => {
      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);
      
      freshRepository.register.mockResolvedValueOnce(mockNewUser);

      const result = await freshUseCase.execute(validEmail, validPassword);

      expect(result).toEqual(mockNewUser);
      // CCPA compliance handled at repository level (privacy rights, data minimization)
    });

    it('should handle SOX compliant registration audit trail (isolated test)', async () => {
      // Create fresh repository for this test
      const freshRepository = createMockAuthRepository();
      const freshUseCase = new RegisterWithEmailUseCase(freshRepository);
      
      freshRepository.register.mockResolvedValueOnce(mockNewUser);

      const result = await freshUseCase.execute(validEmail, validPassword);

      expect(result).toEqual(mockNewUser);
      // SOX compliance handled at repository level (audit logging, data integrity)
    });
  });
});
