/**
 * 🎯 PROFILE CLIENT STATE STORE - React Native 2025 Enterprise Standards
 * 
 * ✅ VERANTWORTLICHKEITEN:
 * - UI states (modals, form states, navigation)
 * - Form data (temporary, before submission)
 * - Local component states
 * - User preferences (theme, settings)
 * 
 * ❌ NICHT VERANTWORTLICH FÜR:
 * - Server data (das macht TanStack Query)
 * - API caching (das macht TanStack Query)
 * - Background sync (das macht TanStack Query)
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 🎯 CLIENT STATE INTERFACES
interface ProfileFormState {
  isDirty: boolean;
  isSubmitting: boolean;
  hasUnsavedChanges: boolean;
  activeSection: 'basic' | 'professional' | 'social' | 'custom';
  validationErrors: Record<string, string>;
}

interface ProfileUIState {
  // Form Management
  form: ProfileFormState;
  
  // Modal States
  isAvatarModalOpen: boolean;
  isCustomFieldsModalOpen: boolean;
  isPrivacyModalOpen: boolean;
  
  // Navigation States
  editMode: boolean;
  expandedSections: Set<string>;
  
  // User Preferences (local)
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
  showTips: boolean;
}

interface ProfileUIActions {
  // Form Actions
  setFormDirty: (isDirty: boolean) => void;
  setFormSubmitting: (isSubmitting: boolean) => void;
  setActiveSection: (section: ProfileFormState['activeSection']) => void;
  setValidationError: (field: string, error: string) => void;
  clearValidationErrors: () => void;
  
  // Modal Actions
  openAvatarModal: () => void;
  closeAvatarModal: () => void;
  openCustomFieldsModal: () => void;
  closeCustomFieldsModal: () => void;
  openPrivacyModal: () => void;
  closePrivacyModal: () => void;
  
  // Navigation Actions
  setEditMode: (enabled: boolean) => void;
  toggleSection: (sectionId: string) => void;
  expandSection: (sectionId: string) => void;
  collapseSection: (sectionId: string) => void;
  
  // Preference Actions
  setTheme: (theme: ProfileUIState['theme']) => void;
  setCompactMode: (enabled: boolean) => void;
  setShowTips: (enabled: boolean) => void;
  
  // Reset Actions
  resetForm: () => void;
  resetModals: () => void;
  resetAll: () => void;
}

type ProfileUIStore = ProfileUIState & ProfileUIActions;

// 🏪 CLIENT STATE STORE (LEICHTGEWICHTIG ~100 Zeilen)
export const useProfileUIStore = create<ProfileUIStore>()(
  devtools(
    (set, get) => ({
      // 📋 INITIAL STATE
      form: {
        isDirty: false,
        isSubmitting: false,
        hasUnsavedChanges: false,
        activeSection: 'basic',
        validationErrors: {}
      },
      
      isAvatarModalOpen: false,
      isCustomFieldsModalOpen: false,
      isPrivacyModalOpen: false,
      
      editMode: false,
      expandedSections: new Set(['basic']),
      
      theme: 'auto',
      compactMode: false,
      showTips: true,

      // 🎬 FORM ACTIONS
      setFormDirty: (isDirty) =>
        set((state) => ({
          form: { ...state.form, isDirty, hasUnsavedChanges: isDirty }
        })),

      setFormSubmitting: (isSubmitting) =>
        set((state) => ({
          form: { ...state.form, isSubmitting }
        })),

      setActiveSection: (activeSection) =>
        set((state) => ({
          form: { ...state.form, activeSection }
        })),

      setValidationError: (field, error) =>
        set((state) => ({
          form: {
            ...state.form,
            validationErrors: { ...state.form.validationErrors, [field]: error }
          }
        })),

      clearValidationErrors: () =>
        set((state) => ({
          form: { ...state.form, validationErrors: {} }
        })),

      // 🔔 MODAL ACTIONS
      openAvatarModal: () => set({ isAvatarModalOpen: true }),
      closeAvatarModal: () => set({ isAvatarModalOpen: false }),
      openCustomFieldsModal: () => set({ isCustomFieldsModalOpen: true }),
      closeCustomFieldsModal: () => set({ isCustomFieldsModalOpen: false }),
      openPrivacyModal: () => set({ isPrivacyModalOpen: true }),
      closePrivacyModal: () => set({ isPrivacyModalOpen: false }),

      // 🧭 NAVIGATION ACTIONS
      setEditMode: (editMode) => set({ editMode }),

      toggleSection: (sectionId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedSections);
          if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
          } else {
            newExpanded.add(sectionId);
          }
          return { expandedSections: newExpanded };
        }),

      expandSection: (sectionId) =>
        set((state) => ({
          expandedSections: new Set([...state.expandedSections, sectionId])
        })),

      collapseSection: (sectionId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedSections);
          newExpanded.delete(sectionId);
          return { expandedSections: newExpanded };
        }),

      // ⚙️ PREFERENCE ACTIONS
      setTheme: (theme) => set({ theme }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setShowTips: (showTips) => set({ showTips }),

      // 🔄 RESET ACTIONS
      resetForm: () =>
        set((_state) => ({
          form: {
            isDirty: false,
            isSubmitting: false,
            hasUnsavedChanges: false,
            activeSection: 'basic',
            validationErrors: {}
          }
        })),

      resetModals: () =>
        set({
          isAvatarModalOpen: false,
          isCustomFieldsModalOpen: false,
          isPrivacyModalOpen: false
        }),

      resetAll: () => {
        const { resetForm, resetModals } = get();
        resetForm();
        resetModals();
        set({
          editMode: false,
          expandedSections: new Set(['basic'])
        });
      }
    }),
    {
      name: 'profile-ui-store',
      partialize: (state: ProfileUIStore) => ({
        theme: state.theme,
        compactMode: state.compactMode,
        showTips: state.showTips,
        expandedSections: Array.from(state.expandedSections) // Convert Set to Array for persistence
      })
    }
  )
);

// 🎯 CONVENIENCE HOOKS
export const useProfileForm = () => useProfileUIStore((state) => state.form);
export const useProfileModals = () => useProfileUIStore((state) => ({
  isAvatarModalOpen: state.isAvatarModalOpen,
  isCustomFieldsModalOpen: state.isCustomFieldsModalOpen,
  isPrivacyModalOpen: state.isPrivacyModalOpen
}));
export const useProfileNavigation = () => useProfileUIStore((state) => ({
  editMode: state.editMode,
  expandedSections: state.expandedSections
}));
export const useProfilePreferences = () => useProfileUIStore((state) => ({
  theme: state.theme,
  compactMode: state.compactMode,
  showTips: state.showTips
})); 