/**
 * Auth Social Hook - Social Login Features
 * 
 * @fileoverview Hook für Social Login Features wie Google, Apple OAuth.
 * Teil der Hook-zentrierten Architektur für Enterprise Social Authentication.
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
 * @interface UseAuthSocialReturn
 * @description Return Type für Auth Social Hook
 */
export interface UseAuthSocialReturn {
  // ==========================================
  // 📊 STATE (from Store)
  // ==========================================
  
  /** Current loading state */
  isLoading: boolean;
  /** Current error */
  error: string | null;

  // ==========================================
  // 🌐 SOCIAL LOGIN OPERATIONS
  // ==========================================
  
  /** 
   * Login with Google OAuth 
   * @returns Promise<AuthUser>
   */
  loginWithGoogle: () => Promise<AuthUser>;
  
  /** 
   * Login with Apple OAuth (future implementation)
   * @returns Promise<AuthUser>
   */
  loginWithApple: () => Promise<AuthUser>;
  
  /** 
   * Login with Facebook OAuth (future implementation)
   * @returns Promise<AuthUser>
   */
  loginWithFacebook: () => Promise<AuthUser>;

  // ==========================================
  // 🧹 UTILITY ACTIONS
  // ==========================================
  
  /** Clear current error */
  clearError: () => void;
}

/**
 * @hook useAuthSocial
 * @description Spezialisierter Hook für Social Login Features
 * 
 * @features
 * - Google OAuth Login
 * - Apple OAuth Login (planned)
 * - Facebook OAuth Login (planned)
 * - Social Account Linking
 * - OAuth Error Handling
 * 
 * @example
 * ```typescript
 * const { 
 *   loginWithGoogle, 
 *   loginWithApple,
 *   isLoading,
 *   error 
 * } = useAuthSocial();
 * 
 * // Google Login
 * try {
 *   const user = await loginWithGoogle();
 *   console.log(`Welcome ${user.displayName}!`);
 * } catch (error) {
 *   console.error('Google login failed:', error);
 * }
 * 
 * // Apple Login
 * try {
 *   const user = await loginWithApple();
 *   console.log(`Welcome ${user.displayName}!`);
 * } catch (error) {
 *   console.error('Apple login failed:', error);
 * }
 * ```
 */
export const useAuthSocial = (): UseAuthSocialReturn => {
  // ==========================================
  // 📊 STATE MANAGEMENT
  // ==========================================
  
  const {
    isLoading,
    error,
    setUser,
    setAuthenticated,
    setLoading,
    setError,
    clearError,
  } = useAuthState();

  // ==========================================
  // 🌐 SOCIAL LOGIN OPERATIONS
  // ==========================================
  
  /**
   * @function loginWithGoogle
   * @description Login with Google OAuth
   */
  const loginWithGoogle = useCallback(async (): Promise<AuthUser> => {
    setLoading(true);
    clearError();
    
    try {
      // Enterprise Implementation: Use Auth Container DI
      if (authContainer.isReady()) {
        const loginWithGoogleUseCase = authContainer.loginWithGoogleUseCase;
        const result = await loginWithGoogleUseCase.execute();
        
        // Update State
        setUser(result.user);
        setAuthenticated(true);
        setLoading(false);
        
        return result.user;
      }
      
      throw new Error('Auth Container nicht verfügbar');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google Login fehlgeschlagen';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [setUser, setAuthenticated, setLoading, setError, clearError]);

  /**
   * @function loginWithApple
   * @description Login with Apple OAuth (future implementation)
   */
  const loginWithApple = useCallback(async (): Promise<AuthUser> => {
    setLoading(true);
    clearError();
    
    try {
      // TODO: Implement Apple OAuth UseCase
      throw new Error('Apple Login noch nicht implementiert');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Apple Login fehlgeschlagen';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [setLoading, setError, clearError]);

  /**
   * @function loginWithFacebook
   * @description Login with Facebook OAuth (future implementation)
   */
  const loginWithFacebook = useCallback(async (): Promise<AuthUser> => {
    setLoading(true);
    clearError();
    
    try {
      // TODO: Implement Facebook OAuth UseCase
      throw new Error('Facebook Login noch nicht implementiert');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Facebook Login fehlgeschlagen';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [setLoading, setError, clearError]);

  // ==========================================
  // 🎯 RETURN INTERFACE
  // ==========================================
  
  return {
    // State
    isLoading,
    error,
    
    // Social Login Operations
    loginWithGoogle,
    loginWithApple,
    loginWithFacebook,
    
    // Utility Actions
    clearError,
  };
};