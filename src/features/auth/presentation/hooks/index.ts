/**
 * @fileoverview AUTH-HOOKS-INDEX: Authentication Hooks Central Export
 * @description Central export point for all authentication presentation hooks
 * 
 * @businessRule BR-992: Centralized hook exports for better organization
 * @businessRule BR-993: Consistent import patterns across the application
 * @businessRule BR-994: Type-safe hook and interface exports
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module AuthHooksIndex
 * @namespace Auth.Presentation.Hooks
 */

// ==========================================
// 🔐 AUTHENTICATION HOOKS
// ==========================================

export { 
  useAuth 
} from './use-auth';

export type { 
  UseAuthReturn,
  AuthState,
  BasicAuthOperations,
  EnterpriseAuthOperations
} from './use-auth';

// ==========================================
// 📖 HOOK USAGE EXAMPLES
// ==========================================

/**
 * @example Basic Hook Usage
 * ```typescript
 * import { useAuth } from '@features/auth/presentation/hooks';
 * 
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (isAuthenticated) {
 *     return <Button onPress={logout}>Sign Out</Button>;
 *   }
 *   
 *   return <Button onPress={() => login(email, password)}>Sign In</Button>;
 * }
 * ```
 * 
 * @example Enterprise Features Usage
 * ```typescript
 * import { useAuth } from '@features/auth/presentation/hooks';
 * 
 * function EnterpriseComponent() {
 *   const { enterprise } = useAuth();
 *   
 *   const enableMFA = () => enterprise.mfa.enable('totp');
 *   const loginWithBiometric = () => enterprise.biometric.authenticate();
 *   
 *   return (
 *     <View>
 *       <Button onPress={enableMFA}>Enable 2FA</Button>
 *       <Button onPress={loginWithBiometric}>Biometric Login</Button>
 *     </View>
 *   );
 * }
 * ```
 */ 