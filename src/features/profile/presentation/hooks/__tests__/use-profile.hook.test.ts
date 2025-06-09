/**
 * useProfile Hook Tests
 * 
 * @fileoverview Comprehensive test suite for the Profile management hook
 * Tests all hook functionality including profile loading, updating, avatar management, and error handling
 * 
 * @module useProfileTests
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProfile } from '../use-profile.hook';
import { useAuthStore } from '../../../../auth/presentation/store/auth.store';
// Unused imports removed to fix linting warnings

// =============================================================================
// MOCKS
// =============================================================================

// Mock the profile service
const mockProfileService = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  syncProfile: jest.fn(),
  uploadAvatar: jest.fn(),
  deleteAvatar: jest.fn(),
  updatePrivacySettings: jest.fn(),
  calculateCompleteness: jest.fn(),
  getPrivacySettings: jest.fn(),
};

// Mock profile container
jest.mock('../../../application/di/profile.container', () => ({
  profileContainer: {
    get profileService() {
      return mockProfileService;
    },
  },
}));

// Mock auth store
jest.mock('../../../../auth/presentation/store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

// Mock error handler
const mockShowError = jest.fn();
const mockHandleAsyncError = jest.fn();

jest.mock('../../../../../shared/hooks/use-error-handler', () => ({
  useErrorHandler: jest.fn(() => ({
    showError: mockShowError,
    handleAsyncError: mockHandleAsyncError,
  })),
}));

// Mock loading state
const mockWithLoading = jest.fn();
const mockIsLoading = jest.fn();

jest.mock('../../../../../shared/hooks/use-loading-state', () => ({
  useLoadingState: jest.fn(() => ({
    isLoading: mockIsLoading,
    withLoading: mockWithLoading,
  })),
}));

// Mock observability
jest.mock('../../../../../core/monitoring/profile-observability.service', () => ({
  profileObservability: {
    startProfileOperation: jest.fn(() => 'test-correlation-id'),
    endProfileOperation: jest.fn(),
    recordProfileMetrics: jest.fn(),
  },
}));

// Mock GDPR audit service
jest.mock('../../../data/services/gdpr-audit.service', () => ({
  gdprAuditService: {
    logDataAccess: jest.fn(),
    logDataUpdate: jest.fn(),
  },
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

describe('useProfile Hook', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup auth store mock
    (useAuthStore as jest.MockedFunction<any>).mockReturnValue(mockUser);
    
    // Setup error handler mock with proper async implementation
    mockHandleAsyncError.mockImplementation(async (asyncFn, category) => {
      try {
        return await asyncFn();
      } catch (error: any) {
        mockShowError(error.message, category);
        throw error;
      }
    });
    
    // Setup loading state mock with proper async implementation
    mockWithLoading.mockImplementation(async (key, asyncFn) => {
      return await asyncFn();
    });
    
    mockIsLoading.mockReturnValue(false);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  // =============================================================================
  // PROFILE LOADING TESTS
  // =============================================================================
  
  describe('Profile Loading', () => {

    it('should load profile on mount', async () => {
      const mockProfile = {
        id: 'profile-123',
        userId: 'test-user-id',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      };

      mockProfileService.getProfile.mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useProfile());

      await waitFor(() => {
        expect(result.current.profile).toEqual(mockProfile);
      }, { timeout: 3000 });

      expect(mockProfileService.getProfile).toHaveBeenCalledWith('test-user-id');
    });
    
    it('should handle profile loading errors', async () => {
      mockProfileService.getProfile.mockRejectedValue(new Error('Failed to load profile'));
      
      const { result } = renderHook(() => useProfile());
      
      await waitFor(() => {
        expect(result.current.profile).toBeNull();
      });
      
      expect(mockHandleAsyncError).toHaveBeenCalled();
    });
    
    it('should return null profile when user is not authenticated', async () => {
      (useAuthStore as jest.MockedFunction<any>).mockReturnValue(null);
      
      const { result } = renderHook(() => useProfile());
      
      expect(result.current.profile).toBeNull();
      expect(mockProfileService.getProfile).not.toHaveBeenCalled();
    });
  });
  
  // =============================================================================
  // PROFILE UPDATE TESTS
  // =============================================================================
  
  describe('Profile Updates', () => {

    it('should update profile successfully', async () => {
      const initialProfile = {
        id: 'profile-123',
        userId: 'test-user-id',
        firstName: 'Test',
        lastName: 'User',
      };

      const updatedProfile = {
        id: 'profile-123',
        userId: 'test-user-id',
        firstName: 'Updated',
        lastName: 'User',
      };

      // Setup initial profile load
      mockProfileService.getProfile.mockResolvedValue(initialProfile);
      mockProfileService.updateProfile.mockResolvedValue(updatedProfile);

      const { result } = renderHook(() => useProfile());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.profile).toEqual(initialProfile);
      });

      // Test update
      await act(async () => {
        const success = await result.current.updateProfile({ firstName: 'Updated' });
        expect(success).toBe(true);
      });

      expect(mockProfileService.updateProfile).toHaveBeenCalledWith('test-user-id', { firstName: 'Updated' });
      
      await waitFor(() => {
        expect(result.current.profile).toEqual(updatedProfile);
      });
    });

    it('should handle profile update error', async () => {
      const initialProfile = {
        id: 'profile-123',
        userId: 'test-user-id',
        firstName: 'Test',
        lastName: 'User',
      };

      // Setup initial profile load
      mockProfileService.getProfile.mockResolvedValue(initialProfile);
      mockProfileService.updateProfile.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useProfile());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.profile).toEqual(initialProfile);
      });

      // Test update error
      await act(async () => {
        const success = await result.current.updateProfile({ firstName: 'Updated' });
        expect(success).toBe(false);
      });

      expect(mockHandleAsyncError).toHaveBeenCalled();
    });
    
    it('should not update profile when user is not authenticated', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue(null);
      
      const { result } = renderHook(() => useProfile());
      
      await act(async () => {
        const success = await result.current.updateProfile({ firstName: 'Updated' });
        expect(success).toBe(false);
      });
      
      expect(mockShowError).toHaveBeenCalledWith('User not authenticated', 'auth');
      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });
  });
  
  // =============================================================================
  // PRIVACY SETTINGS TESTS
  // =============================================================================
  
  describe('Privacy Settings', () => {
    
    it('should update privacy settings successfully', async () => {
      const mockSettings = { profileVisibility: 'private' };
      mockProfileService.updatePrivacySettings.mockResolvedValue(true);
      
      const { result } = renderHook(() => useProfile());
      
      await act(async () => {
        const success = await result.current.updatePrivacySettings(mockSettings);
        expect(success).toBe(true);
      });
      
      expect(mockProfileService.updatePrivacySettings).toHaveBeenCalledWith('test-user-id', mockSettings);
    });
    
    it('should handle privacy settings update error', async () => {
      const mockSettings = { profileVisibility: 'private' };
      mockProfileService.updatePrivacySettings.mockRejectedValue(new Error('Update failed'));
      
      const { result } = renderHook(() => useProfile());
      
      await act(async () => {
        const success = await result.current.updatePrivacySettings(mockSettings);
        expect(success).toBe(false);
      });
      
      expect(mockHandleAsyncError).toHaveBeenCalled();
    });
  });
  
  // =============================================================================
  // PROFILE COMPLETENESS TESTS
  // =============================================================================
  
  describe('Profile Completeness', () => {
    
    it('should calculate completeness correctly', async () => {
      const mockProfile = {
        id: 'profile-123',
        userId: 'test-user-id',
        firstName: 'Test',
        lastName: 'User',
      };
      
      mockProfileService.getProfile.mockResolvedValue(mockProfile);
      mockProfileService.calculateCompleteness.mockReturnValue(75);
      
      const { result } = renderHook(() => useProfile());
      
      // Wait for profile to load
      await waitFor(() => {
        expect(result.current.profile).toEqual(mockProfile);
      });
      
      const completeness = result.current.calculateCompleteness();
      expect(completeness).toBe(75);
      expect(mockProfileService.calculateCompleteness).toHaveBeenCalledWith(mockProfile);
    });
    
    it('should return 0 completeness when no profile exists', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue(null);
      
      const { result } = renderHook(() => useProfile());
      
      const completeness = result.current.calculateCompleteness();
      expect(completeness).toBe(0);
    });
  });
  
  // =============================================================================
  // AVATAR MANAGEMENT TESTS
  // =============================================================================
  
  describe('Avatar Management', () => {
    
    it('should upload avatar successfully', async () => {
      const initialProfile = {
        id: 'profile-123',
        userId: 'test-user-id',
        firstName: 'Test',
      };
      
      const updatedProfile = {
        ...initialProfile,
        avatarUrl: 'new-avatar-url',
      };
      
      mockProfileService.getProfile.mockResolvedValue(initialProfile);
      mockProfileService.uploadAvatar.mockResolvedValue(updatedProfile);
      
      const { result } = renderHook(() => useProfile());
      
      // Wait for initial load
      await waitFor(() => {
        expect(result.current.profile).toEqual(initialProfile);
      });
      
      // Test avatar upload
      await act(async () => {
        const success = await result.current.uploadAvatar('image-uri');
        expect(success).toBe(true);
      });
      
      expect(mockProfileService.uploadAvatar).toHaveBeenCalledWith('test-user-id', 'image-uri');
    });
    
    it('should handle avatar upload error', async () => {
      mockProfileService.uploadAvatar.mockRejectedValue(new Error('Upload failed'));
      
      const { result } = renderHook(() => useProfile());
      
      await act(async () => {
        const success = await result.current.uploadAvatar('image-uri');
        expect(success).toBe(false);
      });
      
      expect(mockHandleAsyncError).toHaveBeenCalled();
    });
    
    it('should delete avatar successfully', async () => {
      const initialProfile = {
        id: 'profile-123',
        userId: 'test-user-id',
        firstName: 'Test',
        avatarUrl: 'old-url',
      };
      
      const updatedProfile = {
        ...initialProfile,
        avatarUrl: null,
      };
      
      mockProfileService.getProfile.mockResolvedValue(initialProfile);
      mockProfileService.deleteAvatar.mockResolvedValue(updatedProfile);
      
      const { result } = renderHook(() => useProfile());
      
      // Wait for initial load
      await waitFor(() => {
        expect(result.current.profile).toEqual(initialProfile);
      });
      
      // Test avatar deletion
      await act(async () => {
        const success = await result.current.deleteAvatar();
        expect(success).toBe(true);
      });
      
      expect(mockProfileService.deleteAvatar).toHaveBeenCalledWith('test-user-id');
    });
  });
  
  // =============================================================================
  // PROFILE REFRESH TESTS
  // =============================================================================
  
  describe('Profile Refresh', () => {
    
    it('should refresh profile', async () => {
      const initialProfile = {
        id: 'profile-123',
        userId: 'test-user-id',
        firstName: 'Test',
        lastName: 'User',
      };
      
      const refreshedProfile = {
        ...initialProfile,
        firstName: 'Refreshed',
      };
      
      mockProfileService.getProfile.mockResolvedValue(initialProfile);
      mockProfileService.syncProfile.mockResolvedValue(refreshedProfile);
      
      const { result } = renderHook(() => useProfile());
      
      // Wait for initial load
      await waitFor(() => {
        expect(result.current.profile).toEqual(initialProfile);
      });
      
      // Test refresh
      await act(async () => {
        await result.current.refreshProfile();
      });
      
      expect(mockProfileService.syncProfile).toHaveBeenCalledWith('test-user-id');
      
      await waitFor(() => {
        expect(result.current.profile).toEqual(refreshedProfile);
      });
    });
    
    it('should handle refresh profile error', async () => {
      mockProfileService.syncProfile.mockRejectedValue(new Error('Refresh failed'));
      
      const { result } = renderHook(() => useProfile());
      
      await act(async () => {
        await result.current.refreshProfile();
      });
      
      expect(mockHandleAsyncError).toHaveBeenCalled();
    });
  });
  
  // =============================================================================
  // HOOK STATE TESTS
  // =============================================================================
  
  describe('Hook State', () => {
    
    it('should expose loading states correctly', () => {
      const { result } = renderHook(() => useProfile());
      
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isUpdating).toBe('boolean');
      expect(typeof result.current.isRefreshing).toBe('boolean');
    });
    
    it('should expose all required hook methods', () => {
      const { result } = renderHook(() => useProfile());
      
      expect(typeof result.current.refreshProfile).toBe('function');
      expect(typeof result.current.updateProfile).toBe('function');
      expect(typeof result.current.calculateCompleteness).toBe('function');
      expect(typeof result.current.updatePrivacySettings).toBe('function');
      expect(typeof result.current.uploadAvatar).toBe('function');
      expect(typeof result.current.deleteAvatar).toBe('function');
    });
  });
}); 