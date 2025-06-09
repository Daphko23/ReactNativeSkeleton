/**
 * @fileoverview AUTH HOOKS INDEX - Enterprise Hook Ecosystem Exports
 * @description Comprehensive export index für alle Enterprise Auth Hooks
 * mit proper documentation, type exports und organized structure.
 * 
 * @businessRule BR-900: Centralized hook exports with enterprise structure
 * @businessRule BR-901: Comprehensive type exports for external consumption
 * @businessRule BR-902: Organized hook categorization and documentation
 * @businessRule BR-903: Enterprise-grade development experience
 * 
 * @architecture Barrel Export Pattern für Hook Ecosystem
 * @architecture Categorized exports by functionality
 * @architecture Complete type system exports
 * @architecture Developer-friendly organization
 * 
 * @since 3.0.0
 * @version 3.0.0
 * @author ReactNativeSkeleton Phase3 Team
 * @module AuthHooksIndex
 * @namespace Auth.Presentation.Hooks
 */

/**
 * Auth Hooks Index - Centralized Export
 * 
 * @fileoverview Zentraler Export für alle Auth Feature Hooks.
 * Teil der Hook-zentrierten Architektur-Migration.
 * 
 * @version 2.1.0
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation/Hooks
 */

// ==========================================
// 📥 HOOK IMPORTS
// ==========================================

// Core Auth Hooks
import { useAuth } from './use-auth.hook';

// Specialized Security Hooks
import { useAuthSecurity } from './use-auth-security.hook';
import { useAuthPassword } from './use-auth-password.hook'; 
import { useAuthSocial } from './use-auth-social.hook';

// Enterprise Advanced Hooks
import { useAuthComposite } from './use-auth-composite.hook';
import { useAuthFlow } from './use-auth-flow.hook';
import { useAuthTesting } from './use-auth-testing.hook';

// ==========================================
// Enterprise Hook Exports handled below in organized structure

// State Store Exports (für direkte Zugriffe)
export { 
  useAuthState, 
  useAuthSelector, 
  useAuthUser, 
  useAuthLoading, 
  useAuthError 
} from '../store/auth-state.store';

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

// ==========================================
// 🔧 CORE AUTH HOOKS
// ==========================================

/**
 * Core Authentication Hook - Basic auth operations
 * @description Handles login, register, logout, and basic auth state
 */
export { useAuth, type UseAuthReturn } from './use-auth.hook';

// ==========================================
// 🔒 SPECIALIZED SECURITY HOOKS
// ==========================================

/**
 * Security Management Hook - Advanced security features
 * @description MFA, biometric auth, security monitoring, and audit
 */
export { useAuthSecurity, type UseAuthSecurityReturn } from './use-auth-security.hook';

/**
 * Password Management Hook - Password operations
 * @description Password validation, strength checking, update, and reset
 */
export { useAuthPassword, type UseAuthPasswordReturn } from './use-auth-password.hook';

/**
 * Social Authentication Hook - OAuth and social login
 * @description Google, Apple, Facebook OAuth integration
 */
export { useAuthSocial, type UseAuthSocialReturn } from './use-auth-social.hook';

// ==========================================
// 🚀 ADVANCED ENTERPRISE HOOKS
// ==========================================

/**
 * Composite Auth Hook - Unified auth management
 * @description Complete auth workflow orchestration and unified interface
 */
export { useAuthComposite } from './use-auth-composite.hook';
export type { UseAuthCompositeReturn } from './use-auth-composite.hook';

/**
 * Auth Flow Hook - State machine auth flows
 * @description Advanced flow management with state machine pattern
 */
export { useAuthFlow } from './use-auth-flow.hook';
export type { UseAuthFlowReturn } from './use-auth-flow.hook';

/**
 * Auth Testing Hook - Testing infrastructure
 * @description Comprehensive testing, mocking, and debugging tools
 */
export { useAuthTesting } from './use-auth-testing.hook';
export type { UseAuthTestingReturn } from './use-auth-testing.hook';

// ==========================================
// 📊 TYPE EXPORTS - ENUMS & INTERFACES
// ==========================================

// ** COMPOSITE HOOK TYPES **
export type {
  AuthCompositeMetrics,
  SecurityAuditResult,
} from './use-auth-composite.hook';

export {
  AuthWorkflow,
  type AuthWorkflowState,
} from './use-auth-composite.hook';

// ** FLOW HOOK TYPES **
export {
  AuthFlowState,
  AuthFlowEvent,
  AuthFlowType,
  type AuthFlowContext,
} from './use-auth-flow.hook';

// ** TESTING HOOK TYPES **
export {
  TestScenarioType,
  TestFailureType,
  NetworkCondition,
  LogLevel,
  ReportFormat,
  type TestScenario,
  type TestResult,
  type TestSuite,
  type PerformanceTestConfig,
  type LoadTestConfig,
  type StateSnapshot,
  type FlowAnalysis,
} from './use-auth-testing.hook';

// ==========================================
// 🎯 CONVENIENCE EXPORTS
// ==========================================

/**
 * @namespace CoreAuthHooks
 * @description Essential auth hooks for basic functionality
 */
export const CoreAuthHooks = {
  useAuth,
} as const;

/**
 * @namespace SecurityHooks
 * @description Security-focused auth hooks
 */
export const SecurityHooks = {
  useAuthSecurity,
  useAuthPassword,
} as const;

/**
 * @namespace SocialHooks
 * @description Social authentication hooks
 */
export const SocialHooks = {
  useAuthSocial,
} as const;

/**
 * @namespace AdvancedHooks
 * @description Enterprise-grade advanced hooks
 */
export const AdvancedHooks = {
  useAuthComposite,
  useAuthFlow,
  useAuthTesting,
} as const;

/**
 * @namespace AllAuthHooks
 * @description Complete collection of all auth hooks
 */
export const AllAuthHooks = {
  // Core
  useAuth,
  
  // Specialized
  useAuthSecurity,
  useAuthPassword,
  useAuthSocial,
  
  // Advanced
  useAuthComposite,
  useAuthFlow,
  useAuthTesting,
} as const;

// ==========================================
// 🏗️ HOOK FACTORY PATTERNS
// ==========================================

/**
 * @function createAuthHookSuite
 * @description Factory function to create a complete auth hook suite
 * @param config Configuration for the hook suite
 * @returns Complete auth hook suite
 * 
 * @example
 * ```typescript
 * const authSuite = createAuthHookSuite({
 *   enableTesting: true,
 *   enableAdvancedFeatures: true,
 *   mockMode: false
 * });
 * 
 * const {
 *   auth,
 *   security,
 *   composite,
 *   flow,
 *   testing
 * } = authSuite;
 * ```
 */
export const createAuthHookSuite = (config: {
  enableTesting?: boolean;
  enableAdvancedFeatures?: boolean;
  mockMode?: boolean;
} = {}) => {
  const suite = {
    // Core hooks
    auth: useAuth(),
    security: useAuthSecurity(),
    password: useAuthPassword(),
    social: useAuthSocial(),
    
    // Advanced hooks (conditional)
    ...(config.enableAdvancedFeatures && {
      composite: useAuthComposite(),
      flow: useAuthFlow(),
    }),
    
    // Testing hooks (conditional)
    ...(config.enableTesting && {
      testing: useAuthTesting(),
    }),
  };

  // Setup mock mode if requested
  if (config.mockMode && 'testing' in suite) {
    suite.testing?.enableMockMode({
      enabled: true,
      responses: [],
      errorInjection: [],
      networkDelay: 100,
      failureRate: 0.05,
    });
  }

  return suite;
};

/**
 * @type AuthHookSuite
 * @description Type definition for complete auth hook suite
 */
export type AuthHookSuite = ReturnType<typeof createAuthHookSuite>;

// ==========================================
// 📚 HOOK DOCUMENTATION & METADATA
// ==========================================

/**
 * @const HOOK_METADATA
 * @description Metadata information about all auth hooks
 */
export const HOOK_METADATA = {
  useAuth: {
    category: 'core',
    description: 'Basic authentication operations',
    features: ['login', 'register', 'logout', 'status'],
    dependencies: [],
    complexity: 'low',
    enterprise: false,
  },
  useAuthSecurity: {
    category: 'security',
    description: 'Advanced security management',
    features: ['mfa', 'biometric', 'audit', 'monitoring'],
    dependencies: ['useAuth'],
    complexity: 'high',
    enterprise: true,
  },
  useAuthPassword: {
    category: 'security',
    description: 'Password management and validation',
    features: ['strength', 'validation', 'update', 'reset'],
    dependencies: [],
    complexity: 'medium',
    enterprise: false,
  },
  useAuthSocial: {
    category: 'social',
    description: 'Social authentication integration',
    features: ['google', 'apple', 'facebook', 'oauth'],
    dependencies: [],
    complexity: 'medium',
    enterprise: false,
  },
  useAuthComposite: {
    category: 'advanced',
    description: 'Unified auth management with workflows',
    features: ['orchestration', 'workflows', 'metrics', 'unified'],
    dependencies: ['useAuth', 'useAuthSecurity', 'useAuthPassword', 'useAuthSocial'],
    complexity: 'high',
    enterprise: true,
  },
  useAuthFlow: {
    category: 'advanced',
    description: 'State machine auth flow management',
    features: ['state-machine', 'flows', 'transitions', 'analytics'],
    dependencies: ['useAuthComposite'],
    complexity: 'high',
    enterprise: true,
  },
  useAuthTesting: {
    category: 'testing',
    description: 'Comprehensive testing infrastructure',
    features: ['testing', 'mocking', 'performance', 'debugging'],
    dependencies: ['useAuthComposite', 'useAuthFlow'],
    complexity: 'high',
    enterprise: true,
  },
} as const;

/**
 * @function getHooksByCategory
 * @description Get hooks filtered by category
 * @param category Hook category to filter by
 * @returns Array of hook names in the specified category
 */
export const getHooksByCategory = (category: string): string[] => {
  return Object.entries(HOOK_METADATA)
    .filter(([_, metadata]) => metadata.category === category)
    .map(([hookName]) => hookName);
};

/**
 * @function getEnterpriseHooks
 * @description Get all enterprise-grade hooks
 * @returns Array of enterprise hook names
 */
export const getEnterpriseHooks = (): string[] => {
  return Object.entries(HOOK_METADATA)
    .filter(([_, metadata]) => metadata.enterprise)
    .map(([hookName]) => hookName);
};

/**
 * @function getHookDependencies
 * @description Get dependency tree for a specific hook
 * @param hookName Name of the hook
 * @returns Array of dependency hook names
 */
export const getHookDependencies = (hookName: string): string[] => {
  const metadata = HOOK_METADATA[hookName as keyof typeof HOOK_METADATA];
  return metadata ? [...metadata.dependencies] : [];
};

// ==========================================
// 🔧 DEVELOPMENT UTILITIES
// ==========================================

/**
 * @function validateHookUsage
 * @description Validate proper hook usage in development
 * @param hookName Hook name to validate
 * @param context Current usage context
 * @returns Validation result
 */
export const validateHookUsage = (hookName: string, context?: any) => {
  const metadata = HOOK_METADATA[hookName as keyof typeof HOOK_METADATA];
  
  if (!metadata) {
    console.warn(`[AuthHooks] Unknown hook: ${hookName}`);
    return false;
  }

  // Check dependencies
  const missingDeps = metadata.dependencies.filter(_dep => {
    // In a real implementation, this would check if the dependency hook is properly initialized
    return false; // Simplified for demo
  });

  if (missingDeps.length > 0) {
    console.warn(`[AuthHooks] Missing dependencies for ${hookName}:`, missingDeps);
    return false;
  }

  // Warn about enterprise hooks in non-enterprise context
  if (metadata.enterprise && !context?.enterprise) {
    console.info(`[AuthHooks] Using enterprise hook ${hookName} - ensure proper licensing and setup`);
  }

  return true;
};

/**
 * @function debugHookState
 * @description Debug utility for hook state inspection
 * @param hookName Hook name to debug
 * @param hookReturn Hook return object
 */
export const debugHookState = (hookName: string, hookReturn: any) => {
  console.group(`[AuthHooks] ${hookName} State Debug`);
  console.log('Hook Return:', hookReturn);
  console.log('Loading State:', hookReturn.isLoading || false);
  console.log('Error State:', hookReturn.error || null);
  console.log('Metadata:', HOOK_METADATA[hookName as keyof typeof HOOK_METADATA]);
  console.groupEnd();
};

// ==========================================
// 📈 PERFORMANCE MONITORING
// ==========================================

/**
 * @function measureHookPerformance
 * @description Measure hook performance metrics
 * @param hookName Hook name to measure
 * @param operation Operation being performed
 * @returns Performance measurement function
 */
export const measureHookPerformance = (hookName: string, operation: string) => {
  const startTime = performance.now();
  
  return {
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`[AuthHooks] ${hookName}.${operation} took ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
};

// ==========================================
// 🎨 VERSION INFORMATION
// ==========================================

/**
 * @const AUTH_HOOKS_VERSION
 * @description Current version of the auth hooks ecosystem
 */
export const AUTH_HOOKS_VERSION = '3.0.0' as const;

/**
 * @const AUTH_HOOKS_INFO
 * @description Information about the auth hooks ecosystem
 */
export const AUTH_HOOKS_INFO = {
  version: AUTH_HOOKS_VERSION,
  totalHooks: Object.keys(HOOK_METADATA).length,
  enterpriseHooks: getEnterpriseHooks().length,
  lastUpdated: '2024-12-19',
  author: 'ReactNativeSkeleton Phase3 Team',
  description: 'Enterprise-grade Auth Hook Ecosystem',
  features: [
    'Comprehensive Authentication Management',
    'Advanced Security Features',
    'State Machine Flow Management',
    'Testing Infrastructure',
    'Performance Monitoring',
    'Enterprise-grade Architecture'
  ]
} as const;

/**
 * @function printAuthHooksInfo
 * @description Print auth hooks ecosystem information
 */
export const printAuthHooksInfo = () => {
  console.group('🚀 Auth Hooks Ecosystem Info');
  console.log(`Version: ${AUTH_HOOKS_INFO.version}`);
  console.log(`Total Hooks: ${AUTH_HOOKS_INFO.totalHooks}`);
  console.log(`Enterprise Hooks: ${AUTH_HOOKS_INFO.enterpriseHooks}`);
  console.log(`Last Updated: ${AUTH_HOOKS_INFO.lastUpdated}`);
  console.log('Features:', AUTH_HOOKS_INFO.features);
  console.groupEnd();
};

// ==========================================
// 🎯 DEFAULT EXPORTS
// ==========================================

/**
 * Default export with most commonly used hooks
 */
export default {
  // Most common hooks
  useAuth,
  useAuthSecurity,
  useAuthComposite,
  
  // Utilities
  createAuthHookSuite,
  printAuthHooksInfo,
  HOOK_METADATA,
  AUTH_HOOKS_INFO,
} as const; 