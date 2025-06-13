/**
 * Auth Flow Hook - Simplified for Mobile
 * 
 * @description Simple auth flow management for React Native apps
 * @version 2.0.0 (simplified from 3.0.0 - reduced from 1058 to ~150 lines)
 * @author ReactNativeSkeleton Team
 */

import { useCallback, useState } from 'react';
import { useAuth } from './use-auth.hook';

// ** SIMPLIFIED TYPES **
export enum AuthFlowState {
  IDLE = 'idle',
  LOGIN = 'login',
  REGISTER = 'register',
  MFA = 'mfa',
  BIOMETRIC = 'biometric',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum AuthFlowType {
  LOGIN = 'login',
  REGISTER = 'register',
  PASSWORD_RESET = 'password_reset'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UseAuthFlowReturn {
  // State
  currentState: AuthFlowState;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startLogin: (credentials: LoginCredentials) => Promise<void>;
  startRegister: (data: RegisterData) => Promise<void>;
  verifyMFA: (code: string) => Promise<void>;
  verifyBiometric: () => Promise<void>;
  resetFlow: () => void;
  
  // Utils
  canUseBiometric: boolean;
}

/**
 * useAuthFlow - Simplified Auth Flow Hook
 * 
 * @example
 * const { startLogin, currentState, isLoading } = useAuthFlow();
 * await startLogin({ email, password });
 */
export const useAuthFlow = (): UseAuthFlowReturn => {
  const [currentState, setCurrentState] = useState<AuthFlowState>(AuthFlowState.IDLE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canUseBiometric] = useState(false);
  
  const { login, register } = useAuth();

  const startLogin = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    setCurrentState(AuthFlowState.LOGIN);
    
    try {
      const result = await login(credentials.email, credentials.password);
      
      if (result.metadata.mfaEnabled) {
        setCurrentState(AuthFlowState.MFA);
      } else if (result.metadata.biometricEnabled && canUseBiometric) {
        setCurrentState(AuthFlowState.BIOMETRIC);
      } else {
        setCurrentState(AuthFlowState.SUCCESS);
      }
    } catch (err: any) {
      setError(err.message);
      setCurrentState(AuthFlowState.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [login, canUseBiometric]);

  const startRegister = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    setCurrentState(AuthFlowState.REGISTER);
    
    try {
      await register(data.email, data.password, data.password);
      setCurrentState(AuthFlowState.SUCCESS);
    } catch (err: any) {
      setError(err.message);
      setCurrentState(AuthFlowState.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [register]);

  const verifyMFA = useCallback(async (_code: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // MFA verification logic would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setCurrentState(AuthFlowState.SUCCESS);
    } catch (err: any) {
      setError(err.message);
      setCurrentState(AuthFlowState.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyBiometric = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Biometric verification logic would go here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate biometric
      setCurrentState(AuthFlowState.SUCCESS);
    } catch (err: any) {
      setError(err.message);
      setCurrentState(AuthFlowState.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetFlow = useCallback(() => {
    setCurrentState(AuthFlowState.IDLE);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    // State
    currentState,
    isLoading,
    error,
    
    // Actions
    startLogin,
    startRegister,
    verifyMFA,
    verifyBiometric,
    resetFlow,
    
    // Utils
    canUseBiometric,
  };
}; 