/**
 * @fileoverview Mock AuthRepository for testing
 * @description Complete mock implementation of AuthRepository interface
 */

import {AuthRepository} from '../../domain/interfaces/auth.repository.interface';
import {AuthUser} from '../../domain/entities/auth-user.entity';
import {UserStatus, UserRole} from '../../domain/types/security.types';
import {createMockAuthUser} from '../../helpers/auth-user-test.factory';

// Types for MFAFactor and UserSession (if they exist elsewhere)
interface MFAFactor {
  id: string;
  type: 'totp' | 'sms' | 'email';
  friendlyName: string;
  status: 'verified' | 'unverified';
  createdAt: Date;
}

interface UserSession {
  id: string;
  userId: string;
  deviceId: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  lastActiveAt: Date;
}

// Simple test to satisfy Jest requirement
describe('AuthRepository Mock', () => {
  it('should create mock repository', () => {
    const mockRepo = createMockAuthRepository();
    expect(mockRepo).toBeDefined();
    expect(typeof mockRepo.login).toBe('function');
  });
});

// Helper function to create dynamic user based on email
const createUserFromEmail = (email: string, _password?: string): AuthUser => {
  return createMockAuthUser({
    id: `user-${email.split('@')[0]}`,
    email: email,
    emailVerified: false,
    firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    status: UserStatus.PENDING_VERIFICATION,
    role: UserRole.USER,
  });
};

export const createMockAuthRepository = (): jest.Mocked<AuthRepository> => {
  const mockRepo = {
    // Basic Authentication with intelligent defaults
    login: jest.fn(),
    register: jest.fn().mockImplementation((email: string, _password: string) => {
      return Promise.resolve(createUserFromEmail(email));
    }),
    logout: jest.fn().mockResolvedValue(undefined),
    getCurrentUser: jest.fn(),
    resetPassword: jest.fn().mockResolvedValue(undefined),

    // Password & Validation
    validatePassword: jest.fn(),
    verifyEmail: jest.fn(),
    updatePassword: jest.fn(),

    // Multi-Factor Authentication (MFA)
    enableMFA: jest.fn(),
    disableMFA: jest.fn(),
    verifyMFASetup: jest.fn(),
    getMFAFactors: jest.fn(),
    verifyMFAChallenge: jest.fn(),

    // Biometric Authentication
    isBiometricAvailable: jest.fn(),
    enableBiometric: jest.fn(),
    disableBiometric: jest.fn(),
    authenticateWithBiometric: jest.fn(),

    // OAuth Integration
    loginWithGoogle: jest.fn(),
    loginWithApple: jest.fn(),
    loginWithMicrosoft: jest.fn(),
    linkOAuthProvider: jest.fn(),
    unlinkOAuthProvider: jest.fn(),

    // Role-Based Access Control (RBAC)
    getUserRoles: jest.fn(),
    hasRole: jest.fn(),
    hasPermission: jest.fn(),
    getUserPermissions: jest.fn(),

    // Session Management
    getActiveSessions: jest.fn(),
    terminateSession: jest.fn(),
    terminateOtherSessions: jest.fn(),
    refreshSession: jest.fn(),
    setSessionTimeout: jest.fn(),

    // Security & Monitoring
    logSecurityEvent: jest.fn(),
    getSecurityEvents: jest.fn(),
    checkSuspiciousActivity: jest.fn(),
    
    // Account Management
    observeAuthState: jest.fn(),
  };

  return mockRepo as jest.Mocked<AuthRepository>;
};

export const mockAuthUser: AuthUser = createMockAuthUser({
  id: 'test-user-id',
  email: 'test@example.com',
  emailVerified: true,
  firstName: 'Test',
  lastName: 'User',
  status: UserStatus.ACTIVE,
  role: UserRole.USER,
});

export const mockMFAFactor: MFAFactor = {
  id: 'test-mfa-id',
  type: 'totp',
  friendlyName: 'Test TOTP',
  status: 'verified',
  createdAt: new Date(),
};

export const mockUserSession: UserSession = {
  id: 'test-session-id',
  userId: 'test-user-id',
  deviceId: 'test-device-id',
  isActive: true,
  expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  createdAt: new Date(),
  lastActiveAt: new Date(),
};