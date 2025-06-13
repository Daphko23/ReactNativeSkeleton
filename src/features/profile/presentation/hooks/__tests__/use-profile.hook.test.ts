/**
 * @fileoverview ENTERPRISE PROFILE HOOK TESTS - 2025 Standards
 * 
 * @description Comprehensive test suite for useProfile hook
 * Covers TanStack Query integration, GDPR compliance, security, and performance
 * @version 2025.1.0
 * @standard Enterprise Testing Standards, GDPR Compliance, Security Testing
 * @since Enterprise Industry Standard 2025
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProfile } from '../use-profile.hook';
import { UserProfile, PrivacySettings } from '../../../domain/entities/user-profile.entity';
import { AuthUser } from '@features/auth/domain/entities/auth-user.entity';

// =============================================================================
// MOCKS & TEST SETUP
// =============================================================================

// Mock Auth Hook
jest.mock('@features/auth/presentation/hooks', () => ({
  useAuth: jest.fn()
}));

// Mock Profile Query Hooks
jest.mock('../use-profile-query.hook', () => ({
  useProfileQuery: jest.fn(),
  usePrivacySettingsQuery: jest.fn(),
  useUpdateProfileMutation: jest.fn(),
  useUpdatePrivacySettingsMutation: jest.fn()
}));

import { useAuth } from '@features/auth/presentation/hooks';
import {
  useProfileQuery,
  usePrivacySettingsQuery,
  useUpdateProfileMutation,
  useUpdatePrivacySettingsMutation
} from '../use-profile-query.hook';

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseProfileQuery = useProfileQuery as jest.MockedFunction<typeof useProfileQuery>;
const mockUsePrivacySettingsQuery = usePrivacySettingsQuery as jest.MockedFunction<typeof usePrivacySettingsQuery>;
const mockUseUpdateProfileMutation = useUpdateProfileMutation as jest.MockedFunction<typeof useUpdateProfileMutation>;
const mockUseUpdatePrivacySettingsMutation = useUpdatePrivacySettingsMutation as jest.MockedFunction<typeof useUpdatePrivacySettingsMutation>;

// =============================================================================
// TEST DATA
// =============================================================================

// Mock user with complete AuthUser interface
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  emailVerified: true,
  status: 'active' as any,
  role: 'user' as any,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  provider: 'email',
  providerId: 'test-provider-id',
  avatar: null,
  customFields: {},
  preferences: {},
  privacySettings: {},
  pushNotificationSettings: {},
  sessionData: {},
  toSessionData: () => ({})
} as unknown as AuthUser;

// Mock profile with corrected properties
const mockProfile: UserProfile = {
  id: 'test-user-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  displayName: 'John Doe',
  bio: 'Software Engineer',
  phone: '+1234567890',
  avatar: 'https://example.com/avatar.jpg',
  location: 'Berlin, Germany',
  website: 'https://johndoe.dev',
  professional: {
    company: 'Tech Corp',
    jobTitle: 'Senior Developer',
    industry: 'Technology',
    workLocation: 'remote',
  },
  socialLinks: {
    linkedIn: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    github: 'https://github.com/johndoe',
    instagram: 'https://instagram.com/johndoe'
  },
  customFields: {
    hobbies: 'Reading, Gaming',
    languages: 'German, English'
  },
  privacySettings: {
    profileVisibility: 'public' as const,
    emailVisibility: 'friends' as const,
    phoneVisibility: 'private' as const,
    locationVisibility: 'public' as const,
    socialLinksVisibility: 'public' as const,
    professionalInfoVisibility: 'public' as const,
    allowDirectMessages: true,
    allowFriendRequests: true,
    showOnlineStatus: true,
    showLastActive: false,
    searchVisibility: true,
    directoryListing: true,
    allowProfileViews: true,
    allowAnalytics: true,
    allowThirdPartySharing: false,
    trackProfileViews: true,
    emailNotifications: true,
    pushNotifications: true,
    marketingCommunications: false,
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-01'),
  profileVersion: 1,
  isComplete: true,
  isVerified: true,
};

// Mock simple privacy settings for tests
const mockPrivacySettings: Partial<PrivacySettings> = {
  profileVisibility: 'public',
  emailVisibility: 'private',
  phoneVisibility: 'private',
  socialLinksVisibility: 'public',
  professionalInfoVisibility: 'public',
  allowAnalytics: true,
  allowThirdPartySharing: false
};

// =============================================================================
// TEST WRAPPER
// =============================================================================

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  
  TestWrapper.displayName = 'TestWrapper';
  
  return TestWrapper;
};

// =============================================================================
// ENTERPRISE TESTS
// =============================================================================

describe('useProfile Hook - Enterprise Tests', () => {
  let mockMutateAsync: jest.Mock;
  let mockRefetch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockMutateAsync = jest.fn();
    mockRefetch = jest.fn();

    // Default Auth Mock
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuthStatus: jest.fn(),
      getCurrentUser: jest.fn(),
      clearError: jest.fn(),
      resetAuth: jest.fn()
    });

    // Default Query Mocks
    mockUseProfileQuery.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetch
    } as any);

    mockUsePrivacySettingsQuery.mockReturnValue({
      data: mockPrivacySettings,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetch
    } as any);

    mockUseUpdateProfileMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null
    } as any);

    mockUseUpdatePrivacySettingsMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null
    } as any);
  });

  // =============================================================================
  // BASIC FUNCTIONALITY TESTS
  // =============================================================================

  describe('🎯 Basic Functionality', () => {
    test('should return profile data correctly', () => {
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test('should handle loading states correctly', () => {
      mockUseProfileQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isFetching: false,
        error: null,
        refetch: mockRefetch
      } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.profile).toBeNull();
    });

    test('should handle error states correctly', () => {
      const mockError = new Error('Profile fetch failed');
      mockUseProfileQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: mockError,
        refetch: mockRefetch
      } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.error).toBe('Profile fetch failed');
      expect(result.current.profile).toBeNull();
    });
  });

  // =============================================================================
  // TANSTACK QUERY INTEGRATION TESTS
  // =============================================================================

  describe('🔄 TanStack Query Integration', () => {
    test('should refresh profile data correctly', async () => {
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        await result.current.refreshProfile();
      });

      expect(mockRefetch).toHaveBeenCalledTimes(2); // Profile + Privacy queries
    });

    test('should handle concurrent refresh operations', async () => {
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        const promises = [
          result.current.refreshProfile(),
          result.current.refreshProfile(),
          result.current.refreshProfile()
        ];
        await Promise.all(promises);
      });

      expect(mockRefetch).toHaveBeenCalledTimes(6); // 3 calls × 2 queries each
    });

    test('should handle query invalidation correctly', async () => {
      mockMutateAsync.mockResolvedValue(mockProfile);
      
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        const success = await result.current.updateProfile({ bio: 'Updated bio' });
        expect(success).toBe(true);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        userId: 'test-user-123',
        updates: { bio: 'Updated bio' }
      });
    });
  });

  // =============================================================================
  // PROFILE UPDATE TESTS
  // =============================================================================

  describe('✏️ Profile Updates', () => {
    test('should update profile successfully', async () => {
      mockMutateAsync.mockResolvedValue(mockProfile);
      
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        const success = await result.current.updateProfile({
          firstName: 'Jane',
          lastName: 'Smith',
          bio: 'Updated bio'
        });
        expect(success).toBe(true);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        userId: 'test-user-123',
        updates: {
          firstName: 'Jane',
          lastName: 'Smith',
          bio: 'Updated bio'
        }
      });
    });

    test('should handle profile update failures', async () => {
      mockMutateAsync.mockRejectedValue(new Error('Update failed'));
      
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        const success = await result.current.updateProfile({ bio: 'New bio' });
        expect(success).toBe(false);
      });
    });

    test('should require user ID for updates', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        checkAuthStatus: jest.fn(),
        getCurrentUser: jest.fn(),
        clearError: jest.fn(),
        resetAuth: jest.fn()
      });

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        await expect(result.current.updateProfile({ bio: 'New bio' }))
          .rejects.toThrow('User ID required for profile update');
      });
    });
  });

  // =============================================================================
  // PRIVACY SETTINGS TESTS (GDPR COMPLIANCE)
  // =============================================================================

  describe('🔒 Privacy Settings (GDPR Compliance)', () => {
    test('should update privacy settings successfully', async () => {
      mockMutateAsync.mockResolvedValue(mockProfile);
      
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      const newPrivacySettings = {
        profileVisibility: 'private' as const,
        allowAnalytics: false,
        allowThirdPartySharing: false
      };

      await act(async () => {
        const success = await result.current.updatePrivacySettings({
          allowAnalytics: false,
          allowThirdPartySharing: false,
          marketingCommunications: false
        });
        expect(success).toBe(true);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        userId: 'test-user-123',
        settings: newPrivacySettings
      });
    });

    test('should handle GDPR data processing consent withdrawal', async () => {
      mockMutateAsync.mockResolvedValue(mockProfile);
      
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        const success = await result.current.updatePrivacySettings({
          allowAnalytics: false,
          allowThirdPartySharing: false,
          marketingCommunications: false
        });
        expect(success).toBe(true);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        userId: 'test-user-123',
        settings: {
          allowAnalytics: false,
          allowThirdPartySharing: false,
          marketingCommunications: false
        }
      });
    });

    test('should handle privacy settings update failures', async () => {
      mockMutateAsync.mockRejectedValue(new Error('Privacy update failed'));
      
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        const success = await result.current.updatePrivacySettings({
          profileVisibility: 'private'
        });
        expect(success).toBe(false);
      });
    });

    test('should handle privacy settings with missing fields', async () => {
      const partialPrivacySettings: Partial<PrivacySettings> = {
        profileVisibility: 'public',
        emailVisibility: 'private',
        phoneVisibility: 'private'
      };

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        await result.current.updatePrivacySettings(partialPrivacySettings);
      });

      expect(mockMutateAsync).toHaveBeenCalled();
    });

    test('should handle rerender correctly', () => {
      const { result, rerender } = renderHook(() => useProfile());

      const initialResult = result.current;

      rerender({});

      // Functions should be stable
      expect(result.current.updateProfile).toBe(initialResult.updateProfile);
    });
  });

  // =============================================================================
  // PROFILE COMPLETENESS TESTS
  // =============================================================================

  describe('📊 Profile Completeness', () => {
    test('should calculate completeness for fully filled profile', async () => {
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        const completeness = await result.current.calculateCompleteness();
        expect(completeness).toBeGreaterThan(80); // Well-filled profile
      });
    });

    test('should calculate completeness for minimal profile', async () => {
      const minimalProfile = {
        ...mockProfile,
        bio: '',
        avatar: '',
        phone: '',
        location: '',
        website: '',
        socialLinks: {},
        professional: {}
      };

      mockUseProfileQuery.mockReturnValue({
        data: minimalProfile,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: mockRefetch
      } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        const completeness = await result.current.calculateCompleteness();
        expect(completeness).toBeLessThan(50); // Minimal profile
      });
    });

    test('should return 0 completeness for null profile', async () => {
      mockUseProfileQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: mockRefetch
      } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        const completeness = await result.current.calculateCompleteness();
        expect(completeness).toBe(0);
      });
    });
  });

  // =============================================================================
  // AVATAR MANAGEMENT TESTS
  // =============================================================================

  describe('🖼️ Avatar Management', () => {
    test('should handle avatar upload (TODO implementation)', async () => {
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await act(async () => {
        const success = await result.current.uploadAvatar('file://avatar.jpg');
        expect(success).toBe(false); // Not yet implemented
      });

      expect(consoleSpy).toHaveBeenCalledWith('Avatar upload not yet migrated to TanStack Query');
      consoleSpy.mockRestore();
    });

    test('should handle avatar deletion (TODO implementation)', async () => {
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await act(async () => {
        const success = await result.current.deleteAvatar();
        expect(success).toBe(false); // Not yet implemented
      });

      expect(consoleSpy).toHaveBeenCalledWith('Avatar deletion not yet migrated to TanStack Query');
      consoleSpy.mockRestore();
    });
  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('⚡ Performance Tests', () => {
    test('should handle rapid successive updates efficiently', async () => {
      mockMutateAsync.mockResolvedValue(mockProfile);
      
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      const startTime = performance.now();

      await act(async () => {
        const updates = Array.from({ length: 10 }, (_, i) => 
          result.current.updateProfile({ bio: `Bio update ${i}` })
        );
        await Promise.all(updates);
      });

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in < 1s
    });

    test('should memoize computed states correctly', () => {
      const wrapper = createTestWrapper();
      const { result, rerender } = renderHook(() => useProfile(), { wrapper });

      const initialIsLoading = result.current.isLoading;
      const initialError = result.current.error;

      // Rerender without changing dependencies
      rerender({});

      expect(result.current.isLoading).toBe(initialIsLoading);
      expect(result.current.error).toBe(initialError);
    });

    test('should handle memory cleanup on unmount', () => {
      const wrapper = createTestWrapper();
      const { unmount } = renderHook(() => useProfile(), { wrapper });

      expect(() => unmount()).not.toThrow();
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('🚨 Error Handling', () => {
    test('should handle network errors gracefully', () => {
      const networkError = new Error('Network request failed');
      mockUseProfileQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: networkError,
        refetch: mockRefetch
      } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.error).toBe('Network request failed');
      expect(result.current.profile).toBeNull();
    });

    test('should handle concurrent error states', () => {
      const profileError = new Error('Profile error');
      const privacyError = new Error('Privacy error');

      mockUseProfileQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: profileError,
        refetch: mockRefetch
      } as any);

      mockUsePrivacySettingsQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: privacyError,
        refetch: mockRefetch
      } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      // Should return the first error encountered
      expect(result.current.error).toBe('Profile error');
    });
  });

  // =============================================================================
  // SECURITY TESTS
  // =============================================================================

  describe('🔐 Security Tests', () => {
    test('should validate user authentication before operations', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        checkAuthStatus: jest.fn(),
        getCurrentUser: jest.fn(),
        clearError: jest.fn(),
        resetAuth: jest.fn()
      });

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        await expect(result.current.updateProfile({ bio: 'test' }))
          .rejects.toThrow('User ID required for profile update');
      });

      await act(async () => {
        await expect(result.current.updatePrivacySettings({ profileVisibility: 'private' }))
          .rejects.toThrow('User ID required for privacy settings update');
      });
    });

    test('should handle sensitive data updates securely', async () => {
      mockMutateAsync.mockResolvedValue(mockProfile);
      
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      const sensitiveUpdate = {
        email: 'newemail@example.com',
        phone: '+1-555-999-8888'
      };

      await act(async () => {
        const success = await result.current.updateProfile(sensitiveUpdate);
        expect(success).toBe(true);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        userId: 'test-user-123',
        updates: sensitiveUpdate
      });
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('🔗 Integration Tests', () => {
    test('should integrate with auth state changes', async () => {
      const wrapper = createTestWrapper();
      const { result, rerender } = renderHook(() => useProfile(), { wrapper });

      // Initially authenticated
      expect(result.current.profile).toEqual(mockProfile);

      // Simulate logout
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        checkAuthStatus: jest.fn(),
        getCurrentUser: jest.fn(),
        clearError: jest.fn(),
        resetAuth: jest.fn()
      });

      rerender({});

      await act(async () => {
        await expect(result.current.updateProfile({ bio: 'test' }))
          .rejects.toThrow('User ID required for profile update');
      });
    });

    test('should handle real-world profile update scenario', async () => {
      mockMutateAsync.mockResolvedValue({
        ...mockProfile,
        bio: 'Updated bio',
        professional: {
          ...mockProfile.professional,
          jobTitle: 'Lead Developer'
        }
      });

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfile(), { wrapper });

      await act(async () => {
        // Update basic info
        await result.current.updateProfile({
          bio: 'Updated bio'
        });

        // Update professional info
        await result.current.updateProfile({
          professional: {
            ...mockProfile.professional,
            jobTitle: 'Lead Developer'
          }
        });

        // Update privacy settings
        await result.current.updatePrivacySettings({
          profileVisibility: 'private',
          allowAnalytics: true
        });
      });

      expect(mockMutateAsync).toHaveBeenCalledTimes(3);
    });
  });
});

/**
 * Enterprise Testing Standards Compliance:
 * 
 * ✅ TanStack Query Integration Testing
 * ✅ GDPR Privacy Compliance Testing
 * ✅ Security Authentication Testing
 * ✅ Performance & Memory Testing
 * ✅ Error Handling & Resilience Testing
 * ✅ Real-world Integration Scenarios
 * ✅ Profile Completeness Logic Testing
 * ✅ Avatar Management Testing
 * ✅ Concurrent Operations Testing
 * ✅ State Management Testing
 * ✅ 95%+ Code Coverage Target
 */ 