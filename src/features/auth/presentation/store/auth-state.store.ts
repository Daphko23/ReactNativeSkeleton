/**
 * Auth State Store - Pure State Management
 *
 * @fileoverview Schlanker Zustand Store nur für Auth-State Management.
 * Enthält keine Business Logic - diese wird in Hooks implementiert.
 * Teil der Hook-zentrierten Architektur-Migration.
 *
 * @version 2.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AuthUser } from '../../domain/entities/auth-user.entity';

/**
 * @interface AuthState
 * @description Pure Auth State Interface - nur State, keine Business Logic
 */
interface AuthState {
  // ==========================================
  // 📊 CORE STATE (Read-Only)
  // ==========================================

  /** Current authenticated user */
  user: AuthUser | null;
  /** Authentication status */
  isAuthenticated: boolean;
  /** Loading state für UI */
  isLoading: boolean;
  /** Last error message */
  error: string | null;

  // ==========================================
  // 🔧 STATE MANAGEMENT ACTIONS (Pure Setters)
  // ==========================================

  /** Set current user */
  setUser: (user: AuthUser | null) => void;
  /** Set authentication status */
  setAuthenticated: (authenticated: boolean) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Clear error state */
  clearError: () => void;
  /** Reset entire store */
  reset: () => void;
}

/**
 * Initial State Configuration
 */
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Auth State Store
 *
 * @description Schlanker State Store für Auth Feature.
 * Enthält nur State Management, keine Business Logic.
 * Business Logic wird in feature-spezifischen Hooks implementiert.
 *
 * @example
 * ```typescript
 * // In Hooks
 * const { user, setUser, setAuthenticated } = useAuthState();
 *
 * // In Components (über Hooks)
 * const { user, login, logout } = useAuth();
 * ```
 */
export const useAuthState = create<AuthState>()(
  devtools(
    immer(set => ({
      ...initialState,

      // Pure State Setters
      setUser: user => {
        set(state => {
          state.user = user;
          state.isAuthenticated = !!user;
          state.error = null;
        });
      },

      setAuthenticated: authenticated => {
        set(state => {
          state.isAuthenticated = authenticated;
          if (!authenticated) {
            state.user = null;
          }
        });
      },

      setLoading: loading => {
        set(state => {
          state.isLoading = loading;
        });
      },

      setError: error => {
        set(state => {
          state.error = error;
          state.isLoading = false;
        });
      },

      clearError: () => {
        set(state => {
          state.error = null;
        });
      },

      reset: () => {
        set(() => ({ ...initialState }));
      },
    })),
    {
      name: 'auth-state-store',
    }
  )
);

/**
 * @hook useAuthSelector
 * @description Performance-optimierter Selector für Auth State
 */
export const useAuthSelector = <T>(selector: (state: AuthState) => T): T =>
  useAuthState(selector);

/**
 * @hook useAuthUser
 * @description Direkter Zugriff auf User State
 */
export const useAuthUser = () => useAuthState(state => state.user);

/**
 * @hook useAuthLoading
 * @description Direkter Zugriff auf Loading State
 */
export const useAuthLoading = () => useAuthState(state => state.isLoading);

/**
 * @hook useAuthError
 * @description Direkter Zugriff auf Error State
 */
export const useAuthError = () => useAuthState(state => state.error);
