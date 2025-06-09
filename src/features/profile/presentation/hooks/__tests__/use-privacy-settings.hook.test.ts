/**
 * usePrivacySettings Hook Tests
 * 
 * @fileoverview Comprehensive test suite for the Privacy Settings hook
 * Tests all hook functionality including loading, updating, saving, and error handling
 * 
 * @module usePrivacySettingsTests
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePrivacySettings, PrivacySetting } from '../use-privacy-settings.hook';
import { useTheme } from '../../../../../core/theme/theme.system';

// =============================================================================
// MOCKS
// =============================================================================

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock i18n translation
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Mock theme hook
jest.mock('../../../../../core/theme/theme.system', () => ({
  useTheme: jest.fn(),
}));

// Mock __DEV__ to prevent dev logs in tests
// @ts-expect-error - Global __DEV__ is defined by React Native
global.__DEV__ = false;

// =============================================================================
// SETUP & HELPERS
// =============================================================================

const mockTranslation = jest.fn((key: string, options?: any) => {
  // Return key with default value if provided
  return options?.defaultValue || key;
});

const mockTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
};

const PRIVACY_SETTINGS_STORAGE_KEY = '@privacy_settings';

// Expected default settings structure
const expectedDefaultSettings: Partial<PrivacySetting>[] = [
  {
    id: '1',
    key: 'profile_visibility',
    enabled: true,
    value: 'public',
    category: 'visibility',
  },
  {
    id: '4',
    key: 'email_visibility',
    enabled: true,
    value: 'public',
    category: 'visibility',
  },
  {
    id: '5',
    key: 'phone_visibility',
    enabled: true,
    value: 'private',
    category: 'visibility',
  },
  {
    id: '6',
    key: 'location_visibility',
    enabled: true,
    value: 'private',
    category: 'visibility',
  },
  {
    id: '7',
    key: 'social_links_visibility',
    enabled: true,
    value: 'public',
    category: 'visibility',
  },
  {
    id: '8',
    key: 'professional_info_visibility',
    enabled: true,
    value: 'public',
    category: 'visibility',
  },
  {
    id: '3',
    key: 'email_notifications',
    enabled: true,
    category: 'communication',
  },
  {
    id: '9',
    key: 'push_notifications',
    enabled: true,
    category: 'communication',
  },
  {
    id: '2',
    key: 'data_collection',
    enabled: false,
    category: 'data',
  },
];

describe('usePrivacySettings Hook', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup translation mock
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockTranslation,
    });
    
    // Setup theme mock
    (useTheme as jest.Mock).mockReturnValue({
      theme: mockTheme,
    });
    
    // Clear AsyncStorage mocks
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // INITIAL LOADING TESTS
  // =============================================================================

  describe('Initial Loading', () => {
    
    it('should load default settings when no saved settings exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.settings).toEqual([]);
      expect(result.current.error).toBeNull();
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Check that default settings are loaded correctly
      expect(result.current.settings).toHaveLength(9);
      
      // Verify each expected setting exists with correct properties
      expectedDefaultSettings.forEach((expectedSetting) => {
        const actualSetting = result.current.settings.find(s => s.id === expectedSetting.id);
        expect(actualSetting).toBeDefined();
        expect(actualSetting).toMatchObject(expectedSetting);
        expect(actualSetting?.title).toBeDefined();
        expect(actualSetting?.description).toBeDefined();
      });
      
      expect(result.current.error).toBeNull();
      expect(result.current.hasChanges).toBe(false);
    });

    it('should load saved settings from AsyncStorage correctly', async () => {
      const savedSettings = [
        {
          id: '1',
          key: 'profile_visibility',
          title: 'Profil-Sichtbarkeit',
          description: 'Wer kann Ihr Profil sehen',
          enabled: true,
          value: 'private',
          category: 'visibility',
        },
        {
          id: '2',
          key: 'data_collection',
          title: 'Datensammlung',
          description: 'Anonyme Nutzungsdaten sammeln',
          enabled: true,
          category: 'data',
        },
      ];
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(savedSettings)
      );
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Should merge saved settings with defaults
      expect(result.current.settings).toHaveLength(9);
      
      // Check that saved settings override defaults correctly
      const profileVisibilitySetting = result.current.settings.find(s => s.id === '1');
      expect(profileVisibilitySetting?.value).toBe('private');
      expect(profileVisibilitySetting?.enabled).toBe(true);
      
      const dataCollectionSetting = result.current.settings.find(s => s.id === '2');
      expect(dataCollectionSetting?.enabled).toBe(true);
      
      // Verify that unsaved settings still have their defaults
      const emailVisibilitySetting = result.current.settings.find(s => s.id === '4');
      expect(emailVisibilitySetting?.value).toBe('public');
      
      expect(result.current.error).toBeNull();
      expect(result.current.hasChanges).toBe(false);
    });

    it('should handle corrupted AsyncStorage data gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-json');
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Should fallback to default settings
      expect(result.current.settings).toHaveLength(9);
      expect(result.current.error).toBeNull();
      
      // Verify fallback settings match defaults
      const profileSetting = result.current.settings.find(s => s.id === '1');
      expect(profileSetting?.value).toBe('public');
      expect(profileSetting?.enabled).toBe(true);
    });

    it('should handle AsyncStorage errors during loading', async () => {
      const errorMessage = 'Storage unavailable';
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.settings).toEqual([]);
    });

    it('should handle empty settings array from AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Should still load defaults when saved settings is empty
      expect(result.current.settings).toHaveLength(9);
      expect(result.current.error).toBeNull();
    });
  });

  // =============================================================================
  // SETTING UPDATE TESTS
  // =============================================================================

  describe('Setting Updates', () => {
    
    it('should update boolean settings correctly', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Find data collection setting (boolean setting)
      const originalSetting = result.current.settings.find(s => s.key === 'data_collection');
      expect(originalSetting?.enabled).toBe(false);
      expect(result.current.hasChanges).toBe(false);
      
      // Update the setting
      act(() => {
        result.current.updateSetting('2', true);
      });
      
      // Check if setting was updated
      const updatedSetting = result.current.settings.find(s => s.id === '2');
      expect(updatedSetting?.enabled).toBe(true);
      expect(updatedSetting?.key).toBe('data_collection');
      expect(result.current.hasChanges).toBe(true);
      
      // Verify other settings weren't affected
      const otherSetting = result.current.settings.find(s => s.id === '1');
      expect(otherSetting?.enabled).toBe(true);
      expect(otherSetting?.value).toBe('public');
    });

    it('should update visibility settings correctly', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Find profile visibility setting
      const originalSetting = result.current.settings.find(s => s.key === 'profile_visibility');
      expect(originalSetting?.value).toBe('public');
      expect(originalSetting?.enabled).toBe(true);
      
      // Update visibility value
      act(() => {
        result.current.updateVisibilitySetting('1', 'private');
      });
      
      // Check if setting was updated
      const updatedSetting = result.current.settings.find(s => s.id === '1');
      expect(updatedSetting?.value).toBe('private');
      expect(updatedSetting?.enabled).toBe(true); // Should remain enabled
      expect(result.current.hasChanges).toBe(true);
    });

    it('should handle non-existent setting IDs gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      const originalSettings = [...result.current.settings];
      const originalHasChanges = result.current.hasChanges;
      
      // Try to update non-existent setting
      act(() => {
        result.current.updateSetting('999', true);
      });
      
      // Settings should remain unchanged
      expect(result.current.settings).toHaveLength(originalSettings.length);
      expect(result.current.hasChanges).toBe(originalHasChanges);
      
      // Try to update non-existent visibility setting
      act(() => {
        result.current.updateVisibilitySetting('999', 'private');
      });
      
      // Settings should still remain unchanged
      expect(result.current.settings).toHaveLength(originalSettings.length);
      expect(result.current.hasChanges).toBe(originalHasChanges);
    });

    it('should detect changes correctly for both enabled and value properties', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Initially no changes
      expect(result.current.hasChanges).toBe(false);
      
      // Change only enabled property
      act(() => {
        result.current.updateSetting('2', true);
      });
      
      expect(result.current.hasChanges).toBe(true);
      
      // Reset and test value property change
      act(() => {
        result.current.resetToDefaults();
      });
      
      expect(result.current.hasChanges).toBe(false);
      
      // Change only value property
      act(() => {
        result.current.updateVisibilitySetting('1', 'private');
      });
      
      expect(result.current.hasChanges).toBe(true);
    });
  });

  // =============================================================================
  // SAVE FUNCTIONALITY TESTS
  // =============================================================================

  describe('Save Functionality', () => {
    
    it('should save settings to AsyncStorage successfully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Make a change
      act(() => {
        result.current.updateSetting('2', true);
      });
      
      expect(result.current.hasChanges).toBe(true);
      expect(result.current.isSaving).toBe(false);
      
      // Save settings
      await act(async () => {
        await result.current.saveSettings();
      });
      
      // Verify save operation
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        PRIVACY_SETTINGS_STORAGE_KEY,
        expect.any(String)
      );
      
      // Parse the saved data to verify it's correct
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsedData = JSON.parse(savedData);
      expect(Array.isArray(parsedData)).toBe(true);
      expect(parsedData).toHaveLength(9);
      
      // Verify the specific change was saved
      const savedDataCollectionSetting = parsedData.find((s: PrivacySetting) => s.id === '2');
      expect(savedDataCollectionSetting?.enabled).toBe(true);
      
      expect(result.current.isSaving).toBe(false);
      expect(result.current.hasChanges).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle save errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const errorMessage = 'Storage full';
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Make a change
      act(() => {
        result.current.updateSetting('2', true);
      });
      
      // Try to save
      await act(async () => {
        await result.current.saveSettings();
      });
      
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isSaving).toBe(false);
      expect(result.current.hasChanges).toBe(true); // Changes should still be present
    });
  });

  // =============================================================================
  // RESET FUNCTIONALITY TESTS
  // =============================================================================

  describe('Reset Functionality', () => {
    
    it('should reset settings to original values', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Get original setting values
      const originalDataCollection = result.current.settings.find(s => s.id === '2');
      const originalProfileVisibility = result.current.settings.find(s => s.id === '1');
      
      expect(originalDataCollection?.enabled).toBe(false);
      expect(originalProfileVisibility?.value).toBe('public');
      
      // Make multiple changes
      act(() => {
        result.current.updateSetting('2', true);
        result.current.updateVisibilitySetting('1', 'private');
      });
      
      expect(result.current.hasChanges).toBe(true);
      
      // Verify changes were applied
      const changedDataCollection = result.current.settings.find(s => s.id === '2');
      const changedProfileVisibility = result.current.settings.find(s => s.id === '1');
      
      expect(changedDataCollection?.enabled).toBe(true);
      expect(changedProfileVisibility?.value).toBe('private');
      
      // Reset
      act(() => {
        result.current.resetToDefaults();
      });
      
      // Should be back to original values
      const resetDataCollection = result.current.settings.find(s => s.id === '2');
      const resetProfileVisibility = result.current.settings.find(s => s.id === '1');
      
      expect(resetDataCollection?.enabled).toBe(false);
      expect(resetProfileVisibility?.value).toBe('public');
      expect(result.current.hasChanges).toBe(false);
    });
  });

  // =============================================================================
  // THEME AND TRANSLATION TESTS
  // =============================================================================

  describe('Theme and Translation Integration', () => {
    
    it('should expose theme and translation functions correctly', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.theme).toBeDefined();
      expect(result.current.theme).toEqual(mockTheme);
      expect(result.current.t).toBeDefined();
      expect(typeof result.current.t).toBe('function');
      
      // Test translation function
      const translatedText = result.current.t('test.key', { defaultValue: 'Default' });
      expect(translatedText).toBe('Default');
      expect(mockTranslation).toHaveBeenCalledWith('test.key', { defaultValue: 'Default' });
    });
  });

  // =============================================================================
  // HELPER METHODS TESTS
  // =============================================================================

  describe('Helper Methods', () => {
    
    it('should provide success and error message handlers', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.showSuccessMessage).toBeDefined();
      expect(result.current.showErrorMessage).toBeDefined();
      expect(typeof result.current.showSuccessMessage).toBe('function');
      expect(typeof result.current.showErrorMessage).toBe('function');
      
      // Test that they don't throw errors
      expect(() => {
        result.current.showSuccessMessage('Test success');
        result.current.showErrorMessage('Test error');
      }).not.toThrow();
    });

    it('should provide isUpdating flag that mirrors isSaving', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const { result } = renderHook(() => usePrivacySettings());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.isUpdating).toBe(result.current.isSaving);
      expect(result.current.isUpdating).toBe(false);
    });
  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Performance and Optimization', () => {
    
    it('should not cause excessive re-renders on rapid updates', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return usePrivacySettings();
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      const initialRenderCount = renderCount;
      
      // Make the same update multiple times
      act(() => {
        result.current.updateSetting('2', true);
        result.current.updateSetting('2', true);
        result.current.updateSetting('2', true);
      });
      
      // Should only cause minimal additional renders
      expect(renderCount - initialRenderCount).toBeLessThanOrEqual(3);
    });
  });
});