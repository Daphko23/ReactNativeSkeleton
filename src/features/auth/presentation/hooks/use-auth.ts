/**
 * @fileoverview USE-AUTH-HOOK-001: Enterprise Authentication Hook
 * @description Comprehensive authentication hook providing UI-friendly access to all auth functionality
 * 
 * @businessRule BR-995: Centralized authentication hook for all UI components
 * @businessRule BR-996: Type-safe authentication operations with proper error handling
 * @businessRule BR-997: Enterprise feature integration (MFA, Biometric, OAuth, Compliance)
 * @businessRule BR-998: Clean separation between presentation and domain layers
 * @businessRule BR-999: Consistent authentication state management across application
 * 
 * @performance Optimized hook with selective re-renders based on state changes
 * @performance Lazy loading of enterprise services through service container
 * @performance Memoized return object for minimal component re-renders
 * 
 * @security Enterprise-grade error handling with sanitized error messages
 * @security Secure authentication state management with proper session handling
 * @security MFA and biometric authentication integration for enhanced security
 * 
 * @accessibility Localized error messages and status updates
 * @accessibility Proper loading states for screen reader announcements
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module useAuth
 * @namespace Auth.Presentation.Hooks
 */

import { useMemo } from 'react';
import { useAuthStore } from '@features/auth/presentation/store/auth.store';
import type { AuthUser } from '@features/auth/domain/entities/auth-user.interface';
import { AuthServiceContainer } from '@features/auth/data/factories/auth-service.container';

/**
 * @interface BasicAuthOperations
 * @description Core authentication operations for user management
 */
export interface BasicAuthOperations {
  /** Authenticate user with email and password */
  login: (email: string, password: string) => Promise<void>;
  /** Register new user with email and password */
  register: (email: string, password: string) => Promise<void>;
  /** Sign out current user and clear session */
  logout: () => Promise<void>;
  /** Send password reset email to user */
  resetPassword: (email: string) => Promise<void>;
  /** Get currently authenticated user or null */
  getCurrentUser: () => Promise<AuthUser | null>;
  /** Initialize authentication session and state listeners */
  initializeSession: () => Promise<void>;
  /** Clear current error state */
  clearError: () => void;
}

/**
 * @interface EnterpriseAuthOperations
 * @description Enterprise authentication features for enhanced security
 */
export interface EnterpriseAuthOperations {
  // Multi-Factor Authentication
  mfa: {
    /** Enable MFA with specified method (TOTP or SMS) */
    enable: (method: 'totp' | 'sms', phoneNumber?: string) => Promise<{ qrCode?: string; backupCodes?: string[]; success: boolean }>;
    /** Verify MFA code during authentication */
    verify: (code: string, method: 'totp' | 'sms') => Promise<boolean>;
    /** Get all MFA factors for current user */
    getFactors: () => Promise<any[]>;
  };
  
  // Biometric Authentication
  biometric: {
    /** Enable biometric authentication for current user */
    enable: () => Promise<boolean>;
    /** Authenticate using biometric (Face ID, Touch ID, Fingerprint) */
    authenticate: () => Promise<void>;
    /** Check if biometric authentication is available on device */
    isAvailable: () => Promise<boolean>;
  };
  
  // OAuth Social Login
  oauth: {
    /** Login with Google OAuth provider */
    loginWithGoogle: () => Promise<void>;
    /** Login with Apple OAuth provider */
    loginWithApple: () => Promise<void>;
  };
  
  // Security & Password Policy
  security: {
    /** Validate password against enterprise policy */
    validatePassword: (password: string) => Promise<{ isValid: boolean; errors: string[]; suggestions: string[] }>;
  };
  
  // Compliance & Data Management
  compliance: {
    /** Export all user data for compliance requests */
    exportUserData: () => Promise<any>;
    /** Request data deletion with specified reason */
    requestDataDeletion: (reason: string) => Promise<void>;
    /** Generate compliance report for auditing */
    generateComplianceReport: () => Promise<any>;
  };

  // Role-Based Access Control
  rbac: {
    /** Check if user has specific permission */
    hasPermission: (permission: string, userId?: string) => Promise<boolean>;
    /** Get user roles */
    getUserRoles: (userId?: string) => Promise<string[]>;
    /** Get user permissions */
    getUserPermissions: (userId?: string) => Promise<string[]>;
  };
}

/**
 * @interface AuthState
 * @description Current authentication state information
 */
export interface AuthState {
  /** Currently authenticated user or null */
  user: AuthUser | null;
  /** Whether user is currently authenticated */
  isAuthenticated: boolean;
  /** Global loading state for auth operations */
  isLoading: boolean;
  /** Current error message or empty string */
  error: string;
}

/**
 * @interface UseAuthReturn
 * @description Complete return type for useAuth hook
 */
export interface UseAuthReturn extends AuthState, BasicAuthOperations {
  /** Enterprise authentication operations */
  enterprise: EnterpriseAuthOperations;
}

/**
 * @hook useAuth
 * @description Enterprise authentication hook providing comprehensive auth functionality
 * 
 * This hook serves as the primary interface between UI components and the authentication system.
 * It provides access to:
 * 
 * **Basic Authentication:**
 * - Login/logout with email/password
 * - User registration with validation
 * - Password reset functionality
 * - Session management and state synchronization
 * 
 * **Enterprise Security Features:**
 * - Multi-Factor Authentication (TOTP/SMS)
 * - Biometric authentication (Face ID, Touch ID, Fingerprint)
 * - OAuth social login (Google, Apple)
 * - Password policy validation
 * - Compliance and data export features
 * 
 * **State Management:**
 * - Real-time authentication state updates
 * - Loading states for all operations
 * - Comprehensive error handling with user-friendly messages
 * - Automatic session initialization and recovery
 * 
 * @returns {UseAuthReturn} Complete authentication interface with state and operations
 * 
 * @example Basic Authentication Usage
 * ```typescript
 * function LoginComponent() {
 *   const { 
 *     user, 
 *     isAuthenticated, 
 *     isLoading, 
 *     error, 
 *     login, 
 *     clearError 
 *   } = useAuth();
 * 
 *   const handleLogin = async () => {
 *     try {
 *       await login(email, password);
 *       // User is now authenticated
 *     } catch (error) {
 *       // Error handling is automatic via store
 *       console.error('Login failed:', error);
 *     }
 *   };
 * 
 *   if (isAuthenticated) {
 *     return <Text>Welcome, {user?.email}!</Text>;
 *   }
 * 
 *   return (
 *     <View>
 *       {error && <Text style={styles.error}>{error}</Text>}
 *       <Button onPress={handleLogin} disabled={isLoading}>
 *         {isLoading ? 'Signing in...' : 'Sign In'}
 *       </Button>
 *     </View>
 *   );
 * }
 * ```
 * 
 * @example Enterprise MFA Usage
 * ```typescript
 * function MFASetupComponent() {
 *   const { enterprise } = useAuth();
 * 
 *   const setupMFA = async () => {
 *     try {
 *       const result = await enterprise.mfa.enable('totp');
 *       if (result.success && result.qrCode) {
 *         // Show QR code to user for app setup
 *         setQrCode(result.qrCode);
 *       }
 *     } catch (error) {
 *       console.error('MFA setup failed:', error);
 *     }
 *   };
 * 
 *   return (
 *     <Button onPress={setupMFA}>
 *       Enable Two-Factor Authentication
 *     </Button>
 *   );
 * }
 * ```
 * 
 * @example Biometric Authentication
 * ```typescript
 * function BiometricLoginComponent() {
 *   const { enterprise } = useAuth();
 *   const [biometricAvailable, setBiometricAvailable] = useState(false);
 * 
 *   useEffect(() => {
 *     enterprise.biometric.isAvailable()
 *       .then(setBiometricAvailable);
 *   }, []);
 * 
 *   const handleBiometricLogin = async () => {
 *     try {
 *       await enterprise.biometric.authenticate();
 *       // User authenticated with biometrics
 *     } catch (error) {
 *       console.error('Biometric authentication failed:', error);
 *     }
 *   };
 * 
 *   if (!biometricAvailable) return null;
 * 
 *   return (
 *     <Button onPress={handleBiometricLogin}>
 *       Sign in with Touch ID
 *     </Button>
 *   );
 * }
 * ```
 * 
 * @example Password Validation
 * ```typescript
 * function PasswordInputComponent() {
 *   const { enterprise } = useAuth();
 *   const [password, setPassword] = useState('');
 *   const [validation, setValidation] = useState(null);
 * 
 *   useEffect(() => {
 *     if (password) {
 *       enterprise.security.validatePassword(password)
 *         .then(setValidation);
 *     }
 *   }, [password]);
 * 
 *   return (
 *     <View>
 *       <TextInput 
 *         value={password}
 *         onChangeText={setPassword}
 *         placeholder="Enter password"
 *         secureTextEntry
 *       />
 *       {validation && (
 *         <PasswordStrengthIndicator 
 *           password={password}
 *           validation={validation}
 *         />
 *       )}
 *     </View>
 *   );
 * }
 * ```
 * 
 * @example Compliance Operations
 * ```typescript
 * function UserDataComponent() {
 *   const { enterprise } = useAuth();
 * 
 *   const exportData = async () => {
 *     try {
 *       const userData = await enterprise.compliance.exportUserData();
 *       // Handle exported data (JSON format)
 *       downloadFile(userData, 'my-data.json');
 *     } catch (error) {
 *       console.error('Data export failed:', error);
 *     }
 *   };
 * 
 *   const requestDeletion = async () => {
 *     try {
 *       await enterprise.compliance.requestDataDeletion('User request');
 *       // Data deletion request submitted
 *     } catch (error) {
 *       console.error('Deletion request failed:', error);
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <Button onPress={exportData}>Export My Data</Button>
 *       <Button onPress={requestDeletion}>Delete My Account</Button>
 *     </View>
 *   );
 * }
 * ```
 * 
 * @businessRule BR-995: All UI components must use this hook for auth operations
 * @businessRule BR-996: Error handling is centralized through the store
 * @businessRule BR-997: Enterprise features are opt-in and gracefully degrade
 * @businessRule BR-998: Hook provides abstraction over complex domain logic
 * @businessRule BR-999: State changes trigger appropriate UI updates
 * 
 * @performance Hook is optimized with useMemo to prevent unnecessary re-renders
 * @performance Enterprise operations are lazy-loaded through service container
 * @performance State updates are batched for optimal React performance
 * 
 * @security All authentication operations include proper error sanitization
 * @security Sensitive data is not exposed through the hook interface
 * @security MFA and biometric operations include additional validation layers
 */
export const useAuth = (): UseAuthReturn => {
  const {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Basic Operations
    login,
    register,
    logout,
    resetPassword,
    getCurrentUser,
    initializeSession,
    clearError,
    
    // Enterprise Operations
    enableMFA,
    verifyMFA,
    getMFAFactors,
    enableBiometric,
    authenticateWithBiometric,
    isBiometricAvailable,
    validatePassword,
    exportUserData,
    requestDataDeletion,
    generateComplianceReport,
    loginWithGoogle,
    loginWithApple,
  } = useAuthStore();

  /**
   * Memoized return object to prevent unnecessary re-renders
   * Only re-creates when actual auth state changes
   */
  const authInterface = useMemo((): UseAuthReturn => ({
    // Current State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Basic Auth Operations
    login,
    register,
    logout,
    resetPassword,
    getCurrentUser,
    initializeSession,
    clearError,
    
    // Enterprise Operations
    enterprise: {
      // Multi-Factor Authentication
      mfa: {
        enable: enableMFA,
        verify: verifyMFA,
        getFactors: getMFAFactors,
      },
      
      // Biometric Authentication
      biometric: {
        enable: enableBiometric,
        authenticate: authenticateWithBiometric,
        isAvailable: isBiometricAvailable,
      },
      
      // OAuth Social Login
      oauth: {
        loginWithGoogle,
        loginWithApple,
      },
      
      // Security & Password Policy
      security: {
        validatePassword,
      },
      
      // Compliance & Data Management
      compliance: {
        exportUserData,
        requestDataDeletion,
        generateComplianceReport,
      },

      // Role-Based Access Control
      rbac: {
        hasPermission: async (permission: string, userId?: string) => {
          const container = AuthServiceContainer.getInstance();
          const authRepository = container.getAuthRepository();
          return await authRepository.hasPermission(permission, userId);
        },
        getUserRoles: async (userId?: string) => {
          const container = AuthServiceContainer.getInstance();
          const authRepository = container.getAuthRepository();
          return await authRepository.getUserRoles(userId);
        },
        getUserPermissions: async (userId?: string) => {
          const container = AuthServiceContainer.getInstance();
          const authRepository = container.getAuthRepository();
          return await authRepository.getUserPermissions(userId);
        },
      },
    },
  }), [
    // State dependencies
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Operation dependencies
    login,
    register,
    logout,
    resetPassword,
    getCurrentUser,
    initializeSession,
    clearError,
    enableMFA,
    verifyMFA,
    getMFAFactors,
    enableBiometric,
    authenticateWithBiometric,
    isBiometricAvailable,
    validatePassword,
    exportUserData,
    requestDataDeletion,
    generateComplianceReport,
    loginWithGoogle,
    loginWithApple,
  ]);

  return authInterface;
};
