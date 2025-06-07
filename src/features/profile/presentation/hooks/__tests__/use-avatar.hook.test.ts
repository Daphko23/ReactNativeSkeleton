/**
 * useAvatar Hook Tests
 * Simplified test coverage for avatar hook functionality
 */

import { renderHook } from '@testing-library/react-native';
import { useAvatar } from '../use-avatar.hook';
import { useAuth } from '@features/auth/presentation/hooks';

// Mock dependencies
jest.mock('@features/auth/presentation/hooks');

describe('useAvatar Hook', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default state when no user', () => {
      // Mock no user available
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      } as any);

      const { result } = renderHook(() => useAvatar());

      expect(result.current.avatarUrl).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.hasAvatar).toBe(false);
    });

    it('should start with loading state when user is available', () => {
      // Mock user available
      mockUseAuth.mockReturnValue({
        user: { id: 'user-123' },
        isLoading: false,
        isAuthenticated: true,
      } as any);

      const { result } = renderHook(() => useAvatar());

      // Should start with loading state
      expect(result.current.loadingState).toBe('loading');
      expect(result.current.avatarUrl).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.hasAvatar).toBe(false);
    });

    it('should not load when no user is available', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      } as any);

      const { result } = renderHook(() => useAvatar());

      // Should not be in loading state when no user
      expect(result.current.loadingState).toBe('idle');
    });
  });

  describe('clearAvatar', () => {
    it('should clear avatar and error', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-123' },
        isLoading: false,
        isAuthenticated: true,
      } as any);

      const { result } = renderHook(() => useAvatar());

      // Clear avatar
      result.current.clearAvatar();

      expect(result.current.avatarUrl).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.hasAvatar).toBe(false);
    });
  });

  describe('hasAvatar computed property', () => {
    it('should return false when no avatar URL', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-123' },
        isLoading: false,
        isAuthenticated: true,
      } as any);

      const { result } = renderHook(() => useAvatar());

      expect(result.current.hasAvatar).toBe(false);
    });

    it('should return false when loading', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user-123' },
        isLoading: false,
        isAuthenticated: true,
      } as any);

      const { result } = renderHook(() => useAvatar());

      // Should be false during loading
      expect(result.current.hasAvatar).toBe(false);
      expect(result.current.loadingState).toBe('loading');
    });
  });

  describe('refreshAvatar', () => {
    it('should not refresh when no user ID', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      } as any);

      const { result } = renderHook(() => useAvatar());

      await result.current.refreshAvatar();

      expect(result.current.avatarUrl).toBeNull();
    });
  });
}); 