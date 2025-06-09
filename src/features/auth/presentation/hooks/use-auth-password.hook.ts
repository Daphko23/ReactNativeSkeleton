/**
 * Auth Password Hook - Password Management Features
 * 
 * @fileoverview Hook für Password Management Features wie Update und Reset.
 * Teil der Hook-zentrierten Architektur für Enterprise Password Security.
 * 
 * @version 2.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation/Hooks
 */

import { useCallback } from 'react';
import { useAuthState } from '../store/auth-state.store';
import { authContainer } from '../../application/di/auth.container';

/**
 * @interface UseAuthPasswordReturn
 * @description Return Type für Auth Password Hook
 */
export interface UseAuthPasswordReturn {
  // ==========================================
  // 📊 STATE (from Store)
  // ==========================================
  
  /** Current loading state */
  isLoading: boolean;
  /** Current error */
  error: string | null;

  // ==========================================
  // 🔐 PASSWORD OPERATIONS
  // ==========================================
  
  /** 
   * Update user password 
   * @param currentPassword Current password
   * @param newPassword New password
   * @param confirmPassword Password confirmation
   * @returns Promise<boolean>
   */
  updatePassword: (
    currentPassword: string, 
    newPassword: string, 
    confirmPassword: string
  ) => Promise<boolean>;
  
  /** 
   * Reset password via email 
   * @param email Email address
   * @returns Promise<boolean>
   */
  resetPassword: (email: string) => Promise<boolean>;
  
  /** 
   * Validate password strength 
   * @param password Password to validate
   * @returns {isValid: boolean, score: number, feedback: string[]}
   */
  validatePasswordStrength: (password: string) => {
    isValid: boolean;
    score: number;
    feedback: string[];
  };

  // ==========================================
  // 🧹 UTILITY ACTIONS
  // ==========================================
  
  /** Clear current error */
  clearError: () => void;
}

/**
 * @hook useAuthPassword
 * @description Spezialisierter Hook für Password Management Features
 * 
 * @features
 * - Password Update with Current Password Verification
 * - Password Reset via Email
 * - Password Strength Validation
 * - Security-compliant Password Policies
 * - Error Handling and User Feedback
 * 
 * @example
 * ```typescript
 * const { 
 *   updatePassword, 
 *   resetPassword,
 *   validatePasswordStrength,
 *   isLoading,
 *   error 
 * } = useAuthPassword();
 * 
 * // Update Password
 * try {
 *   const success = await updatePassword(
 *     'currentPassword123',
 *     'newPassword456',
 *     'newPassword456'
 *   );
 *   if (success) {
 *     showMessage('Passwort erfolgreich aktualisiert');
 *   }
 * } catch (error) {
 *   showError(error.message);
 * }
 * 
 * // Reset Password
 * try {
 *   const sent = await resetPassword('user@example.com');
 *   if (sent) {
 *     showMessage('Reset-E-Mail wurde gesendet');
 *   }
 * } catch (error) {
 *   showError('Reset fehlgeschlagen');
 * }
 * 
 * // Validate Password Strength
 * const validation = validatePasswordStrength('myPassword123!');
 * if (!validation.isValid) {
 *   showFeedback(validation.feedback);
 * }
 * ```
 */
export const useAuthPassword = (): UseAuthPasswordReturn => {
  // ==========================================
  // 📊 STATE MANAGEMENT
  // ==========================================
  
  const {
    isLoading,
    error,
    setLoading,
    setError,
    clearError,
  } = useAuthState();

  // ==========================================
  // 🔐 PASSWORD OPERATIONS
  // ==========================================
  
  /**
   * @function updatePassword
   * @description Update user password with current password verification
   */
  const updatePassword = useCallback(async (
    currentPassword: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<boolean> => {
    setLoading(true);
    clearError();
    
    try {
      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('Alle Passwort-Felder sind erforderlich');
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error('Neue Passwörter stimmen nicht überein');
      }
      
      if (newPassword.length < 8) {
        throw new Error('Neues Passwort muss mindestens 8 Zeichen lang sein');
      }
      
      if (currentPassword === newPassword) {
        throw new Error('Neues Passwort muss sich vom aktuellen Passwort unterscheiden');
      }
      
      // Enterprise Implementation: Use Auth Container DI
      if (authContainer.isReady()) {
        const updatePasswordUseCase = authContainer.updatePasswordUseCase;
        const result = await updatePasswordUseCase.execute({
          currentPassword,
          newPassword,
        });
        
        setLoading(false);
        return result.success;
      }
      
      throw new Error('Auth Container nicht verfügbar');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Passwort-Update fehlgeschlagen';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [setLoading, setError, clearError]);

  /**
   * @function resetPassword
   * @description Reset password via email
   */
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    clearError();
    
    try {
      // Validation
      if (!email) {
        throw new Error('E-Mail-Adresse ist erforderlich');
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Ungültige E-Mail-Adresse');
      }
      
      // Enterprise Implementation: Use Auth Container DI
      if (authContainer.isReady()) {
        const passwordResetUseCase = authContainer.passwordResetUseCase;
        await passwordResetUseCase.execute(email);
        
        setLoading(false);
        return true; // Reset usecase returns void, so true means success
      }
      
      throw new Error('Auth Container nicht verfügbar');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Passwort-Reset fehlgeschlagen';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, [setLoading, setError, clearError]);

  /**
   * @function validatePasswordStrength
   * @description Validate password strength with enterprise security policies
   */
  const validatePasswordStrength = useCallback((password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push('Passwort muss mindestens 8 Zeichen lang sein');
    }

    if (password.length >= 12) {
      score += 10;
    } else {
      feedback.push('Für höhere Sicherheit: Verwenden Sie mindestens 12 Zeichen');
    }

    // Character diversity
    if (/[a-z]/.test(password)) {
      score += 10;
    } else {
      feedback.push('Verwenden Sie mindestens einen Kleinbuchstaben');
    }

    if (/[A-Z]/.test(password)) {
      score += 10;
    } else {
      feedback.push('Verwenden Sie mindestens einen Großbuchstaben');
    }

    if (/[0-9]/.test(password)) {
      score += 10;
    } else {
      feedback.push('Verwenden Sie mindestens eine Zahl');
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Verwenden Sie mindestens ein Sonderzeichen');
    }

    // Common password checks
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890'
    ];
    
    if (commonPasswords.some(common => 
      password.toLowerCase().includes(common.toLowerCase())
    )) {
      score -= 20;
      feedback.push('Vermeiden Sie häufig verwendete Passwörter');
    }

    // Repetition check
    if (/(.)\1{2,}/.test(password)) {
      score -= 10;
      feedback.push('Vermeiden Sie sich wiederholende Zeichen');
    }

    // Sequential characters
    if (/123|abc|xyz/i.test(password)) {
      score -= 10;
      feedback.push('Vermeiden Sie aufeinanderfolgende Zeichen');
    }

    // Normalize score to 0-100
    score = Math.max(0, Math.min(100, score));

    const isValid = score >= 70 && feedback.length === 0;

    if (feedback.length === 0 && score >= 70) {
      feedback.push('Starkes Passwort!');
    }

    return {
      isValid,
      score,
      feedback,
    };
  }, []);

  // ==========================================
  // 🎯 RETURN INTERFACE
  // ==========================================
  
  return {
    // State
    isLoading,
    error,
    
    // Password Operations
    updatePassword,
    resetPassword,
    validatePasswordStrength,
    
    // Utility Actions
    clearError,
  };
};