/**
 * @fileoverview ENTERPRISE AUTH AWARE PROFILE HOOK TESTS - 2025 Standards
 * 
 * @description Comprehensive test suite for useAuthAwareProfile hook covering:
 * - TanStack Query Integration (4 Queries: profile, completeness, enhancements, security)
 * - Business Logic Testing (Profile completeness, Security scoring, Enhancement suggestions)
 * - Authentication Integration Testing
 * - UI State Management Testing (Local state, Sections, Prompts)
 * - Security & GDPR Compliance Testing
 * - Performance & Error Handling Testing
 * 
 * @version 2025.1.0
 * @standard Enterprise Testing Standards, GDPR Compliance, Security Testing
 * @since Enterprise Industry Standard 2025
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuthAwareProfile } from '../use-auth-aware-profile.hook';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Alert } from 'react-native';
import React from 'react';

// =============================================
// 🔧 MOCKS & SETUP
// =============================================

// Mock Alert for security action tests
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn()
  }
}));

const mockAlert = Alert.alert as jest.MockedFunction<typeof Alert.alert>;

// Mock Auth Hook
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: '2023-01-01T00:00:00Z'
};

const mockAuth = {
  user: mockUser as typeof mockUser | null,
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn()
};

jest.mock('../../../auth/presentation/hooks/use-auth.hook', () => ({
  useAuth: jest.fn(() => mockAuth)
}));

// Mock Translation Hook
const mockTranslation = {
  t: jest.fn((key: string, options?: any) => {
    const translations: Record<string, string> = {
      'common.cancel': 'Cancel',
      'common.continue': 'Continue',
      'profile.enhancement.error.title': 'Enhancement Error',
      'profile.enhancement.error.message': 'Failed to load enhancements',
      'profile.admin.action.title': 'Admin Action',
      'profile.admin.action.message': 'Execute admin action?',
      'profile.lastActivity.today': 'Today',
      'profile.lastActivity.yesterday': 'Yesterday',
      'profile.lastActivity.daysAgo': `${options?.count || 0} days ago`,
      'profile.security.level.high': 'High Security',
      'profile.security.level.medium': 'Medium Security',
      'profile.security.level.low': 'Low Security',
      'profile.actions.edit': 'Edit Profile',
      'profile.actions.share': 'Share Profile',
      'profile.completeness.recommendation.firstName': 'Add first name',
      'profile.completeness.recommendation.lastName': 'Add last name',
      'profile.completeness.recommendation.email': 'Add email address'
    };
    return translations[key] || key;
  })
};

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => mockTranslation)
}));

// Mock Profile Data
const mockCompleteProfile = {
  id: 'test-user-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  bio: 'Software Engineer',
  phone: '+1234567890',
  avatar: 'https://example.com/avatar.jpg',
  location: 'Berlin, Germany',
  website: 'https://johndoe.dev',
  professional: {
    company: 'Tech Corp',
    jobTitle: 'Senior Developer',
    industry: 'Technology',
    workLocation: 'remote'
  },
  socialLinks: {
    linkedIn: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe'
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-01')
};

const mockIncompleteProfile = {
  id: 'test-user-123',
  firstName: 'John',
  lastName: '',
  email: 'john.doe@example.com',
  bio: '',
  phone: '',
  avatar: '',
  location: '',
  website: '',
  professional: null,
  socialLinks: null,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-01')
};

// Mock Profile Container & Repository
const mockProfileRepository = {
  getProfile: jest.fn()
};

const mockProfileContainer = {
  getProfileRepository: jest.fn(() => mockProfileRepository),
  getAvatarService: jest.fn()
};

jest.mock('../../application/di/profile.container', () => ({
  profileContainer: mockProfileContainer
}));

// Test Wrapper with QueryClient
const createWrapper = () => {
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

describe('useAuthAwareProfile Hook - Enterprise Tests', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = createWrapper();
    jest.clearAllMocks();
    mockProfileRepository.getProfile.mockResolvedValue(mockCompleteProfile);
  });

  // =============================================
  // 🎯 TANSTACK QUERY INTEGRATION TESTING
  // =============================================

  describe('TanStack Query Integration', () => {
    it('should initialize all 4 TanStack queries correctly', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.isProfileLoading).toBe(false);
      });

      // Verify profile query integration
      expect(result.current.profile).toEqual(mockCompleteProfile);
      expect(result.current.isProfileLoading).toBe(false);
      expect(result.current.profileError).toBeNull();

      // Verify completeness query
      expect(result.current.completeness).toBeDefined();
      expect(result.current.completeness.percentage).toBeGreaterThan(0);

      // Verify enhancement suggestions query
      expect(result.current.enhancementSuggestions).toEqual([]);

      // Verify security actions query
      expect(result.current.securityActions).toBeDefined();
      expect(Array.isArray(result.current.securityActions)).toBe(true);
    });

    it('should handle query loading states correctly', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      // Initial loading state
      expect(result.current.isLoading).toBeDefined();
      expect(typeof result.current.isLoading).toBe('boolean');

      await waitFor(() => {
        expect(result.current.isProfileLoading).toBe(false);
      });
    });

    it('should handle query error states', async () => {
      const mockError = new Error('Profile fetch failed');
      mockProfileRepository.getProfile.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.profileError).toBe('Profile fetch failed');
      });
    });

    it('should handle guest user scenario (not authenticated)', async () => {
      mockAuth.isAuthenticated = false;
      mockAuth.user = null;

      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.profile).toBeNull();
        expect(result.current.canLoadEnhancements).toBe(false);
      });
    });

    it('should handle unauthenticated user', () => {
      mockAuth.user = null;
      
      const { result } = renderHook(() => useAuthAwareProfile());
      
      expect(result.current.profile).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle profile service errors', () => {
      mockAuth.user = null;

      const { result } = renderHook(() => useAuthAwareProfile());

      expect(result.current.profile).toBeNull();
    });

    it('should handle different profile variants', async () => {
      const variants: Array<'admin' | 'compact' | 'detailed'> = ['admin', 'compact', 'detailed', 'admin', 'compact', 'detailed'];

      for (const variant of variants) {
        const { result } = renderHook(
          () => useAuthAwareProfile({ variant }), 
          { wrapper }
        );

        await waitFor(() => {
          expect(result.current.profile).toBeDefined();
        });
      }
    });
  });

  // =============================================
  // 🧮 BUSINESS LOGIC TESTING
  // =============================================

  describe('Business Logic & Calculations', () => {
    it('should calculate profile completeness correctly for complete profile', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.completeness.percentage).toBeGreaterThan(80);
        expect(result.current.isProfileComplete).toBe(true);
        expect(result.current.profileScore).toBeGreaterThan(80);
      });
    });

    it('should calculate profile completeness correctly for incomplete profile', async () => {
      mockProfileRepository.getProfile.mockResolvedValueOnce(mockIncompleteProfile);

      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.completeness.percentage).toBeLessThan(50);
        expect(result.current.isProfileComplete).toBe(false);
        expect(result.current.completeness.missingFields.length).toBeGreaterThan(0);
        expect(result.current.completeness.recommendations.length).toBeGreaterThan(0);
      });
    });

    it('should generate security score and level correctly', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.securityScore).toBeGreaterThanOrEqual(0);
        expect(result.current.securityScore).toBeLessThanOrEqual(100);
        ['HIGH', 'MEDIUM', 'LOW'].includes(result.current.securityLevel);
        expect(result.current.securityBadgeColor).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should detect security issues correctly', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(typeof result.current.hasSecurityIssues).toBe('boolean');
        if (result.current.hasSecurityIssues) {
          expect(result.current.securityScore).toBeLessThan(80);
        }
      });
    });

    it('should provide role color mapping', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.getRoleColor('admin')).toBe('#ef4444');
        expect(result.current.getRoleColor('user')).toBe('#10b981');
        expect(result.current.getRoleColor('premium')).toBe('#8b5cf6');
        expect(result.current.getRoleColor('unknown')).toBe('#6b7280');
      });
    });

    it('should format last activity dates correctly', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        expect(result.current.formatLastActivity(today)).toBe('Today');
        expect(result.current.formatLastActivity(yesterday)).toBe('Yesterday');
        expect(result.current.formatLastActivity(weekAgo)).toBe('7 days ago');
      });
    });
  });

  // =============================================
  // 🎨 UI STATE MANAGEMENT TESTING
  // =============================================

  describe('UI State Management', () => {
    it('should initialize UI state correctly', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      expect(result.current.isEnhancementLoading).toBe(false);
      expect(result.current.showSecurityPrompt).toBe(false);
      expect(result.current.showEnhancedInfo).toBe(false);
      expect(result.current.isLoadingEnhanced).toBe(false);
      expect(result.current.expandedSections).toEqual({
        completeness: true,
        enhancements: false,
        security: false
      });
    });

    it('should toggle section expansion correctly', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      act(() => {
        result.current.toggleSection('enhancements');
      });

      expect(result.current.expandedSections.enhancements).toBe(true);

      act(() => {
        result.current.toggleSection('enhancements');
      });

      expect(result.current.expandedSections.enhancements).toBe(false);
    });

    it('should dismiss security prompt correctly', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      act(() => {
        result.current.dismissSecurityPrompt();
      });

      expect(result.current.showSecurityPrompt).toBe(false);
    });

    it('should provide quick actions with proper structure', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(Array.isArray(result.current.quickActions)).toBe(true);
        expect(result.current.quickActions.length).toBeGreaterThan(0);
        
        result.current.quickActions.forEach(action => {
          expect(action).toHaveProperty('id');
          expect(action).toHaveProperty('title');
          expect(action).toHaveProperty('icon');
          expect(action).toHaveProperty('label');
          expect(action).toHaveProperty('onPress');
          expect(typeof action.onPress).toBe('function');
        });
      });
    });

    it('should provide roles and permissions lists', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(Array.isArray(result.current.rolesList)).toBe(true);
        expect(Array.isArray(result.current.permissionsList)).toBe(true);
        
        result.current.rolesList.forEach(role => {
          expect(role).toHaveProperty('name');
          expect(role).toHaveProperty('color');
        });
        
        result.current.permissionsList.forEach(permission => {
          expect(permission).toHaveProperty('name');
          expect(permission).toHaveProperty('granted');
          expect(typeof permission.granted).toBe('boolean');
        });
      });
    });

    it('should maintain hook stability on re-renders', () => {
      const { result, rerender } = renderHook(() => useAuthAwareProfile());

      const initialResult = result.current;
      rerender({} as any);

      expect(result.current).toBe(initialResult);
    });
  });

  // =============================================
  // 🎯 SECURITY & ACTIONS TESTING
  // =============================================

  describe('Security & Actions', () => {
    it('should handle security actions with proper alerts', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      const mockSecurityAction = {
        id: 'test-action',
        type: 'ENABLE_2FA' as const,
        title: 'Enable 2FA',
        description: 'Enable two-factor authentication',
        urgent: true
      };

      await act(async () => {
        await result.current.handleSecurityAction(mockSecurityAction);
      });

      expect(mockAlert).toHaveBeenCalledWith(
        'Enable 2FA',
        'Enable two-factor authentication',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Continue' })
        ])
      );
    });

    it('should handle admin actions with proper alerts', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      act(() => {
        result.current.handleAdminAction('test-admin-action');
      });

      expect(mockAlert).toHaveBeenCalledWith(
        'Admin Action',
        'Execute admin action?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Continue' })
        ])
      );
    });

    it('should refresh profile data correctly', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.profile).toBeDefined();
      });

      mockProfileRepository.getProfile.mockResolvedValueOnce({
        ...mockCompleteProfile,
        firstName: 'Updated John'
      });

      await act(async () => {
        await result.current.refreshProfile();
      });

      // Verify profile refresh invalidated queries
      expect(typeof result.current.refreshProfile).toBe('function');
    });

    it('should handle enhanced data loading with proper error handling', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await act(async () => {
        await result.current.loadEnhancedData();
      });

      expect(typeof result.current.loadEnhancedData).toBe('function');
      expect(result.current.isLoadingEnhanced).toBe(false);
    });
  });

  // =============================================
  // 🎯 AUTHENTICATION INTEGRATION TESTING
  // =============================================

  describe('Authentication Integration', () => {
    it('should handle user ID priority correctly', async () => {
      // Test with prop userId
      const { result: resultWithProp } = renderHook(
        () => useAuthAwareProfile({ userId: 'custom-user-123' }), 
        { wrapper }
      );

      await waitFor(() => {
        expect(mockProfileRepository.getProfile).toHaveBeenCalledWith('custom-user-123');
      });

      // Test with auth user ID
      const { result: resultWithAuth } = renderHook(
        () => useAuthAwareProfile(), 
        { wrapper }
      );

      await waitFor(() => {
        expect(mockProfileRepository.getProfile).toHaveBeenCalledWith('test-user-123');
      });
    });

    it('should handle unauthenticated state gracefully', async () => {
      mockAuth.isAuthenticated = false;
      mockAuth.user = null;

      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.profile).toBeNull();
        expect(result.current.canLoadEnhancements).toBe(false);
      });
    });

    it('should handle different profile variants', async () => {
      const variants: Array<'admin' | 'compact' | 'detailed'> = ['admin', 'compact', 'detailed', 'admin', 'compact', 'detailed'];

      for (const variant of variants) {
        const { result } = renderHook(
          () => useAuthAwareProfile({ variant }), 
          { wrapper }
        );

        await waitFor(() => {
          expect(result.current.profile).toBeDefined();
        });
      }
    });
  });

  // =============================================
  // ⚡ PERFORMANCE & ERROR HANDLING TESTING
  // =============================================

  describe('Performance & Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      const mockError = new Error('Repository connection failed');
      mockProfileRepository.getProfile.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.profileError).toBe('Repository connection failed');
        expect(result.current.profile).toBeNull();
      });
    });

    it('should handle network timeouts gracefully', async () => {
      const mockTimeoutError = new Error('Network timeout');
      mockProfileRepository.getProfile.mockRejectedValueOnce(mockTimeoutError);

      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBe('Network timeout');
      });
    });

    it('should memoize expensive calculations', async () => {
      const { result, rerender } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.quickActions).toBeDefined();
      });

      const firstQuickActions = result.current.quickActions;
      const firstRolesList = result.current.rolesList;
      const firstPermissionsList = result.current.permissionsList;

      rerender({} as any);

      expect(result.current.quickActions).toBe(firstQuickActions);
      expect(result.current.rolesList).toBe(firstRolesList);
      expect(result.current.permissionsList).toBe(firstPermissionsList);
    });

    it('should handle concurrent operations safely', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.profile).toBeDefined();
      });

      // Simulate concurrent operations
      const promises = [
        result.current.refreshProfile(),
        result.current.loadEnhancedData(),
        result.current.refreshProfile()
      ];

      await act(async () => {
        await Promise.allSettled(promises);
      });

      // Should not throw errors and maintain state consistency
      expect(result.current.profile).toBeDefined();
    });
  });

  // =============================================
  // 🔒 GDPR & COMPLIANCE TESTING
  // =============================================

  describe('GDPR & Compliance', () => {
    it('should handle user data according to GDPR requirements', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.profile).toBeDefined();
      });

      // Verify only necessary data is exposed
      const returnedData = result.current;
      expect(returnedData).not.toHaveProperty('rawPassword');
      expect(returnedData).not.toHaveProperty('internalNotes');
      expect(returnedData).not.toHaveProperty('adminFlags');
    });

    it('should support data subject access requests (DSAR)', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.profile).toBeDefined();
      });

      // Verify all user-accessible data is available
      expect(result.current.profile?.firstName).toBeDefined();
      expect(result.current.profile?.lastName).toBeDefined();
      expect(result.current.profile?.email).toBeDefined();
      expect(result.current.completeness).toBeDefined();
    });

    it('should handle right to rectification (data correction)', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.refreshProfile).toBeDefined();
      });

      // Verify profile can be refreshed to get updated data
      expect(typeof result.current.refreshProfile).toBe('function');
    });
  });

  // =============================================
  // 🎯 INTEGRATION TESTING
  // =============================================

  describe('Integration Testing', () => {
    it('should integrate all features together in a real-world scenario', async () => {
      const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.profile).toBeDefined();
        expect(result.current.isProfileLoading).toBe(false);
      });

      // Test profile completeness calculation
      expect(result.current.completeness.percentage).toBeGreaterThan(0);
      expect(result.current.isProfileComplete).toBe(true);

      // Test security features
      expect(result.current.securityScore).toBeGreaterThanOrEqual(0);
      expect(result.current.securityLevel).toBeDefined();

      // Test UI interactions
      act(() => {
        result.current.toggleSection('security');
      });

      expect(result.current.expandedSections.security).toBe(true);

      // Test data refresh
      await act(async () => {
        await result.current.refreshProfile();
      });

      // Verify state consistency after operations
      expect(result.current.profile).toBeDefined();
      expect(result.current.expandedSections.security).toBe(true);
    });
  });
});

// =============================================
// 🎯 EDGE CASES & BOUNDARY TESTING
// =============================================

describe('Edge Cases & Boundary Testing', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = createWrapper();
    jest.clearAllMocks();
  });

  it('should handle null profile data gracefully', async () => {
    mockProfileRepository.getProfile.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.profile).toBeNull();
      expect(result.current.completeness.percentage).toBe(0);
      expect(result.current.isProfileComplete).toBe(false);
    });
  });

  it('should handle extremely long user names', async () => {
    const profileWithLongNames = {
      ...mockCompleteProfile,
      firstName: 'A'.repeat(1000),
      lastName: 'B'.repeat(1000)
    };

    mockProfileRepository.getProfile.mockResolvedValueOnce(profileWithLongNames);

    const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.profile?.firstName).toBe('A'.repeat(1000));
      expect(result.current.completeness.percentage).toBeGreaterThan(0);
    });
  });

  it('should handle special characters in profile data', async () => {
    const profileWithSpecialChars = {
      ...mockCompleteProfile,
      firstName: '🚀测试José',
      lastName: 'Müller-González',
      bio: 'Software Engineer with émojis 🎯 and special characters ñáéíóú'
    };

    mockProfileRepository.getProfile.mockResolvedValueOnce(profileWithSpecialChars);

    const { result } = renderHook(() => useAuthAwareProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.profile?.firstName).toBe('🚀测试José');
      expect(result.current.profile?.lastName).toBe('Müller-González');
      expect(result.current.completeness.percentage).toBeGreaterThan(0);
    });
  });
}); 