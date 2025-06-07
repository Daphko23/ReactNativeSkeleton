/**
 * Profile Store - Presentation Layer
 * 
 * @fileoverview Zustand-based state management store for profile-related data and UI state.
 * Provides centralized state management for user profiles, privacy settings, UI states,
 * and profile completeness calculations with optimized selectors for performance.
 * 
 * @module ProfileStore
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { UserProfile, PrivacySettings, ProfileHistoryEntry } from '../../domain/entities/user-profile.entity';

/**
 * Profile Store State Interface
 * 
 * @description Defines the complete state shape for the profile store including
 * core data, UI states, and all available actions for state manipulation.
 * Uses Zustand with Immer for immutable state updates and Redux DevTools integration.
 * 
 * @interface ProfileState
 * 
 * @property {UserProfile | null} profile - Current user profile data
 * @property {PrivacySettings | null} privacySettings - User's privacy configuration
 * @property {ProfileHistoryEntry[]} profileHistory - Historical profile changes
 * @property {boolean} isLoading - Loading state for async operations
 * @property {string | null} error - Current error message if any
 * @property {boolean} isDirty - Whether profile has unsaved changes
 * @property {number} avatarUploadProgress - Upload progress percentage (0-100)
 * @property {Date | null} lastSyncTime - Timestamp of last successful sync
 * 
 * @property {Function} setProfile - Updates the user profile data
 * @property {Function} setPrivacySettings - Updates privacy settings
 * @property {Function} setProfileHistory - Updates profile history entries
 * @property {Function} setLoading - Sets loading state
 * @property {Function} setError - Sets error message
 * @property {Function} setDirty - Sets dirty state for unsaved changes
 * @property {Function} setAvatarUploadProgress - Updates upload progress
 * @property {Function} setLastSyncTime - Updates last sync timestamp
 * @property {Function} updateProfileField - Updates single profile field
 * @property {Function} updatePrivacyField - Updates single privacy field
 * @property {Function} clearError - Clears current error state
 * @property {Function} resetStore - Resets store to initial state
 * 
 * @since 1.0.0
 */
interface ProfileState {
  // Core State
  profile: UserProfile | null;
  privacySettings: PrivacySettings | null;
  profileHistory: ProfileHistoryEntry[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  avatarUploadProgress: number;
  lastSyncTime: Date | null;
  
  // Actions
  setProfile: (profile: UserProfile | null) => void;
  setPrivacySettings: (settings: PrivacySettings | null) => void;
  setProfileHistory: (history: ProfileHistoryEntry[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDirty: (dirty: boolean) => void;
  setAvatarUploadProgress: (progress: number) => void;
  setLastSyncTime: (time: Date | null) => void;
  
  // Utility Actions
  updateProfileField: (field: keyof UserProfile, value: any) => void;
  updatePrivacyField: (field: keyof PrivacySettings, value: any) => void;
  clearError: () => void;
  resetStore: () => void;
}

/**
 * Initial state configuration for the profile store
 * 
 * @description Default values for all state properties. Provides a clean
 * starting state and is used by the resetStore action.
 * 
 * @constant
 * @since 1.0.0
 */
const initialState = {
  profile: null,
  privacySettings: null,
  profileHistory: [],
  isLoading: false,
  error: null,
  isDirty: false,
  avatarUploadProgress: 0,
  lastSyncTime: null,
};

/**
 * Profile Store Hook
 * 
 * @description Main Zustand store for profile state management. Configured with
 * Redux DevTools for debugging and Immer middleware for immutable updates.
 * Provides centralized state management for all profile-related data and UI states.
 * 
 * @hook
 * @returns {ProfileState} Complete profile store state and actions
 * 
 * @example
 * ```tsx
 * // Direct store usage
 * const { profile, setProfile, isLoading } = useProfileStore();
 * 
 * // Update profile
 * setProfile(newProfileData);
 * 
 * // Check loading state
 * if (isLoading) {
 *   return <LoadingSpinner />;
 * }
 * ```
 * 
 * @since 1.0.0
 * @see {@link useProfileSelector} for performance-optimized selections
 */
export const useProfileStore = create<ProfileState>()(
  devtools(
    immer((set, _get) => ({
      ...initialState,
      
      // Core Setters
      setProfile: (profile) => {
        set((state) => {
          state.profile = profile;
          state.lastSyncTime = new Date();
        });
      },
      
      setPrivacySettings: (settings) => {
        set((state) => {
          state.privacySettings = settings;
        });
      },
      
      setProfileHistory: (history) => {
        set((state) => {
          state.profileHistory = history;
        });
      },
      
      setLoading: (loading) => {
        set((state) => {
          state.isLoading = loading;
        });
      },
      
      setError: (error) => {
        set((state) => {
          state.error = error;
        });
      },
      
      setDirty: (dirty) => {
        set((state) => {
          state.isDirty = dirty;
        });
      },
      
      setAvatarUploadProgress: (progress) => {
        set((state) => {
          state.avatarUploadProgress = Math.max(0, Math.min(100, progress));
        });
      },
      
      setLastSyncTime: (time) => {
        set((state) => {
          state.lastSyncTime = time;
        });
      },
      
      // Utility Actions
      updateProfileField: (field, value) => {
        set((state) => {
          if (state.profile) {
            (state.profile as any)[field] = value;
            state.isDirty = true;
          }
        });
      },
      
      updatePrivacyField: (field, value) => {
        set((state) => {
          if (state.privacySettings) {
            (state.privacySettings as any)[field] = value;
            state.isDirty = true;
          }
        });
      },
      
      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },
      
      resetStore: () => {
        set((state) => {
          Object.assign(state, initialState);
        });
      },
    })),
    {
      name: 'profile-store',
    }
  )
);

/**
 * Performance-Optimized Profile Selector Hook
 * 
 * @description Higher-order hook for selecting specific parts of the profile store state.
 * Prevents unnecessary re-renders by only subscribing to selected state slices.
 * Uses Zustand's built-in selector optimization.
 * 
 * @template T - Type of the selected value
 * @param {Function} selector - Function to select specific state slice
 * @returns {T} Selected state value
 * 
 * @example
 * ```tsx
 * // Select only profile data
 * const profile = useProfileSelector(state => state.profile);
 * 
 * // Select only loading state
 * const isLoading = useProfileSelector(state => state.isLoading);
 * 
 * // Select multiple values
 * const { profile, error } = useProfileSelector(state => ({
 *   profile: state.profile,
 *   error: state.error
 * }));
 * ```
 * 
 * @since 1.0.0
 */
export const useProfileSelector = <T>(selector: (state: ProfileState) => T): T =>
  useProfileStore(selector);

/**
 * Profile Completeness Calculator Hook
 * 
 * @description Computed selector that calculates profile completion percentage
 * based on required and optional fields. Required fields have higher weight
 * in the calculation. Returns a percentage value from 0 to 100.
 * 
 * @hook
 * @returns {number} Profile completion percentage (0-100)
 * 
 * @example
 * ```tsx
 * const completeness = useProfileCompleteness();
 * 
 * return (
 *   <ProgressBar 
 *     value={completeness} 
 *     label={`${completeness}% Complete`}
 *   />
 * );
 * ```
 * 
 * @since 1.0.0
 * @see {@link useIsProfileComplete} for boolean completion status
 */
export const useProfileCompleteness = (): number =>
  useProfileStore((state) => {
    if (!state.profile) return 0;
    
    const requiredFields = ['firstName', 'lastName', 'email'];
    const optionalFields = ['bio', 'location', 'website', 'phone', 'avatar'];
    
    const completedRequired = requiredFields.filter(
      field => state.profile![field as keyof UserProfile]
    ).length;
    
    const completedOptional = optionalFields.filter(
      field => state.profile![field as keyof UserProfile]
    ).length;
    
    const totalWeight = requiredFields.length * 2 + optionalFields.length;
    const completedWeight = completedRequired * 2 + completedOptional;
    
    return Math.round((completedWeight / totalWeight) * 100);
  });

/**
 * Profile Completion Status Hook
 * 
 * @description Computed selector that returns boolean indicating whether
 * all required profile fields are completed. Used for validation and
 * enabling/disabling certain features that require complete profiles.
 * 
 * @hook
 * @returns {boolean} True if all required fields are completed
 * 
 * @example
 * ```tsx
 * const isComplete = useIsProfileComplete();
 * 
 * return (
 *   <Button 
 *     disabled={!isComplete}
 *     onPress={publishProfile}
 *   >
 *     Publish Profile
 *   </Button>
 * );
 * ```
 * 
 * @since 1.0.0
 * @see {@link useProfileCompleteness} for percentage completion
 */
export const useIsProfileComplete = (): boolean =>
  useProfileStore((state) => {
    if (!state.profile) return false;
    
    const requiredFields = ['firstName', 'lastName', 'email'];
    return requiredFields.every(
      field => state.profile![field as keyof UserProfile]
    );
  });

/**
 * Profile Error State Hook
 * 
 * @description Computed selector that provides error-related state information
 * in a convenient object format. Useful for error handling and UI state management.
 * 
 * @hook
 * @returns {Object} Error state information
 * @returns {boolean} returns.hasError - Whether there's an active error
 * @returns {string | null} returns.error - Current error message
 * @returns {boolean} returns.isLoading - Current loading state
 * 
 * @example
 * ```tsx
 * const { hasError, error, isLoading } = useProfileErrors();
 * 
 * if (hasError) {
 *   return <ErrorMessage message={error} />;
 * }
 * 
 * if (isLoading) {
 *   return <LoadingSpinner />;
 * }
 * ```
 * 
 * @since 1.0.0
 */
export const useProfileErrors = () =>
  useProfileStore((state) => ({
    hasError: !!state.error,
    error: state.error,
    isLoading: state.isLoading,
  })); 