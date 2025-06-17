/**
 * 🎯 AUTH HOOKS INDEX - React Native 2025 Enterprise Standards
 * Export barrel for all authentication hooks with proper TypeScript definitions
 */

// ====================================================================================
// 🔍 CORE AUTH HOOKS - Clean Architecture Implementation
// ====================================================================================

// Primary Authentication Hook - Main entry point (with integrated Flow Management)
export { useAuth } from './use-auth.hook';
export type { UseAuthReturn } from './use-auth.hook';

// 🔧 FLOW HOOK INTEGRATED: use-auth-flow.hook.ts has been integrated into use-auth.hook.ts
// Flow management is now part of the main useAuth hook for better performance

// Password Management Hook
export { useAuthPassword } from './use-auth-password.hook';
export type { UseAuthPasswordReturn } from './use-auth-password.hook';

// Security & MFA Hook
export { useAuthSecurity } from './use-auth-security.hook';
export type { UseAuthSecurityReturn } from './use-auth-security.hook';

// Social Authentication Hook
export { useAuthSocial } from './use-auth-social.hook';
export type { UseAuthSocialReturn } from './use-auth-social.hook';

// ====================================================================================
// 🎨 TYPES & ENUMS EXPORT - From Auth Hook (Flow Types Integrated)
// ====================================================================================

export { AuthFlowState, AuthFlowType } from './use-auth.hook';
export type { LoginCredentials, RegisterData, FlowCapabilities } from './use-auth.hook';
export type { AuthFlowState as AuthFlowStep } from './use-auth.hook';

// ====================================================================================
// 🔧 LEGACY TYPES REMOVED
// ====================================================================================
// The following types have been removed as part of cleanup:
// - AuthValidationError (replaced with standard Error handling)
// - BiometricCapability (moved to auth-security.hook.ts)
// - BiometricSettings (moved to auth-security.hook.ts)
// - PasswordStrengthLevel (moved to auth-password.hook.ts)
// - SecuritySettings (moved to auth-security.hook.ts)
// - SessionInfo (moved to core auth types)
// - LoginMethod (simplified to string literals)
// - MFAType (moved to auth-security.hook.ts)
// - AuthTokens (moved to core auth types)
// - UserRole (moved to user entity)
// - AuthProvider (simplified)
// - SocialProvider (moved to auth-social.hook.ts)
// - DeviceInfo (moved to core device service)
// - SessionSettings (moved to core auth types)
// - SecurityEvent (moved to audit service)
// - AuditLogEntry (moved to audit service)
// - ComplianceSettings (moved to compliance service)
// - AuthMetrics (moved to analytics service)

// ====================================================================================
// 📋 AVAILABLE HOOKS SUMMARY
// ====================================================================================
/*
✅ useAuth - Main authentication hook with login/logout/register + Flow Management (INTEGRATED)
✅ useAuthPassword - Password reset, strength validation, etc.
✅ useAuthSecurity - MFA, biometric, security settings
✅ useAuthSocial - Google, Facebook, Apple authentication

🗑️ REMOVED HOOKS (Cleanup completed):
❌ useAuthFlow - INTEGRATED into useAuth (434 lines eliminated)
❌ useAuthComposite - Deleted (was demo/over-engineering)
❌ useAuthTesting - Deleted (was demo/testing only)
*/