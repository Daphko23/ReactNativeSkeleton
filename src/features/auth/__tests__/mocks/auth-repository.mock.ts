/**
 * @fileoverview Mock AuthRepository for testing
 * @description Complete mock implementation of AuthRepository interface
 */

import {AuthRepository} from '../../domain/interfaces/auth.repository.interface';
import {AuthUser, MFAFactor, UserSession} from '../../domain/entities/auth-user.interface';

// Simple test to satisfy Jest requirement
describe('AuthRepository Mock', () => {
  it('should create mock repository', () => {
    const mockRepo = createMockAuthRepository();
    expect(mockRepo).toBeDefined();
    expect(typeof mockRepo.login).toBe('function');
  });
});

// Helper function to create dynamic user based on email
const createUserFromEmail = (email: string, _password?: string): AuthUser => ({
  id: `user-${email.split('@')[0]}`,
  email: email,
  displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
  photoURL: undefined,
  emailVerified: false,
  phoneVerified: false,
  mfaEnabled: false,
  roles: ['user'],
  status: 'pending_verification',
  lastLoginAt: undefined
});

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

export const mockAuthUser: AuthUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: undefined,
  emailVerified: true,
  phoneVerified: false,
  mfaEnabled: false,
  roles: ['user'],
  status: 'active',
  lastLoginAt: new Date(),
};

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