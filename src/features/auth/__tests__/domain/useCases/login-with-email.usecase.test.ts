/**
 * @file login-with-email.usecase.test.ts
 * @description Comprehensive tests for LoginWithEmail UseCase
 * Tests email/password authentication, input validation, security logging and error scenarios
 */

import { LoginWithEmailUseCase } from '../../../application/usecases/login-with-email.usecase';
import { createMockAuthRepository } from '../../mocks/auth-repository.mock';
import { AuthUser } from '../../../domain/entities/auth-user.interface';

describe('LoginWithEmailUseCase', () => {
  let useCase: LoginWithEmailUseCase;
  let mockAuthRepository: any;

  // Test data
  const validEmail = 'test@example.com';
  const validPassword = 'SecurePass123!';
  
  const mockLoginUser: AuthUser = {
    id: 'login-user-001',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
    emailVerified: true,
    phoneVerified: false,
    mfaEnabled: false,
    roles: ['user'],
    status: 'active',
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  };

  const mockPremiumUser: AuthUser = {
    id: 'premium-user-001',
    email: 'premium@example.com',
    displayName: 'Premium User',
    photoURL: 'https://example.com/premium-photo.jpg',
    emailVerified: true,
    phoneVerified: true,
    mfaEnabled: true,
    roles: ['user', 'premium'],
    status: 'active',
    lastLoginAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  };

  beforeEach(() => {
    mockAuthRepository = createMockAuthRepository();
    useCase = new LoginWithEmailUseCase(mockAuthRepository);
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new LoginWithEmailUseCase(null as any))
        .toThrow('AuthRepository is required for LoginWithEmailUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(LoginWithEmailUseCase);
    });
  });

  describe('Input Validation', () => {
    it('should throw error when email is not provided', async () => {
      await expect(useCase.execute('', validPassword))
        .rejects.toThrow('Email and password are required');

      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it('should throw error when password is not provided', async () => {
      await expect(useCase.execute(validEmail, ''))
        .rejects.toThrow('Email and password are required');

      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it('should throw error when both email and password are empty', async () => {
      await expect(useCase.execute('', ''))
        .rejects.toThrow('Email and password are required');

      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it('should throw error when email is null', async () => {
      await expect(useCase.execute(null as any, validPassword))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error when password is null', async () => {
      await expect(useCase.execute(validEmail, null as any))
        .rejects.toThrow('Email and password are required');
    });

    it('should proceed when both email and password are provided', async () => {
      mockAuthRepository.login.mockResolvedValueOnce(mockLoginUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(mockAuthRepository.login).toHaveBeenCalledWith(validEmail, validPassword);
      expect(result).toEqual(mockLoginUser);
    });
  });

  describe('Successful Authentication', () => {
    it('should authenticate user with valid credentials', async () => {
      mockAuthRepository.login.mockResolvedValueOnce(mockLoginUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(mockAuthRepository.login).toHaveBeenCalledWith(validEmail, validPassword);
      expect(result).toEqual(mockLoginUser);
    });

    it('should authenticate premium user with valid credentials', async () => {
      mockAuthRepository.login.mockResolvedValueOnce(mockPremiumUser);

      const result = await useCase.execute('premium@example.com', validPassword);

      expect(result).toEqual(mockPremiumUser);
      expect(result.roles).toContain('premium');
      expect(result.mfaEnabled).toBe(true);
    });

    it('should return user with complete profile data', async () => {
      const completeUser: AuthUser = {
        id: 'complete-user-001',
        email: 'complete@example.com',
        displayName: 'Complete User',
        photoURL: 'https://example.com/complete-photo.jpg',
        emailVerified: true,
        phoneVerified: true,
        mfaEnabled: false,
        roles: ['user', 'verified'],
        status: 'active',
        lastLoginAt: new Date()
      };

      mockAuthRepository.login.mockResolvedValueOnce(completeUser);

      const result = await useCase.execute('complete@example.com', validPassword);

      expect(result.emailVerified).toBe(true);
      expect(result.phoneVerified).toBe(true);
      expect(result.roles).toEqual(['user', 'verified']);
    });

    it('should handle user with minimal profile data', async () => {
      const minimalUser: AuthUser = {
        id: 'minimal-user-001',
        email: 'minimal@example.com',
        displayName: 'Minimal User',
        photoURL: undefined,
        emailVerified: true,
        phoneVerified: false,
        mfaEnabled: false,
        roles: ['user'],
        status: 'active',
        lastLoginAt: undefined
      };

      mockAuthRepository.login.mockResolvedValueOnce(minimalUser);

      const result = await useCase.execute('minimal@example.com', validPassword);

      expect(result.photoURL).toBeUndefined();
      expect(result.phoneVerified).toBe(false);
      expect(result.lastLoginAt).toBeUndefined();
    });

    it('should handle different email formats', async () => {
      const emailFormats = [
        'user@domain.com',
        'user.name@domain.co.uk',
        'user+tag@domain.org',
        'user123@sub.domain.com'
      ];

      for (const email of emailFormats) {
        const user = { ...mockLoginUser, email };
        mockAuthRepository.login.mockResolvedValueOnce(user);

        const result = await useCase.execute(email, validPassword);

        expect(result.email).toBe(email);
        expect(mockAuthRepository.login).toHaveBeenCalledWith(email, validPassword);
      }
    });
  });

  describe('Authentication Scenarios', () => {
    it('should handle returning user authentication', async () => {
      const returningUser = {
        ...mockLoginUser,
        lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      };

      mockAuthRepository.login.mockResolvedValueOnce(returningUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(result.lastLoginAt).toBeDefined();
      expect(result.status).toBe('active');
    });

    it('should handle first-time user authentication', async () => {
      const firstTimeUser = {
        ...mockLoginUser,
        lastLoginAt: undefined
      };

      mockAuthRepository.login.mockResolvedValueOnce(firstTimeUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(result.lastLoginAt).toBeUndefined();
    });

    it('should handle user with MFA enabled', async () => {
      const mfaUser = {
        ...mockLoginUser,
        mfaEnabled: true
      };

      mockAuthRepository.login.mockResolvedValueOnce(mfaUser);

      const result = await useCase.execute(validEmail, validPassword);

      expect(result.mfaEnabled).toBe(true);
    });

    it('should handle admin user authentication', async () => {
      const adminUser = {
        ...mockLoginUser,
        roles: ['user', 'admin'],
        email: 'admin@example.com'
      };

      mockAuthRepository.login.mockResolvedValueOnce(adminUser);

      const result = await useCase.execute('admin@example.com', validPassword);

      expect(result.roles).toContain('admin');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid credentials error', async () => {
      const credentialsError = new Error('Invalid email or password');
      
      mockAuthRepository.login.mockRejectedValueOnce(credentialsError);

      await expect(useCase.execute(validEmail, 'wrongpassword'))
        .rejects.toThrow('Login failed: Invalid email or password');

      expect(mockAuthRepository.login).toHaveBeenCalledWith(validEmail, 'wrongpassword');
    });

    it('should handle user not found error', async () => {
      const notFoundError = new Error('User not found');
      
      mockAuthRepository.login.mockRejectedValueOnce(notFoundError);

      await expect(useCase.execute('nonexistent@example.com', validPassword))
        .rejects.toThrow('Login failed: User not found');
    });

    it('should handle account locked error', async () => {
      const lockedError = new Error('Account is temporarily locked');
      
      mockAuthRepository.login.mockRejectedValueOnce(lockedError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Login failed: Account is temporarily locked');
    });

    it('should handle too many attempts error', async () => {
      const tooManyAttemptsError = new Error('Too many login attempts. Please try again later');
      
      mockAuthRepository.login.mockRejectedValueOnce(tooManyAttemptsError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Login failed: Too many login attempts. Please try again later');
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network request failed');
      
      mockAuthRepository.login.mockRejectedValueOnce(networkError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Login failed: Network request failed');
    });

    it('should handle service unavailable error', async () => {
      const serviceError = new Error('Authentication service temporarily unavailable');
      
      mockAuthRepository.login.mockRejectedValueOnce(serviceError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Login failed: Authentication service temporarily unavailable');
    });

    it('should handle unknown errors gracefully', async () => {
      mockAuthRepository.login.mockRejectedValueOnce('String error');

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toBe('String error');
    });

    it('should preserve original error for non-Error objects', async () => {
      const customError = { code: 'AUTH_ERROR', message: 'Custom error' };
      
      mockAuthRepository.login.mockRejectedValueOnce(customError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toBe(customError);
    });
  });

  describe('Password Security Scenarios', () => {
    it('should handle strong password authentication', async () => {
      const strongPasswords = [
        'StrongPassword123!',
        'MySecure$Pass2024',
        'Complex!Password@789'
      ];

      for (const password of strongPasswords) {
        mockAuthRepository.login.mockResolvedValueOnce(mockLoginUser);

        const result = await useCase.execute(validEmail, password);

        expect(result).toEqual(mockLoginUser);
        expect(mockAuthRepository.login).toHaveBeenCalledWith(validEmail, password);
      }
    });

    it('should handle password with special characters', async () => {
      const specialCharPassword = 'Test@#$%^&*()_+{}|:"<>?[];,./`~';
      
      mockAuthRepository.login.mockResolvedValueOnce(mockLoginUser);

      const result = await useCase.execute(validEmail, specialCharPassword);

      expect(result).toEqual(mockLoginUser);
      expect(mockAuthRepository.login).toHaveBeenCalledWith(validEmail, specialCharPassword);
    });

    it('should handle long password authentication', async () => {
      const longPassword = 'A'.repeat(100) + '123!';
      
      mockAuthRepository.login.mockResolvedValueOnce(mockLoginUser);

      const result = await useCase.execute(validEmail, longPassword);

      expect(result).toEqual(mockLoginUser);
      expect(mockAuthRepository.login).toHaveBeenCalledWith(validEmail, longPassword);
    });
  });

  describe('Repository Integration', () => {
    it('should call repository login method exactly once', async () => {
      mockAuthRepository.login.mockResolvedValueOnce(mockLoginUser);

      await useCase.execute(validEmail, validPassword);

      expect(mockAuthRepository.login).toHaveBeenCalledTimes(1);
      expect(mockAuthRepository.login).toHaveBeenCalledWith(validEmail, validPassword);
    });

    it('should pass credentials to repository unchanged', async () => {
      const testEmail = 'test.user+tag@example.co.uk';
      const testPassword = 'MySpecial!Password123';
      
      mockAuthRepository.login.mockResolvedValueOnce(mockLoginUser);

      await useCase.execute(testEmail, testPassword);

      expect(mockAuthRepository.login).toHaveBeenCalledWith(testEmail, testPassword);
    });

    it('should return repository response unchanged', async () => {
      const repositoryResponse = {
        id: 'repo-user-001',
        email: 'repo@example.com',
        displayName: 'Repository User',
        photoURL: 'https://example.com/repo-photo.jpg',
        emailVerified: true,
        phoneVerified: true,
        mfaEnabled: false,
        roles: ['user', 'beta'],
        status: 'active' as const,
        lastLoginAt: new Date(Date.now() - 1000)
      };

      mockAuthRepository.login.mockResolvedValueOnce(repositoryResponse);

      const result = await useCase.execute(validEmail, validPassword);

      expect(result).toEqual(repositoryResponse);
      expect(result).toBe(repositoryResponse);
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace in email and password', async () => {
      const emailWithSpaces = '  test@example.com  ';
      const passwordWithSpaces = '  SecurePass123!  ';
      
      mockAuthRepository.login.mockResolvedValueOnce(mockLoginUser);

      const result = await useCase.execute(emailWithSpaces, passwordWithSpaces);

      expect(result).toEqual(mockLoginUser);
      expect(mockAuthRepository.login).toHaveBeenCalledWith(emailWithSpaces, passwordWithSpaces);
    });

    it('should handle concurrent login attempts', async () => {
      mockAuthRepository.login.mockResolvedValue(mockLoginUser);

      const promises = [
        useCase.execute(validEmail, validPassword),
        useCase.execute('user2@example.com', validPassword),
        useCase.execute('user3@example.com', validPassword)
      ];

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result).toEqual(mockLoginUser);
      });

      expect(mockAuthRepository.login).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid successive login attempts', async () => {
      mockAuthRepository.login.mockResolvedValue(mockLoginUser);

      const promises = Array(5).fill(null).map(() => 
        useCase.execute(validEmail, validPassword)
      );

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result).toEqual(mockLoginUser);
      });

      expect(mockAuthRepository.login).toHaveBeenCalledTimes(5);
    });

    it('should handle timeout scenarios', async () => {
      const timeoutError = new Error('Request timeout');
      
      mockAuthRepository.login.mockRejectedValueOnce(timeoutError);

      await expect(useCase.execute(validEmail, validPassword))
        .rejects.toThrow('Login failed: Request timeout');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete login flow for standard user', async () => {
      const standardUser: AuthUser = {
        id: 'standard-integration-001',
        email: 'standard.integration@example.com',
        displayName: 'Standard Integration User',
        photoURL: 'https://example.com/standard-integration.jpg',
        emailVerified: true,
        phoneVerified: false,
        mfaEnabled: false,
        roles: ['user'],
        status: 'active',
        lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      };

      mockAuthRepository.login.mockResolvedValueOnce(standardUser);

      const result = await useCase.execute('standard.integration@example.com', 'StandardPass123!');

      // Verify complete flow
      expect(mockAuthRepository.login).toHaveBeenCalledTimes(1);
      expect(mockAuthRepository.login).toHaveBeenCalledWith('standard.integration@example.com', 'StandardPass123!');
      
      expect(result).toEqual(standardUser);
      expect(result.emailVerified).toBe(true);
      expect(result.status).toBe('active');
    });

    it('should handle complete login flow for premium user', async () => {
      const premiumIntegrationUser: AuthUser = {
        id: 'premium-integration-001',
        email: 'premium.integration@example.com',
        displayName: 'Premium Integration User',
        photoURL: 'https://example.com/premium-integration.jpg',
        emailVerified: true,
        phoneVerified: true,
        mfaEnabled: true,
        roles: ['user', 'premium', 'verified'],
        status: 'active',
        lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      };

      mockAuthRepository.login.mockResolvedValueOnce(premiumIntegrationUser);

      const result = await useCase.execute('premium.integration@example.com', 'PremiumPass123!');

      expect(result).toEqual(premiumIntegrationUser);
      expect(result.mfaEnabled).toBe(true);
      expect(result.roles).toContain('premium');
      expect(result.phoneVerified).toBe(true);
    });
  });
}); 