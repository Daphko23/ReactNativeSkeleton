/**
 * @fileoverview ENTERPRISE PROFILE QUERY HOOK TESTS - 2025 Standards
 *
 * @description Comprehensive test suite for useProfileQuery hooks covering:
 * - TanStack Query Integration Testing
 * - Champion Query & Mutation Testing
 * - Cache Management Testing
 * - GDPR Privacy Settings Testing
 * - Mobile Performance Testing
 * - Error Handling & Recovery
 *
 * @version 2025.1.0
 * @standard Enterprise Testing Standards, GDPR Compliance, Mobile Performance
 * @since Enterprise Industry Standard 2025
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useProfileQuery,
  usePrivacySettingsQuery,
  useUpdateProfileMutation,
  useUpdatePrivacySettingsMutation,
  useDeleteProfileMutation,
  useProfileCacheUtils,
} from '../use-profile-query.hook';

import {
  UserProfile,
  PrivacySettings,
} from '../../../domain/entities/user-profile.entity';

/**
 * @fileoverview GLOBAL MOCK REGISTRY PATTERN - Sophisticated Test Architecture
 *
 * 🏆 SOPHISTICATED MOCK SYSTEM:
 * - Globale Mock-Registry für alle Repository-Instanzen
 * - Zentrale Mock-Konfiguration für mehrere Test-Dateien
 * - Automatic Instance Interception für jeden new ProfileRepositoryImpl() Call
 * - Enterprise-Grade Testability ohne Production Code Änderungen
 */

// =============================================================================
// 🚀 GLOBAL MOCK REGISTRY - SOPHISTICATED PATTERN
// =============================================================================

/**
 * Global Mock Registry für Repository Instanzen
 * Alle new ProfileRepositoryImpl() Calls werden hier abgefangen
 */
class GlobalMockRegistry {
  private static instance: GlobalMockRegistry;
  private mockInstances: Map<string, any> = new Map();

  static getInstance(): GlobalMockRegistry {
    if (!GlobalMockRegistry.instance) {
      GlobalMockRegistry.instance = new GlobalMockRegistry();
    }
    return GlobalMockRegistry.instance;
  }

  registerMock(key: string, mockInstance: any): void {
    this.mockInstances.set(key, mockInstance);
  }

  getMock(key: string): any {
    return this.mockInstances.get(key);
  }

  clearAll(): void {
    this.mockInstances.clear();
  }
}

// Global Registry Instanz
const mockRegistry = GlobalMockRegistry.getInstance();

// ✅ SOPHISTICATED: Mock abfängt ALLE ProfileRepositoryImpl Konstruktor-Calls
jest.mock('../../../data/repositories/profile.repository.impl', () => {
  // ✅ FIX: Lokale Registry in Mock Factory um Hoisting zu vermeiden
  const localMockRepository = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    deleteProfile: jest.fn(),
    createProfile: jest.fn(),
    searchProfiles: jest.fn(),
  };

  return {
    ProfileRepositoryImpl: jest.fn().mockImplementation((...args) => {
      console.log('🔥 SOPHISTICATED MOCK: ProfileRepositoryImpl intercepted', {
        args,
        mockMethods: Object.keys(localMockRepository),
      });
      return localMockRepository;
    }),
    // Export Interface for type safety
    IProfileRepository: {},
  };
});

// ✅ SOPHISTICATED: Zentrale Mock-Referenz durch direkten Zugriff
let mockRepository: any;

beforeAll(() => {
  // Hole die Mock-Instanz nach dem Import
  const ProfileRepositoryImpl =
    require('../../../data/repositories/profile.repository.impl').ProfileRepositoryImpl;
  mockRepository = new ProfileRepositoryImpl();
  console.log('🏆 SOPHISTICATED SETUP: Mock repository retrieved', {
    mockRepository: !!mockRepository,
    methods: Object.keys(mockRepository),
  });
});

// =============================================================================
// MOCKS & TEST SETUP
// =============================================================================

// Mock Logger
jest.mock('@core/logging/logger.factory', () => ({
  LoggerFactory: {
    createServiceLogger: jest.fn(() => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    })),
  },
}));

// =============================================================================
// TEST DATA
// =============================================================================

const mockUserId = 'test-user-123';
const mockProfile: UserProfile = {
  id: mockUserId,
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
    instagram: 'https://instagram.com/johndoe',
  },
  customFields: {
    hobbies: 'Reading, Gaming',
    languages: 'German, English',
  },
  privacySettings: {
    profileVisibility: 'public',
    emailVisibility: 'friends',
    phoneVisibility: 'private',
    locationVisibility: 'public',
    socialLinksVisibility: 'public',
    professionalInfoVisibility: 'public',
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

const mockPrivacySettings: PrivacySettings = mockProfile.privacySettings!;

const mockProfileUpdates = {
  firstName: 'Jane',
  bio: 'Updated bio text',
};

const mockPrivacyUpdates: Partial<PrivacySettings> = {
  profileVisibility: 'private',
  allowAnalytics: false,
};

// =============================================================================
// TEST WRAPPER
// =============================================================================

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  TestWrapper.displayName = 'TestWrapper';

  return TestWrapper;
};

// =============================================================================
// ENTERPRISE TESTS
// =============================================================================

describe('useProfileQuery Hooks - Enterprise Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ FIX: Stelle sicher dass alle Mock Repository Funktionen verfügbar sind
    mockRepository.getProfile.mockResolvedValue(mockProfile);
    mockRepository.updateProfile.mockResolvedValue({
      ...mockProfile,
      ...mockProfileUpdates,
    });
    mockRepository.deleteProfile.mockResolvedValue(true);
    mockRepository.createProfile.mockResolvedValue(mockProfile);
    mockRepository.searchProfiles.mockResolvedValue([mockProfile]);

    console.log('✅ MOCK SETUP COMPLETE: All methods configured');
  });

  // =============================================================================
  // PROFILE QUERY TESTS
  // =============================================================================

  describe('🔍 useProfileQuery', () => {
    it('should fetch profile data successfully', async () => {
      // ✅ FIX: Local success mock setup
      mockRepository.getProfile.mockResolvedValue(mockProfile);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfileQuery(mockUserId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockProfile);
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockRepository.getProfile).toHaveBeenCalledWith(mockUserId);
    });

    it('should handle loading states correctly', () => {
      mockRepository.getProfile.mockImplementation(() => new Promise(() => {})); // Never resolves

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfileQuery(mockUserId), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isSuccess).toBe(false);
    });

    it('should handle error states correctly', async () => {
      const queryError = new Error('Profile fetch failed');
      mockRepository.getProfile.mockRejectedValue(queryError);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfileQuery(mockUserId), {
        wrapper,
      });

      // ✅ FIX: Erwarte Error State direkt nach rejection statt mit timeout
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(queryError);
        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
      });

      // ✅ FIX: Bestätige dass Repository aufgerufen wurde
      expect(mockRepository.getProfile).toHaveBeenCalledWith(mockUserId);
    });

    it('should be disabled when userId is empty', () => {
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfileQuery(''), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(mockRepository.getProfile).not.toHaveBeenCalled();
    });

    it('should handle fast mode option correctly', async () => {
      // ✅ FIX: Local success mock setup
      mockRepository.getProfile.mockResolvedValue(mockProfile);

      const wrapper = createTestWrapper();
      const { result } = renderHook(
        () => useProfileQuery(mockUserId, { fastMode: true }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockProfile);
      });

      expect(mockRepository.getProfile).toHaveBeenCalledWith(mockUserId);
    });

    it('should refetch data on demand', async () => {
      // ✅ FIX: Local success mock setup
      mockRepository.getProfile.mockResolvedValue(mockProfile);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useProfileQuery(mockUserId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockProfile);
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockRepository.getProfile).toHaveBeenCalledTimes(2);
    });
  });

  // =============================================================================
  // PRIVACY SETTINGS QUERY TESTS
  // =============================================================================

  describe('🔒 usePrivacySettingsQuery', () => {
    it('should fetch privacy settings successfully', async () => {
      // ✅ FIX: Local success mock setup
      mockRepository.getProfile.mockResolvedValue(mockProfile);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => usePrivacySettingsQuery(mockUserId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockPrivacySettings);
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockRepository.getProfile).toHaveBeenCalledWith(mockUserId);
    });

    it('should handle profile without privacy settings', async () => {
      const profileWithoutPrivacy = {
        ...mockProfile,
        privacySettings: undefined,
      };
      mockRepository.getProfile.mockResolvedValue(profileWithoutPrivacy);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => usePrivacySettingsQuery(mockUserId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.data).toBeNull();
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should handle privacy query errors', async () => {
      const privacyError = new Error('Privacy settings fetch failed');
      mockRepository.getProfile.mockRejectedValue(privacyError);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => usePrivacySettingsQuery(mockUserId), {
        wrapper,
      });

      // ✅ FIX: Erwarte Error State direkt nach rejection statt mit timeout
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(privacyError);
        expect(result.current.isLoading).toBe(false);
      });

      // ✅ FIX: Bestätige dass Repository aufgerufen wurde
      expect(mockRepository.getProfile).toHaveBeenCalledWith(mockUserId);
    });

    it('should be disabled when userId is empty', () => {
      const wrapper = createTestWrapper();
      const { result } = renderHook(() => usePrivacySettingsQuery(''), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockRepository.getProfile).not.toHaveBeenCalled();
    });
  });

  // =============================================================================
  // PROFILE UPDATE MUTATION TESTS
  // =============================================================================

  describe('✏️ useUpdateProfileMutation', () => {
    it('should update profile successfully', async () => {
      // ✅ FIX: Spezifischer Mock für diesen Test
      mockRepository.updateProfile.mockResolvedValue({
        ...mockProfile,
        ...mockProfileUpdates,
      });

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          userId: mockUserId,
          updates: mockProfileUpdates,
        });
      });

      expect(mockRepository.updateProfile).toHaveBeenCalledWith(
        mockUserId,
        mockProfileUpdates
      );
      // ✅ FIX: Erwarte Success State nach awaited mutation
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should handle update errors correctly', async () => {
      const updateError = new Error('Profile update failed');
      // ✅ FIX: Spezifischer Error Mock für diesen Test
      mockRepository.updateProfile.mockRejectedValue(updateError);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            userId: mockUserId,
            updates: mockProfileUpdates,
          });
        } catch (error) {
          expect(error).toEqual(updateError);
        }
      });

      // ✅ FIX: Erwarte Error State nach awaited mutation
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(updateError);
      });
    });

    it('should update cache on successful mutation', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          children
        );

      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper,
      });

      // Pre-populate cache
      queryClient.setQueryData(['profile', mockUserId], mockProfile);

      await act(async () => {
        await result.current.mutateAsync({
          userId: mockUserId,
          updates: mockProfileUpdates,
        });
      });

      const cachedData = queryClient.getQueryData(['profile', mockUserId]);
      expect(cachedData).toEqual({ ...mockProfile, ...mockProfileUpdates });
    });

    it('should handle concurrent update operations', async () => {
      // ✅ FIX: Spezifische Mock-Konfiguration für Concurrent Updates
      mockRepository.updateProfile
        .mockResolvedValueOnce({ ...mockProfile, firstName: 'John1' })
        .mockResolvedValueOnce({ ...mockProfile, firstName: 'John2' })
        .mockResolvedValueOnce({ ...mockProfile, firstName: 'John3' });

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useUpdateProfileMutation(), {
        wrapper,
      });

      await act(async () => {
        const updates = [
          result.current.mutateAsync({
            userId: mockUserId,
            updates: { firstName: 'John1' },
          }),
          result.current.mutateAsync({
            userId: mockUserId,
            updates: { firstName: 'John2' },
          }),
          result.current.mutateAsync({
            userId: mockUserId,
            updates: { firstName: 'John3' },
          }),
        ];

        await Promise.allSettled(updates);
      });

      expect(mockRepository.updateProfile).toHaveBeenCalledTimes(3);
    });
  });

  // =============================================================================
  // PRIVACY SETTINGS UPDATE MUTATION TESTS
  // =============================================================================

  describe('🔒 useUpdatePrivacySettingsMutation', () => {
    it('should update privacy settings successfully', async () => {
      // ✅ FIX: Spezifischer Mock für Privacy Settings Update
      mockRepository.updateProfile.mockResolvedValue({
        ...mockProfile,
        privacySettings: {
          ...mockProfile.privacySettings,
          ...mockPrivacyUpdates,
        },
      });

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useUpdatePrivacySettingsMutation(), {
        wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          userId: mockUserId,
          settings: mockPrivacyUpdates,
        });
      });

      expect(mockRepository.updateProfile).toHaveBeenCalledWith(mockUserId, {
        privacySettings: mockPrivacyUpdates,
      });
      // ✅ FIX: Erwarte Success State nach awaited mutation
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should handle GDPR privacy update scenarios', async () => {
      const gdprUpdates: Partial<PrivacySettings> = {
        allowAnalytics: false,
        allowThirdPartySharing: false,
        marketingCommunications: false,
        trackProfileViews: false,
      };

      // ✅ FIX: Local success mock setup
      const updatedProfile = {
        ...mockProfile,
        privacySettings: gdprUpdates as PrivacySettings,
      };
      mockRepository.updateProfile.mockResolvedValue(updatedProfile);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useUpdatePrivacySettingsMutation(), {
        wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          userId: mockUserId,
          settings: gdprUpdates,
        });
      });

      expect(mockRepository.updateProfile).toHaveBeenCalledWith(mockUserId, {
        privacySettings: gdprUpdates,
      });
    });

    it('should handle privacy update errors', async () => {
      const privacyUpdateError = new Error('Privacy update failed');
      // ✅ FIX: Spezifischer Error Mock für Privacy Update Test
      mockRepository.updateProfile.mockRejectedValue(privacyUpdateError);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useUpdatePrivacySettingsMutation(), {
        wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            userId: mockUserId,
            settings: mockPrivacyUpdates,
          });
        } catch (error) {
          expect(error).toEqual(privacyUpdateError);
        }
      });

      // ✅ FIX: Erwarte Error State nach awaited mutation
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it('should update both profile and privacy caches', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          children
        );

      const { result } = renderHook(() => useUpdatePrivacySettingsMutation(), {
        wrapper,
      });

      const updatedProfile = {
        ...mockProfile,
        privacySettings: mockPrivacyUpdates as PrivacySettings,
      };
      mockRepository.updateProfile.mockResolvedValue(updatedProfile);

      await act(async () => {
        await result.current.mutateAsync({
          userId: mockUserId,
          settings: mockPrivacyUpdates,
        });
      });

      const profileCache = queryClient.getQueryData(['profile', mockUserId]);
      const privacyCache = queryClient.getQueryData([
        'profile',
        'privacy',
        mockUserId,
      ]);

      expect(profileCache).toEqual(updatedProfile);
      expect(privacyCache).toEqual(mockPrivacyUpdates);
    });
  });

  // =============================================================================
  // PROFILE DELETION MUTATION TESTS
  // =============================================================================

  describe('🗑️ useDeleteProfileMutation', () => {
    it('should delete profile successfully', async () => {
      // ✅ FIX: Spezifischer Mock für Profile Delete
      mockRepository.deleteProfile.mockResolvedValue(true);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useDeleteProfileMutation(), {
        wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({ userId: mockUserId });
      });

      expect(mockRepository.deleteProfile).toHaveBeenCalledWith(mockUserId);
      // ✅ FIX: Erwarte Success State nach awaited mutation
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should handle deletion errors', async () => {
      const deletionError = new Error('Profile deletion failed');
      mockRepository.deleteProfile.mockRejectedValue(deletionError);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useDeleteProfileMutation(), {
        wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({ userId: mockUserId });
        } catch (error) {
          expect(error).toEqual(deletionError);
        }
      });

      expect(result.current.isError).toBe(true);
    });

    it('should clear all profile caches on successful deletion', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          children
        );

      // Pre-populate caches
      queryClient.setQueryData(['profile', mockUserId], mockProfile);
      queryClient.setQueryData(
        ['profile', 'privacy', mockUserId],
        mockPrivacySettings
      );

      const { result } = renderHook(() => useDeleteProfileMutation(), {
        wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({ userId: mockUserId });
      });

      const profileCache = queryClient.getQueryData(['profile', mockUserId]);
      const privacyCache = queryClient.getQueryData([
        'profile',
        'privacy',
        mockUserId,
      ]);

      expect(profileCache).toBeUndefined();
      expect(privacyCache).toBeUndefined();
    });
  });

  // =============================================================================
  // CACHE UTILITIES TESTS
  // =============================================================================

  describe('🗂️ useProfileCacheUtils', () => {
    it('should clear profile cache correctly', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          children
        );

      // Pre-populate caches
      queryClient.setQueryData(['profile', mockUserId], mockProfile);
      queryClient.setQueryData(
        ['profile', 'privacy', mockUserId],
        mockPrivacySettings
      );

      const { result } = renderHook(() => useProfileCacheUtils(mockUserId), {
        wrapper,
      });

      act(() => {
        result.current.clearCache();
      });

      const profileCache = queryClient.getQueryData(['profile', mockUserId]);
      const privacyCache = queryClient.getQueryData([
        'profile',
        'privacy',
        mockUserId,
      ]);

      expect(profileCache).toBeUndefined();
      expect(privacyCache).toBeUndefined();
    });

    it('should refresh profile cache correctly', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          children
        );

      // Mock queryClient.invalidateQueries
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useProfileCacheUtils(mockUserId), {
        wrapper,
      });

      await act(async () => {
        await result.current.refreshCache();
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['profile', mockUserId],
      });
    });
  });

  // =============================================================================
  // PERFORMANCE & INTEGRATION TESTS
  // =============================================================================

  describe('⚡ Performance & Integration Tests', () => {
    it('should handle rapid successive queries efficiently', async () => {
      const wrapper = createTestWrapper();

      const hooks = Array.from({ length: 5 }, () =>
        renderHook(() => useProfileQuery(mockUserId), { wrapper })
      );

      await waitFor(() => {
        hooks.forEach(({ result }) => {
          expect(result.current.data).toEqual(mockProfile);
        });
      });

      // Should only call repository once due to caching
      expect(mockRepository.getProfile).toHaveBeenCalledTimes(1);
    });

    it('should handle memory cleanup on unmount', () => {
      const wrapper = createTestWrapper();
      const { unmount } = renderHook(() => useProfileQuery(mockUserId), {
        wrapper,
      });

      expect(() => unmount()).not.toThrow();
    });

    it('should work with different user IDs simultaneously', async () => {
      const userId1 = 'user-1';
      const userId2 = 'user-2';
      const profile1 = { ...mockProfile, id: userId1 };
      const profile2 = { ...mockProfile, id: userId2 };

      mockRepository.getProfile
        .mockResolvedValueOnce(profile1)
        .mockResolvedValueOnce(profile2);

      const wrapper = createTestWrapper();

      const hook1 = renderHook(() => useProfileQuery(userId1), { wrapper });
      const hook2 = renderHook(() => useProfileQuery(userId2), { wrapper });

      await waitFor(() => {
        expect(hook1.result.current.data).toEqual(profile1);
        expect(hook2.result.current.data).toEqual(profile2);
      });

      expect(mockRepository.getProfile).toHaveBeenCalledWith(userId1);
      expect(mockRepository.getProfile).toHaveBeenCalledWith(userId2);
    });

    it('should handle real-world profile update workflow', async () => {
      const wrapper = createTestWrapper();

      const queryHook = renderHook(() => useProfileQuery(mockUserId), {
        wrapper,
      });
      const mutationHook = renderHook(() => useUpdateProfileMutation(), {
        wrapper,
      });

      // Wait for initial load
      await waitFor(() => {
        expect(queryHook.result.current.data).toEqual(mockProfile);
      });

      // Perform update
      await act(async () => {
        await mutationHook.result.current.mutateAsync({
          userId: mockUserId,
          updates: mockProfileUpdates,
        });
      });

      expect(mockRepository.updateProfile).toHaveBeenCalledWith(
        mockUserId,
        mockProfileUpdates
      );
    });
  });
});

/**
 * Enterprise Testing Standards Compliance:
 *
 * ✅ TanStack Query Integration Testing
 * ✅ Champion Query & Mutation Testing
 * ✅ Cache Management Testing
 * ✅ GDPR Privacy Settings Testing
 * ✅ Mobile Performance Testing
 * ✅ Error Handling & Recovery Testing
 * ✅ Concurrent Operations Testing
 * ✅ Real-world Integration Scenarios
 * ✅ State Management Testing
 * ✅ 95%+ Code Coverage Target
 */
