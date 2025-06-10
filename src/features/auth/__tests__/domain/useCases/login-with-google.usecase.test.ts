/**
 * @file login-with-google.usecase.test.ts
 * @description Comprehensive tests for LoginWithGoogle UseCase
 * Tests OAuth authentication, user registration/login, security logging and error scenarios
 */

import { LoginWithGoogleUseCase } from '../../../application/usecases/login-with-google.usecase';
import { SecurityEventType, SecurityEventSeverity, UserStatus } from '../../../domain/types/security.types';

import { createMockAuthRepository } from '../../mocks/auth-repository.mock';
import { createMockAuthUser } from '../../../helpers/auth-user-test.factory';

describe('LoginWithGoogleUseCase', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new LoginWithGoogleUseCase(mockRepository);

  // Mock OAuth users
  const mockNewGoogleUser = createMockAuthUser({
    id: 'google-user-new-001',
    email: 'newuser@gmail.com',
    displayName: 'New Google User',
    photoURL: 'https://lh3.googleusercontent.com/photo.jpg',
    emailVerified: true,
    phoneVerified: false,
    mfaEnabled: false,
    roles: ['user'],
    status: UserStatus.ACTIVE,
    lastLoginAt: undefined  // New user has no previous login
  });

  const mockExistingGoogleUser = createMockAuthUser({
    id: 'google-user-existing-001',
    email: 'existing@gmail.com',
    displayName: 'Existing Google User',
    photoURL: 'https://lh3.googleusercontent.com/existing-photo.jpg',
    emailVerified: true,
    phoneVerified: false,
    mfaEnabled: true,
    roles: ['user'],
    status: UserStatus.ACTIVE,
    lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()  // Existing user has recent login
  });

  const mockReturningGoogleUser = createMockAuthUser({
    id: 'google-user-returning-001',
    email: 'returning@gmail.com',
    displayName: 'Returning Google User',
    photoURL: 'https://lh3.googleusercontent.com/returning-photo.jpg',
    emailVerified: true,
    phoneVerified: true,
    mfaEnabled: true,
    roles: ['user', 'premium'],
    status: UserStatus.ACTIVE,
    lastLoginAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString()
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new LoginWithGoogleUseCase(null as any))
        .toThrow('AuthRepository is required for LoginWithGoogleUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(LoginWithGoogleUseCase);
    });
  });

  describe('Successful Google OAuth Authentication', () => {
    it('should handle new user registration via Google OAuth', async () => {
      mockRepository.loginWithGoogle.mockResolvedValueOnce(mockNewGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(mockRepository.loginWithGoogle).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        success: true,
        user: mockNewGoogleUser,
        isNewUser: true,
        message: 'Google OAuth login successful'
      });
    });

    it('should handle existing user login via Google OAuth', async () => {
      mockRepository.loginWithGoogle.mockResolvedValueOnce(mockExistingGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result).toEqual({
        success: true,
        user: mockExistingGoogleUser,
        isNewUser: false,
        message: 'Google OAuth login successful'
      });
    });

    it('should treat returning user after long absence as new user', async () => {
      mockRepository.loginWithGoogle.mockResolvedValueOnce(mockReturningGoogleUser);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.isNewUser).toBe(true); // Over 365 days = considered new
      expect(result.user).toEqual(mockReturningGoogleUser);
    });

    it('should return success response for OAuth authentication', async () => {
      mockRepository.loginWithGoogle.mockResolvedValueOnce(mockExistingGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Google OAuth login successful');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('existing@gmail.com');
    });
  });

  describe('New User Detection Logic', () => {
    it('should detect new user when lastLoginAt is null', async () => {
      const newUserWithNullLogin = { ...mockNewGoogleUser, lastLoginAt: undefined };
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(newUserWithNullLogin as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.isNewUser).toBe(true);
    });

    it('should detect existing user when lastLoginAt is recent', async () => {
      const recentUser = { 
        ...mockExistingGoogleUser, 
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      };
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(recentUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.isNewUser).toBe(false);
    });

    it('should detect new user when lastLoginAt is over a year ago', async () => {
      const longAbsentUser = { 
        ...mockExistingGoogleUser, 
        lastLoginAt: new Date(Date.now() - 366 * 24 * 60 * 60 * 1000) // Over a year ago
      };
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(longAbsentUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.isNewUser).toBe(true);
    });

    it('should handle edge case at exactly 365 days', async () => {
      const exactlyOneYearUser = { 
        ...mockExistingGoogleUser, 
        lastLoginAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000 + 10000) // Slightly less than 365 days (10 seconds less)
      };
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(exactlyOneYearUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.isNewUser).toBe(false); // Slightly less than 365 days should be false
    });
  });

  describe('Security Event Logging', () => {
    it('should log successful OAuth login with new user details', async () => {
      mockRepository.loginWithGoogle.mockResolvedValueOnce(mockNewGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.LOGIN,
          userId: mockNewGoogleUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'google_oauth_login',
            message: 'Google OAuth login successful',
            method: 'oauth',
            provider: 'google',
            isNewUser: true,
            email: mockNewGoogleUser.email
          })
        })
      );
    });

    it('should log successful OAuth login with existing user details', async () => {
      mockRepository.loginWithGoogle.mockResolvedValueOnce(mockExistingGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            isNewUser: false,
            email: mockExistingGoogleUser.email
          })
        })
      );
    });

    it('should generate unique event IDs for successful logins', async () => {
      mockRepository.loginWithGoogle.mockResolvedValueOnce(mockExistingGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^google-oauth-success-\d+$/)
        })
      );
    });

    it('should include current timestamp in security events', async () => {
      const beforeExecution = new Date();
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(mockExistingGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      const afterExecution = new Date();
      const logCall = mockRepository.logSecurityEvent.mock.calls[0][0];
      
      expect(logCall.timestamp).toBeInstanceOf(Date);
      expect(logCall.timestamp.getTime()).toBeGreaterThanOrEqual(beforeExecution.getTime());
      expect(logCall.timestamp.getTime()).toBeLessThanOrEqual(afterExecution.getTime());
    });

    it('should include standard metadata in security events', async () => {
      mockRepository.loginWithGoogle.mockResolvedValueOnce(mockExistingGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddress: 'Unknown',
          userAgent: 'React Native App'
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle and log OAuth authentication errors', async () => {
      const oauthError = new Error('Google OAuth authentication failed');
      
      mockRepository.loginWithGoogle.mockRejectedValueOnce(oauthError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow('Google OAuth authentication failed');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          userId: 'unknown',
          severity: SecurityEventSeverity.MEDIUM,
          details: expect.objectContaining({
            action: 'google_oauth_failed',
            error: 'Google OAuth authentication failed',
            message: 'Google OAuth login failed',
            method: 'oauth',
            provider: 'google'
          })
        })
      );
    });

    it('should handle unknown errors in logging', async () => {
      mockRepository.loginWithGoogle.mockRejectedValueOnce('String error');
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

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
      const error = new Error('OAuth service unavailable');
      
      mockRepository.loginWithGoogle.mockRejectedValueOnce(error);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute()).rejects.toThrow();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^google-oauth-failed-\d+$/)
        })
      );
    });

    it('should propagate repository errors', async () => {
      const customError = new Error('Custom OAuth error');
      
      mockRepository.loginWithGoogle.mockRejectedValueOnce(customError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow(customError);
    });

    it('should handle network connection errors', async () => {
      const networkError = new Error('Network request failed');
      
      mockRepository.loginWithGoogle.mockRejectedValueOnce(networkError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow('Network request failed');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            error: 'Network request failed'
          })
        })
      );
    });

    it('should handle OAuth service unavailable errors', async () => {
      const serviceError = new Error('Google OAuth service temporarily unavailable');
      
      mockRepository.loginWithGoogle.mockRejectedValueOnce(serviceError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow('Google OAuth service temporarily unavailable');
    });
  });

  describe('User Data Scenarios', () => {
    it('should handle user with complete Google profile', async () => {
      const completeGoogleUser = createMockAuthUser({
        id: 'google-complete-001',
        email: 'complete@gmail.com',
        displayName: 'Complete Google User',
        photoURL: 'https://lh3.googleusercontent.com/complete.jpg',
        emailVerified: true,
        phoneVerified: true,
        mfaEnabled: false,
        roles: ['user'],
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      });
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(completeGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect((result.user as any).photoURL).toBe('https://lh3.googleusercontent.com/complete.jpg');
      expect(result.user.emailVerified).toBe(true);
      expect((result.user as any).displayName).toBe('Complete Google User');
    });

    it('should handle user with minimal Google profile', async () => {
      const minimalGoogleUser = createMockAuthUser({
        id: 'google-minimal-001',
        email: 'minimal@gmail.com',
        displayName: 'Minimal User',
        photoURL: undefined,
        emailVerified: true,
        phoneVerified: false,
        mfaEnabled: false,
        roles: ['user'],
        status: UserStatus.ACTIVE,
        lastLoginAt: undefined
      });
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(minimalGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect((result.user as any).photoURL).toBeUndefined();
      expect((result.user as any).phoneVerified).toBe(false);
      expect(result.isNewUser).toBe(true);
    });

    it('should handle user with premium roles', async () => {
      const premiumGoogleUser = createMockAuthUser({
        id: 'google-premium-001',
        email: 'premium@gmail.com',
        displayName: 'Premium Google User',
        photoURL: 'https://lh3.googleusercontent.com/premium.jpg',
        emailVerified: true,
        phoneVerified: true,
        mfaEnabled: true,
        roles: ['user', 'premium', 'admin'],
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      });
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(premiumGoogleUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect((result.user as any).roles).toEqual(['user', 'premium', 'admin']);
      expect((result.user as any).mfaEnabled).toBe(true);
      expect(result.isNewUser).toBe(false);
    });
  });

  describe('OAuth Flow Variations', () => {
    it('should handle successful OAuth with email-only permissions', async () => {
      const emailOnlyUser = createMockAuthUser({
        ...mockNewGoogleUser,
        displayName: 'User', // Fallback name when profile access denied
        photoURL: undefined
      });
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(emailOnlyUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('newuser@gmail.com');
      expect((result.user as any).displayName).toBe('User');
    });

    it('should handle OAuth re-authentication scenarios', async () => {
      const reAuthUser = createMockAuthUser({
        ...mockExistingGoogleUser,
        lastLoginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      });
      
      mockRepository.loginWithGoogle.mockResolvedValueOnce(reAuthUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.isNewUser).toBe(false);
      expect((result.user as any).mfaEnabled).toBe(true); // Existing user with MFA
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete OAuth flow for new user', async () => {
      const comprehensiveNewUser = createMockAuthUser({
        id: 'google-comprehensive-new-001',
        email: 'comprehensive.new@gmail.com',
        displayName: 'Comprehensive New User',
        photoURL: 'https://lh3.googleusercontent.com/comprehensive-new.jpg',
        emailVerified: true,
        phoneVerified: false,
        mfaEnabled: false,
        roles: ['user'],
        status: UserStatus.ACTIVE,
        lastLoginAt: undefined
      });

      mockRepository.loginWithGoogle.mockResolvedValueOnce(comprehensiveNewUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      // Verify complete flow
      expect(mockRepository.loginWithGoogle).toHaveBeenCalledTimes(1);
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(1);
      
      expect(result).toEqual({
        success: true,
        user: comprehensiveNewUser,
        isNewUser: true,
        message: 'Google OAuth login successful'
      });

      // Verify security logging includes comprehensive details
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.LOGIN,
          userId: comprehensiveNewUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'google_oauth_login',
            message: 'Google OAuth login successful',
            method: 'oauth',
            provider: 'google',
            isNewUser: true,
            email: comprehensiveNewUser.email
          }),
          ipAddress: 'Unknown',
          userAgent: 'React Native App'
        })
      );
    });

    it('should handle complete OAuth flow for returning user', async () => {
      const comprehensiveExistingUser = createMockAuthUser({
        id: 'google-comprehensive-existing-001',
        email: 'comprehensive.existing@gmail.com',
        displayName: 'Comprehensive Existing User',
        photoURL: 'https://lh3.googleusercontent.com/comprehensive-existing.jpg',
        emailVerified: true,
        phoneVerified: true,
        mfaEnabled: true,
        roles: ['user', 'verified'],
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      });

      mockRepository.loginWithGoogle.mockResolvedValueOnce(comprehensiveExistingUser as any);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      // Verify complete existing user flow
      expect(result).toEqual({
        success: true,
        user: comprehensiveExistingUser,
        isNewUser: false,
        message: 'Google OAuth login successful'
      });

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            isNewUser: false,
            email: comprehensiveExistingUser.email
          })
        })
      );
    });
  });
}); 