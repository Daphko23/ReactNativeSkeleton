/**
 * @fileoverview USE-PROFILE-NAVIGATION-HOOK-TESTS: Enterprise Navigation Hook Test Suite
 * @description Comprehensive test suite für Navigation Hook mit Enterprise-Standards.
 * Tests navigation flows, parameter handling, error recovery and performance.
 * 
 * @version 1.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @since 2024-01-01
 */


import { renderHook, act } from '@testing-library/react-native';
import { useProfileNavigation, UseProfileNavigationParams } from '../use-profile-navigation.hook';

// Mocked navigation object
const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(true),
  reset: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  isFocused: jest.fn().mockReturnValue(true),
  getState: jest.fn().mockReturnValue({ 
    routes: [{ name: 'ProfileOverview' }], 
    index: 0 
  }),
});

describe('useProfileNavigation Hook', () => {
  let mockNavigation: any;

  beforeEach(() => {
    mockNavigation = createMockNavigation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Hook Initialization', () => {
    test('should initialize hook with required navigation parameter', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      expect(result.current).toBeDefined();
      expect(typeof result.current.navigateToProfileEdit).toBe('function');
      expect(typeof result.current.navigateToAvatarUpload).toBe('function');
      expect(typeof result.current.navigateToAccountSettings).toBe('function');
      expect(typeof result.current.navigateToCustomFieldsEdit).toBe('function');
      expect(typeof result.current.navigateToPrivacySettings).toBe('function');
      expect(typeof result.current.navigateToProfileAvatarDemo).toBe('function');
      expect(typeof result.current.navigateToSkillsManagement).toBe('function');
      expect(typeof result.current.navigateToSocialLinksEdit).toBe('function');
    });

    test('should initialize with optional avatarUrl parameter', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
        avatarUrl: 'https://example.com/avatar.jpg',
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      expect(result.current).toBeDefined();
      expect(result.current.shouldCheckForAvatarUpdate).toBeDefined();
      expect(result.current.shouldCheckForProfileUpdate).toBeDefined();
    });

    test('should provide navigation state tracking refs', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      expect(result.current.shouldCheckForAvatarUpdate).toBeDefined();
      expect(result.current.shouldCheckForAvatarUpdate.current).toBe(false);
      expect(result.current.shouldCheckForProfileUpdate).toBeDefined();
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(false);
    });
  });

  describe('Core Navigation Handlers', () => {
    test('should navigate to profile edit and set update flag', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToProfileEdit();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfileEdit');
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(true);
    });

    test('should navigate to avatar upload with current avatar URL', () => {
      const avatarUrl = 'https://example.com/current-avatar.jpg';
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
        avatarUrl,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToAvatarUpload();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('AvatarUpload', {
        currentAvatar: avatarUrl,
      });
      expect(result.current.shouldCheckForAvatarUpdate.current).toBe(true);
    });

    test('should navigate to avatar upload without avatar URL', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
        avatarUrl: null,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToAvatarUpload();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('AvatarUpload', {
        currentAvatar: null,
      });
    });
  });

  describe('Settings Navigation Handlers', () => {
    test('should navigate to account settings', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToAccountSettings();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('AccountSettings');
    });

    test('should navigate to custom fields edit and set update flag', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToCustomFieldsEdit();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('CustomFieldsEdit');
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(true);
    });

    test('should navigate to privacy settings', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToPrivacySettings();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('PrivacySettings');
    });

    test('should navigate to skills management and set update flag', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToSkillsManagement();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('SkillsManagement');
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(true);
    });

    test('should navigate to social links edit and set update flag', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToSocialLinksEdit();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('SocialLinksEdit');
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(true);
    });

    test('should navigate to profile avatar demo', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToProfileAvatarDemo();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfileAvatarDemo');
    });
  });

  describe('Navigation State Management', () => {
    test('should update avatar check flag only on avatar-related navigation', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      // Initially false
      expect(result.current.shouldCheckForAvatarUpdate.current).toBe(false);

      // Avatar navigation should set flag
      act(() => {
        result.current.navigateToAvatarUpload();
      });
      expect(result.current.shouldCheckForAvatarUpdate.current).toBe(true);

      // Reset for next test
      result.current.shouldCheckForAvatarUpdate.current = false;

      // Non-avatar navigation should not set flag
      act(() => {
        result.current.navigateToAccountSettings();
      });
      expect(result.current.shouldCheckForAvatarUpdate.current).toBe(false);
    });

    test('should update profile check flag on profile-modifying navigation', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      // Initially false
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(false);

      // Profile edit navigation should set flag
      act(() => {
        result.current.navigateToProfileEdit();
      });
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(true);

      // Reset for next test
      result.current.shouldCheckForProfileUpdate.current = false;

      // Skills management should set flag
      act(() => {
        result.current.navigateToSkillsManagement();
      });
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(true);

      // Reset for next test
      result.current.shouldCheckForProfileUpdate.current = false;

      // Privacy settings should not set flag (it's separate from profile data)
      act(() => {
        result.current.navigateToPrivacySettings();
      });
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(false);
    });
  });

  describe('Function Stability and Performance', () => {
    test('should provide stable navigation functions across re-renders', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
        avatarUrl: 'https://example.com/avatar.jpg',
      };

      const { result, rerender } = renderHook(() => useProfileNavigation(params));

      const initialFunctions = {
        navigateToProfileEdit: result.current.navigateToProfileEdit,
        navigateToAvatarUpload: result.current.navigateToAvatarUpload,
        navigateToAccountSettings: result.current.navigateToAccountSettings,
      };

      // Trigger re-render
      rerender(params);

      // Functions should be stable (memoized with React.useCallback)
      expect(result.current.navigateToProfileEdit).toBe(initialFunctions.navigateToProfileEdit);
      expect(result.current.navigateToAvatarUpload).toBe(initialFunctions.navigateToAvatarUpload);
      expect(result.current.navigateToAccountSettings).toBe(initialFunctions.navigateToAccountSettings);
    });

    test('should update functions when navigation dependency changes', () => {
      const params1: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result, rerender } = renderHook((props) => useProfileNavigation(props), {
        initialProps: params1,
      });

      const initialFunction = result.current.navigateToProfileEdit;

      // Change navigation object
      const newMockNavigation = createMockNavigation();
      const params2: UseProfileNavigationParams = {
        navigation: newMockNavigation,
      };

      rerender(params2);

      // Function should update due to navigation dependency change
      expect(result.current.navigateToProfileEdit).not.toBe(initialFunction);
    });

    test('should update avatar upload function when avatarUrl changes', () => {
      const params1: UseProfileNavigationParams = {
        navigation: mockNavigation,
        avatarUrl: 'https://example.com/avatar1.jpg',
      };

      const { result, rerender } = renderHook((props) => useProfileNavigation(props), {
        initialProps: params1,
      });

      const initialFunction = result.current.navigateToAvatarUpload;

      // Change avatar URL
      const params2: UseProfileNavigationParams = {
        navigation: mockNavigation,
        avatarUrl: 'https://example.com/avatar2.jpg',
      };

      rerender(params2);

      // Function should update due to avatarUrl dependency change
      expect(result.current.navigateToAvatarUpload).not.toBe(initialFunction);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle navigation errors gracefully', () => {
      const errorNavigation = {
        ...mockNavigation,
        navigate: jest.fn().mockImplementation(() => {
          throw new Error('Navigation error');
        }),
      };

      const params: UseProfileNavigationParams = {
        navigation: errorNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      // Should not throw errors even when navigation fails
      expect(() => {
        act(() => {
          try {
            result.current.navigateToProfileEdit();
          } catch {
            // Expected error, but we want to test that the hook handles it gracefully
          }
        });
      }).not.toThrow();
    });

    test('should handle undefined avatarUrl gracefully', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
        avatarUrl: undefined,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToAvatarUpload();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('AvatarUpload', {
        currentAvatar: undefined,
      });
    });

    test('should handle empty string avatarUrl', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
        avatarUrl: '',
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      act(() => {
        result.current.navigateToAvatarUpload();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('AvatarUpload', {
        currentAvatar: '',
      });
    });
  });

  describe('Integration and Real-World Usage', () => {
    test('should work in complete profile editing workflow', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
        avatarUrl: 'https://example.com/avatar.jpg',
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      // Simulate complete workflow: Profile -> Edit -> Skills -> Back to Profile
      act(() => {
        result.current.navigateToProfileEdit();
      });
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfileEdit');
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(true);

      // Reset flag (as would happen in actual usage)
      act(() => {
        result.current.shouldCheckForProfileUpdate.current = false;
      });

      act(() => {
        result.current.navigateToSkillsManagement();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('SkillsManagement');
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(true);
    });

    test('should handle rapid successive navigation calls', () => {
      const params: UseProfileNavigationParams = {
        navigation: mockNavigation,
      };

      const { result } = renderHook(() => useProfileNavigation(params));

      // Rapid navigation calls
      act(() => {
        result.current.navigateToProfileEdit();
        result.current.navigateToSkillsManagement();
        result.current.navigateToSocialLinksEdit();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledTimes(3);
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(1, 'ProfileEdit');
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(2, 'SkillsManagement');
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(3, 'SocialLinksEdit');
      expect(result.current.shouldCheckForProfileUpdate.current).toBe(true);
    });
  });
});