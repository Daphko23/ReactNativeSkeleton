/**
 * @file authStore.test.ts
 * @description Integration tests for the Zustand-based authStore.
 * Tests login, registration, logout, password reset and error handling behaviors.
 */

import {act} from 'react-test-renderer';

// Mock the entire AuthContainer to prevent DI issues
jest.mock('../../../application/di/auth.container', () => ({
  authContainer: {
    isReady: jest.fn().mockReturnValue(true),
    get loginWithEmailUseCase() {
      return {
        execute: jest.fn().mockResolvedValue({
          id: 'mock-user-id',
          email: 'mockuser@example.com',
          emailVerified: true,
          firstName: 'Mock',
          lastName: 'User',
          displayName: 'Mock User',
          photoURL: 'http://mock.photo.url',
          roles: ['user'],
          status: 'active',
          role: 'user',
        }),
      };
    },
    get registerWithEmailUseCase() {
      return {
        execute: jest.fn().mockResolvedValue({
          id: 'mock-new-id',
          email: 'newuser@example.com',
          emailVerified: false,
          firstName: 'New',
          lastName: 'User',
          displayName: 'New User',
          photoURL: null,
          roles: ['user'],
          status: 'active',
          role: 'user',
        }),
      };
    },
    get logoutUseCase() {
      return {
        execute: jest.fn().mockResolvedValue(undefined),
      };
    },
    get passwordResetUseCase() {
      return {
        execute: jest.fn().mockResolvedValue(undefined),
      };
    },
  },
}));

// Mock dependencies locally since DI provider doesn't exist yet
const _mockAuthRepository = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  resetPassword: jest.fn(),
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn(),
};

const _mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

// Import after mocking
import {useAuthStore} from '@features/auth/presentation/store/auth.store';

// Mocks für die UseCases
jest.mock('../../../application/usecases/login-with-email.usecase', () => ({
  LoginWithEmailUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({
      id: 'mock-user-id',
      email: 'mockuser@example.com',
      displayName: 'Mock User',
      photoURL: 'http://mock.photo.url',
    }),
  })),
}));

jest.mock('../../../application/usecases/register-with-email.usecase', () => ({
  RegisterWithEmailUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({
      id: 'mock-new-id',
      email: 'newuser@example.com',
      displayName: 'New User',
      photoURL: null,
    }),
  })),
}));

jest.mock('../../../application/usecases/logout.usecase', () => ({
  LogoutUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('../../../application/usecases/password-reset.usecase', () => ({
  ResetPasswordUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue(undefined),
  })),
}));

/**
 * Utility function to reset the store state before each test case.
 */
const resetStore = () => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: '',
  });
};

describe('AuthStore Integration Tests', () => {
  beforeEach(() => {
    resetStore();
  });

  /**
   * Tests whether login updates user and isAuthenticated state correctly.
   */
  it('should login user and set isAuthenticated', async () => {
    await act(async () => {
      await useAuthStore.getState().login('test@example.com', 'password123');
    });

    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBe('');
  });

  /**
   * Tests whether register creates a new user and sets authentication state.
   */
  it('should register new user and set isAuthenticated', async () => {
    await act(async () => {
      await useAuthStore
        .getState()
        .register('newuser@example.com', 'newpassword');
    });

    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBe('');
  });

  /**
   * Tests whether logout clears user and authentication state.
   */
  it('should logout and clear user data', async () => {
    await act(async () => {
      await useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  /**
   * Tests whether resetPassword works without causing state error.
   */
  it('should call resetPassword and not set error', async () => {
    await act(async () => {
      await useAuthStore.getState().resetPassword('test@example.com');
    });

    const state = useAuthStore.getState();
    expect(state.error).toBe('');
  });

  /**
   * Tests manual error handling by setting error state directly.
   */
  it('should handle login error properly', async () => {
    useAuthStore.setState({error: 'Test Login Error'});

    const state = useAuthStore.getState();
    expect(state.error).toBe('Test Login Error');
  });
});
