/**
 * Auth State Store Tests
 *
 * @fileoverview Umfassende Tests für den Auth State Zustand Store.
 * Testet Pure State Management, Selector Hooks und Middleware Integration.
 *
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation Tests
 */

import { act, renderHook } from '@testing-library/react-native';
import {
  useAuthState,
  useAuthSelector,
  useAuthUser,
  useAuthLoading,
  useAuthError,
} from '../../../presentation/store/auth-state.store';
import { AuthUser } from '../../../domain/entities/auth-user.entity';
import { UserRole } from '../../../domain/types/security.types';

// Mock AuthUser für Tests
const createMockUser = (overrides: Partial<AuthUser> = {}): AuthUser =>
  ({
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    emailVerified: true,
    role: UserRole.USER,
    createdAt: '2024-01-01',
    lastSignInAt: new Date('2024-01-15'),
    ...overrides,
  }) as any;

describe('Auth State Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useAuthState());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthState());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('setUser Action', () => {
    it('should set user and update authentication status', () => {
      const { result } = renderHook(() => useAuthState());
      const mockUser = createMockUser();

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should clear user when setting null', () => {
      const { result } = renderHook(() => useAuthState());
      const mockUser = createMockUser();

      // Set user first
      act(() => {
        result.current.setUser(mockUser);
      });

      // Then clear user
      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should clear error when setting user', () => {
      const { result } = renderHook(() => useAuthState());
      const mockUser = createMockUser();

      // Set error first
      act(() => {
        result.current.setError('Test error');
      });

      // Then set user (should clear error)
      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.error).toBeNull();
    });
  });

  describe('setAuthenticated Action', () => {
    it('should set authentication status to true', () => {
      const { result } = renderHook(() => useAuthState());

      act(() => {
        result.current.setAuthenticated(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should set authentication status to false and clear user', () => {
      const { result } = renderHook(() => useAuthState());
      const mockUser = createMockUser();

      // Set user first
      act(() => {
        result.current.setUser(mockUser);
      });

      // Then set authenticated to false
      act(() => {
        result.current.setAuthenticated(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('setLoading Action', () => {
    it('should set loading state to true', () => {
      const { result } = renderHook(() => useAuthState());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set loading state to false', () => {
      const { result } = renderHook(() => useAuthState());

      // Set loading to true first
      act(() => {
        result.current.setLoading(true);
      });

      // Then set to false
      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('setError Action', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useAuthState());
      const errorMessage = 'Authentication failed';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
    });

    it('should set loading to false when setting error', () => {
      const { result } = renderHook(() => useAuthState());

      // Set loading to true first
      act(() => {
        result.current.setLoading(true);
      });

      // Set error (should clear loading)
      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');
      expect(result.current.isLoading).toBe(false);
    });

    it('should set error to null', () => {
      const { result } = renderHook(() => useAuthState());

      // Set error first
      act(() => {
        result.current.setError('Test error');
      });

      // Clear error
      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('clearError Action', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useAuthState());

      // Set error first
      act(() => {
        result.current.setError('Test error');
      });

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('reset Action', () => {
    it('should reset entire store to initial state', () => {
      const { result } = renderHook(() => useAuthState());
      const mockUser = createMockUser();

      // Set various states
      act(() => {
        result.current.setUser(mockUser);
        result.current.setLoading(true);
        result.current.setError('Test error');
      });

      // Reset store
      act(() => {
        result.current.reset();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Selector Hooks', () => {
    describe('useAuthSelector', () => {
      it('should return selected state', () => {
        const { result: storeResult } = renderHook(() => useAuthState());
        const { result: selectorResult } = renderHook(() =>
          useAuthSelector(state => state.isAuthenticated)
        );

        expect(selectorResult.current).toBe(false);

        act(() => {
          storeResult.current.setAuthenticated(true);
        });

        expect(selectorResult.current).toBe(true);
      });

      it('should return selected user email', () => {
        const { result: storeResult } = renderHook(() => useAuthState());
        const { result: selectorResult } = renderHook(() =>
          useAuthSelector(state => state.user?.email || null)
        );
        const mockUser = createMockUser();

        expect(selectorResult.current).toBeNull();

        act(() => {
          storeResult.current.setUser(mockUser);
        });

        expect(selectorResult.current).toBe(mockUser.email);
      });
    });

    describe('useAuthUser', () => {
      it('should return current user', () => {
        const { result: storeResult } = renderHook(() => useAuthState());
        const { result: userResult } = renderHook(() => useAuthUser());
        const mockUser = createMockUser();

        expect(userResult.current).toBeNull();

        act(() => {
          storeResult.current.setUser(mockUser);
        });

        expect(userResult.current).toEqual(mockUser);
      });
    });

    describe('useAuthLoading', () => {
      it('should return loading state', () => {
        const { result: storeResult } = renderHook(() => useAuthState());
        const { result: loadingResult } = renderHook(() => useAuthLoading());

        expect(loadingResult.current).toBe(false);

        act(() => {
          storeResult.current.setLoading(true);
        });

        expect(loadingResult.current).toBe(true);
      });
    });

    describe('useAuthError', () => {
      it('should return error state', () => {
        const { result: storeResult } = renderHook(() => useAuthState());
        const { result: errorResult } = renderHook(() => useAuthError());
        const errorMessage = 'Test error';

        expect(errorResult.current).toBeNull();

        act(() => {
          storeResult.current.setError(errorMessage);
        });

        expect(errorResult.current).toBe(errorMessage);
      });
    });
  });

  describe('State Synchronization', () => {
    it('should synchronize authentication status with user presence', () => {
      const { result } = renderHook(() => useAuthState());
      const mockUser = createMockUser();

      // Setting user should auto-set authenticated
      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);

      // Setting authenticated false should clear user
      act(() => {
        result.current.setAuthenticated(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should clear error when setting new user', () => {
      const { result } = renderHook(() => useAuthState());
      const mockUser = createMockUser();

      // Set error first
      act(() => {
        result.current.setError('Login failed');
      });

      expect(result.current.error).toBe('Login failed');

      // Setting user should clear error
      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.user).toEqual(mockUser);
    });

    it('should clear loading when setting error', () => {
      const { result } = renderHook(() => useAuthState());

      // Set loading first
      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      // Setting error should clear loading
      act(() => {
        result.current.setError('Authentication failed');
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Authentication failed');
    });
  });

  describe('Multiple State Changes', () => {
    it('should handle complex authentication flow', () => {
      const { result } = renderHook(() => useAuthState());
      const mockUser = createMockUser();

      // 1. Start loading
      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();

      // 2. Successful authentication
      act(() => {
        result.current.setUser(mockUser);
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.error).toBeNull();

      // 3. Logout
      act(() => {
        result.current.setAuthenticated(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should handle failed authentication flow', () => {
      const { result } = renderHook(() => useAuthState());

      // 1. Start loading
      act(() => {
        result.current.setLoading(true);
      });

      // 2. Authentication failure
      act(() => {
        result.current.setError('Invalid credentials');
      });

      expect(result.current.isLoading).toBe(false); // Should be cleared by setError
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe('Invalid credentials');

      // 3. Clear error and retry
      act(() => {
        result.current.clearError();
        result.current.setLoading(true);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle setting same user multiple times', () => {
      const { result } = renderHook(() => useAuthState());
      const mockUser = createMockUser();

      act(() => {
        result.current.setUser(mockUser);
      });

      const firstResult = { ...result.current };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(firstResult.user);
      expect(result.current.isAuthenticated).toBe(firstResult.isAuthenticated);
    });

    it('should handle setting same authentication status multiple times', () => {
      const { result } = renderHook(() => useAuthState());

      act(() => {
        result.current.setAuthenticated(true);
      });

      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.setAuthenticated(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle clearing error multiple times', () => {
      const { result } = renderHook(() => useAuthState());

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
