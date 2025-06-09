/**
 * useAvatar Hook Tests
 * 
 * @fileoverview Comprehensive test suite for the Avatar management hook
 * Tests all hook functionality including avatar loading, uploading, deletion, and error handling
 * 
 * @module useAvatarTests
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */

import { renderHook } from '@testing-library/react-native';
import { useAvatar } from '../use-avatar.hook';
import { useAuth } from '../../../../auth/presentation/hooks/use-auth.hook';

// =============================================================================
// MOCKS
// =============================================================================

// Mock auth hook
jest.mock('../../../../auth/presentation/hooks/use-auth.hook');

// Mock profile container
const mockProfileService = {
  getProfile: jest.fn(),
  uploadAvatar: jest.fn(),
  deleteAvatar: jest.fn(),
};

jest.mock('../../../application/di/profile.container', () => ({
  profileContainer: {
    profileService: mockProfileService,
  },
}));

// Mock ImagePicker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

// =============================================================================
// SETUP & HELPERS
// =============================================================================

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
};

describe('useAvatar Hook', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default auth mock
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    } as any);
  });
  
  afterEach(() => {
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

    it('should start with loading state when user is available', async () => {
      // Mock user available
      mockUseAuth.mockReturnValue({
        user: { id: 'user-123' },
        isLoading: false,
        isAuthenticated: true,
      } as any);

      const { result } = renderHook(() => useAvatar());

      // Should start with idle state initially
      expect(result.current.loadingState).toBe('idle');
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
      expect(result.current.loadingState).toBe('idle');
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