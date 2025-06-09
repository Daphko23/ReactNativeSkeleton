/**
 * Core Auth Hook - Hook-zentrierte Business Logic
 * 
 * @fileoverview Core Authentifizierung Hook für grundlegende Auth-Operationen.
 * Implementiert das Hook-zentrierte Pattern anstatt Store-zentrierte Business Logic.
 * Verwendet DI Container für UseCase Injection und State Store für State Management.
 * 
 * @version 2.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation/Hooks
 */

import { useCallback } from 'react';
import { useAuthState } from '../store/auth-state.store';
import { authContainer } from '../../application/di/auth.container';
import { AuthUser } from '../../domain/entities/auth-user.entity';

/**
 * @interface UseAuthReturn
 * @description Return Type für Core Auth Hook
 */
export interface UseAuthReturn {
  // ==========================================
  // 📊 STATE (from Store)
  // ==========================================
  
  /** Current authenticated user */
  user: AuthUser | null;
  /** Authentication status */
  isAuthenticated: boolean;
  /** Loading state */
  isLoading: boolean;
  /** Current error */
  error: string | null;

  // ==========================================
  // 🔧 CORE AUTH ACTIONS
  // ==========================================
  
  /** 
   * Login with email and password 
   * @param email User email
   * @param password User password
   * @returns Promise<AuthUser>
   */
  login: (email: string, password: string) => Promise<AuthUser>;
  
  /** 
   * Register new user with email and password 
   * @param email User email
   * @param password User password
   * @param confirmPassword Password confirmation
   * @returns Promise<AuthUser>
   */
  register: (email: string, password: string, confirmPassword: string) => Promise<AuthUser>;
  
  /** 
   * Logout current user 
   * @returns Promise<void>
   */
  logout: () => Promise<void>;
  
  /** 
   * Check current authentication status 
   * @returns Promise<boolean>
   */
  checkAuthStatus: () => Promise<boolean>;
  
  /** 
   * Get current user data 
   * @returns Promise<AuthUser | null>
   */
  getCurrentUser: () => Promise<AuthUser | null>;
  
  // ==========================================
  // 🧹 UTILITY ACTIONS
  // ==========================================
  
  /** Clear current error */
  clearError: () => void;
  /** Reset auth state */
  resetAuth: () => void;
}

/**
 * @hook useAuth
 * @description Core Auth Hook für grundlegende Authentifizierungs-Operationen
 * 
 * @features
 * - Login/Register/Logout
 * - Authentication Status Checking
 * - Current User Management
 * - Error Handling
 * - DI Container Integration
 * - Separation of Concerns (Hook vs Store)
 * 
 * @example
 * ```typescript
 * const { 
 *   user, 
 *   isAuthenticated, 
 *   login, 
 *   logout 
 * } = useAuth();
 * 
 * // Login
 * await login('user@example.com', 'password123');
 * 
 * // Logout
 * await logout();
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  // ==========================================
  // 📊 STATE MANAGEMENT
  // ==========================================
  
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setAuthenticated,
    setLoading,
    setError,
    clearError,
    reset,
  } = useAuthState();

  // ==========================================
  // 🔧 CORE AUTH OPERATIONS
  // ==========================================
  
  /**
   * @function login
   * @description Authenticate user with email and password
   */
  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    setLoading(true);
    clearError();
    
    try {
      // Validation
      if (!email || !password) {
        throw new Error('Email und Passwort sind erforderlich');
      }
      
      // DEBUG: Check container state
      console.log('[useAuth] authContainer.isReady():', authContainer.isReady());
      
      // Enterprise Implementation: Use Auth Container DI
      if (authContainer.isReady()) {
        console.log('[useAuth] Using authContainer for login');
        const loginUseCase = authContainer.loginWithEmailUseCase;
        const user = await loginUseCase.execute(email, password);
        
        // Update State
        setUser(user);
        setAuthenticated(true);
        setLoading(false);
        
        return user;
      }
      
      // DEBUG: Container not ready, trying to initialize it
      console.warn('[useAuth] Auth Container not ready, attempting emergency initialization');
      
      try {
        await authContainer.initialize({
          enableAdvancedSecurity: true,
          enableBiometric: true,
          enableOAuth: true,
          enableMFA: true,
          enableCompliance: true,
          enablePasswordPolicy: true
        });
        
        console.log('[useAuth] Emergency initialization complete, retrying login');
        
        if (authContainer.isReady()) {
          const loginUseCase = authContainer.loginWithEmailUseCase;
          const user = await loginUseCase.execute(email, password);
          
          // Update State
          setUser(user);
          setAuthenticated(true);
          setLoading(false);
          
          return user;
        }
      } catch (initError) {
        console.error('[useAuth] Emergency initialization failed:', initError);
      }
      
      // Fallback Implementation
      throw new Error('Auth Container nicht verfügbar - Initialisierung fehlgeschlagen');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login fehlgeschlagen';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [setUser, setAuthenticated, setLoading, setError, clearError]);

  /**
   * @function register
   * @description Register new user with email and password
   */
  const register = useCallback(async (
    email: string, 
    password: string, 
    confirmPassword: string
  ): Promise<AuthUser> => {
    setLoading(true);
    clearError();
    
    try {
      // Validation
      if (!email || !password || !confirmPassword) {
        throw new Error('Alle Felder sind erforderlich');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwörter stimmen nicht überein');
      }
      
      // Enterprise Implementation: Use Auth Container DI
      if (authContainer.isReady()) {
        const registerUseCase = authContainer.registerWithEmailUseCase;
        const user = await registerUseCase.execute(email, password);
        
        // Update State
        setUser(user);
        setAuthenticated(true);
        setLoading(false);
        
        return user;
      }
      
      // Fallback Implementation
      throw new Error('Auth Container nicht verfügbar');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registrierung fehlgeschlagen';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [setUser, setAuthenticated, setLoading, setError, clearError]);

  /**
   * @function logout
   * @description Logout current user
   */
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      // Enterprise Implementation: Use Auth Container DI
      if (authContainer.isReady()) {
        const logoutUseCase = authContainer.logoutUseCase;
        await logoutUseCase.execute();
      }
      
      // Update State (always reset, even if UseCase fails)
      reset();
      
    } catch (error) {
      // Log error but still reset state
      console.warn('Logout UseCase failed, but state reset:', error);
      reset();
    }
  }, [setLoading, clearError, reset]);

  /**
   * @function checkAuthStatus
   * @description Check current authentication status
   */
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      // Enterprise Implementation: Use Auth Container DI
      if (authContainer.isReady()) {
        const isAuthenticatedUseCase = authContainer.isAuthenticatedUseCase;
        const isAuthenticated = await isAuthenticatedUseCase.execute();
        
        setAuthenticated(isAuthenticated);
        return isAuthenticated;
      }
      
      return false;
      
    } catch (error) {
      console.warn('Check auth status failed:', error);
      setAuthenticated(false);
      return false;
    }
  }, [setAuthenticated]);

  /**
   * @function getCurrentUser
   * @description Get current user data
   */
  const getCurrentUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      // Enterprise Implementation: Use Auth Container DI
      if (authContainer.isReady()) {
        const getCurrentUserUseCase = authContainer.getCurrentUserUseCase;
        const user = await getCurrentUserUseCase.execute();
        
        if (user) {
          setUser(user);
          setAuthenticated(true);
        }
        
        return user;
      }
      
      return null;
      
    } catch (error) {
      console.warn('Get current user failed:', error);
      return null;
    }
  }, [setUser, setAuthenticated]);

  // ==========================================
  // 🎯 RETURN INTERFACE
  // ==========================================
  
  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Core Actions
    login,
    register,
    logout,
    checkAuthStatus,
    getCurrentUser,
    
    // Utility Actions
    clearError,
    resetAuth: reset,
  };
}; 